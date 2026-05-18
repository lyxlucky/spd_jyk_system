<template>
  <div class="take-system">
    <el-row :gutter="12">
      <el-col :span="7">
        <el-card shadow="never" class="panel-card">
          <div class="toolbar">
            <el-input
              v-model="receiptQuery.condition"
              size="mini"
              clearable
              placeholder="收货单/备货单号"
              @keyup.enter.native="loadReceipts"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadReceipts" />
          </div>
          <div class="toolbar">
            <el-button size="mini" type="primary" @click="b2bVisible = true">获取收货单</el-button>
            <el-input v-model="printSize" size="mini" placeholder="打印条数" style="width: 90px" />
            <el-button size="mini" type="primary" :disabled="!currentReceipt" @click="onPrint">打印收货单</el-button>
          </div>
          <div class="toolbar">
            <span class="lbl">收货库区</span>
            <el-select
              v-model="receiptQuery.storageId"
              size="mini"
              style="width: 140px"
              clearable
              placeholder="全部"
              @change="loadReceipts"
            >
              <el-option v-for="st in storageList" :key="st.ID" :label="st.NAME" :value="String(st.ID)" />
            </el-select>
            <span class="lbl">单据状态</span>
            <el-select v-model="receiptQuery.statu" size="mini" style="width: 90px" @change="loadReceipts">
              <el-option label="全部" value="" />
              <el-option label="未收货" value="0" />
              <el-option label="已收货" value="1" />
            </el-select>
          </div>
          <div class="toolbar">
            <el-button size="mini" type="primary" :disabled="!currentReceipt || isReceived" @click="onConfirmReceipt">
              确认收货
            </el-button>
            <el-button size="mini" @click="pendingVisible = true">待收货详情</el-button>
          </div>
          <el-table
            v-loading="receiptLoading"
            :data="receiptList"
            border
            stripe
            size="mini"
            height="460"
            highlight-current-row
            @current-change="onReceiptSelect"
          >
            <el-table-column prop="Delivery_Note_Number" label="收货单号" min-width="110" show-overflow-tooltip />
            <el-table-column label="收货状态" width="72">
              <template slot-scope="{ row }">{{ fmtReceiveState(row.RECEIVE_RECEIPT_STATE) }}</template>
            </el-table-column>
            <el-table-column prop="name" label="库区" width="80" show-overflow-tooltip />
            <el-table-column prop="Prepare_Goods_Plan_Number" label="对应备货单号" min-width="100" show-overflow-tooltip />
            <el-table-column prop="PLAN_DEPT_TWO_NAME" label="来源科室" min-width="90" show-overflow-tooltip />
            <el-table-column label="打印次数" width="80">
              <template slot-scope="{ row }">{{ fmtPrintCount(row.Print_Count) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="220" fixed="right">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click.stop="onReback(row)">打回</el-button>
                <el-button type="text" size="mini" @click.stop="onConfirmAndSend(row, 0)">收货并出库</el-button>
                <el-button type="text" size="mini" @click.stop="onConfirmAndSend(row, 1)">出库专科</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card v-if="receiptHeader" shadow="never" class="header-card">
          <span>收货单：{{ receiptHeader.Delivery_Note_Number }}</span>
          <span class="ml">备货单：{{ receiptHeader.Prepare_Goods_Plan_Number }}</span>
          <span class="ml">创建：{{ fmtDateTime(receiptHeader.Supplier_Delivery_Time) }}</span>
          <span class="ml">状态：{{ fmtReceiveState(receiptHeader.Receive_Receipt_State) }}</span>
        </el-card>
        <el-card shadow="never" class="panel-card">
          <div class="section-title">品种收货明细</div>
          <div class="sum-tip" v-if="currentReceipt">
            <span>实收合计：{{ qtySum }}</span>
            <span class="ml">金额合计：{{ moneySum }}</span>
          </div>
          <div class="toolbar wrap">
            <el-input
              v-model="detailSearch"
              size="mini"
              clearable
              placeholder="编码/名称/企业/规格/供应商"
              style="flex: 1; min-width: 220px"
              @keyup.enter.native="loadDetails"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" :disabled="!currentReceipt" @click="loadDetails" />
            <el-button size="mini" type="primary" :disabled="!detailSelection.length" @click="onSaveDetails">保存</el-button>
            <el-button size="mini" type="primary" :disabled="!currentReceipt" @click="onAutoSave">自动保存实收数量</el-button>
            <el-button size="mini" :disabled="!currentReceipt" @click="onToManualList">转人工收货</el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('orderType')">修改采购方式</el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('ptBz')">平台单号备注</el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('varType')">修改物资类型</el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('temperature')">修改收货温度</el-button>
            <el-button v-if="flags.showFundsSource" size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('funds')">
              修改资金来源
            </el-button>
            <el-button v-if="flags.showStorageTwo" size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('storageTwo')">
              修改收货仓库
            </el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBatchDialog('price')">修改收货价格</el-button>
            <el-button size="mini" :disabled="!detailSelection.length" @click="onInitPPContract">发起省平台合同</el-button>
            <el-button size="mini" :disabled="!currentReceipt" @click="openInvoiceDialog">填写发票</el-button>
          </div>
          <el-table
            ref="detailTable"
            v-loading="detailLoading"
            :data="detailRows"
            row-key="Def_No_Pkg_Receipt_Detail_Id"
            border
            stripe
            size="mini"
            height="560"
            @selection-change="onDetailSelectionChange"
          >
            <el-table-column type="selection" width="48" align="center" fixed="left" />
            <el-table-column label="包装图片" width="100" align="center">
              <template slot-scope="{ row }">
                <div v-if="!row.PIC_URL" class="pic-cell">—</div>
                <div v-else class="pic-cell">
                  <template v-for="(url, idx) in proPicList(row.PIC_URL)">
                    <img
                      v-if="!String(url).toLowerCase().endsWith('.pdf')"
                      :key="'i' + idx"
                      :src="url"
                      class="thumb"
                      alt=""
                      @click="previewPic(row.PIC_URL, idx)"
                    />
                    <el-button
                      v-else
                      :key="'p' + idx"
                      type="text"
                      class="pic-pdf"
                      @click="openWin(url)"
                    >
                      pdf
                    </el-button>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="Name" label="院区库房" width="96" show-overflow-tooltip />
            <el-table-column v-if="flags.dqFs" label="是否推送平台" width="100" align="center">
              <template slot-scope="{ row }">{{ fmtYesNo(row.YG_IS_CAN_SEND) }}</template>
            </el-table-column>
            <el-table-column v-if="showPtHtnumCol" label="平台单号" width="160">
              <template slot-scope="{ row }">
                <el-input v-model="row.PT_HTNUM" size="mini" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" show-overflow-tooltip />
            <el-table-column v-if="flags.isSkuShow" label="SKU" width="140">
              <template slot-scope="{ row }">
                <el-select
                  v-model="row._skuId"
                  size="mini"
                  placeholder="SKU"
                  clearable
                  :disabled="isReceived"
                  filterable
                  style="width: 130px"
                  @change="onSkuChange(row)"
                >
                  <el-option v-for="s in row.SKUS || []" :key="s.ID" :label="s.SKU_NAME" :value="String(s.ID)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="是否合格" width="100">
              <template slot-scope="{ row }">
                <el-select v-model="row._qualified" size="mini" :disabled="isReceived" style="width: 88px" @change="onQualifiedChange(row)">
                  <el-option label="合格" value="1" />
                  <el-option label="不合格" value="0" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="PROVINCE_PLATFORM_CODE" label="药交ID" width="88" show-overflow-tooltip />
            <el-table-column v-if="flags.isStHospital" prop="SPT_CODE" label="省平台合同" width="100" show-overflow-tooltip />
            <el-table-column prop="Varietie_Name" label="品种全称" min-width="130" show-overflow-tooltip />
            <el-table-column prop="Approval_Number" label="批准文号" width="110" show-overflow-tooltip />
            <el-table-column prop="Specification_Or_Type" label="型号/规格" width="92" show-overflow-tooltip />
            <el-table-column prop="Unit" label="单位" width="50" align="center" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="110" show-overflow-tooltip />
            <el-table-column v-if="flags.isCg" label="采购价" width="88" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Purchase_Price) }}</template>
            </el-table-column>
            <el-table-column label="结算价" width="88" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Supply_Price, row.price_bl) }}</template>
            </el-table-column>
            <el-table-column prop="Supplier_Name" label="供应商" min-width="100" show-overflow-tooltip />
            <el-table-column label="批号" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.Batch" size="mini" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
            <el-table-column label="灭菌批号" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.DISINFECTION_BATCH" size="mini" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
            <el-table-column label="生产日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row._prodDate" size="mini" placeholder="yyyy-MM-dd" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
            <el-table-column label="有效日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row._validDate" size="mini" placeholder="yyyy-MM-dd" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
            <el-table-column label="收货温度" width="80" align="center">
              <template slot-scope="{ row }">{{ fmtTemperature(row.TEMPERATURE) }}</template>
            </el-table-column>
            <el-table-column prop="Coefficient" label="系数" width="52" align="center" />
            <el-table-column prop="Receivable" label="应收" width="72" align="center" />
            <el-table-column label="实收" width="88">
              <template slot-scope="{ row }">
                <el-input-number
                  v-model="row.Netreceipts"
                  size="mini"
                  :min="0"
                  :controls="false"
                  :disabled="isReceived"
                  style="width: 76px"
                  @change="markDirty"
                />
              </template>
            </el-table-column>
            <el-table-column label="检验报告图片" width="100" align="center">
              <template>
                <el-button type="text" size="mini" @click="openLegacy('/Frame/UploadvarietyGoodsreceiving', '上传品种检查报告图片')">
                  上传
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="UDI操作" width="200" fixed="right">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click="openLegacy('/Frame/CentreBankTakeGoogsUdiScan', row.Varietie_Code_New + ' UDI扫码')">
                  添加UDI
                </el-button>
                <el-button type="text" size="mini" @click="openLegacy('/Frame/CentreBankWatchUDI', String(row.BATCH_ID || '') + ' 查看UDI')">
                  查看UDI
                </el-button>
                <el-button type="text" size="mini" :disabled="isReceived" @click="onNewAddRow(row)">新增收货</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="UDI_QTY" label="UDI数量" width="72" align="center" />
            <el-table-column prop="MEDICAL_CODE" label="医保编码" width="110" show-overflow-tooltip />
            <el-table-column label="上传状态" width="88">
              <template slot-scope="{ row }">{{ fmtUploadState(row.Batch_Pic_Full_Name) }}</template>
            </el-table-column>
            <el-table-column label="启用状态" width="80">
              <template slot-scope="{ row }">{{ fmtEnable(row.Enable) }}</template>
            </el-table-column>
            <el-table-column v-if="flags.showStorageTwo" prop="STORAGE_TWO_NAME" label="仓库" width="90" show-overflow-tooltip />
            <el-table-column v-if="flags.showFundsSource" label="资金来源" width="100">
              <template slot-scope="{ row }">{{ fmtFundsSource(row.FUNDS_SOURCE) }}</template>
            </el-table-column>
            <el-table-column label="物资类型" width="88">
              <template slot-scope="{ row }">{{ fmtVarType(row.VAR_TYPE) }}</template>
            </el-table-column>
            <el-table-column label="采购方式" width="90">
              <template slot-scope="{ row }">{{ fmtOrderType(row.ORDER_TYPE) }}</template>
            </el-table-column>
            <el-table-column prop="DEF_POSITION" label="货位" width="100" show-overflow-tooltip />
            <el-table-column prop="TJ_POSITION" label="推荐货位" width="90" show-overflow-tooltip />
            <el-table-column label="专科专用" width="80" align="center">
              <template slot-scope="{ row }">{{ fmtYesNo(row.IS_DEPT_SEPLY_USE) }}</template>
            </el-table-column>
            <el-table-column label="备注" width="160">
              <template slot-scope="{ row }">
                <el-input v-model="row.Note_Description" size="mini" :disabled="isReceived" @change="markDirty" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <B2bFetchDialog :visible.sync="b2bVisible" @done="loadReceipts" />
    <PendingDetailDialog :visible.sync="pendingVisible" />
    <LegacyFrameDialog :visible.sync="legacy.visible" :title="legacy.title" :path="legacy.path" />
    <PromptDialog
      :visible.sync="prompt.visible"
      :title="prompt.title"
      :label="prompt.label"
      :options="prompt.options"
      :loading="prompt.loading"
      @confirm="onPromptConfirm"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import B2bFetchDialog from './B2bFetchDialog.vue';
import PendingDetailDialog from './PendingDetailDialog.vue';
import LegacyFrameDialog from './LegacyFrameDialog.vue';
import PromptDialog from './PromptDialog.vue';
import {
  getStorageWithToken,
  searchSystemReceipts,
  searchSystemVarieties,
  autoSaveNetreceipts,
  commitVarietieNetreceipts,
  checkVarietieBatch,
  confirmSystemReceipt,
  confirmSystemReceiptAndSend,
  getSystemPrintApiPath,
  printReceiptExcel,
  rebackDeliveryNumber,
  checkExpireProdInfoSystem,
  saveDeliveredBz,
  upVarOrderType,
  upFundsSource,
  upVarTypeSource,
  upGoodTemp,
  upStorageTwo,
  getStorageTwoInfo,
  upShPriceCommit,
  initPPContract,
  addSysDetailFp,
  updateVarSku,
  updateVarQualified,
  newAddDeliveredVarietiets,
  getSystemReceiptExtend,
  commitNydReceiptAndInvoice
} from '@/api/Inventory/CentreBankTakeGoods';
import {
  fmtReceiveState,
  fmtDateTime,
  fmtDate10,
  fmtPrintCount,
  fmtPrice,
  fmtUploadState,
  fmtTemperature,
  fmtOrderType,
  fmtYesNo,
  fmtEnable,
  fmtFundsSource,
  fmtVarType,
  openExcelFile,
  buildSystemSaveJson,
  buildDefIdJson,
  proPicList,
  hpFlags,
  showPtHtnumColumn
} from '../utils';

const ORDER_OPTS = [
  { label: '线上采购', value: '1' },
  { label: '线下采购', value: '0' }
];
const FUNDS_OPTS = [
  { label: '自筹资金', value: '1' },
  { label: '政府补助', value: '2' },
  { label: '科教项目', value: '3' },
  { label: '财政+自筹', value: '4' },
  { label: '财政转款(发改委)', value: '5' },
  { label: '财政转款(开办费用)', value: '6' },
  { label: '财政资金', value: '7' }
];
const VAR_TYPE_OPTS = [
  { label: '防疫物资', value: '1' },
  { label: '普通物资', value: '0' }
];
const TEMP_OPTS = [{ label: '常温', value: '0' }];

const ST_PRINT_BLOCK = ['stzx', 'stse', 'csyy', 'stzl', 'stzyyy', 'chrmyy'];

export default {
  name: 'SystemPanel',
  components: { B2bFetchDialog, PendingDetailDialog, LegacyFrameDialog, PromptDialog },
  data() {
    return {
      flags: hpFlags,
      storageList: [],
      receiptQuery: { condition: '', statu: '', storageId: '' },
      receiptList: [],
      receiptLoading: false,
      currentReceipt: null,
      receiptHeader: null,
      detailSearch: '',
      detailRows: [],
      detailLoading: false,
      detailSelection: [],
      qtySum: '',
      moneySum: '',
      goodsSaved: true,
      dirty: false,
      printSize: '10',
      b2bVisible: false,
      pendingVisible: false,
      legacy: { visible: false, title: '', path: '' },
      prompt: { visible: false, title: '', label: '', options: [], mode: '', loading: false },
      storageTwoList: []
    };
  },
  computed: {
    showPtHtnumCol() {
      return showPtHtnumColumn();
    },
    isReceived() {
      const s = this.currentReceipt?.RECEIVE_RECEIPT_STATE;
      return s == 1 || s === '1' || s === '已收货';
    }
  },
  watch: {
    'legacy.visible'(v, old) {
      if (old && !v) this.loadDetails();
    }
  },
  created() {
    this.loadStorage();
    this.loadReceipts();
    if (hpFlags.showStorageTwo) this.loadStorageTwoList();
  },
  methods: {
    fmtReceiveState,
    fmtDateTime,
    fmtDate10,
    fmtPrintCount,
    fmtPrice,
    fmtUploadState,
    fmtTemperature,
    fmtOrderType,
    fmtYesNo,
    fmtEnable,
    fmtFundsSource,
    fmtVarType,
    proPicList,
    markDirty() {
      this.dirty = true;
      this.goodsSaved = false;
    },
    onDetailSelectionChange(rows) {
      this.detailSelection = rows;
    },
    mapDetailRow(r) {
      return {
        ...r,
        _prodDate: fmtDate10(r.Batch_Production_Date),
        _validDate: fmtDate10(r.Batch_Validity_Period),
        _skuId: r.SKU_ID != null && r.SKU_ID !== '' ? String(r.SKU_ID) : '',
        _qualified: r.IS_HG != null && r.IS_HG !== '' ? String(r.IS_HG) : '1'
      };
    },
    openWin(url) {
      window.open(url);
    },
    previewPic(picCsv, idx) {
      const list = proPicList(picCsv);
      const u = list[idx];
      if (u) this.openWin(u);
    },
    openLegacy(path, title) {
      this.legacy = { visible: true, path, title };
    },
    onToManualList() {
      this.openLegacy('/Frame/CreateTakeGoodsFromSystem', '转人工收货单');
    },
    async loadStorage() {
      try {
        this.storageList = await getStorageWithToken();
      } catch (_) {
        this.storageList = [];
      }
    },
    async loadStorageTwoList() {
      try {
        const res = await getStorageTwoInfo();
        this.storageTwoList = (res.result || []).map((r) => ({
          label: r.STORAGE_TWO_NAME || r.NAME,
          value: String(r.STORAGE_TWO_ID || r.ID)
        }));
      } catch (_) {
        this.storageTwoList = [];
      }
    },
    async loadReceipts() {
      this.receiptLoading = true;
      try {
        const res = await searchSystemReceipts({
          condition: this.receiptQuery.condition,
          statu: this.receiptQuery.statu,
          storageId: this.receiptQuery.storageId,
          page: 1,
          size: 100
        });
        this.receiptList = res.result || [];
      } catch (e) {
        Message.error(e.message || '加载收货单失败');
      } finally {
        this.receiptLoading = false;
      }
    },
    async onReceiptSelect(row) {
      this.currentReceipt = row;
      this.detailSelection = [];
      if (!row) {
        this.receiptHeader = null;
        this.detailRows = [];
        this.qtySum = '';
        this.moneySum = '';
        return;
      }
      await this.loadReceiptHeader(row.Goods_Var_Cargo_Receipt_Id);
      await this.loadDetails();
    },
    async loadReceiptHeader(receiptId) {
      try {
        const res = await getSystemReceiptExtend(receiptId);
        const list = res.result || [];
        this.receiptHeader = list.length ? list[0] : null;
      } catch (_) {
        this.receiptHeader = null;
      }
    },
    validateSystemReceiptSku() {
      if (!this.flags.isSkuShow) return true;
      const msgs = [];
      for (const r of this.detailRows) {
        const skus = r.SKUS || [];
        const hasReal = skus.some((s) => s && s.ID !== '' && s.ID != null);
        if (!hasReal) continue;
        const vid = r._skuId != null ? String(r._skuId).trim() : '';
        if (!vid) {
          msgs.push(`品种编码：${r.Varietie_Code_New}（${r.Varietie_Name || '未知品种'}）的SKU必须选择`);
        }
      }
      if (msgs.length) {
        Message.error(msgs.join('；'));
        return false;
      }
      return true;
    },
    syncRowsForSave(rows) {
      for (const r of rows) {
        r.Batch_Production_Date = r._prodDate;
        r.Batch_Validity_Period = r._validDate;
      }
    },
    validateSaveRows(rows) {
      const minD = new Date();
      minD.setMonth(minD.getMonth() + 1);
      const minStr = `${minD.getFullYear()}-${String(minD.getMonth() + 1).padStart(2, '0')}-${String(minD.getDate()).padStart(2, '0')}`;
      for (const r of rows) {
        const valid = fmtDate10(r._validDate || r.Batch_Validity_Period);
        if (valid && valid < minStr) {
          Message.warning(`品种 ${r.Varietie_Code_New} 的有效期不得少于当前日期1个月`);
          return false;
        }
        if (Number(r.Netreceipts) > Number(r.Receivable)) {
          Message.warning(`品种 ${r.Varietie_Code_New} 的实收数量不得大于应收数量`);
          return false;
        }
      }
      return true;
    },
    async loadDetails() {
      if (!this.currentReceipt) return;
      this.detailLoading = true;
      try {
        const res = await searchSystemVarieties(
          this.currentReceipt.Goods_Var_Cargo_Receipt_Id,
          this.detailSearch,
          1,
          300
        );
        const raw = res.result || [];
        this.detailRows = raw.map((r) => this.mapDetailRow(r));
        this.qtySum =
          res.sqlSumQty != null
            ? String(res.sqlSumQty)
            : String(raw.reduce((s, r) => s + (Number(r.Netreceipts) || 0), 0));
        this.moneySum =
          res.sqlSumMoney != null
            ? String(res.sqlSumMoney)
            : String(
                raw.reduce((s, r) => s + (Number(r.Supply_Price) || 0) * (Number(r.Netreceipts) || 0), 0)
              );
        this.dirty = false;
        this.goodsSaved = true;
        this.$nextTick(() => {
          const tb = this.$refs.detailTable;
          if (!tb) return;
          this.detailRows.forEach((r) => {
            tb.toggleRowSelection(r, true);
          });
        });
      } catch (e) {
        Message.error(e.message || '加载明细失败');
      } finally {
        this.detailLoading = false;
      }
    },
    async onAutoSave() {
      if (!this.currentReceipt) return;
      try {
        const res = await autoSaveNetreceipts(this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
        Message.success(res.msg || '操作成功');
        await this.loadDetails();
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async onSaveDetails() {
      if (!this.detailSelection.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      this.syncRowsForSave(this.detailSelection);
      if (!this.validateSaveRows(this.detailSelection)) return;
      try {
        await commitVarietieNetreceipts(buildSystemSaveJson(this.detailSelection));
        Message.success('已成功保存');
        this.dirty = false;
        this.goodsSaved = true;
        await this.loadDetails();
      } catch (e) {
        Message.error(e.message || '保存失败');
      }
    },
    async onConfirmReceipt() {
      if (!this.currentReceipt) return;
      if (!this.goodsSaved || this.dirty) {
        Message.warning('已对收货明细单进行了修改，请先保存后再收货');
        return;
      }
      if (!this.validateSystemReceiptSku()) return;
      try {
        await checkVarietieBatch(this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
        await MessageBox.confirm('确定要进行收货操作吗？', '提示', { type: 'warning' });
        const receiptId = this.currentReceipt.Goods_Var_Cargo_Receipt_Id;
        await confirmSystemReceipt(receiptId);
        Message.success('收货成功');
        try {
          const exp = await checkExpireProdInfoSystem(receiptId);
          if (exp && String(exp.expireResult) === '400' && exp.msg) Message.warning(exp.msg);
        } catch (_) {
          /* ignore */
        }
        await this.loadReceipts();
        this.onReceiptSelect(null);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '收货失败');
      }
    },
    async onConfirmAndSend(row, type) {
      if (!row.PLAN_DEPT_TWO_NAME) {
        Message.warning('该入库单无来源科室,无法直接出库');
        return;
      }
      const tip =
        type === 1
          ? `确认收货单号 "${row.Delivery_Note_Number}" 收货并出库(仅专科专用)至 ${row.PLAN_DEPT_TWO_NAME}？`
          : `确认收货单号 "${row.Delivery_Note_Number}" 收货并全部出库至 ${row.PLAN_DEPT_TWO_NAME}？`;
      try {
        await MessageBox.confirm(tip, '提示', { type: 'warning' });
        const res = await confirmSystemReceiptAndSend(row.Goods_Var_Cargo_Receipt_Id, type);
        Message.success(res.msg || '操作成功');
        await this.loadReceipts();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onReback(row) {
      try {
        await MessageBox.confirm(`确认是否打回收货单号 "${row.Delivery_Note_Number}"？`, '打回确认', { type: 'warning' });
        const res = await rebackDeliveryNumber(row.Delivery_Note_Number);
        Message.success(res.msg || '操作成功');
        await this.loadReceipts();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '打回失败');
      }
    },
    printBlocked() {
      const stOrBdrm = HOME_HP === 'bdrm' || ST_PRINT_BLOCK.includes(HOME_HP);
      return stOrBdrm && !this.isReceived;
    },
    async onPrint() {
      if (!this.currentReceipt) {
        Message.warning('请先选中收货单');
        return;
      }
      if (this.printBlocked()) {
        Message.warning(`收货单:${this.currentReceipt.Delivery_Note_Number}未收货，禁止打印`);
        return;
      }
      try {
        const path = getSystemPrintApiPath();
        const size = this.printSize && String(this.printSize).trim() ? this.printSize : '10';
        const res = await printReceiptExcel(path, {
          receiptId: this.currentReceipt.Goods_Var_Cargo_Receipt_Id,
          centrDelivery_Note_Number: this.currentReceipt.Delivery_Note_Number,
          CentreBankSIZE: size
        });
        openExcelFile(res.msg);
      } catch (e) {
        Message.error(e.message || '打印失败');
      }
    },
    async onSkuChange(row) {
      const batchId = row.BATCH_ID;
      if (!batchId || !this.currentReceipt) return;
      try {
        await updateVarSku(batchId, row._skuId || '', this.currentReceipt.Delivery_Note_Number);
      } catch (e) {
        Message.error(e.message || '更新SKU失败');
      }
    },
    async onQualifiedChange(row) {
      const batchId = row.BATCH_ID;
      if (!batchId || !this.currentReceipt) return;
      try {
        await updateVarQualified(batchId, row._qualified, this.currentReceipt.Delivery_Note_Number);
      } catch (e) {
        Message.error(e.message || '更新失败');
      }
    },
    async onNewAddRow(row) {
      if (!this.currentReceipt) return;
      try {
        await MessageBox.confirm('确定新增当前这一条收货数据吗？', '提示', { type: 'warning' });
        const batchId = row.BATCH_ID;
        if (!batchId) {
          Message.warning('缺少批次标识');
          return;
        }
        await newAddDeliveredVarietiets(this.currentReceipt.Delivery_Note_Number, batchId);
        Message.success('操作成功');
        await this.loadDetails();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onInitPPContract() {
      if (!this.detailSelection.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      const first = this.detailSelection[0];
      try {
        const res = await initPPContract({
          deliveryNoteNumber: first.Delivery_Note_Number || this.currentReceipt.Delivery_Note_Number,
          detailIds: this.detailSelection.map((r) => r.Def_No_Pkg_Receipt_Detail_Id)
        });
        Message.success(res.msg || '操作成功');
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    openBatchDialog(mode) {
      if (!this.detailSelection.length && mode !== 'headerInvoice') {
        Message.warning('请至少选中一行数据');
        return;
      }
      const map = {
        orderType: { title: '修改采购方式', label: '采购方式', options: ORDER_OPTS },
        funds: { title: '修改资金来源', label: '资金来源', options: FUNDS_OPTS },
        varType: { title: '修改物资类型', label: '物资类型', options: VAR_TYPE_OPTS },
        temperature: { title: '修改收货温度', label: '收货温度', options: TEMP_OPTS },
        storageTwo: { title: '修改收货仓库', label: '二级仓库', options: this.storageTwoList },
        ptBz: { title: '平台单号备注', label: '备注', options: [] },
        price: { title: '修改收货价格', label: '价格', options: [] },
        invoice: { title: '添加明细发票', label: '发票', options: [] }
      };
      const cfg = map[mode];
      if (!cfg) return;
      this.prompt = { visible: true, title: cfg.title, label: cfg.label, options: cfg.options, mode, loading: false };
    },
    openInvoiceDialog() {
      this.prompt = {
        visible: true,
        title: '货票同行填写发票',
        label: '发票号码',
        options: [],
        mode: 'headerInvoice',
        loading: false
      };
    },
    async onPromptConfirm(val) {
      if (val === '' && !['headerInvoice'].includes(this.prompt.mode)) {
        Message.warning('请填写内容');
        return;
      }
      this.prompt.loading = true;
      const json = buildDefIdJson(this.detailSelection);
      const postData = buildDefIdJson(this.detailSelection);
      try {
        const m = this.prompt.mode;
        if (m === 'orderType') await upVarOrderType(json, val);
        else if (m === 'funds') await upFundsSource(postData, val);
        else if (m === 'varType') await upVarTypeSource(postData, val);
        else if (m === 'temperature') await upGoodTemp(postData, val);
        else if (m === 'storageTwo') await upStorageTwo(postData, val);
        else if (m === 'ptBz') await saveDeliveredBz(json, val);
        else if (m === 'price') {
          const row = this.detailSelection[0];
          if (!row) return;
          await upShPriceCommit(row.Def_No_Pkg_Receipt_Detail_Id, val);
        } else if (m === 'headerInvoice') {
          const fd = new FormData();
          const tk =
            sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
          fd.append('Token', tk);
          fd.append('RECEIPT_ID', this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
          fd.append('INVOICE_NUMS', val || '');
          fd.append('TYPE', '1');
          await commitNydReceiptAndInvoice(fd);
        } else if (m === 'invoice') await addSysDetailFp(json, val);
        Message.success('保存成功');
        this.prompt.visible = false;
        await this.loadDetails();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.prompt.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.take-system .toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  align-items: center;
}
.take-system .toolbar.wrap {
  max-height: 80px;
  overflow-y: auto;
}
.take-system .lbl {
  font-size: 12px;
  color: #606266;
}
.take-system .section-title {
  font-weight: 600;
  margin-bottom: 8px;
  border-bottom: 2px solid #3e9ef7;
  display: inline-block;
}
.take-system .sum-tip {
  margin-bottom: 8px;
  font-size: 13px;
}
.take-system .sum-tip .ml {
  margin-left: 16px;
}
.take-system .header-card {
  margin-bottom: 8px;
  font-size: 13px;
}
.take-system .header-card .ml {
  margin-left: 16px;
}
.take-system .pic-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  align-items: center;
}
.take-system .thumb {
  width: 36px;
  height: 36px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
}
.take-system .pic-pdf {
  padding: 0;
}
</style>
