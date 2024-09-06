<template lang="">
  <div>
    <el-main style="padding-top: 10px">
      <el-card shadow="always">
        <JyDeviceTable />
      </el-card>
    </el-main>
  </div>
</template>
<script>
  import JyDeviceTable from './components/JyDeviceTable';
  export default {
    name: 'JykDeviceAnalyze',
    components: {
      JyDeviceTable
    }
  };
</script>
<style lang=""></style>
