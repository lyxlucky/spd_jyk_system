<template>
  <div class="ele-body um-users-page">
    <el-card shadow="never">
      <div class="section-title">用户管理</div>
      <el-form :inline="true" size="mini" class="filter-form" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="where.username" placeholder="用户账号或姓名" clearable @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="where.dept" placeholder="所属科室" clearable @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="where.sup" placeholder="供应商" clearable @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="where.qx" placeholder="权限组" clearable @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
        <el-form-item class="action-right">
          <el-button v-permission="'export-UMUsers-yhdc'" type="primary" plain :loading="exporting" @click="handleExport">导出</el-button>
          <el-button type="success" @click="addVisible = true">新增用户</el-button>
          <el-button v-if="showBdrmEmployeeSearch" @click="employeeVisible = true">查询用户</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        size="mini"
        height="calc(100vh - 260px)"
        :columns="columns"
        :datasource="datasource"
        :row-style="rowStyle"
        cache-key="umUsersTable"
      >
        <template v-slot:nickname="{ row }">
          <span :class="{ 'text-frozen': String(row.Is_Delete) === '0' }">{{ formatNickname(row) }}</span>
        </template>
        <template v-slot:deptNames="{ row }">{{ formatDeptNames(row.userDept) }}</template>
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openPassword(row)">修改密码</el-button>
          <el-button type="text" size="mini" @click="openEdit(row)">编辑资料</el-button>
          <el-button type="text" size="mini" @click="openGroup(row)">分配权限组</el-button>
          <el-button type="text" size="mini" @click="openGroupAuth(row)">分配组内权限</el-button>
          <el-button type="text" size="mini" @click="openDept(row)">分配科室</el-button>
          <el-button type="text" size="mini" @click="openVarType(row)">分配耗材类别</el-button>
          <el-button type="text" size="mini" @click="openStorage(row)">分配院区</el-button>
          <el-button type="text" size="mini" @click="openDeptArea(row)">分配科室库区</el-button>
          <el-popconfirm title="确定删除此用户吗？" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <AddUserDialog :visible.sync="addVisible" @success="reload" />
    <EditUserDialog
      :visible.sync="editVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <PasswordDialog
      :visible.sync="passwordVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <GroupAssignDialog
      :visible.sync="groupVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      :default-group-id="currentUser?.Group_ID"
      @success="reload"
    />
    <GroupAuthDialog
      :visible.sync="groupAuthVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      :group-id="currentUser?.Group_ID"
      @success="reload"
    />
    <DeptAssignDialog
      :visible.sync="deptVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <VarTypeDialog
      :visible.sync="varTypeVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <StorageAssignDialog
      :visible.sync="storageVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <DeptAreaDialog
      :visible.sync="deptAreaVisible"
      :user-id="currentUser?.ID"
      :user-name="currentUser?.UserName"
      @success="reload"
    />
    <EmployeeSearchDialog :visible.sync="employeeVisible" />
  </div>
</template>

<script>
import AddUserDialog from './components/AddUserDialog.vue';
import EditUserDialog from './components/EditUserDialog.vue';
import PasswordDialog from './components/PasswordDialog.vue';
import GroupAssignDialog from './components/GroupAssignDialog.vue';
import GroupAuthDialog from './components/GroupAuthDialog.vue';
import DeptAssignDialog from './components/DeptAssignDialog.vue';
import VarTypeDialog from './components/VarTypeDialog.vue';
import StorageAssignDialog from './components/StorageAssignDialog.vue';
import DeptAreaDialog from './components/DeptAreaDialog.vue';
import EmployeeSearchDialog from './components/EmployeeSearchDialog.vue';
import { getUserList, delUserByID } from '@/api/UserManage/UMUsers';
import {
  exportUserExcel,
  formatDeptNames,
  formatNickname,
  showBdrmEmployeeSearch
} from './utils';

export default {
  name: 'UMUsers',
  components: {
    AddUserDialog,
    EditUserDialog,
    PasswordDialog,
    GroupAssignDialog,
    GroupAuthDialog,
    DeptAssignDialog,
    VarTypeDialog,
    StorageAssignDialog,
    DeptAreaDialog,
    EmployeeSearchDialog
  },
  data() {
    return {
      where: { username: '', dept: '', sup: '', qx: '' },
      exporting: false,
      currentUser: null,
      addVisible: false,
      editVisible: false,
      passwordVisible: false,
      groupVisible: false,
      groupAuthVisible: false,
      deptVisible: false,
      varTypeVisible: false,
      storageVisible: false,
      deptAreaVisible: false,
      employeeVisible: false,
      showBdrmEmployeeSearch,
      columns: [
        { label: '用户账号', prop: 'UserName', width: 120, sortable: true },
        { label: '姓名', width: 120, slot: 'nickname' },
        { label: '所属供应商', prop: 'Supplier_Name', minWidth: 140, showOverflowTooltip: true },
        { label: '权限组', prop: 'Group_Name', width: 120, showOverflowTooltip: true },
        { label: '所属科室', minWidth: 160, slot: 'deptNames', showOverflowTooltip: true },
        { label: '职位', prop: 'POSITION', width: 100, showOverflowTooltip: true },
        { label: '备注', prop: 'MARK', width: 100, showOverflowTooltip: true },
        { label: '最近登录时间', prop: 'UPDATE_TIME', width: 150 },
        { label: '最近登录IP', prop: 'CREATE_IP', width: 120 },
        { label: '操作', width: 520, fixed: 'right', slot: 'action' }
      ]
    };
  },
  methods: {
    formatNickname,
    formatDeptNames,
    rowStyle({ row }) {
      if (String(row.Is_Delete) === '0') {
        return { backgroundColor: '#e8f4ff' };
      }
      return {};
    },
    datasource({ page, limit }) {
      return getUserList(this.where, page, limit).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    setCurrent(row) {
      this.currentUser = row;
    },
    openEdit(row) {
      this.setCurrent(row);
      this.editVisible = true;
    },
    openPassword(row) {
      this.setCurrent(row);
      this.passwordVisible = true;
    },
    openGroup(row) {
      this.setCurrent(row);
      this.groupVisible = true;
    },
    openGroupAuth(row) {
      if (!row.Group_ID) {
        this.$message.warning('请先分配权限组');
        return;
      }
      this.setCurrent(row);
      this.groupAuthVisible = true;
    },
    openDept(row) {
      this.setCurrent(row);
      this.deptVisible = true;
    },
    openVarType(row) {
      this.setCurrent(row);
      this.varTypeVisible = true;
    },
    openStorage(row) {
      this.setCurrent(row);
      this.storageVisible = true;
    },
    openDeptArea(row) {
      this.setCurrent(row);
      this.deptAreaVisible = true;
    },
    async handleDelete(row) {
      try {
        const msg = await delUserByID(row.ID);
        this.$message.success(msg || '删除成功');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    },
    async handleExport() {
      this.exporting = true;
      try {
        const res = await getUserList(this.where, 1, 999999);
        if (!(res.result || []).length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        exportUserExcel(res.result);
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
.filter-form {
  margin-bottom: 8px;
}
.action-right {
  float: right;
}
.text-frozen {
  color: #409eff;
}
.text-danger {
  color: #f56c6c;
}
</style>
