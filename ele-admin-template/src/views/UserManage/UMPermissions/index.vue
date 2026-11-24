<template>
  <div class="ele-body spd-page ump-page">
    <el-card v-if="unlocked" shadow="never">
      <div class="section-title">权限管理</div>
      <div class="toolbar-row">
        <el-button size="mini" :loading="exporting" @click="handleExport">导出</el-button>
        <el-button type="success" size="mini" @click="addVisible = true">新增权限</el-button>
        <el-button type="primary" size="mini" plain @click="newAddVisible = true">树型新增权限</el-button>
        <el-button type="warning" size="mini" @click="openNewSysAdd">新系统新增权限</el-button>
        <el-button size="mini" plain @click="expandAll(true)">展开全部</el-button>
        <el-button size="mini" plain @click="expandAll(false)">折叠全部</el-button>
      </div>

      <ele-pro-table
        ref="table"
        size="mini"
        row-key="ID"
        height="calc(100vh - 220px)"
        :columns="columns"
        :datasource="datasource"
        :need-page="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="false"
        cache-key="umPermissionsTableV6"
      >
        <template v-slot:name="{ row }">
          <span class="ump-name" :class="{ 'is-group': row.isGroup }">
            {{ row.Permission_Name }}
          </span>
        </template>
        <template v-slot:sort="{ row }">
          <span v-if="row.isGroup">—</span>
          <el-input
            v-else
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
          <span v-if="row.isGroup">—</span>
          <el-button v-else type="text" size="mini" @click="openRemark(row)">
            {{ formatRemark(row.Remarks) }}
          </el-button>
        </template>
        <template v-slot:action="{ row }">
          <template v-if="!row.isGroup">
            <el-button type="text" size="mini" class="action-edit" @click="openEdit(row)">
              编辑
            </el-button>
            <el-popconfirm title="确定删除此权限吗？" @confirm="handleDelete(row)">
              <el-button slot="reference" type="text" size="mini" class="text-danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
          <span v-else class="ump-muted">{{ row.groupLabel || '分组' }}</span>
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
import { isButtonPermission } from '@/utils/permissionType';

const MANAGE_PASSWORD = '199411Abc';
const ROUT_PREFIX = 'rout:';
const BTN_PREFIX = 'btns:';

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
      treeRoots: [],
      columns: [
        {
          label: '权限名称',
          prop: 'Permission_Name',
          minWidth: 240,
          slot: 'name',
          showOverflowTooltip: true
        },
        { label: '链接', prop: 'Permission_Url', minWidth: 200, showOverflowTooltip: true },
        {
          label: '父级菜单',
          prop: 'Parent_Name',
          minWidth: 140,
          showOverflowTooltip: true,
          formatter: (row) => (row.isGroup ? '' : row.Parent_Name || '')
        },
        {
          label: '排序',
          prop: 'SORT',
          width: 130,
          slot: 'sort'
        },
        {
          label: '类型',
          width: 90,
          formatter: (row) => {
            if (row.groupType === 'rout') {
              return '父级';
            }
            if (row.groupType === 'buttons') {
              return '按钮组';
            }
            return formatPermissionType(row.TYPE);
          }
        },
        {
          label: 'Component',
          prop: 'COMPONENT',
          minWidth: 150,
          showOverflowTooltip: true,
          formatter: (row) => row.COMPONENT || ''
        },
        {
          label: '路由PATH',
          prop: 'PRIMARY_ROUT_URL',
          minWidth: 150,
          showOverflowTooltip: true,
          formatter: (row) => row.PRIMARY_ROUT_URL || ''
        },
        {
          label: '隐藏',
          width: 70,
          align: 'center',
          formatter: (row) => {
            if (row.isGroup) {
              return Number(row.HIDE) === 1 ? '是' : '否';
            }
            return Number(row.HIDE) === 1 ? '是' : '否';
          }
        },
        { label: '备注', minWidth: 140, slot: 'remarks' },
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
        const flat = this.normalizeList(res.result || [], routRes.result || []);
        const list = this.buildPermissionTree(flat, routRes.result || []);
        this.treeRoots = list;
        return {
          list,
          count: flat.length
        };
      });
    },
    normalizeList(list, routes) {
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
          HIDE: item.HIDE == null ? 0 : Number(item.HIDE),
          children: []
        };
      });
    },
    sortNumber(value) {
      const raw = value == null ? '' : String(value).trim();
      if (!/^\d+$/.test(raw)) {
        return null;
      }
      return parseInt(raw, 10);
    },
    compareSortValue(a, b) {
      const left = this.sortNumber(a && a.SORT);
      const right = this.sortNumber(b && b.SORT);
      if (left == null && right != null) {
        return 1;
      }
      if (left != null && right == null) {
        return -1;
      }
      if (left != null && right != null && left !== right) {
        return left - right;
      }
      return String((a && a.Permission_Name) || '').localeCompare(
        String((b && b.Permission_Name) || ''),
        'zh'
      );
    },
    makeRoutGroup(rout) {
      const key = String(rout.ID);
      return {
        ID: `${ROUT_PREFIX}${key}`,
        Permission_Name: rout.TITLE || `父级菜单${key}`,
        Permission_Url: rout.PATH || '',
        Parent_Name: '',
        SORT: rout.SORT == null ? '' : String(rout.SORT),
        TYPE: -1,
        COMPONENT: '',
        PRIMARY_ROUT_URL: rout.PATH || '',
        PRIMARY_ROUT_ID: key,
        HIDE: rout.HIDE == null ? 0 : Number(rout.HIDE),
        Remarks: '',
        isGroup: true,
        groupType: 'rout',
        groupLabel: '父级菜单',
        children: []
      };
    },
    makeButtonGroup(routKey, parentName) {
      return {
        ID: `${BTN_PREFIX}${routKey || 'other'}`,
        Permission_Name: '按钮',
        Permission_Url: '',
        Parent_Name: parentName || '',
        SORT: '999999',
        TYPE: -2,
        COMPONENT: '',
        PRIMARY_ROUT_URL: '',
        PRIMARY_ROUT_ID: routKey || '',
        HIDE: 0,
        Remarks: '',
        isGroup: true,
        groupType: 'buttons',
        groupLabel: '按钮分组',
        children: []
      };
    },
    /**
     * 父级菜单
     *   ├─ 一级菜单…
     *   └─ 按钮
     *        └─ 该父级下的按钮…
     */
    buildPermissionTree(list, routes) {
      const items = (list || []).map((row) => {
        const copy = { ...row };
        delete copy.children;
        return copy;
      });
      const menus = items.filter((item) => !isButtonPermission(item));
      const buttons = items.filter((item) => isButtonPermission(item));
      const menuById = new Map(menus.map((item) => [String(item.ID), item]));

      const normKey = (id) => {
        const key = id == null ? '' : String(id).trim();
        return key || '__other__';
      };

      const menuRoutKey = (menu) =>
        normKey(menu.PRIMARY_ROUT_ID == null ? '' : String(menu.PRIMARY_ROUT_ID));

      const buttonRoutKey = (btn) => {
        const pid = btn.PID == null ? '' : String(btn.PID).trim();
        if (pid && menuById.has(pid)) {
          return menuRoutKey(menuById.get(pid));
        }
        return normKey(btn.PRIMARY_ROUT_ID == null ? '' : String(btn.PRIMARY_ROUT_ID));
      };

      const routMap = new Map();
      (routes || []).forEach((rout) => {
        if (!rout || rout.ID == null) {
          return;
        }
        routMap.set(String(rout.ID), this.makeRoutGroup(rout));
      });

      const ensureGroup = (key, fallbackName) => {
        if (!routMap.has(key)) {
          routMap.set(
            key,
            this.makeRoutGroup({
              ID: key === '__other__' ? 'other' : key,
              TITLE: fallbackName || (key === '__other__' ? '未分类' : `父级菜单${key}`),
              PATH: '',
              SORT: '',
              HIDE: 0
            })
          );
        }
        return routMap.get(key);
      };

      const menusByRout = new Map();
      const buttonsByRout = new Map();
      const push = (map, key, row) => {
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(row);
      };

      menus.forEach((menu) => {
        const key = menuRoutKey(menu);
        push(menusByRout, key, menu);
        ensureGroup(key, menu.Parent_Name);
      });
      buttons.forEach((btn) => {
        const key = buttonRoutKey(btn);
        push(buttonsByRout, key, btn);
        ensureGroup(key, btn.Parent_Name);
      });

      const usedKeys = new Set([...menusByRout.keys(), ...buttonsByRout.keys()]);
      const roots = [];
      const visited = new Set();

      const buildOne = (key) => {
        if (visited.has(key) || !usedKeys.has(key)) {
          return;
        }
        visited.add(key);
        const group = ensureGroup(key, key === '__other__' ? '未分类' : undefined);
        const menuRows = (menusByRout.get(key) || []).slice();
        const buttonRows = (buttonsByRout.get(key) || []).slice();
        menuRows.sort((a, b) => this.compareSortValue(a, b));
        buttonRows.sort((a, b) => this.compareSortValue(a, b));

        group.children = [...menuRows];
        if (buttonRows.length) {
          const btnGroup = this.makeButtonGroup(key, group.Permission_Name);
          btnGroup.children = buttonRows;
          group.children.push(btnGroup);
        }
        if (group.children.length) {
          roots.push(group);
        }
      };

      (routes || []).forEach((rout) => {
        if (rout && rout.ID != null) {
          buildOne(String(rout.ID));
        }
      });
      usedKeys.forEach((key) => buildOne(key));

      const clean = (nodes) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length) {
            clean(node.children);
          } else {
            delete node.children;
          }
        });
      };
      clean(roots);
      this.treeRoots = roots;
      return roots;
    },
    reload() {
      this.$refs.table?.reload();
    },
    expandAll(expanded) {
      const table = this.$refs.table;
      if (!table || typeof table.toggleRowExpansionAll !== 'function') {
        return;
      }
      table.toggleRowExpansionAll(expanded);
    },
    rememberSort(row) {
      if (row.isGroup) {
        return;
      }
      this.$set(this.sortDraft, row.ID, row.SORT == null ? '' : String(row.SORT));
    },
    async saveSort(row) {
      if (row.isGroup) {
        return;
      }
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
        this.reload();
      } catch (e) {
        row.SORT = prev;
        this.$message.error(e.message || '更新失败');
      }
    },
    openRemark(row) {
      if (row.isGroup) {
        return;
      }
      this.currentRow = row;
      this.remarkVisible = true;
    },
    openNewSysAdd() {
      this.editRow = null;
      this.newSysAddVisible = true;
    },
    openEdit(row) {
      if (row.isGroup) {
        return;
      }
      const copy = { ...row };
      delete copy.children;
      delete copy.isGroup;
      this.editRow = copy;
      this.editVisible = true;
    },
    async handleDelete(row) {
      if (row.isGroup) {
        return;
      }
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
  flex-wrap: wrap;
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
.ump-name {
  line-height: 1.4;
}
.ump-name.is-group {
  font-weight: 600;
  color: #303133;
}
.ump-muted {
  color: #909399;
  font-size: 12px;
}
.config-password-tip {
  margin: 0 0 14px;
  color: #666;
  line-height: 24px;
}
</style>
