<template >
  <ele-modal width="1600px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="在用目录" @update:visible="updateVisible">
    <div class="ele-body">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <!-- 数据表格 -->
        <ele-pro-table ref="table" height="600px" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :rowClickChecked="true" :rowClickCheckedIntelligent="false" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="VarietyDataLzhLook">
          <template v-slot:toolbar>
            <user-search @search="reload" :selection='selection' />
          </template>
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <el-form-item label="">
              <el-input v-model="row.APPLY_QTY"></el-input>
            </el-form-item>
          </template>
          <template v-slot:Varietie_Code_New="{  }">
            <el-tag type="info">图片</el-tag>
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

import { QueryPageLayUIByJYK } from '@/api/KSInventory/KSDepartmentalPlan';
import {
  SerachPlanList,
  KeeptListDeta
} from '@/api/KSInventory/IntroduceUserDefinedTemp';
export default {
  name: 'VarietyDataLzhLook',
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
          slot: 'Varietie_Code_New',
          label: '图片',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
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
          prop: 'manufacturing_ent_name',
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
          showOverflowTooltip: true
        },
        {
          prop: 'Approval_Number',
          label: '批准文号',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        // {
        //   prop: 'OLD_PROD_REGISTRATION_CODE',
        //   label: '原注册证',
        //   width: 150,
        //   align: 'center',
        //   showOverflowTooltip: true
        // },
        {
          prop: 'SOURCE_FROM',
          label: '来源',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
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
      // console.log(this.$store.state.user.info.userDept);
      // var Dept_Two_CodeArray = this.$store.state.user.info.userDept;

      // var DEPT_TWO_CODEStr = '';
      // for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
      //   DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
      // }
      // where.DEPT_TWO_CODE = DEPT_TWO_CODEStr;
      let data = QueryPageLayUIByJYK({ page, limit, where, order }).then(
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
