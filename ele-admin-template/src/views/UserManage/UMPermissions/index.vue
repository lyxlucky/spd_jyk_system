<template>
  <div class="ele-body spd-page ump-page">
    <el-card shadow="never">
      <div class="section-title">权限管理</div>
      <div class="toolbar-row">
        <el-button size="mini" :loading="exporting" @click="handleExport">导出</el-button>
        <el-button type="success" size="mini" @click="addVisible = true">新增权限</el-button>
        <el-button type="primary" size="mini" plain @click="newAddVisible = true">树型新增权限</el-button>
        <el-button type="warning" size="mini" @click="newSysAddVisible = true">新系统新增权限</el-button>
      </div>

      <ele-pro-table
        ref="table"
        size="mini"
        height="calc(100vh - 220px)"
        :columns="columns"
        :datasource="datasource"
        :need-page="false"
        cache-key="umPermissionsTableV3"
      >
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
          <el-popconfirm title="确定删除此权限吗？" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <AddPermissionDialog :visible.sync="addVisible" @success="reload" />
    <NewAddPermissionDialog :visible.sync="newAddVisible" @success="reload" />
    <AddNewSystemPermissionDialog :visible.sync="newSysAddVisible" @success="reload" />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :permission-id="currentRow && currentRow.ID"
      :default-remark="currentRow && currentRow.Remarks"
      @success="reload"
    />
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
import { exportPermissionExcel, formatRemark, formatPermissionType, isDeleteOk } from './utils';

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
      addVisible: false,
      newAddVisible: false,
      newSysAddVisible: false,
      remarkVisible: false,
      exporting: false,
      currentRow: null,
      sortDraft: {},
      columns: [
        { label: '权限名称', prop: 'Permission_Name', minWidth: 200, sortable: true },
        { label: '链接', prop: 'Permission_Url', minWidth: 220, showOverflowTooltip: true },
        {
          label: '父级菜单',
          prop: 'Parent_Name',
          minWidth: 140,
          sortable: true,
          showOverflowTooltip: true,
          formatter: (row) => row.Parent_Name || ''
        },
        {
          label: '排序',
          prop: 'SORT',
          width: 130,
          slot: 'sort',
          sortable: true,
          sortMethod: (a, b) => {
            const toNum = (value) => {
              if (value == null || value === '') return Number.MAX_SAFE_INTEGER;
              const n = Number(value);
              return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
            };
            return toNum(a.SORT) - toNum(b.SORT);
          }
        },
        {
          label: '类型',
          width: 80,
          formatter: (row) => formatPermissionType(row.TYPE)
        },
        { label: '备注', minWidth: 160, slot: 'remarks' },
        { label: '操作', width: 90, fixed: 'right', slot: 'action' }
      ]
    };
  },
  methods: {
    formatRemark,
    formatPermissionType,
    datasource() {
      return Promise.all([
        getPermissionList(),
        getPrimaryRoutList().catch(() => ({ result: [] }))
      ]).then(([res, routRes]) => {
        const list = this.fillParentName(res.result || [], routRes.result || []);
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
          SORT: item.SORT == null ? '' : String(item.SORT)
        };
      });
    },
    reload() {
      this.$refs.table?.reload();
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
.sort-input {
  width: 108px;
}
</style>
