<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- 数据表格 -->

      <ele-pro-table
        ref="table"
        height="calc(100vh - 240px)"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :rowClickChecked="true"
        :rowClickCheckedIntelligent="false"
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        cache-key="ApplyOperateTip"
      >
        <template v-slot:toolbar>
          <user-search @exportData="handleNewExportData" @search="reload" />
        </template>
        <!-- 操作列 -->
        <template v-slot:APPLY_QTY="{ row }">
          <el-form-item label="">
            <el-input size="mini" v-model="row.APPLY_QTY"></el-input>
          </el-form-item>
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
</template>

<script>
  import { defineComponent } from 'vue';
  import UserEdit from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/components/user-edit.vue';
  import UserSearch from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/components/user-search.vue';
  import {
    getApplyOperateTip,
    getApplyOperateTipExcel
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import { KeeptListDeta } from '@/api/KSInventory/IntroduceUserDefinedTemp';
  import { BACK_BASE_URL } from '@/config/setting';
  import { utils, writeFile } from 'xlsx';

  export default {
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
          // {
          //   columnKey: 'selection',
          //   type: 'selection',
          //   width: 45,
          //   align: 'center',
          //   fixed: 'left'
          // },
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
          //   width: 220,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'PLAN_NUMBER',
            label: '单号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'PLAN_TIME',
            label: '时间',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
            // formatter: (_row, _column, cellValue) => {
            //   if (cellValue == null) {
            //     cellValue = '未定义';
            //   }
            //   return cellValue;
            // }
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产厂家',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPLY_QTY',
            label: '申请数量',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SEND_QUANITY',
            label: '配送中',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: '',
            label: '未配送',
            width: 80,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return _row.APPLY_QTY - _row.SEND_QUANITY - _row.GET_QUANITY;
            }
          },
          {
            prop: 'GET_QUANITY',
            label: '已收货',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: '',
            label: '未收货',
            width: 80,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return _row.APPLY_QTY - _row.GET_QUANITY;
            }
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            width: 80,
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
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;

        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        where.DEPT_TWO_CODE = DEPT_TWO_CODEStr;
        let data = getApplyOperateTip({ page, limit, where, order }).then(
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
        const loading = this.$messageLoading('添加中..');
        this.selection.forEach((element) => {
          element.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
        });
        KeeptListDeta(this.selection).then((res) => {
          loading.close();
          this.updateVisible(false);
          this.$message.success(res.msg);
        });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },

      handleNewExportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;
        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        const localWhere = {
          ...data,
          DEPT_TWO_CODE: DEPT_TWO_CODEStr
        };
        this.$refs.table.doRequest(({ where, order }) => {
          getApplyOperateTipExcel({
            page: 1,
            limit: 999999,
            where: localWhere,
            order: order
          })
            .then((res) => {
              var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
              window.open(url.replace('/undefined', ''));
            })
            .finally(() => {
              loading.close();
            });
        });
      },

      handleExportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;
        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        const localWhere = {
          ...data,
          DEPT_TWO_CODE: DEPT_TWO_CODEStr
        };
        this.$refs.table.doRequest(({ where, order }) => {
          getApplyOperateTip({
            page: 1,
            limit: 999999,
            where: localWhere,
            order: order
          })
            .then((res) => {
              if (res?.result.length == 0)
                return this.$message.error('没有数据可导出');
              const array = [
                [
                  '单号',
                  '时间',
                  '品种编码',
                  '品种名称',
                  '型号/规格',
                  '生产厂家',
                  '批准文号',
                  '申请数量',
                  '配送中',
                  '未配送',
                  '已收货',
                  '未收货',
                  '单位'
                ]
              ];
              res.result.forEach((d) => {
                array.push([
                  d.PLAN_NUMBER,
                  d.PLAN_TIME,
                  d.VARIETIE_CODE_NEW,
                  d.VARIETIE_NAME,
                  d.SPECIFICATION_OR_TYPE,
                  d.MANUFACTURING_ENT_NAME,
                  d.APPROVAL_NUMBER,
                  d.APPLY_QTY,
                  d.SEND_QUANITY,
                  d.APPLY_QTY - d.SEND_QUANITY - d.GET_QUANITY,
                  d.GET_QUANITY,
                  d.APPLY_QTY - d.GET_QUANITY,
                  d.UNIT
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '查看订单详情.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((e) => {
              this.$message.error(e.message);
            })
            .finally(() => {
              loading.close();
            });
        });
      }
    },
    mounted() {
      // 表格初始化时携带默认查询参数（最近7天）
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 3600 * 1000);
      const endStr =
        endDate.getFullYear() + '-' + pad(endDate.getMonth() + 1) + '-' + pad(endDate.getDate());
      const startStr =
        startDate.getFullYear() + '-' + pad(startDate.getMonth() + 1) + '-' + pad(startDate.getDate());
      const initWhere = {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '',
        STORAGE: '',
        TYPE: '',
        PLAN_NUMBER: '',
        PLAN_TIME_START: startStr,
        PLAN_TIME_END: endStr,
        PLAN_TIME_RANGE: [startStr, endStr]
      };
      this.reload(initWhere);
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

<style scoped lang="scss">
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
</style>
