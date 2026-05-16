<template>
  <el-row :gutter="10" class="hedge-success">
    <el-col :span="7" class="col-pane">
      <div class="pane-title">二级科室列表</div>
      <el-form size="small" inline @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="deptKw"
            clearable
            placeholder="科室名称搜索"
            style="width: 100%"
            @keyup.enter.native="loadDepts"
          >
            <el-button slot="append" icon="el-icon-search" @click="loadDepts" />
          </el-input>
        </el-form-item>
      </el-form>
      <div class="table-shell">
        <el-table
          ref="deptTable"
          v-loading="deptLoading"
          :data="deptRows"
          border
          stripe
          height="100%"
          highlight-current-row
          @current-change="onDeptSelect"
        >
          <el-table-column prop="Dept_Two_Name" label="二级科室名称" min-width="140" show-overflow-tooltip sortable />
        </el-table>
      </div>
    </el-col>
    <el-col :span="17" class="col-pane">
      <div class="pane-title">已对冲且对冲成功的数据列表</div>
      <el-form size="small" :inline="true" class="search-form" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="q.deptTwoName" clearable placeholder="科室名称模糊" style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.hisVarietieName" clearable placeholder="品种全称" style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.defNoPkgCode" clearable placeholder="定数码" style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.patientNumber" clearable placeholder="病患号" style="width: 110px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.chargingDept" clearable placeholder="计划科室" style="width: 110px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.chargingCode" clearable placeholder="计费编码" style="width: 110px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="q.serialNumber" clearable placeholder="UDI" style="width: 110px" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="q.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="q.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadMain(1)">查询</el-button>
          <el-button type="primary" plain :loading="exporting" @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-form>

      <el-table v-if="extendRow" :data="[extendRow]" border size="mini" class="detail-table">
        <el-table-column prop="Varietie_Code" label="品种编码" min-width="100" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="90" show-overflow-tooltip />
        <el-table-column prop="Unit" label="单位" width="55" />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="120" show-overflow-tooltip />
        <el-table-column prop="Batch" label="生产批号" width="90" show-overflow-tooltip />
      </el-table>
      <el-table v-if="extendRow" :data="[extendRow]" border size="mini" class="detail-table mt6">
        <el-table-column prop="Batch_Validity_Period" label="有效到期" width="100" />
        <el-table-column prop="Serial_Number" label="UDI" min-width="120" show-overflow-tooltip />
        <el-table-column prop="Rfid_Code" label="RFID码" width="100" show-overflow-tooltip />
        <el-table-column prop="Log_Date" label="暂借时间" width="140" />
        <el-table-column prop="Operatation_Staff" label="领用人" width="80" />
        <el-table-column prop="Coefficient" label="系数" width="60" />
      </el-table>

      <div class="table-shell main-table-shell mt8">
        <el-table
          v-loading="mainLoading"
          :data="mainRows"
          border
          stripe
          size="small"
          height="100%"
          highlight-current-row
          @row-click="onMainRowClick"
          @sort-change="onSort"
        >
          <el-table-column prop="His_Varietie_Name" label="HIS品种全称" min-width="160" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="110" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Serial_Number" label="UDI" width="120" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Operate_Person" label="消耗人" width="90" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Nurse_Operator" label="暂借人" width="90" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="Charging_Code" label="计费编码" width="85" sortable="custom" />
          <el-table-column prop="Operation_Number" label="手术编号" width="85" sortable="custom" />
          <el-table-column prop="Hospitalization_Number" label="住院号" width="80" sortable="custom" />
          <el-table-column prop="Patient_Number" label="病患号" width="80" sortable="custom" />
          <el-table-column prop="HIS_CHARGING_PRICE" label="his计费价格" width="100" sortable="custom" />
          <el-table-column prop="Opeartion_Charging_Time" label="手术计费时间" width="145" sortable="custom" />
          <el-table-column prop="Used_Qty" label="使用数量" width="75" align="center" sortable="custom" />
          <el-table-column prop="Patient_Dept" label="病人科室" width="85" />
          <el-table-column prop="Charging_Dept" label="计费科室" width="85" />
          <el-table-column prop="Dept_Name" label="计费科室名称" width="110" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SPD_COST_DEPT_NAME" label="成本科室" width="90" show-overflow-tooltip />
          <el-table-column label="完成标志" width="85" sortable="custom" prop="Is_Complete">
            <template slot-scope="{ row }">{{ fmtIsComplete(row.Is_Complete) }}</template>
          </el-table-column>
          <el-table-column prop="Integrate_Time" label="系统对接时间" width="150" sortable="custom" />
          <el-table-column label="是否对冲" width="85" sortable="custom" prop="Is_Hedge">
            <template slot-scope="{ row }">{{ fmtIsHedge(row.Is_Hedge) }}</template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pager"
        small
        background
        layout="total, sizes, prev, pager, next"
        :total="mainTotal"
        :page-size="mainSize"
        :current-page="mainPage"
        :page-sizes="[10, 30, 60, 90, 150, 300, 500, 1000]"
        @size-change="onMainSize"
        @current-change="loadMain"
      />
    </el-col>
  </el-row>
</template>

<script>
import { Message } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import * as api from '@/api/Settle/HishedgingData';
import { fmtIsComplete, fmtIsHedge } from '../utils';

export default {
  name: 'HedgeSuccessPanel',
  data() {
    return {
      deptKw: '',
      deptLoading: false,
      deptRows: [],
      selectedDept: null,
      q: {
        deptTwoName: '',
        hisVarietieName: '',
        defNoPkgCode: '',
        patientNumber: '',
        chargingDept: '',
        chargingCode: '',
        serialNumber: '',
        startDate: '',
        endDate: ''
      },
      mainLoading: false,
      mainRows: [],
      mainTotal: 0,
      mainPage: 1,
      mainSize: 10,
      sortField: '',
      sortOrder: '',
      extendRow: null,
      exporting: false
    };
  },
  mounted() {
    this.loadDepts();
  },
  methods: {
    fmtIsComplete,
    fmtIsHedge,
    async loadDepts() {
      this.deptLoading = true;
      try {
        const { rows } = await api.getDeptTwoNames(this.deptKw);
        this.deptRows = rows;
        if (!this.selectedDept && rows.length) {
          this.$nextTick(() => {
            this.$refs.deptTable?.setCurrentRow(rows[0]);
          });
        }
      } catch (e) {
        Message.error(e.message || '加载科室失败');
      } finally {
        this.deptLoading = false;
      }
    },
    onDeptSelect(row) {
      this.selectedDept = row;
      this.extendRow = null;
      this.loadMain(1);
    },
    buildQuery() {
      const code = this.selectedDept?.Dept_Two_Code || '';
      return {
        deptTwoCode: code,
        deptTwoName: this.q.deptTwoName,
        costDeptName: '',
        defNoPkgCode: this.q.defNoPkgCode,
        His_Varietie_Name: this.q.hisVarietieName,
        Def_No_Pkg_Code: this.q.defNoPkgCode,
        Charging_Dept: this.q.chargingDept,
        Charging_Code: this.q.chargingCode,
        Serial_Number: this.q.serialNumber,
        Patient_Number: this.q.patientNumber,
        startDate: this.q.startDate || '',
        endDate: this.q.endDate || '',
        field: this.sortField,
        order: this.sortOrder
      };
    },
    async loadMain(p) {
      if (!this.selectedDept) {
        Message.warning('请先选择二级科室');
        return;
      }
      this.mainPage = p;
      this.mainLoading = true;
      try {
        const { rows, total } = await api.searchDeptTwoDefNoPkgCode({
          ...this.buildQuery(),
          page: p,
          size: this.mainSize
        });
        this.mainRows = rows;
        this.mainTotal = total;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.mainLoading = false;
      }
    },
    onMainSize(size) {
      this.mainSize = size;
      this.loadMain(1);
    },
    onSort({ prop, order }) {
      this.sortField = prop || '';
      this.sortOrder = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      this.loadMain(1);
    },
    async onMainRowClick(row) {
      if (!row?.Def_No_Pkg_Code) {
        this.extendRow = null;
        return;
      }
      try {
        const d = await api.getDeptTwoDefNoPkgCodeExtend(row.Def_No_Pkg_Code);
        this.extendRow = (d.result && d.result[0]) || null;
      } catch (e) {
        Message.error(e.message || '加载扩展信息失败');
      }
    },
    async exportExcel() {
      if (!this.selectedDept) {
        Message.warning('请先选择二级科室');
        return;
      }
      this.exporting = true;
      try {
        const { rows } = await api.searchDeptTwoDefNoPkgCode({
          ...this.buildQuery(),
          page: 1,
          size: 9999999
        });
        const header = [
          'HIS品种全称',
          'HIS品种编码',
          '型号/规格',
          '定数码',
          'UDI',
          '消耗人',
          '暂借人',
          '计费编码',
          '手术编号',
          '住院号',
          '病患号',
          'his计费价格',
          '手术计费时间',
          '使用数量',
          '病人科室',
          '计费科室',
          '计费科室名称',
          '成本科室',
          '完成标志',
          '系统对接时间',
          '是否对冲'
        ];
        const data = [header];
        rows.forEach((r) => {
          data.push([
            r.His_Varietie_Name,
            r.Varietie_Code,
            r.SPECIFICATION_OR_TYPE,
            r.Def_No_Pkg_Code,
            r.Serial_Number,
            r.Operate_Person,
            r.Nurse_Operator,
            r.Charging_Code,
            r.Operation_Number,
            r.Hospitalization_Number,
            r.Patient_Number,
            r.HIS_CHARGING_PRICE,
            r.Opeartion_Charging_Time,
            r.Used_Qty,
            r.Patient_Dept,
            r.Charging_Dept,
            r.Dept_Name,
            r.SPD_COST_DEPT_NAME,
            fmtIsComplete(r.Is_Complete),
            r.Integrate_Time,
            fmtIsHedge(r.Is_Hedge)
          ]);
        });
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '对冲数据');
        writeFile(book, '对冲数据.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.hedge-success {
  align-items: stretch;
}
.col-pane {
  display: flex;
  flex-direction: column;
}
.pane-title {
  font-weight: 600;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 3px solid #3e9ef7;
}
.table-shell {
  height: 520px;
  min-height: 520px;
  flex-shrink: 0;
}
.main-table-shell {
  height: 400px;
  min-height: 400px;
}
.detail-table {
  width: 100%;
}
.mt6 {
  margin-top: 6px;
}
.mt8 {
  margin-top: 8px;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
.search-form >>> .el-form-item {
  margin-bottom: 6px;
}
</style>
