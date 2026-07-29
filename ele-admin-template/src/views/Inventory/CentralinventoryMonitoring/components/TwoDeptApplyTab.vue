<template>
  <div class="two-dept-apply-tab">
    <el-row :gutter="8" class="main-row">
      <el-col :span="5">
        <div class="panel-title">选择申领科室</div>
        <el-form size="mini" inline class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="deptSearch"
              clearable
              placeholder="二级科室名称"
              style="width: 100%"
              @keyup.enter.native="reloadDept"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="deptStorageId"
              clearable
              placeholder="院区"
              style="width: 100%"
              @change="onDeptStorageChange"
            >
              <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadDept">查询</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="deptTable"
          size="mini"
          height="300px"
          highlight-current-row
          :toolkit="[]"
          :need-page="false"
          :columns="deptColumns"
          :datasource="deptDatasource"
          :page-size="9999"
          cache-key="twoDeptApplyDeptTable"
          @row-click="onDeptRowClick"
        >
          <template v-slot:isPrint="{ row }">{{ formatDeptIsPrint(row.isprint) }}</template>
        </ele-pro-table>
      </el-col>
      <el-col :span="19">
        <div class="panel-title">选配申领品种</div>
        <el-form size="mini" inline class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="varietyFilters.searchName"
              clearable
              placeholder="品种编码或名称"
              style="width: 140px"
              @keyup.enter.native="reloadVariety"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="varietyFilters.delNum"
              clearable
              placeholder="收货单号"
              style="width: 120px"
              @keyup.enter.native="reloadVariety"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="varietyFilters.supplier_name"
              clearable
              placeholder="供应商/生产企业"
              style="width: 160px"
              @keyup.enter.native="reloadVariety"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="varietyFilters.specification"
              clearable
              placeholder="规格型号"
              style="width: 110px"
              @keyup.enter.native="reloadVariety"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="varietyFilters.batch"
              clearable
              placeholder="批号"
              style="width: 90px"
              @keyup.enter.native="reloadVariety"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="varietyStorageId"
              placeholder="申领库区"
              style="width: 120px"
              @change="reloadVariety"
            >
              <el-option v-for="item in storageList" :key="'v-' + item.ID" :label="item.NAME" :value="String(item.ID)" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              :disabled="!deptTwoCode || !varietyStorageId"
              @click="reloadVariety"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <div class="local-toolbar">
          <div class="spd-toolbar__btns">
            <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="!canAddVariety" :loading="inserting" @click="onInsertVariety">
              添加申领品种
            </el-button>
          </div>
        </div>
        <ele-pro-table
          ref="varietyTable"
          size="mini"
          height="300px"
          :stripe="true"
          :toolkit="[]"
          :init-load="false"
          :page-size="varietyPageSize"
          :page-sizes="[10, 30, 60, 90, 150, 300]"
          :columns="varietyColumns"
          :datasource="varietyDatasource"
          :selection.sync="varietySelection"
          cache-key="twoDeptApplyVarietyTable"
        >
          <template v-slot:batchProdDate="{ row }">{{ formatDate10(row.Batch_Production_Date) }}</template>
          <template v-slot:batchValidDate="{ row }">{{ formatDate10(row.Batch_Validity_Period) }}</template>
          <template v-slot:applySum="{ row }">
            <el-input
              :value="getApplySum(row)"
              size="mini"
              style="width: 60px"
              :disabled="!isVarietyRowSelected(row)"
              @input="setApplySum(row, $event)"
            />
          </template>
        </ele-pro-table>
      </el-col>
    </el-row>

    <el-row :gutter="8" class="bottom-row">
      <el-col :span="5">
        <div class="panel-title">散货申领单列表</div>
        <el-form size="mini" inline class="apply-filter-form">
          <el-form-item label="申领日期">
            <el-date-picker
              v-model="applyStartDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始"
              style="width: 140px"
              @change="reloadApplyList"
            />
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="applyEndDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束"
              style="width: 140px"
              @change="reloadApplyList"
            />
          </el-form-item>
        </el-form>
        <el-form size="mini" inline class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="applyFilters.is_sign" style="width: 90px" @change="reloadApplyList">
              <el-option label="未标记" value="0" />
              <el-option label="全部" value="" />
              <el-option label="已标记" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="applyFilters.is_Print" clearable placeholder="打印" style="width: 90px" @change="reloadApplyList">
              <el-option label="全部" value="" />
              <el-option label="未打印" value="0" />
              <el-option label="已打印" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="applyFilters.searchName"
              clearable
              placeholder="申领单号"
              style="width: 100%"
              @keyup.enter.native="reloadApplyList"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" :disabled="!deptTwoCode" @click="reloadApplyList">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="local-toolbar spd-toolbar">
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button size="mini" type="primary" :disabled="!deptTwoCode" :loading="creatingApply" @click="onCreateApply">
                新建申领单
              </el-button>
              <el-button size="mini" :loading="exporting" @click="onExportApply">导出</el-button>
            </div>
          </div>
          <div class="spd-toolbar__divider" />
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button size="mini" type="primary" :disabled="!canConfirm" :loading="confirming" @click="onConfirmApply">
                确认申领
              </el-button>
              <el-button size="mini" :disabled="!selectedApply" :loading="printing" @click="onPrintApply">打印申领单</el-button>
              <el-button
                v-if="showJhdPrint"
                size="mini"
                :disabled="!selectedApply"
                :loading="printingJhd"
                @click="onPrintJhd"
              >
                打印借货单
              </el-button>
              <el-button
                v-if="homeHp === 'szlh' && selectedApply && !isNewApply"
                size="mini"
                :loading="sendingYsy"
                @click="onSendYsy"
              >
                补发医商云
              </el-button>
              <el-button
                v-if="homeHp === 'szlh' && selectedApply && !isNewApply"
                size="mini"
                :loading="printingYsy"
                @click="onPrintYsy"
              >
                打印申领单(医商云)
              </el-button>
            </div>
          </div>
          <div class="spd-toolbar__divider" />
          <div class="spd-toolbar__group">
            <div class="spd-toolbar__btns">
              <el-button size="mini" type="danger" :disabled="!selectedApply" :loading="deletingApply" @click="onDeleteApply">
                删除申领单
              </el-button>
            </div>
          </div>
        </div>
        <ele-pro-table
          ref="applyTable"
          size="mini"
          height="250px"
          highlight-current-row
          :toolkit="[]"
          :init-load="false"
          :need-page="false"
          :page-size="9999"
          :columns="applyListColumns"
          :datasource="applyDatasource"
          cache-key="twoDeptApplyListTable"
          @row-click="onApplyRowClick"
        >
          <template v-slot:operateState="{ row }">{{ formatApplyState(row.Operate_State) }}</template>
          <template v-slot:operateType="{ row }">{{ formatOperateType(row.Operate_Type) }}</template>
          <template v-slot:operateTime="{ row }">{{ formatDateTime(row.Operate_Time) }}</template>
          <template v-slot:sendYsy="{ row }">{{ formatSendYsy(row.SendYSY ?? row.SEND_YSY) }}</template>
          <template v-slot:orderRemark="{ row }">
            <el-button type="text" size="mini" @click.stop="onEditMark(row)">备注</el-button>
          </template>
          <template v-slot:signState="{ row }">{{ formatSignState(row) }}</template>
          <template v-slot:signAction="{ row }">
            <el-button type="text" size="mini" @click.stop="onToggleSign(row)">
              {{ String(row.IS_SIGN) === '1' ? '取消标记' : '标记' }}
            </el-button>
          </template>
          <template v-slot:signRemark="{ row }">
            <el-button type="text" size="mini" @click.stop="onEditSignMark(row)">备注</el-button>
          </template>
          <template v-slot:sendHisState="{ row }">
            <span>{{ formatSendHisState(row.SEND_HIS_STATE) }}</span>
            <el-button
              v-if="String(row.SEND_HIS_STATE) === '0'"
              type="text"
              size="mini"
              @click.stop="onForbidSendHis(row)"
            >
              禁止推送
            </el-button>
          </template>
          <template v-slot:sendHisAction="{ row }">
            <el-button type="text" size="mini" @click.stop="onSendHis(row)">推送HIS</el-button>
          </template>
          <template v-slot:orderTypeEdit="{ row }">
            <el-button type="text" size="mini" @click.stop="onEditOrderType(row)">修改类型</el-button>
          </template>
          <template v-slot:orderType="{ row }">{{ formatApplyOrderType(row.ORDER_TYPE) }}</template>
          <template v-slot:syncPlan="{ row }">
            <el-button type="text" size="mini" @click.stop="onSyncPlan(row)">同步</el-button>
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="19">
        <div class="panel-title">申领品种明细</div>
        <div v-if="homeHp === 'szlh' && selectedApply && !isNewApply" class="local-toolbar">
          <div class="spd-toolbar__btns">
            <el-button
              type="danger"
              size="mini"
              :disabled="!detailSelection.length"
              :loading="deletingDetail"
              @click="onDeleteDetail"
            >
              删除申领明细
            </el-button>
          </div>
        </div>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="440px"
          :stripe="true"
          :toolkit="[]"
          :init-load="false"
          :need-page="false"
          :page-size="9999"
          :columns="detailColumns"
          :datasource="detailDatasource"
          :selection.sync="detailSelection"
          cache-key="twoDeptApplyDetailTable"
        >
          <template v-slot:zjSupplyPrice="{ row }">
            <span :style="String(row.ZJ_SUPPLY_PRICE) !== String(row.supply_price) ? 'color:red' : ''">
              {{ row.ZJ_SUPPLY_PRICE }}
            </span>
          </template>
          <template v-slot:goodsStock="{ row }">
            <span v-if="String(row.STORAGE_ID) === '1'">{{ row.Goodsstock }}/{{ row.STORAGE_NAME }}</span>
            <span v-else-if="String(row.STORAGE_ID) === '2'">{{ row.OutGoodsstock }}/{{ row.STORAGE_NAME }}</span>
            <span v-else>未知库区</span>
          </template>
          <template v-slot:batchProdDate="{ row }">{{ formatDate10(row.Batch_Production_Date) }}</template>
          <template v-slot:batchValidDate="{ row }">{{ formatDate10(row.Batch_Validity_Period) }}</template>
          <template v-slot:linkPlan="{ row }">
            <el-button type="text" size="mini" @click.stop="onLinkPlan(row)">关联计划</el-button>
          </template>
          <template v-slot:detailAction="{ row }">
            <el-button type="text" size="mini" style="color: red" @click.stop="onDeleteDetailRow(row)">删除</el-button>
          </template>
        </ele-pro-table>
        <div class="detail-total">
          <span>总数量：</span>
          <span>{{ detailTotal }}</span>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="orderTypeDialog.title"
      :visible.sync="orderTypeDialog.visible"
      width="420px"
      append-to-body
    >
      <el-form size="mini" label-width="80px">
        <el-form-item label="订单类型">
          <el-select v-model="orderTypeDialog.value" placeholder="请选择" style="width: 100%">
            <el-option label="普通" value="0" />
            <el-option label="经费" value="1" />
            <el-option label="专项资金" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="orderTypeDialog.remark" clearable placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="orderTypeDialog.visible = false">取消</el-button>
        <el-button size="mini" type="primary" :loading="orderTypeDialog.loading" @click="submitOrderType">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';
import {
  getStorageList,
  getTwoDeptApplyDept,
  getTwoDeptApplyVarietie,
  getApplyList,
  getApplyDetail,
  createApplyNum,
  insertApplyVarietie,
  updateApply,
  deleteApplyOrder,
  deleteApplyVarietie,
  pdaConfirmApply,
  kyDzConfirmApply,
  searchHistoryConsumedCompare,
  csyyManHoo7Ss,
  exportApplyListAll,
  createClaimExcel,
  sendLuoHuYSY,
  lhApplyDetailDel,
  upSignState,
  upMark,
  upSignMark,
  forbidSendHis,
  sendHisStockBd,
  updateApplyType,
  slGlJh,
  glDeptPlanSl
} from '@/api/Inventory/CentralinventoryMonitoring';
import {
  monitorHpFlags,
  getClaimExcelApiPath,
  openExcelDownload,
  formatApplyState,
  formatOperateType,
  formatSendYsy,
  formatSignState,
  formatApplyOrderType,
  formatSendHisState,
  formatDate10,
  formatDateTime,
  buildApplyDeptColumns,
  buildApplyVarietieColumns,
  buildApplyListColumns,
  buildApplyDetailColumns
} from '../utils';

export default {
  name: 'TwoDeptApplyTab',
  data() {
    return {
      homeHp: HOME_HP,
      storageList: [],
      deptSearch: '',
      deptStorageId: '',
      deptTwoCode: '',
      deptOneCode: '',
      deptTwoName: '',
      deptColumns: buildApplyDeptColumns(),
      varietyColumns: buildApplyVarietieColumns(monitorHpFlags),
      varietyPageSize: 10,
      varietyFilters: {
        searchName: '',
        delNum: '',
        supplier_name: '',
        specification: '',
        batch: '',
        field: '',
        order: ''
      },
      varietyStorageId: '',
      varietySelection: [],
      applySumMap: {},
      detailRows: [],
      detailTotal: 0,
      applyStartDate: '',
      applyEndDate: '',
      applyFilters: {
        searchName: '',
        is_sign: '0',
        is_Print: ''
      },
      detailSelection: [],
      deletingDetail: false,
      sendingYsy: false,
      printingJhd: false,
      printingYsy: false,
      selectedApply: null,
      applyId: '',
      operateNumber: '',
      creatingApply: false,
      inserting: false,
      confirming: false,
      printing: false,
      deletingApply: false,
      exporting: false,
      orderTypeDialog: {
        visible: false,
        title: '修改类型',
        operateNumber: '',
        value: '',
        remark: '',
        loading: false
      }
    };
  },
  computed: {
    isNewApply() {
      if (!this.selectedApply) return false;
      return String(this.selectedApply.Operate_State) === '0';
    },
    applyListColumns() {
      void this.homeHp;
      return buildApplyListColumns(monitorHpFlags);
    },
    detailColumns() {
      void this.homeHp;
      return buildApplyDetailColumns({ isNew: this.isNewApply });
    },
    canAddVariety() {
      if (!this.isNewApply || !this.applyId) return false;
      if (this.homeHp === 'szlh') {
        return this.varietyStorageId === '1' || this.varietyStorageId === '2';
      }
      return true;
    },
    canConfirm() {
      return this.isNewApply && !!this.applyId;
    },
    staffName() {
      return this.$store.state.user?.info?.Nickname || '';
    },
    showJhdPrint() {
      return ['stzx', 'stzyyy', 'chrmyy', 'bd'].includes(this.homeHp);
    }
  },
  mounted() {
    this.loadStorage();
  },
  methods: {
    formatApplyState,
    formatOperateType,
    formatSendYsy,
    formatSignState,
    formatApplyOrderType,
    formatSendHisState,
    formatDate10,
    formatDateTime,
    formatDeptIsPrint(val) {
      if (val === '1' || val === 1) return '存在';
      if (val === '0' || val === 0) return '无';
      return val ?? '';
    },
    loadStorage() {
      getStorageList()
        .then((res) => {
          const data = res?.data || res;
          this.storageList = data?.result || [];
          // 后端 GetVarietie 把 StorageID 直接拼进 SQL，空值会 500；与老系统一致默认选中第一个库区
          if (!this.varietyStorageId && this.storageList.length) {
            this.varietyStorageId = String(this.storageList[0].ID);
          }
        })
        .catch((e) => {
          this.$message.error(e.message || '加载院区失败');
        });
    },
    onDeptStorageChange() {
      // 老系统：左侧院区变更会同步到申领库区下拉
      if (this.deptStorageId) {
        this.varietyStorageId = this.deptStorageId;
      }
      this.reloadDept();
    },
    varietyRowKey(row) {
      return `${row.Batch_ID || ''}_${row.Varietie_Code || ''}`;
    },
    getApplySum(row) {
      const key = this.varietyRowKey(row);
      if (this.applySumMap[key] !== undefined) return this.applySumMap[key];
      // ApplySum 后端默认是 0；不能用 ||，否则 0 会被当成空
      return row.ApplySum ?? 0;
    },
    setApplySum(row, val) {
      this.$set(this.applySumMap, this.varietyRowKey(row), val);
    },
    isVarietyRowSelected(row) {
      return this.varietySelection.some((item) => this.varietyRowKey(item) === this.varietyRowKey(row));
    },
    deptDatasource({ page, limit }) {
      return getTwoDeptApplyDept(this.deptSearch, this.deptStorageId, page, limit || 9999)
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询科室失败');
          return { count: 0, list: [] };
        });
    },
    varietyDatasource({ page, limit, order }) {
      if (!this.deptTwoCode) {
        return Promise.resolve({ count: 0, list: [] });
      }
      // StorageID 为空时后端 SQL 非法（Storage_ID = ），直接拦截避免 500
      if (!this.varietyStorageId) {
        this.$message.warning('请先选择申领库区');
        return Promise.resolve({ count: 0, list: [] });
      }
      if (order?.sort) {
        this.varietyFilters.field = order.sort;
        this.varietyFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getTwoDeptApplyVarietie(
        {
          StorageID: this.varietyStorageId,
          DeptTwoCode: this.deptTwoCode,
          SearchName: this.varietyFilters.searchName,
          delNum: this.varietyFilters.delNum,
          supplier_name: this.varietyFilters.supplier_name,
          Specification_Or_Type: this.varietyFilters.specification,
          Batch: this.varietyFilters.batch,
          field: this.varietyFilters.field,
          order: this.varietyFilters.order
        },
        page,
        limit
      )
        .then((res) => {
          const list = res.result || [];
          list.forEach((row) => {
            const key = this.varietyRowKey(row);
            if (this.applySumMap[key] === undefined) {
              this.$set(this.applySumMap, key, row.ApplySum ?? 0);
            }
          });
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询品种失败');
          return { count: 0, list: [] };
        });
    },
    applyDatasource({ page, limit }) {
      if (!this.deptTwoCode) {
        return Promise.resolve({ count: 0, list: [] });
      }
      const start = this.applyStartDate;
      const end = this.applyEndDate;
      return getApplyList(
        {
          DeptTwoCode: this.deptTwoCode,
          SearchName: this.applyFilters.searchName,
          // 空字符串不会走后端 null 默认值，会导致日期 SQL 异常；与后端默认对齐
          StartTime: start || '0001-01-01',
          EndTime: end || '9999-12-30',
          is_sign: this.applyFilters.is_sign,
          is_Print: this.applyFilters.is_Print
        },
        page,
        limit || 9999
      )
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询申领单失败');
          return { count: 0, list: [] };
        });
    },
    detailDatasource({ page, limit }) {
      if (!this.applyId) {
        this.detailRows = [];
        this.detailTotal = 0;
        return Promise.resolve({ count: 0, list: [] });
      }
      return getApplyDetail(this.applyId, '', page, limit || 9999)
        .then((res) => {
          const list = res.result || [];
          this.detailRows = list;
          this.detailTotal = res.total || 0;
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询申领明细失败');
          this.detailRows = [];
          this.detailTotal = 0;
          return { count: 0, list: [] };
        });
    },
    reloadDept() {
      this.clearDeptContext();
      this.$refs.deptTable?.reload({ page: 1 });
    },
    reloadVariety() {
      this.varietySelection = [];
      this.$refs.varietyTable?.reload({ page: 1 });
    },
    reloadApplyList() {
      this.clearApplySelection();
      this.$refs.applyTable?.reload({ page: 1 });
    },
    reloadDetail() {
      this.$refs.detailTable?.reload({ page: 1 });
    },
    clearDeptContext() {
      this.deptTwoCode = '';
      this.deptOneCode = '';
      this.deptTwoName = '';
      this.clearApplySelection();
      this.reloadVariety();
      this.reloadApplyList();
    },
    clearApplySelection() {
      this.selectedApply = null;
      this.applyId = '';
      this.operateNumber = '';
      this.detailRows = [];
      this.detailTotal = 0;
      this.reloadDetail();
    },
    onDeptRowClick(row) {
      this.deptTwoCode = row.dept_two_code || '';
      this.deptOneCode = row.dept_one_code || '';
      this.deptTwoName = row.dept_two_name || '';
      this.clearApplySelection();
      this.reloadVariety();
      this.reloadApplyList();
    },
    onApplyRowClick(row) {
      this.selectedApply = row;
      this.applyId = row.ID || '';
      this.operateNumber = row.Operate_Number || '';
      this.reloadDetail();
    },
    async onCreateApply() {
      if (!this.deptTwoCode) {
        this.$message.warning('请先选择科室');
        return;
      }
      this.creatingApply = true;
      try {
        const data = await createApplyNum(this.deptTwoCode);
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '新建申领单成功');
          this.reloadApplyList();
        } else {
          this.$message.error(data?.msg || '新建申领单失败');
        }
      } catch (e) {
        this.$message.error(e.message || '新建申领单失败');
      } finally {
        this.creatingApply = false;
      }
    },
    validateInsertRows(rows) {
      const detailBatchIds = (this.detailRows || []).map((r) => String(r.Batch_ID));
      const detailStorageIds = (this.detailRows || []).map((r) => String(r.STORAGE_ID)).filter(Boolean);
      for (const row of rows) {
        const qty = parseInt(this.getApplySum(row), 10);
        const stock = parseInt(row.Goodsstock, 10);
        const label = `品种编码-${row.Varietie_Code_New || row.Varietie_Code} 品种全称-${row.Varietie_Name} 型号/规格-${row.Specification_Or_Type} 批次号-${row.Batch_ID}`;
        if (qty > stock) {
          this.$message.warning(`${label} 申领数量不得大于散货库存数量`);
          return false;
        }
        if (stock === 0) {
          this.$message.warning(`${label} 的散货库存数量为0不能进行申领`);
          return false;
        }
        if (!qty || qty <= 0) {
          this.$message.warning(`${label} 的申领数量不能小于或等于0`);
          return false;
        }
        if (detailBatchIds.includes(String(row.Batch_ID))) {
          this.$message.warning(`不能添加重复的品种: ${label}`);
          return false;
        }
        if (detailStorageIds.length && !detailStorageIds.includes(String(row.STORAGE_ID))) {
          this.$message.warning(`不能添加不同库区的品种: ${label}`);
          return false;
        }
      }
      return true;
    },
    buildInsertJson(rows) {
      // 老系统顺序：DeptTwoCode, Apply_Id, Operate_Number, Varietie_Code, Batch,
      // Batch_Production_Date, Batch_Validity_Period, ApplySum, Batch_ID, Contract_Code,
      // supplier_name, STORAGE_ID, dept_two_name, supply_price, supplier_code, homehp
      const arr = rows.map((row) => {
        const qty = parseInt(this.getApplySum(row), 10);
        const prodDate = formatDate10(row.Batch_Production_Date);
        const validDate = formatDate10(row.Batch_Validity_Period);
        return `{${this.deptTwoCode},${this.applyId},${this.operateNumber},${row.Varietie_Code},${row.Batch},${prodDate},${validDate},${qty},${row.Batch_ID},${row.Contract_Code || ''},${row.supplier_name || ''},${row.STORAGE_ID || ''},${this.deptTwoName},${row.supply_price || ''},${row.supplier_code || ''},${this.homeHp}}`;
      });
      return JSON.stringify(arr);
    },
    async onInsertVariety() {
      if (!this.deptTwoCode) {
        this.$message.warning('请选中科室');
        return;
      }
      if (!this.varietySelection.length) {
        this.$message.warning('请至少勾选一条要添加的品种');
        return;
      }
      if (!this.validateInsertRows(this.varietySelection)) return;
      this.inserting = true;
      try {
        const data = await insertApplyVarietie(this.buildInsertJson(this.varietySelection));
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success('申领品种成功');
          this.varietySelection = [];
          this.reloadDetail();
        } else {
          this.$message.error(data?.msg || '添加申领品种失败');
        }
      } catch (e) {
        this.$message.error(e.message || '添加申领品种失败');
      } finally {
        this.inserting = false;
      }
    },
    normalizeStorageId(value) {
      if (value === '院内库区') return '1';
      if (value === '院外库区') return '2';
      return value || '';
    },
    buildConfirmJson(rows) {
      const arr = rows.map((row) => {
        const storageId = this.normalizeStorageId(row.STORAGE_ID);
        return `{${this.applyId},${this.staffName},${this.deptTwoCode},${row.Varietie_Code},${row.Batch},${row.quanity},${row.Batch_ID},${row.supplier_code || ''},${row.Contract_Code || ''},${row.supply_price || ''},${storageId},${row.Varietie_Code_New || ''}}`;
      });
      return JSON.stringify(arr);
    },
    buildCompareJson(rows) {
      return JSON.stringify(
        (rows || []).map((row) => ({
          Varietie_Code: row.Varietie_Code,
          Count: row.quanity
        }))
      );
    },
    isPdaApplyType() {
      const type = this.selectedApply?.Operate_Type;
      return String(type) === '3' || formatOperateType(type) === '科室PDA收货';
    },
    async checkHistoryConsumedCompare() {
      if (this.homeHp !== 'lg') return;
      try {
        const data = await searchHistoryConsumedCompare(this.deptTwoCode, this.buildCompareJson(this.detailRows));
        if (data?.code == 300 || data?.code === '300') {
          window.alert(data.msg || '超计划提醒');
        }
      } catch {
        // 不阻断确认
      }
    },
    async onConfirmApply() {
      if (!this.applyId) {
        this.$message.warning('请选择要申领的单号');
        return;
      }
      if (!this.detailRows.length) {
        this.$message.warning('申领品种不能为空,请至少添加一条要申领的品种');
        return;
      }
      this.confirming = true;
      try {
        await this.checkHistoryConsumedCompare();
        if (this.isPdaApplyType()) {
          const data =
            this.homeHp === 'bdrm'
              ? await kyDzConfirmApply(this.operateNumber, this.deptTwoCode, this.staffName)
              : await pdaConfirmApply(this.deptTwoCode, this.operateNumber, this.staffName);
          if (data?.code == 200 || data?.code === '200') {
            this.$message.success('已成功申领');
            this.afterConfirmSuccess();
          } else {
            this.$message.error(data?.msg || data?.message || '确认申领失败');
          }
          return;
        }
        const data = await updateApply(this.buildConfirmJson(this.detailRows));
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success('已成功申领');
          if (this.homeHp === 'csyy') {
            csyyManHoo7Ss().catch(() => {});
          }
          this.afterConfirmSuccess();
        } else {
          this.$message.error(data?.msg || '确认申领失败');
        }
      } catch (e) {
        this.$message.error(e.message || '确认申领失败');
      } finally {
        this.confirming = false;
      }
    },
    afterConfirmSuccess() {
      this.clearApplySelection();
      this.reloadApplyList();
      this.reloadVariety();
    },
    async onEditMark(row) {
      try {
        const { value } = await this.$prompt(`申领${row.Operate_Number}备注:`, '订单备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.mark || '',
          inputType: 'textarea',
          closeOnClickModal: false
        });
        const data = await upMark(row.ID, value ?? '');
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '保存成功');
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '保存失败');
        }
      } catch {
        // 取消
      }
    },
    async onEditSignMark(row) {
      try {
        const { value } = await this.$prompt(`申领${row.Operate_Number}标记备注:`, '标记备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.SIGN_MARK || '',
          inputType: 'textarea',
          closeOnClickModal: false
        });
        const data = await upSignMark(row.ID, value ?? '');
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '保存成功');
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '保存失败');
        }
      } catch {
        // 取消
      }
    },
    async onToggleSign(row) {
      const isSigned = String(row.IS_SIGN) === '1';
      const nextState = isSigned ? '0' : '1';
      const tip = isSigned
        ? `确定取消标记申领单${row.Operate_Number}吗?`
        : `确定标记申领单${row.Operate_Number}吗?`;
      try {
        await this.$confirm(tip, '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const data = await upSignState(row.ID, nextState);
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '操作成功');
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    async onForbidSendHis(row) {
      try {
        await this.$confirm(`确定禁止推送${row.Operate_Number}吗?`, '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const data = await forbidSendHis(row.ID);
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '操作成功');
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    async onSendHis(row) {
      try {
        await this.$confirm(`确定推送${row.Operate_Number}吗?系统将再次推送给his请勿重复推送`, '提示', {
          type: 'warning'
        });
      } catch {
        return;
      }
      try {
        const data = await sendHisStockBd(row.ID, '1');
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '推送成功');
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '推送失败');
        }
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      }
    },
    onEditOrderType(row) {
      this.orderTypeDialog = {
        visible: true,
        title: '修改类型',
        operateNumber: row.Operate_Number || '',
        value: row.ORDER_TYPE != null && row.ORDER_TYPE !== '' ? String(row.ORDER_TYPE) : '',
        remark: row.ORDER_TYPE_MARK || '',
        loading: false
      };
    },
    async submitOrderType() {
      if (this.orderTypeDialog.value === '' || this.orderTypeDialog.value == null) {
        this.$message.warning('请选择订单类型');
        return;
      }
      this.orderTypeDialog.loading = true;
      try {
        const data = await updateApplyType(
          this.orderTypeDialog.operateNumber,
          this.orderTypeDialog.value,
          this.orderTypeDialog.remark
        );
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '修改成功');
          this.orderTypeDialog.visible = false;
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '修改失败');
        }
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.orderTypeDialog.loading = false;
      }
    },
    async onSyncPlan(row) {
      try {
        const { value } = await this.$prompt('请输入计划单号', '同步计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '同步单号',
          closeOnClickModal: false
        });
        const data = await slGlJh(row.ID, value ?? '');
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '同步成功');
          this.reloadDetail();
          this.$refs.applyTable?.reload();
        } else {
          this.$message.error(data?.msg || '同步失败');
        }
      } catch {
        // 取消
      }
    },
    async onLinkPlan(row) {
      try {
        const { value } = await this.$prompt('请输入计划单号明细id', '关联计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '计划明细id',
          closeOnClickModal: false
        });
        const data = await glDeptPlanSl(row.ID, value ?? '');
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success(data.msg || '关联成功');
          this.reloadDetail();
        } else {
          this.$message.error(data?.msg || '关联失败');
        }
      } catch {
        // 取消
      }
    },
    async onDeleteDetailRow(row) {
      try {
        await this.$confirm('真的删除行么?', '提示', { type: 'warning' });
      } catch {
        return;
      }
      try {
        const data = await deleteApplyVarietie(row.ID);
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success('删除成功');
          this.reloadDetail();
        } else {
          this.$message.error(data?.msg || '删除失败');
        }
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    },
    async onPrintApply() {
      if (!this.operateNumber) {
        this.$message.warning('请选择要打印的申领单');
        return;
      }
      const stateText = formatApplyState(this.selectedApply?.Operate_State);
      if (stateText !== '已申领' && this.homeHp !== 'fszxy') {
        this.$message.warning('请先确认申领后打印');
        return;
      }
      this.printing = true;
      try {
        const apiPath = getClaimExcelApiPath(this.homeHp);
        const data = await createClaimExcel(apiPath, {
          homehp: this.homeHp,
          ID: this.applyId,
          Operate_Number: this.operateNumber,
          SearchName: '',
          dept: this.deptTwoName,
          page: 1,
          size: 99999,
          deptOneCode: this.deptOneCode
        });
        if (data?.code == 200 || data?.code === '200') {
          openExcelDownload(data.msg);
        } else {
          this.$message.error(data?.msg || '打印申领单失败');
        }
      } catch (e) {
        this.$message.error(e.message || '打印申领单失败');
      } finally {
        this.printing = false;
      }
    },
    async onPrintJhd() {
      if (!this.operateNumber) {
        this.$message.warning('请选择要打印的申领单');
        return;
      }
      this.printingJhd = true;
      try {
        const data = await createClaimExcel('CreatedeClaimExcelJhd', {
          homehp: this.homeHp,
          ID: this.applyId,
          Operate_Number: this.operateNumber,
          SearchName: '',
          dept: this.deptTwoName,
          page: 1,
          size: 99999,
          deptOneCode: this.deptOneCode
        });
        if (data?.code == 200 || data?.code === '200') {
          openExcelDownload(data.msg);
        } else {
          this.$message.error(data?.msg || '打印借货单失败');
        }
      } catch (e) {
        this.$message.error(e.message || '打印借货单失败');
      } finally {
        this.printingJhd = false;
      }
    },
    async onPrintYsy() {
      if (!this.operateNumber) {
        this.$message.warning('请选择要打印的申领单');
        return;
      }
      this.printingYsy = true;
      try {
        const data = await createClaimExcel('CreatedeClaimExcelszlh_ysy', {
          ID: this.applyId,
          Operate_Number: this.operateNumber,
          dept: this.deptTwoName
        });
        if (data?.code == 200 || data?.code === '200') {
          openExcelDownload(data.msg);
        } else {
          this.$message.error(data?.msg || '打印申领单(医商云)失败');
        }
      } catch (e) {
        this.$message.error(e.message || '打印申领单(医商云)失败');
      } finally {
        this.printingYsy = false;
      }
    },
    async onSendYsy() {
      if (!this.applyId) {
        this.$message.warning('请选择申领单');
        return;
      }
      this.sendingYsy = true;
      try {
        const data = await sendLuoHuYSY(this.applyId);
        if (data?.code == 200 || data?.code === '200') {
          this.$message.success('发送成功');
          this.reloadApplyList();
        } else {
          this.$message.error(data?.msg || '发送失败');
        }
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        this.sendingYsy = false;
      }
    },
    async onDeleteDetail() {
      if (!this.detailSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.deletingDetail = true;
      try {
        const ids = this.detailSelection.map((r) => r.ID).filter(Boolean);
        const data = await lhApplyDetailDel(ids);
        if (data == 200 || data === 200 || data?.code == 200) {
          this.$message.success(typeof data === 'object' ? data.msg || '删除成功' : '删除成功');
          this.detailSelection = [];
          this.reloadDetail();
        } else if (data == 301 || data === 301) {
          this.$message.error('登录失效，请重新登录');
        } else {
          this.$message.error(data?.msg || '删除失败');
        }
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      } finally {
        this.deletingDetail = false;
      }
    },
    async onDeleteApply() {
      if (!this.applyId) {
        this.$message.warning('请选择申领单');
        return;
      }
      try {
        await this.$confirm('确定删除该申领单吗?', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.deletingApply = true;
      try {
        const data = await deleteApplyOrder(this.applyId);
        if (data == 200 || data === '200' || data?.code == 200 || data?.code === '200') {
          this.$message.success(typeof data === 'object' ? data.msg || '删除成功' : '删除成功');
          this.afterConfirmSuccess();
        } else if (data == 301 || data === '301' || data?.code == 301) {
          this.$message.error('登录失效，请重新登录');
        } else {
          this.$message.error(data?.msg || '删除申领单失败');
        }
      } catch (e) {
        this.$message.error(e.message || '删除申领单失败');
      } finally {
        this.deletingApply = false;
      }
    },
    async onExportApply() {
      const start = this.applyStartDate;
      const end = this.applyEndDate;
      this.exporting = true;
      try {
        const data = await exportApplyListAll({
          STORAGE_ID: this.deptStorageId || '-1',
          dept_two_code: this.deptTwoCode || '-1',
          SearchName: this.applyFilters.searchName,
          StartTime: start || '2020-01-01',
          EndTime: end || '2025-12-31',
          page: 1,
          size: 999999
        });
        if (data?.code == 200 || data?.code === '200') {
          const rows = [['院区', '科室', '申领单号', '申领状态', '打印次数']];
          (data.result || []).forEach((item) => {
            rows.push([
              item.STORAGE_NAME || '',
              item.Dept_Two_Name || '',
              item.Operate_Number || '',
              formatApplyState(item.Operate_State),
              item.Print_Count ?? ''
            ]);
          });
          const sheet = utils.aoa_to_sheet(rows);
          const book = utils.book_new();
          utils.book_append_sheet(book, sheet, '散货申领单');
          writeFile(book, '散货申领单信息.xlsx');
        } else {
          this.$message.error(data?.msg || '导出失败');
        }
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.two-dept-apply-tab {
  padding-top: 4px;
}
.main-row,
.bottom-row {
  margin-bottom: 8px;
}
.panel-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}
.apply-filter-form {
  margin-bottom: 6px;
}
.apply-filter-form ::v-deep .el-form-item {
  margin-bottom: 6px;
}
.local-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.local-toolbar.spd-toolbar {
  padding: 0;
}
.local-toolbar .spd-toolbar__divider {
  min-height: 24px;
  margin: 0 8px;
}
.detail-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
}
.detail-total span:last-child {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
}
.two-dept-apply-tab ::v-deep .el-table {
  width: max-content;
  min-width: 100%;
}
</style>
