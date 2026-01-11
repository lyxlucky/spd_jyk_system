<template>
  <ele-modal
    :destroy-on-close="true"
    width="1800px"
    :centered="true"
    :visible="visible"
    :close-on-click-modal="true"
    custom-class="ele-dialog-form"
    title="计划收货情况"
    label="计划收货情况"
    @update:visible="updateVisible"
  >
    <div class="">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <!-- 数据表格 -->
        <user-search @exportData="handleExportData" @search="reload" />
        <ele-pro-table
          ref="table"
          height="600px"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :rowClickChecked="true"
          :rowClickCheckedIntelligent="false"
          :selection.sync="selection"
          @selection-change="onSelectionChange"
          cache-key="KSDeptConsumpHZTip"
        >
          <template v-slot:toolbar>
            <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
            @click="handleExportData"
            >导出</el-button
          >
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
  </ele-modal>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import UserSearch from './components/user-search.vue';
  import UserEdit from './components/user-edit.vue';
  import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
  import {
    getFileNameFromResponseHeaders,
    downloadBlob
  } from '@/utils/downloadfile';
  import {
    SearchDeptHz,
  } from '@/api/KSInventory/KSDeptConsumption';
  
  export default {
    name: 'KSDeptConsumpHZTip',
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

            prop: 'SPD_COST_DEPT_NAME',
            label: '成本科室名称',
            width: 90,
            sort: true
          },
          {

                prop: 'Varietie_Code_New',
                label: '品种编码',
                width: 90,
                sort: true
            },
             {

                prop: 'Varietie_Name',
                label: '品种全称',
                width: 250,
            }, 
            {

                prop: 'Specification_Or_Type',
                label: '型号/规格',
                width: 200,
            }, 
            {
                align: 'center',
                prop: 'Unit',
                label: '单位',
                width: 45,
            },
             {

                prop: 'Manufacturing_Ent_Name',
                label: '生产企业名称',
                width: 220,
            }, 
            {

                prop: 'Supplier_Name',
                label: '供应商',
                width: 200,
            }, 
            {
                prop: 'Approval_Number',
                label: '批准文号',
                width: 140,
            },
            {
                prop: 'PROVINCE_PLATFORM_CODE',
                label: '药交ID',
                width: 140,
            },
             {
                prop: 'Goods_Qty',
                label: '消耗数量',
                width: 120
            }, 
            {
                prop: 'Supply_Price',
                label: '单价',
                width: 140,
            }, 
            {
                prop: 'Cost',
                label: '金额',

                width: 100
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

        where = this.data;
        var DEPT_TWO_CODEStr = [];
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr.push(Dept_Two_CodeArray[i].Dept_Two_Code);
        }
        where.DEPT_TWO_CODE = DEPT_TWO_CODEStr;
        console.log(where);
        let data = SearchDeptHz({ page, limit, where, order }).then(
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
      
      onSelectionChange(selection) {
        this.selection = selection;
      },

      // handleNewExportData(data) {
      //   const loading = this.$messageLoading('正在导出数据...');
      //   var Dept_Two_CodeArray = this.$store.state.user.info.userDept;
      //   var DEPT_TWO_CODEStr = '';
      //   for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
      //     DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
      //   }
      //   const localWhere = {
      //     ...data,
      //     DEPT_TWO_CODE: DEPT_TWO_CODEStr
      //   };
      //   this.$refs.table.doRequest(({ where, order }) => {
      //     SearchDeptHzKsExcel({
      //       page: 1,
      //       limit: 999999,
      //       where: localWhere,
      //       order: order
      //     })
      //       .then((res) => {
      //         var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
      //         window.open(url.replace('/undefined', ''));
      //       })
      //       .finally(() => {
      //         loading.close();
      //       });
      //   });
      // },

      handleExportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;

        var DEPT_TWO_CODEStr = [];
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr.push(Dept_Two_CodeArray[i].Dept_Two_Code);
        }
        const localWhere = {
          ...this.data,
          DEPT_TWO_CODE: DEPT_TWO_CODEStr
        };
        this.$refs.table.doRequest(({ where, order }) => {
          SearchDeptHz({
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
                 '品种编码',
                  '计费编码',
                  '品种全称',
                  '型号/规格',
                  '单位',
                  '生产企业名称',
                  '供应商',
                  '批准文号',
                  '药交ID',
              //    '单价',
                  '消耗数量',
                //  '金额'
                ]
              ];
              res.result.forEach((d) => {
                array.push([
                  d.Varietie_Code_New,
                      d.CHARGING_CODE,
                      d.Varietie_Name,
                      d.Specification_Or_Type,
                      d.Unit,
                      d.Manufacturing_Ent_Name,
                      d.Supplier_Name,
                      d.Approval_Number,
                      d.PROVINCE_PLATFORM_CODE,
                //      d.Supply_Price,
                      d.Goods_Qty,
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '查看汇总.xlsx'
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
  ::v-deep(.el-card__body) {
    padding: 0;
  }
</style>