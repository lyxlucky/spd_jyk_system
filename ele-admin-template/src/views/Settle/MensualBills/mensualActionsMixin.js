/**
 * 月结管理 — 与旧版 MensualBills.cshtml 一致的操作集合
 */
import * as api from '@/api/Settle/MensualBills';
import {
  HOME_HP,
  openExcelFile,
  operatorName,
  getSureMonthAction,
  needsSureMonthDialog,
  getSendWhAction,
  getStorageExcelAction,
  getB2bMonthUrl,
  buildSureMonthJson,
  buildApprovalJson
} from './utils';

const B2B_DIRECT_HP = [
  'nyd', 'stzx', 'stse', 'fszxy', 'fsdwrmyy', 'fsdl', 'csyy', 'stzyyy', 'chrmyy',
  'zq', 'szhn', 'szlhfy', 'szsmyl', 'szse', 'szse_lh', 'szse_dp'
];

const B2B_FOLLOW_HP = ['lg', 'stzl', 'nyd', 'szlh', 'zq'];

export default {
  methods: {
    mensCtx() {
      return {
        hp: this.hp,
        MonthID: this.selectedMonth?.ID || '',
        Dept: this.selectedDept?.SPD_COST_DEPT_NAME || '',
        DeptTwoCode: this.selectedDept?.SPD_COST_DEPT_CODE || '',
        GoodsDayClearingDeptID: this.selectedDay?.ID || '',
        Number: this.printPageNum || '',
        homehp: this.hp,
        SerachName: this.varietyCode || '',
        page: 1,
        size: 99999
      };
    },

    async mensExportExcel(action, extra = {}) {
      if (!this.selectedMonth?.ID) {
        this.$message.warning('请先选中月结单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.monthClearingExport(action, {
          MonthID: this.selectedMonth.ID,
          ...this.mensCtx(),
          ...extra
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensB2bGet(hp, monthId) {
      const url = getB2bMonthUrl(hp || this.hp, monthId || this.selectedMonth?.ID);
      if (!url) {
        this.$message.warning('当前院区未配置 B2B 地址');
        return;
      }
      this.$message.success('发送成功');
      const loading = this.$loading({ lock: true });
      try {
        const data = await api.fetchB2bGet(url);
        if (data.code == 200) {
          this.loadMonthList && (await this.loadMonthList());
        } else {
          this.$message.error(data.msg || '发送失败');
        }
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        loading.close();
      }
    },

    async mensSendB2bMain() {
      if (!this.selectedMonth?.ID) return;
      const hp = this.hp;
      if (hp === 'szlh') return this.mensB2bGet('szlh');
      if (hp === 'lg') return this.mensB2bGet('lg');
      if (B2B_DIRECT_HP.includes(hp)) return this.mensB2bGet(hp);
      if (hp === 'bd' || hp === 'bdrm') return this.mensSendYgMonth();
      const actionMap = {
        bd: 'SendMonth',
        lg: 'SendMonthHERP',
        zq: 'SendMonthZQ_B2B',
        stzl: 'SendMonthZLHERP',
        nyd: 'SendMonthNYD_B2B',
        szlh: 'SendMonthLH',
        stzx: 'SendMonthStzx'
      };
      const action = actionMap[hp];
      if (!action) {
        this.$message.warning('当前院区未配置发送接口');
        return;
      }
      const loading = this.$loading({ lock: true });
      try {
        const data = await api.sendMonthAction(action, this.selectedMonth.ID);
        if (B2B_FOLLOW_HP.includes(hp) && data.result) {
          const b2b = await api.postB2bMonthlyInvoic(JSON.stringify(data.result));
          if (b2b.code == 200) {
            this.$message.success('发送成功');
          } else {
            this.$message.error(b2b.msg || 'B2B发送失败');
          }
        } else {
          this.$message.success('发送成功');
        }
        this.loadMonthList && (await this.loadMonthList());
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensSendWh() {
      const action = getSendWhAction(this.hp);
      if (!action) return;
      const loading = this.$loading({ lock: true });
      try {
        await api.sendMonthAction(action, this.selectedMonth.ID);
        this.$message.success('发送成功');
        this.loadMonthList && (await this.loadMonthList());
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    mensSendYgMonth() {
      return this.mensB2bGet(this.hp);
    },

    async mensSureMonth() {
      const op = operatorName(this);
      if (!op) {
        this.$message.warning('登录信息过期，请重新登录');
        return;
      }
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少勾选一行科室');
        return;
      }
      const json = buildSureMonthJson(op, this.deptSelection);
      if (needsSureMonthDialog(this.hp)) {
        this.pendingSureJson = json;
        this.sureForm = { remark: '', monthDate: '' };
        this.sureDialogVisible = true;
        return;
      }
      await this.mensDoSureMonth(json);
    },

    async mensDoSureMonth(json, extra = {}) {
      const loading = this.$loading({ lock: true, text: '月结处理中...' });
      try {
        await api.sureMonth(getSureMonthAction(this.hp), json, extra);
        this.$message.success('月结成功');
        this.loadMonthList && (await this.loadMonthList());
        this.loadBillList && (await this.loadBillList(this.billPage?.page || 1));
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensApprove() {
      if (!this.daySelection?.length || !this.selectedDept) {
        this.$message.warning('请勾选日清单并选择科室');
        return;
      }
      const json = buildApprovalJson(this.daySelection, this.selectedDept.SPD_COST_DEPT_CODE);
      const loading = this.$loading({ lock: true });
      try {
        await api.approvalState(json);
        this.$message.success('已成功审批');
        this.loadDayList && (await this.loadDayList());
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensApproveAll() {
      const loading = this.$loading({ lock: true });
      try {
        await api.approvalStateAll();
        this.$message.success('已成功审批');
        this.loadDayList && (await this.loadDayList());
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensExcelMonthExport() {
      if (!this.selectedMonth || !this.deptSelection?.length) {
        this.$message.warning('请选中月结单并勾选科室');
        return;
      }
      const codes = this.deptSelection.map((d) => d.SPD_COST_DEPT_CODE).join(',');
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.excelMonthDataOneSheet({
          monthId: this.selectedMonth.ID,
          deptTwoCode: codes
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    mensPrintReport() {
      const action = getStorageExcelAction(this.hp);
      if (!action) {
        this.$message.warning('当前院区不支持打印报表');
        return;
      }
      return this.mensExportExcel(action);
    },

    mensPrintMonth() {
      const hp = this.hp;
      const ctx = this.mensCtx();
      if (['stzx', 'stse', 'csyy', 'stzyyy', 'stzl', 'chrmyy'].includes(hp)) {
        return this.mensExportExcel('CreateMonthExcel_STZX', ctx);
      }
      if (['fszxy', 'fsdwrmyy', 'fsdl'].includes(hp)) {
        return this.mensExportExcel('CreateMonthExcel_FS', ctx);
      }
      let action = 'CreateMonthExcel';
      if (hp === 'lg') action = 'CreateMonthExcel_J_LG';
      if (hp === 'nyd') action = 'CreateMonthExcel_NYD';
      return this.mensExportExcel(action, ctx);
    },

    mensPrintTemplate() {
      const hp = this.hp;
      const ctx = this.mensCtx();
      const loading = this.$loading({ lock: true });
      const done = (res) => {
        loading.close();
        if (res.msg) openExcelFile(res.msg);
      };
      const fail = (e) => {
        loading.close();
        this.$message.error(e.message);
      };
      if (hp === 'stzl') {
        return api
          .shanTouMonthOutExcelSTZL({
            Dept: ctx.Dept,
            DeptTwoCode: ctx.DeptTwoCode,
            MonthID: ctx.MonthID,
            ROW: ctx.Number
          })
          .then(done)
          .catch(fail);
      }
      return api
        .shanTouMonthOutExcel(ctx)
        .then(done)
        .catch(fail);
    },

    mensMonthStse() {
      let action = 'STSE_MonthPlan';
      if (this.hp === 'csyy') action = 'CSYY_MonthPlan';
      return this.mensExportExcel(action, { num: this.printPageNum });
    },

    mensMonthStzxPdf() {
      if (!this.selectedMonth?.ID) return;
      api.openMonthPdf(
        `/api/MonthClearing/GetSTZX?id=84&format=pdf&inline=true&MonthID=${this.selectedMonth.ID}`
      );
    },

    async mensMonthStzxJhb() {
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少勾选一行科室');
        return;
      }
      const loading = this.$loading({ lock: true });
      try {
        for (const dept of this.deptSelection) {
          const res = await api.stzxMonthPlan({
            MonthID: this.selectedMonth.ID,
            depttwocode: dept.SPD_COST_DEPT_CODE
          });
          if (res.msg) openExcelFile(res.msg);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    mensPrintMonthSheetByType(type) {
      const ctx = { ...this.mensCtx(), GoodsDayClearingDeptID: '' };
      const hp = this.hp;
      if (type === 'receive') {
        this.mensExportExcel('CreateMonthExcel_STZE_ByMonth', ctx);
      } else if (type === 'consume') {
        if (['stzx', 'stse', 'csyy', 'stzyyy', 'chrmyy', 'fszxy', 'fsdwrmyy', 'fsdl'].includes(hp)) {
          this.mensExportExcel('CreateMonthExcel2_STZE_ByMonth', ctx);
        } else if (hp === 'lg') {
          this.mensExportExcel('CreateMonthExcel_J_LG', ctx);
        } else if (hp === 'nyd') {
          this.mensExportExcel('CreateMonthExcel_NYD', ctx);
        } else {
          this.mensExportExcel('CreateMonthExcel', ctx);
        }
      } else if (type === 'finance') {
        this.mensExportExcel('CreateMonthExcel_CSYY_ByMonth', ctx);
      } else if (type === 'gz') {
        this.mensExportExcel('CreateMonthExcel_STZX_ByMonth_GZ', ctx);
      } else if (type === 'lhfySup') {
        this.mensLhfyPrint('PrintLhfySup');
      } else if (type === 'lhfyDept') {
        this.mensLhfyPrint('PrintLhfyDept');
      } else if (type === 'lhfyDtl') {
        this.mensLhfyPrint('PrintLhfyMonDtl');
      }
      this.printOptionsVisible = false;
    },

    async mensLhfyPrint(action) {
      const loading = this.$loading({ lock: true });
      try {
        const res = await api.abdzczhPrint(action, {
          MonthID: this.selectedMonth.ID,
          Number: this.printPageNum
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensBeijingReport(kind) {
      if (!this.selectedMonth?.ID) {
        this.$message.warning('请选中一行月结数据');
        return;
      }
      const mid = this.selectedMonth.ID;
      const loading = this.$loading({ lock: true });
      try {
        let fileKey = '';
        if (kind === 'yysj_ck') {
          const r = await api.printPdfGet('/PrintPdf/PrintBdrmYySj_CK', { MonthID: mid });
          fileKey = r.msg;
          openExcelFile(fileKey);
          const r2 = await api.printPdfGet('/PrintPdf/PrintBdrmYySj_RK', { MonthID: mid });
          openExcelFile(r2.msg);
          return;
        }
        if (kind === 'yydz_ck') {
          const r = await api.printPdfGet('/PrintPdf/PrintBdrmYyDz_CK', { MonthID: mid });
          openExcelFile(r.msg);
          const r2 = await api.printPdfGet('/PrintPdf/PrintBdrmYyDz_RK', { MonthID: mid });
          openExcelFile(r2.msg);
          return;
        }
        const pdfMap = {
          storage_dz: '/PrintPdf/CreateMonth_Bdrm_dz',
          storage_gz: '/PrintPdf/CreateMonth_Bdrm_Gz',
          storage_sj: '/PrintPdf/CreateMonth_Bdrm_Sj'
        };
        if (pdfMap[kind]) {
          const r = await api.printPdfGet(pdfMap[kind], { MonthID: mid });
          openExcelFile(r.msg);
          return;
        }
        const pekingMap = {
          zc_dz: { url: '/PekingApplication/getLowValueAndReagentsSettlementReport', type: '0' },
          zc_sj: { url: '/PekingApplication/getLowValueAndReagentsSettlementReport', type: '2' },
          zc_gz: { url: '/PekingApplication/GetHignValueReport' },
          zc_gz_dept: { url: '/PekingApplication/GetHignValueWithDept' },
          zc_dz_dept: { url: '/PekingApplication/GetDzValueWithDept' },
          zc_sj_dept: { url: '/PekingApplication/GetSjValueWithDept' }
        };
        const cfg = pekingMap[kind];
        if (cfg) {
          const payload = { monthId: mid };
          if (cfg.type != null) payload.type = cfg.type;
          const r = await api.pekingReport(cfg.url, payload);
          openExcelFile(r.data || r.msg);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },

    async mensUpWxtFph(monthDate) {
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
    }
  }
};
