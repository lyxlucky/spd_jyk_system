<template>
  <div class="ele-body centralinventory-package-page">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="中心库制包管理" name="manage">
          <ManageTab v-if="activeTab === 'manage'" />
        </el-tab-pane>
        <el-tab-pane label="中心库制包查询" name="query">
          <QueryTab v-if="activeTab === 'query'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ManageTab from './components/ManageTab.vue';
import QueryTab from './components/QueryTab.vue';

export default {
  name: 'CentralinventoryPackage',
  components: { ManageTab, QueryTab },
  data() {
    return { activeTab: 'manage' };
  }
};
</script>

<style lang="scss" scoped>
.centralinventory-package-page :deep(.el-tabs__content) {
  padding-top: 8px;
}
</style>
