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
  import { logout } from '@/utils/page-tab-util'
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
        // 表单数据
        form: {
          oldPassword: '',
          password: '',
          password2: ''
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
    methods: {
      /* 修改 visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      /* 保存修改 */
      save() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true;
            UpdatePassWordByUser({
              ID: this.userCurrent.ID,
              username: this.username,
              oldPassword: Encrypt(this.form.oldPassword),
              newPassword: Encrypt(this.form.password),
              reNewPassword: Encrypt(this.form.password2),
              AesKey: this.$store.state.user.encrypted.KEY
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
      }
    }
  };
</script>
