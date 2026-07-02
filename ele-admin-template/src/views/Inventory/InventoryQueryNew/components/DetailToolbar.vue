<template>
  <div class="spd-panel spd-panel--search inv-query-detail-bar">
    <div class="spd-panel__head">定数码明细</div>
    <div class="spd-panel__body">
      <el-form size="mini" inline @submit.native.prevent>
        <el-form-item label="定数码">
          <el-input
            v-model="condition"
            clearable
            placeholder="请输入定数码搜索明细"
            style="width: 200px"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <div class="toolbar-row">
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
        </div>
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
.inv-query-detail-bar .toolbar-row {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: 8px;
}
</style>
