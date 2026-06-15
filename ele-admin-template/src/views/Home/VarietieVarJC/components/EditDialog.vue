<template>
  <el-dialog
    title="修改明细"
    :visible="visible"
    width="480px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="集采价格" prop="PRICE">
        <el-input v-model="form.PRICE" type="number" placeholder="集采价格" />
      </el-form-item>
      <el-form-item label="集采开始时间" prop="JC_START_TIME">
        <el-date-picker
          v-model="form.JC_START_TIME"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="集采结束时间" prop="JC_END_TIME">
        <el-date-picker
          v-model="form.JC_END_TIME"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.REMARK" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="STATE">
        <el-select v-model="form.STATE" style="width: 100%">
          <el-option label="启用" value="1" />
          <el-option label="冻结" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="small" :loading="submitting" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upVarJCData } from '@/api/Home/VarietieVarJC';
import { date10 } from '../utils';

export default {
  name: 'VarietieVarJCEditDialog',
  props: {
    visible: { type: Boolean, default: false },
    data: { type: Object, default: null }
  },
  data() {
    return {
      submitting: false,
      form: {
        ID: '',
        PRICE: '',
        JC_START_TIME: '',
        JC_END_TIME: '',
        REMARK: '',
        STATE: '1'
      },
      rules: {
        PRICE: [{ required: true, message: '请输入集采价格', trigger: 'blur' }],
        STATE: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    };
  },
  watch: {
    visible(val) {
      if (val && this.data) {
        this.form = {
          ID: this.data.ID,
          PRICE: this.data.JC_PRICE ?? this.data.PRICE ?? '',
          JC_START_TIME: date10(this.data.JC_START_TIME),
          JC_END_TIME: date10(this.data.JC_END_TIME),
          REMARK: this.data.REMARK ?? '',
          STATE: String(this.data.STATE ?? '1')
        };
        this.$nextTick(() => this.$refs.form?.clearValidate());
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitting = true;
        try {
          const res = await upVarJCData(this.form);
          this.$message.success(res.msg || '修改成功');
          this.updateVisible(false);
          this.$emit('done');
        } catch (e) {
          this.$message.error(e.message || '修改失败');
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>
