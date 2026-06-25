<template>
  <div v-if="RenderTabel" class="lr-jyk-instrument-main">
    <template>

      <el-dialog title="二维码" :visible.sync="dialogVisible" width="30%">
        <div style="display: flex;justify-content: center;">
          <vue-qr :text="config.text" :size="200">
          </vue-qr>
        </div>
      </el-dialog>

    </template>
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />

    <!-- 数据表格 -->
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <!-- 表头工具栏 -->
      <!-- 搜索表单 -->
      <LrJykInstrument-search @search="reload" />
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">仪器列表</div>
      <div class="spd-table-panel__wrap">
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
          :rowClickChecked="true"
          :toolbar="false"
          :header-overflow-hidden="false"
          :height="tableHeight"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="LrJykInstrumentMainTable"
          @current-change="onCurrentChange"
        >
          <!-- 操作列 -->
          <template v-slot:action="{ row }">
            <el-link type="primary" :underline="false" @click="openScanningBinding(row)">扫码绑定</el-link>
            <el-link type="primary" :underline="false" style="margin-left: 8px" @click="WachthQRCode(row)">查看二维码</el-link>
          </template>
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
import LrJykInstrumentSearch from './LrJykInstrument-search.vue';
import {
  SerachPlanList,
  DeletePlanList,
  SearchHistoryConsumedAndPurchaseDept,
  ReturnInitState
} from '@/api/KSInventory/KSDepartmentalPlan';
import { GetLrJykInstrument } from '@/api/KSInventory/LrJykInstrument';
import UserEdit from './user-edit.vue';
import vueQr from 'vue-qr';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['IsReload'],
  components: {
    LrJykInstrumentSearch,
    UserEdit,
    vueQr
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
          columnKey: 'action',
          label: '操作',
          width: 160,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          className: 'action-col'
        },
        {
          prop: 'ID',
          label: 'ID',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 45
        },
        {
          prop: 'INSTRUMENT_CODE',
          label: '代码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'INSTRUMENT_NAME',
          label: '系统仪器名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'WORKING_GROUP',
          label: '工作组',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        }
      ],
      paginationStyle: {
        height: '18px',
        padding: '0px 0px 5px 0px',
        'margin-top': '-5px'
      },
      dialogVisible: false,
      // 二维码
      config: {
        text: '' //二维码内容,编码格式默认使用base64
      },
      toolbar: false,
      pageSize: 2,
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
      tableHeight: '30vh',
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
      let data = GetLrJykInstrument({ page, limit, where, order }).then(
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
    openScanningBinding(row) {
      this.current = row;
      this.showEdit = true;
    },
    WachthQRCode(row) {
      this.dialogVisible = true;
      let text = row.INSTRUMENT_CODE + '/' + row.INSTRUMENT_NAME || '信息为空';
      this.config.text = text;
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
    // ele-pro-table 初始化优先级：localStorage[cacheKey+Size] > size 属性
    localStorage.setItem('LrJykInstrumentMainTableSize', JSON.stringify('mini'));
    // this.getdatasource();
    // this.GetConsume();
  },
  // 取消监听bus事件
  destroyed() {
    // 取消对handleCommand事件的监听
    this.$bus.$off('handleCommand');
  }
};
</script>

<style scoped>
.lr-jyk-instrument-main >>> .el-table th .cell {
  white-space: nowrap;
}

.lr-jyk-instrument-main >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}

.lr-jyk-instrument-main :deep(.el-pagination) {
  padding: 4px 0 0;
}

.lr-jyk-instrument-main :deep(.el-pagination .btn-prev),
.lr-jyk-instrument-main :deep(.el-pagination .btn-next),
.lr-jyk-instrument-main :deep(.el-pagination .el-pager li) {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
</style>
