<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <!-- 常显条件：始终保留，展开高级时不隐藏 -->
        <el-form-item label="品种">
          <el-input
            v-model="where.xsearchinplt1"
            clearable
            placeholder="规格/编码/全称"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="科室/供应商">
          <el-input
            v-model="where.xsearchinplt2"
            clearable
            placeholder="名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="生产批号">
          <el-input
            v-model="where.xsearchinplt3"
            clearable
            placeholder="生产批号"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="出库类型">
          <el-input
            v-model="where.xsearchinplt4"
            clearable
            placeholder="出库类型"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item v-if="isSzseOrderJs" label="结算类型">
          <el-select v-model="where.orderJsType" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="普通" value="0" />
            <el-option label="临购" value="1" />
            <el-option label="临购初始化（医院货主）" value="2" />
            <el-option label="原HERP库存初始化（医院货主）" value="3" />
            <el-option label="经费入库" value="4" />
            <el-option label="初始化一出已结算" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库单号">
          <el-input
            v-model="where.xsearchinplt5"
            clearable
            placeholder="出库单号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="where.xsearchinplt6"
            clearable
            placeholder="生产企业"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="where.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            style="width: 140px"
          />
          <span class="date-sep">至</span>
          <el-date-picker
            v-model="where.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">
            查询
          </el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportByHw">
            导出（货位）
          </el-button>
          <el-button type="primary" icon="el-icon-tickets" @click="openOrderFlow">
            订单流水查询
          </el-button>
          <el-button
            v-if="canShowExcel"
            type="primary"
            icon="el-icon-document"
            @click="exportExcel"
          >
            导出Excel(新)
          </el-button>
          <el-button
            v-if="isBdrm"
            type="primary"
            icon="el-icon-finished"
            @click="openOutCheck"
          >
            出库复核记录
          </el-button>
          <el-button
            v-if="isBdrm"
            type="primary"
            icon="el-icon-s-data"
            @click="aggregateExport"
          >
            汇总导出
          </el-button>
          <el-button @click="showAdvanced = !showAdvanced">
            {{ showAdvanced ? '隐藏高级条件' : '显示高级条件' }}
          </el-button>
        </el-form-item>

        <!-- 高级条件：追加在下方，不替换常显条件 -->
        <div v-show="showAdvanced" class="advanced-row">
          <el-form-item label="是否收费">
            <el-select v-model="where.isCharge" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="高低值">
            <el-select v-model="where.highOrLowClass" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="低值" value="0" />
              <el-option label="高值" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否中标">
            <el-select v-model="where.isBidding" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不中标" value="0" />
              <el-option label="中标" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="专购">
            <el-select v-model="where.specialPurchase" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="非专购" value="0" />
              <el-option label="专购" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="灭菌包装">
            <el-select
              v-model="where.oneoffSterilizationPackaging"
              style="width: 90px"
            >
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="存储条件">
            <el-select v-model="where.storageType" style="width: 110px">
              <el-option label="全部" value="-1" />
              <el-option label="常温" value="0" />
              <el-option label="阴凉" value="1" />
              <el-option label="冷藏" value="2" />
              <el-option label="冷冻" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否植入">
            <el-select v-model="where.isEmbedded" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不植入" value="0" />
              <el-option label="植入" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="SN码">
            <el-select v-model="where.isSerialNumber" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="防护物质">
            <el-select v-model="where.isProtect" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不是" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否介入">
            <el-select v-model="where.isIntervened" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="不介入" value="0" />
              <el-option label="介入" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="下级分类">
            <el-select v-model="where.highOrLowClassTwo" style="width: 110px">
              <el-option label="全部" value="-1" />
              <el-option label="重点治理" value="1" />
              <el-option label="非重点治理" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备科修改">
            <el-select v-model="where.change" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="院区">
            <el-select
              v-model="where.repositoryFrom"
              clearable
              placeholder="全部"
              style="width: 140px"
            >
              <el-option label="全部" value="-1" />
              <el-option
                v-for="item in storageOptions"
                :key="item.id"
                :label="item.name"
                :value="String(item.id)"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  isSzseOrderJs,
  isBdrm,
  canShowOutExcelBtn,
  defaultOutDateRange
} from '../utils';
import { getSTORAGE } from '@/api/Inventory/Goodsshelves';

export default {
  name: 'GoodsshelvesOutSearch',
  data() {
    return {
      isSzseOrderJs,
      isBdrm,
      showAdvanced: false,
      storageOptions: [],
      defaultWhere: {
        isCharge: '-1',
        highOrLowClass: '-1',
        isBidding: '-1',
        specialPurchase: '-1',
        oneoffSterilizationPackaging: '-1',
        storageType: '-1',
        isEmbedded: '-1',
        isSerialNumber: '-1',
        isProtect: '-1',
        isIntervened: '-1',
        highOrLowClassTwo: '-1',
        change: '-1',
        repositoryFrom: '-1',
        orderJsType: '',
        xsearchinplt1: '',
        xsearchinplt2: '',
        xsearchinplt3: '',
        xsearchinplt4: '',
        xsearchinplt5: '',
        xsearchinplt6: '',
        start_time: '',
        end_time: ''
      },
      where: {}
    };
  },
  computed: {
    canShowExcel() {
      return canShowOutExcelBtn();
    }
  },
  created() {
    this.initDefaultDate();
    this.loadStorage();
  },
  mounted() {
    this.search();
  },
  methods: {
    initDefaultDate() {
      const [start, end] = defaultOutDateRange();
      this.where = {
        ...this.defaultWhere,
        start_time: start,
        end_time: end
      };
    },
    async loadStorage() {
      try {
        const res = await getSTORAGE();
        this.storageOptions = (res.result || []).map((x) => ({
          id: x.ID,
          name: x.NAME
        }));
        this.$emit('storageLoaded', this.storageOptions);
      } catch (e) {
        // ignore
      }
    },
    search() {
      this.$emit('search', { ...this.where });
    },
    reset() {
      this.initDefaultDate();
      this.search();
    },
    exportByHw() {
      this.$emit('exportByHw', { ...this.where });
    },
    exportExcel() {
      this.$emit('exportExcel', { ...this.where });
    },
    openOrderFlow() {
      this.$emit('openOrderFlow');
    },
    openOutCheck() {
      this.$emit('openOutCheck');
    },
    aggregateExport() {
      this.$emit('aggregateExport', { ...this.where });
    }
  }
};
</script>

<style scoped>
.advanced-row {
  display: block;
  width: 100%;
  margin-top: 6px;
}

.date-sep {
  margin: 0 6px;
  color: #606266;
}
</style>
