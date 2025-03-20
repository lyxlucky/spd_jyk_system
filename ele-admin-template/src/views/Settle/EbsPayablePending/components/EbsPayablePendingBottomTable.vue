<template lang="">
  <div>
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.IFACE_ID"
      @current-change="onCurrentChange"
      :initLoad="false"
      @selection-change="onSelectionChange"
      ref="table"
      height="40vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="EbsPayablePendingBottomTableCacheKey"
      key="EbsPayablePendingBottomTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import { listEbsPayablePendingDetail } from '@/api/Settle/EbsPayablePending';
  export default {
    name: 'EbsPayablePendingBottomTable',
    data() {
      const defaultWhere = {
        IFACE_ID: ''
      };
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
            align: 'center'
          },
          {
            prop: 'LEDGER_NAME',
            label: '账簿',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TRANSACTION_TYPE',
            label: '业务类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TRANSACTION_DATE',
            label: '记账日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BILL_DEPT_CODE',
            label: '科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BILL_DEPT_DESC',
            label: '科室名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BILL_WARD_SN',
            label: '病区',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BILL_WARD_SN_DESC',
            label: '病区名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'PROJECT_CODE',
            label: '项目号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'AMOUNT',
            label: '金额',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'DESCRIPTION',
            label: '描述',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
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
        let data = listEbsPayablePendingDetail({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.data.total,
            list: res.data.data
          };
          return tData;
        });
        return data;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    mounted() {
      this.$bus.$on('EbsPayablePendingTopTableCurrentChange', (current) => {
        this.where.IFACE_ID = current.IFACE_BATCH_ID;
        this.reload(this.where);
      });
    }
  };
</script>
<style lang=""></style>
