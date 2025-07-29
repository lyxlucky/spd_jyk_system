<template>
  <el-dialog
    title="审批确认"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="form"
      size="mini"
      :model="formData"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="医生工号" prop="doctorCode">
        <el-input
          v-model="formData.doctorCode"
          placeholder="请输入医生工号"
          clearable
          @keyup.enter.native="handleConfirm"
        ></el-input>
      </el-form-item>
      <el-form-item label="护士工号" prop="nurseCode">
        <el-input
          v-model="formData.nurseCode"
          placeholder="请输入护士工号"
          clearable
          @keyup.enter.native="handleConfirm"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确定
        </el-button>
      </el-form-item>
    </el-form>

    <!-- <div slot="footer" class="dialog-footer">
      
    </div> -->
  </el-dialog>
</template>

<script>
  export default {
    name: 'ApprovalDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        loading: false,
        formData: {
          doctorCode: '',
          nurseCode: ''
        },
        rules: {
          doctorCode: [
            { required: true, message: '请输入医生工号', trigger: 'blur' }
          ],
          nurseCode: [
            { required: true, message: '请输入护士工号', trigger: 'blur' }
          ]
        }
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) {
          this.resetForm();
        }
      },
      dialogVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    methods: {
      handleConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('confirm', {
              doctorCode: this.formData.doctorCode,
              nurseCode: this.formData.nurseCode
            });
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      handleCancel() {
        this.$emit('cancel');
        this.dialogVisible = false;
      },
      handleClose() {
        this.handleCancel();
      },
      resetForm() {
        this.formData = {
          doctorCode: '',
          nurseCode: ''
        };
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      },
      setLoading(loading) {
        this.loading = loading;
      }
    }
  };
</script>

<style scoped>
  .dialog-footer {
    text-align: right;
  }
</style>
