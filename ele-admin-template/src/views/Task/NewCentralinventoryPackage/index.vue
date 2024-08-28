<template lang="">
    <el-container>
      <el-header height="350" style="padding-top: 10px">
        <el-card shadow="always">
          <CentralinventoryPackageTopTable />
        </el-card>
      </el-header>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
            <CentralinventoryPackageBottomTable />
        </el-card>
      </el-main>
    </el-container>
</template>
<script>
import CentralinventoryPackageTopTable from './components/CentralinventoryPackageTopTable';
import CentralinventoryPackageBottomTable from './components/CentralinventoryPackageBottomTable';
export default {
    name:"NewCentralinventoryPackage",
    components: {
        CentralinventoryPackageTopTable,
        CentralinventoryPackageBottomTable
    }
}
</script>
<style lang="">
    
</style>