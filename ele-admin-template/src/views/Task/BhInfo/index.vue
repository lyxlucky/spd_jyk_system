<template>
  <div class="ele-body spd-page bh-info-page">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
      <el-form :inline="true" size="mini" class="filter-form">
        <el-form-item label="品种编码">
          <el-input v-model="filters.VARIETIE_CODE_NEW" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="库房名称">
          <el-input v-model="filters.DIY_STORAGE" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="filters.SUPPLIER_NAME" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.APPROVAL_NUMBER" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="filters.MANUFACTURING_ENT_NAME" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <br />
        <el-form-item label="备注">
          <el-input v-model="filters.BHFX_REMARKS" clearable style="width: 160px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item label="是否常备">
          <el-select v-model="filters.IS_CG_BH" style="width: 90px" @change="reloadMain">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="院区">
          <el-select v-model="filters.STORAGE_ID" style="width: 120px" @change="onStorageChange">
            <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
          </el-select>
        </el-form-item>
        <el-form-item label="低于下限(%)">
          <el-input v-model="filters.limetPrsen" clearable style="width: 60px" @keyup.enter.native="reloadMain" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reloadMain">查询</el-button>
        </el-form-item>
      </el-form>
      </div>
    </div>

    <div class="spd-panel">
      <div class="spd-panel__head">操作</div>
      <div class="action-bar spd-toolbar">
        <div class="spd-toolbar__btns">
        <el-button type="primary" size="mini" :disabled="!mainSelection.length" @click="handleSetCb(1)">设为常备</el-button>
        <el-button type="danger" size="mini" plain :disabled="!mainSelection.length" @click="handleSetCb(0)">取消常备</el-button>
        <el-button type="success" size="mini" :disabled="!mainSelection.length" @click="handleGenerateStockUp">生成备货</el-button>
        <el-button v-permission="'export-BhInfo-pzbhxxdc'" type="primary" size="mini" plain :loading="exporting" @click="handleExport">导出</el-button>
        <el-button type="warning" size="mini" :disabled="!mainSelection.length" @click="openWarehouseDialog">修改库房</el-button>
        <el-upload class="inline-upload" action="" :show-file-list="false" accept=".xlsx,.xls" :http-request="onImportRemark">
          <el-button size="mini" :loading="importRemarkLoading">导入（更新备注）</el-button>
        </el-upload>
        <el-upload class="inline-upload" action="" :show-file-list="false" accept=".xlsx,.xls" :http-request="onImportBh">
          <el-button size="mini" :loading="importBhLoading">导入条目</el-button>
        </el-upload>
        </div>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>品种备货分析列表</span>
        <span v-if="mainSelection.length" class="spd-panel__head-meta">已选 {{ mainSelection.length }} 条</span>
      </div>
      <div class="spd-table-panel__wrap">
      <ele-pro-table
        ref="mainTable"
        size="mini"
        height="440px"
        highlight-current-row
        :columns="mainColumns"
        :datasource="mainDatasource"
        :selection.sync="mainSelection"
        cache-key="bhInfoMainTable"
        @current-change="onMainRowChange"
        @selection-change="onMainSelectionChange"
      >
        <template v-slot:remark="{ row }">
          <el-button type="text" size="mini" @click.stop="openRemarkDialog(row)">
            {{ row.BHFX_REMARKS || '无' }}
          </el-button>
        </template>
        <template v-slot:planQty="{ row }">
          <el-input-number
            v-model="planQtyMap[row.VARIETIE_CODE]"
            :min="0"
            :controls="false"
            size="mini"
            style="width: 70px"
            :disabled="!isMainRowSelected(row)"
            @change="(val) => onPlanQtyChange(row, val)"
          />
        </template>
        <template v-slot:isCgBh="{ row }">{{ formatIsCgBh(row.IS_CG_BH) }}</template>
        <template v-slot:centerQty="{ row }">{{ centerStockQty(row) }}</template>
        <template v-slot:centerPct="{ row }">{{ stockPercent(centerStockQty(row), row.STOREHOUSE_UPPPER) }}</template>
        <template v-slot:deptPct="{ row }">{{ stockPercent(row.DEPT_NUM, row.STOREHOUSE_UPPPER) }}</template>
        <template v-slot:lower="{ row }">{{ formatStorehouseLower(row.STOREHOUSE_LOWER) }}</template>
        <template v-slot:planTime="{ row }">{{ formatDate10(row.CREATE_TIME) }}</template>
        <template v-slot:sendState="{ row }">{{ formatSendState(row.SEND_STATE) }}</template>
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click.stop="openLimitDialog(row)">修改上下限</el-button>
        </template>
      </ele-pro-table>
      </div>
    </div>

      <el-row :gutter="12" class="bottom-row">
        <el-col :span="10">
          <div class="spd-sub-panel">
          <div class="spd-sub-panel__head">备货单列表</div>
          <el-form :inline="true" size="mini" class="bottom-filter">
            <el-form-item>
              <el-input v-model="pickingFilters.BHDate" placeholder="YYYY-MM" clearable style="width: 110px" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="pickingFilters.SenState" style="width: 130px">
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
              <el-input v-model="pickingFilters.PlanNum" placeholder="备货单号" clearable style="width: 120px" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="pickingFilters.VarietieCode" placeholder="关键字" clearable style="width: 140px" />
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
            cache-key="bhInfoPickingTable"
            @current-change="onPickingRowChange"
          >
            <template v-slot:createTime="{ row }">{{ formatDateTime(row.Create_Time) }}</template>
            <template v-slot:approveState="{ row }">{{ formatApproveState(row.Approve_State) }}</template>
            <template v-slot:sendState="{ row }">{{ formatSendState(row.Send_State) }}</template>
            <template v-slot:planRemark="{ row }">
              <el-button type="primary" size="mini" plain @click.stop="openPlanRemarkDialog(row)">备注</el-button>
            </template>
          </ele-pro-table>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="spd-sub-panel">
          <div class="spd-sub-panel__head row-title">
            <span>备货单明细</span>
            <el-button type="danger" size="mini" plain :disabled="!detailSelection.length" @click="handleDeleteDetails">删除</el-button>
          </div>
          <ele-pro-table
            ref="detailTable"
            size="mini"
            height="305px"
            :init-load="false"
            :toolkit="[]"
            :need-page="false"
            :page-size="9999"
            :columns="detailColumns"
            :datasource="detailDatasource"
            :selection.sync="detailSelection"
            cache-key="bhInfoDetailTable"
          >
            <template v-slot:price="{ row }">{{ formatPrice(row) }}</template>
          </ele-pro-table>
          </div>
        </el-col>
      </el-row>

    <el-dialog title="备注" :visible.sync="remarkVisible" width="600px" append-to-body>
      <el-input v-model="remarkText" type="textarea" :rows="10" />
      <div slot="footer">
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" :loading="remarkSaving" @click="saveRemark">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改库存上下限" :visible.sync="limitVisible" width="450px" append-to-body>
      <el-form label-width="100px" size="mini">
        <el-form-item label="库存上限">
          <el-input v-model="limitForm.upper" />
        </el-form-item>
        <el-form-item label="库存下限">
          <el-input v-model="limitForm.lower" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="limitVisible = false">取消</el-button>
        <el-button type="primary" :loading="limitSaving" @click="saveLimit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改库房" :visible.sync="warehouseVisible" width="450px" append-to-body>
      <el-form label-width="100px" size="mini">
        <el-form-item label="库房名称">
          <el-input v-model="warehouseName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="warehouseVisible = false">取消</el-button>
        <el-button type="primary" :loading="warehouseSaving" @click="saveWarehouse">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="planRemarkTitle" :visible.sync="planRemarkVisible" width="600px" append-to-body>
      <el-input v-model="planRemarkText" type="textarea" :rows="10" />
      <div slot="footer">
        <el-button @click="planRemarkVisible = false">取消</el-button>
        <el-button type="primary" :loading="planRemarkSaving" @click="savePlanRemark">确定</el-button>
      </div>
    </el-dialog>

    <StockUpDialog :visible.sync="stockUpVisible" :monitor-rows="monitorRows" @success="onStockUpSuccess" />
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import StockUpDialog from './components/StockUpDialog.vue';
import {
  deletePickingDetails,
  getBhInfoList,
  getMonitorPopup,
  getPickingInfo,
  getPickingList,
  getStorageList,
  importBhInfo,
  importBhInfoRemark,
  setCb,
  showPlanRemarks,
  upVarCdesz,
  upVarWarehouse,
  updateBhInfoRemark,
  updatePlanRemarks
} from '@/api/Task/BhInfo';
import {
  bhInfoHpFlags,
  centerStockQty,
  exportBhInfoExcel,
  formatApproveState,
  formatDate10,
  formatDateTime,
  formatIsCgBh,
  formatPrice,
  formatSendState,
  formatStorehouseLower,
  stockPercent
} from './utils';

export default {
  name: 'BhInfo',
  components: { StockUpDialog },
  data() {
    return {
      storageList: [],
      filters: {
        VARIETIE_CODE_NEW: '',
        DIY_STORAGE: '',
        VARIETIE_NAME: '',
        SUPPLIER_NAME: '',
        APPROVAL_NUMBER: '',
        MANUFACTURING_ENT_NAME: '',
        BHFX_REMARKS: '',
        IS_CG_BH: '1',
        limetPrsen: '',
        STORAGE_ID: ''
      },
      pickingFilters: {
        BHDate: '',
        SenState: '-1',
        PlanNum: '',
        VarietieCode: ''
      },
      mainSelection: [],
      planQtyMap: {},
      selectedMainRow: null,
      selectedPlanNo: '',
      detailSelection: [],
      exporting: false,
      importRemarkLoading: false,
      importBhLoading: false,
      remarkVisible: false,
      remarkText: '',
      remarkRow: null,
      remarkSaving: false,
      limitVisible: false,
      limitForm: { upper: '', lower: '', id: '' },
      limitSaving: false,
      warehouseVisible: false,
      warehouseName: '',
      warehouseSaving: false,
      planRemarkVisible: false,
      planRemarkTitle: '',
      planRemarkText: '',
      planRemarkNo: '',
      planRemarkSaving: false,
      stockUpVisible: false,
      monitorRows: [],
      mainColumns: [
        { type: 'selection', width: 45, fixed: 'left' },
        { label: '库房名称', prop: 'DIY_STORAGE', width: 120 },
        { label: '备注', width: 120, align: 'center', slot: 'remark' },
        { label: '备货数量', width: 120, align: 'center', slot: 'planQty' },
        { label: '是否常备', width: 120, align: 'center', slot: 'isCgBh' },
        { label: '阳光编码', prop: 'YG_CODE', width: 120 },
        { label: '品种编码', prop: 'VARIETIE_CODE_NEW', width: 100 },
        { label: '品种名称', prop: 'VARIETIE_NAME', minWidth: 180 },
        { label: '规格型号', prop: 'SPECIFICATION_OR_TYPE', minWidth: 160 },
        { label: '生产厂家', prop: 'MANUFACTURING_ENT_NAME', minWidth: 160 },
        { label: '注册证号', prop: 'APPROVAL_NUMBER', width: 120 },
        { label: '启用合同供应商', prop: 'SUPPLIER_NAME', minWidth: 160 },
        { label: '合同结束日期', prop: 'CONTRACT_END_TIME', width: 140 },
        { label: '合同明细结束日期', prop: 'DET_CONTRACT_END', width: 180 },
        { label: '近三个月用量', prop: 'USED_QTY', width: 140, align: 'right' },
        { label: '月均用量', prop: 'YUE_USED_QTY', width: 120, align: 'right' },
        { label: '周均用量', prop: 'ZHOU_USED_QTY', width: 120, align: 'right' },
        { label: '中心库存量', width: 120, align: 'right', slot: 'centerQty' },
        { label: '中心%', width: 100, align: 'right', slot: 'centerPct' },
        { label: '二级库存量', prop: 'DEPT_NUM', width: 120, align: 'right' },
        { label: '二级%', width: 100, align: 'right', slot: 'deptPct' },
        { label: '库存上限', prop: 'STOREHOUSE_UPPPER', width: 120, align: 'right' },
        { label: '库存下限', width: 120, align: 'right', slot: 'lower' },
        { label: '中包装数', prop: 'MIDDLE_PACKAGE_COUNT', width: 120, align: 'right' },
        { label: '中包装单位', prop: 'MIDDLE_PACKAGE_UNIT', width: 120, align: 'right' },
        { label: '大包装数', prop: 'BIG_BOX_COUNT', width: 120, align: 'right' },
        { label: '大包装单位', prop: 'BIG_BOX_UNIT', width: 120, align: 'right' },
        { label: '未到货最后一次下计划数量', prop: 'STOCK_UP_PLAN_GOODS_QUANTITY', width: 260, align: 'right' },
        { label: '未到货最后一次下计划时间', width: 260, slot: 'planTime' },
        { label: '发送状态', width: 120, slot: 'sendState' },
        { label: '操作', width: 110, fixed: 'right', slot: 'action' }
      ],
      pickingColumns: [
        { label: '备货计划单号', prop: 'Stock_Up_Plan_No', width: 140 },
        { label: '创建人', prop: 'Creator', width: 100 },
        { label: '供应商名称', prop: 'supplier_name', minWidth: 120 },
        { label: '收货院区', prop: 'NAME', width: 120 },
        { label: '创建时间', width: 150, slot: 'createTime' },
        { label: '备注', width: 70, align: 'center', slot: 'planRemark' },
        { label: '审批状态', width: 120, slot: 'approveState' },
        { label: '发送状态', width: 120, slot: 'sendState' }
      ],
      detailColumns: [
        { type: 'selection', width: 45 },
        { label: '备注', prop: 'REMARKS', width: 90 },
        { label: '品种编码', prop: 'Varietie_Code_New', width: 120 },
        { label: '品种全称', prop: 'Varietie_Name', minWidth: 140 },
        { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120 },
        { label: '单位', prop: 'Unit', width: 55, align: 'center' },
        { label: '生产企业', prop: 'Manufacturing_Ent_Name', width: 120 },
        { label: '价格', width: 70, align: 'right', slot: 'price' },
        { label: '系数', prop: 'Coefficient', width: 55, align: 'center' },
        { label: '备货/包', prop: 'Stock_Up_Plan_Def_Quantity', width: 100, align: 'center' },
        { label: '备货/散', prop: 'Stock_Up_Plan_Goods_Quantity', width: 100, align: 'center' },
        { label: '实收数量', prop: 'ReceiptQty', width: 120, align: 'center' },
        { label: '备货时间', prop: 'Plan_Time', width: 100 },
        { label: '供应商名称', prop: 'supplier_name', width: 140 }
      ]
    };
  },
  created() {
    this.loadStorageList();
  },
  methods: {
    formatIsCgBh,
    formatSendState,
    formatApproveState,
    formatDateTime,
    formatDate10,
    centerStockQty,
    stockPercent,
    formatStorehouseLower,
    formatPrice(row) {
      return formatPrice(row, bhInfoHpFlags.isCg);
    },
    async loadStorageList() {
      try {
        const res = await getStorageList();
        const list = res.data?.result || [];
        this.storageList = list;
        if (list.length && !this.filters.STORAGE_ID) {
          this.filters.STORAGE_ID = String(list[0].ID);
        }
        this.$nextTick(() => {
          this.reloadMain();
          this.reloadPicking();
        });
      } catch (e) {
        this.$message.error(e.message || '加载院区失败');
      }
    },
    onStorageChange() {
      this.reloadMain();
      this.reloadPicking();
    },
    buildMainWhere() {
      return { ...this.filters };
    },
    mainDatasource({ page, limit }) {
      return getBhInfoList(this.buildMainWhere(), page, limit).then((res) => {
        (res.result || []).forEach((row) => {
          if (this.planQtyMap[row.VARIETIE_CODE] === undefined) {
            this.$set(this.planQtyMap, row.VARIETIE_CODE, row.Plan_Qty || 0);
          }
        });
        return { list: res.result || [], count: res.total || 0 };
      });
    },
    pickingDatasource({ page, limit }) {
      return getPickingList(
        {
          ...this.pickingFilters,
          STORAGE_ID: this.filters.STORAGE_ID
        },
        page,
        limit
      ).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    detailDatasource() {
      if (!this.selectedPlanNo) {
        return Promise.resolve({ list: [], count: 0 });
      }
      return getPickingInfo(this.selectedPlanNo).then((res) => ({
        list: res.result || [],
        count: (res.result || []).length
      }));
    },
    reloadMain() {
      this.$refs.mainTable?.reload({ page: 1 });
    },
    reloadPicking() {
      this.$refs.pickingTable?.reload({ page: 1 });
    },
    reloadDetail() {
      this.detailSelection = [];
      this.$refs.detailTable?.reload({ page: 1 });
    },
    isMainRowSelected(row) {
      return this.mainSelection.some((r) => r.VARIETIE_CODE === row.VARIETIE_CODE);
    },
    onMainSelectionChange(rows) {
      this.mainSelection = rows;
    },
    onPlanQtyChange(row, val) {
      row.Plan_Qty = val;
    },
    onMainRowChange(row) {
      this.selectedMainRow = row;
      if (row?.VARIETIE_CODE_NEW) {
        this.pickingFilters.VarietieCode = row.VARIETIE_CODE_NEW;
        this.reloadPicking();
      }
    },
    onPickingRowChange(row) {
      this.selectedPlanNo = row?.Stock_Up_Plan_No || '';
      this.reloadDetail();
    },
    async handleSetCb(type) {
      if (!this.mainSelection.length) {
        this.$message.warning('请勾选数据');
        return;
      }
      try {
        await MessageBox.confirm('是否确认？', '提示', { type: 'warning' });
        const res = await setCb(this.mainSelection, type, this.filters.STORAGE_ID);
        this.$message.success(res.msg || '操作成功');
        this.$refs.mainTable?.reload();
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '操作失败');
        }
      }
    },
    async handleGenerateStockUp() {
      if (!this.mainSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const items = [];
      for (const row of this.mainSelection) {
        const qty = this.planQtyMap[row.VARIETIE_CODE] ?? row.Plan_Qty ?? 0;
        if (Number(qty) <= 0) {
          this.$message.warning(`${row.VARIETIE_CODE_NEW} 备货数量需大于0`);
          return;
        }
        items.push({
          Varietie_Code: row.VARIETIE_CODE,
          varietie_Code_New: row.VARIETIE_CODE_NEW,
          Def_No_Pkg_Coefficient: '1',
          Arg_Plan: qty,
          Goods_Qty: qty,
          StorageID: this.filters.STORAGE_ID
        });
      }
      try {
        const data = await getMonitorPopup(items);
        if (data.code != 200) {
          this.$message.error(data.msg || '操作失败');
          return;
        }
        const errors = [];
        (data.result || []).forEach((item) => {
          if (item.EnableVarietie == 0) {
            errors.push(`品种编码为:${item.varietie_Code_New}的品种已停用，不可生成备货单`);
          } else if (item.EnableContract == 0) {
            errors.push(`品种编码为:${item.varietie_Code_New}的合同已停用，不可生成备货单`);
          }
        });
        if (!(data.result || []).length) {
          this.$message.warning('品种无合同，请关联合同后添加');
          return;
        }
        if (errors.length) {
          this.$message.warning(errors.join('；'));
          return;
        }
        this.monitorRows = data.result || [];
        this.stockUpVisible = true;
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    onStockUpSuccess() {
      this.reloadPicking();
    },
    async handleExport() {
      this.exporting = true;
      try {
        const res = await getBhInfoList(this.buildMainWhere(), 1, 999999);
        if (!(res.result || []).length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        exportBhInfoExcel(res.result);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    openWarehouseDialog() {
      if (!this.mainSelection.length) {
        this.$message.warning('请选择要修改的数据');
        return;
      }
      this.warehouseName = '';
      this.warehouseVisible = true;
    },
    async saveWarehouse() {
      if (!this.mainSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const arrList = this.mainSelection.map((row) => ({
        Varietie_Code: row.VARIETIE_CODE,
        varietie_Code_New: row.VARIETIE_CODE_NEW,
        Def_No_Pkg_Coefficient: '1',
        DIY_STORAGE: this.warehouseName,
        StorageID: '1'
      }));
      this.warehouseSaving = true;
      try {
        const data = await upVarWarehouse(JSON.stringify(arrList));
        if (data.code == 200) {
          this.$message.success(data.msg || '操作成功');
          this.warehouseVisible = false;
          this.reloadMain();
        } else {
          this.$message.error(data.msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.warehouseSaving = false;
      }
    },
    openRemarkDialog(row) {
      this.remarkRow = row;
      this.remarkText = row.BHFX_REMARKS || '';
      this.remarkVisible = true;
    },
    async saveRemark() {
      if (!this.remarkRow) return;
      this.remarkSaving = true;
      try {
        const res = await updateBhInfoRemark(
          this.remarkRow.VARIETIE_CODE,
          this.remarkText,
          this.filters.STORAGE_ID
        );
        this.$message.success(res.msg || '操作成功');
        this.remarkVisible = false;
        this.reloadMain();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.remarkSaving = false;
      }
    },
    openLimitDialog(row) {
      const upper = Number(row.STOREHOUSE_UPPPER) < 0 ? 0 : row.STOREHOUSE_UPPPER ?? 0;
      const lower = Number(row.STOREHOUSE_LOWER) < 0 ? 0 : row.STOREHOUSE_LOWER ?? 0;
      this.limitForm = {
        id: row.VARIETIE_CODE,
        upper: upper ?? 0,
        lower: lower ?? 0
      };
      this.limitVisible = true;
    },
    async saveLimit() {
      this.limitSaving = true;
      try {
        const res = await upVarCdesz(
          this.limitForm.id,
          this.limitForm.lower,
          this.limitForm.upper,
          this.filters.STORAGE_ID
        );
        this.$message.success(res.msg || '操作成功');
        this.limitVisible = false;
        this.reloadMain();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.limitSaving = false;
      }
    },
    async openPlanRemarkDialog(row) {
      this.planRemarkNo = row.Stock_Up_Plan_No;
      this.planRemarkTitle = `${row.Stock_Up_Plan_No} 备注`;
      try {
        const data = await showPlanRemarks(row.Stock_Up_Plan_No);
        this.planRemarkText = data.result?.[0]?.Remarks || '';
        this.planRemarkVisible = true;
      } catch (e) {
        this.$message.error(e.message || '加载备注失败');
      }
    },
    async savePlanRemark() {
      this.planRemarkSaving = true;
      try {
        const data = await updatePlanRemarks(this.planRemarkNo, this.planRemarkText);
        if (data.code == 200 || data.code === '200') {
          this.$message.success('成功');
          this.planRemarkVisible = false;
        } else if (data.code == 301) {
          this.$message.error('登录超时，请重新登录');
        } else {
          this.$message.error(data.msg || '保存失败');
        }
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.planRemarkSaving = false;
      }
    },
    async handleDeleteDetails() {
      if (!this.detailSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await MessageBox.confirm('确定要删除选中的数据吗?', '提示', { type: 'warning' });
        await deletePickingDetails(this.detailSelection.map((r) => r.ID));
        this.$message.success('删除成功');
        this.reloadDetail();
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '删除失败');
        }
      }
    },
    async onImportRemark({ file }) {
      this.importRemarkLoading = true;
      try {
        const res = await importBhInfoRemark(file);
        this.$message.success(res.msg || res.Msg || '导入完成');
        this.reloadMain();
      } catch (e) {
        this.$message.error(e.message || '导入失败');
      } finally {
        this.importRemarkLoading = false;
      }
    },
    async onImportBh({ file }) {
      this.importBhLoading = true;
      try {
        const res = await importBhInfo(file);
        this.$message.success(res.msg || res.Msg || '导入完成');
        this.reloadMain();
      } catch (e) {
        this.$message.error(e.message || '导入失败');
      } finally {
        this.importBhLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.bh-info-page {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bottom-row {
  margin-top: 0;
}
</style>
