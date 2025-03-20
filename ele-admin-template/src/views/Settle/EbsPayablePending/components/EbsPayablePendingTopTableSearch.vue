<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-position"
              :disabled="isSelected"
              @click="handlePushPayablePending"
              >推送数据</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'EbsPayablePendingTopTableSearch',
    props: ['selection'],
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      handlePushPayablePending() {
        this.$emit('handlePushPayablePending');
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isSelected() {
        return !this.selection.length > 0;
      }
    }
  };
</script>
<style lang=""></style>
