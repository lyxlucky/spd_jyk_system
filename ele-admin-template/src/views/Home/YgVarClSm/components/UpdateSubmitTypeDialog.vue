<template>
  <el-dialog
    title="修改提交类型"
    :visible="visible"
    width="420px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-select v-model="submitType" style="width: 100%">
      <el-option label="新增" value="0" />
      <el-option label="修改" value="1" />
      <el-option label="调价" value="2" />
    </el-select>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">提交</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'UpdateSubmitTypeDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return { submitType: '0' };
  },
  watch: {
    visible(val) {
      if (val) this.submitType = '0';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      this.$emit('confirm', this.submitType);
    }
  }
};
</script>
