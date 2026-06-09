<template>
  <el-dialog
    title="阳光订单号"
    :visible="visible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <p class="tip">Tip:已发送成功的不支持回填,如要回填需先重置阳光订单</p>
    <el-form label-width="100px" @submit.native.prevent>
      <el-form-item label="订单号" required>
        <el-input v-model="ygOrderId" placeholder="订单号" />
      </el-form-item>
      <el-form-item label="订单明细号">
        <el-input v-model="ygOrderDetailId" placeholder="不填则用订单号+品种ID" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'HbYgOrderDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return {
      ygOrderId: '',
      ygOrderDetailId: ''
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.ygOrderId = '';
        this.ygOrderDetailId = '';
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      this.$emit('confirm', {
        ygOrderId: (this.ygOrderId || '').trim(),
        ygOrderDetailId: (this.ygOrderDetailId || '').trim()
      });
    }
  }
};
</script>

<style scoped>
.tip {
  margin: 0 0 12px;
  color: #909399;
  font-size: 13px;
}
</style>
