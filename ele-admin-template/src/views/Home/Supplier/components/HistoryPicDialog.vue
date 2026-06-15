<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="820px"
    append-to-body
    @open="loadPics"
    @closed="pics = []"
  >
    <div v-loading="loading" class="pic-wrap">
      <template v-if="pics.length">
        <img
          v-for="(item, idx) in pics"
          :key="idx"
          v-viewer
          class="pic-item"
          :src="picUrl(item.Licence_Pictrue_Path)"
          :alt="'证照' + (idx + 1)"
        />
      </template>
      <el-empty v-else description="暂无证照图片" />
    </div>
  </el-dialog>
</template>

<script>
import { getSupplierDetail } from '@/api/Home/Supplier';
import { proPicUrl } from '../utils';

export default {
  name: 'HistoryPicDialog',
  props: {
    visible: Boolean,
    supplierCode: [String, Number],
    supplierName: String
  },
  data() {
    return { loading: false, pics: [] };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    title() {
      return this.supplierName ? `${this.supplierName} - 历史图片` : '供应商历史图片';
    }
  },
  methods: {
    picUrl(name) {
      return proPicUrl(name);
    },
    async loadPics() {
      if (!this.supplierCode) return;
      this.loading = true;
      try {
        const res = await getSupplierDetail(this.supplierCode);
        const detail = res.result || {};
        this.pics = detail.PicList || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.pics = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.pic-wrap {
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pic-item {
  width: 120px;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
