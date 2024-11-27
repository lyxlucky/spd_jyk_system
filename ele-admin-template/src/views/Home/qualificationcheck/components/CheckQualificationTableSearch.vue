<!-- 暂时未使用组件 -->
<template lang="">
  <div>
    <el-form :inline="true" class="ele-form-search">
      <!-- <el-row :gutter="10"> -->
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }"> -->
      <el-form-item label-width="0px">
        <el-input
          v-model="where.supName"
          size="mini"
          placeholder="请输入供应商"
          clearable
        />
      </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }"> -->
      <el-form-item label-width="0px">
        <el-input
          v-model="where.hospitalName"
          size="mini"
          placeholder="请输入医院"
          clearable
        />
      </el-form-item>
      <!-- </el-col> -->

      <!-- <el-col v-bind="styleResponsive ? { lg: 12, md: 2 } : { span: 4 }"> -->
      <el-form-item label-width="0px">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search"
          >查询</el-button
        >
        <el-button
          type="success"
          size="mini"
          @click="approval"
          icon="el-icon-circle-check"
          >审核通过</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="deny"
          icon="el-icon-circle-close"
          >审核不通过</el-button
        >
      </el-form-item>
      <!-- </el-col> -->
      <!-- </el-row> -->
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'CheckQualificationTableSearch',
    data() {
      const defaultWhere = {
        supName: '',
        hospitalName: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      // 查询
      search() {
        this.$emit('search', this.where);
      },
      // 审核通过
      approval() {
        this.$emit('approval', this.where);
      },
      // 审核不通过
      deny() {
        this.$emit('deny', this.where);
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
