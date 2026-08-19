<template>
  <el-dialog
    :title="isAddMode ? '添加散货品种' : '编辑散货品种'"
    :visible.sync="innerVisible"
    width="96%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    custom-class="variety-edit-dialog"
    @open="onOpen"
    :before-close="handleBeforeClose"
    @closed="onClosed"
  >
    <div v-loading="loading" element-loading-text="加载中..." class="edit-body">
      <div class="add-reg-row">
        <span class="add-reg-label">批准文号</span>
        <el-select
          v-model="selectedRegCode"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入或选择一个批准文号（可选）"
          :remote-method="filterApprovalOptions"
          :loading="approvalLoading"
          style="width: 480px"
          size="mini"
          @change="onApprovalChange"
        >
          <el-option
            v-for="item in approvalOptions"
            :key="item.Prod_Registration_Code"
            :label="approvalOptionLabel(item)"
            :value="String(item.Prod_Registration_Code)"
          />
        </el-select>
      </div>

      <el-descriptions v-if="detail" :column="4" size="mini" border class="summary-desc">
        <el-descriptions-item label="当前文号">{{ currentApprovalNumber }}</el-descriptions-item>
        <el-descriptions-item label="注册证名称">
          {{ detail.prod_big_class_name || detail.Common_Name }}
        </el-descriptions-item>
        <el-descriptions-item label="生产企业" :span="2">
          {{ detail.manufacturing_ent_name }}
        </el-descriptions-item>
        <el-descriptions-item v-if="!isAddMode" label="内部ID">
          {{ detail.Varietie_Code }}
        </el-descriptions-item>
        <el-descriptions-item label="注册证ID">{{ detail.Prod_Registration_Code }}</el-descriptions-item>
        <el-descriptions-item v-if="!isAddMode" label="创建时间">
          {{ formatTime(detail.Create_Time) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="!isAddMode" label="最后更新">
          {{ formatTime(detail.Last_Update_Time) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        v-if="form"
        ref="editFormRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
        size="mini"
        class="variety-edit-form"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="group in editGroups" :key="group.name" :label="group.label" :name="group.name">
            <el-row :gutter="12">
              <el-col v-for="field in group.fields" :key="field.key" :span="field.span || 8">
                <el-form-item :label="field.label" :prop="field.required ? field.key : undefined">
                  <el-input
                    v-if="field.type === 'input' || field.type === 'number'"
                    v-model="form[field.key]"
                    :type="field.type === 'number' ? 'number' : 'text'"
                    :placeholder="field.placeholder"
                    :disabled="isFieldDisabled(field)"
                    clearable
                  />
                  <el-input
                    v-else-if="field.type === 'text'"
                    v-model="form[field.key]"
                    :disabled="isFieldDisabled(field)"
                    :readonly="!isAddMode || field.key !== 'Varietie_Code_New'"
                  />
                  <el-input
                    v-else-if="field.type === 'textarea'"
                    v-model="form[field.key]"
                    type="textarea"
                    :rows="2"
                    :placeholder="field.placeholder"
                  />
                  <el-select
                    v-else-if="field.type === 'select'"
                    v-model="form[field.key]"
                    clearable
                    :filterable="!!field.filterable"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="opt in resolveFieldOptions(field)"
                      :key="String(opt.value)"
                      :label="opt.label"
                      :value="normalizeOptionValue(field.key, opt.value)"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="innerVisible = false">取消</el-button>
      <el-button type="primary" size="mini" :loading="saving" :disabled="loading" @click="onSave">
        {{ isAddMode ? '确定' : '保存' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import {
  CheckVarietieBasic,
  GetVarietyDetailsInfo,
  GetApprovalNumberList,
  GetApprovalNumberInfo,
  IsVarietieExist,
  InsertVarietieBasic,
  GetClassificProp,
  GetClassificProp2,
  listClassIfic3
} from '@/api/Home/VarietyDataLzhMain';
import { updateVarietieBasic, updateVarietieBasicStse } from '@/api/Home/VarietyDataLzhAudit';
import { isStseLikeHp, cleanupDialogOverlays } from '../utils';
import {
  buildUpdatePayload,
  buildInsertPayload,
  createEmptyDetail,
  detailToForm,
  mergeFormToDetail
} from '../varietyEditMapper';
import { VARIETY_EDIT_GROUPS } from '../varietyEditFields';

const NUMERIC_SELECT_KEYS = new Set(['STORAGE_ID']);
const CLASSIFIC_OPTION_KEYS = new Set([
  'Classific_Properties',
  'CLASSIFIC_PROPERTIES2',
  'CLASSIFIC_PROPERTIES3'
]);

function mapClassificOptions(list, { codeKeys, nameKeys, stseStyle }) {
  return (Array.isArray(list) ? list : [])
    .map((item) => {
      const code = String(
        codeKeys.map((k) => item?.[k]).find((v) => v != null && v !== '') ?? ''
      );
      const name = String(
        nameKeys.map((k) => item?.[k]).find((v) => v != null && v !== '') ?? ''
      );
      if (!code) return null;
      const label = stseStyle
        ? `${name}${code}`
        : name
          ? `${code}-${name}`
          : code;
      return { value: code, label };
    })
    .filter(Boolean);
}

export default {
  name: 'VarietyEditDialog',
  props: {
    visible: { type: Boolean, default: false },
    varietieCode: { type: String, default: '' },
    /** edit | add */
    mode: { type: String, default: 'edit' }
  },
  data() {
    return {
      loading: false,
      saving: false,
      loadSeq: 0,
      activeTab: 'basic',
      detail: null,
      form: null,
      approvalAll: [],
      approvalOptions: [],
      approvalLoading: false,
      selectedRegCode: '',
      classificPropOptions: [],
      classificProp2Options: [],
      classificProp3Options: []
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.loading = true;
      }
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    isAddMode() {
      return this.mode === 'add';
    },
    useStseApi() {
      return isStseLikeHp(HOME_HP) || HOME_HP === 'stzyyy';
    },
    stseClassificLabel() {
      return HOME_HP === 'stse';
    },
    editGroups() {
      const optionMap = {
        classificProp: this.classificPropOptions,
        classificProp2: this.classificProp2Options,
        classificProp3: this.classificProp3Options
      };
      const injectOptions = (fields) =>
        fields.map((field) => {
          if (field.optionsKey && optionMap[field.optionsKey]) {
            return { ...field, options: optionMap[field.optionsKey] };
          }
          return field;
        });
      if (!this.isAddMode) {
        return VARIETY_EDIT_GROUPS.map((group) => ({
          ...group,
          fields: injectOptions(group.fields)
        }));
      }
      return VARIETY_EDIT_GROUPS.map((group) => ({
        ...group,
        fields: injectOptions(
          group.fields.map((field) => {
            if (field.key !== 'Varietie_Code_New') return field;
            return {
              ...field,
              type: 'input',
              disabled: false,
              required: true,
              placeholder: '请输入品种材料编码'
            };
          })
        )
      }));
    },
    currentApprovalNumber() {
      return this.pickApprovalNumber(this.detail) || this.pickApprovalNumber(this.selectedApprovalItem);
    },
    selectedApprovalItem() {
      const code = String(this.selectedRegCode || '');
      if (!code) return null;
      return (
        this.approvalOptions.find((item) => String(item.Prod_Registration_Code) === code) ||
        this.approvalAll.find((item) => String(item.Prod_Registration_Code) === code) ||
        null
      );
    },
    formRules() {
      const rules = {
        Varietie_Name: [{ required: true, message: '必填', trigger: 'blur' }],
        Specification_Or_Type: [{ required: true, message: '必填', trigger: 'blur' }],
        Unit: [{ required: true, message: '必填', trigger: 'blur' }],
        Price: [{ required: true, message: '必填', trigger: 'blur' }]
      };
      if (this.isAddMode) {
        rules.Varietie_Code_New = [{ required: true, message: '必填', trigger: 'blur' }];
      }
      return rules;
    }
  },
  beforeDestroy() {
    this.loadSeq += 1;
    this.loading = false;
    cleanupDialogOverlays();
  },
  methods: {
    formatTime(v) {
      if (!v) return '';
      return String(v).replace('T', ' ').substring(0, 19);
    },
    pickApprovalNumber(row) {
      if (!row) return '';
      return (
        row.Approval_Number ||
        row.APPROVAL_NUMBER ||
        row.approval_number ||
        ''
      );
    },
    approvalOptionLabel(item) {
      const no = this.pickApprovalNumber(item);
      const name = item.Prod_Registration_Name || item.prod_big_class_name || '';
      const ent = item.Manufacturing_Ent_Name || item.manufacturing_ent_name || '';
      return [no, name, ent].filter(Boolean).join(' | ');
    },
    syncDetailApprovalNumber() {
      if (!this.detail) return;
      const no =
        this.pickApprovalNumber(this.detail) || this.pickApprovalNumber(this.selectedApprovalItem);
      this.$set(this.detail, 'Approval_Number', no);
    },
    isFieldDisabled(field) {
      if (this.isAddMode && field.key === 'Varietie_Code_New') return false;
      if (this.isAddMode && field.key === 'Enable') return true;
      return !!field.disabled;
    },
    resolveFieldOptions(field) {
      return Array.isArray(field.options) ? field.options : [];
    },
    async loadClassificOptions() {
      const stseStyle = this.stseClassificLabel;
      const tasks = [
        GetClassificProp()
          .then((res) => {
            this.classificPropOptions = mapClassificOptions(res?.result || [], {
              codeKeys: ['Classific_Properties', 'CLASSIFIC_PROPERTIES'],
              nameKeys: ['Classific_Name', 'CLASSIFIC_NAME'],
              stseStyle
            });
          })
          .catch(() => {
            this.classificPropOptions = [];
          }),
        GetClassificProp2()
          .then((res) => {
            this.classificProp2Options = mapClassificOptions(res?.result || [], {
              codeKeys: ['Classific_Properties2', 'CLASSIFIC_PROPERTIES2'],
              nameKeys: ['Classific_Name2', 'CLASSIFIC_NAME2'],
              stseStyle: false
            });
          })
          .catch(() => {
            this.classificProp2Options = [];
          }),
        listClassIfic3()
          .then((res) => {
            const list = res?.data || res?.result || [];
            this.classificProp3Options = mapClassificOptions(list, {
              codeKeys: ['CLASSIFIC_PROPERTIES3', 'Classific_Properties3'],
              nameKeys: ['CLASSIFIC_NAME3', 'Classific_Name3'],
              stseStyle: false
            });
          })
          .catch(() => {
            this.classificProp3Options = [];
          })
      ];
      await Promise.all(tasks);
    },
    handleBeforeClose(done) {
      this.loadSeq += 1;
      this.loading = false;
      this.saving = false;
      done();
    },
    onOpen() {
      if (this.isAddMode) {
        this.initAdd();
      } else {
        this.loadDetail();
      }
    },
    async initAdd() {
      const seq = ++this.loadSeq;
      this.loading = true;
      this.detail = null;
      this.form = null;
      this.activeTab = 'basic';
      this.selectedRegCode = '';
      this.approvalOptions = [];
      try {
        await this.loadClassificOptions();
        if (seq !== this.loadSeq) return;
        this.detail = createEmptyDetail();
        this.form = detailToForm(this.detail);
        await this.loadApprovalList(seq);
      } catch (e) {
        if (seq !== this.loadSeq) return;
        this.$message.error(e.message || '初始化失败');
        this.innerVisible = false;
      } finally {
        if (seq === this.loadSeq) {
          this.loading = false;
        }
      }
    },
    async loadApprovalList(seq) {
      this.approvalLoading = true;
      try {
        const list = await GetApprovalNumberList();
        if (seq !== this.loadSeq) return;
        this.approvalAll = Array.isArray(list) ? list : [];
        this.filterApprovalOptions('');
        this.syncDetailApprovalNumber();
      } catch (e) {
        if (seq !== this.loadSeq) return;
        this.approvalAll = [];
        this.approvalOptions = [];
        this.$message.error(e.message || '加载批准文号列表失败');
      } finally {
        if (seq === this.loadSeq) {
          this.approvalLoading = false;
        }
      }
    },
    ensureSelectedApprovalOption() {
      const code = String(this.selectedRegCode || '');
      if (!code) return;
      const exists = this.approvalOptions.some(
        (item) => String(item.Prod_Registration_Code) === code
      );
      if (exists) return;
      const fromAll = this.approvalAll.find(
        (item) => String(item.Prod_Registration_Code) === code
      );
      this.approvalOptions.unshift(
        fromAll || {
          Prod_Registration_Code: code,
          Approval_Number: this.detail?.Approval_Number || '',
          Prod_Registration_Name:
            this.detail?.prod_big_class_name || this.detail?.Common_Name || '',
          Manufacturing_Ent_Name: this.detail?.manufacturing_ent_name || ''
        }
      );
    },
    filterApprovalOptions(query) {
      const q = String(query || '')
        .trim()
        .toLowerCase();
      if (!q) {
        this.approvalOptions = this.approvalAll.slice(0, 80);
      } else {
        this.approvalOptions = this.approvalAll
          .filter((item) => {
            const text = this.approvalOptionLabel(item).toLowerCase();
            return text.includes(q);
          })
          .slice(0, 80);
      }
      this.ensureSelectedApprovalOption();
    },
    async onApprovalChange(code) {
      if (!this.detail) return;
      if (!code) {
        this.detail.Prod_Registration_Code = '';
        this.detail.Approval_Number = '';
        this.detail.manufacturing_ent_name = '';
        this.detail.prod_big_class_name = '';
        this.detail.Common_Name = '';
        return;
      }
      try {
        const list = await GetApprovalNumberInfo(code);
        const info = Array.isArray(list) ? list[0] : null;
        const fallback = this.approvalAll.find(
          (x) => String(x.Prod_Registration_Code) === String(code)
        ) || {};
        const row = { ...fallback, ...(info || {}) };
        this.detail.Prod_Registration_Code = String(
          row.Prod_Registration_Code || code
        );
        this.$set(
          this.detail,
          'Approval_Number',
          this.pickApprovalNumber(info) || this.pickApprovalNumber(fallback)
        );
        this.detail.manufacturing_ent_name =
          row.Manufacturing_Ent_Name || row.manufacturing_ent_name || '';
        this.detail.prod_big_class_name =
          row.prod_big_class_name || row.Prod_Registration_Name || '';
        this.detail.Common_Name = row.Prod_Registration_Name || '';
        if (!this.form.Varietie_Name && row.Prod_Registration_Name) {
          this.form.Varietie_Name = row.Prod_Registration_Name;
        }
        if (row.STRUCTURE_COMPOSITION) this.form.FEATURE = row.STRUCTURE_COMPOSITION;
        if (row.SCOPE_APPLICATION) this.form.PURPOSE = row.SCOPE_APPLICATION;
        if (row.PRO_MEDICAL_CONSUMABLE_GRADE) {
          this.form.MEDICAL_CONSUMABLE_GRADE = row.PRO_MEDICAL_CONSUMABLE_GRADE;
        }
      } catch (e) {
        this.$message.error(e.message || '加载批准文号信息失败');
      }
    },
    async loadDetail() {
      if (!this.varietieCode) return;
      const seq = ++this.loadSeq;
      this.loading = true;
      this.detail = null;
      this.form = null;
      this.activeTab = 'basic';
      this.selectedRegCode = '';
      this.approvalOptions = [];
      try {
        await this.loadClassificOptions();
        if (seq !== this.loadSeq) return;
        const nickname = this.$store.state.user?.info?.Nickname || '';
        const check = await CheckVarietieBasic({
          varietieCode: `'${this.varietieCode}'`,
          nickname
        });
        if (seq !== this.loadSeq) return;
        if (check === '301' || check === 301 || parseInt(check, 10) === 301) {
          this.$message.error('登录失效，请重新登录');
          this.innerVisible = false;
          return;
        }
        const data = await GetVarietyDetailsInfo(this.varietieCode);
        if (seq !== this.loadSeq) return;
        if (data === '301' || data === 301) {
          this.$message.error('登录失效，请重新登录');
          this.innerVisible = false;
          return;
        }
        const json = typeof data === 'string' ? JSON.parse(data) : data;
        const list = Array.isArray(json) ? json : json?.result || [];
        if (!list.length) {
          this.$message.warning('未找到品种详情');
          this.innerVisible = false;
          return;
        }
        this.detail = list[0];
        this.form = detailToForm(this.detail);
        this.selectedRegCode = this.detail?.Prod_Registration_Code
          ? String(this.detail.Prod_Registration_Code)
          : '';
        await this.loadApprovalList(seq);
      } catch (e) {
        if (seq !== this.loadSeq) return;
        this.$message.error(e.message || '加载详情失败');
        this.innerVisible = false;
      } finally {
        if (seq === this.loadSeq) {
          this.loading = false;
        }
      }
    },
    normalizeOptionValue(key, value) {
      if (NUMERIC_SELECT_KEYS.has(key)) {
        const n = Number(value);
        return Number.isFinite(n) ? n : value;
      }
      if (CLASSIFIC_OPTION_KEYS.has(key)) {
        return value != null && value !== '' ? String(value) : value;
      }
      return value != null ? String(value) : value;
    },
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.editFormRef?.validate((valid) => resolve(valid));
      });
    },
    async onSave() {
      const valid = await this.validateForm();
      if (!valid) {
        this.$message.warning('请完善必填项');
        return;
      }
      if (this.isAddMode) {
        await this.onSaveAdd();
        return;
      }
      this.saving = true;
      try {
        const merged = mergeFormToDetail(this.detail, this.form);
        const payload = buildUpdatePayload(merged, {
          token: sessionStorage.getItem(TOKEN_STORE_NAME),
          nickname: this.$store.state.user?.info?.Nickname || '',
          hp: HOME_HP,
          useStseApi: this.useStseApi
        });
        const res = this.useStseApi
          ? await updateVarietieBasicStse(payload)
          : await updateVarietieBasic(payload);
        this.$message.success(res.msg || '保存成功');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    async onSaveAdd() {
      const code = String(this.form.Varietie_Code_New || '').trim();
      if (!code) {
        this.$message.warning('请填写品种材料编码');
        return;
      }
      this.saving = true;
      try {
        const exists = await IsVarietieExist(code);
        if (exists) {
          this.$message.warning('品种编码已存在，请更换编码');
          return;
        }
        const merged = mergeFormToDetail(this.detail, this.form);
        merged.Varietie_Code_New = code;
        merged.Prod_Registration_Code = this.detail.Prod_Registration_Code;
        const payload = buildInsertPayload(merged, {
          token: sessionStorage.getItem(TOKEN_STORE_NAME),
          nickname: this.$store.state.user?.info?.Nickname || '',
          hp: HOME_HP
        });
        const res = await InsertVarietieBasic(payload);
        this.$message.success(res.msg || '创建成功');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '创建失败');
      } finally {
        this.saving = false;
      }
    },
    onClosed() {
      this.loadSeq += 1;
      this.loading = false;
      this.saving = false;
      this.detail = null;
      this.form = null;
      this.selectedRegCode = '';
      this.approvalAll = [];
      this.approvalOptions = [];
      this.classificPropOptions = [];
      this.classificProp2Options = [];
      this.classificProp3Options = [];
      this.$nextTick(() => cleanupDialogOverlays());
      this.$emit('closed');
    }
  }
};
</script>

<style scoped>
.edit-body {
  min-height: 400px;
}
.summary-desc {
  margin-bottom: 12px;
}
.add-reg-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.add-reg-label {
  width: 70px;
  color: #606266;
  font-size: 12px;
  flex-shrink: 0;
}
.variety-edit-form ::v-deep .el-form-item {
  margin-bottom: 10px;
}
.variety-edit-form ::v-deep .el-form-item__label {
  line-height: 28px;
}
</style>

<style>
.variety-edit-dialog .el-dialog__body {
  padding: 8px 16px;
  max-height: calc(90vh - 120px);
  overflow: auto;
}
</style>
