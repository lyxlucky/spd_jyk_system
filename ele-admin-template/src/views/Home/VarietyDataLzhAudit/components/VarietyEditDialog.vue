<template>
  <el-dialog
    title="编辑散货品种"
    :visible.sync="innerVisible"
    width="96%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    custom-class="variety-edit-dialog"
    @open="loadDetail"
    :before-close="handleBeforeClose"
    @closed="onClosed"
  >
    <div v-loading="loading" element-loading-text="加载中..." class="edit-body">
      <el-descriptions v-if="detail" :column="4" size="mini" border class="summary-desc">
        <el-descriptions-item label="批准文号">{{ detail.Approval_Number }}</el-descriptions-item>
        <el-descriptions-item label="注册证名称">{{ detail.prod_big_class_name || detail.Common_Name }}</el-descriptions-item>
        <el-descriptions-item label="生产企业" :span="2">{{ detail.manufacturing_ent_name }}</el-descriptions-item>
        <el-descriptions-item label="内部ID">{{ detail.Varietie_Code }}</el-descriptions-item>
        <el-descriptions-item label="注册证ID">{{ detail.Prod_Registration_Code }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatTime(detail.Create_Time) }}</el-descriptions-item>
        <el-descriptions-item label="最后更新">{{ formatTime(detail.Last_Update_Time) }}</el-descriptions-item>
      </el-descriptions>

      <el-form v-if="form" ref="editFormRef" :model="form" :rules="formRules" label-width="140px" size="mini" class="variety-edit-form">
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
                    :disabled="field.disabled"
                    clearable
                  />
                  <el-input
                    v-else-if="field.type === 'text'"
                    v-model="form[field.key]"
                    :disabled="field.disabled"
                    readonly
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
                    style="width: 100%"
                  >
                    <el-option
                      v-for="opt in field.options"
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
      <el-button type="primary" size="mini" :loading="saving" :disabled="loading" @click="onSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import { CheckVarietieBasic, GetVarietyDetailsInfo } from '@/api/Home/VarietyDataLzhMain';
import { updateVarietieBasic, updateVarietieBasicStse } from '@/api/Home/VarietyDataLzhAudit';
import { isStseLikeHp, cleanupDialogOverlays } from '../utils';
import { buildUpdatePayload, detailToForm, mergeFormToDetail } from '../varietyEditMapper';
import { VARIETY_EDIT_GROUPS } from '../varietyEditFields';

const NUMERIC_SELECT_KEYS = new Set(['STORAGE_ID']);

export default {
  name: 'VarietyEditDialog',
  props: {
    visible: { type: Boolean, default: false },
    varietieCode: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      saving: false,
      loadSeq: 0,
      activeTab: 'basic',
      detail: null,
      form: null,
      editGroups: VARIETY_EDIT_GROUPS,
      formRules: {
        Varietie_Name: [{ required: true, message: '必填', trigger: 'blur' }],
        Specification_Or_Type: [{ required: true, message: '必填', trigger: 'blur' }],
        Unit: [{ required: true, message: '必填', trigger: 'blur' }],
        Price: [{ required: true, message: '必填', trigger: 'blur' }]
      }
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
    useStseApi() {
      return isStseLikeHp(HOME_HP) || HOME_HP === 'stzyyy';
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
    handleBeforeClose(done) {
      this.loadSeq += 1;
      this.loading = false;
      this.saving = false;
      done();
    },
    async loadDetail() {
      if (!this.varietieCode) return;
      const seq = ++this.loadSeq;
      this.loading = true;
      this.detail = null;
      this.form = null;
      this.activeTab = 'basic';
      try {
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
    onClosed() {
      this.loadSeq += 1;
      this.loading = false;
      this.saving = false;
      this.detail = null;
      this.form = null;
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
