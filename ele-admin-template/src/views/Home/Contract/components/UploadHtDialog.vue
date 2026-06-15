<template>
  <el-dialog
    title="上传合同文件"
    :visible.sync="dialogVisible"
    width="460px"
    append-to-body
    :close-on-click-modal="false"
    @closed="file = null"
  >
    <el-upload
      drag
      action=""
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
      :auto-upload="false"
      :limit="1"
      :on-change="onFileChange"
      :on-remove="() => (file = null)"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">支持 jpg/png/pdf/doc/xls 等，≤20MB</div>
    </el-upload>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="!file" @click="onSubmit">上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadHtPic } from '@/api/Home/Contract';

export default {
  name: 'UploadHtDialog',
  props: {
    visible: Boolean,
    contractCode: [String, Number]
  },
  data() {
    return { loading: false, file: null };
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
    onFileChange(f) {
      this.file = f.raw;
    },
    async onSubmit() {
      if (!this.file || !this.contractCode) return;
      this.loading = true;
      try {
        await uploadHtPic(this.contractCode, this.file);
        this.$message.success('上传成功');
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
