<template>
  <el-dialog
    title="修改PDA账号"
    :visible.sync="dialogVisible"
    width="640px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadData"
    @closed="resetForm"
  >
    <div v-loading="dataLoading" class="umpda-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="权限选择" prop="AUTH_LEVEL">
          <el-select v-model="form.AUTH_LEVEL" style="width: 100%">
            <el-option
              v-for="item in authLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="院区">
          <el-select v-model="form.STORAGE_ID" clearable style="width: 100%">
            <el-option label="不区分" value="" />
            <el-option
              v-for="item in storageList"
              :key="item.ID"
              :label="item.NAME"
              :value="String(item.ID)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" prop="ACCOUNT">
          <el-input v-model="form.ACCOUNT" />
        </el-form-item>
        <el-form-item label="密码" prop="PASSWORD">
          <el-input v-model="form.PASSWORD" show-password />
        </el-form-item>
        <el-form-item label="使用场所名称">
          <el-input v-model="form.BELONG_PLACE" />
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="form.OPERATOR" />
        </el-form-item>
        <el-form-item label="二级科室编码">
          <el-input v-model="form.DEPT_TWO_CODE" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editAccount, getPdaInfo } from '@/api/UserManage/UMPDA';
import { getSTORAGE } from '@/api/login';
import {
  AUTH_LEVEL_OPTIONS,
  checkEditPasswordStrength,
  encryptPdaPassword,
  isOkResult
} from '../utils';

export default {
  name: 'EditPdaDialog',
  props: {
    visible: Boolean,
    pdaId: [String, Number]
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      storageList: [],
      authLevelOptions: AUTH_LEVEL_OPTIONS,
      form: this.createEmptyForm(),
      rules: {
        AUTH_LEVEL: [{ required: true, message: '请选择权限', trigger: 'change' }],
        ACCOUNT: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        PASSWORD: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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
    createEmptyForm() {
      return {
        AUTH_LEVEL: '1',
        STORAGE_ID: '',
        ACCOUNT: '',
        PASSWORD: '',
        BELONG_PLACE: '',
        OPERATOR: '',
        DEPT_TWO_CODE: ''
      };
    },
    async loadData() {
      if (!this.pdaId) return;
      this.dataLoading = true;
      this.form = this.createEmptyForm();
      try {
        const [storageRes, infoRes] = await Promise.all([
          getSTORAGE(),
          getPdaInfo(this.pdaId)
        ]);
        this.storageList = storageRes.result || [];
        const row = (infoRes.result || [])[0];
        if (row) {
          this.form = {
            AUTH_LEVEL: String(row.AUTH_LEVEL ?? '1'),
            STORAGE_ID: row.STORAGE_ID != null ? String(row.STORAGE_ID) : '',
            ACCOUNT: row.ACCOUNT || '',
            PASSWORD: '',
            BELONG_PLACE: row.BELONG_PLACE || '',
            OPERATOR: row.OPERATOR || '',
            DEPT_TWO_CODE: row.DEPT_TWO_CODE || ''
          };
        }
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    resetForm() {
      this.form = this.createEmptyForm();
      this.storageList = [];
      this.$refs.form?.clearValidate();
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        if (!checkEditPasswordStrength(this.form.PASSWORD)) {
          this.$message.warning(
            '密码应长度大于等于8位，包含大写、小写、特殊字符、阿拉伯数字其中3种'
          );
          return;
        }
        this.submitting = true;
        try {
          const res = await editAccount({
            ID: this.pdaId,
            AUTH_LEVEL: this.form.AUTH_LEVEL,
            STORAGE_ID: this.form.STORAGE_ID,
            ACCOUNT: this.form.ACCOUNT,
            PASSWORD: encryptPdaPassword(this.form.PASSWORD, true),
            BELONG_PLACE: this.form.BELONG_PLACE,
            OPERATOR: this.form.OPERATOR,
            DEPT_TWO_CODE: this.form.DEPT_TWO_CODE
          });
          if (isOkResult(res)) {
            this.$message.success('已成功保存');
            this.dialogVisible = false;
            this.$emit('success');
          } else {
            this.$message.error(res || '保存失败');
          }
        } catch (e) {
          this.$message.error(e.message || '保存失败');
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.umpda-dialog-body {
  min-height: 360px;
}
</style>
