<template lang="">
  <div>
    <FinancialTableSearch />
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="70vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="financialTableCacheKey"
      key="financialTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import FinancialTableSearch from './FinancialTableSearch';
  import { getFinacialTableData } from '@/api/Settle/FinancialAudit';
  export default {
    name: 'FinancialTable',
    components: {
      FinancialTableSearch
    },
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        // 表格列配置
        columns: [
          {
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'MONTHLY_BALANCE_NUMBER',
            label: '月结单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'MONTHLY_TIME',
            label: '月结月份',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SEND_WXT_MARK',
            label: '微讯通月份',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == null) {
                return '-';
              } else {
                return cellValue;
              }
            }
          },
          {
            prop: 'MONTHBILLNUM',
            label: '发票号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'FP_DATE',
            label: '开票日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'PIC_URL',
            label: '发票图片',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BILLFPNUM',
            label: '本院发票(收货自带)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'CLASSIFIC_PROPERTIES',
            label: '财务类别',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (
                row.CLASSIFIC_PROPERTIES == 1 ||
                row.CLASSIFIC_PROPERTIES == '1'
              ) {
                return '化验材料';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 2 ||
                row.CLASSIFIC_PROPERTIES == '2'
              ) {
                return 'X光照相材料';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 3 ||
                row.CLASSIFIC_PROPERTIES == '3'
              ) {
                return '医疗材料';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 4 ||
                row.CLASSIFIC_PROPERTIES == '4'
              ) {
                return '医疗用品';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 5 ||
                row.CLASSIFIC_PROPERTIES == '5'
              ) {
                return '一次性耗材';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 21 ||
                row.CLASSIFIC_PROPERTIES == '21'
              ) {
                return '其他';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 22 ||
                row.CLASSIFIC_PROPERTIES == '22'
              ) {
                return '应急物资';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 2 ||
                row.CLASSIFIC_PROPERTIES == '2'
              ) {
                return 'X光照相材料';
              }
              if (
                row.CLASSIFIC_PROPERTIES == 6 ||
                row.CLASSIFIC_PROPERTIES == '6'
              ) {
                return '胶片材料';
              }
              return row.CLASSIFIC_PROPERTIES;
            }
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SOURCE_FROM',
            label: '来源',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 55
          },
          {
            prop: 'PRICE',
            label: '单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 55
          },
          {
            prop: 'QTY',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'Money',
            label: '金额',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'BATCH_ID',
            label: '批次号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SIGNSTATUS',
            label: '医秒付签收状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1 || cellValue == '1') {
                return '已签收';
              } else {
                return '未签收';
              }
            }
          },
          {
            prop: 'Examine_State',
            label: '审批状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1 || cellValue == '1') {
                return '已审批';
              } else {
                return '未审批';
              }
            }
          },
          {
            prop: 'Examine_Time',
            label: '审批时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'YG_ORDER_ID',
            label: '阳光订单',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'LS_IS_JC',
            label: '是否集采(时限)',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1 || cellValue == '1') {
                return '集采';
              } else {
                return '非集采';
              }
            }
          },
          {
            prop: 'JC_REMARK',
            label: '集采备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'CHECKSTATUS',
            label: '医秒付发票状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'QSSTATE',
            label: '中心库发票签收',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1 || cellValue == '1') {
                return '已签收';
              } else {
                return '未签收';
              }
            }
          }
        ],
        toolbar: false,
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
        let data = getFinacialTableData({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      onCurrentChange(row) {}
    }
  };
</script>
<style lang=""></style>
