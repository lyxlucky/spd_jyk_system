<template>
  <div class="ele-body spd-page ech-var-page">
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
            <el-dropdown-item command="1">全院耗材使用占比</el-dropdown-item>
            <el-dropdown-item command="2">全院用量同比增长</el-dropdown-item>
            <el-dropdown-item command="3">科室使用占比</el-dropdown-item>
            <el-dropdown-item command="4">科室用量同比增长</el-dropdown-item>
            <el-dropdown-item command="5">供应商供应占比</el-dropdown-item>
            <el-dropdown-item command="6">供应商用量同比增长</el-dropdown-item>
            <el-dropdown-item divided command="all">导出全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="statDate" trigger="click" @command="handlePrintCommand">
          <el-button type="primary" size="mini" icon="el-icon-printer">
            打印图表<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">全院耗材使用占比</el-dropdown-item>
            <el-dropdown-item command="2">全院用量同比增长</el-dropdown-item>
            <el-dropdown-item command="3">科室使用占比</el-dropdown-item>
            <el-dropdown-item command="4">科室用量同比增长</el-dropdown-item>
            <el-dropdown-item command="5">供应商供应占比</el-dropdown-item>
            <el-dropdown-item command="6">供应商用量同比增长</el-dropdown-item>
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

    <el-row :gutter="8" class="chart-row">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[5]">
          <ele-chart
            ref="chart5"
            :option="chart5Option"
            :click="onChart5Click"
            :style="{ height: chartHeight }"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card" v-loading="chartLoading[6]">
          <ele-chart ref="chart6" :option="chart6Option" :style="{ height: chartHeight }" />
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
  getVarietieDeptList,
  getVarietieSupplierList,
  getConsumptionYear,
  getDeptConsumptionMonthYearVariety,
  getSingleSupplierConsumptionMonthYear
} from '@/api/Statistics/EchVar';
import {
  buildHospitalVarietyPieOption,
  buildConsumptionYearOption,
  buildVarietyDeptPieOption,
  buildVarietySupplierPieOption,
  buildYearCompareOption,
  buildCodeNameParam,
  parseMonthValues,
  processLinkRows,
  downloadChartImage,
  printChartImage
} from './utils';

const emptyPie = (title) => ({
  title: { text: title, left: 'center', textStyle: { fontSize: 14, color: '#909399' } },
  series: [{ type: 'pie', radius: '55%', data: [] }]
});

export default {
  name: 'EchVarStatistics',
  components: { EleChart, RuleDialog },
  data() {
    return {
      ruleVisible: false,
      chartHeight: 'calc((100vh - 240px) / 3)',
      statDate: '',
      statisticsTime: '0',
      statYear: String(new Date().getFullYear()),
      selectedVarieties: [],
      currentVariety: { VarietieName: '', VarietieCode: '' },
      deptRows: [],
      supplierRows: [],
      hospitalMoney: 0,
      chart1Option: emptyPie('全院耗材使用占比(金额)'),
      chart2Option: { title: { text: '全院用量同比增长情况(金额)', left: 'center' }, series: [] },
      chart3Option: emptyPie('科室使用占比(金额)'),
      chart4Option: { title: { text: '科室用量同比增长情况(金额)', left: 'center' }, series: [] },
      chart5Option: emptyPie('供应商供应占比(金额)'),
      chart6Option: { title: { text: '供应商用量同比增长情况(金额)', left: 'center' }, series: [] },
      chartLoading: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
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
        currentVariety: this.currentVariety
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
      this.selectedVarieties = config.selectedVarieties;
      this.currentVariety = config.currentVariety;
      this.deptRows = config.deptRows;
      this.supplierRows = config.supplierRows;
      this.hospitalMoney = config.hospitalMoney;

      this.chart1Option = buildHospitalVarietyPieOption(
        this.selectedVarieties,
        this.hospitalMoney,
        this.statDate
      );

      const varietyName = this.currentVariety.VarietieName;
      if (varietyName) {
        await Promise.all([
          this.loadChart2(varietyName),
          this.loadChart3(varietyName),
          this.loadChart5(varietyName)
        ]);
      }
    },
    async loadChart2(varietyName) {
      if (!varietyName) return;
      this.setChartLoading(2, true);
      try {
        const res = await getConsumptionYear({
          varietieName: varietyName,
          year: this.statYear
        });
        this.chart2Option = buildConsumptionYearOption(res.result);
      } catch (e) {
        Message.error(e.message || '加载全院用量趋势失败');
      } finally {
        this.setChartLoading(2, false);
      }
    },
    async loadChart3(varietyName) {
      if (!varietyName) return;
      this.setChartLoading(3, true);
      try {
        let rows = this.deptRows;
        if (!rows.length) {
          const res = await getVarietieDeptList({
            varietieName: varietyName,
            year: this.statDate
          });
          rows = processLinkRows(res.result);
          this.deptRows = rows;
        }
        this.chart3Option = buildVarietyDeptPieOption(varietyName, this.statDate, rows);
      } catch (e) {
        Message.error(e.message || '加载科室占比失败');
      } finally {
        this.setChartLoading(3, false);
      }
    },
    async loadChart5(varietyName) {
      if (!varietyName) return;
      this.setChartLoading(5, true);
      try {
        let rows = this.supplierRows;
        if (!rows.length) {
          const res = await getVarietieSupplierList({
            varietieName: varietyName,
            year: this.statDate
          });
          rows = processLinkRows(res.result);
          this.supplierRows = rows;
        }
        this.chart5Option = buildVarietySupplierPieOption(varietyName, this.statDate, rows);
      } catch (e) {
        Message.error(e.message || '加载供应商占比失败');
      } finally {
        this.setChartLoading(5, false);
      }
    },
    async loadChart4(varietyName, deptCode, deptName) {
      if (!varietyName || !deptCode) return;
      this.setChartLoading(4, true);
      const deptParam = buildCodeNameParam(deptCode, deptName);
      const prevYear = String(Number(this.statYear) - 1);
      try {
        const [prevRes, currRes] = await Promise.all([
          getDeptConsumptionMonthYearVariety({
            varietieName: varietyName,
            deptCode: deptParam,
            year: prevYear,
            startYear: prevYear
          }),
          getDeptConsumptionMonthYearVariety({
            varietieName: varietyName,
            deptCode: deptParam,
            year: this.statYear,
            startYear: this.statYear
          })
        ]);
        const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
        const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
        this.chart4Option = buildYearCompareOption(
          '科室用量同比增长情况(金额)',
          prevYear,
          this.statYear,
          prevData,
          currData
        );
      } catch (e) {
        Message.error(e.message || '加载科室对比图失败');
      } finally {
        this.setChartLoading(4, false);
      }
    },
    async loadChart6(varietyName, supplierCode, supplierName) {
      if (!varietyName || !supplierCode) return;
      this.setChartLoading(6, true);
      const supplierParam = buildCodeNameParam(supplierCode, supplierName);
      const prevYear = String(Number(this.statYear) - 1);
      try {
        const [prevRes, currRes] = await Promise.all([
          getSingleSupplierConsumptionMonthYear({
            varietieName: varietyName,
            supplierCode: supplierParam,
            year: prevYear,
            startYear: prevYear
          }),
          getSingleSupplierConsumptionMonthYear({
            varietieName: varietyName,
            supplierCode: supplierParam,
            year: this.statYear,
            startYear: this.statYear
          })
        ]);
        const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
        const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
        this.chart6Option = buildYearCompareOption(
          '供应商用量同比增长情况(金额)',
          prevYear,
          this.statYear,
          prevData,
          currData
        );
      } catch (e) {
        Message.error(e.message || '加载供应商对比图失败');
      } finally {
        this.setChartLoading(6, false);
      }
    },
    async onChart1Click(params) {
      const name = params?.data?.name;
      const code = params?.data?.code;
      if (!name || code === '0' || name === '其他品种') return;
      if (name === this.currentVariety.VarietieName) return;

      this.currentVariety = { VarietieName: name, VarietieCode: code };
      this.deptRows = [];
      this.supplierRows = [];
      await Promise.all([
        this.loadChart2(name),
        this.loadChart3(name),
        this.loadChart5(name)
      ]);
    },
    onChart3Click(params) {
      const code = params?.data?.code;
      const name = params?.data?.name;
      if (!code || !name || !this.currentVariety.VarietieName) return;
      this.loadChart4(this.currentVariety.VarietieName, code, name);
    },
    onChart5Click(params) {
      const code = params?.data?.code;
      const name = params?.data?.name;
      if (!code || !name || !this.currentVariety.VarietieName) return;
      this.loadChart6(this.currentVariety.VarietieName, code, name);
    },
    getChartRef(key) {
      return this.$refs[`chart${key}`];
    },
    getChartTitle(key) {
      const titles = {
        1: '全院耗材使用占比(金额)',
        2: '全院用量同比增长情况(金额)',
        3: `(${this.currentVariety.VarietieName || ''})科室使用占比(金额)`,
        4: '科室用量同比增长情况(金额)',
        5: `(${this.currentVariety.VarietieName || ''})供应商供应占比(金额)`,
        6: '供应商用量同比增长情况(金额)'
      };
      return titles[key] || '图表';
    },
    handleChartCommand(cmd) {
      if (cmd === 'all') {
        [1, 2, 3, 4, 5, 6].forEach((k) => this.exportChart(k));
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
.ech-var-page {
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
