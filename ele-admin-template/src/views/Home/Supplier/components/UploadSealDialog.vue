<template>
  <el-dialog
    title="上传送货章"
    :visible.sync="dialogVisible"
    width="460px"
    append-to-body
    :close-on-click-modal="false"
    @closed="file = null"
  >
    <el-upload
      drag
      action=""
      accept=".jpg,.jpeg,.png,.pdf"
      :auto-upload="false"
      :limit="1"
      :on-change="onFileChange"
      :on-remove="() => (file = null)"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">支持 jpg / png / pdf，图片≤2MB，pdf≤30MB</div>
    </el-upload>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="!file" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upSupOffPic } from '@/api/Home/Supplier';

export default {
  name: 'UploadSealDialog',
  props: {
    visible: Boolean,
    supplierCode: [String, Number]
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
    onFileChange(file) {
      this.file = file.raw;
    },
    async onSubmit() {
      if (!this.file) return;
      this.loading = true;
      try {
        const res = await upSupOffPic(this.supplierCode, this.file);
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
