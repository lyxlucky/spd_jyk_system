<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="innerVisible"
    width="420px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div v-loading="loading" class="cloud-sign-dialog">
      <p class="cloud-sign-tip">{{ tipText }}</p>
      <div v-if="qrImageSrc" class="cloud-sign-qr">
        <img :src="qrImageSrc" alt="云签二维码" />
      </div>
      <p v-else class="cloud-sign-status">{{ statusText }}</p>
      <p v-if="claimUuid" class="cloud-sign-sub">认证中，请在手机上确认…</p>
    </div>
    <span slot="footer">
      <el-button size="mini" :disabled="loading" @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/Settle/MensualBills';

const POLL_INTERVAL = 2000;
const MAX_POLL_COUNT = 90;

const ROLE_LABEL = {
  RECEIVER: '领用人',
  AUDITOR: '审核人'
};

export default {
  name: 'CloudSignQrDialog',
  data() {
    return {
      innerVisible: false,
      loading: false,
      monthId: '',
      deptTwoCode: '',
      signRole: 'AUDITOR',
      claimUuid: '',
      qrImageSrc: '',
      statusText: '正在生成二维码…',
      pollTimer: null,
      pollCount: 0,
      pollInFlight: false,
      flowSettled: false,
      flowPromise: null,
      flowResolve: null,
      flowReject: null
    };
  },
  computed: {
    dialogTitle() {
      const role = ROLE_LABEL[this.signRole] || '云签';
      return `${role}云签认证`;
    },
    tipText() {
      const role = ROLE_LABEL[this.signRole] || '相关人员';
      return `请使用圣格灵云签 App 扫描下方二维码完成${role}认证`;
    }
  },
  beforeDestroy() {
    this.clearPoll();
  },
  methods: {
    /**
     * @param {string} monthId
     * @param {string} deptTwoCode
     * @param {string} signRole RECEIVER | AUDITOR
     */
    open(monthId, deptTwoCode, signRole) {
      this.resetFlowPromise();
      this.monthId = monthId || '';
      this.deptTwoCode = deptTwoCode || '';
      this.signRole = (signRole || 'AUDITOR').toUpperCase();
      this.innerVisible = true;
      this.flowPromise = new Promise((resolve, reject) => {
        this.flowResolve = resolve;
        this.flowReject = reject;
      });
      this.startFlow();
      return this.flowPromise;
    },

    async startFlow() {
      this.resetState(true);
      this.loading = true;
      try {
        if (!this.monthId) {
          throw new Error('MonthID 不能为空');
        }
        if (!this.deptTwoCode) {
          throw new Error('请先选择科室');
        }
        if (!['RECEIVER', 'AUDITOR'].includes(this.signRole)) {
          throw new Error('SignRole 无效');
        }

        const res = await api.cloudSignGenLoginQrCode();
        const qr = res.result || res || {};
        this.claimUuid = qr.claimUuid || qr.cloudUuid || qr.cloudGuid || '';
        this.qrImageSrc = this.buildQrImageSrc(
          qr.qRCodeBase64 || qr.qrCodeBase64 || qr.QRCodeBase64
        );
        if (!this.qrImageSrc) {
          throw new Error('未获取到二维码图片');
        }
        if (!this.claimUuid) {
          throw new Error('未获取到云签 claimUuid');
        }
        this.statusText = '等待扫码…';
        this.startPoll();
      } catch (e) {
        this.failFlow(e);
      } finally {
        this.loading = false;
      }
    },

    buildQrImageSrc(base64) {
      if (!base64) return '';
      if (base64.startsWith('data:image')) return base64;
      return `data:image/png;base64,${base64}`;
    },

    startPoll() {
      this.clearPoll();
      this.pollCount = 0;
      this.pollInFlight = false;
      this.flowSettled = false;
      this.pollTimer = setInterval(() => {
        this.pollLoginResult();
      }, POLL_INTERVAL);
      this.pollLoginResult();
    },

    async pollLoginResult() {
      if (!this.claimUuid || !this.innerVisible || this.flowSettled || this.pollInFlight) return;
      this.pollCount += 1;
      if (this.pollCount > MAX_POLL_COUNT) {
        this.failFlow(new Error('云签认证超时，请重试'));
        return;
      }
      this.pollInFlight = true;
      try {
        const loginRes = await api.cloudSignGetLoginResult(this.claimUuid);
        if (this.flowSettled) return;
        this.flowSettled = true;
        this.clearPoll();
        await this.prepareSign(
          (loginRes.result && (loginRes.result.claimUuid || loginRes.result.cloudUuid)) ||
            this.claimUuid
        );
      } catch (e) {
        if (e.pending || e.code === 202 || e.code === '202') {
          return;
        }
        if (!this.flowSettled) {
          this.failFlow(e);
        }
      } finally {
        this.pollInFlight = false;
      }
    },

    async prepareSign(claimUuid) {
      this.loading = true;
      this.statusText = '扫码成功，正在获取签章…';
      try {
        await api.cloudSignPrepareMonthReportSign({
          MonthID: this.monthId,
          DeptTwoCode: this.deptTwoCode,
          SignRole: this.signRole,
          claimUuid
        });
        if (this.flowResolve) {
          this.flowResolve({
            claimUuid,
            deptTwoCode: this.deptTwoCode,
            signRole: this.signRole
          });
        }
        this.resetFlowPromise();
        this.innerVisible = false;
      } catch (e) {
        if (e.pending || e.code === 202 || e.code === '202') {
          this.statusText = e.message || '正在处理签章…';
          return;
        }
        this.failFlow(e);
      } finally {
        this.loading = false;
      }
    },

    cancel() {
      this.innerVisible = false;
      if (this.flowReject) {
        this.flowReject(new Error('已取消云签认证'));
      }
      this.resetFlowPromise();
    },

    handleClose() {
      this.clearPoll();
      if (this.flowReject) {
        this.flowReject(new Error('已取消云签认证'));
      }
      this.resetFlowPromise();
    },

    failFlow(error) {
      this.flowSettled = true;
      this.clearPoll();
      this.loading = false;
      this.statusText = error.message || '云签认证失败';
      this.$message.error(this.statusText);
      if (this.flowReject) {
        this.flowReject(error);
      }
      this.resetFlowPromise();
      this.innerVisible = false;
    },

    clearPoll() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      this.pollInFlight = false;
    },

    resetState(keepVisible) {
      this.clearPoll();
      this.claimUuid = '';
      this.qrImageSrc = '';
      this.pollCount = 0;
      this.flowSettled = false;
      this.statusText = '正在生成二维码…';
      if (!keepVisible) {
        this.innerVisible = false;
      }
    },

    resetFlowPromise() {
      this.flowPromise = null;
      this.flowResolve = null;
      this.flowReject = null;
    }
  }
};
</script>

<style scoped lang="scss">
.cloud-sign-dialog {
  min-height: 280px;
  text-align: center;
}

.cloud-sign-tip {
  margin: 0 0 12px;
  color: #606266;
  font-size: 13px;
}

.cloud-sign-qr img {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.cloud-sign-status {
  margin-top: 48px;
  color: #909399;
}

.cloud-sign-sub {
  margin-top: 12px;
  color: #409eff;
  font-size: 12px;
}
</style>
