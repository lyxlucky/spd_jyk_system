<template>
  <i
    v-if="isFontIcon"
    :class="[iconValue, 'menu-font-icon']"
    :style="{ fontSize: pixel, lineHeight: pixel }"
  />
  <svg-icon
    v-else
    :icon-class="iconValue"
    :style="{ width: pixel, height: pixel }"
  />
</template>

<script>
/**
 * 菜单图标统一渲染：el-icon-* 字体图标 / 本地 svg 雪碧图 / 非法值兜底。
 * 主页北京院区网格、最近使用卡片、添加弹窗共用，避免各处漏判分支导致空白。
 */
import { isSvgIcon, isValidIcon } from '@/utils/menu-icon';

export default {
  name: 'MenuIcon',
  props: {
    icon: { type: [String, Number], default: '' },
    size: { type: [Number, String], default: 40 }
  },
  computed: {
    pixel() {
      return (Number(this.size) || 40) + 'px';
    },
    iconValue() {
      const value = String(this.icon || '').trim();
      // 最后防线：任何非法值都退回确定的字体图标，绝不渲染空白
      return isValidIcon(value) ? value : 'el-icon-document';
    },
    isFontIcon() {
      return /^el-icon[-_]/.test(this.iconValue) && !isSvgIcon(this.iconValue);
    }
  }
};
</script>
