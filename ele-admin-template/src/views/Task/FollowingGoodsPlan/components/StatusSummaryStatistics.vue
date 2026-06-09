<template>
  <div>
    <el-card>
      <div slot="header">状态汇总统计</div>
      <div>
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-date-picker
              v-model="dateRange[0]"
              type="date"
              placeholder="yyyy-MM-dd"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dateRange[1]"
              type="date"
              placeholder="yyyy-MM-dd"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryToday">查询当天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryLast30Days">查询近30天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="localStorageId"
              placeholder="全院"
              clearable
              style="width: 120px"
              @change="onStorageChange"
            >
              <el-option label="全院" value="" />
              <el-option
                v-for="item in storageList"
                :key="item.ID"
                :label="item.NAME"
                :value="String(item.ID)"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <ele-pro-table
          size="mini"
          ref="summaryTable"
          height="250px"
          :columns="summaryColumns"
          highlight-current-row
          :datasource="summaryDatasource"
          cache-key="followingGoodsPlanSummaryTable"
          :paging="false"
          @row-click="handleRowClick"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getStockUpStateList,
  getStorageList
} from '@/api/Task/FollowingGoodsPlan';

export default {
  name: 'StatusSummaryStatistics',
  props: {
    storageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateRange: ['', ''],
      localStorageId: '',
      storageList: [],
      summaryColumns: [
        {
          label: '订单状态',
          prop: 'ORDER_STATE',
          align: 'center',
          width: '120px',
          formatter: (row) => {
            const map = {
              '0': '未发送(SPD)',
              '1': '已发送(SPD)',
              '2': '已查看(B2B)',
              '3': '处理中(B2B)',
              '4': '部分送货(B2B)',
              '5': '全部送货(B2B)',
              '6': '部分收货(SPD)',
              '7': '全部收货(SPD)',
              '8': '强制结束(SPD)',
              '': '全部'
            };
            return map[row.ORDER_STATE] || '未知';
          }
        },
        {
          label: '合计品种数',
          prop: 'VARIETIE_CODE_NUM',
          align: 'center'
        },
        {
          label: '计划单数',
          prop: 'STOCKUP_NUM',
          align: 'center'
        }
      ]
    };
  },
  watch: {
    storageId(val) {
      this.localStorageId = val || '';
    }
  },
  mounted() {
    this.localStorageId = this.storageId || '';
    this.loadStorageList();
  },
  methods: {
    loadStorageList() {
      getStorageList()
        .then((res) => {
          const data = res.data;
          if (data.code === '200' || data.code === 200) {
            this.storageList = data.result || [];
          }
        })
        .catch(() => {});
    },
    onStorageChange(val) {
      this.$emit('storage-change', val || '');
      this.handleSearch();
    },
    handleRowClick(row) {
      this.$emit('onClickRow', row);
    },
    queryToday() {
      const today = new Date();
      const formattedDate =
        today.getFullYear() +
        '-' +
        String(today.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(today.getDate()).padStart(2, '0');
      this.dateRange = [formattedDate, formattedDate];
      this.handleSearch();
    },
    queryLast30Days() {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 29);
      const fmt = (d) =>
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0');
      this.dateRange = [fmt(thirtyDaysAgo), fmt(today)];
      this.handleSearch();
    },
    handleSearch() {
      this.$refs.summaryTable.reload({ page: 1 });
    },
    summaryDatasource({ sort, where }) {
      return getStockUpStateList({
        page: 1,
        limit: 9999,
        sort,
        where: {
          ...where,
          start_time: this.dateRange[0],
          end_time: this.dateRange[1],
          STORAGE_ID: this.localStorageId
        }
      })
        .then((res) => {
          const data = res.data;
          if (data.code === '200') {
            return { count: data.total, list: data.result };
          }
          return { count: 0, list: [] };
        })
        .catch(() => ({ count: 0, list: [] }));
    }
  }
};
</script>
