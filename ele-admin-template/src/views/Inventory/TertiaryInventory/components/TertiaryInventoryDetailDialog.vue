<template>
  <el-dialog
    :visible.sync="visibleSync"
    title="库存详情"
    width="1000px"
    append-to-body
    :close-on-click-modal="true"
    @open="onOpen"
    @closed="onClosed"
  >
    <p v-if="summaryText" class="detail-summary">{{ summaryText }}</p>
    <ele-pro-table
      ref="table"
      :height="tableHeight"
      :columns="columns"
      :datasource="datasource"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 300, 99999]"
      cache-key="TertiaryInventoryDetailTable"
    />
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getTertiaryDetailColumns } from '../columns';
import { tertiaryInventoryDetailList } from '@/api/Inventory/TertiaryInventory';

export default {
  name: 'TertiaryInventoryDetailDialog',
  props: {
    visible: Boolean,
    varietieCode: { type: String, default: '' },
    deptTwoCode: { type: String, default: '' },
    tibdStar: { type: String, default: '' },
    tibdEnd: { type: String, default: '' }
  },
  data() {
    return {
      columns: getTertiaryDetailColumns(),
      tableHeight: '420px',
      summaryText: ''
    };
  },
  computed: {
    visibleSync: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    onOpen() {
      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.reload({ page: 1 });
        }
      });
    },
    onClosed() {
      this.summaryText = '';
    },
    async datasource({ page, limit }) {
      if (!this.varietieCode || !this.deptTwoCode) {
        return { count: 0, list: [] };
      }
      try {
        const res = await tertiaryInventoryDetailList(
          this.varietieCode,
          this.deptTwoCode,
          page || 1,
          limit || 50,
          this.tibdStar,
          this.tibdEnd
        );
        const jfQty = Number(res.jfQty) || 0;
        const slQty = Number(res.slQty) || 0;
        this.summaryText = `总入库数量: ${slQty}   总计费数量: ${jfQty * -1}   总库存数: ${jfQty + slQty}`;
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    }
  }
};
</script>

<style scoped>
.detail-summary {
  font-size: 16px;
  margin: 0 0 12px;
  color: #303133;
}
</style>
