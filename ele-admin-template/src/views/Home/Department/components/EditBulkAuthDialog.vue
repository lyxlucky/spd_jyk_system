<template>
  <el-dialog custom-class="legacy-layer-dialog" :title="dialogTitle" :visible.sync="visible" width="520px" append-to-body @closed="onClosed">
    <div v-loading="fillLoading" class="dialog-form-wrap" element-loading-text="加载中...">
      <el-form ref="formRef" :model="form" label-width="150px" size="small">
        <el-form-item prop="validDatetime" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>授权到期</template>
          <el-date-picker v-model="form.validDatetime" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="limit" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>授权总量</template>
          <el-input-number v-model="form.limit" :min="0" :controls="false" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="autoApplyRadix" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>PDA自动申领基数</template>
          <el-input-number v-model="form.autoApplyRadix" :min="0" :controls="false" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="IS_NEED_TWO_APP" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>申领二级审批</template>
          <el-select v-model="form.IS_NEED_TWO_APP" style="width: 100%">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="submitLoading" :disabled="fillLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';

export default {
  name: 'EditBulkAuthDialog',
  data() {
    return {
      visible: false,
      fillLoading: false,
      submitLoading: false,
      dialogTitle: '编辑散货信息',
      deptOneCode: '',
      varietieCode: '',
      form: {
        validDatetime: '',
        limit: 0,
        autoApplyRadix: 0,
        IS_NEED_TWO_APP: '0'
      }
    };
  },
  methods: {
    emptyForm() {
      this.form = {
        validDatetime: '',
        limit: 0,
        autoApplyRadix: 0,
        IS_NEED_TWO_APP: '0'
      };
    },
    /** 与旧 Frame/Editprimaryinformation：先弹出 layer，再填充表单；此处用加载态表示填充前 */
    async open(row, deptOneCode) {
      this.deptOneCode = deptOneCode;
      this.varietieCode = row.Varietie_Code;
      this.dialogTitle = `编辑散货信息--${row.Varietie_Name || ''}`;
      this.emptyForm();
      this.visible = true;
      this.fillLoading = true;
      await this.$nextTick();
      try {
        await new Promise((r) => setTimeout(r, 120));
        this.form = {
          validDatetime: (row.Auth_Valid_Date || '').substring(0, 10),
          limit: Number(row.Auth_Bulk_Cargo_Upper_Limit) || 0,
          autoApplyRadix: Number(row.Auto_Apply_Radix) || 0,
          IS_NEED_TWO_APP: String(row.IS_NEED_TWO_APP ?? '0')
        };
      } finally {
        this.fillLoading = false;
        this.$nextTick(() => this.$refs.formRef?.clearValidate());
      }
    },
    onClosed() {
      this.fillLoading = false;
      this.emptyForm();
    },
    submit() {
      this.$refs.formRef.validate(async (ok) => {
        if (!ok) return;
        this.submitLoading = true;
        try {
          const success = await api.modifyDeptOneAuthedVar({
            deptOneCode: this.deptOneCode,
            varietieCode: this.varietieCode,
            ...this.form
          });
          if (success) {
            Message.success('编辑成功');
            this.visible = false;
            this.$emit('saved');
          } else {
            Message.error('保存失败');
          }
        } catch (e) {
          Message.error(e.message || '保存失败');
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.req-star {
  color: #f56c6c;
  margin-right: 2px;
}
.dialog-form-wrap {
  min-height: 140px;
}
.footer-center {
  text-align: center;
}
.footer-center .el-button {
  margin: 0 10px;
}
</style>

<style>
.legacy-layer-dialog .el-dialog__body {
  padding: 12px 16px 8px;
  background: #fafafa;
}
</style>
