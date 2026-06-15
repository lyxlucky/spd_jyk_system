<template>
  <el-dialog title="选择目标合同" :visible.sync="dialogVisible" width="400px" append-to-body :close-on-click-modal="false">
    <el-form label-width="90px" size="small">
      <el-form-item label="目标合同">
        <el-select v-model="targetCode" filterable style="width: 100%">
          <el-option
            v-for="item in contractOptions"
            :key="item.Contract_Code"
            :label="`${item.Contract_Code} - ${item.Contract_Name}`"
            :value="item.Contract_Code"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copyToOtherContract, getContractList } from '@/api/Home/Contract';

export default {
  name: 'CopyAuthDialog',
  props: {
    visible: Boolean,
    supplier: Object,
    oldContractCode: [String, Number],
    rows: { type: Array, default: () => [] }
  },
  data() {
    return { loading: false, targetCode: '', contractOptions: [] };
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
  watch: {
    visible(v) {
      if (v) this.loadContracts();
    }
  },
  methods: {
    async loadContracts() {
      if (!this.supplier?.Supplier_Code) return;
      try {
        const res = await getContractList({ supplier_code: this.supplier.Supplier_Code });
        this.contractOptions = res.result || [];
        this.targetCode = this.contractOptions[0]?.Contract_Code || '';
      } catch (e) {
        this.$message.error(e.message || '加载合同失败');
      }
    },
    async onSubmit() {
      if (!this.oldContractCode || !this.targetCode) {
        this.$message.warning('请选择目标合同');
        return;
      }
      if (!this.rows.length) {
        this.$message.warning('请勾选要复制的授权品种');
        return;
      }
      const guidsJson = JSON.stringify(
        this.rows.map((r) => ({ CONTRACT_DETAIL_GUID: r.contract_detail_guid }))
      );
      this.loading = true;
      try {
        const res = await copyToOtherContract({
          oldCode: this.oldContractCode,
          newCode: this.targetCode,
          guidsJson,
          supplyCode: this.supplier?.Supplier_Code
        });
        this.$message.success(res.msg || '复制成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '复制失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
