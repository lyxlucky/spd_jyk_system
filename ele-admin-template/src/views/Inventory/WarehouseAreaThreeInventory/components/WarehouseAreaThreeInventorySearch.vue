<template>
  <div class="spd-panel spd-panel--search warehouse-area-search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="emitSearch"
        @submit.native.prevent
      >
        <el-form-item label="查询方式">
          <el-radio-group v-model="modeSync" size="mini">
            <el-radio-button label="material">按耗材定位</el-radio-button>
            <el-radio-button label="warehouse">按库房/库区查看</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="mode === 'warehouse'" label="库房/库区">
          <el-select
            v-model="where.AREA_CODE"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请选择库房/库区"
            :remote-method="loadWarehouseOptions"
            :loading="warehouseLoading"
            class="warehouse-select"
            @change="onWarehouseChange"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="String(item.VALUE)"
            >
              <span>{{ item.LABEL }}</span>
              <span class="option-type">{{ areaTypeName(item.TYPE) }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费编码">
          <el-input v-model="where.CHARGE_CODE" clearable placeholder="计费编码" class="query-input" />
        </el-form-item>
        <el-form-item label="定数码">
          <el-input v-model="where.BARCODE_NUMBER" clearable placeholder="定数码" class="query-input" />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input v-model="where.VARIETIE_CODE_NEW" clearable placeholder="品种编码" class="query-input" />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input v-model="where.VARIETIE_NAME" clearable placeholder="品种名称" class="query-input" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="where.SPECIFICATION_OR_TYPE" clearable placeholder="规格型号" class="query-input" />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input v-model="where.MANUFACTURING_ENT_NAME" clearable placeholder="生产企业" class="query-input" />
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="where.STOCK_STATUS" clearable placeholder="全部" class="query-select">
            <el-option
              v-for="item in stockStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="扣费类型">
          <el-select v-model="where.STOCK_DEDUCT_TYPE" clearable placeholder="全部" class="query-select">
            <el-option
              v-for="item in stockDeductTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计费时间">
          <el-date-picker
            v-model="where.START_TIME"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="where.END_TIME"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="emitSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button v-if="mode === 'warehouse'" type="success" icon="el-icon-download" :loading="exporting" @click="$emit('export')">
            导出
          </el-button>
          <el-button
            v-if="mode === 'warehouse'"
            type="warning"
            icon="el-icon-upload2"
            :loading="importing"
            @click="chooseImportFile"
          >
            初始化库存
          </el-button>
          <el-button
            v-if="mode === 'warehouse'"
            type="danger"
            icon="el-icon-connection"
            :loading="syncingHisCharge"
            @click="openHisChargePreview"
          >
            同步HIS计费记录
          </el-button>
          <el-button
            v-if="mode === 'warehouse'"
            type="primary"
            icon="el-icon-connection"
            :loading="syncingSpdInStock"
            @click="openSpdInStockPreview"
          >
            同步入库记录
          </el-button>
          <input
            ref="importFile"
            type="file"
            accept=".xls,.xlsx"
            class="hidden-file"
            @change="onImportFileChange"
          />
        </el-form-item>
        
      </el-form>
    </div>

    <el-dialog
      :visible.sync="hisPreviewVisible"
      title="同步HIS计费记录"
      width="90%"
      top="1vh"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form size="mini" :inline="true" class="his-preview-query" @submit.native.prevent>
        <el-form-item label="库房/库区">
          <el-input :value="hisPreviewAreaLabel" disabled class="his-preview-warehouse" />
        </el-form-item>
        <el-form-item label="SPD科室">
          <el-select
            v-model="hisPreviewQuery.SPD_DEPT_REL_IDS"
            multiple
            filterable
            clearable
            collapse-tags
            placeholder="请选择SPD科室"
            :loading="hisSpdDeptRelationLoading"
            class="his-preview-dept"
            @change="onHisSpdDeptRelationChange"
          >
            <el-option
              v-for="item in hisSpdDeptRelations"
              :key="item.ID"
              :label="hisSpdDeptRelationLabel(item)"
              :value="String(item.ID)"
              :disabled="!hasHisSpdDeptRelationStartTime(item)"
            >
              <span>{{ item.DEPT_TWO_NAME || item.DEPT_TWO_CODE }}</span>
              <span class="option-type">
                {{ `${item.AREA_NAME || item.AREA_CODE || ''} ${item.AUTO_STOCK_START_TIME || '未配置开始时间'}` }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="hisPreviewQuery.END_TIME"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="不选则开始时间之后"
            class="his-preview-time"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="hisPreviewLoading"
            @click="loadHisChargePreview"
          >
            查询预览
          </el-button>
        </el-form-item>
      </el-form>
      <div class="his-preview-summary">
        <span>HIS记录：{{ hisPreviewStats.TotalCount || 0 }}</span>
        <span>本次可插入：{{ hisPreviewStats.NewCount || 0 }}</span>
        <span>已存在：{{ hisPreviewStats.ExistingCount || 0 }}</span>
        <span>HIS重复：{{ hisPreviewStats.DuplicateCount || 0 }}</span>
        <span>失败：{{ hisPreviewStats.FailCount || 0 }}</span>
        <span>未匹配库房/库区：{{ hisPreviewStats.NoWarehouseAreaCount || 0 }}</span>
        <span>未匹配SPD科室：{{ hisPreviewStats.NoDeptTwoCodeCount || 0 }}</span>
      </div>
      <div class="his-preview-table-title">
        <span>本次可插入数据</span>
        <span>{{ hisPreviewRows.length }}条</span>
      </div>
      <vxe-table
        v-loading="hisPreviewLoading"
        :data="hisPreviewRows"
        border
        size="mini"
        height="320"
        show-overflow
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        empty-text="暂无本次可插入数据"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" fixed="left" />
        <vxe-column field="UniqueId" title="医嘱ID" width="130" />
        <vxe-column field="DeptCode" title="HIS科室编码" width="110" />
        <vxe-column field="DeptName" title="HIS科室名称" width="150" />
        <vxe-column field="DeptTwoCode" title="SPD科室编码" width="120" />
        <vxe-column field="AreaCode" title="库房/库区编码" width="130" />
        <vxe-column field="AreaName" title="库房/库区名称" width="150" />
        <vxe-column field="ChargeCode" title="计费编码" width="110" />
        <vxe-column field="ChargeName" title="费用名称" min-width="220" />
        <vxe-column field="PaymentChannel" title="缴费渠道" width="120" />
        <vxe-column field="Specification" title="规格" width="160" />
        <vxe-column field="Price" title="单价" width="90" align="right" />
        <vxe-column field="Qty" title="HIS数量" width="90" align="right" />
        <vxe-column field="InsertQty" title="插入数量" width="90" align="right" />
        <vxe-column field="ChargeTimeText" title="HIS时间" width="140" />
      </vxe-table>
      <div class="his-preview-table-title his-preview-table-title--repeat">
        <span>已重复数据</span>
        <span>{{ hisRepeatedRows.length }}条</span>
      </div>
      <vxe-table
        v-loading="hisPreviewLoading"
        :data="hisRepeatedRows"
        border
        size="mini"
        height="220"
        show-overflow
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        empty-text="暂无已重复数据"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" fixed="left" />
        <vxe-column field="RepeatType" title="重复类型" width="95" fixed="left" />
        <vxe-column field="UniqueId" title="医嘱ID" width="130" />
        <vxe-column field="DeptCode" title="HIS科室编码" width="110" />
        <vxe-column field="DeptName" title="HIS科室名称" width="150" />
        <vxe-column field="DeptTwoCode" title="SPD科室编码" width="120" />
        <vxe-column field="AreaCode" title="库房/库区编码" width="130" />
        <vxe-column field="AreaName" title="库房/库区名称" width="150" />
        <vxe-column field="ChargeCode" title="计费编码" width="110" />
        <vxe-column field="ChargeName" title="费用名称" min-width="220" />
        <vxe-column field="Specification" title="规格" width="160" />
        <vxe-column field="Price" title="单价" width="90" align="right" />
        <vxe-column field="Qty" title="HIS数量" width="90" align="right" />
        <vxe-column field="InsertQty" title="插入数量" width="90" align="right" />
        <vxe-column field="ChargeTimeText" title="HIS时间" width="140" />
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="hisPreviewVisible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="syncingHisCharge"
          :disabled="hisPreviewLoading || !hisPreviewRows.length"
          @click="confirmSyncHisChargeRecords"
        >
          确认插入
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="spdInStockPreviewVisible"
      title="同步入库记录"
      width="90%"
      top="1vh"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form size="mini" :inline="true" class="his-preview-query" @submit.native.prevent>
        <el-form-item label="库房/库区">
          <el-input :value="spdInStockAreaLabel" disabled class="his-preview-warehouse" />
        </el-form-item>
        <el-form-item label="SPD科室">
          <el-select
            v-model="spdInStockQuery.SPD_DEPT_REL_IDS"
            multiple
            filterable
            clearable
            collapse-tags
            placeholder="请选择SPD科室"
            :loading="spdInStockDeptRelationLoading"
            class="his-preview-dept"
            @change="onSpdInStockDeptRelationChange"
          >
            <el-option
              v-for="item in spdInStockDeptRelations"
              :key="item.ID"
              :label="hisSpdDeptRelationLabel(item)"
              :value="String(item.ID)"
              :disabled="!hasHisSpdDeptRelationStartTime(item)"
            >
              <span>{{ item.DEPT_TWO_NAME || item.DEPT_TWO_CODE }}</span>
              <span class="option-type">{{ item.AUTO_STOCK_START_TIME || '未配置开始时间' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="spdInStockQuery.END_TIME"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="不选则开始时间之后"
            class="his-preview-time"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="spdInStockPreviewLoading"
            @click="loadSpdInStockPreview"
          >
            查询预览
          </el-button>
        </el-form-item>
      </el-form>
      <div class="his-preview-summary">
        <span>入库记录：{{ spdInStockStats.TotalCount || 0 }}</span>
        <span>本次可插入：{{ spdInStockStats.NewCount || 0 }}</span>
        <span>已存在：{{ spdInStockStats.ExistingCount || 0 }}</span>
        <span>SPD重复：{{ spdInStockStats.DuplicateCount || 0 }}</span>
        <span>失败：{{ spdInStockStats.FailCount || 0 }}</span>
        <span>未匹配库房/库区：{{ spdInStockStats.NoWarehouseAreaCount || 0 }}</span>
        <span>未匹配HIS科室：{{ spdInStockStats.NoHisDeptCodeCount || 0 }}</span>
      </div>
      <div class="his-preview-table-title">
        <span>本次可插入数据</span>
        <span>{{ spdInStockRows.length }}条</span>
      </div>
      <vxe-table
        v-loading="spdInStockPreviewLoading"
        :data="spdInStockRows"
        border
        size="mini"
        height="320"
        show-overflow
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        empty-text="暂无本次可插入数据"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" fixed="left" />
        <vxe-column field="UniqueId" title="SPD_ID" width="130" />
        <vxe-column field="OperateNumber" title="入库单号" width="130" />
        <vxe-column field="OperateTypeName" title="入库类型" width="130" />
        <vxe-column field="DeptTwoCode" title="SPD科室编码" width="120" />
        <vxe-column field="DeptTwoName" title="SPD科室名称" width="150" />
        <vxe-column field="DeptCode" title="HIS科室编码" width="110" />
        <vxe-column field="AreaCode" title="库房/库区编码" width="130" />
        <vxe-column field="AreaName" title="库房/库区名称" width="150" />
        <vxe-column field="ChargeCode" title="计费编码" width="110" />
        <vxe-column field="ChargeName" title="品种名称" min-width="220" />
        <vxe-column field="Specification" title="规格" width="160" />
        <vxe-column field="Qty" title="入库数量" width="90" align="right" />
        <vxe-column field="InsertQty" title="插入数量" width="90" align="right" />
        <vxe-column field="OperateTimeText" title="入库时间" width="140" />
        <vxe-column field="OperatorName" title="操作人" width="100" />
        <vxe-column field="Batch" title="批号" width="120" />
      </vxe-table>
      <div class="his-preview-table-title his-preview-table-title--repeat">
        <span>已重复数据</span>
        <span>{{ spdInStockRepeatedRows.length }}条</span>
      </div>
      <vxe-table
        v-loading="spdInStockPreviewLoading"
        :data="spdInStockRepeatedRows"
        border
        size="mini"
        height="220"
        show-overflow
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        empty-text="暂无已重复数据"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" fixed="left" />
        <vxe-column field="RepeatType" title="重复类型" width="95" fixed="left" />
        <vxe-column field="UniqueId" title="SPD_ID" width="130" />
        <vxe-column field="OperateNumber" title="入库单号" width="130" />
        <vxe-column field="OperateTypeName" title="入库类型" width="130" />
        <vxe-column field="DeptTwoCode" title="SPD科室编码" width="120" />
        <vxe-column field="DeptTwoName" title="SPD科室名称" width="150" />
        <vxe-column field="DeptCode" title="HIS科室编码" width="110" />
        <vxe-column field="AreaCode" title="库房/库区编码" width="130" />
        <vxe-column field="AreaName" title="库房/库区名称" width="150" />
        <vxe-column field="ChargeCode" title="计费编码" width="110" />
        <vxe-column field="ChargeName" title="品种名称" min-width="220" />
        <vxe-column field="Specification" title="规格" width="160" />
        <vxe-column field="Qty" title="入库数量" width="90" align="right" />
        <vxe-column field="InsertQty" title="插入数量" width="90" align="right" />
        <vxe-column field="OperateTimeText" title="入库时间" width="140" />
        <vxe-column field="OperatorName" title="操作人" width="100" />
        <vxe-column field="Batch" title="批号" width="120" />
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="spdInStockPreviewVisible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="syncingSpdInStock"
          :disabled="spdInStockPreviewLoading || !spdInStockRows.length"
          @click="confirmSyncSpdInStockRecords"
        >
          确认插入
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  importInitialInventory,
  previewHisChargeRecords,
  previewSpdInStockRecords,
  queryHisChargeSpdDeptRelations,
  querySpdInStockDeptRelations,
  queryWarehouseAreaOptions,
  syncHisChargeRecords as syncHisChargeRecordsApi,
  syncSpdInStockRecords as syncSpdInStockRecordsApi
} from '@/api/Inventory/WarehouseAreaThreeInventory';
import {
  areaTypeName,
  STOCK_DEDUCT_TYPE_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../utils';

const defaultWhere = () => ({
  AREA_CODE: '',
  CHARGE_CODE: '',
  BARCODE_NUMBER: '',
  VARIETIE_CODE_NEW: '',
  VARIETIE_NAME: '',
  SPECIFICATION_OR_TYPE: '',
  MANUFACTURING_ENT_NAME: '',
  STOCK_STATUS: '',
  STOCK_DEDUCT_TYPE: '',
  START_TIME: '',
  END_TIME: ''
});

const defaultHisPreviewQuery = () => ({
  AREA_CODE: '',
  SPD_DEPT_REL_IDS: [],
  END_TIME: ''
});

const defaultSpdInStockQuery = () => ({
  AREA_CODE: '',
  SPD_DEPT_REL_IDS: [],
  END_TIME: ''
});

export default {
  name: 'WarehouseAreaThreeInventorySearch',
  props: {
    exporting: Boolean,
    mode: { type: String, default: 'material' }
  },
  data() {
    return {
      where: defaultWhere(),
      warehouseOptions: [],
      warehouseLoading: false,
      hisSpdDeptRelations: [],
      hisSpdDeptRelationLoading: false,
      spdInStockDeptRelations: [],
      spdInStockDeptRelationLoading: false,
      importing: false,
      hisPreviewVisible: false,
      hisPreviewLoading: false,
      hisPreviewQuery: defaultHisPreviewQuery(),
      hisPreviewLoadedParams: null,
      hisPreviewRows: [],
      hisRepeatedRows: [],
      hisPreviewStats: {},
      syncingHisCharge: false,
      spdInStockPreviewVisible: false,
      spdInStockPreviewLoading: false,
      spdInStockQuery: defaultSpdInStockQuery(),
      spdInStockLoadedParams: null,
      spdInStockRows: [],
      spdInStockRepeatedRows: [],
      spdInStockStats: {},
      syncingSpdInStock: false,
      stockStatusOptions: STOCK_STATUS_OPTIONS,
      stockDeductTypeOptions: STOCK_DEDUCT_TYPE_OPTIONS
    };
  },
  computed: {
    hisPreviewAreaLabel() {
      const areaCode = this.hisPreviewQuery.AREA_CODE || '';
      const area = this.warehouseOptions.find((item) => String(item.VALUE) === areaCode);
      return area ? area.LABEL : areaCode;
    },
    spdInStockAreaLabel() {
      const areaCode = this.spdInStockQuery.AREA_CODE || '';
      const area = this.warehouseOptions.find((item) => String(item.VALUE) === areaCode);
      return area ? area.LABEL : areaCode;
    },
    modeSync: {
      get() {
        return this.mode;
      },
      set(value) {
        this.$emit('mode-change', value);
      }
    }
  },
  created() {
    this.loadWarehouseOptions('');
  },
  methods: {
    areaTypeName,
    // 组装主页面表格查询条件。
    getWhere() {
      return {
        AREA_CODE: this.where.AREA_CODE || '',
        CHARGE_CODE: this.where.CHARGE_CODE || '',
        BARCODE_NUMBER: this.where.BARCODE_NUMBER || '',
        VARIETIE_CODE_NEW: this.where.VARIETIE_CODE_NEW || '',
        VARIETIE_NAME: this.where.VARIETIE_NAME || '',
        SPECIFICATION_OR_TYPE: this.where.SPECIFICATION_OR_TYPE || '',
        MANUFACTURING_ENT_NAME: this.where.MANUFACTURING_ENT_NAME || '',
        STOCK_STATUS: this.where.STOCK_STATUS || '',
        STOCK_DEDUCT_TYPE: this.where.STOCK_DEDUCT_TYPE || '',
        START_TIME: this.where.START_TIME || '',
        END_TIME: this.where.END_TIME || ''
      };
    },
    // 触发表格查询。
    emitSearch() {
      if (this.mode === 'warehouse' && !this.where.AREA_CODE) {
        this.$message.warning('请选择库房/库区');
        return;
      }
      this.$emit('search', this.getWhere());
    },
    // 重置查询条件，保留当前库房/库区。
    reset() {
      const areaCode = this.mode === 'warehouse' ? this.where.AREA_CODE : '';
      this.where = { ...defaultWhere(), AREA_CODE: areaCode };
      this.emitSearch();
    },
    setAreaCode(areaCode) {
      this.where.AREA_CODE = areaCode || '';
    },
    // 主查询库房/库区变化时通知父组件刷新。
    onWarehouseChange() {
      this.resetHisChargePreview();
      this.resetSpdInStockPreview();
      const areaCode = String(this.where.AREA_CODE || '').trim();
      this.hisPreviewQuery.AREA_CODE = areaCode;
      this.spdInStockQuery.AREA_CODE = areaCode;
      this.loadHisChargeSpdDeptRelations(areaCode);
      this.loadSpdInStockDeptRelations(areaCode);
      this.$emit('warehouse-change', this.getWhere());
    },
    // 加载主查询库房/库区下拉选项。
    loadWarehouseOptions(keyword, autoSelect = false) {
      this.warehouseLoading = true;
      queryWarehouseAreaOptions(keyword || '')
        .then((res) => {
          this.warehouseOptions = res.result || [];
          if (autoSelect && !this.where.AREA_CODE && this.warehouseOptions.length) {
            this.where.AREA_CODE = String(this.warehouseOptions[0].VALUE);
            this.onWarehouseChange();
          }
        })
        .catch((err) => this.$message.error(err.message || '加载库房/库区失败'))
        .finally(() => {
          this.warehouseLoading = false;
        });
    },
    // HIS计费同步SPD科室变化后标记预览失效。
    onHisSpdDeptRelationChange(value) {
      this.hisPreviewQuery.SPD_DEPT_REL_IDS = this.normalizeRelationIds(value);
      this.hisPreviewLoadedParams = null;
    },
    // 统一SPD科室关系ID数组格式并去重。
    normalizeRelationIds(value) {
      const source = Array.isArray(value) ? value : value ? [value] : [];
      const ids = source.map((item) => String(item || '').trim()).filter(Boolean);
      return Array.from(new Set(ids));
    },
    // 格式化SPD科室关系下拉项，明确各关系使用的独立开始时间。
    hisSpdDeptRelationLabel(item) {
      const dept = item.DEPT_TWO_NAME || item.DEPT_TWO_CODE || '';
      const code = item.DEPT_TWO_NAME && item.DEPT_TWO_CODE ? `(${item.DEPT_TWO_CODE})` : '';
      const area = item.AREA_NAME || item.AREA_CODE || '';
      return `${dept}${code}${area ? ` | ${area}` : ''} - ${item.AUTO_STOCK_START_TIME || '未配置开始时间'}`;
    },
    // 只有完整日期时间格式的关系才能用于HIS同步。
    hasHisSpdDeptRelationStartTime(item) {
      return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(item?.AUTO_STOCK_START_TIME || '');
    },
    // 加载当前库房/库区下可用于HIS同步的SPD科室关系。
    async loadHisChargeSpdDeptRelations(areaCode) {
      const targetAreaCode = String(areaCode || '').trim();
      this.hisSpdDeptRelations = [];
      this.hisPreviewQuery.SPD_DEPT_REL_IDS = [];
      if (!targetAreaCode) return;
      this.hisSpdDeptRelationLoading = true;
      try {
        const res = await queryHisChargeSpdDeptRelations(targetAreaCode);
        this.hisSpdDeptRelations = res.result || [];
        this.hisPreviewQuery.SPD_DEPT_REL_IDS = this.hisSpdDeptRelations
          .filter((item) => this.hasHisSpdDeptRelationStartTime(item))
          .map((item) => String(item.ID));
      } catch (err) {
        this.$message.error(err.message || '加载SPD科室失败');
      } finally {
        this.hisSpdDeptRelationLoading = false;
      }
    },
    // 库房变更后清空此前HIS同步的科室、预览和统计信息。
    resetHisChargePreview() {
      this.hisPreviewQuery = defaultHisPreviewQuery();
      this.hisSpdDeptRelations = [];
      this.hisPreviewRows = [];
      this.hisRepeatedRows = [];
      this.hisPreviewStats = {};
      this.hisPreviewLoadedParams = null;
    },
    // SPD入库同步SPD科室变化后标记预览失效。
    onSpdInStockDeptRelationChange(value) {
      this.spdInStockQuery.SPD_DEPT_REL_IDS = this.normalizeRelationIds(value);
      this.spdInStockLoadedParams = null;
    },
    async loadSpdInStockDeptRelations(areaCode) {
      const targetAreaCode = String(areaCode || '').trim();
      this.spdInStockDeptRelations = [];
      this.spdInStockQuery.SPD_DEPT_REL_IDS = [];
      if (!targetAreaCode) return;
      this.spdInStockDeptRelationLoading = true;
      try {
        const res = await querySpdInStockDeptRelations(targetAreaCode);
        this.spdInStockDeptRelations = res.result || [];
        this.spdInStockQuery.SPD_DEPT_REL_IDS = this.spdInStockDeptRelations
          .filter((item) => this.hasHisSpdDeptRelationStartTime(item))
          .map((item) => String(item.ID));
      } catch (err) {
        this.$message.error(err.message || '加载SPD科室失败');
      } finally {
        this.spdInStockDeptRelationLoading = false;
      }
    },
    resetSpdInStockPreview() {
      this.spdInStockQuery = defaultSpdInStockQuery();
      this.spdInStockDeptRelations = [];
      this.spdInStockRows = [];
      this.spdInStockRepeatedRows = [];
      this.spdInStockStats = {};
      this.spdInStockLoadedParams = null;
    },
    // 将后端返回的已存在和重复记录合并成重复数据表格。
    buildRepeatedRows(result = {}, duplicateLabel = '重复') {
      const existingRows = (result.ExistingRows || []).map((item) => ({
        ...item,
        RepeatType: '已存在'
      }));
      const duplicateRows = (result.DuplicateRows || []).map((item) => ({
        ...item,
        RepeatType: duplicateLabel
      }));
      return existingRows.concat(duplicateRows);
    },
    // 打开初始化库存Excel文件选择框。
    chooseImportFile() {
      if (this.importing) return;
      this.$refs.importFile.value = '';
      this.$refs.importFile.click();
    },
    // 校验并上传初始化库存Excel。
    async onImportFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xls' && ext !== '.xlsx') {
        this.$message.warning('请选择Excel文件');
        e.target.value = '';
        return;
      }
      this.importing = true;
      try {
        const res = await importInitialInventory(file);
        this.$message.success(res.msg || '导入成功');
        this.$emit('import-success', this.getWhere());
      } catch (err) {
        this.$message.error(err.message || '导入失败');
      } finally {
        this.importing = false;
        e.target.value = '';
      }
    },
    // 打开HIS计费同步预览弹窗，并默认带入当前库房/库区。
    async openHisChargePreview() {
      if (this.syncingHisCharge) return;
      const areaCode = String(this.where.AREA_CODE || '').trim();
      if (!areaCode) {
        this.$message.warning('请先选择库房/库区');
        return;
      }
      this.hisPreviewVisible = true;
      if (this.hisPreviewQuery.AREA_CODE !== areaCode) {
        this.hisPreviewQuery = {
          ...defaultHisPreviewQuery(),
          AREA_CODE: areaCode
        };
        await this.loadHisChargeSpdDeptRelations(areaCode);
      }
      this.hisPreviewRows = [];
      this.hisRepeatedRows = [];
      this.hisPreviewStats = {};
      this.hisPreviewLoadedParams = null;
    },
    // 组装HIS计费同步请求参数。
    buildHisChargeSyncParams() {
      return {
        AREA_CODES: [this.hisPreviewQuery.AREA_CODE || ''].filter(Boolean),
        SPD_DEPT_REL_IDS: this.normalizeRelationIds(this.hisPreviewQuery.SPD_DEPT_REL_IDS),
        END_TIME: this.hisPreviewQuery.END_TIME || ''
      };
    },
    // 校验HIS计费同步必填条件。
    validateHisChargeSyncQuery() {
      if (!this.hisPreviewQuery.AREA_CODE) {
        this.$message.warning('请选择库房/库区');
        return false;
      }
      const selectedRelationIds = this.normalizeRelationIds(this.hisPreviewQuery.SPD_DEPT_REL_IDS);
      this.hisPreviewQuery.SPD_DEPT_REL_IDS = selectedRelationIds;
      if (!selectedRelationIds.length) {
        this.$message.warning('请选择SPD科室');
        return false;
      }
      return true;
    },
    // 查询HIS计费同步预览数据。
    async loadHisChargePreview() {
      if (this.hisPreviewLoading || this.syncingHisCharge) return;
      if (!this.validateHisChargeSyncQuery()) return;
      const params = this.buildHisChargeSyncParams();
      this.hisPreviewLoading = true;
      this.hisPreviewRows = [];
      this.hisRepeatedRows = [];
      this.hisPreviewStats = {};
      this.hisPreviewLoadedParams = null;
      try {
        const res = await previewHisChargeRecords(params);
        const result = res.result || {};
        this.hisPreviewStats = result;
        this.hisPreviewRows = result.Rows || [];
        this.hisRepeatedRows = this.buildRepeatedRows(result, 'HIS重复');
        this.hisPreviewLoadedParams = JSON.stringify(params);
        if (!this.hisPreviewRows.length) {
          this.$message.info(res.msg || '暂无本次可插入数据');
        }
      } catch (err) {
        this.$message.error(err.message || '预览失败');
      } finally {
        this.hisPreviewLoading = false;
      }
    },
    // 确认同步当前预览的HIS计费记录。
    async confirmSyncHisChargeRecords() {
      if (this.syncingHisCharge || !this.hisPreviewRows.length) return;
      if (!this.validateHisChargeSyncQuery()) return;
      const params = this.buildHisChargeSyncParams();
      if (this.hisPreviewLoadedParams !== JSON.stringify(params)) {
        this.$message.warning('同步条件已变更，请重新查询预览');
        return;
      }
      this.syncingHisCharge = true;
      try {
        const res = await syncHisChargeRecordsApi(params);
        this.$message.success(res.msg || '同步成功');
        this.hisPreviewVisible = false;
        this.$emit('import-success', {
          ...this.getWhere(),
          AREA_CODE: this.where.AREA_CODE || params.AREA_CODES[0] || ''
        });
      } catch (err) {
        this.$message.error(err.message || '同步失败');
      } finally {
        this.syncingHisCharge = false;
      }
    },
    // 打开SPD入库同步预览弹窗，并默认带入当前库房/库区。
    async openSpdInStockPreview() {
      if (this.syncingSpdInStock) return;
      const areaCode = String(this.where.AREA_CODE || '').trim();
      if (!areaCode) {
        this.$message.warning('请先选择库房/库区');
        return;
      }
      this.spdInStockPreviewVisible = true;
      if (this.spdInStockQuery.AREA_CODE !== areaCode) {
        this.spdInStockQuery = { ...defaultSpdInStockQuery(), AREA_CODE: areaCode };
        await this.loadSpdInStockDeptRelations(areaCode);
      }
      this.spdInStockRows = [];
      this.spdInStockRepeatedRows = [];
      this.spdInStockStats = {};
      this.spdInStockLoadedParams = null;
    },
    // 组装SPD入库同步请求参数。
    buildSpdInStockSyncParams() {
      return {
        AREA_CODES: [this.spdInStockQuery.AREA_CODE || ''].filter(Boolean),
        SPD_DEPT_REL_IDS: this.normalizeRelationIds(this.spdInStockQuery.SPD_DEPT_REL_IDS),
        END_TIME: this.spdInStockQuery.END_TIME || ''
      };
    },
    // 校验SPD入库同步必填条件。
    validateSpdInStockQuery() {
      if (!this.spdInStockQuery.AREA_CODE) {
        this.$message.warning('请选择库房/库区');
        return false;
      }
      this.spdInStockQuery.SPD_DEPT_REL_IDS = this.normalizeRelationIds(this.spdInStockQuery.SPD_DEPT_REL_IDS);
      if (!this.spdInStockQuery.SPD_DEPT_REL_IDS.length) {
        this.$message.warning('请选择SPD科室');
        return false;
      }
      return true;
    },
    // 查询SPD入库同步预览数据。
    async loadSpdInStockPreview() {
      if (this.spdInStockPreviewLoading || this.syncingSpdInStock) return;
      if (!this.validateSpdInStockQuery()) return;
      const params = this.buildSpdInStockSyncParams();
      this.spdInStockPreviewLoading = true;
      this.spdInStockRows = [];
      this.spdInStockRepeatedRows = [];
      this.spdInStockStats = {};
      this.spdInStockLoadedParams = null;
      try {
        const res = await previewSpdInStockRecords(params);
        const result = res.result || {};
        this.spdInStockStats = result;
        this.spdInStockRows = result.Rows || [];
        this.spdInStockRepeatedRows = this.buildRepeatedRows(result, 'SPD重复');
        this.spdInStockLoadedParams = JSON.stringify(params);
        if (!this.spdInStockRows.length) {
          this.$message.info(res.msg || '暂无本次可插入数据');
        }
      } catch (err) {
        this.$message.error(err.message || '预览失败');
      } finally {
        this.spdInStockPreviewLoading = false;
      }
    },
    // 确认同步当前预览的SPD入库记录。
    async confirmSyncSpdInStockRecords() {
      if (this.syncingSpdInStock || !this.spdInStockRows.length) return;
      if (!this.validateSpdInStockQuery()) return;
      const params = this.buildSpdInStockSyncParams();
      if (this.spdInStockLoadedParams !== JSON.stringify(params)) {
        this.$message.warning('同步条件已变更，请重新查询预览');
        return;
      }
      this.syncingSpdInStock = true;
      try {
        const res = await syncSpdInStockRecordsApi(params);
        this.$message.success(res.msg || '同步成功');
        this.spdInStockPreviewVisible = false;
        this.$emit('import-success', {
          ...this.getWhere(),
          AREA_CODE: this.where.AREA_CODE || params.AREA_CODES[0] || ''
        });
      } catch (err) {
        this.$message.error(err.message || '同步失败');
      } finally {
        this.syncingSpdInStock = false;
      }
    }
  }
};
</script>

<style scoped>
.warehouse-area-search .warehouse-select {
  width: 230px;
}

.warehouse-area-search .query-input {
  width: 130px;
}

.warehouse-area-search .query-select {
  width: 110px;
}

.warehouse-area-search .date-range {
  width: 240px;
}

.warehouse-area-search .option-type {
  float: right;
  color: #909399;
  font-size: 12px;
}

.warehouse-area-search .hidden-file {
  display: none;
}

.his-preview-query {
  margin-bottom: 8px;
}

.his-preview-warehouse {
  width: 230px;
}

.his-preview-dept {
  width: 350px;
}

.his-preview-time {
  width: 190px;
}

.his-preview-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-bottom: 10px;
  color: #606266;
  font-size: 12px;
  line-height: 20px;
}

.his-preview-table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 6px;
  color: #303133;
  font-size: 13px;
  font-weight: 600;
}

.his-preview-table-title--repeat {
  margin-top: 12px;
}

.warehouse-area-search :deep(.el-form-item) {
  margin-bottom: 8px;
}
</style>
