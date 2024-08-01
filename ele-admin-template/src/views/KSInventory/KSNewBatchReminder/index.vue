<template lang="">
  <div>
    <el-container>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
          <KsNewBatchReminderTable />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import KsNewBatchReminderTable from './components/KsNewBatchReminderTable';
  export default {
    name: 'NewBatchReminder',
    components: {
      KsNewBatchReminderTable
    },
    data() {
      return {};
    },
  };
</script>
<style lang=""></style>
