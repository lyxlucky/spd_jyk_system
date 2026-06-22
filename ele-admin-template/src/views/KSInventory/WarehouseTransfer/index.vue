<template>
  <div class="ele-body spd-page warehouse-transfer-page">
    <el-container class="warehouse-transfer-container">
      <el-main class="warehouse-transfer-main">
        <el-row :gutter="8" class="warehouse-transfer-row">
          <el-col :span="6">
            <el-card shadow="never" class="warehouse-transfer-card">
              <div slot="header" class="clearfix">
                <span>调库主单列表</span>
              </div>
              <!-- 组件 -->
              <WarehouseTransferLeftTable />
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card shadow="never" class="warehouse-transfer-card">
              <div slot="header" class="clearfix">
                <span>调库品种明细列表</span>
              </div>
              <!-- 组件 -->
              <WarehouseTransferMiddleTable />
            </el-card>
          </el-col>
          <el-col :span="7">
            <el-card shadow="never" class="warehouse-transfer-card">
              <div slot="header" class="clearfix">
                <span>调库定数包列表</span>
              </div>
              <!-- 组件 -->
              <WarehouseTransferRightTable />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import WarehouseTransferLeftTable from './components/WarehouseTransferLeftTable';
  import WarehouseTransferMiddleTable from './components/WarehouseTransferMiddleTable';
  import WarehouseTransferRightTable from './components/WarehouseTransferRightTable';

  export default {
    name: 'WarehouseTransferIndex',
    components: {
      WarehouseTransferLeftTable,
      WarehouseTransferMiddleTable,
      WarehouseTransferRightTable
    },
    beforeDestroy() {
      this.$bus.$off('QuoteTemplateAllDone');
    }
  };
</script>

<style scoped lang="scss">
.warehouse-transfer-card :deep(.el-card__body) {
  padding: 8px;
}

.warehouse-transfer-card :deep(.el-card__header) {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
}

.warehouse-transfer-main {
  padding: 10px;
  overflow: visible;
}

.warehouse-transfer-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
