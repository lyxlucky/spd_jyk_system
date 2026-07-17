<template>
  <div class="ele-body spd-page readjust-price-page">
    <!-- 搜索 -->
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">调价计划列表</div>
      <div class="spd-panel__body search-form">
        <el-input
          v-model="where.readjustNumber"
          size="mini"
          clearable
          placeholder="搜索调价计划单号"
          style="width: 170px"
          @keyup.enter.native="reloadList"
        />
        <el-input
          v-model="where.supplierName"
          size="mini"
          clearable
          placeholder="搜索供应商"
          style="width: 170px"
          @keyup.enter.native="reloadList"
        />
        <el-input
          v-model="where.contractCode"
          size="mini"
          clearable
          placeholder="搜索合同编码"
          style="width: 170px"
          @keyup.enter.native="reloadList"
        />
        <el-input
          v-model="where.varietie"
          size="mini"
          clearable
          placeholder="搜索品种编码/名称"
          style="width: 170px"
          @keyup.enter.native="reloadList"
        />
        <el-input
          v-model="where.Creater"
          size="mini"
          clearable
          placeholder="创建人"
          style="width: 170px"
          @keyup.enter.native="reloadList"
        />
        <el-select v-model="where.state" size="mini" clearable placeholder="调价状态" style="width: 110px">
          <el-option label="全部" value="" />
          <el-option label="新建计划" value="0" />
          <el-option label="已经提交" value="1" />
          <el-option label="审批通过" value="2" />
          <el-option label="等待执行" value="3" />
          <el-option label="执行成功" value="4" />
          <el-option label="异常" value="5" />
        </el-select>
        <el-select v-model="where.IS_CHARGE" size="mini" clearable placeholder="是否收费" style="width: 120px">
          <el-option label="是否收费-全部" value="" />
          <el-option label="是否收费-是" value="1" />
          <el-option label="是否收费-否" value="0" />
        </el-select>
        <el-select
          v-if="showSendFilter"
          v-model="where.ReadjustSendState"
          size="mini"
          clearable
          placeholder="发送状态"
          style="width: 100px"
        >
          <el-option label="全部" value="" />
          <el-option label="未发送" value="0" />
          <el-option label="已发送" value="1" />
        </el-select>
        <el-date-picker
          v-model="where.sp_startTime"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          placeholder="开始时间"
          style="width: 140px"
        />
        <span class="date-sep">至</span>
        <el-date-picker
          v-model="where.sp_endTime"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          placeholder="结束时间"
          style="width: 140px"
        />
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="spd-panel spd-panel--actions">
      <div class="spd-panel__head spd-panel__head--split">
        <span>操作</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="action-bar">
        <el-button type="primary" size="mini" plain @click="reloadList">查询</el-button>
        <el-button type="primary" size="mini" plain :loading="createLoading" @click="onCreatePlan">
          创建计划
        </el-button>
        <el-button
          v-if="showSendHis"
          type="primary"
          size="mini"
          plain
          :disabled="!selection.length"
          :loading="sendHisLoading"
          @click="onSendHis"
        >
          发送(HIS)
        </el-button>
        <el-button
          v-if="showApprove"
          type="primary"
          size="mini"
          plain
          :disabled="!canPassCurrent"
          :loading="passLoading"
          @click="onPassCurrent"
        >
          审批通过
        </el-button>
        <el-button
          v-if="showApprove"
          type="primary"
          size="mini"
          plain
          :disabled="!selection.length"
          :loading="batchPassLoading"
          @click="onBatchApprove"
        >
          一键审批
        </el-button>
        <el-button
          v-if="showApprove"
          type="warning"
          size="mini"
          plain
          :disabled="!canExecuteNow"
          :loading="executeNowLoading"
          @click="onExecuteNow"
        >
          立即执行
        </el-button>
        <el-button type="warning" size="mini" plain :loading="executeAllLoading" @click="onExecuteAll">
          全部执行
        </el-button>
        <el-button size="mini" plain :loading="snapshotCreateLoading" @click="onCreateSnapshot">
          创建调价库存快照
        </el-button>
        <el-button size="mini" plain @click="snapshotQueryVisible = true">调价库存快照查询</el-button>
        <el-button size="mini" plain :loading="printPlanLoading" @click="onPrintPlan">打印计划</el-button>
        <el-button size="mini" plain :loading="exportLoading" @click="onExportExcel">导出excel</el-button>
        <el-button size="mini" plain @click="onDownloadTemplate">下载模板</el-button>
        <el-button size="mini" plain @click="triggerImport">导入计划</el-button>
        <el-button
          v-if="showSendFilter"
          type="danger"
          size="mini"
          plain
          :disabled="!selection.length"
          :loading="deleteLoading"
          @click="onDeletePlan"
        >
          删除计划
        </el-button>
        <el-button
          type="danger"
          size="mini"
          plain
          :disabled="!canCancelCurrent"
          :loading="cancelLoading"
          class="action-bar__right"
          @click="onCancelPlan"
        >
          撤销计划
        </el-button>
        <input
          ref="importInput"
          type="file"
          accept=".xls,.xlsx"
          style="display: none"
          @change="onImportFile"
        />
      </div>
    </div>

    <!-- 主列表 -->
    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">调价计划</div>
      <div class="spd-panel__body spd-table-panel__wrap">
        <ele-pro-table
          ref="mainTable"
          highlight-current-row
          height="320px"
          size="mini"
          :stripe="true"
          :toolbar="false"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :columns="mainColumns"
          :datasource="mainDatasource"
          :selection.sync="selection"
          cache-key="readjustPriceMainTable"
          @current-change="onMainRowChange"
        >
          <template v-slot:readjustState="{ row }">
            <el-tag size="mini" :type="stateTagType(row.State)">
              {{ formatReadjustState(row.State) }}
            </el-tag>
          </template>
          <template v-slot:sendState="{ row }">
            {{ formatSendState(row.SEND_STATE) }}
          </template>
          <template v-slot:contractFile="{ row }">
            <el-button
              v-if="row.Contract_File_Path"
              type="text"
              size="mini"
              @click.stop="openContractFile(row)"
            >
              查看文件
            </el-button>
          </template>
        </ele-pro-table>
      </div>
    </div>

    <!-- 计划详情 -->
    <div class="spd-panel detail-panel">
      <div class="spd-panel__head">计划详情</div>
      <div class="spd-panel__body detail-form">
        <div class="detail-row">
          <span class="detail-label">系统业务编号：</span>
          <span class="detail-value">{{ currentMainNumber || '-' }}</span>
          <el-select
            v-model="detailForm.supplierCode"
            size="mini"
            filterable
            clearable
            placeholder="请选择调价供应商"
            style="width: 220px"
            :disabled="detailDisabled"
            @change="onSupplierChange"
          >
            <el-option
              v-for="item in supplierOptions"
              :key="item.Supplier_Code"
              :label="item.Supplier_Name"
              :value="item.Supplier_Code"
            />
          </el-select>
          <el-select
            v-model="detailForm.contractCode"
            size="mini"
            filterable
            clearable
            placeholder="请选择调价合同"
            style="width: 220px"
            :disabled="detailDisabled"
          >
            <el-option
              v-for="item in contractOptions"
              :key="item.Contract_Code"
              :label="item.Contract_Name"
              :value="item.Contract_Code"
            />
          </el-select>
          <el-checkbox v-model="detailForm.isContainReverse" :disabled="detailDisabled">
            已消耗未月结数据一并执行调价
          </el-checkbox>
          <el-checkbox v-model="detailForm.isVarReverse" :disabled="detailDisabled">
            库存不调价调整品种合同价格
          </el-checkbox>
          <el-checkbox v-model="detailForm.isUpdateBaseContractPrice" :disabled="detailDisabled">
            同步调整基础资料和合同价格
          </el-checkbox>
        </div>
        <div class="detail-row">
          <el-button size="mini" plain :disabled="!canSelectVariety" @click="openSelectVariety">
            选择调价品种
          </el-button>
          <span class="detail-label">原结算价：</span>
          <el-input
            v-model="detailForm.currSupplyPrice"
            size="mini"
            style="width: 100px"
            :disabled="detailDisabled"
          />
          <span class="detail-label">请设置新价格：</span>
          <el-input
            v-model="detailForm.newSupplyPrice"
            size="mini"
            style="width: 100px"
            :disabled="detailDisabled"
          />
          <span class="detail-label">生效时间：</span>
          <el-date-picker
            v-model="detailForm.effectTime"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="生效时间"
            style="width: 180px"
            :disabled="detailDisabled"
          />
          <span class="detail-label">调价人：</span>
          <el-input
            v-model="detailForm.spStaff"
            size="mini"
            style="width: 100px"
            :disabled="detailDisabled"
          />
          <span class="detail-label">调价原因/备注：</span>
          <el-input
            v-model="detailForm.spReason"
            size="mini"
            placeholder="必填"
            style="width: 140px"
            :disabled="detailDisabled"
          />
          <span class="detail-label">新合同号：</span>
          <el-input
            v-model="detailForm.newContractCode"
            size="mini"
            placeholder="选填"
            style="width: 120px"
            :disabled="detailDisabled"
          />
          <template v-if="showPtHtnumField">
            <span class="detail-label">平台合同编号：</span>
            <el-input
              v-model="detailForm.ptHtnum"
              size="mini"
              placeholder="请填写平台合同编号"
              style="width: 140px"
              :disabled="detailDisabled"
            />
          </template>
        </div>
        <div class="detail-actions">
          <el-button size="mini" plain :disabled="!canEdit" :loading="modifyLoading" @click="onModify">
            修改计划
          </el-button>
          <el-button size="mini" type="primary" plain :disabled="!canSubmit" :loading="submitLoading" @click="onSubmit">
            确认提交
          </el-button>
        </div>
      </div>
    </div>

    <!-- 明细表 -->
    <div class="spd-panel spd-table-panel detail-table-panel">
      <div class="spd-panel__head">调价品种明细</div>
      <div class="spd-panel__body">
        <el-table :data="dtlRows" size="mini" border stripe height="90px" empty-text="请选择计划行加载明细">
          <el-table-column prop="Varietie_Code_New" label="品种编码" width="90" show-overflow-tooltip />
          <el-table-column
            v-if="showSpt"
            prop="PROVINCE_PLATFORM_CODE"
            label="省平台编码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="Varietie_Name" label="品种名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="160" show-overflow-tooltip />
          <el-table-column prop="Unit" label="单位" width="60" align="center" />
          <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="Purchase_Price" label="供货价" width="90" align="right" />
          <el-table-column prop="Approval_Number" label="批准文号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="Registration_Issuing_Date" label="发证日期" width="100">
            <template v-slot="{ row }">{{ formatDate(row.Registration_Issuing_Date) }}</template>
          </el-table-column>
          <el-table-column prop="Registration_Valid_Date" label="有效到期" width="100">
            <template v-slot="{ row }">{{ formatDate(row.Registration_Valid_Date) }}</template>
          </el-table-column>
          <el-table-column prop="Enable" label="启用状态" width="80" align="center">
            <template v-slot="{ row }">
              {{ row.Enable == 1 || row.Enable === '1' ? '启用' : row.Enable == 0 || row.Enable === '0' ? '冻结' : '未知' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 库存快照 -->
    <div class="spd-panel snapshot-panel">
      <div class="spd-panel__head">执行前/后库存快照</div>
      <div class="spd-panel__body snapshot-grid">
        <div class="snapshot-block">
          <div class="snapshot-block__title">等待调价的中心库库存快照</div>
          <el-table :data="centerSnapshots" size="mini" border stripe height="280px" v-loading="snapshotLoading">
            <el-table-column prop="Name" label="仓库名称" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Region" label="库区位置" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="90" show-overflow-tooltip />
            <el-table-column prop="Batch" label="生产批号" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Goods_Qtys" label="散货数量" width="80" align="right" />
            <el-table-column prop="Def_Qtys" label="定数包数量" width="90" align="right" />
          </el-table>
        </div>
        <div class="snapshot-block">
          <div class="snapshot-block__title">等待调价的科室库存快照</div>
          <el-table :data="deptSnapshots" size="mini" border stripe height="280px" v-loading="snapshotLoading">
            <el-table-column prop="Dept_Two_Name" label="所在科室" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="90" show-overflow-tooltip />
            <el-table-column prop="Batch" label="生产批号" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Dept_Defs_Sum_Qty" label="定数包数量" width="90" align="right" />
          </el-table>
        </div>
        <div class="snapshot-block">
          <div class="snapshot-block__title">等待调价的已消耗未月结数据快照</div>
          <el-table :data="unmonthlySnapshots" size="mini" border stripe height="280px" v-loading="snapshotLoading">
            <el-table-column prop="Dept_Two_Name" label="消耗科室" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Contract_Code" label="合同编码" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="90" show-overflow-tooltip />
            <el-table-column prop="Batch" label="生产批号" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Goods_Sum_Qty" label="散货数量" width="80" align="right" />
            <el-table-column prop="Defs_Sum_Qty" label="定数包数量" width="90" align="right" />
          </el-table>
        </div>
      </div>
    </div>

    <SelectVarietyDialog
      :visible.sync="selectVarietyVisible"
      :supplier-code="detailForm.supplierCode"
      :contract-code="detailForm.contractCode"
      :supplier-name="selectedSupplierName"
      :contract-name="selectedContractName"
      :dtl-id="currentDtlId"
      @confirm="onVarietyPicked"
    />
    <SnapshotQueryDialog :visible.sync="snapshotQueryVisible" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';
import {
  SearchReadjust,
  SearchReadjustDtl,
  CreateNewReadjustNumber,
  CommitReadjustNumber,
  ModifyReadjustNumber,
  ApproveReadjustNumber,
  CancelReadjustNumber,
  DeleteReadjustNumber,
  ExecuteReadjustPlanNow,
  ExecuteDueReadjustPlans,
  SearchReadjustSnapshots,
  SearchSupplierShortInfo,
  SearchContractShortInfo,
  ImportVarReport,
  sendMaterialToHisTj,
  createTJ_STOCK_LOG
} from '@/api/Settle/ReadjustPrice';
import {
  canApproveReadjust,
  canSendHisReadjust,
  showDeleteAndSendFilter,
  showPtHtnum,
  readjustPriceIsSpt,
  createDefaultWhere,
  formatReadjustState,
  formatSendState,
  formatYesNo,
  formatDateTime,
  formatDate,
  IMPORT_TEMPLATE_HEADERS,
  EXPORT_HEADERS
} from './utils';
import SelectVarietyDialog from './components/SelectVarietyDialog.vue';
import SnapshotQueryDialog from './components/SnapshotQueryDialog.vue';

function getNickname() {
  try {
    return (
      JSON.parse(sessionStorage.getItem('user') || '{}')?.Nickname ||
      JSON.parse(localStorage.getItem('user') || '{}')?.Nickname ||
      localStorage.getItem('Nickname') ||
      ''
    );
  } catch (e) {
    return localStorage.getItem('Nickname') || '';
  }
}

function createEmptyDetailForm() {
  return {
    supplierCode: '',
    contractCode: '',
    currSupplyPrice: '',
    newSupplyPrice: '',
    effectTime: '',
    spStaff: getNickname(),
    spReason: '',
    newContractCode: '',
    ptHtnum: '',
    isContainReverse: false,
    isVarReverse: false,
    isUpdateBaseContractPrice: true
  };
}

export default {
  name: 'ReadjustPrice',
  components: { SelectVarietyDialog, SnapshotQueryDialog },
  data() {
    return {
      where: createDefaultWhere(),
      pageSize: 10,
      pageSizes: [10, 30, 60, 90, 150, 900],
      selection: [],
      currentRow: null,
      currentMainNumber: '',
      currentState: '',
      currentDtlId: '',
      selectedVariety: null,
      dtlRows: [],
      centerSnapshots: [],
      deptSnapshots: [],
      unmonthlySnapshots: [],
      supplierOptions: [],
      contractOptions: [],
      detailForm: createEmptyDetailForm(),
      selectVarietyVisible: false,
      snapshotQueryVisible: false,
      snapshotLoading: false,
      createLoading: false,
      sendHisLoading: false,
      passLoading: false,
      batchPassLoading: false,
      executeNowLoading: false,
      executeAllLoading: false,
      snapshotCreateLoading: false,
      printPlanLoading: false,
      exportLoading: false,
      deleteLoading: false,
      cancelLoading: false,
      submitLoading: false,
      modifyLoading: false,
      showApprove: canApproveReadjust(),
      showSendHis: canSendHisReadjust(),
      showSendFilter: showDeleteAndSendFilter(HOME_HP),
      showPtHtnumField: showPtHtnum(HOME_HP),
      showSpt: readjustPriceIsSpt(HOME_HP)
    };
  },
  computed: {
    mainColumns() {
      const cols = [
        { type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { prop: 'Main_Number', label: '系统业务编号', minWidth: 140, showOverflowTooltip: true },
        { prop: 'Supplier_Name', label: '供应商名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'Contract_Code', label: '合同编码', width: 90, showOverflowTooltip: true },
        { prop: 'Contract_Name', label: '合同名称', minWidth: 120, showOverflowTooltip: true },
        { prop: 'Varietie_Code_New', label: '品种编码', width: 90, showOverflowTooltip: true }
      ];
      if (this.showSpt) {
        cols.push({
          prop: 'PROVINCE_PLATFORM_CODE',
          label: '省平台编码',
          minWidth: 120,
          showOverflowTooltip: true
        });
      }
      cols.push(
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'CHARGING_CODE', label: '计费编码', width: 90, showOverflowTooltip: true },
        { prop: 'Curr_Supply_Price', label: '原结算价', width: 90, align: 'right' },
        { prop: 'New_Supply_Price', label: '新结算价', width: 90, align: 'right' },
        {
          prop: 'IS_CHARGE',
          label: '是否收费',
          width: 80,
          align: 'center',
          formatter: (_r, _c, v) => formatYesNo(v)
        },
        {
          prop: 'Effect_Time',
          label: '计划生效时间',
          minWidth: 140,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => formatDateTime(v)
        },
        { prop: 'Creater', label: '创建人', width: 80, showOverflowTooltip: true },
        {
          prop: 'Create_Time',
          label: '计划创建时间',
          minWidth: 140,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => formatDateTime(v)
        },
        { prop: 'Approver', label: '审批人', width: 80, showOverflowTooltip: true },
        {
          prop: 'Approve_Time',
          label: '计划审批时间',
          minWidth: 140,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => formatDateTime(v)
        },
        { slot: 'readjustState', label: '调价状态', width: 90, align: 'center' }
      );
      if (this.showSendFilter) {
        cols.push({ slot: 'sendState', label: '发送状态', width: 80, align: 'center' });
      }
      cols.push(
        {
          prop: 'Is_Contain_Reverse',
          label: '已消耗未月结数据一并执行调价',
          minWidth: 190,
          formatter: (_r, _c, v) => formatYesNo(v)
        },
        {
          prop: 'IS_VAR_REVERSE',
          label: '库存不调价调整品种合同价格',
          minWidth: 180,
          formatter: (_r, _c, v) => formatYesNo(v)
        },
        {
          prop: 'IS_UPDATE_BASE_CONTRACT_PRICE',
          label: '同步调整基础资料和合同价格',
          minWidth: 190,
          formatter: (_r, _c, v) => formatYesNo(v)
        },
        { prop: 'New_Contract_Code', label: '新合同号', minWidth: 100, showOverflowTooltip: true },
        { prop: 'PT_HTNUM', label: '平台合同编号', minWidth: 120, showOverflowTooltip: true },
        { slot: 'contractFile', label: '查看合同文件', width: 100, align: 'center', fixed: 'right' }
      );
      return cols;
    },
    stateNum() {
      return String(this.currentState ?? '');
    },
    canPassCurrent() {
      return this.currentMainNumber && this.stateNum === '1';
    },
    canCancelCurrent() {
      return this.currentMainNumber && this.stateNum === '1';
    },
    canExecuteNow() {
      return this.currentMainNumber && this.stateNum === '2';
    },
    canSubmit() {
      return this.currentMainNumber && this.stateNum === '0';
    },
    canEdit() {
      return this.currentMainNumber && this.stateNum === '1';
    },
    canSelectVariety() {
      return this.currentMainNumber && (this.stateNum === '0' || this.stateNum === '1');
    },
    detailDisabled() {
      return !this.currentMainNumber || !['0', '1'].includes(this.stateNum);
    },
    selectedSupplierName() {
      const hit = this.supplierOptions.find((x) => x.Supplier_Code === this.detailForm.supplierCode);
      return hit?.Supplier_Name || '';
    },
    selectedContractName() {
      const hit = this.contractOptions.find((x) => x.Contract_Code === this.detailForm.contractCode);
      return hit?.Contract_Name || '';
    }
  },
  mounted() {
    this.loadSuppliers();
  },
  methods: {
    formatReadjustState,
    formatSendState,
    formatDate,
    createEmptyDetailForm,
    stateTagType(state) {
      const s = String(state);
      if (s === '4') return 'success';
      if (s === '5') return 'danger';
      if (s === '2') return 'success';
      if (s === '1') return 'warning';
      return 'info';
    },
    mainDatasource({ page, limit }) {
      return SearchReadjust(this.where, page, limit).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reloadList() {
      this.resetDetailContext();
      this.$refs.mainTable?.reload({ page: 1, where: this.where });
    },
    resetDetailContext() {
      this.currentRow = null;
      this.currentMainNumber = '';
      this.currentState = '';
      this.currentDtlId = '';
      this.selectedVariety = null;
      this.dtlRows = [];
      this.centerSnapshots = [];
      this.deptSnapshots = [];
      this.unmonthlySnapshots = [];
      this.contractOptions = [];
      this.detailForm = this.createEmptyDetailForm();
    },
    async loadSuppliers() {
      try {
        const res = await SearchSupplierShortInfo();
        this.supplierOptions = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载供应商失败');
      }
    },
    async loadContracts(supplierCode, keepContractCode = '') {
      if (!supplierCode) {
        this.contractOptions = [];
        this.detailForm.contractCode = '';
        return;
      }
      try {
        const supplierName = this.selectedSupplierName;
        const res = await SearchContractShortInfo({ supplierCode, supplierName });
        this.contractOptions = res.result || [];
        if (keepContractCode) {
          this.detailForm.contractCode = keepContractCode;
        } else if (!this.contractOptions.some((x) => x.Contract_Code === this.detailForm.contractCode)) {
          this.detailForm.contractCode = '';
        }
      } catch (e) {
        this.$message.error(e.message || '加载合同失败');
      }
    },
    onSupplierChange(code) {
      this.loadContracts(code);
    },
    async onMainRowChange(row) {
      if (!row) {
        this.resetDetailContext();
        return;
      }
      this.currentRow = row;
      this.currentMainNumber = row.Main_Number || '';
      this.currentState = row.State;
      this.currentDtlId = row.Dtl_Id || '';
      if (row.Varietie_Code) {
        this.selectedVariety = {
          Dtl_Id: row.Dtl_Id,
          Varietie_Code: row.Varietie_Code,
          Varietie_Code_New: row.Varietie_Code_New,
          Varietie_Name: row.Varietie_Name
        };
      } else {
        this.selectedVariety = null;
      }
      await this.loadDetail(row);
      await this.loadSnapshots(row.Dtl_Id);
    },
    async loadDetail(row) {
      if (!row?.Dtl_Id) {
        this.dtlRows = [];
        this.detailForm = this.createEmptyDetailForm();
        return;
      }
      try {
        const res = await SearchReadjustDtl({ dtlId: row.Dtl_Id, state: row.State });
        const list = res.result || [];
        this.dtlRows = list;
        if (!list.length) {
          this.detailForm = this.createEmptyDetailForm();
          return;
        }
        const d = list[0];
        this.selectedVariety = { ...d, Dtl_Id: row.Dtl_Id };
        this.detailForm = {
          supplierCode: d.Supplier_Code || '',
          contractCode: d.Contract_Code || '',
          currSupplyPrice: d.Curr_Supply_Price != null ? String(d.Curr_Supply_Price) : '',
          newSupplyPrice: d.New_Supply_Price != null ? String(d.New_Supply_Price) : '',
          effectTime: formatDateTime(d.Effect_Time),
          spStaff: d.Sp_Staff || getNickname(),
          spReason: d.Sp_Reason || '',
          newContractCode: d.New_Contract_Code || '',
          ptHtnum: d.PT_HTNUM || '',
          isContainReverse: d.Is_Contain_Reverse == 1 || d.Is_Contain_Reverse === '1',
          isVarReverse: d.IS_VAR_REVERSE == 1 || d.IS_VAR_REVERSE === '1',
          isUpdateBaseContractPrice: d.IS_UPDATE_BASE_CONTRACT_PRICE != 0 && d.IS_UPDATE_BASE_CONTRACT_PRICE !== '0'
        };
        await this.loadContracts(this.detailForm.supplierCode, this.detailForm.contractCode);
      } catch (e) {
        this.$message.error(e.message || '加载明细失败');
      }
    },
    async loadSnapshots(dtlId) {
      this.centerSnapshots = [];
      this.deptSnapshots = [];
      this.unmonthlySnapshots = [];
      if (!dtlId) return;
      this.snapshotLoading = true;
      try {
        const res = await SearchReadjustSnapshots(dtlId);
        this.centerSnapshots = res.centerResult || res.result?.centerResult || [];
        this.deptSnapshots = res.deptResult || res.result?.deptResult || [];
        this.unmonthlySnapshots = res.unmonthlyResult || res.result?.unmonthlyResult || [];
      } catch (e) {
        this.$message.error(e.message || '加载库存快照失败');
      } finally {
        this.snapshotLoading = false;
      }
    },
    buildCommitPayload(includeDtlId = false) {
      const supplierName = this.selectedSupplierName;
      const contractName = this.selectedContractName;
      const payload = {
        mainNumber: this.currentMainNumber,
        readjustNumber: '',
        supplierName,
        supplierCode: this.detailForm.supplierCode,
        contractCode: this.detailForm.contractCode,
        contractName,
        newContractCode: this.detailForm.newContractCode,
        varietieCodeNew: this.selectedVariety?.Varietie_Code_New,
        varietieCode: this.selectedVariety?.Varietie_Code,
        varietieName: this.selectedVariety?.Varietie_Name,
        currSupplyPrice: this.detailForm.currSupplyPrice,
        newSupplyPrice: this.detailForm.newSupplyPrice,
        spReason: this.detailForm.spReason,
        spStaff: this.detailForm.spStaff,
        effectTime: this.detailForm.effectTime,
        IsContainReverse: this.detailForm.isContainReverse ? 1 : 0,
        IS_VAR_REVERSE: this.detailForm.isVarReverse ? 1 : 0,
        IS_UPDATE_BASE_CONTRACT_PRICE: this.detailForm.isUpdateBaseContractPrice ? 1 : 0,
        PT_HTNUM: this.detailForm.ptHtnum
      };
      if (includeDtlId) {
        payload.dtlId = this.selectedVariety?.Dtl_Id || this.currentDtlId;
      }
      return payload;
    },
    validateDetailForm() {
      if (!this.currentMainNumber) {
        this.$message.warning('请先选择调价计划');
        return false;
      }
      if (!this.selectedVariety) {
        this.$message.warning('请先选择调价品种');
        return false;
      }
      if (!this.detailForm.supplierCode || !this.detailForm.contractCode) {
        this.$message.warning('请先选择调价供应商和调价合同');
        return false;
      }
      if (this.detailForm.currSupplyPrice === '') {
        this.$message.warning('请填写原结算价');
        return false;
      }
      if (this.detailForm.newSupplyPrice === '') {
        this.$message.warning('请设置新价格');
        return false;
      }
      if (!this.detailForm.effectTime) {
        this.$message.warning('请填入生效时间');
        return false;
      }
      if (!this.detailForm.spStaff) {
        this.$message.warning('请输入调价人');
        return false;
      }
      if (!String(this.detailForm.spReason || '').trim()) {
        this.$message.warning('请输入调价原因/备注');
        return false;
      }
      return true;
    },
    openSelectVariety() {
      if (!this.detailForm.supplierCode || !this.detailForm.contractCode) {
        this.$message.warning('请先选择调价供应商和调价合同');
        return;
      }
      this.selectVarietyVisible = true;
    },
    onVarietyPicked(row) {
      this.selectedVariety = row;
      this.dtlRows = [row];
      if (row.Supply_Price != null && row.Supply_Price !== '') {
        this.detailForm.currSupplyPrice = String(row.Supply_Price);
      }
    },
    async onCreatePlan() {
      this.createLoading = true;
      try {
        await CreateNewReadjustNumber();
        this.$message.success('创建成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '创建失败');
      } finally {
        this.createLoading = false;
      }
    },
    async onSubmit() {
      if (!this.validateDetailForm()) return;
      const v = this.selectedVariety;
      try {
        await this.$confirm(
          `确认提交调价计划？<br>系统业务编号：${this.currentMainNumber}<br>品种：【${v.Varietie_Code_New}】${v.Varietie_Name}`,
          '确认提交',
          { dangerouslyUseHTMLString: true }
        );
      } catch (e) {
        return;
      }
      this.submitLoading = true;
      try {
        await CommitReadjustNumber(this.buildCommitPayload(false));
        this.$message.success('提交成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.submitLoading = false;
      }
    },
    async onModify() {
      if (!this.validateDetailForm()) return;
      const v = this.selectedVariety;
      try {
        await this.$confirm(
          `确认修改调价计划？<br>系统业务编号：${this.currentMainNumber}<br>品种：【${v.Varietie_Code_New}】${v.Varietie_Name}`,
          '修改计划',
          { dangerouslyUseHTMLString: true }
        );
      } catch (e) {
        return;
      }
      this.modifyLoading = true;
      try {
        await ModifyReadjustNumber(this.buildCommitPayload(true));
        this.$message.success('修改成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.modifyLoading = false;
      }
    },
    async onPassCurrent() {
      if (!this.canPassCurrent) return;
      this.passLoading = true;
      try {
        await ApproveReadjustNumber(this.currentMainNumber);
        this.$message.success('审批成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '审批失败');
      } finally {
        this.passLoading = false;
      }
    },
    async onBatchApprove() {
      if (!this.selection.length) {
        this.$message.warning('请选中要审批的数据');
        return;
      }
      if (this.selection.some((r) => String(r.State) !== '1')) {
        this.$message.warning('有单号未提交');
        return;
      }
      try {
        await this.$confirm('确认要一键审批？', '一键审批');
      } catch (e) {
        return;
      }
      const mainNumber = this.selection.map((r) => r.Main_Number).join(',');
      this.batchPassLoading = true;
      try {
        await ApproveReadjustNumber(mainNumber);
        this.$message.success('审批成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '审批失败');
      } finally {
        this.batchPassLoading = false;
      }
    },
    async onCancelPlan() {
      if (!this.canCancelCurrent) return;
      this.cancelLoading = true;
      try {
        await CancelReadjustNumber(this.currentMainNumber);
        this.$message.success('撤销成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '撤销失败');
      } finally {
        this.cancelLoading = false;
      }
    },
    async onExecuteNow() {
      if (!this.canExecuteNow) return;
      try {
        await this.$confirm(`确认立即执行调价计划？<br>系统业务编号：${this.currentMainNumber}`, '立即执行', {
          dangerouslyUseHTMLString: true
        });
      } catch (e) {
        return;
      }
      this.executeNowLoading = true;
      try {
        const res = await ExecuteReadjustPlanNow(this.currentMainNumber);
        this.$message.success(res.msg || '执行成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '执行失败');
      } finally {
        this.executeNowLoading = false;
      }
    },
    async onExecuteAll() {
      try {
        await this.$confirm('确认执行所有已到期的审批通过调价计划？', '全部执行');
      } catch (e) {
        return;
      }
      this.executeAllLoading = true;
      try {
        const res = await ExecuteDueReadjustPlans();
        this.$message.success(res.msg || '执行成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '执行失败');
      } finally {
        this.executeAllLoading = false;
      }
    },
    async onCreateSnapshot() {
      try {
        await this.$confirm('是否创建库存快照？', '创建快照');
      } catch (e) {
        return;
      }
      this.snapshotCreateLoading = true;
      try {
        await createTJ_STOCK_LOG();
        this.$message.success('创建成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '创建失败');
      } finally {
        this.snapshotCreateLoading = false;
      }
    },
    async onSendHis() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm('是否发送调价？', '发送HIS');
      } catch (e) {
        return;
      }
      this.sendHisLoading = true;
      try {
        await sendMaterialToHisTj(this.selection, HOME_HP);
        this.$message.success('发送成功');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        this.sendHisLoading = false;
      }
    },
    async onDeletePlan() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm(`确认删除选中的 ${this.selection.length} 条调价计划？`, '删除计划', {
          type: 'warning'
        });
      } catch (e) {
        return;
      }
      this.deleteLoading = true;
      try {
        await DeleteReadjustNumber(this.selection);
        this.$alert('删除成功', '提示');
        this.reloadList();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      } finally {
        this.deleteLoading = false;
      }
    },
    openContractFile(row) {
      if (!row?.Contract_File_Path) return;
      const base = (BACK_BASE_URL || '').replace(/\/$/, '');
      window.open(`${base}/Upload/Ht/${row.Contract_File_Path}`);
    },
    mapExportRow(row) {
      const base = [
        row.Main_Number,
        row.Supplier_Name,
        row.Contract_Code,
        row.Contract_Name,
        row.Varietie_Code_New,
        row.Varietie_Name,
        row.CHARGING_CODE || '',
        row.Curr_Supply_Price ?? '',
        row.New_Supply_Price ?? '',
        formatYesNo(row.IS_CHARGE),
        formatDateTime(row.Effect_Time),
        row.Creater,
        formatDateTime(row.Create_Time),
        row.Approver,
        formatDateTime(row.Approve_Time),
        formatReadjustState(row.State),
        formatYesNo(row.Is_Contain_Reverse),
        formatYesNo(row.IS_VAR_REVERSE),
        formatYesNo(row.IS_UPDATE_BASE_CONTRACT_PRICE),
        row.New_Contract_Code || ''
      ];
      if (this.showSpt) {
        base.splice(5, 0, row.PROVINCE_PLATFORM_CODE || '');
      }
      return base;
    },
    buildPrintPlanHeaders() {
      const headers = [
        '系统业务编号',
        '供应商名称',
        '合同编码',
        '合同名称',
        '品种编码',
        '品种名称',
        '原结算价',
        '新结算价',
        '计划生效时间',
        '创建人',
        '计划创建时间',
        '审批人',
        '计划审批时间',
        '调价状态',
        '已消耗未月结数据一并执行调价',
        '库存不调价调整品种合同价格',
        '同步调整基础资料和合同价格',
        '新合同号',
        '合同文件'
      ];
      if (this.showSpt) {
        headers.splice(5, 0, '省平台编码');
      }
      return headers;
    },
    mapPrintPlanRow(row) {
      const base = [
        row.Main_Number,
        row.Supplier_Name,
        row.Contract_Code,
        row.Contract_Name,
        row.Varietie_Code_New,
        row.Varietie_Name,
        row.Curr_Supply_Price ?? '',
        row.New_Supply_Price ?? '',
        formatDateTime(row.Effect_Time),
        row.Creater,
        formatDateTime(row.Create_Time),
        row.Approver,
        formatDateTime(row.Approve_Time),
        formatReadjustState(row.State),
        formatYesNo(row.Is_Contain_Reverse),
        formatYesNo(row.IS_VAR_REVERSE),
        formatYesNo(row.IS_UPDATE_BASE_CONTRACT_PRICE),
        row.New_Contract_Code || '',
        row.Contract_File_Path || ''
      ];
      if (this.showSpt) {
        base.splice(5, 0, row.PROVINCE_PLATFORM_CODE || '');
      }
      return base;
    },
    async fetchExportRows() {
      if (this.selection.length) {
        return this.selection;
      }
      const res = await SearchReadjust(this.where, 1, 999999);
      return res.result || [];
    },
    async onExportExcel() {
      this.exportLoading = true;
      try {
        const rows = await this.fetchExportRows();
        if (!rows.length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        const headers = [...EXPORT_HEADERS];
        if (this.showSpt) {
          headers.splice(5, 0, '省平台编码');
        }
        const data = [headers, ...rows.map((r) => this.mapExportRow(r))];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '品种调价计划');
        writeFile(wb, '品种调价计划.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportLoading = false;
      }
    },
    async onPrintPlan() {
      this.printPlanLoading = true;
      try {
        const rows = await this.fetchExportRows();
        if (!rows.length) {
          this.$message.warning('没有可打印的数据');
          return;
        }
        const data = [this.buildPrintPlanHeaders(), ...rows.map((r) => this.mapPrintPlanRow(r))];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '调价计划');
        writeFile(wb, '调价计划.xlsx');
      } catch (e) {
        this.$message.error(e.message || '打印计划失败');
      } finally {
        this.printPlanLoading = false;
      }
    },
    onDownloadTemplate() {
      const ws = utils.aoa_to_sheet([IMPORT_TEMPLATE_HEADERS]);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, '导入模板');
      writeFile(wb, '调价计划导入模板.xlsx');
    },
    triggerImport() {
      this.$refs.importInput.value = '';
      this.$refs.importInput.click();
    },
    async onImportFile(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!/\.(xlsx|xls)$/i.test(file.name || '')) {
        this.$message.warning('请选择 xlsx 或 xls 文件');
        return;
      }
      try {
        const res = await ImportVarReport(file);
        this.$message.success(res?.msg || '导入完成');
        if (res?.code == 200 || res?.code === '200') {
          this.reloadList();
        }
      } catch (err) {
        this.$message.error(err.message || '导入失败');
      }
    }
  }
};
</script>

<style scoped>
.readjust-price-page {
  padding-bottom: 12px;
}

.search-form,
.detail-row,
.action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.search-form {
  padding: 10px 12px;
}

.date-sep {
  font-size: 12px;
  color: #909399;
}

.spd-panel--actions .spd-panel__head--split {
  gap: 12px;
}

.action-bar {
  padding: 10px 12px;
  background: #fafbfc;
}

.action-bar__right {
  margin-left: auto;
}

.detail-panel .detail-form {
  padding: 10px 12px 12px;
}

.detail-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.detail-value {
  font-size: 12px;
  color: #303133;
  min-width: 120px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.detail-table-panel :deep(.el-card__body),
.snapshot-panel :deep(.el-card__body) {
  padding: 0 12px 12px;
}

.snapshot-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 0 12px 12px;
}

.snapshot-block__title {
  background: #009688;
  color: #fff;
  text-align: center;
  padding: 4px 0;
  font-size: 12px;
  margin-bottom: 0;
}

@media (max-width: 1400px) {
  .snapshot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
