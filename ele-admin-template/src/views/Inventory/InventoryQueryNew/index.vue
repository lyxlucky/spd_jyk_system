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
        @advanced-change="onAdvancedChange"
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

      <div class="spd-panel spd-table-panel spd-table-panel--main">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="mainTable"
            class="data-table"
            size="mini"
            border
            stripe
            highlight-current-row
            title="库存汇总"
            :toolkit="['reload', 'size', 'columns', 'fullscreen']"
            :columns-sort="true"
            :height="mainTableHeight"
            :columns="mainColumns"
            :datasource="mainDatasource"
            :selection.sync="mainSelection"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            :row-class-name="mainRowClassName"
            cache-key="InventoryQueryNewMain"
            @done="onTableLayoutDone"
            @current-change="onMainRowChange"
            @sort-change="onMainSortChange"
            @row-contextmenu="onMainContextMenu"
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

      <div class="spd-panel spd-table-panel spd-table-panel--detail">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="detailTable"
            class="data-table"
            size="mini"
            border
            stripe
            title=""
            :toolkit="['reload', 'size', 'columns', 'fullscreen']"
            :columns-sort="true"
            :height="detailTableHeight"
            :columns="detailColumns"
            :datasource="detailDatasource"
            :selection.sync="detailSelection"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="InventoryQueryNewDetail"
            @done="onTableLayoutDone"
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

    <ul
      v-show="ctxMenuVisible"
      class="inv-ctx-menu"
      :style="{ left: ctxMenuX + 'px', top: ctxMenuY + 'px' }"
      @contextmenu.prevent
    >
      <li @click="onCtxLock('goods')">查看散货锁定</li>
      <li @click="onCtxLock('def')">查看定数包锁定</li>
      <li @click="onCtxLock('prelock')">查看定数包预锁</li>
    </ul>
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
import { setPageTab, getRouteTabKey } from '@/utils/page-tab-util';

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
      mainTableHeight: 395,
      detailTableHeight: 395,
      advancedOpen: false,
      layoutTimer: null,
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
      simpleLoading: false,
      ctxMenuVisible: false,
      ctxMenuX: 0,
      ctxMenuY: 0,
      // 切换菜单 keep-alive 时还原页面/表格滚动位置
      savedScroll: {
        page: 0,
        mainTop: 0,
        mainLeft: 0,
        detailTop: 0,
        detailLeft: 0
      }
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
  mounted() {
    // 补全页签 components，纳入 keep-alive（异步路由首次匹配常拿不到 name）
    const name = this.$options.name;
    if (name) {
      setPageTab({ key: getRouteTabKey(), components: [name] });
    }
    document.addEventListener('click', this.hideCtxMenu);
    window.addEventListener('resize', this.scheduleUpdateHeights);
    // 表格内部滚动吞掉滚轮时，允许把滚动交给页面，从而滑到下方明细表
    this.$el.addEventListener('wheel', this.onPageWheel, { passive: false });
    this.$nextTick(() => {
      this.updateTableHeights();
      requestAnimationFrame(() => this.updateTableHeights());
    });
  },
  activated() {
    // 切回页签：保持查询结果与滚动位置，不重新拉数
    this.$nextTick(() => {
      this.updateTableHeights();
      this.$nextTick(() => this.restoreScroll());
    });
  },
  deactivated() {
    this.captureScroll();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideCtxMenu);
    window.removeEventListener('resize', this.scheduleUpdateHeights);
    this.$el?.removeEventListener('wheel', this.onPageWheel);
    if (this.layoutTimer) clearTimeout(this.layoutTimer);
  },
  methods: {
    getTableBodyWrapper(refName) {
      const table = this.$refs[refName];
      const root = table?.$el || table?.$refs?.table?.$el;
      return root?.querySelector?.('.el-table__body-wrapper') || null;
    },
    captureScroll() {
      const main = this.getTableBodyWrapper('mainTable');
      const detail = this.getTableBodyWrapper('detailTable');
      this.savedScroll = {
        page: this.$el?.scrollTop || 0,
        mainTop: main?.scrollTop || 0,
        mainLeft: main?.scrollLeft || 0,
        detailTop: detail?.scrollTop || 0,
        detailLeft: detail?.scrollLeft || 0
      };
    },
    restoreScroll() {
      const scroll = this.savedScroll || {};
      if (this.$el) this.$el.scrollTop = scroll.page || 0;
      const main = this.getTableBodyWrapper('mainTable');
      const detail = this.getTableBodyWrapper('detailTable');
      if (main) {
        main.scrollTop = scroll.mainTop || 0;
        main.scrollLeft = scroll.mainLeft || 0;
      }
      if (detail) {
        detail.scrollTop = scroll.detailTop || 0;
        detail.scrollLeft = scroll.detailLeft || 0;
      }
      // 恢复主表当前行高亮；跳过 current-change 联动，避免切回时重查明细把滚动打回顶部
      if (this.selectedMainRow) {
        this._skipMainRowReload = true;
        const pro = this.$refs.mainTable;
        const elTable = pro?.$refs?.table || pro;
        elTable?.setCurrentRow?.(this.selectedMainRow);
        this.$nextTick(() => {
          this._skipMainRowReload = false;
          // 明细表可能在布局后被重置，再刷一次滚动
          const detail = this.getTableBodyWrapper('detailTable');
          if (detail) {
            detail.scrollTop = scroll.detailTop || 0;
            detail.scrollLeft = scroll.detailLeft || 0;
          }
        });
      }
    },
    fmtDate10,
    fmtMainUpShelfState,
    fmtContractEnd,
    validityPeriodStyle,
    mainRowClassName,
    isContractExpired(val) {
      if (!val) return false;
      return new Date(fmtDate10(val)).getTime() <= Date.now();
    },
    onAdvancedChange(open) {
      this.advancedOpen = !!open;
      this.scheduleUpdateHeights();
    },
    onTableLayoutDone() {
      this.scheduleUpdateHeights();
    },
    scheduleUpdateHeights() {
      if (this.layoutTimer) clearTimeout(this.layoutTimer);
      this.layoutTimer = setTimeout(() => {
        this.updateTableHeights();
        this.layoutTimer = null;
      }, 50);
    },
    /** 表格滚轮到顶/底后转交外层页面滚动，避免卡在主表滑不动下面 */
    onPageWheel(e) {
      const scrollRoot = this.$el;
      if (!scrollRoot) return;
      const tableBody = e.target?.closest?.('.el-table__body-wrapper');
      if (!tableBody) return;
      const delta = e.deltaY;
      if (!delta) return;
      const noInnerScroll = tableBody.scrollHeight <= tableBody.clientHeight + 1;
      const atTop = tableBody.scrollTop <= 0;
      const atBottom =
        tableBody.scrollTop + tableBody.clientHeight >= tableBody.scrollHeight - 1;
      const passToPage =
        noInnerScroll || (delta < 0 && atTop) || (delta > 0 && atBottom);
      if (!passToPage) return;
      const maxScroll = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      if (maxScroll <= 0) return;
      const next = Math.min(maxScroll, Math.max(0, scrollRoot.scrollTop + delta));
      if (next === scrollRoot.scrollTop) return;
      scrollRoot.scrollTop = next;
      e.preventDefault();
    },
    /**
     * 对齐老系统 invNew_box / invNew2_box 固定 height:395px。
     * 视口仍有富余时，剩余空间均分给上下两表再抬高。
     */
    updateTableHeights() {
      const root = this.$el;
      if (!root) return;
      const OLD_BOX = 395;
      const PAGE_H = 46;
      const search = root.querySelector('.inv-query-search');
      const detailBar = root.querySelector('.inv-query-detail-bar');
      const top = root.getBoundingClientRect?.().top ?? 88;
      const avail =
        window.innerHeight -
        top -
        (search?.offsetHeight || 0) -
        (detailBar?.offsetHeight || 0) -
        16;
      const eachBox = Math.max(OLD_BOX, Math.floor(avail / 2));
      const tableH = Math.max(360, eachBox - PAGE_H);
      this.mainTableHeight = tableH;
      this.detailTableHeight = tableH;
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
      if (this._skipMainRowReload) return;
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
      const title = MOVE_DEFS_TITLE[target] || '定数码移区';
      MessageBox.confirm(`确认将选中定数码${title}？`, '提示', { type: 'warning' })
        .then(async () => {
          this.moveLoading = true;
          try {
            const storageId =
              this.detailSelection[0]?.Storage_Id || this.detailCtx.storageId || '';
            const defArray = JSON.stringify(
              this.detailSelection.map((r) => r.Def_No_Pkg_Code)
            );
            await removeDefsTo(target, {
              storageId,
              sourceFrom: this.detailCtx.sourceFrom,
              batchId: this.detailCtx.batchId,
              varietieCode: this.detailCtx.varietieCode,
              batch: this.detailCtx.batch,
              currUpShelfState: this.detailCtx.currUpShelfState,
              Supply_Price: this.detailCtx.supplyPrice,
              defArray
            });
            Message.success('移区成功');
            this.reloadMain();
            this.reloadDetail();
          } catch (e) {
            Message.error(e.message || '移区失败');
          } finally {
            this.moveLoading = false;
          }
        })
        .catch(() => {});
    },
    async onMoveConfirm(quantity) {
      this.moveLoading = true;
      try {
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
    onMainContextMenu(row, _column, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (row) {
        this.selectedMainRow = row;
        this.detailCtx = rowToDetailCtx(row);
      }
      this.ctxMenuX = event?.clientX || 0;
      this.ctxMenuY = event?.clientY || 0;
      this.ctxMenuVisible = true;
    },
    hideCtxMenu() {
      this.ctxMenuVisible = false;
    },
    onCtxLock(type) {
      this.hideCtxMenu();
      this.onLockView(type);
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
.inv-query-page {
  height: calc(100vh - 88px);
  min-height: 0;
  /* 页面自身滚动，才能滑到下方定数码列表 */
  overflow: auto;
  overflow-x: hidden;
}
.inv-query-page .page-card {
  min-height: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.inv-query-page .page-card >>> .el-card__body {
  display: block;
  overflow: visible;
  padding: 8px 12px;
  box-sizing: border-box;
}
.inv-query-page .inv-query-search {
  position: relative;
  z-index: 5;
  background: #fff;
}
.inv-query-page .spd-table-panel {
  display: block;
  margin-top: 6px;
  overflow: visible;
}
.inv-query-page .spd-table-panel__wrap {
  display: block;
  overflow: visible;
}
.inv-query-page .spd-table-panel__wrap >>> .el-pagination {
  padding: 4px 0 8px;
  margin: 0;
}
.inv-query-page .inv-query-detail-bar {
  position: relative;
  z-index: 3;
  background: #fff;
  margin-top: 4px;
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
.inv-ctx-menu {
  position: fixed;
  z-index: 3000;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  min-width: 140px;
  background: #304156;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
.inv-ctx-menu li {
  padding: 8px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.inv-ctx-menu li:hover {
  background: #409eff;
}
</style>
