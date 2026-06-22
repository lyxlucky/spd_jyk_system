<template>
  <div class="lr-jyk-instrument-detail">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <!-- :rowClickChecked="true"  -->
    <!-- :rowClickCheckedIntelligent="false"  -->
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">明细查询</div>
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <!-- 搜索表单 -->
      <LrJykInstrumentDetails-search
        @search="reload"
        @ClickReload="ClickReload"
        :KSDepartmentalPlanDataSearch="KSDepartmentalPlanDataSearch"
        :selection="selection"
        @showEditReoad="showEditReoad"
        :datasourceList="datasourceList"
      />
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">绑定明细列表</div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          class="data-table"
          size="mini"
          border
          stripe
          highlight-current-row
          :toolbar="false"
          :header-overflow-hidden="false"
          :height="tableHeight"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="LrJykInstrumentDetailTable"
          @selection-change="onSelectionChange"
        >
      <template v-slot:PlanQty="{ row }">
        <el-input-number v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
      </template>
      <template v-slot:VarCode="{ row }">
        <el-tag size="mini" v-if="row.LEFT_APPLY_QTY == 0" type="success">{{
          row.VarCode
        }}</el-tag>
        <el-tag size="mini" v-else type="danger">{{ row.VarCode }}</el-tag>
      </template>
      <template v-slot:REMARK="{ row }">
        <el-link v-if="row.REMARK == null" type="info" @click="OpenUpApplyPlanBZBox(row.ID)">无</el-link>
        <el-tag size="mini" v-else type="primary" @click="OpenUpApplyPlanBZBox(row.ID)">{{
          row.REMARK
        }}</el-tag>
      </template>
      <template v-slot:State="{ row }">
        <el-tag size="mini" v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag size="mini" v-if="row.State == 1" type="success">已提交</el-tag>
        <el-tag size="mini" v-if="row.State == 2" type="success">配送中</el-tag>
        <el-tag size="mini" v-if="row.State == 5" type="success">已审核</el-tag>
        <el-tag size="mini" v-if="row.State == 10" type="success">强制结束</el-tag>
        <el-tag size="mini" v-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          " type="success">已审批</el-tag>
        <el-tag size="mini" v-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          " type="success">未收全</el-tag>
        <!-- <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag> -->
        <el-tag size="mini" v-if="row.SUM_Left_Apply_Qty == 0" type="success">已收全</el-tag>
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>
      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
import KSDepartmentalPlanDetailsSearch from './LrJykInstrumentDetails-search.vue';
import {
  GetbindUseMachin,
  DelbindUseMachinRecord
} from '@/api/KSInventory/LrJykInstrument';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['KSDepartmentalPlanData'],
  // inject: ['reload'],
  components: {
    LrJykInstrumentDetailsSearch: KSDepartmentalPlanDetailsSearch
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
        // {
        //   label: '序号',
        //   columnKey: 'index',
        //   type: 'index',
        //   width: 45,
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          columnKey: 'action',
          label: '操作',
          width: 70,
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
          width: 60,
          show: false
        },
        {
          prop: 'BIND_MAN',
          label: '绑定人',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'BIND_DEF',
          label: '定数包',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'BIND_MACHINE',
          label: '绑定设备号',
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'INSTRUMENT_NAME',
          label: '设备名称',
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',

          align: 'center',
          showOverflowTooltip: true,
          width: 200
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',

          align: 'center',
          showOverflowTooltip: true,
          width: 500
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          showOverflowTooltip: true,
          width: 200
        },
        {
          prop: 'UNIT',
          label: '单位',

          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'BATCH',
          label: '批次号',

          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          width: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效期',
          align: 'center',
          showOverflowTooltip: true,
          width: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        }
      ],
      toolbar: false,
      tableHeight: '42vh',
      pageSize: 9999999,
      pagerCount: 2,
      pageSizes: [100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      datasourceList: [],
      sumNumber: 0,
      sumAount: 0
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetbindUseMachin({ page, limit, where, order }).then((res) => {
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
      where.BIND_MACHINE = this.KSDepartmentalPlanData.BIND_MACHINE;
      this.$refs.table.reload({ page: 1, where: where });
    },
    ClickReload(IsReload) {
      this.$emit('IsReload', IsReload);
    },
    remove(row) {
      let data = {
        ID: row.ID
      };
      const loading = this.$messageLoading('删除中...');

      DelbindUseMachinRecord(data)
        .then((res) => {
          loading.close();
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.$refs.table.reload();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    }
  },
  computed: {
    KSDepartmentalPlanDataSearch() {
      return this.KSDepartmentalPlanData;
    }
  },
  watch: {
    KSDepartmentalPlanDataSearch() {
      this.$forceUpdate();
      if (this.KSDepartmentalPlanData) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
      }
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // ele-pro-table 初始化优先级：localStorage[cacheKey+Size] > size 属性
    localStorage.setItem('LrJykInstrumentDetailTableSize', JSON.stringify('mini'));
    // this.getdatasource();
  }
};
</script>

<style scoped>
.lr-jyk-instrument-detail >>> .el-table th .cell {
  white-space: nowrap;
}

.lr-jyk-instrument-detail >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}

.lr-jyk-instrument-detail :deep(.el-pagination) {
  padding: 4px 0 0;
}

.lr-jyk-instrument-detail :deep(.el-pagination .btn-prev),
.lr-jyk-instrument-detail :deep(.el-pagination .btn-next),
.lr-jyk-instrument-detail :deep(.el-pagination .el-pager li) {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}
</style>
