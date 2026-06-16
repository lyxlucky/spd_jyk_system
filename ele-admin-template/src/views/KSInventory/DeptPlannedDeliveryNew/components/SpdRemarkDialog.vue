<template>
  <el-dialog
    title="配送计划新-SPD备注"
    :visible.sync="dialogVisible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadRemark"
  >
    <el-input v-model="remark" type="textarea" :rows="12" placeholder="请输入SPD备注" />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { searchBz, editBz } from '@/api/KSInventory/DeptPlannedDeliveryNew';

export default {
  name: 'SpdRemarkDialog',
  props: {
    visible: Boolean,
    dtlId: [String, Number]
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
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    async loadRemark() {
      if (!this.dtlId) return;
      try {
        const res = await searchBz(this.dtlId);
        this.remark = res.result || '';
      } catch (e) {
        this.$message.error(e.message || '获取备注失败');
      }
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        await editBz(this.dtlId, this.remark);
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
