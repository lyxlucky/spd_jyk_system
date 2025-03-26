<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="8">
        <EBSEntryAndExitSettleTable1
          @clickTableRow="handleCurrentChange1"
        ></EBSEntryAndExitSettleTable1>
      </el-col>
      <el-col :span="16">
        <EBSEntryAndExitSettleTable2
          :currentTableItem1="currentTableItem1"
          ref="table2"
        ></EBSEntryAndExitSettleTable2>
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
      return {
        currentTableItem1: {}
      };
    },
    methods: {
      handleCurrentChange1(val) {
        this.currentTableItem1 = val;
        console.log(val);
        this.$nextTick(() => {
          this.$refs.table2.reloadTable();
        });
      }
    }
  };
</script>

<style lang="scss" scoped></style>
