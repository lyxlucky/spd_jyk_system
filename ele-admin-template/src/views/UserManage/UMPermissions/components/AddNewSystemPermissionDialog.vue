<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadParents"
    @closed="resetForm"
  >
    <div v-loading="dataLoading">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small">
        <el-form-item label="类型" prop="TYPE">
          <el-radio-group v-model="form.TYPE">
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.TYPE === 0" label="父级菜单" prop="PRIMARY_ROUT_ID">
          <el-select
            v-model="form.PRIMARY_ROUT_ID"
            filterable
            clearable
            placeholder="请选择 PRIMARY_ROUT"
            style="width: 100%"
          >
            <el-option
              v-for="item in parentList"
              :key="item.ID"
              :label="parentLabel(item)"
              :value="String(item.ID)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="Permission_Name">
          <el-input v-model="form.Permission_Name" placeholder="如：用量预警" />
        </el-form-item>
        <el-form-item label="链接" prop="Permission_Url">
          <el-input
            v-model="form.Permission_Url"
            placeholder="如：/Statistics/RegistrationWarn"
          />
        </el-form-item>
        <el-form-item v-if="form.TYPE === 0" label="Component">
          <el-input
            v-model="form.COMPONENT"
            placeholder="默认与链接相同"
          />
        </el-form-item>
        <el-form-item v-if="form.TYPE === 0" label="图标">
          <el-input v-model="form.ICON" placeholder="可选" />
        </el-form-item>
        <el-form-item v-if="form.TYPE === 0" label="排序">
          <el-input v-model="form.SORT" placeholder="可选，数字越小越靠前" />
        </el-form-item>
        <el-form-item v-if="form.TYPE === 0" label="隐藏">
          <el-switch v-model="form.HIDE" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.Remarks" placeholder="如：新系统-用量预警" />
        </el-form-item>
        <el-form-item label="API">
          <el-input
            v-model="form.p_api"
            :placeholder="isEdit ? '可选。只新增这一条，不修改已有 API' : '可选，写入 PERMISSION_API'"
          />
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
import {
  addNewSystemPermission,
  getPrimaryRoutList,
  updateNewSystemPermission
} from '@/api/UserManage/UMPermissions';
import { isOkCode } from '../utils';

function emptyForm() {
  return {
    TYPE: 0,
    PRIMARY_ROUT_ID: '',
    Permission_Name: '',
    Permission_Url: '',
    COMPONENT: '',
    ICON: '',
    SORT: '',
    HIDE: 0,
    Remarks: '',
    p_api: ''
  };
}

export default {
  name: 'AddNewSystemPermissionDialog',
  props: {
    visible: Boolean,
    record: {
      type: Object,
      default: null
    }
  },
  computed: {
    isEdit() {
      return !!(this.record && this.record.ID);
    },
    dialogTitle() {
      return this.isEdit ? '编辑权限' : '新系统新增权限';
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      parentList: [],
      form: emptyForm(),
      rules: {
        TYPE: [{ required: true, message: '请选择类型', trigger: 'change' }],
        PRIMARY_ROUT_ID: [
          {
            validator: (rule, value, callback) => {
              if (this.form.TYPE === 0 && !value) {
                callback(new Error('请选择父级菜单'));
                return;
              }
              callback();
            },
            trigger: 'change'
          }
        ],
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
    },
    'form.TYPE'() {
      this.$nextTick(() => this.$refs.form?.clearValidate());
    }
  },
  methods: {
    parentLabel(item) {
      const path = item.PATH ? ` (${item.PATH})` : '';
      return `${item.TITLE || ''}${path}`;
    },
    async loadParents() {
      this.dataLoading = true;
      this.parentList = [];
      try {
        const res = await getPrimaryRoutList();
        this.parentList = res.result || [];
        if (this.isEdit) {
          this.fillFromRecord();
        }
      } catch (e) {
        this.$message.error(e.message || '加载父级菜单失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    resetForm() {
      this.form = emptyForm();
      this.parentList = [];
      this.$refs.form?.clearValidate();
    },
    fillFromRecord() {
      const row = this.record || {};
      const type = Number(row.TYPE) === 1 ? 1 : 0;
      let parentId = row.PRIMARY_ROUT_ID == null ? '' : String(row.PRIMARY_ROUT_ID).trim();
      if (!parentId && row.PID != null) {
        const pid = String(row.PID).trim();
        if (this.parentList.some((item) => String(item.ID) === pid)) {
          parentId = pid;
        }
      }
      if (parentId && !this.parentList.some((item) => String(item.ID) === parentId)) {
        this.parentList = this.parentList.concat([
          {
            ID: parentId,
            TITLE: row.Parent_Name || parentId,
            PATH: ''
          }
        ]);
      }
      this.form = {
        TYPE: type,
        PRIMARY_ROUT_ID: type === 0 ? parentId : '',
        Permission_Name: row.Permission_Name || '',
        Permission_Url: row.Permission_Url || '',
        COMPONENT: row.COMPONENT || '',
        ICON: row.ICON || '',
        SORT: row.SORT == null ? '' : String(row.SORT),
        HIDE: Number(row.HIDE) === 1 ? 1 : 0,
        Remarks: row.Remarks || '',
        p_api: row.permissionApi || ''
      };
      this.$nextTick(() => this.$refs.form?.clearValidate());
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        if (this.form.TYPE === 0 && this.form.SORT && !/^\d+$/.test(String(this.form.SORT).trim())) {
          this.$message.warning('排序只能填数字，数字越小越靠前');
          return;
        }
        this.submitting = true;
        const editing = this.isEdit;
        try {
          const payload = editing ? { ...this.form, ID: this.record.ID } : this.form;
          const res = editing
            ? await updateNewSystemPermission(payload)
            : await addNewSystemPermission(payload);
          if (isOkCode(res?.code)) {
            this.$message.success(res.msg || (editing ? '修改成功' : '添加成功'));
            this.dialogVisible = false;
            this.$emit('success');
          } else {
            this.$message.error(res?.msg || (editing ? '修改失败' : '添加失败'));
          }
        } catch (e) {
          this.$message.error(e.message || (editing ? '修改失败' : '添加失败'));
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>
