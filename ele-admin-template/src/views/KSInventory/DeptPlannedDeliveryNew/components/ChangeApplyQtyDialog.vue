<template>
  <el-dialog
    title="变更申请数量"
    :visible.sync="dialogVisible"
    width="420px"
    append-to-body
    :close-on-click-modal="false"
    @open="initForm"
  >
    <div class="info-line">原申请数量：{{ originalQty }}</div>
    <div class="info-line">剩余申请数量：{{ leftQty }}</div>
    <el-form size="mini" label-width="110px">
      <el-form-item label="变更申请数量">
        <el-input-number
          v-model="applyQty"
          :min="0"
          :max="originalQty"
          controls-position="right"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="remark" type="textarea" :rows="6" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="confirmSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeApplyQty } from '@/api/KSInventory/DeptPlannedDeliveryNew';

export default {
  name: 'ChangeApplyQtyDialog',
  props: {
    visible: Boolean,
    row: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dialogVisible: false,
      applyQty: 0,
      remark: '',
      submitting: false
    };
  },
  computed: {
    originalQty() {
      return Number(this.row.Apply_Qty) || 0;
    },
    leftQty() {
      return Number(this.row.Left_Apply_Qty) || 0;
    }
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
      this.applyQty = this.originalQty;
      this.remark = '';
    },
    confirmSubmit() {
      if (Number.isNaN(this.applyQty)) {
        this.$message.warning('请输入正确的申请数量');
        return;
      }
      if (this.applyQty < 0) {
        this.$message.warning('申请数量不能小于0');
        return;
      }
      if (this.applyQty % 1 !== 0) {
        this.$message.warning('申请数量必须是整数');
        return;
      }
      if (this.applyQty > this.originalQty) {
        this.$message.warning('申请数量不能大于原申请数量');
        return;
      }
      if (!String(this.remark || '').trim()) {
        this.$message.warning('请输入备注');
        return;
      }
      this.$confirm(
        '请务必跟科室协商一致,修改数量将直接变更科室的申请数量,无法撤回！',
        '二次确认',
        { confirmButtonText: '确定修改', cancelButtonText: '取消', type: 'warning' }
      ).then(() => this.handleSubmit());
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        await changeApplyQty(this.row.Dtl_Id, this.applyQty, this.remark);
        this.$message.success('成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '变更失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.info-line {
  margin-bottom: 8px;
}
</style>
