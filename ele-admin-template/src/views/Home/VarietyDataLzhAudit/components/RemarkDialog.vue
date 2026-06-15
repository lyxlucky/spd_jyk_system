<template>
  <el-dialog
    title="备注"
    :visible="visible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-input v-model="remark" type="textarea" :rows="12" placeholder="请输入备注" />
    <div slot="footer">
      <el-button size="small" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="small" :loading="submitting" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upBZVarietie } from '@/api/Home/VarietyDataLzhAudit';

export default {
  name: 'VarietyDataLzhAuditRemarkDialog',
  props: {
    visible: { type: Boolean, default: false },
    row: { type: Object, default: null }
  },
  data() {
    return {
      remark: '',
      submitting: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.row) {
        this.remark = this.row.BZ ?? '';
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async submit() {
      if (!this.row?.ID) return;
      this.submitting = true;
      try {
        const res = await upBZVarietie(this.row.ID, this.remark);
        this.$message.success(res.msg || '保存成功');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
