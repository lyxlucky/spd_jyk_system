<template>
  <div class="ele-body spd-page ump-page">
    <el-card v-if="unlocked" shadow="never">
      <div class="section-title">权限管理</div>
      <div class="toolbar-row">
        <el-button size="mini" :loading="exporting" @click="handleExport">导出</el-button>
        <el-button type="success" size="mini" @click="addVisible = true">新增权限</el-button>
        <el-button type="primary" size="mini" plain @click="newAddVisible = true">树型新增权限</el-button>
        <el-button type="warning" size="mini" @click="openNewSysAdd">新系统新增权限</el-button>
      </div>

      <ele-pro-table
        ref="table"
        size="mini"
        height="calc(100vh - 220px)"
        :columns="columns"
        :datasource="datasource"
        :need-page="false"
        cache-key="umPermissionsTableV4"
        @sort-change="onNameSort"
      >
        <template v-slot:parentHeader>
          <span
            class="ump-sort-th"
            :class="sortState.Parent_Name"
            @click.stop="toggleSort('Parent_Name')"
          >
            父级菜单
            <span class="caret-wrapper">
              <i class="sort-caret ascending"></i>
              <i class="sort-caret descending"></i>
            </span>
          </span>
        </template>
        <template v-slot:sortHeader>
          <span
            class="ump-sort-th"
            :class="sortState.SORT"
            @click.stop="toggleSort('SORT')"
          >
            排序
            <span class="caret-wrapper">
              <i class="sort-caret ascending"></i>
              <i class="sort-caret descending"></i>
            </span>
          </span>
        </template>
        <template v-slot:sort="{ row }">
          <el-input
            v-model="row.SORT"
            size="mini"
            maxlength="6"
            class="sort-input"
            placeholder="越小越靠前"
            @focus="rememberSort(row)"
            @change="saveSort(row)"
          />
        </template>
        <template v-slot:remarks="{ row }">
          <el-button type="text" size="mini" @click="openRemark(row)">
            {{ formatRemark(row.Remarks) }}
          </el-button>
        </template>
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" class="action-edit" @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确定删除此权限吗？" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <AddPermissionDialog :visible.sync="addVisible" @success="reload" />
    <NewAddPermissionDialog :visible.sync="newAddVisible" @success="reload" />
    <AddNewSystemPermissionDialog :visible.sync="newSysAddVisible" @success="reload" />
    <AddNewSystemPermissionDialog
      :visible.sync="editVisible"
      :record="editRow"
      @success="reload"
    />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :permission-id="currentRow && currentRow.ID"
      :default-remark="currentRow && currentRow.Remarks"
      @success="reload"
    />

    <el-dialog
      title="系统配置密码"
      :visible.sync="pwdVisible"
      width="420px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      @opened="focusPwd"
    >
      <p class="config-password-tip">该页面可维护权限数据，进入前请输入密码。</p>
      <el-input
        ref="pwdInput"
        v-model="pwdDraft"
        size="small"
        show-password
        placeholder="请输入密码"
        autocomplete="new-password"
        @keyup.enter.native="confirmPwd"
      />
      <div slot="footer">
        <el-button size="small" @click="leavePage">取消</el-button>
        <el-button size="small" type="primary" @click="confirmPwd">进入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddPermissionDialog from './components/AddPermissionDialog.vue';
import NewAddPermissionDialog from './components/NewAddPermissionDialog.vue';
import AddNewSystemPermissionDialog from './components/AddNewSystemPermissionDialog.vue';
import RemarkDialog from './components/RemarkDialog.vue';
import {
  delPermissionByID,
  getPermissionList,
  getPrimaryRoutList,
  upPermissionSort
} from '@/api/UserManage/UMPermissions';
import { finishPageTab } from '@/utils/page-tab-util';
import { exportPermissionExcel, formatRemark, formatPermissionType, isDeleteOk } from './utils';

const MANAGE_PASSWORD = '199411Abc';

export default {
  name: 'UMPermissions',
  components: {
    AddPermissionDialog,
    NewAddPermissionDialog,
    AddNewSystemPermissionDialog,
    RemarkDialog
  },
  data() {
    return {
      unlocked: false,
      pwdVisible: true,
      pwdDraft: '',
      addVisible: false,
      newAddVisible: false,
      newSysAddVisible: false,
      editVisible: false,
      editRow: null,
      remarkVisible: false,
      exporting: false,
      currentRow: null,
      sortDraft: {},
      sortState: {
        Parent_Name: null,
        SORT: null,
        Permission_Name: null
      },
      columns: [
        { label: '权限名称', prop: 'Permission_Name', minWidth: 200, sortable: true },
        { label: '链接', prop: 'Permission_Url', minWidth: 220, showOverflowTooltip: true },
        {
          label: '父级菜单',
          prop: 'Parent_Name',
          minWidth: 160,
          headerSlot: 'parentHeader',
          showOverflowTooltip: true,
          formatter: (row) => row.Parent_Name || ''
        },
        {
          label: '排序',
          prop: 'SORT',
          width: 130,
          slot: 'sort',
          headerSlot: 'sortHeader'
        },
        {
          label: '类型',
          width: 80,
          formatter: (row) => formatPermissionType(row.TYPE)
        },
        {
          label: 'Component',
          prop: 'COMPONENT',
          minWidth: 160,
          showOverflowTooltip: true,
          formatter: (row) => row.COMPONENT || ''
        },
        {
          label: '路由PATH',
          prop: 'PRIMARY_ROUT_URL',
          minWidth: 160,
          showOverflowTooltip: true,
          formatter: (row) => row.PRIMARY_ROUT_URL || ''
        },
        {
          label: '隐藏',
          width: 70,
          align: 'center',
          formatter: (row) => (Number(row.HIDE) === 1 ? '是' : '否')
        },
        { label: '备注', minWidth: 160, slot: 'remarks' },
        { label: '操作', width: 120, fixed: 'right', slot: 'action' }
      ]
    };
  },
  methods: {
    formatRemark,
    formatPermissionType,
    focusPwd() {
      this.$nextTick(() => {
        this.$refs.pwdInput?.focus?.();
      });
    },
    leavePage() {
      this.pwdVisible = false;
      this.unlocked = false;
      this.pwdDraft = '';
      this.$nextTick(() => {
        finishPageTab();
      });
    },
    confirmPwd() {
      const pwd = (this.pwdDraft || '').trim();
      if (pwd !== MANAGE_PASSWORD) {
        this.$message.error('密码不正确');
        return;
      }
      this.unlocked = true;
      this.pwdVisible = false;
      this.$nextTick(() => {
        this.reload();
      });
    },
    datasource() {
      if (!this.unlocked) {
        return Promise.resolve({ list: [], count: 0 });
      }
      return Promise.all([
        getPermissionList(),
        getPrimaryRoutList().catch(() => ({ result: [] }))
      ]).then(([res, routRes]) => {
        const list = this.applySort(this.fillParentName(res.result || [], routRes.result || []));
        return {
          list,
          count: res.total || list.length
        };
      });
    },
    fillParentName(list, routes) {
    const routeTitle = {};
      (routes || []).forEach((item) => {
        if (item && item.ID != null) {
          routeTitle[String(item.ID)] = item.TITLE || '';
        }
      });
      const permissionName = {};
      (list || []).forEach((item) => {
        if (item && item.ID != null) {
          permissionName[String(item.ID)] = item.Permission_Name || '';
        }
      });
      return (list || []).map((item) => {
        const routId = item.PRIMARY_ROUT_ID == null ? '' : String(item.PRIMARY_ROUT_ID).trim();
        const pid = item.PID == null ? '' : String(item.PID).trim();
        const parent =
          item.Parent_Name ||
          routeTitle[routId] ||
          routeTitle[pid] ||
          permissionName[pid] ||
          '';
        return {
          ...item,
          Parent_Name: parent,
          SORT: item.SORT == null ? '' : String(item.SORT),
          COMPONENT: item.COMPONENT || '',
          PRIMARY_ROUT_URL: item.PRIMARY_ROUT_URL || '',
          HIDE: item.HIDE == null ? 0 : Number(item.HIDE)
        };
      });
    },
    reload() {
      this.$refs.table?.reload();
    },
    sortNumber(value) {
      const raw = value == null ? '' : String(value).trim();
      if (!/^\d+$/.test(raw)) {
        return null;
      }
      return parseInt(raw, 10);
    },
    applySort(list) {
      const parentDir = this.sortState.Parent_Name;
      const numDir = this.sortState.SORT;
      const nameDir = this.sortState.Permission_Name;
      const rows = (list || []).map((row, index) => ({ row, index }));
      if (nameDir) {
        rows.sort((a, b) => {
          const diff = String(a.row.Permission_Name || '').localeCompare(
            String(b.row.Permission_Name || ''),
            'zh'
          );
          if (diff !== 0) {
            return nameDir === 'descending' ? -diff : diff;
          }
          return a.index - b.index;
        });
        return rows.map((item) => item.row);
      }
      if (!parentDir && !numDir) {
        return list || [];
      }
      rows.sort((a, b) => {
        if (parentDir) {
          const diff = String(a.row.Parent_Name || '').localeCompare(
            String(b.row.Parent_Name || ''),
            'zh'
          );
          if (diff !== 0) {
            return parentDir === 'descending' ? -diff : diff;
          }
        }
        if (numDir) {
          const left = this.sortNumber(a.row.SORT);
          const right = this.sortNumber(b.row.SORT);
          if (left == null && right != null) {
            return 1;
          }
          if (left != null && right == null) {
            return -1;
          }
          if (left != null && right != null && left !== right) {
            return numDir === 'descending' ? right - left : left - right;
          }
        }
        return a.index - b.index;
      });
      return rows.map((item) => item.row);
    },
    toggleSort(key) {
      const current = this.sortState[key];
      this.sortState.Permission_Name = null;
      this.sortState[key] =
        current === 'ascending' ? 'descending' : current === 'descending' ? null : 'ascending';
      this.$refs.table?.clearSort();
      this.reload();
    },
    onNameSort({ prop, order }) {
      if (prop !== 'Permission_Name') {
        return;
      }
      this.sortState.Parent_Name = null;
      this.sortState.SORT = null;
      this.sortState.Permission_Name = order;
      this.reload();
    },
    rememberSort(row) {
      this.$set(this.sortDraft, row.ID, row.SORT == null ? '' : String(row.SORT));
    },
    async saveSort(row) {
      const next = row.SORT == null ? '' : String(row.SORT).trim();
      const prev = this.sortDraft[row.ID] == null ? '' : String(this.sortDraft[row.ID]);
      if (next === prev.trim()) {
        return;
      }
      if (next !== '' && !/^\d+$/.test(next)) {
        this.$message.warning('排序只能填数字，数字越小越靠前');
        row.SORT = prev;
        return;
      }
      try {
        const res = await upPermissionSort(row.ID, next);
        this.$set(this.sortDraft, row.ID, next);
        row.SORT = next;
        this.$message.success((res.msg || '排序已更新') + '，重新登录后侧栏生效');
      } catch (e) {
        row.SORT = prev;
        this.$message.error(e.message || '更新失败');
      }
    },
    openRemark(row) {
      this.currentRow = row;
      this.remarkVisible = true;
    },
    openNewSysAdd() {
      this.editRow = null;
      this.newSysAddVisible = true;
    },
    openEdit(row) {
      this.editRow = { ...row };
      this.editVisible = true;
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 8px;
}
.toolbar-row .el-button + .el-button {
  margin-left: 8px;
}
.text-danger {
  color: #f56c6c;
}
.action-edit {
  margin-right: 8px;
}
.sort-input {
  width: 108px;
}
.ump-sort-th {
  cursor: pointer;
  user-select: none;
}
.config-password-tip {
  margin: 0 0 14px;
  color: #666;
  line-height: 24px;
}
</style>
