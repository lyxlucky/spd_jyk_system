<!-- 修改密码弹窗 -->
<template>
  <ele-modal
    width="420px"
    title="修改密码"
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="true"
    @update:visible="updateVisible"
    @closed="onClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px"
      @keyup.enter.native="save"
    >
      <el-form-item label="旧密码:" prop="oldPassword">
        <el-input
          show-password
          v-model="form.oldPassword"
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item label="新密码:" prop="password">
        <el-input
          show-password
          v-model="form.password"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码:" prop="password2">
        <el-input
          show-password
          v-model="form.password2"
          placeholder="请再次输入新密码"
        />
      </el-form-item>
      <el-form-item label="同步PDA">
        <el-switch
          v-model="form.pdaPassword"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </ele-modal>
</template>

<script>
  import { updatePassword, UpdatePassWordByUser } from '@/api/layout';
  import { Encrypt, Decrypt } from '@/utils/aes-util';
  import { EncryptMd5 } from '@/utils/md5-util';
  import { HOME_HP } from '@/config/setting';
  import { logout } from '@/utils/page-tab-util';
  export default {
    props: {
      visible: Boolean,
      userCurrent: Object,
      username: String
    },
    data() {
      return {
        // 按钮 loading
        loading: false,
        type: '',
        // 表单数据
        form: {
          oldPassword: '',
          password: '',
          password2: '',
          pdaPassword: false
        },
        // 表单验证
        rules: {
          oldPassword: [
            {
              required: true,
              message: '请输入旧密码',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              min: 8,
              message: '密码长度不能小于8位',
              trigger: 'blur'
            },
            {
              validator: (_rule, value, callback) => {
                if (value === this.form.oldPassword) {
                  return callback(new Error('新密码不能与旧密码相同'));
                }
                callback();
              },
              trigger: 'blur'
            },
            {
              validator: (_rule, value, callback) => {
                if (value === this.userCurrent.username) {
                  return callback(new Error('新密码不能与用户名相同'));
                }
                callback();
              },
              trigger: 'blur'
            },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: '密码必须包含数字、字母和特殊符号',
              trigger: 'blur'
            }
          ],
          password2: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              min: 6,
              message: '密码长度不能小于6位',
              trigger: 'blur'
            },
            {
              validator: (_rule, value, callback) => {
                if (value === this.form.oldPassword) {
                  return callback(new Error('新密码不能与旧密码相同'));
                }
                callback();
              },
              trigger: 'blur'
            },
            {
              validator: (_rule, value, callback) => {
                if (value === this.userCurrent.username) {
                  return callback(new Error('新密码不能与用户名相同'));
                }
                callback();
              },
              trigger: 'blur'
            },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: '密码必须包含数字、字母和特殊符号',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'blur',
              validator: (_rule, value, callback) => {
                if (!value) {
                  return callback(new Error('请再次输入新密码'));
                }
                if (value !== this.form.password) {
                  return callback(new Error('两次输入密码不一致'));
                }
                callback();
              }
            }
          ]
        }
      };
    },
    created() {
      if (this.$store.state.user.info.isForceUpdatePassWord == '1') {
        //二次确认
        this.$confirm('首次登录请修改密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.updateVisible(true);
            this.type = 'forceUpdatePassword';
          })
          .catch(() => {
            this.$message.error('请修改初始密码');
            logout(true);
          });
      }
    },
    methods: {
      /* 修改 visible */
      updateVisible(value) {
        if (this.type == 'forceUpdatePassword') {
          logout(true);
        }
        this.$emit('update:visible', value);
      },
      /* 保存修改 */
      save() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const level = this.getPwdStrength(this.form.password2);
            if (
              HOME_HP !== 'stzx' &&
              HOME_HP !== 'stzl' &&
              HOME_HP !== 'stse' &&
              HOME_HP !== 'csyy'
            ) {
              if (level >= 9) {
                // 强密码
              } else {
                this.$messsage.error(
                  '该账号密码为弱密码，密码应长度大于等于8位，包含大写、小写、特殊字符、阿拉伯数字其中3种'
                );
                return;
              }
            }
            this.loading = true;
            UpdatePassWordByUser({
              ID: this.userCurrent.ID,
              username: this.username,
              oldPassword: Encrypt(this.form.oldPassword),
              newPassword: Encrypt(this.form.password),
              reNewPassword: Encrypt(this.form.password2),
              AesKey: this.$store.state.user.encrypted.KEY,
              isSync: this.form.pdaPassword,
              pdaPassword:
                HOME_HP != 'stzl'
                  ? EncryptMd5(this.form.password2 + 'QW1A5S2')
                  : this.form.password2
            })
              .then((res) => {
                this.loading = false;
                this.$message.success(res.msg);
                this.updateVisible(false);
                logout(true);
              })
              .catch((e) => {
                this.loading = false;
                this.$message.error(e);
              });
          } else {
            return false;
          }
        });
      },
      /* 关闭回调 */
      onClose() {
        this.form = {
          oldPassword: '',
          password: '',
          password2: ''
        };
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
        this.loading = false;
      },
      getPwdStrength(password) {
        // 假设你有这个方法来计算密码强度
        let strength = 0;
        if (password.length >= 8) strength += 3; // 长度 >= 8
        if (/[A-Z]/.test(password)) strength += 3; // 包含大写字母
        if (/[a-z]/.test(password)) strength += 3; // 包含小写字母
        if (/[0-9]/.test(password)) strength += 3; // 包含数字
        if (/[^A-Za-z0-9]/.test(password)) strength += 3; // 包含特殊字符
        return strength;
      }
    }
  };
</script>
