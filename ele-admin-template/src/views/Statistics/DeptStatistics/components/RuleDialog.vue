<template>
  <el-dialog
    title="统计规则"
    :visible.sync="innerVisible"
    width="88%"
    top="6vh"
    append-to-body
    @open="onOpen"
  >
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="rule-panel-head">
          <span>科室</span>
          <el-select v-model="form.statisticsTime" size="mini" style="width: 110px" @change="loadDeptList">
            <el-option label="按年统计" value="0" />
            <el-option label="按月统计" value="1" />
          </el-select>
          <el-input
            v-if="form.statisticsTime === '0'"
            v-model="form.date"
            size="mini"
            placeholder="YYYY"
            style="width: 100px"
            maxlength="4"
            @change="loadDeptList"
          />
          <el-date-picker
            v-else
            v-model="form.date"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="YYYY-MM"
            style="width: 130px"
            @change="loadDeptList"
          />
          <el-input
            v-model="deptSearch"
            size="mini"
            clearable
            placeholder="搜索科室"
            style="width: 130px"
            @input="filterDeptRows"
          />
        </div>
        <div v-loading="deptLoading" class="rule-table-wrap">
          <ele-pro-table
            ref="deptTable"
            size="mini"
            border
            stripe
            :columns="deptColumns"
            :datasource="deptDatasource"
            :selection.sync="deptSelection"
            :toolkit="['columns', 'fullscreen']"
            :need-page="false"
            height="52vh"
            highlight-current-row
            cache-key="DeptStatisticsRuleDeptTable"
            @current-change="onDeptCurrentChange"
            @row-dblclick="onDeptRowDblclick"
          >
            <template v-slot:toolbar>
              <el-button size="mini" type="success" icon="el-icon-download" @click="exportDeptTable">
                导出
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printDeptTable">
                打印
              </el-button>
            </template>
          </ele-pro-table>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="rule-panel-head">
          <span>{{ currentDept.DeptName || '科室' }}-品种</span>
          <span v-if="!currentDept.DeptCode" class="rule-hint">请单击左侧科室行</span>
          <el-input
            v-model="varietySearch"
            size="mini"
            clearable
            placeholder="搜索品种"
            style="width: 150px"
            @input="filterVarietyRows"
          />
        </div>
        <div v-loading="varietyLoading" class="rule-table-wrap">
          <ele-pro-table
            ref="varietyTable"
            size="mini"
            border
            stripe
            :columns="varietyColumns"
            :datasource="varietyDatasource"
            :selection.sync="varietySelection"
            :toolkit="['columns', 'fullscreen']"
            :need-page="false"
            height="52vh"
            cache-key="DeptStatisticsRuleVarietyTable"
          >
            <template v-slot:toolbar>
              <el-button size="mini" type="success" icon="el-icon-download" @click="exportVarietyTable">
                导出
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printVarietyTable">
                打印
              </el-button>
            </template>
          </ele-pro-table>
        </div>
      </el-col>
    </el-row>

    <template v-slot:footer>
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" @click="apply">展示统计视图</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import {
  getDeptVarietieStatisticsAll,
  getDeptVarietieStatisticsByDept
} from '@/api/Statistics/DeptStatistics';
import { exportToExcel } from '@/utils/excel-util';
import {
  processDeptRows,
  processVarietyRows,
  printHtmlTable,
  DEPT_TABLE_COLUMNS,
  VARIETY_TABLE_COLUMNS
} from '../utils';

export default {
  name: 'DeptStatisticsRuleDialog',
  props: {
    visible: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      innerVisible: false,
      form: {
        statisticsTime: '0',
        date: String(new Date().getFullYear())
      },
      deptSearch: '',
      varietySearch: '',
      deptLoading: false,
      varietyLoading: false,
      deptRows: [],
      filteredDeptRows: [],
      varietyRows: [],
      filteredVarietyRows: [],
      deptSelection: [],
      varietySelection: [],
      currentDept: { DeptCode: '', DeptName: '' },
      hospitalMoney: 0,
      hospitalQty: 0,
      deptColumns: DEPT_TABLE_COLUMNS,
      varietyColumns: VARIETY_TABLE_COLUMNS
    };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
      if (v) {
        this.beginOpenLoading();
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler(v) {
        if (!v) return;
        this.form.statisticsTime = v.statisticsTime ?? '0';
        this.form.date = v.date ?? String(new Date().getFullYear());
        if (v.currentDept) {
          this.currentDept = { ...v.currentDept };
        }
      }
    }
  },
  methods: {
    beginOpenLoading() {
      if (!this.deptRows.length) {
        this.deptLoading = true;
        this.varietyLoading = true;
        return;
      }
      if (this.currentDept.DeptCode) {
        this.varietyLoading = true;
      }
    },
    async onOpen() {
      if (this.deptRows.length === 0) {
        await this.loadDeptList();
        return;
      }
      if (this.currentDept.DeptCode) {
        await this.loadVarietyList(this.currentDept.DeptCode);
        this.highlightDeptRow(this.currentDept.DeptCode);
      }
    },
    deptDatasource() {
      return Promise.resolve({
        count: this.filteredDeptRows.length,
        list: this.filteredDeptRows
      });
    },
    varietyDatasource() {
      return Promise.resolve({
        count: this.filteredVarietyRows.length,
        list: this.filteredVarietyRows
      });
    },
    reloadDeptTable() {
      this.$refs.deptTable?.reload({ page: 1 });
    },
    reloadVarietyTable() {
      this.$refs.varietyTable?.reload({ page: 1 });
    },
    validateDate() {
      if (this.form.statisticsTime === '0') {
        if (!/^\d{4}$/.test(this.form.date || '')) {
          Message.warning('按年统计日期格式错误，正确如: 2019');
          return false;
        }
      } else if ((this.form.date || '').length !== 7) {
        Message.warning('按月统计日期格式错误，正确如: 2019-01');
        return false;
      }
      return true;
    },
    async loadDeptList() {
      if (!this.validateDate()) {
        this.deptLoading = false;
        this.varietyLoading = false;
        return;
      }
      this.deptLoading = true;
      try {
        const res = await getDeptVarietieStatisticsAll({
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          statisticsType: this.form.statisticsTime
        });
        this.deptRows = processDeptRows(res.result);
        this.filteredDeptRows = [...this.deptRows];
        if (this.deptRows.length) {
          this.hospitalMoney = parseFloat(this.deptRows[0].HospitalMoney) || 0;
          this.hospitalQty = parseFloat(this.deptRows[0].HospitalQty) || 0;
        }
        this.filterDeptRows();
        await this.syncDeptLinkage();
      } catch (e) {
        Message.error(e.message || '加载科室失败');
        this.deptRows = [];
        this.filteredDeptRows = [];
        this.varietyLoading = false;
        this.reloadDeptTable();
      } finally {
        this.deptLoading = false;
      }
    },
    filterDeptRows() {
      const kw = (this.deptSearch || '').trim();
      if (!kw) {
        this.filteredDeptRows = [...this.deptRows];
      } else {
        const reg = new RegExp(kw, 'i');
        this.filteredDeptRows = this.deptRows.filter(
          (r) => reg.test(r.DeptName) || reg.test(r.DeptCode)
        );
      }
      this.reloadDeptTable();
    },
    filterVarietyRows() {
      const kw = (this.varietySearch || '').trim();
      if (!kw) {
        this.filteredVarietyRows = [...this.varietyRows];
        this.reloadVarietyTable();
        return;
      }
      const reg = new RegExp(kw, 'i');
      const matched = this.varietyRows.filter((r) => reg.test(r.VarietieName));
      this.filteredVarietyRows = matched.length ? matched : [...this.varietyRows];
      this.reloadVarietyTable();
      this.$nextTick(() => {
        matched.forEach((row) => {
          this.$refs.varietyTable?.$refs?.table?.toggleRowSelection(row, true);
        });
      });
    },
    highlightDeptRow(deptCode) {
      this.$nextTick(() => {
        const row = this.filteredDeptRows.find((r) => r.DeptCode === deptCode);
        if (row) {
          this.$refs.deptTable?.setCurrentRow(row);
        }
      });
    },
    async syncDeptLinkage() {
      await this.$nextTick();
      if (!this.filteredDeptRows.length) {
        this.currentDept = { DeptCode: '', DeptName: '' };
        this.varietyRows = [];
        this.filteredVarietyRows = [];
        this.varietyLoading = false;
        this.reloadVarietyTable();
        return;
      }
      const keep = this.filteredDeptRows.find(
        (r) => r.DeptCode === this.currentDept.DeptCode
      );
      const target = keep || this.filteredDeptRows[0];
      await this.selectDept(target, true);
    },
    onDeptCurrentChange(row) {
      if (!row || row.DeptCode === this.currentDept.DeptCode) return;
      this.selectDept(row, false);
    },
    onDeptRowDblclick(row) {
      this.selectDept(row, true);
    },
    selectDept(row, highlight = true) {
      if (!row) return Promise.resolve();
      this.currentDept = { DeptCode: row.DeptCode, DeptName: row.DeptName };
      if (highlight) {
        this.highlightDeptRow(row.DeptCode);
      }
      return this.loadVarietyList(row.DeptCode);
    },
    async loadVarietyList(deptCode) {
      if (!deptCode || !this.validateDate()) {
        this.varietyLoading = false;
        return;
      }
      this.varietyLoading = true;
      try {
        const res = await getDeptVarietieStatisticsByDept({
          deptCode,
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          statisticsType: this.form.statisticsTime
        });
        this.varietyRows = processVarietyRows(res.result);
        this.filteredVarietyRows = [...this.varietyRows];
        this.varietySelection = [];
        this.varietySearch = '';
        this.reloadVarietyTable();
      } catch (e) {
        Message.error(e.message || '加载品种失败');
        this.varietyRows = [];
        this.filteredVarietyRows = [];
        this.reloadVarietyTable();
      } finally {
        this.varietyLoading = false;
      }
    },
    exportDeptTable() {
      if (!this.filteredDeptRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      exportToExcel(this.filteredDeptRows, this.deptColumns, '科室统计列表');
      Message.success('导出成功');
    },
    exportVarietyTable() {
      if (!this.filteredVarietyRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      const name = this.currentDept.DeptName || '科室';
      exportToExcel(this.filteredVarietyRows, this.varietyColumns, `${name}品种统计`);
      Message.success('导出成功');
    },
    printDeptTable() {
      if (!this.filteredDeptRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      printHtmlTable('科室统计列表', this.deptColumns, this.filteredDeptRows);
    },
    printVarietyTable() {
      if (!this.filteredVarietyRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      const name = this.currentDept.DeptName || '科室';
      printHtmlTable(`${name}品种统计`, this.varietyColumns, this.filteredVarietyRows);
    },
    apply() {
      if (!this.validateDate()) return;
      const selectedDepts = this.deptSelection.length
        ? [...this.deptSelection]
        : this.deptRows.slice(0, 5);
      if (!selectedDepts.length) {
        Message.warning('请先加载并选择科室');
        return;
      }
      if (!this.currentDept.DeptCode && selectedDepts[0]) {
        this.currentDept = {
          DeptCode: selectedDepts[0].DeptCode,
          DeptName: selectedDepts[0].DeptName
        };
      }
      const applyFn = async () => {
        if (this.currentDept.DeptCode) {
          await this.loadVarietyList(this.currentDept.DeptCode);
        }
        this.$emit('apply', {
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          statYear: String(this.form.date).substring(0, 4),
          selectedDepts,
          currentDept: { ...this.currentDept },
          selectedVarieties: [...this.varietySelection],
          hospitalMoney: this.hospitalMoney,
          hospitalQty: this.hospitalQty,
          varietyRows: [...this.varietyRows]
        });
        this.innerVisible = false;
      };
      applyFn();
    }
  }
};
</script>

<style scoped>
.rule-panel-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}
.rule-hint {
  color: #909399;
  font-size: 12px;
}
.rule-table-wrap {
  min-height: 52vh;
}
</style>
