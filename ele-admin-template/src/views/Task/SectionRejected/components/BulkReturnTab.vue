<template>
  <div class="bulk-return-tab">
    <el-row :gutter="10">
      <el-col :span="3">
        <div class="section-title">选择退货科室</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item style="width: 100%; margin-right: 0">
            <el-input
              v-model="deptFilters.SearchName"
              placeholder="二级科室"
              clearable
              @keyup.enter.native="reloadDepts"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadDepts">查询</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="deptTable"
          size="mini"
          height="300px"
          highlight-current-row
          :columns="deptColumns"
          :datasource="deptDatasource"
          :current.sync="selectedDept"
          cache-key="sectionRejectedBulkDeptTable"
          @current-change="onDeptChange"
        >
          <template v-slot:isprint="{ row }">
            {{ String(row.isprint) === '1' ? '存在' : '无' }}
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="21">
        <div class="section-title">选配退货品种</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-input v-model="varFilters.SearchVarietie" placeholder="编码/品种全称" clearable style="width: 180px" @keyup.enter.native="reloadVarieties" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="varFilters.SupplierName" placeholder="供应商/申领单号" clearable style="width: 150px" @keyup.enter.native="reloadVarieties" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="varFilters.Batch" placeholder="生产批号" clearable style="width: 120px" @keyup.enter.native="reloadVarieties" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="varFilters.specification_or_type" placeholder="规格型号" clearable style="width: 120px" @keyup.enter.native="reloadVarieties" />
          </el-form-item>
          <el-form-item v-if="hp.showStorageFilter">
            <el-select v-model="varFilters.STORAGE_ID" clearable placeholder="库区" style="width: 120px" @change="reloadVarieties">
              <el-option label="无" value="" />
              <el-option label="院内中心库" value="1" />
              <el-option label="院外中心库" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" :disabled="!selectedDept" @click="reloadVarieties">查询</el-button>
          </el-form-item>
          <el-form-item class="toolbar-right">
            <el-button type="primary" :disabled="!canAddVarieties" @click="handleAddVarieties">添加退货品种</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="varTable"
          size="mini"
          height="300px"
          :init-load="false"
          :columns="varColumns"
          :datasource="varDatasource"
          :selection.sync="varSelection"
          cache-key="sectionRejectedBulkVarTable"
        >
          <template v-slot:storageId="{ row }">{{ formatStorageId(row.Storage_ID) }}</template>
          <template v-slot:consumeType="{ row }">{{ formatConsumptionType(row.Consumption_Type) }}</template>
          <template v-slot:prodDate="{ row }">{{ formatDate10(row.batch_production_date) }}</template>
          <template v-slot:validDate="{ row }">{{ formatDate10(row.batch_validity_period) }}</template>
          <template v-slot:defCode="{ row }">
            {{ row.Def_No_Pkg_Code && row.Def_No_Pkg_Code !== 'null' ? row.Def_No_Pkg_Code : '' }}
          </template>
          <template v-slot:returnQty="{ row }">
            <el-input-number
              v-model="row._returnQty"
              :min="0"
              :max="Number(row.CanReturnSum) || 0"
              size="mini"
              controls-position="right"
              style="width: 90px"
            />
          </template>
        </ele-pro-table>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 12px">
      <el-col :span="6">
        <div class="section-title">散货退货单列表</div>
        <el-form size="mini" class="order-filter-form">
          <el-form-item>
            <el-date-picker
              v-model="orderFilters.dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"
              @change="reloadOrders"
            />
          </el-form-item>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-select v-model="orderFilters.OrderType" clearable placeholder="退货类型" style="width: 100%" @change="reloadOrders">
                <el-option label="全部类型" value="" />
                <el-option label="其他" value="0" />
                <el-option label="跨月退中心库" value="-1" />
                <el-option label="跨月退供应商" value="-2" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="orderFilters.IsHaveGoods" clearable placeholder="是否含实物" style="width: 100%" @change="reloadOrders">
                <el-option label="是否含实物" value="" />
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="6" style="margin-top: 6px">
            <el-col :span="14">
              <el-input v-model="orderFilters.SearchName" placeholder="单号" clearable @keyup.enter.native="reloadOrders">
                <el-button slot="append" icon="el-icon-search" @click="reloadOrders" />
              </el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="orderFilters.printCount" placeholder="每页打印条数" clearable />
            </el-col>
          </el-row>
        </el-form>
        <div class="order-actions">
          <el-button size="mini" type="primary" :disabled="!selectedDept" @click="createVisible = true">创建退货单</el-button>
          <el-button size="mini" type="success" :disabled="!canConfirmOrder" @click="handleConfirmOrder">确认退货</el-button>
          <el-button size="mini" :disabled="!canPrintOrder" @click="handlePrintOrder">打印退货单</el-button>
          <el-button size="mini" type="danger" :disabled="!canDeleteOrder" @click="handleDeleteOrder">删除退货单</el-button>
        </div>
        <ele-pro-table
          ref="orderTable"
          size="mini"
          height="240px"
          highlight-current-row
          :init-load="false"
          :columns="orderColumns"
          :datasource="orderDatasource"
          :current.sync="selectedOrder"
          cache-key="sectionRejectedBulkOrderTable"
          @current-change="onOrderChange"
        >
          <template v-slot:orderType="{ row }">{{ formatOrderType(row.Order_Type) }}</template>
          <template v-slot:operateState="{ row }">{{ formatBulkOperateState(row.Operate_State) }}</template>
          <template v-slot:operateTime="{ row }">{{ formatDateTime(row.Operate_Time) }}</template>
          <template v-slot:isHaveGoods="{ row }">{{ String(row.IS_HAVE_GOODS) === '0' ? '否' : '是' }}</template>
          <template v-slot:remark="{ row }">
            <el-link type="primary" :underline="false" @click.stop="openRemark(row)">{{ row.REMARK || '无' }}</el-link>
          </template>
          <template v-slot:spdState="{ row }">{{ String(row.SPD_APP_STATE) === '1' ? '已提交' : '未提交' }}</template>
          <template v-slot:spdTime="{ row }">{{ formatDateTime(row.SPD_APP_TIME) }}</template>
          <template v-slot:auditAction="{ row }">
            <el-button
              v-if="String(row.SPD_APP_STATE) !== '1'"
              type="text"
              size="mini"
              @click.stop="handleSubmitAudit(row)"
            >
              提交审核
            </el-button>
            <span v-else style="color: #999">已提交</span>
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="18">
        <div class="section-title">退货品种明细</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-input
              v-model="detailFilters.SearchName"
              placeholder="品种(材料)编码/品种全称"
              clearable
              style="width: 240px"
              @keyup.enter.native="reloadDetails"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" :disabled="!selectedOrder" @click="reloadDetails">查询</el-button>
          </el-form-item>
          <el-form-item class="toolbar-right">
            <el-button type="danger" :disabled="!canDeleteDetail" @click="handleDeleteDetails">删除品种</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="380px"
          :init-load="false"
          :page-size="99999"
          :page-sizes="[99999]"
          :columns="detailColumns"
          :datasource="detailDatasource"
          :selection.sync="detailSelection"
          cache-key="sectionRejectedBulkDetailTable"
        >
          <template v-slot:storageId="{ row }">{{ formatStorageId(row.Storage_ID) }}</template>
          <template v-slot:prodDate="{ row }">{{ formatDate10(row.batch_production_date) }}</template>
          <template v-slot:validDate="{ row }">{{ formatDate10(row.batch_validity_period) }}</template>
          <template v-slot:defCode="{ row }">
            {{ row.Def_No_Pkg_Code && row.Def_No_Pkg_Code !== 'null' ? row.Def_No_Pkg_Code : '' }}
          </template>
          <template v-slot:consumeType="{ row }">{{ formatConsumptionType(row.Consumption_Type) }}</template>
        </ele-pro-table>
      </el-col>
    </el-row>

    <CreateBulkReturnOrderDialog
      :visible.sync="createVisible"
      :loading="createLoading"
      @submit="handleCreateOrder"
    />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :title="remarkTitle"
      :remark="remarkText"
      :loading="remarkLoading"
      @submit="handleRemarkSubmit"
    />
  </div>
</template>

<script>
import {
  getTwoDeptList,
  getReturnGoodsList,
  getVarietieList,
  getVarietieDetailList,
  insertVarietie,
  createReturnGoodsOrder,
  updateReturn,
  deleteReturnGoodsOrder,
  submitReturnGoodsAudit,
  deleteVarieties,
  createReturnExcel,
  updateReturningGoods2Bz,
  nickname
} from '@/api/Task/SectionRejected';
import RemarkDialog from './RemarkDialog.vue';
import CreateBulkReturnOrderDialog from './CreateBulkReturnOrderDialog.vue';
import {
  sectionRejectedHpFlags,
  unwrapData,
  isOkCode,
  formatDate10,
  formatDateTime,
  formatStorageId,
  formatConsumptionType,
  formatOrderType,
  formatBulkOperateState,
  isBulkOrderNew,
  buildInsertVarietieItems,
  validateInsertItems,
  buildConfirmBulkReturnJson,
  getDefaultMonthRange,
  downloadExcelByForm
} from '../utils';

export default {
  name: 'BulkReturnTab',
  components: { RemarkDialog, CreateBulkReturnOrderDialog },
  data() {
    const [start, end] = getDefaultMonthRange();
    return {
      hp: sectionRejectedHpFlags,
      selectedDept: null,
      selectedOrder: null,
      deptFilters: { SearchName: '' },
      varFilters: {
        SearchVarietie: '',
        SupplierName: '',
        Batch: '',
        specification_or_type: '',
        STORAGE_ID: '',
        field: '',
        order: ''
      },
      orderFilters: {
        SearchName: '',
        dateRange: [start, end],
        OrderType: '',
        IsHaveGoods: '',
        printCount: ''
      },
      detailFilters: { SearchName: '', field: '', order: '' },
      varSelection: [],
      detailSelection: [],
      detailRows: [],
      createVisible: false,
      createLoading: false,
      remarkVisible: false,
      remarkLoading: false,
      remarkText: '',
      remarkTitle: '备注',
      remarkTarget: null,
      deptColumns: [
        { prop: 'dept_two_name', label: '二级科室名称', minWidth: 140 },
        { columnKey: 'isprint', label: '未打印单据', width: 150, slot: 'isprint' }
      ],
      varColumns: [
        { type: 'selection', width: 45, align: 'center' },
        { prop: 'CONSUME_TIME', label: '消耗时间', width: 120, align: 'center' },
        { prop: 'MONTHLY_TIME', label: '结算月份', width: 120, align: 'center' },
        { columnKey: 'storageId', label: '院房库区', width: 100, slot: 'storageId' },
        { prop: 'Varietie_Code_New', label: '品种(材料)编码', width: 180, sortable: true },
        { prop: 'varietie_name', label: '品种全称', minWidth: 120 },
        { prop: 'specification_or_type', label: '型号/规格', minWidth: 120 },
        { prop: 'unit', label: '单位', width: 60, align: 'center' },
        { prop: 'manufacturing_ent_name', label: '生产企业名称', minWidth: 160 },
        { prop: 'supplier_name', label: '供应商名称', minWidth: 140, sortable: true },
        { prop: 'Batch', label: '生产批号', width: 120, sortable: true },
        { columnKey: 'prodDate', label: '生产日期', width: 100, slot: 'prodDate' },
        { columnKey: 'validDate', label: '有效到期', width: 100, slot: 'validDate' },
        { prop: 'Coefficient', label: '系数', width: 80, align: 'center', sortable: true },
        { columnKey: 'defCode', label: '定数码', width: 100, slot: 'defCode' },
        { columnKey: 'consumeType', label: '消耗类型', width: 120, slot: 'consumeType' },
        { prop: 'CanReturnSum', label: '可退货数量', width: 120, align: 'center' },
        { prop: 'QUANITY', label: '已退货数量', width: 120, align: 'center' },
        { columnKey: 'returnQty', label: '退货数量', width: 120, slot: 'returnQty' },
        { prop: 'OPERATE_NUMBER', label: '申领单号', width: 120, sortable: true },
        { prop: 'MEDICAL_CODE', label: '医保编码', width: 150, sortable: true }
      ],
      orderColumns: [
        { prop: 'Operate_Number', label: '退货单号', minWidth: 120, sortable: true },
        { columnKey: 'orderType', label: '退货类型', width: 110, slot: 'orderType' },
        { columnKey: 'operateState', label: '退货状态', width: 100, slot: 'operateState' },
        { columnKey: 'operateTime', label: '退单日期', minWidth: 120, slot: 'operateTime' },
        { prop: 'Print_Count', label: '打印次数', width: 100 },
        { columnKey: 'isHaveGoods', label: '是否含实物', width: 120, slot: 'isHaveGoods' },
        { columnKey: 'remark', label: '备注', width: 100, slot: 'remark' },
        { columnKey: 'spdState', label: '提交状态', width: 100, slot: 'spdState' },
        { prop: 'SPD_APP_MAN', label: '提交人', width: 100 },
        { columnKey: 'spdTime', label: '提交时间', width: 120, slot: 'spdTime' },
        { columnKey: 'auditAction', label: '操作', width: 100, slot: 'auditAction' }
      ],
      detailColumns: [
        { type: 'selection', width: 45, align: 'center' },
        { columnKey: 'storageId', label: '库区院房', width: 100, slot: 'storageId' },
        { prop: 'Varietie_Code_New', label: '品种(材料)编码', width: 160, sortable: true },
        { prop: 'varietie_name', label: '品种全称', minWidth: 100 },
        { prop: 'specification_or_type', label: '型号/规格', minWidth: 110 },
        { prop: 'unit', label: '单位', width: 60, align: 'center' },
        { prop: 'manufacturing_ent_name', label: '生产企业名称', minWidth: 140 },
        { prop: 'supplier_name', label: '供应商名称', minWidth: 150, sortable: true },
        { prop: 'Batch', label: '生产批号', width: 120, sortable: true },
        { columnKey: 'prodDate', label: '生产日期', width: 100, slot: 'prodDate' },
        { columnKey: 'validDate', label: '有效到期', width: 100, slot: 'validDate' },
        { prop: 'Coefficient', label: '系数', width: 100, align: 'center', sortable: true },
        { columnKey: 'defCode', label: '定数码', width: 100, slot: 'defCode' },
        { prop: 'supply_price', label: '消耗价', width: 100, sortable: true },
        { columnKey: 'consumeType', label: '消耗类型', width: 110, slot: 'consumeType' },
        { prop: 'ReturnSum', label: '退货数量', width: 120, align: 'center' },
        { prop: 'MEDICAL_CODE', label: '医保编码', width: 120, sortable: true }
      ]
    };
  },
  computed: {
    canAddVarieties() {
      return (
        this.selectedDept &&
        this.selectedOrder &&
        isBulkOrderNew(this.selectedOrder.Operate_State) &&
        this.varSelection.length > 0
      );
    },
    canConfirmOrder() {
      return this.selectedOrder && isBulkOrderNew(this.selectedOrder.Operate_State);
    },
    canPrintOrder() {
      return this.selectedOrder && !isBulkOrderNew(this.selectedOrder.Operate_State);
    },
    canDeleteOrder() {
      return this.selectedOrder && isBulkOrderNew(this.selectedOrder.Operate_State);
    },
    canDeleteDetail() {
      return (
        this.canConfirmOrder &&
        this.detailSelection.length > 0
      );
    }
  },
  methods: {
    formatDate10,
    formatDateTime,
    formatStorageId,
    formatConsumptionType,
    formatOrderType,
    formatBulkOperateState,
    deptDatasource({ page, limit }) {
      return getTwoDeptList({ page, limit, where: this.deptFilters }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    varDatasource({ page, limit, order }) {
      if (!this.selectedDept?.dept_two_code) {
        return Promise.resolve({ count: 0, list: [] });
      }
      if (order?.sort) {
        this.varFilters.field = order.sort;
        this.varFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getVarietieList({
        page,
        limit,
        where: {
          ...this.varFilters,
          DeptTwoCode: this.selectedDept.dept_two_code
        }
      }).then((res) => {
        const data = unwrapData(res);
        const list = (data.result || []).map((row) => ({
          ...row,
          _returnQty: Number(row._returnQty ?? 0)
        }));
        return { count: data.total || 0, list };
      });
    },
    orderDatasource({ page, limit }) {
      if (!this.selectedDept?.dept_two_code) {
        return Promise.resolve({ count: 0, list: [] });
      }
      const [start, end] = this.orderFilters.dateRange || ['', ''];
      return getReturnGoodsList({
        page,
        limit,
        where: {
          SearchName: this.orderFilters.SearchName,
          DeptTwoCode: this.selectedDept.dept_two_code,
          StartTime: start || '',
          EndTime: end || '',
          OrderType: this.orderFilters.OrderType,
          IsHaveGoods: this.orderFilters.IsHaveGoods
        }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    detailDatasource({ page, limit, order }) {
      if (!this.selectedOrder?.ID) {
        this.detailRows = [];
        return Promise.resolve({ count: 0, list: [] });
      }
      if (order?.sort) {
        this.detailFilters.field = order.sort;
        this.detailFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getVarietieDetailList({
        page,
        limit,
        where: {
          ID: this.selectedOrder.ID,
          SearchName: this.detailFilters.SearchName,
          field: this.detailFilters.field,
          order: this.detailFilters.order
        }
      }).then((res) => {
        const data = unwrapData(res);
        this.detailRows = data.result || [];
        return { count: data.total || 0, list: this.detailRows };
      });
    },
    reloadDepts() {
      this.selectedDept = null;
      this.$refs.deptTable?.reload({ page: 1 });
      this.onDeptChange();
    },
    reloadVarieties() {
      this.varSelection = [];
      this.$refs.varTable?.reload({ page: 1 });
    },
    reloadOrders() {
      this.selectedOrder = null;
      this.$refs.orderTable?.reload({ page: 1 });
      this.reloadDetails();
    },
    reloadDetails() {
      this.detailSelection = [];
      this.$refs.detailTable?.reload({ page: 1 });
    },
    onDeptChange() {
      this.selectedOrder = null;
      this.reloadVarieties();
      this.reloadOrders();
    },
    onOrderChange() {
      this.reloadDetails();
    },
    handleAddVarieties() {
      const msg = validateInsertItems(this.varSelection);
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      const loading = this.$loading({ lock: true });
      const json = JSON.stringify(
        buildInsertVarietieItems(
          this.varSelection,
          this.selectedDept.dept_two_code,
          this.selectedOrder.ID,
          this.selectedOrder.Operate_Number
        )
      );
      insertVarietie(this.selectedDept.dept_two_code, json)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '添加成功');
            this.reloadVarieties();
            this.reloadDetails();
          } else if (data?.code === 301 || data?.code === '301') {
            this.$message.error(data.msg || '登录失效');
          } else {
            this.$message.error(data?.msg || '添加失败');
          }
        })
        .finally(() => loading.close());
    },
    handleCreateOrder(form) {
      if (!this.selectedDept?.dept_two_code) {
        this.$message.warning('请选择退货科室');
        return;
      }
      this.createLoading = true;
      createReturnGoodsOrder({
        deptTwoCode: this.selectedDept.dept_two_code,
        ...form
      })
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success('创建成功');
            this.createVisible = false;
            this.reloadOrders();
          } else {
            this.$message.error(data?.msg || '创建失败');
          }
        })
        .finally(() => {
          this.createLoading = false;
        });
    },
    handleConfirmOrder() {
      if (!this.selectedOrder?.ID) {
        this.$message.warning('请选择记录');
        return;
      }
      this.$confirm('确认退货么？', '提示', { type: 'warning' })
        .then(() => {
          const loading = this.$loading({ lock: true });
          return getVarietieDetailList({
            page: 1,
            limit: 99999,
            where: {
              ID: this.selectedOrder.ID,
              SearchName: this.detailFilters.SearchName
            }
          })
            .then((res) => {
              const data = unwrapData(res);
              const rows = data.result || [];
              if (!rows.length) {
                this.$message.warning('该单无明细,退货失败');
                return;
              }
              const json = JSON.stringify(
                buildConfirmBulkReturnJson(
                  rows,
                  this.selectedOrder.ID,
                  this.selectedDept.dept_two_code,
                  nickname()
                )
              );
              return updateReturn(json).then((res2) => {
                const result = unwrapData(res2);
                if (isOkCode(result?.code)) {
                  this.$message.success(result.msg || '确认成功');
                  this.selectedOrder = null;
                  this.reloadVarieties();
                  this.reloadOrders();
                } else {
                  this.$message.error(result?.msg || '确认失败');
                }
              });
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handleDeleteOrder() {
      if (!this.selectedOrder?.ID) {
        this.$message.warning('请选择记录');
        return;
      }
      this.$confirm('确认删除当前退货单吗？', '提示', { type: 'warning' })
        .then(() => {
          const loading = this.$loading({ lock: true });
          return deleteReturnGoodsOrder(this.selectedOrder.ID)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '删除成功');
                this.selectedOrder = null;
                this.reloadVarieties();
                this.reloadOrders();
              } else {
                this.$message.error(data?.msg || '删除失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handlePrintOrder() {
      if (!this.selectedOrder?.Operate_Number) {
        this.$message.warning('请先选中退货单号');
        return;
      }
      const loading = this.$loading({ lock: true, text: '正在生成...' });
      createReturnExcel({
        id: this.selectedOrder.ID,
        operateNumber: this.selectedOrder.Operate_Number,
        deptName: this.selectedDept?.dept_two_name || '',
        printCount: this.orderFilters.printCount
      })
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code) && data.msg) {
            downloadExcelByForm(data.msg);
          } else {
            this.$message.error(data?.msg || '打印失败');
          }
        })
        .finally(() => loading.close());
    },
    handleSubmitAudit(row) {
      if (String(row.SPD_APP_STATE) === '1') {
        this.$message.warning('该退货单已提交审核');
        return;
      }
      this.$confirm('确认提交审核吗？', '提示', { type: 'warning' })
        .then(() => {
          const loading = this.$loading({ lock: true });
          return submitReturnGoodsAudit(row.ID)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '提交成功');
                this.reloadOrders();
              } else {
                this.$message.error(data?.msg || '提交失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handleDeleteDetails() {
      const ids = this.detailSelection.map((row) => row.ID);
      if (!ids.length) {
        this.$message.warning('请勾选记录');
        return;
      }
      const loading = this.$loading({ lock: true });
      deleteVarieties(JSON.stringify(ids))
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success('删除成功');
            this.reloadDetails();
          } else if (data?.code === 301 || data?.code === '301') {
            this.$message.error('登录失效，请重新登录');
          } else {
            this.$message.error(data?.msg || '删除失败');
          }
        })
        .finally(() => loading.close());
    },
    openRemark(row) {
      this.remarkTarget = row;
      this.remarkText = row.REMARK || '';
      this.remarkTitle = `${row.Operate_Number || ''} 备注`;
      this.remarkVisible = true;
    },
    handleRemarkSubmit(remark) {
      if (!this.remarkTarget) return;
      this.remarkLoading = true;
      updateReturningGoods2Bz(this.remarkTarget.ID, remark)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '保存成功');
            this.remarkVisible = false;
            this.reloadOrders();
          } else if (data?.code === 301 || data?.code === '301') {
            this.$message.error('登录失效，请重新登录');
          } else {
            this.$message.error(data?.msg || '保存失败');
          }
        })
        .finally(() => {
          this.remarkLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.section-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.toolbar {
  margin-bottom: 4px;
}
.toolbar-right {
  float: right;
}
.order-filter-form {
  margin-bottom: 8px;
  :deep(.el-form-item) {
    margin-bottom: 6px;
  }
}
.order-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
</style>
