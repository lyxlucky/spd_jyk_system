<template>
  <el-dialog
    :title="'导出申请 - ' + (auditInfo.dataType || '')"
    :visible="visible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <p class="tip">该导出操作需要管理员审批，请填写申请说明。</p>
    <p v-if="auditInfo.keyParams" class="params">导出参数：{{ auditInfo.keyParams }}</p>
    <el-input
      v-model="remark"
      type="textarea"
      :rows="4"
      placeholder="请填写导出数据的用途和原因..."
    />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { applyExportAudit } from '@/api/Home/YgVarInfo';

export default {
  name: 'YgVarExportAuditDialog',
  props: {
    visible: Boolean,
    auditInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      remark: '',
      submitting: false
    };
  },
  watch: {
    visible(val) {
      if (val) this.remark = '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async submit() {
      const applyRemark = (this.remark || '').trim();
      if (!applyRemark) {
        Message.warning('请填写申请说明');
        return;
      }
      this.submitting = true;
      try {
        const res = await applyExportAudit({
          requestUrl: this.auditInfo.requestUrl,
          dataType: this.auditInfo.dataType,
          applyRemark,
          keyParams: this.auditInfo.keyParams
        });
        Message.success(res.msg || '导出申请已提交');
        this.$emit('success', res);
        this.updateVisible(false);
      } catch (e) {
        Message.error(e.message || '提交失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.tip {
  margin: 0 0 8px;
  color: #606266;
  font-size: 13px;
}
.params {
  margin: 0 0 12px;
  font-size: 12px;
  color: #909399;
}
</style>
