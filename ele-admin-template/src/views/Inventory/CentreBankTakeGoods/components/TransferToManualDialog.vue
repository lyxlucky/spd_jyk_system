<template>
  <el-dialog title="转人工收货单" :visible.sync="innerVisible" width="480px" append-to-body @open="onOpen">
    <el-form ref="form" :model="form" label-width="100px" size="small">
      <el-form-item label="收货类型" required>
        <el-select v-model="form.receiveProperty" style="width: 100%">
          <el-option label="普通收货" value="0" />
          <el-option label="盘溢收货" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="收货库区" required>
        <el-select v-model="form.storageId" style="width: 100%" placeholder="请选择库区">
          <el-option
            v-for="st in storageList"
            :key="st.ID"
            :label="st.NAME"
            :value="String(st.ID)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" required>
        <el-input v-model="form.noteDescription" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="已选品种">
        <span>{{ dtlCount }} 条明细</span>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="innerVisible = false">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Inventory/CentreBankTakeGoods';

export default {
  name: 'TransferToManualDialog',
  props: {
    visible: Boolean,
    receipt: { type: Object, default: null },
    receiptHeader: { type: Object, default: null },
    dtlIds: { type: Array, default: () => [] },
    storageList: { type: Array, default: () => [] }
  },
  data() {
    return {
      innerVisible: false,
      loading: false,
      form: {
        receiveProperty: '0',
        storageId: '',
        noteDescription: ''
      }
    };
  },
  computed: {
    dtlCount() {
      return (this.dtlIds || []).length;
    }
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.form = {
        receiveProperty: '0',
        storageId: this.storageList.length ? String(this.storageList[0].ID) : '',
        noteDescription: ''
      };
    },
    async onSubmit() {
      if (!this.dtlIds.length) {
        Message.warning('请至少选中一行明细');
        return;
      }
      if (!this.receipt) {
        Message.warning('请先选择收货单');
        return;
      }
      if (!this.form.storageId) {
        Message.warning('请选择收货库区');
        return;
      }
      if (!String(this.form.noteDescription || '').trim()) {
        Message.warning('请填写备注');
        return;
      }
      this.loading = true;
      try {
        const res = await api.transferToManual({
          receiveProperty: this.form.receiveProperty,
          storageId: this.form.storageId,
          noteDescription: this.form.noteDescription,
          deliveryId: this.receipt.Goods_Var_Cargo_Receipt_Id,
          deliveryNoteNumber: this.receipt.Delivery_Note_Number,
          prepareGoodsPlanNumber:
            this.receiptHeader?.Prepare_Goods_Plan_Number ||
            this.receipt.Prepare_Goods_Plan_Number ||
            '',
          dtlIds: this.dtlIds
        });
        const note = this.receipt.Delivery_Note_Number;
        api.syncB2bOrderReceive(note).catch(() => {});
        Message.success(res.msg || '创建成功');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '转单失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
