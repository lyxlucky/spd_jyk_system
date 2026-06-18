<template>
  <el-form
    class="ele-form-search temporary-search"
    size="mini"
    :inline="true"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        clearable
        v-model="where.temporary2_search_inp"
        placeholder="品种编码、品种名称、领出人、定数码"
        style="width: 240px"
      />
    </el-form-item>
    <el-form-item>
      <el-date-picker
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="科室计划开始日期"
        end-placeholder="科室计划结束日期"
        v-model="dateRange"
        @change="handleDateRangeChange"
        style="width: 260px"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="success" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
        导出
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 默认表单数据
      defaultWhere: {
        temporary2_search_inp: '',
        deptName:'',
        start_time: '',
        end_time: '',
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

<style scoped>
.temporary-search {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-bottom: 8px;
}

.temporary-search :deep(.el-form-item) {
  margin: 0;
}
</style>