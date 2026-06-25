<template>
  <div class="ele-body spd-page ks-dept-plan-science-page">
    <el-card shadow="never" class="ks-dept-plan-science-card">
      <KSDepartmentalPlantable
        ref="table1"
        @getCurrent="getCurrent"
        @reload="handleTable1Reload"
        :IsReload="IsReloadTag"
      />
      <KSDepartmentalPlanDetailstable2
        ref="table2"
        :KSDepartmentalPlanData="KSDepartmentalPlanData"
        @clickReload="clickReload"
        @clickReload2="clickReload2"
        v-if="isActive"
      />
    </el-card>
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
    },
    handleTable1Reload() {
      this.$nextTick(() => {
        if (this.$refs.table2 && this.KSDepartmentalPlanData && this.KSDepartmentalPlanData.PlanNum) {
          this.$refs.table2.reload({
            PlanNum: this.KSDepartmentalPlanData.PlanNum
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.ks-dept-plan-science-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
