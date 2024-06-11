<template>
  <div class="ele-body">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <ele-pro-table ref="table" :toolStyle="toolStyle" height="40vh" highlight-current-row :stripe="true" :rowClickChecked="true" :rowClickCheckedIntelligent="false" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <KSDepartmentalPlanDetails-search @exportData="exportData" @search="reload" @ClickReload="ClickReload" :KSDepartmentalPlanDataSearch='KSDepartmentalPlanDataSearch' :selection="selection" @showEditReoad="showEditReoad" :datasourceList="datasourceList" />
      </template>

      <template v-slot:PlanQty="{ row }">
        <el-input-number v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
      </template>
      <!-- <template v-slot:VarCode="{ row }">
        <el-tag v-if="row.LEFT_APPLY_QTY==0" type="success">{{row.VarCode}}</el-tag>
        <el-tag v-else type="danger">{{row.VarCode}}</el-tag>
      </template> -->
      <template v-slot:REMARK="{ row }">
        <el-link v-if="row.REMARK==null" type="info" @click="OpenUpApplyPlanBZBox(row.ID)">无</el-link>
        <el-tag v-else type="primary" @click="OpenUpApplyPlanBZBox(row.ID)">{{row.REMARK}}</el-tag>
      </template>
      <template v-slot:State="{ row }">
        <el-tag v-if="row.State==0" type="success">新增</el-tag>
        <el-tag v-if="row.State==1" type="success">已提交</el-tag>
        <el-tag v-if="row.State==2" type="success">配送中</el-tag>
        <el-tag v-if="row.State==5" type="success">已审核</el-tag>
        <el-tag v-if="row.State==10" type="success">强制结束</el-tag>
        <el-tag v-if="(row.State==6 || row.State==4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty" type="success">已审批</el-tag>
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
    </ele-pro-table>
    <!-- <p style="display: flex;justify-content: flex-end;">实际申领数量合计: <b>{{sumNumber}}</b> 实际申领金额合计: <b>{{sumAount}}</b> </p> -->
  </div>
</template>

<script>
import KSDepartmentalPlanDetailsSearch from './KSDepartmentalPlanDetails-search.vue';
import {
  SerachPlanListDeta,
  UpdateApplyPlanBZ
} from '@/api/KSInventory/KSDepartmentalPlan';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['KSDepartmentalPlanData'],
  // inject: ['reload'],
  components: {
    KSDepartmentalPlanDetailsSearch: KSDepartmentalPlanDetailsSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          Width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          columnKey: 'index',
          type: 'index',
          minWidth: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 120,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'right'
        },
        {
          prop: 'VarCode',
          // slot: 'VarCode',
          label: '医保耗材编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        // {
        //   prop: 'DEPT_ZDY_VARIETIE_CODE',
        //   label: '自定义编码',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120,
        //   show: false,
        //   formatter: (row, column, cellValue) => {
        //     if (cellValue == null) {
        //       return '未定义';
        //     }
        //     return cellValue;
        //   }
        // },
        {
          prop: 'CONTRACT_DATE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'CONTRACT_NUM',
          label: '耗材名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'Manufacturing',
          label: '注册证号',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'SUPPLIER_NAME',
          label: 'UDI码',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },

        {
          prop: 'Day_Consume_Qty',
          label: '收取金额（元）',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ],
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
      tabelData: [
        {
          VarCode: 'C2024020480002042540000005',
          CONTRACT_DATE: '1549852154',
          CONTRACT_NUM: 'LCP腓骨远端外侧锁定接骨板',
          GG: '-',
          Manufacturing:"国械注进20163011241",
          SUPPLIER_NAME:"0100763000586164172410061Q18610CPB9961",
          Day_Consume_Qty:"6582",
        },
        {
          VarCode: 'C2024031280002042540000005',
          CONTRACT_DATE: '78513852154',
          CONTRACT_NUM: '一次性使用负压吸引袋',
          GG: '-',
          Manufacturing:"国械注进23163351572",
          SUPPLIER_NAME:"0100763000586164172410061Q18610CPB9961",
          Day_Consume_Qty:"1520",
        },
        {
          VarCode: 'C2024051380002042540000005',
          CONTRACT_DATE: '4612852154',
          CONTRACT_NUM: 'PE手套（非无菌）',
          GG: '-',
          Manufacturing:"国械注进20135461857",
          SUPPLIER_NAME:"010076300058366yh2410061Q18610CPB9961",
          Day_Consume_Qty:"4642",
        },
        {
          VarCode: 'C2024041680002042540000005',
          CONTRACT_DATE: '10245852154',
          CONTRACT_NUM: '一次性利器盒',
          GG: '-',
          Manufacturing:"国械注进20126511342",
          SUPPLIER_NAME:"0100763000586fg24510061Q18610CPB9961",
          Day_Consume_Qty:"350",
        },
        {
          VarCode: 'C2024042980002042540000005',
          CONTRACT_DATE: '1523652154',
          CONTRACT_NUM: '医用棉签',
          GG: '-',
          Manufacturing:"国械注进20163011864",
          SUPPLIER_NAME:"01007630003465172410061Q18610CPB9961",
          Day_Consume_Qty:"890",
        },
        {
          VarCode: 'C2024021480002042540000005',
          CONTRACT_DATE: '13548752154',
          CONTRACT_NUM: '血压袖带',
          GG: '-',
          Manufacturing:"国械注进20163011845",
          SUPPLIER_NAME:"01007630003465172410061Q18610CPB9961",
          Day_Consume_Qty:"462",
        },
        {
          VarCode: 'C2024031480002042540000005',
          CONTRACT_DATE: '4587922154',
          CONTRACT_NUM: '一次性使用口腔护理包',
          GG: '-',
          Manufacturing:"国械注进20163011857",
          SUPPLIER_NAME:"01007630003465172410061Q18610CPB9961",
          Day_Consume_Qty:"581",
        },
        {
          VarCode: 'C2024031680002042540000005',
          CONTRACT_DATE: '84549852154',
          CONTRACT_NUM: '一次性使用负压吸引袋',
          GG: '-',
          Manufacturing:"国械注进20163011857",
          SUPPLIER_NAME:"01007630003465172410061Q18610CPB9961",
          Day_Consume_Qty:"853",
        },
      ]
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }
      where.DeptCode = Dept_Two_CodeStr;
      let data = SerachPlanListDeta({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count:8,
            list: this.tabelData
          };
          this.datasourceList = res.result;
          this.sumNumber = 15282;
          this.sumAount = 8;
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      where.PlanNum = this.KSDepartmentalPlanData.PlanNum;
      this.$refs.table.reload({ page: 1, where: where });
    },
    ClickReload(IsReload) {
      this.$emit('IsReload', IsReload);
    },
    remove(row) {
      console.log(row);
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
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
      console.log(data);
      const loading = this.$messageLoading('正在导出数据...');

      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }

      this.$refs.table.doRequest(({ where, order }) => {
        where.DeptCode = Dept_Two_CodeStr;
        where.SerachName = data.SerachName;
        SerachPlanListDeta({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种全称',
                '型号/规格',
                '生产企业名称',
                '申领数量',
                '单位',
                '结算价',
                '供应商名称'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.VarCode,
                d.VarName,
                d.GG,
                d.Manufacturing,
                d.PlanQty,
                d.Unit,
                d.Price,
                d.SUPPLIER_NAME
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室计划详情.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  computed: {
    KSDepartmentalPlanDataSearch() {
      return this.KSDepartmentalPlanData;
    }
  },
  watch: {
    KSDepartmentalPlanDataSearch() {
      this.$forceUpdate();
      if (this.KSDepartmentalPlanData) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
      }
      this.$refs.table.reload({ page: 1, where: where });
    }
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