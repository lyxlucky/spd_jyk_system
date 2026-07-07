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
        <el-form-item label="库房/库区">
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
            v-model="where.DATE_RANGE"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-range"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="emitSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="success" icon="el-icon-download" :loading="exporting" @click="$emit('export')">
            导出
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-upload2"
            :loading="importing"
            @click="chooseImportFile"
          >
            初始化库存
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-connection"
            :loading="syncingHisCharge"
            @click="openHisChargePreview"
          >
            同步HIS计费记录
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
          <el-select
            v-model="hisPreviewQuery.AREA_CODES"
            multiple
            filterable
            remote
            clearable
            collapse-tags
            reserve-keyword
            placeholder="请选择库房/库区"
            :remote-method="loadHisWarehouseOptions"
            :loading="hisWarehouseLoading"
            class="his-preview-warehouse"
            @change="onHisWarehouseChange"
          >
            <el-option
              v-for="item in hisWarehouseOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="String(item.VALUE)"
            >
              <span>{{ item.LABEL }}</span>
              <span class="option-type">{{ areaTypeName(item.TYPE) }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="hisPreviewQuery.START_TIME"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
            class="his-preview-time"
          />
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
  </div>
</template>

<script>
import {
  importInitialInventory,
  previewHisChargeRecords,
  queryWarehouseAreaOptions,
  syncHisChargeRecords as syncHisChargeRecordsApi
} from '@/api/Inventory/WarehouseAreaThreeInventory';
import {
  areaTypeName,
  STOCK_DEDUCT_TYPE_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../utils';

const defaultWhere = () => ({
  AREA_CODE: '',
  CHARGE_CODE: '',
  VARIETIE_CODE_NEW: '',
  VARIETIE_NAME: '',
  SPECIFICATION_OR_TYPE: '',
  MANUFACTURING_ENT_NAME: '',
  STOCK_STATUS: '',
  STOCK_DEDUCT_TYPE: '',
  DATE_RANGE: []
});

const defaultHisPreviewQuery = () => ({
  AREA_CODES: [],
  START_TIME: '',
  END_TIME: ''
});

export default {
  name: 'WarehouseAreaThreeInventorySearch',
  props: {
    exporting: Boolean
  },
  data() {
    return {
      where: defaultWhere(),
      warehouseOptions: [],
      warehouseLoading: false,
      hisWarehouseOptions: [],
      hisWarehouseLoading: false,
      importing: false,
      hisPreviewVisible: false,
      hisPreviewLoading: false,
      hisPreviewQuery: defaultHisPreviewQuery(),
      hisPreviewLoadedParams: null,
      hisPreviewRows: [],
      hisRepeatedRows: [],
      hisPreviewStats: {},
      syncingHisCharge: false,
      stockStatusOptions: STOCK_STATUS_OPTIONS,
      stockDeductTypeOptions: STOCK_DEDUCT_TYPE_OPTIONS
    };
  },
  created() {
    this.loadWarehouseOptions('', true);
  },
  methods: {
    areaTypeName,
    getWhere() {
      const range = this.where.DATE_RANGE || [];
      return {
        AREA_CODE: this.where.AREA_CODE || '',
        CHARGE_CODE: this.where.CHARGE_CODE || '',
        VARIETIE_CODE_NEW: this.where.VARIETIE_CODE_NEW || '',
        VARIETIE_NAME: this.where.VARIETIE_NAME || '',
        SPECIFICATION_OR_TYPE: this.where.SPECIFICATION_OR_TYPE || '',
        MANUFACTURING_ENT_NAME: this.where.MANUFACTURING_ENT_NAME || '',
        STOCK_STATUS: this.where.STOCK_STATUS || '',
        STOCK_DEDUCT_TYPE: this.where.STOCK_DEDUCT_TYPE || '',
        START_TIME: range[0] || '',
        END_TIME: range[1] || ''
      };
    },
    emitSearch() {
      if (!this.where.AREA_CODE) {
        this.$message.warning('请选择库房/库区');
        return;
      }
      this.$emit('search', this.getWhere());
    },
    reset() {
      const areaCode = this.where.AREA_CODE;
      this.where = { ...defaultWhere(), AREA_CODE: areaCode };
      this.emitSearch();
    },
    onWarehouseChange() {
      this.$emit('warehouse-change', this.getWhere());
    },
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
    normalizeAreaCodes(value) {
      const source = Array.isArray(value) ? value : value ? [value] : [];
      const codes = source.map((item) => String(item || '').trim()).filter(Boolean);
      return Array.from(new Set(codes));
    },
    mergeWarehouseOptions(options, selectedAreaCodes) {
      const optionMap = new Map();
      const addOption = (item) => {
        if (!item || item.VALUE == null) return;
        optionMap.set(String(item.VALUE), { ...item, VALUE: String(item.VALUE) });
      };
      (this.hisWarehouseOptions || []).forEach(addOption);
      (options || []).forEach(addOption);
      (this.warehouseOptions || []).forEach((item) => {
        if (selectedAreaCodes.includes(String(item.VALUE))) addOption(item);
      });
      return Array.from(optionMap.values());
    },
    loadHisWarehouseOptions(keyword) {
      const selectedAreaCodes = this.normalizeAreaCodes(this.hisPreviewQuery.AREA_CODES);
      this.hisWarehouseLoading = true;
      queryWarehouseAreaOptions(keyword || '')
        .then((res) => {
          this.hisWarehouseOptions = this.mergeWarehouseOptions(res.result || [], selectedAreaCodes);
        })
        .catch((err) => this.$message.error(err.message || '加载库房/库区失败'))
        .finally(() => {
          this.hisWarehouseLoading = false;
        });
    },
    onHisWarehouseChange(value) {
      this.hisPreviewQuery.AREA_CODES = this.normalizeAreaCodes(value);
      this.hisPreviewLoadedParams = null;
    },
    buildHisRepeatedRows(result = {}) {
      const existingRows = (result.ExistingRows || []).map((item) => ({
        ...item,
        RepeatType: '已存在'
      }));
      const duplicateRows = (result.DuplicateRows || []).map((item) => ({
        ...item,
        RepeatType: 'HIS重复'
      }));
      return existingRows.concat(duplicateRows);
    },
    chooseImportFile() {
      if (this.importing) return;
      this.$refs.importFile.value = '';
      this.$refs.importFile.click();
    },
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
    async openHisChargePreview() {
      if (this.syncingHisCharge) return;
      const selectedAreaCodes = this.normalizeAreaCodes(this.where.AREA_CODE);
      this.hisPreviewVisible = true;
      this.hisPreviewQuery = {
        ...defaultHisPreviewQuery(),
        AREA_CODES: selectedAreaCodes
      };
      this.hisWarehouseOptions = this.mergeWarehouseOptions(this.warehouseOptions, selectedAreaCodes);
      this.hisPreviewRows = [];
      this.hisRepeatedRows = [];
      this.hisPreviewStats = {};
      this.hisPreviewLoadedParams = null;
      this.loadHisWarehouseOptions('');
    },
    buildHisChargeSyncParams() {
      const areaCodes = this.normalizeAreaCodes(this.hisPreviewQuery.AREA_CODES);
      return {
        AREA_CODES: areaCodes,
        START_TIME: this.hisPreviewQuery.START_TIME || '',
        END_TIME: this.hisPreviewQuery.END_TIME || ''
      };
    },
    validateHisChargeSyncQuery() {
      const selectedAreaCodes = this.normalizeAreaCodes(this.hisPreviewQuery.AREA_CODES);
      this.hisPreviewQuery.AREA_CODES = selectedAreaCodes;
      if (!selectedAreaCodes.length) {
        this.$message.warning('请选择库房/库区');
        return false;
      }
      if (!this.hisPreviewQuery.START_TIME) {
        this.$message.warning('请选择开始时间');
        return false;
      }
      return true;
    },
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
        this.hisRepeatedRows = this.buildHisRepeatedRows(result);
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
  width: 320px;
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
