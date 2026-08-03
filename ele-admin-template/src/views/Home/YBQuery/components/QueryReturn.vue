<template>
  <div class="yb-query-return">
    <YBQueryFilter ref="filter" @search="handleSearch" @export="handleExport" @print="handlePrint"/>
    <div class="yb-query-return-stats">
      <div
        >成功: <span class="success">{{ successCount }}</span></div
      >
      <div
        >失败: <span class="fail">{{ failCount }}</span></div
      >
      <div
        >总记录数: <span>{{ total }}</span></div
      >
    </div>
    <div class="yb-query-return-table">
      <ele-pro-table
        ref="table"
        class="data-table"
        size="mini"
        :toolbar="false"
        :toolkit="['columns', 'fullscreen']"
        height="calc(100vh - 320px)"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="returnColumns"
        :datasource="datasource"
        :selection.sync="selection"
        :initLoad="false"
      >
        <template #state="scope">
          <div :class="stateColorMap[scope.row.ybbj_pc]">{{
            stateMap[scope.row.ybbj_pc]
          }}</div>
        </template>
      </ele-pro-table>
    </div>
  </div>
</template>
<script>
  import YBQueryFilter from './Filter.vue';
  import {
    pageSize,
    pageSizes,
    stateMap,
    stateColorMap,
    returnColumns
  } from '../constants';
  import { GetYB3504List, ExportYB3504, PrintYBApiLog } from '@/api/Home/YBQuery';
  import { handleCommonExport } from '../utils';
  export default {
    name: 'QueryReturn',
    components: {
      YBQueryFilter
    },
    data() {
      return {
        pageSize,
        pageSizes,
        stateMap,
        stateColorMap,
        returnColumns,
        selection: [],
        successCount: 0,
        failCount: 0,
        total: 0
      };
    },
    mounted() {
      this.$refs.filter.handleSearch();
    },
    methods: {
      datasource({ page, limit, where }) {
        const {
          sendDateStart: startTime,
          sendDateEnd: endTime,
          deptName,
          varietieName,
          supplierName,
          state
        } = where;
        return GetYB3504List({
          page,
          size: limit,
          state,
          deptName,
          varietieName,
          supplierName,
          startTime,
          endTime
        })
          .then((res) => {
            this.successCount = res.successCount;
            this.failCount = res.failCount;
            this.total = res.total;
            return {
              count: res.total,
              list: res.result
            };
          })
          .catch((err) => {
            this.$message.error(err);
            return {
              count: 0,
              list: []
            };
          })
          .finally(() => {
            this.$refs.filter.queryLoading = false;
          });
      },
      handleSearch(form) {
        this.$refs.filter.queryLoading = true;
        this.$refs.table.reload({ page: 1, where: form });
      },
      async handleExport(form) {
        this.$refs.filter.exportLoading = true;
        const res = await ExportYB3504({
          ...form,
          startTime: form.sendDateStart,
          endTime: form.sendDateEnd,
          ids: this.selection.map((item) => item.his_id)
        });
        this.$refs.filter.exportLoading = false;
        handleCommonExport(res);
      },
      async handlePrint(form) {
        this.$refs.filter.printLoading = true;
        const res = await PrintYBApiLog({
          startTime: form.sendDateStart,
          endTime: form.sendDateEnd,
          type: '3504'
        });
        this.$refs.filter.printLoading = false;
        handleCommonExport(res);
      }
    }
  };
</script>
<style scoped lang="scss">
  .yb-query-return {
    padding: 12px 0;
    &-stats {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      div {
        padding: 0 6px;
      }
    }
  }
  .success {
    color: #059257;
  }
  .fail {
    color: #f56c6c;
  }
</style>
