<template>
  <div>
    <!-- 表头 -->
    <div class="header">
      <span
        @click="showLeftPage = true; showRightPage = false"
        :class="{ 'active': showLeftPage }"
      >
      暂存库查询
      </span>
      <span
        @click="showRightPage = true; showLeftPage = false"
        :class="{ 'active': showRightPage }"
      >
      智能间历史出库查询
      </span>
    </div>
    <!-- 根据条件显示不同组件 -->
    <LeftPage v-if="showLeftPage" />
    <RightPage v-if="showRightPage" />
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
.header {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc; /* 整体表头底部的分割线 */
}

.header span {
  flex: 1; /* 让每个表头元素各占一半宽度 */
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  position: relative;
}

.header span.active::after {
  content: '';
  position: absolute;
  bottom: -1px; /* 与表头底部对齐 */
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff; /* 选中状态下滑线颜色 */
}
</style>