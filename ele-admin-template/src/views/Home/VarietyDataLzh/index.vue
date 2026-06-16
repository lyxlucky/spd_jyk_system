<template>
  <div class="ele-body spd-page variety-data-lzh-page">
    <el-card shadow="never">
      <el-tabs v-model="activeName">
        <el-tab-pane label="散货品种维护" name="first">
          <VarietyDataLzhMain v-if="activeName === 'first'" />
        </el-tab-pane>
        <el-tab-pane label="定数包品种维护" name="second">定数包品种维护</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import VarietyDataLzhMain from './VarietyDataLzhMain/index.vue';

export default {
  name: 'VarietyDataLzh',
  components: {
    VarietyDataLzhMain
  },
  data() {
    return {
      activeName: 'first'
    };
  }
};
</script>

<style lang="scss" scoped>
.variety-data-lzh-page :deep(.el-card__body) {
  padding: 12px;
}
.variety-data-lzh-page :deep(.el-tabs__content) {
  padding-top: 8px;
}
.variety-data-lzh-page :deep(.el-tabs__nav.is-top) {
  width: 100%;
  display: flex;
}
.variety-data-lzh-page :deep(.el-tabs__item.is-top) {
  width: 50%;
  display: flex;
  justify-content: center;
}
</style>
