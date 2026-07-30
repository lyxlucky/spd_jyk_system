<template>
  <div class="ele-body spd-page variety-data-lzh-page">
    <el-card shadow="never">
      <el-tabs v-model="activeName">
        <el-tab-pane label="散货品种维护" name="first" />
        <el-tab-pane label="定数包品种维护" name="second" />
      </el-tabs>
      <!-- 定数包区域：仅第二个 tab 显示，位于散货列表上方 -->
      <template v-if="activeName === 'second'">
        <VarietyDataLzhDsb ref="dsbRef" />
        <el-divider class="dsb-divider" />
      </template>
      <!-- 散货品种列表：始终显示 -->
      <VarietyDataLzhMain @row-click="onMainRowClick" />
    </el-card>
  </div>
</template>

<script>
import VarietyDataLzhMain from './VarietyDataLzhMain/index.vue';
import VarietyDataLzhDsb from './VarietyDataLzhDsb/index.vue';

export default {
  name: 'VarietyDataLzh',
  components: {
    VarietyDataLzhMain,
    VarietyDataLzhDsb
  },
  data() {
    return {
      activeName: 'first',
      lastSelectedVariety: null
    };
  },
  methods: {
    onMainRowClick(row) {
      if (!row) return;
      // 对齐老系统 rowIndex_Code：以下方散货选中行为准
      this.lastSelectedVariety = {
        code: row.Varietie_Code || row.VARIETIE_CODE || '',
        codeNew: row.Varietie_Code_New || row.VARIETIE_CODE_NEW || '',
        name: row.Varietie_Name || row.VARIETIE_NAME || ''
      };
      // 定数包 tab 下点击散货行直接联动
      if (this.activeName === 'second' && this.$refs.dsbRef) {
        this.$refs.dsbRef.loadByVariety(this.lastSelectedVariety);
      }
    }
  },
  watch: {
    activeName(val) {
      if (val === 'second' && this.lastSelectedVariety) {
        this.$nextTick(() => {
          if (this.$refs.dsbRef) {
            this.$refs.dsbRef.loadByVariety(this.lastSelectedVariety);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.variety-data-lzh-page :deep(.el-card__body) {
  padding: 12px;
}
.variety-data-lzh-page :deep(.el-tabs__content) {
  display: none;
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
.dsb-divider {
  margin: 16px 0 8px;
}
</style>
