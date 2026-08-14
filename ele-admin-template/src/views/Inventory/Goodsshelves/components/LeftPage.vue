<template>
  <div class="goodsshelves-tab-page spd-page">
    <user-search
      @search="reload"
      @exportExcel="exportExcel"
      @openInCheck="inCheckVisible = true"
      @aggregateExport="aggregateExport"
    />
    <div class="spd-panel spd-table-panel goodsshelves-table-panel">
      <div class="spd-panel__head">入库列表</div>
      <pic-preview-bar
        ref="picPreview"
        :batch-id="previewCtx.batchId"
        :order-num="previewCtx.orderNum"
        :batch-key="previewCtx.batchKey"
        @deleted="onPicDeleted"
      />
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
          cache-key="goodsshelvesInTable_v3"
          @current-change="onCurrentChange"
        >
          <template v-slot:reportPic="{ row }">
            <el-button type="text" size="mini" @click="openProReport(row)">
              上传
            </el-button>
          </template>
          <template v-slot:watchUdi="{ row }">
            <el-button type="text" size="mini" @click="openUdi(row)">
              查看UDI
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

    <in-check-rec-dialog :visible.sync="inCheckVisible" />
    <export-audit-dialog
      :visible.sync="auditVisible"
      :request-url="auditMeta.requestUrl"
      :data-type="auditMeta.dataType"
      :key-params="auditMeta.keyParams"
    />
    <upload-pro-report-dialog
      :visible.sync="proReportVisible"
      :batch-id="actionRow?.BATCH_ID"
      @uploaded="onPicUploaded"
    />
    <upload-order-pic-dialog
      :visible.sync="orderPicVisible"
      :type="orderPicType"
      :order-num="orderPicParams.orderNum"
      :batch-id="orderPicParams.batchId"
      :batch="orderPicParams.batch"
      @uploaded="onPicUploaded"
    />
    <watch-udi-dialog
      :visible.sync="udiVisible"
      :batch-id="actionRow?.BATCH_ID"
    />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './leftpage-search.vue';
import InCheckRecDialog from './InCheckRecDialog.vue';
import ExportAuditDialog from '@/views/Inventory/InventoryQueryNew/components/ExportAuditDialog.vue';
import UploadProReportDialog from './UploadProReportDialog.vue';
import UploadOrderPicDialog from './UploadOrderPicDialog.vue';
import WatchUdiDialog from './WatchUdiDialog.vue';
import PicPreviewBar from './PicPreviewBar.vue';
import { GetPDAList, GetInStockDetailRaw } from '@/api/Inventory/Goodsshelves';
import {
  getOrderJsTypeText,
  formatHighLowClassTwo,
  formatUploadState,
  formatContractType,
  withCustomSort
} from '../utils';

export default {
  name: 'GoodsshelvesInPage',
  components: {
    UserSearch,
    InCheckRecDialog,
    ExportAuditDialog,
    UploadProReportDialog,
    UploadOrderPicDialog,
    WatchUdiDialog,
    PicPreviewBar
  },
  props: {
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      // 固定表高，不随剩余视口压缩（小窗口靠页面滚动查看）
      tableHeight: 400,
      lastWhere: {},
      inCheckVisible: false,
      auditVisible: false,
      auditMeta: { requestUrl: '', dataType: '', keyParams: '' },
      actionRow: null,
      proReportVisible: false,
      orderPicVisible: false,
      orderPicType: '1',
      orderPicParams: { orderNum: '0', batchId: '0', batch: '0' },
      udiVisible: false,
      previewCtx: { batchId: '', orderNum: '', batchKey: '' },
      pageSizes: [10, 30, 60, 90, 150, 300],
      selection: [],
      columns: withCustomSort(
        [
        {
          prop: 'UP_SHELF_TYPE',
          label: '入库类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'Contract_Type',
          label: '合同类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row) => formatContractType(row.Contract_Type)
        },
        {
          prop: 'FUNDS_SOURCE',
          label: '资金来源',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter: (row) => {
            const map = {
              1: '自筹资金',
              2: '政府补助',
              3: '科教项目',
              4: '财政+自筹',
              5: '财政转款(发改委)',
              6: '财政转款(开办费用)'
            };
            return map[row.FUNDS_SOURCE] || '未设置';
          }
        },
        {
          prop: 'Receive_Property',
          label: '收货类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row) => {
            if (row.Receive_Property == 0 || row.Receive_Property === '0') {
              return '普通收货';
            }
            if (row.Receive_Property == 1 || row.Receive_Property === '1') {
              return '盘溢收货';
            }
            return '未知类型';
          }
        },
        {
          prop: 'Storage_ID',
          label: '业务发起库区',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (row) => {
            if (row.Storage_ID === 1 || row.Storage_ID === '1') return '院内库区';
            if (row.Storage_ID === 2 || row.Storage_ID === '2') return '院外库区';
            return '-';
          }
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '科室/供应商名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'UP_SHELF_TIME',
          label: '入库时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (row) =>
            row.UP_SHELF_TIME ? String(row.UP_SHELF_TIME).replace('T', ' ') : ''
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种(材料)编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140
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
          minWidth: 70
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
          minWidth: 90
        },
        {
          prop: 'Brand',
          label: '品牌',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'DISINFECTION_BATCH',
          label: '灭菌批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'COEFFICIENT',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'GOODS_QTY',
          label: '散货数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'DEF_NO_PKG_CODE',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'UP_SHELF_QUANTITY',
          label: '入库数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'SUPPLY_PRICE',
          label: '入库价格',
          align: 'right',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row) => {
            const n = parseFloat(row.SUPPLY_PRICE);
            if (Number.isNaN(n)) return '';
            const bl = Number(row.price_bl);
            return n.toFixed(Number.isFinite(bl) ? bl : 4);
          }
        },
        {
          prop: 'BUSINESS_BILL',
          label: '入库单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'OLD_DELIVERY_NOTE_NUMBER',
          label: '预验收单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
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
          minWidth: 90,
          formatter: (row) =>
            row.IS_BIDDING === '1' || row.IS_BIDDING === 1 ? '是' : '否'
        },
        {
          prop: 'CONTRACT_NAME',
          label: '合同名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'CONTRACT_CODE',
          label: '合同编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PT_HTNUM',
          label: '平台合同编号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Operator',
          label: '操作人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'BZ',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'ORDER_NUM',
          label: '上传状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
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
          columnKey: 'watchUdi',
          label: '查看UDI',
          align: 'center',
          width: 100,
          slot: 'watchUdi',
          fixed: 'right'
        },
        {
          columnKey: 'uploadPic',
          label: '上传图片',
          align: 'center',
          width: 170,
          slot: 'uploadPic',
          fixed: 'right'
        },
        {
          prop: 'PREPARE_GOODS_PLAN_NUMBER',
          label: '计划单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'STOCK_UP_PLAN_GOODS_QUANTITY',
          label: '计划数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'APPROVE_TIME',
          label: '计划审批时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (row) => {
            if (
              row.APPROVE_TIME === '0001-01-01T00:00:00' ||
              row.APPROVE_TIME == null
            ) {
              return '';
            }
            return String(row.APPROVE_TIME).replace('T', ' ');
          }
        },
        {
          prop: 'SOURCE_FROM',
          label: '来源',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'IS_JC',
          label: '是否集采',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row) =>
            row.IS_JC === '1' || row.IS_JC === 1 ? '是' : '否'
        }
      ])
    };
  },
  mounted() {
    this.bindPageSizeSync();
  },
  activated() {
    this.$nextTick(() => this.$refs.table?.doLayout?.());
  },
  beforeDestroy() {
    if (this._pageSizeUnwatch) {
      this._pageSizeUnwatch();
      this._pageSizeUnwatch = null;
    }
  },
  methods: {
    bindPageSizeSync() {
      this.$nextTick(() => {
        this._pageSizeUnwatch = this.$watch(
          () => this.$refs.table && this.$refs.table.tableLimit,
          (val) => {
            if (val != null && val !== this.pageSize) {
              this.$emit('update:pageSize', val);
            }
          }
        );
      });
    },
    datasource({ page, limit, where, order }) {
      this.lastWhere = where || this.lastWhere;
      return GetPDAList({ page, limit, where, order })
        .then((res) => ({
          count: res.total,
          list: res.result || []
        }))
        .catch((err) => {
          this.$message.error(err.message || '入库列表加载失败');
          return { count: 0, list: [] };
        });
    },
    reload(where) {
      if (where) this.lastWhere = where;
      this.$refs.table.reload({ page: 1, where: this.lastWhere });
    },
    billNo(row) {
      const bill = row?.BUSINESS_BILL || '';
      return String(bill).split('/')[0] || '';
    },
    /** 对齐老系统：点行后上方展示检验报告 + ORDER_PIC 图 */
    onCurrentChange(row) {
      if (!row) {
        this.previewCtx = { batchId: '', orderNum: '', batchKey: '' };
        return;
      }
      this.actionRow = row;
      this.previewCtx = {
        batchId: row.BATCH_ID || '',
        orderNum: this.billNo(row),
        batchKey: `${row.BATCH || ''}/${row.VARIETIE_CODE || ''}`
      };
    },
    onPicUploaded() {
      this.reload();
      this.$nextTick(() => {
        this.$refs.picPreview?.reload?.();
      });
    },
    onPicDeleted() {
      this.reload();
    },
    openProReport(row) {
      this.actionRow = row;
      this.onCurrentChange(row);
      this.proReportVisible = true;
    },
    openUdi(row) {
      if (!row?.BATCH_ID) {
        this.$message.warning('缺少批次标识');
        return;
      }
      this.actionRow = row;
      this.udiVisible = true;
    },
    openOrderPic(row, type) {
      this.actionRow = row;
      this.onCurrentChange(row);
      this.orderPicType = String(type);
      this.orderPicParams = {
        orderNum: this.billNo(row) || '0',
        batchId: row?.BATCH_ID || '0',
        batch:
          String(type) === '3'
            ? `${row?.BATCH || ''}/${row?.VARIETIE_CODE || ''}`
            : '0'
      };
      this.orderPicVisible = true;
    },
    async exportExcel(where) {
      const loading = this.$messageLoading('正在导出数据...');
      try {
        const data = await GetInStockDetailRaw({
          page: 1,
          limit: 9999999,
          where: where || this.lastWhere
        });
        loading.close();
        if (data?.code == 303 || data?.code === '303') {
          this.auditMeta = {
            requestUrl: data.requesturl || '',
            dataType: data.datatype || '流向查询入库',
            keyParams: data.keyparams || ''
          };
          this.auditVisible = true;
          return;
        }
        if (!(data?.code == 200 || data?.code === '200')) {
          throw new Error(data?.msg || '导出失败');
        }
        this.writeInExcel(data.result || []);
        this.$message.success('导出成功');
      } catch (e) {
        loading.close();
        this.$message.error(e.message || '导出失败');
      }
    },
    writeInExcel(result) {
      const headers = [
        '入库类型',
        '订单结算类型',
        '合同类型',
        '收货类型',
        '科室/供应商名称',
        '入库时间',
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
        '散货数量',
        '定数码',
        '入库数量',
        '入库价格',
        '入库单号',
        '预验收单号',
        '高低值分类下级属性',
        '是否中标',
        '合同名称',
        '合同编码',
        '平台合同编号',
        '注册证号',
        '操作人',
        '备注',
        '上传状态',
        '计划单号',
        '计划数量',
        '计划审批时间',
        '来源',
        '是否集采',
        '采购方式'
      ];
      const rows = [headers];
      result.forEach((item) => {
        const receive =
          item.Receive_Property === '0' || item.Receive_Property === 0
            ? '普通收货'
            : item.Receive_Property === '1' || item.Receive_Property === 1
            ? '盘溢收货'
            : '未知类型';
        const price = parseFloat(item.SUPPLY_PRICE);
        const bl = Number(item.price_bl);
        rows.push([
          item.UP_SHELF_TYPE,
          getOrderJsTypeText(item.ORDER_JS_TYPE),
          formatContractType(item.Contract_Type),
          receive,
          item.SUPPLIER_NAME,
          item.UP_SHELF_TIME
            ? String(item.UP_SHELF_TIME).replace('T', ' ')
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
          item.GOODS_QTY,
          item.DEF_NO_PKG_CODE,
          item.UP_SHELF_QUANTITY,
          Number.isNaN(price)
            ? ''
            : price.toFixed(Number.isFinite(bl) ? bl : 4),
          item.BUSINESS_BILL,
          item.OLD_DELIVERY_NOTE_NUMBER,
          formatHighLowClassTwo(item.HIGH_OR_LOW_CLASS_TWO),
          item.IS_BIDDING === '1' || item.IS_BIDDING === 1 ? '是' : '否',
          item.CONTRACT_NAME,
          item.CONTRACT_CODE,
          item.PT_HTNUM || '',
          item.APPROVAL_NUMBER,
          item.Operator,
          item.BZ,
          formatUploadState(item),
          item.PREPARE_GOODS_PLAN_NUMBER,
          item.STOCK_UP_PLAN_GOODS_QUANTITY,
          item.APPROVE_TIME === '0001-01-01T00:00:00' || item.APPROVE_TIME == null
            ? ''
            : String(item.APPROVE_TIME).replace('T', ' '),
          item.SOURCE_FROM,
          item.IS_JC === '1' || item.IS_JC === 1 ? '是' : '否',
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
        const res = await GetPDAList({
          page: 1,
          limit: 9999999,
          where: where || this.lastWhere
        });
        const aggregated = {};
        (res.result || []).forEach((item) => {
          const code = item.VARIETIE_CODE_NEW || '';
          const qty = parseFloat(item.UP_SHELF_QUANTITY) || 0;
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
          '汇总导出.xlsx'
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
  height: auto;
  min-height: 0;
  display: block;
}

.goodsshelves-table-panel {
  display: block;
  overflow: visible;
  margin-top: 10px;
}

.spd-table-panel__wrap {
  display: block;
  overflow: visible;
  min-height: 0;
}

.spd-panel__head {
  flex: none;
}

.goodsshelves-tab-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
