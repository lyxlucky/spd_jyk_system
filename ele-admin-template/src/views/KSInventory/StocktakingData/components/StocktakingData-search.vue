<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col style="padding-left: 0px" v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker v-model="where.GENERATE_DATE" type="date" style="width:200px" value-format="yyyy-MM-dd" placeholder="申领开始日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 4 } : { span: 4 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
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
      GENERATE_DATE: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      BZ: ''
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
    }
  },

  created() {}
};
</script>
