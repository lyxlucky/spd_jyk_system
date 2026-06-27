<template>
  <el-dialog
    title="供应商评分"
    :visible.sync="visible"
    width="480px"
    :close-on-click-modal="false"
    append-to-body
    @closed="onClosed"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="分值类型" prop="SCORE_TYPE">
        <el-select v-model="form.SCORE_TYPE" placeholder="请选择" style="width: 100%">
          <el-option v-for="opt in scoreTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="减分值" prop="SCORE">
        <el-input-number v-model="form.SCORE" :min="0" :precision="0" controls-position="right" style="width: 100%" />
      </el-form-item>
      <el-form-item label="说明" prop="REMARK">
        <el-input v-model="form.REMARK" type="textarea" :rows="4" placeholder="请输入说明" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="visible = false">取 消</el-button>
      <el-button type="primary" size="small" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSupplierScoreLast } from '@/api/Home/SupplierScoreLast';
import { SCORE_TYPE_OPTIONS } from '../utils';

export default {
  name: 'SupplierScoreLastAddDialog',
  data() {
    return {
      visible: false,
      loading: false,
      scoreTypeOptions: SCORE_TYPE_OPTIONS,
      form: {
        SCORE_TYPE: 'SCORE_A',
        SCORE: undefined,
        REMARK: ''
      },
      supplier: null,
      rules: {
        SCORE_TYPE: [{ required: true, message: '请选择分值类型', trigger: 'change' }],
        SCORE: [{ required: true, message: '请输入减分值', trigger: 'blur' }]
      }
    };
  },
  methods: {
    open(supplier) {
      this.supplier = supplier;
      this.visible = true;
    },
    onClosed() {
      this.form = { SCORE_TYPE: 'SCORE_A', SCORE: undefined, REMARK: '' };
      this.supplier = null;
      this.$refs.form?.clearValidate();
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid || !this.supplier) return;
        this.loading = true;
        try {
          const operator =
            this.$store.state.user?.info?.Nickname ||
            this.$store.state.user?.info?.UserName ||
            '';
          const res = await addSupplierScoreLast({
            SUPPLIER_CODE: this.supplier.SUPPLIER_CODE,
            YEAR: this.supplier.YEAR ?? '0',
            SCORE_TYPE: this.form.SCORE_TYPE,
            SCORE: this.form.SCORE,
            REMARK: this.form.REMARK,
            OPERATOR: operator
          });
          this.$message.success(res.msg || '评价成功');
          this.visible = false;
          this.$emit('success');
        } catch (e) {
          this.$message.error(e.message || '评分失败');
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
