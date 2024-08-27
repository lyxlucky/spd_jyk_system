<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <!-- <el-container>
      <el-aside width="600px" style="margin: 20px 0px 0px 20px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div>
          <KSDepartmentalPlantable @getCurrent="getCurrent"></KSDepartmentalPlantable>
        </el-card>
      </el-aside>
      <el-main>
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div>
          <KSDepartmentalPlanDetailstable2 :KSDepartmentalPlanData="KSDepartmentalPlanData" v-if="isActive"></KSDepartmentalPlanDetailstable2>
        </el-card>
      </el-main>
    </el-container> -->

    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div> -->
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
import KSDepartmentalPlantable from './components/LrJykInstrument-table1.vue';
import KSDepartmentalPlanDetailstable2 from './components/LrJykInstrumentDetails-table2';

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
    clickReload(data){
      this.IsReloadTag = data
    }
  },
  watch: {
    IsReload() {}
  }
};
</script>
