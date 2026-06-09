<template>
  <div class="ele-body following-goods-plan">
    <el-row :gutter="10">
      <el-col :span="8">
        <StatusSummaryStatistics
          ref="table1"
          :storage-id="storageId"
          @storage-change="onStorageChange"
          @onClickRow="clickTableRow1"
        />
      </el-col>
      <el-col :span="16">
        <StockPlanItemDetail
          ref="table2"
          :current-table-row="currentTableRow"
          :current-table-row3="currentTableRow3"
          :storage-id="storageId"
          @onClickRow="clickTableRow2"
          @refresh-order-list="refreshTable3"
        />
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="24">
        <StockPlanOrderList
          ref="table3"
          :current-table-row2="currentTableRow2"
          :current-table-row="currentTableRow"
          :storage-id="storageId"
          @onRowClick="clickTableRow3"
          @detail-refresh="refreshTable2"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StatusSummaryStatistics from './components/StatusSummaryStatistics.vue';
import StockPlanItemDetail from './components/StockPlanItemDetail.vue';
import StockPlanOrderList from './components/StockPlanOrderList.vue';

export default {
  name: 'FollowingGoodsPlan',
  components: {
    StatusSummaryStatistics,
    StockPlanItemDetail,
    StockPlanOrderList
  },
  data() {
    return {
      storageId: '',
      currentTableRow: {},
      currentTableRow2: {},
      currentTableRow3: {}
    };
  },
  methods: {
    onStorageChange(val) {
      this.storageId = val || '';
      this.$nextTick(() => {
        this.$refs.table2?.handleSearch();
        this.$refs.table3?.handleSearch();
      });
    },
    clickTableRow1(row) {
      this.currentTableRow = row || {};
      this.currentTableRow2 = {};
      this.currentTableRow3 = {};
      this.$nextTick(() => {
        this.$refs.table2?.handleSearch();
        this.$refs.table3?.handleSearch();
      });
    },
    clickTableRow2(row) {
      this.currentTableRow2 = row || {};
      this.$nextTick(() => {
        this.$refs.table3?.handleSearch();
      });
    },
    clickTableRow3(row) {
      this.currentTableRow3 = row || {};
      this.$nextTick(() => {
        this.$refs.table2?.handleSearch();
      });
    },
    refreshTable2() {
      this.$refs.table2?.handleSearch();
    },
    refreshTable3() {
      this.$refs.table3?.handleSearch();
    }
  }
};
</script>
