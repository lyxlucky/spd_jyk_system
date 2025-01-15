yourFunctionName()

<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- @current-change="onCurrentChange" -->
    <!-- :toolkit="[]"  -->
    <ele-pro-table :paginationStyle=paginationStyle :key="key" highlight-current-row ref="table" 
      @current-change="onCurrentChange" height="25vh" 
      :rowClickChecked="true" :stripe="true"
      :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource"
      :selection.sync="selection" cache-key="DeptPlanDeclarationTopTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <DeptPlanDeclarationTopTableSearch ref="child" @submitItem="submitDeptPlanFormItems"
          @deleteItem="deleteDeptPlanFormItems" @submitDeptPlanForm="submitDeptPlanForm" :selection="selection"
          @search="reload" />
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
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import DeptPlanDeclarationTopTableSearch from './DeptPlanDeclarationTopTableSearch.vue';
import {
  getDeptPlanTableData,
  addDeptPlanTableDataItem,
  deleteDeptPlanTableDataItem,
  submitDeptPlanTableDataItem,
} from '@/api/KSInventory/DeptPlanDeclaration';
import Vue from 'vue';
export default {
  name: 'DeptPlanDeclarationTopTable',
  props: ['IsReload'],
  components: {
    DeptPlanDeclarationTopTableSearch
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
          prop: 'ID',
          label: '计划单号',
          minWidth: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'PLAN_MONTH_TIME',
          label: '计划月份',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'APPROVE_STATE',
          label: '审批状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          slot: 'APPROVE_STATE'
        },
        {
          prop: 'TYPE',
          label: '申报类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          slot: 'TYPE'
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'CREATE_MAN',
          label: '创建人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        }
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
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      key: 0,
      localBus:new Vue()
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getDeptPlanTableData({ page, limit, where, order }).then((res) => {
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
    submitDeptPlanForm(data) {
      addDeptPlanTableDataItem(data.createDeptPlanForm).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$refs.child.where.createDeptPlandialogVisible = false;
          this.reload();
        } else {
          this.$message.error(res.msg);
        }
      }).catch((error) => {
        this.$message.error(error);
      });
    },
    deleteDeptPlanFormItems(data) {
      this.$confirm('是否删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeptPlanTableDataItem(data).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.reload();
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    submitDeptPlanFormItems(data) {
      this.$confirm('是否提交选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitDeptPlanTableDataItem(data).then((res) => {
            this.$message.success(res.msg);
            this.reload();
            this.$bus.$emit("submitDeptPlanTableDataItem")
        }).catch(err=>{
          this.$message.error(err);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        });
      });
    },
    onCurrentChange(current) {
      this.current = current;
      this.$emit('getCurrent', current);
    },
  },
  watch: {
    IsReload() {
      if (this.IsReload == true) {
        this.reload(); // 调用刷新表格的方法
      }
    },
    selection(){
      this.$emit("TopTableSelection",this.selection)
    }
  },
  created() {
    // this.getdatasource();
    // this.GetConsume();
  },
  mounted(){
    this.$bus.$on('handleCommand', (data) => {
      this.reload();
    });
  },
  beforeDestroy(){
    this.$bus.$off('handleCommand')
  },
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}
</style>