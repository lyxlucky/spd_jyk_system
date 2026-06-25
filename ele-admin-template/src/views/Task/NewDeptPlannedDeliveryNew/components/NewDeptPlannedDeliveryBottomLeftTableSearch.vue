<template>
  <div class="spd-panel__body bottom-left-search">
    <el-form
      size="mini"
      :inline="true"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input clearable v-model="where.date" placeholder="YYYY-MM" style="width: 100px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="where.state" style="width: 140px" @change="search()">
          <el-option value="-1" label="全部" />
          <el-option value="0" label="未发送（SPD）" />
          <el-option value="1" label="已发送（SPD）" />
          <el-option value="2" label="已查看（B2B）" />
          <el-option value="3" label="处理中（B2B）" />
          <el-option value="4" label="部分送货（B2B）" />
          <el-option value="5" label="全部送货（B2B）" />
          <el-option value="6" label="部分收货（SPD）" />
          <el-option value="7" label="全部收货（SPD）" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="where.planNo" placeholder="备货单号" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="where.keyword" placeholder="请输入关键字搜索" style="width: 160px" />
      </el-form-item>
      <el-form-item class="ele-form-actions">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <!-- <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 1, md: 2 } : { span: 4 }">
          <el-input size="mini" clearable v-model="where.date" placeholder="YYYY-MM" />
        </el-col>
        ...
      </el-row> -->
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
<style scoped lang="scss">
.bottom-left-search :deep(.el-form-item__content) {
  max-width: none !important;
}
</style>
