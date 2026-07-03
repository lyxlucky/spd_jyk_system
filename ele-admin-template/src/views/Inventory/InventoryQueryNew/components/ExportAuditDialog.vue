<template>
  <el-dialog title="导出审计申请" :visible.sync="innerVisible" width="480px" append-to-body>
    <p class="tip">当前导出需审计审批，请填写申请说明后提交。</p>
    <el-input v-model="remark" type="textarea" :rows="4" placeholder="申请说明" maxlength="200" show-word-limit />
    <div slot="footer">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">提交申请</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { applyExportAudit } from '@/api/Inventory/InventoryQueryNew';

export default {
  name: 'InvQueryExportAuditDialog',
  props: {
    visible: { type: Boolean, default: false },
    requestUrl: { type: String, default: '' },
    dataType: { type: String, default: '' },
    keyParams: { type: String, default: '' }
  },
  data() {
    return {
      innerVisible: false,
      remark: '',
      loading: false
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
        if (v) this.remark = '';
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    async submit() {
      if (!this.remark.trim()) {
        this.$message.warning('请填写申请说明');
        return;
      }
      this.loading = true;
      try {
        await applyExportAudit({
          requestUrl: this.requestUrl,
          dataType: this.dataType,
          applyRemark: this.remark.trim(),
          keyParams: this.keyParams
        });
        this.$message.success('申请已提交');
        this.innerVisible = false;
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.tip {
  margin: 0 0 12px;
  color: #666;
  font-size: 13px;
}
</style>
