<template>
  <el-dialog
    :title="`分配权限 - ${groupName}`"
    :visible.sync="dialogVisible"
    width="1000px"
    top="8vh"
    append-to-body
    :close-on-click-modal="false"
    @open="loadData"
    @closed="resetState"
  >
    <div v-loading="dataLoading" class="umg-dialog-body">
      <div class="toolbar-row">
        <span class="search-tip">ctrl+f 可以进行搜索</span>
        <el-radio-group v-model="typeFilter" size="mini" @change="restoreSelection">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="menu">菜单</el-radio-button>
          <el-radio-button label="button">按钮</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
        ref="table"
        :data="displayList"
        size="mini"
        border
        height="420"
        :row-class-name="rowClassName"
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
          class-name="umg-checkbox-col"
        />
        <el-table-column
          prop="Permission_Name"
          label="权限名称"
          min-width="160"
          sortable
        />
        <el-table-column
          label="类型"
          width="80"
          align="center"
          sortable
          :sort-method="sortByType"
        >
          <template v-slot="{ row }">
            <el-tag
              :type="typeTagType(row.TYPE)"
              size="mini"
              :disable-transitions="true"
            >
              {{ formatPermissionType(row.TYPE) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="Permission_Url"
          label="链接/标识"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="Remarks"
          label="备注"
          min-width="160"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="dataLoading"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  correlationGroupsPermissions,
  getPermissionList,
  getPermissionListByGroupsID
} from '@/api/UserManage/UMGroups';
import { formatPermissionType } from '../utils';
import { isButtonPermission } from '@/utils/permissionType';

export default {
  name: 'AssignPermissionDialog',
  props: {
    visible: Boolean,
    groupId: [Number, String],
    groupName: String
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      permissionList: [],
      selectedIds: [],
      typeFilter: 'all'
    };
  },
  computed: {
    displayList() {
      if (this.typeFilter === 'menu') {
        return this.permissionList.filter((row) => !isButtonPermission(row));
      }
      if (this.typeFilter === 'button') {
        return this.permissionList.filter((row) => isButtonPermission(row));
      }
      return this.permissionList;
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    formatPermissionType,
    typeTagType(type) {
      return isButtonPermission({ TYPE: type }) ? 'warning' : 'success';
    },
    sortByType(a, b) {
      return Number(isButtonPermission(a)) - Number(isButtonPermission(b));
    },
    rowClassName({ row }) {
      return isButtonPermission(row) ? 'umg-row-button' : 'umg-row-menu';
    },
    resetState() {
      this.permissionList = [];
      this.selectedIds = [];
      this.typeFilter = 'all';
    },
    restoreSelection() {
      const selectedSet = new Set(this.selectedIds);
      this.$nextTick(() => {
        this.displayList.forEach((row) => {
          this.$refs.table?.toggleRowSelection(row, selectedSet.has(row.ID));
        });
      });
    },
    async loadData() {
      if (!this.groupId) return;
      this.dataLoading = true;
      this.permissionList = [];
      this.selectedIds = [];
      this.typeFilter = 'all';
      try {
        const [allRes, assignedRes] = await Promise.all([
          getPermissionList(),
          getPermissionListByGroupsID(this.groupId)
        ]);
        this.permissionList = allRes.result || [];
        const assignedIds = new Set((assignedRes.result || []).map((item) => item.ID));
        this.selectedIds = [...assignedIds];
        this.$nextTick(() => {
          this.permissionList.forEach((row) => {
            if (assignedIds.has(row.ID)) {
              this.$refs.table?.toggleRowSelection(row, true);
            }
          });
        });
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    onSelectionChange(rows) {
      const visibleIds = new Set(this.displayList.map((row) => row.ID));
      const visibleSelected = new Set((rows || []).map((row) => row.ID));
      const kept = this.selectedIds.filter(
        (id) => !visibleIds.has(id) || visibleSelected.has(id)
      );
      visibleSelected.forEach((id) => {
        if (!kept.includes(id)) {
          kept.push(id);
        }
      });
      this.selectedIds = kept;
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        const ok = await correlationGroupsPermissions(this.groupId, this.selectedIds);
        if (ok === true || ok === 'true') {
          this.$message.success('授权成功');
          this.dialogVisible = false;
          this.$emit('success');
        } else {
          this.$message.error('授权失败');
        }
      } catch (e) {
        this.$message.error(e.message || '授权失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.umg-dialog-body {
  min-height: 450px;
}
.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.search-tip {
  color: #f56c6c;
}
:deep(.umg-checkbox-col .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
:deep(.umg-row-button) {
  background-color: #fdf6ec;
}
</style>
