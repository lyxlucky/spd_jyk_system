<template lang="">
  <div>
    <EbsPayablePendingTopTableSearch
      @handlePushPayablePending="handlePushPayablePending"
      :selection="selection"
    />
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.IFACE_ID"
      @current-change="onCurrentChange"
      @selection-change="onSelectionChange"
      ref="table"
      height="30vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="EbsPayablePendingTopTableCacheKey"
      key="EbsPayablePendingTopTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import {
    listEbsPayablePending,
    PushEbsPayablePendingList
  } from '@/api/Settle/EbsPayablePending';
  import EbsPayablePendingTopTableSearch from './EbsPayablePendingTopTableSearch.vue';
  export default {
    name: 'EbsPayablePendingTopTable',
    components: {
      EbsPayablePendingTopTableSearch
    },
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center'
          },
          {
            label: '序',
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_TYPE',
            label: '业务类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'LEDGER_NAME',
            label: '账簿',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'COM_CODE',
            label: '院区',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.COM_CODE == 100) return '西直门';
              if (row.COM_CODE == 103) return '通州';
            }
          },
          {
            prop: 'SYNC_DATE',
            label: '同步日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'PROCESS_FLAG',
            label: '处理状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'PROCESS_DATE',
            label: '处理日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'ERROR_MESSAGE',
            label: '错误消息',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'DESCRIPTION',
            label: '描述',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ],
        toolbar: false,
        pageSize: 20,
        pageSizes: [10, 20, 40, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = listEbsPayablePending({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.data.total,
              list: res.data.data
            };
            return tData;
          }
        );
        return data;
      },
      onCurrentChange(current) {
        this.$bus.$emit('EbsPayablePendingTopTableCurrentChange', current);
        this.current = current;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      handlePushPayablePending() {
        if (this.selection.some((item) => item.PROCESS_FLAG == 'Y')) {
          return this.$message.warning('存在已经发送过的数据，请您重新选择！');
        }
        const ids = this.selection.map((item) => item.IFACE_BATCH_ID).join(',');
        const loading = this.$messageLoading('请求中..');
        PushEbsPayablePendingList({ ids: ids })
          .then((res) => {
            this.$message.success(res?.msg);
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .finally(() => {
            loading.close();
            this.reload(this.where);
          });
      }
    },
    beforeDestroy() {
      this.$bus.$off('EbsPayablePendingTopTableCurrentChange');
    }
  };
</script>
<style lang=""></style>
