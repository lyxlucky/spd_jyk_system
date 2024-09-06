<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="" label-width="0px">
            <el-input
              size="mini"
              v-model="where.code"
              placeholder="请输入品种编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 6 }">
          <el-form-item label="" label-width="0px">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="search"
              >查询</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'JyDeviceTableSearch',
    data() {
      const defaultWhere = {
        code: ''
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
