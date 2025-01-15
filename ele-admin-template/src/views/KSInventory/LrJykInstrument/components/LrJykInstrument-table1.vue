<template>
  <div class="ele-body" v-if="RenderTabel">
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
    <ele-pro-table :paginationStyle=paginationStyle :key="key" :reserve-selection="true" highlight-current-row :row-key="(row) => row.PlanNum" @current-change="onCurrentChange" ref="table" height="28vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <LrJykInstrument-search @search="reload" />
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-button size="small" type="primary" class="ele-btn-icon" @click="openScanningBinding(row)"> 扫码绑定</el-button>
        <el-button size="small" type="primary" class="ele-btn-icon" @click="WachthQRCode(row)"> 查看二维码</el-button>
      </template>
    </ele-pro-table>
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
          width: 200,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'right'
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
.ele-body {
  padding: 0px;
}

::v-deep .ele-table-tool-default {
  padding: 0;
}
</style>
