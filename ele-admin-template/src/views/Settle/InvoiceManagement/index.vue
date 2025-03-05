<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 数据表格 -->
      <user-search @search="reload" @exportData="exportData" @ExamineBtn="ExamineFun" @CancelExamineBtn="CancelExamineFun" @ReceiptInvoiceBtn="ReceiptInvoiceFun" @CancelReceiptInvoiceBtn="CancelReceiptInvoiceFun" />
      <ele-pro-table ref="table" :rowClickCheckedIntelligent="false" :rowClickChecked="true" :initLoad="false" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" highlight-current-row cache-key="InvoiceManagementTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改
          </el-link>
          <!-- <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button> -->
          <!-- <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm> -->
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import { GetPDAList } from '@/api/KSInventory/InstrumentalAnalysis';
import {
  GetInvoiceManagement,
  SuerAuditNo,
  SuerAudit,
  SuerFPQS,
  CencelFPQS
} from '@/api/Settle/InvoiceManagement';
export default {
  name: 'InvoiceManagement',
  components: {
    UserSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 180,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'MONTH_ID',
          label: '月结ID',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'MONTHLY_BALANCE_NUMBER',
          label: '月结单号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'MONTHLY_TIME',
          label: '月结日期',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'MONTHBILLNUM',
          label: '发票号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'BATCH_ID',
          label: '批次号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SUPPLIER_CODE',
          label: '供应商编码',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PROVINCE_PLATFORM_CODE',
          label: '省平台编码',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        // {
        //   prop: 'VARIETIE_CODE',
        //   label: 'PAD扫码数量',
        //   align: 'center',
        //   sortable: 'custom',
        //   width: 180,
        //   showOverflowTooltip: true
        // },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          sortable: 'custom',
          width: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          sortable: 'custom',
          width: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'CLASSIFIC_PROPERTIES',
          label: '财务类别',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'SPH_ERP_VARIETIE_CODE',
          label: 'ERP品种编码',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH',
          label: '批号',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'QSSTATE',
          label: '中心库发票签收',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '未签收';
            } else if (cellValue == 1) {
              return '已签收';
            } else {
              return cellValue;
            }
          }
        },
        {
          prop: 'FP_DATE',
          label: '开票日期',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'FPQS_MAN',
          label: '发送人',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'FPQS_TIME',
          label: '发送时间',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'REMARKS',
          label: '备注',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'LS_IS_JC',
          label: '是否集采(时限)',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '非集采';
            } else if (cellValue == 1) {
              return '集采';
            } else {
              return cellValue;
            }
          }
        },
        {
          prop: 'JC_REMARK',
          label: '集采备注',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'SEND_WXT_MARK',
          label: '微讯通月份',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效期',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'BILLFPNUM',
          label: '发票',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'PRICE',
          label: '价格',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'EXAMINE_STATE',
          label: '审批状态',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '未审批';
            } else if (cellValue == 1) {
              return '已审批';
            } else {
              return cellValue;
            }
          }
        },
        {
          prop: 'EXAMINE_TIME',
          label: '审批时间',
          align: 'center',
          sortable: 'custom',
          width: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'QTY',
          label: '数量',
          align: 'center',
          sortable: 'custom',
          width: 70,
          showOverflowTooltip: true
        },
        // {
        //   prop: 'CONSUME_ID',
        //   label: '消耗ID',
        //   align: 'center',
        //   sortable: 'custom',
        //   width: 180,
        //   showOverflowTooltip: true
        // },
        {
          prop: 'Money',
          label: '金额',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'SOURCE_FROM',
          label: '来源',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'HIGH_OR_LOW_CLASS',
          label: '高低值分类',
          align: 'center',
          sortable: 'custom',
          width: 60,
          showOverflowTooltip: true
        },
        {
          prop: 'EBS_CAN_SEND_INVOICE',
          label: '是否发送',
          align: 'center',
          sortable: 'custom',
          width: 80,
          showOverflowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '否';
            } else if (cellValue == 1) {
              return '是';
            } else {
              return '';
            }
          }
        }
        // {
        //   prop: 'EBS_DEPT_DEL_ID',
        //   label: 'PAD扫码数量',
        //   align: 'center',
        //   sortable: 'custom',
        //   width: 180,
        //   showOverflowTooltip: true
        // },
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetInvoiceManagement({ page, limit, where, order }).then(
        (res) => {
          var data2 = {};
          data2.list = res.result;
          data2.count = res.total;
          return data2;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    exportData() {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        GetInvoiceManagement({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();

            const array = [
              [
                '月结ID',
                '月结单号',
                '月结日期',
                '发票号',
                '批次号',
                '供应商名称',
                '供应商编码',
                '省平台编码',
                '品种编码',
                '品种名称',
                '财务类别',
                '规格型号',
                '单位',
                'ERP品种编码',
                '生产企业',
                '注册证号',
                '批号',
                '中心库发票签收',
                '开票日期',
                '发送人',
                '发送时间',
                '备注',
                '是否集采(时限)',
                '集采备注',
                '微讯通月份',
                '生产日期',
                '有效期',
                '发票',
                '价格',
                '审批状态',
                '审批时间',
                '数量',
                '金额',
                '来源',
                '高低值分类',
                '是否发送'
              ]
            ];
            res.result.forEach((d) => {
              if (d.QSSTATE == 0) {
                d.QSSTATE = '未签收';
              } else if (d.QSSTATE == 1) {
                d.QSSTATE = '已签收';
              }
              if (d.LS_IS_JC == 0) {
                d.LS_IS_JC = '非集采';
              } else if (d.LS_IS_JC == 1) {
                d.LS_IS_JC = '集采';
              }
              if (d.EXAMINE_STATE == 0) {
                d.EXAMINE_STATE = '未审批';
              } else if (d.EXAMINE_STATE == 1) {
                d.EXAMINE_STATE = '已审批';
              }
              if (d.EBS_CAN_SEND_INVOICE == 0) {
                d.EBS_CAN_SEND_INVOICE = '否';
              } else if (d.EBS_CAN_SEND_INVOICE == 1) {
                d.EBS_CAN_SEND_INVOICE = '是';
              }
              array.push([
                d.MONTH_ID,
                d.MONTHLY_BALANCE_NUMBER,
                d.MONTHLY_TIME,
                d.MONTHBILLNUM,
                d.BATCH_ID,
                d.SUPPLIER_NAME,
                d.SUPPLIER_CODE,
                d.PROVINCE_PLATFORM_CODE,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME,
                d.CLASSIFIC_PROPERTIES,
                d.SPECIFICATION_OR_TYPE,
                d.UNIT,
                d.SPH_ERP_VARIETIE_CODE,
                d.MANUFACTURING_ENT_NAME,
                d.APPROVAL_NUMBER,
                d.BATCH,
                d.QSSTATE,
                d.FP_DATE,
                d.FPQS_MAN,
                d.FPQS_TIME,
                d.REMARKS,
                d.LS_IS_JC,
                d.JC_REMARK,
                d.SEND_WXT_MARK,
                d.BATCH_PRODUCTION_DATE,
                d.BATCH_VALIDITY_PERIOD,
                d.BILLFPNUM,
                d.PRICE,
                d.EXAMINE_STATE,
                d.EXAMINE_TIME,
                d.QTY,
                d.Money,
                d.SOURCE_FROM,
                d.HIGH_OR_LOW_CLASS,
                d.EBS_CAN_SEND_INVOICE
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '发票管理.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    CancelExamineFun() {
      if (this.selection.length <= 0) {
        this.$message.warning('请选择数据!');
        return;
      }
      const loading = this.$messageLoading('处理中..');

      var data = [];
      this.selection.forEach((item) => {
        var dataStr = item.ID + ',' + this.$store.state.user.info.Nickname;
        data.push(dataStr);
      });
      SuerAuditNo(data)
        .then((res) => {
          loading.close();
          this.reload();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    ExamineFun() {
      if (this.selection.length <= 0) {
        this.$message.warning('请选择数据!');
        return;
      }
      const loading = this.$messageLoading('处理中..');

      var data = [];
      this.selection.forEach((item) => {
        var dataStr = item.ID + ',' + this.$store.state.user.info.Nickname;
        data.push(dataStr);
      });
      SuerAudit(data)
        .then((res) => {
          loading.close();
          this.reload();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    ReceiptInvoiceFun() {
      if (this.selection.length <= 0) {
        this.$message.warning('请选择数据!');
        return;
      }
      const loading = this.$messageLoading('处理中..');

      var data = [];
      this.selection.forEach((item) => {
        var dataStr = {
          ID: item.ID
        };
        data.push(dataStr);
      });
      SuerFPQS(data)
        .then((res) => {
          loading.close();
          this.reload();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    CancelReceiptInvoiceFun() {
      if (this.selection.length <= 0) {
        this.$message.warning('请选择数据!');
        return;
      }
      const loading = this.$messageLoading('处理中..');

      var data = [];
      this.selection.forEach((item) => {
        var dataStr = {
          ID: item.ID
        };
        data.push(dataStr);
      });
      CencelFPQS(data)
        .then((res) => {
          loading.close();
          this.reload();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
