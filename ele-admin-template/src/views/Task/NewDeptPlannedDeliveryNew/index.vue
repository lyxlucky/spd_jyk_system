<template>
  <div class="ele-body spd-page dept-planned-delivery-new">
    <!-- <el-container>
      <el-header height="350" style="padding-top: 10px">
        <el-card shadow="always">
          <NewDeptPlannedDeliveryTopTable />
        </el-card>
      </el-header>
      <el-container direction="horizontal">
        <el-main>
          <div style="display: flex; gap: 16px; justify-content: space-between;">
            ...
          </div>
        </el-main>
      </el-container>
    </el-container> -->
    <el-card shadow="never" class="dept-planned-delivery-card">
      <div class="dept-planned-top">
        <NewDeptPlannedDeliveryTopTable />
      </div>
      <div class="spd-split-bottom">
        <div class="spd-split-pane">
          <NewDeptPlannedDeliveryBottomLeftTable />
        </div>
        <div class="spd-split-pane">
          <NewDeptPlannedDeliveryBottomRightTable />
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import NewDeptPlannedDeliveryBottomRightTable from './components/NewDeptPlannedDeliveryBottomRightTable';
  import NewDeptPlannedDeliveryTopTable from './components/NewDeptPlannedDeliveryTopTable';
  import NewDeptPlannedDeliveryBottomLeftTable from './components/NewDeptPlannedDeliveryBottomLeftTable';
  export default {
    name: 'NewDeptPlannedDeliveryNew',
    components: {
      NewDeptPlannedDeliveryTopTable,
      NewDeptPlannedDeliveryBottomLeftTable,
      NewDeptPlannedDeliveryBottomRightTable
    }
  };
</script>
<style scoped lang="scss">
.dept-planned-delivery-card :deep(.el-card__body) {
  --dept-plan-table-offset: 260px;
  --dept-plan-top-ratio: 0.68;
  --dept-plan-bottom-ratio: 0.32;
  --dept-plan-pager-height: 42px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: calc(100vh - 120px);
}

.dept-planned-top {
  flex: 0 0 auto;
}

.spd-split-bottom {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 0;
}

.spd-split-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.dept-planned-delivery-new >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
