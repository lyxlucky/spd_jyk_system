<template>
  <div class="ele-body mensual-bills">
    <el-card shadow="never" class="tabs-card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="月结数据管理" name="data">
          <MonthlyDataPanel v-if="activeTab === 'data'" />
        </el-tab-pane>
        <el-tab-pane label="发票号码管理" name="invoice">
          <InvoiceNumberPanel v-if="activeTab === 'invoice'" />
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

<style scoped>
.mensual-bills >>> .el-card__body {
  padding: 12px;
}
.tabs-card {
  min-height: calc(100vh - 120px);
}
</style>
