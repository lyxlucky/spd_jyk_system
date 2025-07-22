<template lang="">
  <div class="dept-two-goods-def-returing">
    <el-row :gutter="20">
      <!-- 左侧表格 - 稍微窄一些 -->
      <el-col :span="9">
        <ele-pro-table
          ref="leftTable"
          height="60vh"
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
            <el-form
              :model="form"
              ref="form"
              :inline="true"
              class="ele-form-search"
              size="mini"
            >
              <el-form-item class="ele-form-actions">
                <el-button type="primary" @click="handleCreate()"
                  >创建</el-button
                >
              </el-form-item>
              <el-form-item class="ele-form-actions">
                <el-button
                  type="success"
                  :disabled="
                    leftCurrent == null || leftCurrent.Returning_State != '0'
                  "
                  @click="handleReturnSubmit()"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </ele-pro-table>
      </el-col>

      <!-- 右侧表格 - 宽一些 -->
      <el-col :span="15">
        <ele-pro-table
          ref="rightTable"
          height="60vh"
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
            <el-form
              :model="rightForm"
              ref="rightForm"
              :inline="true"
              class="ele-form-search"
              size="mini"
            >
              <el-form-item class="ele-form-actions">
                <el-button
                  type="primary"
                  :disabled="leftCurrent == null || leftCurrent.Returning_State != '0'"
                  @click="handleAdd()"
                  >添加</el-button
                >
                <el-button
                  type="danger"
                  :disabled="rightSelection.length == 0 || leftCurrent.Returning_State != '0'"
                  @click="handleDelete()"
                  >删除</el-button
                >
              </el-form-item>
            </el-form>
          </template>
          <!-- 操作列插槽 -->
        </ele-pro-table>
      </el-col>
    </el-row>

    <ele-modal
      width="80%"
      :destroy-on-close="true"
      :visible.sync="addVarDialogVisible"
      title="添加品种"
    >
      <ele-pro-table
        ref="inLineTable"
        width="calc(100vh - 220px)"
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
        <template v-slot:toolbar>
          <el-button type="primary" size="mini" @click="handleInLineAdd()"
            >添加到退货单</el-button
          >
        </template>
      </ele-pro-table>
    </ele-modal>
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
  export default {
    name: 'DeptTwoGoodsDefReturing',
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
            minWidth: 150,
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
            width: 150,
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
            minWidth: 150,
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
            width: 150,
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
        ]
      };
    },
    methods: {
      handleReturnSubmit() {
        if (this.leftCurrent == null) {
          this.$message.warning('请先选择一个退货单');
          return;
        }
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
        let data = getGoodsReturnDetailList({
          page,
          limit,
          where: {
            Returning_Goods_Number: this.leftCurrent?.Returning_Goods_Number
          },
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
    }
  };
</script>
<style lang="scss" scoped>
  .dept-two-goods-def-returing {
    padding: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .el-card {
      border-radius: 8px;

      ::v-deep .el-card__header {
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }

      ::v-deep .el-card__body {
        padding: 20px;
      }
    }

    .el-table {
      border-radius: 6px;
      overflow: hidden;

      ::v-deep .el-table__header-wrapper th {
        background-color: #fafbfc;
        color: #303133;
        font-weight: 600;
      }
    }
  }
</style>
