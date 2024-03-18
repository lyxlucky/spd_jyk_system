<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table :key="key" highlight-current-row @current-change="onCurrentChange" ref="table" height="12vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="StocktakingDataTabel">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <StocktakingDataSearch @search="reload" />
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="remove(row)">
          <template v-slot:reference>
            <el-link type="danger" :underline="false" v-if="row.State==0" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
        <el-button v-if="row.State!=0" size="small" type="primary" class="ele-btn-icon" @click="ReturnStateBtn(row)"> 取消提交</el-button>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import StocktakingDataSearch from './StocktakingData-search.vue';
import {
  SerachPlanList,
  DeletePlanList,
  SearchHistoryConsumedAndPurchaseDept,
  ReturnInitState
} from '@/api/KSInventory/KSDepartmentalPlan';

import { GetStockDataMain } from '@/api/KSInventory/StocktakingData';
export default {
  name: 'StocktakingData',
  props: ['IsReload'],
  components: {
    StocktakingDataSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'GENERATE_DATE',
          label: '生成日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM');
          }
        },
        {
          prop: 'GENERATE_MAN',
          label: '生成人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ],
      toolbar: false,
      pageSize: 2,
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
      // datasource: [],
      data: [],
      applyPlanSbz: 0,
      applyPlanXhz: 0,
      applyPlanBl: '0%',
      key: 0
    };
  },
  mounted() {
    this.$bus.$on('handleCommand', (data) => {
      this.reload();
    });
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetStockDataMain({ page, limit, where, order }).then((res) => {
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
      this.$refs.table.reload({ page: 1, where: where });
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
      // console.log(current);
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
                (data.result[0].Consumed_Cost / data.result[0].Purchase_Cost) *
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
          // this.reload();
          // this.$forceUpdate();
          this.key += 1;
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