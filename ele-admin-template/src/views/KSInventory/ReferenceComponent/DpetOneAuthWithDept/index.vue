<template >
  <ele-modal :destroy-on-close="true" width="1600px" :centered="true" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="科室目录" @update:visible="updateVisible">
    <div class="">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <!-- 数据表格 -->
        <user-search @search="reload" @exportData="exportData" @deleteIds="deleteIds" @cancelAuthorization="cancelAuthorization" />
        <ele-pro-table ref="table" height="600px" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :rowClickChecked="true" :rowClickCheckedIntelligent="false" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="dpetOneAuthWithDept">
          <template v-slot:toolbar>
          </template>
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <el-form-item label="">
              <el-input v-model="row.APPLY_QTY"></el-input>
            </el-form-item>
          </template>

          <template v-slot:Enable="{ row }">
            <el-form-item label="">
              <el-button size="small" type="danger" class="ele-btn-icon" @click="deleteOneAuthVarWithDeptItemBtn(row)">
                删除
              </el-button>
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

import {
  getOneAuthVarWithDept,
  deleteOneAuthVarWithDeptItem,
  deleteOneAuthVarWithDeptItems,
  cancelOneAuthVarWithDept  
} from '@/api/KSInventory/KSDepartmentalPlan';
import {
  SerachPlanList,
  KeeptListDeta
} from '@/api/KSInventory/IntroduceUserDefinedTemp';
export default {
  name: 'dpetOneAuthWithDept',
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
          fixed: 'left'
        },
        {
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
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'CLINICAL_USE_SAFETY_LEVEL',
          label: '临床使用安全级别',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
          formatter: (row, column, cellValue) => {
            if(cellValue == '1'){
              cellValue = '一级';
            }else if(cellValue == '2'){
              cellValue = '二级';
            }else if(cellValue == '3'){
              cellValue = '三级';
            }
            return cellValue;
          }
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: 'custom',
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
          prop: 'YG_CODE',
          label: '阳光产品码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          minWidth: 160,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Unit',
          label: '单位',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Price',
          label: '中标价',
          width: 80,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (row, column, cellValue) => {
            return Number(cellValue).toFixed(2);
          }
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '批准文号',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Dept_One_Name',
          label: '科室名称',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        }
        // {
        //   slot: 'Enable',
        //   label: '操作',
        //   width: 120,
        //   align: 'center',
        //   showOverflowTooltip: true
        // }
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
      // console.log(this.$store.state.user.info);
      // var Dept_Two_CodeArray = this.$store.state.user.info.userDept;

      // var DEPT_TWO_CODEStr = '';
      // for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
      //   DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
      // }
      where.Dept_Two_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = getOneAuthVarWithDept({ page, limit, where, order }).then(
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
    },  // 取消授权
   cancelAuthorization() {
  if (this.selection.length === 0) {
    this.$message.warning('请选中要操作的数据');
    return;
  }
  this.$confirm('确认要取消授权此数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = this.$messageLoading('取消授权中...');
    let Varietie_Code = '';
    let Dept_One_Code = '';
    this.selection.forEach(item => {
      Varietie_Code += item.Varietie_Code + ',';
      Dept_One_Code += item.Dept_One_Code + ',';
    });
    Varietie_Code = Varietie_Code.slice(0, -1);
    Dept_One_Code = Dept_One_Code.slice(0, -1);

    // 调用修改后的 API，只传递业务参数
    cancelOneAuthVarWithDept({ Varietie_Code, Dept_One_Code })
      .then(res => {
        loading.close();
        this.$message.success(res.msg || '取消授权成功');
        this.reload(); // 刷新表格
      })
      .catch(err => {
        loading.close();
        this.$message.error(err.message || '操作失败');
      });
  }).catch(() => {
    // 用户取消确认，不做处理
  });
}
    ,
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.Dept_Two_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        getOneAuthVarWithDept({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '启用状态',
                '品种（材料）编码',
                '计费编码',
                '阳光产品码',
                '注册证名称',
                '品种名称',
                '型号/规格',
                '生产企业名称',
                '单位',
                '中标价',
                '批准文号',
                '科室名称'
              ]
            ];
            res.result.forEach((d) => {
              if (d.Enable == '1') {
                d.Enable = '启用';
              } else if (d.Enable == '0') {
                d.Enable = '冻结';
              }

              array.push([
                d.Enable.replace('1', '启用').replace('0', '冻结'),
                d.Varietie_Code_New,
                d.CHARGING_CODE,
                d.YG_CODE,
                d.PROD_REGISTRATION_NAME,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Manufacturing_Ent_Name,
                d.Unit,
                d.Price,
                d.APPROVAL_NUMBER,
                d.Dept_One_Name
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室目录目录.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    deleteOneAuthVarWithDeptItemBtn(row) {
      console.log(row);
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            ID: row.Varietie_Code
          };
          deleteOneAuthVarWithDeptItem(data).then((res) => {
            this.$message({
              type: 'success',
              message: `${res.msg}！`
            });
            this.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteIds() {
      const loading = this.$messageLoading('删除中..');
      var ID = '';
      this.selection.forEach((item) => {
        ID += item.Varietie_Code + ',';
      });
      ID.substring(0, ID.length - 1);
      var data = {
        ID
      };
      deleteOneAuthVarWithDeptItems(data)
        .then((res) => {
          loading.close();
          this.reload();
          // var where = {
          //   PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          // };
          // this.$emit('search', where);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
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