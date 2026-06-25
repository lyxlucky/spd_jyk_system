<template>
  <div class="ele-body spd-page mensual-bills">
    <el-card shadow="never" class="tabs-card">
      <el-tabs v-model="activeTab" type="card" class="mensual-bills-tabs">
        <el-tab-pane label="月结数据管理" name="data">
          <div class="tab-pane-body">
            <MonthlyDataPanel v-if="activeTab === 'data'" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="发票号码管理" name="invoice">
          <div class="tab-pane-body">
            <InvoiceNumberPanel v-if="activeTab === 'invoice'" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import MonthlyDataPanel from './components/MonthlyDataPanel.vue';
import InvoiceNumberPanel from './components/InvoiceNumberPanel.vue';

export default {
  name: 'MensualBills',
  components: {
    MonthlyDataPanel,
    InvoiceNumberPanel
  },
  data() {
    return {
      activeTab: 'data'
    };
  }
};
</script>

<style scoped lang="scss">
.mensual-bills >>> .tabs-card > .el-card__body {
  padding: 0;
}

.tabs-card {
  min-height: calc(100vh - 120px);
  border: 1px solid #ebeef5;
}

.mensual-bills >>> .el-table th .cell {
  white-space: nowrap;
}

.mensual-bills-tabs >>> .el-tabs__header {
  margin: 0;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.mensual-bills-tabs >>> .el-tabs__nav-wrap {
  padding: 8px 12px 0;
}

.mensual-bills-tabs >>> .el-tabs__item {
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  padding: 0 16px;
  border-radius: 4px 4px 0 0;
}

.mensual-bills-tabs >>> .el-tabs__item.is-active {
  font-weight: 600;
  background: #fff;
}

.tab-pane-body {
  padding: 10px 12px 12px;
  background: #f0f2f5;
  min-height: calc(100vh - 168px);
}

.mensual-bills >>> .spd-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.mensual-bills >>> .spd-section__head {
  font-size: 14px;
}

.mensual-bills >>> .spd-panel + .spd-panel {
  border-top: 1px solid #ebeef5;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
}

.mensual-bills >>> .spd-panel--search {
  background: #fafbfc;
}

.mensual-bills >>> .spd-table-panel {
  background: #fff;
}
</style>
