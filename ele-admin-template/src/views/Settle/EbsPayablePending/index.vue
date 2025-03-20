<template lang="">
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
            <EbsPayablePendingTopTable />
        </el-card>
      </el-header>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
            <EbsPayablePendingBottomTable />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import EbsPayablePendingTopTable from './components/EbsPayablePendingTopTable.vue';
  import EbsPayablePendingBottomTable from './components/EbsPayablePendingBottomTable.vue';
  export default {
    name: 'EbsPayablePending',
    components: {
      EbsPayablePendingTopTable,
      EbsPayablePendingBottomTable
    }
  };
</script>
<style scoped></style>
