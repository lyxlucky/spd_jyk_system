<template>
  <el-dialog
    :title="title"
    :visible.sync="innerVisible"
    width="680px"
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="keept-error-body">
      <div
        v-for="(line, idx) in messageLines"
        :key="idx"
        class="keept-error-line"
      >
        {{ line }}
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="innerVisible = false">我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'KeeptListErrorDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '添加失败提示'
      },
      message: {
        type: String,
        default: ''
      }
    },
    computed: {
      innerVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        }
      },
      messageLines() {
        const lines = String(this.message || '')
          .split(/<\/?br\s*\/?>|\r?\n/i)
          .map((line) => line.trim())
          .filter(Boolean);
        return lines.length ? lines : ['操作失败，请重试'];
      }
    }
  };
</script>

<style scoped>
  .keept-error-body {
    max-height: 55vh;
    overflow-y: auto;
    padding: 8px 4px;
    font-size: 16px;
    line-height: 1.8;
    color: #f56c6c;
    font-weight: 500;
    word-break: break-word;
  }

  .keept-error-line + .keept-error-line {
    margin-top: 8px;
  }
</style>
