<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="innerVisible"
    width="560px"
    append-to-body
    destroy-on-close
  >
    <div class="meta">
      <div>类型：{{ typeLabel }}</div>
      <div v-if="type === '1'">单号：{{ orderNum }}</div>
      <div v-else-if="type === '2'">批次 ID：{{ batchId }}</div>
      <div v-else>批号：{{ batch }}</div>
    </div>
    <el-upload
      drag
      action=""
      multiple
      accept=".jpg,.jpeg,.png"
      :show-file-list="true"
      :http-request="onUpload"
      :disabled="uploading"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将 jpg/png 拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">仅支持 jpg、png</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { uploadOrderPics } from '@/api/Inventory/Goodsshelves';

const TYPE_TITLE = {
  '1': '单号相关图片',
  '2': '品种批次相关图片',
  '3': '生产批号相关图片'
};

export default {
  name: 'GoodsshelvesUploadOrderPicDialog',
  props: {
    visible: Boolean,
    /** 1单号 2批次 3生产批号 */
    type: { type: String, default: '1' },
    orderNum: { type: String, default: '0' },
    orderType: { type: String, default: '0' },
    batchId: { type: [String, Number], default: '0' },
    batch: { type: String, default: '0' }
  },
  data() {
    return {
      innerVisible: false,
      uploading: false
    };
  },
  computed: {
    typeLabel() {
      return TYPE_TITLE[String(this.type)] || '订单图片';
    },
    dialogTitle() {
      return `上传${this.typeLabel}`;
    },
    uploadPayload() {
      // 对齐老系统 uploadOrderPic：按 TYPE 清零无关字段
      const t = String(this.type);
      if (t === '1') {
        return {
          orderNum: this.orderNum || '0',
          orderType: this.orderType || '0',
          type: '1',
          batchId: '0',
          batch: '0'
        };
      }
      if (t === '2') {
        return {
          orderNum: '0',
          orderType: this.orderType || '0',
          type: '2',
          batchId: this.batchId || '0',
          batch: '0'
        };
      }
      return {
        orderNum: '0',
        orderType: this.orderType || '0',
        type: '3',
        batchId: '0',
        batch: this.batch || '0'
      };
    }
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
    async onUpload({ file }) {
      const ext = (file.name || '').split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        this.$message.warning('仅支持 jpg、png');
        return;
      }
      this.uploading = true;
      try {
        const res = await uploadOrderPics(this.uploadPayload, file);
        this.$message.success(res?.msg || '上传成功');
        this.$emit('uploaded');
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped>
.meta {
  margin-bottom: 12px;
  font-size: 12px;
  color: #606266;
  line-height: 1.7;
}
</style>
