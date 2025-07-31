<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
        <el-form-item>
          <!-- <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
            >查询</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          > -->
          <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
            @click="handleExportData"
            >导出</el-button
          >
        </el-form-item>
      </el-col>

      <!-- <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-col> -->
    </el-row>
  </el-form>
</template>

<script>
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '',
        STORAGE:"",
        TYPE:"",
        DEPT_TWO_CODE: '',
        PLAN_NUMBER: '',
        PLAN_TIME_START: '',
        PLAN_TIME_END: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere }
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', { ...this.where });
      },
      handleExportData() {
        this.$emit('exportData', { ...this.where });
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      }
    },
    created() {
      // 获取各种类型当前时间
      var date = new Date(); //获取当前时间国标版
      var year = date.getFullYear(); // 获取年
      var month = date.getMonth() + 1; //获取当前月
      var day = date.getDate(); //日
      var now_time = year + '-' + month + '-' + day;
      this.where.EndTime = now_time;

      //获取7天前的时间
      var now2 = new Date();
      var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
      var year2 = date2.getFullYear();
      var month2 = date2.getMonth() + 1;
      var day2 = date2.getDate();
      var now_time2 = year2 + '-' + month2 + '-' + day2;
      this.where.StartTime = now_time2;
    }
  };
</script>
