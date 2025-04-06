<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="8">
        <OPSConsumablesTable></OPSConsumablesTable>
      </el-col>
      <el-col :span="16" type="flex">
        <OPSPlanConsumablesTable />
        <div style="height: 10px"></div>
        <OPSDeliveryConsumablesTable />
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
      return {};
    },
    methods: {}
  };
</script>

<style scoped></style>
