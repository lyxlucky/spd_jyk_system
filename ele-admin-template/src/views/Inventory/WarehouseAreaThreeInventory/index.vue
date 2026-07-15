<template>
  <div class="ele-body spd-page warehouse-area-three-inventory-page">
    <el-card shadow="never" class="warehouse-area-three-inventory-card">
      <WarehouseAreaThreeInventorySearch
        ref="search"
        :exporting="exporting"
        :mode="queryMode"
        @search="reload"
        @mode-change="onQueryModeChange"
        @warehouse-change="onWarehouseChange"
        @export="onExport"
        @import-success="onImportSuccess"
      />

      <MaterialLocationPanel
        v-if="queryMode === 'material'"
        ref="materialLocation"
        @locate="openWarehouseLocation"
        @detail="openLocationDetail"
      />

      <el-tabs v-else v-model="activeTab" class="inventory-tabs" @tab-click="onTabChange">
        <el-tab-pane label="库房维度" name="warehouse">
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">库房/库区耗材汇总</div>
            <div class="spd-table-panel__wrap" v-loading="warehouseJumpLoading">
              <ele-pro-table
                ref="warehouseTable"
                class="data-table"
                size="mini"
                border
                stripe
                :toolbar="false"
                :init-load="false"
                :header-overflow-hidden="false"
                :height="warehouseTableHeight"
                :columns="warehouseColumns"
                :datasource="warehouseDatasource"
                :where="lastWhere"
                :page-size="30"
                :page-sizes="[30, 50, 100, 150, 200, 300, 999999]"
                cache-key="WarehouseAreaThreeInventoryWarehouseTable"
                @done="onWarehouseTableDone"
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
import MaterialLocationPanel from './components/MaterialLocationPanel.vue';
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
  components: { WarehouseAreaThreeInventorySearch, MaterialLocationPanel, MaterialDetailDialog },
  data() {
    return {
      activeTab: 'warehouse',
      queryMode: 'material',
      warehouseColumns: getWarehouseMaterialColumns(),
      deptColumns: getWarehouseDeptColumns(),
      deptMaterialColumns: getDeptMaterialColumns(),
      warehouseTableHeight: 'calc(100vh - 350px)',
      deptTableHeight: '260px',
      deptMaterialTableHeight: 'calc(100vh - 640px)',
      lastWhere: {},
      selectedDept: null,
      warehouseJumpLoading: false,
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
    // 获取当前查询条件，并缓存为表格数据源的默认条件。
    currentWhere() {
      const where = this.$refs.search ? this.$refs.search.getWhere() : this.lastWhere;
      this.lastWhere = where || {};
      return this.lastWhere;
    },
    // 库存查询必须先选择库房/库区。
    requireWarehouse(where, silent = false) {
      if (!where?.AREA_CODE) {
        if (!silent) {
          Message.warning('请选择库房/库区');
        }
        return false;
      }
      return true;
    },
    // 库房维度表格数据源。
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
    // SPD科室表格数据源，刷新后同步当前选中科室。
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
    // 选中SPD科室后的耗材汇总表格数据源。
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
    // 根据当前页签刷新对应表格。
    reload(where) {
      this.lastWhere = where || this.currentWhere();
      if (this.queryMode === 'material') {
        this.$nextTick(() => this.$refs.materialLocation && this.$refs.materialLocation.reload(this.lastWhere));
        return;
      }
      if (!this.requireWarehouse(this.lastWhere)) return;
      if (this.activeTab === 'warehouse') {
        this.reloadWarehouse();
      } else {
        this.selectedDept = null;
        this.reloadDeptList();
      }
    },
    // 库房/库区切换时清空科室选择并重新加载。
    onWarehouseChange(where) {
      this.lastWhere = where || this.currentWhere();
      if (this.queryMode !== 'warehouse') return;
      this.selectedDept = null;
      this.$nextTick(() => this.reload(this.lastWhere));
    },
    onQueryModeChange(mode) {
      this.queryMode = mode === 'warehouse' ? 'warehouse' : 'material';
      this.selectedDept = null;
      this.lastWhere = this.currentWhere();
      // 库房表格关闭了 init-load，切换模式后需要主动刷新。
      if (this.queryMode === 'warehouse' && this.lastWhere?.AREA_CODE) {
        this.$nextTick(() => this.reload(this.lastWhere));
      }
    },
    // 导入或同步成功后按当前条件刷新页面数据。
    onImportSuccess(where) {
      this.lastWhere = where || this.currentWhere();
      if (this.lastWhere?.AREA_CODE) {
        this.reload(this.lastWhere);
      }
    },
    openWarehouseLocation(row) {
      if (!row?.AREA_CODE) return;
      const currentWhere = this.currentWhere();
      const targetWhere = {
        ...currentWhere,
        AREA_CODE: row.AREA_CODE,
        CHARGE_CODE: row.CHARGE_CODE || currentWhere.CHARGE_CODE || ''
      };
      // 先写好查询条件，再切换到库房视图，避免表格空条件初始化把加载动画提前关掉。
      this.lastWhere = targetWhere;
      this.activeTab = 'warehouse';
      this.warehouseJumpLoading = true;
      this.queryMode = 'warehouse';
      this.$nextTick(() => {
        if (this.$refs.search) {
          this.$refs.search.setAreaCode(targetWhere.AREA_CODE);
          if (targetWhere.CHARGE_CODE !== undefined && this.$refs.search.where) {
            this.$refs.search.where.CHARGE_CODE = targetWhere.CHARGE_CODE || '';
          }
        }
        // 再等一帧确保 ele-pro-table 已挂载，然后主动 reload 并显示加载动画。
        this.$nextTick(() => {
          const table = this.$refs.warehouseTable;
          if (!table) {
            this.warehouseJumpLoading = false;
            return;
          }
          table.tableLoading = true;
          table.reload({ page: 1, where: targetWhere });
        });
      });
    },
    onWarehouseTableDone() {
      this.warehouseJumpLoading = false;
    },
    openLocationDetail(filters) {
      this.detailFilters = filters || {};
      this.detailTitle = '耗材使用明细';
      this.detailVisible = true;
    },
    // 页签切换后加载当前页签的数据。
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
    // 保留当前选中科室；若当前科室不在新数据中则默认选第一行。
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
    // 打开库存流水明细弹窗，并把当前筛选条件传入明细查询。
    openDetail(row, scope) {
      if (!row?.CHARGE_CODE) {
        Message.warning('缺少计费编码');
        return;
      }
      const baseWhere = this.currentWhere();
      this.detailFilters = {
        ...baseWhere,
        AREA_CODE: row.AREA_CODE || baseWhere.AREA_CODE || '',
        DEPT_TWO_CODE: scope === 'dept' ? row.DEPT_TWO_CODE || this.selectedDept?.DEPT_TWO_CODE || '' : '',
        CHARGE_CODE: row.CHARGE_CODE || ''
      };
      this.detailTitle =
        scope === 'dept'
          ? `耗材使用明细 - ${row.DEPT_TWO_NAME || row.DEPT_TWO_CODE || ''}`
          : `耗材使用明细 - ${row.AREA_NAME || ''}`;
      this.detailVisible = true;
    },
    // 按当前页签导出对应维度的数据。
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
    // 写出Excel文件。
    writeSheet(headers, rows, filename, sheetName) {
      const sheet = utils.aoa_to_sheet([headers, ...rows]);
      const book = utils.book_new();
      utils.book_append_sheet(book, sheet, sheetName);
      writeFile(book, filename);
    },
    // 导出库房/库区耗材汇总。
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
    // 导出SPD科室库存汇总。
    async exportDeptList(where) {
      const res = await getWarehouseDeptList(where, 1, 999999);
      const rows = (res.result || []).map((row, index) => deptRowToExportArray(row, index));
      this.writeSheet(DEPT_EXPORT_HEADERS, rows, '库房库区三级库库存-SPD科室.xlsx', 'SPD科室');
    },
    // 导出选中SPD科室的耗材汇总。
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
