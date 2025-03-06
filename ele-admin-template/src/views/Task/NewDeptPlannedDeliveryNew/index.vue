<template lang="">
  <div>
    <el-container>
      <el-header height="350" style="padding-top: 10px">
        <el-card shadow="always">
          <NewDeptPlannedDeliveryTopTable />
        </el-card>
      </el-header>
      <el-container direction="horizontal">
        <el-main>
          <div style="display: flex; gap: 16px; justify-content: space-between;">
            <el-card style="flex: 1; max-width: calc(50% - 8px);" shadow="always">
              <NewDeptPlannedDeliveryBottomLeftTable />
            </el-card>
            <el-card style="flex: 1; max-width: calc(50% - 8px);" shadow="always">
              <NewDeptPlannedDeliveryBottomRightTable />
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
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
<style lang=""></style>
