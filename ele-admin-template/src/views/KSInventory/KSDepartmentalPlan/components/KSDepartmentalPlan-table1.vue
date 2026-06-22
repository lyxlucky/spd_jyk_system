<template>
  <div v-if="RenderTabel" class="ks-dept-plan-main">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head spd-panel__head--split">
        <span>查询条件</span>
        <span class="spd-panel__head-meta">
          当月-申报总金额:{{ applyPlanSbz }}
          消耗总金额:{{ applyPlanXhz }}
          消耗/计划:{{ applyPlanBl }}
        </span>
      </div>
      <KSDepartmentalPlan-search
        @search="reload"
        @exportData="exportData"
        ref="search"
      />
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">申领计划单列表</div>
      <div class="spd-table-panel__wrap">
        <!-- 数据表格 -->
        <ele-pro-table
          :key="key"
          ref="table"
          class="data-table"
          size="mini"
          border
          stripe
          :reserve-selection="true"
          highlight-current-row
          :row-key="(row) => row.PlanNum"
          :toolbar="false"
          :header-overflow-hidden="false"
          :rowClickChecked="true"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          :needPage="false"
          :height="tableHeight"
          cache-key="KSDepartmentalPlanMainTable"
          @current-change="onCurrentChange"
        >
          <!-- 表头工具栏 -->
          <!-- <template v-slot:toolbar>
        <label
          >当月-申报总金额:{{ applyPlanSbz }}&nbsp;&nbsp;消耗总金额:{{
            applyPlanXhz
          }}&nbsp;&nbsp;消耗/计划:{{ applyPlanBl }}</label
        >
      </template> -->

      <template v-slot:State="{ row }">
        <el-tag size="mini" v-if="row.State == 0" type="primary">新增</el-tag>
        <el-tag size="mini" v-else-if="row.State == 1" type="warning"
          >已提交</el-tag
        >
        <el-tag size="mini" v-else-if="row.State == 2" type="primary"
          >配送中</el-tag
        >
        <el-tag
          size="mini"
          v-else-if="row.State == 5"
          type="primary"
          color="#2ee693"
          >已审核</el-tag
        >

        <el-tag
          size="mini"
          v-else-if="row.State == 6 && row.QUANITY == 0"
          type="success"
          >已审批</el-tag
        >
        <el-tag size="mini" v-else-if="row.State == -6" type="danger"
          >未审批</el-tag
        >
        <el-tag
          size="mini"
          v-else-if="
            row.QUANITY > 0 &&
            row.QUANITY != row.SUM_Apply_Qty &&
            row.State != 10
          "
          type="danger"
          >未收全</el-tag
        >
        <el-tag
          size="mini"
          v-else-if="row.SUM_Apply_Qty == row.QUANITY"
          type="success"
          >已收全</el-tag
        >
        <el-tag
          size="mini"
          v-else-if="row.State == 10"
          type="primary"
          color="#e60000"
          style="color: white"
          >强制结束</el-tag
        >

        <!-- <el-tag
          size="mini"
          v-else-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty &&
            row.State != 6
          "
          type="danger"
          >未收全</el-tag
        >
        <el-tag
          size="mini"
          v-else-if="row.SUM_Apply_Qty == row.QUANITY"
          type="success"
          >已收全</el-tag
        > -->

        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>
      <template v-slot:BZ="{ row }">
        <el-link
          v-if="row.BZ == null || row.BZ === ''"
          type="primary"
          @click="OpenUpdateRemarksBox(row)"
          >无</el-link
        >
        <el-tag v-else type="primary" size="mini" @click="OpenUpdateRemarksBox(row)">{{
          row.BZ
        }}</el-tag>
      </template>
      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm
          class="ele-action"
          title="确定删除？"
          @confirm="remove(row)"
        >
          <template v-slot:reference>
            <el-link
              type="danger"
              size="mini"
              :underline="false"
              v-if="row.State == 0"
              icon="el-icon-delete"
            >
              删除
            </el-link>
          </template>
        </el-popconfirm>
        <el-link
          v-if="row.State == 1"
          type="primary"
          :underline="false"
          icon="el-icon-edit"
          @click="ReturnStateBtn(row)"
        >
          取消提交
        </el-link>
      </template>
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
  import KSDepartmentalPlanSearch from './KSDepartmentalPlan-search.vue';
  import {
    SerachPlanList,
    DeletePlanList,
    SearchHistoryConsumedAndPurchaseDept,
    ReturnInitState,
    ApplyPlanUpdateRemarks
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';
  import { exportToExcel } from '@/utils/excel-util';
  export default {
    name: 'KSDepartmentalPlanTable',
    props: ['IsReload'],
    components: {
      KSDepartmentalPlanSearch
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
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 120,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true,
            className: 'action-col'
          },
          {
            prop: 'SCIENTIFIC_TYPE',
            label: '类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            formatter: (row, column, cellValue) => {
              if (row?.SCIENTIFIC_ID && row.SCIENTIFIC_ID !== 'null') {
                return '科研计划';
              }
              return '普通计划';
            }
          },
          {
            prop: 'PlanNum',
            label: '申领单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },

          {
            // prop: 'State',
            label: '状态',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            slot: 'State'
            // formatter: (row, column, cellValue) => {
            //   if (cellValue === '0') {
            //     return '新增';
            //   } else if (cellValue === '1') {
            //     return '已提交';
            //   } else if (cellValue === '2') {
            //     return '配送中';
            //   } else if (cellValue === '5') {
            //     return '已审核';
            //   } else if (cellValue === '10') {
            //     return '强制结束';
            //   } else if (cellValue === '6' || cellValue === '4') {
            //     return '已审批';
            //   } else {
            //     return '配送中';
            //   }
            // }
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '科室名称',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'REGION_NAME',
            label: '库区',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 75
          },
          {
            prop: 'Operater',
            label: '申领人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'PlanTime',
            label: '申领时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            prop: 'APPROVALMAN',
            label: '审批人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Approval_Time',
            label: '审批时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            prop: 'BZ',
            slot: 'BZ',
            label: '备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'SUM_Apply_Qty',
            label: '申请总数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'QUANITY',
            label: '已收货总数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          }
        ],
        toolbar: false,
        tableHeight: 'calc((100vh - 420px) / 2)',
        pageSize: 9999999,
        pagerCount: 2,
        pageSizes: [2, 10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        // datasource: [],
        data: [],
        applyPlanSbz: 0,
        applyPlanXhz: 0,
        applyPlanBl: '0%',
        key: 0,
        RenderTabel: true
      };
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        // this.RenderTabel = !this.RenderTabel;

        this.reload();
        this.RenderTabel = false;
        // 建议加上 nextTick 微任务
        // 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
        this.$nextTick(function () {
          // 加载
          this.RenderTabel = true;
        });
      });
    },
    methods: {
      getPlanStateText(row) {
        if (row.State == 0) {
          return '新增';
        }
        if (row.State == 1) {
          return '已提交';
        }
        if (row.State == 2) {
          return '配送中';
        }
        if (row.State == 5) {
          return '已审核';
        }
        if (row.State == 6 && row.QUANITY == 0) {
          return '已审批';
        }
        if (row.State == -6) {
          return '未审批';
        }
        if (
          row.QUANITY > 0 &&
          row.QUANITY != row.SUM_Apply_Qty &&
          row.State != 10
        ) {
          return '未收全';
        }
        if (row.SUM_Apply_Qty == row.QUANITY) {
          return '已收全';
        }
        if (row.State == 10) {
          return '强制结束';
        }
        return row.State;
      },
      getSearchWhere(where = {}) {
        var Dept_Two_CodeStr = '';
        var userDeptList = this.$store.state.user.info.userDept;
        for (let i = 0; i < userDeptList.length; i++) {
          Dept_Two_CodeStr =
            Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
        }
        return {
          ...where,
          DeptCode: Dept_Two_CodeStr
        };
      },
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        where = this.getSearchWhere(where);
        let data = SerachPlanList({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          if (
            this.current &&
            Array.isArray(res.result) &&
            res.result.length > 0
          ) {
            let tmp = null;
            res.result.forEach((item, index) => {
              if (this.current.PlanNum == item.PlanNum) {
                tmp = item;
              }
            });
            this.onCurrentChange(tmp);
          }

          return tData;
        });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      exportData(where) {
        const loading = this.$messageLoading('正在导出数据...');
        const exportColumns = [
          {
            prop: 'SCIENTIFIC_TYPE',
            label: '类型',
            excelConfig: {
              formatter: (row) => {
                if (row?.SCIENTIFIC_ID && row.SCIENTIFIC_ID !== 'null') {
                  return '科研计划';
                }
                return '普通计划';
              }
            }
          },
          { prop: 'PlanNum', label: '申领单号', excelConfig: { width: 18 } },
          {
            prop: 'State',
            label: '状态',
            excelConfig: {
              formatter: (row) => this.getPlanStateText(row)
            }
          },
          { prop: 'DEPT_TWO_NAME', label: '科室名称', excelConfig: { width: 18 } },
          { prop: 'REGION_NAME', label: '库区' },
          { prop: 'Operater', label: '申领人' },
          {
            prop: 'PlanTime',
            label: '申领时间',
            excelConfig: {
              width: 20,
              formatter: (row, column, cellValue) => {
                return cellValue
                  ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                  : '';
              }
            }
          },
          { prop: 'APPROVALMAN', label: '审批人' },
          {
            prop: 'Approval_Time',
            label: '审批时间',
            excelConfig: {
              width: 20,
              formatter: (row, column, cellValue) => {
                return cellValue
                  ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                  : '';
              }
            }
          },
          { prop: 'BZ', label: '备注', excelConfig: { width: 20 } },
          { prop: 'SUM_Apply_Qty', label: '申请总数' },
          { prop: 'QUANITY', label: '已收货总数' }
        ];
        SerachPlanList({
          page: 1,
          limit: 9999999,
          where: this.getSearchWhere(where),
          order: {}
        })
          .then((res) => {
            const list = res.result || [];
            if (!list.length) {
              this.$message.warning('没有数据可导出');
              return;
            }
            exportToExcel(list, exportColumns, '申领单列表');
            this.$message.success('导出成功');
          })
          .catch((err) => {
            this.$message.error(err.message || '导出失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      reload2() {
        this.$refs.search.search();
      },
      onDone(res) {
        // console.log('res:', res);
        // 例如选中第一条数据
        if (res.data?.length) {
          this.$refs.table.setCurrentRow(res.data[0]);
        }
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },
      /* 删除数据 */
      remove(row) {
        const loading = this.$loading({ lock: true });
        DeletePlanList(row)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            // this.$refs.table.reRenderTable();
            this.reload();
            this.$forceUpdate();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      GetConsume() {
        var data = {
          deptTwoCode: this.$store.state.user.info.DeptNow.Dept_Two_Code
        };
        SearchHistoryConsumedAndPurchaseDept(data)
          .then((res) => {
            this.applyPlanSbz = res.result[0].Purchase_Cost.toFixed(2);
            this.applyPlanXhz = res.result[0].Consumed_Cost.toFixed(2);
            if (data.result[0].Purchase_Cost > 0) {
              this.applyPlanBl =
                (
                  (data.result[0].Consumed_Cost /
                    data.result[0].Purchase_Cost) *
                  100
                ).toFixed(2) + '%';
            } else {
              this.applyPlanBl = 0 + '%';
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      OpenUpdateRemarksBox(row) {
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.BZ || ''
        })
          .then(({ value }) => {
            const loading = this.$messageLoading('备注提交中..');
            ApplyPlanUpdateRemarks({
              ApplyPlanNum: row.PlanNum,
              Remarks: value
            })
              .then((res) => {
                loading.close();
                this.$message.success('备注成功');
                this.reload();
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err.message || '备注失败');
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消备注'
            });
          });
      },
      ReturnStateBtn(data) {
        // var IDs = data.PlanNum;
        // var IDStr = IDs + ',';
        // IDs.forEach((item) => {
        //   IDStr += item + ',';
        // });
        // IDStr.substring(0, IDStr.length - 1);

        var data2 = {
          IDs: data.PlanNum
        };
        const loading = this.$messageLoading('正在保存。。。');
        ReturnInitState(data2)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.reload();
            // this.$forceUpdate();
            // this.key += 1;
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      }
    },
    watch: {
      IsReload() {
        if (this.IsReload == true) {
          this.reload(); // 调用刷新表格的方法
        }
      }
    },
    created() {
      localStorage.setItem('KSDepartmentalPlanMainTableSize', JSON.stringify('mini'));
      // this.getdatasource();
      this.GetConsume();
    },
    // 取消监听bus事件
    destroyed() {
      // 取消对handleCommand事件的监听
      this.$bus.$off('handleCommand');
    }
  };
</script>

<style scoped>
.ks-dept-plan-main >>> .el-table th .cell {
  white-space: nowrap;
}

.ks-dept-plan-main >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
