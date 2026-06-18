<template>
  <div class="ele-body spd-page temporary-repository-query-page">
    <el-card shadow="never" class="temporary-repository-query-card">
      <el-form size="mini" :inline="true" class="temporary-tabs-form" @submit.native.prevent>
        <el-form-item>
          <el-radio-group v-model="activeTab" size="mini">
            <el-radio-button label="left">暂存库查询</el-radio-button>
            <el-radio-button label="right">智能间历史出库查询</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="temporary-content">
        <LeftPage v-if="activeTab === 'left'" />
        <RightPage v-if="activeTab === 'right'" />
      </div>
    </el-card>
  </div>
</template>

<script>
import LeftPage from '../../Inventory/TemporaryRepositoryQuery/components/LeftPage.vue';
import RightPage from '../../Inventory/TemporaryRepositoryQuery/components/RightPage.vue';

export default {
  components: {
    LeftPage,
    RightPage
  },
  data() {
    return {
      activeTab: 'left'
    };
  }
};
</script>

<style scoped>
.temporary-repository-query-page {
  padding: 8px;
}

.temporary-repository-query-card {
  height: calc(100vh - 112px);
}

.temporary-repository-query-page :deep(.el-card__body) {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.temporary-tabs-form {
  flex: none;
  width: 100%;
  margin-bottom: 10px;
}

.temporary-tabs-form :deep(.el-form-item) {
  width: 100%;
  margin-bottom: 0;
}

.temporary-tabs-form :deep(.el-form-item__content) {
  width: 100%;
}

.temporary-tabs-form :deep(.el-radio-group) {
  display: flex;
  width: 100%;
}

.temporary-tabs-form :deep(.el-radio-button) {
  flex: 1;
}

.temporary-tabs-form :deep(.el-radio-button__inner) {
  width: 100%;
}

.temporary-content {
  flex: 1;
  min-height: 0;
}

.temporary-content :deep(> .temporary-page) {
  height: 100%;
}
</style>
