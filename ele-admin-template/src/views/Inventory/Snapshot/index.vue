<template>
  <div class="ele-body spd-page inventory-snapshot">
    <el-card shadow="never" class="section-card">
      <div class="section-title">供应商库存快照</div>
      <SupplierSnapshotPanel />
    </el-card>
    <el-card shadow="never" class="section-card">
      <div class="section-title">中心库库存快照</div>
      <CenterKzSnapshotPanel :flags="snapshotFlags" />
    </el-card>
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

<style scoped>
.section-card :deep(.el-card__body) {
  padding: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}
</style>
