<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    trigger="click"
    width="400"
    popper-class="warehouse-multi-select-popper"
  >
    <div class="warehouse-picker" @keyup.enter.stop>
      <div class="warehouse-picker__heading">
        <span class="warehouse-picker__title">选择库房/库区</span>
        <span class="warehouse-picker__count">已选 {{ value.length }} / {{ options.length }}</span>
      </div>
      <el-input
        v-model="keyword"
        size="small"
        :disabled="loading"
        clearable
        prefix-icon="el-icon-search"
        placeholder="搜索库房、库区或科室编码、名称"
        aria-label="搜索库房或科室"
        @keydown.enter.native.stop.prevent
      />
      <div class="warehouse-picker__toolbar">
        <div class="warehouse-picker__status">
          <span class="warehouse-picker__result-count" aria-live="polite">{{ searchLoading ? '搜索中' : `匹配 ${filteredOptions.length} 项` }}</span>
          <span class="warehouse-picker__hint">操作当前结果</span>
        </div>
        <div class="warehouse-picker__actions">
          <el-button type="text" size="mini" :disabled="loading || searchLoading || !!searchError || !filteredOptions.length" @click="selectAll">全选</el-button>
          <el-button type="text" size="mini" :disabled="loading || searchLoading || !!searchError || !filteredOptions.length" @click="invertSelection">反选</el-button>
          <el-button type="text" size="mini" :disabled="!value.length || loading" @click="clearSelection">清空全部</el-button>
        </div>
      </div>
      <div v-loading="loading || searchLoading" class="warehouse-picker__list">
        <div v-if="searchError" class="warehouse-picker__error" role="alert">
          搜索失败：{{ searchError }}
          <el-button type="text" size="mini" @click="scheduleSearch">重试</el-button>
        </div>
        <el-checkbox-group v-else-if="filteredOptions.length" :value="value" @input="updateSelection">
          <div v-for="item in filteredOptions" :key="item.VALUE" class="warehouse-picker__option">
            <el-checkbox :label="String(item.VALUE)" class="warehouse-picker__checkbox">
              <span class="warehouse-picker__option-name">{{ formatWarehouseAreaOptionLabel(item) }}</span>
            </el-checkbox>
            <el-tooltip placement="right" effect="light" popper-class="warehouse-picker-dept-tooltip">
              <div slot="content" class="warehouse-picker__departments">
                <div class="warehouse-picker__dept-header">
                  <span class="warehouse-picker__dept-heading">科室关联</span>
                  <span class="warehouse-picker__dept-warehouse">{{ formatWarehouseAreaOptionLabel(item) }}</span>
                </div>
                <div class="warehouse-picker__dept-body">
                  <section v-for="group in departmentGroups(item)" :key="group.key" class="warehouse-picker__dept-group">
                    <div class="warehouse-picker__dept-group-heading">
                      <span class="warehouse-picker__dept-title">{{ group.name }}</span>
                      <span class="warehouse-picker__dept-count">{{ group.items.length }} 个</span>
                    </div>
                    <ul v-if="group.items.length" class="warehouse-picker__dept-list">
                      <li v-for="(dept, index) in group.items" :key="index" class="warehouse-picker__dept-item">{{ dept }}</li>
                    </ul>
                    <div v-else class="warehouse-picker__dept-empty">暂无关联科室</div>
                  </section>
                </div>
              </div>
              <button
                type="button"
                class="warehouse-picker__info"
                :aria-label="`查看${formatWarehouseAreaOptionLabel(item)}的科室信息`"
                @click.stop.prevent
                @keydown.enter.stop
              ><i class="el-icon-info" aria-hidden="true" /></button>
            </el-tooltip>
          </div>
        </el-checkbox-group>
        <div v-else-if="!loading && !searchLoading" class="warehouse-picker__empty">
          {{ keyword ? '没有匹配的库房/库区' : '暂无可访问的库房/库区' }}
        </div>
      </div>
      <div class="warehouse-picker__footer">搜索后自动选中匹配库房；清空选择时查询全部可访问库房</div>
    </div>
    <button
      slot="reference"
      type="button"
      class="warehouse-picker-trigger"
      :class="{ 'is-open': visible }"
      :aria-expanded="String(visible)"
      aria-haspopup="true"
      :title="selectionSummary"
    >
      <i class="el-icon-office-building warehouse-picker-trigger__icon" aria-hidden="true" />
      <span class="warehouse-picker-trigger__text">{{ selectionSummary }}</span>
      <span v-if="value.length" class="warehouse-picker-trigger__badge">{{ value.length }}</span>
      <i class="el-icon-arrow-down warehouse-picker-trigger__arrow" aria-hidden="true" />
    </button>
  </el-popover>
</template>

<script>
import { formatWarehouseAreaOptionLabel } from '../utils';

export default {
  name: 'WarehouseAreaMultiSelect',
  props: {
    value: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    searchMethod: { type: Function, default: null },
    loading: Boolean
  },
  data() {
    return { visible: false, keyword: '', searchOptions: [], searchLoading: false, searchError: '', searchTimer: null, searchVersion: 0 };
  },
  computed: {
    filteredOptions() {
      const keyword = this.keyword.trim().toLowerCase();
      if (keyword && this.searchMethod) return this.searchOptions;
      return this.options.filter((item) =>
        [item.VALUE, item.NAME, item.LABEL, item.PARENT_NAME, item.SPD_DEPT_LABEL, item.HIS_DEPT_LABEL]
          .some((field) => String(field || '').toLowerCase().includes(keyword))
      );
    },
    selectionSummary() {
      if (!this.value.length) return '未选择，查询全部库房';
      const selected = this.options.find((item) => String(item.VALUE) === String(this.value[0]));
      const label = selected ? formatWarehouseAreaOptionLabel(selected) : String(this.value[0]);
      return this.value.length > 1 ? `${label} 等` : label;
    }
  },
  watch: {
    keyword() {
      this.scheduleSearch();
    }
  },
  beforeDestroy() {
    clearTimeout(this.searchTimer);
    this.searchVersion += 1;
  },
  methods: {
    formatWarehouseAreaOptionLabel,
    departmentList(label) {
      return String(label || '').split(';').map((item) => item.trim()).filter(Boolean);
    },
    departmentGroups(item) {
      return [
        { key: 'spd', name: 'SPD科室', items: this.departmentList(item.SPD_DEPT_LABEL) },
        { key: 'his', name: 'HIS科室', items: this.departmentList(item.HIS_DEPT_LABEL) }
      ];
    },
    scheduleSearch() {
      clearTimeout(this.searchTimer);
      const version = ++this.searchVersion;
      const keyword = this.keyword.trim();
      this.searchError = '';
      this.searchOptions = [];
      this.searchLoading = false;
      if (!keyword || !this.searchMethod) {
        this.updateSelection(this.filteredOptions.map((item) => String(item.VALUE)));
        return;
      }
      this.searchLoading = true;
      this.searchTimer = setTimeout(async () => {
        try {
          const result = await this.searchMethod(keyword);
          if (version === this.searchVersion) {
            this.searchOptions = Array.isArray(result.result) ? result.result : [];
            this.updateSelection(this.searchOptions.map((item) => String(item.VALUE)));
          }
        } catch (error) {
          if (version === this.searchVersion) this.searchError = error.message || '请稍后重试';
        } finally {
          if (version === this.searchVersion) this.searchLoading = false;
        }
      }, 250);
    },
    updateSelection(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
    selectAll() {
      const selected = new Set(this.value.map(String));
      this.filteredOptions.forEach((item) => selected.add(String(item.VALUE)));
      this.updateSelection(Array.from(selected));
    },
    invertSelection() {
      const selected = new Set(this.value.map(String));
      const visible = new Set(this.filteredOptions.map((item) => String(item.VALUE)));
      const next = this.value.map(String).filter((code) => !visible.has(code));
      visible.forEach((code) => {
        if (!selected.has(code)) next.push(code);
      });
      this.updateSelection(next);
    },
    clearSelection() {
      this.updateSelection([]);
    }
  }
};
</script>

<style scoped>
.warehouse-picker-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 310px;
  max-width: 100%;
  height: 28px;
  padding: 0 9px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #303133;
  text-align: left;
  cursor: pointer;
  transition: border-color .2s;
}
.warehouse-picker-trigger:hover { border-color: #c0c4cc; }
.warehouse-picker-trigger:focus-visible, .warehouse-picker-trigger.is-open {
  border-color: #409eff;
  outline: 2px solid rgba(64, 158, 255, .2);
  outline-offset: 1px;
}
.warehouse-picker-trigger__icon { color: #606f80; font-size: 15px; }
.warehouse-picker-trigger__text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.warehouse-picker-trigger__badge { padding: 0 6px; border-radius: 9px; background: #ecf5ff; color: #1769aa; line-height: 18px; }
.warehouse-picker-trigger__arrow { color: #909399; }
.warehouse-picker__heading, .warehouse-picker__toolbar { display: flex; align-items: center; justify-content: space-between; }
.warehouse-picker__heading { margin-bottom: 10px; }
.warehouse-picker__title { color: #303133; font-size: 14px; font-weight: 600; }
.warehouse-picker__count, .warehouse-picker__hint { color: #606f80; font-size: 12px; }
.warehouse-picker__toolbar { min-height: 42px; }
.warehouse-picker__status { display: flex; align-items: center; gap: 8px; }
.warehouse-picker__result-count { color: #303133; font-size: 12px; font-weight: 600; }
.warehouse-picker__actions { display: flex; gap: 12px; }
.warehouse-picker__actions .el-button + .el-button { margin-left: 0; }
.warehouse-picker__list { max-height: 260px; min-height: 52px; overflow-y: auto; border-top: 1px solid #ebeef5; }
.warehouse-picker__option { display: flex; align-items: center; gap: 6px; margin: 0; padding: 7px 4px; line-height: 18px; }
.warehouse-picker__option:hover { background: #f5f9ff; }
.warehouse-picker__checkbox { display: flex; align-items: flex-start; min-width: 0; margin: 0; white-space: normal; }
.warehouse-picker__option-name { color: #303133; font-weight: 500; word-break: break-all; }
.warehouse-picker__checkbox :deep(.el-checkbox__label) { white-space: normal; line-height: 18px; }
.warehouse-picker__info { flex: none; padding: 2px; border: 0; background: transparent; color: #409eff; cursor: pointer; }
.warehouse-picker__info:focus-visible { outline: 2px solid #409eff; outline-offset: 2px; }
.warehouse-picker__error { padding: 16px 4px; color: #b42318; text-align: center; }
.warehouse-picker__empty { padding: 20px 0; color: #606f80; text-align: center; }
.warehouse-picker__footer { margin-top: 4px; padding-top: 9px; border-top: 1px solid #ebeef5; color: #606f80; font-size: 12px; }
</style>

<style>
.warehouse-multi-select-popper { max-width: calc(100vw - 24px); box-sizing: border-box; }
.el-tooltip__popper.is-light.warehouse-picker-dept-tooltip {
  box-sizing: border-box;
  width: 320px;
  max-width: calc(100vw - 24px);
  padding: 0;
  overflow: visible;
  border: 1px solid #dbe5f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(31, 51, 73, .16);
  color: #303133;
}
.el-tooltip__popper.is-light.warehouse-picker-dept-tooltip[x-placement^=top] .popper__arrow { border-top-color: #dbe5f0; }
.el-tooltip__popper.is-light.warehouse-picker-dept-tooltip[x-placement^=bottom] .popper__arrow { border-bottom-color: #dbe5f0; }
.el-tooltip__popper.is-light.warehouse-picker-dept-tooltip[x-placement^=left] .popper__arrow { border-left-color: #dbe5f0; }
.el-tooltip__popper.is-light.warehouse-picker-dept-tooltip[x-placement^=right] .popper__arrow { border-right-color: #dbe5f0; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-bottom: 1px solid #e8edf3;
  background: #f6f9fd;
  border-radius: 8px 8px 0 0;
}
.warehouse-picker-dept-tooltip .warehouse-picker__dept-heading { color: #27384d; font-size: 13px; font-weight: 600; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-warehouse { color: #52677e; font-size: 12px; line-height: 1.5; word-break: break-all; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-body { max-height: 260px; padding: 2px 14px; overflow-y: auto; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-group { padding: 10px 0; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-group + .warehouse-picker__dept-group { border-top: 1px solid #edf1f5; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-group-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-title { color: #304256; font-size: 12px; font-weight: 600; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-count { padding: 1px 7px; border-radius: 10px; background: #edf4fc; color: #315f8a; font-size: 12px; line-height: 18px; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-list { display: grid; gap: 5px; margin: 8px 0 0; padding: 0; list-style: none; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-item { padding: 5px 8px; border-radius: 4px; background: #f6f8fb; color: #3e5167; font-size: 12px; line-height: 1.5; word-break: break-all; }
.warehouse-picker-dept-tooltip .warehouse-picker__dept-empty { padding: 8px 0 2px; color: #687b8f; font-size: 12px; }
</style>
