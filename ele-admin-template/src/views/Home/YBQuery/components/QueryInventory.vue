<template>
  <div class="yb-query-inventory">
    <YBQueryFilter ref="filter" @search="handleSearch" @export="handleExport" />
    <div class="yb-query-inventory-stats">
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
    <div class="yb-query-inventory-table">
      <ele-pro-table
        ref="table"
        class="data-table"
        size="mini"
        :toolbar="false"
        :toolkit="['columns', 'fullscreen']"
        height="calc(100vh - 320px)"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="inventoryColumns"
        :datasource="datasource"
        :selection.sync="selection"
        :initLoad="false"
      >
        <template #state="scope">
          <div :class="stateColorMap[scope.row.ybstate_cshpc]">{{
            stateMap[scope.row.ybstate_cshpc]
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
    inventoryColumns
  } from '../constants';
  import { GetYB3501List, ExportYB3501 } from '@/api/Home/YBQuery';
  import { handleCommonExport } from '../utils';
  export default {
    name: 'QueryInventory',
    components: {
      YBQueryFilter
    },
    data() {
      return {
        pageSize,
        pageSizes,
        stateMap,
        stateColorMap,
        inventoryColumns,
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
        return GetYB3501List({
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
        const res = await ExportYB3501({
          ...form,
          startTime: form.sendDateStart,
          endTime: form.sendDateEnd,
          ids: this.selection.map((item) => item.id)
        });
        this.$refs.filter.exportLoading = false;
        handleCommonExport(res);
      }
    }
  };
</script>
<style scoped lang="scss">
  .yb-query-inventory {
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
