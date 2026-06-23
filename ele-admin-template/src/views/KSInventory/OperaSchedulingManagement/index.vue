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
        <el-card shadow="always" class="opera-scheduling-header-card">
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">查询条件</div>
            <naxtDayApplyPlanMainSearch
              ref="search"
              :KSDepartmentalPlanData="KSDepartmentalPlanData"
              @search="handleSearch"
              @cancel="handleCancel"
              @exportData="handleExportData"
              @exportData2="handleExportData2"
              @removeBatch="handleRemoveBatch"
              @openUserEdit="handleOpenUserEdit"
              @upNaxtDayApplyPlanMainByState="handleSubmit"
            />
          </div>
          <KSDepartmentalPlantable
            ref="table"
            @getCurrent="getCurrent"
            :IsReload="IsReloadTag"
          />
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
import naxtDayApplyPlanMainSearch from './components/naxtDayApplyPlanMain-search.vue';

export default {
  name: 'KSDepartmentalPlan',
  components: {
    KSDepartmentalPlantable,
    KSDepartmentalPlanDetailstable2,
    naxtDayApplyPlanMainSearch
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
  mounted() {
    this.$nextTick(() => {
      const where = this.$refs.search?.where;
      if (where) this.handleSearch(where);
    });
  },
  methods: {
    getCurrent(data) {
      this.KSDepartmentalPlanData = data;
    },
    handleSearch(where) {
      this.$refs.table?.reload(where);
    },
    handleCancel() {
      this.$refs.table?.handleCancel();
    },
    handleExportData(where) {
      this.$refs.table?.exportData(where);
    },
    handleExportData2(where) {
      this.$refs.table?.exportData2(where);
    },
    handleRemoveBatch() {
      this.$refs.table?.removeBatch();
    },
    handleOpenUserEdit(where) {
      this.$refs.table?.openUserEdit(where);
    },
    handleSubmit() {
      this.$refs.table?.upNaxtDayApplyPlanMainByStateFun();
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

<style scoped lang="scss">
.opera-scheduling-header-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
}
</style>
