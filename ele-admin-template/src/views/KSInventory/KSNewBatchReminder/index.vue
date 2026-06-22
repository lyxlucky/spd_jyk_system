<template>
  <div class="ele-body ks-new-batch-reminder-page">
    <el-card shadow="never" class="ks-new-batch-reminder-card">
      <KsNewBatchReminderTable />
    </el-card>
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
    }
  };
</script>

<style scoped lang="scss">
.ks-new-batch-reminder-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  box-sizing: border-box;
}

.ks-new-batch-reminder-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ks-new-batch-reminder-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 10px;
}
</style>
