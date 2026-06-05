<template>
  <el-dialog
    custom-class="legacy-layer-dialog prchase-consume-dialog"
    title="详情"
    :visible.sync="dialogVisible"
    width="96%"
    top="3vh"
    append-to-body
    @opened="onOpened"
  >
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      height="70vh"
      size="small"
      :page-size="20"
      :page-sizes="[20, 50, 100, 150, 300]"
    >
      <template v-slot:Supply_Price="{ row }">
        <span :class="{ 'price-mismatch': priceMismatch(row) }">
          {{ fmtPriceCell(row, 'Supply_Price') }}
        </span>
      </template>
      <template v-slot:HIS_CHARGING_PRICE="{ row }">
        <span v-if="row.HIS_CHARGING_PRICE != null" :class="{ 'price-mismatch': priceMismatch(row) }">
          {{ row.HIS_CHARGING_PRICE }}
        </span>
      </template>
    </ele-pro-table>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getLimitBuyDelV2 } from '@/api/Home/PrchaseDataV2';
import { fmtDate10 } from '../utils';

function mapConsumptionType(v) {
  const n = Number(v);
  if (n === 0) return 'PDA扫码消耗';
  if (n === 1) return 'RFID读码消耗';
  if (n === 2) return 'His计费消耗';
  if (n === 3) return '散货申领消耗';
  if (n === 4) return 'HIS医嘱计费消耗';
  if (n === 5) return '超时默认消耗';
  if (n === 6) return '读码消耗';
  return v == null || v === '' ? '' : String(v);
}

export default {
  name: 'ConsumeDetailDialog',
  props: {
    visible: { type: Boolean, default: false },
    buyId: { type: [String, Number], default: '' }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    columns() {
      return [
        { prop: 'Dept_Two_Name', label: '收货科室', width: 90, sortable: true },
        { prop: 'SPD_COST_DEPT_NAME', label: '成本科室', width: 90, sortable: true },
        { prop: 'Varietie_Code_New', label: '品种编码', width: 100, sortable: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '型号/规格', width: 120, showOverflowTooltip: true },
        { prop: 'Unit', label: '单位', width: 50, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', width: 150, showOverflowTooltip: true },
        { prop: 'Supplier_Name', label: '供应商', width: 150, showOverflowTooltip: true },
        { prop: 'Approval_Number', label: '批准文号', width: 130, showOverflowTooltip: true },
        { prop: 'Brand', label: '品牌', width: 60 },
        { prop: 'Batch', label: '生产批号', width: 90, sortable: true },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          width: 100,
          sortable: true,
          formatter: (row) => fmtDate10(row.Batch_Production_Date)
        },
        {
          prop: 'Batch_Validity_Period',
          label: '失效日期',
          width: 100,
          sortable: true,
          formatter: (row) => fmtDate10(row.Batch_Validity_Period)
        },
        { prop: 'Coefficient', label: '系数', width: 55, align: 'center', sortable: true },
        { prop: 'Def_No_Pkg_Code', label: '定数码', width: 110, sortable: true },
        {
          columnKey: 'Supply_Price',
          label: '单价',
          width: 85,
          align: 'right',
          sortable: true,
          slot: 'Supply_Price'
        },
        { prop: 'Goods_Qty', label: '消耗数量', width: 75, align: 'right' },
        {
          prop: 'Cost',
          label: '金额',
          width: 90,
          align: 'right',
          sortable: true,
          formatter: (row) => this.fmtPriceCell(row, 'Cost')
        },
        { prop: 'Goods_Qty2', label: '转换数量', width: 75, align: 'right' },
        { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', width: 70 },
        {
          columnKey: 'Consumption_Type',
          label: '消耗方式',
          width: 110,
          sortable: true,
          formatter: (row) => mapConsumptionType(row.Consumption_Type)
        },
        { prop: 'Consume_Time', label: '消耗时间', width: 140, sortable: true },
        { prop: 'Operate_Person', label: '消耗人', width: 80, sortable: true },
        { prop: 'Dept_Code', label: '计费科室编码', width: 110 },
        {
          columnKey: 'HIS_CHARGING_PRICE',
          label: 'his计费价格',
          width: 100,
          slot: 'HIS_CHARGING_PRICE'
        },
        {
          columnKey: 'Hospitalization_Number',
          label: '住院号/病患号',
          width: 120,
          formatter: (row) =>
            `${row.Hospitalization_Number || ''}/${row.Patient_Number || ''}`
        },
        { prop: 'MONTHLY_TIME', label: '月结月份', width: 90 },
        { prop: 'YG_CODE', label: '阳光产品码', width: 110 },
        { prop: 'CHARGING_CODE', label: '计费编码', width: 90 },
        { prop: 'SOURCE_FROM', label: '阳光平台来源', width: 100, showOverflowTooltip: true }
      ];
    }
  },
  methods: {
    fmtPriceCell(row, field) {
      const bl = row.price_bl != null ? Number(row.price_bl) : 2;
      const val = Number(row[field]);
      return Number.isNaN(val) ? '' : val.toFixed(bl);
    },
    priceMismatch(row) {
      if (row.HIS_CHARGING_PRICE == null) return false;
      return (
        this.fmtPriceCell(row, 'Supply_Price') !==
        Number(row.HIS_CHARGING_PRICE).toFixed(row.price_bl != null ? Number(row.price_bl) : 2)
      );
    },
    onOpened() {
      if (this.buyId) {
        this.$refs.table?.reload({ page: 1 });
      }
    },
    datasource({ page, limit }) {
      if (!this.buyId) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getLimitBuyDelV2(this.buyId, page, limit)
        .then((res) => ({
          count: res.total || 0,
          list: res.result || []
        }))
        .catch((e) => {
          Message.error(e.message || '加载失败');
          return { count: 0, list: [] };
        });
    }
  }
};
</script>

<style scoped>
.price-mismatch {
  color: #f56c6c;
}
</style>

<style>
.legacy-layer-dialog.prchase-consume-dialog .el-dialog__body {
  padding: 8px 12px 12px;
}
</style>
