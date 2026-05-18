<template>
  <div class="win-show-section">
    <div class="section-head">
      <slot name="toolbar-left" />
      <el-button
        v-if="exportPermission"
        v-permission="exportPermission"
        size="small"
        type="primary"
        plain
        icon="el-icon-download"
        :loading="exporting"
        @click="$emit('export')"
      >
        导出
      </el-button>
    </div>
    <h5 v-if="title" class="section-title">{{ title }}</h5>
    <slot name="filters" />
    <ele-pro-table
      ref="table"
      :height="height"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="innerSelection"
      :cache-key="cacheKey"
      v-bind="tableProps"
      @sort-change="onSortChange"
    >
      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
export default {
  name: 'WinShowSection',
  props: {
    title: { type: String, default: '' },
    cacheKey: { type: String, required: true },
    columns: { type: Array, required: true },
    datasource: { type: Function, required: true },
    height: { type: [Number, String], default: 395 },
    pageSize: { type: Number, default: 50 },
    pageSizes: { type: Array, default: () => [50, 100, 99999] },
    exportPermission: { type: String, default: '' },
    exporting: { type: Boolean, default: false },
    selection: { type: Array, default: () => [] },
    tableProps: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      sortField: '',
      sortOrder: ''
    };
  },
  computed: {
    innerSelection: {
      get() {
        return this.selection;
      },
      set(v) {
        this.$emit('update:selection', v);
      }
    }
  },
  methods: {
    reload(extra) {
      this.$refs.table.reload({ page: 1, ...extra });
    },
    onSortChange({ prop, order }) {
      this.sortField = prop || '';
      this.sortOrder =
        order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      this.$emit('sort-change', { field: this.sortField, order: this.sortOrder });
    },
    getSort() {
      return { field: this.sortField, order: this.sortOrder };
    }
  }
};
</script>

<style scoped>
.win-show-section {
  margin-top: 10px;
}
.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
}
.text-expired {
  color: red;
}
</style>
