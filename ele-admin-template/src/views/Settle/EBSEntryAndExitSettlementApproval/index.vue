<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="8">
        <EBSEntryAndExitSettleTable1></EBSEntryAndExitSettleTable1>
      </el-col>
      <el-col :span="16">
        <EBSEntryAndExitSettleTable2></EBSEntryAndExitSettleTable2>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import EBSEntryAndExitSettleTable1 from './components/EBSEntryAndExitSettleTable1.vue';
  import EBSEntryAndExitSettleTable2 from './components/EBSEntryAndExitSettleTable2.vue';
  export default {
    name: 'EBSEntryAndExitSettlementApproval',
    components: {
      EBSEntryAndExitSettleTable1,
      EBSEntryAndExitSettleTable2
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style lang="scss" scoped></style>
