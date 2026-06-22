<template>
  <div class="ele-body spd-page registration-limit-plan">
    <el-card shadow="never">
      <el-form size="mini" inline label-width="auto" class="toolbar" @submit.native.prevent>
        <div class="search-row">
          <el-form-item label="限制名称">
            <el-input
              v-model="filters.limitPlanName"
              size="mini"
              clearable
              placeholder="限制名称"
              style="width: 160px"
              @keyup.enter.native="reloadPlan"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.isEnable" size="mini" clearable placeholder="全部状态" style="width: 100px">
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="收货超量">
            <el-select
              v-model="filters.receiptIsOverLimit"
              size="mini"
              clearable
              placeholder="全部"
              style="width: 100px"
            >
              <el-option label="已超量" value="1" />
              <el-option label="未超量" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="备货超量">
            <el-select
              v-model="filters.stockUpIsOverLimit"
              size="mini"
              clearable
              placeholder="全部"
              style="width: 100px"
            >
              <el-option label="已超量" value="1" />
              <el-option label="未超量" value="0" />
            </el-select>
          </el-form-item>
        </div>
        <div class="toolbar-actions">
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="reloadPlan">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="resetFilters">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="openAdd">新增</el-button>
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="openEdit">编辑</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="removePlan">删除</el-button>
            <el-button size="mini" type="success" plain @click="changeEnable('1')">启用</el-button>
            <el-button size="mini" type="warning" plain @click="changeEnable('0')">停用</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-download"
              :loading="exporting"
              @click="exportExcel"
            >
              导出
            </el-button>
          </el-form-item>
        </div>
      </el-form>

      <div class="panel-title">限制方案列表</div>
      <ele-pro-table
        ref="planTable"
        :height="360"
        :columns="planColumns"
        :datasource="planDatasource"
        :where="filters"
        :current.sync="currentPlan"
        :page-size="20"
        :page-sizes="[20, 50, 100]"
        highlight-current-row
        cache-key="RegistrationLimitPlanMain"
        @current-change="onPlanSelect"
        @done="onPlanTableDone"
      >
        <template v-slot:STOCK_UP_LIMIT_STATUS="{ row }">
          <span :class="limitStatusClass(row.STOCK_UP_LIMIT_STATUS)">
            {{ row.STOCK_UP_LIMIT_STATUS === '已达限量' ? '已达限量' : '未达限量' }}
          </span>
        </template>
        <template v-slot:RECEIPT_LIMIT_STATUS="{ row }">
          <span :class="limitStatusClass(row.RECEIPT_LIMIT_STATUS)">
            {{ row.RECEIPT_LIMIT_STATUS === '已达限量' ? '已达限量' : '未达限量' }}
          </span>
        </template>
        <template v-slot:IS_ENBALE="{ row }">
          <span :class="row.IS_ENBALE === '1' ? 'plan-enabled' : 'plan-disabled'">
            {{ row.IS_ENBALE === '1' ? '启用' : '停用' }}
          </span>
        </template>
      </ele-pro-table>

      <el-row :gutter="12" class="bottom-grid">
        <el-col :span="9">
          <div class="panel-title">注册证明细</div>
          <ele-pro-table
            ref="detailTable"
            :height="420"
            :columns="detailColumns"
            :datasource="detailDatasource"
            :page-size="20"
            :page-sizes="[10, 20, 50, 100]"
            cache-key="RegistrationLimitPlanDetail"
          />
        </el-col>
        <el-col :span="15">
          <div class="panel-title">统计明细</div>
          <el-form size="mini" inline label-width="auto" class="stats-toolbar" @submit.native.prevent>
            <el-form-item label="明细类型">
              <el-select
                v-model="statsFilters.detailType"
                size="mini"
                style="width: 110px"
                @change="onDetailTypeChange"
              >
                <el-option label="收货明细" value="receipt" />
                <el-option label="备货明细" value="stockup" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-input
                v-model="statsFilters.keyword"
                size="mini"
                clearable
                :placeholder="statsKeywordPlaceholder"
                style="width: 220px"
                @keyup.enter.native="reloadReceipt"
              />
            </el-form-item>
            <el-form-item label="开始">
              <el-date-picker
                v-model="statsFilters.startTime"
                size="mini"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="statsStartPlaceholder"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="结束">
              <el-date-picker
                v-model="statsFilters.endTime"
                size="mini"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="statsEndPlaceholder"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="reloadReceipt">查询</el-button>
            </el-form-item>
            <el-form-item :label="totalReceiptsLabel" class="receipt-summary-item">
              <strong class="receipt-summary">{{ formatQty(totalReceipts) }}</strong>
            </el-form-item>
          </el-form>
          <ele-pro-table
            ref="receiptTable"
            :height="460"
            :columns="receiptColumns"
            :datasource="receiptDatasource"
            :where="statsFilters"
            :page-size="20"
            :page-sizes="[20, 50, 100]"
            cache-key="RegistrationLimitPlanReceipt"
          />
        </el-col>
      </el-row>
    </el-card>

    <PlanEditDialog :visible.sync="editVisible" :plan-id="editPlanId" @done="onEditDone" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import {
  getProdLimitPlanMainList,
  getProdLimitPlanDetList,
  deleteProdLimitPlan,
  updateProdLimitPlanEnable,
  getProdLimitReceiptStats
} from '@/api/Statistics/RegistrationLimitPlan';
import {
  formatDate,
  formatDateTime,
  formatPercent,
  exportPlanExcel
} from './utils';
import PlanEditDialog from './components/PlanEditDialog.vue';

const defaultFilters = () => ({
  limitPlanName: '',
  isEnable: '',
  receiptIsOverLimit: '',
  stockUpIsOverLimit: ''
});

const defaultStatsFilters = () => ({
  detailType: 'receipt',
  keyword: '',
  startTime: '',
  endTime: ''
});

export default {
  name: 'RegistrationLimitPlan',
  components: { PlanEditDialog },
  data() {
    return {
      filters: defaultFilters(),
      statsFilters: defaultStatsFilters(),
      currentPlan: null,
      planDetails: [],
      totalReceipts: 0,
      exporting: false,
      editVisible: false,
      editPlanId: null,
      detailColumns: [
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center'
        },
        {
          prop: 'PROD_CODE',
          label: '注册证编码',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_APPROVAL_NUMBER',
          label: '注册证号',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 200,
          showOverflowTooltip: true
        }
      ],
      planColumns: [
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'LIMIT_PLAN_NAME',
          label: '限制名称',
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'LIMIT_PLAN_START_TIME',
          label: '开始时间',
          width: 110,
          align: 'center',
          formatter: (row) => formatDate(row.LIMIT_PLAN_START_TIME)
        },
        {
          prop: 'LIMIT_PLAN_END_TIME',
          label: '结束时间',
          width: 110,
          align: 'center',
          formatter: (row) => formatDate(row.LIMIT_PLAN_END_TIME)
        },
        {
          prop: 'DETAIL_COUNT',
          label: '注册证明细数',
          width: 150,
          align: 'right'
        },
        {
          prop: 'LIMIT_PLAN_NUM',
          label: '限制总数量',
          width: 130,
          align: 'right'
        },
        {
          prop: 'TOTAL_STOCK_UP_QTY',
          label: '累计备货数量',
          width: 130,
          align: 'right'
        },
        {
          prop: 'STOCK_UP_LIMIT_PERCENT',
          label: '备货已达限量%',
          width: 160,
          align: 'right',
          formatter: (row) => formatPercent(row.STOCK_UP_LIMIT_PERCENT)
        },
        {
          prop: 'STOCK_UP_LIMIT_STATUS',
          label: '备货限量状态',
          width: 140,
          align: 'center',
          slot: 'STOCK_UP_LIMIT_STATUS'
        },
        {
          prop: 'TOTAL_RECEIPTS',
          label: '累计收货数量',
          width: 140,
          align: 'right'
        },
        {
          prop: 'RECEIPT_LIMIT_PERCENT',
          label: '收货已达限量%',
          width: 160,
          align: 'right',
          formatter: (row) => formatPercent(row.RECEIPT_LIMIT_PERCENT)
        },
        {
          prop: 'RECEIPT_LIMIT_STATUS',
          label: '收货限量状态',
          width: 140,
          align: 'center',
          slot: 'RECEIPT_LIMIT_STATUS'
        },
        {
          prop: 'IS_ENBALE',
          label: '状态',
          width: 80,
          align: 'center',
          slot: 'IS_ENBALE'
        },
        {
          prop: 'CREATE_MAN',
          label: '创建人',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          width: 160,
          align: 'center',
          formatter: (row) => formatDateTime(row.CREATE_TIME)
        },
        {
          prop: 'MARK',
          label: '备注',
          minWidth: 140,
          showOverflowTooltip: true
        }
      ]
    };
  },
  computed: {
    isStockUp() {
      return this.statsFilters.detailType === 'stockup';
    },
    totalReceiptsLabel() {
      return this.isStockUp ? '合计备货数量' : '合计收货数量';
    },
    statsKeywordPlaceholder() {
      return this.isStockUp
        ? '注册证号 / 注册证名称 / 品种 / 备货单号'
        : '注册证号 / 注册证名称 / 品种 / 收货单号';
    },
    statsStartPlaceholder() {
      return this.isStockUp ? '备货开始时间' : '收货开始时间';
    },
    statsEndPlaceholder() {
      return this.isStockUp ? '备货结束时间' : '收货结束时间';
    },
    receiptColumns() {
      if (this.isStockUp) {
        return [
          {
            columnKey: 'index',
            type: 'index',
            label: '序号',
            width: 60,
            align: 'center'
          },
          {
            prop: 'STOCK_UP_PLAN_NO',
            label: '备货单号',
            minWidth: 140,
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            width: 110,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            minWidth: 140,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            minWidth: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            width: 70,
            align: 'center'
          },
          {
            prop: 'SUPPLY_PRICE',
            label: '价格',
            width: 90,
            align: 'right'
          },
          {
            prop: 'STOCK_UP_PLAN_GOODS_QUANTITY',
            label: '备货数量',
            width: 100,
            align: 'right'
          },
          {
            prop: 'APPROVE_TIME',
            label: '备货时间',
            width: 160,
            align: 'center',
            formatter: (row) => formatDateTime(row.APPROVE_TIME)
          }
        ];
      }
      return [
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center'
        },
        {
          prop: 'DELIVERY_NOTE_NUMBER',
          label: '收货单号',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          width: 110,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          width: 70,
          align: 'center'
        },
        {
          prop: 'SUPPLY_PRICE',
          label: '价格',
          width: 90,
          align: 'right'
        },
        {
          prop: 'NETRECEIPTS',
          label: '收货数量',
          width: 100,
          align: 'right'
        },
        {
          prop: 'DELIVERY_TIME',
          label: '收货时间',
          width: 160,
          align: 'center',
          formatter: (row) => formatDateTime(row.DELIVERY_TIME)
        }
      ];
    }
  },
  methods: {
    limitStatusClass(status) {
      return status === '已达限量' ? 'limit-reached' : 'limit-normal';
    },
    formatQty(value) {
      return Number(value || 0).toFixed(2);
    },
    planDatasource({ page, limit, where }) {
      return getProdLimitPlanMainList(where, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    detailDatasource({ page, limit }) {
      const start = (page - 1) * limit;
      const list = this.planDetails.slice(start, start + limit);
      return Promise.resolve({
        count: this.planDetails.length,
        list
      });
    },
    receiptDatasource({ page, limit, where }) {
      return getProdLimitReceiptStats(
        {
          prodLimitPlanMainId: this.currentPlan?.ID || '',
          keyword: where.keyword,
          startTime: where.startTime,
          endTime: where.endTime,
          detailType: where.detailType
        },
        page,
        limit
      ).then((res) => {
        this.totalReceipts = res.totalReceipts;
        return {
          count: res.total,
          list: res.list
        };
      });
    },
    reloadPlan() {
      this.$refs.planTable.reload({ page: 1, where: { ...this.filters } });
    },
    resetFilters() {
      this.filters = defaultFilters();
      this.reloadPlan();
    },
    onPlanTableDone(res) {
      const list = res?.data || res?.list || [];
      if (!list.length) {
        this.clearPlanContext();
        return;
      }
      const keepId = this.currentPlan?.ID;
      const target = keepId
        ? list.find((item) => String(item.ID) === String(keepId)) || list[0]
        : list[0];
      this.$nextTick(() => {
        this.$refs.planTable?.setCurrentRow?.(target);
      });
    },
    async onPlanSelect(row) {
      this.currentPlan = row || null;
      if (!row) {
        this.clearPlanContext();
        return;
      }
      try {
        this.planDetails = await getProdLimitPlanDetList(row.ID);
      } catch (e) {
        this.planDetails = [];
        Message.error(e.message || '加载注册证明细失败');
      }
      this.$refs.detailTable?.reload({ page: 1 });
      this.reloadReceipt();
    },
    clearPlanContext() {
      this.currentPlan = null;
      this.planDetails = [];
      this.totalReceipts = 0;
      this.$refs.detailTable?.reload({ page: 1 });
      this.reloadReceipt();
    },
    reloadReceipt() {
      this.$refs.receiptTable?.reload({ page: 1, where: { ...this.statsFilters } });
    },
    onDetailTypeChange() {
      this.reloadReceipt();
    },
    getCurrentPlan() {
      if (!this.currentPlan) {
        Message.warning('请先选择限制方案');
        return null;
      }
      return this.currentPlan;
    },
    openAdd() {
      this.editPlanId = null;
      this.editVisible = true;
    },
    openEdit() {
      const row = this.getCurrentPlan();
      if (!row) return;
      this.editPlanId = row.ID;
      this.editVisible = true;
    },
    onEditDone() {
      this.reloadPlan();
    },
    async removePlan() {
      const row = this.getCurrentPlan();
      if (!row) return;
      try {
        await MessageBox.confirm('确认删除当前限制方案吗？', '提示', { type: 'warning' });
        await deleteProdLimitPlan(row.ID);
        Message.success('删除成功');
        this.currentPlan = null;
        this.reloadPlan();
      } catch (e) {
        if (e !== 'cancel') {
          Message.error(e.message || '删除失败');
        }
      }
    },
    async changeEnable(isEnable) {
      const row = this.getCurrentPlan();
      if (!row) return;
      try {
        const res = await updateProdLimitPlanEnable(row.ID, isEnable);
        Message.success(res.msg || (isEnable === '1' ? '启用成功' : '停用成功'));
        this.reloadPlan();
      } catch (e) {
        Message.error(e.message || '状态更新失败');
      }
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getProdLimitPlanMainList(this.filters, 1, 100000);
        if (!res.list.length) {
          Message.warning('没有可导出的数据');
          return;
        }
        exportPlanExcel(res.list);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar,
.stats-toolbar {
  margin-bottom: 6px;
}

.search-row,
.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar-actions {
  margin-top: 2px;
}

.registration-limit-plan :deep(.el-form-item) {
  margin-right: 8px;
  margin-bottom: 6px;
}

.registration-limit-plan :deep(.el-form-item__label) {
  padding-right: 6px;
}

.registration-limit-plan :deep(.el-form-item__content) {
  line-height: 28px;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  margin: 8px 0 6px;
  line-height: 1.4;
}

.bottom-grid {
  margin-top: 4px;
}

.bottom-grid :deep(.el-col) {
  min-width: 0;
}

.receipt-summary-item :deep(.el-form-item__label) {
  color: #ff5722;
  font-weight: 600;
}

.receipt-summary {
  color: #ff5722;
  font-weight: 600;
}

.registration-limit-plan :deep(.el-table th .cell) {
  white-space: nowrap;
}

.registration-limit-plan :deep(.ele-pro-table) {
  font-size: 12px;
}

.plan-enabled {
  color: #1e9fff;
  font-weight: 600;
}
.plan-disabled {
  color: #ff5722;
  font-weight: 600;
}
.limit-reached {
  color: #ff5722;
  font-weight: 600;
}
.limit-normal {
  color: #5fb878;
  font-weight: 600;
}
</style>
