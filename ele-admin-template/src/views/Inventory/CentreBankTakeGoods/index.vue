<template>
  <div class="ele-body spd-page centre-bank-take-goods">
    <el-card shadow="never" class="page-card">
      <el-tabs v-model="activeTab" class="page-tabs">
        <el-tab-pane label="人工收货单" name="manual">
          <ManualPanel v-if="activeTab === 'manual'" />
        </el-tab-pane>
        <el-tab-pane label="系统收货单" name="system">
          <SystemPanel v-if="activeTab === 'system'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ManualPanel from './components/ManualPanel.vue';
import SystemPanel from './components/SystemPanel.vue';
import { initHpFlagsFromPermissions } from './utils';

export default {
  name: 'CentreBankTakeGoods',
  components: { ManualPanel, SystemPanel },
  data() {
    return { activeTab: 'manual' };
  },
  created() {
    const perms = this.$store.state.user?.info?.permission_group || [];
    initHpFlagsFromPermissions(perms);
  }
};
</script>

<style lang="scss" scoped>
@import './styles/table.scss';

.centre-bank-take-goods {
  padding: 8px;
  height: calc(100vh - 88px);
  box-sizing: border-box;
  overflow: hidden;

  .page-card {
    height: 100%;
    border: none;

    :deep(.el-card__body) {
      height: 100%;
      padding: 8px 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
  }

  .page-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    :deep(.el-tabs__header) {
      flex: none;
      margin-bottom: 8px;
    }
    :deep(.el-tabs__content) {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    :deep(.el-tab-pane) {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
