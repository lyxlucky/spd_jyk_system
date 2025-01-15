yourFunctionName()

<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- @current-change="onCurrentChange" -->
    <ele-pro-table :paginationStyle=paginationStyle :key="key" highlight-current-row ref="table" @current-change="onCurrentChange" height="30vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="DeptDeclarAndApprovalTopTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <DeptDeclarAndApprovalTopTableSearch ref="child" @reload="reload" :selection="selection" style="margin-bottom: 0px;" />
      </template>

      <!-- 审批状态 -->
      <template v-slot:APPROVE_STATE="{ row }">
        <el-tag v-if="row.APPROVE_STATE == 0" type="primary">新增</el-tag>
        <el-tag v-else-if="row.APPROVE_STATE == 1" type="success">已提交</el-tag>
        <el-tag v-else-if="row.APPROVE_STATE == 2" type="primary">已审核</el-tag>
        <el-tag v-else-if="row.APPROVE_STATE == 3" type="primary">已审批</el-tag>
        <el-tag v-else-if="row.APPROVE_STATE == 4" type="warning">审核不通过</el-tag>
        <el-tag v-else-if="row.APPROVE_STATE == 5" type="warning">审批不通过</el-tag>
      </template>

      <!-- 类型 -->
      <template v-slot:TYPE="{ row }">
        <el-tag v-if="row.TYPE == 1" type="info">正常申报</el-tag>
        <el-tag v-else-if="row.TYPE == 2" type="info">补充申报</el-tag>
        <el-tag v-else type="info">未申报</el-tag>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import DeptDeclarAndApprovalTopTableSearch from '@/views/KSInventory/DeptDeclarAndApproval/components/DeptDeclarAndApprovalTopTableSearch';
import {
  getDeptPlanDecList,
  getDeptPlanDecListInArray
} from '@/api/KSInventory/DeptDeclarAndApproval';
export default {
  name: 'DeptDeclarAndApprovalTopTable',
  props: ['IsReload'],
  components: {
    DeptDeclarAndApprovalTopTableSearch
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
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          minWidth: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PLAN_MONTH_TIME',
          label: '计划月份',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70,
          formatter(row, column, cellValue, index) {
            if (cellValue != null) {
              return cellValue.substring(0, 7);
            } else {
              return '';
            }
          }
        },
        {
          prop: 'CREATE_MAN',
          label: '创建人',
          align: 'center',
          showOverflowTooltip: true
        },
        // todo
        {
          prop: 'APPROVE_STATE',
          label: '审批状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          slot: 'APPROVE_STATE'
        },
        //todo
        {
          prop: 'TYPE',
          label: '申报类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          slot: 'TYPE'
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'ID',
          label: '计划单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        }
        // {
        //   prop: 'Dept_One_Code',
        //   label: '计划单号',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 70
        // }
      ],
      paginationStyle: {
        height: '18px',
        padding: '0px 0px 5px 0px',
        'margin-top': '-5px'
      },
      toolbar: false,
      pageSize: 10,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      data: [],
      key: 0
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getDeptPlanDecListInArray({ page, limit, where, order }).then(
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
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    onCurrentChange(current) {
      this.current = current;
      this.$emit('getCurrent', current);
    }
  },
  watch: {
    IsReload() {
      if (this.IsReload == true) {
        this.reload(); // 调用刷新表格的方法
      }
    },
    selection() {
      this.$emit('TopTableSelection', this.selection);
    }
  },
  mounted() {
    this.$bus.$on('submitDeptPlanTableDataItem', (data) => {
      this.reload();
    });
  },
  beforeDestroy() {
    this.$bus.$off('submitDeptPlanTableDataItem');
  },

  created() {}
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}

::v-deep .ele-table-tool-default {
  padding: 3px 0px 0px 5px;
}

::v-deep .ele-table-tool .ele-table-tool-title{
  margin-bottom: 0;
  margin-top: 0;
}
</style>