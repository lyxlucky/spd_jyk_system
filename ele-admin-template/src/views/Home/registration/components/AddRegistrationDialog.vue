<template>
  <ele-modal
    width="780px"
    top="3vh"
    title="添加注册证"
    :visible="visible"
    :resizable="true"
    :maxable="true"
    @update:visible="updateVisible"
  >
    <el-form
      ref="form"
      size="mini"
      label-width="220px"
      :model="form"
      :rules="rules"
      class="add-registration-form"
    >
      <el-form-item label="注册证产品名称" prop="PROD_REGISTRATION_NAME">
        <el-input v-model="form.PROD_REGISTRATION_NAME" />
      </el-form-item>

      <el-form-item label="医疗器械注册人或备案人" prop="MANUFACTURING_ENT_NAME">
        <el-input
          v-model="form.MANUFACTURING_ENT_NAME"
          readonly
          style="width: calc(100% - 220px)"
        />
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 8px"
          @click="chooseManufacture('0')"
        >
          选择医疗器械注册人或备案人
        </el-button>
      </el-form-item>

      <el-form-item label="受托医疗器械生产企业名称">
        <el-input
          v-model="form.ST_MANUFACTURING_ENT_NAME"
          readonly
          style="width: calc(100% - 220px)"
        />
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 8px"
          @click="chooseManufacture('1')"
        >
          选择医疗器械生产企业名称
        </el-button>
      </el-form-item>

      <el-form-item label="批准文号" prop="APPROVAL_NUMBER">
        <el-input v-model="form.APPROVAL_NUMBER" />
      </el-form-item>

      <el-form-item label="生产许可证号">
        <el-input v-model="form.MANUFACTURING_LICENSE" readonly placeholder="选择注册人后自动带出" />
      </el-form-item>

      <el-form-item label="医保编码">
        <el-input v-model="form.MEDICAL_CODE" />
      </el-form-item>

      <el-form-item label="发证日期">
        <el-date-picker
          v-model="form.REGISTRATION_ISSUING_DATE"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
          :picker-options="issuPickerOptions"
        />
      </el-form-item>

      <el-form-item label="有效到期">
        <el-date-picker
          v-model="form.REGISTRATION_VALID_DATE"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="进口或国产">
        <el-select v-model="form.TRADE_TYPE" style="width: 100%" @change="onTradeTypeChange">
          <el-option label="国产" value="0" />
          <el-option label="进口" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="国外注册人名称">
        <el-input
          v-model="form.FOREIGN_REGIST_NAME"
          :disabled="form.TRADE_TYPE !== '1'"
          placeholder="进口时可填写"
        />
      </el-form-item>

      <el-form-item label="投标企业">
        <el-input v-model="form.BIDDING_ENT_NAME" placeholder="可填写投标企业名称" />
      </el-form-item>

      <el-form-item label="投标企业信用代码">
        <el-input v-model="form.BIDDING_ENT_CREDIT_CODE" placeholder="可填写投标企业信用代码" />
      </el-form-item>

      <el-form-item label="产地信息">
        <el-select v-model="form.ORIGIN_TYPE" style="width: 100%">
          <el-option label="默认" value="0" />
          <el-option label="国外" value="1" />
          <el-option label="国内省外" value="2" />
          <el-option label="省内市外" value="3" />
          <el-option label="市内区外" value="4" />
          <el-option label="区内" value="5" />
        </el-select>
      </el-form-item>

      <el-form-item label="档案位置">
        <el-input v-model="form.LICENCE_FILE_PATH" placeholder="为空时默认「无」" />
      </el-form-item>

      <el-form-item label="产品类别" prop="PROD_BIG_CLASS_CODE" required>
        <div class="category-row">
          <el-select
            v-model="form.PROD_BIG_CLASS_CODE"
            filterable
            style="width: 280px"
            placeholder="请选择产品类别"
            @change="onProdTypeChange"
          >
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="category-tip">
            *统一选择注册证产品从属的3级类别，以避免录入该注册证产品的相关品种时频繁重复此操作。产品证照属性以档案证照为准
          </span>
        </div>
      </el-form-item>

      <el-form-item label="管理类别" prop="MGMT_CAT_CODE" required>
        <el-select
          v-model="form.MGMT_CAT_CODE"
          filterable
          style="width: 280px"
          placeholder="请选择管理类别"
          @change="onMgmtChange"
        >
          <el-option
            v-for="item in mgmtOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="监管类别" prop="REGULATORY_ID" required>
        <el-select
          v-model="form.REGULATORY_ID"
          filterable
          style="width: 100%"
          placeholder="请选择监管类别"
        >
          <el-option
            v-for="item in regulatoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="品牌">
        <el-input v-model="form.Brand" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item label="结构及组成">
        <el-input v-model="form.STRUCTURE_COMPOSITION" />
      </el-form-item>

      <el-form-item label="适用范围" :required="requireScope">
        <el-input v-model="form.SCOPE_APPLICATION" />
      </el-form-item>

      <el-form-item label="医用耗材级别" :required="requireMedicalGrade">
        <el-input v-model="form.PRO_MEDICAL_CONSUMABLE_GRADE" />
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.NOTE_DESCRIPTION" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item label="原注册证">
        <el-input v-model="form.OLD_PROD_REGISTRATION_CODE" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSubmit">确定</el-button>
    </div>

    <Manufactory
      :visible.sync="manufactoryVisible"
      :factoryModalType="manufactoryMode"
      @chooseFacotory="onManufactureSelect"
    />
  </ele-modal>
</template>

<script>
import Manufactory from './Manufactory';
import { AddProdInfo } from '@/api/Home/registration/index';
import {
  GetProTypeList,
  GetMgmtListByProTypeID,
  GetRegulatoryListByMgmnID
} from '@/api/Home/Qualificationcheck/index';
import { HOME_HP } from '@/config/setting';

function emptyForm() {
  return {
    PROD_REGISTRATION_NAME: '',
    MANUFACTURING_ENT_NAME: '',
    ST_MANUFACTURING_ENT_NAME: '',
    APPROVAL_NUMBER: '',
    MANUFACTURING_LICENSE: '',
    MEDICAL_CODE: '',
    REGISTRATION_ISSUING_DATE: '',
    REGISTRATION_VALID_DATE: '',
    TRADE_TYPE: '0',
    FOREIGN_REGIST_NAME: '',
    BIDDING_ENT_NAME: '',
    BIDDING_ENT_CREDIT_CODE: '',
    ORIGIN_TYPE: '0',
    LICENCE_FILE_PATH: '',
    PROD_BIG_CLASS_CODE: '',
    MGMT_CAT_CODE: '',
    REGULATORY_ID: '',
    Brand: '',
    STRUCTURE_COMPOSITION: '',
    SCOPE_APPLICATION: '',
    PRO_MEDICAL_CONSUMABLE_GRADE: '',
    NOTE_DESCRIPTION: '',
    OLD_PROD_REGISTRATION_CODE: ''
  };
}

export default {
  name: 'AddRegistrationDialog',
  components: { Manufactory },
  props: {
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      form: emptyForm(),
      rules: {
        PROD_REGISTRATION_NAME: [
          { required: true, message: '请输入注册证产品名称', trigger: 'blur' }
        ],
        MANUFACTURING_ENT_NAME: [
          { required: true, message: '请选择注册人或备案人', trigger: 'change' }
        ],
        APPROVAL_NUMBER: [{ required: true, message: '请输入批准文号', trigger: 'blur' }],
        PROD_BIG_CLASS_CODE: [{ required: true, message: '请选择产品类别', trigger: 'change' }],
        MGMT_CAT_CODE: [{ required: true, message: '请选择管理类别', trigger: 'change' }],
        REGULATORY_ID: [{ required: true, message: '请选择监管类别', trigger: 'change' }]
      },
      manufactoryVisible: false,
      manufactoryMode: '0',
      productTypeOptions: [],
      mgmtOptions: [],
      regulatoryOptions: [],
      issuPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    /** 老系统 homehp==stzx：适用范围必填 */
    requireScope() {
      return HOME_HP === 'stzx';
    },
    /** 老系统 homehp==csyy || stzyyy：医用耗材级别必填 */
    requireMedicalGrade() {
      return HOME_HP === 'csyy' || HOME_HP === 'stzyyy';
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = emptyForm();
        this.mgmtOptions = [];
        this.regulatoryOptions = [];
        this.$nextTick(() => this.$refs.form?.clearValidate());
        this.loadProductTypes();
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    chooseManufacture(mode) {
      this.manufactoryMode = mode;
      this.manufactoryVisible = true;
    },
    onManufactureSelect(data) {
      if (!data?.current) {
        this.$message.warning('请至少选择一条数据');
        return;
      }
      this.manufactoryVisible = false;
      if (data.type === '0') {
        this.form.MANUFACTURING_ENT_NAME = data.current.MANUFACTURING_ENT_NAME || '';
        this.form.MANUFACTURING_LICENSE = data.current.MANUFACTURING_LICENSE || '';
      } else {
        this.form.ST_MANUFACTURING_ENT_NAME = data.current.MANUFACTURING_ENT_NAME || '';
      }
    },
    onTradeTypeChange(val) {
      if (val !== '1') {
        this.form.FOREIGN_REGIST_NAME = '';
      }
    },
    async loadProductTypes() {
      try {
        const res = await GetProTypeList();
        const list = res?.result || [];
        this.productTypeOptions = list.map((item) => ({
          value: item.Prod_Big_Class_Code,
          label: item.Prod_Big_Class_Name
        }));
        if (this.productTypeOptions.length) {
          this.form.PROD_BIG_CLASS_CODE = this.productTypeOptions[0].value;
          await this.onProdTypeChange(this.form.PROD_BIG_CLASS_CODE);
        }
      } catch (e) {
        this.$message.error(e.message || '加载产品类别失败');
      }
    },
    async onProdTypeChange(code) {
      this.form.MGMT_CAT_CODE = '';
      this.form.REGULATORY_ID = '';
      this.mgmtOptions = [];
      this.regulatoryOptions = [];
      if (!code) return;
      try {
        const res = await GetMgmtListByProTypeID(code);
        const list = res?.result || [];
        this.mgmtOptions = list.map((item) => ({
          value: item.Mgmt_Cat_Code,
          label: item.Mgmt_Cat_Name
        }));
        if (this.mgmtOptions.length) {
          this.form.MGMT_CAT_CODE = this.mgmtOptions[0].value;
          await this.onMgmtChange(this.form.MGMT_CAT_CODE);
        }
      } catch (e) {
        this.$message.error(e.message || '加载管理类别失败');
      }
    },
    async onMgmtChange(code) {
      this.form.REGULATORY_ID = '';
      this.regulatoryOptions = [];
      if (!code) return;
      try {
        const res = await GetRegulatoryListByMgmnID(code);
        const list = res?.result || [];
        this.regulatoryOptions = list.map((item) => ({
          value: item.Regulatory_id,
          label: `${item.Regulatory_Cat_Code || ''}${item.Regulatory_Cat_Name || ''}`
        }));
        if (this.regulatoryOptions.length) {
          this.form.REGULATORY_ID = this.regulatoryOptions[0].value;
        }
      } catch (e) {
        this.$message.error(e.message || '加载监管类别失败');
      }
    },
    validateHospitalRules() {
      if (this.requireScope) {
        const val = this.form.SCOPE_APPLICATION;
        if (val == null || String(val).trim() === '') {
          this.$message.warning('适用范围不能为空');
          return false;
        }
      }
      if (this.requireMedicalGrade) {
        const val = this.form.PRO_MEDICAL_CONSUMABLE_GRADE;
        if (val == null || String(val).trim() === '') {
          this.$message.warning('医用耗材级别不能为空');
          return false;
        }
      }
      if (this.form.REGULATORY_ID == null || this.form.REGULATORY_ID === '') {
        this.$message.warning('请选择监管类别');
        return false;
      }
      return true;
    },
    onSubmit() {
      this.$refs.form.validate(async (ok) => {
        if (!ok) return;
        if (!this.validateHospitalRules()) return;
        this.loading = true;
        try {
          const payload = {
            PROD_REGISTRATION_NAME: this.form.PROD_REGISTRATION_NAME,
            MANUFACTURING_ENT_NAME: this.form.MANUFACTURING_ENT_NAME,
            ST_MANUFACTURING_ENT_NAME: this.form.ST_MANUFACTURING_ENT_NAME,
            APPROVAL_NUMBER: this.form.APPROVAL_NUMBER,
            REGISTRATION_ISSUING_DATE: this.form.REGISTRATION_ISSUING_DATE || '',
            REGISTRATION_VALID_DATE: this.form.REGISTRATION_VALID_DATE || '',
            REGULATORY_ID: this.form.REGULATORY_ID,
            NOTE_DESCRIPTION: this.form.NOTE_DESCRIPTION,
            LICENCE_FILE_PATH: this.form.LICENCE_FILE_PATH || '无',
            TRADE_TYPE: this.form.TRADE_TYPE,
            FOREIGN_REGIST_NAME: this.form.FOREIGN_REGIST_NAME,
            BIDDING_ENT_NAME: this.form.BIDDING_ENT_NAME,
            BIDDING_ENT_CREDIT_CODE: this.form.BIDDING_ENT_CREDIT_CODE,
            MANUFACTURING_LICENSE: this.form.MANUFACTURING_LICENSE,
            Brand: this.form.Brand,
            MEDICAL_CODE: this.form.MEDICAL_CODE,
            OLD_PROD_REGISTRATION_CODE: this.form.OLD_PROD_REGISTRATION_CODE,
            STRUCTURE_COMPOSITION: this.form.STRUCTURE_COMPOSITION,
            SCOPE_APPLICATION: this.form.SCOPE_APPLICATION,
            PRO_MEDICAL_CONSUMABLE_GRADE: this.form.PRO_MEDICAL_CONSUMABLE_GRADE,
            ORIGIN_TYPE: this.form.ORIGIN_TYPE
          };
          const res = await AddProdInfo(payload);
          const raw = res?.raw ?? res?.msg ?? res?.code;
          const rawStr = raw == null ? '' : String(raw);

          // 老系统可能直接返回 "True" / "0" / "301" 字符串
          if (rawStr === '0' || res?.code === 0) {
            this.$alert('新增失败，原因：该批准文号已存在', '提示', { type: 'error' });
            return;
          }
          if (rawStr === '301' || res?.code == 301 || res?.code === '301') {
            this.$alert('登录失效，请重新登录', '提示', { type: 'error' });
            return;
          }
          if (
            rawStr === 'True' ||
            rawStr === 'true' ||
            res?.code == 200 ||
            res?.code === '200' ||
            rawStr === '200'
          ) {
            this.$message.success('添加成功');
            this.updateVisible(false);
            this.$emit('success');
            return;
          }
          this.$message.error(
            typeof res?.msg === 'string' && res.msg !== rawStr
              ? `添加失败${res.msg}`
              : `添加失败${rawStr || ''}`
          );
        } catch (e) {
          this.$message.error(e.message || '添加失败');
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.add-registration-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}
.category-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.category-tip {
  flex: 1;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1.5;
  padding-top: 4px;
}
</style>
