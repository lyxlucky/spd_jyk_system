<template>
  <span class="contract-import-btn">
    <el-dropdown
      split-button
      size="mini"
      :type="btnType"
      :disabled="disabled || loading"
      @click="triggerImport"
      @command="onCommand"
    >
      {{ loading ? '导入中...' : label }}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="download">
          <i class="el-icon-download" /> 下载模板
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      class="contract-import-btn__input"
      @change="onFilePicked"
    />
  </span>
</template>

<script>
import { importContractExcel } from '@/api/Home/Contract';
import { downloadContractImportTemplate } from '../utils';

export default {
  name: 'ContractImportButton',
  props: {
    label: { type: String, default: '导入' },
    templateType: { type: String, required: true },
    disabled: Boolean,
    btnType: { type: String, default: 'default' }
  },
  data() {
    return { loading: false };
  },
  methods: {
    triggerImport() {
      if (this.disabled || this.loading) return;
      const input = this.$refs.fileInput;
      if (!input) return;
      input.value = '';
      input.click();
    },
    onCommand(cmd) {
      if (cmd === 'download') {
        downloadContractImportTemplate(this.templateType);
      }
    },
    async onFilePicked(e) {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      this.loading = true;
      try {
        const res = await importContractExcel(this.templateType, file);
        if (res?.code == 200 || res?.code === '200') {
          this.$message.success(res.msg || '导入成功');
        } else {
          this.$alert(res?.msg || '导入完成', '提示');
        }
        this.$emit('done');
      } catch (err) {
        this.$message.error(err.message || '导入失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.contract-import-btn {
  display: inline-flex;
  vertical-align: middle;
}
.contract-import-btn__input {
  display: none;
}
.contract-import-btn ::v-deep .el-dropdown {
  vertical-align: middle;
}
</style>
