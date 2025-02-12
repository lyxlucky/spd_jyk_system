<template>
  <div>
    <el-container>
      <el-header height="600">
        <el-card shadow="always">
          <KSDepartmentalPlantable @getCurrent="getCurrent" :IsReload="IsReloadTag"></KSDepartmentalPlantable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 1px">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div> -->
          <KSDepartmentalPlanDetailstable2 :KSDepartmentalPlanData="KSDepartmentalPlanData" @clickReload="clickReload" v-if="isActive"></KSDepartmentalPlanDetailstable2>
        </el-card>
      </el-main>
    </el-container>

    <!-- </el-card> -->
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
    }
  },
  watch: {
    IsReload() {}
  }
};
</script>
