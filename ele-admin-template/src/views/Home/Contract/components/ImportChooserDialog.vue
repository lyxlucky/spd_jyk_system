<template>
  <el-dialog
    title="请选择操作"
    :visible.sync="dialogVisible"
    width="360px"
    append-to-body
    :close-on-click-modal="true"
  >
    <div class="chooser-body">
      <el-upload
        action=""
        accept=".xlsx,.xls"
        :show-file-list="false"
        :http-request="onUpload"
      >
        <el-button type="primary" :loading="loading">导入</el-button>
      </el-upload>
      <el-button @click="onDownloadTemplate">下载模板</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { importContractExcel } from '@/api/Home/Contract';
import { downloadContractImportTemplate } from '../utils';

export default {
  name: 'ImportChooserDialog',
  props: {
    visible: Boolean,
    templateType: { type: String, required: true }
  },
  data() {
    return { loading: false };
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
    onDownloadTemplate() {
      downloadContractImportTemplate(this.templateType);
    },
    async onUpload({ file }) {
      this.loading = true;
      try {
        const res = await importContractExcel(this.templateType, file);
        if (res?.code == 200 || res?.code === '200') {
          this.$message.success(res.msg || '导入成功');
        } else {
          this.$alert(res?.msg || '导入完成', '提示');
        }
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '导入失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.chooser-body {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;
}
</style>
