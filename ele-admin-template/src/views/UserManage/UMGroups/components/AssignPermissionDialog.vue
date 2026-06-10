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
      <div class="search-tip">ctrl+f 可以进行搜索</div>
      <el-table
        ref="table"
        :data="permissionList"
        size="mini"
        border
        height="420"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" class-name="umg-checkbox-col" />
        <el-table-column prop="Permission_Name" label="权限名称" min-width="160" sortable />
        <el-table-column prop="Permission_Url" label="链接" min-width="200" show-overflow-tooltip />
        <el-table-column prop="Remarks" label="备注" min-width="160" show-overflow-tooltip />
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">
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
      selectedIds: []
    };
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
    resetState() {
      this.permissionList = [];
      this.selectedIds = [];
    },
    async loadData() {
      if (!this.groupId) return;
      this.dataLoading = true;
      this.permissionList = [];
      this.selectedIds = [];
      try {
        const [allRes, assignedRes] = await Promise.all([
          getPermissionList(),
          getPermissionListByGroupsID(this.groupId)
        ]);
        this.permissionList = allRes.result || [];
        const assignedIds = new Set((assignedRes.result || []).map((item) => item.ID));
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
      this.selectedIds = (rows || []).map((row) => row.ID);
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
.search-tip {
  color: #f56c6c;
  margin-bottom: 8px;
}
:deep(.umg-checkbox-col .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
</style>
