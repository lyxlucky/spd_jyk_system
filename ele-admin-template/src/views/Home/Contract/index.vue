<template>
  <div class="contract-page">
    <div class="contract-row">
      <div ref="supplierPane" class="contract-pane contract-pane--side">
        <div class="contract-tool">
          <span class="contract-title">供应商列表</span>
          <el-input
            v-model="supplierSearch"
            size="mini"
            clearable
            placeholder="供应商编码或名称"
            class="tool-input"
            @keyup.enter.native="loadSuppliers"
          />
          <el-select v-model="supplierEnable" size="mini" class="tool-select">
            <el-option label="启用" value="1" />
            <el-option label="全部" value="" />
            <el-option label="停用" value="0" />
          </el-select>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="loadSuppliers">查询</el-button>
        </div>
        <el-table
          ref="supplierTable"
          v-loading="supplierLoading"
          :data="supplierList"
          size="mini"
          stripe
          highlight-current-row
          :height="supplierTableHeight"
          @current-change="onSupplierChange"
        >
          <el-table-column prop="Supplier_Name" label="供应商名称" min-width="208" show-overflow-tooltip />
          <el-table-column label="启用状态" min-width="80" align="center">
            <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : '停用' }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div ref="contractPane" class="contract-pane contract-pane--side">
        <div class="contract-tool">
          <span class="contract-title">合同列表</span>
          <el-input
            v-model="contractSearch"
            size="mini"
            clearable
            placeholder="合同编码或名称"
            class="tool-input"
            @keyup.enter.native="loadContracts"
          />
          <el-button type="primary" size="mini" icon="el-icon-search" :disabled="!currentSupplier" @click="loadContracts">
            查询
          </el-button>
          <el-button size="mini" :disabled="!currentContract" @click="uploadHtVisible = true">上传</el-button>
        </div>
        <el-table
          ref="contractTable"
          v-loading="contractLoading"
          :data="contractList"
          size="mini"
          stripe
          highlight-current-row
          :height="contractTableHeight"
          @current-change="onContractChange"
        >
          <el-table-column prop="Contract_Code" label="合同编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="Contract_Name" label="合同名称" min-width="140" show-overflow-tooltip />
          <el-table-column label="合同类型" min-width="88" align="center">
            <template slot-scope="{ row }">{{ formatContractType(row.contract_Type) }}</template>
          </el-table-column>
          <el-table-column label="图片" width="56" align="left">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.HT_PIC && isPdf(row.HT_PIC)"
                type="text"
                size="mini"
                @click.stop="openHtFile(row.HT_PIC)"
              >
                pdf
              </el-button>
              <img
                v-else-if="row.HT_PIC && isImage(row.HT_PIC)"
                v-viewer
                class="ht-thumb"
                :src="htPicUrl(row.HT_PIC)"
                alt="合同"
                @click.stop
              />
            </template>
          </el-table-column>
          <el-table-column label="历史" width="52" align="left">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click.stop="openFileHistory(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="contract-pane contract-pane--detail">
        <div class="contract-tool">
          <span class="contract-title">合同详情</span>
          <el-button size="mini" icon="el-icon-plus" :disabled="!currentSupplier" @click="openContractForm('add')">
            添加合同
          </el-button>
          <el-button size="mini" icon="el-icon-edit" :disabled="!currentContract" @click="openContractForm('edit')">
            编辑
          </el-button>
          <el-button
            v-if="hpFlags.showContactAll"
            size="mini"
            :disabled="!currentSupplier"
            @click="allContractsVisible = true"
          >
            查看所有合同
          </el-button>
          <ContractImportButton label="导入合同" template-type="contractMain" @done="onImportDone('contractMain')" />
          <el-button size="mini" type="danger" :disabled="!currentContract" @click="onDeleteContract">
            删除
          </el-button>
        </div>
        <div class="detail-scroll">
          <el-descriptions v-loading="detailLoading" :column="2" size="mini" border class="detail-box">
            <el-descriptions-item label="合同编码">{{ detail.contract_code || '—' }}</el-descriptions-item>
            <el-descriptions-item label="经营许可证有效期">
              {{ detail.roduction_license_valid_date || '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="合同编号">{{ detail.Hosp_Contract_Code || '—' }}</el-descriptions-item>
            <el-descriptions-item label="营业执照有效期">
              {{ detail.business_license_valid_date || '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="招标编号">{{ detail.bid_number || '—' }}</el-descriptions-item>
            <el-descriptions-item label="质保证协议书有效期">
              {{ detail.qlty_assurance_prot_valid_date || '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="合同名称">{{ detail.contract_name || '—' }}</el-descriptions-item>
            <el-descriptions-item label="委托书有效期">
              {{ detail.power_of_attorney_valid_date || '—' }}
            </el-descriptions-item>
            <el-descriptions-item label="合同生效日期">{{ detail.contract_start_time || '—' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detail.create_time || '—' }}</el-descriptions-item>
            <el-descriptions-item label="合同有效期">{{ detail.contract_end_time || '—' }}</el-descriptions-item>
            <el-descriptions-item label="最近更新时间">{{ detail.last_update_time || '—' }}</el-descriptions-item>
            <el-descriptions-item label="委托人">{{ detail.consigner || '—' }}</el-descriptions-item>
            <el-descriptions-item label="启用状态">{{ detail.contract_state_text || '—' }}</el-descriptions-item>
            <el-descriptions-item label="委托人身份证">{{ detail.consigner_id || '—' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>

    <div ref="authPane" class="contract-row contract-row--auth">
      <ele-pro-table
        ref="authTable"
        class="auth-table"
        title="供应商合同授权品种列表"
        size="mini"
        :height="authTableHeight"
        full-height="calc(100vh - 90px)"
        :stripe="true"
        :page-size="authPageSize"
        :page-sizes="[10, 30, 60, 90, 150, 300, 1000]"
        :columns="authColumns"
        :datasource="authDatasource"
        :selection.sync="authSelection"
        highlight-current-row
        cache-key="contractAuthTable"
        @current-change="onAuthRowChange"
      >
        <template v-slot:toolbar>
          <div class="auth-tool">
            <el-input v-model="authWhere.varietie_code" size="mini" clearable placeholder="品种编码" @keyup.enter.native="reloadAuth" />
            <el-input v-model="authWhere.varietie_name" size="mini" clearable placeholder="品种名称" @keyup.enter.native="reloadAuth" />
            <el-input
              v-model="authWhere.specification_or_type"
              size="mini"
              clearable
              placeholder="规格型号"
              @keyup.enter.native="reloadAuth"
            />
            <el-input v-model="authWhere.unit" size="mini" clearable placeholder="单位" @keyup.enter.native="reloadAuth" />
            <el-input
              v-model="authWhere.manufacturing_ent_name"
              size="mini"
              clearable
              placeholder="生产企业"
              @keyup.enter.native="reloadAuth"
            />
            <el-input v-model="authWhere.approval_number" size="mini" clearable placeholder="注册证号" @keyup.enter.native="reloadAuth" />
            <el-input v-model="authWhere.TwoSupName" size="mini" clearable placeholder="二级供应商名称" @keyup.enter.native="reloadAuth" />
            <el-button type="primary" size="mini" icon="el-icon-search" :disabled="!currentContract" @click="reloadAuth">
              查询
            </el-button>
            <cascade-menu
              button-text="导入/导出"
              close-on-select
              :groups="authIoGroups"
              :loading="exporting"
              @select="onAuthIoSelect"
            />
            <el-button size="mini" :disabled="!currentAuthRow" @click="editPriceVisible = true">修改价格</el-button>
            <el-button size="mini" :disabled="!currentContract" @click="addAuthVisible = true">品种授权</el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="onEnableAuth">启用授权品种</el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="onDisableAuth">停用授权品种</el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('extend')">修改原结束/延期</el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('auditMark')">修改合同明细备注</el-button>
            <el-button size="mini" type="danger" :disabled="!authSelection.length" @click="onDeleteAuth">删除品种</el-button>
            <el-button v-if="hpFlags.isZq" size="mini" @click="onCheckReceiveContract">查看合同对接</el-button>
            <el-button
              size="mini"
              :disabled="!authSelection.length && !currentAuthRow"
              @click="openModifyDate('auth')"
            >
              修改授权到期
            </el-button>
            <el-button
              size="mini"
              :disabled="!authSelection.length && !currentAuthRow"
              @click="openModifyDate('detailTime')"
            >
              修改合同明细起始结束日期
            </el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="copyAuthVisible = true">复制合同授权</el-button>
            <el-button v-if="hpFlags.isZq" size="mini" :disabled="!currentContract" @click="onZqContractUpDel">
              中七更新合同明细
            </el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="twoSupVisible = true">选择授权二级供应商</el-button>
            <ContractImportButton label="导入授权二级供应商" template-type="twoSupplier" @done="onImportDone('twoSupplier')" />
            <el-button size="mini" :disabled="!currentAuthRow" @click="openBatch('lcNum')">修改临采数量</el-button>
            <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('varType')">修改品种类型</el-button>
            <el-button size="mini" @click="onStopConWithNoVar">停用无启用明细合同</el-button>
          </div>
        </template>
        <template v-slot:supplyPrice="{ row }">{{ formatSupplyPrice(row) }}</template>
        <template v-slot:enable="{ row }">{{ formatEnableState(row.is_enable) }}</template>
        <template v-slot:varType="{ row }">{{ formatVarType(row.VAR_TYPE) }}</template>
        <template v-slot:extended="{ row }">{{ formatYesNo(row.IS_EXTENDED) }}</template>
        <template v-slot:lcNum="{ row }">{{ formatLcNum(row) }}</template>
        <template v-slot:authValid="{ row }">
          <el-button type="text" size="mini" class="cell-link-btn" @click.stop="openModifyDate('auth', row)">
            {{ formatContractDate(row.Auth_Valid) || '—' }}
          </el-button>
        </template>
        <template v-slot:detStart="{ row }">
          <el-button type="text" size="mini" class="cell-link-btn" @click.stop="openModifyDate('detailTime', row)">
            {{ formatContractDate(row.DET_CONTRACT_START) || '—' }}
          </el-button>
        </template>
        <template v-slot:detEnd="{ row }">
          <el-button type="text" size="mini" class="cell-link-btn" @click.stop="openModifyDate('detailTime', row)">
            {{ formatContractDate(row.DET_CONTRACT_END) || '—' }}
          </el-button>
        </template>
      </ele-pro-table>
      <div class="contract-io-hosts">
        <ContractImportButton ref="ioContractDetail" template-type="contractDetail" @done="onImportDone('contractDetail')" />
        <ContractImportButton
          ref="ioContractDetailWithoutAuth"
          template-type="contractDetailWithoutAuth"
          @done="onImportDone('contractDetailWithoutAuth')"
        />
        <ContractImportButton ref="ioContractExtend" template-type="contractExtend" @done="onImportDone('contractExtend')" />
        <ContractImportButton
          ref="ioContractAuditMark"
          template-type="contractAuditMark"
          @done="onImportDone('contractAuditMark')"
        />
      </div>
    </div>

    <UploadHtDialog
      :visible.sync="uploadHtVisible"
      :contract-code="currentContract?.Contract_Code"
      @done="loadContracts"
    />
    <ContractFileHistoryDialog
      :visible.sync="fileHistoryVisible"
      :contract-code="historyContractCode"
      @changed="loadContracts"
    />
    <ContractFormDialog
      :visible.sync="contractFormVisible"
      :mode="contractFormMode"
      :supplier="currentSupplier"
      :contract-code="currentContract?.Contract_Code"
      @done="onContractFormDone"
    />
    <EditPriceDialog :visible.sync="editPriceVisible" :row="currentAuthRow" @done="reloadAuth" />
    <AddAuthDialog
      :visible.sync="addAuthVisible"
      :supplier="currentSupplier"
      :contract="currentContract"
      @done="reloadAuth"
    />
    <ModifyDateDialog
      :visible.sync="modifyDateVisible"
      :mode="modifyDateMode"
      :rows="authSelection"
      :single-row="modifyDateRow"
      @done="reloadAuth"
    />
    <BatchFieldDialog
      :visible.sync="batchVisible"
      :type="batchType"
      :rows="batchType === 'lcNum' ? (currentAuthRow ? [currentAuthRow] : []) : authSelection"
      @done="reloadAuth"
    />
    <CopyAuthDialog
      :visible.sync="copyAuthVisible"
      :supplier="currentSupplier"
      :old-contract-code="currentContract?.Contract_Code"
      :rows="authSelection"
      @done="reloadAuth"
    />
    <TwoSupDialog :visible.sync="twoSupVisible" :auth-rows="authSelection" @done="reloadAuth" />
    <AllContractsDialog :visible.sync="allContractsVisible" />
    <AuthContractInfoDialog :visible.sync="authContractInfoVisible" />
  </div>
</template>

<script>
import UploadHtDialog from './components/UploadHtDialog.vue';
import ContractFileHistoryDialog from './components/ContractFileHistoryDialog.vue';
import ContractFormDialog from './components/ContractFormDialog.vue';
import EditPriceDialog from './components/EditPriceDialog.vue';
import AddAuthDialog from './components/AddAuthDialog.vue';
import ModifyDateDialog from './components/ModifyDateDialog.vue';
import BatchFieldDialog from './components/BatchFieldDialog.vue';
import CopyAuthDialog from './components/CopyAuthDialog.vue';
import TwoSupDialog from './components/TwoSupDialog.vue';
import ContractImportButton from './components/ContractImportButton.vue';
import CascadeMenu from '@/views/Home/VarietyDataLzh/VarietyDataLzhMain/components/CascadeMenu.vue';
import AllContractsDialog from './components/AllContractsDialog.vue';
import AuthContractInfoDialog from './components/AuthContractInfoDialog.vue';
import { measureTableHeight } from '@/views/HeelBlockConsumables/PlatformConsume/paneTableHeight';
import {
  checkGrantContractVar,
  checkVarietieBasic,
  delContract,
  deleteContractVarieties,
  disableGrantContractVar,
  enableGrantContractVar,
  getAllContractAuthList,
  getContractAuthList,
  getContractDetails,
  getContractList,
  getSupplierList,
  stopConWithNoVar,
  zqContractUpDel
} from '@/api/Home/Contract';
import { BACK_BASE_URL } from '@/config/setting';
import {
  buildAuthColumns,
  buildContractHpFlags,
  createAuthWhere,
  exportContractAuthExcel,
  hasExportPermission,
  formatContractDate,
  formatContractType,
  formatEnableState,
  formatLcNum,
  formatSupplyPrice,
  formatVarType,
  formatYesNo,
  htPicUrl,
  mapContractDetail
} from './utils';

export default {
  name: 'ContractMaintain',
  components: {
    UploadHtDialog,
    ContractFileHistoryDialog,
    ContractFormDialog,
    EditPriceDialog,
    AddAuthDialog,
    ModifyDateDialog,
    BatchFieldDialog,
    CopyAuthDialog,
    TwoSupDialog,
    ContractImportButton,
    CascadeMenu,
    AllContractsDialog,
    AuthContractInfoDialog
  },
  data() {
    const permissionGroup = this.$store.state.user?.info?.permission_group || [];
    const hpFlags = buildContractHpFlags(permissionGroup);
    return {
      hpFlags,
      supplierSearch: '',
      supplierEnable: '1',
      supplierLoading: false,
      supplierList: [],
      currentSupplier: null,
      contractSearch: '',
      contractLoading: false,
      contractList: [],
      currentContract: null,
      detailLoading: false,
      detail: {},
      authWhere: createAuthWhere(),
      authColumns: buildAuthColumns(hpFlags),
      authPageSize: 10,
      authSelection: [],
      currentAuthRow: null,
      authOrder: {},
      exporting: false,
      uploadHtVisible: false,
      fileHistoryVisible: false,
      historyContractCode: '',
      contractFormVisible: false,
      contractFormMode: 'add',
      editPriceVisible: false,
      addAuthVisible: false,
      modifyDateVisible: false,
      modifyDateMode: 'auth',
      modifyDateRow: null,
      batchVisible: false,
      batchType: 'extend',
      copyAuthVisible: false,
      twoSupVisible: false,
      allContractsVisible: false,
      authContractInfoVisible: false,
      supplierTableHeight: 160,
      contractTableHeight: 160,
      authTableHeight: 160
    };
  },
  mounted() {
    this.loadSuppliers();
    this.schedulePaneHeight();
    if (typeof ResizeObserver !== 'undefined') {
      this._paneRo = new ResizeObserver(() => this.schedulePaneHeight());
      ['supplierPane', 'contractPane', 'authPane'].forEach((name) => {
        if (this.$refs[name]) this._paneRo.observe(this.$refs[name]);
      });
    }
    window.addEventListener('resize', this.schedulePaneHeight);
    this._fullscreenObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const el = mutation.target;
        if (!el || !el.classList || !el.classList.contains('ele-pro-table')) return;
        if (!this.$el.contains(el) && el.parentNode !== document.body) return;
        if (el.parentNode === document.body && !(el._spdMarker && this.$el.contains(el._spdMarker))) return;
        const opened = el.classList.contains('ele-pro-table-fullscreen');
        if (opened && el.parentNode !== document.body) {
          const marker = document.createComment('spd-table-fullscreen');
          el.parentNode.insertBefore(marker, el);
          el._spdMarker = marker;
          document.body.appendChild(el);
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') el.__vue__.doLayout();
          });
        } else if (!opened && el._spdMarker && el._spdMarker.parentNode) {
          el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
          el._spdMarker.parentNode.removeChild(el._spdMarker);
          el._spdMarker = null;
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') el.__vue__.doLayout();
            this.schedulePaneHeight();
          });
        }
      });
    });
    this._fullscreenObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  },
  beforeDestroy() {
    if (this._paneRo) this._paneRo.disconnect();
    window.removeEventListener('resize', this.schedulePaneHeight);
    if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
    if (this._fullscreenObserver) this._fullscreenObserver.disconnect();
    document.querySelectorAll('body > .ele-pro-table').forEach((el) => {
      if (el._spdMarker && this.$el.contains(el._spdMarker)) {
        el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
        el._spdMarker.parentNode.removeChild(el._spdMarker);
        el._spdMarker = null;
      }
    });
  },
  computed: {
    authIoGroups() {
      const exports = [];
      if (this.canExport('export-ContractDc')) {
        exports.push({
          label: '导出当前列表',
          command: 'exportAuth',
          loading: this.exporting,
          disabled: !this.currentContract
        });
      }
      exports.push({ label: '导出所有合同', command: 'exportAll' });
      return [
        {
          key: 'import',
          label: '导入',
          items: [
            { label: '导入合同授权品种', command: 'contractDetail', sideLabel: '模板' },
            { label: '导入（无授权到期）', command: 'contractDetailWithoutAuth', sideLabel: '模板' },
            { label: '导入原结束/延期', command: 'contractExtend', sideLabel: '模板' },
            { label: '导入合同明细备注', command: 'contractAuditMark', sideLabel: '模板' }
          ]
        },
        { key: 'export', label: '导出', items: exports }
      ];
    }
  },
  methods: {
    schedulePaneHeight() {
      if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
      this._paneTimer = requestAnimationFrame(() => this.updatePaneHeights(false));
    },
    updatePaneHeights(followUp) {
      const supplier = measureTableHeight(this.$refs.supplierPane);
      const contract = measureTableHeight(this.$refs.contractPane);
      const authPane = this.$refs.authPane;
      if (authPane) {
        const tool = authPane.querySelector('.ele-table-tool');
        const pager = authPane.querySelector('.el-pagination');
        const pagerH = pager ? pager.offsetHeight : 24;
        const natural = tool ? tool.scrollHeight : 0;
        const roomForTable = authPane.clientHeight - natural - pagerH - 2;
        if (roomForTable < 36) {
          authPane.style.setProperty('--auth-tool-max', Math.max(64, authPane.clientHeight - 36 - pagerH - 4) + 'px');
        } else {
          authPane.style.removeProperty('--auth-tool-max');
        }
      }
      const auth = measureTableHeight(authPane);
      const changed =
        (supplier != null && supplier !== this.supplierTableHeight) ||
        (contract != null && contract !== this.contractTableHeight) ||
        (auth != null && auth !== this.authTableHeight);
      if (supplier != null) this.supplierTableHeight = supplier;
      if (contract != null) this.contractTableHeight = contract;
      if (auth != null) this.authTableHeight = auth;
      if (!changed && followUp) return;
      this.$nextTick(() => {
        ['supplierTable', 'contractTable', 'authTable'].forEach((name) => {
          const vm = this.$refs[name];
          if (vm && typeof vm.doLayout === 'function') vm.doLayout();
        });
        if (!followUp) this.updatePaneHeights(true);
      });
    },
    formatContractType,
    formatContractDate,
    formatSupplyPrice,
    formatEnableState,
    formatVarType,
    formatYesNo,
    formatLcNum,
    htPicUrl,
    canExport(key) {
      return hasExportPermission(this.$store, key);
    },
    isPdf(name) {
      return String(name || '').toLowerCase().includes('pdf');
    },
    isImage(name) {
      const ext = String(name || '').split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext);
    },
    openHtFile(name) {
      window.open(htPicUrl(name));
    },
    openFileHistory(row) {
      this.historyContractCode = row.Contract_Code;
      this.fileHistoryVisible = true;
    },
    operatorName() {
      return this.$store.state.user?.info?.Nickname || '';
    },
    async loadSuppliers() {
      this.supplierLoading = true;
      try {
        const res = await getSupplierList({
          IS_ENABLE: this.supplierEnable,
          supplier_code: this.supplierSearch,
          supplier_name: this.supplierSearch
        });
        this.supplierList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载供应商失败');
        this.supplierList = [];
      } finally {
        this.supplierLoading = false;
      }
    },
    onSupplierChange(row) {
      this.currentSupplier = row || null;
      this.currentContract = null;
      this.detail = {};
      this.contractList = [];
      if (row) this.loadContracts();
      this.reloadAuth();
    },
    async loadContracts() {
      if (!this.currentSupplier) return;
      this.contractLoading = true;
      try {
        const res = await getContractList({
          supplier_code: this.currentSupplier.Supplier_Code,
          contract_code: this.contractSearch,
          contract_name: this.contractSearch
        });
        this.contractList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载合同失败');
        this.contractList = [];
      } finally {
        this.contractLoading = false;
      }
    },
    async onContractChange(row) {
      this.currentContract = row || null;
      this.detail = {};
      if (!row) {
        this.reloadAuth();
        return;
      }
      this.detailLoading = true;
      try {
        const res = await getContractDetails(row.Contract_Code);
        const list = res.result || [];
        this.detail = mapContractDetail(list[0] || {});
      } catch (e) {
        this.$message.error(e.message || '加载合同详情失败');
      } finally {
        this.detailLoading = false;
      }
      this.reloadAuth();
    },
    authDatasource({ page, limit, order }) {
      if (!this.currentContract?.Contract_Code) {
        return Promise.resolve({ count: 0, list: [] });
      }
      this.authOrder = order || {};
      const where = {
        ...this.authWhere,
        contract_code: this.currentContract.Contract_Code
      };
      return getContractAuthList({ page, limit, where, order })
        .then((res) => {
          const code = this.currentContract.Contract_Code || '';
          const list = (res.result || []).map((row) => ({
            ...row,
            contract_code: row.contract_code || row.CONTRACT_CODE || row.Contract_Code || code
          }));
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    reloadAuth() {
      this.currentAuthRow = null;
      this.$refs.authTable?.reload({ page: 1, where: this.authWhere });
    },
    onAuthRowChange(row) {
      this.currentAuthRow = row || null;
    },
    openContractForm(mode) {
      if (mode === 'add' && !this.currentSupplier) {
        this.$message.warning('请选中供应商');
        return;
      }
      if (mode === 'edit' && !this.currentContract) return;
      this.contractFormMode = mode;
      this.contractFormVisible = true;
    },
    onContractFormDone(payload) {
      this.loadContracts();
      if (payload?.action === 'auth') {
        const code = payload.contractCode;
        const found = this.contractList.find((c) => c.Contract_Code === code);
        if (found) {
          this.currentContract = found;
          this.onContractChange(found);
        }
        this.addAuthVisible = true;
      } else if (this.currentContract) {
        this.onContractChange(this.currentContract);
      }
    },
    onImportDone(type) {
      this.reloadAuth();
      if (type === 'contractMain') this.loadContracts();
    },
    openModifyDate(mode, row) {
      // 单元格点击传 row；工具栏按钮需回退到当前高亮行 / 勾选行
      const target = row || this.currentAuthRow || this.authSelection[0] || null;
      if (!target) {
        this.$message.warning('请先点击选中一行，或勾选要修改的品种');
        return;
      }
      this.modifyDateMode = mode;
      this.modifyDateRow = target;
      this.modifyDateVisible = true;
    },
    openBatch(type) {
      if (type === 'lcNum') {
        if (!this.currentAuthRow) {
          this.$message.warning('请选择一行数据');
          return;
        }
      } else if (!this.authSelection.length) {
        this.$message.warning('请至少勾选一行');
        return;
      }
      this.batchType = type;
      this.batchVisible = true;
    },
    async onDeleteContract() {
      if (!this.currentContract) return;
      try {
        await this.$confirm('确定要删除此合同吗？', '提示', { type: 'warning' });
        const res = await delContract(this.currentContract.Contract_Code);
        this.$message.success(res.msg || '删除成功');
        this.currentContract = null;
        this.detail = {};
        this.loadContracts();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    },
    requireAuthSelection() {
      if (!this.authSelection.length) {
        this.$message.warning('请至少勾选一行');
        return false;
      }
      return true;
    },
    async onEnableAuth() {
      if (!this.requireAuthSelection() || !this.currentContract) return;
      try {
        await this.$confirm('确定要启用选中的授权品种吗？', '提示', { type: 'warning' });
        const varietieIds = this.authSelection.map((r) => r.varietie_code).join(',');
        await enableGrantContractVar({
          supplyName: this.currentSupplier?.Supplier_Name,
          contractCode: this.currentContract.Contract_Code,
          varietieIds,
          operator: this.operatorName()
        });
        this.$message.success('启用成功');
        this.reloadAuth();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '启用失败');
      }
    },
    async doDisableAuth(detailGuids) {
      await disableGrantContractVar({
        supplyName: this.currentSupplier?.Supplier_Name,
        contractCode: this.currentContract.Contract_Code,
        detailGuids,
        operator: this.operatorName()
      });
      this.$message.success('停用成功');
      this.reloadAuth();
    },
    async onDisableAuth() {
      if (!this.requireAuthSelection() || !this.currentContract) return;
      const varietieIds = this.authSelection.map((r) => r.varietie_code).join(',');
      const detailGuids = this.authSelection.map((r) => r.contract_detail_guid).join(',');
      try {
        await this.$confirm('确定要停用选中的授权品种吗？', '提示', { type: 'warning' });
        const check = await checkGrantContractVar(this.currentContract.Contract_Code, varietieIds);
        if (check.code == 200 || check.code === '200') {
          await this.doDisableAuth(detailGuids);
        } else if (check.code == 400 || check.code === '400') {
          await this.$confirm(`${check.msg || ''}确定要继续停用此已授权品种吗?`, '提示', { type: 'warning' });
          await this.doDisableAuth(detailGuids);
        } else {
          this.$message.error(check.msg || '校验失败');
        }
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '停用失败');
      }
    },
    async onDeleteAuth() {
      if (!this.requireAuthSelection()) return;
      const varietieCodes = this.authSelection.map((r) => `'${r.varietie_code}'`).join(',');
      const guids = this.authSelection.map((r) => `'${r.contract_detail_guid}'`).join(',') + ',';
      try {
        const check = await checkVarietieBasic(varietieCodes, this.operatorName());
        if (parseInt(check, 10) !== 200) {
          this.$message.error('品种已应用于作业流程，拒绝删除');
          return;
        }
        await this.$confirm('确定要删除选中的已授权品种吗？', '提示', { type: 'warning' });
        await deleteContractVarieties(guids);
        this.$message.success(`成功删除 ${this.authSelection.length} 条记录`);
        this.reloadAuth();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    },
    onAuthIoSelect({ item, side }) {
      if (item.command === 'exportAuth') {
        this.onExportAuth();
        return;
      }
      if (item.command === 'exportAll') {
        this.authContractInfoVisible = true;
        return;
      }
      const refs = {
        contractDetail: 'ioContractDetail',
        contractDetailWithoutAuth: 'ioContractDetailWithoutAuth',
        contractExtend: 'ioContractExtend',
        contractAuditMark: 'ioContractAuditMark'
      };
      const btn = this.$refs[refs[item.command]];
      if (!btn) return;
      if (side) btn.onCommand('download');
      else btn.triggerImport();
    },
    async onExportAuth() {
      if (!this.currentContract) return;
      this.exporting = true;
      try {
        const where = {
          ...this.authWhere,
          contract_code: this.currentContract.Contract_Code
        };
        const res = await getAllContractAuthList(where, this.authOrder);
        exportContractAuthExcel(
          res.result || [],
          '合同授权品种.xlsx',
          this.currentContract.Contract_Code || this.currentContract.contract_code || ''
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onStopConWithNoVar() {
      try {
        await this.$confirm('确定停用无启用明细的合同吗?', '提示', { type: 'warning' });
        const res = await stopConWithNoVar();
        this.$alert(res.msg || '操作完成', '提示');
        this.loadContracts();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '操作失败');
      }
    },
    async onZqContractUpDel() {
      if (!this.currentContract) return;
      try {
        const res = await zqContractUpDel(this.currentContract.Contract_Code);
        this.$alert(res.msg || '操作完成', '提示');
        this.reloadAuth();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    onCheckReceiveContract() {
      if (!this.hpFlags.isZq) {
        this.$message.warning('当前医院系统不支持查看合同对接情况');
        return;
      }
      const base = (BACK_BASE_URL || '').replace(/\/$/, '');
      window.open(`${base}/Frame/Check_ReceiveContract`, '_blank');
    }
  }
};
</script>

<style scoped>
.contract-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
}

.contract-row {
  display: flex;
  flex: 1 1 0;
  height: 50%;
  max-height: 50%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.contract-row--auth {
  flex-direction: column;
  border-top: 1px solid #ebeef5;
}

.contract-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.contract-pane--side {
  flex: 0 0 29%;
  width: 29%;
}

.contract-pane--side + .contract-pane {
  border-left: 1px solid #ebeef5;
}

.contract-pane--detail {
  flex: 1 1 auto;
}

.contract-tool {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 2px 8px 0;
  box-sizing: border-box;
}

.contract-title {
  flex: none;
  margin-right: 4px;
  font-size: 13px;
  font-weight: 600;
  line-height: 28px;
  color: #303133;
}

.tool-input {
  flex: 1 1 80px;
  width: auto;
  min-width: 0;
}

.tool-select {
  flex: none;
  width: 72px;
}

.detail-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 2px 8px 4px;
}

.detail-box ::v-deep .el-descriptions-item__cell {
  padding: 2px 6px;
  font-size: 12px;
}

.ht-thumb {
  width: 20px;
  height: 20px;
  object-fit: cover;
  cursor: pointer;
  vertical-align: middle;
}

.contract-row--auth ::v-deep .ele-pro-table {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.contract-row--auth ::v-deep .ele-table-tool {
  flex-wrap: nowrap;
  align-items: flex-start;
  max-width: 100%;
  max-height: var(--auth-tool-max, none);
  margin-bottom: 0;
  overflow: auto;
}

.contract-row--auth ::v-deep .ele-table-tool-title,
.contract-row--auth ::v-deep .ele-table-tool-title-content {
  flex: 1 1 auto;
  align-items: flex-start;
  min-width: 0;
  margin: 0;
}

.contract-row--auth ::v-deep .ele-table-tool-title-label {
  flex: none;
  margin-right: 8px;
}

.contract-row--auth ::v-deep .ele-table-tool-title-label h6 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 28px;
  color: #303133;
}

.contract-row--auth ::v-deep .ele-tool {
  flex: none;
  margin: 2px 0 0 6px;
}

.auth-tool {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.auth-tool ::v-deep .el-input {
  flex: none;
  width: 120px;
}

.contract-io-hosts {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.contract-page ::v-deep .el-table .cell {
  line-height: 18px;
}

.contract-page ::v-deep .el-table td,
.contract-page ::v-deep .el-table th {
  padding: 1px 0;
}

.contract-page ::v-deep .el-pagination {
  margin: 0;
  padding: 2px 0 0;
}

.contract-page ::v-deep .el-pagination > * {
  margin-top: 0 !important;
}

.contract-page ::v-deep .el-pagination .el-input__inner,
.contract-page ::v-deep .el-pagination button,
.contract-page ::v-deep .el-pager li {
  height: 22px;
  line-height: 22px;
  min-width: 22px;
}

.contract-page ::v-deep .el-pagination__sizes .el-input {
  width: 88px;
}

.auth-table ::v-deep .cell-link-btn {
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style lang="scss">
body > .ele-pro-table.ele-pro-table-fullscreen {
  z-index: 4000 !important;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: #fff;
  overflow: hidden;
  padding: 12px 12px 8px;
  box-sizing: border-box;
}
</style>
