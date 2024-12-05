<template lang="">
  <div>
    <el-form :inline="true" class="ele-form-search">
      <el-form-item label="" label-width="0px">
        <el-input
          size="mini"
          v-model="where.code"
          placeholder="请输入品种编码"
          clearable
        />
      </el-form-item>

      <el-form-item style="width: 350px">
        <el-date-picker
          v-model="where.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="" label-width="0px">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'JyDeviceTableSearch',
    data() {
      const defaultWhere = {
        code: '',
        date:''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      // 查询
      search() {
        this.$emit('search', this.where);
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
