<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
          <el-form-item>
            <el-input
              v-model="where.BatchType"
              size="mini"
              placeholder="业务类型"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 2, md: 4 } : { span: 4 }">
          <el-form-item>
            <el-select
              @change="search"
              v-model="where.ComCode"
              size="mini"
              placeholder="院区"
            >
              <el-option label="西直门" value="100" />
              <el-option label="通州" value="103" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="search"
              >查询</el-button
            >

            <el-button
              size="mini"
              type="success"
              icon="el-icon-position"
              :disabled="isSelected"
              @click="handlePushPayablePending"
              >审批并推送数据</el-button
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
      const defaultWhere = {
        BatchType: '',
        ComCode: ''
      };
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
