<template>
  <el-dialog
    title="更新月结集采信息"
    :visible="visible"
    width="420px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="月结月份" prop="Month">
        <el-date-picker
          v-model="form.Month"
          type="month"
          value-format="yyyy-MM"
          placeholder="yyyy-MM"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="small" :loading="submitting" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upJcMonth } from '@/api/Home/VarietieVarJC';

export default {
  name: 'VarietieVarJCUpdateMonthDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      submitting: false,
      form: { Month: '' },
      rules: {
        Month: [{ required: true, message: '请选择月结月份', trigger: 'change' }]
      }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form.Month = '';
        this.$nextTick(() => this.$refs.form?.clearValidate());
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await upJcMonth(this.form.Month);
          this.$message.success(res.msg || '更新成功');
          this.updateVisible(false);
          this.$emit('done');
        } catch (e) {
          this.$message.error(e.message || '更新失败');
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>
