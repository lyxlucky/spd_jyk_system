<template>
  <el-dialog
    :visible.sync="visibleSync"
    :title="title || '耗材使用明细'"
    width="1180px"
    append-to-body
    :close-on-click-modal="true"
    @open="onOpen"
  >
    <ele-pro-table
      ref="table"
      class="data-table"
      size="mini"
      border
      stripe
      :toolbar="false"
      :header-overflow-hidden="false"
      :height="tableHeight"
      :columns="columns"
      :datasource="datasource"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 300, 999999]"
      cache-key="WarehouseAreaThreeInventoryDetailTable"
    />
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getMaterialDetailColumns } from '../columns';
import { getMaterialDetail } from '@/api/Inventory/WarehouseAreaThreeInventory';

export default {
  name: 'MaterialDetailDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      columns: getMaterialDetailColumns(),
      tableHeight: '470px'
    };
  },
  computed: {
    visibleSync: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    }
  },
  methods: {
    onOpen() {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.reload({ page: 1 });
      });
    },
    async datasource({ page, limit }) {
      if (!this.filters?.WAREHOUSE_AREA_ID) {
        return { count: 0, list: [] };
      }
      try {
        const res = await getMaterialDetail(this.filters, page || 1, limit || 50);
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询明细失败');
        return { count: 0, list: [] };
      }
    }
  }
};
</script>

<style scoped>
:deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>
