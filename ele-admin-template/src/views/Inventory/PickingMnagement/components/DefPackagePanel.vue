<template>
  <el-card shadow="never">
    <div slot="header">定数包明细</div>
    <ele-pro-table
      ref="table"
      size="mini"
      height="360px"
      :columns="columns"
      :datasource="datasource"
      cache-key="pickingMnagementDefPackage"
    />
  </el-card>
</template>

<script>
import {
  getPickDefDetail,
  getAllPickDefDetail,
  getDistributeDefDetail,
  getDistributeDefDetailNum
} from '@/api/Inventory/PickingMnagement';
import { formatDateTime, formatDefPackageState, unwrapData } from '../utils';

const PICK_COLUMNS = [
  { prop: 'batch', label: '生产批号', width: 100 },
  { prop: 'Coefficient', label: '系数', width: 60, align: 'center' },
  { prop: 'def_no_pkg_code', label: '定数码', minWidth: 150,align: 'center' },
  {
    prop: 'pack_time',
    label: '拣配时间',
    width: 150,
    formatter: (row) => formatDateTime(row.pack_time)
  },
  { prop: 'packer', label: '拣配人', width: 80 },
  { prop: 'PositionNum', label: '货位号', width: 90 },
  { prop: 'Supplier_Name', label: '供应商名称', minWidth: 120 ,align: 'center'}
];

const DELIVERY_COLUMNS = [
  { prop: 'batch', label: '生产批号', width: 100 },
  {
    prop: 'coefficient',
    label: '系数',
    width: 60,
    align: 'center',
    formatter: (row) => row.coefficient ?? row.Coefficient ?? ''
  },
  { prop: 'def_no_pkg_code', label: '定数码', minWidth: 150 },
  {
    prop: 'replenish_time',
    label: '补货时间',
    width: 150,
    formatter: (row) => formatDateTime(row.replenish_time)
  },
  {
    prop: 'State',
    label: '补货状态',
    width: 90,
    formatter: (row) => formatDefPackageState(row.State)
  },
  { prop: 'Supplier_Name', label: '供应商名称', minWidth: 120 }
];

export default {
  name: 'DefPackagePanel',
  props: {
    mode: { type: String, default: 'pick' },
    loadConfig: {
      type: Object,
      default: () => ({ type: 'allPick', packNumber: '', detailId: '', stockOutNumber: '' })
    }
  },
  computed: {
    isDeliveryView() {
      const type = this.loadConfig?.type || '';
      return this.mode === 'delivery' || type === 'allDelivery' || type === 'deliveryDetail';
    },
    columns() {
      return this.isDeliveryView ? DELIVERY_COLUMNS : PICK_COLUMNS;
    }
  },
  methods: {
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      const cfg = this.loadConfig || {};
      const { type, packNumber, detailId, stockOutNumber } = cfg;
      const mapResult = (res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      };

      if (type === 'pickDetail' && detailId) {
        return getPickDefDetail({ page, limit, detailId }).then(mapResult);
      }
      if (type === 'allPick' && packNumber) {
        return getAllPickDefDetail({ page, limit, packDirectiveNumber: packNumber }).then(
          mapResult
        );
      }
      if (type === 'deliveryDetail' && detailId) {
        return getDistributeDefDetail({ page, limit, detailId }).then(mapResult);
      }
      if (type === 'allDelivery' && stockOutNumber) {
        return getDistributeDefDetailNum({ page, limit, stockOutNumber }).then(mapResult);
      }
      return Promise.resolve({ count: 0, list: [] });
    }
  }
};
</script>
