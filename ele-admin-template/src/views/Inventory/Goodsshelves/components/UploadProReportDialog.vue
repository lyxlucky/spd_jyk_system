<template>
  <el-dialog
    :title="title"
    :visible.sync="innerVisible"
    width="560px"
    append-to-body
    destroy-on-close
    @open="onOpen"
  >
    <div v-if="batchId" class="meta">批次 ID：{{ batchId }}</div>
    <div v-else class="warn">缺少批次标识，无法上传</div>
    <el-upload
      drag
      action=""
      multiple
      accept=".jpg,.jpeg,.png"
      :show-file-list="true"
      :http-request="onUpload"
      :disabled="!batchId || uploading"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将 jpg/png 拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">仅支持 jpg、png（检验报告图片）</div>
    </el-upload>
    <div v-if="previewUrl" class="preview">
      <div class="preview-title">当前已有检验报告</div>
      <el-image
        :src="previewUrl"
        fit="contain"
        style="width: 160px; height: 120px"
        :preview-src-list="[previewUrl]"
      />
      <el-button
        type="text"
        size="mini"
        style="color: #f56c6c"
        @click="onDeletePreview"
      >
        删除
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BACK_BASE_URL } from '@/config/setting';
import {
  uploadProPic,
  getBatchPicture,
  deletePhotoByPicName
} from '@/api/Inventory/Goodsshelves';

function picUrl(name) {
  if (!name || name === '-') return '';
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  return `${base}/Upload/ProPic/${name}`;
}

export default {
  name: 'GoodsshelvesUploadProReportDialog',
  props: {
    visible: Boolean,
    batchId: { type: [String, Number], default: '' },
    title: { type: String, default: '上传检验报告图片' }
  },
  data() {
    return {
      innerVisible: false,
      uploading: false,
      previewName: '',
      previewUrl: ''
    };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    async onOpen() {
      this.previewName = '';
      this.previewUrl = '';
      if (!this.batchId) return;
      try {
        const res = await getBatchPicture(this.batchId);
        if (res.result && res.result !== '-') {
          this.previewName = res.result;
          this.previewUrl = picUrl(res.result);
        }
      } catch (e) {
        // ignore
      }
    },
    async onUpload({ file }) {
      if (!this.batchId) {
        this.$message.warning('缺少批次标识');
        return;
      }
      const ext = (file.name || '').split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        this.$message.warning('仅支持 jpg、png');
        return;
      }
      this.uploading = true;
      try {
        const res = await uploadProPic(this.batchId, file);
        this.$message.success(res?.msg || '上传成功');
        this.$emit('uploaded');
        await this.onOpen();
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.uploading = false;
      }
    },
    async onDeletePreview() {
      if (!this.previewName) return;
      try {
        await this.$confirm('确定删除该检验报告图片吗？', '提示', {
          type: 'warning'
        });
        await deletePhotoByPicName(this.previewName);
        this.$message.success('删除成功');
        this.previewName = '';
        this.previewUrl = '';
        this.$emit('uploaded');
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.meta {
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;
}
.warn {
  margin-bottom: 10px;
  color: #e6a23c;
}
.preview {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.preview-title {
  font-size: 13px;
  color: #606266;
}
</style>
