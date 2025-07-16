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
          <!-- 操作列插槽 -->
          <template slot="action" slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </ele-pro-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {
    GetDeptTwoReturningGoodsList,
    GetDeptTwoReturningGoodsDetail
  } from '@/api/DeptReturingGoods';
  export default {
    name: 'DeptTwoGoodsDefReturing',
    data() {
      return {
        // 左侧表格配置
        leftPageSize: 20,
        leftPageSizes: [10, 20, 50, 100],
        leftCurrent: null,
        leftSelection: [],
        leftWhere: {},
        rightWhere: {},
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
              return row.Returning_State === '1' ? '已完成' : '未完成';
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
            prop: 'Specification_Or_Type',
            label: '规格型号',
            width: 120,
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
        }
      };
    },
    methods: {
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
        this.rightReload({
          returningGoodsNumber: this.leftCurrent.Returning_Goods_Number
        });
      },

      // 右侧表格选择变化
      onRightSelectionChange(selection) {
        this.rightSelection = selection;
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
