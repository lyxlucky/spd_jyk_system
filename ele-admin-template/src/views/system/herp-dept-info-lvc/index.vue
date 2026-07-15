<template>
  <div class="ele-body herp-dept-info-lvc-page">
    <el-card shadow="never" class="pane-card">
      <div class="section-title">三级库低值收费科室对冲关系</div>
      <el-form :inline="true" size="mini" class="ele-form-search" @submit.native.prevent>
        <el-form-item label="关键字">
          <el-input
            v-model="query.keyword"
            clearable
            placeholder="科室编码 / 名称 / 二级科室"
            style="width: 240px"
            @keyup.enter.native="reload"
          />
        </el-form-item>
        <el-form-item class="search-action-item">
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="openAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="datasource"
        :response="responseConfig"
        :need-page="true"
        :page-size="20"
        :page-sizes="[10, 20, 50, 100]"
        cache-key="herpDeptInfoLvcTable"
        :height="tableHeight"
        :toolkit="['reload', 'size', 'columns', 'fullscreen']"
        :row-key="rowKey"
      >
        <template v-slot:deptType="{ row }">{{ deptTypeLabel(row.DEPT_TYPE) }}</template>
        <template v-slot:addTime="{ row }">{{ formatDateTime(row.ADD_TIME) }}</template>
        <template v-slot:updateTime="{ row }">{{ formatDateTime(row.UPDATE_TIME) }}</template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">编辑</el-link>
          <el-popconfirm
            class="ele-action"
            title="确定删除该对冲关系？"
            @confirm="remove(row)"
          >
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">删除</el-link>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="560px"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" size="small">
        <el-form-item label="HIS执行科室编码" prop="DEPT_CODE">
          <el-input v-model="form.DEPT_CODE" maxlength="50" show-word-limit placeholder="必填" />
        </el-form-item>
        <el-form-item label="HIS执行科室名称" prop="DEPT_NAME">
          <el-input v-model="form.DEPT_NAME" maxlength="255" show-word-limit placeholder="必填" />
        </el-form-item>
        <el-form-item label="SPD二级科室编码">
          <el-input v-model="form.DEPT_TWO_CODE" placeholder="可空，未配置时不参与同步" />
        </el-form-item>
        <el-form-item label="HIS病区名称">
          <el-input v-model="form.ENDEMIC_AREA" maxlength="255" />
        </el-form-item>
        <el-form-item label="HIS病区编码">
          <el-input v-model="form.ENDEMIC_AREA_CODE" maxlength="255" />
        </el-form-item>
        <el-form-item label="科室类型">
          <el-select v-model="form.DEPT_TYPE" style="width: 100%">
            <el-option label="无" value="0" />
            <el-option label="门诊" value="1" />
            <el-option label="住院" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  herpDeptInfoLvcList,
  herpDeptInfoLvcSave,
  herpDeptInfoLvcDelete
} from '@/api/system/herp-dept-info-lvc';

const emptyForm = () => ({
  ID: 0,
  DEPT_CODE: '',
  DEPT_NAME: '',
  DEPT_TWO_CODE: '',
  ENDEMIC_AREA: '',
  ENDEMIC_AREA_CODE: '',
  DEPT_TYPE: '0'
});

export default {
  name: 'HerpDeptInfoLvc',
  data() {
    return {
      responseConfig: {
        dataName: 'data',
        countName: 'total',
        statusCode: 200
      },
      query: { keyword: '' },
      columns: [
        { columnKey: 'index', type: 'index', width: 48, align: 'center', label: '序号' },
        { prop: 'DEPT_CODE', label: 'HIS执行科室编码', minWidth: 150, showOverflowTooltip: true },
        { prop: 'DEPT_NAME', label: 'HIS执行科室名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'DEPT_TWO_CODE', label: 'SPD二级科室编码', minWidth: 140, showOverflowTooltip: true },
        { prop: 'DEPT_TWO_NAME', label: 'SPD二级科室名称', minWidth: 170, showOverflowTooltip: true },
        { prop: 'ENDEMIC_AREA', label: 'HIS病区', minWidth: 130, showOverflowTooltip: true },
        { prop: 'ENDEMIC_AREA_CODE', label: '病区编码', minWidth: 120, showOverflowTooltip: true },
        { columnKey: 'deptType', label: '科室类型', width: 90, align: 'center', slot: 'deptType' },
        { columnKey: 'addTime', label: '创建时间', width: 170, slot: 'addTime' },
        { columnKey: 'updateTime', label: '更新时间', width: 170, slot: 'updateTime' },
        { columnKey: 'action', label: '操作', width: 130, align: 'center', fixed: 'right', slot: 'action' }
      ],
      tableHeight: 'calc(100vh - 250px)',
      dialogVisible: false,
      editMode: false,
      form: emptyForm(),
      formRules: {
        DEPT_CODE: [{ required: true, message: '请输入HIS执行科室编码', trigger: 'blur' }],
        DEPT_NAME: [{ required: true, message: '请输入HIS执行科室名称', trigger: 'blur' }]
      },
      saveLoading: false
    };
  },
  computed: {
    dialogTitle() {
      return this.editMode ? '编辑三级库对冲关系' : '新增三级库对冲关系';
    }
  },
  methods: {
    rowKey(row) {
      return row && row.ID != null ? String(row.ID) : '';
    },
    datasource({ page, limit }) {
      return herpDeptInfoLvcList({
        page,
        size: limit,
        keyword: this.query.keyword || undefined
      });
    },
    reload() {
      this.$refs.table && this.$refs.table.reload({ page: 1 });
    },
    resetQuery() {
      this.query = { keyword: '' };
      this.reload();
    },
    formatDateTime(value) {
      if (!value) return '';
      return this.$util.toDateString(value, 'yyyy-MM-dd HH:mm:ss');
    },
    deptTypeLabel(value) {
      if (value === 1 || value === '1') return '门诊';
      if (value === 2 || value === '2') return '住院';
      return '无';
    },
    openAdd() {
      this.editMode = false;
      this.form = emptyForm();
      this.dialogVisible = true;
    },
    openEdit(row) {
      this.editMode = true;
      this.form = {
        ID: Number(row.ID) || 0,
        DEPT_CODE: row.DEPT_CODE || '',
        DEPT_NAME: row.DEPT_NAME || '',
        DEPT_TWO_CODE: row.DEPT_TWO_CODE || '',
        ENDEMIC_AREA: row.ENDEMIC_AREA || '',
        ENDEMIC_AREA_CODE: row.ENDEMIC_AREA_CODE || '',
        DEPT_TYPE: row.DEPT_TYPE == null || row.DEPT_TYPE === '' ? '0' : String(row.DEPT_TYPE)
      };
      this.dialogVisible = true;
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate());
    },
    onDialogClosed() {
      this.form = emptyForm();
      this.editMode = false;
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.saveLoading = true;
        try {
          await herpDeptInfoLvcSave(this.form);
          this.$message.success('保存成功');
          this.dialogVisible = false;
          this.reload();
        } catch (e) {
          this.$message.error(e.message || '保存失败');
        } finally {
          this.saveLoading = false;
        }
      });
    },
    remove(row) {
      const loading = this.$loading({ lock: true });
      herpDeptInfoLvcDelete(row.ID)
        .then(() => {
          this.$message.success('删除成功');
          this.reload();
        })
        .catch((e) => {
          this.$message.error(e.message || '删除失败');
        })
        .finally(() => {
          loading.close();
        });
    }
  }
};
</script>

<style scoped>
.herp-dept-info-lvc-page {
  min-height: calc(100vh - 96px);
}
.pane-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.section-title {
  font-weight: 600;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.ele-form-search {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
}
.search-action-item,
.search-action-item :deep(.el-form-item__content) {
  white-space: nowrap;
}
.search-action-item {
  flex: 0 0 auto;
  margin-left: 14px;
}
@media screen and (max-width: 768px) {
  .ele-form-search {
    flex-wrap: wrap;
  }
  .search-action-item {
    margin-left: 0;
  }
}
</style>
