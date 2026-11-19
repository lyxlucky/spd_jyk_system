<template>
  <div class="spd-panel spd-panel--search inv-query-detail-bar">
    <div class="spd-panel__head">
      <span>定数码明细</span>
      <div class="detail-head-tools">
        <slot name="tools" />
      </div>
    </div>
    <div class="spd-panel__body">
      <el-form size="mini" class="detail-filter" @submit.native.prevent>
        <el-form-item label="定数码">
          <el-input
            v-model="condition"
            clearable
            placeholder="请输入定数码搜索明细"
            style="width: 200px"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        <el-button size="mini" @click="$emit('update-def-position')">修改货位号</el-button>
        <el-button
          v-if="canExportDeptDefs"
          size="mini"
          :loading="exportingDept"
          @click="$emit('export-dept-defs')"
        >
          导出二级科室定数码库存
        </el-button>
        <el-button
          v-if="canExportDetail"
          size="mini"
          :loading="exportingDetail"
          @click="$emit('export-detail')"
        >
          导出Excel
        </el-button>
        <el-button size="mini" @click="$emit('move-defs', 'qualified')">移至合格区</el-button>
        <el-button size="mini" @click="$emit('move-defs', 'insulated')">移至隔离区</el-button>
        <el-button size="mini" @click="$emit('move-defs', 'unqualified')">移至不合格区</el-button>
        <el-button size="mini" @click="$emit('move-defs', 'emergency')">移至应急库区</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { hasExportPermission } from '../utils';

export default {
  name: 'InvQueryDetailToolbar',
  props: {
    exportingDept: { type: Boolean, default: false },
    exportingDetail: { type: Boolean, default: false }
  },
  data() {
    return { condition: '' };
  },
  computed: {
    canExportDeptDefs() {
      return hasExportPermission('export-InventoryQueryNewKsdsm');
    },
    canExportDetail() {
      return hasExportPermission('export-InventoryQueryNewKsdsqb');
    }
  },
  methods: {
    search() {
      this.$emit('search', this.condition);
    },
    getCondition() {
      return this.condition;
    },
    setCondition(v) {
      this.condition = v || '';
    }
  }
};
</script>

<style scoped>
.inv-query-detail-bar.spd-panel--search .spd-panel__body {
  padding-bottom: 12px;
}
.detail-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.detail-filter ::v-deep .el-form-item {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  margin: 0;
}
.detail-filter ::v-deep .el-form-item__label {
  float: none;
  width: auto !important;
  padding-right: 8px;
  line-height: 28px;
}
.detail-filter ::v-deep .el-form-item__content {
  display: inline-flex;
  align-items: center;
  margin-left: 0 !important;
  line-height: 28px;
}
.detail-filter ::v-deep .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.detail-filter ::v-deep .el-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  line-height: 1;
}
.detail-filter ::v-deep .el-button + .el-button {
  margin-left: 0;
}
.detail-head-tools {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-left: 12px;
}
.detail-head-tools ::v-deep .ele-tool {
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0;
}
.detail-head-tools ::v-deep .ele-tool-item {
  flex: 0 0 auto;
  line-height: 1;
}
</style>
