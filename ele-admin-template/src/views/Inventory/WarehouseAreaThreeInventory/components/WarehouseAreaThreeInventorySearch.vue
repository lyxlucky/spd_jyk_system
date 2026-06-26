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
            v-model="where.WAREHOUSE_AREA_ID"
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
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { queryWarehouseAreaOptions } from '@/api/Inventory/WarehouseAreaThreeInventory';
import {
  areaTypeName,
  STOCK_DEDUCT_TYPE_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../utils';

const defaultWhere = () => ({
  WAREHOUSE_AREA_ID: '',
  CHARGE_CODE: '',
  VARIETIE_CODE_NEW: '',
  VARIETIE_NAME: '',
  SPECIFICATION_OR_TYPE: '',
  MANUFACTURING_ENT_NAME: '',
  STOCK_STATUS: '',
  STOCK_DEDUCT_TYPE: '',
  DATE_RANGE: []
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
        WAREHOUSE_AREA_ID: this.where.WAREHOUSE_AREA_ID || '',
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
      if (!this.where.WAREHOUSE_AREA_ID) {
        this.$message.warning('请选择库房/库区');
        return;
      }
      this.$emit('search', this.getWhere());
    },
    reset() {
      const warehouseAreaId = this.where.WAREHOUSE_AREA_ID;
      this.where = { ...defaultWhere(), WAREHOUSE_AREA_ID: warehouseAreaId };
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
          if (autoSelect && !this.where.WAREHOUSE_AREA_ID && this.warehouseOptions.length) {
            this.where.WAREHOUSE_AREA_ID = String(this.warehouseOptions[0].VALUE);
            this.onWarehouseChange();
          }
        })
        .catch((err) => this.$message.error(err.message || '加载库房/库区失败'))
        .finally(() => {
          this.warehouseLoading = false;
        });
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

.warehouse-area-search :deep(.el-form-item) {
  margin-bottom: 8px;
}
</style>
