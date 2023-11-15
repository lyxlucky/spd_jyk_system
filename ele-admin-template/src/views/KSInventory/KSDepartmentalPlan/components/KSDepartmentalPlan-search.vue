<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 16, md: 12 } : { span: 16 }">
        <el-input clearable v-model="where.Varietie_Code_New" placeholder="请输入申领单备注信息" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 8 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-check" class="ele-btn-icon" @click="aaa()">
            确认创建
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.Varietie_Code_New" placeholder="品种名称/规格型号/生产企业" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.APPROVAL_NUMBER" placeholder="申领单" />
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <div class="block">
          <el-date-picker v-model="value1" type="date" style="width:200px" value-format="yyyy-MM-dd" placeholder="申领开始日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <div class="block">
          <el-date-picker v-model="value2" type="date" style="width:200px" value-format="yyyy-MM-dd" placeholder="申领结束日期">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 24, md: 12 } : { span: 6 }">
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
      Varietie_Code_New: '',
      APPROVAL_NUMBER: '',
      Start: '',
      End: '',
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      value1:'',
      value2:'',
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
