<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.VARIETIE_SEARCH_VALUE" placeholder="编码/名称/规格型号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="dateRange"
          @change="handleDateRangeChange"
        >
        </el-date-picker>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <label>
          处理状态:
          <el-select v-model="where.STATE" size="mini" placeholder="请选择状态">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="未处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <label>
          新旧价格是否一致:
          <el-select v-model="where.PriceIsEqual" size="mini" placeholder="请选择状态">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="success" size="mini" @click="markAsProcessed">标记处理</el-button>
          <el-button type="success" size="mini" icon="el-icon-download" @click="exportData">导出</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 默认表单数据
      defaultWhere: {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '0', // 默认处理状态为未处理
        start_time: '',
        end_time: '',
        PriceIsEqual: '0' // 默认新旧价格是否一致为否
      },
      // 表单数据
      where: {},
      // 日期范围
      dateRange: []
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  created() {
    // 初始化 where 对象
    this.where = { ...this.defaultWhere };
  },
  methods: {
    /* 搜索 */
    search() {
     
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.dateRange = [];
      this.search();
    },
    /* 标记处理 */
    markAsProcessed() {
      this.$emit('markAsProcessed', this.where);
    },
    /* 导出数据 */
    exportData() {
      this.$emit('exportData', this.where);
    },
    // 处理日期范围选择
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