<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="15">
      <el-col :lg="6" :md="12">
        <el-form-item label="">
          <el-input v-model="where.username" placeholder="品种编码/品种名称" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="6" :md="12">
        <el-form-item label="">
          <el-input v-model="where.username" placeholder="注册证号" clearable />
        </el-form-item>
        <!-- <el-form-item label="性别:">
              <el-select clearable v-model="where.sex" placeholder="请选择" class="ele-fluid">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item> -->
      </el-col>
      <el-col :lg="12" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" @click="reload">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="danger" @click="removeBatch">批量删除</el-button>
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
      username: '',
      APPROVAL_NUMBER: '',
      Start: '',
      End: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      value1: '',
      value2: ''
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
