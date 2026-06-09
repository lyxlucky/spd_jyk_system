<template>
  <el-card shadow="never">
    <div slot="header">品种明细列表</div>
    <ele-pro-table
      ref="table"
      size="mini"
      height="360px"
      highlight-current-row
      :columns="columns"
      :datasource="datasource"
      cache-key="pickingMnagementDeliveryDetail"
      @row-click="handleRowClick"
    />
  </el-card>
</template>

<script>
import { getDistributeDetail } from '@/api/Inventory/PickingMnagement';
import { unwrapData } from '../utils';

export default {
  name: 'DeliveryDetailPanel',
  props: {
    stockOutNumber: { type: String, default: '' }
  },
  data() {
    return {
      columns: [
        { prop: 'Varietie_Code', label: '品种材料编码', width: 110 },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 200 },
        { prop: 'Specification_Or_Type', label: '型号/规格', width: 90 },
        { prop: 'Unit', label: '单位', width: 60, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', width: 140 },
        { prop: 'Coefficient', label: '系数', width: 60, align: 'center' },
        { prop: 'replenish_quantity', label: '补货数量', width: 80, align: 'center' }
      ]
    };
  },
  watch: {
    stockOutNumber(val) {
      if (val) this.handleSearch();
    }
  },
  methods: {
    datasource({ page, limit }) {
      if (!this.stockOutNumber) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getDistributeDetail({ page, limit, stockOutNumber: this.stockOutNumber }).then(
        (res) => {
          const data = unwrapData(res);
          return {
            count: data.total || 0,
            list: data.result || []
          };
        }
      );
    },
    handleSearch() {
      this.$refs.table?.reload({ page: 1 });
    },
    handleRowClick(row) {
      this.$emit('variety-selected', row);
    }
  }
};
</script>
