<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-input size="mini" clearable v-model="where.condition" placeholder="请输入定数码搜索明细" />
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
        sourceFrom: '',
        batchId: '',
        varietieCode: '',
        batch: '',
        coefficient: '',
        currUpShelfState: '',
        condition: '',
        storageId: ''
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
