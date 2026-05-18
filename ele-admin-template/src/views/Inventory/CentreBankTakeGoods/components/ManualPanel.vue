<template>
  <div class="take-manual">
    <el-row :gutter="12">
      <el-col :span="7">
        <el-card shadow="never" class="panel-card">
          <div class="toolbar">
            <el-input v-model="receiptQuery.condition" size="mini" clearable placeholder="收货单/备货单号" @keyup.enter.native="loadReceipts" />
            <el-date-picker v-model="receiptQuery.timeStart" type="date" size="mini" value-format="yyyy-MM-dd" placeholder="开始" style="width: 118px" />
            <el-date-picker v-model="receiptQuery.timeEnd" type="date" size="mini" value-format="yyyy-MM-dd" placeholder="结束" style="width: 118px" />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadReceipts" />
          </div>
          <div class="toolbar">
            <el-button size="mini" type="primary" @click="onCreateReceipt">创建普通收货单</el-button>
            <el-button v-if="flags.showOverflowReceipt" size="mini" type="primary" @click="onCreateReceiptDirect('1')">创建盘溢收货单</el-button>
            <el-button size="mini" @click="historyVisible = true">历史收货单号</el-button>
          </div>
          <div class="toolbar">
            <el-button size="mini" type="primary" :disabled="!currentReceipt" @click="onConfirmReceipt">确认收货</el-button>
            <el-button size="mini" type="danger" :disabled="!currentReceipt" @click="onDeleteEmpty">删除空单</el-button>
          </div>
          <div class="toolbar">
            <span class="lbl">收货库区</span>
            <el-select v-model="storageId" size="mini" style="width: 120px" placeholder="库区">
              <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
            </el-select>
            <span class="lbl">单据状态</span>
            <el-select v-model="receiptQuery.statu" size="mini" style="width: 90px" @change="loadReceipts">
              <el-option label="未收货" value="0" />
              <el-option label="全部" value="" />
              <el-option label="已收货" value="1" />
            </el-select>
          </div>
          <el-table v-loading="receiptLoading" :data="receiptList" border stripe size="mini" height="380" highlight-current-row @current-change="onReceiptSelect">
            <el-table-column prop="Name" label="库区" width="80" show-overflow-tooltip />
            <el-table-column prop="Delivery_Note_Number" label="收货单号" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Prepare_Goods_Plan_Number" label="备货单号" min-width="100" show-overflow-tooltip />
            <el-table-column label="收货状态" width="72">
              <template slot-scope="{ row }">{{ fmtReceiveState(row.RECEIVE_RECEIPT_STATE) }}</template>
            </el-table-column>
            <el-table-column label="单号类型" width="90">
              <template slot-scope="{ row }">{{ fmtReceiveProperty(row.Receive_Property) }}</template>
            </el-table-column>
            <el-table-column label="创建时间" width="100">
              <template slot-scope="{ row }">{{ fmtDate10(row.Supplier_Delivery_Time) }}</template>
            </el-table-column>
            <el-table-column prop="Note_Description" label="备注" min-width="80" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card v-if="receiptHeader" shadow="never" class="header-card">
          <span>收货单：{{ receiptHeader.Delivery_Note_Number }}</span>
          <span class="ml">备货单：{{ receiptHeader.Prepare_Goods_Plan_Number }}</span>
          <span class="ml">创建：{{ fmtDateTime(receiptHeader.Supplier_Delivery_Time) }}</span>
          <span class="ml">状态：{{ fmtReceiveState(receiptHeader.Receive_Receipt_State) }}</span>
          <span v-if="storageTip" class="storage-tip">{{ storageTip }}</span>
        </el-card>
        <el-card shadow="never" class="panel-card">
          <div class="section-title">请选择收货品种</div>
          <div class="toolbar">
            <el-input v-model="varietySearch" size="mini" clearable placeholder="编码/名称/企业/规格/供应商" style="flex: 1; min-width: 280px" @keyup.enter.native="loadSearchVarieties" />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadSearchVarieties" />
            <el-button size="mini" type="primary" :disabled="!currentReceipt || !searchSelection.length" @click="onAddVarieties">添加</el-button>
            <el-button size="mini" :disabled="!currentReceipt" @click="openInvoiceDialog('header')">填写发票</el-button>
          </div>
          <el-table v-loading="searchLoading" :data="searchVarieties" border stripe size="mini" height="240" @selection-change="(s) => (searchSelection = s)">
            <el-table-column type="selection" width="48" align="center" fixed="left" />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
            <el-table-column prop="Varietie_Name" label="品种全称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="Approval_Number" label="批准文号" width="110" show-overflow-tooltip />
            <el-table-column prop="Specification_Or_Type" label="规格" width="90" />
            <el-table-column prop="Unit" label="单位" width="50" align="center" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="110" show-overflow-tooltip />
            <el-table-column v-if="flags.isCg" label="采购价" width="80" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Purchase_Price) }}</template>
            </el-table-column>
            <el-table-column label="结算价" width="80" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Supply_Price, row.price_bl) }}</template>
            </el-table-column>
            <el-table-column prop="Supplier_Name" label="供应商" min-width="100" show-overflow-tooltip />
            <el-table-column label="启用状态" width="72">
              <template slot-scope="{ row }">{{ fmtEnable(row.Enable) }}</template>
            </el-table-column>
            <el-table-column v-if="flags.isSkuShow" label="品种SKU" width="140">
              <template slot-scope="{ row }">
                <el-select v-model="row._edit.skuId" size="mini" placeholder="SKU" clearable style="width: 120px">
                  <el-option v-for="s in row.SKUS || []" :key="s.ID" :label="s.SKU_NAME" :value="String(s.ID)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="是否合格" width="90">
              <template slot-scope="{ row }">
                <el-select v-model="row._edit.qualified" size="mini" style="width: 72px">
                  <el-option label="合格" value="1" />
                  <el-option label="不合格" value="0" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="生产批号" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.batch" size="mini" @blur="onSearchBatchBlur(row)" />
              </template>
            </el-table-column>
            <el-table-column label="灭菌批号" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.fjBatch" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="生产日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.prodDate" size="mini" placeholder="yyyy-MM-dd" />
              </template>
            </el-table-column>
            <el-table-column label="有效日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.validDate" size="mini" placeholder="yyyy-MM-dd" />
              </template>
            </el-table-column>
            <el-table-column label="实收数量" width="88">
              <template slot-scope="{ row }">
                <el-input-number v-model="row._edit.netreceipts" size="mini" :min="0" :controls="false" style="width: 72px" />
              </template>
            </el-table-column>
            <el-table-column label="备注" width="90">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.note" size="mini" />
              </template>
            </el-table-column>
            <el-table-column v-if="flags.isStHospital" label="平台合同编号" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row._edit.ptHtnum" size="mini" />
              </template>
            </el-table-column>
          </el-table>

          <div class="section-title mt">已添加的收货品种列表</div>
          <div class="toolbar wrap">
            <el-input v-model="printSize" size="mini" placeholder="打印条数" style="width: 90px" />
            <el-button size="mini" type="primary" :disabled="!currentReceipt" @click="onPrint">打印收货单</el-button>
            <el-button size="mini" type="danger" :disabled="!addedSelection.length" @click="onDeleteAdded">删除</el-button>
            <el-button size="mini" :disabled="!addedSelection.length" @click="onSaveAdded">保存明细</el-button>
            <el-button size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('orderType')">修改采购方式</el-button>
            <el-button size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('jcType')">修改集采类型</el-button>
            <el-button size="mini" :disabled="!addedSelection.length" @click="openInvoiceDialog('detail')">添加明细发票</el-button>
            <el-button v-if="flags.showVarType" size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('varType')">修改物资类型</el-button>
            <el-button v-if="flags.showVarType" size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('temperature')">修改收货温度</el-button>
            <el-button v-if="flags.showFundsSource" size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('funds')">修改资金来源</el-button>
            <el-button v-if="flags.showStorageTwo" size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('storageTwo')">修改收货仓库</el-button>
            <el-button size="mini" :disabled="!addedSelection.length" @click="openBatchDialog('ptBz')">平台单号备注</el-button>
          </div>
          <el-table
            ref="addedTable"
            v-loading="addedLoading"
            :data="addedVarieties"
            border
            stripe
            size="mini"
            height="280"
            @selection-change="(s) => (addedSelection = s)"
          >
            <el-table-column type="selection" width="48" align="center" fixed="left" />
            <el-table-column prop="Name" label="院区库房" width="90" align="center" />
            <el-table-column v-if="flags.isStHospital" prop="PT_HTNUM" label="平台单号" width="100" />
            <el-table-column prop="Varietie_Code" label="品种编码" width="95" />
            <el-table-column prop="Varietie_Name" label="品种全称" min-width="130" show-overflow-tooltip />
            <el-table-column prop="Approval_Number" label="批准文号" width="110" show-overflow-tooltip />
            <el-table-column v-if="flags.isCg" label="采购价" width="80" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Purchase_Price) }}</template>
            </el-table-column>
            <el-table-column label="价格" width="80" align="right">
              <template slot-scope="{ row }">{{ fmtPrice(row.Supply_Price) }}</template>
            </el-table-column>
            <el-table-column prop="Specification_Or_Type" label="规格" width="90" />
            <el-table-column prop="Unit" label="单位" width="50" align="center" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Supplier_Name" label="供应商" min-width="100" show-overflow-tooltip />
            <el-table-column label="生产批号" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row.Batch" size="mini" :disabled="isReceived" />
              </template>
            </el-table-column>
            <el-table-column prop="DISINFECTION_BATCH" label="灭菌批号" width="90" />
            <el-table-column label="生产日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.Batch_Production_Date" size="mini" :disabled="isReceived" />
              </template>
            </el-table-column>
            <el-table-column label="有效日期" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.Batch_Validity_Period" size="mini" :disabled="isReceived" />
              </template>
            </el-table-column>
            <el-table-column label="实收散货数量" width="95" align="center">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.Netreceipts" size="mini" :min="0" :controls="false" :disabled="isReceived" style="width: 72px" />
              </template>
            </el-table-column>
            <el-table-column label="检验报告" width="88" align="center">
              <template>
                <el-button type="text" size="mini" @click="openLegacy('/Frame/UploadvarietyInspection', '上传检验报告')">上传</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template>
                <el-button type="text" size="mini" @click="openLegacy('/Frame/CentreBankTakeGoogsUdiScan', '添加UDI')">添加UDI</el-button>
                <el-button type="text" size="mini" @click="openLegacy('/Frame/CentreBankWatchUDI', '查看UDI')">查看UDI</el-button>
              </template>
            </el-table-column>
            <el-table-column label="上传状态" width="80">
              <template slot-scope="{ row }">{{ fmtUploadState(row.Batch_Pic_Full_Name) }}</template>
            </el-table-column>
            <el-table-column label="添加日期" width="100">
              <template slot-scope="{ row }">{{ fmtDate10(row.Add_Time) }}</template>
            </el-table-column>
            <el-table-column prop="Note_Description" label="备注" width="90" show-overflow-tooltip />
            <el-table-column prop="BILLFPNUM" label="发票" width="90" show-overflow-tooltip />
            <el-table-column v-if="flags.showStorageTwo" prop="STORAGE_TWO_NAME" label="仓库名称" width="90" />
            <el-table-column v-if="flags.showFundsSource" label="资金来源" width="100">
              <template slot-scope="{ row }">{{ fmtFundsSource(row.FUNDS_SOURCE) }}</template>
            </el-table-column>
            <el-table-column label="物资类型" width="90">
              <template slot-scope="{ row }">{{ fmtVarType(row.VAR_TYPE) }}</template>
            </el-table-column>
            <el-table-column label="收货温度" width="80">
              <template slot-scope="{ row }">{{ fmtTemperature(row.TEMPERATURE) }}</template>
            </el-table-column>
            <el-table-column prop="MEDICAL_CODE" label="医保编码" width="110" show-overflow-tooltip />
            <el-table-column label="采购方式" width="90">
              <template slot-scope="{ row }">{{ fmtOrderType(row.ORDER_TYPE) }}</template>
            </el-table-column>
            <el-table-column prop="DEF_POSITION" label="默认货位" width="90" />
            <el-table-column prop="TJ_POSITION" label="推荐货位" width="90" />
            <el-table-column prop="JC_TYPE" label="集采类型" width="90" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <DeliveryHistoryDialog :visible.sync="historyVisible" />
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
import DeliveryHistoryDialog from './DeliveryHistoryDialog.vue';
import LegacyFrameDialog from './LegacyFrameDialog.vue';
import PromptDialog from './PromptDialog.vue';
import {
  getStorageList,
  searchManualReceipts,
  getManualReceiptExtend,
  getManualDeliveredVarieties,
  searchManualVarieties,
  createManualReceipt,
  addManualVarieties,
  saveManualVarieties,
  deleteManualVarieties,
  checkVarietieBatch,
  confirmManualReceipt,
  deleteEmptyManualDelivery,
  getManualPrintApiPath,
  printReceiptExcel,
  getVarietieBatchDate,
  saveDeliveredBz,
  upVarOrderType,
  upVarJcType,
  upFundsSource,
  upVarTypeSource,
  upGoodTemp,
  getStorageTwoInfo,
  upStorageTwo,
  addSysDetailFp
} from '@/api/Inventory/CentreBankTakeGoods';
import {
  fmtReceiveState,
  fmtReceiveProperty,
  fmtDate10,
  fmtDateTime,
  fmtEnable,
  fmtPrice,
  fmtUploadState,
  fmtFundsSource,
  fmtVarType,
  fmtTemperature,
  fmtOrderType,
  openExcelFile,
  buildManualAddJson,
  buildManualSaveJson,
  buildManualDeleteJson,
  buildIdJson,
  hpFlags,
  initSearchRow,
  monthAheadDate
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

export default {
  name: 'ManualPanel',
  components: { DeliveryHistoryDialog, LegacyFrameDialog, PromptDialog },
  data() {
    return {
      flags: hpFlags,
      storageList: [],
      storageId: '',
      receiptQuery: { condition: '', statu: '0', timeStart: '', timeEnd: '' },
      receiptList: [],
      receiptLoading: false,
      currentReceipt: null,
      receiptHeader: null,
      storageTip: '',
      varietySearch: '',
      searchVarieties: [],
      searchLoading: false,
      searchSelection: [],
      addedVarieties: [],
      addedLoading: false,
      addedSelection: [],
      historyVisible: false,
      printSize: '4',
      noteDescription: '',
      legacy: { visible: false, title: '', path: '' },
      prompt: { visible: false, title: '', label: '', options: [], mode: '', loading: false },
      storageTwoList: [],
      invoiceMode: 'detail'
    };
  },
  watch: {
    'legacy.visible'(v, old) {
      if (old && !v) this.loadReceipts();
    }
  },
  computed: {
    isReceived() {
      const s = this.currentReceipt?.RECEIVE_RECEIPT_STATE;
      return s == 1 || s === '1' || s === '已收货';
    }
  },
  created() {
    this.loadStorage();
    this.loadReceipts();
    this.loadSearchVarieties();
    if (hpFlags.showStorageTwo) this.loadStorageTwo();
  },
  methods: {
    fmtReceiveState,
    fmtReceiveProperty,
    fmtDate10,
    fmtDateTime,
    fmtEnable,
    fmtPrice,
    fmtUploadState,
    fmtFundsSource,
    fmtVarType,
    fmtTemperature,
    fmtOrderType,
    openLegacy(path, title) {
      this.legacy = { visible: true, path, title };
    },
    async loadStorageTwo() {
      try {
        const res = await getStorageTwoInfo();
        this.storageTwoList = (res.result || []).map((r) => ({
          label: r.STORAGE_TWO_NAME || r.NAME,
          value: String(r.STORAGE_TWO_ID || r.ID)
        }));
      } catch (_) {
        /* ignore */
      }
    },
    async loadStorage() {
      try {
        this.storageList = await getStorageList();
        if (this.storageList.length && !this.storageId) {
          this.storageId = String(this.storageList[0].ID);
        }
      } catch (e) {
        Message.error(e.message || '加载库区失败');
      }
    },
    async loadReceipts() {
      this.receiptLoading = true;
      try {
        const res = await searchManualReceipts(this.receiptQuery);
        this.receiptList = res.result || [];
      } catch (e) {
        Message.error(e.message || '加载收货单失败');
      } finally {
        this.receiptLoading = false;
      }
    },
    async onReceiptSelect(row) {
      this.currentReceipt = row || null;
      this.receiptHeader = null;
      this.addedVarieties = [];
      this.storageTip = row ? `收货库区：${row.Name || ''}` : '';
      if (!row) return;
      try {
        const ext = await getManualReceiptExtend(row.Goods_Var_Cargo_Receipt_Id);
        this.receiptHeader = (ext.result && ext.result[0]) || null;
      } catch (e) {
        Message.error(e.message || '加载单头失败');
      }
      this.loadAddedVarieties();
    },
    async loadSearchVarieties() {
      this.searchLoading = true;
      try {
        const res = await searchManualVarieties(this.varietySearch, 1, 80);
        this.searchVarieties = (res.result || []).map((r) => initSearchRow(r, this.noteDescription));
      } catch (e) {
        Message.error(e.message || '搜索失败');
      } finally {
        this.searchLoading = false;
      }
    },
    async onSearchBatchBlur(row) {
      const batch = row._edit?.batch;
      if (!batch || !row.Varietie_Code) return;
      try {
        const res = await getVarietieBatchDate(row.Varietie_Code, batch);
        const info = res.result?.[0] || res.result;
        if (info) {
          if (info.Batch_Production_Date) row._edit.prodDate = fmtDate10(info.Batch_Production_Date);
          if (info.Batch_Validity_Period) row._edit.validDate = fmtDate10(info.Batch_Validity_Period);
        }
      } catch (_) {
        /* ignore */
      }
    },
    async loadAddedVarieties() {
      if (!this.currentReceipt) return;
      this.addedLoading = true;
      try {
        const res = await getManualDeliveredVarieties(this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
        this.addedVarieties = (res.result || []).map((r) => ({
          ...r,
          Batch_Production_Date: fmtDate10(r.Batch_Production_Date),
          Batch_Validity_Period: fmtDate10(r.Batch_Validity_Period)
        }));
        this.$nextTick(() => {
          this.addedVarieties.forEach((r) => this.$refs.addedTable?.toggleRowSelection(r, true));
        });
      } catch (e) {
        Message.error(e.message || '加载明细失败');
      } finally {
        this.addedLoading = false;
      }
    },
    onCreateReceipt() {
      if (!this.storageId || this.storageId === '0') {
        Message.warning('请选择收货库区');
        return;
      }
      this.prompt = {
        visible: true,
        title: '创建普通收货单',
        label: '备注',
        options: [],
        mode: 'createReceipt',
        loading: false
      };
    },
    async onCreateReceiptDirect(receiveProperty) {
      try {
        await MessageBox.confirm(
          receiveProperty === '1' ? '确定要创建新的盘溢收货单吗？' : '确定要创建新的收货单吗？',
          '提示',
          { type: 'warning' }
        );
        await createManualReceipt({
          receiveProperty: String(receiveProperty),
          storageId: this.storageId,
          noteDescription: this.noteDescription
        });
        Message.success('创建成功');
        this.loadReceipts();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '创建失败');
      }
    },
    validateSearchRows(rows) {
      const minDate = monthAheadDate();
      for (const r of rows) {
        const e = r._edit || {};
        if (!e.batch) {
          Message.warning(`品种 ${r.Varietie_Name} 的生产批号不能为空`);
          return false;
        }
        if (!e.fjBatch) {
          Message.warning(`品种 ${r.Varietie_Name} 的灭菌批号不能为空`);
          return false;
        }
        if (e.prodDate && String(e.prodDate).length !== 10) {
          Message.warning(`品种 ${r.Varietie_Name} 生产日期格式应为 yyyy-MM-dd`);
          return false;
        }
        if (e.validDate && String(e.validDate).length !== 10) {
          Message.warning(`品种 ${r.Varietie_Name} 有效日期格式应为 yyyy-MM-dd`);
          return false;
        }
        if (e.validDate && minDate > e.validDate) {
          Message.warning(`品种 ${r.Varietie_Name} 的有效日期不得少于当前日期1个月`);
          return false;
        }
        const note = (e.note || this.noteDescription || '').trim();
        if (!note) {
          Message.warning(`品种 ${r.Varietie_Name} 备注不能为空`);
          return false;
        }
        r.Hidden_Batch = e.batch;
        r.Hidden_FJ_batch = e.fjBatch;
        r.Hidden_Batch_Production_Date = e.prodDate;
        r.Hidden_Batch_Validity_Period = e.validDate;
        r.Hidden_Netreceipts = e.netreceipts;
        r.Hidden_Note_Description = note;
        r.Hidden_PT_HTNUM = e.ptHtnum || '';
        r.Hidden_IS_HG = e.qualified;
        r._skuId = e.skuId || 0;
      }
      return true;
    },
    async onAddVarieties() {
      if (!this.currentReceipt) return;
      if (!this.validateSearchRows(this.searchSelection)) return;
      try {
        const json = buildManualAddJson(this.searchSelection, this.noteDescription);
        await addManualVarieties(this.currentReceipt.Goods_Var_Cargo_Receipt_Id, json);
        Message.success('添加成功');
        this.loadAddedVarieties();
        this.loadSearchVarieties();
      } catch (e) {
        Message.error(e.message || '添加失败');
      }
    },
    async onSaveAdded() {
      if (!this.addedSelection.length) {
        Message.warning('请选择要保存的行');
        return;
      }
      try {
        await saveManualVarieties(buildManualSaveJson(this.addedSelection));
        Message.success('保存成功');
        this.loadAddedVarieties();
      } catch (e) {
        Message.error(e.message || '保存失败');
      }
    },
    async onDeleteAdded() {
      try {
        await MessageBox.confirm('确定删除选中明细？', '提示', { type: 'warning' });
        await deleteManualVarieties(buildManualDeleteJson(this.addedSelection));
        Message.success('删除成功');
        this.loadAddedVarieties();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '删除失败');
      }
    },
    async onConfirmReceipt() {
      if (!this.currentReceipt) return;
      if (!this.addedVarieties.length) {
        Message.warning('该收货单未添加收货品种');
        return;
      }
      try {
        await checkVarietieBatch(this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
        await MessageBox.confirm('确定要进行收货操作吗？', '提示', { type: 'warning' });
        await confirmManualReceipt(this.currentReceipt.Goods_Var_Cargo_Receipt_Id);
        Message.success('收货成功');
        this.loadReceipts();
        this.onReceiptSelect(this.currentReceipt);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '收货失败');
      }
    },
    async onDeleteEmpty() {
      if (!this.currentReceipt) return;
      try {
        await MessageBox.confirm(`确认删除单号 ${this.currentReceipt.Delivery_Note_Number} 吗？`, '提示', { type: 'warning' });
        await deleteEmptyManualDelivery(this.currentReceipt.Delivery_Note_Number);
        Message.success('删除成功');
        this.currentReceipt = null;
        this.loadReceipts();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '删除失败');
      }
    },
    async onPrint() {
      if (!this.currentReceipt) return;
      if (!this.isReceived) {
        Message.warning('未收货的单据禁止打印');
        return;
      }
      try {
        const path = getManualPrintApiPath();
        const size = this.printSize || 4;
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
    openBatchDialog(mode) {
      if (!this.addedSelection.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      const map = {
        orderType: { title: '修改采购方式', label: '采购方式', options: ORDER_OPTS },
        jcType: { title: '修改集采类型', label: '集采类型', options: [] },
        funds: { title: '修改资金来源', label: '资金来源', options: FUNDS_OPTS },
        varType: { title: '修改物资类型', label: '物资类型', options: VAR_TYPE_OPTS },
        temperature: { title: '修改收货温度', label: '收货温度', options: TEMP_OPTS },
        storageTwo: { title: '修改收货仓库', label: '二级仓库', options: this.storageTwoList },
        ptBz: { title: '平台单号备注', label: '平台单号', options: [] }
      };
      const cfg = map[mode];
      if (!cfg) return;
      this.prompt = { visible: true, title: cfg.title, label: cfg.label, options: cfg.options, mode, loading: false };
    },
    openInvoiceDialog(mode) {
      this.invoiceMode = mode;
      this.prompt = {
        visible: true,
        title: mode === 'header' ? '填写发票' : '添加明细发票',
        label: '发票号码',
        options: [],
        mode: 'invoice',
        loading: false
      };
    },
    async onPromptConfirm(val) {
      const mode = this.prompt.mode;
      if (!val && mode !== 'jcType' && mode !== 'createReceipt') {
        Message.warning('请填写内容');
        return;
      }
      this.prompt.loading = true;
      const json = buildIdJson(this.addedSelection, 'Goods_Var_Receipt_Detail_Id');
      const postData = buildIdJson(this.addedSelection, 'Goods_Var_Receipt_Detail_Id');
      try {
        const m = mode;
        if (m === 'createReceipt') {
          await createManualReceipt({
            receiveProperty: '0',
            storageId: this.storageId,
            noteDescription: val || ''
          });
          Message.success('创建成功');
          this.prompt.visible = false;
          await this.loadReceipts();
          return;
        }
        if (m === 'orderType') await upVarOrderType(json, val);
        else if (m === 'jcType') await upVarJcType(json, val);
        else if (m === 'funds') await upFundsSource(postData, val);
        else if (m === 'varType') await upVarTypeSource(postData, val);
        else if (m === 'temperature') await upGoodTemp(postData, val);
        else if (m === 'storageTwo') await upStorageTwo(postData, val);
        else if (m === 'ptBz') await saveDeliveredBz(json, val);
        else if (m === 'invoice') {
          if (this.invoiceMode === 'detail') {
            await addSysDetailFp(json, val);
          } else {
            Message.info('表头发票请在创建收货单备注中维护，或使用明细发票功能');
            return;
          }
        }
        Message.success('保存成功');
        this.prompt.visible = false;
        this.loadAddedVarieties();
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
.take-manual .toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  align-items: center;
}
.take-manual .toolbar.wrap {
  max-height: 72px;
  overflow-y: auto;
}
.take-manual .lbl {
  font-size: 12px;
  color: #606266;
}
.take-manual .panel-card {
  margin-bottom: 0;
}
.take-manual .header-card {
  margin-bottom: 8px;
  font-size: 13px;
}
.take-manual .header-card .ml {
  margin-left: 16px;
}
.take-manual .storage-tip {
  margin-left: 16px;
  color: #f56c6c;
}
.take-manual .section-title {
  font-weight: 600;
  margin-bottom: 8px;
  border-bottom: 2px solid #3e9ef7;
  display: inline-block;
  padding-bottom: 4px;
}
.take-manual .section-title.mt {
  margin-top: 12px;
}
</style>
