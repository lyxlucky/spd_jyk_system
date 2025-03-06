<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
      style="padding-bottom: 10px"
    >
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-input
            size="mini"
            clearable
            v-model="where.date"
            placeholder="YYYY-MM"
          />
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-select size="mini" v-model="where.state" @change="search()">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="未发送（SPD）"></el-option>
            <el-option value="1" label="已发送（SPD）"></el-option>
            <el-option value="2" label="已查看（B2B）"></el-option>
            <el-option value="3" label="处理中（B2B）"></el-option>
            <el-option value="4" label="部分送货（B2B）"></el-option>
            <el-option value="5" label="全部送货（B2B）"></el-option>
            <el-option value="6" label="部分收货（SPD）"></el-option>
            <el-option value="7" label="全部收货（SPD）"></el-option>
          </el-select>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-input
            size="mini"
            clearable
            v-model="where.planNo"
            placeholder="备货单号"
          />
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-input
            size="mini"
            clearable
            v-model="where.keyword"
            placeholder="请输入关键字搜索"
          />
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="search"
          >
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'NewDeptPlannedDeliveryBottomLeftTableSearch',
    data() {
      const defaultWhere = {
        date: '',
        state: '-1',
        planNo: '',
        keyword: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      }
    }
  };
</script>
<style lang=""></style>
