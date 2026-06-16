<template>
  <el-dialog
    title="配送计划新-SPD批量备注"
    :visible.sync="dialogVisible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-input v-model="remark" type="textarea" :rows="12" placeholder="请输入批量备注" />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchEditBz } from '@/api/KSInventory/DeptPlannedDeliveryNew';

export default {
  name: 'BatchRemarkDialog',
  props: {
    visible: Boolean,
    dtlIds: { type: Array, default: () => [] }
  },
  data() {
    return {
      dialogVisible: false,
      remark: '',
      submitting: false
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) this.remark = '';
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.dtlIds.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.submitting = true;
      try {
        await batchEditBz(this.dtlIds.join(','), this.remark);
        this.$message.success('成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
