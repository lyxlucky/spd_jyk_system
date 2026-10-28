<template>
  <div>
    <!-- 效期到期弹框（登录后按权限自动弹出，对齐老系统 showTip） -->
    <ele-modal
      :visible.sync="effectiveTipVisible"
      title="效期提醒"
      width="90%"
      top="4vh"
      :close-on-click-modal="false"
      custom-class="login-tip-dialog"
      @closed="onEffectiveTipClosed"
    >
      <div class="login-tip-body">
        <effective-tip-win-show v-if="effectiveTipMounted" embedded />
      </div>
    </ele-modal>

    <!-- 库存近效期提醒（登录后按权限自动弹出，对齐老系统 showKsTip） -->
    <ele-modal
      :visible.sync="ksRemindVisible"
      title="库存近效期提醒"
      width="90%"
      top="3vh"
      :close-on-click-modal="false"
      custom-class="login-tip-dialog"
      @closed="onKsRemindClosed"
    >
      <div class="login-tip-body">
        <ks-expiration-reminder v-if="ksRemindMounted" />
      </div>
    </ele-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { hasPermission } from '@/utils/permission';
import EffectiveTipWinShow from '@/views/Statistics/EffectiveTipWinShow/index.vue';
import KsExpirationReminder from '@/views/KSInventory/KSExpirationReminder/index.vue';

const SESSION_EFFECTIVE = 'spd_login_tip_effective';
const SESSION_KS = 'spd_login_tip_ks';

function hasAnyPermission(keys) {
  return keys.some((k) => hasPermission(k));
}

export default {
  name: 'LoginTipDialogs',
  components: {
    EffectiveTipWinShow,
    KsExpirationReminder
  },
  data() {
    return {
      effectiveTipVisible: false,
      effectiveTipMounted: false,
      ksRemindVisible: false,
      ksRemindMounted: false
    };
  },
  computed: {
    ...mapState('user', ['info'])
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (val && (val.permission_group || val.Token || val.User_Name)) {
          this.$nextTick(() => this.tryShowTips());
        }
      }
    }
  },
  methods: {
    tryShowTips() {
      const showEffective =
        hasAnyPermission([
          '效期到期弹框',
          '/Statistics/EffectiveTipWinShow'
        ]) && !sessionStorage.getItem(SESSION_EFFECTIVE);
      const showKs =
        hasAnyPermission([
          '库存近效期提醒',
          '/KSInventory/KSRemind',
          '/KSInventory/KSExpirationReminder'
        ]) && !sessionStorage.getItem(SESSION_KS);

      if (showEffective) {
        sessionStorage.setItem(SESSION_EFFECTIVE, '1');
        this.effectiveTipMounted = true;
        this.effectiveTipVisible = true;
      }
      // 串行：效期关闭后再弹近效期，避免叠层
      if (showKs) {
        if (showEffective) {
          this._pendingKs = true;
        } else {
          this.openKsRemind();
        }
      }
    },
    openKsRemind() {
      sessionStorage.setItem(SESSION_KS, '1');
      this.ksRemindMounted = true;
      this.ksRemindVisible = true;
      this._pendingKs = false;
    },
    onEffectiveTipClosed() {
      this.effectiveTipMounted = false;
      if (this._pendingKs) {
        this.openKsRemind();
      }
    },
    onKsRemindClosed() {
      this.ksRemindMounted = false;
    }
  }
};
</script>

<style>
.login-tip-dialog .el-dialog__body {
  padding: 8px 12px 16px;
  max-height: 82vh;
  overflow: auto;
}
.login-tip-body {
  min-height: 320px;
}
</style>
