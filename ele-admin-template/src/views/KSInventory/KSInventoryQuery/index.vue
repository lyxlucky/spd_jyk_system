<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-header height="45vh" style="margin: 20px 0px 0px 0px;">
        <el-card shadow="always" style="height:45vh">
          <!-- <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div> -->
          <KSDepartmentalPlantable @getCurrent="getCurrent"></KSDepartmentalPlantable>
        </el-card>
      </el-header>
      <el-main height="40vh">
        <el-card shadow="always" style="height:40vh">
          <!-- <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div> -->
          <KSDepartmentalPlanDetailstable2 :KSDepartmentalPlanData="KSDepartmentalPlanData" v-if="isActive"></KSDepartmentalPlanDetailstable2>
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
      isActive: true
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
    }
  }
};
</script>
