<template>
  <ele-modal
    top="1vh"
    :destroy-on-close="true"
    width="90%"
    height="80%"
    :visible="visible"
    :close-on-click-modal="false"
    custom-class="ele-dialog-form"
    title="自定义新增"
    @update:visible="updateVisible"
  >
    <div class="ele-body">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <user-search @addKSKS="addKSKSDepartmentalPlanData" @search="reload" />
        <!-- 数据表格 -->
        <ele-pro-table
          ref="table"
          height="500px"
          :row-key="(row) => row.VarID"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          @selection-change="onSelectionChange"
          cache-key="DepaStorageQuery"
        >
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <!-- <el-form-item label="">
              <el-input size="mini" v-model="row.APPLY_QTY"></el-input>
            </el-form-item> -->
            <el-input size="mini" v-model="row.APPLY_QTY"></el-input>
          </template>

          <template v-slot:STOCK_QTY="{ row }">
            <el-tag v-if="row.STOCK_QTY == 0" type="danger">{{
              row.STOCK_QTY
            }}</el-tag>
            <el-tag v-else type="success">{{ row.STOCK_QTY }}</el-tag>
          </template>
        </ele-pro-table>
      </el-card>
      <!-- <div class="ele-footer" style="display: flex;justify-content: center;">
        <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="addKSKSDepartmentalPlanData()">
          确定添加
        </el-button>
      </div> -->

      <!-- 编辑弹窗 -->
      <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
      <!-- 导入弹窗 -->
      <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
    </div>
  </ele-modal>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import UserSearch from './components/user-search.vue';
  import UserEdit from './components/user-edit.vue';
  import { HOME_HP } from '@/config/setting';
  import { GetDeptInStockDetail } from '@/api/KSInventory/DepaStorageQuery';
  import {
    SerachPlanList,
    KeeptListDeta
  } from '@/api/KSInventory/IntroduceUserDefinedTemp';
  export default {
    name: 'IntroduceUserDefinedTemp',
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object,
      IntroduceUserDefinedTempSearch: Object
    },
    components: {
      UserSearch,
      UserEdit
      // UserImport
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
            fixed: 'left',
            reserveSelection: true
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
            prop: 'VAR_REMARK',
            label: '品种备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              if (cellValue == null) {
                cellValue = '无';
              }
              return cellValue;
            }
          },
          // {
          //   columnKey: 'action',
          //   label: '操作',
          //   width: 220,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'STOCK_QTY',
            slot: 'STOCK_QTY',
            align: 'center',
            label: '中心库剩余库存',
            minWidth: 120,
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '材料编码',
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'DEPT_ZDY_VARIETIE_CODE',
            label: '自定义编码',
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150,
            formatter: (_row, _column, cellValue) => {
              if (cellValue == null) {
                cellValue = '未定义';
              }
              return cellValue;
            }
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种全称',
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            sortable: 'custom',
            showOverflowTooltip: true,
            minWidth: 80
          },
          // {
          //   prop: 'BIG_BOX_COUNT',
          //   label: '大包装数量',
          //   width: 80,
          //   align: 'center',
          //   showOverflowTooltip: true
          // },
          // {
          //   prop: 'MIDDLE_PACKAGE_COUNT',
          //   label: '中包装数量',
          //   width: 80,
          //   align: 'center',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'PAG_TYPE',
            label: '包装规格',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Supply_Price',
            label: '结算价',
            width: 100,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return Number(cellValue).toFixed(2);
            }
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业名称',
            width: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '合同供应商',
            width: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'StockQty',
            label: '散货库存',
            width: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_TWO_QTY',
            label: '科室库存',
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ZB',
            label: '是否中标',
            width: 220,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              if (cellValue == 0) {
                return '否';
              } else if (cellValue == 1) {
                return '是';
              } else {
                return '未知';
              }
            }
          },
          {
            slot: 'APPLY_QTY',
            label: '实际申领数量',
            width: 150,
            align: 'center',
            fixed: 'right',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE',
            label: 'VARIETIE_CODE',
            align: 'center',
            showOverflowTooltip: true,
            show: false
          },
          {
            prop: 'APPLY_TEMPLET_MAIN_ID',
            label: 'APPLY_TEMPLET_MAIN_ID',
            align: 'center',
            showOverflowTooltip: true,
            show: false
          },
          {
            prop: 'Enable',
            label: 'Enable',
            align: 'center',
            showOverflowTooltip: true,
            show: false
          },
          {
            prop: 'PLAN_NUMBER',
            label: '申领单',
            align: 'center',
            showOverflowTooltip: true,
            show: false
          }
        ],
        toolbar: false,
        pageSize: 15,
        pageSizes: [15, 50, 100, 200, 9999999],
        pagerCount: 5,
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        isUpdate: false,

        // 添加品种数量
        APPLY_QTY: 0
        // datasource: [],
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        // where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.DeptCode = this.IntroduceUserDefinedTempSearch.PlanDept
          ? this.IntroduceUserDefinedTempSearch.PlanDept
          : this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.PlanNum = this.IntroduceUserDefinedTempSearch.PlanNum;
        let data = SerachPlanList({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: {...where, PlanNum: this.IntroduceUserDefinedTempSearch.PlanNum} });
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
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      addKSKSDepartmentalPlanData() {
        if (!this.selection || this.selection.length == 0) {
          this.$message.warning('请先选择数据');
          return;
        }
        const loading = this.$messageLoading('添加中..');
        this.selection.forEach((element) => {
          element.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
        });
        KeeptListDeta(this.selection)
          .then((res) => {
            this.updateVisible(false);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            loading.close();
          });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      }
    },
    watch: {
      visible(visible) {
        if (visible) {
          if (this.data) {
            this.$util.assignObject(this.form, this.data);
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
          }
        } else {
          // this.$refs.form.clearValidate();
          this.form = { ...this.defaultForm };
        }
      }
    },
    created() {
      // this.getdatasource();
    }
  };
</script>
