<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.supplier"
              placeholder="请输入供应商"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.PlanNum"
              placeholder="请输入发票"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="search"
              >搜索</el-button
            >

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete"
              :disabled="!isSelected"
              >删除</el-button
            >

            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              @click="handleGenerteInvoice"
              >生成发票数据</el-button
            >

            <el-button
              size="mini"
              type="success"
              icon="el-icon-position"
              :disabled="!isSelected"
              @click="handlePushInvoice"
              >推送发票数据</el-button
            >


          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'EbsSettlementDataTabaleSearch',
    props:['selection'],
    data() {
      return {
        where: {}
      };
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      handleDelete() {
        this.$emit('delete');
      },
      handleGenerteInvoice(){
        this.$emit('generteInvoice');
      },
      handlePushInvoice(){
        this.$emit('pushInvoice');
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isSelected(){
        return this.selection.length > 0;
      }
    }
  };
</script>
<style lang=""></style>
