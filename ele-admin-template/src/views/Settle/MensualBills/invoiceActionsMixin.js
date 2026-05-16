/**
 * 发票号码管理 Tab — 旧版 MensualBills.cshtml Tab2 操作
 */
import * as api from '@/api/Settle/MensualBills';
import { HOME_HP, fmtMoney, openExcelFile } from './utils';

export default {
  methods: {
    async invPrintOutbound() {
      if (!this.selectedBill || !this.selectedSupplier) {
        this.$message.warning('请选择月结单和供应商');
        return;
      }
      if (['fszxy', 'fsdwrmyy', 'fsdl'].includes(this.hp)) {
        return this.invPrintFszxy();
      }
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.searchMontySupperPrint({
          Bill_MonthNumber: this.selectedBill.MonthNumber,
          Supplier_Code_div: this.selectedSupplier.Supplier_Code,
          Supplier_Name_div: this.selectedSupplier.Supplier_Name,
          changenum: '8'
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invPrintFszxy() {
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.fsGetReportYueJieExcel({
          SUP_CODE: this.selectedSupplier.Supplier_Code,
          MONTH_ID: this.selectedBill.ID,
          changenum: 10000,
          isJc: this.isJc
        });
        if (res.msg) openExcelFile(res.msg, '/Excel/fszxy/files/');
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invPrintOutboundSummary() {
      if (!this.selectedBill) return;
      const loading = this.$loading({ lock: true });
      try {
        let invoiceJson = '';
        try {
          const inv = await api.b2bGetInvoiceNum(this.selectedBill.ID);
          invoiceJson = JSON.stringify(inv);
        } catch (e) {
          /* 旧版允许继续 */
        }
        const supRes = await api.getSupplier({
          page: 1,
          size: 99999,
          SerachName: this.supplierSearch || '',
          ID: this.selectedBill.ID
        });
        const codes = (supRes.result || [])
          .map((r) => r.Supplier_Code)
          .join(',');
        const res = await api.mensMonitbtAmountprint2({
          Bill_MonthNumber: this.selectedBill.MonthNumber,
          Supplier_Code_div: codes,
          Supplier_Name_div: this.selectedSupplier?.Supplier_Name || '',
          changenum: '8',
          MONTHLY_BALANCE_ID: this.selectedBill.ID,
          json: invoiceJson
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invPrintGysSummary() {
      if (!this.selectedBill) {
        this.$message.warning('请先选中月结单号');
        return;
      }
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.hrpCreategysExcel({
          homehp: this.hp,
          monthNumberJson: JSON.stringify([this.selectedBill.MonthNumber]),
          condition: '',
          mainNumberJson: '',
          printState: 2,
          confirmState: 'false'
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invPrintGysDetail() {
      if (!this.selectedBill) {
        this.$message.warning('请先选中月结单号');
        return;
      }
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.hrpCreategysmxExcel({
          homehp: this.hp,
          monthNumberJson: JSON.stringify([this.selectedBill.MonthNumber]),
          condition: ''
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    invExcelGZSupOutbound() {
      const rows = this.supplierCheckRows || [];
      if (!rows.length) {
        this.$message.warning('请至少选择一条供应商');
        return;
      }
      if (!this.selectedBill) {
        this.$message.warning('请选择月结单号');
        return;
      }
      rows.forEach((row) => {
        for (let j = 1; j < 6; j++) {
          api.openGZSupOutboundOrder(
            this.selectedBill.MonthNumber,
            row.Supplier_Code,
            row.Supplier_Name,
            j
          );
        }
      });
    },

    async invExcelStorageMonth() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请选择月结单号');
        return;
      }
      const rows = this.supplierCheckRows || [];
      if (!rows.length) {
        this.$message.warning('请选择供应商');
        return;
      }
      const code = rows[0].Supplier_Code;
      const loading = this.$loading({ lock: true, text: '生成出库单...' });
      try {
        for (let i = 1; i < 6; i++) {
          const res = await api.excelStorageMonth({
            MonthID: this.selectedBill.ID,
            SupplyCode: code,
            type: i
          });
          if (res.msg) openExcelFile(res.msg);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invUpWxtFph(monthDate) {
      if (!monthDate) {
        this.$message.warning('请选择月结月份');
        return;
      }
      await this.$confirm(`确认更新微讯通月结月份为(${monthDate})的发票吗？`, '提示', { type: 'warning' });
      const loading = this.$loading({ lock: true });
      try {
        await api.upWxtFph(monthDate);
        this.$message.success('更新成功');
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async invBillApprove() {
      if (!this.invoiceRows?.length) {
        this.$message.warning('无发票数据');
        return;
      }
      await this.$confirm('确认审批吗？', '提示', { type: 'warning' });
      const parts = this.invoiceRows.map((r) => `${r.Supplier_Code}:${r.BillNum}`);
      const loading = this.$loading({ lock: true });
      try {
        await api.updateBillState(parts.join(',') + ',');
        this.$message.success('审批成功');
        this.loadInvoiceList();
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    }
  }
};
