<template>
  <el-dialog title="编辑" :visible.sync="innerVisible" width="400px" append-to-body @closed="onClosed">
    <el-form ref="form" :model="form" label-width="88px" size="small">
      <el-form-item label="批号">
        <el-input v-model="form.batch" />
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker v-model="form.productDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker v-model="form.validDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
      </el-form-item>
      <el-form-item label="灭菌批号">
        <el-input v-model="form.mjBatch" />
      </el-form-item>
      <el-form-item label="收货价">
        <el-input v-model="form.supplierPrice" />
      </el-form-item>
      <el-form-item label="采购价">
        <el-input v-model="form.purchasePrice" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="innerVisible = false">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Task/AuthOrder';
import { fmtDate10 } from '../utils';

export default {
  name: 'EditBatchDialog',
  props: {
    visible: Boolean,
    row: { type: Object, default: null }
  },
  data() {
    return {
      innerVisible: false,
      loading: false,
      form: {
        batch: '',
        productDate: '',
        validDate: '',
        mjBatch: '',
        supplierPrice: '',
        purchasePrice: ''
      }
    };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
      if (v && this.row) this.fillForm(this.row);
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    fillForm(row) {
      this.form = {
        batch: row.BATCH || '',
        productDate: fmtDate10(row.BATCH_PRODUCTION_DATE),
        validDate: fmtDate10(row.BATCH_VALIDITY_PERIOD),
        mjBatch: row.DISINFECTION_BATCH || '',
        supplierPrice: row.SUPPLY_PRICE != null ? String(row.SUPPLY_PRICE) : '',
        purchasePrice: row.PURCHASE_PRICE != null ? String(row.PURCHASE_PRICE) : ''
      };
    },
    onClosed() {
      this.$refs.form?.resetFields?.();
    },
    async onSubmit() {
      if (!this.row?.BATCH_ID) return;
      this.loading = true;
      try {
        await api.updateInfoById(this.row.BATCH_ID, this.form);
        Message.success('保存成功');
        this.innerVisible = false;
        this.$emit('saved');
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
