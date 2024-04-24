<!-- 扫码盘点弹窗 -->
<template>
  <div class="create-batch-data-modal">
    <ele-modal width="1200px" :destroy-on-close="true" :visible="visible" :close-on-click-modal="true"
      custom-class="ele-dialog-form" title="盘点汇总" @update:visible="updateVisible">
      <ele-pro-table height='50vh' highlight-current-row @current-change="onCurrentChange" ref="CreateBatchDataTable"
        :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns"
        :datasource="datasource" :selection.sync="selection" cache-key="CreateBatchDataModal">

        <!-- 搜索表单 -->
        <template v-slot:toolbar>
          <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="10" :md="12">
                <el-form-item label="">
                  <el-input v-model="where.VARIETIE_CODE_NEW" placeholder="请输入品种编码" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="5" :md="12">
                <div class="ele-form-actions">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
                    导出
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </template>

        <template v-slot:PC_PERCENT="{ row }">
          <el-tag size="small" v-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) >= 0.9" type="success">{{
            numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
          <el-tag size="small"
            v-else-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) >= 0.8 && parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) < 0.9"
            type="warning">{{ numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
          <el-tag size="small" v-else-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) < 0.8" type="danger">{{
            numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
          <el-tag size="small" v-else type="danger">{{ numberToPercent(0) }}</el-tag>
        </template>

        <!-- <template v-slot:PlanQty="{ row }">
          <el-input-number v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        </template>
        <template v-slot:VarCode="{ row }">
          <el-tag v-if="row.LEFT_APPLY_QTY == 0" type="success">{{ row.VarCode }}</el-tag>
          <el-tag v-else type="danger">{{ row.VarCode }}</el-tag>
        </template>
        <template v-slot:State="{ row }">
          <el-tag v-if="row.State == 0" type="success">新增</el-tag>
          <el-tag v-if="row.State == 1" type="success">已提交</el-tag>
          <el-tag v-if="row.State == 2" type="success">配送中</el-tag>
          <el-tag v-if="row.State == 5" type="success">已审核</el-tag>
          <el-tag v-if="row.State == 10" type="success">强制结束</el-tag>
          <el-tag v-if="(row.State == 6 || row.State == 4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty"
            type="success">已审批</el-tag>
          <el-tag v-if="(row.SUM_Left_Apply_Qty > 0 && row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty)"
            type="success">未收全</el-tag>
          <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag>
        </template> -->
      </ele-pro-table>
    </ele-modal>
  </div>
</template>

<script>
import { GetStockDataDelHz } from '@/api/KSInventory/StocktakingData';
import { numberToPercent } from '@/utils/number-percent';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'CreateBatchDataModal',
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    KSDepartmentalPlanData: Object
  },
  data() {
    const defaultForm = {
      VARIETIE_CODE_NEW: ''
    };
    return {
      defaultForm,
      // 表单数据
      where: { ...defaultForm },
      toolbar: true,
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 30, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
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
          minWidth: 80
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'COUNT',
          label: '库存数量',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          sortable: true
        },
        {
          prop: 'PC_COUNT',
          label: '盘存数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },

        {
          slot: 'PC_PERCENT',
          label: '盘存率',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        // {
        //   prop: 'BATCH',
        //   label: '生产批号',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   width: 110,
        //   show: false
        // },
        // {
        //   prop: 'BATCH_PRODUCTION_DATE',
        //   label: '生产日期',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120,
        //   formatter: (_row, _column, cellValue) => {
        //     return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
        //   }
        // },
        // {
        //   prop: 'BATCH_VALIDITY_PERIOD',
        //   slot: 'BATCH_VALIDITY_PERIOD',
        //   label: '有效到期',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 150,
        //   formatter: (_row, _column, cellValue) => {
        //     return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
        //   }
        // },
        // {
        //   prop: 'SUPPLIER_NAME',
        //   label: '供应商名称',
        //   // // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 150
        // },
        // {
        //   prop: 'APPROVAL_NUMBER',
        //   label: '注册证号',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110
        // },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },

        {
          prop: 'DEPT_TWO_NAME',
          label: '科室',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ]
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.GENERATE_DATE = this.KSDepartmentalPlanData.GENERATE_DATE;
      where.DEPT_TWO_CODE = this.KSDepartmentalPlanData.DEPT_TWO_CODE;
      where.VARIETIE_CODE_NEW = this.where.VARIETIE_CODE_NEW;
      let data = GetStockDataDelHz({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        }
      );
      return data;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.CreateBatchDataTable.reload({ page: 1, where: where });
    },
    onSelectionChange(selection) {
      this.selection = selection;
      console.log(selection);
    },
    onCurrentChange(current) {
      this.current = current;
      this.$emit('getCurrent', current);
    },
    search() {
      this.reload();
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.CreateBatchDataTable.doRequest(({ where, order }) => {
        where = data;
        where.GENERATE_DATE = this.KSDepartmentalPlanData.GENERATE_DATE;
        where.DEPT_TWO_CODE = this.KSDepartmentalPlanData.DEPT_TWO_CODE;
        where.VARIETIE_CODE_NEW = this.where.VARIETIE_CODE_NEW;
        GetStockDataDelHz({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            if (Array.isArray(res.result) && res.result.length == 0) {
              loading.close();
              return this.$message.error('无数据导出');
            }
            // 格式化成json数据，按照科室分组
            // {科室名字:[data]}
            const groupedData = res.result.reduce((acc, obj) => {
              const key = obj.DEPT_TWO_NAME;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
            }, {});
            let SheetsTable = {};
            let SheetsName = [];
            Object.entries(groupedData).forEach(([k, v]) => {
              const array = [
                [
                  '生成日期',
                  '生成人',
                  '品种编码',
                  '品种名称',
                  '规格型号',
                  '生产企业',
                  '库存数量',
                  '盘存数量',
                  '盘存率',
                  '计费编码',
                ]
              ];
              v.forEach((d) => {
                array.push([
                  d.GENERATE_DATE,
                  d.GENERATE_MAN,
                  d.VARIETIE_CODE_NEW,
                  d.VARIETIE_NAME,
                  d.SPECIFICATION_OR_TYPE,
                  d.MANUFACTURING_ENT_NAME,
                  d.COUNT,
                  d.PC_COUNT,
                  numberToPercent((d.PC_COUNT == 0 && d.COUNT == 0) ? 0 : d.PC_COUNT / d.COUNT),
                  d.CHARGING_CODE,
                ]);
              });
              const sheet = utils.aoa_to_sheet(array);
              SheetsName.push(k);
              SheetsTable[k] = sheet;
            })

            const workbook = {
              SheetNames: SheetsName,
              Sheets: SheetsTable
            }
            writeFile(workbook, '盘点数据导出.xlsx');
            loading.close();

            // writeFile(
            //   {
            //     SheetNames: ['Sheet1'],
            //     Sheets: {
            //       Sheet1: utils.aoa_to_sheet(array)
            //     }
            //   },
            //   '盘点汇总数据.xlsx'
            // );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    numberToPercent
  },
  watch: {},
  created() {
  },
  mounted() { },
  beforeDestroy() { }
};
</script>
