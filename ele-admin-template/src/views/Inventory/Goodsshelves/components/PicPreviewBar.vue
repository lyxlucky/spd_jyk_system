<template>
  <div class="pic-preview-bar">
    <div v-if="!hasContext" class="pic-preview-bar__empty">
      点击下方列表某一行，可查看该行关联的检验报告 / 单号批次图片
    </div>
    <div v-else-if="loading" class="pic-preview-bar__empty">图片加载中...</div>
    <div v-else-if="!urls.length" class="pic-preview-bar__empty">
      当前行暂无已上传图片
    </div>
    <div v-else class="pic-preview-bar__list">
      <el-image
        v-for="(url, idx) in urls"
        :key="`${url}-${idx}`"
        class="pic-preview-bar__item"
        :src="url"
        fit="contain"
        :preview-src-list="urls"
        :initial-index="idx"
      >
        <div slot="error" class="pic-preview-bar__error">加载失败</div>
      </el-image>
    </div>
  </div>
</template>

<script>
import { getStaticBaseUrl } from '@/config/setting';
import {
  getBatchPicture,
  getOrderPicture
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
    /** 批次 ID */
    batchId: { type: [String, Number], default: '' },
    /** 入库/业务单号（可含 / 后缀，会取前半段） */
    orderNum: { type: String, default: '' },
    /** 生产批号/品种：BATCH/VARIETIE_CODE，对齐老系统 */
    batchKey: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      urls: [],
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
      this.urls = [];
      if (!this.hasContext) return;
      this.loading = true;
      const list = [];
      try {
        if (this.batchId) {
          try {
            const res = await getBatchPicture(this.batchId);
            const name = res?.result;
            const url = picUrl(name);
            if (url) list.push(url);
          } catch (e) {
            // 无检验报告时接口可能 400，忽略
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
          rows.forEach((r) => {
            const url = picUrl(r?.PIC_PATH);
            if (url && !list.includes(url)) list.push(url);
          });
        } catch (e) {
          // ignore
        }
        if (seq === this.loadSeq) {
          this.urls = list;
        }
      } finally {
        if (seq === this.loadSeq) {
          this.loading = false;
        }
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
.pic-preview-bar__item {
  width: 120px;
  height: 140px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  cursor: pointer;
  background: #fafafa;
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
