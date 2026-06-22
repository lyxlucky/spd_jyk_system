<template>
  <el-form
    inline
    size="mini"
    class="var-price-recode-search-form ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item label="品种">
      <el-input
        v-model="where.VARIETIE_SEARCH_VALUE"
        clearable
        placeholder="编码/名称/规格型号"
        style="width: 200px"
      />
    </el-form-item>
    <el-form-item label="开始时间">
      <el-date-picker
        v-model="where.start_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始时间"
        style="width: 140px"
      />
    </el-form-item>
    <el-form-item label="结束时间">
      <el-date-picker
        v-model="where.end_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束时间"
        style="width: 140px"
      />
    </el-form-item>
    <el-form-item label="价格一致">
      <el-select v-model="where.PriceIsEqual" placeholder="请选择" style="width: 90px">
        <el-option label="否" value="0" />
        <el-option label="全部" value="" />
        <el-option label="是" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item v-show="false" label="处理状态">
      <el-select v-model="where.STATE" placeholder="请选择" style="width: 90px">
        <el-option label="未处理" value="0" />
        <el-option label="全部" value="" />
        <el-option label="已处理" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item class="search-form-actions">
      <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
        查询
      </el-button>
      <el-button v-show="false" type="success" @click="markAsProcessed">标记处理</el-button>
      <el-button
        v-permission="'export-VarPriceRecodeDc'"
        type="success"
        icon="el-icon-download"
        @click="exportData"
      >
        导出excel
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultWhere: {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '0',
        start_time: '',
        end_time: '',
        PriceIsEqual: '0'
      },
      where: {}
    };
  },
  created() {
    this.where = { ...this.defaultWhere };
  },
  methods: {
    search() {
      this.$emit('search', { ...this.where });
    },
    getWhere() {
      return { ...this.where };
    },
    markAsProcessed() {
      this.$emit('markAsProcessed', { ...this.where });
    },
    exportData() {
      this.$emit('exportData', { ...this.where });
    }
  }
};
</script>

<style lang="scss" scoped>
.var-price-recode-search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.var-price-recode-search-form :deep(.el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
}

.var-price-recode-search-form :deep(.el-form-item__label) {
  white-space: nowrap;
  padding-right: 8px;
}

.search-form-actions :deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>
