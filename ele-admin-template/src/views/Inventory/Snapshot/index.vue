<template>
  <div class="ele-body inventory-snapshot">
    <el-card shadow="never" class="section-card">
      <SupplierSnapshotPanel />
    </el-card>
    <el-card shadow="never" class="section-card">
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
.section-card {
  margin-bottom: 16px;
}
.section-card:last-child {
  margin-bottom: 0;
}
</style>
