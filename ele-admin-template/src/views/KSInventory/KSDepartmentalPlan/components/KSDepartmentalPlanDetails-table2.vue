<template>
  <div class="ele-body"  style="height:80vh" >
    <!-- 数据表格 -->
    <ele-pro-table ref="table" height="70vh" :stripe="true" :rowClickChecked="true" :pagerCount="pagerCount" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <KSDepartmentalPlanDetails-search @search="reload" />
        <!-- <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            新建
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch">
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
        <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import KSDepartmentalPlanDetailsSearch from './KSDepartmentalPlanDetails-search.vue';
import { SerachPlanList } from '@/api/KSInventory/KSDepartmentalPlan';
import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';
export default {
  name: 'KSDepartmentalPlanTable',
  components: {
    KSDepartmentalPlanDetailsSearch
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
        //   width: 220,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true
        // },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格/型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
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
          minWidth: 110,
        },
        {
          prop: 'Price',
          label: '中标价',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'VAR_CATEGORY',
          label: '品种类别',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'REAGENT_CONVERSION_RATIO',
          label: '换算比(试剂)',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'INSTRUMENT_REMARK',
          label: '仪器备注',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
      ],
      toolbar: false,
      pageSize: 5,
      pagerCount: 2,
      pageSizes: [5, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: []
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
      let data = getDeptAuthVarNew({ page, limit, where, order }).then((res) => {
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
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
