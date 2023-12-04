<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <!-- <el-container>
      <el-header height="45vh" style="margin: 20px 0px 0px 0px;">
        <el-card shadow="always" style="height:45vh">
          <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div>
          <KSDepartmentalPlantable @getCurrent="getCurrent"></KSDepartmentalPlantable>
        </el-card>
      </el-header>
      <el-main height="40vh">
        <el-card shadow="always" style="height:40vh">
          <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div>
          <KSDepartmentalPlanDetailstable2 :KSDepartmentalPlanData="KSDepartmentalPlanData" v-if="isActive"></KSDepartmentalPlanDetailstable2>
        </el-card>
      </el-main>
    </el-container> -->
    <!-- </el-card> -->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="库存详情" name="first">
        <!-- <div slot="header" class="clearfix">
          <span>库存详情</span>
        </div> -->
        <KSDepartmentalPlantable @getCurrent="getCurrent"></KSDepartmentalPlantable>
      </el-tab-pane>
      <el-tab-pane label="库存记录" name="second">
        <!-- <div slot="header" class="clearfix">
          <span>消耗详情</span>
        </div> -->
        <KSDepartmentalPlanDetailstable2 :KSDepartmentalPlanData="KSDepartmentalPlanData" v-if="isActive"></KSDepartmentalPlanDetailstable2>
      </el-tab-pane>
    </el-tabs>
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
      activeName: 'first'
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
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav {
  width: 100%;
}
::v-deep .el-tabs__item {
  width: 50%;
}
</style>