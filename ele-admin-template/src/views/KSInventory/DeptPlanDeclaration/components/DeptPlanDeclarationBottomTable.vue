<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table ref="table" :toolStyle="toolStyle" height="40vh" :toolkit="[]" highlight-current-row :stripe="true"
      :rowClickChecked="true" :rowClickCheckedIntelligent="false" :pageSize="pageSize" :pageSizes="pageSizes"
      :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange"
      cache-key="DeptPlanDeclarationBottomTable">

      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <DeptPlanDeclarationBottomTableSearch @search="reload" @ClickReload="ClickReload"
          :DeptPlanDeclarationTopTableCurrent='DeptPlanDeclarationTopTableCurrent' :selection="selection"
          @showEditReoad="showEditReoad" :datasourceList="datasourceList" @exportData="exportData"
          @exportPrintSheet="exportPrintSheet" @deleteBottomTableItems="deleteBottomTableItems"
          @excelBottomTable="ExcelBottomPlanTable" :TopTableSelection="TopTableSelection"
          @addPlanItemDone="reload" />
      </template>

      <!-- <template v-slot:DEPT_ZDY_VARIETIE_CODE="{ row }">
        <el-tag v-if="row.DEPT_ZDY_VARIETIE_CODE == null" type="danger">未定义</el-tag>
        <el-tag v-else type="ifno">{{ row.DEPT_ZDY_VARIETIE_CODE }}</el-tag>
      </template> -->
    </ele-pro-table>
  </div>
</template>

<script>
import DeptPlanDeclarationBottomTableSearch from './DeptPlanDeclarationBottomTableSearch.vue';
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { utils, writeFile } from 'xlsx';
import {
  UpdateApplyPlanBZ
} from '@/api/KSInventory/KSDepartmentalPlan';
import {
  getDeptPlanBottomTableData,
  ExcelDeptPlanTableBottom,
  ExcelPrintDeptPlanTableBottom,
  deleteDeptPlanBottomTableDataItem,
  ExceTablePlan
} from '@/api/KSInventory/DeptPlanDeclaration';
export default {
  name: 'DeptPlanDeclarationBottomTable',
  props: ['DeptPlanDeclarationTopTableCurrent', "TopTableSelection"],
  components: {
    DeptPlanDeclarationBottomTableSearch: DeptPlanDeclarationBottomTableSearch
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
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        // {
        //   prop: 'DEPT_ZDY_VARIETIE_CODE',
        //   label: '自定义编码',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   fixed: 'left',
        //   slot: "DEPT_ZDY_VARIETIE_CODE"
        // },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
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
      let data = getDeptPlanBottomTableData({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.datasourceList = res.result;
          this.$store.commit('user/setDeptPlanNewMainId', where.DEPT_PLAN_NEW_MAIN_ID);
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    ClickReload(IsReload) {
      this.$emit('IsReload', IsReload);
    },
    remove(row) {
      console.log(row);
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          DEPT_PLAN_NEW_MAIN_ID: this.DeptPlanDeclarationTopTableCurrent.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    OpenUpApplyPlanBZBox(ID) {
      this.$prompt('请输入备注信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          const loading = this.$messageLoading('备注提交中..');
          var data = {
            ID,
            REMARK: value
          };
          UpdateApplyPlanBZ(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '备注成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
            loading.close();
            this.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消备注'
          });
        });
    },
    exportData() {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        ExcelDeptPlanTableBottom({
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '序号',
                '品种编码',
                // '自定义编码',
                '品种名称',
                '规格型号',
                '单位',
                '中标价',
                '计划数量',
                '注册证号',
                '生产企业',
                '备注',
              ]
            ];
            res.result.forEach((d) => {
              if (d.DEPT_ZDY_VARIETIE_CODE == null) {
                d.DEPT_ZDY_VARIETIE_CODE = '未定义';
              }
              array.push([
                d.ID,
                d.VARIETIE_CODE_NEW,
                // d.DEPT_ZDY_VARIETIE_CODE,
                d.VARIETIE_NAME,
                d.SPECIFICATION_OR_TYPE,
                d.UNIT,
                d.PRICE,
                d.PLAN_NUM,
                d.APPROVAL_NUMBER,
                d.MANUFACTURING_ENT_NAME,
                d.REMARK,
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室计划明细.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
    exportPrintSheet() {
      ExcelPrintDeptPlanTableBottom({
        where: this.where,
      }).then((res) => {
        var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
        window.open(url.replace('/undefined', ''));
      })

    },
    deleteBottomTableItems(data) {
      deleteDeptPlanBottomTableDataItem(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.reload();
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    //导出计划表
    ExcelBottomPlanTable(data) {
      ExceTablePlan(data).then((res) => {
        var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
        window.open(url.replace('/undefined', ''));
      }).catch((e) => {
        this.$message.error(e.message);
      }); 
    }
  },
  computed: {
    DeptPlanDeclarationTopTableSearch() {
      return this.DeptPlanDeclarationTopTableCurrent;
    }
  },
  watch: {
    DeptPlanDeclarationTopTableSearch() {
      this.$forceUpdate();
      if (this.DeptPlanDeclarationTopTableCurrent) {
        var where = {
          DEPT_PLAN_NEW_MAIN_ID: this.DeptPlanDeclarationTopTableCurrent.ID
        };
        this.$store.commit('user/setDeptPlanNewMainId', where.DEPT_PLAN_NEW_MAIN_ID);
      }
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // this.getdatasource();
  },
  mounted() {
  }
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}
</style>