<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="520px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-input
      v-model="value"
      type="textarea"
      :rows="10"
      placeholder="请输入备注"
    />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'RemarkDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '备注' },
    initialValue: { type: String, default: '' },
    loading: Boolean
  },
  data() {
    return {
      value: ''
    };
  },
  watch: {
    visible(val) {
      if (val) this.value = this.initialValue || '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      this.$emit('confirm', this.value ?? '');
    }
  }
};
</script>
