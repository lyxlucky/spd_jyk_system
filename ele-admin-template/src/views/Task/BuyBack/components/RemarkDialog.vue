<template>
  <el-dialog
    :title="`${returnNumber} 备注`"
    :visible="visible"
    width="600px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-input v-model="remark" type="textarea" :rows="12" placeholder="请输入备注" />
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { showGoodsNumBz } from '@/api/Task/BuyBack';
import { unwrapData, isOkCode } from '../utils';

export default {
  name: 'RemarkDialog',
  props: {
    visible: Boolean,
    returnNumber: { type: String, default: '' }
  },
  data() {
    return {
      remark: '',
      loading: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.returnNumber) {
        this.loadRemark();
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    loadRemark() {
      showGoodsNumBz(this.returnNumber).then((res) => {
        const data = unwrapData(res);
        if (isOkCode(data?.code)) {
          this.remark = data.result?.[0]?.BZ || '';
        } else if (data?.code === 301 || data?.code === '301') {
          this.$message.error(data.msg || '登录失效');
        } else {
          this.$message.error('获取备注失败');
        }
      });
    },
    handleSubmit() {
      this.$emit('submit', this.remark);
    }
  }
};
</script>
