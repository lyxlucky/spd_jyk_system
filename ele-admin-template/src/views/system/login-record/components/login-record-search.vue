<!-- 搜索表单 -->
<template>
  <el-form
    label-width="77px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="用户账号:">
          <el-input v-model="where.username" placeholder="请输入" clearable />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="用户名:">
          <el-input v-model="where.nickname" placeholder="请输入" clearable />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="登录开始:">
          <el-date-picker
            v-model="where.createTimeStart"
            type="datetime"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 140px"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="-">
          <el-date-picker
            v-model="where.createTimeEnd"
            type="datetime"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 140px"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button
            type="primary"
            @click="search"
            icon="el-icon-search"
            class="ele-btn-icon"
          >
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
        username: '',
        nickname: '',
        createTimeStart: '',
        createTimeEnd: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        defaultWhere
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
    }
  };
</script>
