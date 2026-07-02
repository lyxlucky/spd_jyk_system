<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="420px" append-to-body @close="onClose">
    <el-form size="small" label-width="100px">
      <el-form-item label="移区数量">
        <el-input-number v-model="quantity" :min="1" :max="maxQty" :controls="true" style="width: 160px" />
        <span v-if="maxQty" class="hint">最大 {{ maxQty }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'InvQueryMoveQuantityDialog',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '移区' },
    maxQty: { type: Number, default: 0 },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      innerVisible: false,
      quantity: 1
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
        if (v) this.quantity = 1;
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onClose() {
      this.quantity = 1;
    },
    confirm() {
      if (!this.quantity || this.quantity <= 0) {
        this.$message.warning('请输入有效数量');
        return;
      }
      if (this.maxQty && this.quantity > this.maxQty) {
        this.$message.warning(`数量不能超过 ${this.maxQty}`);
        return;
      }
      this.$emit('confirm', this.quantity);
    }
  }
};
</script>

<style scoped>
.hint {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}
</style>
