<template>
  <div class="ele-body">
    <el-card>
      <div slot="header">备货计划单号列表</div>
      <div>
        <el-form :model="form" :inline="true" size="mini">
          <!-- 供应商名称搜索 -->
          <el-form-item>
            <el-input
              v-model="form.supplier_name"
              placeholder="请输入供应商名称"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </el-form-item>

          <!-- 备货计划单号搜索 -->
          <el-form-item>
            <el-input
              v-model="form.stock_up_plan_no"
              placeholder="请输入备货计划单号"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </el-form-item>

          <!-- 审批状态选择 -->
          <el-form-item label="审批状态：">
            <el-select
              v-model="form.approve_state"
              style="width: 120px"
              @change="handleSearch"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未审批" value="0"></el-option>
              <el-option label="已审批" value="1"></el-option>
            </el-select>
          </el-form-item>

          <!-- 跟踪状态选择 -->
          <el-form-item label="跟踪状态：">
            <el-select
              v-model="form.send_state"
              style="width: 120px"
              @change="handleSearch"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未发送" value="0"></el-option>
              <el-option label="已发送" value="1"></el-option>
              <el-option label="已查看" value="2"></el-option>
              <el-option label="处理中" value="3"></el-option>
              <el-option label="部分送货" value="4"></el-option>
              <el-option label="全部送货" value="5"></el-option>
              <el-option label="部分收货" value="6"></el-option>
              <el-option label="全部收货" value="7"></el-option>
              <el-option label="强制结束" value="8"></el-option>
            </el-select>
          </el-form-item>

          <!-- 过滤强制关闭订单 -->
          <!-- <el-form-item>
                    <el-checkbox v-model="form.isQZJS" @change="handleSearch">过滤强制关闭订单</el-checkbox>
                </el-form-item> -->

          <!-- 日期范围选择 -->
          <el-form-item label="订单创建日期：" style="display: none">
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleSearch"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
              >查询</el-button
            >
          </el-form-item>

          <!-- 按钮组 -->
          <el-form-item>
            <el-button
              type="default"
              icon="el-icon-back"
              @click="handleSearchAll"
              >返回查看所有</el-button
            >
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :disabled="ApproveAndSendDisabled"
              @click="handleApproveAndSend"
              >审批并发送备货单</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="ResendDisabled"
              @click="handleResend"
              >补发送备货单</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBatchApprove"
              >批量审批并发送</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateFunds"
              >修改资金来源</el-button
            >
          </el-form-item>

          <el-form-item>
            <el-button
              type="danger"
              :disabled="
                currentTableData?.SENDHRP != '0' &&
                currentTableData?.APPROVE_STATE != '0'
              "
              @click="handleNoPass"
              style="width: 90px"
              >审批不通过</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              :disabled="
                !['0', '1', '2', '3'].includes(currentTableData?.SEND_STATE)
              "
              @click="handleCloseOrder"
              style="width: 100px"
              >关闭订单</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleExport" style="width: 80px"
              >导出</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.isQZJS">过滤强制关闭订单</el-checkbox>
          </el-form-item>
        </el-form>

        <div>
          <ele-pro-table
            size="mini"
            ref="table"
            height="250px"
            :columns="columns"
            :datasource="datasource"
            :paging="false"
            highlight-current-row
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
            @current-change="onCurrentChange"
          >
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <UpdateFundsDialog
      @handleConfirmFunds="handleConfirmFunds"
      :visible.sync="updateFundsDialogVisible"
    ></UpdateFundsDialog>
  </div>
</template>

<script>
  import UpdateFundsDialog from './UpdateFundsDialog';
  import {
    getStockUpList,
    postNoApprove,
    PostPrepareCloseOrderData,
    UpFundsSource,
    YesApprove,
    CheckPlanPriceInfo,
    GetPickingInfo,
    ReceiveSpdStockup,
    UpdateSendState
  } from '@/api/Task/FollowingGoodsPlanHrp';
  import { exportToExcel } from '@/utils/excel-util.js';
  import { HOME_HP } from '@/config/setting';
  export default {
    name: 'StockPlanOrderList',
    components: {
      UpdateFundsDialog
    },
    props: {
      currentTableRow2: {
        type: Object,
        default: () => {}
      },
      currentTableRow: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        form: {
          start_time: '',
          end_time: '',
          order_state: '',
          varietie_code: '',
          stock_up_plan_no: '',
          supplier_name: '',
          approve_state: '',
          send_state: '',
          coefficient: '',
          SENDHRP: '',
          isQZJS: true, // 默认选中过滤强制关闭订单
          CREATOR: '',
          BZ: '',
          dateRange: [] // 日期范围
        },
        currentTableData: null,
        selectedRows: [], // 选中的行
        hasSelection: false, // 是否有选中的行
        updateFundsDialogVisible: false,
        columns: [
          {
            type: 'selection',
            width: 45,
            align: 'center'
          },
          {
            label: '备货计划单号',
            prop: 'STOCK_UP_PLAN_NO',
            minWidth: 120,
            align: 'center'
          },
          {
            label: '总金额',
            prop: 'SUM_MONEY',
            minWidth: 100,
            align: 'center',
            formatter: (row) => {
              return row.SUM_MONEY.toFixed(2);
            }
          },
          // {
          //   label: '资金来源',
          //   prop: 'FUNDS_SOURCE',
          //   width: 140,
          //   visible: false,
          //   align: 'center',
          //   formatter: (row) => {
          //     // 1.自籌資金2.政府補助3.科教項目4.財政+自籌5.財政轉款(行政辦事處)6.財政轉款(辦業費用)
          //     if (row.FUNDS_SOURCE == 1) {
          //       return "自籌資金";
          //     } else if (row.FUNDS_SOURCE == 2) {
          //       return "政府補助";
          //     } else if (row.FUNDS_SOURCE == 3) {
          //       return "科教項目";
          //     } else if (row.FUNDS_SOURCE == 4) {
          //       return "財政+自籌";
          //     } else if (row.FUNDS_SOURCE == 5) {
          //       return "財政轉款(行政辦事處)";
          //     } else if (row.FUNDS_SOURCE == 6) {
          //       return "財政轉款(辦業費用)";
          //     } else {
          //       return "未設定";
          //     }
          //   }
          // },
          {
            label: '供应商名称',
            prop: 'SUPPLIER_NAME',
            minWidth: 150,
            align: 'center'
          },
          {
            label: '所属库区',
            prop: 'NAME',
            minWidth: 100,
            align: 'center'
          },
          {
            label: '创建人',
            prop: 'CREATOR',
            width: 100,
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'CREATE_TIME',
            width: 150,
            align: 'center',
            sortable: true
          },
          {
            label: '审核状态/审核人/审核时间',
            prop: 'APPROVE_TWO_STATE',
            minWidth: 180,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_TWO_STATE == 0) {
                return '未审核';
              } else if (row.APPROVE_TWO_STATE == 1) {
                return (
                  '已审核' +
                  '/' +
                  row.APPROVE_TWO_MAN +
                  '/' +
                  row.APPROVE_TWO_TIME
                );
              } else if (row.APPROVE_TWO_STATE == 2) {
                return '不通过';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '审批状态',
            prop: 'APPROVE_STATE',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_STATE == 0) {
                return '未审批';
              } else if (row.APPROVE_STATE == 1) {
                return '已审批';
              } else if (row.APPROVE_STATE == 2) {
                return '不通过';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '审批人',
            prop: 'APPROVER',
            width: 100,
            align: 'center'
          },
          {
            label: '审批时间',
            prop: 'APPROVE_TIME',
            width: 150,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_STATE == 0) {
                return '';
              } else {
                return row.APPROVE_TIME;
              }
            }
          },
          {
            label: '跟踪状态',
            prop: 'SEND_STATE',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.SEND_STATE == 0) {
                return '未发送(SPD)';
              } else if (row.SEND_STATE == 1) {
                return '已发送(SPD)';
              } else if (row.SEND_STATE == 2) {
                return '已查看(B2B)';
              } else if (row.SEND_STATE == 3) {
                return '处理中(B2B)';
              } else if (row.SEND_STATE == 4) {
                return '部分送货(B2B)';
              } else if (row.SEND_STATE == 5) {
                return '全部送货(B2B)';
              } else if (row.SEND_STATE == 6) {
                return '部分收货(SPD)';
              } else if (row.SEND_STATE == 7) {
                return '全部收货(SPD)';
              } else if (row.SEND_STATE == 8) {
                return '强制结束(SPD)';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '最新状态跟踪时间',
            prop: 'TRACK_TIME',
            width: 150,
            align: 'center'
          },
          {
            label: '是否提交HRP',
            prop: 'SENDHRP',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.SENDHRP == 1) {
                return '已提交';
              } else {
                return '未提交';
              }
            }
          }
        ]
      };
    },
    computed: {
      ApproveAndSendDisabled() {
        // 当选中的行中存在未审批的行时，禁用按钮
        if (!this.currentTableData) {
          return true;
        }
        let dis = false;
        if (this.currentTableData.SENDHRP == '0') {
          dis = true;
        } else {
          dis = false;
        }
        if (this.currentTableData.APPROVE_STATE != '0') {
          dis = true;
        }

        return dis;
      },
      ResendDisabled() {
        if (!this.currentTableData) {
          return true;
        }
        if (this.currentTableData.APPROVE_STATE == '0') {
          return true;
        }
        return true;
      }
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      // 处理查询
      handleSearch() {
        this.$refs.table.reload({ page: 1 });
      },
      handleRowClick(row) {
        // console.log(row)
        this.currentTableData = row;
        this.$emit('onRowClick', row);
      },

      // 返回查看所有
      handleSearchAll() {
        // 重置表单
        this.form = {
          start_time: '',
          end_time: '',
          order_state: '',
          varietie_code: '',
          stock_up_plan_no: '',
          supplier_name: '',
          approve_state: '',
          send_state: '',
          coefficient: '',
          SENDHRP: '',
          isQZJS: true,
          CREATOR: '',
          BZ: '',
          dateRange: []
        };
        this.handleSearch();
      },

      onCurrentChange(current) {
        this.currentTableData = current;
      },

      // 处理表格选择变化
      handleSelectionChange(selection) {
        this.selectedRows = selection;
        this.hasSelection = selection.length > 0;
        // console.log(selection)
      },

      // 审批不通过
      handleNoPass() {
        // console.log(this.currentTableData)
        if (!this.currentTableData) {
          this.$message.warning('请先选择要操作的数据');
          return;
        }
        const loading = this.$messageLoading('处理中...');
        postNoApprove({
          ID: this.currentTableData.ID
        })
          .then((res) => {
            loading.close();
            if (res.data.code == 200) {
              this.$message.success('审批不通过');
              this.handleSearch(); // 刷新列表
            } else {
              this.$message.warning(res.data.msg);
            }
          })
          .catch((err) => {
            loading.close();
            this.$message.error('操作失败');
          })
          .finally(() => {
            loading.close();
          });
      },

      // 关闭订单
      handleCloseOrder() {
        // console.log(this.currentTableData)
        if (!this.currentTableData) {
          this.$message.warning('请先选择要操作的数据');
          return;
        }
        this.$confirm('确定要关闭选中的订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 实现关闭订单的逻辑
          const loading = this.$messageLoading('关闭订单操作中...');
          PostPrepareCloseOrderData({
            ID: this.currentTableData.ID,
            Approve_State: this.currentTableData.APPROVE_STATE,
            Send_State: this.currentTableData.SEND_STATE,
            hp: HOME_HP
          })
            .then((res) => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.handleSearch(); // 刷新列表
              } else {
                this.$message.warning(res.data.msg);
              }
            })
            .catch((err) => {
              this.$message.error('关闭订单操作失败');
            })
            .finally(() => {
              loading.close();
            });
        });
      },
      handleConfirmFunds(fundsType) {
        // 实现修改资金来源的逻辑
        const loading = this.$messageLoading('修改中...');
        UpFundsSource({
          type: fundsType
        })
          .then((res) => {
            this.$message.success(res?.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            this.handleSearch(); // 刷新列表
            loading.close();
            this.updateFundsDialogVisible = false;
          });
      },
      // 导出
      handleExport() {
        // 实现导出的逻辑
        const loading = this.$messageLoading('导出操作开始');
        // 这里可以调用导出API或使用xlsx库进行导出
        getStockUpList({
          page: 1,
          limit: this.$refs.table.tableTotal || 999999,
          where: {
            supplier_name: this.form.supplier_name,
            stock_up_plan_no: this.form.stock_up_plan_no,
            approve_state: this.form.approve_state,
            send_state: this.form.send_state,
            order_state: this.currentTableRow.ORDER_STATE,
            varietie_code: this.currentTableRow2.Varietie_Code_New,
            isQZJS: this.form.isQZJS ? 1 : 0
            // start_time: this.form.start_time,
            // end_time: this.form.end_time
          }
        })
          .then((res) => {
            let data = res.data;
            if (data.code == '200') {
              this.$message.success('导出成功');
              exportToExcel(data.result, this.columns, '备货计划单号列表');
            }
            this.$message.warning(data.msg);
          })
          .catch((err) => {
            this.$message.error('操作失败');
          })
          .finally(() => {
            loading.close();
          });
      },

      //1
      handleYesApprove(data) {
        return new Promise((resolve, reject) => {
          YesApprove({ ID: data })
            .then((res) => {
              this.$message.success(res?.msg);
              resolve();
            })
            .catch((err) => {
              this.$message.error(err);
              reject();
            });
        });
      },

      //2
      handleCheckPlanPriceInfo(data) {
        return new Promise((resolve, reject) => {
          CheckPlanPriceInfo({ order: data })
            .then((res) => {
              this.$message.success(res?.msg);
              resolve();
            })
            .catch((err) => {
              this.$message.error(err);
              reject();
            });
        });
      },

      //3
      handleGetPickingInfo(data) {
        return new Promise((resolve, reject) => {
          GetPickingInfo({ order: data })
            .then((res) => {
              this.$message.success(res?.msg);
              resolve(res);
            })
            .catch((err) => {
              this.$message.error(err);
              reject();
            });
        });
      },

      //4
      handleReceiveSpdStockup(data) {
        return new Promise((resolve, reject) => {
          ReceiveSpdStockup({ json: data })
            .then((res) => {
              if('true' == res){
                this.$message.success('备货单发送成功');
              }else{
                this.$message.error('备货单发送失败');
              }
              resolve(res);
            })
            .catch((err) => {
              this.$message.error(err);
              reject();
            });
        });
      },

      //5
      handleUpdateSendState(data) {
        return new Promise((resolve, reject) => {
          UpdateSendState({ ID: data })
            .then((res) => {
              if('200' == res){
                this.$message.success('更新成功');
              }else{
                this.$message.error('更新失败');
              }
              resolve(res);
            })
            .catch((err) => {
              this.$message.error(err);
              reject();
            });
        });
      },

      // 审批并发送备货单
      handleApproveAndSend() {
        if (!this.currentTableData) {
          return this.$message.warning('请先选择要操作的数据');
        }

        const loading = this.$messageLoading('处理中...');
        // 实现审批（暂时支持北京）并发送备货单的逻辑
        this.handleYesApprove(this.currentTableData.ID)
          .then(() => {
            this.handleCheckPlanPriceInfo(
              this.currentTableData.STOCK_UP_PLAN_NO
            ).then(() => {
              this.handleGetPickingInfo(
                this.currentTableData.STOCK_UP_PLAN_NO
              ).then((res) => {
                if (res?.result.length == 0) {
                  return this.$message.error('数据有误，请检查');
                }
                //组装JSON
                const planDetails = (res?.result || []).map((item) => ({
                  VARIETIE_CODE: item.Varietie_Code,
                  VARIETIE_CODE_NEW: item.Varietie_Code_New,
                  VARIETIE_NAME: item.Varietie_Name,
                  STOCK_UP_PLAN_GOODS_QUANTITY:
                    item.Stock_Up_Plan_Goods_Quantity,
                  SUPPLIER_CODE: item.supplier_code,
                  CONTRACT_CODE: item.contract_code,
                  SUPPLY_PRICE: item.Purchase_Price,
                  Province_Platform_Code: item.Province_Platform_Code,
                  Specification_Or_Type: item.Specification_Or_Type,
                  Manufacturing_Ent_Name: item.Manufacturing_Ent_Name,
                  ST_MANUFACTURING_ENT_NAME: item.ST_MANUFACTURING_ENT_NAME,
                  UNIT: item.Unit,
                  Approval_Number: item.Approval_Number,
                  MANUFACTURING_LICENSE: item.MANUFACTURING_LICENSE,
                  STORAGE_TYPE: item.STORAGE_TYPE,
                  SPD_USE_PRICE: item.supply_price
                }));
                // 使用对象解构和简写语法
                const [firstItem = {}] = res?.result || [];
                const requsetData = JSON.stringify([
                  {
                    STOCK_UP_PLAN_NO: this.currentTableData.STOCK_UP_PLAN_NO,
                    HOSPITALCODE: 'BH00261',
                    ADDRESS: this.currentTableData.ADDRESS,
                    CONTACT_PHONE: firstItem?.CONTACT_PHONE || '',
                    CONTACT_PERSON: firstItem?.CONTACT_PERSON || '',
                    STORAGE_ID: this.currentTableData.STORAGE_ID,
                    REMARKS: this.currentTableData.REMARKS,
                    STOCK_UP_PLAN_DET: planDetails
                  }
                ]);

                this.handleReceiveSpdStockup(requsetData).then((res) => {
                  this.handleUpdateSendState(
                    this.currentTableData.STOCK_UP_PLAN_NO
                  ).then(() => {
                  });
                });
              });
            });
          })
          .finally(() => {
            loading.close();
          });
      },

      // 补发送备货单
      handleResend() {
        if (!this.hasSelection) {
          this.$message.warning('请先选择要操作的数据');
          return;
        }
        // 实现补发送备货单的逻辑
        this.$message.success('补发送备货单操作成功');
      },

      // 批量审批并发送
      handleBatchApprove() {
        // 实现批量审批并发送的逻辑
        this.$message.success('批量审批并发送操作成功');
      },

      // 修改资金来源
      handleUpdateFunds() {
        // 实现修改资金来源的逻辑
        this.updateFundsDialogVisible = true;
      },

      // 数据源方法
      datasource({ page, limit, sort, where }) {
        // 处理日期范围
        // if (this.form.dateRange && this.form.dateRange.length === 2) {
        //   this.form.start_time = this.form.dateRange[0];
        //   this.form.end_time = this.form.dateRange[1];
        // }
        // where.supplier_name = this.form.supplier_name;
        // where.stock_up_plan_no = this.form.stock_up_plan_no;
        // where.approve_state = this.form.approve_state;
        // where.send_state = this.form.send_state;
        // console.log(this.form)
        return getStockUpList({
          page,
          limit,
          sort,
          where: {
            ...where,
            supplier_name: this.form.supplier_name,
            stock_up_plan_no: this.form.stock_up_plan_no,
            approve_state: this.form.approve_state,
            send_state: this.form.send_state,
            order_state: this.currentTableRow.ORDER_STATE,
            varietie_code: this.currentTableRow2.Varietie_Code_New,
            isQZJS: this.form.isQZJS ? 1 : 0
            // start_time: this.form.start_time,
            // end_time: this.form.end_time
          }
        })
          .then((res) => {
            let data = res.data;
            if (data.code == '200') {
              return {
                list: data.result,
                count: data.total
              };
            }
            return {
              list: [],
              count: 0
            };
          })
          .catch((err) => {
            return {
              list: [],
              count: 0
            };
          });
      }
    }
  };
</script>

<style lang="scss" scoped></style>
