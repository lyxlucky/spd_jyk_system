<template>
  <div class="ele-body config-manage-page">
    <el-card shadow="never" body-style="padding: 12px 16px;">
      <div class="config-manage-tip">
        系统参数表（CONFIG）。登录页服务电话、地址请分别配置类型
        <code>LOGIN_SERVICE_PHONE</code>、<code>LOGIN_SERVICE_ADDRESS</code>。
      </div>
      <ele-pro-table
        ref="table"
        title="系统参数表"
        row-key="ID"
        size="mini"
        :columns="columns"
        :datasource="datasource"
        :where="where"
        :toolkit="['reload', 'columns', 'fullscreen']"
        cache-key="SystemConfigConfigManage"
        height="calc(100vh - 180px)"
        full-height="calc(100vh - 90px)"
      >
        <template v-slot:toolbar>
          <el-input
            v-model="keyword"
            size="mini"
            clearable
            placeholder="关键字（类型/说明/配置值）"
            style="width: 260px; margin-right: 8px"
            @keyup.enter.native="reload"
          />
          <el-button size="mini" type="primary" @click="reload">查询</el-button>
          <el-button size="mini" @click="resetSearch">重置</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="openEdit()"
          >
            新增
          </el-button>
        </template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" @click="openEdit(row)">编辑</el-link>
          <el-popconfirm
            class="ele-action"
            title="确定删除该条配置？"
            @confirm="remove(row)"
          >
            <template v-slot:reference>
              <el-link type="danger" :underline="false">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog
      title="系统配置密码"
      :visible.sync="pwdVisible"
      width="420px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      @opened="focusPwd"
    >
      <p class="config-password-tip">该页面可维护 CONFIG 系统参数，进入前请输入密码。</p>
      <el-input
        ref="pwdInput"
        v-model="pwdDraft"
        size="small"
        show-password
        placeholder="请输入密码"
        autocomplete="new-password"
        @keyup.enter.native="confirmPwd"
      />
      <div slot="footer">
        <el-button size="small" @click="leavePage">取消</el-button>
        <el-button size="small" type="primary" @click="confirmPwd">进入</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="editForm.ID ? '编辑配置' : '新增配置'"
      :visible.sync="editVisible"
      width="520px"
      append-to-body
      :close-on-click-modal="false"
      @closed="resetEditForm"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" size="small">
        <el-form-item label="配置类型" prop="CONFIG_TYPE">
          <el-input v-model="editForm.CONFIG_TYPE" maxlength="100" clearable placeholder="必填" />
        </el-form-item>
        <el-form-item label="配置说明" prop="CONFIG_MARK">
          <el-input v-model="editForm.CONFIG_MARK" maxlength="200" clearable />
        </el-form-item>
        <el-form-item label="配置值" prop="CONFIG_VALUE">
          <el-input v-model="editForm.CONFIG_VALUE" maxlength="500" clearable />
        </el-form-item>
        <el-form-item label="配置值说明" prop="CONFIG_VALUE_MARK">
          <el-input v-model="editForm.CONFIG_VALUE_MARK" maxlength="200" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="editVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="saving" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getConfigPageList,
  saveConfig,
  deleteConfig
} from '@/api/ToolBox/SystemConfig';

const MANAGE_PASSWORD = '199411Abc';

export default {
  name: 'SystemConfigConfigManage',
  data() {
    return {
      unlocked: false,
      pwdVisible: true,
      pwdDraft: '',
      managePassword: '',
      keyword: '',
      where: { keyword: '' },
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'ID',
          label: 'ID',
          width: 90,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'CONFIG_TYPE',
          label: '配置类型',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'CONFIG_MARK',
          label: '配置说明',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'CONFIG_VALUE',
          label: '配置值',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'CONFIG_VALUE_MARK',
          label: '配置值说明',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          width: 170,
          align: 'center',
          formatter: (_row, _col, cell) => this.formatTime(cell)
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 120,
          align: 'center',
          slot: 'action',
          fixed: 'right'
        }
      ],
      editVisible: false,
      saving: false,
      editForm: {
        ID: '',
        CONFIG_TYPE: '',
        CONFIG_MARK: '',
        CONFIG_VALUE: '',
        CONFIG_VALUE_MARK: ''
      },
      editRules: {
        CONFIG_TYPE: [
          { required: true, message: '请输入配置类型', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    formatTime(val) {
      if (!val) return '';
      const s = String(val);
      return s.length >= 19 ? s.substr(0, 19) : s;
    },
    focusPwd() {
      this.$nextTick(() => {
        this.$refs.pwdInput?.focus?.();
      });
    },
    leavePage() {
      this.$router.back();
    },
    confirmPwd() {
      const pwd = (this.pwdDraft || '').trim();
      if (pwd !== MANAGE_PASSWORD) {
        this.$message.error('密码不正确');
        return;
      }
      this.managePassword = pwd;
      this.unlocked = true;
      this.pwdVisible = false;
      this.reload();
    },
    datasource({ page, limit, where }) {
      if (!this.unlocked || !this.managePassword) {
        return Promise.resolve({ list: [], count: 0 });
      }
      return getConfigPageList({
        page,
        size: limit,
        managePassword: this.managePassword,
        keyword: (where && where.keyword) || this.keyword || ''
      }).then((res) => {
        if (String(res.code) === '403') {
          this.$message.error(res.msg || '系统配置密码不正确');
          this.unlocked = false;
          this.managePassword = '';
          this.pwdVisible = true;
          return { list: [], count: 0 };
        }
        if (String(res.code) !== '200') {
          return Promise.reject(new Error(res.msg || '查询失败'));
        }
        return {
          list: res.result || [],
          count: res.total || 0
        };
      });
    },
    reload() {
      this.where = { keyword: (this.keyword || '').trim() };
      this.$nextTick(() => {
        this.$refs.table?.reload?.({ page: 1, where: this.where });
      });
    },
    resetSearch() {
      this.keyword = '';
      this.reload();
    },
    openEdit(row) {
      if (!this.unlocked) {
        this.pwdVisible = true;
        return;
      }
      if (row && row.ID != null) {
        this.editForm = {
          ID: String(row.ID),
          CONFIG_TYPE: row.CONFIG_TYPE || '',
          CONFIG_MARK: row.CONFIG_MARK || '',
          CONFIG_VALUE: row.CONFIG_VALUE || '',
          CONFIG_VALUE_MARK: row.CONFIG_VALUE_MARK || ''
        };
      } else {
        this.resetEditForm();
      }
      this.editVisible = true;
    },
    resetEditForm() {
      this.editForm = {
        ID: '',
        CONFIG_TYPE: '',
        CONFIG_MARK: '',
        CONFIG_VALUE: '',
        CONFIG_VALUE_MARK: ''
      };
      this.$refs.editForm?.clearValidate?.();
    },
    save() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.saving = true;
        saveConfig(
          {
            ID: this.editForm.ID,
            CONFIG_TYPE: (this.editForm.CONFIG_TYPE || '').trim(),
            CONFIG_MARK: this.editForm.CONFIG_MARK || '',
            CONFIG_VALUE: this.editForm.CONFIG_VALUE || '',
            CONFIG_VALUE_MARK: this.editForm.CONFIG_VALUE_MARK || ''
          },
          this.managePassword
        )
          .then((res) => {
            this.saving = false;
            if (String(res.code) === '200') {
              this.$message.success(res.msg || '保存成功');
              this.editVisible = false;
              this.reload();
              return;
            }
            this.$message.error(res.msg || '保存失败');
          })
          .catch((e) => {
            this.saving = false;
            this.$message.error(e.message || '保存失败');
          });
      });
    },
    remove(row) {
      if (!row || row.ID == null) return;
      const loading = this.$loading({ lock: true });
      deleteConfig(row.ID, this.managePassword)
        .then((res) => {
          loading.close();
          if (String(res.code) === '200') {
            this.$message.success(res.msg || '删除成功');
            this.reload();
            return;
          }
          this.$message.error(res.msg || '删除失败');
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message || '删除失败');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.config-manage-tip {
  margin-bottom: 10px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;

  code {
    margin: 0 2px;
    padding: 1px 4px;
    color: #409eff;
    background: #f4f4f5;
    border-radius: 3px;
  }
}

.config-password-tip {
  margin: 0 0 14px;
  color: #666;
  line-height: 24px;
}

.ele-action {
  margin-left: 10px;
}
</style>
