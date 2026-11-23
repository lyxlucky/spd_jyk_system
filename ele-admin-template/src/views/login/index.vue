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
      <el-button type="text" class="login-footer-edit" @click="openContactEdit">编辑</el-button>
    </footer>

    <el-dialog
      title="服务电话和地址"
      :visible.sync="contactEditing"
      width="480px"
      append-to-body
      :close-on-click-modal="false"
    >
      <p class="login-contact-tip">保存在当前浏览器。需要所有电脑显示同一内容时，请修改系统配置后重新发布。</p>
      <el-form label-width="72px" @submit.native.prevent>
        <el-form-item label="服务电话">
          <el-input
            v-model="contactDraft.phone"
            maxlength="40"
            clearable
            placeholder="例如 5032"
          />
        </el-form-item>
        <el-form-item label="服务地址">
          <el-input
            v-model="contactDraft.address"
            type="textarea"
            :rows="3"
            maxlength="120"
            show-word-limit
            placeholder="例如 外科楼负一楼C区汽车出入口"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetContact">恢复配置</el-button>
        <el-button @click="contactEditing = false">取消</el-button>
        <el-button type="primary" @click="saveContact">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import I18nIcon from '@/layout/components/i18n-icon.vue';
import { getToken } from '@/utils/token-util';
import { login, getCaptcha, getSTORAGE } from '@/api/login';
import { getHospitalLogo, getHospitalSeal } from '@/config/setting';
import sphLogo from '@/assets/logoSph.png';
import {
  loadLoginContact,
  saveLoginContact,
  resetLoginContact
} from '@/config/login-page';

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
      contact: loadLoginContact(),
      contactEditing: false,
      contactDraft: {
        phone: '',
        address: ''
      }
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
        backgroundImage: `url(${background})`
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
    onForget() {
      const phone = (this.contact.phone || '').trim();
      const tip = phone
        ? `请联系SPD运营服务中心重置密码，服务电话：${phone}`
        : '请联系SPD运营服务中心重置密码';
      this.$message.info(tip);
    },
    openContactEdit() {
      this.contactDraft = {
        phone: this.contact.phone || '',
        address: this.contact.address || ''
      };
      this.contactEditing = true;
    },
    saveContact() {
      const phone = (this.contactDraft.phone || '').trim();
      const address = (this.contactDraft.address || '').trim();
      saveLoginContact({ phone, address });
      this.contact = {
        ...this.contact,
        phone,
        address
      };
      this.contactEditing = false;
      this.$message.success('服务电话和地址已保存');
    },
    resetContact() {
      const base = resetLoginContact();
      this.contact = base;
      this.contactDraft = {
        phone: base.phone || '',
        address: base.address || ''
      };
      this.$message.success('已恢复为配置中的内容');
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
  padding-top: 84px;
  background: #1a6fb5 url('@/assets/bg-login3.jpg') center / cover no-repeat;
}

.login-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 8% 12px 24px;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 420px;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 26px 36px 16px;
  box-sizing: border-box;
  overflow: auto;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(198, 216, 236, 0.95);
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(16, 42, 84, 0.14);
  backdrop-filter: blur(6px);

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-input__inner) {
    height: 42px;
    line-height: 42px;
    border-radius: 6px;
    border-color: #e5e8ee;
    background: rgba(255, 255, 255, 0.96);
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
  max-width: 220px;
  height: auto;
  max-height: 72px;
  margin: 0 auto 10px;
  object-fit: contain;

  &.is-seal {
    width: 118px;
    height: 118px;
    max-width: none;
    max-height: none;
    margin-bottom: 8px;
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
  font-size: 18px;
}

.login-heading-sub {
  margin: 2px 0 18px;
  font-size: 16px;
}

.login-input-group {
  display: flex;
  align-items: center;

  :deep(.el-input) {
    flex: 1;
  }
}

.login-captcha {
  height: 42px;
  width: 108px;
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
  margin-bottom: 16px;

  :deep(.el-checkbox__label) {
    color: #606266;
  }
}

.login-btn {
  display: block;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  font-size: 16px;
  letter-spacing: 2px;
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
  gap: 8px;
  margin-top: 16px;
  color: #909399;
  font-size: 12px;
  line-height: 1.4;
}

.login-meta-logo {
  flex: none;
  height: 22px;
  width: auto;
}

.login-footer {
  position: relative;
  flex: none;
  z-index: 3;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) auto;
  align-items: center;
  column-gap: 16px;
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
  justify-self: start;
}

.login-footer-address {
  justify-self: center;
  text-align: center;
}

.login-footer-edit {
  flex: none;
  padding: 0;
}

.login-contact-tip {
  margin: 0 0 16px;
  color: #909399;
  font-size: 13px;
  line-height: 1.6;
}

@media screen and (max-width: 560px) {
  .login-page {
    padding-top: 72px;
  }

  .login-stage {
    justify-content: center;
    padding: 8px 16px 12px;
  }

  .login-brand {
    left: 12px;
    top: 12px;

    img {
      height: 40px;
    }
  }

  .login-card {
    width: 100%;
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
    flex: 1 1 100%;
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
