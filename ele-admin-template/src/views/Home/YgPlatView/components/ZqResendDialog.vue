<template>
  <el-dialog
    :title="'阳光平台发送截止日期 - ' + monthlyLabel"
    :visible="visible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form label-width="80px" @submit.native.prevent>
      <el-form-item label="截止日期" required>
        <el-date-picker
          v-model="sendDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
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
  name: 'ZqResendDialog',
  props: {
    visible: Boolean,
    loading: Boolean,
    monthId: { type: [String, Number], default: '0' },
    monthlyLabel: { type: String, default: '' }
  },
  data() {
    return {
      sendDate: ''
    };
  },
  watch: {
    visible(val) {
      if (val) this.sendDate = '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    confirm() {
      this.$emit('confirm', {
        date: this.sendDate,
        monthId: this.monthId
      });
    }
  }
};
</script>
