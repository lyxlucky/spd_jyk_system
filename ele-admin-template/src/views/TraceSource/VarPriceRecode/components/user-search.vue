<template>
  <el-form
    inline
    size="mini"
    label-width="auto"
    class="var-price-recode-search-form"
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
    <el-form-item label="记录时间">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 240px"
      />
    </el-form-item>
    <el-form-item label="处理状态">
      <el-select v-model="where.STATE" placeholder="请选择" style="width: 90px">
        <el-option label="全部" value="全部" />
        <el-option label="未处理" value="0" />
        <el-option label="已处理" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="价格一致">
      <el-select v-model="where.PriceIsEqual" placeholder="请选择" style="width: 90px">
        <el-option label="全部" value="全部" />
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item class="search-form-actions">
      <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
        查询
      </el-button>
      <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-button type="success" @click="markAsProcessed">标记处理</el-button>
      <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
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
  computed: {
    dateRange: {
      get() {
        const { start_time, end_time } = this.where;
        return start_time && end_time ? [start_time, end_time] : null;
      },
      set(val) {
        if (val && val.length === 2) {
          this.where.start_time = val[0];
          this.where.end_time = val[1];
        } else {
          this.where.start_time = '';
          this.where.end_time = '';
        }
      }
    }
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
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
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
  display: inline-flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.var-price-recode-search-form :deep(.el-form-item__label) {
  white-space: nowrap;
  padding-right: 6px;
  float: none;
}

.var-price-recode-search-form :deep(.el-form-item__content) {
  display: inline-flex;
  align-items: center;
  max-width: none;
  flex-shrink: 0;
}

.search-form-actions :deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>
