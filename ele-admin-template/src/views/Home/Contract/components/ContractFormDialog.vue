<template>
  <el-dialog
    :title="isEdit ? '编辑合同' : '创建合同'"
    :visible.sync="dialogVisible"
    width="900px"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
    @closed="resetForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="small">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="供应商名称">
            <span>{{ supplierName || '—' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营/生产许可证有效期">
            <span>{{ licenseDate || '—' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编码" prop="contract_code">
            <el-input v-model="form.contract_code" :disabled="isEdit" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="招标编码" prop="bid_number">
            <el-input v-model="form.bid_number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同起始日期" prop="contract_start_time">
            <el-date-picker v-model="form.contract_start_time" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contract_name">
            <el-input v-model="form.contract_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同结束日期" prop="contract_end_time">
            <el-date-picker v-model="form.contract_end_time" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="contract_state">
            <el-select v-model="form.contract_state" style="width: 100%">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托人">
            <el-input v-model="form.consigner" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托人身份证">
            <el-input v-model="form.consigner_id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="质量保证协议书有效期" prop="qlty_assurance_prot_valid_date">
            <el-date-picker v-model="form.qlty_assurance_prot_valid_date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托书有效期" prop="power_of_attorney_valid_date">
            <el-date-picker v-model="form.power_of_attorney_valid_date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同类型" prop="contract_Type">
            <el-select v-model="form.contract_Type" style="width: 100%">
              <el-option label="中标合同" value="1" />
              <el-option label="临采合同" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号">
            <el-input v-model="form.Hosp_Contract_Code" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同金额">
            <el-input v-model="form.LIMIT_SUM_PRICE" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getContractDetails, insertContract, isContractCode, updateContract } from '@/api/Home/Contract';
import { formatContractDate } from '../utils';

export default {
  name: 'ContractFormDialog',
  props: {
    visible: Boolean,
    mode: { type: String, default: 'add' },
    supplier: Object,
    contractCode: [String, Number]
  },
  data() {
    return {
      loading: false,
      form: this.emptyForm(),
      rules: {
        contract_code: [{ required: true, message: '请输入合同编码', trigger: 'blur' }],
        bid_number: [{ required: true, message: '请输入招标编码', trigger: 'blur' }],
        contract_name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        contract_start_time: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
        contract_end_time: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        contract_state: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
        qlty_assurance_prot_valid_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        power_of_attorney_valid_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        contract_Type: [{ required: true, message: '请选择合同类型', trigger: 'change' }]
      }
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    isEdit() {
      return this.mode === 'edit';
    },
    supplierName() {
      return this.supplier?.Supplier_Name || '';
    },
    licenseDate() {
      const d = this.supplier?.Roduction_License_Valid_Date;
      return d ? formatContractDate(d) : '';
    }
  },
  methods: {
    emptyForm() {
      return {
        contract_code: '',
        contract_name: '',
        bid_number: '',
        contract_start_time: '',
        contract_end_time: '',
        contract_state: '1',
        contract_Type: '1',
        qlty_assurance_prot_valid_date: '',
        power_of_attorney_valid_date: '',
        consigner: '',
        consigner_id: '',
        Hosp_Contract_Code: '',
        LIMIT_SUM_PRICE: ''
      };
    },
    resetForm() {
      this.form = this.emptyForm();
      this.$refs.form?.clearValidate();
    },
    async onOpen() {
      if (this.isEdit && this.contractCode) {
        try {
          const res = await getContractDetails(this.contractCode);
          const raw = (res.result || [])[0] || {};
          this.form = {
            contract_code: raw.contract_code || '',
            contract_name: raw.contract_name || '',
            bid_number: raw.bid_number || '',
            contract_start_time: formatContractDate(raw.contract_start_time),
            contract_end_time: formatContractDate(raw.contract_end_time),
            contract_state: String(raw.contract_state ?? '1'),
            contract_Type: String(raw.contract_Type ?? '1'),
            qlty_assurance_prot_valid_date: formatContractDate(raw.qlty_assurance_prot_valid_date),
            power_of_attorney_valid_date: formatContractDate(raw.power_of_attorney_valid_date),
            consigner: raw.consigner || '',
            consigner_id: raw.consigner_id || '',
            Hosp_Contract_Code: raw.Hosp_Contract_Code || '',
            LIMIT_SUM_PRICE: raw.LIMIT_SUM_PRICE ?? ''
          };
        } catch (e) {
          this.$message.error(e.message || '加载合同失败');
        }
      }
    },
    buildPayload() {
      const now = new Date().toLocaleString();
      const stateText = this.form.contract_state === '1' ? '是' : '否';
      return {
        Contract_Code: this.form.contract_code,
        Contract_Name: this.form.contract_name,
        Supplier_Code: this.supplier?.Supplier_Code,
        Contract_Start_Time: this.form.contract_start_time,
        Contract_End_Time: this.form.contract_end_time,
        Contract_State: stateText,
        contract_Type: this.form.contract_Type,
        Qlty_Assurance_Prot_Valid_Date: this.form.qlty_assurance_prot_valid_date,
        Power_Of_Attorney_Valid_Date: this.form.power_of_attorney_valid_date,
        Consigner: this.form.consigner,
        Consigner_Id: this.form.consigner_id,
        Create_Time: now,
        Last_Update_Time: now,
        Bid_Number: this.form.bid_number,
        Hosp_Contract_Code: this.form.Hosp_Contract_Code,
        LIMIT_SUM_PRICE: this.form.LIMIT_SUM_PRICE
      };
    },
    onSubmit() {
      this.$refs.form.validate(async (ok) => {
        if (!ok) return;
        if (!this.supplier?.Supplier_Code) {
          this.$message.warning('请先选择供应商');
          return;
        }
        this.loading = true;
        try {
          const payload = this.buildPayload();
          if (!this.isEdit) {
            const exists = await isContractCode(payload.Contract_Code);
            if (Number(exists) > 0) {
              this.$message.warning('已经存在相同的合同编码，请重新输入');
              return;
            }
            await insertContract(payload);
            try {
              await this.$confirm('创建成功，是否需要进行授权操作？', '提示', {
                confirmButtonText: '去授权',
                cancelButtonText: '稍后',
                type: 'success'
              });
              this.dialogVisible = false;
              this.$emit('done', { action: 'auth', contractCode: payload.Contract_Code, contractName: payload.Contract_Name });
            } catch {
              this.dialogVisible = false;
              this.$emit('done', { action: 'refresh' });
            }
          } else {
            await updateContract(payload);
            this.$message.success('编辑成功');
            this.dialogVisible = false;
            this.$emit('done', { action: 'refresh' });
          }
        } catch (e) {
          this.$message.error(e.message || '保存失败');
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
