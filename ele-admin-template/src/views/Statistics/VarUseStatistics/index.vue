<template>
  <div class="ele-body var-use-statistics">
    <el-card shadow="never" class="block-card">
      <el-row :gutter="12">
        <el-col :span="5">
          <div class="panel-title">一级科室列表</div>
          <el-form size="small" inline @submit.native.prevent>
            <el-form-item label="科室名称">
              <el-input
                v-model="deptSearch"
                clearable
                placeholder=""
                style="width: 120px"
                @keyup.enter.native="reloadDeptList"
              />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="reloadDeptList">
              查询
            </el-button>
          </el-form>
          <el-table
            v-loading="deptLoading"
            :data="deptRows"
            border
            stripe
            highlight-current-row
            height="400"
            size="small"
            @current-change="onDeptSelect"
          >
            <el-table-column prop="Dept_One_Name" label="一级科室名称" min-width="140" />
          </el-table>
        </el-col>

        <el-col :span="19">
          <div class="panel-title">品种</div>
          <el-form size="small" inline class="filter-bar" @submit.native.prevent>
            <el-select v-model="filters.heightOrLow" style="width: 90px">
              <el-option label="高值" value="1" />
              <el-option label="低值" value="0" />
              <el-option label="全部" value="2" />
            </el-select>
            <el-select v-model="filters.isProtect" style="width: 110px">
              <el-option label="非防疫物资" value="0" />
              <el-option label="防疫物资" value="1" />
              <el-option label="全部" value="2" />
            </el-select>
            <el-select v-model="filters.isVarName" style="width: 140px">
              <el-option label="按品种名称汇总" value="1" />
              <el-option label="按品种编码汇总" value="0" />
            </el-select>
            <el-select v-model="filters.orderVal" style="width: 110px">
              <el-option label="按金额排序" value="sumPrice" />
              <el-option label="按数量排序" value="sumNum" />
            </el-select>
            <span class="lbl">时间:</span>
            <el-date-picker
              v-model="filters.dateStart"
              type="month"
              value-format="yyyy-MM"
              placeholder="yyyy-mm"
              style="width: 120px"
            />
            <span>-</span>
            <el-date-picker
              v-model="filters.dateEnd"
              type="month"
              value-format="yyyy-MM"
              placeholder="yyyy-mm"
              style="width: 120px"
            />
            <el-button type="primary" icon="el-icon-search" @click="searchAll">查询</el-button>
          </el-form>
          <el-table
            v-loading="varLoading"
            :data="varRows"
            border
            stripe
            highlight-current-row
            height="400"
            size="small"
            @current-change="onVarSelect"
            @sort-change="onVarSort"
          >
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" min-width="100" sortable="custom" />
            <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="120" show-overflow-tooltip />
            <el-table-column prop="sumNum" label="用量" width="90" align="right" sortable="custom" />
            <el-table-column prop="sumPrice" label="金额" width="100" align="right" sortable="custom">
              <template slot-scope="{ row }">{{ fmtPrice2(row.sumPrice) }}</template>
            </el-table-column>
            <el-table-column label="环比上月" width="95" align="right">
              <template slot-scope="{ row }">{{ fmtHbPrc(row.HB_PRC) }}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="12" class="month-row">
      <el-col :span="12">
        <el-card shadow="never" class="block-card">
          <div class="panel-title">品种每月使用情况</div>
          <el-form size="small" inline @submit.native.prevent>
            <span class="lbl">数据显示:</span>
            <el-select v-model="varMonthlyShowAll" style="width: 140px" @change="loadVarMonthly">
              <el-option label="展示消耗月份" value="0" />
              <el-option label="展示全部月份" value="1" />
            </el-select>
            <el-button type="primary" icon="el-icon-search" size="small" @click="loadVarMonthly">
              查询
            </el-button>
          </el-form>
          <el-row :gutter="8">
            <el-col :span="14">
              <el-table
                v-loading="varMonthLoading"
                :data="varMonthRows"
                border
                stripe
                height="360"
                size="small"
              >
                <el-table-column prop="CONSUME_TIME" label="月份" width="80" />
                <el-table-column prop="sumNum" label="用量" width="80" align="right" />
                <el-table-column label="金额" width="90" align="right">
                  <template slot-scope="{ row }">{{ fmtPrice2(row.sumPrice) }}</template>
                </el-table-column>
                <el-table-column label="环比上月" width="90" align="right">
                  <template slot-scope="{ row }">{{ fmtHbPrc(row.HB_PRC) }}</template>
                </el-table-column>
                <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="90" show-overflow-tooltip />
                <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="100" show-overflow-tooltip />
                <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="100" show-overflow-tooltip />
              </el-table>
            </el-col>
            <el-col :span="10">
              <ele-chart :option="varChartOption" style="height: 360px" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never" class="block-card">
          <div class="panel-title">科室每月使用情况</div>
          <el-form size="small" inline @submit.native.prevent>
            <span class="lbl">数据显示:</span>
            <el-select v-model="deptMonthlyShowAll" style="width: 140px" @change="loadDeptMonthly">
              <el-option label="展示消耗月份" value="0" />
              <el-option label="展示全部月份" value="1" />
            </el-select>
            <el-button type="primary" icon="el-icon-search" size="small" @click="loadDeptMonthly">
              查询
            </el-button>
          </el-form>
          <el-row :gutter="8">
            <el-col :span="14">
              <el-table v-loading="deptMonthLoading" :data="deptMonthRows" border stripe height="360" size="small">
                <el-table-column label="一级科室名称" min-width="100">
                  <template>{{ selectedDeptName }}</template>
                </el-table-column>
                <el-table-column prop="CONSUME_TIME" label="月份" width="80" />
                <el-table-column prop="sumNum" label="用量" width="80" align="right" />
                <el-table-column label="金额" width="90" align="right">
                  <template slot-scope="{ row }">{{ fmtPrice2(row.sumPrice) }}</template>
                </el-table-column>
                <el-table-column label="环比上月" width="90" align="right">
                  <template slot-scope="{ row }">{{ fmtHbPrc(row.HB_PRC) }}</template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="10">
              <ele-chart :option="deptChartOption" style="height: 360px" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import EleChart from 'ele-admin/packages/ele-chart';
import {
  searchDeptOneTj,
  getConsumeTjAll,
  getConsumeTjLs,
  getDeptConsumeTjLs
} from '@/api/Statistics/VarUseStatistics';
import { fmtHbPrc, fmtPrice2, buildLineChartOption } from './utils';

export default {
  name: 'StatisticsVarUseStatistics',
  components: { EleChart },
  data() {
    return {
      deptSearch: '',
      deptRows: [],
      deptLoading: false,
      selectedDeptCode: '',
      selectedDeptName: '',
      selectedVarCode: '',
      selectedVarName: '',
      filters: {
        heightOrLow: '1',
        isProtect: '0',
        isVarName: '0',
        orderVal: 'sumPrice',
        dateStart: '',
        dateEnd: ''
      },
      varRows: [],
      varLoading: false,
      varMonthlyShowAll: '0',
      varMonthRows: [],
      varMonthLoading: false,
      varChartOption: buildLineChartOption(''),
      deptMonthlyShowAll: '0',
      deptMonthRows: [],
      deptMonthLoading: false,
      deptChartOption: buildLineChartOption('')
    };
  },
  created() {
    this.loadDeptList();
  },
  methods: {
    fmtHbPrc,
    fmtPrice2,
    requireDates() {
      if (!this.filters.dateStart || !this.filters.dateEnd) {
        Message.warning('请填写时间');
        return false;
      }
      return true;
    },
    commonParams(extra = {}) {
      return {
        ...this.filters,
        deptOneCode: this.selectedDeptCode,
        varCode: this.selectedVarCode,
        varName: this.selectedVarName,
        ...extra
      };
    },
    async loadDeptList() {
      this.deptLoading = true;
      try {
        const res = await searchDeptOneTj(this.deptSearch);
        this.deptRows = res.result || [];
      } catch (e) {
        Message.error(e.message || '加载科室失败');
        this.deptRows = [];
      } finally {
        this.deptLoading = false;
      }
    },
    reloadDeptList() {
      if (!this.requireDates()) return;
      this.loadDeptList();
    },
    onDeptSelect(row) {
      if (!row) return;
      this.selectedDeptCode = row.Dept_One_Code || '';
      this.selectedDeptName = row.Dept_One_Name || '';
      this.loadDeptMonthly();
      this.loadVarList();
    },
    onVarSelect(row) {
      if (!row) return;
      this.selectedVarCode = row.VARIETIE_CODE_NEW || '';
      this.selectedVarName = row.VARIETIE_NAME || '';
      this.loadVarMonthly();
    },
    onVarSort({ prop, order }) {
      if (!prop || !order) return;
      const dir = order === 'ascending' ? 1 : -1;
      this.varRows = [...this.varRows].sort((a, b) => {
        const av = Number(a[prop]);
        const bv = Number(b[prop]);
        if (!Number.isNaN(av) && !Number.isNaN(bv)) return (av - bv) * dir;
        return String(a[prop] || '').localeCompare(String(b[prop] || '')) * dir;
      });
    },
    searchAll() {
      if (!this.requireDates()) return;
      this.loadVarList();
      this.loadDeptMonthly();
    },
    async loadVarList() {
      if (!this.requireDates()) return;
      this.varLoading = true;
      try {
        const res = await getConsumeTjAll(this.commonParams());
        this.varRows = res.result || [];
      } catch (e) {
        Message.error(e.message || '加载品种失败');
        this.varRows = [];
      } finally {
        this.varLoading = false;
      }
    },
    async loadVarMonthly() {
      if (!this.requireDates()) return;
      if (!this.selectedVarCode && !this.selectedVarName) {
        this.varMonthRows = [];
        this.varChartOption = buildLineChartOption(this.selectedVarName);
        return;
      }
      this.varMonthLoading = true;
      try {
        const res = await getConsumeTjLs(
          this.commonParams({ isShowAll: this.varMonthlyShowAll })
        );
        this.varMonthRows = res.result || [];
        this.varChartOption = buildLineChartOption(this.selectedVarName, this.varMonthRows);
      } catch (e) {
        Message.error(e.message || '加载品种月度失败');
      } finally {
        this.varMonthLoading = false;
      }
    },
    async loadDeptMonthly() {
      if (!this.filters.dateStart || !this.filters.dateEnd) {
        this.deptMonthRows = [];
        this.deptChartOption = buildLineChartOption(this.selectedDeptName);
        return;
      }
      if (!this.selectedDeptName && !this.selectedDeptCode) {
        this.deptMonthRows = [];
        this.deptChartOption = buildLineChartOption('');
        return;
      }
      this.deptMonthLoading = true;
      try {
        const res = await getDeptConsumeTjLs(
          this.commonParams({ isShowAll: this.deptMonthlyShowAll })
        );
        this.deptMonthRows = res.result || [];
        this.deptChartOption = buildLineChartOption(this.selectedDeptName, this.deptMonthRows);
      } catch (e) {
        Message.error(e.message || '加载科室月度失败');
      } finally {
        this.deptMonthLoading = false;
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
.block-card {
  margin-bottom: 12px;
}
.month-row {
  margin-top: 0;
}
.filter-bar .lbl {
  margin: 0 4px;
  font-size: 13px;
  color: #606266;
}
</style>
