<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="仪器">
        <el-input
          v-model="where.INSTRUMENT_NAME"
          clearable
          style="width: 180px"
          placeholder="仪器名称/代码"
        />
      </el-form-item>
      <el-form-item label="工作组">
        <el-input
          v-model="where.WORKING_GROUP"
          clearable
          placeholder="工作组"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  CreatList,
  ReturnInitState
} from '@/api/KSInventory/KSDepartmentalPlan';

const defaultWhere = () => ({
  INSTRUMENT_NAME: '',
  WORKING_GROUP: ''
});

export default {
  data() {
    return {
      where: defaultWhere()
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
      this.where = defaultWhere();
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
