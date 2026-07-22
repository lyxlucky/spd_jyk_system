<template>
  <div class="dept-monitor-tab">
    <div class="color-legend">
      <span class="legend-item">
        <i class="legend-swatch legend-warn-3" />定数包库存低于下限，但已有补货进行中
      </span>
      <span class="legend-item">
        <i class="legend-swatch legend-warn-2" />库存低于下限且未进行补货，但中心库库存充足，建议立即进行拣配/补货操作
      </span>
      <span class="legend-item">
        <i class="legend-swatch legend-warn-1" />库存低于下限，且中心库定数包库存不足
      </span>
    </div>

    <el-form size="mini" inline class="toolbar-row" @submit.native.prevent>
      <el-form-item label="下单类型">
        <el-select v-model="filters.orderType" clearable placeholder="所有" style="width: 110px" @change="reloadMonitor">
          <el-option label="所有" value="" />
          <el-option label="主动补货" value="0" />
          <el-option label="自主下单" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="（下限/可用库存）比值">
        <el-input v-model="cwjPer" style="width: 80px" @keyup.enter.native="reloadMonitor" />
        <span class="ratio-suffix">%</span>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="ratioMonitor" @change="reloadMonitor">是否按比值监控</el-checkbox>
      </el-form-item>
      <el-form-item class="toolbar-actions">
        <el-select v-model="allocateSvc" style="width: 200px">
          <el-option :label="allocateLabels.outToIn" value="1" />
          <el-option :label="allocateLabels.inToOut" value="0" />
        </el-select>
        <el-button v-permission="'export-CentralinventoryMonitoring-dsbdc'" @click="onExportExcel">导出Excel</el-button>
        <el-button @click="onCreateAllocate">生成定数包调拨单</el-button>
        <el-button @click="onStatShortage">统计缺货</el-button>
        <el-button @click="onAddToDirective">添加至已选拣配单</el-button>
        <el-button type="primary" @click="onCreateDirective">新建并生成拣配单</el-button>
        <el-button @click="importVisible = true">导入生成拣配单</el-button>
      </el-form-item>
    </el-form>

    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="deptSearch"
          clearable
          placeholder="请输入二级科室名称搜索"
          style="width: 180px"
          @keyup.enter.native="reloadDept"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadDept">查询科室</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="varietySearch"
          clearable
          placeholder="请输入品种条件搜索"
          style="width: 180px"
          @keyup.enter.native="reloadMonitor"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadMonitor">查询监控</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="filters.storageId"
          placeholder="院区库房"
          style="width: 120px"
          @change="onStorageChange"
        >
          <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.isAuthSend" style="width: 110px" @change="reloadMonitor">
          <el-option label="主动配送" value="1" />
          <el-option label="非主动配送" value="0" />
          <el-option label="所有" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.centerSendType" clearable placeholder="所有补货方式" style="width: 120px" @change="reloadMonitor">
          <el-option label="所有补货方式" value="" />
          <el-option label="定数包补货" value="0" />
          <el-option label="周期补货" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.highOrLowClass" clearable placeholder="所有分类" style="width: 100px" @change="reloadMonitor">
          <el-option label="所有分类" value="" />
          <el-option label="高值" value="1" />
          <el-option label="低值" value="0" />
          <el-option label="试剂" value="2" />
          <el-option label="消毒" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="filterDisabled" @change="reloadMonitor">过滤已停用品种</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="onlyBelowLower" @change="reloadMonitor">仅查询到达下限品种</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="loadDirectiveByVariety">是否根据选中行品种加载拣配单</el-checkbox>
      </el-form-item>
    </el-form>

    <el-row :gutter="8" class="main-row">
      <el-col :span="5">
        <div class="panel-title">配送科室</div>
        <ele-pro-table
          ref="deptTable"
          size="mini"
          height="300px"
          highlight-current-row
          :toolkit="[]"
          :columns="deptColumns"
          :datasource="deptDatasource"
          :init-load="false"
          cache-key="deptMonitorDeptTable"
          @row-click="onDeptRowClick"
        />
      </el-col>
      <el-col :span="19">
        <div class="panel-title">二级科室定数包库存监控</div>
        <div v-if="extendPreview.length" class="selected-preview">
          <el-table :data="extendPreview" size="mini" border max-height="120">
            <el-table-column prop="Dept_Two_Name" label="科室名称" width="100" show-overflow-tooltip />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" show-overflow-tooltip />
            <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="Approval_Number" label="批准文号" width="120" show-overflow-tooltip />
            <el-table-column prop="Registration_Issuing_Date" label="发证日期" width="110" />
            <el-table-column prop="Registration_Valid_Date" label="有效到期" width="110" />
            <el-table-column prop="supplier_name" label="供应商" min-width="120" show-overflow-tooltip />
            <el-table-column prop="Prod_Big_Class_Name" label="产品类型" width="100" show-overflow-tooltip />
            <el-table-column prop="Mgmt_Cat_Name" label="管理类别" width="100" show-overflow-tooltip />
            <el-table-column prop="Regulatory_Cat_Name" label="监管类别" width="100" show-overflow-tooltip />
          </el-table>
        </div>
        <ele-pro-table
          ref="monitorTable"
          size="mini"
          height="300px"
          :page-size="monitorPageSize"
          :page-sizes="[10, 30, 60, 90, 150, 300, 999999]"
          :columns="monitorColumns"
          :datasource="monitorDatasource"
          :selection.sync="monitorSelection"
          :row-class-name="deptWarningRowClass"
          cache-key="deptMonitorMainTable"
          @row-click="onMonitorRowClick"
          @sort-change="onMonitorSortChange"
        >
          <template v-slot:bhPackCount="{ row }">
            <el-input
              :value="getBhPackCount(row)"
              size="mini"
              style="width: 56px"
              :disabled="!isMonitorRowSelected(row)"
              @input="onBhPackCountInput(row, $event)"
            />
          </template>
          <template v-slot:relatedRfid="{ row }">{{ formatRelatedRfid(row.Related_RFID) }}</template>
          <template v-slot:consumptionType="{ row }">{{ formatConsumptionType(row.Consumption_Type) }}</template>
          <template v-slot:orderType="{ row }">{{ formatOrderType(row.ORDER_TYPE) }}</template>
          <template v-slot:isKuBao="{ row }">{{ formatIsKuBao(row.Is_KuBao) }}</template>
        </ele-pro-table>
      </el-col>
    </el-row>

    <el-row :gutter="8" class="bottom-row">
      <el-col :span="10">
        <div class="panel-title">拣配单列表</div>
        <el-form size="mini" inline class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="directivePackState" style="width: 100px" @change="reloadDirectiveList">
              <el-option label="全部" value="-1" />
              <el-option label="未拣配" value="0" />
              <el-option label="已短拣" value="1" />
              <el-option label="已全拣" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="directiveSearch"
              clearable
              placeholder="请输入关键字搜索"
              style="width: 160px"
              @keyup.enter.native="reloadDirectiveList"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadDirectiveList">查询</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="directiveTable"
          size="mini"
          height="265px"
          highlight-current-row
          :toolkit="[]"
          :columns="directiveListColumns"
          :datasource="directiveDatasource"
          :init-load="false"
          cache-key="deptMonitorDirectiveList"
          @row-click="onDirectiveRowClick"
        >
          <template v-slot:packState="{ row }">{{ formatPackState(row.Pack_State) }}</template>
          <template v-slot:creator="{ row }">{{ row.Creater || row.Creator || '' }}</template>
          <template v-slot:createTime="{ row }">{{ formatCreateTime(row.Create_Time) }}</template>
          <template v-slot:action="{ row }">
            <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click.stop="onDeleteDirectiveList(row)" />
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="14">
        <div class="panel-title">拣配单明细</div>
        <div class="detail-toolbar">
          <el-button type="danger" size="mini" :disabled="!detailSelection.length" @click="onDeleteDirectiveDetail">
            删除
          </el-button>
        </div>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="265px"
          :toolkit="[]"
          :columns="directiveDetailColumns"
          :datasource="detailDatasource"
          :selection.sync="detailSelection"
          :init-load="false"
          cache-key="deptMonitorDirectiveDetail"
        />
      </el-col>
    </el-row>
    <AllocateCreateDialog :visible.sync="allocateVisible" mode="dsb" :svc="allocateSvc" />

    <el-dialog
      title="导入生成拣配单"
      :visible.sync="importVisible"
      width="480px"
      append-to-body
      @closed="onImportDialogClosed"
    >
      <div class="import-dialog-body">
        <div class="import-template-row">
          <a :href="importTemplateUrl" target="_blank" rel="noopener">下载模板</a>
        </div>
        <el-upload
          ref="importUpload"
          action=""
          :auto-upload="false"
          :limit="1"
          accept=".xls,.xlsx"
          :on-change="onImportFileChange"
          :on-remove="onImportFileRemove"
          :file-list="importFileList"
        >
          <el-button size="mini">选择文件</el-button>
        </el-upload>
      </div>
      <span slot="footer">
        <el-button size="mini" @click="importVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="importing" @click="onImportGeneratePicking">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { API_BASE_URL, HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import AllocateCreateDialog from './AllocateCreateDialog.vue';
import {
  getStorageList,
  getDeptMonitorDept,
  searchDeptMonitor,
  getDirectiveList,
  getDirectiveDetail,
  insertDirective,
  updateDirective,
  deleteDirectiveList,
  deleteDirectiveDetail,
  inDefDept,
  importGeneratePicking,
  getDeptMonitorExtend
} from '@/api/Inventory/CentralinventoryMonitoring';
import {
  monitorHpFlags,
  deptWarningRowClass,
  formatConsumptionType,
  formatRelatedRfid,
  formatIsKuBao,
  formatOrderType,
  formatDate10,
  exportDeptMonitorExcel,
  buildDeptMonitorColumns,
  buildDirectiveListColumns,
  buildDirectiveDetailColumns,
  getAllocateSvcLabels
} from '../utils';

export default {
  name: 'DeptMonitorTab',
  components: { AllocateCreateDialog },
  data() {
    return {
      hp: monitorHpFlags,
      allocateLabels: getAllocateSvcLabels(HOME_HP),
      allocateSvc: '1',
      allocateVisible: false,
      importVisible: false,
      importFile: null,
      importFileList: [],
      importing: false,
      storageList: [],
      deptSearch: '',
      varietySearch: '',
      cwjPer: '50',
      ratioMonitor: false,
      filterDisabled: true,
      onlyBelowLower: true,
      loadDirectiveByVariety: false,
      filters: {
        storageId: '',
        orderType: '',
        isAuthSend: '1',
        centerSendType: '',
        highOrLowClass: ''
      },
      selectedDept: null,
      monitorPageSize: 300,
      monitorSelection: [],
      monitorSort: { field: '', order: '' },
      bhPackCountMap: {},
      extendPreview: [],
      deptColumns: [
        { prop: 'Dept_Two_Name', label: '配送科室', minWidth: 100 },
        { prop: 'STORAGE_NAME', label: '院区', minWidth: 80 },
        { prop: 'Dept_Two_Code', label: '二级科室编码', minWidth: 120 }
      ],
      directiveListColumns: buildDirectiveListColumns(),
      directiveDetailColumns: buildDirectiveDetailColumns(),
      directiveSearch: '',
      directivePackState: '-1',
      selectedDirective: null,
      detailSelection: [],
      clickedMonitorRow: null,
      exporting: false,
      creating: false,
      updating: false,
      deletingDetail: false
    };
  },
  computed: {
    staffName() {
      const info = this.$store.state.user?.info;
      return info?.Nickname || info?.NickName || info?.nickname || '';
    },
    storageLabel() {
      const item = this.storageList.find((s) => String(s.ID) === String(this.filters.storageId));
      return item?.NAME || '院内';
    },
    isYnStorage() {
      return String(this.filters.storageId) === '1';
    },
    importTemplateUrl() {
      const token = sessionStorage.getItem(TOKEN_STORE_NAME) || '';
      return `${API_BASE_URL}/DeptMonitor/ImportGeneratePickingTemplate?Token=${token}`;
    },
    monitorColumns() {
      return buildDeptMonitorColumns({
        storageLabel: this.storageLabel,
        storageId: this.filters.storageId,
        hp: this.hp,
        isYn: this.isYnStorage
      });
    }
  },
  mounted() {
    this.loadStorageList();
  },
  methods: {
    formatConsumptionType,
    formatRelatedRfid,
    formatIsKuBao,
    formatOrderType,
    deptWarningRowClass,
    formatPackState(val) {
      const s = String(val);
      if (s === '0') return '未拣配';
      if (s === '1') return '已短拣';
      if (s === '2') return '已全拣';
      return '未知状态';
    },
    formatCreateTime(val) {
      if (!val) return '';
      return String(val).replace('T', ' ');
    },
    isOkCode(code) {
      return code == 200 || code === '200';
    },
    monitorRowKey(row) {
      return `${row.Dept_Two_Code}_${row.Varietie_Code}_${row.Def_No_Pkg_Coefficient}`;
    },
    getBhPackCount(row) {
      const key = this.monitorRowKey(row);
      if (this.bhPackCountMap[key] !== undefined) {
        return this.bhPackCountMap[key];
      }
      return row.Pkg_planHidden ?? row.bhPackCount ?? 0;
    },
    onBhPackCountInput(row, val) {
      const num = Number(val);
      const key = this.monitorRowKey(row);
      this.$set(this.bhPackCountMap, key, Number.isNaN(num) ? val : num);
      row.Pkg_planHidden = Number.isNaN(num) ? row.Pkg_planHidden : num;
    },
    isMonitorRowSelected(row) {
      const key = this.monitorRowKey(row);
      return this.monitorSelection.some((item) => this.monitorRowKey(item) === key);
    },
    buildMonitorWhere(overrides = {}) {
      return {
        MonitorType: this.ratioMonitor ? '1' : '0',
        Per: String(Number(this.cwjPer || 0) / 100),
        StorageID: this.filters.storageId || '',
        LowState: this.onlyBelowLower ? '1' : '0',
        // 后端：0=过滤已停用，1=不过滤
        EnableState: this.filterDisabled ? '0' : '1',
        DeptName: this.selectedDept?.Dept_Two_Name || '',
        SearchName: this.varietySearch,
        IS_AUTH_SEND: this.filters.isAuthSend,
        ORDER_TYPE: this.filters.orderType,
        CENTER_SEND_TYPE: this.filters.centerSendType,
        HIGH_OR_LOW_CLASS: this.filters.highOrLowClass,
        field: this.monitorSort.field,
        order: this.monitorSort.order,
        ...overrides
      };
    },
    loadStorageList() {
      getStorageList()
        .then((res) => {
          const data = res.data;
          if (this.isOkCode(data?.code)) {
            this.storageList = data.result || [];
            if (this.storageList.length && !this.filters.storageId) {
              this.filters.storageId = String(this.storageList[0].ID);
            }
            this.reloadDept();
            this.reloadMonitor();
            this.reloadDirectiveList();
          }
        })
        .catch((e) => {
          this.$message.error(e.message || '加载院区失败');
        });
    },
    onStorageChange() {
      this.selectedDept = null;
      this.extendPreview = [];
      this.reloadDept();
      this.reloadMonitor();
      this.reloadDirectiveList();
    },
    reloadDept() {
      this.$refs.deptTable?.reload({ page: 1 });
    },
    reloadMonitor() {
      this.$refs.monitorTable?.reload({ page: 1 });
    },
    reloadDirectiveList() {
      this.selectedDirective = null;
      this.detailSelection = [];
      this.$refs.directiveTable?.reload({ page: 1 });
      this.$refs.detailTable?.reload({ page: 1 });
    },
    reloadDirectiveDetail() {
      this.$refs.detailTable?.reload({ page: 1 });
    },
    deptDatasource({ page, limit }) {
      return getDeptMonitorDept(this.deptSearch, this.filters.storageId, page, limit || 9999)
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询科室失败');
          return { count: 0, list: [] };
        });
    },
    monitorDatasource({ page, limit, order }) {
      const where = this.buildMonitorWhere({
        field: order?.sort || this.monitorSort.field,
        order: order?.order || this.monitorSort.order
      });
      return searchDeptMonitor(where, page, limit)
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询监控失败');
          return { count: 0, list: [] };
        });
    },
    directiveDatasource({ page, limit }) {
      const where = {
        VarietieCode: this.loadDirectiveByVariety
          ? this.clickedMonitorRow?.Varietie_Code_New || ''
          : this.directiveSearch,
        State: this.directivePackState,
        STORAGE_ID: this.filters.storageId
      };
      return getDirectiveList(where, page, limit || 99)
        .then((res) => ({
          count: res.total || 0,
          list: res.result || []
        }))
        .catch((e) => {
          this.$message.error(e.message || '查询拣配单失败');
          return { count: 0, list: [] };
        });
    },
    detailDatasource({ page, limit }) {
      const jpNumber = this.selectedDirective?.Pack_Directive_Number || '';
      if (!jpNumber) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getDirectiveDetail(jpNumber, page, limit || 9999)
        .then((res) => ({
          count: res.total || 0,
          list: res.result || []
        }))
        .catch((e) => {
          this.$message.error(e.message || '查询拣配明细失败');
          return { count: 0, list: [] };
        });
    },
    onDeptRowClick(row) {
      this.selectedDept = row;
      this.reloadMonitor();
    },
    onMonitorRowClick(row) {
      this.clickedMonitorRow = row;
      this.loadDeptExtendPreview(row);
      if (this.loadDirectiveByVariety) {
        this.directiveSearch = row.Varietie_Code_New || '';
        this.reloadDirectiveList();
      }
    },
    async loadDeptExtendPreview(row) {
      const varietieCode = row?.Varietie_Code;
      if (!varietieCode) {
        this.extendPreview = [];
        return;
      }
      try {
        const data = await getDeptMonitorExtend(
          varietieCode,
          row.Dept_Two_Name || '',
          row.Contract_Code || ''
        );
        if (data == 301 || data === '301' || data?.code == 301) {
          this.extendPreview = [];
          this.$message.error(data?.msg || '登录失效，请重新登录');
          return;
        }
        let list = data?.result ?? data;
        if (typeof list === 'string') {
          try {
            list = JSON.parse(list);
          } catch (e) {
            list = [];
          }
        }
        if (!Array.isArray(list)) {
          this.extendPreview = [];
          return;
        }
        this.extendPreview = list.map((item) => ({
          Dept_Two_Name: item.Dept_Two_Name,
          Varietie_Code_New: item.Varietie_Code_New,
          Varietie_Name: item.Varietie_Name,
          Approval_Number: item.Approval_Number,
          Registration_Issuing_Date: formatDate10(item.Registration_Issuing_Date),
          Registration_Valid_Date: formatDate10(item.Registration_Valid_Date),
          supplier_name: item.supplier_name,
          Prod_Big_Class_Name: item.Prod_Big_Class_Name,
          Mgmt_Cat_Name: item.Mgmt_Cat_Name,
          Regulatory_Cat_Name: item.Regulatory_Cat_Name
        }));
      } catch (e) {
        this.extendPreview = [];
        this.$message.error(e.message || '加载扩展信息失败');
      }
    },
    onMonitorSortChange({ prop, order }) {
      this.monitorSort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.reloadMonitor();
    },
    onDirectiveRowClick(row) {
      this.selectedDirective = row;
      this.detailSelection = [];
      this.reloadDirectiveDetail();
    },
    onImportFileChange(file, fileList) {
      this.importFile = file?.raw || null;
      this.importFileList = fileList.slice(-1);
    },
    onImportFileRemove() {
      this.importFile = null;
      this.importFileList = [];
    },
    onImportDialogClosed() {
      this.importFile = null;
      this.importFileList = [];
      this.importing = false;
    },
    async onImportGeneratePicking() {
      if (!this.importFile) {
        this.$message.warning('请选择导入文件');
        return;
      }
      if (this.importing) return;
      this.importing = true;
      const loading = this.$loading({ lock: true, text: '导入中...' });
      try {
        const data = await importGeneratePicking(this.importFile, this.filters.storageId);
        if (data?.code == 301) {
          this.$message.error(data.msg || '登录失效，请重新登录');
          return;
        }
        if (this.isOkCode(data?.code)) {
          this.importVisible = false;
          const msg = data.msg || '导入成功';
          if (String(msg).includes('；二级科室编码')) {
            this.$alert(msg, '提示');
          } else {
            this.$message.success(msg);
          }
          this.reloadMonitor();
          this.directiveSearch = '';
          this.reloadDirectiveList();
        } else {
          this.$message.error(data?.msg || '导入失败');
        }
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        loading.close();
        this.importing = false;
      }
    },
    async onExportExcel() {
      if (this.exporting) return;
      this.exporting = true;
      const loading = this.$loading({ lock: true, text: '导出中...' });
      try {
        const where = this.buildMonitorWhere({ StorageID: '-1' });
        const res = await searchDeptMonitor(where, 1, 999999);
        exportDeptMonitorExcel(res.result || [], this.storageLabel, { hp: this.hp, isYn: this.isYnStorage });
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
        this.exporting = false;
      }
    },
    onCreateAllocate() {
      this.allocateVisible = true;
    },
    async onStatShortage() {
      if (!this.monitorSelection.length) {
        this.$message.warning('请至少选中一行监控数据');
        return;
      }
      const loading = this.$loading({ lock: true, text: '统计缺货中...' });
      try {
        const data = await inDefDept(this.monitorSelection, this.staffName);
        if (data.code == 200 || data.code === '200') {
          this.$message.success(data.msg || '统计缺货成功');
        } else {
          this.$message.error(data.msg || '统计缺货失败');
        }
      } catch (e) {
        this.$message.error(e.message || '统计缺货失败');
      } finally {
        loading.close();
      }
    },
    buildDirectivePayloadRows() {
      if (!this.monitorSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return null;
      }
      const rows = [];
      for (let i = 0; i < this.monitorSelection.length; i += 1) {
        const row = this.monitorSelection[i];
        const pkgCount = Number(this.getBhPackCount(row));
        if (pkgCount <= 0) {
          this.$message.error(`品种编码为${row.Varietie_Code_New}的补货包数不得小于或等于0`);
          return null;
        }
        row.Pkg_planHidden = pkgCount;
        rows.push(row);
      }
      return rows;
    },
    async onCreateDirective() {
      const rows = this.buildDirectivePayloadRows();
      if (!rows) return;
      if (this.creating) return;
      this.creating = true;
      const loading = this.$loading({ lock: true, text: '生成拣配单中...' });
      try {
        const arrList = rows.map(
          (row) =>
            `{${row.Dept_Two_Code},${this.staffName},${row.Varietie_Code},${row.Def_No_Pkg_Coefficient},${row.Pkg_planHidden},${row.supplier_Code}}`
        );
        const res = await insertDirective(JSON.stringify(arrList), this.filters.storageId);
        if (this.isOkCode(res?.code)) {
          this.$message.success('已成功生成拣配单');
          this.reloadMonitor();
          this.directiveSearch = '';
          this.reloadDirectiveList();
        } else {
          this.$message.error(res?.msg || '生成拣配单失败');
        }
      } catch (e) {
        this.$message.error(e.message || '生成拣配单失败');
      } finally {
        loading.close();
        this.creating = false;
      }
    },
    async onAddToDirective() {
      const rows = this.buildDirectivePayloadRows();
      if (!rows) return;
      if (!this.selectedDirective?.Pack_Directive_Number) {
        this.$message.warning('请选中要添加到的拣配单');
        return;
      }
      if (this.updating) return;
      this.updating = true;
      const loading = this.$loading({ lock: true, text: '添加中...' });
      try {
        const packNo = this.selectedDirective.Pack_Directive_Number;
        const arrList = rows.map(
          (row) =>
            `{${packNo},${row.Varietie_Code},${row.Def_No_Pkg_Coefficient},${row.Pkg_planHidden},${row.supplier_Code},${row.Dept_Two_Code}}`
        );
        const res = await updateDirective(JSON.stringify(arrList), this.filters.storageId);
        if (this.isOkCode(res?.code)) {
          this.$message.success('已成功添加到已有拣配单');
          this.reloadMonitor();
          this.reloadDirectiveDetail();
        } else {
          this.$message.error(res?.msg || '添加失败');
        }
      } catch (e) {
        this.$message.error(e.message || '添加失败');
      } finally {
        loading.close();
        this.updating = false;
      }
    },
    async onDeleteDirectiveList(row) {
      try {
        await this.$confirm('确定要删除该拣配单吗?', '提示', { type: 'warning' });
        await deleteDirectiveList(row.ID);
        this.$message.success('删除成功');
        if (this.selectedDirective?.ID === row.ID) {
          this.selectedDirective = null;
          this.reloadDirectiveDetail();
        }
        this.reloadDirectiveList();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    },
    async onDeleteDirectiveDetail() {
      if (!this.detailSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      if (this.deletingDetail) return;
      try {
        await this.$confirm('确定要删除选中的数据吗?', '提示', { type: 'warning' });
        this.deletingDetail = true;
        const ids = this.detailSelection.map((row) => row.ID).join(',');
        const res = await deleteDirectiveDetail(ids);
        if (this.isOkCode(res?.code)) {
          this.$message.success('删除成功');
          this.detailSelection = [];
          this.reloadDirectiveDetail();
        } else {
          this.$message.error(res?.msg || '删除失败');
        }
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      } finally {
        this.deletingDetail = false;
      }
    }
  }
};
</script>

<style scoped>
.color-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 28px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.legend-swatch {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 1px solid #dcdfe6;
}
.legend-warn-1 {
  background: #f9d5d5;
}
.legend-warn-2 {
  background: #f7f4a8;
}
.legend-warn-3 {
  background: #a6e4f7;
}
.toolbar-row,
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
}
.toolbar-actions {
  margin-left: auto;
}
.ratio-suffix {
  margin-left: 4px;
}
.panel-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
}
.main-row,
.bottom-row {
  margin-bottom: 10px;
}
.detail-toolbar {
  margin-bottom: 6px;
  text-align: right;
}
.selected-preview {
  margin-bottom: 8px;
}
.import-dialog-body {
  text-align: center;
  padding: 8px 0 4px;
}
.import-template-row {
  margin-bottom: 16px;
}
.dept-monitor-tab ::v-deep .monitor-warn-1 td {
  background-color: #f9d5d5 !important;
}
.dept-monitor-tab ::v-deep .monitor-warn-2 td {
  background-color: #f7f4a8 !important;
}
.dept-monitor-tab ::v-deep .monitor-warn-3 td {
  background-color: #a6e4f7 !important;
}
.dept-monitor-tab ::v-deep .el-table {
  width: max-content;
  min-width: 100%;
}
</style>
