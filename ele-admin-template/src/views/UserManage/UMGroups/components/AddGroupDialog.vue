<template>
  <el-dialog
    title="新增权限组"
    :visible.sync="dialogVisible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @closed="resetForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="权限组" prop="Group_Name">
        <el-input v-model="form.Group_Name" placeholder="请输入权限组名称" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addGroup } from '@/api/UserManage/UMGroups';
import { isAddGroupOk } from '../utils';

export default {
  name: 'AddGroupDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      form: { Group_Name: '' },
      rules: {
        Group_Name: [{ required: true, message: '请输入权限组名称', trigger: 'blur' }]
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
      this.form = { Group_Name: '' };
      this.$refs.form?.clearValidate();
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await addGroup(this.form.Group_Name);
          if (isAddGroupOk(res)) {
            this.$message.success('添加成功');
            this.dialogVisible = false;
            this.$emit('success');
          } else {
            this.$message.error('添加失败');
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
