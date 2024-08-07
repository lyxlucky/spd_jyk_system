<template lang="">
    <div>
    <el-container>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
            <BdReagentTable />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import BdReagentTable from './components/BdReagentTable'
export default {
    name:"NewBdReagent",
    components: {
        BdReagentTable
    },
}
</script>
<style lang="">
    
</style>