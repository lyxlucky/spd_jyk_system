<template>
  <div class="inline-table-search">
    <el-card class="search-card" shadow="never">
      <el-form
        class="search-form"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-row :gutter="16">
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="品种编码" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.varCode"
                placeholder="请输入品种编码"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="品种名称" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.varName"
                placeholder="请输入品种名称"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="规格型号" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.varSpec"
                placeholder="请输入规格型号"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="search"
              >
                查询
              </el-button>
              <el-button
                size="small"
                type="success"
                icon="el-icon-check"
                @click="handleInLineAdd()"
              >
                添加到退货单
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="定数码" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.defNoPkgCode"
                placeholder="请输入定数码"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="批号" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.batch"
                placeholder="请输入批号"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
            <el-form-item label="医保编码" label-width="90px">
              <el-input
                size="small"
                clearable
                v-model="where.medicalCode"
                placeholder="请输入医保编码"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DeptTwoGoodsDefReturingInLineTableSearch',
  props: [],
  data() {
    return {
      where: {
        varCode: '',
        varName: '',
        varSpec: '',
        defNoPkgCode: '',
        batch: '',
        medicalCode: ''
      }
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    handleInLineAdd() {
      this.$emit('handleInLineAdd');
    }
  }
};
</script>

<style lang="scss" scoped>
.inline-table-search {
  .search-card {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    
    ::v-deep .el-card__body {
      padding: 20px;
    }
  }
  
  .search-form {
    ::v-deep .el-form-item {
      margin-bottom: 16px;
      
      .el-form-item__label {
        color: #606266;
        font-weight: 500;
      }
    }
    
    .el-button {
      margin-right: 10px;
      
      i {
        margin-right: 4px;
      }
    }
  }
}
</style>
