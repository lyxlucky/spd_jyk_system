<template>
  <div class="spd-panel spd-panel--search inv-query-search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form size="mini" inline @submit.native.prevent>
        <!-- 第一行：基础检索 -->
        <div class="filter-row">
          <el-form-item label="品种">
            <el-input
              v-model="localWhere.varietie"
              clearable
              placeholder="编码/全称"
              style="width: 130px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input
              v-model="localWhere.supplier"
              clearable
              style="width: 120px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="生产批号">
            <el-input
              v-model="localWhere.batch"
              clearable
              style="width: 100px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="分类属性">
            <el-input
              v-model="localWhere.classificName"
              clearable
              style="width: 100px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="生产企业">
            <el-input
              v-model="localWhere.manuEntName"
              clearable
              style="width: 110px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="注册证">
            <el-input
              v-model="localWhere.approvalNumber"
              clearable
              style="width: 110px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="有效到期">
            <el-date-picker
              v-model="localWhere.validDateFrom"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="localWhere.validDateTo"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
          <div class="validity-legend">
            <span class="legend-label">有效期状态：</span>
            <span class="legend-item"><i class="dot dot-expired" />已过期</span>
            <span class="legend-item"><i class="dot dot-15" />≤15天</span>
            <span class="legend-item"><i class="dot dot-90" />≤90天</span>
            <span class="legend-item"><i class="dot dot-ok" />&gt;90天</span>
          </div>
        </div>

        <!-- 第一行工具栏 -->
        <div class="toolbar-row">
          <el-button size="mini" @click="syncAndEmit('summary')">汇总</el-button>
          <el-button size="mini" @click="syncAndEmit('supplier-summary')">供应商汇总</el-button>
          <el-button size="mini" @click="toggleAdvanced">
            {{ showAdvanced ? '隐藏' : '显示' }}搜索条件
          </el-button>
          <el-button
            v-if="canExportCenterDefs"
            size="mini"
            :loading="exportingCenterDefs"
            @click="syncAndEmit('export-center-defs')"
          >
            导出中心库定数码库存
          </el-button>
          <el-button
            v-if="canExportExcel"
            size="mini"
            :loading="exportingExcel"
            @click="syncAndEmit('export-excel')"
          >
            导出Excel
          </el-button>
          <el-button size="mini" @click="syncAndEmit('move-goods', 'qualified')">移至合格区</el-button>
          <el-button size="mini" @click="syncAndEmit('move-goods', 'unqualified')">
            移至不合格区
          </el-button>
        </div>

        <!-- 第二行：仓库/区域检索 -->
        <div class="filter-row">
          <el-form-item label="库存位置">
            <el-autocomplete
              v-model="localWhere.sourceFrom"
              :fetch-suggestions="querySourceFrom"
              clearable
              placeholder="库存位置"
              style="width: 120px"
            />
          </el-form-item>
          <el-form-item label="货位号">
            <el-input
              v-model="localWhere.position"
              clearable
              style="width: 90px"
              @keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item label="院区">
            <el-select v-model="localWhere.storageId" clearable placeholder="全部" style="width: 110px">
              <el-option label="全部" value="" />
              <el-option
                v-for="s in storageList"
                :key="s.ID"
                :label="s.NAME"
                :value="String(s.ID)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-select
              v-model="localWhere.upShelfState"
              clearable
              placeholder="全部"
              style="width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="合格区" value="1" />
              <el-option label="普通隔离区" value="6" />
              <el-option label="防疫物资区" value="11" />
              <el-option label="不合格区" value="7" />
              <el-option label="盘损隔离区" value="8" />
              <el-option label="应急库" value="9" />
              <el-option label="拣配区" value="2" />
              <el-option label="待审核上架" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同到期">
            <el-select v-model="localWhere.conTime" clearable placeholder="全部" style="width: 90px">
              <el-option label="全部" value="" />
              <el-option label="过期" value="1" />
              <el-option label="未过期" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="货票同行">
            <el-select v-model="localWhere.isHptx" clearable placeholder="全部" style="width: 80px">
              <el-option label="全部" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="条数">
            <el-input-number
              v-model="localWhere.exportLimit"
              :min="1"
              :max="9999"
              :controls="false"
              style="width: 70px"
            />
          </el-form-item>
          <el-form-item label="散货总数">
            <span class="stat-text">{{ sumText }}</span>
          </el-form-item>
          <el-form-item label="合计金额">
            <span class="stat-text">{{ amountSumText }}</span>
          </el-form-item>
        </div>

        <!-- 第二行工具栏 -->
        <div class="toolbar-row toolbar-row--secondary">
          <el-button size="mini" @click="syncAndEmit('update-storage')">修改库区</el-button>
          <el-button size="mini" :loading="generating" @click="syncAndEmit('generate-stock')">
            生成盘点数据
          </el-button>
          <el-button size="mini" @click="syncAndEmit('center-check')">中心库盘点</el-button>
          <el-button
            v-if="canExportInventory"
            size="mini"
            :loading="exportingInventory"
            @click="syncAndEmit('export-inventory')"
          >
            中心库导出
          </el-button>
          <el-button size="mini" @click="syncAndEmit('update-goods-position')">修改货位号</el-button>
          <el-button size="mini" @click="syncAndEmit('move-goods', 'insulated')">
            移至普通隔离区
          </el-button>
          <el-button size="mini" @click="syncAndEmit('update-var-type')">修改物资类型</el-button>
          <el-button size="mini" @click="syncAndEmit('move-goods', 'fangyi')">
            移至防疫物资区
          </el-button>
          <el-button size="mini" @click="syncAndEmit('move-goods', 'emergency')">
            移至应急库区
          </el-button>
          <el-button
            v-if="showAdjustDebit"
            size="mini"
            @click="syncAndEmit('move-goods', 'adjustDebit')"
          >
            移至盘损隔离区
          </el-button>
          <el-button size="mini" @click="syncAndEmit('lock-view', 'goods')">查看散货锁定</el-button>
          <el-button size="mini" @click="syncAndEmit('lock-view', 'def')">查看定数包锁定</el-button>
          <el-button size="mini" @click="syncAndEmit('lock-view', 'prelock')">
            查看定数包预锁
          </el-button>
        </div>

        <!-- 高级搜索条件：展开后占用搜索区自身高度，把列表整体下推 -->
        <div v-show="showAdvanced" ref="advancedRef" class="advanced-filters">
          <el-form-item label="是否计费">
            <el-select v-model="localWhere.isCharge" style="width: 80px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="高低值">
            <el-select v-model="localWhere.highOrLowClass" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option
                v-for="o in highLowOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否中标">
            <el-select v-model="localWhere.isBidding" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不中标" value="0" />
              <el-option label="中标" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="专购">
            <el-select v-model="localWhere.specialPurchase" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="非专购" value="0" />
              <el-option label="专购" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="灭菌包装">
            <el-select v-model="localWhere.oneoffSterilizationPackaging" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="存储条件">
            <el-select v-model="localWhere.storageType" style="width: 100px">
              <el-option label="全部" value="-1" />
              <el-option label="常温" value="0" />
              <el-option label="阴凉" value="1" />
              <el-option label="冷藏" value="2" />
              <el-option label="冷冻" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否植入">
            <el-select v-model="localWhere.isEmbedded" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不植入" value="0" />
              <el-option label="植入" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="SN码">
            <el-select v-model="localWhere.isSerialNumber" style="width: 80px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="防护物质">
            <el-select v-model="localWhere.isProtect" style="width: 80px">
              <el-option label="全部" value="-1" />
              <el-option label="不是" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否介入">
            <el-select v-model="localWhere.isIntervened" style="width: 80px">
              <el-option label="全部" value="-1" />
              <el-option label="不介入" value="0" />
              <el-option label="介入" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="下级分类">
            <el-select
              v-model="localWhere.highOrLowClassTwo"
              clearable
              placeholder="全部"
              style="width: 110px"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="o in highLowTwoOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { hasExportPermission } from '../utils';

export default {
  name: 'InvQueryMainSearch',
  props: {
    where: { type: Object, required: true },
    storageList: { type: Array, default: () => [] },
    sourceFromList: { type: Array, default: () => [] },
    highLowConfig: { type: Object, default: () => ({}) },
    sum: { type: [Number, String], default: 0 },
    amountSum: { type: [Number, String], default: 0 },
    showAdjustDebit: { type: Boolean, default: false },
    exportingExcel: { type: Boolean, default: false },
    exportingCenterDefs: { type: Boolean, default: false },
    exportingInventory: { type: Boolean, default: false },
    generating: { type: Boolean, default: false }
  },
  data() {
    return {
      showAdvanced: false,
      localWhere: {}
    };
  },
  created() {
    this.localWhere = { ...this.where };
  },
  computed: {
    sumText() {
      return this.sum != null && this.sum !== '' ? String(this.sum) : '0';
    },
    amountSumText() {
      return this.amountSum != null && this.amountSum !== '' ? String(this.amountSum) : '0';
    },
    canExportCenterDefs() {
      return hasExportPermission('export-InventoryQueryNewZxkdsm');
    },
    canExportExcel() {
      return hasExportPermission('export-InventoryQueryNewDcec');
    },
    canExportInventory() {
      return hasExportPermission('export-InventoryQueryNewZxk');
    },
    highLowOptions() {
      return (this.highLowConfig?.HIGH_OR_LOW_CLASS || []).map((i) => ({
        label: i.OPTION_TEXT || i.text || i.OPTION_VALUE,
        value: String(i.OPTION_VALUE ?? i.value ?? '')
      }));
    },
    highLowTwoOptions() {
      return (this.highLowConfig?.HIGH_OR_LOW_CLASS_TWO || []).map((i) => ({
        label: i.OPTION_TEXT || i.text || i.OPTION_VALUE,
        value: String(i.OPTION_VALUE ?? i.value ?? '')
      }));
    }
  },
  watch: {
    where: {
      deep: true,
      handler(val) {
        this.localWhere = { ...val };
      }
    }
  },
  methods: {
    syncWhere() {
      this.$emit('update:where', { ...this.localWhere });
    },
    syncAndEmit(event, ...args) {
      this.syncWhere();
      this.$emit(event, ...args);
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
      this.$emit('advanced-change', this.showAdvanced);
      this.$nextTick(() => {
        if (this.showAdvanced && this.$refs.advancedRef) {
          this.$refs.advancedRef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    search() {
      this.syncWhere();
      this.$emit('search');
    },
    querySourceFrom(query, cb) {
      const list = [
        '院内中心库',
        ...(this.sourceFromList || []).map((d) => d.Dept_Two_Name || d)
      ];
      const q = (query || '').toLowerCase();
      const hits = list
        .filter((n) => !q || String(n).toLowerCase().includes(q))
        .map((n) => ({ value: n }));
      cb(hits);
    }
  }
};
</script>

<style scoped>
.inv-query-search {
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  overflow: visible;
  background: #fff;
}
.inv-query-search .spd-panel__body {
  overflow: visible;
}
.inv-query-search .filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 4px;
}
.inv-query-search .toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 4px 0 8px;
  align-items: center;
}
.inv-query-search .toolbar-row--secondary {
  margin-bottom: 4px;
}
.inv-query-search .advanced-filters {
  clear: both;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 4px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 10px 8px 2px;
  border-top: 1px dashed #dcdfe6;
  background: #fafbfc;
  border-radius: 0 0 4px 4px;
  position: relative;
  z-index: 6;
}
.validity-legend {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1px solid #ddd;
}
.dot-expired {
  background: #ff0000;
  border-color: #ff0000;
}
.dot-15 {
  background: rgba(255, 165, 0, 0.5);
  border-color: #ffa500;
}
.dot-90 {
  background: rgba(255, 255, 0, 0.5);
  border-color: #ffaa00;
}
.dot-ok {
  background: #fff;
}
.stat-text {
  font-weight: 600;
  color: #009688;
}
</style>
