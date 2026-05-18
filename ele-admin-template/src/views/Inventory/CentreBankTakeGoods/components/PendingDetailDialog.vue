<template>
  <ele-modal :visible="visible" title="待收货详情" width="1200px" @update:visible="$emit('update:visible', $event)">
    <el-form size="mini" inline>
      <el-form-item label="收货单号">
        <el-input v-model="q.deliveryNoteNumber" clearable placeholder="请输入收货单号" style="width: 160px" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input v-model="q.varietieCode" clearable placeholder="品种编码/品种名称" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="rows" border stripe size="small" height="520">
      <el-table-column prop="Delivery_Note_Number" label="收货单号" min-width="140" show-overflow-tooltip />
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="120" />
      <el-table-column prop="Varietie_Name" label="品种名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" width="110" />
      <el-table-column prop="Unit" label="单位" width="70" align="center" />
      <el-table-column prop="Batch" label="生产批号" width="100" />
      <el-table-column label="生产日期" width="110">
        <template slot-scope="{ row }">{{ fmtDate10(row.Batch_Production_Date) }}</template>
      </el-table-column>
      <el-table-column label="有效期" width="110">
        <template slot-scope="{ row }">{{ fmtDate10(row.Batch_Validity_Period) }}</template>
      </el-table-column>
      <el-table-column prop="Receivable" label="应收数量" width="90" align="center" />
      <el-table-column label="结算价" width="90" align="right">
        <template slot-scope="{ row }">{{ fmtPrice(row.Supply_Price) }}</template>
      </el-table-column>
      <el-table-column v-if="flags.isCg" label="采购价" width="90" align="right">
        <template slot-scope="{ row }">{{ fmtPrice(row.Purchase_Price) }}</template>
      </el-table-column>
      <el-table-column label="总金额" width="90" align="right">
        <template slot-scope="{ row }">{{ fmtPrice((Number(row.Supply_Price) || 0) * (Number(row.Receivable) || 0)) }}</template>
      </el-table-column>
      <el-table-column prop="Supplier_Name" label="供应商名称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="120" show-overflow-tooltip />
    </el-table>
    <el-pagination
      class="mt8"
      small
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="load"
    />
  </ele-modal>
</template>

<script>
import { Message } from 'element-ui';
import { getSystemDeliveredVarieties2 } from '@/api/Inventory/CentreBankTakeGoods';
import { fmtDate10, fmtPrice, hpFlags } from '../utils';

export default {
  name: 'PendingDetailDialog',
  props: { visible: Boolean },
  data() {
    return {
      flags: hpFlags,
      q: { deliveryNoteNumber: '', varietieCode: '' },
      rows: [],
      loading: false,
      total: 0,
      page: 1,
      pageSize: 10
    };
  },
  watch: {
    visible(v) {
      if (v) this.load(1);
    }
  },
  methods: {
    fmtDate10,
    fmtPrice,
    async load(p) {
      this.page = p || 1;
      this.loading = true;
      try {
        const res = await getSystemDeliveredVarieties2({
          page: this.page,
          size: this.pageSize,
          deliveryNoteNumber: this.q.deliveryNoteNumber,
          varietieCode: this.q.varietieCode
        });
        this.rows = res.result || [];
        this.total = res.total || 0;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.mt8 {
  margin-top: 8px;
  text-align: right;
}
</style>
