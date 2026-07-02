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
          <span>供应商</span>
          <el-select v-model="form.statisticsTime" size="mini" style="width: 110px" @change="loadSupplierList">
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
            @change="loadSupplierList"
          />
          <el-date-picker
            v-else
            v-model="form.date"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="YYYY-MM"
            style="width: 130px"
            @change="loadSupplierList"
          />
          <el-input
            v-model="supplierSearch"
            size="mini"
            clearable
            placeholder="搜索供应商"
            style="width: 130px"
            @input="filterSupplierRows"
          />
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
            height="52vh"
            highlight-current-row
            cache-key="SupStatisticsRuleSupplierTable"
            @current-change="onSupplierCurrentChange"
            @row-dblclick="onSupplierRowDblclick"
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

      <el-col :span="12">
        <div class="rule-panel-head">
          <span>{{ currentSupplier.SupplierName || '供应商' }}-品种</span>
          <span v-if="!currentSupplier.SupplierCode" class="rule-hint">请单击左侧供应商行</span>
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
            cache-key="SupStatisticsRuleVarietyTable"
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
  getSupplierVarietieStatisticsAll,
  getSupplierVarietieStatisticsByCode
} from '@/api/Statistics/SupStatistics';
import { exportToExcel } from '@/utils/excel-util';
import {
  processSupplierRows,
  processVarietyRows,
  printHtmlTable,
  SUPPLIER_TABLE_COLUMNS,
  SUP_VARIETY_TABLE_COLUMNS
} from '../utils';

export default {
  name: 'SupStatisticsRuleDialog',
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
      supplierSearch: '',
      varietySearch: '',
      supplierLoading: false,
      varietyLoading: false,
      supplierRows: [],
      filteredSupplierRows: [],
      varietyRows: [],
      filteredVarietyRows: [],
      supplierSelection: [],
      varietySelection: [],
      currentSupplier: { SupplierCode: '', SupplierName: '' },
      hospitalMoney: 0,
      hospitalQty: 0,
      supplierColumns: SUPPLIER_TABLE_COLUMNS,
      varietyColumns: SUP_VARIETY_TABLE_COLUMNS
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
        if (v.currentSupplier) {
          this.currentSupplier = { ...v.currentSupplier };
        }
      }
    }
  },
  methods: {
    beginOpenLoading() {
      if (!this.supplierRows.length) {
        this.supplierLoading = true;
        this.varietyLoading = true;
        return;
      }
      if (this.currentSupplier.SupplierCode) {
        this.varietyLoading = true;
      }
    },
    async onOpen() {
      if (this.supplierRows.length === 0) {
        await this.loadSupplierList();
        return;
      }
      if (this.currentSupplier.SupplierCode) {
        await this.loadVarietyList(this.currentSupplier.SupplierCode);
        this.highlightSupplierRow(this.currentSupplier.SupplierCode);
      }
    },
    supplierDatasource() {
      return Promise.resolve({
        count: this.filteredSupplierRows.length,
        list: this.filteredSupplierRows
      });
    },
    varietyDatasource() {
      return Promise.resolve({
        count: this.filteredVarietyRows.length,
        list: this.filteredVarietyRows
      });
    },
    reloadSupplierTable() {
      this.$refs.supplierTable?.reload({ page: 1 });
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
    async loadSupplierList() {
      if (!this.validateDate()) {
        this.supplierLoading = false;
        this.varietyLoading = false;
        return;
      }
      this.supplierLoading = true;
      try {
        const res = await getSupplierVarietieStatisticsAll({
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          statisticsType: this.form.statisticsTime
        });
        this.supplierRows = processSupplierRows(res.result);
        this.filteredSupplierRows = [...this.supplierRows];
        if (this.supplierRows.length) {
          this.hospitalMoney = parseFloat(this.supplierRows[0].HospitalMoney) || 0;
          this.hospitalQty = parseFloat(this.supplierRows[0].HospitalQty) || 0;
        }
        this.filterSupplierRows();
        await this.syncSupplierLinkage();
      } catch (e) {
        Message.error(e.message || '加载供应商失败');
        this.supplierRows = [];
        this.filteredSupplierRows = [];
        this.varietyLoading = false;
        this.reloadSupplierTable();
      } finally {
        this.supplierLoading = false;
      }
    },
    filterSupplierRows() {
      const kw = (this.supplierSearch || '').trim();
      if (!kw) {
        this.filteredSupplierRows = [...this.supplierRows];
      } else {
        const reg = new RegExp(kw, 'i');
        this.filteredSupplierRows = this.supplierRows.filter(
          (r) => reg.test(r.SupplierName) || reg.test(r.SupplierCode)
        );
      }
      this.reloadSupplierTable();
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
      this.reloadVarietyTable();
      this.$nextTick(() => {
        matched.forEach((row) => {
          this.$refs.varietyTable?.$refs?.table?.toggleRowSelection(row, true);
        });
      });
    },
    highlightSupplierRow(supplierCode) {
      this.$nextTick(() => {
        const row = this.filteredSupplierRows.find((r) => r.SupplierCode === supplierCode);
        if (row) {
          this.$refs.supplierTable?.setCurrentRow(row);
        }
      });
    },
    async syncSupplierLinkage() {
      await this.$nextTick();
      if (!this.filteredSupplierRows.length) {
        this.currentSupplier = { SupplierCode: '', SupplierName: '' };
        this.varietyRows = [];
        this.filteredVarietyRows = [];
        this.varietyLoading = false;
        this.reloadVarietyTable();
        return;
      }
      const keep = this.filteredSupplierRows.find(
        (r) => r.SupplierCode === this.currentSupplier.SupplierCode
      );
      const target = keep || this.filteredSupplierRows[0];
      await this.selectSupplier(target, true);
    },
    onSupplierCurrentChange(row) {
      if (!row || row.SupplierCode === this.currentSupplier.SupplierCode) return;
      this.selectSupplier(row, false);
    },
    onSupplierRowDblclick(row) {
      this.selectSupplier(row, true);
    },
    selectSupplier(row, highlight = true) {
      if (!row) return Promise.resolve();
      this.currentSupplier = {
        SupplierCode: row.SupplierCode,
        SupplierName: row.SupplierName
      };
      if (highlight) {
        this.highlightSupplierRow(row.SupplierCode);
      }
      return this.loadVarietyList(row.SupplierCode);
    },
    async loadVarietyList(supplierCode) {
      if (!supplierCode || !this.validateDate()) {
        this.varietyLoading = false;
        return;
      }
      this.varietyLoading = true;
      try {
        const res = await getSupplierVarietieStatisticsByCode({
          supplierCode,
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
    exportSupplierTable() {
      if (!this.filteredSupplierRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      exportToExcel(this.filteredSupplierRows, this.supplierColumns, '供应商统计列表');
      Message.success('导出成功');
    },
    exportVarietyTable() {
      if (!this.filteredVarietyRows.length) {
        Message.warning('没有数据可导出');
        return;
      }
      const name = this.currentSupplier.SupplierName || '供应商';
      exportToExcel(this.filteredVarietyRows, this.varietyColumns, `${name}品种统计`);
      Message.success('导出成功');
    },
    printSupplierTable() {
      if (!this.filteredSupplierRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      printHtmlTable('供应商统计列表', this.supplierColumns, this.filteredSupplierRows);
    },
    printVarietyTable() {
      if (!this.filteredVarietyRows.length) {
        Message.warning('没有数据可打印');
        return;
      }
      const name = this.currentSupplier.SupplierName || '供应商';
      printHtmlTable(`${name}品种统计`, this.varietyColumns, this.filteredVarietyRows);
    },
    apply() {
      if (!this.validateDate()) return;
      const selectedSuppliers = this.supplierSelection.length
        ? [...this.supplierSelection]
        : this.supplierRows.slice(0, 5);
      if (!selectedSuppliers.length) {
        Message.warning('请先加载并选择供应商');
        return;
      }
      if (!this.currentSupplier.SupplierCode && selectedSuppliers[0]) {
        this.currentSupplier = {
          SupplierCode: selectedSuppliers[0].SupplierCode,
          SupplierName: selectedSuppliers[0].SupplierName
        };
      }
      const applyFn = async () => {
        if (this.currentSupplier.SupplierCode) {
          await this.loadVarietyList(this.currentSupplier.SupplierCode);
        }
        this.$emit('apply', {
          statisticsTime: this.form.statisticsTime,
          date: this.form.date,
          statYear: String(this.form.date).substring(0, 4),
          selectedSuppliers,
          currentSupplier: { ...this.currentSupplier },
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
