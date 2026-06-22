<template>
  <div class="ele-body spd-page new-bd-reagent-page">
    <el-card shadow="never" class="new-bd-reagent-card">
      <BdReagentTable />
    </el-card>
  </div>
</template>

<script>
  import BdReagentTable from './components/BdReagentTable';

  export default {
    name: 'NewBdReagent',
    components: {
      BdReagentTable
    }
  };
</script>

<style scoped lang="scss">
.new-bd-reagent-card :deep(.el-card__body) {
  padding: 10px;
}

.new-bd-reagent-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
