<template>
  <el-dialog :title="`修改密码 - ${userName}`" :visible.sync="dialogVisible" width="480px" append-to-body :close-on-click-modal="false" @closed="resetForm">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px" size="small">
      <el-form-item label="密码" prop="Password">
        <el-input v-model="form.Password" show-password />
      </el-form-item>
      <el-form-item label="校验码" prop="jypass">
        <el-input v-model="form.jypass" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUserPassword } from '@/api/UserManage/UMUsers';
import { EncryptWithCustomKey, getAesKey } from '@/utils/aes-util';
import { checkPasswordStrength } from '../utils';

export default {
  name: 'PasswordDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: { Password: '', jypass: '' },
      rules: {
        Password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        jypass: [{ required: true, message: '请输入校验码', trigger: 'blur' }]
      }
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    resetForm() {
      this.form = { Password: '', jypass: '' };
      this.$refs.form?.clearValidate();
    },
    async handleSubmit() {
      const valid = await this.$refs.form.validate().catch(() => false);
      if (!valid) return;
      if (!checkPasswordStrength(this.form.Password)) {
        this.$message.warning('密码应长度大于等于8位，包含大写、小写、特殊字符、阿拉伯数字其中3种');
        return;
      }
      this.loading = true;
      try {
        const aesKey = getAesKey();
        const res = await updateUserPassword({
          ID: this.userId,
          Password: EncryptWithCustomKey(this.form.Password, aesKey),
          AesKey: aesKey,
          jypass: this.form.jypass,
          user: this.$store.state.user?.info?.UserName || localStorage.user || ''
        });
        this.$message.success(res.msg || '修改成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
