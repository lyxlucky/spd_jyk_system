<template>
  <div class="ele-body dept-two-mapping-page">
    <el-card shadow="never" class="pane-card">
      <div class="section-title">SPD 二级科室与 HIS 映射</div>
      <el-form :inline="true" size="mini" class="ele-form-search" @keyup.enter.native="reloadMaster">
        <el-form-item label="关键字">
          <el-input
            v-model="masterQuery.keyword"
            clearable
            placeholder="科室编码 / 名称"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="是否关联">
          <el-select v-model="masterQuery.linkFilter" style="width: 120px">
            <el-option label="全部" value="all" />
            <el-option label="未关联" value="unlinked" />
            <el-option label="已关联" value="linked" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reloadMaster">查询</el-button>
          <el-button @click="resetMasterQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="masterTable"
        :columns="masterColumns"
        :datasource="masterDatasource"
        :response="responseConfig"
        :need-page="true"
        :page-size="20"
        :page-sizes="[10, 20, 50]"
        cache-key="deptTwoBasicPickTable"
        :height="tableHeight"
        :toolkit="['reload', 'size', 'columns', 'fullscreen']"
        :row-key="masterRowKey"
        @done="onMasterDone"
      >
        <template v-slot:hisDeptCode="{ row }">
          <el-input
            v-model="row.HIS_DEPT_CODE"
            size="mini"
            maxlength="50"
            clearable
            placeholder="可直接编辑"
            class="cell-inline-input"
            @blur="onHisInlineBlur(row)"
            @keyup.enter.native="onHisInlineBlur(row)"
          />
        </template>
        <template v-slot:hisDeptName="{ row }">
          <el-input
            v-model="row.HIS_DEPT_NAME"
            size="mini"
            maxlength="200"
            clearable
            placeholder="可直接编辑"
            class="cell-inline-input"
            @blur="onHisInlineBlur(row)"
            @keyup.enter.native="onHisInlineBlur(row)"
          />
        </template>
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEditMaster(row)">
            {{ row.MAPPING_ID ? '编辑' : '维护' }}
          </el-link>
          <el-popconfirm
            v-if="row.MAPPING_ID"
            class="ele-action"
            title="确定删除该 HIS 映射？"
            @confirm="removeMaster(row)"
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
      width="520px"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="small">
        <el-form-item label="SPD科室编码">
          <el-input :value="form.SPD_DEPT_CODE" readonly />
        </el-form-item>
        <el-form-item v-if="form.SPD_DEPT_NAME" label="SPD科室名称">
          <el-input :value="form.SPD_DEPT_NAME" readonly />
        </el-form-item>
        <el-form-item label="HIS科室编码" prop="HIS_DEPT_CODE">
          <el-input v-model="form.HIS_DEPT_CODE" placeholder="必填" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="HIS科室名称" prop="HIS_DEPT_NAME">
          <el-input v-model="form.HIS_DEPT_NAME" placeholder="必填" maxlength="200" show-word-limit />
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
  import { deptTwoBasicPickList, deptTwoMappingSave, deptTwoMappingDelete } from '@/api/system/dept-two-mapping';

  const emptyForm = () => ({
    ID: 0,
    SPD_DEPT_CODE: '',
    SPD_DEPT_NAME: '',
    HIS_DEPT_CODE: '',
    HIS_DEPT_NAME: ''
  });

  export default {
    name: 'DeptTwoMapping',
    data() {
      return {
        responseConfig: {
          dataName: 'data',
          countName: 'total',
          statusCode: 200
        },
        masterQuery: {
          keyword: '',
          /** all | unlinked | linked，默认全部 */
          linkFilter: 'all'
        },
        masterColumns: [
          { columnKey: 'index', type: 'index', width: 48, align: 'center', label: '序号' },
          {
            prop: 'DEPT_TWO_CODE',
            label: '二级科室编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '二级科室名称',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEPT_ONE_CODE',
            label: '一级科室编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            columnKey: 'hisDeptCode',
            prop: 'HIS_DEPT_CODE',
            label: 'HIS科室编码',
            minWidth: 140,
            align: 'center',
            slot: 'hisDeptCode'
          },
          {
            columnKey: 'hisDeptName',
            prop: 'HIS_DEPT_NAME',
            label: 'HIS科室名称',
            minWidth: 170,
            align: 'center',
            slot: 'hisDeptName'
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 150,
            align: 'center',
            slot: 'action',
            fixed: 'right'
          }
        ],
        dialogVisible: false,
        isAddMode: false,
        form: emptyForm(),
        formRules: {
          HIS_DEPT_CODE: [{ required: true, message: '请输入', trigger: 'blur' }],
          HIS_DEPT_NAME: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        saveLoading: false,
        tableHeight: 'calc(100vh - 330px )',
        /** 行内保存防抖，避免两格间切换焦点时误提示 */
        hisInlineSaveTimer: null,
        /** 弹窗编辑时对应的表格行，保存成功后同步到该行（不整表刷新） */
        editRow: null
      };
    },
    computed: {
      dialogTitle() {
        return this.isAddMode ? '新增 HIS 映射' : '编辑 HIS 映射';
      }
    },
    beforeDestroy() {
      clearTimeout(this.hisInlineSaveTimer);
    },
    methods: {
      /** Save 接口成功时 id 在 data 字段内：{ code, msg, data: { Id } } */
      mappingIdFromSaveResponse(res) {
        if (!res) return null;
        const inner = res.data != null ? res.data : res;
        const v = inner.id != null ? inner.id : inner.Id;
        if (v == null || v === '') return null;
        const n = Number(v);
        return n > 0 ? n : null;
      },
      masterRowKey(row) {
        return row && row.DEPT_TWO_CODE != null ? String(row.DEPT_TWO_CODE) : '';
      },
      masterDatasource({ page, limit }) {
        return deptTwoBasicPickList({
          page,
          size: limit,
          keyword: this.masterQuery.keyword || undefined,
          linkFilter: this.masterQuery.linkFilter || 'all'
        });
      },
      reloadMaster() {
        this.$refs.masterTable && this.$refs.masterTable.reload({ page: 1 });
      },
      resetMasterQuery() {
        this.masterQuery = { keyword: '', linkFilter: 'all' };
        this.reloadMaster();
      },
      onMasterDone(res) {
        const list = res && res.data;
        if (!list || !list.length) return;
        list.forEach((r) => {
          if (r.HIS_DEPT_CODE == null) this.$set(r, 'HIS_DEPT_CODE', '');
          if (r.HIS_DEPT_NAME == null) this.$set(r, 'HIS_DEPT_NAME', '');
        });
      },
      onHisInlineBlur(row) {
        clearTimeout(this.hisInlineSaveTimer);
        this.hisInlineSaveTimer = setTimeout(() => {
          this.persistHisFromRow(row);
        }, 200);
      },
      persistHisFromRow(row) {
        const code = (row.HIS_DEPT_CODE != null ? String(row.HIS_DEPT_CODE) : '').trim();
        const name = (row.HIS_DEPT_NAME != null ? String(row.HIS_DEPT_NAME) : '').trim();
        if (!code && !name) return;
        if (!code || !name) return;
        if (row._hisSaving) return;
        row._hisSaving = true;
        const hasMap = row.MAPPING_ID != null && Number(row.MAPPING_ID) > 0;
        const payload = {
          ID: hasMap ? Number(row.MAPPING_ID) : 0,
          SPD_DEPT_CODE: String(row.DEPT_TWO_CODE || ''),
          HIS_DEPT_CODE: code,
          HIS_DEPT_NAME: name
        };
        deptTwoMappingSave(payload)
          .then((data) => {
            this.$message.success('保存成功');
            const newId = this.mappingIdFromSaveResponse(data);
            if (newId != null) {
              this.$set(row, 'MAPPING_ID', newId);
            }
          })
          .catch((e) => {
            this.$message.error(e.message || '保存失败');
          })
          .finally(() => {
            row._hisSaving = false;
          });
      },
      openEditMaster(row) {
        this.editRow = row;
        const hasMap = row.MAPPING_ID != null && Number(row.MAPPING_ID) > 0;
        this.isAddMode = !hasMap;
        this.form = {
          ID: hasMap ? Number(row.MAPPING_ID) : 0,
          SPD_DEPT_CODE: String(row.DEPT_TWO_CODE || ''),
          SPD_DEPT_NAME: row.DEPT_TWO_NAME || '',
          HIS_DEPT_CODE: row.HIS_DEPT_CODE || '',
          HIS_DEPT_NAME: row.HIS_DEPT_NAME || ''
        };
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        });
      },
      onDialogClosed() {
        this.form = emptyForm();
        this.isAddMode = false;
        this.editRow = null;
      },
      submit() {
        this.$refs.formRef.validate((valid) => {
          if (!valid) return;
          const payload = {
            ID: this.form.ID,
            SPD_DEPT_CODE: this.form.SPD_DEPT_CODE,
            HIS_DEPT_CODE: this.form.HIS_DEPT_CODE,
            HIS_DEPT_NAME: this.form.HIS_DEPT_NAME
          };
          this.saveLoading = true;
          deptTwoMappingSave(payload)
            .then((data) => {
              this.$message.success('保存成功');
              let id = this.mappingIdFromSaveResponse(data);
              if (id == null && Number(this.form.ID) > 0) {
                id = Number(this.form.ID);
              }
              const row = this.editRow;
              if (row && id != null) {
                this.$set(row, 'MAPPING_ID', id);
                this.$set(row, 'HIS_DEPT_CODE', (this.form.HIS_DEPT_CODE || '').trim());
                this.$set(row, 'HIS_DEPT_NAME', (this.form.HIS_DEPT_NAME || '').trim());
              }
              this.dialogVisible = false;
            })
            .catch((e) => {
              this.$message.error(e.message || '保存失败');
            })
            .finally(() => {
              this.saveLoading = false;
            });
        });
      },
      removeMaster(row) {
        if (!row.MAPPING_ID) return;
        const loading = this.$loading({ lock: true });
        deptTwoMappingDelete(row.MAPPING_ID)
          .then(() => {
            this.$message.success('已删除');
            this.reloadMaster();
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
  /* .dept-two-mapping-page {
    min-height: calc(100vh - 96px);
  }
  .pane-card {
    min-height: calc(100vh - 120px);
  } */
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
    flex-shrink: 0;
  }
  .cell-inline-input {
    width: 100%;
  }
  .cell-inline-input :deep(.el-input__inner) {
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
