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
    <el-form-item label="" style="width: 240px;">
      <el-input
        style="width: 240px;"
        clearable
        v-model="where.SerachName"
        placeholder="品种编码/名称/型号规格/生产企业"
      />
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

    <el-form-item v-if="HOME_HP == 'bdrm'" label="">
      <el-select size="mini" v-model="where.varType">
        <el-option
          v-for="item in varTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="HOME_HP == 'se2'" label="">
      <el-select size="mini" v-model="where.mlType">
        <el-option label="科室目录" value="0" />
        <el-option label="在用目录" value="1" />
      </el-select>
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
  import { HOME_HP } from '@/config/setting';
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        SerachName: '',
        spec: '',
        manufacturer: '',
        varType: '',
        mlType: '0'
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        defaultWhere: defaultWhere,
        HOME_HP: HOME_HP
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      // 根据路由动态返回选项列表
      varTypeOptions() {
        const currentRoute = this.$route.path; // 获取当前路由路径
        // 全部选项
        const allOptions = [
          { label: '全部', value: '' },
          { label: '低值', value: '0' },
          { label: '高值', value: '1' },
          { label: '试剂', value: '2' }
        ];
        // 只有低值选项
        const lowValueOptions = [
          { label: '低值', value: '0' }
        ];
        
        // 根据路由返回不同的选项（请根据实际路由路径修改判断条件）
        // 示例：如果路由包含 'routeA'，返回全部选项；如果包含 'routeB'，只返回低值
        if (currentRoute.includes('/KSInventory/KSDepartmentalPlanScience')) {
          return lowValueOptions;
        } else {
          return allOptions;
        }
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
        // 如果是特定路由，重置后仍然设置为低值
        if (this.$route.path.includes('/KSInventory/KSDepartmentalPlanScience')) {
          this.where.varType = '0';
        }
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

      // 如果是特定路由，设置默认varType为低值
      if (this.$route.path.includes('/KSInventory/KSDepartmentalPlanScience')) {
        this.where.varType = '0';
      }
    }
  };
</script>
