<template>
  <div class="spd-panel__body financial-table-search">
    <el-form
      size="mini"
      :inline="true"
      label-width="100px"
      class="ele-form-search financial-search-form"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="编码/名称">
        <el-input clearable v-model="where.code" placeholder="编码/名称" style="width: 120px" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input clearable v-model="where.supplier" placeholder="请输入供应商" style="width: 140px" />
      </el-form-item>
      <el-form-item label="发票">
        <el-input clearable v-model="where.PlanNum" placeholder="请输入发票" style="width: 120px" />
      </el-form-item>
      <el-form-item label="月结开始">
        <el-date-picker
          v-model="where.yjStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="月结开始"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="月结结束">
        <el-date-picker
          v-model="where.yjEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="月结结束"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="where.State" style="width: 100px" @change="search()">
          <el-option label="全部" value="-1" />
          <el-option label="已审批" value="1" />
          <el-option label="未审批" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="微讯通月份">
        <el-input clearable v-model="where.wxtMonth" placeholder="微讯通月份" style="width: 110px" />
      </el-form-item>
      <el-form-item label="微讯通">
        <el-select v-model="where.wxtState" style="width: 120px" @change="search()">
          <el-option label="微讯通-全部" value="-1" />
          <el-option label="微讯通-已发送" value="1" />
          <el-option label="微讯通-未发送" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否阳光订单">
        <el-select v-model="where.isYgOrder" style="width: 80px" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="带量采购">
        <el-select v-model="where.purchase" style="width: 80px" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="审批开始">
        <el-date-picker
          v-model="where.approvalStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="审批开始"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="审批结束">
        <el-date-picker
          v-model="where.approvalEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="审批结束"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item class="ele-form-actions" label-width="0">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-download">打印报表</el-button>
        <el-button type="primary" plain icon="el-icon-download">打印月报表</el-button>
        <el-button type="danger" plain icon="el-icon-download">取消审批</el-button>
        <el-button type="success" plain icon="el-icon-download">确认审批</el-button>
        <el-button type="primary" plain icon="el-icon-download">取消发票</el-button>
        <el-button type="primary" plain icon="el-icon-download">导出</el-button>
        <el-button type="primary" plain icon="el-icon-download">月结汇总导出</el-button>
        <el-button type="primary" plain icon="el-icon-download">签收导出</el-button>
        <el-button type="primary" plain icon="el-icon-download">发票签收</el-button>
        <el-button type="primary" plain icon="el-icon-download">取消签收</el-button>
        <el-button type="primary" plain icon="el-icon-download">打印报表</el-button>
        <el-button type="primary" plain icon="el-icon-download">发送微讯通</el-button>
        <el-button type="primary" plain icon="el-icon-download">一键打印</el-button>
      </el-form-item>
      <!-- <el-row type="flex" :gutter="10">
        <el-col>
          <el-form-item>
            <el-input size="mini" clearable v-model="where.code" placeholder="编码/名称" />
          </el-form-item>
        </el-col>
        ...
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-download">打印报表</el-button>
            ...
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'FinancialTableSearch',
    data() {
      return {
        where: {}
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
.financial-search-form :deep(.el-form-item__label) {
  white-space: nowrap;
}

.financial-search-form :deep(.el-form-item:not(.ele-form-actions) .el-form-item__content) {
  max-width: none;
}

.financial-search-form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-left: 0 !important;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}
</style>
