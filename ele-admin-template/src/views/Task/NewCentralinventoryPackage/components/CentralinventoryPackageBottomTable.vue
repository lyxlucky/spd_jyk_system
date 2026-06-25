<template lang="">
  <el-row :gutter="20" class="bottom-table-row">
    <el-col :span="20" class="bottom-table-col">
      <CentralinventoryPackageBottomLeftTable />
    </el-col>
    <el-col :span="4" class="bottom-table-col">
      <CentralinventoryPackageBottomRightTable />
    </el-col>
  </el-row>
</template>
<script>
  import CentralinventoryPackageBottomLeftTable from './CentralinventoryPackageBottomLeftTable';
  import CentralinventoryPackageBottomRightTable from './CentralinventoryPackageBottomRightTable';
  export default {
    name: 'CentralinventoryPackageBottomTable',
    components: {
      CentralinventoryPackageBottomLeftTable,
      CentralinventoryPackageBottomRightTable
    }
  };
</script>
<style lang="scss" scoped>
.bottom-table-col {
  min-width: 0;
}
</style>
