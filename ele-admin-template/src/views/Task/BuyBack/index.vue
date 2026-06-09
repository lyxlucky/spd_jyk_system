<template>
  <div class="ele-body buy-back-page">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="中心库散货退购管理" name="bulk">
          <BulkReturnTab v-if="activeTab === 'bulk'" />
        </el-tab-pane>
        <el-tab-pane label="中心库定数包退购管理" name="def">
          <el-empty v-if="activeTab === 'def'" description="定数包退购功能暂未开放" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import BulkReturnTab from './components/BulkReturnTab.vue';
import { initBuyBackHpFlags } from './utils';

export default {
  name: 'BuyBack',
  components: { BulkReturnTab },
  data() {
    return { activeTab: 'bulk' };
  },
  created() {
    const perms = this.$store.state.user?.info?.permission_group || [];
    initBuyBackHpFlags(perms);
  }
};
</script>

<style lang="scss" scoped>
.buy-back-page :deep(.el-tabs__content) {
  padding-top: 8px;
}
</style>
