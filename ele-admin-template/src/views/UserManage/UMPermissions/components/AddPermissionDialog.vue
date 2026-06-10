<template>
  <el-dialog
    title="新增权限"
    :visible.sync="dialogVisible"
    width="520px"
    append-to-body
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="权限名称" prop="Permission_Name">
        <el-input v-model="form.Permission_Name" />
      </el-form-item>
      <el-form-item label="链接" prop="Permission_Url">
        <el-input v-model="form.Permission_Url" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.Remarks" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addPermission } from '@/api/UserManage/UMPermissions';
import { isOkCode } from '../utils';

export default {
  name: 'AddPermissionDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      form: {
        Permission_Name: '',
        Permission_Url: '',
        Remarks: ''
      },
      rules: {
        Permission_Name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        Permission_Url: [{ required: true, message: '请输入链接', trigger: 'blur' }]
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
      this.form = {
        Permission_Name: '',
        Permission_Url: '',
        Remarks: ''
      };
      this.$refs.form?.clearValidate();
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await addPermission(this.form);
          if (isOkCode(res?.code)) {
            this.$message.success(res.msg || '添加成功');
            this.dialogVisible = false;
            this.$emit('success');
          } else {
            this.$message.error(res?.msg || '添加失败');
          }
        } catch (e) {
          this.$message.error(e.message || '添加失败');
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>
