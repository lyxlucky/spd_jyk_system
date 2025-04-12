<template>
  <div class="ele-body">
    <el-container>
      <el-aside width="32%">
        <OPSConsumablesTable @changeMZZY="changeMZZY"></OPSConsumablesTable>
      </el-aside>
      <el-main>
        <OPSPlanConsumablesTable :MZZY="MZZY" />
        <div style="height: 10px"></div>
        <OPSDeliveryConsumablesTable :MZZY="MZZY" />
      </el-main>
    </el-container>
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
