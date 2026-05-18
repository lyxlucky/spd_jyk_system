<template>
  <div class="ele-body centre-bank-take-goods">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
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
.centre-bank-take-goods :deep(.el-tabs__content) {
  padding-top: 8px;
}
</style>
