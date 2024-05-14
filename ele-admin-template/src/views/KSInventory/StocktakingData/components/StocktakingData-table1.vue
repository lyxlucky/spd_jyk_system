<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table :key="key" highlight-current-row @current-change="onCurrentChange" ref="table" :height="defaultHeight"
      :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns"
      :datasource="datasource" :selection.sync="selection" @fullscreen-change="screenChange()" cache-key="StocktakingDataTabel">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <StocktakingDataSearch @search="reload" />
      </template>

      <!-- 操作列 -->
      <template v-slot:ACTION="{ row }">
        <el-button size="mini" :disabled="row.SUBMIT == 1" type="primary" icon="el-icon-check" class="ele-btn-icon"
          @click="submitItem(row)">提交</el-button>
        <el-button size="mini" :disabled="row.SUBMIT == 1" type="danger" icon="el-icon-delete-solid"
          class="ele-btn-icon" @click="deleteItem(row)">删除</el-button>
      </template>

      <!-- 操作列 -->
      <template v-slot:PC_PERCENT="{ row }">
        <el-tag size="small" v-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) >= 0.9" type="success">{{
          numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
        <el-tag size="small"
          v-else-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) >= 0.8 && parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) < 0.9"
          type="warning">{{ numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
        <el-tag size="small" v-else-if="parseFloat(row.PC_COUNT / row.COUNT).toFixed(2) < 0.8" type="danger">{{
          numberToPercent(row.PC_COUNT / row.COUNT) }}</el-tag>
        <el-tag size="small" v-else type="danger">{{ numberToPercent(0) }}</el-tag>
      </template>

      <!-- 状态列 -->
      <template v-slot:STATUS="{ row }">
        <el-tag size="small" v-if="row.SUBMIT == 1" type="success">{{ "已提交" }}</el-tag>
        <el-tag size="small" v-else type="warning">{{ "暂未提交" }}</el-tag>
      </template>

    </ele-pro-table>
  </div>
</template>

<script>
import { numberToPercent } from '@/utils/number-percent';
import StocktakingDataSearch from './StocktakingData-search.vue';
import {
  SerachPlanList,
  DeletePlanList,
  SearchHistoryConsumedAndPurchaseDept,
  ReturnInitState,
  submitStockingDataItem,
  deleteStockingDataItem
} from '@/api/KSInventory/KSDepartmentalPlan';

import { GetStockDataMain, GetStockDataMainAll } from '@/api/KSInventory/StocktakingData';
export default {
  name: 'StocktakingData',
  props: ['IsReload'],
  components: {
    StocktakingDataSearch,
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
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
          prop: 'GENERATE_MAN',
          label: '生成人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '生成科室',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'COUNT',
          label: '库存数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'PC_COUNT',
          label: '盘存数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          slot: 'PC_PERCENT',
          label: '盘存率',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          slot: 'STATUS',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          slot: 'ACTION',
          label: '操作',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
      ],
      toolbar: false,
      pageSize: 2,
      pagerCount: 2,
      pageSizes: [2, 5, 10, 20, 50, 100, 9999999],
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
      defaultHeight: '17vh'
    };
  },
  mounted() {
    // this.$bus.$on('handleCommand', (data) => {
    //   this.reload();
    // });
  },
  methods: {
    numberToPercent,
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetStockDataMainAll({ page, limit, where, order }).then((res) => {
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
    },
    submitItem(data) {
      this.$confirm('确定要提交吗？', '提示', {
        type: 'warning'
      }).then(() => {
        submitStockingDataItem(data).then((res) => {
          this.$message.success(res.msg);
          this.reload();
          this.$forceUpdate();
        }).catch((err) => {
          this.$message.error(err);
        });
      })
    },
    deleteItem(data) {
      this.$confirm("确定要删除嘛？", "提示", {
        type: "warning"
      }).then(() => {
        deleteStockingDataItem(data).then((res) => {
          this.$message.success(res.msg);
          this.reload();
          this.$forceUpdate();
        }).catch((err) => {
          this.$message.error(err);
        });
      })
    },
    screenChange() {
      if(this.defaultHeight == '17vh'){
        this.defaultHeight = window.innerHeight - 200 + 'px';
        this.$refs.table.reload({ page: 1,limit: 20 })
      }else{
        this.defaultHeight = '17vh'
        this.$refs.table.reload({ page: 1,limit: 2 })
      }
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
    // this.$bus.$off('handleCommand');
  }
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}
</style>