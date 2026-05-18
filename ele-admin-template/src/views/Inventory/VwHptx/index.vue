<template>
  <div class="ele-body vwhptx-page">
    <el-card shadow="never">
      <div class="page-title">货票同行入库</div>
      <div class="summary-bar">
        <span>数量合计: <b>{{ summary.sumQty }}</b></span>
        <span>金额合计: <b>{{ summary.sumMoney }}</b></span>
      </div>
      <VwHptxSearch
        ref="search"
        :exporting="exporting"
        :exporting-collect="exportingCollect"
        :exporting-collect2="exportingCollect2"
        @search="reload"
        @fpqs-change="reload"
        @export="onExport"
        @export-collect="onExportCollect"
        @export-collect2="onExportCollect2"
        @edit-invoice="onEditInvoice"
        @receipt="onReceipt"
        @edit-month="onEditMonth"
        @edit-order-type="onEditOrderType"
        @delete="onDelete"
      />
      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="20"
        :page-sizes="[20, 40, 60, 90, 150, 300, 999999]"
        cache-key="VwHptxTable"
        @row-click="onRowClick"
      >
        <template v-slot:pic="{ row }">
          <template v-if="!row.PIC_URL" />
          <a
            v-else-if="String(row.PIC_URL).indexOf('pdf') !== -1"
            :href="invoicePicUrl(row.PIC_URL)"
            target="_blank"
          >pdf文件</a>
          <img
            v-else
            class="invoice-thumb"
            :src="invoicePicUrl(row.PIC_URL)"
            @click.stop="previewPic(row.PIC_URL)"
          />
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog
      :visible.sync="invoiceDialog.visible"
      title="货票同行填写发票"
      width="450px"
      append-to-body
      @closed="invoiceDialog.invoiceNums = ''"
    >
      <el-form label-width="100px" size="small">
        <el-form-item label="收货单号">
          <el-input :value="currentRow?.DELIVERY_NOTE_NUMBER" disabled />
        </el-form-item>
        <el-form-item label="发票号码">
          <el-input v-model="invoiceDialog.invoiceNums" placeholder="发票号码" />
        </el-form-item>
        <el-form-item label="是否允许结存">
          <el-select v-model="invoiceDialog.type" style="width: 100%">
            <el-option label="普通库" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="invoiceDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="invoiceDialog.loading" @click="submitInvoice">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="monthDialog.visible"
      title="修改结算月份"
      width="450px"
      append-to-body
    >
      <el-form label-width="120px" size="small">
        <el-form-item label="新的结算月份">
          <el-date-picker
            v-model="monthDialog.month"
            type="month"
            value-format="yyyy-MM"
            placeholder="yyyy-MM"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="monthDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="monthDialog.loading" @click="submitMonth">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="orderTypeDialog.visible"
      title="修改入库类型"
      width="450px"
      append-to-body
    >
      <el-form label-width="120px" size="small">
        <el-form-item label="新的入库类型">
          <el-select v-model="orderTypeDialog.orderJsType" style="width: 100%">
            <el-option
              v-for="item in upOrderJsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="orderTypeDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="orderTypeDialog.loading" @click="submitOrderType">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="picPreviewVisible" width="800px" append-to-body title="发票图片">
      <img v-if="previewUrl" :src="previewUrl" style="max-width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import { TOKEN_STORE_NAME } from '@/config/setting';
import VwHptxSearch from './components/VwHptxSearch.vue';
import { getVwHptxColumns } from './columns';
import {
  EXPORT_HEADERS,
  UP_ORDER_JS_TYPE_OPTIONS,
  openExcelFile,
  picUrl,
  rowToExportArray
} from './utils';
import {
  getVwHptx,
  upBatchFpQsState,
  upBatchMonth,
  upBatchOrderJsType,
  delInStockCheck,
  excelVwHptxCollect,
  excelConsumpData,
  commitNydReceiptAndInvoice
} from '@/api/Inventory/VwHptx';

export default {
  name: 'VwHptx',
  components: { VwHptxSearch },
  data() {
    return {
      columns: getVwHptxColumns(),
      tableHeight: 'calc(100vh - 420px)',
      selection: [],
      currentRow: null,
      summary: { sumQty: 0, sumMoney: 0 },
      lastWhere: {},
      exporting: false,
      exportingCollect: false,
      exportingCollect2: false,
      picPreviewVisible: false,
      previewUrl: '',
      upOrderJsTypeOptions: UP_ORDER_JS_TYPE_OPTIONS,
      invoiceDialog: { visible: false, invoiceNums: '', type: '1', loading: false },
      monthDialog: { visible: false, month: '', loading: false },
      orderTypeDialog: { visible: false, orderJsType: '0', loading: false }
    };
  },
  methods: {
    invoicePicUrl(name) {
      return picUrl(name);
    },
    previewPic(name) {
      this.previewUrl = picUrl(name);
      this.picPreviewVisible = true;
    },
    onRowClick(row) {
      this.currentRow = row;
    },
    buildRowDataJson(rows) {
      return rows.map((r) => ({
        ID: r.ID,
        BATCH_ID: r.BATCH_ID,
        DELIVERY_NOTE_NUMBER: r.DELIVERY_NOTE_NUMBER
      }));
    },
    joinBatchIds(rows) {
      return rows.map((r) => r.BATCH_ID).join(',');
    },
    requireSelection(message = '请至少选择一条数据') {
      if (!this.selection.length) {
        Message.warning(message);
        return false;
      }
      return true;
    },
    async datasource({ page, limit, where }) {
      const w = where || this.lastWhere;
      this.lastWhere = w;
      try {
        const res = await getVwHptx(w, page || 1, limit || 20);
        this.summary = {
          sumQty: res.sqlSumQty ?? 0,
          sumMoney: res.sqlSumMoney ?? 0
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
    async onExport() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const res = await getVwHptx(where, 1, 999999);
        const data = [EXPORT_HEADERS];
        (res.result || []).forEach((r) => data.push(rowToExportArray(r)));
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '货票同行入库');
        writeFile(book, '货票同行入库.xlsx');
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onExportCollect() {
      this.exportingCollect = true;
      try {
        const res = await excelVwHptxCollect();
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingCollect = false;
      }
    },
    async onExportCollect2() {
      const where = this.$refs.search.getWhere();
      this.exportingCollect2 = true;
      try {
        const res = await excelConsumpData(where);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingCollect2 = false;
      }
    },
    onEditInvoice() {
      if (!this.currentRow?.ID) {
        Message.warning('请选择收货单号');
        return;
      }
      this.invoiceDialog.invoiceNums = '';
      this.invoiceDialog.visible = true;
    },
    async submitInvoice() {
      const row = this.currentRow;
      if (!row?.ID) return;
      this.invoiceDialog.loading = true;
      try {
        const fd = new FormData();
        const tk = sessionStorage.getItem(TOKEN_STORE_NAME) || '';
        fd.append('Token', tk);
        fd.append('RECEIPT_ID', row.ID);
        fd.append('DELIVERY_NOTE_NUMBER', row.DELIVERY_NOTE_NUMBER || '');
        fd.append('INVOICE_NUMS', this.invoiceDialog.invoiceNums || '');
        fd.append('TYPE', this.invoiceDialog.type || '1');
        await commitNydReceiptAndInvoice(fd);
        Message.success('保存成功');
        this.invoiceDialog.visible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.invoiceDialog.loading = false;
      }
    },
    async onReceipt(state) {
      if (!this.requireSelection()) return;
      const rows = this.selection;
      try {
        await upBatchFpQsState(this.joinBatchIds(rows), state, this.buildRowDataJson(rows));
        Message.success('操作成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    onEditMonth() {
      if (!this.currentRow?.ID) {
        Message.warning('请选择条数据');
        return;
      }
      this.monthDialog.month = '';
      this.monthDialog.visible = true;
    },
    async submitMonth() {
      if (!this.requireSelection()) return;
      if (!this.monthDialog.month) {
        Message.warning('请选择结算月份');
        return;
      }
      const rows = this.selection;
      this.monthDialog.loading = true;
      try {
        await upBatchMonth(
          this.joinBatchIds(rows),
          this.monthDialog.month,
          this.buildRowDataJson(rows)
        );
        Message.success('保存成功');
        this.monthDialog.visible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.monthDialog.loading = false;
      }
    },
    onEditOrderType() {
      if (!this.requireSelection()) return;
      const hasMonth = this.selection.some((r) => r.HPTX_MONTH != null && r.HPTX_MONTH !== '');
      if (hasMonth) {
        Message.warning('已存在结算月份的数据不允许修改入库类型');
        return;
      }
      this.orderTypeDialog.orderJsType = '0';
      this.orderTypeDialog.visible = true;
    },
    async submitOrderType() {
      if (!this.requireSelection()) return;
      this.orderTypeDialog.loading = true;
      try {
        await upBatchOrderJsType(this.joinBatchIds(this.selection), this.orderTypeDialog.orderJsType);
        Message.success('保存成功');
        this.orderTypeDialog.visible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.orderTypeDialog.loading = false;
      }
    },
    async onDelete() {
      if (!this.requireSelection('请选中要删除的数据')) return;
      try {
        await MessageBox.confirm('确认要删除此数据吗', '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        await delInStockCheck(this.joinBatchIds(this.selection));
        Message.success('删除成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.vwhptx-page .page-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
}
.summary-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-end;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
.summary-bar b {
  color: #1e9fff;
  font-weight: 600;
  margin-left: 4px;
}
.invoice-thumb {
  max-width: 60px;
  max-height: 40px;
  cursor: pointer;
  vertical-align: middle;
}
</style>
