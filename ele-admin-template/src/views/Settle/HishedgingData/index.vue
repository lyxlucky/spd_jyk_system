<template>
  <div class="ele-body spd-page hishedging-data">
    <el-card shadow="never" class="tabs-card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="对冲成功的HIS计费数据" name="success">
          <HedgeSuccessPanel v-if="activeTab === 'success'" />
        </el-tab-pane>
        <el-tab-pane label="对冲失败的HIS计费数据" name="failure">
          <HedgeFailurePanel v-if="activeTab === 'failure'" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import HedgeSuccessPanel from './components/HedgeSuccessPanel.vue';
import HedgeFailurePanel from './components/HedgeFailurePanel.vue';

export default {
  name: 'HishedgingData',
  components: { HedgeSuccessPanel, HedgeFailurePanel },
  data() {
    return { activeTab: 'success' };
  }
};
</script>

<style scoped>
.hishedging-data >>> .el-card__body {
  padding: 12px;
}
.tabs-card {
  min-height: calc(100vh - 120px);
}
</style>
