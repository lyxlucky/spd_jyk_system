<template>
  <div class="ele-body umg-page">
    <el-card shadow="never">
      <div class="section-title">权限组管理</div>
      <div class="toolbar-row">
        <el-button type="success" size="mini" @click="addVisible = true">新增权限组</el-button>
      </div>

      <ele-pro-table
        ref="table"
        size="mini"
        height="calc(100vh - 220px)"
        :columns="columns"
        :datasource="datasource"
        :need-page="false"
        cache-key="umGroupsTable"
      >
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openAssign(row)">分配权限</el-button>
          <el-button type="text" size="mini" @click="openNewAssign(row)">新分配权限</el-button>
          <el-popconfirm title="确定删除此权限组吗？" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <AddGroupDialog :visible.sync="addVisible" @success="reload" />
    <AssignPermissionDialog
      :visible.sync="assignVisible"
      :group-id="currentGroup?.ID"
      :group-name="currentGroup?.Group_Name"
      @success="reload"
    />
    <NewAssignPermissionDialog
      :visible.sync="newAssignVisible"
      :group-id="currentGroup?.ID"
      :group-name="currentGroup?.Group_Name"
      @success="reload"
    />
  </div>
</template>

<script>
import AddGroupDialog from './components/AddGroupDialog.vue';
import AssignPermissionDialog from './components/AssignPermissionDialog.vue';
import NewAssignPermissionDialog from './components/NewAssignPermissionDialog.vue';
import { delGroupByID, getGroupsList } from '@/api/UserManage/UMGroups';

export default {
  name: 'UMGroups',
  components: {
    AddGroupDialog,
    AssignPermissionDialog,
    NewAssignPermissionDialog
  },
  data() {
    return {
      addVisible: false,
      assignVisible: false,
      newAssignVisible: false,
      currentGroup: null,
      columns: [
        { label: '权限组名称', prop: 'Group_Name', minWidth: 240, sortable: true },
        { label: '操作', width: 260, fixed: 'right', slot: 'action' }
      ]
    };
  },
  methods: {
    datasource() {
      return getGroupsList().then((res) => ({
        list: res.result || [],
        count: res.total || (res.result || []).length
      }));
    },
    reload() {
      this.$refs.table?.reload();
    },
    setCurrent(row) {
      this.currentGroup = row;
    },
    openAssign(row) {
      this.setCurrent(row);
      this.assignVisible = true;
    },
    openNewAssign(row) {
      this.setCurrent(row);
      this.newAssignVisible = true;
    },
    async handleDelete(row) {
      try {
        const msg = await delGroupByID(row.ID);
        this.$message.success(msg || '删除成功');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}
.toolbar-row {
  margin-bottom: 8px;
  text-align: right;
}
.text-danger {
  color: #f56c6c;
}
</style>
