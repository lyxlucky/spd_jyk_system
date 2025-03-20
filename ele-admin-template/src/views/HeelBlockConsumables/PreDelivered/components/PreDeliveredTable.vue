<template>
  <div class="ele-body">
    <PreDeliveredTableSearch
      @search="reload"
      @Approve_btn="ApproveFun"
      @Delete_btn="DeleteFun"
      @Confirm_btn="ConfirmFun"
      :rowData="current"
      @exportData="exportData"
      @prePrint="prePrintTable1"
    />
    <!-- 数据表格 -->
    <ele-pro-table
      highlight-current-row
      @current-change="onCurrentChange"
      :row-class-name="tableRowClassName"
      ref="table"
      height="60vh"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="false"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="PreDeliveredTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
      </template>

      <template v-slot:TempletName="{ row }">
        <span
          style="color: #409eff"
          type="primary"
          @dblclick="editTempletName(row.TempletCode)"
          v-if="row.TempletName"
          :underline="false"
          >{{ row.TempletName }}</span
        >
        <span
          style="color: #409eff"
          type="primary"
          @dblclick="editTempletName(row.TempletCode)"
          v-else
          :underline="false"
          >无</span
        >
      </template>

      <!-- 操作列 -->
      <template v-slot:ACTION="{ row }">
        <el-button type="primary" size="mini" @click="handleUpdate(row)"
          >修改</el-button
        >
      </template>
    </ele-pro-table>
    <UpdatePatientInfoDialog
      @reload="reload"
      :visible.sync="updatePatientInfoDialogVisible"
    ></UpdatePatientInfoDialog>
  </div>
</template>

<script>
  import UpdatePatientInfoDialog from './UpdatePatientInfoDialog';
  import PreDeliveredTableSearch from './PreDeliveredTableSearch';
  import {
    SerachTempletList,
    DeleteTemplet,
    EditTempName
  } from '@/api/KSInventory/ApplyTemp';
  import {
    LoadGoodsDeliveryNumbers,
    Approve,
    SoftDeleteDeliveryNumber,
    Confirm,
    openPrePrintTable1
  } from '@/api/HeelBlockConsumables/PreDelivered';
  import { getDayOfDate } from '@/utils/date-util';
  import { utils, writeFile } from 'xlsx';
  export default {
    name: 'PreDeliveredTable',
    components: {
      PreDeliveredTableSearch,
      UpdatePatientInfoDialog
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
          {
            prop: 'Delivery_Note_Number',
            label: '收货单号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'Hospitalization_Number',
            label: '住院号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'Patient',
            // slot: 'CommonState',
            label: '病患',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Dept_Two_Name',
            label: '使用科室',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'Receive_Receipt_State',
            label: '确认状态',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter(row, column, cellValue) {
              if (cellValue == '0') {
                return '待确认';
              } else if (cellValue == '1') {
                return '待提交';
              } else if (cellValue == '2') {
                return '已提交';
              } else if (cellValue == '3') {
                return '已审批';
              } else if (cellValue == '4') {
                return '已审批';
              } else {
                return cellValue;
              }
            }
          },
          {
            prop: 'SBK_APPROVE_STATE',
            label: '审批状态',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter(row, column, cellValue) {
              if (cellValue == '0') {
                return '未审批';
              } else if (cellValue == '1') {
                return '已审批';
              } else {
                return cellValue;
              }
            }
          },
          {
            prop: 'SBK_APPROVE_MAN',
            label: '审批人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SBK_APPROVE_TIME',
            label: '审批时间',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'ACTION',
            slot: 'ACTION',
            label: '操作',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          }
        ],
        toolbar: false,
        pageSize: 100,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        // datasource: [],
        data: [],
        updatePatientInfoDialogVisible: false
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        var deptTwoList = [];
        var deptTwoJson = this.$store.state.user.info.userDept;

        for (let i = 0; i < deptTwoJson.length; i++) {
          deptTwoList.push(deptTwoJson[i].Dept_Two_Code);
          // deptTwoList += deptTwoJson[i].Dept_Two_Code + ',';
        }
        // deptTwoList = deptTwoList.substring(0, deptTwoList.length - 1);
        where.deptTwoJson = JSON.stringify(deptTwoList);
        where.state = where.state ? where.state : '';
        where.condition = where.condition ? where.condition : '';
        where.strApprove = where.strApprove ? where.strApprove : '';
        where.strYanShou = where.strYanShou ? where.strYanShou : '';
        where.date = where.date
          ? where.date
          : [getDayOfDate('yyyy-MM-dd', -7), getDayOfDate('yyyy-MM-dd', 1)];

        let data = LoadGoodsDeliveryNumbers({ page, limit, where, order }).then(
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
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      editTempletName(code) {
        this.$prompt('请输入模板名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            EditTempName({
              TempCode: code,
              TempName: value
            })
              .then((res) => {
                if (res?.code != 200) return this.$message.error(res?.msg);
                this.$message.success(res?.msg);
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                this.reload(this.where);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      },
      prePrintTable1() {
        if (!this.current) {
          return this.$message.warning('请选择一条数据');
        }

        let Delivery_Note_Number_Id = this.current.Delivery_Note_Number_Id;
        let Delivery_Note_Number = this.current.Delivery_Note_Number;
        openPrePrintTable1({
          Delivery_Note_Number_Id: Delivery_Note_Number_Id,
          Delivery_Note_Number: Delivery_Note_Number
        });
      },
      onDone(res) {
        // console.log('res:', res);
        // 例如选中第一条数据
        if (res.data?.length) {
          this.$refs.table.setCurrentRow(res.data[0]);
        }
      },
      onSelectionChange(selection) {
        this.selection = selection;
        console.log(selection);
      },
      onCurrentChange(current) {
        this.current = current;
        // console.log(current);
        this.$emit('getCurrent', current);
      },

      /* 删除数据 */
      DeleteFun() {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择一条数据');
          return;
        }
        const loading = this.$messageLoading('删除中...');

        var data = {
          staff: this.$store.state.user.info.Nickname,
          deliveryNumberId: this.current.Delivery_Note_Number_Id
        };
        SoftDeleteDeliveryNumber(data)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      ConfirmFun() {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择一条数据');
          return;
        }
        const loading = this.$messageLoading('处理中...');

        var data = {
          staff: this.$store.state.user.info.Nickname,
          deliveryNumberId: this.current.Delivery_Note_Number_Id
        };
        Confirm(data)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      ApproveFun() {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择一条数据');
          return;
        }
        const loading = this.$messageLoading('审批中...');
        var jsonArray = [];
        this.selection.forEach((obj) => {
          var obj2 = {};
          obj2.Delivery_Note_Number_Id = obj.Delivery_Note_Number_Id;
          jsonArray.push(obj2);
        });
        var data = {
          ApproveMan: this.$store.state.user.info.Nickname,
          json: JSON.stringify(jsonArray)
        };
        Approve(data)
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
      handleUpdate(data) {
        this.$bus.$emit('UpdatePatientInfohandleUpdate', data);
        this.updatePatientInfoDialogVisible = true;
      },
      exportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          var deptTwoList = [];
          var deptTwoJson = this.$store.state.user.info.userDept;

          for (let i = 0; i < deptTwoJson.length; i++) {
            deptTwoList.push(deptTwoJson[i].Dept_Two_Code);
            // deptTwoList += deptTwoJson[i].Dept_Two_Code + ',';
          }
          where.deptTwoJson = JSON.stringify(deptTwoList);
          where.state = data.state ? data.state : '';
          where.condition = data.condition ? data.condition : '';
          where.strApprove = data.strApprove ? data.strApprove : '';
          where.strYanShou = data.strYanShou ? data.strYanShou : '';
          where.date = data.date;
          LoadGoodsDeliveryNumbers({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '收货单号',
                  '供应商',
                  '住院号',
                  '病患',
                  '收货时间',
                  '使用科室',
                  '确认状态',
                  '审批状态',
                  '审批人',
                  '审批时间'
                ]
              ];
              res.result.forEach((d) => {
                if (d.Receive_Receipt_State == 0) {
                  d.Receive_Receipt_State = '待确认';
                } else if (d.Receive_Receipt_State == 1) {
                  d.Receive_Receipt_State = '已确认';
                } else if (d.Receive_Receipt_State == 2) {
                  d.Receive_Receipt_State = '已提交';
                } else if (d.Receive_Receipt_State == 3) {
                  d.Receive_Receipt_State = '已审批';
                } else if (d.Receive_Receipt_State == 4) {
                  d.Receive_Receipt_State = '已审批';
                } else {
                  d.Receive_Receipt_State = '';
                }

                if (d.SBK_APPROVE_STATE == 0) {
                  d.SBK_APPROVE_STATE = '未审批';
                } else if (d.SBK_APPROVE_STATE == 1) {
                  d.SBK_APPROVE_STATE = '已审批';
                } else {
                  d.SBK_APPROVE_STATE = '';
                }

                array.push([
                  d.Delivery_Note_Number,
                  d.Supplier_Name,
                  d.Hospitalization_Number,
                  d.Patient,
                  d.Delivery_Time,
                  d.Dept_Two_Name,

                  d.Receive_Receipt_State,
                  d.SBK_APPROVE_STATE,
                  d.SBK_APPROVE_MAN,
                  d.SBK_APPROVE_TIME,
                  d.Day_Consume_Qty
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
                '预收货单号列表.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        });
      },
      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      }
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
      this.$bus.$off('UpdatePatientInfohandleUpdate');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }
</style>
