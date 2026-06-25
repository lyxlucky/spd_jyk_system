<template>
  <div class="ele-body spd-page third-inventory-query-page">
    <el-card shadow="never" class="third-inventory-query-card">
      <ThirdInventoryQuerySearch ref="search" :exporting="exporting" @search="reload" @export="onExport" />
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">三级库申领库存列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            :page-size="30"
            :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
            cache-key="ThirdInventoryQueryTable"
          />
        </div>
      </div>
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
      tableHeight: 'calc(100vh - 320px)',
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
.third-inventory-query-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.third-inventory-query-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
