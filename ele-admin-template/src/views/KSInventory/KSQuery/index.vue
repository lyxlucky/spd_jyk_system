<template>
  <div class="ele-body spd-page ks-query-page">
    <el-card shadow="never" class="ks-query-card">
      <!-- 主表查询 -->
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">科室库存查询</div>
        <MainSearch
          ref="mainSearch"
          :exporting-inventory="exportingInventory"
          :exporting-excel="exportingExcel"
          @search="reloadMain"
          @up-down="openUpDown"
          @scan-inbound="scanVisible = true"
          @export-inventory="onExportInventory"
          @export-excel="onExportMainExcel"
        />
      </div>

      <!-- 主表 -->
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">库存汇总</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="mainTable"
            class="data-table"
            size="mini"
            border
            stripe
            highlight-current-row
            :toolbar="false"
            :height="tableHeight"
            :columns="mainColumns"
            :datasource="mainDatasource"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            :row-class-name="mainRowClassName"
            cache-key="KSQueryMainTable"
            @current-change="onMainRowChange"
          >
            <template v-slot:lower="{ row }">
              <span :class="{ 'lower-warning': isLowerWarning(row) }">{{ row.Lower }}</span>
            </template>
          </ele-pro-table>
        </div>
      </div>

      <!-- 明细查询 -->
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">定数码明细</div>
        <DetailSearch
          ref="detailSearch"
          :exporting-selected="exportingSelected"
          :exporting-all="exportingAll"
          :exporting-batch="exportingBatch"
          @search="reloadDetail"
          @reset-all="resetDetailAll"
          @export-selected="onExportSelected"
          @export-all="onExportAllDetail"
          @export-batch="onExportBatch"
        />
      </div>

      <!-- 明细表 -->
      <div class="spd-panel spd-table-panel">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="detailTable"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :height="tableHeight"
            :columns="detailColumns"
            :datasource="detailDatasource"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="KSQueryDetailTable"
          >
            <template v-slot:batchProdDate="{ row }">
              {{ fmtDate10(row.Batch_Production_Date) }}
            </template>
            <template v-slot:batchValidity="{ row }">
              <span class="validity-tag" :style="validityPeriodStyle(row)">
                {{ fmtDate10(row.Batch_Validity_Period) }}
              </span>
            </template>
            <template v-slot:upShelfState="{ row }">
              {{ fmtUpShelfState(row.Up_Shelf_State) }}
            </template>
            <template v-slot:settleState="{ row }">
              {{ fmtSettleState(row) }}
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <UpDownDialog :visible.sync="upDownVisible" :row="selectedMainRow" @done="reloadMain()" />
    <ScanInboundDialog :visible.sync="scanVisible" />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import MainSearch from './components/MainSearch.vue';
import DetailSearch from './components/DetailSearch.vue';
import UpDownDialog from './components/UpDownDialog.vue';
import ScanInboundDialog from './components/ScanInboundDialog.vue';
import { getMainColumns, getDetailColumns } from './columns';
import {
  fmtDate10,
  fmtUpShelfState,
  fmtSettleState,
  validityPeriodStyle,
  openExcelFile
} from './utils';
import {
  parseSort,
  searchMainStock,
  searchDefStock,
  exportDeptToExcel,
  exportDeptDefToExcel,
  exportDeptBatchToExcel,
  importInventoryData,
  getDeptJson
} from '@/api/KSInventory/KSQuery';

export default {
  name: 'KSQuery',
  components: {
    MainSearch,
    DetailSearch,
    UpDownDialog,
    ScanInboundDialog
  },
  data() {
    return {
      tableHeight: 'calc((100vh - 420px) / 2)',
      mainColumns: getMainColumns(),
      selectedMainRow: null,
      mainWhere: {},
      detailWhere: {},
      mainSort: { field: '', order: '' },
      detailSort: { field: '', order: '' },
      upDownVisible: false,
      scanVisible: false,
      exportingInventory: false,
      exportingExcel: false,
      exportingSelected: false,
      exportingAll: false,
      exportingBatch: false,
      showSettleColumn: true
    };
  },
  computed: {
    detailColumns() {
      return getDetailColumns(this.showSettleColumn);
    }
  },
  created() {
    const list = this.$store.state.user?.info?.permission_group || [];
    this.showSettleColumn = list.some((p) => p.Permission_Url === '科室结算方式-消耗结算');
    this.detailWhere = this.buildDefaultDetailWhere();
  },
  methods: {
    fmtDate10,
    fmtUpShelfState,
    fmtSettleState,
    validityPeriodStyle,
    buildDefaultDetailWhere() {
      const deptCode = this.$store.state.user?.info?.DeptNow?.Dept_Two_Code || '';
      return {
        sourceFrom: deptCode,
        varietieCode: '',
        coefficient: '',
        currUpShelfState: '',
        regionCode: '0',
        condition: '',
        condition1: '',
        jxqSatte: '0',
        isHaveTh: '0'
      };
    },
    isLowerWarning(row) {
      return parseInt(row.Def_Qty, 10) < parseInt(row.Lower, 10);
    },
    mainRowClassName({ row }) {
      if (this.isLowerWarning(row)) {
        return 'ks-query-row-lower';
      }
      return '';
    },
    async mainDatasource({ page, limit, where, order }) {
      const w = where || this.mainWhere;
      this.mainWhere = w;
      this.mainSort = parseSort(order);
      try {
        const res = await searchMainStock(w, page, limit, this.mainSort);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async detailDatasource({ page, limit, where, order }) {
      const w = { ...this.detailWhere, ...(where || {}) };
      this.detailWhere = w;
      this.detailSort = parseSort(order);
      try {
        const res = await searchDefStock(w, page, limit, this.detailSort);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reloadMain(where) {
      this.mainWhere = where || this.$refs.mainSearch.getWhere();
      this.$refs.mainTable.reload({ page: 1, where: this.mainWhere });
    },
    reloadDetail(where) {
      const extra = where || this.$refs.detailSearch.getWhere();
      this.detailWhere = { ...this.detailWhere, ...extra };
      this.$refs.detailTable.reload({ page: 1, where: this.detailWhere });
    },
    onMainRowChange(row) {
      this.selectedMainRow = row;
      if (!row) return;
      const deptCode = this.$store.state.user?.info?.DeptNow?.Dept_Two_Code || '';
      this.detailWhere = {
        ...this.detailWhere,
        ...this.$refs.detailSearch.getWhere(),
        sourceFrom: deptCode,
        varietieCode: row.Varietie_Code,
        coefficient: row.Coefficient,
        currUpShelfState: row.Up_Shelf_State,
        regionCode: row.Region_Code || '0'
      };
      this.$refs.detailTable.reload({ page: 1, where: this.detailWhere });
    },
    resetDetailAll() {
      this.selectedMainRow = null;
      this.$refs.mainTable?.setCurrentRow?.();
      this.$refs.detailSearch.resetFilters();
      this.detailWhere = this.buildDefaultDetailWhere();
      this.$refs.detailTable.reload({ page: 1, where: this.detailWhere });
    },
    openUpDown() {
      if (!this.selectedMainRow) {
        Message.warning('请先在上方表格选择品种');
        return;
      }
      this.upDownVisible = true;
    },
    async onExportInventory() {
      this.exportingInventory = true;
      try {
        const res = await importInventoryData();
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingInventory = false;
      }
    },
    async onExportMainExcel() {
      this.exportingExcel = true;
      try {
        const where = this.$refs.mainSearch.getWhere();
        const res = await exportDeptToExcel(where, this.mainSort);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingExcel = false;
      }
    },
    async onExportSelected() {
      if (!this.detailWhere.varietieCode) {
        Message.warning('请选择品种');
        return;
      }
      this.exportingSelected = true;
      try {
        const res = await exportDeptDefToExcel(
          { ...this.detailWhere, isHaveTh: '0' },
          this.detailSort
        );
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingSelected = false;
      }
    },
    async onExportAllDetail() {
      this.exportingAll = true;
      try {
        const deptList = JSON.parse(getDeptJson());
        const res = await exportDeptDefToExcel(
          {
            sourceFrom: deptList[0] || '',
            varietieCode: '',
            coefficient: '',
            currUpShelfState: '',
            regionCode: '',
            condition: '',
            isHaveTh: '0'
          },
          this.detailSort
        );
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingAll = false;
      }
    },
    async onExportBatch() {
      this.exportingBatch = true;
      try {
        const deptCode = this.$store.state.user?.info?.DeptNow?.Dept_Two_Code || '';
        const res = await exportDeptBatchToExcel(
          {
            sourceFrom: deptCode,
            varietieCode: '',
            coefficient: '',
            currUpShelfState: '',
            regionCode: '',
            condition: '',
            isHaveTh: '0'
          },
          this.detailSort
        );
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingBatch = false;
      }
    }
  }
};
</script>

<style scoped>
.ks-query-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lower-warning {
  color: #f56c6c;
  font-weight: 600;
}

.validity-tag {
  display: inline-block;
  padding: 0 6px;
  border-radius: 2px;
  line-height: 22px;
}

::v-deep .ks-query-row-lower > td {
  background-color: #fde2e2 !important;
}
</style>
