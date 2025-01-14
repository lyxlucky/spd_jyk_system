<template>
  <div class="ele-body">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <ele-pro-table :paginationStyle=paginationStyle ref="table" :initLoad="false" :toolStyle="toolStyle" height="43vh" highlight-current-row :stripe="true" :rowClickChecked="true" :rowClickCheckedIntelligent="false" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="StocktakingDataDetailsTabel">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <!-- @ClickReload="ClickReload"  -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <StocktakingDataDetailsSearch @exportData="exportData" @search="reload" @showEditReoad="showEditReoad" :KSDepartmentalPlanDataSearch='KSDepartmentalPlanDataSearch' :KSDepartmentalPlanData='KSDepartmentalPlanData' :selection="selection" :current="current" :datasourceList="datasourceList" @createBatchData="createBatchData" @scanItem="scanItem" />
      </template>

      <template v-slot:PlanQty="{ row }">
        <el-input-number v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
      </template>
      <template v-slot:VarCode="{ row }">
        <el-tag v-if="row.LEFT_APPLY_QTY == 0" type="success">{{ row.VarCode }}</el-tag>
        <el-tag v-else type="danger">{{ row.VarCode }}</el-tag>
      </template>
      <template v-slot:REMARK="{ row }">
        <el-link v-if="row.REMARK == null" type="info" @click="OpenUpApplyPlanBZBox(row.ID)">无</el-link>
        <el-tag v-else type="primary" @click="OpenUpApplyPlanBZBox(row.ID)">{{ row.REMARK }}</el-tag>
      </template>
      <template v-slot:State="{ row }">
        <el-tag v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag v-if="row.State == 1" type="success">已提交</el-tag>
        <el-tag v-if="row.State == 2" type="success">配送中</el-tag>
        <el-tag v-if="row.State == 5" type="success">已审核</el-tag>
        <el-tag v-if="row.State == 10" type="success">强制结束</el-tag>
        <el-tag v-if="(row.State == 6 || row.State == 4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty" type="success">已审批</el-tag>
        <el-tag v-if="(row.SUM_Left_Apply_Qty > 0 && row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty)" type="success">未收全</el-tag>
        <!-- <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag> -->
        <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag>
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>
      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>

      <template v-slot:STATE="{ row }">
        <el-tag v-if="row.STATE == 0" type="danger">缺失</el-tag>
        <el-tag v-if="row.STATE == 1" type="success">存在</el-tag>
        <el-tag v-if="row.STATE == 2" type="warning">盘溢</el-tag>
      </template>

      <template v-slot:DEF_NO_PKG_CODE="{ row }">
        <el-tag type="success">{{ row.DEF_NO_PKG_CODE }}</el-tag>
      </template>

    </ele-pro-table>
    <!-- 生成盘点数据 -->
    <createBatchDataModal :KSDepartmentalPlanData="KSDepartmentalPlanData" :visible.sync="createBatchDataModalVisible" />

    <!-- 扫码盘点 -->
    <scanTotal @closeModal="closeModal" :visible.sync="scanTotalVisible" :KSDepartmentalPlanData="KSDepartmentalPlanData" />

    <!-- <p style="display: flex;justify-content: flex-end;">实际申领数量合计: <b>{{sumNumber}}</b> 实际申领金额合计: <b>{{sumAount}}</b> </p> -->
  </div>
</template>

<script>
import StocktakingDataDetailsSearch from './StocktakingDataDetails-search.vue';
import createBatchDataModal from '@/views/KSInventory/StocktakingData/components/CreateBatchDataModal.vue';
import scanTotal from '@/views/KSInventory/StocktakingData/components/ScanTotal.vue';
import { utils, writeFile } from 'xlsx';
import { UpdateApplyPlanBZ } from '@/api/KSInventory/KSDepartmentalPlan';

import { GetStockDataDel } from '@/api/KSInventory/StocktakingData';
export default {
  name: 'StocktakingDataDetails',
  //'KSDepartmentalPlanData'
  props: [],
  components: {
    StocktakingDataDetailsSearch,
    createBatchDataModal,
    scanTotal
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          slot: 'STATE',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'GENERATE_DATE',
          label: '生成日期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
          // formatter: (_row, _column, cellValue) => {
          //   return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          // }
        },
        {
          // prop: 'VarCode',
          prop: 'GENERATE_MAN',
          label: '生成人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'DEF_NO_PKG_CODE',
          slot: 'DEF_NO_PKG_CODE',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 500
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'COUNT',
          label: '库存数量',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          sortable: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PRICE',
          label: '价格',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          sortable: true
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 110,
          show: false
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          slot: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          // // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ],
      paginationStyle: {
        height: '18px',
        padding: '0px 0px 5px 0px',
        'margin-top': '-5px'
      },
      toolbar: false,
      toolStyle: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      },
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      datasourceList: [],
      sumNumber: 0,
      sumAount: 0,
      createBatchDataModalVisible: false,
      scanTotalVisible: false,
      KSDepartmentalPlanData: {}
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.GENERATE_DATE = this.KSDepartmentalPlanData.GENERATE_DATE;
      where.DEPT_TWO_CODE = this.KSDepartmentalPlanData.DEPT_TWO_CODE;
      let data = GetStockDataDel({ page, limit, where, order }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    // ClickReload(IsReload) {
    //   this.$emit('IsReload', IsReload);
    // },
    remove(row) {
      console.log(row);
    },
    closeModal() {
      this.reload();
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          GENERATE_DATE: this.KSDepartmentalPlanData.GENERATE_DATE
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    OpenUpApplyPlanBZBox(ID) {
      this.$prompt('请输入备注信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern:
        //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          const loading = this.$messageLoading('备注提交中..');
          var data = {
            ID,
            REMARK: value
          };
          UpdateApplyPlanBZ(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '备注成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
            loading.close();
            this.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消备注'
          });
        });
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.GENERATE_DATE = this.KSDepartmentalPlanData.GENERATE_DATE;
        where.DEPT_TWO_CODE = this.KSDepartmentalPlanData.DEPT_TWO_CODE;
        GetStockDataDel({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '生成日期',
                '生成人',
                '品种编码',
                '品种名称',
                '规格型号',
                '生产企业',
                '库存数量',
                '单位',
                '价格',
                '生产批号',
                '生产日期',
                '有效到期',
                '供应商名称',
                '注册证号',
                '计费编码',
                '状态'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.GENERATE_DATE,
                d.GENERATE_MAN,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME,
                d.SPECIFICATION_OR_TYPE,
                d.MANUFACTURING_ENT_NAME,
                d.COUNT,
                d.UNIT,
                d.PRICE,
                d.BATCH,
                this.$util.toDateString(d.BATCH_PRODUCTION_DATE, 'yyyy-MM-dd'),
                this.$util.toDateString(d.BATCH_VALIDITY_PERIOD, 'yyyy-MM-dd'),
                d.SUPPLIER_NAME,
                d.APPROVAL_NUMBER,
                d.CHARGING_CODE,
                d.STATE == 0 ? '缺失' : d.STATE == 1 ? '存在' : '盘溢'
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '盘点数据.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    createBatchData() {
      this.createBatchDataModalVisible = true;
    },
    scanItem() {
      this.scanTotalVisible = true;
    }
  },
  computed: {
    KSDepartmentalPlanDataSearch() {
      return this.KSDepartmentalPlanData;
    }
  },
  watch: {
    // KSDepartmentalPlanDataSearch() {
    //   this.$forceUpdate();
    //   if (this.KSDepartmentalPlanData) {
    //     var where = {
    //       GENERATE_DATE: this.KSDepartmentalPlanData.GENERATE_DATE,
    //       DEPT_TWO_CODE: this.KSDepartmentalPlanData.DEPT_TWO_CODE
    //     };
    //   }
    //   this.$refs.table.reload({ page: 1, where: where });
    // }
  },
  mounted() {
    this.$bus.$on(`${this.$route.path}/TopTable/current`, (item) => {
      this.KSDepartmentalPlanData = item;
      if (this.KSDepartmentalPlanData) {
        var where = {
          GENERATE_DATE: this.KSDepartmentalPlanData.GENERATE_DATE,
          DEPT_TWO_CODE: this.KSDepartmentalPlanData.DEPT_TWO_CODE
        };
      }
      this.$refs.table.reload({ page: 1, where: where });
    });
  },
  beforeDestroy() {
    this.$bus.$off(`${this.$route.path}/TopTable/current`);
  },
  created() {
    // this.getdatasource();
  }
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}
</style>