<template>
  <div class="ele-body yg-plat-receiv-goods">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-bar" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filters.ygOrderId"
            clearable
            placeholder="阳光订单编码"
            style="width: 220px"
            @keyup.enter.native="reloadMain"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reloadMain">查询</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="mainTable"
        :height="mainTableHeight"
        :columns="mainColumns"
        :datasource="mainDatasource"
        :where="filters"
        :selection.sync="selection"
        :page-size="100"
        :page-sizes="[30, 50, 100, 200, 300, 99999]"
        highlight-current-row
        cache-key="YgPlatReceivGoodsMain"
        @current-change="onMainRowSelect"
        @done="onMainTableDone"
      >
        <template v-slot:IS_JC="{ row }">
          {{ formatIsJc(row.IS_JC) }}
        </template>
        <template v-slot:YG_IS_CAN_SEND="{ row }">
          {{ formatYgCanSend(row.YG_IS_CAN_SEND) }}
        </template>
      </ele-pro-table>

      <el-row :gutter="12" class="detail-row">
        <el-col :span="10">
          <div class="panel-title">分发单明细</div>
          <ele-pro-table
            ref="distributeTable"
            :height="detailTableHeight"
            :columns="detailColumns"
            :datasource="distributeDatasource"
            :where="detailWhere"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="YgPlatReceivGoodsDistribute"
          />
        </el-col>
        <el-col :span="14">
          <div class="panel-title">阳光明细</div>
          <ele-pro-table
            ref="ygDetailTable"
            :height="detailTableHeight"
            :columns="detailColumns"
            :datasource="ygDetailDatasource"
            :where="detailWhere"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="YgPlatReceivGoodsYgDetail"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  getYgReceiveGoodList,
  getYgDistributeInfo,
  getYgOrderDetail
} from '@/api/Home/YgPlatReceivGoods';
import { formatIsJc, formatYgCanSend } from './utils';

export default {
  name: 'YgPlatReceivGoods',
  data() {
    return {
      filters: { ygOrderId: '' },
      selection: [],
      currentDetailId: '',
      detailWhere: { ygOrderDetailId: '' },
      mainColumns: [
        { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { columnKey: 'index', type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 110, showOverflowTooltip: true },
        { prop: 'VARIETIE_CODE', label: '品种编码', width: 110, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 130, showOverflowTooltip: true },
        { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
        { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 130, showOverflowTooltip: true },
        { prop: 'YG_CODE', label: '阳光编码', width: 110, showOverflowTooltip: true },
        { prop: 'YG_SPE_TYPE', label: '阳光规格', width: 110, showOverflowTooltip: true },
        { prop: 'IS_JC', label: '是否集采', width: 80, align: 'center', slot: 'IS_JC' },
        { prop: 'SOURCE_FROM', label: '来源', width: 90, showOverflowTooltip: true },
        { prop: 'YG_IS_CAN_SEND', label: '是否发送', width: 90, align: 'center', slot: 'YG_IS_CAN_SEND' },
        { prop: 'YG_SEND_BEGIN_TIME', label: '发送时间', width: 110, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 130, showOverflowTooltip: true },
        { prop: 'SUPPLIER_CODE', label: '工银商编码', width: 100, showOverflowTooltip: true },
        { prop: 'PRICE', label: '价格', width: 80, align: 'right' },
        { prop: 'SUPPLY_PRICE', label: '供应价格', width: 90, align: 'right' },
        { prop: 'YG_ZH_COUNT', label: 'YG_ZH_COUNT', width: 100, align: 'center' },
        { prop: 'IS_SEND_YG', label: '是否发送阳光平台', width: 120, showOverflowTooltip: true },
        { prop: 'YG_HOSPITAL_ID', label: '阳光医院Id', width: 100, showOverflowTooltip: true },
        { prop: 'YG_ORDER_ID', label: '阳光订单Id', width: 110, showOverflowTooltip: true },
        { prop: 'MONTHLY_TIME', label: '月结日期', width: 100, showOverflowTooltip: true },
        { prop: 'MONTH_ID', label: '月结Id', width: 90, showOverflowTooltip: true },
        { prop: 'purchaseCount', label: '采购数量', width: 90, align: 'right' },
        { prop: 'YG_ORDER_DETAIL_ID', label: '阳光详情订单Id', width: 120, showOverflowTooltip: true },
        { prop: 'WAREHOUSE_COUNT', label: '仓库盘点', width: 90, align: 'right' },
        { prop: 'DISTRIBUTE_COUN', label: '分布计数', width: 90, align: 'right' }
      ],
      detailColumns: [
        { columnKey: 'index', type: 'index', label: '序号', width: 60, align: 'center' },
        { prop: 'BATCH_RECORD_ID', label: '批号记录ID', minWidth: 120, showOverflowTooltip: true },
        { prop: 'DISTRIBUTE_COUN', label: '分布计数', width: 100, align: 'right' },
        { prop: 'WAREHOUSE_COUNT', label: '仓库盘点', width: 100, align: 'right' },
        { prop: 'YG_INVOICE_ID', label: '阳光发票ID', minWidth: 120, showOverflowTooltip: true }
      ]
    };
  },
  computed: {
    mainTableHeight() {
      return 500;
    },
    detailTableHeight() {
      return 265;
    }
  },
  methods: {
    formatIsJc,
    formatYgCanSend,
    mainDatasource({ page, limit, where }) {
      return getYgReceiveGoodList(where.ygOrderId, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    distributeDatasource({ page, limit, where }) {
      return getYgDistributeInfo(where.ygOrderDetailId, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    ygDetailDatasource({ page, limit, where }) {
      return getYgOrderDetail(where.ygOrderDetailId, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    reloadMain() {
      this.$refs.mainTable.reload({ page: 1, where: { ...this.filters } });
    },
    onMainTableDone(res) {
      const list = res?.data || res?.list || [];
      if (!list.length) {
        this.setDetailContext('');
        return;
      }
      const keepId = this.currentDetailId;
      const target = keepId
        ? list.find((item) => String(item.YG_ORDER_DETAIL_ID) === String(keepId)) || list[0]
        : list[0];
      this.$nextTick(() => {
        this.$refs.mainTable?.setCurrentRow?.(target);
      });
    },
    onMainRowSelect(row) {
      const detailId = row?.YG_ORDER_DETAIL_ID || '';
      this.setDetailContext(detailId);
    },
    setDetailContext(detailId) {
      this.currentDetailId = detailId || '';
      this.detailWhere = { ygOrderDetailId: this.currentDetailId };
      this.$refs.distributeTable?.reload({ page: 1, where: { ...this.detailWhere } });
      this.$refs.ygDetailTable?.reload({ page: 1, where: { ...this.detailWhere } });
    }
  }
};
</script>

<style scoped>
.filter-bar {
  margin-bottom: 12px;
}
.detail-row {
  margin-top: 24px;
}
.panel-title {
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
