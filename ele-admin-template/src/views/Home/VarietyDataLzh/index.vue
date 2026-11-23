<template>
  <div class="variety-data-lzh-page" :class="{ 'is-dsb': activeName === 'second' }">
    <div class="variety-switch">
      <el-radio-group v-model="activeName" size="mini">
        <el-radio-button label="first">散货品种维护</el-radio-button>
        <el-radio-button label="second">定数包品种维护</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="activeName === 'second'" class="variety-row variety-row--dsb">
      <VarietyDataLzhDsb ref="dsbRef" />
    </div>
    <div class="variety-row variety-row--main">
      <VarietyDataLzhMain @row-click="onMainRowClick" />
    </div>
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
      this.lastSelectedVariety = {
        code: row.Varietie_Code || row.VARIETIE_CODE || '',
        codeNew: row.Varietie_Code_New || row.VARIETIE_CODE_NEW || '',
        name: row.Varietie_Name || row.VARIETIE_NAME || ''
      };
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
.variety-data-lzh-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
}

.variety-switch {
  flex: none;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 8px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
}

.variety-switch :deep(.el-radio-button__inner) {
  padding: 5px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  background: #fff;
  border-color: #c0c4cc;
}

.variety-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  color: #fff;
  background: #409eff;
  border-color: #409eff;
  box-shadow: -1px 0 0 0 #409eff;
}

.variety-switch :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left-color: #c0c4cc;
}

.variety-switch :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner:hover) {
  color: #fff;
}

.variety-row {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.variety-data-lzh-page.is-dsb .variety-row {
  height: 50%;
  max-height: 50%;
}

.variety-row--dsb {
  border-bottom: 1px solid #ebeef5;
}

.variety-row > * {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
}
</style>
