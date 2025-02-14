<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.ks_gs1_search_inp" placeholder="支持编码、品名、规格、RFID、UDI、定数码、供应商查询" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.ks_gs1_search_bhOrYs" placeholder="病患号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <label>
          上架时间:
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
      </label>
      </el-col>
     
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
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
        ks_gs1_search_inp: '',
        ks_gs1_search_bhOrYs: '',
        ks_UseTimeStart: '',
        ks_UseTimeEnd: ''
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