<template>
  <div class="winex-sso-page">
    <div class="winex-sso-card">
      <h3>WINEX 统一登录</h3>
      <p>{{ statusText }}</p>
      <p v-if="debugLine" class="winex-sso-debug">{{ debugLine }}</p>
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
import { setToken, getToken } from '@/utils/token-util';
import { HOME_PATH } from '@/config/setting';

const LOG_PREFIX = '[WinexSso]';

export default {
  name: 'WinexSso',
  data() {
    return {
      statusText: '正在通过 WINEX 票据登录，请稍候…',
      debugLine: '',
      failed: false,
      authFailUrl: '',
      portalUrl: '',
      submitting: false
    };
  },
  created() {
    this.log('created', {
      href: window.location.href,
      pathname: window.location.pathname,
      hash: window.location.hash,
      routerBase: this.$router?.options?.base
    });
    this.handleSso();
  },
  methods: {
    log(step, detail) {
      try {
        if (detail !== undefined) {
          console.log(LOG_PREFIX, step, detail);
        } else {
          console.log(LOG_PREFIX, step);
        }
      } catch (e) {
        /* ignore */
      }
    },
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
    /**
     * 硬跳转首页。
     * 注意：不能用 router.options.base（源码写死 /jyk/），现场实际是 /jyknw/，
     * 用错 base 会跳到错误路径导致白屏。
     */
    goHomeHard() {
      const from = this.$route?.query?.from;
      const targetPath =
        from && typeof from === 'string' && from.startsWith('/')
          ? from
          : HOME_PATH || '/';
      const hashPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

      // 保留当前 pathname（如 /jyknw/），只改 hash
      const pathname = window.location.pathname || '/';
      const jumpUrl = `${pathname}#${hashPath}`;
      const fullUrl = `${window.location.origin}${jumpUrl}`;

      this.log('goHomeHard.prepare', {
        HOME_PATH,
        targetPath,
        hashPath,
        pathname,
        routerBase: this.$router?.options?.base,
        jumpUrl,
        fullUrl,
        tokenExists: !!getToken()
      });
      this.debugLine = `即将跳转: ${fullUrl}`;
      this.statusText = '登录成功，正在进入系统…';

      // 稍延迟，确保 Token 写入、日志可见
      setTimeout(() => {
        this.log('goHomeHard.replace', fullUrl);
        try {
          window.location.replace(jumpUrl);
        } catch (e) {
          this.log('goHomeHard.replace.error', e && e.message);
          this.failed = true;
          this.statusText = '跳转失败: ' + (e.message || e);
        }
      }, 300);
    },
    async handleSso() {
      if (this.submitting) {
        return;
      }
      const jti = this.getQueryParam('jti');
      const portalUrl = this.getQueryParam('portalurl') || this.getQueryParam('portalUrl');
      const authFailUrl =
        this.getQueryParam('authfailurl') || this.getQueryParam('authFailUrl');
      this.authFailUrl = authFailUrl || '';
      this.portalUrl = portalUrl || '';

      this.log('handleSso.params', {
        jti: jti ? jti.substring(0, 8) + '...' : '',
        hasJti: !!jti,
        portalUrl,
        authFailUrl
      });

      // 已有 Token 又停在 SSO 页，直接进系统
      if (!jti && getToken()) {
        this.log('handleSso.reuseToken');
        this.statusText = '已登录，正在进入系统…';
        this.goHomeHard();
        return;
      }

      if (!jti) {
        this.failed = true;
        this.statusText = '缺少登录票据 jti，无法完成单点登录';
        this.log('handleSso.missingJti');
        return;
      }

      this.submitting = true;
      try {
        this.log('handleSso.callApi.begin');
        const res = await winexSsoLogin({
          jti,
          portalurl: portalUrl,
          authfailurl: authFailUrl
        });
        this.log('handleSso.callApi.ok', {
          code: res.code,
          hasToken: !!res.token,
          userName: res.result && res.result.UserName
        });

        const result = res.result || {};
        if (res.token) {
          setToken(res.token, 0);
          this.log('handleSso.setToken.done', {
            tokenLen: String(res.token).length,
            stored: !!getToken()
          });
        } else {
          this.log('handleSso.setToken.missing');
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
        this.log('handleSso.setLoginInfo', { username: result.UserName });

        try {
          const storageRes = await getSTORAGE();
          this.$store.commit('user/setStorage', storageRes.result);
          this.log('handleSso.getSTORAGE.ok');
        } catch (e) {
          this.log('handleSso.getSTORAGE.fail', e && e.message);
        }

        this.statusText = '登录成功，正在进入系统…';
        this.$message.success(res.msg || '单点登录成功');
        this.log('handleSso.beforeGoHomeHard');
        this.goHomeHard();
      } catch (e) {
        this.failed = true;
        this.submitting = false;
        this.statusText = e.message || '单点登录失败';
        this.log('handleSso.error', e && e.message);
        this.$message.error(this.statusText);
      }
    },
    goAuthFail() {
      this.log('goAuthFail', this.authFailUrl);
      if (this.authFailUrl) {
        window.location.href = this.authFailUrl;
      }
    },
    goLogin() {
      this.log('goLogin');
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
  width: 420px;
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
  margin: 0 0 12px;
  color: #606266;
  line-height: 1.6;
  word-break: break-all;
}
.winex-sso-debug {
  font-size: 12px;
  color: #909399;
}
</style>
