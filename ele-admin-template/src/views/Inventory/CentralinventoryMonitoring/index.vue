<template>
  <div class="ele-body spd-page central-inventory-monitoring">
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
.central-inventory-monitoring :deep(.monitor-warn-1) {
  background-color: #f9d5d5 !important;
}
.central-inventory-monitoring :deep(.monitor-warn-2) {
  background-color: #f7f4a8 !important;
}
.central-inventory-monitoring :deep(.monitor-warn-3) {
  background-color: #a6e4f7 !important;
}
</style>
