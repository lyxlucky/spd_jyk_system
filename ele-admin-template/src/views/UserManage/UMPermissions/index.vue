<template>
  <div class="ele-body ump-page">
    <el-card shadow="never">
      <div class="section-title">权限管理</div>
      <div class="toolbar-row">
        <el-button size="mini" :loading="exporting" @click="handleExport">导出</el-button>
        <el-button type="success" size="mini" @click="addVisible = true">新增权限</el-button>
        <el-button type="primary" size="mini" plain @click="newAddVisible = true">树型新增权限</el-button>
      </div>

      <ele-pro-table
        ref="table"
        size="mini"
        height="calc(100vh - 220px)"
        :columns="columns"
        :datasource="datasource"
        :need-page="false"
        cache-key="umPermissionsTable"
      >
        <template v-slot:remarks="{ row }">
          <el-button type="text" size="mini" @click="openRemark(row)">
            {{ formatRemark(row.Remarks) }}
          </el-button>
        </template>
        <template v-slot:action="{ row }">
          <el-popconfirm title="确定删除此权限吗？" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <AddPermissionDialog :visible.sync="addVisible" @success="reload" />
    <NewAddPermissionDialog :visible.sync="newAddVisible" @success="reload" />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :permission-id="currentRow?.ID"
      :default-remark="currentRow?.Remarks"
      @success="reload"
    />
  </div>
</template>

<script>
import AddPermissionDialog from './components/AddPermissionDialog.vue';
import NewAddPermissionDialog from './components/NewAddPermissionDialog.vue';
import RemarkDialog from './components/RemarkDialog.vue';
import { delPermissionByID, getPermissionList } from '@/api/UserManage/UMPermissions';
import { exportPermissionExcel, formatRemark, isDeleteOk } from './utils';

export default {
  name: 'UMPermissions',
  components: {
    AddPermissionDialog,
    NewAddPermissionDialog,
    RemarkDialog
  },
  data() {
    return {
      addVisible: false,
      newAddVisible: false,
      remarkVisible: false,
      exporting: false,
      currentRow: null,
      columns: [
        { label: '权限名称', prop: 'Permission_Name', minWidth: 200, sortable: true },
        { label: '链接', prop: 'Permission_Url', minWidth: 240, showOverflowTooltip: true },
        { label: '备注', minWidth: 160, slot: 'remarks' },
        { label: '操作', width: 90, fixed: 'right', slot: 'action' }
      ]
    };
  },
  methods: {
    formatRemark,
    datasource() {
      return getPermissionList().then((res) => ({
        list: res.result || [],
        count: res.total || (res.result || []).length
      }));
    },
    reload() {
      this.$refs.table?.reload();
    },
    openRemark(row) {
      this.currentRow = row;
      this.remarkVisible = true;
    },
    async handleDelete(row) {
      try {
        const res = await delPermissionByID(row.ID);
        if (isDeleteOk(res)) {
          this.$message.success('删除权限成功');
          this.reload();
        } else {
          this.$message.warning('该权限存在权限组关联，无法删除');
        }
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    },
    async handleExport() {
      this.exporting = true;
      try {
        const res = await getPermissionList();
        if (!(res.result || []).length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        exportPermissionExcel(res.result);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
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
.toolbar-row .el-button + .el-button {
  margin-left: 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
