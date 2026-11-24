<template>
  <div class="login-page" :style="pageStyle">
    <div class="login-brand">
      <img :src="logo" alt="医院标识" />
    </div>
    <div class="login-lang">
      <i18n-icon :icon-style="{ fontSize: '20px', color: '#fff', cursor: 'pointer' }" />
    </div>

    <div class="login-stage">
    <el-form
      ref="form"
      size="large"
      :model="form"
      :rules="rules"
      class="login-card"
      @keyup.enter.native="submit"
    >
      <img
        class="login-mark"
        :class="{ 'is-seal': !!seal }"
        :src="seal || logo"
        alt="医院标识"
      />
      <div class="login-heading">医疗机构医疗器械供应链管理系统</div>
      <div class="login-heading-sub">(SPD)</div>

      <el-form-item prop="username">
        <el-input
          clearable
          autocomplete="username"
          v-model="form.username"
          placeholder="账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          autocomplete="new-password"
          v-model="form.password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item prop="code">
        <div class="login-input-group">
          <el-input clearable v-model="form.code" placeholder="验证码" />
          <img
            alt="验证码"
            v-if="captcha"
            :src="captcha"
            class="login-captcha"
            @click="changeCaptcha"
          />
        </div>
      </el-form-item>
      <div class="login-assist">
        <el-checkbox v-model="form.remember">记住密码</el-checkbox>
        <el-link type="primary" :underline="false" @click="onForget">
          忘记密码
        </el-link>
      </div>
      <el-button
        size="large"
        type="primary"
        class="login-btn"
        :loading="loading"
        @click="submit"
      >
        {{ loading ? $t('login.loading') : '登录' }}
      </el-button>
      <div class="login-meta">
        <img class="login-meta-logo" :src="sphLogo" alt="上海医药" />
        <span>软件版权：{{ contact.copyright }}　版本：{{ contact.version }}</span>
      </div>
    </el-form>
    </div>

    <footer class="login-footer">
      <span class="login-footer-phone" :title="phoneText">{{ phoneText }}</span>
      <span class="login-footer-address" :title="addressText">{{ addressText }}</span>
    </footer>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import I18nIcon from '@/layout/components/i18n-icon.vue';
import { getToken } from '@/utils/token-util';
import { login, getCaptcha, getSTORAGE, getLoginPageContact } from '@/api/login';
import { getHospitalLogo, getHospitalSeal } from '@/config/setting';
import sphLogo from '@/assets/logoSph.png';
import { getLoginPageConfig } from '@/config/login-page';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: { I18nIcon },
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        remember: true,
        code: ''
      },
      captcha: '',
      contact: getLoginPageConfig()
    };
  },
  computed: {
    rules() {
      return {
        username: [
          {
            required: true,
            message: this.$t('login.username'),
            type: 'string',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.password'),
            type: 'string',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('login.code'),
            type: 'string',
            trigger: 'blur'
          }
        ]
      };
    },
    logo() {
      return getHospitalLogo();
    },
    seal() {
      return getHospitalSeal();
    },
    sphLogo() {
      return sphLogo;
    },
    pageStyle() {
      const background = this.contact && this.contact.background;
      if (!background) {
        return {};
      }
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      };
    },
    phoneText() {
      return `SPD运营服务中心服务电话：${this.contact.phone || '—'}`;
    },
    addressText() {
      return `SPD运营服务中心地址：${this.contact.address || '—'}`;
    }
  },
  created() {
    document.body.classList.add('spd-login-body');
    this.loadContactFromConfig();
    this.form.username =
      localStorage.username != undefined
        ? this.Decrypt(localStorage.username)
        : '';
    this.form.password =
      localStorage.password != undefined
        ? this.Decrypt(localStorage.password)
        : '';

    if (getToken()) {
      this.goHome();
    } else {
      this.changeCaptcha();
    }
  },
  beforeDestroy() {
    document.body.classList.remove('spd-login-body');
  },
  methods: {
    loadContactFromConfig() {
      getLoginPageContact()
        .then((res) => {
          const phone =
            res && res.phone != null ? String(res.phone).trim() : '';
          const address =
            res && res.address != null ? String(res.address).trim() : '';
          // CONFIG 有值优先；未配置时保留 login-page.js 兜底
          this.contact = {
            ...this.contact,
            phone: phone || this.contact.phone || '',
            address: address || this.contact.address || ''
          };
        })
        .catch(() => {});
    },
    onForget() {
      const phone = (this.contact.phone || '').trim();
      const tip = phone
        ? `请联系SPD运营服务中心重置密码，服务电话：${phone}`
        : '请联系SPD运营服务中心重置密码';
      this.$message.info(tip);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        var data = this.form;
        var data2 = {
          username: data.username,
          password: data.password,
          code: this.form.code
        };
        login(data2)
          .then((res) => {
            this.$store.commit('user/setLoginInfo', data2);
            if (this.form.remember == true) {
              localStorage.username = this.Encrypt(data.username);
              localStorage.password = this.Encrypt(data.password);
            } else {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
            }
            this.loading = false;
            this.$message.success(res.msg);
            getSTORAGE().then((res) => {
              this.$store.commit('user/setStorage', res.result);
            });
            this.goHome();
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message || '登录失败');
            this.changeCaptcha();
          });
      });
    },
    goHome() {
      this.$router
        .push(this.$route?.query?.from ?? '/')
        .then(() => {
          location.reload();
        })
        .catch(() => {});
    },
    changeCaptcha() {
      getCaptcha()
        .then((data) => {
          this.captcha = data.base64;
          this.form.code = data.captchaEnabled ? '' : (data.text || '');
          this.$refs?.form?.clearValidate('code');
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    Encrypt(str) {
      var KEY = this.$store.state.user.encrypted.KEY;
      var IV = this.$store.state.user.encrypted.IV;

      var key = CryptoJS.enc.Utf8.parse(KEY);
      var iv = CryptoJS.enc.Utf8.parse(IV);

      var srcs = CryptoJS.enc.Utf8.parse(str);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.ciphertext.toString();
    },
    Decrypt(str) {
      var KEY = this.$store.state.user.encrypted.KEY;
      var IV = this.$store.state.user.encrypted.IV;

      var key = CryptoJS.enc.Utf8.parse(KEY);
      var iv = CryptoJS.enc.Utf8.parse(IV);
      var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
      var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 16px;
  background: #1a6fb5 url('@/assets/bg-login3.jpg') center / cover no-repeat;
}

.login-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 6vw 20px 24px;
}

.login-card {
  position: relative;
  z-index: 2;
  width: clamp(460px, 34vw, 680px);
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 36px 44px 22px;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(186, 208, 230, 0.95);
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(16, 42, 84, 0.16);
  backdrop-filter: blur(6px);

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input__inner) {
    height: 50px;
    line-height: 50px;
    border-radius: 6px;
    border-color: #e4e7ed;
    background: #fff;
    font-size: 16px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #c0c4cc;
  }
}

.login-brand {
  position: absolute;
  top: 18px;
  left: 28px;
  z-index: 3;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 8px;

  img {
    display: block;
    height: 52px;
    width: auto;
    max-width: 280px;
    object-fit: contain;
  }
}

.login-lang {
  position: absolute;
  top: 22px;
  right: 28px;
  z-index: 3;
}

.login-mark {
  display: block;
  width: auto;
  max-width: 78%;
  height: auto;
  max-height: 96px;
  margin: 0 auto 14px;
  object-fit: contain;

  &.is-seal {
    width: 156px;
    height: 156px;
    max-width: none;
    max-height: none;
    margin-bottom: 12px;
  }
}

.login-heading,
.login-heading-sub {
  text-align: center;
  color: #303133;
  font-weight: 600;
  line-height: 1.45;
}

.login-heading {
  font-size: 22px;
}

.login-heading-sub {
  margin: 4px 0 26px;
  font-size: 20px;
}

.login-input-group {
  display: flex;
  align-items: center;

  :deep(.el-input) {
    flex: 1;
  }
}

.login-captcha {
  height: 50px;
  width: 128px;
  margin-left: 10px;
  border-radius: 6px;
  border: 1px solid #e5e8ee;
  background: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.login-assist {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  font-size: 15px;

  :deep(.el-checkbox__label) {
    color: #606266;
  }
}

.login-btn {
  display: block;
  width: 100%;
  height: 52px;
  padding: 0;
  line-height: 52px;
  border-radius: 6px;
  font-size: 18px;
  letter-spacing: 4px;
  background: #2f7cf6;
  border-color: #2f7cf6;

  &:hover,
  &:focus {
    background: #1f6de8;
    border-color: #1f6de8;
  }
}

.login-meta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 18px;
  color: #909399;
  font-size: 13px;
  line-height: 1.4;
}

.login-meta-logo {
  flex: none;
  height: 28px;
  width: auto;
}

.login-footer {
  position: relative;
  flex: none;
  z-index: 3;
  height: 48px;
  padding: 0 28px;
  box-sizing: border-box;
  background: #fff;
  color: #303133;
  font-size: 14px;
  line-height: 48px;
}

.login-footer-phone,
.login-footer-address {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.login-footer-phone {
  display: inline-block;
  max-width: 42%;
  vertical-align: top;
}

.login-footer-address {
  position: absolute;
  left: 50%;
  top: 0;
  max-width: 54%;
  transform: translateX(-50%);
  text-align: center;
}

@media screen and (max-height: 820px) {
  .login-card {
    padding: 22px 36px 14px;
  }

  .login-mark {
    max-height: 64px;
    margin-bottom: 8px;

    &.is-seal {
      width: 108px;
      height: 108px;
    }
  }

  .login-heading {
    font-size: 18px;
  }

  .login-heading-sub {
    margin-bottom: 14px;
    font-size: 16px;
  }

  .login-card :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  .login-card :deep(.el-input__inner),
  .login-captcha {
    height: 42px;
    line-height: 42px;
  }

  .login-assist {
    margin-bottom: 12px;
  }

  .login-btn {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
  }

  .login-meta {
    margin-top: 10px;
  }
}

@media screen and (max-width: 560px) {
  .login-page {
    padding-top: 72px;
  }

  .login-stage {
    justify-content: center;
    padding: 12px 16px 16px;
  }

  .login-card {
    width: 100%;
    padding: 28px 22px 16px;
  }

  .login-brand {
    left: 12px;
    top: 12px;

    img {
      height: 40px;
    }
  }

  .login-footer {
    display: flex;
    flex-wrap: wrap;
    height: auto;
    line-height: 1.5;
    align-items: flex-start;
    padding: 8px 16px;
  }

  .login-footer-phone,
  .login-footer-address {
    position: static;
    display: block;
    flex: 1 1 100%;
    max-width: none;
    transform: none;
    text-align: left;
    white-space: normal;
    line-height: 1.5;
  }
}
</style>

<style lang="scss">
/* 后台全局给 body 设了最小宽度，登录页要按窗口宽度排，离开登录页再还原 */
body.spd-login-body {
  min-width: 0 !important;
}
</style>
