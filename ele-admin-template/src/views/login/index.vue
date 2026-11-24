<template>
  <div class="login-page">
    <header class="login-topbar">
      <div class="login-brand">
        <img :src="logo" alt="医院标识" />
      </div>
    </header>

    <div class="login-stage" :style="stageStyle">
      <div class="login-card-shell">
        <el-form
          ref="form"
          size="large"
          :model="form"
          :rules="rules"
          class="login-card"
          @keyup.enter.native="submit"
        >
          <div class="login-card-head">
            <img
              class="login-mark"
              :class="{ 'is-seal': !!seal }"
              :src="seal || logo"
              alt="医院标识"
            />
            <div class="login-heading">医疗机构医疗器械供应链管理系统</div>
            <div class="login-heading-sub">(SPD)</div>
          </div>

          <div class="login-card-body">
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
          </div>

          <div class="login-meta">
            <img class="login-meta-logo" :src="sphLogo" alt="上海医药" />
            <span>软件版权：{{ contact.copyright }}　版本：{{ contact.version }}</span>
          </div>
        </el-form>
      </div>
    </div>

    <footer class="login-footer">
      <span class="login-footer-phone" :title="phoneText">{{ phoneText }}</span>
      <span class="login-footer-address" :title="addressText">{{ addressText }}</span>
    </footer>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import { getToken } from '@/utils/token-util';
import { login, getCaptcha, getSTORAGE, getLoginPageContact } from '@/api/login';
import { getHospitalLogo, getHospitalSeal } from '@/config/setting';
import sphLogoImg from '@/assets/logoSph.jpg';
import { getLoginPageConfig } from '@/config/login-page';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
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
      contact: getLoginPageConfig(),
      sphLogo: sphLogoImg
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
    stageStyle() {
      const background = this.contact && this.contact.background;
      if (!background) {
        return {};
      }
      // 仅中间区域展示背景，按中间区域宽高比例完整缩放（不裁切）
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: '100% 100%',
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
  padding-top: 0;
  background: #e8eef5;
}

/* 顶部整条白栏 */
.login-topbar {
  position: relative;
  z-index: 3;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  padding: 4px 16px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}

.login-brand {
  display: flex;
  align-items: center;
  min-width: 0;

  img {
    display: block;
    height: 36px;
    width: auto;
    max-width: 280px;
    object-fit: contain;
  }
}

.login-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 18px 14vw 18px 24px;
  background-color: #5b9fd4;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

/* 外粗框 + 内外间距 + 中间阴影光晕 */
.login-card-shell {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: clamp(360px, 28vw, 440px);
  max-width: 100%;
  height: 86%;
  max-height: 720px;
  margin: 0;
  padding: 5px;
  box-sizing: border-box;
  border: 3px solid #2a5f9e;
  border-radius: 2px;
  background: rgba(170, 205, 235, 0.28);
  box-shadow:
    0 0 18px rgba(30, 90, 160, 0.55),
    0 0 42px rgba(30, 90, 160, 0.32),
    inset 0 0 22px rgba(80, 140, 200, 0.35);
}

.login-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 32px 30px 18px;
  box-sizing: border-box;
  /* 勿 hidden：校验文案是 absolute，会被裁掉，100% 缩放时更明显 */
  overflow: visible;
  background: rgba(247, 250, 253, 0.92);
  border: 1px solid rgba(154, 188, 224, 0.85);
  border-radius: 1px;
  box-shadow:
    0 0 14px rgba(40, 100, 170, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);

  /* Element 错误提示为 absolute，需预留下方空间，否则压住下一行输入框 */
  :deep(.el-form-item) {
    margin-bottom: 28px;
  }

  :deep(.el-form-item__error) {
    padding-top: 2px;
    z-index: 2;
  }

  :deep(.el-input__inner) {
    height: 46px;
    line-height: 46px;
    border-radius: 4px;
    border-color: #d8dee8;
    background: #fff;
    font-size: 15px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #c0c4cc;
  }
}

/* 登录块内容顺序：上院徽标题 → 中表单 → 下版权 */
.login-card-head {
  flex: none;
  text-align: center;
}

.login-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.login-mark {
  display: block;
  width: auto;
  max-width: 78%;
  height: auto;
  max-height: 88px;
  margin: 0 auto 12px;
  object-fit: contain;

  &.is-seal {
    width: 132px;
    height: 132px;
    max-width: none;
    max-height: none;
    margin-bottom: 10px;
  }
}

.login-heading,
.login-heading-sub {
  text-align: center;
  color: #2b2f36;
  font-weight: 700;
  line-height: 1.4;
}

.login-heading {
  font-size: 20px;
}

.login-heading-sub {
  margin: 4px 0 0;
  font-size: 18px;
}

.login-input-group {
  display: flex;
  align-items: center;

  :deep(.el-input) {
    flex: 1;
  }
}

.login-captcha {
  height: 46px;
  width: 118px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #d8dee8;
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
  margin-bottom: 20px;
  font-size: 14px;

  :deep(.el-checkbox__label) {
    color: #606266;
  }
}

.login-btn {
  display: block;
  width: 100%;
  height: 48px;
  padding: 0;
  line-height: 48px;
  border-radius: 4px;
  font-size: 17px;
  font-weight: 700;
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
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-top: auto;
  padding-top: 20px;
  color: #7a8494;
  font-size: 11px;
  line-height: 1.4;
}

.login-meta-logo {
  flex: none;
  height: 22px;
  width: auto;
  object-fit: contain;
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
  font-weight: 700;
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

@media screen and (max-height: 760px) {
  .login-card {
    padding: 20px 28px 14px;
  }

  .login-mark {
    max-height: 56px;
    margin: 0 auto 8px;

    &.is-seal {
      width: 96px;
      height: 96px;
    }
  }

  .login-heading {
    font-size: 17px;
  }

  .login-heading-sub {
    margin-bottom: 14px;
    font-size: 15px;
  }

  .login-card :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  .login-card :deep(.el-input__inner),
  .login-captcha {
    height: 40px;
    line-height: 40px;
  }

  .login-assist {
    margin-bottom: 12px;
  }

  .login-btn {
    height: 42px;
    line-height: 42px;
    font-size: 15px;
  }

  .login-meta {
    padding-top: 12px;
  }
}

@media screen and (max-width: 560px) {
  .login-topbar {
    height: auto;
    padding: 3px 12px;
  }

  .login-brand img {
    height: 32px;
  }

  .login-stage {
    justify-content: center;
    padding: 12px 16px 16px;
  }

  .login-card-shell {
    width: 100%;
    height: auto;
    max-height: 100%;
    padding: 5px;
  }

  .login-card {
    padding: 28px 22px 16px;
  }

  .login-card-body {
    justify-content: flex-start;
    margin-top: 18px;
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
