<template>
  <div class="expiry-section">
    <h5 class="section-title">{{ title }}</h5>
    <div class="toolbar">
      <slot name="filters" :monty="monty" :on-monty-change="onMontyChange" :extra="extra" :on-extra-change="onExtraChange">
        <span v-if="filterOptions.length" class="filter-wrap">
          <el-select v-model="extra" size="small" style="width: 180px" @change="onExtraChange">
            <el-option
              v-for="opt in filterOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </span>
        <span class="month-label">请选择近过期日期月数：</span>
        <el-select v-model="monty" size="small" style="width: 120px" @change="onMontyChange">
          <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
        </el-select>
      </slot>
      <el-button
        v-if="exportPermission"
        v-permission="exportPermission"
        size="small"
        type="primary"
        plain
        icon="el-icon-download"
        :loading="exporting"
        @click="onExport"
      >
        导出
      </el-button>
    </div>
    <ele-pro-table
      ref="table"
      :height="265"
      :page-size="10"
      :page-sizes="[10, 30, 60, 90, 150, 300]"
      :columns="columns"
      :datasource="datasource"
      :cache-key="cacheKey"
      @sort-change="onSortChange"
    >
      <template v-slot:Auth_Valid="{ row }">
        <span :class="{ 'text-expired': expiryDisplay(row.Auth_Valid).expired }">
          {{ expiryDisplay(row.Auth_Valid).text }}
        </span>
      </template>
      <template v-slot:DET_CONTRACT_END="{ row }">
        <span :class="{ 'text-expired': expiryDisplay(row.DET_CONTRACT_END).expired }">
          {{ expiryDisplay(row.DET_CONTRACT_END).text }}
        </span>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import { MONTH_OPTIONS, formatContractExpiryDisplay } from '../utils';

export default {
  name: 'ExpiryTablePanel',
  props: {
    title: { type: String, required: true },
    cacheKey: { type: String, required: true },
    columns: { type: Array, required: true },
    fetchList: { type: Function, required: true },
    exportPermission: { type: String, default: '' },
    exportFileName: { type: String, default: 'export.xlsx' },
    exportHeaders: { type: Array, default: () => [] },
    mapExportRow: { type: Function, default: null },
    filterOptions: { type: Array, default: () => [] },
    defaultExtra: { type: String, default: '0' },
    prodSearchType: { type: Boolean, default: false }
  },
  data() {
    return {
      monthOptions: MONTH_OPTIONS,
      monty: '0',
      extra: this.defaultExtra,
      searchType: '0',
      sortField: '',
      sortOrder: '',
      exporting: false
    };
  },
  methods: {
    expiryDisplay: formatContractExpiryDisplay,
    getQuery() {
      const q = {
        monty: this.monty,
        field: this.sortField,
        order: this.sortOrder
      };
      if (this.prodSearchType) q.searchType = this.searchType;
      if (this.filterOptions.length) q.extra = this.extra;
      return q;
    },
    async datasource({ page, limit }) {
      try {
        const res = await this.fetchList({
          page,
          size: limit,
          ...this.getQuery()
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload() {
      this.$refs.table.reload({ page: 1 });
    },
    onMontyChange() {
      if (this.prodSearchType) this.searchType = '2';
      this.reload();
    },
    onExtraChange() {
      this.reload();
    },
    onSortChange({ prop, order }) {
      this.sortField = prop || '';
      this.sortOrder =
        order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      if (this.prodSearchType) this.searchType = '2';
      this.reload();
    },
    async onExport() {
      if (!this.mapExportRow) return;
      this.exporting = true;
      try {
        const res = await this.fetchList({ page: 1, size: 999999, ...this.getQuery() });
        const rows = (res.result || []).map((r) => this.mapExportRow(r));
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet([this.exportHeaders, ...rows]) }
          },
          this.exportFileName
        );
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.expiry-section {
  margin-top: 30px;
}
.expiry-section:first-child {
  margin-top: 10px;
}
.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.month-label {
  font-size: 12px;
  color: #606266;
}
.text-expired {
  color: red;
}
</style>
