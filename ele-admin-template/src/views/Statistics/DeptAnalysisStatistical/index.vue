<template>
  <div class="ele-body dept-analysis-statistical">
    <el-card shadow="never">
      <div class="page-title">科室医用耗材支出情况</div>
      <el-form
        size="small"
        inline
        class="filter-bar"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="科室方式">
          <el-select v-model="where.deptState" style="width: 120px">
            <el-option label="一级科室" value="1" />
            <el-option label="二级科室" value="2" />
            <el-option label="财务科室" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否收费">
          <el-select v-model="where.IS_CHARGE" clearable style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期方式">
          <el-select v-model="where.timeState" style="width: 110px">
            <el-option label="自然日" value="1" />
            <el-option label="月结" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="where.orderState" style="width: 130px">
            <el-option label="金额" value="1" />
            <el-option label="环比增幅" value="2" />
            <el-option label="环比增幅金额" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="本期时间">
          <el-date-picker
            v-model="where.time1Range"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="环期时间">
          <el-date-picker
            v-model="where.time2Range"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button
            v-permission="'export-DeptAnalysisStatistical-tjfxdc'"
            type="primary"
            icon="el-icon-download"
            :loading="exporting"
            @click="exportExcel"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="where"
        :page-size="99999"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="DeptAnalysisStatistical"
      />
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getMaterialStatisticsDept } from '@/api/Statistics/DeptAnalysisStatistical';
import {
  defaultMonthRanges,
  calcIncreaseAmount,
  formatHbZz,
  calcHospitalRatio,
  exportDeptAnalysisExcel
} from './utils';

export default {
  name: 'DeptAnalysisStatistical',
  data() {
    const ranges = defaultMonthRanges();
    return {
      where: {
        deptState: '1',
        IS_CHARGE: '',
        timeState: '1',
        orderState: '1',
        time1Range: ranges.time1Range,
        time2Range: ranges.time2Range
      },
      exporting: false,
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'MAIN_PRICE',
          label: '金额(元)',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'HQ_PRICE',
          label: '环期金额(元)',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'INCREASE_AMOUNT',
          label: '增幅金额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (row) => calcIncreaseAmount(row)
        },
        {
          prop: 'HB_ZZ',
          label: '环比增幅%',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row) => formatHbZz(row)
        },
        {
          prop: 'HospitalInProportion',
          label: '占全院比%',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row) => calcHospitalRatio(row)
        }
      ]
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 280px)';
    }
  },
  methods: {
    datasource({ page, limit, where }) {
      return getMaterialStatisticsDept(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.where } });
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getMaterialStatisticsDept(this.where, 1, 9999999);
        exportDeptAnalysisExcel(res.result || []);
        Message.success('导出成功');
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
.page-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
.filter-bar {
  margin-bottom: 12px;
}
</style>
