<template>
  <ele-modal
    :visible="visible"
    title="发票关联品种"
    width="900px"
    :destroy-on-close="true"
    @update:visible="updateVisible"
  >
    <div class="detail-toolbar">
      总数量：<b>{{ totalNum }}</b>，总金额：<b>{{ totalMoney.toFixed(2) }}</b>
    </div>
    <ele-pro-table
      ref="table"
      height="420px"
      :columns="columns"
      :datasource="datasource"
      :page-size="20"
      :page-sizes="[20, 50, 100, 99999]"
      cache-key="FinancialAuditItemDetail"
    />
  </ele-modal>
</template>

<script>
import { Message } from 'element-ui';
import { getFinanceAuditByItem } from '@/api/KSInventory/FinancialAudit';

export default {
  name: 'InvoiceDetailDialog',
  props: {
    visible: Boolean,
    monthBillNum: String,
    supplierCode: { type: String, default: '' }
  },
  data() {
    return {
      totalNum: 0,
      totalMoney: 0,
      columns: [
        { type: 'index', width: 50, align: 'center' },
        { prop: 'VARIETIE_CODE', label: '品种编码', minWidth: 120 },
        { prop: 'VARIETIE_NAME', label: '品种全称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'QTY', label: '数量', width: 80, align: 'center' },
        { prop: 'PRICE', label: '单价', width: 90, align: 'right' },
        {
          label: '总金额',
          width: 100,
          align: 'right',
          formatter: (row) => ((Number(row.QTY) || 0) * (Number(row.PRICE) || 0)).toFixed(2)
        }
      ]
    };
  },
  watch: {
    visible(v) {
      if (v && this.monthBillNum) {
        this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async datasource({ page, limit }) {
      if (!this.monthBillNum) {
        return { count: 0, list: [] };
      }
      try {
        const res = await getFinanceAuditByItem(
          this.monthBillNum,
          page || 1,
          limit || 20,
          this.supplierCode
        );
        // 优先用后端汇总；无则按当前页估算
        this.totalNum = Number(res.totalNum) || 0;
        this.totalMoney = Number(res.totalMoney) || 0;
        if (!this.totalNum && !this.totalMoney) {
          (res.result || []).forEach((item) => {
            this.totalNum += Number(item.QTY) || 0;
            this.totalMoney += (Number(item.QTY) || 0) * (Number(item.PRICE) || 0);
          });
        }
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '加载明细失败');
        return { count: 0, list: [] };
      }
    }
  }
};
</script>

<style scoped>
.detail-toolbar {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
