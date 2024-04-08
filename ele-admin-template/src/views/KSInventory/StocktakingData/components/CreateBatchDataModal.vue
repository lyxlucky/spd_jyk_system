<!-- 扫码盘点弹窗 -->
<template>
  <div class="create-batch-data-modal">
    <ele-modal width="1200px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form"
      title="盘点汇总" @update:visible="updateVisible">
      <ele-pro-table height='50vh' highlight-current-row @current-change="onCurrentChange" ref="CreateBatchDataTable"
        :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns"
        :datasource="datasource" :selection.sync="selection" cache-key="CreateBatchDataModal">

        <!-- 搜索表单 -->
        <template v-slot:toolbar>
          <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
            <el-row :gutter="10">
              <el-col :lg="10" :md="12">
                <el-form-item label="">
                  <el-input v-model="where.VARIETIE_CODE_NEW" placeholder="请输入品种名称/品种编码" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="5" :md="12">
                <div class="ele-form-actions">
                  <el-button type="primary" @click="search">查询</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </template>

        <template v-slot:PlanQty="{ row }">
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
        </template>
        <template v-slot:STATE="{ }">
          <!-- TODO -->
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>

<script>
import { GetStockDataDelHz } from '@/api/KSInventory/StocktakingData';
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
      VARIETIE_CODE_NEW: '',
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
          minWidth: 120,
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
          minWidth: 150
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'STATE',
          slot: 'STATE',
          label: '状态',
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
      let data = GetStockDataDelHz({ page, limit, where, order }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
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
    search(){
      this.reload()
    }
  },
  watch: {},
  created() { },
  mounted() { },
  beforeDestroy() { }
};
</script>
