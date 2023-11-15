<template>
  <div>
    <!-- <el-card shadow="always"> -->
      <el-container>
        <el-aside width="500px"  style="margin: 20px 0px 0px 20px;">
          <el-card shadow="always" >
            <div slot="header" class="clearfix">
              <span>申领计划单列表</span>
            </div>
            <KSDepartmentalPlantable></KSDepartmentalPlantable>
          </el-card>
        </el-aside>
        <el-main>
          <el-card shadow="always">
            <KSDepartmentalPlanDetailstable2></KSDepartmentalPlanDetailstable2>
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
  data() {
    return {};
  },
  methods: {}
};
</script>
