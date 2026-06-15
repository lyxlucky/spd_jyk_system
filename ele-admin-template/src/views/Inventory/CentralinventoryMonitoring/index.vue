<template>
  <div class="ele-body central-inventory-monitoring">
    <el-card shadow="never">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="中心库库存监控" name="center">
          <CenterWarehouseTab v-if="activeTab === 'center'" />
        </el-tab-pane>
        <el-tab-pane label="二级科室定数包库存监控" name="dept">
          <DeptMonitorTab v-if="activeTab === 'dept'" />
        </el-tab-pane>
        <el-tab-pane label="二级科室散货申领" name="apply">
          <TwoDeptApplyTab v-if="activeTab === 'apply'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import CenterWarehouseTab from './components/CenterWarehouseTab.vue';
import DeptMonitorTab from './components/DeptMonitorTab.vue';
import TwoDeptApplyTab from './components/TwoDeptApplyTab.vue';

export default {
  name: 'CentralinventoryMonitoring',
  components: {
    CenterWarehouseTab,
    DeptMonitorTab,
    TwoDeptApplyTab
  },
  data() {
    return {
      activeTab: 'center'
    };
  }
};
</script>

<style lang="scss" scoped>
.central-inventory-monitoring :deep(.el-card__body) {
  padding-top: 12px;
}
.central-inventory-monitoring :deep(.el-tabs__header) {
  margin-bottom: 12px;
}
/* 表头完整显示 + 勾选列居中 */
.central-inventory-monitoring :deep(.el-table th > .cell) {
  white-space: nowrap;
}
.central-inventory-monitoring :deep(.ele-pro-table .el-table),
.central-inventory-monitoring :deep(.data-table .el-table) {
  width: max-content;
  min-width: 100%;
}
.central-inventory-monitoring :deep(.cim-checkbox-col .cell),
.central-inventory-monitoring :deep(.el-table-column--selection .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
.central-inventory-monitoring :deep(.el-table-column--selection .cell .el-checkbox) {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}
</style>
