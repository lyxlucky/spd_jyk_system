<template>
  <div class="ele-body third-inventory-query-page">
    <el-card shadow="never">
      <div class="page-title">三级库申领库存查询</div>
      <ThirdInventoryQuerySearch ref="search" :exporting="exporting" @search="reload" @export="onExport" />
      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="30"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="ThirdInventoryQueryTable"
      />
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ThirdInventoryQuerySearch from './components/ThirdInventoryQuerySearch.vue';
import { getThirdInventoryQueryColumns } from './columns';
import { enrichRow, openExcelFile } from './utils';
import { thirdInventoryList, excelThirdInventory } from '@/api/Inventory/ThirdInventoryQuery';

export default {
  name: 'ThirdInventoryQuery',
  components: { ThirdInventoryQuerySearch },
  data() {
    return {
      columns: getThirdInventoryQueryColumns(),
      tableHeight: 'calc(100vh - 280px)',
      selection: [],
      lastWhere: {},
      exporting: false
    };
  },
  methods: {
    async datasource({ page, limit, where }) {
      const w = where || this.lastWhere;
      this.lastWhere = w;
      try {
        const res = await thirdInventoryList(w, page || 1, limit || 30);
        const list = (res.result || []).map(enrichRow);
        return { count: res.total || 0, list };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    async onExport() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const res = await excelThirdInventory(where);
        openExcelFile(res.msg);
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
.third-inventory-query-page .page-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}
</style>
