<template>
  <el-dialog
    title="添加采购"
    :visible="visible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form size="mini" label-width="100px">
      <el-form-item label="起始时间">
        <el-date-picker
          v-model="form.BUY_TIME"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.BUY_TIME2"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.COUNT" type="number" placeholder="数量" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.PRICE" type="number" placeholder="价格" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AddVarLimitBuy } from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'VarLimitBuyDialog',
  props: {
    visible: Boolean,
    varietieCode: { type: [String, Number], default: '' }
  },
  data() {
    return {
      loading: false,
      form: {
        BUY_TIME: '',
        BUY_TIME2: '',
        COUNT: '',
        PRICE: ''
      }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = { BUY_TIME: '', BUY_TIME2: '', COUNT: '', PRICE: '' };
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async onSubmit() {
      if (!this.varietieCode) {
        this.$message.warning('缺少品种编码');
        return;
      }
      this.loading = true;
      try {
        const res = await AddVarLimitBuy({
          VARIETIE_CODE: this.varietieCode,
          COUNT: this.form.COUNT,
          BUY_TIME: this.form.BUY_TIME,
          BUY_TIME2: this.form.BUY_TIME2,
          PRICE: this.form.PRICE
        });
        this.$message.success(res.msg || '添加成功');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '添加失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
