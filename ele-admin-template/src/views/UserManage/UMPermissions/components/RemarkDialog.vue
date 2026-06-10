<template>
  <el-dialog
    title="备注"
    :visible.sync="dialogVisible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @open="initForm"
    @closed="resetForm"
  >
    <el-input
      v-model="remark"
      type="textarea"
      :rows="10"
      placeholder="请输入备注"
    />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upPermissionRemark } from '@/api/UserManage/UMPermissions';

export default {
  name: 'RemarkDialog',
  props: {
    visible: Boolean,
    permissionId: [Number, String],
    defaultRemark: String
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      remark: ''
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
    initForm() {
      this.remark = this.defaultRemark || '';
    },
    resetForm() {
      this.remark = '';
    },
    async handleSubmit() {
      if (!this.permissionId) return;
      this.submitting = true;
      try {
        const res = await upPermissionRemark(this.permissionId, this.remark);
        this.$message.success(res.msg || '更新成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '更新失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
