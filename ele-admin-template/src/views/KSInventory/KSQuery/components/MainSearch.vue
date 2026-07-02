<template>
  <div class="ks-query-main-search spd-panel__body">
    <el-form size="mini" label-width="0" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.varietie" clearable placeholder="品种编码、品种全称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.group" clearable placeholder="分组查询" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.scqy" clearable placeholder="生产企业" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <span class="inline-label">是否包含0的库存：</span>
            <el-select v-model="form.isContainZero" class="ele-fluid">
              <el-option label="不包含0的库存" :value="false" />
              <el-option label="包含0的库存" :value="true" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="action-col">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-edit" @click="$emit('up-down')">上下限修改</el-button>
          <el-button icon="el-icon-full-screen" @click="$emit('scan-inbound')">扫单入库</el-button>
          <el-button
            v-if="canExportInventory"
            icon="el-icon-download"
            :loading="exportingInventory"
            @click="$emit('export-inventory')"
          >
            导出盘点表
          </el-button>
          <el-button
            v-if="canExportExcel"
            icon="el-icon-document"
            :loading="exportingExcel"
            @click="$emit('export-excel')"
          >
            导出Excel
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { hasExportPermission } from '../utils';

const defaultForm = () => ({
  varietie: '',
  group: '',
  scqy: '',
  isContainZero: false
});

export default {
  name: 'KSQueryMainSearch',
  props: {
    exportingInventory: Boolean,
    exportingExcel: Boolean
  },
  data() {
    return {
      form: defaultForm()
    };
  },
  computed: {
    canExportInventory() {
      return hasExportPermission('export-KSQuery-pddc');
    },
    canExportExcel() {
      return hasExportPermission('export-KSQuery-kcdc');
    }
  },
  methods: {
    getWhere() {
      return { ...this.form };
    },
    search() {
      this.$emit('search', this.getWhere());
    },
    reset() {
      this.form = defaultForm();
    }
  }
};
</script>

<style scoped>
.inline-label {
  font-size: 12px;
  color: #606266;
  margin-right: 4px;
  white-space: nowrap;
}
.action-col {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.action-col .el-button {
  margin-left: 0;
}
</style>
