<template>
  <div class="mensual-data-panel">
    <div class="panel-grid">
      <div class="col-left">
        <div class="spd-section mensual-section">
          <div class="spd-section__head">月结单号</div>
          <div class="spd-panel spd-panel--search month-search-panel">
            <div class="spd-panel__head">查询与操作</div>
            <div class="spd-panel__body">
              <el-form size="mini" class="ele-form-search month-toolbar-form" label-width="56px" @submit.native.prevent="handleMonthSearch">
                <el-form-item label="开始">
                  <el-date-picker
                    v-model="query.monthStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="开始时间 yyyy-MM-dd"
                    class="month-toolbar-full"
                  />
                </el-form-item>
                <el-form-item label="结束">
                  <el-date-picker
                    v-model="query.monthEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间 yyyy-MM-dd"
                    class="month-toolbar-full"
                  />
                </el-form-item>
                <el-form-item label="单号">
                  <el-input
                    v-model="query.monthNumble"
                    clearable
                    placeholder="请输入月结单号查询"
                    class="month-toolbar-search-input"
                    @keyup.enter.native="handleMonthSearch"
                  />
                </el-form-item>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="handleMonthSearch">查询</el-button>
                  <el-button type="primary" :disabled="!canSureMonth" @click="mensSureMonth">确认月结</el-button>
                  <el-button v-if="showSendB2bToolbar" type="primary" :disabled="!canSendB2b" @click="mensSendB2bMain">发送(B2B)</el-button>
                  <el-button v-if="showSendWh" type="primary" :disabled="!canSendWh" @click="mensSendWh">发送(望海)</el-button>
                  <el-button v-if="hp === 'bd' || hp === 'bdrm'" type="primary" :disabled="!canSendB2bBd" @click="mensSendYgMonth">发送(B2B)</el-button>
                  <el-button v-if="showSendHis" type="primary" :disabled="!canSendHis" @click="onSendHis">发送HIS</el-button>
                  <el-button v-if="hp === 'szhn'" type="primary" :disabled="!canSendHis" @click="onSendOes">发送(OES)</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div class="month-toolbar">
            <div class="month-toolbar-dates">...</div>
            <div class="month-toolbar-row month-toolbar-search">...</div>
            <div class="month-toolbar-row month-toolbar-btns">...</div>
          </div> -->
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">月结单列表</div>
            <div class="spd-table-panel__wrap">
          <el-table v-loading="monthLoading" :data="monthRows" border stripe size="mini" height="280" highlight-current-row @current-change="onMonthSelect">
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
            </div>
          </div>
        </div>

        <div class="spd-section mensual-section">
          <div class="spd-section__head">月结科室目录</div>
          <div class="spd-panel spd-panel--search dept-search-panel">
            <div class="spd-panel__head">科室筛选</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search dept-search-form" @submit.native.prevent="handleDeptSearch">
                <el-form-item label="科室" class="dept-search-item">
                  <el-input
                    v-model="deptName"
                    clearable
                    placeholder="科室名称"
                    class="dept-search-input"
                    @keyup.enter.native="handleDeptSearch"
                  >
                    <el-button slot="append" type="primary" icon="el-icon-search" @click="handleDeptSearch" />
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div class="dept-search">
            <el-input v-model="deptName" size="mini" clearable placeholder="科室名称" @keyup.enter.native="loadDeptList" />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadDeptList" />
          </div> -->
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">科室列表</div>
            <div class="spd-table-panel__wrap">
          <el-table v-loading="deptLoading" :data="deptRows" border stripe size="mini" height="200" highlight-current-row @selection-change="deptSelection = $event" @current-change="onDeptSelect">
            <el-table-column type="selection" width="38" align="center"/>
            <el-table-column prop="Dept_One_Name" label="一级科室" min-width="70" show-overflow-tooltip />
            <el-table-column prop="SPD_COST_DEPT_NAME" label="二级科室" min-width="80" show-overflow-tooltip />
            <el-table-column label="审核" width="52">
              <template slot-scope="{ row }">{{ deptStateLabel(row.State) }}</template>
            </el-table-column>
          </el-table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-mid">
        <div class="spd-section mensual-section mensual-section--stretch">
          <div class="spd-section__head">日清单号列表</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">审批与打印</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search mid-header-form" @submit.native.prevent>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" :disabled="!canApprove" @click="mensApprove">审批通过</el-button>
                  <el-button type="primary" @click="mensApproveAll">一键审批</el-button>
                  <el-button type="primary" :disabled="!selectedMonth" @click="printOptionsVisible = true">打印月结单</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">日清列表</div>
            <div class="spd-table-panel__wrap">
          <el-table v-loading="dayLoading" :data="dayRows" border stripe size="mini" height="calc(100vh - 380px)" highlight-current-row @selection-change="daySelection = $event" @current-change="onDaySelect">
            <el-table-column type="selection" width="38" align="center"/>
            <el-table-column prop="ClearingDate" label="日清日期" width="98" />
            <el-table-column label="审批状态" width="72">
              <template slot-scope="{ row }">{{ approvalStateLabel(row.ApprovalState) }}</template>
            </el-table-column>
            <el-table-column label="日清金额" width="88" align="center">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
          </el-table>
            </div>
            <div class="sum-line sum-line--panel">科室月结总额: <b>{{ fmtMoney(deptDayTotal) }}</b></div>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="spd-section mensual-section mensual-section--stretch">
          <div class="spd-section__head">品种消耗汇总</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">查询与打印</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search right-tools-form" @submit.native.prevent="handleVarietySearch">
                <el-form-item label="编码">
                  <el-input v-model="varietyCode" clearable placeholder="品种编码" style="width: 100px" @keyup.enter.native="handleVarietySearch" />
                </el-form-item>
                <el-form-item label="页数">
                  <el-input v-model="printPageNum" placeholder="打印页数" style="width: 80px" />
                </el-form-item>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="handleVarietySearch" />
                  <el-button @click="mensPrintReport">打印报表</el-button>
                  <el-button @click="mensPrintMonth">打印月结单</el-button>
                  <el-button :disabled="hp !== 'stzl'" @click="mensPrintTemplate">打印表模</el-button>
                  <el-button :disabled="!selectedMonth || !deptSelection.length" @click="mensExcelMonthExport">月结Excel导出</el-button>
                  <el-button v-if="showStzxJhb" @click="mensMonthStzxJhb">打印计划表</el-button>
                  <el-button v-if="showStzxDy" @click="mensMonthStzxPdf">打印月结(供应商)</el-button>
                  <el-button v-if="showStseSg" @click="mensMonthStse">打印申购表</el-button>
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
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">消耗明细</div>
            <div class="spd-table-panel__wrap">
          <el-table v-loading="varietyLoading" :data="varietyRows" border stripe size="mini" height="calc(100vh - 420px)">
            <el-table-column prop="dept_two_code" label="计费科室编码" width="98" show-overflow-tooltip />
            <el-table-column prop="Varietie_code" label="品种材料编码" width="98" show-overflow-tooltip />
            <el-table-column prop="Varietie_name" label="品种全称" min-width="98" show-overflow-tooltip />
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
            <el-table-column prop="GoodsQuantity" label="散货数量" width="120" align="center" />
            <el-table-column prop="Unit" label="单位" width="48" />
            <el-table-column label="结算价" width="68" align="center">
              <template slot-scope="{ row }">{{ fmtMoney(row.Price) }}</template>
            </el-table-column>
            <el-table-column label="金额" width="76" align="center">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
            <el-table-column prop="supplier_name" label="供应商" min-width="90" show-overflow-tooltip />
          </el-table>
          <el-pagination v-if="varietyTotal > varietyPage.size" small layout="total, prev, pager, next" :total="varietyTotal" :page-size="varietyPage.size" :current-page.sync="varietyPage.page" class="variety-pager" @current-change="loadVarietyList" />
            </div>
            <div class="sum-line sum-line--panel">当天月结总额: <b>{{ fmtMoney(varietyTotalMoney) }}</b></div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="月结-日期填写" :visible.sync="sureDialogVisible" width="480px" append-to-body>
      <el-form label-width="80px" size="mini">
        <el-form-item label="备注" required><el-input v-model="sureForm.remark" /></el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker v-model="sureForm.monthDate" type="month" value-format="yyyy-MM" placeholder="YYYY-MM" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="sureDialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="submitSureMonth">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打印选项" :visible.sync="printOptionsVisible" width="360px" append-to-body>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('receive')">按收货科室区分打印</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('consume')">按消耗区分打印</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('finance')">按财务分类区分打印</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('gz')">按高低值区分打印</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfySup')">供应商领用报表</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfyDept')">科室领用报表</el-button>
      <el-button type="primary" size="mini" class="print-opt-btn" @click="mensPrintMonthSheetByType('lhfyDtl')">科室月结明细表</el-button>
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
    async handleMonthSearch() {
      await this.loadMonthList();
      if (!this.monthRows.length) {
        this.$message.info('未查询到符合条件的月结单');
      }
    },
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
    async handleDeptSearch() {
      if (!this.selectedMonth) {
        this.$message.warning('请先在「月结单列表」中选择一条月结单');
        return;
      }
      await this.loadDeptList();
      if (!this.deptRows.length) {
        this.$message.info('未查询到符合条件的科室');
      }
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
    handleVarietySearch() {
      if (!this.selectedMonth) {
        this.$message.warning('请先在「月结单列表」中选择一条月结单');
        return;
      }
      if (!this.selectedDept) {
        this.$message.warning('请先在「科室列表」中选择科室');
        return;
      }
      if (!this.selectedDay) {
        this.$message.warning('请先在「日清列表」中选择一条日清记录');
        return;
      }
      this.loadVarietyList(1, true);
    },
    async loadVarietyList(page, showEmptyTip = false) {
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
        if (showEmptyTip && !this.varietyRows.length) {
          this.$message.info('未查询到符合条件的品种消耗明细');
        }
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

<style scoped lang="scss">
.mensual-data-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-grid {
  display: flex;
  gap: 10px;
  min-height: calc(100vh - 200px);
  align-items: stretch;
}

.col-left {
  width: 18%;
  min-width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-mid {
  width: 22%;
  min-width: 268px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.col-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.mensual-section {
  background: #fff;
}

.mensual-section--stretch {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .spd-table-panel {
    flex: 1;
    min-height: 0;
  }
}

.month-search-panel,
.dept-search-panel {
  margin-bottom: 0;
}

.month-toolbar-form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.month-toolbar-full,
.month-toolbar-search-input {
  width: 100%;
}

.month-toolbar-form.ele-form-search :deep(.el-form-item:not(.ele-form-actions) .el-form-item__content) {
  max-width: none;
}

.sum-line {
  text-align: right;
  padding: 8px 12px;
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  border-top: 1px solid #ebeef5;
}

.sum-line--panel {
  margin: 0;
}

.sum-line b {
  color: #409eff;
  font-size: 14px;
}

.variety-pager {
  margin-top: 6px;
  padding: 0 8px 4px;
  text-align: right;
}

.print-opt-btn {
  display: block;
  width: 100%;
  margin: 0 0 8px !important;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

.dept-search-form {
  :deep(.dept-search-item) {
    display: flex;
    margin-right: 0;
    width: 100%;
  }

  :deep(.dept-search-item .el-form-item__content) {
    flex: 1;
    max-width: none;
  }

  .dept-search-input {
    width: 100%;
  }
}

.dept-search-form,
.mid-header-form,
.right-tools-form {
  :deep(.el-form-item:not(.ele-form-actions) .el-form-item__content) {
    max-width: none;
  }
}

/* .month-toolbar { margin-bottom: 8px; }
.month-toolbar-dates { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; }
.month-toolbar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 6px; }
.dept-search { display: flex; gap: 6px; margin-bottom: 8px; }
.right-tools { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sub-card >>> .el-card__header { padding: 8px 12px; }
.mid-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; } */
</style>
