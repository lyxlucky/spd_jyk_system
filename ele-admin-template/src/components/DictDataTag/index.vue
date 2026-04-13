<template>
  <el-tag v-bind="tagAttrs" :class="mergedClass">
    <slot>{{ displayText }}</slot>
  </el-tag>
</template>

<script>
/**
 * 字典项 / 通用状态 Tag 展示（对齐 DICT_DATA：DictLabel、TagColor、TagEffect、ListCssClass）
 * 用法：
 *   <dict-data-tag :item="row" />
 *   <dict-data-tag dict-label="启用" tag-color="success" />
 *   <dict-data-tag :item="row" size="mini" />
 */
const TYPE_PRESETS = ['primary', 'success', 'info', 'warning', 'danger'];

function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (let i = 0; i < keys.length; i++) {
    const v = obj[keys[i]];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

export default {
  name: 'DictDataTag',
  props: {
    /** 字典行（后端 DictDataRow 或列表行），与下方独立字段二选一 */
    item: {
      type: Object,
      default: null
    },
    /** 无 item 时直接指定展示文案 */
    dictLabel: {
      type: String,
      default: ''
    },
    dictValue: {
      type: [String, Number],
      default: ''
    },
    /** 预设类型名 success / warning / danger / info / primary，或 #RRGGBB / rgb() */
    tagColor: {
      type: String,
      default: ''
    },
    /** 与后端 TAG_EFFECT 一致：plain / dark / light（light 为默认样式） */
    tagEffect: {
      type: String,
      default: ''
    },
    /** 附加到 el-tag 的 class，对应 LIST_CSS_CLASS */
    listCssClass: {
      type: String,
      default: ''
    },
    /** el-tag size：medium / small / mini */
    size: {
      type: String,
      default: 'small'
    },
    /** 无文案时的占位 */
    emptyText: {
      type: String,
      default: '—'
    },
    /** 是否禁用过渡（表格内大量渲染时可 true） */
    disableTransitions: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    row() {
      return this.item || {};
    },
    displayText() {
      const fromItem =
        pick(this.row, [
          'DictLabel',
          'dictLabel',
          'DICT_LABEL',
          'label',
          'Label'
        ]) ??
        pick(this.row, ['DictValue', 'dictValue', 'DICT_VALUE', 'value', 'Value']);
      const fromProp =
        (this.dictLabel !== undefined && this.dictLabel !== null && String(this.dictLabel) !== ''
          ? this.dictLabel
          : null) ??
        (this.dictValue !== undefined && this.dictValue !== null && String(this.dictValue) !== ''
          ? String(this.dictValue)
          : null);
      const text = fromItem != null && String(fromItem) !== '' ? String(fromItem) : fromProp;
      return text != null && String(text) !== '' ? String(text) : this.emptyText;
    },
    colorRaw() {
      return (
        pick(this.row, ['TagColor', 'tagColor', 'TAG_COLOR']) ||
        (this.tagColor ? String(this.tagColor) : '')
      ).trim();
    },
    effectRaw() {
      const e =
        pick(this.row, ['TagEffect', 'tagEffect', 'TAG_EFFECT']) ||
        (this.tagEffect ? String(this.tagEffect) : '');
      return String(e).trim().toLowerCase();
    },
    listClassFromRow() {
      return pick(this.row, ['ListCssClass', 'listCssClass', 'LIST_CSS_CLASS']) || '';
    },
    tagAttrs() {
      const attrs = {
        size: this.size,
        disableTransitions: this.disableTransitions
      };
      const raw = this.colorRaw;
      if (!raw) {
        return attrs;
      }
      const lower = raw.toLowerCase();
      if (TYPE_PRESETS.indexOf(lower) !== -1) {
        attrs.type = lower;
      } else if (lower.indexOf('#') === 0 || lower.indexOf('rgb') === 0) {
        attrs.color = raw;
      } else {
        attrs.type = 'info';
      }
      return attrs;
    },
    mergedClass() {
      const parts = ['dict-data-tag'];
      const lc = [this.listClassFromRow, this.listCssClass].filter(Boolean).join(' ').trim();
      if (lc) {
        parts.push(lc);
      }
      const eff = this.effectRaw;
      if (eff === 'plain') {
        parts.push('dict-data-tag--plain');
      } else if (eff === 'dark') {
        parts.push('dict-data-tag--dark');
      } else if (eff === 'light') {
        parts.push('dict-data-tag--light');
      }
      return parts.join(' ');
    },
  }
};
</script>

<style scoped>
.dict-data-tag.dict-data-tag--plain {
  background-color: transparent !important;
  border-style: dashed;
}

.dict-data-tag.dict-data-tag--dark {
  filter: brightness(0.92);
  font-weight: 600;
}

.dict-data-tag.dict-data-tag--light {
  opacity: 0.95;
}
</style>
