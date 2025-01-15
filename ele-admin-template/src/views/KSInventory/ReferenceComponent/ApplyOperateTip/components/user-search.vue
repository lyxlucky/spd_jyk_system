<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="品种：" label-width="60px">
          <el-input
            size="mini"
            clearable
            v-model="where.VARIETIE_SEARCH_VALUE"
            placeholder=""
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="单号：" label-width="60px">
          <el-input
            size="mini"
            clearable
            v-model="where.PLAN_NUMBER"
            placeholder=""
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <el-form-item label="计划收货日期:" label-width="100px">
          <el-date-picker
            size="mini"
            v-model="where.PLAN_TIME_START"
            type="date"
            style="width: 140px"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 3 } : { span: 4 }">
        <el-form-item>
          <el-date-picker
            size="mini"
            v-model="where.PLAN_TIME_END"
            type="date"
            style="width: 140px"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 6 }">
        <el-form-item label="收货状态:" label-width="80px">
          <el-select size="mini" v-model="where.STATE" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="未收完" value="0"></el-option>
            <el-option label="已收完" value="1"></el-option>
          </el-select>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
            >查询</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
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
