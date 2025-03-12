<template lang="">
  <div>
    <EbsSettlementDataTabaleSearch
      :selection="selection"
      @search="reload"
      @delete="handleDelete"
      @generteInvoice="handleGenerteInvoice"
      @pushInvoice="handlePushInvoice"
    />
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.IFACE_ID"
      @current-change="onCurrentChange"
      @selection-change="onSelectionChange"
      ref="table"
      height="70vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="EbsSettlementDataTabaleCacheKey"
      key="EbsSettlementDataTabaleKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import EbsSettlementDataTabaleSearch from './EbsSettlementDataTabaleSearch';
  import {
    listPekingInvoice,
    deletePekingInvoice,
    genneratePekingInvoice,
    pushPekingInvoice
  } from '@/api/Settle/EbsSettlementData/index';
  export default {
    name: 'EbsSettlementDataTabale',
    components: {
      EbsSettlementDataTabaleSearch
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
            prop: 'OPERATING_UNIT',
            label: '业务实体',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter(row, column, cellValue) {
              if (cellValue == 'PKUPH_OU') {
                return '西直门';
              }
              if (cellValue == 'PKUPH_TZ_OU') {
                return '通州';
              }
            }
          },
          {
            prop: 'INVOICE_TYPE',
            label: '发票类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter(row, column, cellValue) {
              if (cellValue == 'STANDARD') {
                return '标准发票';
              }
              if (cellValue == 'CREDIT') {
                return '贷项通知单';
              }
            }
          },
          {
            prop: 'VENDOR_NUMBER',
            label: '供应商编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VENDOR_NAME',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VENDOR_SITE_CODE',
            label: '供应商地点',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'INVOICE_DATE',
            label: '发票日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'GL_DATE',
            label: '发票入账日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'INVOICE_NUM',
            label: '发票编号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SUPPLIER_TAX_INVOICE_NUMBER',
            label: '原始发票号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'ATTACHMENT_NUM',
            label: '附件张数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'INVOICE_AMOUNT',
            label: '发票金额',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              return Number(cellValue).toFixed(2);
            }
          },
          {
            prop: 'ACTION_TYPE',
            label: '类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter(row, column, cellValue) {
              return cellValue == 'NEW' ? '新建发票' : '取消发票/红冲发票';
            }
          },
          {
            prop: 'OPERATING_BY',
            label: '匹配操作人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SYNC_DATE',
            label: '推送时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'PROCESS_FLAG',
            label: '处理标记',
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
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'ERROR_MESSAGE',
            label: '错误信息',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SPD_CREATE_TIME',
            label: 'SPD创建时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'SPD_CREATE_MAN',
            label: 'SPD创建人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SPD_SEND_TIME',
            label: 'SPD发送时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'SPD_SEND_NAME',
            label: 'SPD发送人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SPD_SEND_NAME',
            label: 'SPD发送人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SPD_STATE',
            label: 'SPD状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter(row, column, cellValue) {
              if(cellValue == '0') {
                return '未发送';
              }
              if(cellValue == '1'){
                return '已发送';
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
        let data = listPekingInvoice({ page, limit, where, order }).then(
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
      onSelectionChange(selection) {
        this.selection = selection;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(row) {
        this.current = row;
      },
      handlePushInvoice() {
        //二次确认
        this.$confirm('此操作将推送发票数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$loading({
              lock: true,
              text: '正在推送发票数据...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const ids = this.selection.map((item) => item.IFACE_ID).join(',');
            pushPekingInvoice({ ids: ids })
              .then((res) => {
                console.log(JSON.stringify(res));
                if (res.data.code != 200)
                  return this.$message.error(res.data.msg);
                this.$message({
                  type: 'success',
                  message: '推送成功!'
                });
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                loading.close();
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消推送发票数据'
            });
          });
      },
      handleGenerteInvoice() {
        //二次确认
        this.$confirm('此操作将生成发票数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$loading({
              lock: true,
              text: '正在生成发票数据...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            genneratePekingInvoice()
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '生成成功!'
                  });
                  this.$refs.table.reload();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                loading.close();
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消生成发票数据'
            });
          })
          .finally(() => {});
      },
      handleDelete() {
        //二次确认
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const ids = this.selection.map((item) => item.IFACE_ID).join(',');
            const loading = this.$loading({
              lock: true,
              text: '正在删除...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            deletePekingInvoice({ IFACE_ID: ids })
              .then((res) => {
                if (res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.$refs.table.reload();
                } else {
                  this.$message({
                    type: 'error',
                    message: res
                  });
                }
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                loading.close();
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      }
    }
  };
</script>
<style lang=""></style>
