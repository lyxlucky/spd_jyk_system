<template>
  <ele-modal :visible="visible" title="历史收货单号" width="1200px" @update:visible="$emit('update:visible', $event)">
    <el-form size="mini" inline>
      <el-form-item label="收货开始">
        <el-date-picker v-model="q.startTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="收货结束">
        <el-date-picker v-model="q.endTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="收货单号">
        <el-input v-model="q.deliveryNoteNumber" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="q.specType" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input v-model="q.varietie" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="q.batch" clearable style="width: 100px" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="q.supplierName" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
        <el-button :disabled="!selected" @click="onReprint">补打印</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="rows" border stripe size="small" height="420" @row-click="onRowClick">
      <el-table-column type="index" width="45" />
      <el-table-column prop="Name" label="院区库房" width="100" />
      <el-table-column prop="Delivery_Note_Number" label="收货单号" min-width="120" />
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="110" />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" width="100" />
      <el-table-column prop="Batch" label="批号" width="90" />
      <el-table-column prop="Supplier_Name" label="供应商" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Delivery_Time" label="收货时间" width="150">
        <template slot-scope="{ row }">{{ fmtDateTime(row.Delivery_Time) }}</template>
      </el-table-column>
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
import { searchDeliveryHistory, printHistoryDelivery } from '@/api/Inventory/CentreBankTakeGoods';
import { fmtDateTime, openExcelFile } from '../utils';

export default {
  name: 'DeliveryHistoryDialog',
  props: { visible: Boolean },
  data() {
    return {
      q: {
        startTime: '',
        endTime: '',
        deliveryNoteNumber: '',
        specType: '',
        varietie: '',
        batch: '',
        supplierName: ''
      },
      rows: [],
      loading: false,
      total: 0,
      page: 1,
      pageSize: 50,
      selected: null
    };
  },
  watch: {
    visible(v) {
      if (v) this.load(1);
    }
  },
  methods: {
    fmtDateTime,
    async load(p) {
      this.page = p || 1;
      this.loading = true;
      try {
        const res = await searchDeliveryHistory({ ...this.q, page: this.page, size: this.pageSize });
        this.rows = res.result || [];
        this.total = res.total || 0;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    onRowClick(row) {
      this.selected = row;
    },
    async onReprint() {
      if (!this.selected) return;
      try {
        const res = await printHistoryDelivery({
          deliveryNoteNumber: this.selected.Delivery_Note_Number,
          receiptId: this.selected.Goods_Var_Cargo_Receipt_Id
        });
        if (res.msg) openExcelFile(res.msg);
        else Message.success(res.msg || '操作成功');
      } catch (e) {
        Message.error(e.message || '补打印失败');
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
