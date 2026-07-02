<template>
  <el-dialog
    title="统计规则"
    :visible.sync="innerVisible"
    width="92%"
    top="5vh"
    append-to-body
    @open="onOpen"
  >
    <el-row :gutter="10">
      <el-col :span="10">
        <div class="rule-panel-head">
          <span>品种</span>
          <el-select v-model="form.statisticsTime" size="mini" style="width: 110px" @change="reloadVarietyTable">
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
            @change="reloadVarietyTable"
          />
          <el-date-picker
            v-else
            v-model="form.date"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="YYYY-MM"
            style="width: 130px"
            @change="reloadVarietyTable"
          />
          <el-input
            v-model="varietySearch"
            size="mini"
            clearable
            placeholder="搜索品种"
            style="width: 120px"
            @keyup.enter.native="reloadVarietyTable"
            @clear="reloadVarietyTable"
          />
          <el-button size="mini" type="primary" icon="el-icon-search" @click="reloadVarietyTable">
            查询
          </el-button>
        </div>
        <div v-loading="varietyLoading" class="rule-table-wrap">
          <ele-pro-table
            ref="varietyTable"
            size="mini"
            border
            stripe
            row-key="VarietieName"
            :columns="varietyColumns"
            :datasource="varietyDatasource"
            :selection.sync="varietySelection"
            :toolkit="['columns', 'fullscreen']"
            :page-size="20"
            :page-sizes="[20, 40, 60, 90, 150]"
            height="50vh"
            highlight-current-row
            cache-key="EchVarRuleVarietyTable"
            @current-change="onVarietyCurrentChange"
            @row-dblclick="onVarietyRowDblclick"
            @sort-change="onVarietySortChange"
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

      <el-col :span="7">
        <div class="rule-panel-head">
          <span>科室</span>
          <span v-if="!currentVariety.VarietieName" class="rule-hint">请单击左侧品种行</span>
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
            height="50vh"
            cache-key="EchVarRuleDeptTable"
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

      <el-col :span="7">
        <div class="rule-panel-head">
          <span>供应商</span>
          <span v-if="!currentVariety.VarietieName" class="rule-hint">请单击左侧品种行</span>
        </div>
        <div v-loading="supplierLoading" class="rule-table-wrap">
          <ele-pro-table
            ref="supplierTable"
            size="mini"
            border
            stripe
            :columns="supplierColumns"
            :datasource="supplierDatasource"
            :selection.sync="supplierSelection"
            :toolkit="['columns', 'fullscreen']"
            :need-page="false"
            height="50vh"
            cache-key="EchVarRuleSupplierTable"
          >
            <template v-slot:toolbar>
              <el-button size="mini" type="success" icon="el-icon-download" @click="exportSupplierTable">
                导出
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printSupplierTable">
                打印
              </el-button>
            </template>
          </ele-pro-table>
        </div>
      </el-col>
    </el-row>

    <template v-slot:footer>
      <el-button @click="showSelectedVarieties">查看勾选品种</el-button>
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" @click="apply">展示统计视图</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import {
  getHospitalVarietieStatistics,
  getVarietieDeptList,
  getVarietieSupplierList
} from '@/api/Statistics/EchVar';
import { exportToExcel } from '@/utils/excel-util';
import {
  processHospitalVarietyRows,
  processLinkRows,
  printHtmlTable,
  VARIETY_TABLE_COLUMNS,
  DEPT_TABLE_COLUMNS,
  SUPPLIER_TABLE_COLUMNS
} from '../utils';

export default {
  name: 'EchVarRuleDialog',
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
      varietySearch: '',
      varietyLoading: false,
      deptLoading: false,
      supplierLoading: false,
      varietySelection: [],
      deptSelection: [],
      supplierSelection: [],
      currentVariety: { VarietieName: '', VarietieCode: '' },
      deptRows: [],
      supplierRows: [],
      hospitalMoney: 0,
      hospitalQty: 0,
      varietySort: { field: 'VarietieMoney', orderby: 'desc' },
      varietyColumns: VARIETY_TABLE_COLUMNS,
      deptColumns: DEPT_TABLE_COLUMNS,
      supplierColumns: SUPPLIER_TABLE_COLUMNS,
      exportVarietyRows: []
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
        if (v.currentVariety) {
          this.currentVariety = { ...v.currentVariety };
        }
      }
    }
  },
  methods: {
    beginOpenLoading() {
      this.varietyLoading = true;
      if (this.currentVariety.VarietieName) {
        this.deptLoading = true;
        this.supplierLoading = true;
      }
    },
    onOpen() {
      this.reloadVarietyTable();
      if (this.currentVariety.VarietieName) {
        this.loadLinkageTables(this.currentVariety.VarietieName);
      }
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
    parseSort(order) {
      const fieldMap = { VarietieMoney2: 'VarietieMoney' };
      const rawField = order?.sort || order?.prop || this.varietySort.field;
      const field = fieldMap[rawField] || rawField;
      const o = order?.order;
      let ord = this.varietySort.orderby;
      if (o === 'asc' || o === 'ascending') ord = 'asc';
      else if (o === 'desc' || o === 'descending') ord = 'desc';
      return { field, orderby: ord };
    },
    async varietyDatasource({ page, limit, order }) {
      if (!this.validateDate()) {
        this.varietyLoading = false;
        return { count: 0, list: [] };
      }
      this.varietyLoading = true;
      const sort = this.parseSort(order);
      this.varietySort = sort;
      try {
        const res = await getHospitalVarietieStatistics({
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          serachName: (this.varietySearch || '').trim(),
          page,
          size: limit,
          field: sort.field,
          orderby: sort.orderby
        });
        const list = processHospitalVarietyRows(res.result);
        if (list.length) {
          this.hospitalMoney = parseFloat(list[0].HospitalMoney) || 0;
          this.hospitalQty = parseFloat(list[0].HospitalQty) || 0;
        }
        if (page === 1) {
          this.exportVarietyRows = list;
          await this.syncVarietyLinkage(list);
        }
        return { count: res.total || 0, list };
      } catch (e) {
        Message.error(e.message || '加载品种失败');
        return { count: 0, list: [] };
      } finally {
        this.varietyLoading = false;
      }
    },
    deptDatasource() {
      return Promise.resolve({
        count: this.deptRows.length,
        list: this.deptRows
      });
    },
    supplierDatasource() {
      return Promise.resolve({
        count: this.supplierRows.length,
        list: this.supplierRows
      });
    },
    reloadVarietyTable() {
      this.$refs.varietyTable?.reload({ page: 1 });
    },
    reloadDeptTable() {
      this.$refs.deptTable?.reload({ page: 1 });
    },
    reloadSupplierTable() {
      this.$refs.supplierTable?.reload({ page: 1 });
    },
    onVarietySortChange({ prop, order }) {
      this.varietySort = this.parseSort({ sort: prop, order });
      this.reloadVarietyTable();
    },
    async syncVarietyLinkage(list) {
      await this.$nextTick();
      if (!list.length) {
        this.currentVariety = { VarietieName: '', VarietieCode: '' };
        this.deptRows = [];
        this.supplierRows = [];
        this.deptLoading = false;
        this.supplierLoading = false;
        this.reloadDeptTable();
        this.reloadSupplierTable();
        return;
      }
      const keep = list.find((r) => r.VarietieName === this.currentVariety.VarietieName);
      const target = keep || list[0];
      await this.selectVariety(target, true);
    },
    onVarietyCurrentChange(row) {
      if (!row || row.VarietieName === this.currentVariety.VarietieName) return;
      this.selectVariety(row, true);
    },
    onVarietyRowDblclick(row) {
      this.selectVariety(row, true);
    },
    selectVariety(row, highlight = true) {
      if (!row) return Promise.resolve();
      this.currentVariety = {
        VarietieName: row.VarietieName,
        VarietieCode: row.VarietieCode || row.VarietieID || ''
      };
      if (highlight) {
        this.$nextTick(() => {
          this.$refs.varietyTable?.setCurrentRow(row);
        });
      }
      return this.loadLinkageTables(row.VarietieName);
    },
    async loadLinkageTables(varietyName) {
      if (!varietyName || !this.validateDate()) {
        this.deptLoading = false;
        this.supplierLoading = false;
        return;
      }
      this.deptLoading = true;
      this.supplierLoading = true;
      try {
        const [deptRes, supplierRes] = await Promise.all([
          getVarietieDeptList({ varietieName: varietyName, year: this.form.date }),
          getVarietieSupplierList({ varietieName: varietyName, year: this.form.date })
        ]);
        this.deptRows = processLinkRows(deptRes.result);
        this.supplierRows = processLinkRows(supplierRes.result);
        this.deptSelection = [];
        this.supplierSelection = [];
        this.reloadDeptTable();
        this.reloadSupplierTable();
      } catch (e) {
        Message.error(e.message || '加载科室/供应商失败');
        this.deptRows = [];
        this.supplierRows = [];
        this.reloadDeptTable();
        this.reloadSupplierTable();
      } finally {
        this.deptLoading = false;
        this.supplierLoading = false;
      }
    },
    showSelectedVarieties() {
      const names = (this.varietySelection || []).map((r) => r.VarietieName);
      if (!names.length) {
        Message.warning('尚未勾选品种');
        return;
      }
      MessageBox.alert(names.join('、'), `查看勾选的品种名称（数量 ${names.length}）`, {
        confirmButtonText: '确定'
      });
    },
    exportVarietyTable() {
      if (!this.exportVarietyRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      exportToExcel(this.exportVarietyRows, this.varietyColumns, '品种统计列表');
      Message.success('导出成功');
    },
    exportDeptTable() {
      if (!this.deptRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      const name = this.currentVariety.VarietieName || '品种';
      exportToExcel(this.deptRows, this.deptColumns, `${name}-科室统计`);
      Message.success('导出成功');
    },
    exportSupplierTable() {
      if (!this.supplierRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      const name = this.currentVariety.VarietieName || '品种';
      exportToExcel(this.supplierRows, this.supplierColumns, `${name}-供应商统计`);
      Message.success('导出成功');
    },
    printVarietyTable() {
      if (!this.exportVarietyRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      printHtmlTable('品种统计列表', this.varietyColumns, this.exportVarietyRows);
    },
    printDeptTable() {
      if (!this.deptRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      const name = this.currentVariety.VarietieName || '品种';
      printHtmlTable(`${name}-科室统计`, this.deptColumns, this.deptRows);
    },
    printSupplierTable() {
      if (!this.supplierRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      const name = this.currentVariety.VarietieName || '品种';
      printHtmlTable(`${name}-供应商统计`, this.supplierColumns, this.supplierRows);
    },
    apply() {
      if (!this.validateDate()) return;
      const selectedVarieties = this.varietySelection.length
        ? [...this.varietySelection]
        : this.exportVarietyRows.slice(0, 5);
      if (!selectedVarieties.length) {
        Message.warning('请先加载并选择品种');
        return;
      }
      if (!this.currentVariety.VarietieName && selectedVarieties[0]) {
        this.currentVariety = {
          VarietieName: selectedVarieties[0].VarietieName,
          VarietieCode: selectedVarieties[0].VarietieCode || selectedVarieties[0].VarietieID || ''
        };
      }
      this.$emit('apply', {
        statisticsTime: this.form.statisticsTime,
        date: this.form.date,
        statYear: String(this.form.date).substring(0, 4),
        selectedVarieties,
        currentVariety: { ...this.currentVariety },
        selectedDepts: [...this.deptSelection],
        selectedSuppliers: [...this.supplierSelection],
        hospitalMoney: this.hospitalMoney,
        hospitalQty: this.hospitalQty,
        deptRows: [...this.deptRows],
        supplierRows: [...this.supplierRows]
      });
      this.innerVisible = false;
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
  min-height: 50vh;
}
</style>
