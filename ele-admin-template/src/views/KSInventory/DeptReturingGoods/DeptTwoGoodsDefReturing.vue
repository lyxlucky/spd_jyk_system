<template>
  <div class="dept-two-goods-def-returing">
    <el-row :gutter="20" class="content-row">
      <!-- 左侧表格 - 退货单列表 -->
      <el-col :span="9">
        <el-card class="table-card" shadow="never">
          <template #header>
            <div class="card-title">
              <i class="el-icon-document"></i>
              <span>退货单列表</span>
            </div>
          </template>
          
          <ele-pro-table
            ref="leftTable"
            height="calc(100vh - 260px)"
            highlight-current-row
            :rowClickCheckedIntelligent="false"
            :pageSize="leftPageSize"
            :pageSizes="leftPageSizes"
            :columns="leftColumns"
            :datasource="leftDatasource"
            :current.sync="leftCurrent"
            :selection.sync="leftSelection"
            @selection-change="onLeftSelectionChange"
            @current-change="onLeftCurrentChange"
            cache-key="DeptTwoGoodsDefReturingLeftTableCacheKey"
          >
            <template v-slot:toolbar>
              <div class="toolbar-actions">
                <el-button 
                  type="primary" 
                  icon="el-icon-plus"
                  size="small"
                  @click="handleCreate()"
                >
                  创建退货单
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-check"
                  size="small"
                  :disabled="
                    leftCurrent == null || leftCurrent.Returning_State != '0'
                  "
                  @click="handleReturnSubmit()"
                >
                  提交退货单
                </el-button>
              </div>
            </template>
          </ele-pro-table>
        </el-card>
      </el-col>

      <!-- 右侧表格 - 退货明细 -->
      <el-col :span="15">
        <el-card class="table-card" shadow="never">
          <template #header>
            <div class="card-title">
              <i class="el-icon-tickets"></i>
              <span>退货明细</span>
            </div>
          </template>
          
          <ele-pro-table
            ref="rightTable"
            height="calc(100vh - 260px)"
            highlight-current-row
            :rowClickCheckedIntelligent="false"
            :pageSize="rightPageSize"
            :pageSizes="rightPageSizes"
            :initLoad="false"
            :columns="rightColumns"
            :datasource="rightDatasource"
            :current.sync="rightCurrent"
            :selection.sync="rightSelection"
            @selection-change="onRightSelectionChange"
            cache-key="DeptTwoGoodsDefReturingRightTableCacheKey"
          >
            <template v-slot:toolbar>
              <div class="toolbar-actions">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  :disabled="
                    leftCurrent == null || leftCurrent.Returning_State != '0'
                  "
                  @click="handleAdd()"
                >
                  添加品种
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  :disabled="
                    rightSelection.length == 0 ||
                    leftCurrent?.Returning_State != '0'
                  "
                  @click="handleDelete()"
                >
                  删除
                </el-button>
              </div>
            </template>
          </ele-pro-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加品种对话框 -->
    <el-dialog
      :visible.sync="addVarDialogVisible"
      width="80%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加品种"
    >
      <div class="dialog-content">
        <DeptTwoGoodsDefReturingInLineTableSearch
          @search="inLineReload"
          @handleInLineAdd="handleInLineAdd"
        />
        <ele-pro-table
          ref="inLineTable"
          height="calc(80vh - 280px)"
          highlight-current-row
          :rowClickCheckedIntelligent="false"
          :pageSize="inLinePageSize"
          :pageSizes="inLinePageSizes"
          :columns="inLineColumns"
          :datasource="inLineDatasource"
          :current.sync="inLineCurrent"
          :selection.sync="inLineSelection"
          @selection-change="onInLineSelectionChange"
          cache-key="DeptTwoGoodsDefReturingInLineTableCacheKey"
        >
        </ele-pro-table>
      </div>
    </el-dialog>
    
    <!-- 提交退货单确认对话框 -->
    <el-dialog
      :visible.sync="submitConfirmVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="确认提交退货单"
    >
      <div class="submit-confirm-content">
        <div class="confirm-icon">
          <i class="el-icon-warning" style="font-size: 48px; color: #E6A23C;"></i>
        </div>
        <div class="confirm-message">
          <p style="font-size: 16px; margin-bottom: 10px; color: #303133;">确认提交退货单？</p>
          <p style="font-size: 14px; color: #909399;">
            退货单号：<span style="font-weight: bold;">{{ leftCurrent?.Returning_Goods_Number }}</span>
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button 
          @click="cancelSubmit" 
          size="medium"
        >
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="confirmSubmit"
          :disabled="countdown > 0"
          size="medium"
        >
          {{ countdown > 0 ? `确认提交(${countdown}s)` : '确认提交' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    GetDeptTwoReturningGoodsList,
    GetDeptTwoReturningGoodsDetail,
    CreateReturningGoodsMain,
    getGoodsReturnDetailList,
    AddReturningGoodsItems,
    DeleteReturningGoodsItems,
    ConfirmReturningGoodsItems
  } from '@/api/DeptReturingGoods';
  import DeptTwoGoodsDefReturingInLineTableSearch from './DeptTwoGoodsDefReturingInLineTableSearch';
  export default {
    name: 'DeptTwoGoodsDefReturing',
    components: {
      DeptTwoGoodsDefReturingInLineTableSearch
    },
    data() {
      return {
        // 左侧表格配置
        leftPageSize: 20,
        form: {},
        rightForm: {},
        leftPageSizes: [10, 20, 50, 100],
        leftCurrent: null,
        leftSelection: [],
        leftWhere: {},
        rightWhere: {},
        addVarDialogVisible: false,
        submitConfirmVisible: false,
        countdown: 3,
        countdownTimer: null,
        leftColumns: [
          {
            prop: 'Returning_Goods_Number',
            label: '退货单号',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '科室',
            minWidth: 60,
            showOverflowTooltip: true
          },
          {
            prop: 'Creater',
            label: '创建人',
            width: 110,
            sortable: true
          },
          {
            prop: 'Create_Time',
            label: '创建时间',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Returning_State',
            label: '完成状态',
            width: 100,
            align: 'center',
            formatter: (row) => {
              switch (row.Returning_State) {
                case '0':
                  return '未退货';
                case '1':
                  return '已退货';
                case '2':
                  return '待退货';
                default:
                  return '未知状态';
              }
            }
          }
        ],
        leftDatasource({ page, limit, where, order }) {
          let data = GetDeptTwoReturningGoodsList({
            page,
            limit,
            where,
            order
          }).then((res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          });
          return data;
        },

        // 右侧表格配置
        rightPageSize: 10,
        rightPageSizes: [10, 20, 50, 100],
        rightCurrent: null,
        rightSelection: [],
        rightColumns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'Dept_Two_Name',
            label: '科室名称',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Code',
            label: '品种(材料)编码',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            width: 240,
            align: 'center'
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'Unit',
            label: '单位',
            width: 100,
            align: 'right',
            sortable: true
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'Coefficient',
            label: '系数',
            width: 50,
            showOverflowTooltip: true
          },
          {
            prop: 'Def_No_Pkg_Code',
            label: '定数码',
            width: 180,
            align: 'center'
          },
          {
            prop: 'Batch',
            label: '生产批号',
            width: 150,
            align: 'center'
          },
          {
            prop: 'MEDICAL_CODE',
            label: '医保编码',
            width: 240,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        rightDatasource({ page, limit, where, order }) {
          let data = GetDeptTwoReturningGoodsDetail({
            page,
            limit,
            where,
            order
          }).then((res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          });
          return data;
        },

        inLinePageSize: 10,
        inLinePageSizes: [10, 20, 50, 100],
        inLineCurrent: null,
        inLineSelection: [],
        inLineColumns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'Dept_Two_Name',
            label: '科室名称',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种(材料)编码',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            width: 280,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            width: 200,
            showOverflowTooltip: true
          },
          {
            prop: 'Unit',
            label: '单位',
            width: 80,
            sortable: true,
            showOverflowTooltip: true
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            width: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'Coefficient',
            label: '系数',
            width: 50,
            showOverflowTooltip: true
          },
          {
            prop: 'Def_No_Pkg_Code',
            label: '定数码',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Batch',
            label: '生产批号',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MEDICAL_CODE',
            label: '医保编码',
            width: 240,
            align: 'center',
            showOverflowTooltip: true
          }
        ]
      };
    },
    methods: {
      handleReturnSubmit() {
        if (this.leftCurrent == null) {
          this.$message.warning('请先选择一个退货单');
          return;
        }
        
        // 显示loading
        const loading = this.$messageLoading('正在检查退货明细...');
        
        // 通过rightDatasource检查退货明细是否为空
        this.rightDatasource({ page: 1, limit: 1, where: { returningGoodsNumber: this.leftCurrent.Returning_Goods_Number }, order: {} })
          .then(data => {
            loading.close();
            if (!data.count || data.count === 0) {
              this.$message.warning('退货明细为空，无法提交');
              return;
            }
            
            // 打开二次确认对话框
            this.submitConfirmVisible = true;
            this.countdown = 3;
            
            // 开始倒计时
            this.countdownTimer = setInterval(() => {
              this.countdown--;
              if (this.countdown <= 0) {
                clearInterval(this.countdownTimer);
                this.countdownTimer = null;
              }
            }, 1000);
          })
          .catch(() => {
            loading.close();
          });
      },
      
      confirmSubmit() {
        // 清除倒计时
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
        
        this.submitConfirmVisible = false;
        const loading = this.$messageLoading('正在提交..');
        
        // 调用API提交退货单
        ConfirmReturningGoodsItems({
          Returning_Goods_Number: this.leftCurrent.Returning_Goods_Number
        })
          .then((res) => {
            this.$message.success(res?.msg || '提交成功');
            this.leftReload({}); // 刷新左侧表格
          })
          .catch((error) => {
            this.$message.error(error?.msg || '提交失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      
      cancelSubmit() {
        // 清除倒计时
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
        this.submitConfirmVisible = false;
        this.countdown = 3;
      },
      handleDelete() {
        //二次确认
        if (this.rightSelection.length == 0) {
          this.$message.warning('请至少选择一条记录');
          return;
        }
        this.$confirm('确定要删除选中的记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          const loading = this.$messageLoading('正在删除..');
          // 获取选中的数据
          const selectedItems = this.rightSelection.map((item) => ({
            Returning_Goods_Number: item.Returning_Goods_Number,
            Def_No_Pkg_Code: item.Def_No_Pkg_Code,
            DEPT_TWO_CODE: item.Dept_Two_Code
          }));
          // 这里可以调用API将选中的数据删除
          DeleteReturningGoodsItems(selectedItems)
            .then((res) => {
              this.$message.success(res?.msg || '删除成功');
              this.rightReload({
                returningGoodsNumber: this.leftCurrent?.Returning_Goods_Number
              }); // 刷新右侧表格
            })
            .catch((error) => {
              this.$message.error(error?.msg || '删除失败');
            })
            .finally(() => {
              loading.close();
            });
        });
      },
      inLineDatasource({ page, limit, where, order }) {
        where.Returning_Goods_Number = this.leftCurrent?.Returning_Goods_Number;
        let data = getGoodsReturnDetailList({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.data
          };
          return tData;
        });
        return data;
      },
      handleInLineAdd() {
        if (this.inLineSelection.length == 0) {
          this.$message.warning('请至少选择一条记录');
          return;
        }
        if (this.leftCurrent == null) {
          this.$message.warning('请先选择一个退货单');
          return;
        }
        const loading = this.$messageLoading('正在添加..');
        // 获取选中的数据
        const selectedItems = this.inLineSelection.map((item) => ({
          ...item,
          Returning_Goods_Number: this.leftCurrent.Returning_Goods_Number
        }));
        // 这里可以调用API将选中的数据添加到退货单中
        AddReturningGoodsItems(selectedItems)
          .then((res) => {
            this.$message.success(res?.msg || '添加成功');
            this.addVarDialogVisible = false; // 关闭对话框
            this.rightReload({
              returningGoodsNumber: this.leftCurrent.Returning_Goods_Number
            }); // 刷新右侧表格
          })
          .catch((error) => {
            this.$message.error(error?.msg || '添加失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      handleAdd() {
        this.addVarDialogVisible = true;
      },
      handleCreate() {
        const loading = this.$messageLoading('正在处理中..');
        CreateReturningGoodsMain()
          .then((res) => {
            this.$message.success(res?.msg);
            this.leftReload({}); // 刷新左侧表格
          })
          .catch((error) => {
            this.$message.error(error?.msg || '创建失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      // 左侧表格选择变化
      onLeftSelectionChange(selection) {
        this.leftSelection = selection;
        // 当左侧选择变化时，可以刷新右侧表格数据
        if (this.$refs.rightTable) {
          this.$refs.rightTable.reload();
        }
      },

      leftReload(data) {
        // 刷新左侧表格数据
        this.$refs.leftTable.reload({ page: 1, where: data });
      },

      rightReload(data) {
        // 刷新左侧表格数据
        this.$refs.rightTable.reload({ page: 1, where: data });
      },

      inLineReload(data) {
        // 刷新左侧表格数据
        this.$refs.inLineTable.reload({ page: 1, where: data });
      },

      onLeftCurrentChange(current) {
        this.leftCurrent = current;
        if (this.leftCurrent != null) {
          this.rightReload({
            returningGoodsNumber: this.leftCurrent.Returning_Goods_Number
          });
        }
      },

      // 右侧表格选择变化
      onRightSelectionChange(selection) {
        this.rightSelection = selection;
      },
      onInLineSelectionChange(selection) {
        this.inLineSelection = selection;
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    beforeDestroy() {
      // 清除定时器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    }
  };
</script>
<style lang="scss" scoped>
.dept-two-goods-def-returing {
  padding: 0;
  
  .content-row {
    margin: 0 !important;
  }
  
  .table-card {
    border-radius: 6px;
    border: 1px solid #e4e7ed;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    ::v-deep .el-card__header {
      padding: 15px 20px;
      background: #fff;
      border-bottom: 1px solid #e4e7ed;
      
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        
        i {
          font-size: 18px;
          color: #606266;
        }
        
        span {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
      }
    }
    
    ::v-deep .el-card__body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      > div {
        flex: 1;
      }
    }
  }
  
  .toolbar-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    
    .el-button {
      border-radius: 4px;
      font-weight: 500;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .dialog-content {
    padding: 10px 0;
    
    .ele-pro-table {
      margin-top: 20px;
    }
  }
  
  .submit-confirm-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px 0;
    
    .confirm-icon {
      margin-bottom: 20px;
    }
    
    .confirm-message {
      text-align: center;
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
  
  ::v-deep .el-table {
    border-radius: 4px;
    overflow: hidden;
    
    .el-table__header-wrapper {
      th {
        background-color: #fafbfc;
        color: #303133;
        font-weight: 600;
      }
    }
    
    .el-table__body-wrapper {
      tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .dept-two-goods-def-returing {
    .content-row {
      .el-col {
        &:first-child {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
