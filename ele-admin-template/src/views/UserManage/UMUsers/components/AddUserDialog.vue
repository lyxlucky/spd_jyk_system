<template>
  <el-dialog title="新增用户" :visible.sync="dialogVisible" width="520px" append-to-body :close-on-click-modal="false" @open="loadSuppliers" @closed="resetForm">
    <div v-loading="dataLoading" class="um-dialog-body-sm">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small">
      <el-form-item label="所属供应商">
        <el-select v-model="form.Supplier_ID" filterable clearable style="width: 100%">
          <el-option label="无" value="0" />
          <el-option v-for="item in supplierList" :key="item.Supplier_Code" :label="item.Supplier_Name" :value="String(item.Supplier_Code)" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户账号" prop="UserName">
        <el-input v-model="form.UserName" />
      </el-form-item>
      <el-form-item label="密码" prop="Password">
        <el-input v-model="form.Password" show-password />
      </el-form-item>
      <el-form-item label="姓名" prop="Nickname">
        <el-input v-model="form.Nickname" />
      </el-form-item>
      <el-form-item label="校验码" prop="jypass">
        <el-input v-model="form.jypass" />
      </el-form-item>
      <el-form-item label="强制修改初始密码">
        <el-switch v-model="form.isForce" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="form.POSITION" />
      </el-form-item>
    </el-form>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, getSupplierList } from '@/api/UserManage/UMUsers';
import { EncryptWithCustomKey, getAesKey } from '@/utils/aes-util';
import { checkPasswordStrength } from '../utils';

export default {
  name: 'AddUserDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      supplierList: [],
      form: {
        UserName: '',
        Password: '',
        Nickname: '',
        jypass: '',
        Supplier_ID: '0',
        POSITION: '',
        isForce: 1
      },
      rules: {
        UserName: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        Password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        Nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
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
    async loadSuppliers() {
      this.dataLoading = true;
      this.supplierList = [];
      try {
        const res = await getSupplierList();
        this.supplierList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载供应商失败');
      } finally {
        this.dataLoading = false;
      }
    },
    resetForm() {
      this.form = {
        UserName: '',
        Password: '',
        Nickname: '',
        jypass: '',
        Supplier_ID: '0',
        POSITION: '',
        isForce: 1
      };
      this.$refs.form?.clearValidate();
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        if (!checkPasswordStrength(this.form.Password)) {
          this.$message.warning('密码应长度大于等于8位，包含大写、小写、特殊字符、阿拉伯数字其中3种');
          return;
        }
        this.submitting = true;
        try {
          const aesKey = getAesKey();
          const res = await addUser({
            ...this.form,
            Password: EncryptWithCustomKey(this.form.Password, aesKey),
            AesKey: aesKey,
            isForce: String(this.form.isForce)
          });
          this.$message.success(res.msg || '新增成功');
          this.dialogVisible = false;
          this.$emit('success');
        } catch (e) {
          this.$message.error(e.message || '新增失败');
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.um-dialog-body-sm {
  min-height: 320px;
}
</style>
