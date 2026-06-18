<template>
  <el-form
    class="ele-form-search temporary-search"
    size="mini"
    :inline="true"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input clearable v-model="where.temporary2_search_inp2" placeholder="请输入科室名称" style="width: 180px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
        查询
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
        temporary2_search_inp2: ''
      },
      // 表单数据
      where: {},
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
