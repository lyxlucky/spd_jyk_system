<template lang="">
  <div class="ele-body">
    <el-card shadow="never"> 
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
<style lang=""></style>
