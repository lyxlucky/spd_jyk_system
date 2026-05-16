<template>
  <div class="mensual-data-panel">
    <div class="panel-grid">
      <div class="col-left">
        <el-card shadow="never" class="sub-card">
          <template slot="header"><span class="sub-title">月结单号</span></template>
          <div class="month-toolbar">
            <div class="month-toolbar-dates">
              <el-date-picker
                v-model="query.monthStart"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="开始时间 yyyy-MM-dd"
                class="month-toolbar-full"
              />
              <el-date-picker
                v-model="query.monthEnd"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="结束时间 yyyy-MM-dd"
                class="month-toolbar-full"
              />
            </div>
            <div class="month-toolbar-row month-toolbar-search">
              <el-input
                v-model="query.monthNumble"
                size="mini"
                clearable
                placeholder="请输入月结单号查询"
                class="month-toolbar-search-input"
                @keyup.enter.native="loadMonthList"
              />
              <el-button size="mini" type="primary" icon="el-icon-search" @click="loadMonthList">查询</el-button>
            </div>
            <div class="month-toolbar-row month-toolbar-btns">
              <el-button size="mini" type="primary" :disabled="!canSureMonth" @click="mensSureMonth">确认月结</el-button>
              <el-button v-if="showSendB2bToolbar" size="mini" type="primary" :disabled="!canSendB2b" @click="mensSendB2bMain">发送(B2B)</el-button>
              <el-button v-if="showSendWh" size="mini" type="primary" :disabled="!canSendWh" @click="mensSendWh">发送(望海)</el-button>
            </div>
            <div class="month-toolbar-row month-toolbar-btns">
              <el-button v-if="hp === 'bd' || hp === 'bdrm'" size="mini" type="primary" :disabled="!canSendB2bBd" @click="mensSendYgMonth">发送(B2B)</el-button>
              <el-button v-if="showSendHis" size="mini" type="primary" :disabled="!canSendHis" @click="onSendHis">发送HIS</el-button>
              <el-button v-if="hp === 'szhn'" size="mini" type="primary" :disabled="!canSendHis" @click="onSendOes">发送(OES)</el-button>
            </div>
          </div>
          <el-table v-loading="monthLoading" :data="monthRows" border stripe size="mini" height="300" highlight-current-row @current-change="onMonthSelect">
            <el-table-column prop="Monthly_Balance_Number" label="月结单号" min-width="95" show-overflow-tooltip />
            <el-table-column prop="sDate" label="月结月份" width="85" />
            <el-table-column :label="b2bColLabel" width="78">
              <template slot-scope="{ row }">{{ sendStateLabel(row.Send_State) }}</template>
            </el-table-column>
            <el-table-column v-if="showHerpCol" :label="herpColTitle" width="88">
              <template slot-scope="{ row }">{{ sendStateLabel(row.Send_Herp_State) }}</template>
            </el-table-column>
            <el-table-column v-if="showExtraDateCol" prop="sDate" label="日期" width="85" />
            <el-table-column v-if="showExtraDateCol" prop="Remarks" label="备注" min-width="60" show-overflow-tooltip />
          </el-table>
        </el-card>
        <el-card shadow="never" class="sub-card" style="margin-top: 8px">
          <template slot="header"><span class="sub-title">月结科室目录</span></template>
          <div class="dept-search">
            <el-input v-model="deptName" size="mini" clearable placeholder="科室名称" @keyup.enter.native="loadDeptList" />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadDeptList" />
          </div>
          <el-table v-loading="deptLoading" :data="deptRows" border stripe size="mini" height="220" highlight-current-row @selection-change="deptSelection = $event" @current-change="onDeptSelect">
            <el-table-column type="selection" width="38" align="center"/>
            <el-table-column prop="Dept_One_Name" label="一级科室" min-width="70" show-overflow-tooltip />
            <el-table-column prop="SPD_COST_DEPT_NAME" label="二级科室" min-width="80" show-overflow-tooltip />
            <el-table-column label="审核" width="52">
              <template slot-scope="{ row }">{{ deptStateLabel(row.State) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="col-mid">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header">
            <div class="mid-header">
              <span class="sub-title">日清单号列表</span>
              <div>
                <el-button size="mini" type="primary" :disabled="!canApprove" @click="mensApprove">审批通过</el-button>
                <el-button size="mini" type="primary" @click="mensApproveAll">一键审批</el-button>
                <el-button size="mini" type="primary" :disabled="!selectedMonth" @click="printOptionsVisible = true">打印月结单</el-button>
              </div>
            </div>
          </template>
          <el-table v-loading="dayLoading" :data="dayRows" border stripe size="mini" height="calc(100vh - 300px)" highlight-current-row @selection-change="daySelection = $event" @current-change="onDaySelect">
            <el-table-column type="selection" width="38" align="center"/>
            <el-table-column prop="ClearingDate" label="日清日期" width="98" />
            <el-table-column label="审批状态" width="72">
              <template slot-scope="{ row }">{{ approvalStateLabel(row.ApprovalState) }}</template>
            </el-table-column>
            <el-table-column label="日清金额" width="88" align="right">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
          </el-table>
          <div class="sum-line">科室月结总额: <b>{{ fmtMoney(deptDayTotal) }}</b></div>
        </el-card>
      </div>

      <div class="col-right">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header">
            <div class="mid-header wrap">
              <span class="sub-title">品种消耗汇总</span>
              <div class="right-tools">
                <el-input v-model="varietyCode" size="mini" clearable placeholder="品种编码" style="width: 100px" @keyup.enter.native="loadVarietyList(1)" />
                <el-button size="mini" type="primary" icon="el-icon-search" @click="loadVarietyList(1)" />
                <el-button size="mini" @click="mensPrintReport">打印报表</el-button>
                <el-input v-model="printPageNum" size="mini" placeholder="打印页数" style="width: 80px" />
                <el-button size="mini" @click="mensPrintMonth">打印月结单</el-button>
                <el-button size="mini" :disabled="hp !== 'stzl'" @click="mensPrintTemplate">打印表模</el-button>
                <el-button size="mini" :disabled="!selectedMonth || !deptSelection.length" @click="mensExcelMonthExport">月结Excel导出</el-button>
                <el-button v-if="showStzxJhb" size="mini" @click="mensMonthStzxJhb">打印计划表</el-button>
                <el-button v-if="showStzxDy" size="mini" @click="mensMonthStzxPdf">打印月结(供应商)</el-button>
                <el-button v-if="showStseSg" size="mini" @click="mensMonthStse">打印申购表</el-button>
                <el-dropdown v-if="showBeijingReports" trigger="click" @command="mensBeijingReport">
                  <el-button size="mini">北京报表<i class="el-icon-arrow-down el-icon--right" /></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="yysj_ck">运营试剂(出库+入库)</el-dropdown-item>
                    <el-dropdown-item command="yydz_ck">运营低值(出库+入库)</el-dropdown-item>
                    <el-dropdown-item command="storage_dz">月结库房报表低值</el-dropdown-item>
                    <el-dropdown-item command="storage_gz">月结库房报表高值</el-dropdown-item>
                    <el-dropdown-item command="storage_sj">月结库房报表试剂</el-dropdown-item>
                    <el-dropdown-item command="zc_dz">招采中心低值</el-dropdown-item>
                    <el-dropdown-item command="zc_sj">招采中心试剂</el-dropdown-item>
                    <el-dropdown-item command="zc_gz">招采中心高值</el-dropdown-item>
                    <el-dropdown-item command="zc_gz_dept">招采中心高值耗材科室汇总</el-dropdown-item>
                    <el-dropdown-item command="zc_dz_dept">招采中心低值科室汇总</el-dropdown-item>
                    <el-dropdown-item command="zc_sj_dept">招采中心试剂科室汇总</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
          <el-table v-loading="varietyLoading" :data="varietyRows" border stripe size="mini" height="calc(100vh - 340px)">
            <el-table-column prop="dept_two_code" label="计费科室编码" width="98" show-overflow-tooltip />
            <el-table-column prop="Varietie_code" label="品种材料编码" width="98" show-overflow-tooltip />
            <el-table-column prop="Varietie_name" label="品种全称" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Specification_or_Type" label="型号/规格" width="88" show-overflow-tooltip />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" width="88" show-overflow-tooltip />
            <el-table-column prop="Charging_Code" label="计费编码" width="78" />
            <el-table-column prop="Batch" label="生产批号" width="78" />
            <el-table-column label="生产日期" width="92">
              <template slot-scope="{ row }">{{ (row.Batch_Production_Date || '').substring(0, 10) }}</template>
            </el-table-column>
            <el-table-column label="失效日期" width="92">
              <template slot-scope="{ row }">{{ (row.Batch_Validity_Period || '').substring(0, 10) }}</template>
            </el-table-column>
            <el-table-column prop="Coefficient" label="系数" width="48" align="center" />
            <el-table-column prop="DefQuantity" label="包数" width="48" align="center" />
            <el-table-column prop="GoodsQuantity" label="散货数量" width="68" align="center" />
            <el-table-column prop="Unit" label="单位" width="48" />
            <el-table-column label="结算价" width="68" align="right">
              <template slot-scope="{ row }">{{ fmtMoney(row.Price) }}</template>
            </el-table-column>
            <el-table-column label="金额" width="76" align="right">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
            <el-table-column prop="supplier_name" label="供应商" min-width="90" show-overflow-tooltip />
          </el-table>
          <el-pagination v-if="varietyTotal > varietyPage.size" small layout="total, prev, pager, next" :total="varietyTotal" :page-size="varietyPage.size" :current-page.sync="varietyPage.page" style="margin-top: 6px; text-align: right" @current-change="loadVarietyList" />
          <div class="sum-line">当天月结总额: <b>{{ fmtMoney(varietyTotalMoney) }}</b></div>
        </el-card>
      </div>
    </div>

    <el-dialog title="月结-日期填写" :visible.sync="sureDialogVisible" width="480px" append-to-body>
      <el-form label-width="80px" size="small">
        <el-form-item label="备注" required><el-input v-model="sureForm.remark" /></el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker v-model="sureForm.monthDate" type="month" value-format="yyyy-MM" placeholder="YYYY-MM" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="sureDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitSureMonth">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打印选项" :visible.sync="printOptionsVisible" width="360px" append-to-body>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('receive')">按收货科室区分打印</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('consume')">按消耗区分打印</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('finance')">按财务分类区分打印</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('gz')">按高低值区分打印</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfySup')">供应商领用报表</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfyDept')">科室领用报表</el-button>
      <el-button type="primary" size="small" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfyDtl')">科室月结明细表</el-button>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/Settle/MensualBills';
import mensualActionsMixin from '../mensualActionsMixin';
import {
  HOME_HP,
  fmtMoney,
  sendStateLabel,
  approvalStateLabel,
  deptStateLabel
} from '../utils';

export default {
  name: 'MonthlyDataPanel',
  mixins: [mensualActionsMixin],
  data() {
    return {
      hp: HOME_HP,
      query: { monthStart: '', monthEnd: '', monthNumble: '' },
      deptName: '',
      varietyCode: '',
      printPageNum: '',
      monthLoading: false,
      deptLoading: false,
      dayLoading: false,
      varietyLoading: false,
      monthRows: [],
      deptRows: [],
      dayRows: [],
      varietyRows: [],
      deptSelection: [],
      daySelection: [],
      selectedMonth: null,
      selectedDept: null,
      selectedDay: null,
      varietyPage: { page: 1, size: 10 },
      varietyTotal: 0,
      varietyTotalMoney: 0,
      sureDialogVisible: false,
      printOptionsVisible: false,
      sureForm: { remark: '', monthDate: '' },
      pendingSureJson: ''
    };
  },
  computed: {
    showHerpCol() {
      return ['nyd', 'bd', 'bdrm', 'stzx', 'stse', 'csyy'].includes(this.hp);
    },
    showExtraDateCol() {
      return ['bd', 'bdrm', 'stzx', 'stse', 'csyy'].includes(this.hp);
    },
    herpColTitle() {
      if (this.hp === 'bd' || this.hp === 'bdrm') return '发送(HIS)';
      if (this.hp === 'nyd') return '发送(望海)';
      return '发送(微讯通)';
    },
    b2bColLabel() {
      return this.showHerpCol ? '发送(B2B)' : '发送状态';
    },
    showSendB2bToolbar() {
      return this.hp !== 'bd' && this.hp !== 'bdrm';
    },
    showSendWh() {
      return this.hp === 'nyd' || this.hp === 'spd';
    },
    showSendHis() {
      return ['stzx', 'stse', 'csyy', 'stzl'].includes(this.hp);
    },
    showStzxJhb() {
      return ['stzx', 'stse', 'csyy', 'stzl'].includes(this.hp);
    },
    showStzxDy() {
      return this.hp === 'stzx';
    },
    showStseSg() {
      return ['stse', 'csyy', 'stzl'].includes(this.hp);
    },
    showBeijingReports() {
      return this.hp === 'bd' || this.hp === 'bdrm';
    },
    canSureMonth() {
      return this.deptSelection.length > 0;
    },
    canSendB2b() {
      const m = this.selectedMonth;
      return m && m.ID !== 'FF' && (m.Send_State == 0 || m.Send_State === '0');
    },
    canSendWh() {
      const m = this.selectedMonth;
      return m && m.ID !== 'FF' && (m.Send_Herp_State == 0 || m.Send_Herp_State === '0');
    },
    canSendB2bBd() {
      return this.canSendB2b;
    },
    canSendHis() {
      return this.selectedMonth && this.selectedMonth.ID !== 'FF';
    },
    canApprove() {
      return this.daySelection.length > 0 && this.selectedDept;
    },
    deptDayTotal() {
      return this.dayRows.reduce((s, r) => s + (parseFloat(r.Money) || 0), 0);
    }
  },
  mounted() {
    this.loadMonthList();
  },
  methods: {
    fmtMoney,
    sendStateLabel,
    approvalStateLabel,
    deptStateLabel,
    async loadMonthList() {
      this.monthLoading = true;
      try {
        const res = await api.monthNum({
          MonthStartDate: this.query.monthStart || '',
          MonthENDDate: this.query.monthEnd || '',
          MonthNumble: this.query.monthNumble || ''
        });
        this.monthRows = res.result || [];
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.monthLoading = false;
      }
    },
    onMonthSelect(row) {
      this.selectedMonth = row;
      this.selectedDept = null;
      this.selectedDay = null;
      this.dayRows = [];
      this.varietyRows = [];
      if (row) this.loadDeptList();
    },
    async loadDeptList() {
      if (!this.selectedMonth) return;
      this.deptLoading = true;
      try {
        const res = await api.getMonthDept({
          MonthID: this.selectedMonth.ID,
          DeptName: this.deptName || ''
        });
        this.deptRows = res.result || [];
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.deptLoading = false;
      }
    },
    onDeptSelect(row) {
      this.selectedDept = row;
      this.selectedDay = null;
      if (row && this.selectedMonth) this.loadDayList();
    },
    async loadDayList() {
      if (!this.selectedMonth || !this.selectedDept) return;
      this.dayLoading = true;
      try {
        const res = await api.getApprovalMonth({
          MonthID: this.selectedMonth.ID,
          DeptTwoCode: this.selectedDept.SPD_COST_DEPT_CODE
        });
        this.dayRows = res.result || [];
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.dayLoading = false;
      }
    },
    onDaySelect(row) {
      this.selectedDay = row;
      if (row) this.loadVarietyList(1);
    },
    async loadVarietyList(page) {
      if (!this.selectedDept || !this.selectedDay) return;
      this.varietyPage.page = page || 1;
      this.varietyLoading = true;
      try {
        const res = await api.getMonthShow({
          page: this.varietyPage.page,
          size: this.varietyPage.size,
          SerachName: this.varietyCode || '',
          DeptTwoCode: this.selectedDept.SPD_COST_DEPT_CODE,
          GoodsDayClearingDeptID: this.selectedDay.ID
        });
        this.varietyRows = res.result || [];
        this.varietyTotal = res.total || 0;
        this.varietyTotalMoney = (res.result || []).reduce((s, r) => s + (parseFloat(r.Money) || 0), 0);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.varietyLoading = false;
      }
    },
    async submitSureMonth() {
      if (!this.sureForm.monthDate || this.sureForm.monthDate.length !== 7) {
        this.$message.warning('日期格式为 YYYY-MM');
        return;
      }
      await this.mensDoSureMonth(this.pendingSureJson, {
        bz: this.sureForm.remark,
        date: this.sureForm.monthDate
      });
      this.sureDialogVisible = false;
    },
    async onSendHis() {
      if (!this.selectedMonth) return;
      const loading = this.$loading({ lock: true });
      try {
        await api.hisSendStzx(this.selectedMonth.ID);
        this.$message.success('发送成功');
        this.loadMonthList();
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    },
    async onSendOes() {
      if (!this.selectedMonth) return;
      const loading = this.$loading({ lock: true });
      try {
        await api.sendOesHisInfo(this.selectedMonth.ID);
        this.$message.success('发送成功');
        this.loadMonthList();
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style scoped>
.mensual-data-panel { display: flex; flex-direction: column; gap: 8px; }

.month-toolbar { margin-bottom: 8px; }
.month-toolbar-dates { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; }
.month-toolbar-full { width: 100%; }
.month-toolbar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 6px; }
.month-toolbar-search .month-toolbar-search-input { flex: 1; min-width: 0; }
.month-toolbar-btns .el-button { flex: 1; min-width: 0; padding-left: 4px; padding-right: 4px; }
.panel-grid { display: flex; gap: 8px; min-height: calc(100vh - 200px); }
.col-left { width: 18%; min-width: 220px; flex-shrink: 0; }
.col-mid { width: 22%; min-width: 260px; flex-shrink: 0; }
.col-right { flex: 1; min-width: 0; }
.sub-card >>> .el-card__header { padding: 8px 12px; }
.sub-card >>> .el-card__body { padding: 8px; }
.sub-title { font-weight: 600; font-size: 13px; }
.dept-search { display: flex; gap: 6px; margin-bottom: 8px; }
.mid-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; }
.mid-header.wrap { width: 100%; }
.right-tools { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sum-line { text-align: right; padding: 6px 4px 0; font-size: 13px; }
.print-opt-btn { display: block; width: 100%; margin: 0 0 8px !important; }
</style>
