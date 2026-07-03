<template>
  <div class="ele-body spd-page dept-statistics-page">
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
            <el-dropdown-item command="1">科室耗材使用</el-dropdown-item>
            <el-dropdown-item command="2">科室使用趋势</el-dropdown-item>
            <el-dropdown-item command="3">科室消耗金额</el-dropdown-item>
            <el-dropdown-item command="4">年度对比</el-dropdown-item>
            <el-dropdown-item divided command="all">导出全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="statDate" trigger="click" @command="handlePrintCommand">
          <el-button type="primary" size="mini" icon="el-icon-printer">
            打印图表<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">科室耗材使用</el-dropdown-item>
            <el-dropdown-item command="2">科室使用趋势</el-dropdown-item>
            <el-dropdown-item command="3">科室消耗金额</el-dropdown-item>
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
          <ele-chart
            ref="chart2"
            :option="chart2Option"
            :style="{ height: chartHeight }"
          />
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
          <ele-chart
            ref="chart4"
            :option="chart4Option"
            :style="{ height: chartHeight }"
          />
        </el-card>
      </el-col>
    </el-row>

    <rule-dialog
      :visible.sync="ruleVisible"
      :value="ruleForm"
      @apply="onRuleApply"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui';
import EleChart from 'ele-admin/packages/ele-chart';
import RuleDialog from './components/RuleDialog.vue';
import {
  getDeptVarietieStatisticsByDept,
  getDeptConsumptionMonthYearMulti,
  getDeptConsumptionMonthYearVariety
} from '@/api/Statistics/DeptStatistics';
import {
  buildDeptPieOption,
  buildDeptTrendOption,
  buildVarietyPieOption,
  buildYearCompareOption,
  buildDeptCodeParam,
  buildMultiDeptCodeParam,
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
  name: 'DeptStatistics',
  components: { EleChart, RuleDialog },
  data() {
    return {
      ruleVisible: false,
      chartHeight: 'calc((100vh - 200px) / 2)',
      statDate: '',
      statisticsTime: '0',
      statYear: String(new Date().getFullYear()),
      selectedDepts: [],
      currentDept: { DeptCode: '', DeptName: '' },
      selectedVarieties: [],
      varietyRows: [],
      varietyDeptCode: '',
      hospitalMoney: 0,
      chart1Option: emptyPie('科室耗材使用'),
      chart2Option: { title: { text: '科室耗材使用趋势图', left: 'center' }, series: [] },
      chart3Option: emptyPie('科室消耗金额统计'),
      chart4Option: { title: { text: '年度对比', left: 'center' }, series: [] },
      chart4VarietyName: '其他耗材',
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
        currentDept: this.currentDept
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
      this.selectedDepts = config.selectedDepts;
      this.currentDept = config.currentDept;
      this.selectedVarieties = config.selectedVarieties;
      this.varietyRows = config.varietyRows;
      this.varietyDeptCode = config.currentDept?.DeptCode || '';
      this.hospitalMoney = config.hospitalMoney;
      this.chart4VarietyName = '其他耗材';

      this.chart1Option = buildDeptPieOption(
        this.selectedDepts,
        this.hospitalMoney,
        this.statDate
      );

      await Promise.all([
        this.loadChart2(),
        this.loadChart3(),
        this.loadChart4Dept()
      ]);
    },
    async loadChart2() {
      const deptCode = buildMultiDeptCodeParam(this.selectedDepts);
      if (!deptCode) return;
      this.setChartLoading(2, true);
      try {
        const res = await getDeptConsumptionMonthYearMulti({
          deptCode,
          year: this.statYear,
          startYear: this.statYear
        });
        this.chart2Option = buildDeptTrendOption(res.result);
      } catch (e) {
        Message.error(e.message || '加载趋势图失败');
      } finally {
        this.setChartLoading(2, false);
      }
    },
    async loadChart3() {
      if (!this.currentDept.DeptCode) return;
      this.setChartLoading(3, true);
      try {
        let rows = this.varietyRows;
        if (!rows.length || this.varietyDeptCode !== this.currentDept.DeptCode) {
          const res = await getDeptVarietieStatisticsByDept({
            deptCode: this.currentDept.DeptCode,
            statisticsTime: this.statisticsTime,
            date: this.statDate,
            statisticsType: this.statisticsTime
          });
          rows = processVarietyRows(res.result);
          this.varietyRows = rows;
          this.varietyDeptCode = this.currentDept.DeptCode;
        }
        this.chart3Option = buildVarietyPieOption(
          this.currentDept.DeptName,
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
    async loadChart4Dept() {
      await this.loadChart4(this.currentDept, '其他耗材', true);
    },
    async loadChart4(dept, varietieName, isDeptLevel = false) {
      if (!dept?.DeptCode || dept.DeptCode === '0') return;
      const deptParam = buildDeptCodeParam(dept.DeptCode, dept.DeptName);
      const prevYear = String(Number(this.statYear) - 1);
      this.chart4VarietyName = varietieName || '其他耗材';

      this.setChartLoading(4, true);
      try {
        if (isDeptLevel || varietieName === '其他耗材') {
          const [prevRes, currRes] = await Promise.all([
            getDeptConsumptionMonthYearMulti({
              deptCode: deptParam,
              year: prevYear,
              startYear: this.statYear
            }),
            getDeptConsumptionMonthYearMulti({
              deptCode: deptParam,
              year: this.statYear,
              startYear: prevYear
            })
          ]);
          const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
          const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
          this.chart4Option = buildYearCompareOption(
            `${dept.DeptName}${varietieName || ''}`,
            prevYear,
            this.statYear,
            prevData,
            currData
          );
        } else {
          const [prevRes, currRes] = await Promise.all([
            getDeptConsumptionMonthYearVariety({
              varietieName,
              deptCode: deptParam,
              year: prevYear,
              startYear: prevYear
            }),
            getDeptConsumptionMonthYearVariety({
              varietieName,
              deptCode: deptParam,
              year: this.statYear,
              startYear: this.statYear
            })
          ]);
          const prevData = parseMonthValues(prevRes.result?.[0]?.AllManthMoney);
          const currData = parseMonthValues(currRes.result?.[0]?.AllManthMoney);
          this.chart4Option = buildYearCompareOption(
            `${dept.DeptName}${varietieName}`,
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
      if (!code || code === '0' || code === this.currentDept.DeptCode) return;

      this.currentDept = { DeptCode: code, DeptName: name };
      this.selectedVarieties = [];
      this.varietyDeptCode = '';
      try {
        await this.loadChart3();
        await this.loadChart4Dept();
      } catch (e) {
        Message.error(e.message || '切换科室失败');
      }
    },
    onChart3Click(params) {
      const name = params?.data?.name;
      if (!name || !this.currentDept.DeptCode) return;
      this.loadChart4(this.currentDept, name, name === '其他耗材');
    },
    getChartRef(key) {
      const map = {
        1: 'chart1',
        2: 'chart2',
        3: 'chart3',
        4: 'chart4'
      };
      return this.$refs[map[key]];
    },
    getChartTitle(key) {
      const titles = {
        1: '科室耗材使用',
        2: '科室耗材使用趋势图',
        3: `${this.currentDept.DeptName || ''}消耗金额统计`,
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
.dept-statistics-page {
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
