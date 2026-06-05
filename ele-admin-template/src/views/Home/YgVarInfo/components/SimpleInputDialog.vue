<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form label-width="80px" @submit.native.prevent>
      <el-form-item :label="label">
        <el-input v-model="inputValue" :placeholder="placeholder" @keyup.enter.native="confirm" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'YgVarSimpleInputDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    loading: Boolean
  },
  data() {
    return {
      inputValue: ''
    };
  },
  watch: {
    visible(val) {
      if (val) this.inputValue = '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      this.$emit('confirm', (this.inputValue || '').trim());
    }
  }
};
</script>
