<template>
  <div class="ele-body material-statistics">
    <el-card shadow="never">
      <p class="page-desc">
        说明:如果填写了环期时间系统只会显示环期有使用的品种,因为如果环期没有使用,金额为0是无法计算增幅的,排序增幅排序只有填写了环期时间才生效
      </p>
      <el-form
        size="small"
        inline
        class="filter-bar"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="科室方式">
          <el-select v-model="where.deptState" style="width: 100px">
            <el-option label="一级科室" value="1" />
            <el-option label="二级科室" value="2" />
            <el-option label="财务科室" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种方式">
          <el-select v-model="where.varState" style="width: 100px">
            <el-option label="品种编码" value="1" />
            <el-option label="品种名称" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="高值重点治理">
          <el-select
            v-model="where.HIGH_CLASS_XH"
            filterable
            style="width: 220px"
          >
            <el-option
              v-for="item in highClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
          <el-select v-model="where.timeState" style="width: 90px">
            <el-option label="自然日" value="1" />
            <el-option label="月结" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="where.orderState" style="width: 120px">
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
            v-permission="'export-MaterialStatistics-hcjjdc'"
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
        :page-size="30"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="MaterialStatistics"
      />
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { BACK_BASE_URL } from '@/config/setting';
import {
  getMaterialStatistics,
  excelMaterialStatistics
} from '@/api/Statistics/MaterialStatistics';
import {
  HIGH_CLASS_XH_OPTIONS,
  defaultMonthRanges,
  calcIncreaseAmount,
  formatHbZz,
  formatHighClassXh,
  buildDeptColumns
} from './utils';

export default {
  name: 'MaterialStatistics',
  data() {
    const ranges = defaultMonthRanges();
    return {
      highClassOptions: HIGH_CLASS_XH_OPTIONS,
      where: {
        deptState: '1',
        varState: '1',
        HIGH_CLASS_XH: '0',
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
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'HIGH_CLASS_XH',
          label: '高值重点治理序号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140,
          formatter: (row) => formatHighClassXh(row)
        },
        {
          prop: 'MAIN_QTY',
          label: '消耗数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'MAIN_PRICE',
          label: '消耗金额/元',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'HQ_QTY',
          label: '环期消耗数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'HQ_PRICE',
          label: '环期消耗金额/元',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'INCREASE_AMOUNT',
          label: '增幅金额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter: (row) => calcIncreaseAmount(row)
        },
        {
          prop: 'HB_ZZ',
          label: '环比增幅（%）',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row) => formatHbZz(row)
        },
        ...buildDeptColumns()
      ]
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 320px)';
    }
  },
  methods: {
    datasource({ page, limit, where }) {
      return getMaterialStatistics(where, page, limit).then((res) => ({
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
        const res = await excelMaterialStatistics(this.where);
        const url = `${BACK_BASE_URL}/Excel/files/${res.msg}`.replace('/undefined', '');
        window.open(url);
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
.page-desc {
  margin: 0 0 12px;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}
.filter-bar {
  margin-bottom: 12px;
}
</style>
