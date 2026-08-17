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
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .page-card {
    min-height: 100%;
    height: auto;
    border: none;
    overflow: visible !important;

    :deep(.el-card__body) {
      min-height: calc(100vh - 112px);
      height: auto;
      padding: 8px 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: visible;
    }
  }

  .page-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 680px;

    :deep(.el-tabs__header) {
      flex: none;
      margin-bottom: 8px;
    }
    :deep(.el-tabs__content) {
      flex: 1;
      min-height: 640px;
      overflow: visible;
    }
    :deep(.el-tab-pane) {
      min-height: 640px;
      height: auto;
      overflow: visible;
    }
  }
}
</style>
