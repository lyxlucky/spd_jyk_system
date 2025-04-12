<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" :title="Title" @update:visible="updateVisible">
    <el-form ref="form" :model="form" label-width="130px">
      <el-row :gutter="18">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="收货单号">
            <el-input ref="input" v-model="form.deliveryNoteNumber"></el-input>
          </el-form-item>
          <el-form-item label="住院号">
            <el-input ref="input" v-model="form.hospitalizationNumber"></el-input>
          </el-form-item>
          <el-form-item label="病患">
            <el-input ref="input" v-model="form.patient"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="BindInstrumentFun()">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script>
import { UpdatePatientInfo } from '@/api/HeelBlockConsumables/PlatformConsume';

export default {
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    rowData: Object
  },
  data() {
    return {
      // 表单数据
      form: {
        deliveryNoteNumber: null,
        hospitalizationNumber: null,
        patient: null
      },
      Title: '',
      // 表单验证规则
      rules: {
        CONVERSION_RATIO: [
          {
            message: '请输入换算比',
            trigger: 'blur'
          }
        ],
        CLASS_NUM: [
          {
            required: true,
            message: '请选择类别',
            trigger: 'blur'
          }
        ],
        DEVICE_REMARK: [
          {
            message: '请选择仪器备注',
            trigger: 'blur'
          }
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  mounted() {},
  created() {},
  methods: {
    /* 保存编辑 */
    save() {
      console.log(this.form);
      // this.$refs.form.validate((valid) => {
      //   if (!valid) {
      //     return false;
      //   }
      //   // this.loading = true;
      //   this.form.Varietie_Code = this.data.Varietie_Code;
      //   UpdateVarietieBasicJyk(this.form).then((res) => {
      //     this.$emit('done');
      //     this.updateVisible(false);
      //     this.$message.success(res.data.msg);
      //   });
      // });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$refs.form.clearValidate();
      this.$emit('update:visible', value);
    },

    BindInstrumentFun() {
      let loading = this.$messageLoading('修改中...');

      UpdatePatientInfo(this.form)
        .then((res) => {
          loading.close();
          if (res.code == 200) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
            this.$emit('search');
          }
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        })
        .finally((res) => {
          this.$emit('search');
          this.$nextTick(() => {
            this.$refs.input.focus();
          });
        });
    }
  },
  watch: {
    data() {
      this.Title = `${this.data.INSTRUMENT_CODE} / ${this.data.INSTRUMENT_NAME}`;
    },
    visible(visible) {
      this.form = {
        deliveryNoteNumber: this.rowData.Delivery_Note_Number,
        hospitalizationNumber: this.rowData.Hospitalization_Number,
        patient: this.rowData.Patient
      };

      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  }
};
</script>
<style scoped>
</style>
