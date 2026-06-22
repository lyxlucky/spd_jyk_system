<template>
  <div class="ele-body spd-page financial-audit-page">
    <el-card shadow="never" class="financial-audit-card">
      <FinancialTable />
    </el-card>
  </div>
</template>
<script>
  import FinancialTable from './components/FinancialTable';
  import FinancialTableSearch from './components/FinancialTableSearch';
  export default {
    name: 'FinancialAudit',
    components: {
      FinancialTable,
      FinancialTableSearch
    }
  };
</script>
<style scoped lang="scss">
.financial-audit-card :deep(.el-card__body) {
  padding: 10px;
}
</style>
