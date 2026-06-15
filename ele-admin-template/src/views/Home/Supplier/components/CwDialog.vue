<template>
  <el-dialog
    title="编辑财务属性"
    :visible.sync="dialogVisible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <el-form ref="form" :model="form" label-width="220px" size="mini">
      <el-form-item label="汕头中医院-卫生材料经济科目">
        <el-input v-model="form.CW_CLASS_ONE" />
      </el-form-item>
      <el-form-item label="汕头中医院-植入卫生材料经济科目">
        <el-input v-model="form.CW_CLASS_TWO" />
      </el-form-item>
      <el-form-item label="汕头中医院-低值易耗品经济科目">
        <el-input v-model="form.CW_CLASS_THREE" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateSupCW } from '@/api/Home/Supplier';

export default {
  name: 'CwDialog',
  props: {
    visible: Boolean,
    data: { type: Object, default: null }
  },
  data() {
    return {
      loading: false,
      form: {
        Supplier_Code: '',
        CW_CLASS_ONE: '',
        CW_CLASS_TWO: '',
        CW_CLASS_THREE: ''
      }
    };
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
    visible(val) {
      if (val && this.data) {
        this.form = {
          Supplier_Code: this.data.Supplier_Code,
          CW_CLASS_ONE: this.data.CW_CLASS_ONE || '',
          CW_CLASS_TWO: this.data.CW_CLASS_TWO || '',
          CW_CLASS_THREE: this.data.CW_CLASS_THREE || ''
        };
      }
    }
  },
  methods: {
    onClosed() {
      this.loading = false;
    },
    async onSave() {
      this.loading = true;
      try {
        const res = await updateSupCW(this.form);
        this.$message.success(res.msg || '保存成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
