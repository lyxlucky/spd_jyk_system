<template>
  <div>
    <ele-pro-table
      ref="table"
      size="mini"
      :columns="columns"
      height="50vh"
      highlight-current-row
      :datasource="datasource"
    >
    </ele-pro-table>
  </div>
</template>

<script>
  import { searchVarietieBatchIds } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSPlanConsumablesOperateTable',

    components: {},
    props: {
      currentRow: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        columns: [
          {
            prop: 'Id',
            label: '上架表ID',
            align: 'center',
            width: 100
          },
          {
            prop: 'Storage_Id',
            label: '库区ID',
            align: 'center',
            width: 100
          },
          {
            prop: 'Name',
            label: '库区名称',
            align: 'center',
            width: 120
          },
          {
            prop: 'Varietie_Name',
            label: '品名',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Code_New',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Varietie_Code',
            label: '品种编码ID',
            align: 'center',
            width: 120
          },
          {
            prop: 'Batch_Id',
            label: '批次号',
            align: 'center',
            width: 120
          },
          {
            prop: 'Batch',
            label: '批次',
            align: 'center',
            width: 100
          },
          {
            prop: 'Supply_Price',
            label: '结算价',
            align: 'center',
            width: 100
          },
          {
            prop: 'Contract_Code',
            label: '合同编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Supplier_Code',
            label: '供应商编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Supplier_Name',
            label: '供应商名称',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'Up_Shelf_Quantity',
            label: '上架数量',
            align: 'center',
            width: 100
          },
          {
            prop: 'Batch_Production_Date',
            label: '生产日期',
            align: 'center',
            width: 120,
            formatter: (row) => {
              return row.Batch_Production_Date
                ? this.$moment(row.Batch_Production_Date).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Batch_Validity_Period',
            label: '有效期',
            align: 'center',
            width: 120,
            formatter: (row) => {
              return row.Batch_Validity_Period
                ? this.$moment(row.Batch_Validity_Period).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Priority_Weight',
            label: '优先权重',
            align: 'center',
            width: 100
          }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.varietie = this.currentRow.VARIETIE_CODE;
        return searchVarietieBatchIds({ where })
          .then((data) => {
            return {
              list: data.data || [],
              count: data.total
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload() {
        this.$refs.table.reload({page: 1});
      }
    }
  };
</script>

<style scoped></style>
