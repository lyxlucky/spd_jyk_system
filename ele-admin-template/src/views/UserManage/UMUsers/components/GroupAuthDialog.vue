<template>
  <el-dialog :title="`分配组内权限 - ${userName}`" :visible.sync="dialogVisible" width="900px" top="8vh" append-to-body :close-on-click-modal="false" @open="loadData">
    <div v-loading="dataLoading" class="um-dialog-body">
    <el-table ref="table" :data="permissionList" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" />
      <el-table-column prop="Permission_Name" label="权限名称" min-width="160" />
      <el-table-column prop="Permission_Url" label="链接" min-width="200" show-overflow-tooltip />
    </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPermissionListByUID, notInGroupPost } from '@/api/UserManage/UMUsers';

export default {
  name: 'GroupAuthDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String,
    groupId: [Number, String]
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      permissionList: [],
      allIds: [],
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
    async loadData() {
      if (!this.groupId) {
        this.$message.warning('用户未分配权限组');
        return;
      }
      this.dataLoading = true;
      this.permissionList = [];
      this.allIds = [];
      this.selectedIds = [];
      try {
        const res = await getPermissionListByUID(this.groupId, this.userId);
        const list = res.result || [];
        this.permissionList = list;
        this.allIds = list.map((item) => item.ID);
        let notIn = [];
        if (list.length && list[0].NOT_IN_GROUP) {
          notIn = String(list[0].NOT_IN_GROUP).split(',').filter(Boolean);
        }
        this.$nextTick(() => {
          list.forEach((row) => {
            const checked = !notIn.includes(String(row.ID));
            this.$refs.table?.toggleRowSelection(row, checked);
          });
        });
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.dataLoading = false;
      }
    },
    onSelectionChange(rows) {
      this.selectedIds = (rows || []).map((r) => r.ID);
    },
    async handleSubmit() {
      const unchecked = this.allIds.filter((id) => !this.selectedIds.includes(id));
      const postData = unchecked.join(',');
      this.submitting = true;
      try {
        const res = await notInGroupPost(this.userId, postData);
        this.$message.success(res.msg || '分配成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '分配失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.um-dialog-body {
  min-height: 420px;
}
:deep(.um-checkbox-col .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
</style>
