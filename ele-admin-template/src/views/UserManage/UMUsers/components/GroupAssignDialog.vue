<template>
  <el-dialog :title="`分配权限组 - ${userName}`" :visible.sync="dialogVisible" width="480px" append-to-body :close-on-click-modal="false" @open="loadGroups">
    <div v-loading="dataLoading" class="um-dialog-body-sm">
    <el-form label-width="90px" size="small">
      <el-form-item label="权限组">
        <el-select v-model="groupId" filterable style="width: 100%">
          <el-option v-for="item in groupList" :key="item.ID" :label="item.Group_Name" :value="item.ID" />
        </el-select>
      </el-form-item>
    </el-form>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGroupsList, correlationUserGroups } from '@/api/UserManage/UMUsers';

export default {
  name: 'GroupAssignDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String,
    defaultGroupId: [Number, String]
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      groupList: [],
      groupId: null
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.groupId = this.defaultGroupId ? Number(this.defaultGroupId) : null;
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    async loadGroups() {
      this.dataLoading = true;
      this.groupList = [];
      try {
        const res = await getGroupsList();
        this.groupList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载权限组失败');
      } finally {
        this.dataLoading = false;
      }
    },
    async handleSubmit() {
      if (!this.groupId) {
        this.$message.warning('请选择权限组');
        return;
      }
      this.submitting = true;
      try {
        await correlationUserGroups(this.userId, this.groupId);
        this.$message.success('分配成功');
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
.um-dialog-body-sm {
  min-height: 80px;
}
</style>
