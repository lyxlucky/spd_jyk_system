<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.defNoPkgCode" placeholder="请输入定数码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.varietie" placeholder="请输入品种编码/品种名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.specType" placeholder="请输入规格型号" />
      </el-col>
      <!-- <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.defNoPkgCode" placeholder="请输入合同编码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.contractCode" placeholder="请输入供应商名称" />
      </el-col> -->
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.deptTwoName" placeholder="请输入二级科室名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
        </div>
      </el-col>
      
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      deptTwoName: '',
      varietie: '',
      specType: '',
      defNoPkgCode: '',
      contractCode: '',
      supplierName: '',
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
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>
