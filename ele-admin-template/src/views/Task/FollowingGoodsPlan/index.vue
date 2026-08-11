<template>
  <div class="ele-body spd-page following-goods-plan-page">
    <div class="following-goods-plan-page__scroll">
      <el-row :gutter="10" class="following-goods-plan-row">
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
      <el-row style="margin-top: 10px" class="following-goods-plan-row">
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

<style lang="scss" scoped>
.following-goods-plan-page {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 覆盖全局 .spd-page min-width，避免整页被宽表撑出右侧大空白 */
  min-width: 0 !important;

  :deep(.el-table th .cell) {
    white-space: nowrap;
  }

  /* 栅格列允许收缩，否则宽表会撑破整行 */
  :deep(.el-col) {
    min-width: 0;
  }

  :deep(.el-card) {
    max-width: 100%;
  }

  :deep(.el-card__body) {
    max-width: 100%;
    overflow: hidden;
  }

  /* 查询/按钮区占满视口可用宽度，超出换行 */
  :deep(.el-form--inline) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  :deep(.el-form--inline .el-form-item) {
    flex-shrink: 0;
    margin-right: 10px;
    margin-bottom: 6px;
  }

  /* 表格在各自区域内横向滚动，不把整页拉宽 */
  :deep(.ele-pro-table) {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  :deep(.ele-pro-table .el-table) {
    width: max-content;
    min-width: 100%;
  }
}

.following-goods-plan-page__scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.following-goods-plan-row {
  width: 100%;
  max-width: 100%;
}
</style>
