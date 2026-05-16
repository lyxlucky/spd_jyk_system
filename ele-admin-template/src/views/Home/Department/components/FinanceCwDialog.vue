<template>
  <el-dialog title="编辑财务属性" :visible.sync="visible" width="520px" append-to-body @closed="onClosed">
    <div v-loading="fillLoading" class="dialog-form-wrap" element-loading-text="加载中...">
      <el-form ref="formRef" :model="form" label-width="200px" size="small">
        <el-form-item label="卫生材料经济科目">
          <el-input v-model="form.CW_CLASS_ONE" />
        </el-form-item>
        <el-form-item label="植入卫生材料经济科目">
          <el-input v-model="form.CW_CLASS_TWO" />
        </el-form-item>
        <el-form-item label="低值易耗品经济科目">
          <el-input v-model="form.CW_CLASS_THREE" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="loading" :disabled="fillLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';

export default {
  name: 'FinanceCwDialog',
  data() {
    return {
      visible: false,
      fillLoading: false,
      loading: false,
      form: { Dept_Two_Code: '', CW_CLASS_ONE: '', CW_CLASS_TWO: '', CW_CLASS_THREE: '' }
    };
  },
  methods: {
    /** 先打开弹窗再填充（与旧 layer 打开后赋值一致），短加载便于用户感知 */
    async open(row) {
      this.form = { Dept_Two_Code: '', CW_CLASS_ONE: '', CW_CLASS_TWO: '', CW_CLASS_THREE: '' };
      this.visible = true;
      this.fillLoading = true;
      await this.$nextTick();
      try {
        await new Promise((r) => setTimeout(r, 120));
        this.form = {
          Dept_Two_Code: row.Dept_Two_Code,
          CW_CLASS_ONE: row.CW_CLASS_ONE || '',
          CW_CLASS_TWO: row.CW_CLASS_TWO || '',
          CW_CLASS_THREE: row.CW_CLASS_THREE || ''
        };
      } finally {
        this.fillLoading = false;
        this.$nextTick(() => this.$refs.formRef?.clearValidate());
      }
    },
    onClosed() {
      this.fillLoading = false;
    },
    async submit() {
      this.loading = true;
      try {
        await api.upDepartCW(this.form);
        Message.success('编辑成功');
        this.visible = false;
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

<style scoped>
.dialog-form-wrap {
  min-height: 100px;
}
</style>
