<template >
  <ele-modal :destroy-on-close="true" width="90%" height="80%" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="根据手术排期创建" @update:visible="updateVisible">
    <div class="ele-body">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <user-search @addKSKS="addKSKSDepartmentalPlanData" @search="reload" />
        <!-- 数据表格 -->
        <!-- :rowClickChecked="true" :rowClickCheckedIntelligent="false" -->
        <ele-pro-table ref="table" height="500px" :row-key="(row) => row.VarID" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" :rowClickChecked="true" :rowClickCheckedIntelligent="false" @selection-change="onSelectionChange" cache-key="DepaStorageQuery">
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <el-form-item label="">
              <el-input size="mini" type="number" v-model="row.APPLY_QTY"></el-input>
            </el-form-item>
          </template>
          <template v-slot:REMARK="{ row }">
            <el-form-item label="">
              <el-input size="mini" v-model="row.REMARK"></el-input>
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
import { AddNaxtDayApplyPlanDelBatch } from '@/api/KSInventory/OperaSchedulingManagement';
import { GetSurgicalScheduling } from '@/api/KSInventory/SurgicalScheduling';
import { AddNaxtDayApplyPlanMain } from '@/api/KSInventory/OperaSchedulingManagement';
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
    SurgicalSchedulingSearch: Object
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
          prop: 'ST_ID',
          label: '视图唯一ID',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'HOSPITALIZATION_NUMBER',
          label: '住院号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'HOSPITALIZATION_TIMES',
          label: '住院次数',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SURGICAL_NAME',
          label: '手术名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SURGICAL_ID',
          label: '手术名称ID',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'SURGICAL_DATE_STR',
          label: '手术日期',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SURGICAL_TIME_STR',
          label: '手术时间',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SURGICAL_ROOM',
          label: '手术间号',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SURGICAL_DEPT',
          label: '手术科室',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SURGICAL_DEPT',
          label: '手术科室编码',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'WARD_NAME',
          label: '病区名',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'WARD_CODE',
          label: '病区编码',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'EXECUTE_DEPT_NAME',
          label: '执行科室',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'EXECUTE_DEPT_CODE',
          label: '执行科室编码',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SURGICAL_DATE',
          label: '手术时间',
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
      let data = GetSurgicalScheduling({ page, limit, where, order }).then(
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
      // where.ID = this.IntroduceUserDefinedTempSearch.ID;
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
      // console.log(this.IntroduceUserDefinedTempSearch)
      // console.log(this.selection)
      // this.selection.forEach((element) => {
      //   element.ID = this.IntroduceUserDefinedTempSearch.ID;
      // });

      const loading = this.$messageLoading('添加中..');
      console.log(this.selection);
      this.selection.forEach((element) => {
        var data = {
          SURGICAL_PLACE: element.SURGICAL_PLACE,
          SURGICAL_ROOM: element.SURGICAL_ROOM,
          REMARK: element.REMARK,
          SURGICAL_SCHEDULING_ID: element.ST_ID,
          CREATE_MAN: this.$store.state.user.info.Nickname
        };
        AddNaxtDayApplyPlanMain(data)
          .then((res) => {
            loading.close();
            this.updateVisible(false);
            this.$message.success(res.msg);
            this.$emit("reload")
          })
          .catch((res) => {
            loading.close();
            this.$message.error(res.msg);
          });
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
