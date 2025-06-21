<template>
  <div class="ele-body" v-if="RenderTabel">
    <!-- 数据表格 -->
    <ele-pro-table
      :key="key"
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.PlanNum"
      @current-change="onCurrentChange"
      ref="table"
      height="18vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :needPage="false"
      :toolkit="['reload', 'size', 'columns']"
      cache-key="KSInventoryBasicDataTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <label
          >当月-申报总金额:{{ applyPlanSbz }} 消耗总金额:{{
            applyPlanXhz
          }}
          消耗/计划:{{ applyPlanBl }}</label
        >
        <KSDepartmentalPlan-search @search="reload" ref="search" />
      </template>

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
        <el-button
          v-if="row.State == 1"
          size="mini"
          type="primary"
          icon="el-icon-edit"
          class="ele-btn-icon"
          @click="ReturnStateBtn(row)"
        >
          取消提交</el-button
        >
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
  import KSDepartmentalPlanSearch from './KSDepartmentalPlan-search.vue';
  import {
    SerachPlanList,
    DeletePlanList,
    SearchHistoryConsumedAndPurchaseDept,
    ReturnInitState
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';
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
            fixed: 'right'
          },
          {
            prop: 'PlanNum',
            label: '申领单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'Operater',
            label: '申领人',

            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
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
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        var Dept_Two_CodeStr = '';
        var userDeptList = this.$store.state.user.info.userDept;
        for (let i = 0; i < userDeptList.length; i++) {
          Dept_Two_CodeStr =
            Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
        }
        where.DeptCode = Dept_Two_CodeStr;
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
  .ele-body {
    padding: 0px;
  }
</style>
