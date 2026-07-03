<template>
  <div class="ele-body spd-page sup-statistics-page">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__body">
        <el-button type="primary" size="mini" icon="el-icon-setting" @click="ruleVisible = true">
          统计规则
        </el-button>
        <el-dropdown v-if="statDate" trigger="click" @command="handleChartCommand">
          <el-button type="success" size="mini" icon="el-icon-download">
            导出图表<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">供应商耗材金额</el-dropdown-item>
            <el-dropdown-item command="2">供应趋势图</el-dropdown-item>
            <el-dropdown-item command="3">消耗金额统计</el-dropdown-item>
            <el-dropdown-item command="4">年度对比</el-dropdown-item>
            <el-dropdown-item divided command="all">导出全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="statDate" trigger="click" @command="handlePrintCommand">
          <el-button type="primary" size="mini" icon="el-icon-printer">
            打印图表<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">供应商耗材金额</el-dropdown-item>
            <el-dropdown-item command="2">供应趋势图</el-dropdown-item>
            <el-dropdown-item command="3">消耗金额统计</el-dropdown-item>
            <el-dropdown-item command="4">年度对比</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-if="statDate" class="stat-meta">当前统计：{{ statDateLabel }}</span>
      </div>
    </div>

    <el-row :gutter="8" class="chart-row">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[1]">
          <ele-chart
            ref="chart1"
            :option="chart1Option"
            :click="onChart1Click"
            :style="{ height: chartHeight }"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[2]">
          <ele-chart ref="chart2" :option="chart2Option" :style="{ height: chartHeight }" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="8" class="chart-row">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[3]">
          <ele-chart
            ref="chart3"
            :option="chart3Option"
            :click="onChart3Click"
            :style="{ height: chartHeight }"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[4]">
          <ele-chart ref="chart4" :option="chart4Option" :style="{ height: chartHeight }" />
        </el-card>
      </el-col>
    </el-row>

    <rule-dialog :visible.sync="ruleVisible" :value="ruleForm" @apply="onRuleApply" />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import EleChart from 'ele-admin/packages/ele-chart';
import RuleDialog from './components/RuleDialog.vue';
import {
  getSupplierVarietieStatisticsByCode,
  getSupplierConsumptionMonthYearMulti,
  getSingleSupplierConsumptionMonthYear
} from '@/api/Statistics/SupStatistics';
import {
  buildSupplierPieOption,
  buildSupplierTrendOption,
  buildSupplierVarietyPieOption,
  buildYearCompareOption,
  buildSupplierCodeParam,
  buildMultiSupplierCodeParam,
  parseMonthValues,
  processVarietyRows,
  downloadChartImage,
  printChartImage
} from './utils';

const emptyPie = (title) => ({
  title: { text: title, left: 'center', textStyle: { fontSize: 14, color: '#909399' } },
  series: [{ type: 'pie', radius: '55%', data: [] }]
});

export default {
  name: 'SupStatistics',
  components: { EleChart, RuleDialog },
  data() {
    return {
      ruleVisible: false,
      chartHeight: 'calc((100vh - 200px) / 2)',
      statDate: '',
      statisticsTime: '0',
      statYear: String(new Date().getFullYear()),
      selectedSuppliers: [],
      currentSupplier: { SupplierCode: '', SupplierName: '' },
      selectedVarieties: [],
      varietyRows: [],
      varietySupplierCode: '',
      hospitalMoney: 0,
      chart1Option: emptyPie('供应商耗材金额'),
      chart2Option: { title: { text: '供应趋势图', left: 'center' }, series: [] },
      chart3Option: emptyPie('消耗金额统计'),
      chart4Option: { title: { text: '年度对比', left: 'center' }, series: [] },
      chartLoading: { 1: false, 2: false, 3: false, 4: false }
    };
  },
  computed: {
    statDateLabel() {
      if (!this.statDate) return '';
      return this.statisticsTime === '1' ? `${this.statDate}（按月）` : `${this.statDate}（按年）`;
    },
    ruleForm() {
      return {
        statisticsTime: this.statisticsTime,
        date: this.statDate || this.statYear,
        currentSupplier: this.currentSupplier
      };
    }
  },
  methods: {
    setChartLoading(key, loading) {
      this.chartLoading[key] = loading;
    },
    async onRuleApply(config) {
      this.statisticsTime = config.statisticsTime;
      this.statDate = config.date;
      this.statYear = config.statYear;
      this.selectedSuppliers = config.selectedSuppliers;
      this.currentSupplier = config.currentSupplier;
      this.selectedVarieties = config.selectedVarieties;
      this.varietyRows = config.varietyRows;
      this.varietySupplierCode = config.currentSupplier?.SupplierCode || '';
      this.hospitalMoney = config.hospitalMoney;

      this.chart1Option = buildSupplierPieOption(
        this.selectedSuppliers,
        this.hospitalMoney,
        this.statDate
      );

      await Promise.all([this.loadChart2(), this.loadChart3(), this.loadChart4Supplier()]);
    },
    async loadChart2() {
      const supplierCode = buildMultiSupplierCodeParam(this.selectedSuppliers);
      if (!supplierCode) return;
      this.setChartLoading(2, true);
      try {
        const res = await getSupplierConsumptionMonthYearMulti({
          supplierCode,
          year: this.statYear,
          startYear: this.statYear
        });
        this.chart2Option = buildSupplierTrendOption(res.result);
      } catch (e) {
        Message.error(e.message || '加载趋势图失败');
      } finally {
        this.setChartLoading(2, false);
      }
    },
    async loadChart3() {
      if (!this.currentSupplier.SupplierCode) return;
      this.setChartLoading(3, true);
      try {
        let rows = this.varietyRows;
        if (!rows.length || this.varietySupplierCode !== this.currentSupplier.SupplierCode) {
          const res = await getSupplierVarietieStatisticsByCode({
            supplierCode: this.currentSupplier.SupplierCode,
            statisticsTime: this.statisticsTime,
            date: this.statDate,
            statisticsType: this.statisticsTime
          });
          rows = processVarietyRows(res.result);
          this.varietyRows = rows;
          this.varietySupplierCode = this.currentSupplier.SupplierCode;
        }
        this.chart3Option = buildSupplierVarietyPieOption(
          this.currentSupplier.SupplierName,
          this.statDate,
          rows,
          this.selectedVarieties
        );
      } catch (e) {
        Message.error(e.message || '加载品种统计失败');
      } finally {
        this.setChartLoading(3, false);
      }
    },
    async loadChart4Supplier() {
      await this.loadChart4(this.currentSupplier, '其他耗材', true);
    },
    async loadChart4(supplier, varietieName, isSupplierLevel = false) {
      if (!supplier?.SupplierCode || supplier.SupplierCode === '0') return;
      const supplierParam = buildSupplierCodeParam(
        supplier.SupplierCode,
        supplier.SupplierName
      );
      const prevYear = String(Number(this.statYear) - 1);

      this.setChartLoading(4, true);
      try {
        if (isSupplierLevel || varietieName === '其他耗材') {
          const [prevRes, currRes] = await Promise.all([
            getSupplierConsumptionMonthYearMulti({
              supplierCode: supplierParam,
              year: prevYear,
              startYear: prevYear
            }),
            getSupplierConsumptionMonthYearMulti({
              supplierCode: supplierParam,
              year: this.statYear,
              startYear: this.statYear
            })
          ]);
          const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
          const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
          this.chart4Option = buildYearCompareOption(
            supplier.SupplierName,
            prevYear,
            this.statYear,
            prevData,
            currData
          );
        } else {
          const [prevRes, currRes] = await Promise.all([
            getSingleSupplierConsumptionMonthYear({
              varietieName,
              supplierCode: supplierParam,
              year: prevYear,
              startYear: prevYear
            }),
            getSingleSupplierConsumptionMonthYear({
              varietieName,
              supplierCode: supplierParam,
              year: this.statYear,
              startYear: this.statYear
            })
          ]);
          const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
          const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
          this.chart4Option = buildYearCompareOption(
            varietieName.substring(0, 10),
            prevYear,
            this.statYear,
            prevData,
            currData
          );
        }
      } catch (e) {
        Message.error(e.message || '加载对比图失败');
      } finally {
        this.setChartLoading(4, false);
      }
    },
    async onChart1Click(params) {
      const code = params?.data?.code;
      const name = params?.data?.name;
      if (!code || code === '0' || code === this.currentSupplier.SupplierCode) return;

      this.currentSupplier = { SupplierCode: code, SupplierName: name };
      this.selectedVarieties = [];
      this.varietySupplierCode = '';
      try {
        await this.loadChart3();
        await this.loadChart4Supplier();
      } catch (e) {
        Message.error(e.message || '切换供应商失败');
      }
    },
    onChart3Click(params) {
      const name = params?.data?.name;
      if (!name || !this.currentSupplier.SupplierCode) return;
      this.loadChart4(this.currentSupplier, name, name === '其他耗材');
    },
    getChartRef(key) {
      return this.$refs[`chart${key}`];
    },
    getChartTitle(key) {
      const titles = {
        1: '供应商耗材金额',
        2: '供应趋势图',
        3: `${this.currentSupplier.SupplierName || ''}消耗金额统计`,
        4: this.chart4Option?.title?.text || '年度对比'
      };
      return titles[key] || '图表';
    },
    handleChartCommand(cmd) {
      if (cmd === 'all') {
        [1, 2, 3, 4].forEach((k) => this.exportChart(k));
        return;
      }
      this.exportChart(Number(cmd));
    },
    handlePrintCommand(cmd) {
      this.printChart(Number(cmd));
    },
    exportChart(key) {
      const ref = this.getChartRef(key);
      if (!ref) return;
      const ok = downloadChartImage(ref, this.getChartTitle(key));
      if (ok) {
        Message.success('导出成功');
      } else {
        Message.warning('请先展示统计视图');
      }
    },
    printChart(key) {
      const ref = this.getChartRef(key);
      if (!ref) return;
      const ok = printChartImage(ref, this.getChartTitle(key));
      if (!ok) {
        Message.warning('请先展示统计视图');
      }
    }
  }
};
</script>

<style scoped>
.sup-statistics-page {
  padding-bottom: 8px;
}
.stat-meta {
  margin-left: 12px;
  font-size: 13px;
  color: #606266;
}
.chart-row {
  margin-bottom: 8px;
}
.chart-card :deep(.el-card__body) {
  padding: 8px;
}
</style>
