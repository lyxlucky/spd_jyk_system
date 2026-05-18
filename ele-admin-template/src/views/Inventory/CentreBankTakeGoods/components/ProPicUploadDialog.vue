<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="520px" append-to-body @closed="onClosed">
    <el-upload
      drag
      action=""
      accept=".jpg,.jpeg,.png"
      :show-file-list="true"
      :limit="5"
      :http-request="onUpload"
      :disabled="!detailId || uploading"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将 jpg/png 拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">仅支持 jpg、png，上传至当前品种批次</div>
    </el-upload>
    <div v-if="detailId" class="tip-id">明细 ID：{{ detailId }}</div>
    <div v-else class="tip-warn">请先选择品种明细行</div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Inventory/CentreBankTakeGoods';

export default {
  name: 'ProPicUploadDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '上传检验报告' },
    detailId: { type: [String, Number], default: '' },
    /** manual | system */
    mode: { type: String, default: 'manual' }
  },
  data() {
    return { innerVisible: false, uploading: false };
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
    onClosed() {
      this.uploading = false;
    },
    async onUpload({ file }) {
      if (!this.detailId) {
        Message.warning('缺少明细标识');
        return;
      }
      const ext = (file.name || '').split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        Message.warning('仅支持 jpg、png');
        return;
      }
      this.uploading = true;
      try {
        const fn = this.mode === 'system' ? api.uploadSystemProPic : api.uploadManualProPic;
        await fn(this.detailId, file);
        Message.success('上传成功');
        this.$emit('uploaded');
      } catch (e) {
        Message.error(e.message || '上传失败');
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped>
.tip-id {
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
}
.tip-warn {
  margin-top: 12px;
  color: #e6a23c;
  font-size: 13px;
}
</style>
