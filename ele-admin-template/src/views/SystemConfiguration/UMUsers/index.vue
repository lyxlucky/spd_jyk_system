<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="UMUsersTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            新增用户
          </el-button>
        </template>

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改密码
          </el-link>
          <el-link type="primary" :underline="false" icon="el-icon-key" @click="resetPsw(row)">
            重置密码
          </el-link>
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
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <user-import :visible.sync="showImport" @done="reload" />
  </div>
</template>

<script>
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import UserImport from './components/user-import.vue';

import {
  pageUsers,
  removeUser,
  removeUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import { getUserList, DelUserByID } from '@/api/SystemConfiguration/UMUsers';
export default {
  name: 'UMUsers',
  components: {
    UserSearch,
    UserEdit,
    UserImport
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
          prop: 'UserName',
          label: '用户账号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Nickname',
          label: '姓名',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Supplier_Name',
          label: '所属供应商',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Group_Name',
          label: '权限组',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'userDept',
          label: '所属科室',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 300,
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
      showImport: false,
      // datasource: [],
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getUserList({ page, limit, where, order }).then((res) => {
        for (let j = 0; j < res.result.length; j++) {
          var userDepts = '';
          if (res.result[j].userDept) {
            for (let i = 0; i < res.result[j].userDept.length; i++) {
              userDepts += res.result[j].userDept[i].Dept_Two_Name;
              userDepts += ' ,';
            }
            userDepts = userDepts.substring(0, userDepts.length - 1);
          }
          res.result[j].userDept = userDepts;
        }
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
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      DelUserByID(row.ID)
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
    }
  },
  created() {
    // console.log(this.$store.state.user);
    // this.getdatasource();
  }
};
</script>
