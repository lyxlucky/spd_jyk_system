<template>
  <div class="bulk-return-tab">
    <div class="section-title">中心库散货品种库存列表</div>
    <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="filters.supplier"
          placeholder="供应商名称"
          clearable
          style="width: 150px"
          @keyup.enter.native="reloadInventory"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filters.varietie"
          placeholder="品种编码、品种名称"
          clearable
          style="width: 200px"
          @keyup.enter.native="reloadInventory"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="filters.region"
          style="width: 100px"
          :disabled="!hp.enableLossRegion"
          @change="onFilterChange"
        >
          <el-option label="合格区" value="0" />
          <el-option label="盘损区" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="filters.storageId"
          placeholder="院区"
          clearable
          style="width: 120px"
          @change="onFilterChange"
        >
          <el-option
            v-for="item in storageList"
            :key="item.ID"
            :label="item.NAME"
            :value="String(item.ID)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadInventory">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="local-toolbar">
      <div class="spd-toolbar__btns">
        <el-button size="mini" type="primary" :disabled="!inventorySelection.length" @click="openCreateDialog">
          创建并生成退购单
        </el-button>
        <el-button size="mini" :disabled="!canAddToOrder" @click="handleAddToOrder">
          添加至已选退购单
        </el-button>
      </div>
    </div>
    <div class="tip-red">
      注意：退购单分为2种，合格区库存的普通退购单和盘损隔离区库存的盘损退购单。（盘损退购单系统扣减库存，但退购数据不会发送给供应商）
    </div>
    <ele-pro-table
      ref="inventoryTable"
      size="mini"
      height="340px"
      :columns="inventoryColumns"
      :datasource="inventoryDatasource"
      :selection.sync="inventorySelection"
      :row-class-name="inventoryRowClass"
      cache-key="buyBackInventoryTable"
    >
      <template v-slot:returnQty="{ row }">
        <el-input-number
          v-model="row._returnQty"
          :min="0"
          :max="Number(row.UP_SHELF_QUANTITY) || 0"
          :disabled="String(row.UP_SHELF_STATE) === '8'"
          size="mini"
          controls-position="right"
          style="width: 90px"
        />
      </template>
    </ele-pro-table>

    <el-row :gutter="10" style="margin-top: 12px">
      <el-col :span="9">
        <div class="section-title">散货退购单号列表</div>
        <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="orderFilters.condition"
              placeholder="散货退购单号、退购人、品种编码"
              clearable
              style="width: 210px"
              @keyup.enter.native="reloadOrders"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="orderFilters.state" placeholder="状态" clearable style="width: 100px" @change="reloadOrders">
              <el-option label="全部" value="" />
              <el-option label="待退购" value="0" />
              <el-option label="已退购" value="1" />
              <el-option label="已发送" value="2" />
              <el-option label="已查看" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="orderFilters.isHaveGoods" placeholder="是否实物" clearable style="width: 110px" @change="reloadOrders">
              <el-option label="是否实物" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="orderFilters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 240px"
              @change="reloadOrders"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadOrders">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="local-toolbar spd-toolbar">
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button size="mini" :disabled="!selectedOrder" @click="handlePrint">打印</el-button>
              <el-button
                v-if="hp.useB2bFlow"
                size="mini"
                type="primary"
                :disabled="!actionFlags.canSend"
                @click="handleSend"
              >
                发送
              </el-button>
              <el-button
                v-if="hp.useB2bFlow"
                size="mini"
                type="primary"
                :disabled="!actionFlags.canGetGoods"
                @click="handleGetGoods"
              >
                确认提货
              </el-button>
              <el-button
                v-if="!hp.useB2bFlow"
                size="mini"
                type="primary"
                :disabled="!actionFlags.canConfirm"
                @click="handleConfirm"
              >
                确认退购
              </el-button>
            </div>
          </div>
        </div>
        <ele-pro-table
          ref="orderTable"
          size="mini"
          height="340px"
          highlight-current-row
          :columns="orderColumns"
          :datasource="orderDatasource"
          cache-key="buyBackOrderTable"
          @row-click="onOrderClick"
        >
          <template v-slot:remarkBtn="{ row }">
            <el-button type="primary" size="mini" @click.stop="openRemark(row)">备注</el-button>
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="15">
        <div class="section-title">
          散货退购明细
          <span class="tip-inline">*同一张退购单请确保供应商一致。同一张退购单不允许同时包含合格区和盘损隔离区的库存</span>
        </div>
        <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="detailFilters.str"
              placeholder="品种编码、品种名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="reloadDetails"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadDetails">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="local-toolbar spd-toolbar">
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button v-permission="'export-BuyBack-tgdc'" size="mini" @click="handleExport">
                导出excel
              </el-button>
            </div>
          </div>
          <div class="spd-toolbar__divider" />
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button
                type="danger"
                size="mini"
                :disabled="!actionFlags.canDeleteDetail || !selectedDetail"
                @click="handleDeleteDetail"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="390px"
          highlight-current-row
          :columns="detailColumns"
          :datasource="detailDatasource"
          cache-key="buyBackDetailTable"
          @row-click="onDetailClick"
        />
      </el-col>
    </el-row>

    <CreateReturnDialog
      :visible.sync="createVisible"
      :loading="createLoading"
      @submit="handleCreateSubmit"
    />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :return-number="remarkReturnNumber"
      @submit="handleRemarkSubmit"
    />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import {
  getStorageList,
  getGoodsList,
  searchGoodsReturnList,
  getGoodsReturnDtlList,
  creatReturnList,
  addReturnList,
  delGoodsReturnInfo,
  delGoodsLockInfo,
  returnGoodsExcel,
  upGoodsNumBz,
  upGoodsNumState,
  inB2bGoodsReturn,
  upB2bGoodsReturn
} from '@/api/Task/BuyBack';
import CreateReturnDialog from './CreateReturnDialog.vue';
import RemarkDialog from './RemarkDialog.vue';
import {
  buyBackHpFlags,
  unwrapData,
  isOkCode,
  formatDate10,
  formatShelfRegion,
  formatReturnRegion,
  formatReturnState,
  isNearExpiry,
  openExcelFile,
  getOrderActionFlags,
  regionSelectToApi,
  matchRegionForAdd,
  buildCreateItems,
  validateCreateItems,
  getB2bHospitalCode
} from '../utils';

export default {
  name: 'BulkReturnTab',
  components: { CreateReturnDialog, RemarkDialog },
  data() {
    return {
      hp: buyBackHpFlags,
      storageList: [],
      inventorySelection: [],
      selectedOrder: null,
      selectedDetail: null,
      createVisible: false,
      createLoading: false,
      remarkVisible: false,
      remarkReturnNumber: '',
      filters: {
        supplier: '',
        varietie: '',
        region: '0',
        storageId: '',
        field: '',
        order: ''
      },
      orderFilters: {
        condition: '',
        state: '',
        isHaveGoods: '',
        dateRange: []
      },
      detailFilters: { str: '' },
      inventoryColumns: [
        { type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { prop: 'STORAGE_NAME', label: '所属库房', width: 100 },
        { prop: 'VARIETIE_CODE', label: '品种编码', width: 120, sortable: 'custom' },
        { prop: 'VARIETIE_NAME', label: '品种全称', minWidth: 160 },
        { prop: 'SPECIFICATION_OR_TYPE', label: '型号/规格', minWidth: 120 },
        { prop: 'UNIT', label: '单位', width: 60, align: 'center' },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', minWidth: 130 },
        { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 120 },
        { prop: 'SUPPLY_PRICE', label: '结算价', width: 80, align: 'right' },
        { prop: 'BATCH', label: '生产批号', width: 90, sortable: 'custom' },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          width: 90,
          formatter: (row) => formatDate10(row.BATCH_PRODUCTION_DATE)
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          width: 90,
          formatter: (row) => formatDate10(row.BATCH_VALIDITY_PERIOD)
        },
        {
          prop: 'UP_SHELF_STATE',
          label: '所属库区',
          width: 90,
          formatter: (row) => formatShelfRegion(row.UP_SHELF_STATE)
        },
        { prop: 'UP_SHELF_QUANTITY', label: '可退购数量', width: 120, align: 'center' },
        {
          columnKey: 'returnQty',
          label: '退购数量',
          width: 110,
          align: 'center',
          slot: 'returnQty'
        }
      ],
      orderColumns: [
        { prop: 'RETURN_NUMBER', label: '散货退购单号', minWidth: 150, sortable: 'custom' },
        { prop: 'STORAGE_NAME', label: '院区库房', width: 100 },
        { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 100 },
        { prop: 'OPERATOR', label: '退购人', width: 80 },
        {
          prop: 'REGION',
          label: '退购类型',
          width: 100,
          formatter: (row) => formatReturnRegion(row.REGION)
        },
        {
          prop: 'IS_HAVE_GOODS',
          label: '是否实物',
          width: 100,
          formatter: (row) => (String(row.IS_HAVE_GOODS) === '0' ? '否' : '是')
        },
        {
          prop: 'STATE',
          label: '状态',
          width: 70,
          formatter: (row) => formatReturnState(row.STATE)
        },
        {
          columnKey: 'remarkBtn',
          label: '备注',
          width: 70,
          align: 'center',
          slot: 'remarkBtn'
        },
        { prop: 'BZ', label: '备注', minWidth: 100 },
        { prop: 'RETURN_TIME', label: '退购时间', width: 140 }
      ],
      detailColumns: [
        { prop: 'STORAGE_NAME', label: '所属库房', width: 100 },
        { prop: 'VARIETIE_CODE', label: '品种编码', width: 90 },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140 },
        { prop: 'SPECIFICATION_OR_TYPE', label: '型号/规格', minWidth: 120 },
        { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', width: 150 },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', width: 150 },
        { prop: 'SUPPLY_PRICE', label: '结算价', width: 70, align: 'right' },
        { prop: 'BATCH', label: '生产批号', width: 100 },
        { prop: 'RETURN_QTY', label: '退购数量', width: 100, align: 'center' },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          width: 90,
          formatter: (row) => formatDate10(row.BATCH_PRODUCTION_DATE)
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          width: 90,
          formatter: (row) => formatDate10(row.BATCH_VALIDITY_PERIOD)
        }
      ]
    };
  },
  computed: {
    actionFlags() {
      const stateText = this.selectedOrder
        ? formatReturnState(this.selectedOrder.STATE)
        : '';
      return getOrderActionFlags(stateText);
    },
    canAddToOrder() {
      return (
        this.actionFlags.canAdd &&
        this.inventorySelection.length > 0 &&
        this.selectedOrder
      );
    }
  },
  mounted() {
    this.loadStorage();
  },
  methods: {
    loadStorage() {
      getStorageList().then((res) => {
        const data = unwrapData(res);
        this.storageList = data?.result || [];
        if (this.storageList.length && !this.filters.storageId) {
          this.filters.storageId = String(this.storageList[0].ID);
        }
      });
    },
    onFilterChange() {
      this.reloadInventory();
      this.reloadOrders();
    },
    inventoryRowClass({ row }) {
      return isNearExpiry(row.BATCH_VALIDITY_PERIOD) ? 'near-expiry-row' : '';
    },
    normalizeInventoryRows(list) {
      return (list || []).map((row) => ({
        ...row,
        _returnQty:
          String(row.UP_SHELF_STATE) === '8'
            ? Number(row.UP_SHELF_QUANTITY) || 0
            : Number(row._returnQty ?? 0)
      }));
    },
    inventoryDatasource({ page, limit, order }) {
      if (order?.sort) {
        this.filters.field = order.sort;
        this.filters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getGoodsList({
        page,
        limit,
        where: {
          Storage: this.filters.storageId,
          SearchSupplier: this.filters.supplier,
          strSearch: this.filters.varietie,
          region: this.filters.region,
          field: this.filters.field,
          order: this.filters.order
        }
      }).then((res) => {
        const data = unwrapData(res);
        const list = this.normalizeInventoryRows(data.result || []);
        return { count: data.total || 0, list };
      });
    },
    orderDatasource({ page, limit }) {
      const [dateFrom, dateTo] = this.orderFilters.dateRange || ['', ''];
      return searchGoodsReturnList({
        page,
        limit,
        where: {
          condition: this.orderFilters.condition,
          state: this.orderFilters.state,
          isHaveGoods: this.orderFilters.isHaveGoods,
          dateFrom: dateFrom || '',
          dateTo: dateTo || '',
          STORAGE_ID: this.filters.storageId
        }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    detailDatasource({ page, limit }) {
      if (!this.selectedOrder?.RETURN_NUMBER) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getGoodsReturnDtlList({
        page,
        limit,
        where: {
          RETURN_NUMBER: this.selectedOrder.RETURN_NUMBER,
          str: this.detailFilters.str
        }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    reloadInventory() {
      this.$refs.inventoryTable?.reload({ page: 1 });
    },
    reloadOrders() {
      this.selectedOrder = null;
      this.selectedDetail = null;
      this.$refs.orderTable?.reload({ page: 1 });
      this.reloadDetails();
    },
    reloadDetails() {
      this.selectedDetail = null;
      this.$refs.detailTable?.reload({ page: 1 });
    },
    onOrderClick(row) {
      this.selectedOrder = row;
      this.reloadDetails();
    },
    onDetailClick(row) {
      this.selectedDetail = row;
    },
    openCreateDialog() {
      const msg = validateCreateItems(this.inventorySelection);
      if (msg) {
        this.$message.warning(msg.replace('创建失败', '创建失败'));
        return;
      }
      this.createVisible = true;
    },
    handleCreateSubmit(form) {
      const msg = validateCreateItems(this.inventorySelection);
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      this.createLoading = true;
      const json = JSON.stringify(buildCreateItems(this.inventorySelection));
      creatReturnList(json, regionSelectToApi(this.filters.region), form.remark, form.isHaveGoods)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '创建成功');
            this.createVisible = false;
            this.reloadInventory();
            this.reloadOrders();
          } else if (data?.code === 301 || data?.code === '301') {
            this.$message.error('登录失效，请重新登录');
          } else {
            this.$message.error(data?.msg || '创建失败');
          }
        })
        .finally(() => {
          this.createLoading = false;
        });
    },
    handleAddToOrder() {
      if (!this.selectedOrder) {
        this.$message.warning('请选择退购单');
        return;
      }
      const orderRegion = formatReturnRegion(this.selectedOrder.REGION);
      if (!matchRegionForAdd(this.filters.region, orderRegion)) {
        this.$message.warning('添加失败，退购单类型不匹配');
        return;
      }
      const msg = validateCreateItems(this.inventorySelection);
      if (msg) {
        this.$message.warning(msg.replace('创建失败', '添加失败'));
        return;
      }
      const loading = this.$loading({ lock: true, text: '添加中...' });
      const json = JSON.stringify(buildCreateItems(this.inventorySelection));
      addReturnList(json, this.selectedOrder.ID)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success('添加成功');
            this.reloadInventory();
            this.reloadOrders();
          } else {
            this.$message.error(data?.msg || '添加失败');
          }
        })
        .finally(() => loading.close());
    },
    handlePrint() {
      if (!this.selectedOrder?.RETURN_NUMBER) {
        this.$message.warning('请选择单号');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      returnGoodsExcel(
        this.selectedOrder.RETURN_NUMBER,
        this.selectedOrder.RETURN_TIME
      )
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            openExcelFile(data.msg);
          } else {
            this.$message.error(data?.msg || '打印失败');
          }
        })
        .finally(() => loading.close());
    },
    handleConfirm() {
      if (!this.selectedOrder?.ID) return;
      this.$confirm(`单号[${this.selectedOrder.RETURN_NUMBER}]确认退购吗?`, '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({ lock: true, text: '处理中...' });
        delGoodsLockInfo(this.selectedOrder.ID)
          .then((res) => {
            const data = unwrapData(res);
            if (isOkCode(data?.code) && data.result) {
              this.$message.success(data.msg || '操作成功');
              this.reloadOrders();
            } else if (data?.code === 301 || data?.code === '301') {
              this.$message.error('登录失效，请重新登录');
            } else {
              this.$message.error(data?.msg || '操作失败');
            }
          })
          .finally(() => loading.close());
      });
    },
    handleSend() {
      const order = this.selectedOrder;
      if (!order?.ID) return;
      this.$confirm(`单号[${order.RETURN_NUMBER}]确认发送吗?`, '提示', { type: 'warning' }).then(
        () => {
          const hospital = getB2bHospitalCode();
          const payload = JSON.stringify([
            {
              ID: order.ID,
              RETURN_NUMBER: order.RETURN_NUMBER,
              OPERATOR: this.$store.state.user.info?.Nickname || '',
              STATE: 2,
              RETURN_TIME: order.RETURN_TIME,
              STATE_TIME: order.STATE_TIME,
              SUPPLIER_CODE: order.SUPPLIER_CODE,
              SPD_HOSPITAL_ID: hospital
            }
          ]);
          const loading = this.$loading({ lock: true, text: '发送中...' });
          inB2bGoodsReturn(payload)
            .then((res) => {
              const data = unwrapData(res);
              if (data === 200 || data === '200') {
                return upGoodsNumState('2', order.RETURN_NUMBER, order.SUPPLIER_CODE).then(
                  (r) => {
                    const d = unwrapData(r);
                    if (isOkCode(d?.code)) {
                      this.$message.success('发送成功');
                      this.reloadOrders();
                    } else if (d?.code === 301 || d?.code === '301') {
                      this.$message.error('登录失效，请重新登录');
                    } else {
                      this.$message.error(d?.msg || 'SPD更新退购单失败，请联系管理员');
                    }
                  }
                );
              }
              this.$message.error(`B2B信息返回：${data}`);
            })
            .finally(() => loading.close());
        }
      );
    },
    handleGetGoods() {
      const order = this.selectedOrder;
      if (!order?.ID) return;
      this.$confirm(`单号[${order.RETURN_NUMBER}]确认提货吗?`, '提示', { type: 'warning' }).then(
        () => {
          const hospital = getB2bHospitalCode();
          const loading = this.$loading({ lock: true, text: '处理中...' });
          upB2bGoodsReturn('1', order.RETURN_NUMBER, order.SUPPLIER_CODE, hospital)
            .then((res) => {
              const data = unwrapData(res);
              if (data === 200 || data === '200') {
                return delGoodsLockInfo(order.ID).then((r) => {
                  const d = unwrapData(r);
                  if (isOkCode(d?.code) && d.result) {
                    this.$message.success(d.msg || '操作成功');
                    this.reloadOrders();
                  } else {
                    this.$message.error(d?.msg || '操作失败');
                  }
                });
              }
              this.$message.error(`B2B返回：${data}`);
            })
            .finally(() => loading.close());
        }
      );
    },
    handleDeleteDetail() {
      if (!this.selectedDetail?.ID) {
        this.$message.warning('请选择品种');
        return;
      }
      this.$confirm('确定删除品种吗?', '提示', { type: 'warning' }).then(() => {
        delGoodsReturnInfo(this.selectedDetail.ID).then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code) || data?.msg) {
            this.$message.success('删除成功');
            this.reloadInventory();
            this.reloadDetails();
          }
        });
      });
    },
    openRemark(row) {
      this.remarkReturnNumber = row.RETURN_NUMBER;
      this.remarkVisible = true;
    },
    handleRemarkSubmit(remark) {
      upGoodsNumBz(this.remarkReturnNumber, remark).then((res) => {
        const data = unwrapData(res);
        if (isOkCode(data?.code)) {
          this.$message.success('保存成功');
          this.remarkVisible = false;
          this.reloadOrders();
        } else {
          this.$message.error(data?.msg || '保存失败');
        }
      });
    },
    async handleExport() {
      if (!this.selectedOrder?.RETURN_NUMBER) {
        this.$message.warning('请先在左侧选择退购单号');
        return;
      }
      const loading = this.$loading({ lock: true, text: '导出中...' });
      try {
        const res = await getGoodsReturnDtlList({
          page: 1,
          limit: 999999,
          where: {
            RETURN_NUMBER: this.selectedOrder.RETURN_NUMBER,
            str: this.detailFilters.str
          }
        });
        const data = unwrapData(res);
        const rows = (data.result || []).map((item) => [
          item.STORAGE_NAME,
          item.VARIETIE_CODE,
          item.VARIETIE_NAME,
          item.SPECIFICATION_OR_TYPE,
          item.UNIT,
          item.MANUFACTURING_ENT_NAME,
          item.SUPPLIER_NAME,
          item.SUPPLY_PRICE,
          item.BATCH,
          item.RETURN_QTY,
          formatDate10(item.BATCH_PRODUCTION_DATE),
          formatDate10(item.BATCH_VALIDITY_PERIOD)
        ]);
        const sheet = utils.aoa_to_sheet([
          [
            '所属库房',
            '品种编码',
            '品种名称',
            '型号/规格',
            '单位',
            '生产企业名称',
            '供应商名称',
            '结算价',
            '生产批号',
            '退购数量',
            '生产日期',
            '有效到期'
          ],
          ...rows
        ]);
        writeFile({ SheetNames: ['退购'], Sheets: { 退购: sheet } }, '退购管理.xlsx');
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bulk-return-tab {
  .section-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  .tip-red {
    color: #f56c6c;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .tip-inline {
    margin-left: 12px;
    color: #f56c6c;
    font-size: 12px;
    font-weight: normal;
  }
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
    gap: 4px;
  }
  .local-toolbar {
    margin-bottom: 8px;
  }
  .local-toolbar.spd-toolbar {
    padding: 0;
  }
  .local-toolbar .spd-toolbar__divider {
    min-height: 24px;
    margin: 0 8px;
  }
  :deep(.near-expiry-row) {
    background-color: #fdf6ec !important;
  }
}
</style>
