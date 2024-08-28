<template lang="">
  <div class="container">
    <div style="display: flex;gap:20px">
      <CentralinventoryPackageBottomLeftTable />
      <CentralinventoryPackageBottomRightTable />
    </div>
  </div>
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
<style lang=""></style>
