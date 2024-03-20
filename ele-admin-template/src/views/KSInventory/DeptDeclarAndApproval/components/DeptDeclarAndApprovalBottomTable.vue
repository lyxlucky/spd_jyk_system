<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table ref="table" :toolStyle="toolStyle" height="40vh" highlight-current-row :stripe="true"
      :rowClickChecked="true" :rowClickCheckedIntelligent="false" :pageSize="pageSize" :pageSizes="pageSizes"
      :columns="columns" :datasource="datasource" :initLoad="false" :selection.sync="selection" @selection-change="onSelectionChange"
      cache-key="DeptDeclarAndApprovalBottomTable">

      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <DeptDeclarAndApprovalBottomTableSearch @search="search" @ClickReload="ClickReload" @deleteItem="deleteItem"
          :DeptDeclarAndApprovalTopTableCurrent='DeptDeclarAndApprovalTopTableCurrent' :selection="selection"
          :TopTableSelection="TopTableSelection" />
      </template>

      <template v-slot:DEPT_ZDY_VARIETIE_CODE="{ row }">
        <el-tag v-if="row.DEPT_ZDY_VARIETIE_CODE == null" type="danger">未定义</el-tag>
        <el-tag v-else type="ifno">{{ row.DEPT_ZDY_VARIETIE_CODE }}</el-tag>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import {
  getDeptDeclarDetailList,
  deleteDeptDeclarDetailItem,
  searchDeptDeclarDetailList
} from "@/api/KSInventory/DeptDeclarAndApproval"
import DeptDeclarAndApprovalBottomTableSearch from "@/views/KSInventory/DeptDeclarAndApproval/components/DeptDeclarAndApprovalBottomTableSearch"
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'DeptDeclarAndApprovalBottomTable',
  props: ['DeptDeclarAndApprovalTopTableCurrent', "TopTableSelection"],
  components: {
    DeptDeclarAndApprovalBottomTableSearch: DeptDeclarAndApprovalBottomTableSearch
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
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'left',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'left',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'left',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'PRICE',
          label: '中标价',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'PLAN_NUM',
          label: '计划数量',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'ID',
          label: '序号',
          align: 'left',
          showOverflowTooltip: true,
          fixed: 'left'
        },
      ],
      toolbar: false,
      toolStyle: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      },
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      datasourceList: [],
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = getDeptDeclarDetailList({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.datasourceList = res.result;
          this.$store.commit('user/setDeptDeclarAndApprovalMainId', where.DEPT_PLAN_NEW_MAIN_ID);
          return tData;
        }
      );
      return data;
    },
    deleteItem(data) {
      return new Promise((resolve, reject) => {
        this.$confirm('确定要剔除吗?', '提示', { type: 'warning' }).then(() => {
          deleteDeptDeclarDetailItem(data).then((res)=>{
            this.$message.success(res.msg);
            this.reload()
          })
        }).catch(() => {
          reject();
        });
      });
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },

    /* 刷新表格 */
    search(where) {
      where.DEPT_ONE_CODE = this.DeptDeclarAndApprovalTopTableCurrent.DEPT_ONE_CODE
      where.PLAN_MONTH_TIME = this.DeptDeclarAndApprovalTopTableCurrent.PLAN_MONTH_TIME
      where.DEPT_PLAN_NEW_MAIN_ID = this.$store.state.user.DeptDeclarAndApprovalMainId
      this.$refs.table.reload({ page: 1, where: where });
    },
    ClickReload(IsReload) {
      this.$emit('IsReload', IsReload);
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
  },
  computed: {
    DeptDeclarAndApprovalTopTableSearch() {
      return this.DeptDeclarAndApprovalTopTableCurrent;
    }
  },
  watch: {
    DeptDeclarAndApprovalTopTableCurrent() {
      this.$forceUpdate();
      if (this.DeptDeclarAndApprovalTopTableCurrent) {
        var where = {
          DEPT_PLAN_NEW_MAIN_ID: this.DeptDeclarAndApprovalTopTableCurrent.ID,
          PLAN_MONTH_TIME: this.DeptDeclarAndApprovalTopTableCurrent.PLAN_MONTH_TIME,
          DEPT_ONE_CODE: this.DeptDeclarAndApprovalTopTableCurrent.DEPT_ONE_CODE,
        };
        this.$store.commit('user/setDeptDeclarAndApprovalMainId', where.DEPT_PLAN_NEW_MAIN_ID);
      }
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // this.getdatasource();
  },
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}
</style>