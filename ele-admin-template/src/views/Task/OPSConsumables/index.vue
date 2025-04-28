<template>
  <div class="ele-box">
    <el-row :gutter="0" type="flex" style="height: 100%">
      <el-col :span="8">
        <OPSConsumablesTable @changeMZZY="changeMZZY"></OPSConsumablesTable>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="0" style="height: 50%">
          <el-col :span="24" style="height: 100%">
            <OPSPlanConsumablesTable :MZZY="MZZY" />
          </el-col>
        </el-row>
        <el-row :gutter="0" style="height: 50%">
          <el-col :span="24" style="height: 100%">
            <OPSDeliveryConsumablesTable :MZZY="MZZY" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- <el-container>
      <el-aside width="30%">
        <OPSConsumablesTable @changeMZZY="changeMZZY"></OPSConsumablesTable>
      </el-aside>
      <el-main>
        <OPSPlanConsumablesTable :MZZY="MZZY" />
        <div style="height: 10px"></div>
        <OPSDeliveryConsumablesTable :MZZY="MZZY" />
      </el-main>
    </el-container> -->
  </div>
</template>

<script>
  import OPSConsumablesTable from './components/OPSConsumablesTable.vue';
  import OPSPlanConsumablesTable from './components/OPSPlanConsumablesTable.vue';
  import OPSDeliveryConsumablesTable from './components/OPSDeliveryConsumablesTable.vue';
  export default {
    name: 'OPSConsumables',
    components: {
      OPSConsumablesTable,
      OPSPlanConsumablesTable,
      OPSDeliveryConsumablesTable
    },
    data() {
      return {
        MZZY: ''
      };
    },
    methods: {
      changeMZZY(val) {
        this.MZZY = val;
      }
    }
  };
</script>

<style scoped>
  .ele-box {
    height: 100%;
  }
</style>
