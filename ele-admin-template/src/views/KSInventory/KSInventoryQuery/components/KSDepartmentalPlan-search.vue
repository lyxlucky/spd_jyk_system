<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.Name" placeholder="品种名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.SPEC" placeholder="规格型号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.DEPTNAME" placeholder="科室名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
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
import { CreatList } from '@/api/KSInventory/KSDepartmentalPlan';
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      Name: '',
      SPEC: '',
      MANUFACTURING_ENT_NAME: '',
      DEPTNAME: '',
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
    }
  },
  created() {}
};
</script>
