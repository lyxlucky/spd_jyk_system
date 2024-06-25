<template>
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div> -->
          <!-- :IsReload="IsReloadTag" -->
          <StocktakingDataTabel></StocktakingDataTabel>
        </el-card>
      </el-header>
      <el-main style="padding-top: 1px">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div> -->
          <!-- @clickReload="clickReload" v-if="isActive" :KSDepartmentalPlanData="KSDepartmentalPlanData" -->
           
        <StocktakingDataTabelDel>
        </StocktakingDataTabelDel>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import StocktakingDataTabel from './components/StocktakingData-table1.vue';
import StocktakingDataTabelDel from './components/StocktakingDataDetails-table2';

export default {
  name: 'KSDepartmentalPlan',
  components: {
    StocktakingDataTabel,
    StocktakingDataTabelDel
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      // isActive: true,
      // IsReloadTag: false
    };
  },
  methods: {
    reload() {
      // this.isActive = false;
      // this.$nextTick(() => {
      //   this.isActive = true;
      // });
    },
    // clickReload(data){
    //   this.IsReloadTag = data
    // }
  },
  watch: {
    IsReload() {}
  },
};
</script>
