<!-- 搜索表单 -->
<template>
  <el-form
    label-width="77px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
    :inline="true"
    size="mini"
  >
    <el-form-item label="">
      <el-input v-model="where.SerachName" placeholder="请输入品种编码/品种名称/型号规格/生产企业搜索" />
    </el-form-item>
    <el-form-item label="">
      <el-input
            v-model="where.spec"
            size="mini"
            placeholder="请输入规格型号"
            clearable
            @change="reload"
          />
    </el-form-item>
    <el-form-item label="">
      <el-input
        v-model="where.manufacturer"
        placeholder="请输入生产企业"
        clearable
        size="mini"
        @change="reload"
      />
    </el-form-item>

    <el-form-item label="">
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
    <el-form-item label="">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        class="ele-btn-icon"
        @click="addKSKS()"
      >
        确定添加
      </el-button>
    </el-form-item>
    <el-form-item label="">
      <el-button size="mini" icon="el-icon-refresh" @click="reset"
        >重置</el-button
      >
    </el-form-item>
    <!-- <el-row :gutter="1" style="margin-top: 10px">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 4 } : { span: 4 }">
        <el-input
          clearable
          size="mini"
          v-model="where.SerachName"
          placeholder="请输入品种编码/品种名称/型号规格/生产企业搜索"
        />
      </el-col>

      <el-col :lg="4" :md="4">
        <el-form-item label="">
          <el-input
            v-model="where.spec"
            size="mini"
            placeholder="请输入规格型号"
            clearable
            @change="reload"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="4" :md="4">
        <el-form-item label="">
          <el-input
            v-model="where.manufacturer"
            placeholder="请输入生产企业"
            clearable
            size="mini"
            @change="reload"
          />
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="addKSKS()"
          >
            确定添加
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          > -->
          <!-- <el-button type="primary" class="ele-btn-icon" @click="exportData" v-loading.fullscreen.lock="fullscreenLoading">
            导出
          </el-button> -->
        <!-- </div>
      </el-col>
    </el-row> -->
  </el-form>
</template>

<script>
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        SerachName: '',
        spec: '',
        manufacturer: ''
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
      },
      addKSKS() {
        this.$emit('addKSKS');
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
