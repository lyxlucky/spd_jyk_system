<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="860px"
    append-to-body
    @open="loadPics"
    @closed="onClosed"
  >
    <div class="toolbar">
      <el-upload
        action=""
        :show-file-list="false"
        :http-request="onUpload"
        accept=".jpg,.jpeg,.png"
        :disabled="!supplierCode || uploading"
      >
        <el-button size="mini" type="primary" :loading="uploading" icon="el-icon-upload2">
          上传证照(jpg/png)
        </el-button>
      </el-upload>
      <span class="tip">点击图片可预览；悬停可删除</span>
    </div>
    <div v-loading="loading" class="pic-wrap">
      <template v-if="pics.length">
        <div v-for="(item, idx) in pics" :key="idx" class="pic-card">
          <img
            class="pic-item"
            :src="picUrl(item.Licence_Pictrue_Path)"
            :alt="'证照' + (idx + 1)"
            @click="preview(item.Licence_Pictrue_Path)"
          />
          <el-button
            class="pic-del"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            :loading="deletingName === item.Licence_Pictrue_Path"
            @click.stop="onDelete(item)"
          />
        </div>
      </template>
      <el-empty v-else description="暂无证照图片" />
    </div>
  </el-dialog>
</template>

<script>
import { deleteOneSuppPic, getSupplierDetail, uploadSuppPic } from '@/api/Home/Supplier';
import { proPicUrl } from '../utils';

export default {
  name: 'HistoryPicDialog',
  props: {
    visible: Boolean,
    supplierCode: [String, Number],
    supplierName: String
  },
  data() {
    return {
      loading: false,
      uploading: false,
      deletingName: '',
      pics: []
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
    },
    title() {
      return this.supplierName ? `${this.supplierName} - 历史图片` : '供应商历史图片';
    }
  },
  methods: {
    picUrl(name) {
      return proPicUrl(name);
    },
    preview(name) {
      const url = this.picUrl(name);
      if (!url) return;
      this.$viewerApi({ images: [url] });
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
    },
    async onUpload({ file }) {
      const ext = String(file.name || '')
        .split('.')
        .pop()
        .toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        this.$message.warning('仅支持 jpg/png');
        return;
      }
      this.uploading = true;
      try {
        await uploadSuppPic(this.supplierCode, file);
        this.$message.success('上传成功');
        await this.loadPics();
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.uploading = false;
      }
    },
    async onDelete(item) {
      const name = item?.Licence_Pictrue_Path;
      if (!name) return;
      try {
        await this.$confirm('确认删除该证照图片？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.deletingName = name;
      try {
        await deleteOneSuppPic(this.supplierCode, name);
        this.$message.success('删除成功');
        await this.loadPics();
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      } finally {
        this.deletingName = '';
      }
    },
    onClosed() {
      this.pics = [];
      this.uploading = false;
      this.deletingName = '';
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.tip {
  font-size: 12px;
  color: #909399;
}
.pic-wrap {
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pic-card {
  position: relative;
}
.pic-item {
  width: 120px;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: block;
}
.pic-del {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.pic-card:hover .pic-del {
  opacity: 1;
}
</style>
