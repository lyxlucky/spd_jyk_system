<template>
  <div class="ele-body spd-page ks-dept-plan-page">
    <div class="ks-dept-plan-page__scroll">
      <div class="ks-dept-plan-page__inner">
        <el-container class="ks-dept-plan-container">
          <el-header height="auto" class="ks-dept-plan-header">
            <el-card shadow="never" class="ks-dept-plan-card">
              <KSDepartmentalPlantable
                ref="table1"
                :IsReload="IsReloadTag"
                @getCurrent="getCurrent"
              />
            </el-card>
          </el-header>
          <el-main class="ks-dept-plan-main-wrap">
            <el-card shadow="never" class="ks-dept-plan-card">
              <KSDepartmentalPlanDetailstable2
                v-if="isActive"
                :KSDepartmentalPlanData="KSDepartmentalPlanData"
                @clickReload="clickReload"
                @clickReload2="clickReload2"
              />
            </el-card>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import KSDepartmentalPlantable from './components/KSDepartmentalPlan-table1.vue';
import KSDepartmentalPlanDetailstable2 from './components/KSDepartmentalPlanDetails-table2';

export default {
  name: 'KSDepartmentalPlan',
  components: {
    KSDepartmentalPlantable,
    KSDepartmentalPlanDetailstable2
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      KSDepartmentalPlanData: {},
      isActive: true,
      IsReloadTag: false
    };
  },
  methods: {
    getCurrent(data) {
      this.KSDepartmentalPlanData = data;
    },
    reload() {
      this.isActive = false;
      this.$nextTick(() => {
        this.isActive = true;
      });
    },
    clickReload(data) {
      this.IsReloadTag = data;
    },
    clickReload2() {
      this.$refs.table1.reload2();
    }
  },
  watch: {
    IsReload() {}
  }
};
</script>

<style lang="scss" scoped>
.ks-dept-plan-page {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 覆盖全局 .spd-page min-width，避免整页被撑出横向大空白 */
  min-width: 0 !important;

  :deep(.el-table th .cell) {
    white-space: nowrap;
  }

  /* 查询区占满视口宽；按钮区 100% 宽后才会触发换行 */
  :deep(.ele-form-search.el-form--inline) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  :deep(.ele-form-search .el-form-item) {
    flex-shrink: 0;
    margin-right: 10px;
    margin-bottom: 6px;
  }

  /* 操作按钮单独占满一行宽度，超出换行，不再跟着宽表横向拉长 */
  :deep(.ele-form-actions.el-form-item) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin-right: 0 !important;
  }

  :deep(.ele-form-actions .el-form-item__content) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    gap: 6px;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 只有表格区域横向滚动，查询/按钮区保持视口宽度 */
  :deep(.spd-table-panel__wrap) {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  :deep(.spd-table-panel__wrap .el-table) {
    width: max-content;
    min-width: 100%;
  }
}

.ks-dept-plan-page__scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.ks-dept-plan-page__inner {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ks-dept-plan-container {
  width: 100%;
  min-width: 0;
}

.ks-dept-plan-card {
  width: 100%;
  max-width: 100%;
}

.ks-dept-plan-card :deep(.el-card__body) {
  padding: 10px;
  overflow: visible;
}

.ks-dept-plan-header {
  padding: 0;
  overflow: visible !important;
}

.ks-dept-plan-main-wrap {
  padding: 0 0 10px;
  overflow: visible !important;
}
</style>
