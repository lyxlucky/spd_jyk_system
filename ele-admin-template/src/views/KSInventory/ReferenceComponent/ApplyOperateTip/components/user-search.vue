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
        clearable
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
        clearable
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
        clearable
      >
        <el-option label="院区" value="">全部</el-option>
        <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        v-model="where.TYPE"
        @change="search()"
        style="width: 120px"
        placeholder="高低值属性"
        clearable
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
  import {getSTORAGE} from "@/api/login";

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
        PLAN_TIME_START: '',
        PLAN_TIME_END: '',
        PLAN_TIME_RANGE: []
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        defaultWhere,
        storageList: []
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    watch: {
      // 监听日期范围变化，同步开始/结束时间
      'where.PLAN_TIME_RANGE'(val) {
        if (Array.isArray(val) && val.length === 2 && val[0] && val[1]) {
          this.where.PLAN_TIME_START = val[0];
          this.where.PLAN_TIME_END = val[1];
        } else {
          this.where.PLAN_TIME_START = '';
          this.where.PLAN_TIME_END = '';
        }
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
      // 初始化日期范围为最近7天，并同步开始/结束时间
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 3600 * 1000);
      const endStr =
        endDate.getFullYear() + '-' + pad(endDate.getMonth() + 1) + '-' + pad(endDate.getDate());
      const startStr =
        startDate.getFullYear() + '-' + pad(startDate.getMonth() + 1) + '-' + pad(startDate.getDate());
      this.where.PLAN_TIME_RANGE = [startStr, endStr];
      this.where.PLAN_TIME_START = startStr;
      this.where.PLAN_TIME_END = endStr;
      // 在 created 阶段仅初始化数据，不触发查询

      getSTORAGE().then(res => {
        if (res && res.result) {
          this.storageList = res.result;
        }
      });

    }
    ,
    mounted() {
      // 组件及父级已挂载，确保父级 refs 已就绪后再触发查询
      // this.$nextTick(() => {
      //   this.search();
      // });
    }
  };
</script>
