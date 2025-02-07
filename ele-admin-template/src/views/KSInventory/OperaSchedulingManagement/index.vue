<template>
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领计划单列表</span>
          </div> -->
          <naxtDayApplyPlanMainTable @getCurrent="getCurrent" :IsReload="IsReloadTag"></naxtDayApplyPlanMainTable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 1px">
        <el-card shadow="always">
          <!-- <div slot="header" class="clearfix">
            <span>申领单详情</span>
          </div> -->
          <naxtDayApplyPlanDelTable :KSDepartmentalPlanData="KSDepartmentalPlanData" @clickReload="clickReload" v-if="isActive"></naxtDayApplyPlanDelTable>
        </el-card>
      </el-main>
    </el-container>

    <!-- </el-card> -->
  </div>
</template>

<script>
import naxtDayApplyPlanMainTable from './components/naxtDayApplyPlanMain-table1.vue';
import naxtDayApplyPlanDelTable from './components/naxtDayApplyPlanDel-table2.vue';

export default {
  name: 'OperaSchedulingManagement',
  components: {
    naxtDayApplyPlanMainTable,
    naxtDayApplyPlanDelTable
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
