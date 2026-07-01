<template>
  <div class="ks-query-detail-search spd-panel__body">
    <el-form size="mini" label-width="0" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.condition" clearable placeholder="请输入定数码" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.condition1" clearable placeholder="品种名称/规格型号" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <span class="inline-label">近效期：</span>
            <el-select v-model="form.jxqSatte" class="ele-fluid">
              <el-option label="全部" value="0" />
              <el-option label="1个月" value="1" />
              <el-option label="3个月" value="3" />
              <el-option label="6个月" value="6" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <span class="inline-label">已退货：</span>
            <el-select v-model="form.isHaveTh" class="ele-fluid">
              <el-option label="不包含" value="0" />
              <el-option label="包含" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="action-col">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button @click="$emit('reset-all')">返回查看全部</el-button>
          <el-button
            v-if="canExportSelected"
            icon="el-icon-download"
            :loading="exportingSelected"
            @click="$emit('export-selected')"
          >
            导出指定品种明细
          </el-button>
          <el-button
            v-if="canExportAll"
            icon="el-icon-download"
            :loading="exportingAll"
            @click="$emit('export-all')"
          >
            导出全部品种明细
          </el-button>
          <el-button
            v-if="canExportBatch"
            icon="el-icon-download"
            :loading="exportingBatch"
            @click="$emit('export-batch')"
          >
            导出品种明细（批号）
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { hasExportPermission } from '../utils';

const defaultForm = () => ({
  condition: '',
  condition1: '',
  jxqSatte: '0',
  isHaveTh: '0'
});

export default {
  name: 'KSQueryDetailSearch',
  props: {
    exportingSelected: Boolean,
    exportingAll: Boolean,
    exportingBatch: Boolean
  },
  data() {
    return {
      form: defaultForm()
    };
  },
  computed: {
    canExportSelected() {
      return hasExportPermission('export-KSQuery-zdmxdc');
    },
    canExportAll() {
      return hasExportPermission('export-KSQuery-qbmxdc');
    },
    canExportBatch() {
      return hasExportPermission('export-KSQuery-phmxdc');
    }
  },
  methods: {
    getWhere() {
      return { ...this.form };
    },
    search() {
      this.$emit('search', this.getWhere());
    },
    resetFilters() {
      this.form = defaultForm();
    }
  }
};
</script>

<style scoped>
.inline-label {
  font-size: 12px;
  color: #606266;
  margin-right: 4px;
  white-space: nowrap;
}
.action-col {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.action-col .el-button {
  margin-left: 0;
}
</style>
