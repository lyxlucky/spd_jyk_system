<template>
  <div class="ele-body picking-management">
    <el-row :gutter="10">
      <el-col :span="12">
        <PickListPanel ref="pickList" @pick-selected="onPickSelected" />
      </el-col>
      <el-col :span="12">
        <DeliveryListPanel
          ref="deliveryList"
          :highlight-pack-number="highlightPackNumber"
          @delivery-selected="onDeliverySelected"
        />
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <PickDetailPanel
          v-show="activeMode === 'pick'"
          ref="pickDetail"
          :pack-number="selectedPick.packNumber"
          @variety-selected="onPickVarietySelected"
        />
        <DeliveryDetailPanel
          v-show="activeMode === 'delivery'"
          ref="deliveryDetail"
          :stock-out-number="selectedDelivery.stockOutNumber"
          @variety-selected="onDeliveryVarietySelected"
        />
      </el-col>
      <el-col :span="12">
        <DefPackagePanel ref="defPackage" :mode="activeMode" :load-config="defLoadConfig" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PickListPanel from './components/PickListPanel.vue';
import DeliveryListPanel from './components/DeliveryListPanel.vue';
import PickDetailPanel from './components/PickDetailPanel.vue';
import DeliveryDetailPanel from './components/DeliveryDetailPanel.vue';
import DefPackagePanel from './components/DefPackagePanel.vue';
import { initPickingHpFlags } from './utils';

export default {
  name: 'PickingMnagement',
  components: {
    PickListPanel,
    DeliveryListPanel,
    PickDetailPanel,
    DeliveryDetailPanel,
    DefPackagePanel
  },
  created() {
    const perms = this.$store.state.user?.info?.permission_group || [];
    initPickingHpFlags(perms);
  },
  data() {
    return {
      activeMode: 'pick',
      highlightPackNumber: '',
      selectedPick: { packNumber: '', id: '', deptName: '', packState: '' },
      selectedDelivery: {
        stockOutNumber: '',
        deptName: '',
        deptCode: '',
        replenishState: ''
      },
      defLoadConfig: { type: 'allPick', packNumber: '', detailId: '', stockOutNumber: '' }
    };
  },
  methods: {
    onPickSelected(row) {
      const packNumber = row.Pack_Directive_Number || row.pack_directive_number || '';
      this.activeMode = 'pick';
      this.highlightPackNumber = packNumber;
      this.selectedPick = {
        packNumber,
        id: row.ID || row.id || '',
        deptName: row.Dept_Two_Name || row.dept_two_name || '',
        packState: row.Pack_State ?? row.pack_state
      };
      this.defLoadConfig = { type: 'allPick', packNumber, detailId: '', stockOutNumber: '' };
      this.$nextTick(() => {
        this.$refs.pickDetail?.handleSearch();
        this.$refs.defPackage?.reload();
        this.$refs.deliveryList?.handleSearch();
      });
    },
    onDeliverySelected(row) {
      const stockOutNumber =
        row.stock_out_distribute_number || row.STOCK_OUT_DISTRIBUTE_NUMBER || '';
      this.activeMode = 'delivery';
      this.selectedDelivery = {
        stockOutNumber,
        deptName: row.dept_two_name || row.Dept_Two_Name || '',
        deptCode: row.dept_two_code || row.Dept_Two_Code || '',
        replenishState: row.replenish_state ?? row.Replenish_State
      };
      this.defLoadConfig = {
        type: 'allDelivery',
        packNumber: '',
        detailId: '',
        stockOutNumber
      };
      this.$nextTick(() => {
        this.$refs.deliveryDetail?.handleSearch();
        this.$refs.defPackage?.reload();
      });
    },
    onPickVarietySelected(row) {
      const detailId = row.ID || row.id || '';
      this.defLoadConfig = {
        type: 'pickDetail',
        packNumber: this.selectedPick.packNumber,
        detailId,
        stockOutNumber: ''
      };
      this.$nextTick(() => this.$refs.defPackage?.reload());
    },
    onDeliveryVarietySelected(row) {
      const detailId = row.ID || row.id || '';
      this.defLoadConfig = {
        type: 'deliveryDetail',
        packNumber: '',
        detailId,
        stockOutNumber: this.selectedDelivery.stockOutNumber
      };
      this.$nextTick(() => this.$refs.defPackage?.reload());
    }
  }
};
</script>

<style lang="scss" scoped>
.picking-management :deep(.el-card__header) {
  padding: 10px 15px;
  font-weight: 600;
}
.picking-management :deep(.highlight-pack-row) {
  background-color: #f9d5d5 !important;
}
</style>
