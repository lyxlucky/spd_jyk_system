/**
 * 日清管理 — 与旧版 NissinBills.cshtml 一致的操作
 */
import * as api from '@/api/Settle/NissinBills';
import { getUserGroupByName } from '@/api/layout/index';
import {
  HOME_HP,
  openExcelFile,
  openMonthPdf,
  operatorName,
  getDailyBillPrintAction,
  buildConfirmJson,
  buildDayApprovalDeptCodes
} from './utils';

export default {
  methods: {
    nissCtx(extra = {}) {
      const bill = this.selectedBill || {};
      const dept = this.selectedDept || {};
      return {
        hp: this.hp,
        homehp: this.hp,
        GoodsDayClearingDeptID: bill.ID || '',
        DeptCode: dept.SPD_COST_DEPT_CODE || '',
        N_Dept_Two_Name: dept.SPD_COST_DEPT_NAME || '',
        Clearing_Time: bill.Clearing_Time || '',
        SerachName: this.varietyKeyword || '',
        State: bill.Clearing_State == 1 || bill.Clearing_State === '1' ? 1 : 0,
        page: 1,
        size: 99999,
        Operator: operatorName(this),
        ApprovalState: dept.Day_Approval_State == '1' ? 1 : 0,
        PicPath: this.deptSelection?.[0]?.SignPic || '',
        ...extra
      };
    },

    async nissExport(action, extra = {}) {
      if (!this.selectedDept?.SPD_COST_DEPT_CODE) {
        this.$message.warning('请先选中科室');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.dayClearingExport(action, this.nissCtx(extra));
        if (res.msg) openExcelFile(res.msg);
        await this.afterPrintUpdate();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        loading.close();
      }
    },

    async afterPrintUpdate() {
      const bill = this.selectedBill;
      const dept = this.selectedDept;
      if (!bill?.ID || !dept?.SPD_COST_DEPT_CODE) return;
      try {
        await api.updatePrint({
          ClearingID: bill.ID,
          DetpCode: dept.SPD_COST_DEPT_CODE
        });
        await this.loadDeptList();
      } catch (_) {
        /* 与旧页一致：打印次数更新失败不阻断 */
      }
    },

    async nissConfirmComplete() {
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少选择一个二级科室');
        return;
      }
      const json = buildConfirmJson(this.selectedBill, this.deptSelection, this.selectedBill?.Clearing_Operator);
      const loading = this.$loading({ lock: true, text: '处理中...' });
      try {
        const res = await api.insertClearingVarDtl(json);
        this.$message.success(res.msg || '确认成功');
        this.resetAfterConfirm();
      } catch (e) {
        this.$message.error(e.message || '确认失败');
      } finally {
        loading.close();
      }
    },

    async nissConfirmHis() {
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少选择一个二级科室');
        return;
      }
      const json = buildConfirmJson(this.selectedBill, this.deptSelection, this.selectedBill?.Clearing_Operator);
      const loading = this.$loading({ lock: true, text: '处理中...' });
      try {
        const res = await api.insertClearingHisCharingVarDtl(json);
        this.$message.success(res.msg || '确认成功');
        this.resetAfterConfirm();
      } catch (e) {
        this.$message.error(e.message || '确认失败');
      } finally {
        loading.close();
      }
    },

    resetAfterConfirm() {
      this.selectedBill = null;
      this.selectedDept = null;
      this.deptSelection = [];
      this.varietyRows = [];
      this.varietyTotal = 0;
      this.varietySummary = { qty: '', money: '' };
      this.loadBillList();
    },

    async nissDayApproval() {
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少选择一个二级科室');
        return;
      }
      if (!this.selectedDept?.SPD_COST_DEPT_CODE) {
        this.$message.warning('请先选中科室');
        return;
      }
      let approvalId = this.approvalUserId;
      if (!approvalId) {
        try {
          const username = this.$store.state.user.info?.UserName || '';
          const res = await getUserGroupByName({ username });
          approvalId = res?.ID;
        } catch (_) {
          /* ignore */
        }
      }
      const dayState =
        this.selectedBill?.Clearing_State == 1 || this.selectedBill?.Clearing_State === '1' ? '1' : '2';
      const loading = this.$loading({ lock: true, text: '审核中...' });
      try {
        await api.dayApproval({
          DeptCode: buildDayApprovalDeptCodes(this.deptSelection),
          ApprovalID: approvalId,
          DayState: dayState
        });
        this.$message.success('审核完成');
        await this.loadDeptList();
      } catch (e) {
        this.$message.error(e.message || '审核失败');
      } finally {
        loading.close();
      }
    },

    nissPrintDailyBill() {
      if (this.hp === 'nyd') {
        return this.nissExport('GetClearingGeneratedailybillsNPOI_GD', {
          ApprovalState: 1,
          State: 1
        });
      }
      return this.nissExport(getDailyBillPrintAction(this.hp), { State: 1 });
    },

    nissPrintDailyBill2() {
      return this.nissExport('GetClearingGeneratedailybillsNPOI_PIC', { State: 1 });
    },

    nissPrintDailyBillSummary() {
      return this.nissExport('GetClearingGeneratedailybillsNPOI4BeiDaHuiZong', { State: 1 });
    },

    nissPrintNoHis() {
      return this.nissExport('printGetClearingVarDtl_J_NO_HIS', { State: 1 });
    },

    async nissPrintPlanSheet() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请先选中日清账单');
        return;
      }
      if (!this.deptSelection?.length) {
        this.$message.warning('请至少勾选一行数据');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        for (const row of this.deptSelection) {
          const res = await api.stzxMonthPlanDayClear({
            DayClearID: this.selectedBill.ID,
            depttwocode: row.SPD_COST_DEPT_CODE
          });
          if (res.msg) openExcelFile(res.msg);
        }
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      } finally {
        loading.close();
      }
    },

    async nissPrintPlanDeptOne() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请先选中日清账单');
        return;
      }
      if (this.deptSelection?.length !== 1) {
        this.$message.warning('请勾选一行数据');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.stzxMonthPlanDayClearDeptOne({
          DayClearID: this.selectedBill.ID,
          depttwocode: this.deptSelection[0].SPD_COST_DEPT_CODE
        });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      } finally {
        loading.close();
      }
    },

    async nissPrintPlanJy() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请先选中日清账单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.stzxMonthPlanDayClearJy({ DayClearID: this.selectedBill.ID });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      } finally {
        loading.close();
      }
    },

    async nissPrintPlanSx() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请先选中日清账单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.stzxMonthPlanDayClearSx({ DayClearID: this.selectedBill.ID });
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      } finally {
        loading.close();
      }
    },

    nissPrintMonthPlanHz() {
      if (!this.selectedBill?.ID) {
        this.$message.warning('请先选中日清账单');
        return;
      }
      openMonthPdf(
        `/api/MonthClearing/STZY_MonthPlanHzTable?id=70&format=pdf&inline=true&DayClearID=${this.selectedBill.ID}`
      );
    }
  }
};
