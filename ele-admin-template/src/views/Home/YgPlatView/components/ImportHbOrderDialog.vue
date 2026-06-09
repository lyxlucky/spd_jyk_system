<template>
  <el-dialog
    title="导入回填订单表"
    :visible="visible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-upload
      ref="upload"
      action=""
      :auto-upload="false"
      :limit="1"
      :on-change="onFileChange"
      :on-remove="onFileRemove"
    >
      <el-button size="small" type="primary">选择文件</el-button>
    </el-upload>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: 'ImportHbOrderDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return {
      file: null
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.file = null;
        this.$nextTick(() => this.$refs.upload?.clearFiles());
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    onFileChange(file) {
      this.file = file.raw;
    },
    onFileRemove() {
      this.file = null;
    },
    confirm() {
      if (!this.file) {
        Message.warning('请选择文件');
        return;
      }
      this.$emit('confirm', this.file);
    }
  }
};
</script>
