<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="720px" append-to-body @open="onOpen" @closed="onClosed">
    <div class="scan-row">
      <el-input
        ref="udi1"
        v-model="scan.udi1"
        size="small"
        clearable
        placeholder="UDI"
        @keyup.enter.native="onScan"
      />
      <el-input
        ref="udi2"
        v-model="scan.udi2"
        size="small"
        clearable
        placeholder="UDI补充"
        style="margin-top: 8px"
        @keyup.enter.native="onScan"
      />
      <el-checkbox v-model="scan.multiSegment" style="margin-top: 8px">多段UDI</el-checkbox>
    </div>
    <el-form label-width="120px" size="small" class="info-form">
      <el-form-item label="UDI">
        <div class="pair">
          <el-input :value="ctx.udiTop" disabled />
          <el-input :value="parsed.udiTop" disabled :class="{ mismatch: diff.udi }" />
        </div>
      </el-form-item>
      <el-form-item label="品种(材料)编码">
        <el-input :value="ctx.varietyCode" disabled />
      </el-form-item>
      <el-form-item label="品种全称">
        <el-input :value="ctx.varietyName" disabled />
      </el-form-item>
      <el-form-item label="生产批号">
        <div class="pair">
          <el-input :value="ctx.batch" disabled />
          <el-input :value="parsed.batch" disabled :class="{ mismatch: diff.batch }" />
        </div>
      </el-form-item>
      <el-form-item label="生产日期">
        <div class="pair">
          <el-input :value="ctx.prodDate" disabled :class="{ mismatch: diff.prodDate }" />
          <el-input :value="parsed.prodDate" disabled />
        </div>
      </el-form-item>
      <el-form-item label="失效日期">
        <div class="pair">
          <el-input :value="ctx.validDate" disabled :class="{ mismatch: diff.validDate }" />
          <el-input :value="parsed.validDate" disabled />
        </div>
      </el-form-item>
    </el-form>
    <div class="footer-row">
      <span>请输入数量</span>
      <el-input-number v-model="qty" :min="1" :controls="false" size="small" style="width: 100px" />
      <el-button type="primary" size="small" :loading="submitting" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Inventory/CentreBankTakeGoods';
import { fmtDate10 } from '../utils';

export default {
  name: 'UdiScanDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: 'UDI扫码' },
    /** { batchId, varietyCode, varietyName, batch, prodDate, validDate, receivable } */
    context: { type: Object, default: null }
  },
  data() {
    return {
      innerVisible: false,
      scan: { udi1: '', udi2: '', multiSegment: false },
      qty: 1,
      parsed: { udiTop: '', batch: '', prodDate: '', validDate: '' },
      diff: { udi: false, batch: false, prodDate: false, validDate: false },
      scanning: false,
      submitting: false
    };
  },
  computed: {
    ctx() {
      const c = this.context || {};
      return {
        udiTop: c.udiTop || '',
        varietyCode: c.varietyCode || '',
        varietyName: c.varietyName || '',
        batch: c.batch || '',
        prodDate: fmtDate10(c.prodDate),
        validDate: fmtDate10(c.validDate)
      };
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
      this.$nextTick(() => this.$refs.udi1?.focus());
    },
    onClosed() {
      this.scan = { udi1: '', udi2: '', multiSegment: false };
      this.qty = 1;
      this.parsed = { udiTop: '', batch: '', prodDate: '', validDate: '' };
      this.diff = { udi: false, batch: false, prodDate: false, validDate: false };
    },
    fullUdi() {
      if (this.scan.multiSegment) {
        if (this.scan.udi1 && !this.scan.udi2) {
          this.$nextTick(() => this.$refs.udi2?.focus());
          return '';
        }
        return this.scan.udi1 + this.scan.udi2;
      }
      return this.scan.udi1;
    },
    async onScan() {
      const udi = this.fullUdi();
      if (!udi) return;
      this.scanning = true;
      try {
        const res = await api.getInfoByScanUdi(udi);
        const d = res.data || {};
        this.parsed = {
          udiTop: d.UDI_TOP || '',
          batch: d.Batch || '',
          prodDate: fmtDate10(d.scrq),
          validDate: fmtDate10(d.xq)
        };
        const leftUdi = (this.ctx.udiTop || '').substr(4);
        this.diff = {
          udi: this.parsed.udiTop && leftUdi !== this.parsed.udiTop,
          prodDate: this.parsed.prodDate && this.parsed.prodDate !== this.ctx.prodDate,
          validDate: this.parsed.validDate && this.parsed.validDate !== this.ctx.validDate,
          batch: false
        };
        Message.success(res.msg || '解析成功');
      } catch (e) {
        Message.error(e.message || 'UDI解析失败');
      } finally {
        this.scanning = false;
      }
    },
    async onSubmit() {
      const udi = this.fullUdi();
      if (!udi) {
        Message.warning('UDI不能为空');
        return;
      }
      if (!this.context?.batchId) {
        Message.warning('缺少批次标识');
        return;
      }
      this.submitting = true;
      try {
        await api.addShUdi({
          serialNumber: udi,
          serialNumber2: udi,
          batchId: this.context.batchId,
          qty: this.qty,
          receivable: this.context.receivable ?? 0
        });
        Message.success('添加成功');
        this.scan.udi1 = '';
        this.scan.udi2 = '';
        this.qty = 1;
        this.$emit('added');
        this.$nextTick(() => this.$refs.udi1?.focus());
      } catch (e) {
        Message.error(e.message || '添加失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.scan-row {
  margin-bottom: 16px;
}
.info-form {
  max-width: 640px;
}
.pair {
  display: flex;
  gap: 10px;
}
.pair .el-input {
  flex: 1;
}
.mismatch :deep(.el-input__inner) {
  color: #f56c6c;
}
.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}
</style>
