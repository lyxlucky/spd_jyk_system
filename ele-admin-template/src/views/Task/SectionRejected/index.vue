<template>
  <div class="ele-body section-rejected-page">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="二级科室定数包退货管理" name="def">
          <DefPkgReturnTab v-if="activeTab === 'def'" />
        </el-tab-pane>
        <el-tab-pane label="二级科室散货退货管理" name="bulk">
          <BulkReturnTab v-if="activeTab === 'bulk'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import DefPkgReturnTab from './components/DefPkgReturnTab.vue';
import BulkReturnTab from './components/BulkReturnTab.vue';
import { initSectionRejectedFlags } from './utils';

export default {
  name: 'SectionRejected',
  components: { DefPkgReturnTab, BulkReturnTab },
  data() {
    return { activeTab: 'def' };
  },
  created() {
    const perms = this.$store.state.user?.info?.permission_group || [];
    initSectionRejectedFlags(perms);
  }
};
</script>

<style lang="scss" scoped>
.section-rejected-page :deep(.el-tabs__content) {
  padding-top: 8px;
}
</style>
