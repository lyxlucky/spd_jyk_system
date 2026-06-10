<template>
  <el-dialog
    title="树型新增权限"
    :visible.sync="dialogVisible"
    width="520px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadParents"
    @closed="resetForm"
  >
    <div v-loading="dataLoading">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="父菜单" prop="parent">
          <el-select v-model="form.parent" placeholder="请选择父菜单" style="width: 100%">
            <el-option
              v-for="item in parentList"
              :key="item.ID"
              :label="item.PERMISSION_NAME"
              :value="String(item.ID)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称" />
        </el-form-item>
        <el-form-item label="链接" prop="p_url">
          <el-input v-model="form.p_url" placeholder="请填写链接" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="api" prop="p_api">
          <el-input v-model="form.p_api" placeholder="请填写 api" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPermissionListByTree, newAddPermission } from '@/api/UserManage/UMPermissions';
import { isOkCode } from '../utils';

export default {
  name: 'NewAddPermissionDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      parentList: [],
      form: {
        parent: '',
        name: '',
        p_url: '',
        remarks: '',
        p_api: ''
      },
      rules: {
        parent: [{ required: true, message: '请选择父菜单', trigger: 'change' }],
        name: [{ required: true, message: '请填写权限名称', trigger: 'blur' }],
        p_url: [{ required: true, message: '请填写链接', trigger: 'blur' }],
        p_api: [{ required: true, message: '请填写 api', trigger: 'blur' }]
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
    async loadParents() {
      this.dataLoading = true;
      this.parentList = [];
      try {
        const res = await getPermissionListByTree();
        this.parentList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载父菜单失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    resetForm() {
      this.form = {
        parent: '',
        name: '',
        p_url: '',
        remarks: '',
        p_api: ''
      };
      this.parentList = [];
      this.$refs.form?.clearValidate();
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await newAddPermission(this.form);
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
