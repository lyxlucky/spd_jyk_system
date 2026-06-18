<template>
  <div class="ele-body spd-page tertiary-inventory-page">
    <el-card shadow="never" class="tertiary-inventory-card">
      <TertiaryInventorySearch ref="search" :exporting="exporting" @search="reload" @export="onExport" />
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">三级库存列表</div>
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
            cache-key="TertiaryInventoryTable"
          >
            <template v-slot:action="{ row }">
              <el-link type="primary" :underline="false" @click="openDetail(row)">查看</el-link>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <TertiaryInventoryDetailDialog
      :visible.sync="detailVisible"
      :varietie-code="detailParams.varietieCode"
      :dept-two-code="detailParams.deptTwoCode"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import TertiaryInventorySearch from './components/TertiaryInventorySearch.vue';
import TertiaryInventoryDetailDialog from './components/TertiaryInventoryDetailDialog.vue';
import { getTertiaryInventoryColumns } from './columns';
import { EXPORT_HEADERS, rowToExportArray } from './utils';
import { tertiaryInventoryList } from '@/api/Inventory/TertiaryInventory';

export default {
  name: 'TertiaryInventory',
  components: { TertiaryInventorySearch, TertiaryInventoryDetailDialog },
  data() {
    return {
      columns: getTertiaryInventoryColumns(),
      tableHeight: 'calc(100vh - 300px)',
      selection: [],
      lastWhere: {},
      exporting: false,
      detailVisible: false,
      detailParams: {
        varietieCode: '',
        deptTwoCode: ''
      }
    };
  },
  methods: {
    async datasource({ page, limit, where }) {
      const w = where || this.lastWhere;
      this.lastWhere = w;
      try {
        const res = await tertiaryInventoryList(w, page || 1, limit || 30);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    openDetail(row) {
      if (!row?.VARIETIE_CODE || !row?.DEPT_TWO_CODE) {
        Message.warning('缺少品种或科室信息');
        return;
      }
      this.detailParams = {
        varietieCode: row.VARIETIE_CODE,
        deptTwoCode: row.DEPT_TWO_CODE
      };
      this.detailVisible = true;
    },
    async onExport() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const res = await tertiaryInventoryList(where, 1, 999999);
        const data = [EXPORT_HEADERS];
        (res.result || []).forEach((r, i) => data.push(rowToExportArray(r, i)));
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '三级库存');
        writeFile(book, '三级库存.xlsx');
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
.tertiary-inventory-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tertiary-inventory-page >>> .el-table th .cell {
  white-space: nowrap;
}

.tertiary-inventory-page >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}

.tertiary-inventory-page >>> .action-col .el-link {
  font-size: 12px;
  line-height: 23px;
  vertical-align: middle;
}
</style>
