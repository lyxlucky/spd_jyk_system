<template>
  <div class="ele-body ks-new-batch-reminder-page">
    <el-card shadow="never" class="ks-new-batch-reminder-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <KsNewBatchReminderTableSearch
          ref="search"
          @search="handleSearch"
          @makeRead="handleMakeRead"
        />
      </div>
      <KsNewBatchReminderTable ref="table" />
    </el-card>
  </div>
</template>

<script>
  import KsNewBatchReminderTable from './components/KsNewBatchReminderTable';
  import KsNewBatchReminderTableSearch from './components/KsNewBatchReminderTableSearch';

  export default {
    name: 'NewBatchReminder',
    components: {
      KsNewBatchReminderTable,
      KsNewBatchReminderTableSearch
    },
    mounted() {
      this.$nextTick(() => {
        const where = this.$refs.search?.where;
        if (where) this.handleSearch(where);
      });
    },
    methods: {
      handleSearch(where) {
        this.$refs.table?.reload(where);
      },
      handleMakeRead() {
        this.$refs.table?.makeRead();
      }
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
  gap: 10px;
}
</style>
