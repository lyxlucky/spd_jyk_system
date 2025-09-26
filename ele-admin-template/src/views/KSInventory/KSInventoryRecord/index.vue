<template>
  <div class="ele-body">
    <el-card shadown="never">
      <label>
        出库数:<b>{{ SumCount2 }}</b>
        出库金额:<b>{{ CKSumAmount }}</b>
        入库数: <b>{{ SumCount1 }}</b>
        入库金额: <b>{{ RKSumAmount }}</b>
        净入库:<b>{{ netExport }}</b>
        合计金额:<b>{{ SumAmount }}</b>
      </label>
      <KSDepartmentalPlanDetails-search @exportData="exportData" @search="reload" :KSDepartmentalPlanDataSearch="KSDepartmentalPlanDataSearch" :selection="selection" @showEditReoad="showEditReoad" :datasourceList="datasourceList" />
      <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
      <!-- 数据表格 -->
      <ele-pro-table ref="table" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
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
          <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
        </template>

        <template v-slot:PlanQty="{ row }">
          <el-input-number v-model="row.PlanQty" :min="0" :max="9999" :step="1" size="mini" />
          <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
        </template>
        <template v-slot:State="{ row }">
          <el-tag v-if="row.State == 0" type="success">新增</el-tag>
          <el-tag v-if="row.State == 1" type="success">已提交</el-tag>
          <el-tag v-if="row.State == 2" type="success">配送中</el-tag>
          <el-tag v-if="row.State == 5" type="success">已审核</el-tag>
          <el-tag v-if="row.State == 10" type="success">强制结束</el-tag>
          <el-tag v-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          " type="success">已审批</el-tag>
          <el-tag v-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          " type="success">未收全</el-tag>
          <el-tag v-if="row.SUM_Left_Apply_Qty == 0" type="success">已收全</el-tag>
          <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
        </template>

        <template v-slot:RECORD_TYPE="{ row }">
          <el-tag v-if="row.RECORD_TYPE == 0" type="info">入库</el-tag>
          <el-tag v-if="row.RECORD_TYPE == 1" type="info">消耗</el-tag>
          <el-tag v-if="row.RECORD_TYPE == 2" type="success">退库</el-tag>
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
    </el-card>
  </div>
</template>

<script>
import KSDepartmentalPlanDetailsSearch from './components/KSDepartmentalPlanDetails-search';
import { SerachPlanList } from '@/api/KSInventory/KSDepartmentalPlan';
import {
  GetJykDetailShelf,
  GetJykDetailShelfNew
} from '@/api/KSInventory/KSInventoryQuery';
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
        // {
        //   columnKey: 'selection',
        //   type: 'selection',
        //   width: 60,
        //   align: 'center',
        //   fixed: 'left'
        // },
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 80,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'right'
        // },
        // {
        //   prop: 'ID',
        //   label: 'ID',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        //   show: false
        // },
        {
          prop: 'VARIETIE_CODE',
          label: '品种ID',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          slot: 'RECORD_TYPE',
          // prop: 'RECORD_TYPE',
          label: '类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
          // formatter: (_row, _column, cellValue) => {
          //   var type = '';
          //   if (cellValue == 1) {
          //     type = '申领入库';
          //   } else if (cellValue == 2) {
          //     type = '定数包入库';
          //   } else if (cellValue == 3) {
          //     type = '定数包消耗';
          //   } else if (cellValue == 4) {
          //     type = '定数包退货';
          //   } else if (cellValue == 5) {
          //     type = '散货出库';
          //   }
          //   return type;
          // }
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 250
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'COUNT',
          label: '数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PRICE',
          label: '价格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (_row, _column, cellValue) => {
            return Number(cellValue).toFixed(2);
          }
        },
        {
          prop: 'BATCH',
          label: '批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BATCH_ID',
          label: '批号ID',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        {
          prop: 'RECORD_TIME',
          label: '时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'OPERATOR',
          label: '操作人',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'DELIVERY_NUMBER',
          label: '单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            console.log(row)
            if (row.OPERATOR == 'HIS计费' && row.COUNT > 0  ) {
              return '入库';
            } else if (row.OPERATOR == 'HIS计费' && row.COUNT < 0) {
              return '消耗';
            } else {
              return cellValue;
            }
          }
        },

        {
          prop: 'DEF_NO_PKG_CODE',
          label: '定数码',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },

        {
          prop: 'SUPPLIER_CODE',
          label: '供应商编码',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          show: false
        },
        // {
        //   prop: 'DEPT_TWO_CODE',
        //   label: '科室编码',
        //
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110
        // },

        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PATIENT_NUMBER',
          label: '病患号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'HOSPITALIZATION_NUMBER',
          label: '住院号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'HOSPITALIZATION_NUMBER',
          label: '病人名字',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },

      ],
      toolbar: false,
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
      datasourceList: [],
      SumCount1: 0,
      SumCount2: 0,
      SumAmount: 0,
      CKSumAmount: 0,
      RKSumAmount: 0,
      netExport: 0
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      // var Dept_Two_CodeStr = '';
      // var userDeptList = this.$store.state.user.info.userDept;
      // //多部门
      // for (let i = 0; i < userDeptList.length; i++) {
      //   Dept_Two_CodeStr = Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      // }
      //单部门
      let currentDeptCode =
        this.$store.state.user.info.DeptNow.Dept_Two_Code + ',';
      where.DeptCode = currentDeptCode;
      let data = GetJykDetailShelfNew({ page, limit, where, order }).then(
        (res) => {
          var price = 0;
          var tData = {
            count: res.total,
            list: res.result
          };
          // for (let i = 0; i < res.result.length; i++) {
          //   this.SumAmount +=
          //     (res.result[i].COUNT * res.result[i].PRICE * 100) / 100;

          //   if (
          //     res.result[i].COUNT > 0 &&
          //     res.result[i].OPERATOR == 'HIS计费'
          //   ) {
          //     this.RKSumAmount +=
          //       (res.result[i].COUNT * res.result[i].PRICE * 100) / 100;
          //   }
          //   if (
          //     res.result[i].COUNT < 0 &&
          //     res.result[i].OPERATOR == 'HIS计费'
          //   ) {
          //     this.CKSumAmount +=
          //       (res.result[i].COUNT * res.result[i].PRICE * 100) / 100;
          //   }
          // }
          this.RKSumAmount = res.rkTotalPrice,
          this.CKSumAmount = res.ckTotalPrice;
          this.SumAmount = Number(res.rkTotalPrice) + Number(res.ckTotalPrice);
          this.datasourceList = res.result;
          this.SumCount1 = Math.abs(res.SumCount1);
          this.SumCount2 = Math.abs(res.SumCount2);
          this.netExport = res.SumCount1 + res.SumCount2;

          this.SumAmount = this.SumAmount.toFixed(2);
          this.RKSumAmount = this.RKSumAmount.toFixed(2);
          this.CKSumAmount = this.CKSumAmount.toFixed(2);
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    getTextForRecordType(recordType) {
      switch (recordType) {
        case '0':
          return '库存初始化';
        case '1':
          return '申领入库';
        case '2':
          return '已入库';
        case '3':
          return '已出库';
        case '4':
          return '定数包退货';
        case '5':
          return '散货出库';
        case '6':
          return 'his计费';
        default:
          return '';
      }
    },

    exportData() {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        let currentDeptCode =
          this.$store.state.user.info.DeptNow.Dept_Two_Code + ',';
        where.DeptCode = currentDeptCode;
        GetJykDetailShelfNew({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种ID',
                '类型',
                '科室名称',
                '品种编码',
                '品种名称',
                '规格型号',
                '数量',
                '单位',
                '价格',
                '批号',
                '批号ID',
                '生产日期',
                '有效到期',
                '生产企业',
                '时间',
                '操作人',
                '单号',
                '定数码',
                '注册证号',
                '供应商编码',
                '供应商名称',
                '计费编码',
                '病患号',
                '住院号'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.VARIETIE_CODE,
                this.getTextForRecordType(d.RECORD_TYPE),
                d.DEPT_TWO_NAME,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME,
                d.SPECIFICATION_OR_TYPE,
                d.COUNT,
                d.UNIT,
                d.PRICE,
                d.BATCH,
                d.BATCH_ID,
                d.BATCH_PRODUCTION_DATE,
                d.BATCH_VALIDITY_PERIOD,
                d.MANUFACTURING_ENT_NAME,
                d.RECORD_TIME,
                d.OPERATOR,
                d.DELIVERY_NUMBER,
                d.DEF_NO_PKG_CODE,
                d.APPROVAL_NUMBER,
                d.SUPPLIER_CODE,
                d.SUPPLIER_NAME,
                d.CHARGING_CODE,
                d.PATIENT_NUMBER,
                d.HOSPITALIZATION_NUMBER
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
              '库存详情.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    remove(row) {
      console.log(row);
    },
    onSelectionChange(selection) {
      this.selection = selection;
      // console.log(this.selection);
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    }
    // aaa() {
    //   this.reload();
    // }
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
  },
  mounted() {
    this.$bus.$on('handleCommand', (data) => {
      this.reload();
    });
  },
  destroyed() {
    this.$bus.$off('handleCommand');
  }
};
</script>

<style scoped>
/* 多选框 */
::v-deep span.el-checkbox__inner {
  height: 20px;
  width: 20px;
}
</style>
