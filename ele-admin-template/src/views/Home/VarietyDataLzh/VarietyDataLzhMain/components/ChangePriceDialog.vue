<template>
  <el-dialog
    title="此处修改价格启用合同结算价采购价同步修改"
    :visible="visible"
    width="420px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form size="mini" label-width="80px">
      <el-form-item label="价格">
        <el-input v-model="price" type="number" placeholder="请输入价格" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { UpdateVarPrice } from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'ChangePriceDialog',
  props: {
    visible: Boolean,
    rowId: { type: [String, Number], default: '' },
    initialPrice: { type: [String, Number], default: '' }
  },
  data() {
    return {
      price: '',
      loading: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.price =
          this.initialPrice != null && this.initialPrice !== ''
            ? String(this.initialPrice)
            : '';
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async onSave() {
      if (this.price === '' || this.price == null) {
        this.$message.warning('请输入价格');
        return;
      }
      this.loading = true;
      try {
        const res = await UpdateVarPrice(this.rowId, this.price);
        this.$alert(res.msg || '修改成功', '提示');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
