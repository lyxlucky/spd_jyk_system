<template lang="">
  <div>
    <el-form :inline='true' class="ele-form-search">
        <!-- 查询按钮 -->
          <el-form-item label-width="0px">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-circle-check"
              @click="check(1)"
              >审核通过</el-button
            >
          </el-form-item>
          <el-form-item label-width="0px">

            <el-button
              type="danger"
              size="mini"
              icon="el-icon-circle-close"
              @click="check(2)"
              >审核不通过</el-button
            >
          </el-form-item>

          <el-form-item label-width="0px">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-more-outline"
              @click="check(3)"
              >资料缺失</el-button
            >
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="check(4)"
              >不需要提供</el-button
            >
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button
              type="info"
              size="mini"
              icon="el-icon-refresh"
              @click="check(5)"
              >重新提供</el-button
            >
          </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'DownoloadMaterialTableSearch',
    props: [''],
    data() {
      return {};
    },
    methods: {
      check(type) {
        this.$emit('check', type);
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
