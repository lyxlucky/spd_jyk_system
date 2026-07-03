<template>
  <div class="ele-body spd-page warehouse-area-three-inventory-page">
    <el-card shadow="never" class="warehouse-area-three-inventory-card">
      <WarehouseAreaThreeInventorySearch
        ref="search"
        :exporting="exporting"
        @search="reload"
        @warehouse-change="onWarehouseChange"
        @export="onExport"
        @import-success="onImportSuccess"
      />

      <el-tabs v-model="activeTab" class="inventory-tabs" @tab-click="onTabChange">
        <el-tab-pane label="库房维度" name="warehouse">
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">库房/库区耗材汇总</div>
            <div class="spd-table-panel__wrap">
              <ele-pro-table
                ref="warehouseTable"
                class="data-table"
                size="mini"
                border
                stripe
                :toolbar="false"
                :header-overflow-hidden="false"
                :height="warehouseTableHeight"
                :columns="warehouseColumns"
                :datasource="warehouseDatasource"
                :page-size="30"
                :page-sizes="[30, 50, 100, 150, 200, 300, 999999]"
                cache-key="WarehouseAreaThreeInventoryWarehouseTable"
              >
                <template v-slot:warehouseAction="{ row }">
                  <el-link type="primary" :underline="false" @click="openDetail(row, 'warehouse')">明细</el-link>
                </template>
              </ele-pro-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="科室维度" name="dept">
          <div class="dept-dimension">
            <div class="spd-panel spd-table-panel dept-list-panel">
              <div class="spd-panel__head spd-panel__head--split">
                <span>SPD科室列表</span>
                <span class="selected-text">{{ selectedDeptText }}</span>
              </div>
              <div class="spd-table-panel__wrap">
                <ele-pro-table
                  ref="deptTable"
                  class="data-table"
                  size="mini"
                  border
                  stripe
                  highlight-current-row
                  :toolbar="false"
                  :header-overflow-hidden="false"
                  :height="deptTableHeight"
                  :columns="deptColumns"
                  :datasource="deptDatasource"
                  :page-size="20"
                  :page-sizes="[20, 50, 100, 150, 200, 300, 999999]"
                  cache-key="WarehouseAreaThreeInventoryDeptTable"
                  @row-click="onDeptRowClick"
                >
                  <template v-slot:defaultFlag="{ row }">
                    <el-tag size="mini" :type="row.DEFAULT_FLAG === '1' ? 'success' : 'info'">
                      {{ flagName(row.DEFAULT_FLAG) }}
                    </el-tag>
                  </template>
                  <template v-slot:enabledFlag="{ row }">
                    <el-tag size="mini" :type="row.ENABLED_FLAG === '1' ? 'success' : 'info'">
                      {{ enabledName(row.ENABLED_FLAG) }}
                    </el-tag>
                  </template>
                </ele-pro-table>
              </div>
            </div>

            <div class="spd-panel spd-table-panel dept-material-panel">
              <div class="spd-panel__head spd-panel__head--split">
                <span>科室耗材汇总</span>
                <span class="selected-text">{{ selectedDeptMaterialText }}</span>
              </div>
              <div class="spd-table-panel__wrap">
                <ele-pro-table
                  ref="deptMaterialTable"
                  class="data-table"
                  size="mini"
                  border
                  stripe
                  :toolbar="false"
                  :header-overflow-hidden="false"
                  :height="deptMaterialTableHeight"
                  :columns="deptMaterialColumns"
                  :datasource="deptMaterialDatasource"
                  :page-size="30"
                  :page-sizes="[30, 50, 100, 150, 200, 300, 999999]"
                  cache-key="WarehouseAreaThreeInventoryDeptMaterialTable"
                >
                  <template v-slot:deptMaterialAction="{ row }">
                    <el-link type="primary" :underline="false" @click="openDetail(row, 'dept')">明细</el-link>
                  </template>
                </ele-pro-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <MaterialDetailDialog
      :visible.sync="detailVisible"
      :title="detailTitle"
      :filters="detailFilters"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import WarehouseAreaThreeInventorySearch from './components/WarehouseAreaThreeInventorySearch.vue';
import MaterialDetailDialog from './components/MaterialDetailDialog.vue';
import {
  enabledName,
  flagName,
  getDeptMaterialColumns,
  getWarehouseDeptColumns,
  getWarehouseMaterialColumns
} from './columns';
import {
  DEPT_EXPORT_HEADERS,
  DEPT_MATERIAL_EXPORT_HEADERS,
  WAREHOUSE_EXPORT_HEADERS,
  deptMaterialRowToExportArray,
  deptRowToExportArray,
  warehouseRowToExportArray
} from './utils';
import {
  getDeptMaterialSummary,
  getWarehouseDeptList,
  getWarehouseMaterialSummary
} from '@/api/Inventory/WarehouseAreaThreeInventory';

export default {
  name: 'WarehouseAreaThreeInventory',
  components: { WarehouseAreaThreeInventorySearch, MaterialDetailDialog },
  data() {
    return {
      activeTab: 'warehouse',
      warehouseColumns: getWarehouseMaterialColumns(),
      deptColumns: getWarehouseDeptColumns(),
      deptMaterialColumns: getDeptMaterialColumns(),
      warehouseTableHeight: 'calc(100vh - 350px)',
      deptTableHeight: '260px',
      deptMaterialTableHeight: 'calc(100vh - 640px)',
      lastWhere: {},
      selectedDept: null,
      exporting: false,
      detailVisible: false,
      detailTitle: '',
      detailFilters: {}
    };
  },
  computed: {
    selectedDeptText() {
      if (!this.selectedDept?.DEPT_TWO_CODE) return '未选择SPD科室';
      return `${this.selectedDept.DEPT_TWO_CODE} ${this.selectedDept.DEPT_TWO_NAME || ''}`;
    },
    selectedDeptMaterialText() {
      if (!this.selectedDept?.DEPT_TWO_CODE) return '请选择上方SPD科室';
      return `${this.selectedDept.DEPT_TWO_NAME || this.selectedDept.DEPT_TWO_CODE}`;
    }
  },
  methods: {
    enabledName,
    flagName,
    currentWhere() {
      const where = this.$refs.search ? this.$refs.search.getWhere() : this.lastWhere;
      this.lastWhere = where || {};
      return this.lastWhere;
    },
    requireWarehouse(where, silent = false) {
      if (!where?.WAREHOUSE_AREA_ID) {
        if (!silent) {
          Message.warning('请选择库房/库区');
        }
        return false;
      }
      return true;
    },
    async warehouseDatasource({ page, limit, where }) {
      const query = where || this.lastWhere;
      this.lastWhere = query || {};
      if (!this.requireWarehouse(this.lastWhere, true)) {
        return { count: 0, list: [] };
      }
      try {
        const res = await getWarehouseMaterialSummary(this.lastWhere, page || 1, limit || 30);
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询库房耗材汇总失败');
        return { count: 0, list: [] };
      }
    },
    async deptDatasource({ page, limit, where }) {
      const query = where || this.lastWhere;
      this.lastWhere = query || {};
      if (!this.requireWarehouse(this.lastWhere, true)) {
        this.clearSelectedDept();
        return { count: 0, list: [] };
      }
      try {
        const res = await getWarehouseDeptList(this.lastWhere, page || 1, limit || 20);
        const rows = res.result || [];
        this.syncSelectedDept(rows);
        return { count: res.total || res.count || 0, list: rows };
      } catch (e) {
        this.clearSelectedDept();
        Message.error(e.message || '查询SPD科室列表失败');
        return { count: 0, list: [] };
      }
    },
    async deptMaterialDatasource({ page, limit, where }) {
      const query = where || this.lastWhere;
      this.lastWhere = query || {};
      if (!this.requireWarehouse(this.lastWhere, true) || !this.selectedDept?.DEPT_TWO_CODE) {
        return { count: 0, list: [] };
      }
      try {
        const res = await getDeptMaterialSummary(
          { ...this.lastWhere, DEPT_TWO_CODE: this.selectedDept.DEPT_TWO_CODE },
          page || 1,
          limit || 30
        );
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询科室耗材汇总失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.lastWhere = where || this.currentWhere();
      if (!this.requireWarehouse(this.lastWhere)) return;
      if (this.activeTab === 'warehouse') {
        this.reloadWarehouse();
      } else {
        this.selectedDept = null;
        this.reloadDeptList();
      }
    },
    onWarehouseChange(where) {
      this.lastWhere = where || this.currentWhere();
      this.selectedDept = null;
      this.$nextTick(() => this.reload(this.lastWhere));
    },
    onImportSuccess(where) {
      this.lastWhere = where || this.currentWhere();
      if (this.lastWhere?.WAREHOUSE_AREA_ID) {
        this.reload(this.lastWhere);
      }
    },
    onTabChange() {
      this.$nextTick(() => this.reload(this.currentWhere()));
    },
    reloadWarehouse() {
      this.$refs.warehouseTable &&
        this.$refs.warehouseTable.reload({ page: 1, where: this.lastWhere });
    },
    reloadDeptList() {
      this.$refs.deptTable && this.$refs.deptTable.reload({ page: 1, where: this.lastWhere });
    },
    reloadDeptMaterial() {
      this.$refs.deptMaterialTable &&
        this.$refs.deptMaterialTable.reload({ page: 1, where: this.lastWhere });
    },
    syncSelectedDept(rows) {
      if (!rows.length) {
        this.clearSelectedDept();
        return;
      }
      const current = this.selectedDept?.DEPT_TWO_CODE
        ? rows.find((row) => row.DEPT_TWO_CODE === this.selectedDept.DEPT_TWO_CODE)
        : null;
      this.selectedDept = current || rows[0];
      this.$nextTick(() => this.reloadDeptMaterial());
    },
    clearSelectedDept() {
      this.selectedDept = null;
      this.$nextTick(() => this.reloadDeptMaterial());
    },
    onDeptRowClick(row) {
      if (!row?.DEPT_TWO_CODE) return;
      this.selectedDept = row;
      this.reloadDeptMaterial();
    },
    openDetail(row, scope) {
      if (!row?.CHARGE_CODE) {
        Message.warning('缺少计费编码');
        return;
      }
      const baseWhere = this.currentWhere();
      this.detailFilters = {
        ...baseWhere,
        WAREHOUSE_AREA_ID: row.WAREHOUSE_AREA_ID || baseWhere.WAREHOUSE_AREA_ID,
        DEPT_TWO_CODE: scope === 'dept' ? row.DEPT_TWO_CODE || this.selectedDept?.DEPT_TWO_CODE || '' : '',
        CHARGE_CODE: row.CHARGE_CODE || ''
      };
      this.detailTitle =
        scope === 'dept'
          ? `耗材使用明细 - ${row.DEPT_TWO_NAME || row.DEPT_TWO_CODE || ''}`
          : `耗材使用明细 - ${row.AREA_NAME || ''}`;
      this.detailVisible = true;
    },
    async onExport() {
      const where = this.currentWhere();
      if (!this.requireWarehouse(where)) return;
      this.exporting = true;
      try {
        if (this.activeTab === 'warehouse') {
          await this.exportWarehouse(where);
        } else if (this.selectedDept?.DEPT_TWO_CODE) {
          await this.exportDeptMaterial(where);
        } else {
          await this.exportDeptList(where);
        }
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    writeSheet(headers, rows, filename, sheetName) {
      const sheet = utils.aoa_to_sheet([headers, ...rows]);
      const book = utils.book_new();
      utils.book_append_sheet(book, sheet, sheetName);
      writeFile(book, filename);
    },
    async exportWarehouse(where) {
      const res = await getWarehouseMaterialSummary(where, 1, 999999);
      const rows = (res.result || []).map((row, index) => warehouseRowToExportArray(row, index));
      this.writeSheet(
        WAREHOUSE_EXPORT_HEADERS,
        rows,
        '库房库区三级库库存-库房维度.xlsx',
        '库房维度'
      );
    },
    async exportDeptList(where) {
      const res = await getWarehouseDeptList(where, 1, 999999);
      const rows = (res.result || []).map((row, index) => deptRowToExportArray(row, index));
      this.writeSheet(DEPT_EXPORT_HEADERS, rows, '库房库区三级库库存-SPD科室.xlsx', 'SPD科室');
    },
    async exportDeptMaterial(where) {
      const res = await getDeptMaterialSummary(
        { ...where, DEPT_TWO_CODE: this.selectedDept.DEPT_TWO_CODE },
        1,
        999999
      );
      const rows = (res.result || []).map((row, index) => deptMaterialRowToExportArray(row, index));
      this.writeSheet(
        DEPT_MATERIAL_EXPORT_HEADERS,
        rows,
        '库房库区三级库库存-科室耗材.xlsx',
        '科室耗材'
      );
    }
  }
};
</script>

<style scoped>
.warehouse-area-three-inventory-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.warehouse-area-three-inventory-page .inventory-tabs {
  min-width: 0;
}

.warehouse-area-three-inventory-page :deep(.el-tabs__header) {
  margin-bottom: 10px;
}

.warehouse-area-three-inventory-page :deep(.el-table th .cell) {
  white-space: nowrap;
}

.warehouse-area-three-inventory-page :deep(.action-col .cell) {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}

.warehouse-area-three-inventory-page :deep(.action-col .el-link) {
  font-size: 12px;
  line-height: 23px;
  vertical-align: middle;
}

.dept-dimension {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  min-width: 0;
}

.spd-panel__head--split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.selected-text {
  color: #606266;
  font-size: 12px;
  font-weight: normal;
}

@media (max-width: 900px) {
  .warehouse-area-three-inventory-page .spd-panel__head--split {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
