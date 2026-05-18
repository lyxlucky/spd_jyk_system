<template>
  <ele-modal
    :visible="visible"
    :title="title"
    :width="width"
    :destroy-on-close="true"
    custom-class="legacy-frame-dialog"
    @update:visible="$emit('update:visible', $event)"
  >
    <iframe v-if="visible && src" class="legacy-frame" :src="src" frameborder="0" />
  </ele-modal>
</template>

<script>
import { legacyWebBase } from '../utils';
import { TOKEN_STORE_NAME } from '@/config/setting';

export default {
  name: 'LegacyFrameDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    path: { type: String, required: true },
    width: { type: String, default: '1200px' }
  },
  computed: {
    src() {
      const token =
        sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
      const q = token ? `?Token=${encodeURIComponent(token)}` : '';
      return `${legacyWebBase()}${this.path}${q}`;
    }
  }
};
</script>

<style scoped>
.legacy-frame {
  width: 100%;
  height: 72vh;
  border: none;
}
</style>
