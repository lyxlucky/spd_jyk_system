<template>
  <div class="variety-data-lzh-main">
    <VarietyDataLzhMainSearch ref="searchRef" @search="reload" />

    <div class="spd-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>操作</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="local-toolbar spd-toolbar">
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button v-if="canEdit" size="mini" type="primary" icon="el-icon-plus" @click="onAdd">
              添加
            </el-button>
            <el-button
              v-if="canEdit"
              size="mini"
              type="danger"
              plain
              :disabled="!selection.length"
              :loading="deleting"
              @click="onDelete"
            >
              删除
            </el-button>
            <el-button size="mini" :disabled="!selection.length" @click="openTempRemark">
              临时备注
            </el-button>
            <el-button size="mini" :disabled="!selection.length" @click="openBatchRemark">
              批量备注
            </el-button>
            <el-button size="mini" :disabled="!selection.length" @click="openContract">
              品种合同维护关系
            </el-button>
            <el-button size="mini" :disabled="!selection.length" @click="openDeptAuth">
              品种科室授权关系
            </el-button>
            <el-button
              v-if="showKubaoBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="kuboLoading"
              @click="onKubao"
            >
              库宝创建品种
            </el-button>
            <el-button size="mini" @click="onOpenOldZcz">查看新老注册证品种</el-button>
            <el-button size="mini" @click="onOpenExpiration">品种效期资料</el-button>
            <el-button size="mini" :disabled="!currentRow && !selection.length" @click="openBhRule">
              定数备货规则
            </el-button>
            <el-button size="mini" :loading="stopConLoading" @click="onStopCon">
              停用已停用品种的合同
            </el-button>
            <el-button
              v-if="showSzhnOesBtn"
              size="mini"
              type="primary"
              plain
              :disabled="!selection.length"
              :loading="oesSending"
              @click="onSendSzhnOes"
            >
              推送品种(OES)
            </el-button>
            <el-button
              v-if="showDapBtn"
              size="mini"
              type="primary"
              plain
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onPushDap"
            >
              推送到DAP
            </el-button>
            <el-button
              v-if="showStseBzBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onCommitStseBz"
            >
              品种备注已处理
            </el-button>
            <el-button
              v-if="showCommitSbBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onCommitStseSb"
            >
              提交字典
            </el-button>
            <el-button
              v-if="showStseSyncBtn"
              size="mini"
              type="primary"
              plain
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendStseVarHis"
            >
              发送同步品种
            </el-button>
            <el-button
              v-if="showStsePriceBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onStseUpdatePrice"
            >
              市二调价
            </el-button>
            <el-button
              v-if="showCsyyBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendCsyy"
            >
              发送品种(CSYY)
            </el-button>
            <el-button
              v-if="showStzyBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendStzy"
            >
              发送品种(STZY)
            </el-button>
            <el-button
              v-if="showStzlBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendStzl"
            >
              发送品种(STZL)
            </el-button>
            <el-button
              v-if="showChrmBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendChrm"
            >
              发送品种(CHRM)
            </el-button>
            <el-button
              v-if="showDhThreeBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendDhThree"
            >
              发送品种(南中)
            </el-button>
            <el-button
              v-if="showBdJfBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendBdJfBm"
            >
              计费编码回传标记
            </el-button>
            <el-button
              v-if="showFsApproveBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onSendFsApprove"
            >
              审批品种(佛山)
            </el-button>
            <el-button
              v-if="showFsSyncBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onFsSyncBranch"
            >
              推送分院
            </el-button>
            <el-button
              v-if="showFsSyncBtn"
              size="mini"
              :loading="hpActionLoading"
              @click="onFsSyncExcelClick"
            >
              上传Excel推送分院
            </el-button>
            <el-button
              v-if="showFsdlHisBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onPullHis"
            >
              推送HIS
            </el-button>
            <el-button
              v-if="showLglsHisBtn"
              size="mini"
              :disabled="!selection.length"
              :loading="hpActionLoading"
              @click="onPushLongGangHis"
            >
              推送HIS
            </el-button>
            <el-button
              v-if="showTjybspBtn"
              size="mini"
              :disabled="!selection.length"
              @click="onOpenTjybsp"
            >
              提交医保审批
            </el-button>
            <el-button v-if="showZqReceiveBtn" size="mini" @click="onCheckReceive">
              查看品种对接
            </el-button>
            <el-button
              v-if="showProvinceImport"
              size="mini"
              icon="el-icon-upload2"
              :loading="provinceImporting"
              @click="onProvinceImportClick(false)"
            >
              导入省平台
            </el-button>
            <el-button
              v-if="showProvinceImport"
              size="mini"
              icon="el-icon-upload2"
              :loading="provinceImporting"
              @click="onProvinceImportClick(true)"
            >
              添加省平台品种
            </el-button>
            <el-button
              v-if="showSzsmBidImport"
              size="mini"
              icon="el-icon-upload2"
              :loading="szsmBidImporting"
              @click="onSzsmBidImportClick"
            >
              中标信息导入
            </el-button>
            <el-button v-if="showSzsmBidImport" size="mini" plain @click="onDownloadSzsmBidTemplate">
              中标信息模板
            </el-button>
            <el-button size="mini" @click="onUpdateField">更新选定字段</el-button>
            <el-button v-if="showWxtBtn" size="mini" @click="onWxtAudit">微讯通品种审核</el-button>
            <el-button size="mini" @click="onExportFzShow">导出物资分类品种</el-button>
            <el-button
              v-if="canEdit"
              size="mini"
              icon="el-icon-upload2"
              :loading="importing"
              @click="onImportClick"
            >
              导入
            </el-button>
            <el-button v-if="canEdit" size="mini" plain @click="onDownloadImportTemplate">
              导出模板
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-upload2"
              :loading="ybImporting"
              @click="onYbImportClick"
            >
              批量提交医保审批
            </el-button>
          </div>
        </div>
        <div class="spd-toolbar__divider" />
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button
              v-if="showEnableBtn"
              size="mini"
              type="success"
              plain
              :disabled="!selection.length"
              @click="onEnable(1)"
            >
              启用
            </el-button>
            <el-button
              v-if="canEdit"
              size="mini"
              type="warning"
              plain
              :disabled="!selection.length"
              @click="onEnable(0)"
            >
              冻结
            </el-button>
            <el-button
              v-if="showCommitApproval"
              size="mini"
              :disabled="!selection.length"
              :loading="commitLoading"
              @click="onSendApproval"
            >
              发送审批
            </el-button>
            <el-button
              v-if="showDeptApplyBtn"
              size="mini"
              :disabled="!selection.length"
              @click="onStopDeptSl(1)"
            >
              禁止科室申请
            </el-button>
            <el-button
              v-if="showDeptApplyBtn"
              size="mini"
              :disabled="!selection.length"
              @click="onStopDeptSl(0)"
            >
              开启科室申请
            </el-button>
            <el-button v-if="showVarUpLogBtn" size="mini" icon="el-icon-document" @click="varUpLogVisible = true">
              修改日志
            </el-button>
          </div>
        </div>
        <div v-if="showExportToolbar" class="spd-toolbar__divider" />
        <div v-if="showExportToolbar" class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button
              v-if="canExport('export-VarietyDataLzhDc')"
              size="mini"
              icon="el-icon-download"
              title="普通导出：数据量过大易超时，建议不超过 1 万条"
              :loading="exporting"
              @click="onExport"
            >
              导出
            </el-button>
            <el-button
              v-if="canExport('export-VarietyDataLzhDc') && showExportHp"
              size="mini"
              type="primary"
              plain
              title="高性能导出：未配置 VAR_EPPLUS_BATCH 时全量导出；已配置则按 CONFIG 条数分批导出"
              :loading="exportingHp"
              @click="onExportHp"
            >
              导出(高性能)
            </el-button>
            <el-button
              v-if="canExport('export-VarietyDataLzhDcjs')"
              size="mini"
              :loading="exportingSearch"
              @click="onExportSearch"
            >
              导出检索
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">散货品种列表</div>
      <div class="spd-panel__body spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          highlight-current-row
          height="60vh"
          size="mini"
          :stripe="true"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :columns="tableColumns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="varietyDataLzhMainTableV3"
          @current-change="onCurrentChange"
        >
          <template v-slot:action="{ row }">
            <el-button type="text" size="mini" @click="openDetail(row)">编辑/详情</el-button>
            <el-button
              v-if="showSzsmBid"
              type="text"
              size="mini"
              @click="openSzsmBid(row)"
            >
              中标信息
            </el-button>
            <el-button type="text" size="mini" @click="openChangePrice(row)">改价</el-button>
            <el-button type="text" size="mini" @click="openRestDept(row)">限定科室</el-button>
            <el-button type="text" size="mini" @click="openLimitBuy(row)">带量采购</el-button>
            <el-button v-if="showPicColumn" type="text" size="mini" @click="openPic(row)">
              图片
            </el-button>
          </template>
          <template v-slot:enable="{ row }">
            <el-tag size="mini" :type="row.Enable === '0' || row.Enable === 0 ? 'info' : 'success'">
              {{ formatEnable(row.Enable) }}
            </el-tag>
          </template>
          <template v-slot:remark="{ row }">
            <el-button type="text" size="mini" @click="openRemark(row)">
              {{ row.BZ || '备注' }}
            </el-button>
          </template>
          <template v-slot:lastPrice="{ row }">
            <el-button type="text" size="mini" @click="openPriceChange(row)">
              {{
                row.LAST_CHANGE_PRICE != null && row.LAST_CHANGE_PRICE !== ''
                  ? row.LAST_CHANGE_PRICE
                  : '-'
              }}
            </el-button>
          </template>
          <template v-slot:approval="{ row }">
            <el-tag
              size="mini"
              :type="
                row.APPROVAL_STATE === '1'
                  ? 'success'
                  : row.APPROVAL_STATE === '2'
                  ? 'danger'
                  : 'warning'
              "
            >
              {{ formatApprovalState(row.APPROVAL_STATE) }}
            </el-tag>
          </template>
          <template v-slot:stopDept="{ row }">
            {{
              row.STOP_DEPT_SL === '1' || row.STOP_DEPT_SL === 1 ? '禁止' : '允许'
            }}
          </template>
        </ele-pro-table>
      </div>
    </div>

    <RemarkDialog :visible.sync="remarkVisible" :row="currentRow" @done="reloadTable" />
    <PriceChangeDialog
      :visible.sync="priceChangeVisible"
      :varietie-code="priceChangeRow?.Varietie_Code"
      :variety-code-new="priceChangeRow?.Varietie_Code_New"
    />
    <VarietyEditDialog
      :visible.sync="editDialogVisible"
      :mode="editDialogMode"
      :varietie-code="editRow?.Varietie_Code"
      @done="reloadTable"
    />
    <VarietyPicDialog :visible.sync="picDialogVisible" :row="editRow" />
    <VarUpLogDialog :visible.sync="varUpLogVisible" />
    <BatchTextDialog
      :visible.sync="tempRemarkVisible"
      title="临时备注"
      placeholder="请输入临时备注"
      :loading="tempRemarkLoading"
      show-quick
      @confirm="submitTempRemark"
    />
    <BatchTextDialog
      :visible.sync="batchRemarkVisible"
      title="批量备注"
      placeholder="请输入批量备注"
      :loading="batchRemarkLoading"
      show-append
      @confirm="submitBatchRemark"
    />
    <ChangePriceDialog
      :visible.sync="changePriceVisible"
      :row-id="changePriceRow?.ID"
      :initial-price="changePriceRow?.Price"
      @done="reloadTable"
    />
    <RestDeptDialog
      :visible.sync="restDeptVisible"
      :varietie-code="restDeptRow?.Varietie_Code"
      :variety-code-new="restDeptRow?.Varietie_Code_New"
    />
    <VarLimitBuyDialog
      :visible.sync="limitBuyVisible"
      :varietie-code="limitBuyRow?.ID || limitBuyRow?.Varietie_Code"
    />
    <BhRuleDialog
      :visible.sync="bhRuleVisible"
      :varietie-code="bhRuleRow?.Varietie_Code"
      :variety-code-new="bhRuleRow?.Varietie_Code_New"
    />
    <SzsmBidDialog
      :visible.sync="szsmBidVisible"
      :row-id="szsmBidRow?.ID"
      :variety-code-new="szsmBidRow?.Varietie_Code_New"
    />
    <OldZczDialog :visible.sync="oldZczVisible" />
    <VarExpirationDialog :visible.sync="expirationVisible" />
    <ImpSelectedFieldDialog :visible.sync="updateFieldVisible" @success="reloadTable" />
    <WxtSpVarInfoDialog :visible.sync="wxtAuditVisible" />
    <input
      ref="importFile"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onImportFileChange"
    />
    <input
      ref="ybImportFile"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onYbImportFileChange"
    />
    <input
      ref="provinceImportFile"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onProvinceImportFileChange"
    />
    <input
      ref="szsmBidImportFile"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onSzsmBidImportFileChange"
    />
    <input
      ref="fsSyncExcelFile"
      type="file"
      accept=".xlsx"
      style="display: none"
      @change="onFsSyncExcelChange"
    />
    <el-dialog
      title="提交医保审批"
      :visible.sync="tjybspVisible"
      width="520px"
      append-to-body
    >
      <el-form size="mini" label-width="90px">
        <el-form-item v-if="showSzsmBid" label="提交类型">
          <el-select v-model="tjybspType" clearable placeholder="请选择提交类型" style="width: 100%">
            <el-option label="新增" value="0" />
            <el-option label="修改" value="1" />
            <el-option label="调价" value="2" />
            <el-option label="停用/启用" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="tjybspBz"
            type="textarea"
            :rows="6"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="tjybspVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="tjybspLoading" @click="onSubmitTjybsp">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择目标医院" :visible.sync="fsSyncVisible" width="360px" append-to-body>
      <el-select v-model="fsSyncTarget" style="width: 100%" size="mini">
        <el-option label="南海第六人民医院" value="fsdl" />
        <el-option label="南海第七人民医院" value="ybyy" />
      </el-select>
      <div slot="footer">
        <el-button size="mini" @click="fsSyncVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="hpActionLoading" @click="onConfirmFsSync">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="导出物资分类品种"
      :visible.sync="exportFzVisible"
      width="480px"
      append-to-body
    >
      <el-form size="mini" label-width="110px">
        <el-form-item label="导出物资分类">
          <el-select v-model="exportFzClass" clearable style="width: 100%">
            <el-option label="全部" value="" />
            <el-option label="低值医材" value="0" />
            <el-option label="高值医材" value="1" />
            <el-option label="试剂" value="2" />
            <el-option label="无" value="-1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="exportFzVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="exportingSearch" @click="onExportFz">
          导出物资分类品种
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import VarietyDataLzhMainSearch from './components/VarietyDataLzhMain-search.vue';
import BatchTextDialog from './components/BatchTextDialog.vue';
import ChangePriceDialog from './components/ChangePriceDialog.vue';
import RestDeptDialog from './components/RestDeptDialog.vue';
import VarLimitBuyDialog from './components/VarLimitBuyDialog.vue';
import BhRuleDialog from './components/BhRuleDialog.vue';
import SzsmBidDialog from './components/SzsmBidDialog.vue';
import OldZczDialog from './components/OldZczDialog.vue';
import VarExpirationDialog from './components/VarExpirationDialog.vue';
import ImpSelectedFieldDialog from './components/ImpSelectedFieldDialog.vue';
import WxtSpVarInfoDialog from './components/WxtSpVarInfoDialog.vue';
import RemarkDialog from '@/views/Home/VarietyDataLzhAudit/components/RemarkDialog.vue';
import PriceChangeDialog from '@/views/Home/VarietyDataLzhAudit/components/PriceChangeDialog.vue';
import VarietyEditDialog from '@/views/Home/VarietyDataLzhAudit/components/VarietyEditDialog.vue';
import VarietyPicDialog from '@/views/Home/VarietyDataLzhAudit/components/VarietyPicDialog.vue';
import VarUpLogDialog from '@/views/Home/VarietyDataLzhAudit/components/VarUpLogDialog.vue';
import {
  QueryPageLayUI,
  CheckVarietieBasic,
  DeleteVarietieBasic,
  upVarEnState,
  varUpdateTempInfo,
  varUpdateLargeBz,
  UpstopDeptSl,
  createStorageExcelCwj,
  createStorageExcelCwjEpPlus,
  stopConWithStopVar,
  ExcelVarFZdata,
  ImportVarietieExcel,
  batchSubmitYbCheck,
  sendVarToOes,
  commitVarStseBZ,
  commitVarStseSB,
  sendStseVarHis,
  syncStseItem,
  stseUpdatePrice,
  sendCsyyVarHis,
  sendStzyVarHis,
  sendStzlVarHis,
  sendChrmVarHis,
  sendDhThreeHis,
  sendBdJfBm,
  sendFsApproveVar,
  tjybspCommitMain,
  pushMaterialsToDap,
  createVarietieBasicInfoSync,
  pullVarietieBasicInfoToHIS,
  pushLongGangHis,
  importProvinceVar,
  importSzsmBidInfo
} from '@/api/Home/VarietyDataLzhMain';
import { getVarietyImportTemplateAoa } from '../varietyImportTemplate';
import {
  approvalVarietieCommit,
  sendVarToKuBo
} from '@/api/Home/VarietyDataLzhAudit';
import {
  formatApprovalState,
  formatContractType,
  formatEnable,
  formatHighOrLowTwo,
  formatStorageId,
  formatSyz,
  formatYesNo,
  hasMenuPermission,
  isStseLikeHp,
  openExcelFile,
  showVarCommitApproval,
  showVarUpLogButton,
  showVarietyPicColumn
} from '@/views/Home/VarietyDataLzhAudit/utils';
import { getConfig } from '@/api/layout';
import {
  hasExportPermission,
  isVarietyEditDisabled,
  canEnableVariety,
  parseVarEpplusBatchSize,
  VAR_EPPLUS_BATCH_CONFIG_KEY
} from '../utils';
import { utils, writeFile } from 'xlsx';

export default {
  name: 'VarietyDataLzhMain',
  components: {
    VarietyDataLzhMainSearch,
    BatchTextDialog,
    ChangePriceDialog,
    RestDeptDialog,
    VarLimitBuyDialog,
    BhRuleDialog,
    SzsmBidDialog,
    OldZczDialog,
    VarExpirationDialog,
    ImpSelectedFieldDialog,
    WxtSpVarInfoDialog,
    RemarkDialog,
    PriceChangeDialog,
    VarietyEditDialog,
    VarietyPicDialog,
    VarUpLogDialog
  },
  data() {
    return {
      pageSize: 30,
      pageSizes: [15, 30, 50, 100, 200, 999999],
      selection: [],
      currentWhere: null,
      currentRow: null,
      editRow: null,
      editDialogMode: 'edit',
      priceChangeRow: null,
      changePriceRow: null,
      restDeptRow: null,
      limitBuyRow: null,
      bhRuleRow: null,
      szsmBidRow: null,
      remarkVisible: false,
      priceChangeVisible: false,
      editDialogVisible: false,
      picDialogVisible: false,
      varUpLogVisible: false,
      tempRemarkVisible: false,
      batchRemarkVisible: false,
      changePriceVisible: false,
      restDeptVisible: false,
      limitBuyVisible: false,
      bhRuleVisible: false,
      szsmBidVisible: false,
      exportFzVisible: false,
      exportFzClass: '',
      oldZczVisible: false,
      expirationVisible: false,
      updateFieldVisible: false,
      wxtAuditVisible: false,
      commitLoading: false,
      kuboLoading: false,
      deleting: false,
      exporting: false,
      exportingHp: false,
      exportingSearch: false,
      tempRemarkLoading: false,
      batchRemarkLoading: false,
      stopConLoading: false,
      oesSending: false,
      hpActionLoading: false,
      importing: false,
      ybImporting: false,
      provinceImporting: false,
      szsmBidImporting: false,
      provinceImportAddMode: false,
      tjybspVisible: false,
      tjybspBz: '',
      tjybspType: '',
      tjybspLoading: false,
      fsSyncVisible: false,
      fsSyncTarget: 'fsdl',
      fsSyncCodes: [],
      fsSyncCodesNew: [],
      showKubaoBtn: HOME_HP === 'bd',
      showSzhnOesBtn: HOME_HP === 'szhn',
      showDapBtn: ['szse', 'szse_dp', 'szse_lh'].includes(HOME_HP),
      showStseBzBtn: ['stse', 'csyy', 'stzyyy', 'chrmyy'].includes(HOME_HP),
      showCommitSbBtn: ['stse', 'stzl', 'csyy', 'stzyyy', 'chrmyy'].includes(HOME_HP),
      showStseSyncBtn: HOME_HP === 'stse',
      showStsePriceBtn: HOME_HP === 'stse',
      showCsyyBtn: HOME_HP === 'csyy',
      showStzyBtn: HOME_HP === 'stzyyy' || HOME_HP === 'chrmyy',
      showStzlBtn: HOME_HP === 'stzl',
      showChrmBtn: HOME_HP === 'chrmyy',
      showDhThreeBtn: HOME_HP === 'fszxy',
      showBdJfBtn: HOME_HP === 'bd',
      showFsApproveBtn: HOME_HP === 'fsdwrmyy' || HOME_HP === 'fszxy',
      showFsSyncBtn: HOME_HP === 'fsdwrmyy',
      showFsdlHisBtn: HOME_HP === 'fsdl',
      showLglsHisBtn: HOME_HP === 'lgls',
      showTjybspBtn: ['lg', 'bd', 'szlhfy', 'zq', 'szsmyl'].includes(HOME_HP),
      showWxtBtn: HOME_HP === 'bd' || HOME_HP === 'szsmyl',
      showZqReceiveBtn: HOME_HP === 'zq',
      showProvinceImport: HOME_HP === 'fszxy',
      showSzsmBidImport: HOME_HP === 'szsmyl',
      showExportHp: HOME_HP !== 'stse',
      showSzsmBid: HOME_HP === 'szsmyl',
      isStse: isStseLikeHp(HOME_HP),
      showPicColumn: showVarietyPicColumn(HOME_HP)
    };
  },
  computed: {
    canEdit() {
      return !isVarietyEditDisabled(this.$store);
    },
    showEnableBtn() {
      return this.canEdit && canEnableVariety(this.$store);
    },
    showCommitApproval() {
      return showVarCommitApproval(this.$store);
    },
    showVarUpLogBtn() {
      return showVarUpLogButton(this.$store);
    },
    showDeptApplyBtn() {
      return hasMenuPermission(this.$store, 'var_dept_apply_btn');
    },
    nickname() {
      return this.$store.state.user?.info?.Nickname || '';
    },
    showExportToolbar() {
      return (
        this.canExport('export-VarietyDataLzhDc') ||
        this.canExport('export-VarietyDataLzhDcjs')
      );
    },
    actionColWidth() {
      let w = 280;
      if (this.showSzsmBid) w += 70;
      if (this.showPicColumn) w += 50;
      return w;
    },
    tableColumns() {
      const cols = [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        {
          label: '操作',
          width: this.actionColWidth,
          fixed: 'left',
          slot: 'action',
          align: 'center'
        },
        { slot: 'enable', prop: 'Enable', label: '启用状态', width: 90, align: 'center' }
      ];
      if (this.showDeptApplyBtn) {
        cols.push({
          slot: 'stopDept',
          prop: 'STOP_DEPT_SL',
          label: '科室领用状态',
          width: 110,
          align: 'center'
        });
      }
      cols.push(
        { slot: 'remark', prop: 'BZ', label: '备注', minWidth: 100, showOverflowTooltip: true },
        {
          prop: 'Varietie_Code_New',
          label: '品种（材料）编码',
          minWidth: 130,
          showOverflowTooltip: true
        }
      );
      if (HOME_HP === 'szlh' || HOME_HP === 'szhn' || HOME_HP === 'lg') {
        cols.push({ prop: 'Herp_ID', label: '医商云ID', minWidth: 120, showOverflowTooltip: true });
      }
      if (HOME_HP === 'szhn') {
        cols.push({
          prop: 'STSEHIS_STATE',
          label: 'OES推送状态',
          minWidth: 110,
          align: 'center',
          formatter: (_r, _c, v) => {
            if (v == '0' || v === 0) return '未推送';
            if (v == '2' || v === 2) return '已推送';
            if (v == '1' || v === 1) return '已同步';
            return v == null || v === '' ? '' : String(v);
          }
        });
      }
      cols.push(
        { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 160, showOverflowTooltip: true },
        {
          prop: 'manufacturing_ent_name',
          label: '医疗器械注册人或备案人',
          minWidth: 200,
          showOverflowTooltip: true
        },
        { prop: 'Unit', label: '单位', width: 70, align: 'center' },
        {
          prop: 'Price',
          label: '中标价',
          minWidth: 100,
          align: 'right',
          formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(2) : '')
        },
        {
          slot: 'lastPrice',
          prop: 'LAST_CHANGE_PRICE',
          label: '历史中标价格',
          minWidth: 120,
          align: 'right'
        },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 160, showOverflowTooltip: true },
        {
          prop: 'VARIETIE_CODE_OLD',
          columnKey: 'VARIETIE_CODE_OLD',
          label: '原品种编码',
          minWidth: 150,
          showOverflowTooltip: true
        },
        { prop: 'SUPPLIER_NAME', label: '启用合同供应商', minWidth: 180, showOverflowTooltip: true },
        { prop: 'CONTRACT_NAME', label: '启用合同', minWidth: 140, showOverflowTooltip: true },
        {
          prop: 'DET_CONTRACT_START',
          label: '合同起始日期',
          minWidth: 120,
          formatter: (_r, _c, v) => (v ? String(v).substring(0, 10) : '')
        },
        {
          prop: 'DET_CONTRACT_END',
          label: '合同终止日期',
          minWidth: 120,
          formatter: (_r, _c, v) => (v ? String(v).substring(0, 10) : '')
        },
        {
          prop: 'CONTRACT_TYPE',
          label: '合同类型',
          minWidth: 90,
          align: 'center',
          formatter: (_r, _c, v) => formatContractType(v)
        },
        { prop: 'PAG_TYPE', label: '包装规格', minWidth: 100, showOverflowTooltip: true },
        { prop: 'STOREHOUSE_UPPPER', label: '库存上限', width: 90, align: 'center' },
        { prop: 'STOREHOUSE_LOWER', label: '库存下限', width: 90, align: 'center' },
        { prop: 'YG_CODE', label: '阳光产品码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SOURCE_FROM', label: '来源', minWidth: 100, showOverflowTooltip: true },
        { prop: 'MEDICAL_CODE', label: '医保编码', minWidth: 150, showOverflowTooltip: true },
        { prop: 'UDI_TOP', label: 'UDI', minWidth: 120, showOverflowTooltip: true },
        { prop: 'ONECODE', label: '一级目录', minWidth: 100, showOverflowTooltip: true },
        { prop: 'TWOCODE', label: '二级目录', minWidth: 100, showOverflowTooltip: true },
        { prop: 'THREECODE', label: '三级目录', minWidth: 100, showOverflowTooltip: true },
        {
          prop: 'High_Or_Low_Class',
          label: '高低值分类',
          minWidth: 100,
          align: 'center',
          formatter: (_r, _c, v) => {
            if (v == '1') return '高值';
            if (v == '0') return '低值';
            if (v == '2') return '试剂';
            if (v == '3') return '消毒';
            if (v == '4') return '设备耗材';
            return v ?? '';
          }
        },
        {
          prop: 'HIGH_OR_LOW_CLASS_TWO',
          label: '是否重点治理',
          minWidth: 120,
          align: 'center',
          formatter: (_r, _c, v) => formatHighOrLowTwo(v)
        },
        { prop: 'HIGH_CLASS_XH', label: '重点治理序号', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'IMPORT_DUAL_VAR_NAME',
          label: '重点治理名称',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'STORAGE_ID',
          label: '主控库区',
          minWidth: 100,
          align: 'center',
          formatter: (_r, _c, v) => formatStorageId(v)
        },
        {
          prop: 'IN_TIME',
          label: '最近入库时间',
          minWidth: 155,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        },
        {
          prop: 'OUT_TIME',
          label: '最近出库时间',
          minWidth: 155,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        },
        { slot: 'approval', prop: 'APPROVAL_STATE', label: '审批状态', minWidth: 100, align: 'center' },
        {
          prop: 'APPROVAL_TIME',
          label: '审批时间',
          minWidth: 155,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        },
        { prop: 'APPROVAL_MAN', label: '审批人', minWidth: 100, showOverflowTooltip: true },
        {
          prop: 'ST_MANUFACTURING_ENT_NAME',
          label: '受托生产企业名称',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'BIDDING_ENT_NAME',
          label: '投标企业',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'BIDDING_ENT_CREDIT_CODE',
          label: '投标企业信用代码',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'OLD_PROD_REGISTRATION_CODE',
          label: '原注册证',
          minWidth: 140,
          showOverflowTooltip: true
        },
        { prop: 'Province_Platform_Code', label: '省平台/药交ID', minWidth: 130, showOverflowTooltip: true }
      );
      // 有 prop 的数据列开启服务端排序（对齐老系统 layui sort）
      return cols.map((col) =>
        col.prop && !col.type ? { ...col, sortable: 'custom' } : col
      );
    }
  },
  methods: {
    formatEnable,
    formatApprovalState,
    formatYesNo,
    formatSyz,
    canExport(key) {
      return hasExportPermission(this.$store, key);
    },
    datasource({ page, limit, where, order }) {
      this.currentWhere = where;
      return QueryPageLayUI({ page, limit, where, order }).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload(where) {
      if (where) this.currentWhere = where;
      this.$refs.table?.reload({ page: 1, where: this.currentWhere });
    },
    reloadTable() {
      this.$refs.table?.reload({ where: this.currentWhere });
    },
    onCurrentChange(row) {
      this.currentRow = row;
      this.$emit('row-click', row);
    },
    onOpenOldZcz() {
      this.oldZczVisible = true;
    },
    onOpenExpiration() {
      this.expirationVisible = true;
    },
    onUpdateField() {
      this.updateFieldVisible = true;
    },
    onWxtAudit() {
      this.wxtAuditVisible = true;
    },
    openBhRule() {
      const row = this.currentRow || this.selection[0];
      if (!row?.Varietie_Code) {
        this.$message.warning('请先选中一行品种');
        return;
      }
      this.bhRuleRow = row;
      this.bhRuleVisible = true;
    },
    openChangePrice(row) {
      this.changePriceRow = row;
      this.changePriceVisible = true;
    },
    openRestDept(row) {
      this.restDeptRow = row;
      this.restDeptVisible = true;
    },
    openLimitBuy(row) {
      this.limitBuyRow = row;
      this.limitBuyVisible = true;
    },
    openSzsmBid(row) {
      this.szsmBidRow = row;
      this.szsmBidVisible = true;
    },
    onExportFzShow() {
      this.exportFzClass = '';
      this.exportFzVisible = true;
    },
    async onExportFz() {
      this.exportingSearch = true;
      try {
        const res = await ExcelVarFZdata(this.exportFzClass);
        const rows = res.result || [];
        const header = [
          '分类1',
          '分类2',
          '品种编码',
          '计费编码',
          '品种名称',
          '规格',
          '型号',
          '单价',
          '单位',
          '注册证名称',
          '注册证起始时间',
          '医保编码',
          '是否收费',
          '是否集采',
          '京津冀类别',
          '存储条件',
          '是否临采',
          '是否介入',
          '是否植入',
          '中包装单位',
          '中包装数量',
          '大包装单位',
          '大包装数量',
          '生产企业',
          '厂家营业执照到期',
          '启用状态',
          '品种授权书到期',
          '集配商编码',
          '集配商',
          '营业执照有效期',
          '二类许可证经营有效期',
          '供应商编码',
          '供应商',
          '供应商营业执照有效期',
          '供应商二类许可证经营有效期',
          '总代经营/生产许可证号',
          '总代经营/生产许可证到期',
          '供应商经营许可证号',
          '供应商三类许可证经营有效期',
          '集配商经营许可证号',
          '集配商三类许可证经营有效期',
          '注册证号',
          '注册证到期',
          '是否重点治理',
          '重点治理序号',
          '重点治理名称',
          '最小包装数',
          '最小包装单位',
          '招采管理子系统采购单位换算系数'
        ];
        const yn = (v) => (v == null ? '否' : String(v).replace('1', '是').replace('0', '否'));
        const storageMap = {
          '0': '常温',
          '1': '阴凉',
          '2': '冷藏(2~8℃)',
          '3': '冷冻'
        };
        const body = rows.map((r) => [
          r.CLASSIFIC_NAME,
          r.CLASSIFIC_NAME2,
          r.VARIETIE_CODE_NEW,
          r.CHARGING_CODE,
          r.VARIETIE_NAME,
          r.SPECIFICATION_OR_TYPE3,
          r.SPECIFICATION_OR_TYPE2,
          r.PRICE,
          r.UNIT,
          r.PROD_REGISTRATION_NAME,
          r.REGISTRATION_ISSUING_DATE ? String(r.REGISTRATION_ISSUING_DATE).substring(0, 10) : '',
          r.MEDICAL_CODE,
          yn(r.IS_CHARGE),
          yn(r.IS_JC),
          r.SOURCE_FROM ?? '无',
          r.STORAGE_TYPE != null
            ? storageMap[String(r.STORAGE_TYPE)] || r.STORAGE_TYPE
            : '无',
          r.IS_BIDDING != null
            ? String(r.IS_BIDDING).replace('1', '否').replace('0', '是')
            : '否',
          yn(r.IS_INTERVENED),
          yn(r.IS_EMBEDDED),
          r.MIDDLE_PACKAGE_UNIT,
          r.MIDDLE_PACKAGE_COUNT,
          r.BIG_BOX_UNIT,
          r.BIG_BOX_COUNT,
          r.MANUFACTURING_ENT_NAME,
          r.MAN_YY_END ? String(r.MAN_YY_END).substring(0, 10) : '',
          r.ENABLE != null
            ? String(r.ENABLE).replace('1', '启用').replace('0', '冻结')
            : '冻结',
          r.AUTH_VALID ? String(r.AUTH_VALID).substring(0, 10) : '',
          r.SUPPLIER_CODE_CHARGING,
          r.SUPPLIER_NAME,
          r.BUSINESS_LICENSE_VALID_DATE
            ? String(r.BUSINESS_LICENSE_VALID_DATE).substring(0, 10)
            : '',
          r.RODUCTION_CLASS_2_VALID_DATE
            ? String(r.RODUCTION_CLASS_2_VALID_DATE).substring(0, 10)
            : '',
          r.SUPPLIER_CODE_CHARGING2,
          r.SUPPLIER_NAME2,
          r.BUSINESS_LICENSE_VALID_DATE2
            ? String(r.BUSINESS_LICENSE_VALID_DATE2).substring(0, 10)
            : '',
          r.RODUCTION_CLASS_2_VALID_DATE2
            ? String(r.RODUCTION_CLASS_2_VALID_DATE2).substring(0, 10)
            : '',
          r.MANUFACTURING_LICENSE,
          r.MAN_XKZ_END ? String(r.MAN_XKZ_END).substring(0, 10) : '',
          r.THIRD_LICENSE_NUMBER2,
          r.RODUCTION_CLASS_3_VALID_DATE2
            ? String(r.RODUCTION_CLASS_3_VALID_DATE2).substring(0, 10)
            : '',
          r.THIRD_LICENSE_NUMBER,
          r.RODUCTION_CLASS_3_VALID_DATE
            ? String(r.RODUCTION_CLASS_3_VALID_DATE).substring(0, 10)
            : '',
          r.APPROVAL_NUMBER,
          r.REGISTRATION_VALID_DATE
            ? String(r.REGISTRATION_VALID_DATE).substring(0, 10)
            : '',
          formatHighOrLowTwo(r.HIGH_OR_LOW_CLASS_TWO),
          r.HIGH_CLASS_XH,
          r.IMPORT_DUAL_VAR_NAME,
          r.MIN_PACKAGE_COUNT,
          r.MIN_PACKAGE_UNIT,
          r.PURCHASE_UNIT_COEFFICIENT
        ]);
        const sheet = utils.aoa_to_sheet([header, ...body]);
        writeFile(
          { SheetNames: ['物资分类品种'], Sheets: { 物资分类品种: sheet } },
          '物资分类品种.xlsx'
        );
        this.$message.success(`导出成功，共 ${rows.length} 条`);
        this.exportFzVisible = false;
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportingSearch = false;
      }
    },
    ensureSelection(msg = '请至少选中一行数据') {
      if (!this.selection.length) {
        this.$message.warning(msg);
        return false;
      }
      return true;
    },
    onAdd() {
      this.editDialogMode = 'add';
      this.editRow = null;
      this.editDialogVisible = true;
    },
    async onDelete() {
      if (!this.ensureSelection('请至少勾选一行')) return;
      const codes = this.selection.map((r) => r.Varietie_Code).filter(Boolean);
      const quotedParts = codes.map((c) => `'${c}'`);
      const forCheck = quotedParts.join(',');
      const forDelete = `${forCheck},`;
      try {
        const check = await CheckVarietieBasic({
          varietieCode: forCheck,
          nickname: ''
        });
        const raw = typeof check === 'object' && check !== null ? check.code ?? check : check;
        const codeNum = parseInt(raw, 10);
        if (codeNum === 400) {
          this.$alert('品种已应用于作业流程,拒绝删除', '提示', { type: 'warning' });
          return;
        }
        if (codeNum !== 200) {
          this.$message.error(
            (typeof check === 'object' && check.msg) || '无法删除'
          );
          return;
        }
        await this.$confirm('确定要删除选中的数据吗?', '提示', { type: 'warning' });
        this.deleting = true;
        const dat = await DeleteVarietieBasic(forDelete);
        if (dat === true || dat === 'True' || dat?.code == 200) {
          this.$message.success(`成功删除${codes.length}条记录`);
          this.reloadTable();
        } else {
          this.$message.error(dat?.msg || '删除失败');
        }
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      } finally {
        this.deleting = false;
      }
    },
    async onEnable(state) {
      if (!this.ensureSelection('请选择数据')) return;
      const tip = state === 1 ? '启用' : '停用';
      try {
        await this.$confirm(`是否${tip}当前品种？`, '提示', { type: 'warning' });
        const res = await upVarEnState(this.selection, state);
        this.$message.success(res.msg || '操作成功');
        this.reloadTable();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '操作失败');
      }
    },
    async onSendApproval() {
      if (!this.ensureSelection()) return;
      this.commitLoading = true;
      try {
        const res = await approvalVarietieCommit(this.selection);
        this.$message.success(res.msg || '发送成功');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        this.commitLoading = false;
      }
    },
    async onKubao() {
      if (!this.ensureSelection()) return;
      this.kuboLoading = true;
      try {
        const res = await sendVarToKuBo(this.selection);
        this.$message.success(res.msg || '操作成功');
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.kuboLoading = false;
      }
    },
    async onStopCon() {
      this.stopConLoading = true;
      try {
        const res = await stopConWithStopVar();
        this.$message.success(res.msg || '操作完成');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.stopConLoading = false;
      }
    },
    async onSendSzhnOes() {
      if (!this.ensureSelection()) return;
      this.oesSending = true;
      try {
        const res = await sendVarToOes(this.selection, this.nickname);
        this.$alert(res.msg || '推送完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      } finally {
        this.oesSending = false;
      }
    },
    async runHpAction(fn, { reload = true, alert = true } = {}) {
      this.hpActionLoading = true;
      try {
        const res = await fn();
        if (alert) this.$alert(res?.msg || '操作完成', '提示');
        else if (res?.msg) this.$message.success(res.msg);
        if (reload) this.reloadTable();
        return res;
      } catch (e) {
        this.$message.error(e.message || '操作失败');
        return null;
      } finally {
        this.hpActionLoading = false;
      }
    },
    async onPushDap() {
      if (!this.ensureSelection()) return;
      if (this.selection.length > 50) {
        this.$message.warning('单次最多推送50个品种');
        return;
      }
      const varietyCodes = this.selection
        .map((r) => r.Varietie_Code_New)
        .filter(Boolean);
      if (!varietyCodes.length) {
        this.$message.warning('选中行缺少品种编码');
        return;
      }
      try {
        await this.$confirm(`确定推送选中的品种到DAP吗？共${varietyCodes.length}条`, '提示', {
          type: 'warning'
        });
      } catch {
        return;
      }
      await this.runHpAction(() => pushMaterialsToDap(varietyCodes));
    },
    onCommitStseBz() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => commitVarStseBZ(this.selection, this.nickname, '2'));
    },
    onCommitStseSb() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => commitVarStseSB(this.selection, this.nickname, '0'));
    },
    async onSendStseVarHis() {
      if (!this.ensureSelection()) return;
      this.hpActionLoading = true;
      try {
        const res = await sendStseVarHis(this.selection, this.nickname);
        this.$alert(res.msg || '操作完成', '提示');
        try {
          await syncStseItem(this.selection);
        } catch (e) {
          this.$message.warning(e.message || 'SyncItem 调用失败');
        }
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        this.hpActionLoading = false;
      }
    },
    onStseUpdatePrice() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => stseUpdatePrice(this.selection));
    },
    onSendCsyy() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendCsyyVarHis(this.selection));
    },
    onSendStzy() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendStzyVarHis(this.selection));
    },
    onSendStzl() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendStzlVarHis(this.selection, this.nickname));
    },
    onSendChrm() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendChrmVarHis(this.selection, this.nickname));
    },
    onSendDhThree() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendDhThreeHis(this.selection, this.nickname));
    },
    onSendBdJfBm() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendBdJfBm(this.selection));
    },
    onSendFsApprove() {
      if (!this.ensureSelection()) return;
      this.runHpAction(() => sendFsApproveVar(this.selection, this.nickname, HOME_HP));
    },
    onFsSyncBranch() {
      if (!this.ensureSelection()) return;
      this.fsSyncCodes = this.selection.map((r) => r.Varietie_Code).filter(Boolean);
      this.fsSyncCodesNew = this.selection.map((r) => r.Varietie_Code_New).filter(Boolean);
      this.fsSyncTarget = 'fsdl';
      this.fsSyncVisible = true;
    },
    onFsSyncExcelClick() {
      if (this.$refs.fsSyncExcelFile) {
        this.$refs.fsSyncExcelFile.value = '';
        this.$refs.fsSyncExcelFile.click();
      }
    },
    async onFsSyncExcelChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const name = (file.name || '').toLowerCase();
      if (!name.endsWith('.xlsx')) {
        this.$message.warning('仅支持 .xlsx 文件，请先另存为xlsx后上传');
        e.target.value = '';
        return;
      }
      try {
        const buf = await file.arrayBuffer();
        const wb = utils.read(buf, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const header = String(rows[0]?.[0] || '').trim();
        if (header !== '品种编码') {
          this.$message.warning('第一列表头需为“品种编码”');
          return;
        }
        const codeMap = {};
        const codeArr = [];
        for (let i = 1; i < rows.length; i++) {
          const code = String(rows[i]?.[0] || '').trim();
          if (!code || codeMap[code]) continue;
          codeMap[code] = true;
          codeArr.push(code);
        }
        if (!codeArr.length) {
          this.$message.warning('Excel第一列没有可用品种编码');
          return;
        }
        this.fsSyncCodes = [];
        this.fsSyncCodesNew = codeArr;
        this.fsSyncTarget = 'fsdl';
        this.fsSyncVisible = true;
      } catch (err) {
        this.$message.error(err?.message || 'Excel解析失败');
      } finally {
        e.target.value = '';
      }
    },
    async onConfirmFsSync() {
      this.hpActionLoading = true;
      try {
        const res = await createVarietieBasicInfoSync({
          toHospitalId: this.fsSyncTarget,
          varietieCode: this.fsSyncCodes,
          varietieCodeNew: this.fsSyncCodesNew
        });
        this.fsSyncVisible = false;
        this.$alert(res.msg || '推送完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      } finally {
        this.hpActionLoading = false;
      }
    },
    async onPullHis() {
      if (!this.ensureSelection()) return;
      this.hpActionLoading = true;
      try {
        const codes = this.selection.map((r) => r.Varietie_Code).filter(Boolean);
        const resp = await pullVarietieBasicInfoToHIS(codes);
        if (resp?.code == 301) {
          this.$alert(resp.msg || '登录失效', '提示');
          return;
        }
        const list = resp?.data || resp?.result || [];
        const arr = Array.isArray(list) ? list : [];
        let successCount = 0;
        let failCount = 0;
        const failItems = [];
        arr.forEach((item) => {
          const status = String(item.status || item.Status || '').toLowerCase();
          const isFail =
            status.includes('失败') || status.includes('fail') || status.includes('error');
          if (isFail) {
            failCount++;
            failItems.push(item);
          } else {
            successCount++;
          }
        });
        let html = `<p>推送完成，成功：${successCount} 条，失败：${failCount} 条</p>`;
        if (failItems.length) {
          html +=
            '<hr/><ul style="max-height:220px;overflow:auto;padding-left:18px;">' +
            failItems
              .map((it) => {
                const id = it.id || it.ID || it.Id || it.varCode || '';
                const message = it.message || it.msg || it.Message || '无详细信息';
                return `<li>${id}：${message}</li>`;
              })
              .join('') +
            '</ul>';
        }
        this.$alert(html, '推送结果', { dangerouslyUseHTMLString: true });
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      } finally {
        this.hpActionLoading = false;
      }
    },
    async onPushLongGangHis() {
      if (!this.ensureSelection()) return;
      const codeMap = {};
      const varietieCodes = [];
      this.selection.forEach((item) => {
        const code = String(item.Varietie_Code_New || item.Varietie_Code || '').trim();
        if (code && !codeMap[code]) {
          codeMap[code] = true;
          varietieCodes.push(code);
        }
      });
      if (!varietieCodes.length) {
        this.$message.warning('选中品种没有可用的品种编码');
        return;
      }
      this.hpActionLoading = true;
      try {
        const resp = await pushLongGangHis(varietieCodes, this.nickname);
        const resultData = resp?.data || {};
        const results = Array.isArray(resultData.results) ? resultData.results : [];
        const successCount = resultData.successCount || 0;
        const failCount = resultData.failCount || 0;
        if (resp?.code !== 0 && results.length <= 0) {
          this.$alert(`HIS报错信息：${resp?.msg || '推送失败'}`, '提示');
          return;
        }
        let html = `<p>推送完成，成功：${successCount} 条，失败：${failCount} 条</p>`;
        if (failCount > 0) {
          html +=
            '<hr/><ul style="max-height:260px;overflow:auto;padding-left:18px;">' +
            results
              .filter((item) => !item.success)
              .map(
                (item) =>
                  `<li>${item.code || ''}：HIS报错信息：${item.msg || '无详细信息'}</li>`
              )
              .join('') +
            '</ul>';
        }
        this.$alert(html, resp?.code === 0 ? '推送结果' : '推送存在失败', {
          dangerouslyUseHTMLString: true
        });
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      } finally {
        this.hpActionLoading = false;
      }
    },
    onOpenTjybsp() {
      if (!this.ensureSelection()) return;
      this.tjybspBz = '';
      this.tjybspType = '';
      this.tjybspVisible = true;
    },
    async onSubmitTjybsp() {
      if (this.showSzsmBid && this.tjybspType === '') {
        this.$message.warning('请选择提交类型');
        return;
      }
      this.tjybspLoading = true;
      try {
        const res = await tjybspCommitMain(this.selection, {
          nickname: this.nickname,
          bz: this.tjybspBz,
          sendYbType: this.tjybspType
        });
        this.tjybspVisible = false;
        this.$alert(res.msg || '提交完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.tjybspLoading = false;
      }
    },
    onCheckReceive() {
      this.$router.push({ path: '/Home/CheckReceiveVarieties' });
    },
    onProvinceImportClick(addMode) {
      this.provinceImportAddMode = !!addMode;
      if (this.$refs.provinceImportFile) {
        this.$refs.provinceImportFile.value = '';
        this.$refs.provinceImportFile.click();
      }
    },
    async onProvinceImportFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.provinceImporting = true;
      try {
        const res = await importProvinceVar(file, this.provinceImportAddMode);
        this.$message[res?.code == 200 || res?.code === '200' ? 'success' : 'error'](
          res?.msg || (res?.code == 200 ? '导入成功' : '导入失败')
        );
        if (res?.code == 200 || res?.code === '200') this.reloadTable();
      } catch (err) {
        this.$message.error(err?.message || '上传失败');
      } finally {
        this.provinceImporting = false;
        e.target.value = '';
      }
    },
    onSzsmBidImportClick() {
      if (this.$refs.szsmBidImportFile) {
        this.$refs.szsmBidImportFile.value = '';
        this.$refs.szsmBidImportFile.click();
      }
    },
    async onSzsmBidImportFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const name = (file.name || '').toLowerCase();
      if (!name.endsWith('.xls') && !name.endsWith('.xlsx')) {
        this.$message.error('请上传 .xls 或 .xlsx 文件');
        e.target.value = '';
        return;
      }
      this.szsmBidImporting = true;
      try {
        const res = await importSzsmBidInfo(file);
        const code = res?.code != null ? res.code : res?.Code;
        const msg = (res?.msg || res?.Msg || '').toString();
        if (code == 200 || code === '200') {
          await this.$alert((msg || '导入成功').replace(/\n/g, '<br/>'), '中标信息导入', {
            dangerouslyUseHTMLString: true,
            type: 'success'
          });
          this.reloadTable();
        } else {
          this.$alert((msg || '导入失败').replace(/\n/g, '<br/>'), '中标信息导入', {
            dangerouslyUseHTMLString: true,
            type: 'error'
          });
        }
      } catch (err) {
        this.$message.error(err?.message || '上传失败');
      } finally {
        this.szsmBidImporting = false;
        e.target.value = '';
      }
    },
    onDownloadSzsmBidTemplate() {
      try {
        const data = [
          ['品种编码', '项目名称（全称）', '项目编号（招标编号）', '中标生效日期', '中标到期时间', '需求科室'],
          ['示例：00001', '示例项目', 'ZB-2026-001', '2026-01-01', '2026-12-31', '示例需求科室']
        ];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        writeFile(wb, '中标信息导入模板.xlsx');
      } catch (err) {
        this.$message.error(err?.message || '模板导出失败');
      }
    },
    async onStopDeptSl(state) {
      if (!this.ensureSelection()) return;
      const tip = state === 1 ? '禁止科室申请' : '开启科室申请';
      try {
        await this.$confirm(`是否${tip}？`, '提示', { type: 'warning' });
        const res = await UpstopDeptSl(this.selection, state);
        this.$message.success(res.msg || '操作成功');
        this.reloadTable();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '操作失败');
      }
    },
    openTempRemark() {
      if (!this.ensureSelection()) return;
      this.tempRemarkVisible = true;
    },
    openBatchRemark() {
      if (!this.ensureSelection()) return;
      this.batchRemarkVisible = true;
    },
    async submitTempRemark({ text, tag }) {
      const ids = this.selection.map((r) => r.ID).join(',');
      this.tempRemarkLoading = true;
      try {
        const res = await varUpdateTempInfo(ids, text, tag);
        this.$message.success(res.msg || '保存成功');
        this.tempRemarkVisible = false;
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.tempRemarkLoading = false;
      }
    },
    async submitBatchRemark({ text, append }) {
      const ids = this.selection.map((r) => r.ID).join(',');
      this.batchRemarkLoading = true;
      try {
        const res = await varUpdateLargeBz(ids, text, append);
        this.$message.success(res.msg || '保存成功');
        this.batchRemarkVisible = false;
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.batchRemarkLoading = false;
      }
    },
    openContract() {
      if (!this.ensureSelection()) return;
      const path = this.findMenuPath('Home/Contract');
      if (path) {
        this.$router.push({ path });
        return;
      }
      this.$message.info('未找到合同维护菜单，请从菜单进入「合同维护」');
    },
    openDeptAuth() {
      if (!this.ensureSelection()) return;
      const row = this.selection[0];
      const path = this.findMenuPath('KSInventoryBasicData') || this.findMenuPath('DeptAuth');
      if (path) {
        this.$router.push({ path, query: { Varietie_Code: row.Varietie_Code } });
        return;
      }
      this.$message.info('未找到科室授权菜单，请从菜单进入对应授权页');
    },
    findMenuPath(needle) {
      const walk = (nodes) => {
        if (!nodes?.length) return null;
        for (const n of nodes) {
          const comp = n.component || '';
          if (comp && String(comp).indexOf(needle) !== -1) {
            return n.path || n.meta?.fullPath || '';
          }
          const sub = walk(n.children);
          if (sub) return sub;
        }
        return null;
      };
      return walk(this.$store.state.user.menus);
    },
    openDetail(row) {
      if (!row?.Varietie_Code) {
        this.$message.warning('未选中任何一行');
        return;
      }
      this.editDialogMode = 'edit';
      this.editRow = row;
      this.editDialogVisible = true;
    },
    openPic(row) {
      this.editRow = row;
      this.picDialogVisible = true;
    },
    openPriceChange(row) {
      this.priceChangeRow = row;
      this.priceChangeVisible = true;
    },
    openRemark(row) {
      this.currentRow = row;
      this.remarkVisible = true;
    },
    onImportClick() {
      if (this.$refs.importFile) {
        this.$refs.importFile.value = '';
        this.$refs.importFile.click();
      }
    },
    async onImportFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const name = (file.name || '').toLowerCase();
      if (!name.endsWith('.xls') && !name.endsWith('.xlsx')) {
        this.$message.error('文件格式错误，请上传 .xls 或 .xlsx 品种导入模板。');
        e.target.value = '';
        return;
      }
      const fd = new FormData();
      fd.append('file', file);
      this.importing = true;
      try {
        const res = await ImportVarietieExcel(fd);
        const code = res?.code != null ? res.code : res?.Code;
        const msg = (res?.msg || res?.Msg || '').toString();
        if (code == 301 || code === '301') {
          this.$message.error(msg || '登录失效，请重新登录');
          return;
        }
        if (code == 200 || code === '200') {
          await this.$alert((msg || '导入成功').replace(/\n/g, '<br/>'), '导入成功', {
            dangerouslyUseHTMLString: true,
            type: 'success'
          });
          this.reloadTable();
        } else {
          this.$alert(
            (msg || '导入失败，服务器未返回具体原因，请检查模板列是否完整或联系管理员').replace(
              /\n/g,
              '<br/>'
            ),
            '导入失败',
            { dangerouslyUseHTMLString: true, type: 'error' }
          );
        }
      } catch (err) {
        this.$message.error(err?.message || '上传失败，请检查网络或接口地址');
      } finally {
        this.importing = false;
        e.target.value = '';
      }
    },
    onDownloadImportTemplate() {
      try {
        const data = getVarietyImportTemplateAoa();
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        writeFile(wb, '品种资料导入模板.xlsx');
      } catch (err) {
        this.$message.error(err?.message || '模板导出失败');
      }
    },
    onYbImportClick() {
      if (this.$refs.ybImportFile) {
        this.$refs.ybImportFile.value = '';
        this.$refs.ybImportFile.click();
      }
    },
    async onYbImportFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.ybImporting = true;
      try {
        const res = await batchSubmitYbCheck(file);
        const code = res?.code != null ? res.code : res?.Code;
        const msg = (res?.msg || res?.Msg || '').toString();
        if (code == 200 || code === '200') {
          this.$message.success(msg || '提交成功');
          this.reloadTable();
        } else {
          this.$message.error(msg || '上传失败');
        }
      } catch (err) {
        this.$message.error(err?.message || '上传错误，请重试');
      } finally {
        this.ybImporting = false;
        e.target.value = '';
      }
    },
    /** 当前列表总条数（与筛选条件一致） */
    getExportTotal() {
      return Number(this.$refs.table?.tableTotal) || 0;
    },
    async fetchEpplusBatchSize() {
      try {
        const res = await getConfig(VAR_EPPLUS_BATCH_CONFIG_KEY);
        return parseVarEpplusBatchSize(res?.data?.data);
      } catch (e) {
        return 0;
      }
    },
    async onExportHp() {
      this.exportingHp = true;
      try {
        const batchSize = await this.fetchEpplusBatchSize();
        const where = this.currentWhere || {};

        // 无 CONFIG 或未配置有效条数：原逻辑，单次全量导出
        if (!batchSize) {
          const res = await createStorageExcelCwjEpPlus(where);
          if (res?.msg) {
            openExcelFile(res.msg);
            this.$message.success(
              res.totalCount != null
                ? `导出成功，共 ${res.totalCount} 条`
                : '导出成功'
            );
          } else {
            this.$message.warning('导出完成，但未返回文件名');
          }
          return;
        }

        // 有 CONFIG：按 batchSize 分批同步导出
        const tipTotal = this.getExportTotal();
        if (tipTotal > batchSize) {
          const tipPages = Math.ceil(tipTotal / batchSize);
          try {
            await this.$confirm(
              `当前筛选约 ${tipTotal} 条，将分 ${tipPages} 个 Excel 依次下载（每个最多 ${batchSize} 条），请手动合并。是否继续？`,
              '分批导出提示',
              { type: 'warning', confirmButtonText: '开始导出', cancelButtonText: '取消' }
            );
          } catch (e) {
            return;
          }
        }

        const first = await createStorageExcelCwjEpPlus(where, {
          page: 1,
          size: batchSize
        });
        const total = Number(first?.totalCount) || 0;
        if (!total) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        if (first?.msg) {
          openExcelFile(first.msg);
        }

        const pageCount = Math.ceil(total / batchSize) || 1;
        for (let page = 2; page <= pageCount; page += 1) {
          const res = await createStorageExcelCwjEpPlus(where, {
            page,
            size: batchSize
          });
          if (res?.msg) {
            openExcelFile(res.msg);
          }
        }

        this.$message.success(
          pageCount > 1
            ? `导出成功，共 ${total} 条，已分 ${pageCount} 个文件下载，请手动合并`
            : `导出成功，共 ${total} 条`
        );
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportingHp = false;
      }
    },
    async onExport() {
      // 普通导出：CreateStorageExcelCwj，旧式整包生成，数据量大易网关 504
      // 超过阈值请改用「导出(高性能)」
      const NORMAL_EXPORT_MAX = 10000;
      const total = this.getExportTotal();
      if (!total) {
        this.$message.warning('没有可导出的数据');
        return;
      }
      if (total > NORMAL_EXPORT_MAX) {
        this.$alert(
          `当前筛选结果共 ${total} 条，已超过普通导出上限 ${NORMAL_EXPORT_MAX} 条，继续使用易超时。`,
          '提示',
          { type: 'warning', confirmButtonText: '知道了' }
        );
        return;
      }
      this.exporting = true;
      try {
        // 对齐老系统 PrintStorageSingleRari：按页导出（上限内一般一页即可）
        const size = Math.min(total, NORMAL_EXPORT_MAX);
        const pageCount = Math.ceil(total / size) || 1;
        for (let page = 1; page <= pageCount; page += 1) {
          const res = await createStorageExcelCwj(this.currentWhere || {}, {
            page,
            size
          });
          if (res?.msg) {
            openExcelFile(res.msg);
          }
        }
        this.$message.success(`导出成功，共 ${total} 条`);
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onExportSearch() {
      this.exportingSearch = true;
      try {
        const res = await QueryPageLayUI({
          page: 1,
          limit: 999999,
          where: this.currentWhere || {}
        });
        const rows = res.result || [];
        const exportColumns = this.tableColumns.filter(
          (col) => col.prop && col.type !== 'selection' && col.type !== 'index'
        );
        const header = exportColumns.map((col) => col.label);
        const body = rows.map((row) =>
          exportColumns.map((col) => {
            if (typeof col.formatter === 'function') {
              return col.formatter(row, col, row[col.prop]);
            }
            return row[col.prop] ?? '';
          })
        );
        const sheet = utils.aoa_to_sheet([header, ...body]);
        writeFile(
          { SheetNames: ['品种资料'], Sheets: { 品种资料: sheet } },
          '品种资料检索.xlsx'
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportingSearch = false;
      }
    }
  }
};
</script>

<style scoped>
.spd-panel__head--split {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spd-panel__head-meta {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}
.local-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}
.spd-toolbar__btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.spd-toolbar__divider {
  width: 1px;
  align-self: stretch;
  background: #ebeef5;
  margin: 0 4px;
}
</style>
