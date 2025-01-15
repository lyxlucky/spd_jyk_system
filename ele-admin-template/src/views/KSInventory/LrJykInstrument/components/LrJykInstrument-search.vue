<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    
    <el-row :gutter="20">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 8 }">
        <el-input size="mini" clearable v-model="where.INSTRUMENT_NAME" style="width:180px" placeholder="仪器名称/代码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 8 }">
        <el-input size="mini" clearable v-model="where.WORKING_GROUP" placeholder="工作组" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
   
  </el-form>
</template>

<script>
import {
  CreatList,
  ReturnInitState
} from '@/api/KSInventory/KSDepartmentalPlan';
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      INSTRUMENT_NAME: '',
      WORKING_GROUP: '',
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
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
    /* 创建申领单 */
    CreatApplicationForm() {
      const loading = this.$loading({ lock: true });
      var data = {
        BZ: this.BZ,
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        State: '2',
        Operater: this.$store.state.user.info.UserName
      };
      CreatList(data).then((res) => {
        loading.close();
        this.$message.success(res.msg);
        this.$emit('search', this.where);
      });
    },
  },

  created() {}
};
</script>
