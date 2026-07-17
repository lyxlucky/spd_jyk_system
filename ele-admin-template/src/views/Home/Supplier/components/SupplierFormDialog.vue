<template>
  <el-dialog
    :title="isEdit ? '编辑供应商' : '添加供应商'"
    :visible.sync="dialogVisible"
    width="960px"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
    @closed="onClosed"
  >
    <el-form
      ref="form"
      v-loading="loadingDetail"
      :model="form"
      :rules="rules"
      label-width="200px"
      size="mini"
      class="supplier-form"
    >
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="Supplier_Name">
            <el-input v-model="form.Supplier_Name" type="textarea" :rows="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商地址">
            <el-input v-model="form.Licence_File_Full_Name" type="textarea" :rows="2" placeholder="空则提交为「无」" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="社会统一信用代码" prop="SOCIAL_CREDIT_CODE">
            <el-input v-model="form.SOCIAL_CREDIT_CODE" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业电话">
            <el-input v-model="form.Contact_Phone2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商性质" prop="Supplier_Nature">
            <el-select v-model="form.Supplier_Nature" style="width: 100%">
              <el-option label="经营型" value="0" />
              <el-option label="生产型" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="档案位置">
            <el-input v-model="form.File_Location" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="一类许可证有效期">
            <el-date-picker v-model="form.RODUCTION_CLASS_1_VALID_DATE" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员委托书有效期">
            <el-date-picker v-model="form.WTS_VALID_DATE" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二类许可证有效期">
            <el-date-picker v-model="form.Roduction_class_2_Valid_Date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员姓名" :prop="isEdit ? undefined : 'Contact_Person'">
            <el-input v-model="form.Contact_Person" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="三类许可证有效期">
            <el-date-picker v-model="form.Roduction_class_3_Valid_Date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员身份证">
            <el-input v-model="form.YWY_PEO_ID" />
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item label="第三类经营许可证号">
            <el-input v-model="form.thirdLicenseNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体外诊断试剂证期">
            <el-date-picker v-model="form.DR_VALID_DATE" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员电话">
            <el-input v-model="form.Contact_Phone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="财务科供应商编码">
            <el-input v-model="form.code_charging" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="阳光平台编码">
            <el-input v-model="form.YG_SUP_CODE" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冷链供应条件" prop="Cold_Chain_Apparatus_Supply">
            <el-select v-model="form.Cold_Chain_Apparatus_Supply" style="width: 100%">
              <el-option label="不具备" value="1" />
              <el-option label="具备" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="Enable">
            <el-select v-model="form.Enable" style="width: 100%">
              <el-option label="启用" value="1" />
              <el-option label="不启用" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit" :span="12">
          <el-form-item label="经营/生产许可证有效期">
            <el-date-picker v-model="form.Roduction_License_Valid_Date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照有效期" prop="Business_License_Valid_Date">
            <el-date-picker v-model="form.Business_License_Valid_Date" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item label="缺项备注">
            <el-input v-model="form.sup_QXBZ" />
          </el-form-item>
        </el-col>
        <el-col v-if="showSupCodeTwo" :span="12">
          <el-form-item label="hrp供应商编码2">
            <el-input v-model="form.SUP_CODE_TWO" />
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item label="最大开票金额">
            <el-input v-model="form.INVOICE_LIMIT_PRICE" />
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="12">
          <el-form-item label="品牌备注" prop="Brand_BZ">
            <el-input v-model="form.Brand_BZ" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        v-if="!readonly"
        type="primary"
        :loading="saving"
        @click="onSubmit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplierDetail, insertSupplier, updateSupplier } from '@/api/Home/Supplier';
import {
  buildSupplierSubmitPayload,
  createEmptySupplierForm,
  detailToSupplierForm,
  validateSupplierForm
} from '../utils';

export default {
  name: 'SupplierFormDialog',
  props: {
    visible: Boolean,
    /** add | edit */
    mode: { type: String, default: 'add' },
    supplierCode: [String, Number],
    /** 对齐旧页：有「禁用供应商编辑」时编辑只读 */
    readonly: Boolean,
    showSupCodeTwo: Boolean
  },
  data() {
    return {
      form: createEmptySupplierForm(),
      loadingDetail: false,
      saving: false
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
    rules() {
      const base = {
        Supplier_Name: [{ required: true, message: '请填写供应商名称', trigger: 'blur' }],
        SOCIAL_CREDIT_CODE: [{ required: true, message: '社会统一信用代码不能为空', trigger: 'blur' }],
        Business_License_Valid_Date: [
          { required: true, message: '请填写营业执照有效期', trigger: 'change' }
        ],
        Supplier_Nature: [{ required: true, message: '请选择', trigger: 'change' }],
        Cold_Chain_Apparatus_Supply: [{ required: true, message: '请选择', trigger: 'change' }],
        Enable: [{ required: true, message: '请选择', trigger: 'change' }]
      };
      if (!this.isEdit) {
        base.Contact_Person = [{ required: true, message: '请填写业务员姓名', trigger: 'blur' }];
      } else {
        base.Brand_BZ = [{ required: true, message: '请填写品牌备注', trigger: 'blur' }];
      }
      return base;
    }
  },
  methods: {
    async onOpen() {
      this.form = createEmptySupplierForm();
      this.$nextTick(() => this.$refs.form?.clearValidate());
      if (!this.isEdit || !this.supplierCode) return;
      this.loadingDetail = true;
      try {
        const res = await getSupplierDetail(this.supplierCode);
        this.form = detailToSupplierForm(res.result || {});
      } catch (e) {
        this.$message.error(e.message || '加载供应商失败');
      } finally {
        this.loadingDetail = false;
      }
    },
    onClosed() {
      this.saving = false;
      this.loadingDetail = false;
    },
    onSubmit() {
      const tip = validateSupplierForm(this.form, { isEdit: this.isEdit });
      if (tip) {
        this.$message.warning(tip);
        return;
      }
      this.$refs.form.validate(async (ok) => {
        if (!ok) return;
        this.saving = true;
        try {
          const payload = buildSupplierSubmitPayload(this.form, {
            isEdit: this.isEdit,
            supplierCode: this.supplierCode
          });
          if (this.isEdit) {
            await updateSupplier(payload);
            this.$message.success('修改成功');
          } else {
            await insertSupplier(payload);
            this.$message.success('添加成功');
          }
          this.dialogVisible = false;
          this.$emit('done');
        } catch (e) {
          this.$message.error(e.message || '保存失败');
        } finally {
          this.saving = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.supplier-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
