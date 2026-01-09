<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    inline
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        size="mini"
        style="width: 160px"
        clearable
        v-model="where.VARIETIE_SEARCH_VALUE"
        placeholder="品种"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 160px"
        clearable
        v-model="where.PLAN_NUMBER"
        placeholder="单号"
      />
    </el-form-item>
    <el-form-item style="width: 220px">
      <el-date-picker
        size="mini"
        v-model="where.PLAN_TIME_RANGE"
        type="daterange"
        style="width: 220px"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="收货开始日期"
        end-placeholder="收货结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        v-model="where.STATE"
        @change="search()"
        style="width: 120px"
        placeholder="收货状态"
      >
        <el-option label="收货状态" value="">全部</el-option>
        <el-option label="未收完" value="0"></el-option>
        <el-option label="已收完" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        v-model="where.STORAGE"
        @change="search()"
        style="width: 120px"
        placeholder="院区"
      >
        <el-option label="院区" value="">全部</el-option>
        <el-option label="通州院区" value="1"></el-option>
        <el-option label="西直门院区" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        v-model="where.TYPE"
        @change="search()"
        style="width: 120px"
        placeholder="高低值属性"
      >
        <el-option label="高低值属性" value="">全部</el-option>
        <el-option label="低值" value="0"></el-option>
        <el-option label="高值" value="1"></el-option>
        <el-option label="试剂" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-search"
        class="ele-btn-icon"
        @click="search"
      >
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        icon="el-icon-refresh"
        class="ele-btn-icon"
        @click="reset"
      >
        重置
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="success"
        icon="el-icon-download"
        class="ele-btn-icon"
        @click="handleExportData"
      >
        导出
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '',
        STORAGE: '',
        TYPE: '',
        DEPT_TWO_CODE: '',
        PLAN_NUMBER: '',
        PLAN_TIME_RANGE: []
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
