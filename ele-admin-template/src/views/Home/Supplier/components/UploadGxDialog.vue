<template>
  <el-dialog
    title="上传购销合同有效期"
    :visible.sync="dialogVisible"
    width="460px"
    append-to-body
    :close-on-click-modal="false"
    @closed="reset"
  >
    <el-form size="mini" label-width="100px">
      <el-form-item label="购销日期">
        <el-date-picker
          v-model="gxDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="合同文件">
        <el-upload
          action=""
          accept=".jpg,.jpeg,.png,.pdf"
          :auto-upload="false"
          :limit="1"
          :on-change="onFileChange"
          :on-remove="() => (file = null)"
        >
          <el-button size="mini">选择文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="!file || !gxDate" @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upSupGxConOffPic } from '@/api/Home/Supplier';

export default {
  name: 'UploadGxDialog',
  props: {
    visible: Boolean,
    supplierCode: [String, Number]
  },
  data() {
    return { loading: false, file: null, gxDate: '' };
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
    reset() {
      this.file = null;
      this.gxDate = '';
      this.loading = false;
    },
    onFileChange(file) {
      this.file = file.raw;
    },
    async onSubmit() {
      if (!this.file || !this.gxDate) return;
      this.loading = true;
      try {
        const res = await upSupGxConOffPic(this.supplierCode, this.gxDate, this.file);
        this.$message.success(res.msg || '上传成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
