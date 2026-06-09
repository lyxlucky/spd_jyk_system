<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="600px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-input v-model="localRemark" type="textarea" :rows="12" placeholder="请输入备注" />
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'RemarkDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '备注' },
    remark: { type: String, default: '' },
    loading: Boolean
  },
  data() {
    return {
      localRemark: ''
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.localRemark = this.remark || '';
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    handleSubmit() {
      this.$emit('submit', this.localRemark);
    }
  }
};
</script>
