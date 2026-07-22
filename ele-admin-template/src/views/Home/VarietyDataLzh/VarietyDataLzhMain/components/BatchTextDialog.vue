<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="520px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-input v-model="text" type="textarea" :rows="10" :placeholder="placeholder" />
    <el-checkbox v-if="showAppend" v-model="append" style="margin-top: 10px">
      追加到原备注后（不覆盖）
    </el-checkbox>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button
        v-if="showQuick"
        size="mini"
        :loading="loading"
        @click="confirm(2)"
      >
        快速备注
      </el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm(1)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'BatchTextDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '备注' },
    placeholder: { type: String, default: '请输入内容' },
    loading: Boolean,
    showQuick: Boolean,
    showAppend: Boolean,
    initialValue: { type: String, default: '' }
  },
  data() {
    return {
      text: '',
      append: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.text = this.initialValue || '';
        this.append = false;
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    confirm(tag) {
      this.$emit('confirm', {
        text: this.text,
        tag,
        append: this.append ? '1' : '0'
      });
    }
  }
};
</script>
