<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="620px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadOptions"
    @closed="resetForm"
  >
    <div v-loading="dataLoading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="维护对象" prop="SCOPE">
          <el-radio-group v-model="form.SCOPE" :disabled="isEdit">
            <el-radio label="primary">一级菜单</el-radio>
            <el-radio label="menu">页面菜单</el-radio>
            <el-radio label="button">按钮权限</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="form.SCOPE === 'primary'">
          <el-form-item label="菜单名称" prop="TITLE">
            <el-input v-model="form.TITLE" placeholder="如：系统配置" />
          </el-form-item>
          <el-form-item label="PATH">
            <el-input v-model="form.PATH" placeholder="可选，一级菜单路由 path" />
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.ICON" placeholder="可选" />
          </el-form-item>
          <el-form-item label="隐藏">
            <el-switch v-model="form.HIDE" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item
            v-if="form.SCOPE === 'menu'"
            label="所属一级菜单"
            prop="PRIMARY_ROUT_ID"
          >
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
          <el-form-item
            v-if="form.SCOPE === 'button'"
            label="所属页面菜单"
            prop="PID"
          >
            <el-select
              v-model="form.PID"
              filterable
              clearable
              placeholder="请选择页面菜单"
              style="width: 100%"
            >
              <el-option
                v-for="item in menuList"
                :key="item.ID"
                :label="menuLabel(item)"
                :value="String(item.ID)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称" prop="Permission_Name">
            <el-input v-model="form.Permission_Name" placeholder="如：系统参数表" />
          </el-form-item>
          <el-form-item label="权限链接" prop="Permission_Url">
            <el-input
              v-model="form.Permission_Url"
              placeholder="如：/SystemConfig/ConfigManage"
            />
          </el-form-item>
          <el-form-item v-if="form.SCOPE === 'menu'" label="路由 PATH">
            <el-input
              v-model="form.PRIMARY_ROUT_URL"
              placeholder="默认与权限链接相同，对应 PRIMARY_ROUT_URL"
            />
          </el-form-item>
          <el-form-item v-if="form.SCOPE === 'menu'" label="Component">
            <el-input
              v-model="form.COMPONENT"
              placeholder="默认与权限链接相同，登录菜单必填"
            />
          </el-form-item>
          <el-form-item v-if="form.SCOPE === 'menu'" label="图标">
            <el-input v-model="form.ICON" placeholder="可选" />
          </el-form-item>
          <el-form-item v-if="form.SCOPE === 'menu'" label="排序">
            <el-input v-model="form.SORT" placeholder="可选，数字越小越靠前" />
          </el-form-item>
          <el-form-item v-if="form.SCOPE === 'menu'" label="隐藏">
            <el-switch v-model="form.HIDE" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.Remarks" placeholder="如：新系统-系统参数表" />
          </el-form-item>
          <el-form-item label="API">
            <el-input
              v-model="form.p_api"
              :placeholder="isEdit ? '可选。只新增这一条，不修改已有 API' : '可选，写入 PERMISSION_API'"
            />
          </el-form-item>
        </template>
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
  addPrimaryRout,
  getPermissionList,
  getPrimaryRoutList,
  updateNewSystemPermission,
  updatePrimaryRout
} from '@/api/UserManage/UMPermissions';
import { isOkCode } from '../utils';

function emptyForm() {
  return {
    SCOPE: 'menu',
    TITLE: '',
    PATH: '',
    TYPE: 0,
    PRIMARY_ROUT_ID: '',
    PID: '',
    Permission_Name: '',
    Permission_Url: '',
    PRIMARY_ROUT_URL: '',
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
    },
    /** primary | permission，编辑一级菜单时传 primary */
    editMode: {
      type: String,
      default: 'permission'
    }
  },
  computed: {
    isEdit() {
      return !!(this.record && this.record.ID);
    },
    dialogTitle() {
      if (!this.isEdit) {
        return '新系统新增权限';
      }
      if (this.editMode === 'primary' || this.form.SCOPE === 'primary') {
        return '编辑一级菜单';
      }
      return '编辑权限';
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      parentList: [],
      menuList: [],
      form: emptyForm(),
      rules: {
        SCOPE: [{ required: true, message: '请选择维护对象', trigger: 'change' }],
        TITLE: [
          {
            validator: (rule, value, callback) => {
              if (this.form.SCOPE === 'primary' && !(value || '').trim()) {
                callback(new Error('请输入一级菜单名称'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        PRIMARY_ROUT_ID: [
          {
            validator: (rule, value, callback) => {
              if (this.form.SCOPE === 'menu' && !value) {
                callback(new Error('请选择所属一级菜单'));
                return;
              }
              callback();
            },
            trigger: 'change'
          }
        ],
        PID: [
          {
            validator: (rule, value, callback) => {
              if (this.form.SCOPE === 'button' && !value) {
                callback(new Error('请选择所属页面菜单'));
                return;
              }
              callback();
            },
            trigger: 'change'
          }
        ],
        Permission_Name: [
          {
            validator: (rule, value, callback) => {
              if (this.form.SCOPE !== 'primary' && !(value || '').trim()) {
                callback(new Error('请输入权限名称'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        Permission_Url: [
          {
            validator: (rule, value, callback) => {
              if (this.form.SCOPE !== 'primary' && !(value || '').trim()) {
                callback(new Error('请输入权限链接'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
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
    'form.SCOPE'() {
      this.$nextTick(() => this.$refs.form?.clearValidate());
    }
  },
  methods: {
    parentLabel(item) {
      const path = item.PATH ? ` (${item.PATH})` : '';
      const hide = Number(item.HIDE) === 1 ? ' [隐藏]' : '';
      return `${item.TITLE || ''}${path}${hide}`;
    },
    menuLabel(item) {
      const url = item.Permission_Url ? ` (${item.Permission_Url})` : '';
      return `${item.Permission_Name || ''}${url}`;
    },
    async loadOptions() {
      this.dataLoading = true;
      this.parentList = [];
      this.menuList = [];
      try {
        const [routRes, permRes] = await Promise.all([
          getPrimaryRoutList(),
          getPermissionList().catch(() => ({ result: [] }))
        ]);
        this.parentList = (routRes.result || []).filter(
          (item) => this.isEdit || Number(item.HIDE) !== 1
        );
        this.menuList = (permRes.result || []).filter(
          (item) => Number(item.TYPE) !== 1 && !!(item.COMPONENT || '').trim()
        );
        if (this.isEdit) {
          this.fillFromRecord();
        }
      } catch (e) {
        this.$message.error(e.message || '加载菜单失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    resetForm() {
      this.form = emptyForm();
      this.parentList = [];
      this.menuList = [];
      this.$refs.form?.clearValidate();
    },
    fillFromRecord() {
      const row = this.record || {};
      if (this.editMode === 'primary') {
        this.form = {
          ...emptyForm(),
          SCOPE: 'primary',
          TITLE: row.TITLE || row.Permission_Name || '',
          PATH: row.PATH || row.Permission_Url || '',
          ICON: row.ICON || '',
          HIDE: Number(row.HIDE) === 1 ? 1 : 0
        };
        this.$nextTick(() => this.$refs.form?.clearValidate());
        return;
      }

      const type = Number(row.TYPE) === 1 ? 1 : 0;
      let parentId = row.PRIMARY_ROUT_ID == null ? '' : String(row.PRIMARY_ROUT_ID).trim();
      let pid = row.PID == null ? '' : String(row.PID).trim();
      if (!parentId && type === 0 && pid) {
        if (this.parentList.some((item) => String(item.ID) === pid)) {
          parentId = pid;
        }
      }
      if (parentId && !this.parentList.some((item) => String(item.ID) === parentId)) {
        this.parentList = this.parentList.concat([
          {
            ID: parentId,
            TITLE: row.Parent_Name || parentId,
            PATH: '',
            HIDE: 0
          }
        ]);
      }
      if (type === 1 && pid && !this.menuList.some((item) => String(item.ID) === pid)) {
        this.menuList = this.menuList.concat([
          {
            ID: pid,
            Permission_Name: row.Parent_Name || pid,
            Permission_Url: '',
            COMPONENT: '1',
            TYPE: 0
          }
        ]);
      }
      this.form = {
        ...emptyForm(),
        SCOPE: type === 1 ? 'button' : 'menu',
        TYPE: type,
        PRIMARY_ROUT_ID: type === 0 ? parentId : '',
        PID: type === 1 ? pid : '',
        Permission_Name: row.Permission_Name || '',
        Permission_Url: row.Permission_Url || '',
        PRIMARY_ROUT_URL: row.PRIMARY_ROUT_URL || row.Permission_Url || '',
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
        if (
          this.form.SCOPE === 'menu' &&
          this.form.SORT &&
          !/^\d+$/.test(String(this.form.SORT).trim())
        ) {
          this.$message.warning('排序只能填数字，数字越小越靠前');
          return;
        }
        this.submitting = true;
        const editing = this.isEdit;
        try {
          let res;
          if (this.form.SCOPE === 'primary') {
            const payload = {
              TITLE: (this.form.TITLE || '').trim(),
              PATH: (this.form.PATH || '').trim(),
              ICON: (this.form.ICON || '').trim(),
              HIDE: this.form.HIDE
            };
            res = editing
              ? await updatePrimaryRout({ ...payload, ID: this.record.ID })
              : await addPrimaryRout(payload);
          } else {
            const payload = {
              TYPE: this.form.SCOPE === 'button' ? 1 : 0,
              PRIMARY_ROUT_ID:
                this.form.SCOPE === 'menu' ? this.form.PRIMARY_ROUT_ID : '',
              PID: this.form.SCOPE === 'button' ? this.form.PID : '',
              Permission_Name: (this.form.Permission_Name || '').trim(),
              Permission_Url: (this.form.Permission_Url || '').trim(),
              PRIMARY_ROUT_URL: (this.form.PRIMARY_ROUT_URL || '').trim(),
              COMPONENT: (this.form.COMPONENT || '').trim(),
              ICON: (this.form.ICON || '').trim(),
              SORT: this.form.SORT,
              HIDE: this.form.HIDE,
              Remarks: this.form.Remarks || '',
              p_api: this.form.p_api || ''
            };
            res = editing
              ? await updateNewSystemPermission({ ...payload, ID: this.record.ID })
              : await addNewSystemPermission(payload);
          }
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
