<template>
  <span>
    <el-button
      v-if="meta.clickable"
      type="text"
      size="mini"
      class="date-link"
      @click="$emit('preview', picFieldValue)"
    >
      {{ meta.text }}
    </el-button>
    <span v-else>{{ meta.text }}</span>
  </span>
</template>

<script>
import { formatValidDate } from '../utils';

export default {
  name: 'DateLink',
  props: {
    row: { type: Object, required: true },
    field: { type: String, required: true },
    picField: { type: String, required: true }
  },
  computed: {
    picFieldValue() {
      return this.row[this.picField];
    },
    meta() {
      return formatValidDate(this.row[this.field], this.picField, this.row);
    }
  }
};
</script>

<style scoped>
.date-link {
  padding: 0;
  color: #409eff;
}
</style>
