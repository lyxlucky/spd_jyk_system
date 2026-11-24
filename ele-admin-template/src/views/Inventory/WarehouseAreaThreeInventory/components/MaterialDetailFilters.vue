<template>
  <el-form
    class="detail-filters"
    label-position="top"
    size="small"
    @submit.native.prevent
  >
    <div
      class="filter-grid"
      :class="{ 'filter-grid--with-status': showDeleteStatus }"
    >
      <el-form-item label="计费编码">
        <el-input
          :value="value.CHARGE_CODE"
          placeholder="请输入计费编码"
          clearable
          @input="update('CHARGE_CODE', $event)"
          @keyup.enter.native="$emit('search')"
        />
      </el-form-item>
      <el-form-item label="医嘱ID">
        <el-input
          :value="value.MEDICAL_ORDER_ID"
          placeholder="请输入医嘱ID"
          clearable
          @input="update('MEDICAL_ORDER_ID', $event)"
          @keyup.enter.native="$emit('search')"
        />
      </el-form-item>
      <el-form-item label="批号（支持多选）">
        <el-select
          :value="value.BATCH_NOS"
          placeholder="选择或输入批号后回车"
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
          placeholder="全部数量"
          clearable
          @change="update('QTY_SIGN', $event)"
        >
          <el-option label="正数" value="positive" />
          <el-option label="负数" value="negative" />
          <el-option label="零数量" value="zero" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showDeleteStatus" label="删除状态">
        <el-select
          :value="value.IS_DELETE || '1'"
          @change="update('IS_DELETE', $event)"
        >
          <el-option label="未删除" value="1" />
          <el-option label="已删除" value="0" />
        </el-select>
      </el-form-item>
    </div>
    <div class="filter-footer">
      <el-checkbox
        v-if="showEmptyBatch"
        class="filter-empty-batch"
        :value="value.BATCH_EMPTY"
        @change="update('BATCH_EMPTY', $event)"
        >包含无批号</el-checkbox
      >
      <div class="filter-actions">
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="loading"
          @click="$emit('search')"
          >{{ searchLabel }}</el-button
        >
        <el-button
          icon="el-icon-refresh-left"
          :disabled="loading"
          @click="$emit('clear')"
          >清空筛选条件</el-button
        >
      </div>
    </div>
    <p v-if="local" class="filter-note">
      <i class="el-icon-info" aria-hidden="true"></i>
      条件变化即时筛选当前候选；扩大范围后请重新查询。
    </p>
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
      showDeleteStatus: Boolean,
      showEmptyBatch: Boolean,
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
        const filters = { ...this.value, [key]: value };
        if (key === 'CHARGE_CODE') filters.EXACT_CHARGE_CODE = false;
        this.$emit('input', filters);
      }
    }
  };
</script>

<style scoped>
  .detail-filters {
    flex: none;
    min-width: 0;
    margin-bottom: 12px;
    padding: 14px 16px;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
  }
  .filter-grid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr)) minmax(0, 1.4fr)
      minmax(0, 1fr);
    gap: 12px 16px;
  }
  .filter-grid--with-status {
    grid-template-columns:
      repeat(2, minmax(0, 1fr)) minmax(0, 1.4fr)
      repeat(2, minmax(0, 1fr));
  }
  .filter-grid :deep(.el-form-item) {
    margin-bottom: 0;
    min-width: 0;
  }
  .filter-grid :deep(.el-form-item__label) {
    padding: 0 0 6px;
    color: #606266;
    font-size: 12px;
    font-weight: 600;
    line-height: 20px;
  }
  .filter-grid :deep(.el-select),
  .filter-grid :deep(.el-input) {
    width: 100%;
  }
  .filter-grid :deep(.el-input__inner) {
    border-radius: 4px;
  }
  .filter-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #e4e7ed;
  }
  .filter-empty-batch {
    margin-right: 0;
    color: #606266;
  }
  .filter-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-left: auto;
    min-width: 0;
  }
  .filter-actions .el-button + .el-button {
    margin-left: 0;
  }
  .filter-note {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 10px 0 0;
    color: #606266;
    font-size: 12px;
    line-height: 20px;
    overflow-wrap: anywhere;
  }
  @media (max-width: 1000px) {
    .filter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 600px) {
    .detail-filters {
      padding: 12px;
    }
    .filter-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .filter-actions {
      flex: 1 1 100%;
    }
    .filter-actions .el-button {
      flex: 1;
      min-width: 0;
      padding-right: 10px;
      padding-left: 10px;
    }
  }
</style>
