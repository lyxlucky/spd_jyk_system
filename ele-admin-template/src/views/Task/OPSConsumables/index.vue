<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="8">
        <OPSConsumablesTable @changeMZZY="changeMZZY"></OPSConsumablesTable>
      </el-col>
      <el-col :span="16" type="flex">
        <OPSPlanConsumablesTable :MZZY="MZZY" />
        <div style="height: 10px"></div>
        <OPSDeliveryConsumablesTable :MZZY="MZZY" />
      </el-col>
    </el-row>
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

<style scoped></style>
