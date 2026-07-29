<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form size="mini" :inline="true" @keyup.enter.native="search" @submit.native.prevent>
        <el-form-item label="品种">
          <el-input v-model="where.inventoryNew_search1" clearable placeholder="编码/全称" style="width: 130px" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="where.inventoryNew_search2" clearable placeholder="供应商" style="width: 120px" />
        </el-form-item>
        <el-form-item label="生产批号">
          <el-input v-model="where.inventoryNew_search3" clearable placeholder="生产批号" style="width: 100px" />
        </el-form-item>
        <el-form-item label="分类属性">
          <el-input v-model="where.inventoryNew_classificName" clearable placeholder="分类属性" style="width: 100px" />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input v-model="where.inventoryNew_search5" clearable placeholder="生产企业" style="width: 110px" />
        </el-form-item>
        <el-form-item label="注册证">
          <el-input v-model="where.inventoryNew_APPROVAL_NUMBER" clearable placeholder="注册证" style="width: 110px" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="where.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="where.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-form-item>
        <br />
        <el-form-item label="库存位置">
          <el-input v-model="where.inventoryNew_search4" clearable placeholder="库存位置" style="width: 100px" />
        </el-form-item>
        <el-form-item label="货位号">
          <el-input v-model="where.inventory_Position" clearable placeholder="货位号" style="width: 90px" />
        </el-form-item>
        <el-form-item label="院区">
          <el-select v-model="where.STORAGE_ID" clearable placeholder="全部" style="width: 110px">
            <el-option label="全部" value="" />
            <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-select v-model="where.UpShelfState" clearable placeholder="全部" style="width: 110px">
            <el-option label="全部" value="" />
            <el-option label="合格区" value="1" />
            <el-option label="普通隔离区" value="6" />
            <el-option label="防疫物资区" value="11" />
            <el-option label="不合格区" value="7" />
            <el-option label="盘损隔离区" value="8" />
            <el-option label="应急库" value="9" />
            <el-option label="拣配区" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同到期">
          <el-select v-model="where.conTime" clearable placeholder="全部" style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="过期" value="1" />
            <el-option label="未过期" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="货票同行">
          <el-select v-model="where.hptx" clearable placeholder="全部" style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否计费">
          <el-select v-model="where.isCharge" style="width: 80px">
            <el-option label="全部" value="-1" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <br />
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
          <el-select v-model="where.oneoffSterilizationPackaging" style="width: 90px">
            <el-option label="全部" value="-1" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="存储条件">
          <el-select v-model="where.storageType" style="width: 100px">
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
        <br />
        <el-form-item label="SN码">
          <el-select v-model="where.isSerialNumber" style="width: 80px">
            <el-option label="全部" value="-1" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="防护物质">
          <el-select v-model="where.isProtect" style="width: 80px">
            <el-option label="全部" value="-1" />
            <el-option label="不是" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否介入">
          <el-select v-model="where.isIntervened" style="width: 80px">
            <el-option label="全部" value="-1" />
            <el-option label="不介入" value="0" />
            <el-option label="介入" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="下级分类">
          <el-select v-model="where.highOrLowClassTwo2" clearable placeholder="全部" style="width: 110px">
            <el-option label="全部" value="" />
            <el-option label="重点治理" value="1" />
            <el-option label="非重点治理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="散货总数">
          <span class="stat-text">{{ sumText }}</span>
        </el-form-item>
        <el-form-item label="合计金额">
          <span class="stat-text">{{ amountSumText }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getStorageList } from '@/api/Inventory/InventoryQueryNewJyk';

export default {
  props: {
    sum: { type: [Number, String], default: 0 },
    amountSum: { type: [Number, String], default: 0 }
  },
  data() {
    return {
      storageList: [],
      defaultWhere: {
        inventoryNew_search1: '',
        inventoryNew_search2: '',
        inventoryNew_search3: '',
        inventoryNew_classificName: '',
        inventoryNew_search5: '',
        inventoryNew_APPROVAL_NUMBER: '',
        inventoryNew_search4: '',
        inventory_Position: '',
        STORAGE_ID: '',
        UpShelfState: '',
        conTime: '',
        hptx: '',
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
        highOrLowClassTwo2: '',
        start_time: '',
        end_time: ''
      },
      where: {}
    };
  },
  computed: {
    sumText() {
      return this.sum != null && this.sum !== '' ? String(this.sum) : '0';
    },
    amountSumText() {
      return this.amountSum != null && this.amountSum !== '' ? String(this.amountSum) : '0';
    }
  },
  created() {
    this.where = { ...this.defaultWhere };
    this.loadStorage();
  },
  methods: {
    async loadStorage() {
      try {
        this.storageList = await getStorageList();
      } catch {
        this.storageList = [];
      }
    },
    search() {
      this.$emit('search', this.where);
    },
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>

<style scoped>
.stat-text {
  font-weight: 600;
  color: #009688;
}
</style>
