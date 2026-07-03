<template>
  <el-dialog
    title="备注"
    :visible="visible"
    width="520px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-input v-model="value" type="textarea" :rows="10" placeholder="请输入不通过原因" />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'RejectRemarkDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return { value: '' };
  },
  watch: {
    visible(val) {
      if (val) this.value = '';
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
