<template lang="">
  <div>
    <NewDeptPlannedDeliveryBottomLeftTableSearch  @search='reload'/>
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="20vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="NewDeptPlannedDeliveryBottomLeftTableCacheKey"
      key="NewDeptPlannedDeliveryBottomLeftTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import { GetPickingList } from '@/api/Task/NewDeptPlannedDelivery';
  import NewDeptPlannedDeliveryBottomLeftTableSearch from './NewDeptPlannedDeliveryBottomLeftTableSearch';
  export default {
    name: 'NewDeptPlannedDeliveryBottomLeftTable',
    components: {
      NewDeptPlannedDeliveryBottomLeftTableSearch
    },
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            prop: 'Stock_Up_Plan_No',
            label: '备货计划单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Creator',
            label: '创建人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'supplier_name',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Address',
            label: '收货库区',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Create_Time',
            label: '创建时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (_row, _column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'REMARK',
            label: '备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Approve_State',
            label: '审批状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (_row, _column, cellValue) => {
              if (_row.Approve_State == 0) {
                return '未审批';
              } else if (_row.Approve_State == 1) {
                return '已成功审批';
              } else {
                return '拒绝审批';
              }
            }
          },
          {
            prop: 'Send_State',
            label: '发送状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (_row, _column, cellValue) => {
              if (_row.Send_State == 0) {
                return '未发送（SPD）';
              } else if (_row.Send_State == 1) {
                return '已发送（SPD）';
              } else if (_row.Send_State == 2) {
                return '已查看（B2B）';
              } else if (_row.Send_State == 3) {
                return '处理中（B2B）';
              } else if (_row.Send_State == 4) {
                return '部分送货（B2B）';
              } else if (_row.Send_State == 5) {
                return '全部送货（B2B）';
              } else if (_row.Send_State == 6) {
                return '部分收货（SPD）';
              } else if (_row.Send_State == 7) {
                return '全部收货（SPD）';
              } else if (_row.Send_State == 8) {
                return '强制关闭';
              }
            }
          }
        ],
        pageSize: 10,
        pageSizes: [10, 20, 40, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = GetPickingList({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(row) {
        this.current = row;
        this.$bus.$emit('NewDeptPlannedDeliveryBottomLeftTableCurrentChange', row);
      }
    }
  };
</script>
<style lang=""></style>
