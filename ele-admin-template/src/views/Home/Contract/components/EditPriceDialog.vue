<template>
  <el-dialog
    title="修改结算价"
    :visible.sync="dialogVisible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <el-form label-width="120px" size="small">
      <el-form-item label="结算价">
        <span>{{ row?.supply_price ?? '—' }}</span>
      </el-form-item>
      <el-form-item label="修改的结算价" required>
        <el-input v-model="supplyPrice" />
      </el-form-item>
      <el-form-item label="采购价">
        <span>{{ row?.purchase_price ?? '—' }}</span>
      </el-form-item>
      <el-form-item label="修改的采购价" required>
        <el-input v-model="purchasePrice" />
      </el-form-item>
      <el-form-item label="中标价">
        <span>{{ row?.price ?? '—' }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateContractPrice } from '@/api/Home/Contract';

export default {
  name: 'EditPriceDialog',
  props: {
    visible: Boolean,
    row: Object
  },
  data() {
    return { loading: false, supplyPrice: '', purchasePrice: '' };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    onOpen() {
      this.supplyPrice = this.row?.supply_price ?? '';
      this.purchasePrice = this.row?.purchase_price ?? '';
    },
    async onSubmit() {
      if (!this.row?.contract_detail_guid) return;
      this.loading = true;
      try {
        await updateContractPrice({
          guid: this.row.contract_detail_guid,
          supplyPrice: this.supplyPrice,
          purchasePrice: this.purchasePrice
        });
        this.$message.success('编辑成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '编辑失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
