<template>
  <div class="winex-sso-page">
    <div class="winex-sso-card">
      <h3>WINEX 统一登录</h3>
      <p>{{ statusText }}</p>
      <el-button
        v-if="failed && authFailUrl"
        type="primary"
        size="small"
        @click="goAuthFail"
      >
        返回
      </el-button>
      <el-button
        v-else-if="failed"
        type="primary"
        size="small"
        @click="goLogin"
      >
        前往登录页
      </el-button>
    </div>
  </div>
</template>

<script>
import { winexSsoLogin, getSTORAGE } from '@/api/login';
import { setToken } from '@/utils/token-util';

export default {
  name: 'WinexSso',
  data() {
    return {
      statusText: '正在通过 WINEX 票据登录，请稍候…',
      failed: false,
      authFailUrl: '',
      portalUrl: ''
    };
  },
  created() {
    this.handleSso();
  },
  methods: {
    getQueryParam(name) {
      const fromRoute = this.$route?.query?.[name];
      if (fromRoute != null && fromRoute !== '') {
        return Array.isArray(fromRoute) ? fromRoute[0] : String(fromRoute);
      }
      // Portal 可能把参数放在 hash 前：/?jti=xxx#/sso/winex
      try {
        const search = new URLSearchParams(window.location.search || '');
        const v = search.get(name);
        if (v) {
          return v;
        }
      } catch (e) {
        /* ignore */
      }
      return '';
    },
    async handleSso() {
      const jti = this.getQueryParam('jti');
      const portalUrl = this.getQueryParam('portalurl') || this.getQueryParam('portalUrl');
      const authFailUrl =
        this.getQueryParam('authfailurl') || this.getQueryParam('authFailUrl');
      this.authFailUrl = authFailUrl || '';
      this.portalUrl = portalUrl || '';

      if (!jti) {
        this.failed = true;
        this.statusText = '缺少登录票据 jti，无法完成单点登录';
        return;
      }

      try {
        const res = await winexSsoLogin({
          jti,
          portalurl: portalUrl,
          authfailurl: authFailUrl
        });
        const result = res.result || {};
        if (res.token) {
          setToken(res.token, 0);
        }
        if (result.portalUrl || portalUrl) {
          sessionStorage.setItem(
            'winexPortalUrl',
            result.portalUrl || portalUrl
          );
        }
        this.$store.commit('user/setLoginInfo', {
          username: result.UserName,
          password: result.Password
        });
        try {
          const storageRes = await getSTORAGE();
          this.$store.commit('user/setStorage', storageRes.result);
        } catch (e) {
          /* 院区列表失败不阻断登录 */
        }
        this.statusText = '登录成功，正在进入系统…';
        this.$message.success(res.msg || '单点登录成功');
        this.$router
          .replace(this.$route?.query?.from || '/')
          .then(() => {
            location.reload();
          })
          .catch(() => {
            location.href = this.$router.options.base
              ? `${this.$router.options.base}#/`
              : '/#/';
          });
      } catch (e) {
        this.failed = true;
        this.statusText = e.message || '单点登录失败';
        this.$message.error(this.statusText);
      }
    },
    goAuthFail() {
      if (this.authFailUrl) {
        window.location.href = this.authFailUrl;
      }
    },
    goLogin() {
      this.$router.replace('/login');
    }
  }
};
</script>

<style scoped>
.winex-sso-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #e8f1f8 0%, #f5f7fa 45%, #eef2f6 100%);
}
.winex-sso-card {
  width: 360px;
  padding: 32px 28px;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 35, 52, 0.08);
}
.winex-sso-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #1f2d3d;
}
.winex-sso-card p {
  margin: 0 0 20px;
  color: #606266;
  line-height: 1.6;
  word-break: break-all;
}
</style>
