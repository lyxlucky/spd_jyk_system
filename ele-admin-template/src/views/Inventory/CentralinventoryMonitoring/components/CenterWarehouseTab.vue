<template>
  <div class="center-warehouse-tab">
    <div class="color-legend">
      <span class="legend-item">
        <i class="legend-swatch legend-warn-3" />库存低于下限且「计划总量（散）」非 0
      </span>
      <span class="legend-item">
        <i class="legend-swatch legend-warn-1" />库存低于下限且「计划总量（散）」为 0
      </span>
    </div>

    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-form-item label="使用级别">
        <el-select v-model="filters.UseLevel" style="width: 100px" @change="reloadMonitor">
          <el-option label="全部" value="-1" />
          <el-option label="普通" value="0" />
          <el-option label="常用" value="1" />
          <el-option label="非常用" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="库房名称">
        <el-select v-model="filters.StorageID" style="width: 120px" @change="reloadMonitor">
          <el-option label="全部" value="-1" />
          <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="filterDisabled" @change="onFilterDisabledChange">过滤已停用品种</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="loadPlanByVariety" @change="onLoadPlanByVarietyChange">根据选中行品种加载备货单</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="filterZeroLimit" @change="onFilterZeroLimitChange">过滤上下线为 0 的品种</el-checkbox>
      </el-form-item>
    </el-form>

    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="filters.Supplier"
          clearable
          placeholder="按供应商查询"
          style="width: 140px"
          @keyup.enter.native="reloadMonitor"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filters.SearchName"
          clearable
          placeholder="请输入关键字搜索"
          style="width: 160px"
          @keyup.enter.native="reloadMonitor"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.IsCoefficient" style="width: 100px" @change="reloadMonitor">
          <el-option label="全部系数" value="0" />
          <el-option label="系数1" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="bhkqStorageId" style="width: 110px" @change="reloadPicking">
          <el-option v-for="item in storageList" :key="'bh-' + item.ID" :label="item.NAME" :value="String(item.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadMonitor">查询</el-button>
        <el-button @click="toggleMonitorHeight">{{ monitorExpanded ? '还原表格' : '表格放大' }}</el-button>
      </el-form-item>
    </el-form>
      </div>
    </div>

    <div class="spd-panel">
      <div class="spd-panel__head">操作</div>
      <div class="spd-toolbar">
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-select v-model="allocateSvc" size="mini" style="width: 140px">
              <el-option :label="allocateLabels.outToIn" value="1" />
              <el-option :label="allocateLabels.inToOut" value="0" />
            </el-select>
            <el-button size="mini" @click="openAllocate('sh')">散货调拨单</el-button>
            <el-button size="mini" @click="openAllocate('dsb')">定数包调拨单</el-button>
          </div>
        </div>
        <div class="spd-toolbar__divider" />
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button v-permission="'export-CentralinventoryMonitoring-zxkdc'" size="mini" :loading="exporting" @click="onExport">
              导出
            </el-button>
            <el-button size="mini" @click="onShowLc">临采详情</el-button>
            <el-button size="mini" type="primary" :disabled="!monitorSelection.length" @click="onGenerateStockUp">
              添加至已选备货单
            </el-button>
            <el-upload class="inline-upload" action="" :show-file-list="false" accept=".xlsx,.xls" :http-request="onImportBh">
              <el-button size="mini" :loading="importLoading">导入生成备货</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedRowsPreview.length" class="selected-preview">
      <el-table :data="selectedRowsPreview" size="mini" border max-height="120">
        <el-table-column prop="DIY_STORAGE" label="库房名称" width="90" />
        <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="APPROVAL_NUMBER" label="批准文号" width="100" />
        <el-table-column prop="supplier_name" label="供应商名称" min-width="120" show-overflow-tooltip />
      </el-table>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>中心库库存列表</span>
        <span v-if="monitorSelection.length" class="spd-panel__head-meta">已选 {{ monitorSelection.length }} 条</span>
      </div>
      <div class="spd-table-panel__wrap">
    <ele-pro-table
      ref="monitorTable"
      class="data-table"
      size="mini"
      :height="monitorTableHeight"
      :row-class-name="monitorWarningRowClass"
      :columns="monitorColumns"
      :datasource="monitorDatasource"
      :selection.sync="monitorSelection"
      :page-size="monitorPageSize"
      :page-sizes="[10, 20, 30, 50, 100, 150, 300, 1000]"
      cache-key="cimCenterMonitorTable"
      @selection-change="onMonitorSelectionChange"
    >
      <template v-slot:contractType="{ row }">{{ formatContractType(row.CONTRACT_TYPE) }}</template>
      <template v-slot:pkgPlan="{ row }">
        <el-input-number
          v-model="planMap[rowKey(row)].pkg"
          :min="0"
          :controls="false"
          size="mini"
          style="width: 70px"
          :disabled="!isRowSelected(row)"
          @change="(val) => onPkgChange(row, val)"
        />
      </template>
      <template v-slot:goodsPlan="{ row }">
        <el-input-number
          v-model="planMap[rowKey(row)].goods"
          :min="0"
          :controls="false"
          size="mini"
          style="width: 70px"
          :disabled="!isRowSelected(row)"
          @change="(val) => onGoodsChange(row, val)"
        />
      </template>
      <template v-slot:planGoodsQty="{ row }">{{ planGoodsQtyDisplay(row) }}</template>
    </ele-pro-table>
      </div>
    </div>

    <el-row :gutter="12" class="bottom-row">
      <el-col :span="10">
        <div class="spd-sub-panel">
        <div class="spd-sub-panel__head">备货单列表</div>
        <el-form size="mini" inline class="bottom-filter" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="pickingWhere.BHDate" placeholder="YYYY-MM" clearable style="width: 100px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="pickingWhere.SenState" style="width: 120px">
              <el-option label="全部" value="-1" />
              <el-option label="未发送（SPD）" value="0" />
              <el-option label="已发送（SPD）" value="1" />
              <el-option label="已查看（B2B）" value="2" />
              <el-option label="处理中（B2B）" value="3" />
              <el-option label="部分送货（B2B）" value="4" />
              <el-option label="全部送货（B2B）" value="5" />
              <el-option label="部分收货（SPD）" value="6" />
              <el-option label="全部收货（SPD）" value="7" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="pickingWhere.PlanNum" placeholder="备货单号" clearable style="width: 110px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="pickingWhere.VarietieCode" placeholder="关键字" clearable style="width: 120px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadPicking">查询</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="pickingTable"
          size="mini"
          height="265px"
          highlight-current-row
          :init-load="false"
          :toolkit="[]"
          :columns="pickingColumns"
          :datasource="pickingDatasource"
          cache-key="cimCenterPickingTable"
          @current-change="onPickingRowChange"
        >
          <template v-slot:createTime="{ row }">{{ formatDateTime(row.Create_Time) }}</template>
          <template v-slot:approveState="{ row }">{{ formatApproveState(row.Approve_State) }}</template>
          <template v-slot:sendState="{ row }">{{ formatSendState(row.Send_State) }}</template>
          <template v-slot:planRemark="{ row }">
            <el-button type="primary" size="mini" plain @click.stop="openPlanRemark(row)">备注</el-button>
          </template>
          <template v-slot:planAction="{ row }">
            <el-button type="text" size="mini" @click.stop="onApprove(row)">同意</el-button>
            <el-button type="text" size="mini" @click.stop="onReject(row)">拒绝</el-button>
            <el-button type="text" size="mini" class="text-danger" @click.stop="onDeletePlan(row)">删除</el-button>
          </template>
        </ele-pro-table>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="spd-sub-panel">
        <div class="spd-sub-panel__head row-title">
          <span>备货单明细</span>
          <div class="spd-toolbar__btns">
            <el-button size="mini" :disabled="!detailSelection.length" @click="openBhXsDialog">增加线上线下</el-button>
            <el-button type="danger" size="mini" plain :disabled="!detailSelection.length" @click="onDeleteDetails">
              删除
            </el-button>
          </div>
        </div>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="265px"
          :init-load="false"
          :toolkit="[]"
          :need-page="false"
          :page-size="9999"
          :columns="detailColumns"
          :datasource="detailDatasource"
          :selection.sync="detailSelection"
          cache-key="cimCenterDetailTable"
        />
        </div>
      </el-col>
    </el-row>

    <el-dialog title="备货单备注" :visible.sync="planRemarkVisible" width="600px" append-to-body>
      <el-input v-model="planRemarkText" type="textarea" :rows="8" />
      <div slot="footer">
        <el-button @click="planRemarkVisible = false">取消</el-button>
        <el-button type="primary" :loading="planRemarkSaving" @click="savePlanRemark">确定</el-button>
      </div>
    </el-dialog>

    <StockUpDialog :visible.sync="stockUpVisible" :monitor-rows="monitorRows" @success="onStockUpSuccess" />
    <LcNumDialog :visible.sync="lcVisible" />
    <AllocateCreateDialog :visible.sync="allocateVisible" :mode="allocateMode" :svc="allocateSvc" />
    <el-dialog title="选择线上线下内容" :visible.sync="bhXsVisible" width="320px" append-to-body>
      <el-select v-model="bhXsType" style="width: 100%">
        <el-option label="线上" value="1" />
        <el-option label="线下" value="2" />
        <el-option label="集采" value="3" />
      </el-select>
      <div slot="footer">
        <el-button @click="bhXsVisible = false">取消</el-button>
        <el-button type="primary" :loading="bhXsSaving" @click="saveBhXs">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import StockUpDialog from '@/views/Task/BhInfo/components/StockUpDialog.vue';
import LcNumDialog from './LcNumDialog.vue';
import AllocateCreateDialog from './AllocateCreateDialog.vue';
import { HOME_HP } from '@/config/setting';
import {
  addBhXsDetalis,
  deletePickingDetails,
  deletePickingList,
  getMonitorPopup,
  getPickingInfo,
  getPickingList,
  getStorageList,
  importBhData,
  noApprove,
  searchCentralMonitor,
  showPlanRemarks,
  updateApproveState,
  updateMonitorInfo,
  updatePlanRemarks
} from '@/api/Inventory/CentralinventoryMonitoring';
import {
  buildCenterDetailColumns,
  buildCenterMonitorColumns,
  buildCenterPickingColumns,
  buildMonitorPopupItems,
  buildUpdateInfoPayload,
  createCenterMonitorWhere,
  createCenterPickingWhere,
  exportCentralMonitorExcel,
  formatApproveState,
  formatContractType,
  formatDateTime,
  formatSendState,
  getAllocateSvcLabels,
  monitorWarningRowClass,
  planGoodsQtyDisplay,
  syncGoodsFromPkg,
  syncPkgFromGoods
} from '../utils';

export default {
  name: 'CenterWarehouseTab',
  components: { StockUpDialog, LcNumDialog, AllocateCreateDialog },
  data() {
    return {
      homeHp: HOME_HP,
      allocateLabels: getAllocateSvcLabels(HOME_HP),
      allocateSvc: '1',
      allocateVisible: false,
      allocateMode: 'sh',
      lcVisible: false,
      monitorExpanded: false,
      monitorTableHeight: '300px',
      bhXsVisible: false,
      bhXsType: '1',
      bhXsSaving: false,
      storageList: [],
      filters: createCenterMonitorWhere(),
      pickingWhere: createCenterPickingWhere(),
      bhkqStorageId: '',
      filterDisabled: true,
      filterZeroLimit: false,
      loadPlanByVariety: false,
      monitorColumns: buildCenterMonitorColumns(),
      pickingColumns: buildCenterPickingColumns(),
      detailColumns: buildCenterDetailColumns(),
      monitorPageSize: 300,
      monitorSelection: [],
      selectedRowsPreview: [],
      planMap: {},
      detailSelection: [],
      selectedPlanNo: '',
      selectedPlanSendState: '',
      exporting: false,
      importLoading: false,
      planRemarkVisible: false,
      planRemarkText: '',
      planRemarkNo: '',
      planRemarkSaving: false,
      stockUpVisible: false,
      monitorRows: []
    };
  },
  mounted() {
    this.loadStorageList();
  },
  methods: {
    monitorWarningRowClass,
    formatContractType,
    formatSendState,
    formatApproveState,
    formatDateTime,
    planGoodsQtyDisplay,
    rowKey(row) {
      return `${row.Varietie_Code}_${row.contract_code || ''}_${row.Def_No_Pkg_Coefficient}`;
    },
    isRowSelected(row) {
      return this.monitorSelection.some((r) => this.rowKey(r) === this.rowKey(row));
    },
    ensurePlanMap(row) {
      const key = this.rowKey(row);
      if (!this.planMap[key]) {
        this.$set(this.planMap, key, {
          pkg: Number(row.Pkg_plan) || 0,
          goods: Number(row.Goods_plan) || 0
        });
      }
      return this.planMap[key];
    },
    applyPlanToRows(rows) {
      (rows || []).forEach((row) => {
        const key = this.rowKey(row);
        const plan = this.ensurePlanMap(row);
        row.Pkg_plan = plan.pkg;
        row.Goods_plan = plan.goods;
      });
    },
    onPkgChange(row, val) {
      const plan = this.ensurePlanMap(row);
      plan.pkg = val;
      plan.goods = syncGoodsFromPkg(val, row.Def_No_Pkg_Coefficient);
      row.Pkg_plan = plan.pkg;
      row.Goods_plan = plan.goods;
    },
    onGoodsChange(row, val) {
      const pkg = syncPkgFromGoods(val, row.Def_No_Pkg_Coefficient);
      if (pkg == null) {
        this.$message.warning(`${val}/${row.Def_No_Pkg_Coefficient} 不是整数倍`);
        const plan = this.ensurePlanMap(row);
        row.Goods_plan = plan.goods;
        return;
      }
      const plan = this.ensurePlanMap(row);
      plan.goods = val;
      plan.pkg = pkg;
      row.Goods_plan = plan.goods;
      row.Pkg_plan = plan.pkg;
    },
    onFilterDisabledChange(val) {
      this.filters.EnableState = val ? '1' : '0';
      this.reloadMonitor();
    },
    onFilterZeroLimitChange(val) {
      this.filters.EnableLowUp = val ? '1' : '0';
      this.reloadMonitor();
    },
    onLoadPlanByVarietyChange() {
      if (this.loadPlanByVariety && this.monitorSelection.length) {
        this.pickingWhere.VarietieCode = this.monitorSelection[0].Varietie_Code_New || '';
        this.reloadPicking();
      }
    },
    onMonitorSelectionChange(rows) {
      this.selectedRowsPreview = (rows || []).slice(0, 5).map((r) => ({
        DIY_STORAGE: r.Name || r.DIY_STORAGE,
        Varietie_Code_New: r.Varietie_Code_New,
        Varietie_Name: r.Varietie_Name,
        APPROVAL_NUMBER: r.APPROVAL_NUMBER,
        supplier_name: r.supplier_name
      }));
      (rows || []).forEach((row) => this.ensurePlanMap(row));
      if (this.loadPlanByVariety && rows?.length) {
        this.pickingWhere.VarietieCode = rows[0].Varietie_Code_New || '';
        this.reloadPicking();
      }
    },
    async loadStorageList() {
      try {
        const res = await getStorageList();
        this.storageList = res.data?.result || [];
        if (this.storageList.length) {
          this.bhkqStorageId = String(this.storageList[0].ID);
          this.pickingWhere.STORAGE_ID = this.bhkqStorageId;
        }
        this.$nextTick(() => {
          this.reloadMonitor();
          this.reloadPicking();
        });
      } catch (e) {
        this.$message.error(e.message || '加载院区失败');
      }
    },
    reloadMonitor() {
      this.$refs.monitorTable?.reload({ page: 1, where: this.filters });
    },
    reloadPicking() {
      this.pickingWhere.STORAGE_ID = this.bhkqStorageId;
      this.$refs.pickingTable?.reload({ page: 1, where: this.pickingWhere });
    },
    monitorDatasource({ page, limit }) {
      return searchCentralMonitor(this.filters, page, limit)
        .then((res) => {
          const list = res.result || [];
          list.forEach((row) => {
            const plan = this.ensurePlanMap(row);
            row.Pkg_plan = plan.pkg;
            row.Goods_plan = plan.goods;
          });
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    pickingDatasource({ page, limit }) {
      return getPickingList(this.pickingWhere, page, limit)
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询备货单失败');
          return { count: 0, list: [] };
        });
    },
    detailDatasource() {
      if (!this.selectedPlanNo) return Promise.resolve({ count: 0, list: [] });
      return getPickingInfo(this.selectedPlanNo)
        .then((res) => ({ count: (res.result || []).length, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询明细失败');
          return { count: 0, list: [] };
        });
    },
    onPickingRowChange(row) {
      this.selectedPlanNo = row?.Stock_Up_Plan_No || '';
      this.selectedPlanSendState = formatSendState(row?.Send_State);
      this.$refs.detailTable?.reload({ page: 1 });
    },
    async onGenerateStockUp() {
      if (!this.monitorSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const disabled = this.monitorSelection.filter((r) => String(r.Enable) === '0');
      if (disabled.length) {
        await MessageBox.alert(
          disabled.map((r) => `${r.Varietie_Name} 品种已停用，不可添加`).join('<br>'),
          '提示',
          { dangerouslyUseHTMLString: true }
        );
        return;
      }
      this.applyPlanToRows(this.monitorSelection);
      if (this.selectedPlanNo && this.selectedPlanSendState === '已发送（SPD）') {
        this.$message.warning('不能将品种添加到已发送备货单');
        return;
      }
      if (this.selectedPlanNo) {
        await this.addToExistingPlan();
        return;
      }
      try {
        const items = buildMonitorPopupItems(this.monitorSelection, this.bhkqStorageId);
        const data = await getMonitorPopup(items);
        if (data.code == 400) {
          this.$message.error(data.msg || '无法生成备货单');
          return;
        }
        if (data.code != 200) {
          this.$message.error(data.msg || '操作失败');
          return;
        }
        const msgs = [];
        (data.result || []).forEach((item) => {
          if (item.EnableVarietie == 0) {
            msgs.push(`品种编码为 ${item.varietie_Code_New} 的品种已停用，不可生成备货单`);
          }
          if (item.EnableContract == 0) {
            msgs.push(`品种编码为 ${item.varietie_Code_New} 的合同已停用，不可生成备货单`);
          }
        });
        if (!(data.result || []).length) {
          this.$message.error('品种无合同，请关联合同后添加');
          return;
        }
        if (msgs.length) {
          await MessageBox.alert(msgs.join('<br>'), '提示', { dangerouslyUseHTMLString: true });
          return;
        }
        this.monitorRows = data.result || [];
        this.stockUpVisible = true;
      } catch (e) {
        this.$message.error(e.message || '生成备货失败');
      }
    },
    async addToExistingPlan() {
      try {
        const items = buildMonitorPopupItems(this.monitorSelection, this.bhkqStorageId);
        const data = await getMonitorPopup(items);
        if (data.code != 200) {
          this.$message.error(data.msg || '校验失败');
          return;
        }
        const payload = JSON.stringify(buildUpdateInfoPayload(this.monitorSelection, this.selectedPlanNo));
        await updateMonitorInfo(payload);
        this.$message.success('已成功添加到备货单');
        this.reloadMonitor();
        this.reloadPicking();
      } catch (e) {
        this.$message.error(e.message || '添加失败');
      }
    },
    onStockUpSuccess() {
      this.stockUpVisible = false;
      this.reloadMonitor();
      this.reloadPicking();
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await searchCentralMonitor(this.filters, 1, 999999);
        exportCentralMonitorExcel(res.result || []);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    onShowLc() {
      this.lcVisible = true;
    },
    toggleMonitorHeight() {
      this.monitorExpanded = !this.monitorExpanded;
      this.monitorTableHeight = this.monitorExpanded ? '700px' : '300px';
      this.$nextTick(() => this.reloadMonitor());
    },
    openAllocate(mode) {
      this.allocateMode = mode;
      this.allocateVisible = true;
    },
    openBhXsDialog() {
      if (!this.detailSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.bhXsType = '1';
      this.bhXsVisible = true;
    },
    async saveBhXs() {
      this.bhXsSaving = true;
      try {
        const ids = this.detailSelection.map((r) => r.ID).filter(Boolean);
        const data = await addBhXsDetalis(ids, this.bhXsType);
        if (data.code == 200 || data.code === '200') {
          this.$message.success(data.msg || '添加成功');
          this.bhXsVisible = false;
          this.$refs.detailTable?.reload({ page: 1 });
        } else {
          this.$message.error(data.msg || '添加失败');
        }
      } catch (e) {
        this.$message.error(e.message || '添加失败');
      } finally {
        this.bhXsSaving = false;
      }
    },
    async onImportBh({ file }) {
      this.importLoading = true;
      try {
        const creator = this.$store.state.user?.info?.Nickname || '';
        const data = await importBhData(file, creator);
        if (data.code == 301) {
          this.$message.error(data.msg || '登录失效');
          return;
        }
        if (data.code == 200) {
          this.$message.success(data.msg || '导入成功');
          this.reloadMonitor();
          this.pickingWhere.VarietieCode = '';
          this.reloadPicking();
        } else {
          this.$message.error(data.msg || '导入失败');
        }
      } catch (e) {
        this.$message.error(e.message || '导入失败');
      } finally {
        this.importLoading = false;
      }
    },
    async onApprove(row) {
      try {
        await MessageBox.confirm('确定要同意审批吗?', '提示');
        const approver = this.$store.state.user?.info?.Nickname || '';
        await updateApproveState(row.ID, approver);
        this.$message.success('审批成功');
        this.reloadPicking();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '审批失败');
      }
    },
    async onReject(row) {
      try {
        await MessageBox.confirm('确定要拒绝审批吗?', '提示');
        await noApprove(row.ID);
        this.$message.success('已拒绝');
        this.reloadPicking();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '操作失败');
      }
    },
    async onDeletePlan(row) {
      try {
        await MessageBox.confirm('确定删除该备货单吗?', '提示', { type: 'warning' });
        await deletePickingList(row.ID);
        this.$message.success('已删除');
        if (this.selectedPlanNo === row.Stock_Up_Plan_No) {
          this.selectedPlanNo = '';
          this.$refs.detailTable?.reload({ page: 1 });
        }
        this.reloadPicking();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    },
    async onDeleteDetails() {
      try {
        await MessageBox.confirm('确定删除选中的明细吗?', '提示', { type: 'warning' });
        const ids = this.detailSelection.map((r) => r.ID).filter(Boolean);
        await deletePickingDetails(ids);
        this.$message.success('删除成功');
        this.$refs.detailTable?.reload({ page: 1 });
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    },
    async openPlanRemark(row) {
      this.planRemarkNo = row.Stock_Up_Plan_No;
      try {
        const data = await showPlanRemarks(this.planRemarkNo);
        this.planRemarkText = data?.result?.Remarks || data?.Remarks || '';
        this.planRemarkVisible = true;
      } catch (e) {
        this.$message.error(e.message || '读取备注失败');
      }
    },
    async savePlanRemark() {
      this.planRemarkSaving = true;
      try {
        await updatePlanRemarks(this.planRemarkNo, this.planRemarkText);
        this.$message.success('保存成功');
        this.planRemarkVisible = false;
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.planRemarkSaving = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.center-warehouse-tab {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .color-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 8px;
    font-size: 12px;
  }
  .legend-swatch {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    vertical-align: middle;
  }
  .legend-warn-1 {
    background: #f9d5d5;
  }
  .legend-warn-3 {
    background: #a6e4f7;
  }
  .filter-row,
  .bottom-filter {
    margin-bottom: 8px;
  }
  .inline-upload {
    display: inline-block;
  }
  .selected-preview {
    margin-bottom: 0;
  }
  .row-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bottom-row {
    margin-top: 0;
  }
  .text-danger {
    color: #f56c6c;
  }
  :deep(.monitor-warn-1) {
    background-color: #f9d5d5 !important;
  }
  :deep(.monitor-warn-2) {
    background-color: #f7f4a8 !important;
  }
  :deep(.monitor-warn-3) {
    background-color: #a6e4f7 !important;
  }
}
</style>
