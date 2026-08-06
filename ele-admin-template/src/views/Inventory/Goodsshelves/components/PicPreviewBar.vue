<template>
  <div class="pic-preview-bar">
    <div v-if="!hasContext" class="pic-preview-bar__empty">
      点击下方列表某一行，可查看该行关联的检验报告 / 单号批次图片
    </div>
    <div v-else-if="loading" class="pic-preview-bar__empty">图片加载中...</div>
    <div v-else-if="!pics.length" class="pic-preview-bar__empty">
      当前行暂无已上传图片
    </div>
    <div v-else class="pic-preview-bar__list">
      <div v-for="(pic, idx) in pics" :key="`${pic.name}-${idx}`" class="pic-preview-bar__card">
        <el-image
          class="pic-preview-bar__item"
          :src="pic.url"
          fit="contain"
          :preview-src-list="previewUrls"
          :initial-index="idx"
        >
          <div slot="error" class="pic-preview-bar__error">加载失败</div>
        </el-image>
        <button
          type="button"
          class="pic-preview-bar__close"
          title="删除"
          @click.stop="onDelete(pic)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getStaticBaseUrl } from '@/config/setting';
import {
  getBatchPicture,
  getOrderPicture,
  deletePhotoByPicName
} from '@/api/Inventory/Goodsshelves';

function picUrl(name) {
  if (!name || name === '-') return '';
  const base = (getStaticBaseUrl() || '').replace(/\/$/, '');
  const file = String(name).replace(/^.*[/\\]/, '');
  if (!file) return '';
  return `${base}/Upload/ProPic/${file}`;
}

export default {
  name: 'GoodsshelvesPicPreviewBar',
  props: {
    batchId: { type: [String, Number], default: '' },
    orderNum: { type: String, default: '' },
    batchKey: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      pics: [],
      loadSeq: 0
    };
  },
  computed: {
    hasContext() {
      return !!(this.batchId || this.normalizedOrderNum || this.batchKey);
    },
    normalizedOrderNum() {
      const raw = String(this.orderNum || '');
      return raw.split('/')[0] || '';
    },
    previewUrls() {
      return this.pics.map((p) => p.url);
    }
  },
  watch: {
    batchId() {
      this.reload();
    },
    orderNum() {
      this.reload();
    },
    batchKey() {
      this.reload();
    }
  },
  methods: {
    async reload() {
      const seq = ++this.loadSeq;
      this.pics = [];
      if (!this.hasContext) return;
      this.loading = true;
      const list = [];
      const seen = new Set();
      const pushPic = (name) => {
        const file = String(name || '').replace(/^.*[/\\]/, '');
        const url = picUrl(file);
        if (!url || seen.has(file)) return;
        seen.add(file);
        list.push({ name: file, url });
      };
      try {
        if (this.batchId) {
          try {
            const res = await getBatchPicture(this.batchId);
            pushPic(res?.result);
          } catch (e) {
            // 无检验报告时接口可能 400
          }
        }
        try {
          const res = await getOrderPicture({
            batchId: this.batchId || '',
            orderNum: this.normalizedOrderNum || '',
            type: '0',
            batch: this.batchKey || ''
          });
          const rows = Array.isArray(res?.result) ? res.result : [];
          rows.forEach((r) => pushPic(r?.PIC_PATH));
        } catch (e) {
          // ignore
        }
        if (seq === this.loadSeq) {
          this.pics = list;
        }
      } finally {
        if (seq === this.loadSeq) {
          this.loading = false;
        }
      }
    },
    async onDelete(pic) {
      if (!pic?.name) return;
      try {
        await this.$confirm('确定删除图片吗?', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      try {
        const res = await deletePhotoByPicName(pic.name);
        this.$message.success(res?.msg || '图片删除成功');
        this.$emit('deleted', pic);
        await this.reload();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.pic-preview-bar {
  height: 160px;
  margin-bottom: 8px;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: auto;
  flex: none;
}
.pic-preview-bar__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 13px;
}
.pic-preview-bar__list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}
.pic-preview-bar__card {
  position: relative;
  width: 120px;
  height: 140px;
}
.pic-preview-bar__item {
  width: 120px;
  height: 140px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  cursor: pointer;
  background: #fafafa;
}
.pic-preview-bar__close {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  opacity: 0.85;
}
.pic-preview-bar__close:hover {
  opacity: 1;
  background: rgba(245, 108, 108, 0.95);
}
.pic-preview-bar__error {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
  font-size: 12px;
}
</style>
