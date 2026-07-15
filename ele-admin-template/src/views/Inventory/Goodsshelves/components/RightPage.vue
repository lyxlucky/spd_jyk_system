<template>
  <div class="goodsshelves-tab-page spd-page">
    <user-search
      @search="reload"
      @exportByHw="exportByHw"
      @exportExcel="exportExcel"
      @openOrderFlow="orderFlowVisible = true"
      @openOutCheck="outCheckVisible = true"
      @aggregateExport="aggregateExport"
      @storageLoaded="onStorageLoaded"
    />
    <div class="spd-panel spd-table-panel goodsshelves-table-panel">
      <div class="spd-panel__head">
        <span>出库列表</span>
        <span class="summary-bar">
          当前页出库数量：{{ pageQty }} | 品种出库总数量：{{ totalQty }} | 当前页散货金额：{{
            pageAmount
          }}
          | 品种总金额：{{ totalAmount }}
        </span>
      </div>
      <div ref="tableWrap" class="spd-table-panel__wrap">
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
          cache-key="goodsshelvesOutTable"
          @done="onTableDone"
          @current-change="onCurrentChange"
        >
          <template v-slot:reportPic="{ row }">
            <el-button type="text" size="mini" @click="openProReport(row)">
              上传
            </el-button>
          </template>
          <template v-slot:uploadPic="{ row }">
            <el-button type="text" size="mini" @click="openOrderPic(row, '1')">
              单号
            </el-button>
            <el-button type="text" size="mini" @click="openOrderPic(row, '2')">
              批次
            </el-button>
            <el-button type="text" size="mini" @click="openOrderPic(row, '3')">
              批号
            </el-button>
          </template>
        </ele-pro-table>
      </div>
    </div>

    <order-flow-dialog :visible.sync="orderFlowVisible" />
    <out-check-rec-dialog
      :visible.sync="outCheckVisible"
      :storage-options="storageList"
    />
    <export-audit-dialog
      :visible.sync="auditVisible"
      :request-url="auditMeta.requestUrl"
      :data-type="auditMeta.dataType"
      :key-params="auditMeta.keyParams"
    />
    <upload-pro-report-dialog
      :visible.sync="proReportVisible"
      :batch-id="actionRow?.BATCH_ID"
      @uploaded="reload()"
    />
    <upload-order-pic-dialog
      :visible.sync="orderPicVisible"
      :type="orderPicType"
      :order-num="orderPicParams.orderNum"
      :batch-id="orderPicParams.batchId"
      :batch="orderPicParams.batch"
      @uploaded="reload()"
    />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './rightpage-search.vue';
import OrderFlowDialog from './OrderFlowDialog.vue';
import OutCheckRecDialog from './OutCheckRecDialog.vue';
import ExportAuditDialog from '@/views/Inventory/InventoryQueryNew/components/ExportAuditDialog.vue';
import UploadProReportDialog from './UploadProReportDialog.vue';
import UploadOrderPicDialog from './UploadOrderPicDialog.vue';
import {
  GetPDAList2,
  GetOutStockDetailRaw,
  ExcelGoodsCKByHW
} from '@/api/Inventory/Goodsshelves';
import {
  isSzseOrderJs,
  openExcelFile,
  getOrderJsTypeText,
  formatHighLowClassTwo,
  formatCheckState,
  formatUploadState,
  formatContractType,
  storageName
} from '../utils';

export default {
  name: 'GoodsshelvesOutPage',
  components: {
    UserSearch,
    OrderFlowDialog,
    OutCheckRecDialog,
    ExportAuditDialog,
    UploadProReportDialog,
    UploadOrderPicDialog
  },
  data() {
    return {
      tableHeight: 400,
      storageList: [],
      lastWhere: {},
      pageQty: 0,
      totalQty: 0,
      pageAmount: '0.00',
      totalAmount: '0.00',
      orderFlowVisible: false,
      outCheckVisible: false,
      auditVisible: false,
      auditMeta: { requestUrl: '', dataType: '', keyParams: '' },
      actionRow: null,
      proReportVisible: false,
      orderPicVisible: false,
      orderPicType: '1',
      orderPicParams: { orderNum: '0', batchId: '0', batch: '0' },
      pageSize: 10,
      pageSizes: [10, 30, 60, 90, 150, 300],
      selection: [],
      columns: this.buildColumns()
    };
  },
  mounted() {
    this.bindTableHeight();
  },
  beforeDestroy() {
    this.unbindTableHeight();
  },
  methods: {
    bindTableHeight() {
      this.$nextTick(() => {
        const el = this.$refs.tableWrap;
        if (!el) return;
        const update = () => {
          const pager = el.querySelector('.el-pagination');
          const pagerH = pager ? pager.offsetHeight + 12 : 48;
          const h = Math.floor(el.clientHeight - pagerH);
          if (h > 120 && h !== this.tableHeight) {
            this.tableHeight = h;
          }
        };
        update();
        this.$nextTick(() => {
          update();
          setTimeout(update, 80);
        });
        if (typeof ResizeObserver !== 'undefined') {
          this._tableRo = new ResizeObserver(update);
          this._tableRo.observe(el);
        } else {
          window.addEventListener('resize', update);
          this._tableResizeHandler = update;
        }
      });
    },
    unbindTableHeight() {
      if (this._tableRo) {
        this._tableRo.disconnect();
        this._tableRo = null;
      }
      if (this._tableResizeHandler) {
        window.removeEventListener('resize', this._tableResizeHandler);
        this._tableResizeHandler = null;
      }
    },
    buildColumns() {
      const cols = [
        {
          prop: 'UP_SHELF_TYPE',
          label: '出库类型',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'ORDER_JS_TYPE',
          label: '订单结算类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130,
          hide: !isSzseOrderJs,
          formatter: (row) => getOrderJsTypeText(row.ORDER_JS_TYPE)
        },
        {
          prop: 'Contract_Type',
          label: '合同类型',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
          formatter: (row) => formatContractType(row.Contract_Type)
        },
        {
          prop: 'Storage_ID',
          label: '业务发起库区',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (row) => storageName(this.storageList, row.Storage_ID)
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '科室/供应商名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'From_Supplier_Name',
          label: '供应商名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140
        },
        {
          prop: 'RECEIVING_TIME',
          label: '出库时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
          formatter: (row) =>
            row.RECEIVING_TIME ? String(row.RECEIVING_TIME).replace('T', ' ') : ''
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种(材料)编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'YG_CODE',
          label: '阳光编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'SPH_ERP_VARIETIE_CODE',
          label: '上药HERP编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 70
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140
        },
        {
          prop: 'MEDICAL_CODE',
          label: '医保码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'Brand',
          label: '品牌',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 110,
          formatter: (row) =>
            row.BATCH_PRODUCTION_DATE
              ? String(row.BATCH_PRODUCTION_DATE).replace('T', ' ').substr(0, 10)
              : ''
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          align: 'center',
          showOverflowTooltip: true,
          width: 110,
          formatter: (row) =>
            row.BATCH_VALIDITY_PERIOD
              ? String(row.BATCH_VALIDITY_PERIOD).replace('T', ' ').substr(0, 10)
              : ''
        },
        {
          prop: 'DISINFECTION_BATCH',
          label: '灭菌批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'COEFFICIENT',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          width: 70
        },
        {
          prop: 'RECEIVING_QUANTITY',
          label: '出库数量',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'SUPPLY_PRICE',
          label: '消耗价',
          align: 'right',
          showOverflowTooltip: true,
          width: 90,
          formatter: (row) => {
            const n = parseFloat(row.SUPPLY_PRICE);
            if (Number.isNaN(n)) return '';
            const bl = Number(row.price_bl);
            return n.toFixed(Number.isFinite(bl) ? bl : 4);
          }
        },
        {
          prop: 'GOODS_QTY',
          label: '散货数量',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'BUSINESS_BILL',
          label: '出库单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'MARK',
          label: '出库备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'CHECK_STATE',
          label: 'PDA出库确认',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row) => formatCheckState(row.CHECK_STATE)
        },
        {
          prop: 'HIGH_OR_LOW_CLASS_TWO',
          label: '高低值分类下级属性',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140,
          formatter: (row) => formatHighLowClassTwo(row.HIGH_OR_LOW_CLASS_TWO)
        },
        {
          prop: 'IS_BIDDING',
          label: '是否中标',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
          formatter: (row) => {
            if (row.IS_BIDDING === '1' || row.IS_BIDDING === 1) return '是';
            if (row.IS_BIDDING === '0' || row.IS_BIDDING === 0) return '否';
            return row.IS_BIDDING;
          }
        },
        {
          prop: 'SOURCE_FROM',
          label: '来源',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'IS_JC',
          label: '是否集采',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
          formatter: (row) =>
            row.IS_JC === '1' || row.IS_JC === 1 ? '是' : '否'
        },
        {
          prop: 'Operator',
          label: '操作人',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'ORDER_NUM',
          label: '上传状态',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
          formatter: (row) => formatUploadState(row)
        },
        {
          columnKey: 'reportPic',
          label: '检验报告图片',
          align: 'center',
          width: 100,
          slot: 'reportPic',
          fixed: 'right'
        },
        {
          columnKey: 'uploadPic',
          label: '上传图片',
          align: 'center',
          width: 170,
          slot: 'uploadPic',
          fixed: 'right'
        }
      ];
      return cols.filter((c) => !c.hide);
    },
    onStorageLoaded(list) {
      this.storageList = list || [];
      this.columns = this.buildColumns();
    },
    billNo(row) {
      const bill = row?.BUSINESS_BILL || '';
      return String(bill).split('/')[0] || '';
    },
    openProReport(row) {
      this.actionRow = row;
      this.proReportVisible = true;
    },
    openOrderPic(row, type) {
      this.actionRow = row;
      this.orderPicType = String(type);
      this.orderPicParams = {
        orderNum: row?.BUSINESS_BILL || '0',
        batchId: row?.BATCH_ID || '0',
        batch:
          String(type) === '3'
            ? `${row?.BATCH || ''}/${row?.VARIETIE_CODE || ''}`
            : '0'
      };
      this.orderPicVisible = true;
    },
    datasource({ page, limit, where, order }) {
      this.lastWhere = where || this.lastWhere;
      return GetPDAList2({ page, limit, where, order }).then((res) => {
        const list = res.result || [];
        this.updateSummary(list);
        return {
          count: res.total,
          list
        };
      });
    },
    updateSummary(list) {
      let pageQty = 0;
      let pageAmount = 0;
      (list || []).forEach((row) => {
        pageQty += parseFloat(row.RECEIVING_QUANTITY) || 0;
        pageAmount +=
          (parseFloat(row.GOODS_QTY) || 0) * (parseFloat(row.SUPPLY_PRICE) || 0);
      });
      this.pageQty = pageQty;
      this.pageAmount = pageAmount.toFixed(2);
      const first = (list || [])[0];
      this.totalQty = first?.ALL_QTY ?? 0;
      const ap = parseFloat(first?.ALL_PRICE);
      this.totalAmount = Number.isFinite(ap) ? ap.toFixed(2) : '0.00';
    },
    onTableDone() {
      // ele-pro-table done hook placeholder
    },
    onCurrentChange() {
      // 行点击预览图片：后续与入库侧一并补齐
    },
    reload(where) {
      if (where) this.lastWhere = where;
      this.$refs.table.reload({ page: 1, where: this.lastWhere });
    },
    async exportByHw(where) {
      const loading = this.$messageLoading('正在导出货位数据...');
      try {
        const res = await ExcelGoodsCKByHW({
          page: 1,
          limit: 9999999,
          where: where || this.lastWhere
        });
        if (res?.msg) {
          openExcelFile(res.msg);
          this.$message.success('导出成功');
        } else {
          this.$message.warning(res?.msg || '未返回文件');
        }
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    },
    async exportExcel(where) {
      const loading = this.$messageLoading('正在导出数据...');
      try {
        const data = await GetOutStockDetailRaw({
          page: 1,
          limit: 9999999,
          where: where || this.lastWhere
        });
        loading.close();
        if (data?.code == 303 || data?.code === '303') {
          this.auditMeta = {
            requestUrl: data.requesturl || '',
            dataType: data.datatype || '流向查询出库',
            keyParams: data.keyparams || ''
          };
          this.auditVisible = true;
          return;
        }
        if (!(data?.code == 200 || data?.code === '200')) {
          throw new Error(data?.msg || '导出失败');
        }
        this.writeOutExcel(data.result || []);
        this.$message.success('导出成功');
      } catch (e) {
        loading.close();
        this.$message.error(e.message || '导出失败');
      }
    },
    writeOutExcel(result) {
      const headers = [
        '出库类型',
        '订单结算类型',
        '合同类型',
        '科室/供应商名称',
        '供应商名称',
        '出库时间',
        '品种(材料)编码',
        '阳光编码',
        '上药HERP编码',
        '品种全称',
        '型号/规格',
        '单位',
        '生产企业名称',
        '医保码',
        '品牌',
        '生产批号',
        '生产时间',
        '有效到期',
        '灭菌批号',
        '系数',
        '出库数量',
        '消耗价',
        '散货数量',
        '出库单号',
        'HRP单号',
        '出库备注',
        '注册证号',
        '平台合同编号',
        'PDA出库确认',
        '高低值分类下级属性',
        '是否中标',
        '来源',
        '是否集采',
        '操作人',
        '上传状态',
        '采购方式'
      ];
      const rows = [headers];
      result.forEach((item) => {
        rows.push([
          item.UP_SHELF_TYPE,
          getOrderJsTypeText(item.ORDER_JS_TYPE),
          formatContractType(item.Contract_Type),
          item.SUPPLIER_NAME,
          item.From_Supplier_Name,
          item.RECEIVING_TIME
            ? String(item.RECEIVING_TIME).replace('T', ' ')
            : '',
          item.VARIETIE_CODE_NEW,
          item.YG_CODE,
          item.SPH_ERP_VARIETIE_CODE,
          item.VARIETIE_NAME,
          item.SPECIFICATION_OR_TYPE,
          item.UNIT,
          item.MANUFACTURING_ENT_NAME,
          item.MEDICAL_CODE,
          item.Brand,
          item.BATCH,
          item.BATCH_PRODUCTION_DATE
            ? String(item.BATCH_PRODUCTION_DATE).replace('T', ' ')
            : '',
          item.BATCH_VALIDITY_PERIOD
            ? String(item.BATCH_VALIDITY_PERIOD).replace('T', ' ')
            : '',
          item.DISINFECTION_BATCH,
          item.COEFFICIENT,
          item.RECEIVING_QUANTITY,
          parseFloat(item.SUPPLY_PRICE || 0).toFixed(4),
          item.GOODS_QTY,
          item.BUSINESS_BILL,
          item.DOC_NUMBER,
          item.MARK,
          item.APPROVAL_NUMBER,
          item.PT_HTNUM || '',
          formatCheckState(item.CHECK_STATE),
          formatHighLowClassTwo(item.HIGH_OR_LOW_CLASS_TWO),
          item.IS_BIDDING === '1' || item.IS_BIDDING === 1 ? '是' : '否',
          item.SOURCE_FROM,
          item.IS_JC === '1' || item.IS_JC === 1 ? '是' : '否',
          item.Operator,
          formatUploadState(item),
          item.ORDER_TYPE == '1' ? '线上采购' : '线下采购'
        ]);
      });
      writeFile(
        {
          SheetNames: ['Sheet1'],
          Sheets: { Sheet1: utils.aoa_to_sheet(rows) }
        },
        '数据导出.xlsx'
      );
    },
    async aggregateExport(where) {
      const loading = this.$messageLoading('正在汇总导出...');
      try {
        const res = await GetPDAList2({
          page: 1,
          limit: 9999999,
          where: where || this.lastWhere
        });
        const aggregated = {};
        (res.result || []).forEach((item) => {
          const code = item.VARIETIE_CODE_NEW || '';
          const qty = parseFloat(item.RECEIVING_QUANTITY) || 0;
          const price = parseFloat(item.SUPPLY_PRICE) || 0;
          if (!aggregated[code]) {
            aggregated[code] = { quantity: 0, totalPrice: 0 };
          }
          aggregated[code].quantity += qty;
          aggregated[code].totalPrice += qty * price;
        });
        const rows = [['物料码', '数量', '价格']];
        Object.keys(aggregated).forEach((code) => {
          rows.push([
            code,
            aggregated[code].quantity,
            aggregated[code].totalPrice.toFixed(2)
          ]);
        });
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet(rows) }
          },
          '出库汇总导出.xlsx'
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style scoped>
.goodsshelves-tab-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.goodsshelves-tab-page > *:first-child {
  flex: none;
}

.goodsshelves-table-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.spd-table-panel__wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.spd-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
}

.summary-bar {
  font-size: 12px;
  color: #606266;
  font-weight: normal;
  white-space: nowrap;
}

.goodsshelves-tab-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
