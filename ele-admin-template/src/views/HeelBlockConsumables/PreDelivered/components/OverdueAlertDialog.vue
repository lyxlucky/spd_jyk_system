<template>
  <el-dialog
    title="未消耗提醒（超2周还在科室）"
    :visible.sync="innerVisible"
    width="980px"
    append-to-body
    custom-class="pre-delivered-overdue-dialog"
    @open="onOpen"
  >
    <div class="tip">
      按当前页面「订单时间」筛选：已审批、收货超2周、仍在预收货库且整单登记数为 0 的跟台单
      <span v-if="filteredList.length">（当前 {{ filteredList.length }} / 全部 {{ list.length }} 条）</span>
      。点击单号可填入搜索并定位。
    </div>
    <div class="handle-tip">
      说明：明细「登记数」≥1即不预警
    </div>
    <el-form size="mini" inline class="filter-bar" @submit.native.prevent>
      <el-form-item label="使用科室">
        <el-input
          v-model="filter.deptName"
          clearable
          placeholder="科室名称"
          style="width: 140px"
          @keyup.enter.native="applyFilter"
        />
      </el-form-item>
      <el-form-item label="关键词">
        <el-input
          v-model="filter.keyword"
          clearable
          placeholder="单号/病患/供应商/住院号"
          style="width: 200px"
          @keyup.enter.native="applyFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="applyFilter">筛选</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="pagedList"
      size="mini"
      border
      stripe
      max-height="380"
      row-class-name="overdue-row"
      @row-click="onRowClick"
    >
      <el-table-column type="index" width="50" align="center" :index="indexMethod" />
      <el-table-column label="收货单号" min-width="140" show-overflow-tooltip>
        <template v-slot="{ row }">
          <el-link type="primary" :underline="false" @click.stop="onRowClick(row)">
            {{ row.Delivery_Note_Number }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="Supplier_Name" label="供应商" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Hospitalization_Number" label="住院号" width="110" show-overflow-tooltip />
      <el-table-column prop="Patient" label="病患" width="90" show-overflow-tooltip />
      <el-table-column prop="Dept_Two_Name" label="使用科室" min-width="110" show-overflow-tooltip />
      <el-table-column label="收货时间" width="160" align="center">
        <template v-slot="{ row }">{{ fmtDateTime(row.Delivery_Time) }}</template>
      </el-table-column>
      <el-table-column prop="OverdueDays" label="超期天数" width="90" align="center" />
      <el-table-column prop="UnusedQty" label="未消耗数" width="90" align="center" />
      <el-table-column label="审批时间" width="160" align="center">
        <template v-slot="{ row }">{{ fmtDateTime(row.SBK_APPROVE_TIME) }}</template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        small
        layout="total, sizes, prev, pager, next"
        :total="filteredList.length"
        :page-size="pageSize"
        :page-sizes="[10, 30, 60, 100]"
        :current-page.sync="page"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="innerVisible = false">知道了</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { LoadOverdueApprovedDeliveryNumbers } from '@/api/HeelBlockConsumables/PreDelivered';

const OVERDUE_DAYS = 14;

export default {
  name: 'PreDeliveredOverdueAlertDialog',
  props: {
    visible: Boolean,
    dateFrom: { type: String, default: '' },
    dateTo: { type: String, default: '' },
    deptName: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      list: [],
      page: 1,
      pageSize: 10,
      filter: {
        deptName: '',
        keyword: ''
      }
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    filteredList() {
      const dept = (this.filter.deptName || '').trim().toLowerCase();
      const kw = (this.filter.keyword || '').trim().toLowerCase();
      return (this.list || []).filter((row) => {
        if (dept && !String(row.Dept_Two_Name || '').toLowerCase().includes(dept)) {
          return false;
        }
        if (!kw) return true;
        const blob = [
          row.Delivery_Note_Number,
          row.Supplier_Name,
          row.Hospitalization_Number,
          row.Patient,
          row.Dept_Two_Name
        ]
          .map((x) => String(x || '').toLowerCase())
          .join('|');
        return blob.includes(kw);
      });
    },
    pagedList() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    }
  },
  methods: {
    fmtDateTime(v) {
      if (!v) return '';
      return this.$util?.toDateString
        ? this.$util.toDateString(v, 'yyyy-MM-dd HH:mm:ss')
        : String(v).replace('T', ' ').substring(0, 19);
    },
    indexMethod(index) {
      return (this.page - 1) * this.pageSize + index + 1;
    },
    onPageChange(p) {
      this.page = p;
    },
    onSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
    },
    applyFilter() {
      this.page = 1;
    },
    resetFilter() {
      this.filter.deptName = this.deptName || '';
      this.filter.keyword = '';
      this.page = 1;
    },
    async onOpen() {
      this.resetFilter();
      await this.reload();
    },
    async reload() {
      this.loading = true;
      this.page = 1;
      try {
        const res = await LoadOverdueApprovedDeliveryNumbers({
          overdueDays: OVERDUE_DAYS,
          dateFrom: this.dateFrom || '',
          dateTo: this.dateTo || '',
          deptName: this.deptName || ''
        });
        this.list = res.result || [];
        this.$emit('loaded', this.list);
      } catch (e) {
        this.list = [];
        Message.error(e.message || '加载未消耗提醒失败');
      } finally {
        this.loading = false;
      }
    },
    onRowClick(row) {
      this.$emit('pick', row);
      this.innerVisible = false;
    }
  }
};
</script>

<style scoped>
.tip {
  margin-bottom: 6px;
  color: #c45656;
  font-size: 13px;
}
.handle-tip {
  margin-bottom: 10px;
  color: #909399;
  font-size: 12px;
}
.filter-bar {
  margin-bottom: 8px;
}
.pager-wrap {
  margin-top: 10px;
  text-align: right;
}
</style>

<style>
.pre-delivered-overdue-dialog .overdue-row > td {
  background-color: #e6a23c !important;
  color: #fff !important;
}
</style>
