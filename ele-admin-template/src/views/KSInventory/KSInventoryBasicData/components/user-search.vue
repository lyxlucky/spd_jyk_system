<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Varietie_Code_New" placeholder="品种编码/品种名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.APPROVAL_NUMBER" placeholder="注册证号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
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
      Varietie_Code_New: '',
      APPROVAL_NUMBER: '',
      Manufacturing_Ent_Name: '',
      CLASS_NUM: '',
      DEVICE_REMARK: '',
      Dept_One_Code: ''
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
    }
  }
};
</script>
