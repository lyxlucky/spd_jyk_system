<template>
  <div class="inventory-snapshot">
    <div class="inventory-snapshot__row">
      <SupplierSnapshotPanel />
    </div>
    <div class="inventory-snapshot__row">
      <CenterKzSnapshotPanel :flags="snapshotFlags" />
    </div>
  </div>
</template>

<script>
import SupplierSnapshotPanel from './components/SupplierSnapshotPanel.vue';
import CenterKzSnapshotPanel from './components/CenterKzSnapshotPanel.vue';
import { initSnapshotFlags } from './utils';

export default {
  name: 'InventorySnapshot',
  components: { SupplierSnapshotPanel, CenterKzSnapshotPanel },
  data() {
    return {
      snapshotFlags: initSnapshotFlags()
    };
  },
  created() {
    const pg = this.$store.state.user?.info?.permission_group || [];
    this.snapshotFlags = initSnapshotFlags(pg);
  }
};
</script>

<style scoped lang="scss">
.inventory-snapshot {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
}

.inventory-snapshot__row {
  display: flex;
  flex: 1 1 0;
  width: 100%;
  height: 50%;
  max-height: 50%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.inventory-snapshot__row + .inventory-snapshot__row {
  border-top: 1px solid #ebeef5;
}

.inventory-snapshot__row > * {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

:deep(.snap-board) {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

:deep(.snap-pane) {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

:deep(.snap-pane--side) {
  flex: 0 0 34%;
  width: 34%;
  max-width: 34%;
}

:deep(.snap-pane--main) {
  flex: 1 1 0;
  border-left: 1px solid #ebeef5;
}

:deep(.snap-tool) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: none;
  max-width: 100%;
  padding: 2px 8px 0;
  box-sizing: border-box;
}

:deep(.snap-title) {
  flex: none;
  margin-right: 8px;
  font-size: 13px;
  font-weight: 600;
  line-height: 28px;
  color: #303133;
}

:deep(.snap-meta) {
  margin-right: 8px;
  color: #606266;
  font-size: 12px;
  line-height: 28px;
}

:deep(.snap-search) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
}

:deep(.snap-search .el-form-item) {
  display: inline-flex;
  flex: none;
  width: auto;
  margin: 0 8px 2px 0;
}

:deep(.snap-search .el-form-item__label),
:deep(.snap-search .el-form-item__content) {
  line-height: 28px;
}

:deep(.el-table) {
  width: 100%;
  min-width: 0;
}

:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell) {
  padding: 1px 0;
}

:deep(.el-table .cell) {
  line-height: 18px;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.snap-pager) {
  flex: none;
  margin: 0;
  padding: 2px 8px 0 0;
  text-align: right;
  font-size: 12px;
  line-height: 22px;
}

:deep(.snap-pager.el-pagination) {
  font-weight: normal;
}

:deep(.snap-pager > *) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

:deep(.snap-pager button),
:deep(.snap-pager span:not([class*='suffix'])),
:deep(.snap-pager .el-pager li) {
  height: 22px;
  min-width: 22px;
  line-height: 22px;
  font-size: 12px;
}

:deep(.snap-pager .el-input__inner) {
  height: 22px;
  line-height: 22px;
}

:deep(.snap-pager .el-select .el-input) {
  width: 88px;
  margin: 0 4px;
}
</style>
