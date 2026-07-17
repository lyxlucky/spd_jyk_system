<template>
  <div class="ele-body spd-page ks-dept-plan-page">
    <!-- 外层受限宽 + overflow，内层固定最小宽：布局层 overflow-x:hidden 时仍能横向滚动，缩屏不变形 -->
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
  max-width: 100%;
  min-width: 0;
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  :deep(.spd-panel) {
    overflow: visible;
  }

  :deep(.el-table) {
    width: max-content;
    min-width: 100%;
  }

  :deep(.el-table th .cell) {
    white-space: nowrap;
  }
}

.ks-dept-plan-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.ks-dept-plan-page__inner {
  min-width: 1280px;
  display: flex;
  flex-direction: column;
}

.ks-dept-plan-container {
  width: 100%;
}

.ks-dept-plan-card :deep(.el-card__body) {
  padding: 10px;
}

.ks-dept-plan-header {
  padding: 0;
}

.ks-dept-plan-main-wrap {
  padding: 0 0 10px;
  overflow: visible;
}
</style>
