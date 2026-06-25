<template>

  <div class="ele-body spd-page hishedging-data">

    <el-card shadow="never" class="tabs-card">

      <el-tabs v-model="activeTab" type="card" class="hishedging-data-tabs">

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



<style scoped lang="scss">

.hishedging-data >>> .el-card__body {

  padding: 10px;

}



.tabs-card {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.hishedging-data-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}



.hishedging-data >>> .el-table th .cell {

  white-space: nowrap;

}



.hishedging-data-tabs >>> .el-tabs__item {

  height: 32px;

  line-height: 32px;

  font-size: 13px;

  padding: 0 16px;

}

</style>

