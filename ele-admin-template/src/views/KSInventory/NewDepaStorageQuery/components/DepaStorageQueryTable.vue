<template>
  <div class="container">
    <ele-pro-table
      height="65vh"
      highlight-current-row
      @current-change="onCurrentChange"
      :toolkit="[]"
      ref="table"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="DepaStorageQueryTable"
    >
      <template v-slot:toolbar>
        <DepaStorageQueryTableSearch
          @search="reload"
          @exportExcel="exportExcel"
        ></DepaStorageQueryTableSearch>
      </template>
    </ele-pro-table>
    <p style="display: flex;justify-content: flex-end;">
      品种当前页散货金额：{{ where.currentPageItemPrice }}
      品种总金额：{{ where.totalItemPrice }}
      <br/>
      品种当前页入库数量：{{ where.currentInboundNumber }}
      品种入库总数量：{{ where.totalItemInboundNumber }}
    </p>
  </div>
</template>
<script>
  import { utils, writeFile } from 'xlsx';
  import DepaStorageQueryTableSearch from './DepaStorageQueryTableSearch';
  import { GetDeptInStockDetail } from '@/api/KSInventory/NewDepaStorageQuery/index';
  export default {
    name: 'DepaStorageQueryTable',
    components: {
      DepaStorageQueryTableSearch,
    },
    data() {
      const defaultForm = {
        currentPageItemPrice:0,
        totalItemPrice:0,
        currentInboundNumber:0,
        totalItemInboundNumber:0,
      };
      return {
        where: { ...defaultForm },
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 30, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        columns: [
          {
            prop: 'Contract_Type',
            label: '合同类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            sortable: 'custom',
            formatter: (row, column, cellValue) => {
              if (row.Contract_Type == '1') return '中标';
              if (row.Contract_Type == '2') return '临采';
            }
          },
          {
            prop: 'Storage_ID',
            label: '业务发起库区',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            sortable: 'custom',
            formatter: (row, column, cellValue) => {
              if (row.Storage_ID == 1 || row.Storage_ID == '1') {
                return '院内库区';
              } else if (row.Storage_ID == 2 || row.Storage_ID == '2') {
                return '院外库区';
              } else {
                return '-';
              }
            }
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '科室/供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 100
          },
          {
            prop: 'From_Supplier_Name',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 150
          },
          {
            prop: 'RECEIVING_TIME',
            label: '入库时间',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 130
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种(材料)编码',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 100
          },
          {
            prop: 'SPH_ERP_VARIETIE_CODE',
            label: '上药HERP编码',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 100
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 200
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 200
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 150
          },
          {
            prop: 'MEDICAL_CODE',
            label: '医保码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Brand',
            label: '品牌',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 55
          },
          {
            prop: 'BATCH',
            label: '生产批号',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产时间',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效到期',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'DISINFECTION_BATCH',
            label: '灭菌批号',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'COEFFICIENT',
            label: '系数',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'RECEIVING_QUANTITY',
            label: '入库数量',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'SUPPLY_PRICE',
            label: '消耗价',
            align: 'right',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90,
            formatter: (row, column, cellValue) => {
              return row.SUPPLY_PRICE.toFixed(row.price_bl);
            }
          },
          {
            prop: 'PURCHASE_PRICE',
            label: '采购价',
            align: 'right',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'GOODS_QTY',
            label: '散货数量',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'BUSINESS_BILL',
            label: '入库单号',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'MARK',
            label: '入库备注',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          },
          {
            prop: 'HIGH_OR_LOW_CLASS_TWO',
            label: '高低值分类下级属性',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              if (row.HIGH_OR_LOW_CLASS_TWO == '1') return '重点治理';
              if (row.HIGH_OR_LOW_CLASS_TWO == '2') return '非重点治理';
              if (row.HIGH_OR_LOW_CLASS_TWO == null) return '未设置';
            }
          },
          {
            prop: 'IS_BIDDING',
            label: '是否中标',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.IS_BIDDING == '1') return '是';
              if (row.IS_BIDDING == '0') return '否';
            }
          },
          {
            prop: 'Operator',
            label: '操作人',
            align: 'center',
            showOverflowTooltip: true,
            sortable: 'custom',
            minWidth: 90
          }
        ]
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        let data = GetDeptInStockDetail({ page, limit, where, order }).then(
          (res) => {
            res.result.forEach((d) => {
              this.where.currentPageItemPrice += d.GOODS_QTY * d.SUPPLY_PRICE
              this.where.totalItemPrice = d.ALL_PRICE
              this.where.currentInboundNumber += Number(d.RECEIVING_QUANTITY)
              this.where.totalItemInboundNumber =  d.ALL_QTY
            });
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(data) {
        this.current = data;
      },
      exportExcel() {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          GetDeptInStockDetail({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '合同类型',
                  '业务发起库区',
                  '科室/供应商名称',
                  '供应商名称',
                  '入库时间',
                  '品种(材料)编码',
                  '上药HERP编码',
                  '金额',
                  '品种全称',
                  '型号/规格',
                  '单位',
                  '生产企业名称',
                  '医保码',
                  '品牌',
                  '生产批号',
                  '生产时间',
                  '有效到期',
                  '灭菌批号',
                  '系数',
                  '入库数量',
                  '消耗价',
                  '采购价',
                  '散货数量',
                  '入库单号',
                  '入库备注',
                  '注册证号',
                  '高低值分类下级属性',
                  '是否中标',
                  '操作人'
                ]
              ];
              // item
              res.result.forEach((d) => {
                array.push([
                  d.Contract_Type == '1' ? '中标' : '临采',
                  d.Storage_ID == 1 || d.Storage_ID == '1'
                    ? '院内库区'
                    : '院外库区',
                  d.SUPPLIER_NAME,
                  d.From_Supplier_Name,
                  d.RECEIVING_TIME,
                  d.VARIETIE_CODE_NEW,
                  d.SPH_ERP_VARIETIE_CODE,
                  d.SUPPLY_PRICE,
                  d.VARIETIE_NAME,
                  d.SPECIFICATION_OR_TYPE,
                  d.UNIT,
                  d.MANUFACTURING_ENT_NAME,
                  d.MEDICAL_CODE,
                  d.Brand,
                  d.BATCH,
                  d.BATCH_PRODUCTION_DATE,
                  d.BATCH_VALIDITY_PERIOD,
                  d.DISINFECTION_BATCH,
                  d.COEFFICIENT,
                  d.RECEIVING_QUANTITY,
                  d.SUPPLY_PRICE,
                  d.PURCHASE_PRICE,
                  d.GOODS_QTY,
                  d.BUSINESS_BILL,
                  d.MARK,
                  d.APPROVAL_NUMBER,
                  d.HIGH_OR_LOW_CLASS_TWO == '1'
                    ? '重点治理'
                    : d.HIGH_OR_LOW_CLASS_TWO == '2'
                    ? '非重点治理'
                    : '未设置',
                  d.IS_BIDDING == '1' ? '是' : '否',
                  d.Operator
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                'SPD流向查询.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((error) => {
              loading.close();
              this.$message.error(error.message);
            });
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
