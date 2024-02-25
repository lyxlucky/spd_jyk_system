<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row>
      <el-col :span="4">
        <el-form-item >
          <el-input style="width: 90%;" clearable v-model="where.Varietie_Name" placeholder="品种编码/名称" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item >
          <el-input style="width: 90%;" clearable v-model="where.Specification_Or_Type" placeholder="规格型号" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item >
          <el-input style="width: 90%;" clearable v-model="where.Manufacturing_Ent_Name" placeholder="生产企业" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item >
          <el-input style="width: 90%;" clearable v-model="where.APPROVAL_NUMBER" placeholder="注册证" />
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      Varietie_Name: '',
      Specification_Or_Type: '',
      APPROVAL_NUMBER: '',
      Manufacturing_Ent_Name: '',
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
      this.$emit('search', { ...this.where });
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    }
  },
  created() {
    // 获取各种类型当前时间
    var date = new Date(); //获取当前时间国标版
    var year = date.getFullYear(); // 获取年
    var month = date.getMonth() + 1; //获取当前月
    var day = date.getDate(); //日
    var now_time = year + '-' + month + '-' + day;
    this.where.EndTime = now_time;

    //获取7天前的时间
    var now2 = new Date();
    var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
    var year2 = date2.getFullYear();
    var month2 = date2.getMonth() + 1;
    var day2 = date2.getDate();
    var now_time2 = year2 + '-' + month2 + '-' + day2;
    this.where.StartTime = now_time2;
  }
};
</script>
