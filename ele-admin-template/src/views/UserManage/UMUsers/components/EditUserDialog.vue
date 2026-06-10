<template>
  <el-dialog :title="`编辑资料 - ${userName}`" :visible.sync="dialogVisible" width="520px" append-to-body :close-on-click-modal="false" @open="loadData">
    <div v-loading="dataLoading" class="um-dialog-body-sm">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="姓名" prop="Nickname">
        <el-input v-model="form.Nickname" />
      </el-form-item>
      <el-form-item label="所属供应商">
        <el-select v-model="form.Supplier_ID" filterable clearable style="width: 100%">
          <el-option label="无" value="0" />
          <el-option v-for="item in supplierList" :key="item.Supplier_Code" :label="item.Supplier_Name" :value="String(item.Supplier_Code)" />
        </el-select>
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
import { getUserByID, getSupplierList, updateUser } from '@/api/UserManage/UMUsers';

export default {
  name: 'EditUserDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      supplierList: [],
      form: { Nickname: '', Supplier_ID: '0', POSITION: '' },
      rules: {
        Nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
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
    async loadData() {
      this.dataLoading = true;
      try {
        const [userRes, supRes] = await Promise.all([
          getUserByID(this.userId),
          getSupplierList()
        ]);
        this.supplierList = supRes.result || [];
        const info = userRes.result || {};
        this.form = {
          Nickname: info.Nickname || '',
          Supplier_ID: info.Supplier_ID != null ? String(info.Supplier_ID) : '0',
          POSITION: info.POSITION || ''
        };
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.dataLoading = false;
      }
    },
    async handleSubmit() {
      const valid = await this.$refs.form.validate().catch(() => false);
      if (!valid) return;
      this.submitting = true;
      try {
        await updateUser({
          ID: this.userId,
          ...this.form
        });
        this.$message.success('修改成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.um-dialog-body-sm {
  min-height: 160px;
}
</style>
