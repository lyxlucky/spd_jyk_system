<template>
  <div class="ele-body spd-page print-use-dept-two">
    <div class="panel-grid">
      <!-- 左：日清列表 -->
      <div class="col-left">
        <el-card shadow="never" class="sub-card">
          <template slot="header"><span class="sub-title">日清列表</span></template>
          <div class="toolbar-row">
            <span class="field-label">日清时间</span>
            <el-date-picker
              v-model="billDate"
              type="month"
              size="mini"
              value-format="yyyy-MM"
              placeholder="选择月份"
              style="width: 130px"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadBillList">
              查询
            </el-button>
          </div>
          <el-table
            v-loading="billLoading"
            :data="billRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 240px)"
            highlight-current-row
            @current-change="onBillSelect"
          >
            <el-table-column label="日清日期" min-width="100">
              <template slot-scope="{ row }">{{ fmtClearingDate(row.Clearing_Time) }}</template>
            </el-table-column>
            <el-table-column label="账单状态" width="80">
              <template slot-scope="{ row }">{{ clearingStateLabel(row.Clearing_State) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 中：收货科室 -->
      <div class="col-mid">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header">
            <span class="sub-title">含his计费消耗数据的收货科室</span>
          </template>
          <div class="toolbar-row">
            <span class="field-label">科室名称</span>
            <el-input
              v-model="deptKeyword"
              size="mini"
              clearable
              placeholder="科室名称"
              style="width: 120px"
              @keyup.enter.native="loadDeptList"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadDeptList" />
          </div>
          <el-table
            v-loading="deptLoading"
            :data="deptRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 240px)"
            highlight-current-row
            @current-change="onDeptSelect"
          >
            <el-table-column prop="Dept_Two_Name" label="科室名称" min-width="120" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>

      <!-- 右：品种列表 -->
      <div class="col-right">
        <el-card shadow="never" class="sub-card full-h">
          <template slot="header"><span class="sub-title">品种列表</span></template>
          <div class="right-toolbar">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadVarietyList">
              查询
            </el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="!selectedDept"
              :loading="printing"
              @click="onPrintHis"
            >
              打印his计费日清单
            </el-button>
          </div>
          <el-table
            v-loading="varietyLoading"
            :data="varietyRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 300px)"
          >
            <el-table-column prop="DateShow" label="日期" width="100" show-overflow-tooltip />
            <el-table-column prop="Varietie_code" label="品种编码" width="95" show-overflow-tooltip />
            <el-table-column prop="Varietie_name" label="品种全称" min-width="140" show-overflow-tooltip />
            <el-table-column
              prop="Specification_or_Type"
              label="型号/规格"
              width="100"
              show-overflow-tooltip
            />
            <el-table-column prop="Unit" label="单位" width="55" align="center" />
            <el-table-column
              prop="Manufacturing_Ent_Name"
              label="生产企业名称"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column prop="Charging_Dept" label="计费科室" width="100" show-overflow-tooltip />
            <el-table-column prop="Batch" label="生产批号" width="90" show-overflow-tooltip />
            <el-table-column prop="Coefficient" label="系数" width="55" align="center" />
            <el-table-column prop="DefQuantity" label="包数" width="55" align="center" />
            <el-table-column prop="GoodsQuantity" label="散货数量" width="80" align="center" />
            <el-table-column label="单价" width="75" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row) }}</template>
            </el-table-column>
            <el-table-column label="金额" width="80" align="right">
              <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
            </el-table-column>
          </el-table>
          <div class="sum-line">
            品种总数: <b>{{ varietySummary.qty }}</b> &nbsp; 总金额: <b>{{ varietySummary.money }}</b>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/Settle/PrintUseDeptTwo';
import {
  clearingStateLabel,
  fmtClearingDate,
  fmtMoney,
  fmtPrice,
  openExcelFile
} from '@/views/Settle/NissinBills/utils';

export default {
  name: 'PrintUseDeptTwo',
  data() {
    return {
      billDate: '',
      billLoading: false,
      billRows: [],
      selectedBill: null,
      deptKeyword: '',
      deptLoading: false,
      deptRows: [],
      selectedDept: null,
      varietyLoading: false,
      varietyRows: [],
      varietySummary: { qty: '', money: '' },
      printing: false
    };
  },
  created() {
    this.loadBillList();
  },
  methods: {
    clearingStateLabel,
    fmtClearingDate,
    fmtMoney,
    fmtPrice,

    async loadBillList() {
      this.billLoading = true;
      try {
        const res = await api.getDayClearingList(this.billDate);
        this.billRows = res.result || [];
        if (this.selectedBill) {
          const hit = this.billRows.find((r) => r.ID === this.selectedBill.ID);
          this.selectedBill = hit || null;
        }
        if (!this.selectedBill) {
          this.deptRows = [];
          this.varietyRows = [];
          this.varietySummary = { qty: '', money: '' };
          this.selectedDept = null;
        }
      } catch (e) {
        this.$message.error(e.message || '加载日清列表失败');
      } finally {
        this.billLoading = false;
      }
    },

    onBillSelect(row) {
      this.selectedBill = row || null;
      this.selectedDept = null;
      this.varietyRows = [];
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
        const res = await api.getDayHisCharDeptTwo(this.selectedBill.ID, this.deptKeyword);
        this.deptRows = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载科室失败');
      } finally {
        this.deptLoading = false;
      }
    },

    onDeptSelect(row) {
      this.selectedDept = row || null;
      if (row) {
        this.loadVarietyList();
      } else {
        this.varietyRows = [];
        this.varietySummary = { qty: '', money: '' };
      }
    },

    async loadVarietyList() {
      if (!this.selectedBill?.ID || !this.selectedDept?.Dept_Two_Code) return;
      this.varietyLoading = true;
      try {
        const res = await api.getClearingVarDtlUseDeptTwoCode({
          GoodsDayClearingDeptID: this.selectedBill.ID,
          DeptCode: this.selectedDept.Dept_Two_Code,
          SerachName: '',
          State: '1'
        });
        const rows = res.result || [];
        this.varietyRows = rows;
        if (rows.length) {
          this.varietySummary = {
            qty: rows[0].CollectQty ?? '',
            money: rows[0].CollectPrice ?? ''
          };
        } else {
          this.varietySummary = { qty: '', money: '' };
        }
      } catch (e) {
        this.$message.error(e.message || '加载品种失败');
      } finally {
        this.varietyLoading = false;
      }
    },

    async onPrintHis() {
      if (!this.selectedDept?.Dept_Two_Code) {
        this.$message.warning('请先选中科室');
        return;
      }
      this.printing = true;
      const loading = this.$loading({ lock: true, text: '生成中...' });
      try {
        const res = await api.printHisDayClear({
          GoodsDayClearingDeptID: this.selectedBill.ID,
          DeptCode: this.selectedDept.Dept_Two_Code,
          N_Dept_Two_Name: this.selectedDept.Dept_Two_Name,
          Clearing_Time: this.selectedBill.Clearing_Time,
          State: 1
        });
        if (res.msg) openExcelFile(res.msg);
        try {
          await api.updatePrint({
            ClearingID: this.selectedBill.ID,
            DetpCode: this.selectedDept.Dept_Two_Code
          });
        } catch (_) {
          /* 旧页 UpdatePrint 变量写错，此处用正确参数 */
        }
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      } finally {
        loading.close();
        this.printing = false;
      }
    }
  }
};
</script>

<style scoped>
.print-use-dept-two >>> .el-card__body {
  padding: 10px;
}
.panel-grid {
  display: grid;
  grid-template-columns: 18% 22% 60%;
  gap: 8px;
  min-height: calc(100vh - 120px);
}
.sub-title {
  font-weight: 600;
  font-size: 13px;
}
.toolbar-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.field-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}
.right-toolbar {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
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
