<template>
  <div class="ele-body spd-page temporary-repository-query-page">
    <el-card shadow="never" class="temporary-repository-query-card">
      <div class="temporary-tabs">
        <button
          type="button"
          class="temporary-tab"
          :class="{ active: showLeftPage }"
          @click="showLeftPage = true; showRightPage = false"
        >
          暂存库查询
        </button>
        <button
          type="button"
          class="temporary-tab"
          :class="{ active: showRightPage }"
          @click="showRightPage = true; showLeftPage = false"
        >
          智能间历史出库查询
        </button>
      </div>
      <div class="temporary-content">
        <LeftPage v-if="showLeftPage" />
        <RightPage v-if="showRightPage" />
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
      showLeftPage: true,
      showRightPage: false
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

.temporary-tabs {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px;
  margin-bottom: 10px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.temporary-tab {
  flex: 1;
  height: 32px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  color: #606266;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  transition: color .2s, background-color .2s, box-shadow .2s;
}

.temporary-tab:hover {
  color: #409eff;
}

.temporary-tab.active {
  color: #409eff;
  font-weight: 600;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
}

.temporary-content {
  flex: 1;
  min-height: 0;
}

.temporary-content :deep(> .ele-body) {
  height: 100%;
  padding: 0;
}
</style>
