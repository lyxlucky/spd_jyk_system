<template>
  <el-dialog
    title="审核未通过备注说明"
    :visible="visible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-input v-model="mark" type="textarea" :rows="12" placeholder="请输入未通过原因" />
    <div slot="footer">
      <el-button size="small" @click="updateVisible(false)">取消</el-button>
      <el-button type="danger" size="small" :loading="submitting" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { approvalVarietieOk } from '@/api/Home/VarietyDataLzhAudit';

export default {
  name: 'VarietyDataLzhAuditRejectDialog',
  props: {
    visible: { type: Boolean, default: false },
    rows: { type: Array, default: () => [] }
  },
  data() {
    return {
      mark: '',
      submitting: false
    };
  },
  watch: {
    visible(val) {
      if (val) this.mark = '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async submit() {
      this.submitting = true;
      try {
        const res = await approvalVarietieOk(this.rows, 2, this.mark);
        this.$alert(res.msg || '操作完成', '提示');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
