<template>
  <el-dialog
    :title="mode === 'auth' ? '修改授权到期' : '修改合同明细起始结束日期'"
    :visible.sync="dialogVisible"
    width="520px"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <el-form label-width="150px" size="small">
      <template v-if="mode === 'auth'">
        <el-form-item label="授权到期">
          <span>{{ originAuthValid || '—' }}</span>
        </el-form-item>
        <el-form-item label="修改授权到期" required>
          <el-date-picker v-model="newAuthValid" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="合同明细起始">
          <span>{{ originStart || '—' }}</span>
        </el-form-item>
        <el-form-item label="修改合同明细起始" required>
          <el-date-picker v-model="startDetail" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
        <el-form-item label="合同明细结束">
          <span>{{ originEnd || '—' }}</span>
        </el-form-item>
        <el-form-item label="修改合同明细结束" required>
          <el-date-picker v-model="endDetail" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
      </template>
      <el-form-item>
        <el-checkbox v-model="syncRegCert">同合同同注册证同步修改</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="syncContract">本合同同步修改</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { modifyAuthValid } from '@/api/Home/Contract';
import { formatContractDate } from '../utils';

export default {
  name: 'ModifyDateDialog',
  props: {
    visible: Boolean,
    mode: { type: String, default: 'auth' },
    rows: { type: Array, default: () => [] },
    singleRow: Object
  },
  data() {
    return {
      loading: false,
      newAuthValid: '',
      startDetail: '',
      endDetail: '',
      originAuthValid: '',
      originStart: '',
      originEnd: '',
      syncRegCert: false,
      syncContract: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    targetRows() {
      if (this.singleRow) return [this.singleRow];
      if (this.rows?.length) return this.rows;
      return [];
    }
  },
  methods: {
    onOpen() {
      const row = this.singleRow || this.rows?.[0] || {};
      this.originAuthValid = formatContractDate(row.Auth_Valid);
      this.originStart = formatContractDate(row.DET_CONTRACT_START);
      this.originEnd = formatContractDate(row.DET_CONTRACT_END);
      this.newAuthValid = this.originAuthValid;
      this.startDetail = this.originStart;
      this.endDetail = this.originEnd;
      this.syncRegCert = false;
      this.syncContract = false;
    },
    buildGuidsJson() {
      return JSON.stringify(
        this.targetRows.map((r) => ({ GUID: r.contract_detail_guid })).filter((x) => x.GUID)
      );
    },
    async onSubmit() {
      if (!this.targetRows.length) {
        this.$message.warning('请选择一行或勾选品种');
        return;
      }
      const guidsJson = this.buildGuidsJson();
      let payload;
      if (this.mode === 'auth') {
        const changed = this.newAuthValid !== this.originAuthValid ? '1' : '0';
        if (changed === '0') {
          this.$message.warning('未修改任何日期');
          return;
        }
        payload = {
          guidsJson,
          newAuthValid: this.newAuthValid,
          syncContract: this.syncContract ? '1' : '0',
          syncRegCert: this.syncRegCert ? '1' : '0',
          changeAuthValid: '1',
          changeContractStart: '0',
          changeContractEnd: '0'
        };
      } else {
        const cs = this.startDetail !== this.originStart ? '1' : '0';
        const ce = this.endDetail !== this.originEnd ? '1' : '0';
        if (cs === '0' && ce === '0') {
          this.$message.warning('未修改任何日期');
          return;
        }
        payload = {
          guidsJson,
          startDetail: this.startDetail,
          endDetail: this.endDetail,
          syncContract: this.syncContract ? '1' : '0',
          syncRegCert: this.syncRegCert ? '1' : '0',
          changeAuthValid: '0',
          changeContractStart: cs,
          changeContractEnd: ce
        };
      }
      this.loading = true;
      try {
        await modifyAuthValid(payload);
        this.$message.success('编辑成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '编辑失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
