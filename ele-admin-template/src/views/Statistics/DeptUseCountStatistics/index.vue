<template>
  <div class="ele-body spd-page dept-use-count-statistics">
    <el-card shadow="never" class="block-card">
      <div class="panel-title">二级科室列表</div>
      <el-form size="small" inline class="filter-bar" @submit.native.prevent>
        <el-form-item label="科室名称">
          <el-input v-model="filters.deptTwoName" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchDeptOnly">查询</el-button>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filters.startDay"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            style="width: 130px"
          />
        </el-form-item>
        <span class="sep">-</span>
        <el-form-item>
          <el-date-picker
            v-model="filters.endDay"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchAll">查询</el-button>
        </el-form-item>
        <el-button
          v-permission="'export-DeptUseCountStatistics-1dc'"
          size="small"
          :loading="exporting === 1"
          @click="exportExcel(1)"
        >
          导出1
        </el-button>
        <el-button
          v-permission="'export-DeptUseCountStatistics-2dc'"
          size="small"
          :loading="exporting === 2"
          @click="exportExcel(2)"
        >
          导出2
        </el-button>
        <el-button
          v-permission="'export-DeptUseCountStatistics-3dc'"
          size="small"
          :loading="exporting === 3"
          @click="exportExcel(3)"
        >
          导出3
        </el-button>
        <el-button
          v-permission="'export-DeptUseCountStatistics-4dc'"
          size="small"
          :loading="exporting === 4"
          @click="exportExcel(4)"
        >
          导出4
        </el-button>
      </el-form>

      <el-row :gutter="8" class="table-row">
        <el-col :span="6">
          <div class="sub-title">科室排名</div>
          <ele-pro-table
            ref="deptTable"
            :height="tableHeight"
            :columns="deptColumns"
            :datasource="deptDatasource"
            :page-size="10"
            :page-sizes="[10, 20, 40, 60, 90, 150, 300]"
            highlight-current-row
            cache-key="DeptUseCountStatisticsDept"
            @current-change="onDeptSelect"
          />
        </el-col>
        <el-col :span="6">
          <div class="sub-title">科室月份</div>
          <ele-pro-table
            ref="monthTable"
            :height="tableHeight"
            :columns="monthColumns"
            :datasource="monthDatasource"
            :page-size="12"
            :page-sizes="[12, 24, 36, 60, 90, 150, 300]"
            highlight-current-row
            cache-key="DeptUseCountStatisticsMonth"
            @current-change="onMonthSelect"
          />
        </el-col>
        <el-col :span="6">
          <div class="sub-title">品种</div>
          <ele-pro-table
            ref="varietyTable"
            :height="tableHeight"
            :columns="varietyColumns"
            :datasource="varietyDatasource"
            :page-size="10"
            :page-sizes="[10, 20, 40, 60, 90, 150, 300]"
            highlight-current-row
            cache-key="DeptUseCountStatisticsVariety"
            @current-change="onVarietySelect"
          />
        </el-col>
        <el-col :span="6">
          <div class="sub-title">品种月份</div>
          <ele-pro-table
            ref="varietyMonthTable"
            :height="tableHeight"
            :columns="varietyMonthColumns"
            :datasource="varietyMonthDatasource"
            :page-size="12"
            :page-sizes="[12, 24, 36, 60, 90, 150, 300]"
            cache-key="DeptUseCountStatisticsVarietyMonth"
          />
        </el-col>
      </el-row>

      <div class="chart-section">
        <div class="section-title">统计图表</div>
        <el-row :gutter="16" class="chart-row">
          <el-col :span="12">
            <div class="chart-panel">
              <ele-chart :option="chartDeptPie" class="chart-box" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-panel">
              <ele-chart :option="chartDeptMonthBar" class="chart-box" />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="chart-row">
          <el-col :span="12">
            <div class="chart-panel">
              <ele-chart :option="chartVarietyPie" class="chart-box" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-panel">
              <ele-chart :option="chartVarietyMonthBar" class="chart-box" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import EleChart from 'ele-admin/packages/ele-chart';
import {
  deptUseCountStatistics,
  usedByDeptMonth,
  varUseByDeptOrMonth,
  varUseByDeptEvenTime
} from '@/api/Statistics/DeptUseCountStatistics';
import {
  defaultDateRange,
  fmtPriceWan,
  fmtRatio,
  exportAoA,
  buildDeptPieOption,
  buildDeptMonthBarOption,
  buildVarietyPieOption,
  buildVarietyMonthBarOption
} from './utils';

export default {
  name: 'DeptUseCountStatistics',
  components: { EleChart },
  data() {
    const dates = defaultDateRange();
    return {
      filters: {
        deptTwoName: '',
        startDay: dates.startDay,
        endDay: dates.endDay
      },
      selectedDeptCode: '',
      selectedDeptName: '',
      selectedMonth: '',
      selectedVarietyName: '',
      exporting: 0,
      tableHeight: 400,
      chartDeptPie: buildDeptPieOption([]),
      chartDeptMonthBar: buildDeptMonthBarOption('', []),
      chartVarietyPie: buildVarietyPieOption('', []),
      chartVarietyMonthBar: buildVarietyMonthBarOption('', []),
      deptColumns: [
        { type: 'index', label: '排名', width: 55, align: 'center' },
        { prop: 'DEPT_TWO_NAME', label: '科室列表', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'USE_PRICE',
          label: '金额/万',
          width: 90,
          align: 'right',
          formatter: (_r, _c, v) => fmtPriceWan(v)
        },
        {
          label: '占比%',
          width: 80,
          align: 'right',
          formatter: (row) => fmtRatio(row.USE_PRICE, row.SumPrice)
        }
      ],
      monthColumns: [
        { prop: 'DEPT_TWO_NAME', label: '科室名称', minWidth: 100, showOverflowTooltip: true },
        {
          prop: 'USE_PRICE',
          label: '金额/万',
          width: 90,
          align: 'right',
          formatter: (_r, _c, v) => fmtPriceWan(v)
        },
        { prop: 'MONTH_NUM', label: '月份', width: 90, align: 'right' }
      ],
      varietyColumns: [
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 120, showOverflowTooltip: true },
        { prop: 'USE_COUNT', label: '数量', width: 70, align: 'right' },
        {
          prop: 'USE_PRICE',
          label: '金额/万',
          width: 90,
          align: 'right',
          formatter: (_r, _c, v) => fmtPriceWan(v)
        }
      ],
      varietyMonthColumns: [
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 110, showOverflowTooltip: true },
        { prop: 'USE_COUNT', label: '数量', width: 70, align: 'right' },
        {
          prop: 'USE_PRICE',
          label: '金额/万',
          width: 80,
          align: 'right',
          formatter: (_r, _c, v) => fmtPriceWan(v)
        },
        { prop: 'OPEARTION_CHARGING_TIME', label: '使用月份', width: 90, align: 'right' }
      ]
    };
  },
  methods: {
    commonParams() {
      return {
        startDay: this.filters.startDay,
        endDay: this.filters.endDay
      };
    },
    deptDatasource({ page, limit }) {
      return deptUseCountStatistics(
        { ...this.commonParams(), deptTwoName: this.filters.deptTwoName },
        page,
        limit
      ).then((res) => {
        const list = res.result || [];
        this.chartDeptPie = buildDeptPieOption(list);
        return { count: res.total, list };
      });
    },
    monthDatasource({ page, limit }) {
      return usedByDeptMonth(
        {
          ...this.commonParams(),
          deptTwoCode: this.selectedDeptCode,
          deptTwoName: this.selectedDeptName
        },
        page,
        limit
      ).then((res) => {
        const list = res.result || [];
        this.chartDeptMonthBar = buildDeptMonthBarOption(this.selectedDeptName, list);
        return { count: res.total, list };
      });
    },
    varietyDatasource({ page, limit }) {
      return varUseByDeptOrMonth(
        {
          deptTwoCode: this.selectedDeptCode,
          monthNum: this.selectedMonth
        },
        page,
        limit
      ).then((res) => {
        const list = res.result || [];
        this.chartVarietyPie = buildVarietyPieOption(this.selectedDeptName, list);
        return { count: res.total, list };
      });
    },
    varietyMonthDatasource({ page, limit }) {
      return varUseByDeptEvenTime(
        {
          ...this.commonParams(),
          deptTwoCode: this.selectedDeptCode,
          varietieName: this.selectedVarietyName
        },
        page,
        limit
      ).then((res) => {
        const list = res.result || [];
        this.chartVarietyMonthBar = buildVarietyMonthBarOption(this.selectedVarietyName, list);
        return { count: res.total, list };
      });
    },
    searchDeptOnly() {
      this.$refs.deptTable.reload({ page: 1 });
    },
    searchAll() {
      this.searchDeptOnly();
      this.reloadMonth();
      this.reloadVariety();
      this.reloadVarietyMonth();
    },
    reloadMonth() {
      this.$refs.monthTable?.reload({ page: 1 });
    },
    reloadVariety() {
      this.$refs.varietyTable?.reload({ page: 1 });
    },
    reloadVarietyMonth() {
      this.$refs.varietyMonthTable?.reload({ page: 1 });
    },
    onDeptSelect(row) {
      if (!row) return;
      this.selectedDeptCode = row.DEPT_TWO_CODE || '';
      this.selectedDeptName = row.DEPT_TWO_NAME || '';
      this.selectedMonth = '';
      this.selectedVarietyName = '';
      this.reloadMonth();
      this.reloadVariety();
      this.reloadVarietyMonth();
    },
    onMonthSelect(row) {
      if (!row) return;
      this.selectedDeptCode = row.DEPT_TWO_CODE || this.selectedDeptCode;
      this.selectedMonth = row.MONTH_NUM || '';
      this.reloadVariety();
    },
    onVarietySelect(row) {
      if (!row) return;
      this.selectedVarietyName = row.VARIETIE_NAME || '';
      this.reloadVarietyMonth();
    },
    async exportExcel(type) {
      this.exporting = type;
      try {
        if (type === 1) {
          const res = await deptUseCountStatistics(
            { ...this.commonParams(), deptTwoName: this.filters.deptTwoName },
            1,
            999999
          );
          const rows = [['科室列表', '金额/万', '占比%']];
          (res.result || []).forEach((r) => {
            rows.push([
              r.DEPT_TWO_NAME,
              fmtPriceWan(r.USE_PRICE),
              fmtRatio(r.USE_PRICE, r.SumPrice)
            ]);
          });
          exportAoA('科室金额.xlsx', rows);
        } else if (type === 2) {
          const res = await usedByDeptMonth(
            {
              ...this.commonParams(),
              deptTwoCode: this.selectedDeptCode,
              deptTwoName: this.selectedDeptName
            },
            1,
            999999
          );
          const rows = [['科室名称', '金额/万', '月份']];
          (res.result || []).forEach((r) => {
            rows.push([r.DEPT_TWO_NAME, fmtPriceWan(r.USE_PRICE), r.MONTH_NUM]);
          });
          exportAoA('科室月份金额.xlsx', rows);
        } else if (type === 3) {
          const res = await varUseByDeptOrMonth(
            {
              deptTwoCode: this.selectedDeptCode,
              monthNum: this.selectedMonth
            },
            1,
            999999
          );
          const rows = [['品种名称', '数量', '金额/万']];
          (res.result || []).forEach((r) => {
            rows.push([r.VARIETIE_NAME, r.USE_COUNT, fmtPriceWan(r.USE_PRICE)]);
          });
          exportAoA('品种金额.xlsx', rows);
        } else {
          const res = await varUseByDeptEvenTime(
            {
              ...this.commonParams(),
              deptTwoCode: this.selectedDeptCode,
              varietieName: this.selectedVarietyName
            },
            1,
            999999
          );
          const rows = [['品种名称', '数量', '金额/万', '使用月份']];
          (res.result || []).forEach((r) => {
            rows.push([
              r.VARIETIE_NAME,
              r.USE_COUNT,
              fmtPriceWan(r.USE_PRICE),
              r.OPEARTION_CHARGING_TIME
            ]);
          });
          exportAoA('品种月份金额.xlsx', rows);
        }
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = 0;
      }
    }
  }
};
</script>

<style scoped>
.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.sub-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}
.filter-bar .sep {
  margin: 0 4px;
  line-height: 32px;
  color: #606266;
}
.table-row {
  margin-bottom: 12px;
}
.chart-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}
.chart-row + .chart-row {
  margin-top: 16px;
}
.chart-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fafafa;
  padding: 10px 8px 6px;
  box-sizing: border-box;
}
.chart-box {
  height: 400px;
}
.block-card {
  margin-bottom: 12px;
}
</style>
