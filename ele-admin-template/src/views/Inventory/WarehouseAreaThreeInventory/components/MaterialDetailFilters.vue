<template>
  <el-form
    class="detail-filters"
    label-position="top"
    size="mini"
    @submit.native.prevent
  >
    <div class="filter-grid">
      <el-form-item label="计费编码">
        <el-input
          :value="value.CHARGE_CODE"
          clearable
          @input="update('CHARGE_CODE', $event)"
          @keyup.enter.native="$emit('search')"
        />
      </el-form-item>
      <el-form-item label="批号（多选，可输入）">
        <el-select
          :value="value.BATCH_NOS"
          multiple
          filterable
          allow-create
          default-first-option
          clearable
          collapse-tags
          @change="update('BATCH_NOS', $event)"
        >
          <el-option
            v-for="batch in batchOptions"
            :key="batch"
            :value="batch"
            :label="batch"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量正负">
        <el-select
          :value="value.QTY_SIGN"
          clearable
          @change="update('QTY_SIGN', $event)"
        >
          <el-option label="正数" value="positive" />
          <el-option label="负数" value="negative" />
          <el-option label="零数量" value="zero" />
        </el-select>
      </el-form-item>
    </div>
    <div class="filter-actions">
      <el-button type="primary" :loading="loading" @click="$emit('search')">{{
        searchLabel
      }}</el-button>
      <el-button :disabled="loading" @click="$emit('clear')"
        >清空筛选条件</el-button
      >
      <span v-if="local" class="filter-note"
        >条件变化即时筛选当前候选；扩大范围后请重新查询。</span
      >
    </div>
  </el-form>
</template>

<script>
  export default {
    name: 'MaterialDetailFilters',
    props: {
      value: { type: Object, default: () => ({}) },
      rows: { type: Array, default: () => [] },
      loading: Boolean,
      local: Boolean,
      searchLabel: { type: String, default: '查询' }
    },
    computed: {
      batchOptions() {
        return Array.from(
          new Set([
            ...(this.value.BATCH_NOS || []),
            ...this.rows.map((row) => String(row.BATCH_NO || ''))
          ])
        )
          .filter(Boolean)
          .sort();
      }
    },
    methods: {
      update(key, value) {
        this.$emit('input', { ...this.value, [key]: value });
      }
    }
  };
</script>

<style scoped>
  .detail-filters {
    flex: none;
    margin-bottom: 10px;
    padding: 10px 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0 12px;
  }
  .filter-grid :deep(.el-form-item) {
    margin-bottom: 8px;
    min-width: 0;
  }
  .filter-grid :deep(.el-form-item__label) {
    padding-bottom: 3px;
    line-height: 18px;
  }
  .filter-grid :deep(.el-select),
  .filter-grid :deep(.el-date-editor) {
    width: 100%;
  }
  .filter-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .filter-actions .el-button + .el-button {
    margin-left: 0;
  }
  .filter-note {
    color: #606266;
    font-size: 12px;
  }
  @media (max-width: 1000px) {
    .filter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
