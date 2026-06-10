<template>
  <div class="ele-body umpda-page">
    <el-card shadow="never" class="umpda-table-card">
      <div class="section-title">PDA用户管理</div>
      <el-form :inline="true" size="mini" class="filter-form" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="where.username"
            placeholder="输入帐号进行查询"
            clearable
            style="width: 220px"
            @keyup.enter.native="reload"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        size="mini"
        height="420px"
        :columns="columns"
        :datasource="datasource"
        cache-key="umpdaTable"
      >
        <template v-slot:authLevel="{ row }">{{ formatAuthLevel(row.AUTH_LEVEL) }}</template>
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openEdit(row)">修改</el-button>
          <el-popconfirm title="确定删除PDA帐号?" @confirm="handleDelete(row)">
            <el-button slot="reference" type="text" size="mini" class="text-danger">删除</el-button>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never" class="umpda-form-card">
      <div class="section-title text-center">添加PDA账号</div>
      <el-form
        ref="addForm"
        v-loading="storageLoading"
        :model="addForm"
        :rules="addRules"
        label-width="120px"
        size="small"
        class="add-form"
      >
        <el-form-item label="权限选择" prop="AUTH_LEVEL">
          <el-select v-model="addForm.AUTH_LEVEL" style="width: 100%">
            <el-option
              v-for="item in authLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="院区">
          <el-select v-model="addForm.STORAGE_ID" clearable style="width: 100%">
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
          <el-input v-model="addForm.ACCOUNT" />
        </el-form-item>
        <el-form-item label="密码" prop="PASSWORD">
          <el-input v-model="addForm.PASSWORD" show-password />
        </el-form-item>
        <el-form-item label="使用场所名称">
          <el-input v-model="addForm.BELONG_PLACE" />
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="addForm.OPERATOR" />
        </el-form-item>
        <el-form-item label="二级科室编码">
          <el-input v-model="addForm.DEPT_TWO_CODE" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="submitting" @click="handleAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <EditPdaDialog :visible.sync="editVisible" :pda-id="currentId" @success="reload" />
  </div>
</template>

<script>
import EditPdaDialog from './components/EditPdaDialog.vue';
import { deleteAccount, getPdaUserList, setUpAccount } from '@/api/UserManage/UMPDA';
import { getSTORAGE } from '@/api/login';
import {
  AUTH_LEVEL_OPTIONS,
  checkAddPasswordStrength,
  encryptPdaPassword,
  formatAuthLevel,
  isOkResult
} from './utils';

export default {
  name: 'UMPDA',
  components: { EditPdaDialog },
  data() {
    return {
      where: { username: '' },
      storageList: [],
      storageLoading: false,
      submitting: false,
      editVisible: false,
      currentId: null,
      authLevelOptions: AUTH_LEVEL_OPTIONS,
      addForm: this.createEmptyAddForm(),
      addRules: {
        AUTH_LEVEL: [{ required: true, message: '请选择权限', trigger: 'change' }],
        ACCOUNT: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        PASSWORD: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      columns: [
        { label: '权限名称', prop: 'AUTH_LEVEL', width: 130, sortable: true, slot: 'authLevel' },
        { label: '用户账号', prop: 'ACCOUNT', minWidth: 120, sortable: true },
        { label: '使用场所名称', prop: 'BELONG_PLACE', minWidth: 140, sortable: true, showOverflowTooltip: true },
        { label: '使用人', prop: 'OPERATOR', width: 120, sortable: true },
        { label: '二级科室编码', prop: 'DEPT_TWO_CODE', width: 130, sortable: true },
        { label: '院区', prop: 'STORAGE_NAME', width: 120, sortable: true },
        { label: '操作', width: 120, fixed: 'right', slot: 'action' }
      ]
    };
  },
  created() {
    this.loadStorage();
  },
  methods: {
    formatAuthLevel,
    createEmptyAddForm() {
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
    async loadStorage() {
      this.storageLoading = true;
      try {
        const res = await getSTORAGE();
        this.storageList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载院区失败');
      } finally {
        this.storageLoading = false;
      }
    },
    datasource({ page, limit }) {
      return getPdaUserList(this.where, page, limit).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    openEdit(row) {
      this.currentId = row.ID;
      this.editVisible = true;
    },
    resetAddForm() {
      this.addForm = this.createEmptyAddForm();
      this.$refs.addForm?.clearValidate();
    },
    handleAdd() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return;
        if (!checkAddPasswordStrength(this.addForm.PASSWORD)) {
          this.$message.warning(
            '该账号密码为弱密码，密码应长度大于等于8位，包含大写、小写、特殊字符、阿拉伯数字其中3种'
          );
          return;
        }
        this.submitting = true;
        try {
          const res = await setUpAccount({
            AUTH_LEVEL: this.addForm.AUTH_LEVEL,
            STORAGE_ID: this.addForm.STORAGE_ID,
            ACCOUNT: this.addForm.ACCOUNT,
            PASSWORD: encryptPdaPassword(this.addForm.PASSWORD),
            BELONG_PLACE: this.addForm.BELONG_PLACE,
            OPERATOR: this.addForm.OPERATOR,
            DEPT_TWO_CODE: this.addForm.DEPT_TWO_CODE
          });
          if (isOkResult(res)) {
            this.$message.success('添加成功');
            this.resetAddForm();
            this.reload();
          } else {
            this.$message.error(res || '添加失败');
          }
        } catch (e) {
          this.$message.error(e.message || '添加失败');
        } finally {
          this.submitting = false;
        }
      });
    },
    async handleDelete(row) {
      try {
        const msg = await deleteAccount(row.ID);
        this.$message.success(msg || '删除成功');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}
.text-center {
  text-align: center;
}
.filter-form {
  margin-bottom: 8px;
}
.umpda-table-card {
  margin-bottom: 16px;
}
.umpda-form-card {
  max-width: 720px;
  margin: 0 auto;
}
.add-form {
  padding: 0 24px 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
