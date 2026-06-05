<template>
  <el-dialog
    title="编辑中标信息"
    :visible="visible"
    width="1200px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <div v-loading="loading" class="edit-form-wrap">
      <div class="section-title">基础资料</div>
      <el-form size="small" label-width="180px" class="edit-grid">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="品种材料编码">
              <el-input v-model="form.VARIETIE_CODE_NEW" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品种名称">
              <el-input v-model="form.VARIETIE_NAME" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编码">
              <el-input v-model="form.CONTRACT_CODE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省平台编码">
              <el-input v-model="form.PROVINCE_PLATFORM_CODE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市平台产品码">
              <el-input v-model="form.CITY_VAR_CODE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市平台规格型号码">
              <el-input v-model="form.CITY_SPE_CODE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国家医保编码">
              <el-input v-model="form.MEDICAL_CODE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册证名称">
              <el-input v-model="form.PROD_REGISTRATION_NAME" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册证号">
              <el-input v-model="form.APPROVAL_NUMBER" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号">
              <el-input v-model="form.XH" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">
              <el-input v-model="form.GG" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产厂家">
              <el-input v-model="form.MANUFACTURING_ENT_NAME" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位">
              <el-input v-model="form.UNIT" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价">
              <el-input v-model="form.PRICE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装规格">
              <el-input v-model="form.PKG_GG" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-input v-model="form.BRAND" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用科室">
              <el-input v-model="form.USE_DEPT" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商">
              <el-input v-model="form.SUP_NAME" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商联系人">
              <el-input v-model="form.SUP_PEOPLE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商联系方式">
              <el-input v-model="form.SUP_PHONE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送货方式（快递\\配送）">
              <el-input v-model="form.SEND_TYPE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同生效日期">
              <span>{{ formatDateOnly(form.CONTRACT_START) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同失效日期">
              <span>{{ formatDateOnly(form.CONTRACT_END) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配套设备">
              <el-input v-model="form.SUPPORTING_EQU" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配套设备品牌">
              <el-input v-model="form.SUPPORTING_EQU_BRAND" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配套设备型号">
              <el-input v-model="form.SUPPORTING_EQU_XH" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否高值">
              <el-select v-model="form.HIGH_OR_LOW_CLASS" style="width: 100%">
                <el-option label="低值" value="0" />
                <el-option label="高值" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点治理序号">
              <el-input v-model="form.HIGH_CLASS_XH" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input v-model="form.REMARK" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国家高值医用耗材重点治理清单内">
              <el-select v-model="form.IS_IN_COUNTRY_IMPORT" style="width: 100%">
                <el-option label="否" value="0" />
                <el-option label="是" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="saving" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { searchBidVarInfoById, updateBidVarInfo } from '@/api/Home/BidVarInfo';
import { formatDateOnly } from '../utils';

function emptyForm() {
  return {
    ID: '',
    VARIETIE_CODE_NEW: '',
    VARIETIE_NAME: '',
    CONTRACT_CODE: '',
    PROVINCE_PLATFORM_CODE: '',
    CITY_VAR_CODE: '',
    CITY_SPE_CODE: '',
    MEDICAL_CODE: '',
    PROD_REGISTRATION_NAME: '',
    APPROVAL_NUMBER: '',
    XH: '',
    GG: '',
    MANUFACTURING_ENT_NAME: '',
    UNIT: '',
    PRICE: '',
    PKG_GG: '',
    BRAND: '',
    USE_DEPT: '',
    SUP_NAME: '',
    SUP_PEOPLE: '',
    SUP_PHONE: '',
    SEND_TYPE: '',
    CONTRACT_START: '',
    CONTRACT_END: '',
    SUPPORTING_EQU: '',
    SUPPORTING_EQU_BRAND: '',
    SUPPORTING_EQU_XH: '',
    HIGH_CLASS_XH: '',
    REMARK: '',
    HIGH_OR_LOW_CLASS: '0',
    IS_IN_COUNTRY_IMPORT: '0'
  };
}

export default {
  name: 'EditBidVarDialog',
  props: {
    visible: Boolean,
    recordId: [String, Number]
  },
  data() {
    return {
      loading: false,
      saving: false,
      form: emptyForm()
    };
  },
  watch: {
    visible(val) {
      if (val && this.recordId) {
        this.loadDetail();
      }
    }
  },
  methods: {
    formatDateOnly,
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async loadDetail() {
      this.loading = true;
      try {
        const row = await searchBidVarInfoById(this.recordId);
        if (!row) {
          Message.warning('未找到记录');
          this.updateVisible(false);
          return;
        }
        this.form = {
          ...emptyForm(),
          ...row,
          HIGH_OR_LOW_CLASS: row.HIGH_OR_LOW_CLASS == null ? '0' : String(row.HIGH_OR_LOW_CLASS),
          IS_IN_COUNTRY_IMPORT:
            row.IS_IN_COUNTRY_IMPORT == null ? '0' : String(row.IS_IN_COUNTRY_IMPORT),
          PRICE: row.PRICE == null ? '' : String(row.PRICE)
        };
      } catch (e) {
        Message.error(e.message || '加载失败');
        this.updateVisible(false);
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      this.saving = true;
      try {
        const payload = {
          ID: String(this.recordId ?? this.form.ID ?? ''),
          VARIETIE_CODE_NEW: this.form.VARIETIE_CODE_NEW ?? '',
          VARIETIE_NAME: this.form.VARIETIE_NAME ?? '',
          CONTRACT_CODE: this.form.CONTRACT_CODE ?? '',
          PROVINCE_PLATFORM_CODE: this.form.PROVINCE_PLATFORM_CODE ?? '',
          CITY_VAR_CODE: this.form.CITY_VAR_CODE ?? '',
          CITY_SPE_CODE: this.form.CITY_SPE_CODE ?? '',
          MEDICAL_CODE: this.form.MEDICAL_CODE ?? '',
          PROD_REGISTRATION_NAME: this.form.PROD_REGISTRATION_NAME ?? '',
          APPROVAL_NUMBER: this.form.APPROVAL_NUMBER ?? '',
          XH: this.form.XH ?? '',
          GG: this.form.GG ?? '',
          MANUFACTURING_ENT_NAME: this.form.MANUFACTURING_ENT_NAME ?? '',
          UNIT: this.form.UNIT ?? '',
          PRICE: this.form.PRICE ?? '',
          PKG_GG: this.form.PKG_GG ?? '',
          BRAND: this.form.BRAND ?? '',
          USE_DEPT: this.form.USE_DEPT ?? '',
          SUP_NAME: this.form.SUP_NAME ?? '',
          SUP_PEOPLE: this.form.SUP_PEOPLE ?? '',
          SUP_PHONE: this.form.SUP_PHONE ?? '',
          SEND_TYPE: this.form.SEND_TYPE ?? '',
          CONTRACT_START: this.form.CONTRACT_START ?? '',
          CONTRACT_END: this.form.CONTRACT_END ?? '',
          SUPPORTING_EQU: this.form.SUPPORTING_EQU ?? '',
          SUPPORTING_EQU_BRAND: this.form.SUPPORTING_EQU_BRAND ?? '',
          SUPPORTING_EQU_XH: this.form.SUPPORTING_EQU_XH ?? '',
          HIGH_CLASS_XH: this.form.HIGH_CLASS_XH ?? '',
          REMARK: this.form.REMARK ?? '',
          HIGH_OR_LOW_CLASS: this.form.HIGH_OR_LOW_CLASS ?? '0',
          IS_IN_COUNTRY_IMPORT: this.form.IS_IN_COUNTRY_IMPORT ?? '0'
        };
        const res = await updateBidVarInfo(payload);
        Message.success(res.msg || '修改成功');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '修改失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #009688;
  margin-bottom: 12px;
}
.edit-form-wrap {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
