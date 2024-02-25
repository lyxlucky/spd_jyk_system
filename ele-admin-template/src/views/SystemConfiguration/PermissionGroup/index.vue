<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="UMUsersTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="addPermision()">
            新增权限组
          </el-button>
        </template>

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-button type="primary" icon="" class="ele-btn-icon" @click="assignPermissions(row)">
            分配权限
          </el-button>

          <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-button type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 添加权限弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <permission-list :visible.sync="showPermission" :data="rowData" @done="reload" />
  </div>
</template>

<script>
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import PermissionList from './components/permission-list.vue';

import {
  removeUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import {
  getGroupsList,
  DelGroupByID
} from '@/api/SystemConfiguration/PermissionGroup';
export default {
  name: 'PermissionGroup',
  components: {
    UserEdit,
    PermissionList
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
        {
          prop: 'Group_Name',
          label: '权限组',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 300
        },
        {
          columnKey: 'action',
          label: '操作',
          minWidth: 300,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: false
        }
      ],
      toolbar: false,
      pageSize: 15,
      pageSizes: [15, 30, 50, 100, 9999999],
      count: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showPermission: false,
      // datasource: [],
      data: [],
      // 选中框数据源
      rowData:null
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getGroupsList({ page, limit, where, order }).then((res) => {
        var data2 = {};
        data2.list = res.result;
        data2.count = res.total;
        return data2;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    // 打开添加权限弹窗
    addPermision() {
      this.showEdit = true;
    },
    // 打开分配权限弹窗
    assignPermissions(row){
      this.rowData = row;
      this.showPermission = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      DelGroupByID(row.ID)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
          this.reload();
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的用户吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          removeUsers(this.selection.map((d) => d.userId))
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
              this.reload();
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 重置用户密码 */
    resetPsw(row) {
      this.$confirm('确定要重置此用户的密码为"123456"吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          updateUserPassword(row.userId)
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({ lock: true });
      updateUserStatus(row.userId, row.status)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
        })
        .catch((e) => {
          loading.close();
          row.status = !row.status ? 1 : 0;
          this.$message.error(e.message);
        });
    },
  },
  created() {
    console.log(this.$store.state.user);
  }
};
</script>
