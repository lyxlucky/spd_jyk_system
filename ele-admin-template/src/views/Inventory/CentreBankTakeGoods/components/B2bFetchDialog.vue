<template>
  <ele-modal :visible="visible" title="获取收货单（B2B）" width="480px" @update:visible="$emit('update:visible', $event)">
    <el-form label-width="100px" size="small">
      <el-form-item label="B2B订单号">
        <el-input v-model="orderNum" placeholder="请输入发货/订单号" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </template>
  </ele-modal>
</template>

<script>
import { Message } from 'element-ui';
import { fetchB2bOrder } from '@/api/Inventory/CentreBankTakeGoods';

export default {
  name: 'B2bFetchDialog',
  props: { visible: Boolean },
  data() {
    return { orderNum: '', loading: false };
  },
  methods: {
    async onSubmit() {
      if (!this.orderNum.trim()) {
        Message.warning('请输入订单号');
        return;
      }
      this.loading = true;
      try {
        const res = await fetchB2bOrder(this.orderNum.trim());
        Message.success(res.msg || '获取成功');
        this.$emit('done');
        this.$emit('update:visible', false);
        this.orderNum = '';
      } catch (e) {
        Message.error(e.message || '获取失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
