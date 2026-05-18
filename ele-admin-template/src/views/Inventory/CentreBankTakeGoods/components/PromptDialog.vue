<template>
  <ele-modal :visible="visible" :title="title" width="420px" @update:visible="$emit('update:visible', $event)">
    <el-form size="small" label-width="100px">
      <el-form-item :label="label">
        <el-select v-if="options && options.length" v-model="innerValue" style="width: 100%">
          <el-option v-for="o in options" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
        <el-input v-else v-model="innerValue" clearable />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onOk">确定</el-button>
    </template>
  </ele-modal>
</template>

<script>
export default {
  name: 'PromptDialog',
  props: {
    visible: Boolean,
    title: String,
    label: String,
    value: [String, Number],
    options: { type: Array, default: () => [] },
    loading: Boolean
  },
  data() {
    return { innerValue: '' };
  },
  watch: {
    visible(v) {
      if (v) this.innerValue = this.value != null ? String(this.value) : '';
    }
  },
  methods: {
    onOk() {
      this.$emit('confirm', this.innerValue);
    }
  }
};
</script>
