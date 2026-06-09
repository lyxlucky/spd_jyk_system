<template>
  <div class="ele-body nissin-bills">
    <div class="panel-grid">
      <!-- 左：日清账单列表 -->
      <div class="col-left">
        <el-card shadow="never" class="sub-card">
          <template slot="header"><span class="sub-title">日清账单列表</span></template>
          <div class="toolbar-block">
            <div class="toolbar-row">
              <span class="field-label">查询日期</span>
              <el-date-picker
                v-model="billQuery.month"
                type="month"
                size="mini"
                value-format="yyyy-MM"
                placeholder="选择月份"
                style="width: 140px"
              />
            </div>
            <div class="toolbar-row">
              <el-input
                v-model="billQuery.deptName"
                size="mini"
                clearable
                placeholder="请输入二级科室名称"
                @keyup.enter.native="loadBillList"
              />
            </div>
            <div class="toolbar-row toolbar-btns">
              <el-button size="mini" type="primary" @click="loadBillList">查询日清账单</el-button>
              <el-button
                v-if="showConfirmBtn"
                size="mini"
                type="primary"
                :disabled="!canConfirm"
                @click="nissConfirmComplete"
              >
                确认完成
              </el-button>
            </div>
          </div>
          <el-table
            v-loading="billLoading"
            :data="billRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 280px)"
            highlight-current-row
            @current-change="onBillSelect"
          >
            <el-table-column label="日清日期" width="110" sortable prop="Clearing_Time">
              <template slot-scope="{ row }">{{ fmtClearingDate(row.Clearing_Time) }}</template>
            </el-table-column>
            <el-table-column label="账单状态" min-width="80">
              <template slot-scope="{ row }">{{ clearingStateLabel(row.Clearing_State) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 中：二级科室列表 -->
      <div class="col-mid">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header"><span class="sub-title">二级科室列表</span></template>
          <div class="toolbar-row">
            <el-input
              v-model="deptKeyword"
              size="mini"
              clearable
              placeholder="请输入科室名称搜索"
              @keyup.enter.native="loadDeptList"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadDeptList" />
          </div>
          <el-table
            v-loading="deptLoading"
            ref="deptTable"
            :data="deptRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 240px)"
            highlight-current-row
            @selection-change="deptSelection = $event"
            @current-change="onDeptSelect"
          >
            <el-table-column type="selection" width="38" align="center" />
            <el-table-column prop="SPD_COST_DEPT_NAME" label="科室名称" min-width="120" show-overflow-tooltip />
            <el-table-column prop="print_count" label="打印次数" width="78" align="center" />
            <el-table-column v-if="showDayApprovalCol" label="审核状态" width="78" align="center">
              <template slot-scope="{ row }">{{ dayApprovalStateLabel(row.Day_Approval_State) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 右：散货及定数包日清列表 -->
      <div class="col-right">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header">
            <div class="right-header">
              <span class="sub-title">散货及定数包日清列表</span>
            </div>
          </template>
          <div class="right-toolbar">
            <el-input
              v-model="varietyKeyword"
              size="mini"
              clearable
              placeholder="品种编码/品种全称"
              style="width: 220px"
              @keyup.enter.native="loadVarietyList(1)"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadVarietyList(1)" />
            <div class="right-btns">
              <el-button
                v-if="showConfirmHisBtn"
                size="mini"
                type="primary"
                :disabled="!canConfirm"
                @click="nissConfirmHis"
              >
                确认His计费日清
              </el-button>
              <el-button size="mini" type="primary" :disabled="!canPrint" @click="nissPrintNoHis">
                打印非his计费
              </el-button>
              <el-button v-if="showDayApprovalBtn" size="mini" type="primary" @click="nissDayApproval">
                审核
              </el-button>
              <el-button v-if="showPrintBill2" size="mini" type="primary" :disabled="!canPrint" @click="nissPrintDailyBill2">
                打印日清账单2
              </el-button>
              <el-button size="mini" type="primary" :disabled="!canPrint" @click="nissPrintDailyBill">
                打印日清账单
              </el-button>
              <el-button
                v-if="showPrintBillSummary"
                size="mini"
                type="primary"
                :disabled="!canPrint"
                @click="nissPrintDailyBillSummary"
              >
                打印日清账单汇总
              </el-button>
              <el-button size="mini" type="primary" :disabled="!selectedBill" @click="nissPrintPlanSheet">
                打印计划单
              </el-button>
              <el-button size="mini" type="primary" :disabled="!selectedBill" @click="nissPrintPlanDeptOne">
                打印计划单一级科室
              </el-button>
              <el-button size="mini" type="primary" :disabled="!selectedBill" @click="nissPrintPlanJy">
                打印计划单(检验科)
              </el-button>
              <el-button size="mini" type="primary" :disabled="!selectedBill" @click="nissPrintPlanSx">
                打印计划单(输血科)
              </el-button>
              <el-button size="mini" type="primary" :disabled="!selectedBill" @click="nissPrintMonthPlanHz">
                打印月计划汇总表
              </el-button>
            </div>
          </div>
          <el-table
            v-loading="varietyLoading"
            :data="varietyRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 340px)"
            @sort-change="onVarietySort"
          >
            <el-table-column prop="DateShow" label="手术计费日期" width="110" sortable="custom" />
            <el-table-column prop="Varietie_code" label="品种编码" width="95" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Varietie_name" label="品种全称" min-width="140" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Specification_or_Type" label="型号/规格" width="100" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Unit" label="单位" width="55" align="center" sortable="custom" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" width="120" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Charging_Dept" label="计费科室编码" width="110" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Batch" label="生产批号" width="90" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="Coefficient" label="系数" width="55" align="center" sortable="custom" />
            <el-table-column prop="DefQuantity" label="包数" width="55" align="center" sortable="custom" />
            <el-table-column prop="GoodsQuantity" label="散货数量" width="80" align="center" sortable="custom" />
            <el-table-column label="单价" width="75" align="right" sortable="custom" prop="Price">
              <template slot-scope="{ row }">{{ fmtPrice(row) }}</template>
            </el-table-column>
            <el-table-column label="金额" width="80" align="right" sortable="custom" prop="Money">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="varietyTotal > 0"
            small
            layout="total, sizes, prev, pager, next"
            :total="varietyTotal"
            :page-size="varietyPage.size"
            :page-sizes="varietyPageSizes"
            :current-page.sync="varietyPage.page"
            style="margin-top: 6px; text-align: right"
            @size-change="onVarietySizeChange"
            @current-change="loadVarietyList"
          />
          <div class="sum-line">
            品种总数: <b>{{ varietySummary.qty }}</b> &nbsp; 总金额: <b>{{ varietySummary.money }}</b>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserGroupByName } from '@/api/layout/index';
import * as api from '@/api/Settle/NissinBills';
import nissinActionsMixin from './nissinActionsMixin';
import {
  HOME_HP,
  clearingStateLabel,
  dayApprovalStateLabel,
  fmtClearingDate,
  fmtMoney,
  fmtPrice
} from './utils';

export default {
  name: 'NissinBills',
  mixins: [nissinActionsMixin],
  data() {
    return {
      hp: HOME_HP,
      billQuery: { month: '', deptName: '' },
      billLoading: false,
      billRows: [],
      selectedBill: null,
      deptKeyword: '',
      deptLoading: false,
      deptRows: [],
      deptSelection: [],
      selectedDept: null,
      varietyKeyword: '',
      varietyLoading: false,
      varietyRows: [],
      varietyTotal: 0,
      varietyPage: { page: 1, size: 10 },
      varietyPageSizes: [10, 30, 60, 90, 150, 300],
      varietySort: { field: '', order: '' },
      varietySummary: { qty: '', money: '' },
      hasConfirmPermission: false,
      approvalUserId: ''
    };
  },
  computed: {
    isBillNew() {
      const s = this.selectedBill?.Clearing_State;
      return s == 0 || s === '0';
    },
    isBillDone() {
      const s = this.selectedBill?.Clearing_State;
      return s == 1 || s === '1';
    },
    canConfirm() {
      return !!this.selectedBill && this.isBillNew;
    },
    canPrint() {
      return !!this.selectedBill && !!this.selectedDept && this.isBillDone;
    },
    showConfirmBtn() {
      if (this.hp === 'nyd' || this.hp === 'lg') {
        return this.hasConfirmPermission;
      }
      return true;
    },
    showConfirmHisBtn() {
      return this.showConfirmBtn;
    },
    showDayApprovalBtn() {
      return this.hp === 'nyd';
    },
    showDayApprovalCol() {
      return this.hp === 'nyd';
    },
    showPrintBill2() {
      return this.hp === 'nyd';
    },
    showPrintBillSummary() {
      return this.hp === 'bd';
    },
    billStateParam() {
      return this.isBillDone ? 1 : 0;
    }
  },
  created() {
    this.loadBillList();
    this.checkConfirmPermission();
  },
  methods: {
    clearingStateLabel,
    dayApprovalStateLabel,
    fmtClearingDate,
    fmtMoney,
    fmtPrice,

    async checkConfirmPermission() {
      if (this.hp !== 'nyd' && this.hp !== 'lg') {
        this.hasConfirmPermission = true;
        return;
      }
      try {
        const username = this.$store.state.user.info?.UserName || '';
        if (!username) return;
        const res = await getUserGroupByName({ username });
        const permission = res?.permission_group || [];
        this.hasConfirmPermission = permission.some(
          (item) => item.Permission_Url === 'NissinBills_确认日清'
        );
        this.approvalUserId = res?.ID || '';
      } catch (_) {
        this.hasConfirmPermission = false;
      }
    },

    async loadBillList() {
      this.billLoading = true;
      try {
        const month = (this.billQuery.month || '').replace('-', '');
        const deptName = this.billQuery.deptName || '';
        let res;
        if (!month && !deptName) {
          res = await api.getDayClearingNum();
        } else {
          res = await api.searchDayClear({ Date: month, DeptName: deptName });
        }
        this.billRows = res.result || [];
        if (this.selectedBill) {
          const hit = this.billRows.find((r) => r.ID === this.selectedBill.ID);
          this.selectedBill = hit || null;
        }
        if (!this.selectedBill) {
          this.deptRows = [];
          this.varietyRows = [];
          this.varietySummary = { qty: '', money: '' };
        }
      } catch (e) {
        this.$message.error(e.message || '加载日清账单失败');
      } finally {
        this.billLoading = false;
      }
    },

    onBillSelect(row) {
      this.selectedBill = row || null;
      this.selectedDept = null;
      this.deptSelection = [];
      this.varietyRows = [];
      this.varietyTotal = 0;
      this.varietySummary = { qty: '', money: '' };
      if (row?.ID) {
        this.loadDeptList();
      } else {
        this.deptRows = [];
      }
    },

    async loadDeptList() {
      if (!this.selectedBill?.ID) return;
      this.deptLoading = true;
      try {
        const res = await api.getDayClearingDept({
          GoodsDayClearingID: this.selectedBill.ID,
          State: this.billStateParam,
          SerachDept: this.deptKeyword || ''
        });
        this.deptRows = res.result || [];
        this.$nextTick(() => {
          const table = this.$refs.deptTable;
          if (table) {
            this.deptRows.forEach((row) => table.toggleRowSelection(row, true));
          }
        });
      } catch (e) {
        this.$message.error(e.message || '加载科室失败');
      } finally {
        this.deptLoading = false;
      }
    },

    onDeptSelect(row) {
      this.selectedDept = row || null;
      this.varietyPage.page = 1;
      if (row && this.selectedBill?.ID) {
        this.loadVarietyList(1);
      } else {
        this.varietyRows = [];
        this.varietySummary = { qty: '', money: '' };
      }
    },

    onVarietySort({ prop, order }) {
      this.varietySort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.loadVarietyList(1);
    },

    onVarietySizeChange(size) {
      this.varietyPage.size = size;
      this.loadVarietyList(1);
    },

    async loadVarietyList(page) {
      if (!this.selectedBill?.ID || !this.selectedDept?.SPD_COST_DEPT_CODE) return;
      this.varietyPage.page = page || this.varietyPage.page;
      this.varietyLoading = true;
      try {
        const res = await api.getClearingVarDtl({
          GoodsDayClearingDeptID: this.selectedBill.ID,
          DeptCode: this.selectedDept.SPD_COST_DEPT_CODE,
          SerachName: this.varietyKeyword || '',
          State: this.billStateParam,
          field: this.varietySort.field,
          order: this.varietySort.order,
          page: this.varietyPage.page,
          size: this.varietyPage.size
        });
        const rows = res.result || [];
        this.varietyRows = rows;
        this.varietyTotal = res.total ?? rows.length;
        if (rows.length) {
          this.varietySummary = {
            qty: rows[0].CollectQty ?? '',
            money: rows[0].CollectPrice ?? ''
          };
        } else {
          this.varietySummary = { qty: '', money: '' };
        }
      } catch (e) {
        this.$message.error(e.message || '加载明细失败');
      } finally {
        this.varietyLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.nissin-bills >>> .el-card__body {
  padding: 10px;
}
.panel-grid {
  display: grid;
  grid-template-columns: 22% 28% 50%;
  gap: 8px;
  min-height: calc(100vh - 120px);
}
.sub-title {
  font-weight: 600;
  font-size: 13px;
}
.toolbar-block {
  margin-bottom: 8px;
}
.toolbar-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.toolbar-btns {
  justify-content: space-between;
}
.field-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}
.right-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.right-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: auto;
}
.sum-line {
  margin-top: 8px;
  text-align: right;
  font-size: 12px;
}
.full-h {
  height: 100%;
}
</style>
