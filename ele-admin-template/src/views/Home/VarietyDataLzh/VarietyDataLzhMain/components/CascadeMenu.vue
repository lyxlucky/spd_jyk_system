<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    trigger="click"
    popper-class="spd-cascade-pop"
    @show="onShow"
  >
    <div class="spd-cascade">
      <div class="spd-cascade__col spd-cascade__col--group">
        <div
          v-for="group in groups"
          :key="group.key"
          class="spd-cascade__item"
          :class="{ 'is-active': activeKey === group.key }"
          @mouseenter="activeKey = group.key"
          @click="activeKey = group.key"
        >
          <span class="spd-cascade__label">{{ group.label }}</span>
          <span v-if="groupHint(group)" class="spd-cascade__hint">{{ groupHint(group) }}</span>
          <i class="el-icon-arrow-right" />
        </div>
      </div>
      <div class="spd-cascade__col">
        <div
          v-for="item in activeItems"
          :key="itemKey(item)"
          class="spd-cascade__item spd-cascade__item--option"
          :class="{
            'is-selected': isSelected(item),
            'is-disabled': item.disabled || item.loading
          }"
          :title="item.title || ''"
          @click="onPick(item)"
        >
          <i v-if="item.loading" class="el-icon-loading spd-cascade__mark" />
          <i v-else-if="isSelected(item)" class="el-icon-check spd-cascade__mark" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <el-button
      slot="reference"
      :size="size"
      :loading="loading"
      :title="buttonTitle || buttonText"
      :class="['spd-cascade-btn', { 'is-filtered': active, 'is-field': tone === 'field' }]"
    >
      <span class="spd-cascade-btn__text">{{ buttonText }}</span>
      <i class="el-icon-arrow-down el-icon--right" />
    </el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'CascadeMenu',
  props: {
    groups: { type: Array, default: () => [] },
    selected: { type: Object, default: () => ({}) },
    buttonText: { type: String, default: '' },
    buttonTitle: { type: String, default: '' },
    size: { type: String, default: 'mini' },
    tone: { type: String, default: 'button' },
    loading: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    closeOnSelect: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: false,
      activeKey: ''
    };
  },
  computed: {
    activeGroup() {
      return this.groups.find((g) => g.key === this.activeKey) || this.groups[0] || null;
    },
    activeItems() {
      return (this.activeGroup && this.activeGroup.items) || [];
    }
  },
  methods: {
    onShow() {
      const current = this.groups.find((g) => this.groupHint(g));
      const first = current || this.groups[0];
      this.activeKey = first ? first.key : '';
    },
    groupValue(group) {
      const raw = this.selected[group.key];
      if (raw == null || raw === '') return String(group.defaultValue ?? '');
      return String(raw);
    },
    groupHint(group) {
      if (group.defaultValue === undefined) return '';
      const current = this.groupValue(group);
      if (current === String(group.defaultValue)) return '';
      const item = (group.items || []).find((i) => String(i.value) === current);
      return item ? item.label : '';
    },
    isSelected(item) {
      if (!this.activeGroup || item.value === undefined) return false;
      return this.groupValue(this.activeGroup) === String(item.value);
    },
    itemKey(item) {
      return item.command != null ? item.command : String(item.value);
    },
    onPick(item) {
      if (item.disabled || item.loading || !this.activeGroup) return;
      this.$emit('select', { group: this.activeGroup, item });
      if (this.closeOnSelect) this.visible = false;
    }
  }
};
</script>

<style scoped>
.spd-cascade {
  display: flex;
  align-items: stretch;
  min-height: 96px;
  font-size: 12px;
  color: #606266;
}
.spd-cascade__col {
  min-width: 132px;
  padding: 4px 0;
}
.spd-cascade__col--group {
  background: #fafbfc;
  border-right: 1px solid #ebeef5;
}
.spd-cascade__item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px 0 12px;
  cursor: pointer;
  white-space: nowrap;
}
.spd-cascade__item:hover,
.spd-cascade__item.is-active {
  background: #f5f7fa;
  color: #409eff;
}
.spd-cascade__item--option {
  position: relative;
  padding-left: 28px;
}
.spd-cascade__item.is-selected {
  color: #409eff;
  font-weight: 600;
  background: #ecf5ff;
}
.spd-cascade__item.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background: transparent;
}
.spd-cascade__label {
  flex: none;
}
.spd-cascade__hint {
  max-width: 72px;
  overflow: hidden;
  color: #409eff;
  text-overflow: ellipsis;
}
.spd-cascade__item .el-icon-arrow-right {
  margin-left: auto;
  color: #c0c4cc;
  font-size: 12px;
}
.spd-cascade__item:hover .el-icon-arrow-right,
.spd-cascade__item.is-active .el-icon-arrow-right {
  color: #409eff;
}
.spd-cascade__mark {
  position: absolute;
  left: 10px;
  font-size: 12px;
}
.spd-cascade-btn__text {
  display: inline-block;
  max-width: 168px;
  overflow: hidden;
  vertical-align: bottom;
  text-overflow: ellipsis;
}
.spd-cascade-btn.is-field {
  height: 26px;
  padding: 0 8px;
  color: #606266;
  font-size: 12px;
  line-height: 24px;
  background: #fff;
  border-color: #dcdfe6;
}
.spd-cascade-btn.is-field:hover,
.spd-cascade-btn.is-field:focus {
  color: #409eff;
  background: #fff;
  border-color: #c6e2ff;
}
.spd-cascade-btn.is-field.is-filtered {
  color: #409eff;
  border-color: #b3d8ff;
  background: #ecf5ff;
}
</style>

<style>
.spd-cascade-pop.el-popover {
  padding: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
