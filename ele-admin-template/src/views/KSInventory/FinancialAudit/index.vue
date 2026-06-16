<template>
  <div class="ele-body spd-page financial-audit">
    <el-card shadow="never">
      <div class="summary-bar">
        <span>总金额: <b>{{ summary.sumMoney }}</b></span>
        <span>已审批金额: <b>{{ summary.examineMoney }}</b></span>
        <span>未审批金额: <b>{{ summary.disExamineMoney }}</b></span>
        <span>总数量: <b>{{ summary.allSumCount }}</b></span>
        <span>当前页数量: <b>{{ summary.pageCount }}</b></span>
        <span>当前页金额: <b>{{ summary.pageMoney }}</b></span>
      </div>
      <AuditSearch
        ref="search"
        :loading-fpqs="loadingFpqs"
        :loading-cancel-fpqs="loadingCancelFpqs"
        :loading-audit="loadingAudit"
        :loading-audit-no="loadingAuditNo"
        :exporting="exporting"
        :exporting-qs="exportingQs"
        :exporting-month="exportingMonth"
        @search="reload"
        @confirm-audit="onConfirmAudit"
        @cancel-audit="onCancelAudit"
        @fpqs="onFpqs"
        @cancel-fpqs="onCancelFpqs"
        @cancel-invoice="onCancelInvoice"
        @export-data="onExportData"
        @export-fpqs="onExportFpqs"
        @export-month="onExportMonth"
        @sync-yg="onSyncYg"
        @send-hop="onSendHop"
      />
      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="50"
        :page-sizes="[10, 50, 100, 150, 200, 300, 1000]"
        cache-key="KSFinancialAuditTable"
        @sort-change="onSortChange"
      >
        <template v-slot:monthBill="{ row }">
          <el-link type="primary" :underline="false" @click="openDetail(row.MONTHBILLNUM)">
            {{ row.MONTHBILLNUM }}
          </el-link>
        </template>
        <template v-slot:pic="{ row }">
          <template v-if="!row.PIC_URL">无图片</template>
          <a
            v-else-if="String(row.PIC_URL).indexOf('pdf') !== -1"
            :href="picUrl(row.PIC_URL)"
            target="_blank"
          >pdf文件</a>
          <img
            v-else
            class="invoice-thumb"
            :src="picUrl(row.PIC_URL)"
            @click="previewPic(row.PIC_URL)"
          />
        </template>
      </ele-pro-table>
    </el-card>
    <InvoiceDetailDialog :visible.sync="detailVisible" :month-bill-num="detailBillNum" />
    <el-dialog :visible.sync="picPreviewVisible" width="800px" append-to-body title="发票图片">
      <img v-if="previewUrl" :src="previewUrl" style="max-width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { BACK_BASE_URL } from '@/config/setting';
import AuditSearch from './components/AuditSearch.vue';
import InvoiceDetailDialog from './components/InvoiceDetailDialog.vue';
import { getAuditColumns } from './columns';
import { openExcelFile } from './utils';
import {
  financeAudit,
  suerFPQS,
  cancelFPQS,
  suerAudit,
  suerAuditNo,
  cancelFinaceAudit,
  syncYGOrder,
  sendInvoiceToHop,
  excelExport
} from '@/api/KSInventory/FinancialAudit';

export default {
  name: 'KSFinancialAudit',
  components: { AuditSearch, InvoiceDetailDialog },
  data() {
    return {
      columns: getAuditColumns(),
      tableHeight: 'calc(100vh - 420px)',
      selection: [],
      summary: {
        sumMoney: '0.00',
        examineMoney: '0.00',
        disExamineMoney: '0.00',
        allSumCount: 0,
        pageCount: 0,
        pageMoney: '0.00'
      },
      lastWhere: {},
      lastSort: { field: '', order: '' },
      detailVisible: false,
      detailBillNum: '',
      picPreviewVisible: false,
      previewUrl: '',
      loadingFpqs: false,
      loadingCancelFpqs: false,
      loadingAudit: false,
      loadingAuditNo: false,
      exporting: false,
      exportingQs: false,
      exportingMonth: false
    };
  },
  methods: {
    picUrl(name) {
      if (!name) return '';
      const file = String(name).replace(/:/g, '_');
      const base = (BACK_BASE_URL || '').replace(/\/$/, '');
      return `${base}/Upload/InvoicePic/${file}`;
    },
    previewPic(name) {
      this.previewUrl = this.picUrl(name);
      this.picPreviewVisible = true;
    },
    openDetail(billNum) {
      if (!billNum) return;
      this.detailBillNum = billNum;
      this.detailVisible = true;
    },
    onSortChange({ prop, order }) {
      this.lastSort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.reload(this.lastWhere);
    },
    async datasource({ page, limit, where, order }) {
      const w = where || this.lastWhere;
      const sort = {
        field: order?.sort || this.lastSort.field || '',
        order:
          order?.order === 'ascending'
            ? 'asc'
            : order?.order === 'descending'
              ? 'desc'
              : this.lastSort.order || ''
      };
      this.lastWhere = w;
      this.lastSort = sort;
      try {
        const res = await financeAudit(w, page, limit, sort);
        let pageCount = 0;
        let pageMoney = 0;
        (res.result || []).forEach((r) => {
          pageCount += Number(r.QTY) || 0;
          pageMoney += parseFloat(r.Money) || 0;
        });
        this.summary = {
          sumMoney: parseFloat(res.SumMoney || 0).toFixed(2),
          examineMoney: parseFloat(res.ExamineMoney || 0).toFixed(2),
          disExamineMoney: parseFloat(res.DisExamineMoney || 0).toFixed(2),
          allSumCount: res.AllsumCount ?? 0,
          pageCount,
          pageMoney: pageMoney.toFixed(2)
        };
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    requireSelection() {
      if (!this.selection.length) {
        Message.warning('请选择条目');
        return null;
      }
      return this.selection;
    },
    async onFpqs() {
      const rows = this.requireSelection();
      if (!rows) return;
      try {
        await MessageBox.confirm('确定发票签收吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.loadingFpqs = true;
      try {
        const res = await suerFPQS(rows);
        Message.success(res.msg || '签收成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '签收失败');
      } finally {
        this.loadingFpqs = false;
      }
    },
    async onCancelFpqs() {
      const rows = this.requireSelection();
      if (!rows) return;
      try {
        await MessageBox.confirm('确定取消发票签收吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.loadingCancelFpqs = true;
      try {
        const res = await cancelFPQS(rows);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.loadingCancelFpqs = false;
      }
    },
    async onConfirmAudit() {
      const rows = this.requireSelection();
      if (!rows) return;
      try {
        await MessageBox.confirm('确认审批吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.loadingAudit = true;
      try {
        const res = await suerAudit(rows);
        Message.success(res.msg || '审批成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '审批失败');
      } finally {
        this.loadingAudit = false;
      }
    },
    async onCancelAudit() {
      const rows = this.requireSelection();
      if (!rows) return;
      try {
        await MessageBox.confirm('确认取消审批吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.loadingAuditNo = true;
      try {
        const res = await suerAuditNo(rows);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.loadingAuditNo = false;
      }
    },
    async onCancelInvoice() {
      const rows = this.requireSelection();
      if (!rows) return;
      try {
        await MessageBox.confirm('确定取消发票吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const res = await cancelFinaceAudit(rows);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async onExportData() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const file = await excelExport('ExcelFinanceAudit', where, this.lastSort);
        openExcelFile(file);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onExportFpqs() {
      const where = this.$refs.search.getWhere();
      this.exportingQs = true;
      try {
        const file = await excelExport('ExcelFPQSAudit', where, this.lastSort);
        openExcelFile(file);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingQs = false;
      }
    },
    async onExportMonth() {
      const where = this.$refs.search.getWhere();
      this.exportingMonth = true;
      try {
        const file = await excelExport('ExcelMonthlySummary', where, this.lastSort);
        openExcelFile(file);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingMonth = false;
      }
    },
    async onSyncYg() {
      try {
        await MessageBox.confirm('确认同步阳光平台订单？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const res = await syncYGOrder();
        Message.success(res.msg || '同步成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '同步失败');
      }
    },
    async onSendHop() {
      const rows = this.requireSelection();
      if (!rows) return;
      const invoiceNum = rows[0].MONTHBILLNUM;
      if (!invoiceNum) {
        Message.warning('所选条目没有发票号');
        return;
      }
      try {
        await MessageBox.confirm('确认发送发票到 HOP 吗？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const res = await sendInvoiceToHop(invoiceNum);
        Message.success(res.msg || '发送成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '发送失败');
      }
    }
  }
};
</script>

<style scoped>
.financial-audit .summary-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
}
.invoice-thumb {
  width: 24px;
  height: 24px;
  cursor: pointer;
  object-fit: cover;
}
</style>
