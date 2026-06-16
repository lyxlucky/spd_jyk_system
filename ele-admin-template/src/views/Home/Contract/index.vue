<template>
  <div class="ele-body spd-page contract-page">
    <el-card shadow="never" class="top-card">
      <el-row :gutter="10">
        <!-- 供应商列表 -->
        <el-col :span="7">
          <div class="panel-title">供应商列表</div>
          <el-form size="mini" inline class="panel-toolbar" @submit.native.prevent>
            <el-input
              v-model="supplierSearch"
              clearable
              placeholder="供应商编码或名称"
              style="width: 46%"
              @keyup.enter.native="loadSuppliers"
            />
            <el-select v-model="supplierEnable" style="width: 28%; margin: 0 4px">
              <el-option label="启用" value="1" />
              <el-option label="全部" value="" />
              <el-option label="停用" value="0" />
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="loadSuppliers">查询</el-button>
          </el-form>
          <el-table
            v-loading="supplierLoading"
            :data="supplierList"
            size="mini"
            stripe
            highlight-current-row
            height="260"
            style="width: 100%"
            @current-change="onSupplierChange"
          >
            <el-table-column prop="Supplier_Name" label="供应商名称" min-width="160" show-overflow-tooltip />
            <el-table-column label="启用状态" min-width="80" align="center">
              <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : '停用' }}</template>
            </el-table-column>
          </el-table>
        </el-col>

        <!-- 合同列表 -->
        <el-col :span="7">
          <div class="panel-title">合同列表</div>
          <el-form size="mini" inline class="panel-toolbar" @submit.native.prevent>
            <el-input
              v-model="contractSearch"
              clearable
              placeholder="合同编码或名称"
              style="width: 55%"
              @keyup.enter.native="loadContracts"
            />
            <el-button type="primary" icon="el-icon-search" :disabled="!currentSupplier" @click="loadContracts">
              查询
            </el-button>
            <el-button :disabled="!currentContract" @click="uploadHtVisible = true">上传</el-button>
          </el-form>
          <el-table
            v-loading="contractLoading"
            :data="contractList"
            size="mini"
            stripe
            highlight-current-row
            height="260"
            style="width: 100%"
            @current-change="onContractChange"
          >
            <el-table-column prop="Contract_Name" label="合同名称" min-width="140" show-overflow-tooltip />
            <el-table-column label="合同类型" min-width="88">
              <template slot-scope="{ row }">{{ formatContractType(row.contract_Type) }}</template>
            </el-table-column>
            <el-table-column label="图片" min-width="72" align="center">
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
            <el-table-column label="历史" min-width="64" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click.stop="openFileHistory(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <!-- 合同详情 -->
        <el-col :span="10">
          <div class="panel-title">合同详情</div>
          <div class="detail-toolbar">
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
            <el-button size="mini" @click="openImport('contractMain')">导入合同</el-button>
            <el-button size="mini" type="danger" :disabled="!currentContract" @click="onDeleteContract">
              删除
            </el-button>
          </div>
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
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="auth-card">
      <div class="panel-title">供应商合同授权品种列表</div>
      <el-form size="mini" class="auth-filters" @submit.native.prevent>
        <el-input v-model="authWhere.varietie_code" clearable placeholder="品种编码" @keyup.enter.native="reloadAuth" />
        <el-input v-model="authWhere.varietie_name" clearable placeholder="品种名称" @keyup.enter.native="reloadAuth" />
        <el-input
          v-model="authWhere.specification_or_type"
          clearable
          placeholder="规格型号"
          @keyup.enter.native="reloadAuth"
        />
        <el-input v-model="authWhere.unit" clearable placeholder="单位" @keyup.enter.native="reloadAuth" />
        <el-input
          v-model="authWhere.manufacturing_ent_name"
          clearable
          placeholder="生产企业"
          @keyup.enter.native="reloadAuth"
        />
        <el-input v-model="authWhere.approval_number" clearable placeholder="注册证号" @keyup.enter.native="reloadAuth" />
        <el-input v-model="authWhere.TwoSupName" clearable placeholder="二级供应商名称" @keyup.enter.native="reloadAuth" />
      </el-form>
      <div class="auth-toolbar">
        <el-button type="primary" size="mini" icon="el-icon-search" :disabled="!currentContract" @click="reloadAuth">
          查询
        </el-button>
        <el-button
          v-permission="'export-ContractDc'"
          size="mini"
          icon="el-icon-download"
          :loading="exporting"
          :disabled="!currentContract"
          @click="onExportAuth"
        >
          导出
        </el-button>
        <el-button size="mini" :disabled="!currentAuthRow" @click="editPriceVisible = true">修改价格</el-button>
        <el-button size="mini" :disabled="!currentContract" @click="addAuthVisible = true">品种授权</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="onEnableAuth">启用授权品种</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="onDisableAuth">停用授权品种</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('extend')">修改原结束/延期</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('auditMark')">修改合同明细备注</el-button>
        <el-button v-permission="'export-ContractDcsy'" size="mini" @click="authContractInfoVisible = true">
          导出所有合同
        </el-button>
        <el-button size="mini" type="danger" :disabled="!authSelection.length" @click="onDeleteAuth">删除品种</el-button>
        <el-button v-if="hpFlags.isZq" size="mini" @click="onCheckReceiveContract">查看合同对接</el-button>
        <el-button size="mini" @click="openModifyDate('auth')">修改授权到期</el-button>
        <el-button size="mini" @click="openModifyDate('detailTime')">修改合同明细起始结束日期</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="copyAuthVisible = true">复制合同授权</el-button>
        <el-button v-if="hpFlags.isZq" size="mini" :disabled="!currentContract" @click="onZqContractUpDel">
          中七更新合同明细
        </el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="twoSupVisible = true">选择授权二级供应商</el-button>
        <el-button size="mini" @click="openImport('twoSupplier')">导入授权二级供应商</el-button>
        <el-button size="mini" :disabled="!currentAuthRow" @click="openBatch('lcNum')">修改临采数量</el-button>
        <el-button size="mini" :disabled="!authSelection.length" @click="openBatch('varType')">修改品种类型</el-button>
        <el-button size="mini" @click="onStopConWithNoVar">停用无启用明细合同</el-button>
        <el-button size="mini" @click="openImport('contractDetail')">导入</el-button>
        <el-button size="mini" @click="openImport('contractDetailWithoutAuth')">导入(无授权到期)</el-button>
        <el-button size="mini" @click="openImport('contractExtend')">导入原结束/延期</el-button>
        <el-button size="mini" @click="openImport('contractAuditMark')">导入合同明细备注</el-button>
      </div>

      <ele-pro-table
        ref="authTable"
        class="auth-table"
        size="mini"
        height="calc(100vh - 520px)"
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
    </el-card>

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
    <ImportChooserDialog :visible.sync="importVisible" :template-type="importType" @done="onImportDone" />
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
import ImportChooserDialog from './components/ImportChooserDialog.vue';
import AllContractsDialog from './components/AllContractsDialog.vue';
import AuthContractInfoDialog from './components/AuthContractInfoDialog.vue';
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
    ImportChooserDialog,
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
      importVisible: false,
      importType: 'contractMain',
      allContractsVisible: false,
      authContractInfoVisible: false
    };
  },
  mounted() {
    this.loadSuppliers();
  },
  methods: {
    formatContractType,
    formatContractDate,
    formatSupplyPrice,
    formatEnableState,
    formatVarType,
    formatYesNo,
    formatLcNum,
    htPicUrl,
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
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
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
    openImport(type) {
      this.importType = type;
      this.importVisible = true;
    },
    onImportDone() {
      this.reloadAuth();
      if (this.importType === 'contractMain') this.loadContracts();
    },
    openModifyDate(mode, row) {
      this.modifyDateMode = mode;
      this.modifyDateRow = row || null;
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
    async onExportAuth() {
      if (!this.currentContract) return;
      this.exporting = true;
      try {
        const where = {
          ...this.authWhere,
          contract_code: this.currentContract.Contract_Code
        };
        const res = await getAllContractAuthList(where, this.authOrder);
        exportContractAuthExcel(res.result || []);
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
.top-card {
  margin-bottom: 10px;
}
.panel-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}
.panel-toolbar {
  margin-bottom: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.detail-toolbar {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.detail-box {
  min-height: 220px;
}
.ht-thumb {
  width: 36px;
  height: 36px;
  object-fit: cover;
  cursor: pointer;
}
.auth-card {
  margin-top: 0;
}
.auth-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.auth-filters .el-input {
  width: calc(14.285% - 8px);
  min-width: 140px;
}
.auth-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.auth-table ::v-deep .el-table {
  width: max-content;
  min-width: 100%;
}
.auth-table ::v-deep .cell-link-btn {
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media screen and (max-width: 1280px) {
  .auth-filters .el-input {
    width: calc(25% - 8px);
  }
}
</style>
