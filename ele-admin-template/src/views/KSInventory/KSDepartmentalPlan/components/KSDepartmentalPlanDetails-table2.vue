<template>
  <div class="ele-body" style="height:75vh">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <ele-pro-table ref="table" height="50vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
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
        <KSDepartmentalPlanDetails-search @search="reload" :KSDepartmentalPlanDataSearch='KSDepartmentalPlanDataSearch' :selection="selection" @showEditReoad="showEditReoad" :datasourceList="datasourceList" />

        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <template v-slot:State="{ row }">
        <el-tag v-if="row.State==0" type="success">新增</el-tag>
        <el-tag v-if="row.State==1" type="success">已提交</el-tag>
        <el-tag v-if="row.State==2" type="success">配送中</el-tag>
        <el-tag v-if="row.State==5" type="success">已审核</el-tag>
        <el-tag v-if="row.State==10" type="success">强制结束</el-tag>
        <el-tag v-if="(row.State==6 || row.State==4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty" type="success">已审批</el-tag>
        <el-tag v-if="(row.SUM_Left_Apply_Qty > 0 && row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty)" type="success">未收全</el-tag>
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
  </div>
</template>

<script>
import KSDepartmentalPlanDetailsSearch from './KSDepartmentalPlanDetails-search.vue';
import { SerachPlanList } from '@/api/KSInventory/KSDepartmentalPlan';
import { SerachPlanListDeta } from '@/api/KSInventory/KSDepartmentalPlan';
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
          width: 45,
          align: 'center',
          fixed: 'left'
        },
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
        {
          prop: 'VarCode',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'DEPT_ZDY_VARIETIE_CODE',
          label: '自定义编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            if (cellValue == null) {
              return '未定义';
            }
            return cellValue;
          }
        },
        {
          prop: 'CONTRACT_TYPE',
          label: '合同类型',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            if (cellValue == 2) {
              return '临采';
            } else if (cellValue == 1) {
              return '中标';
            } else {
              return '-';
            }
          }
        },
        {
          prop: 'VarName',
          label: '品种全称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'GG',
          label: '型号/规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Manufacturing',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '启用供应商',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TempQty',
          label: '模板/历史申领数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'StockQty',
          label: '散货库存',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TJ_QTY',
          label: '提交数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PlanQty',
          label: '实际申领数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Unit',
          label: '单位',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BigBoxCount',
          label: '大包装数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'MinBoxCount',
          label: '中包装数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PAG_TYPE',
          label: '包装规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Price',
          label: '结算价',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: '',
          label: '总金额',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return row.Price * row.PlanQty;
          }
        },
        {
          prop: '',
          label: '已收货数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return row.PlanQty - row.LEFT_APPLY_QTY;
          }
        },
        {
          prop: 'IS_NEED_TWO_APP',
          label: '二级审批',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            var IS_NEED_TWO_APP = '';
            var STATE = '';
            if (row.IS_NEED_TWO_APP == 0) {
              return '-';
            }
            if (row.IS_NEED_TWO_APP == 1) {
              IS_NEED_TWO_APP = '是';
            }
            if (row.SENCOND_APP_STATE == 0) {
              STATE = '未审批';
            }
            if (row.SENCOND_APP_STATE == 1) {
              STATE = '已审批';
            }
            return IS_NEED_TWO_APP + '/' + STATE;
          }
        },
        {
          prop: '备注',
          label: '包装规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ],
      toolbar: false,
      pageSize: 10,
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
      datasourceList: []
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
            count: res.total,
            list: res.result
          };
          this.datasourceList = res.result;
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
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
    },
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
  }
};
</script>
