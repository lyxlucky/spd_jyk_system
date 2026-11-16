<template>
  <el-dialog
    title="科室入库汇总"
    :visible="visible"
    width="90%"
    top="6vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="onVisibleChange"
  >
    <div class="summary-toolbar">
      <el-button
        type="success"
        icon="el-icon-download"
        size="mini"
        :disabled="!rows.length"
        @click="exportExcel"
      >
        导出Excel
      </el-button>
      <span class="summary-meta">共 {{ rows.length }} 条</span>
    </div>
    <el-table
      v-loading="loading"
      :data="rows"
      height="60vh"
      border
      size="mini"
      style="width: 100%"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
        :formatter="col.formatter"
        show-overflow-tooltip
      />
    </el-table>
  </el-dialog>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { GetDeptInStockDetail2 } from '@/api/KSInventory/DeptInStockQuery/index';
  import { SUMMARY_COLUMNS } from '../columns';

  export default {
    name: 'DeptInStockSummaryDialog',
    props: {
      visible: { type: Boolean, default: false },
      where: { type: Object, default: () => ({}) },
      order: { type: Object, default: () => ({}) }
    },
    data() {
      return {
        columns: SUMMARY_COLUMNS,
        rows: [],
        loading: false
      };
    },
    watch: {
      visible(value) {
        if (value) {
          this.load();
        }
      }
    },
    methods: {
      onVisibleChange(value) {
        this.$emit('update:visible', value);
      },
      load() {
        this.loading = true;
        this.rows = [];
        GetDeptInStockDetail2({
          page: 1,
          limit: 999999,
          where: this.where || {},
          order: this.order || {}
        })
          .then((res) => {
            this.rows = res.result || [];
          })
          .catch((error) => {
            this.rows = [];
            this.$message.error(error.message || '汇总查询失败');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      exportExcel() {
        const array = [this.columns.map((col) => col.label)];
        this.rows.forEach((row) => {
          array.push(
            this.columns.map((col) => {
              if (typeof col.formatter === 'function') {
                return col.formatter(row);
              }
              return row[col.prop] == null ? '' : row[col.prop];
            })
          );
        });
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet(array) }
          },
          '科室入库汇总.xlsx'
        );
        this.$message.success('导出成功');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .summary-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .summary-meta {
    font-size: 13px;
    color: #909399;
  }
</style>
