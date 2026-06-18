<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form size="mini" :inline="true" @keyup.enter.native="search" @submit.native.prevent>
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
          <el-select v-model="where.oneoffSterilizationPackaging" style="width: 90px">
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
        <br />
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
        <br />
        <el-form-item label="品种">
          <el-input v-model="where.searchinplt1" clearable placeholder="编码/全称" style="width: 130px" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="where.cwj_searchinplt6" clearable placeholder="规格型号" style="width: 110px" />
        </el-form-item>
        <el-form-item label="科室/供应商">
          <el-input v-model="where.searchinplt2" clearable placeholder="名称" style="width: 120px" />
        </el-form-item>
        <el-form-item label="生产批号">
          <el-input v-model="where.searchinplt3" clearable placeholder="生产批号" style="width: 100px" />
        </el-form-item>
        <el-form-item label="入库类型">
          <el-input v-model="where.searchinplt4" clearable placeholder="入库类型" style="width: 100px" />
        </el-form-item>
        <el-form-item label="入库单号">
          <el-input v-model="where.searchinplt5" clearable placeholder="入库单号" style="width: 110px" />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input v-model="where.searchinplt7" clearable placeholder="生产企业" style="width: 110px" />
        </el-form-item>
        <el-form-item label="备货单号">
          <el-input v-model="where.cwj_hinpPREPARE_GOODS_PLAN_NUMBER" clearable placeholder="备货单号" style="width: 110px" />
        </el-form-item>
        <br />
        <el-form-item label="入库日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
            @change="handleDateRangeChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        searchinplt1: '',
        cwj_searchinplt6: '',
        searchinplt2: '',
        searchinplt3: '',
        searchinplt4: '',
        searchinplt5: '',
        searchinplt7: '',
        cwj_hinpPREPARE_GOODS_PLAN_NUMBER: '',
        start_time: '',
        end_time: ''
      },
      where: {},
      dateRange: []
    };
  },
  created() {
    this.where = { ...this.defaultWhere };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    exportData() {
      this.$emit('exportData', this.where);
    },
    returnData() {
      this.$emit('returnData', this.where);
    },
    handleDateRangeChange(range) {
      if (range && range.length === 2) {
        this.where.start_time = range[0];
        this.where.end_time = range[1];
      } else {
        this.where.start_time = '';
        this.where.end_time = '';
      }
    }
  }
};
</script>
