<template>
  <div class="ele-body spd-page inv-query-page">
    <el-card shadow="never" class="page-card">
      <MainSearch
        :where.sync="mainWhere"
        :storage-list="storageList"
        :source-from-list="sourceFromList"
        :high-low-config="highLowConfig"
        :sum="mainSum"
        :amount-sum="mainAmountSum"
        :show-adjust-debit="showAdjustDebit"
        :exporting-excel="exportingExcel"
        :exporting-center-defs="exportingCenterDefs"
        :exporting-inventory="exportingInventory"
        :generating="generating"
        @search="reloadMain"
        @summary="summaryVisible = true"
        @supplier-summary="supplierSummaryVisible = true"
        @export-center-defs="onExportCenterDefs"
        @export-excel="onExportExcel"
        @export-inventory="onExportInventory"
        @generate-stock="onGenerateStock"
        @center-check="onCenterCheck"
        @update-storage="onUpdateStorage"
        @update-goods-position="onUpdateGoodsPosition"
        @update-var-type="onUpdateVarType"
        @move-goods="onMoveGoods"
        @lock-view="onLockView"
      />

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">库存汇总</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="mainTable"
            class="data-table"
            size="mini"
            border
            stripe
            highlight-current-row
            :toolbar="false"
            :height="tableHeight"
            :columns="mainColumns"
            :datasource="mainDatasource"
            :selection.sync="mainSelection"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            :row-class-name="mainRowClassName"
            cache-key="InventoryQueryNewMain"
            @current-change="onMainRowChange"
            @sort-change="onMainSortChange"
          >
            <template v-slot:upShelfState="{ row }">
              {{ fmtMainUpShelfState(row) }}
            </template>
            <template v-slot:batchValidity="{ row }">
              <span class="validity-tag" :style="validityPeriodStyle(row)">
                {{ fmtDate10(row.Batch_Validity_Period) }}
              </span>
            </template>
            <template v-slot:contractEnd="{ row }">
              <span :class="{ 'text-danger': isContractExpired(row.CONTRACT_END_TIME) }">
                {{ fmtContractEnd(row.CONTRACT_END_TIME) }}
              </span>
            </template>
            <template v-slot:detContractEnd="{ row }">
              <span :class="{ 'text-danger': isContractExpired(row.DET_CONTRACT_END) }">
                {{ fmtContractEnd(row.DET_CONTRACT_END) }}
              </span>
            </template>
          </ele-pro-table>
        </div>
      </div>

      <DetailToolbar
        ref="detailToolbar"
        :exporting-dept="exportingDept"
        :exporting-detail="exportingDetail"
        @search="onDetailSearch"
        @update-def-position="onUpdateDefPosition"
        @export-dept-defs="onExportDeptDefs"
        @export-detail="onExportDetail"
        @move-defs="onMoveDefs"
      />

      <div class="spd-panel spd-table-panel">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="detailTable"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :height="tableHeight"
            :columns="detailColumns"
            :datasource="detailDatasource"
            :selection.sync="detailSelection"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="InventoryQueryNewDetail"
            @sort-change="onDetailSortChange"
          >
            <template v-slot:batchValidity="{ row }">
              <span class="validity-tag" :style="validityPeriodStyle(row)">
                {{ fmtDate10(row.Batch_Validity_Period) }}
              </span>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <SummaryDialog :visible.sync="summaryVisible" />
    <SupplierSummaryDialog :visible.sync="supplierSummaryVisible" :main-where="mainWhere" />
    <MoveQuantityDialog
      :visible.sync="moveDialogVisible"
      :title="moveDialogTitle"
      :max-qty="moveMaxQty"
      :loading="moveLoading"
      @confirm="onMoveConfirm"
    />
    <LockViewDialog :visible.sync="lockVisible" :type="lockType" :ctx="detailCtx || {}" />
    <ExportAuditDialog
      :visible.sync="auditVisible"
      :request-url="auditRequestUrl"
      data-type="库存查询导出"
      :key-params="auditKeyParams"
    />

    <el-dialog :title="simpleDialogTitle" :visible.sync="simpleDialogVisible" width="420px" append-to-body>
      <el-input v-if="simpleDialogMode === 'position'" v-model="simpleInputValue" placeholder="货位号" />
      <el-select v-else-if="simpleDialogMode === 'storage'" v-model="simpleInputValue" style="width: 100%">
        <el-option label="院内" value="1" />
        <el-option label="院外" value="2" />
      </el-select>
      <el-select v-else-if="simpleDialogMode === 'varType'" v-model="simpleInputValue" style="width: 100%">
        <el-option label="普通" value="0" />
        <el-option label="防疫" value="1" />
      </el-select>
      <div slot="footer">
        <el-button @click="simpleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="simpleLoading" @click="onSimpleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import MainSearch from './components/MainSearch.vue';
import DetailToolbar from './components/DetailToolbar.vue';
import SummaryDialog from './components/SummaryDialog.vue';
import SupplierSummaryDialog from './components/SupplierSummaryDialog.vue';
import MoveQuantityDialog from './components/MoveQuantityDialog.vue';
import LockViewDialog from './components/LockViewDialog.vue';
import ExportAuditDialog from './components/ExportAuditDialog.vue';
import { buildMainColumns, buildDetailColumns } from './columns';
import {
  fmtDate10,
  fmtMainUpShelfState,
  fmtContractEnd,
  validityPeriodStyle,
  mainRowClassName,
  defaultMainWhere,
  rowToDetailCtx,
  buildDefaultExportRows,
  openExcelFile,
  hasPermission
} from './utils';
import {
  parseSort,
  getStorageList,
  getDeptTwoNameByInven,
  getHighLowOptionConfig,
  searchMain,
  searchMainAll,
  searchDef,
  exportCenterDefs,
  excelInventoryQueryData,
  exportDeptDefs,
  exportCentralWareDeptDefToExcel,
  updateStorageById,
  generateStockData,
  addCenterWarehouseCheck,
  upGoodsPosition,
  upDefPosition,
  upVarTypeSource,
  removeGoodsTo,
  removeDefsTo
} from '@/api/Inventory/InventoryQueryNew';
import { getUserGroupByName } from '@/api/layout/index';

const MOVE_GOODS_TITLE = {
  qualified: '移至合格区',
  unqualified: '移至不合格区',
  insulated: '移至普通隔离区',
  adjustDebit: '移至盘损隔离区',
  emergency: '移至应急库区',
  fangyi: '移至防疫物资区'
};

const MOVE_DEFS_TITLE = {
  qualified: '定数码移至合格区',
  insulated: '定数码移至隔离区',
  unqualified: '定数码移至不合格区',
  emergency: '定数码移至应急库区'
};

export default {
  name: 'InventoryQueryNew',
  components: {
    MainSearch,
    DetailToolbar,
    SummaryDialog,
    SupplierSummaryDialog,
    MoveQuantityDialog,
    LockViewDialog,
    ExportAuditDialog
  },
  data() {
    return {
      tableHeight: 'calc((100vh - 520px) / 2)',
      mainWhere: defaultMainWhere(),
      mainSort: { field: '', order: '' },
      detailSort: { field: '', order: '' },
      detailCondition: '',
      detailCtx: null,
      mainSum: 0,
      mainAmountSum: 0,
      storageList: [],
      sourceFromList: [],
      highLowConfig: { HIGH_OR_LOW_CLASS: [], HIGH_OR_LOW_CLASS_TWO: [] },
      mainSelection: [],
      detailSelection: [],
      selectedMainRow: null,
      showAdjustDebit: false,
      exportingExcel: false,
      exportingCenterDefs: false,
      exportingInventory: false,
      exportingDept: false,
      exportingDetail: false,
      generating: false,
      summaryVisible: false,
      supplierSummaryVisible: false,
      moveDialogVisible: false,
      moveDialogTitle: '',
      moveMaxQty: 0,
      moveLoading: false,
      moveMode: '',
      moveTarget: '',
      lockVisible: false,
      lockType: 'goods',
      auditVisible: false,
      auditRequestUrl: '',
      auditKeyParams: '',
      simpleDialogVisible: false,
      simpleDialogTitle: '',
      simpleDialogMode: '',
      simpleInputValue: '',
      simpleLoading: false
    };
  },
  computed: {
    hideStorageTwo() {
      return !hasPermission('仓库-二级仓库');
    },
    hidePdaCount() {
      return !hasPermission('科室结算方式-消耗结算');
    },
    mainColumns() {
      return buildMainColumns({
        hideStorageTwo: this.hideStorageTwo,
        hidePdaCount: this.hidePdaCount
      });
    },
    detailColumns() {
      return buildDetailColumns({ hidePdaCount: this.hidePdaCount });
    }
  },
  created() {
    this.initPage();
  },
  methods: {
    fmtDate10,
    fmtMainUpShelfState,
    fmtContractEnd,
    validityPeriodStyle,
    mainRowClassName,
    isContractExpired(val) {
      if (!val) return false;
      return new Date(fmtDate10(val)).getTime() <= Date.now();
    },
    async initPage() {
      try {
        const [storage, depts, highLow] = await Promise.all([
          getStorageList(),
          getDeptTwoNameByInven(),
          getHighLowOptionConfig()
        ]);
        this.storageList = storage;
        this.sourceFromList = depts;
        this.highLowConfig = highLow;
      } catch (e) {
        Message.error(e.message || '初始化失败');
      }
      this.checkAdjustDebitPermission();
    },
    async checkAdjustDebitPermission() {
      const username = this.$store.state.user?.info?.username || this.$store.state.user?.info?.UserName;
      if (!username) return;
      try {
        const res = await getUserGroupByName({ username });
        const groups = res?.result || res?.data?.result || [];
        const urls = (groups || []).map((g) => g.Permission_Url || g.permission_url);
        this.showAdjustDebit = urls.includes('InventoryQueryNew_盘损隔离');
      } catch {
        this.showAdjustDebit = hasPermission('InventoryQueryNew_盘损隔离');
      }
    },
    reloadMain() {
      this.$refs.mainTable?.reload({ page: 1, where: this.mainWhere });
    },
    reloadDetail() {
      if (!this.detailCtx) return;
      this.$refs.detailTable?.reload({ page: 1 });
    },
    onMainSortChange(order) {
      this.mainSort = parseSort(order);
      this.reloadMain();
    },
    onDetailSortChange(order) {
      this.detailSort = parseSort(order);
      this.reloadDetail();
    },
    async mainDatasource({ page, limit }) {
      try {
        const res = await searchMain(this.mainWhere, page, limit, this.mainSort);
        this.mainSum = res.sum;
        this.mainAmountSum = res.amountSum;
        return { count: res.total, list: res.result };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async detailDatasource({ page, limit }) {
      if (!this.detailCtx) {
        return { count: 0, list: [] };
      }
      const ctx = {
        ...this.detailCtx,
        condition: this.detailCondition
      };
      try {
        const res = await searchDef(ctx, page, limit, this.detailSort);
        return { count: res.total, list: res.result };
      } catch (e) {
        Message.error(e.message || '查询明细失败');
        return { count: 0, list: [] };
      }
    },
    onMainRowChange(row) {
      this.selectedMainRow = row;
      this.detailCtx = rowToDetailCtx(row);
      this.detailCondition = '';
      this.$refs.detailToolbar?.setCondition('');
      this.reloadDetail();
    },
    onDetailSearch(condition) {
      this.detailCondition = condition || '';
      this.reloadDetail();
    },
    getActiveMainRow() {
      return this.selectedMainRow || this.mainSelection[0] || null;
    },
    async onExportExcel() {
      this.exportingExcel = true;
      try {
        const res = await searchMainAll(this.mainWhere, this.mainSort);
        if (res.auditRequired) {
          this.auditRequestUrl = res.requesturl || '/CentralWarehouseDept/Search';
          this.auditKeyParams = res.keyparams || '';
          this.auditVisible = true;
          return;
        }
        const rows = buildDefaultExportRows(res.result);
        writeFile(
          { SheetNames: ['库存查询'], Sheets: { 库存查询: utils.aoa_to_sheet(rows) } },
          '库存查询.xlsx'
        );
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingExcel = false;
      }
    },
    async onExportCenterDefs() {
      this.exportingCenterDefs = true;
      try {
        const res = await exportCenterDefs(this.mainWhere);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingCenterDefs = false;
      }
    },
    async onExportInventory() {
      this.exportingInventory = true;
      try {
        const res = await excelInventoryQueryData(this.mainWhere, this.mainWhere.exportLimit);
        if (res.msg && res.msg.indexOf('无数据') === -1) {
          openExcelFile(res.msg);
          Message.success('导出成功');
        } else {
          Message.warning(res.msg || '无数据可导出');
        }
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingInventory = false;
      }
    },
    async onExportDeptDefs() {
      this.exportingDept = true;
      try {
        const res = await exportDeptDefs(this.mainWhere.sourceFrom);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingDept = false;
      }
    },
    async onExportDetail() {
      if (!this.detailCtx) {
        Message.warning('请先选择主表行');
        return;
      }
      this.exportingDetail = true;
      try {
        const res = await exportCentralWareDeptDefToExcel(this.detailCtx, this.detailSort);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingDetail = false;
      }
    },
    async onGenerateStock() {
      this.generating = true;
      try {
        await generateStockData(this.mainWhere);
        Message.success('生成盘点数据成功');
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.generating = false;
      }
    },
    async onCenterCheck() {
      try {
        await MessageBox.confirm('确认执行中心库盘点？', '提示', { type: 'warning' });
        await addCenterWarehouseCheck(this.mainWhere.isHptx);
        Message.success('盘点成功');
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '盘点失败');
      }
    },
    onUpdateStorage() {
      const rows = this.mainSelection.length ? this.mainSelection : this.selectedMainRow ? [this.selectedMainRow] : [];
      if (!rows.length) {
        Message.warning('请勾选主表行');
        return;
      }
      this._pendingRows = rows;
      this.simpleDialogMode = 'storage';
      this.simpleDialogTitle = '修改库区';
      this.simpleInputValue = '1';
      this.simpleDialogVisible = true;
    },
    onUpdateGoodsPosition() {
      const rows = this.mainSelection.length ? this.mainSelection : this.selectedMainRow ? [this.selectedMainRow] : [];
      if (!rows.length) {
        Message.warning('请勾选主表行');
        return;
      }
      this._pendingRows = rows;
      this.simpleDialogMode = 'position';
      this.simpleDialogTitle = '修改散货货位号';
      this.simpleInputValue = '';
      this.simpleDialogVisible = true;
    },
    onUpdateDefPosition() {
      if (!this.detailSelection.length) {
        Message.warning('请勾选明细行');
        return;
      }
      this._pendingRows = this.detailSelection;
      this.simpleDialogMode = 'position';
      this.simpleDialogTitle = '修改定数码货位号';
      this.simpleInputValue = '';
      this.simpleDialogVisible = true;
    },
    onUpdateVarType() {
      const rows = this.mainSelection.length ? this.mainSelection : this.selectedMainRow ? [this.selectedMainRow] : [];
      if (!rows.length) {
        Message.warning('请勾选主表行');
        return;
      }
      this._pendingRows = rows;
      this.simpleDialogMode = 'varType';
      this.simpleDialogTitle = '修改物资类型';
      this.simpleInputValue = '0';
      this.simpleDialogVisible = true;
    },
    async onSimpleConfirm() {
      const rows = this._pendingRows || [];
      this.simpleLoading = true;
      try {
        if (this.simpleDialogMode === 'storage') {
          const ids = rows.map((r) => r.Batch_Id).join(',');
          await updateStorageById(ids, this.simpleInputValue);
        } else if (this.simpleDialogMode === 'varType') {
          const postData = rows.map((r) => r.Batch_Id).join(',');
          await upVarTypeSource(postData, this.simpleInputValue);
        } else if (this.simpleDialogMode === 'position') {
          const hwh = (this.simpleInputValue || '').trim();
          if (!hwh) {
            Message.warning('请输入货位号');
            return;
          }
          if (this.simpleDialogTitle.indexOf('定数码') >= 0) {
            const json = JSON.stringify(rows.map((r) => ({ Def_No_Pkg_Code: r.Def_No_Pkg_Code })));
            await upDefPosition(json, hwh);
          } else {
            const json = JSON.stringify(
              rows.map((r) => ({
                Varietie_Code: r.Varietie_Code,
                Batch: r.Batch,
                Storage_Id: r.Storage_Id
              }))
            );
            await upGoodsPosition(json, hwh);
          }
        }
        Message.success('操作成功');
        this.simpleDialogVisible = false;
        this.reloadMain();
        this.reloadDetail();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.simpleLoading = false;
      }
    },
    onMoveGoods(target) {
      const row = this.getActiveMainRow();
      if (!row) {
        Message.warning('请选择主表行');
        return;
      }
      this.selectedMainRow = row;
      this.detailCtx = rowToDetailCtx(row);
      this.moveMode = 'goods';
      this.moveTarget = target;
      this.moveDialogTitle = MOVE_GOODS_TITLE[target] || '移区';
      this.moveMaxQty = Number(row.Goods_Qty) || 0;
      this.moveDialogVisible = true;
    },
    onMoveDefs(target) {
      if (!this.detailSelection.length) {
        Message.warning('请勾选明细行');
        return;
      }
      if (!this.detailCtx) {
        Message.warning('请先选择主表行');
        return;
      }
      this.moveMode = 'defs';
      this.moveTarget = target;
      this.moveDialogTitle = MOVE_DEFS_TITLE[target] || '定数码移区';
      this.moveMaxQty = 0;
      this.moveDialogVisible = true;
    },
    async onMoveConfirm(quantity) {
      this.moveLoading = true;
      try {
        if (this.moveMode === 'goods') {
          const row = this.selectedMainRow;
          const ctx = rowToDetailCtx(row);
          await removeGoodsTo(this.moveTarget, {
            storageId: ctx.storageId,
            batchId: ctx.batchId,
            varietieCode: ctx.varietieCode,
            batch: ctx.batch,
            currUpShelfState: ctx.currUpShelfState,
            quantity,
            Supply_Price: ctx.supplyPrice
          });
        } else {
          const defArray = JSON.stringify(this.detailSelection.map((r) => r.Def_No_Pkg_Code));
          await removeDefsTo(this.moveTarget, {
            storageId: this.detailCtx.storageId,
            sourceFrom: this.detailCtx.sourceFrom,
            batchId: this.detailCtx.batchId,
            varietieCode: this.detailCtx.varietieCode,
            batch: this.detailCtx.batch,
            currUpShelfState: this.detailCtx.currUpShelfState,
            defArray
          });
        }
        Message.success('移区成功');
        this.moveDialogVisible = false;
        this.reloadMain();
        this.reloadDetail();
      } catch (e) {
        Message.error(e.message || '移区失败');
      } finally {
        this.moveLoading = false;
      }
    },
    onLockView(type) {
      const row = this.getActiveMainRow();
      if (!row) {
        Message.warning('请选择主表行');
        return;
      }
      this.detailCtx = rowToDetailCtx(row);
      this.lockType = type;
      this.lockVisible = true;
    }
  }
};
</script>

<style scoped>
.inv-query-page .page-card {
  height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.inv-query-page .page-card >>> .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 12px;
}
.inv-query-page .spd-table-panel {
  flex-shrink: 0;
}
.inv-query-page .spd-table-panel__wrap {
  min-height: 0;
}
.text-danger {
  color: #f56c6c;
}
::v-deep .inv-query-row-expired td {
  background-color: #ffecec !important;
}
::v-deep .inv-query-row-warning15 td {
  background-color: rgba(255, 165, 0, 0.15) !important;
}
::v-deep .inv-query-row-warning90 td {
  background-color: rgba(255, 255, 0, 0.2) !important;
}
</style>
