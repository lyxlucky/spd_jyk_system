<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="修改品种" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="编码类型:" prop="HIS_CODE_TYPE">
            <el-input size="mini" clearable v-model="form.HIS_CODE_TYPE" placeholder="编码类型" />
          </el-form-item>

          <el-form-item label="项目名称:" prop="HIS_ITEM_DESCRIPTION">
            <el-input size="mini" clearable v-model="form.HIS_ITEM_DESCRIPTION" placeholder="项目名称" />
          </el-form-item>

          <el-form-item label="使用范围:" prop="HIS_SYFW">
            <el-input size="mini" clearable v-model="form.HIS_SYFW" placeholder="使用范围" />
          </el-form-item>

          <el-form-item label="启用标志:" prop="isDb">
            <el-select size="mini" style="width: 100%" filterable v-model="form.HIS_ISGZ_DZ" placeholder="请选择是否启用">
              <el-option label="是" value="1">
              </el-option>
              <el-option label="否" value="0">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="医保编码:" prop="HIS_HC_NUMBER">
            <el-input size="mini" clearable v-model="form.HIS_HC_NUMBER" placeholder="医保编码" />
          </el-form-item>

          <el-form-item label="内部码:" prop="HIS_SYFW">
            <el-input size="mini" clearable v-model="form.HIS_NBM" placeholder="内部码" />
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button size="mini" icon="el-icon-close" @click="updateVisible(false)">取消</el-button>
      <el-button size="mini" icon="el-icon-check" type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script>
import { UpSpdHisMainsjLinesIface } from '@/api/Home/BJRMPriceAudit';
export default {
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    const defaultForm = {
      HIS_CODE_TYPE: '',
      HIS_ITEM_DESCRIPTION: '',
      HIS_SYFW: '',
      HIS_ISGZ_DZ: '',
      HIS_HC_NUMBER: '',
      HIS_NBM: ''
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      options: [],
      // 表单验证规则
      rules: {
        // CONVERSION_RATIO: [
        //   {
        //     message: '请输入理论人次',
        //     trigger: 'blur'
        //   }
        // ],
        // CLASS_NUM: [
        //   {
        //     required: true,
        //     message: '请选择类别',
        //     trigger: 'blur'
        //   }
        // ],
        // DEVICE_REMARK: [
        //   {
        //     message: '请选择仪器备注',
        //     trigger: 'blur'
        //   }
        // ]
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
  created() {
    this.getJykDevices();
    // console.log(this.data);
    // this.defaultForm.CONVERSION_RATIO = this.data?.JYK_ZHB;
    // this.defaultForm.CLASS_NUM = this.data?.CLASS_NUM == null ? "0": this.data?.CLASS_NUM;
    // this.defaultForm.DEVICE_REMARK = this.data?.JYK_YQM;
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        // this.loading = true;
        this.form.ID = this.data.ID;
        this.form.HEADER_IFACE_ID = this.data.HEADER_IFACE_ID;

        const loading = this.$messageLoading('请求中..');
        UpSpdHisMainsjLinesIface(this.form)
          .then((res) => {
            this.$emit('done');
            this.updateVisible(false);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err.msg);
          })
          .finally(() => {
            loading.close();
          });
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        // GetClassificProp_Jy().then((res) => {
        //   // this.form.CLASS_NUM = res.result;
        //   this.CLASS_NUM = res.result;
        // });
        if (this.data) {
          // this.$util.assignObject(this.form, {
          //   ...this.data
          // });
          this.form = {
            ...this.defaultForm,
            HIS_CODE_TYPE: this.data.HIS_CODE_TYPE,
            HIS_ITEM_DESCRIPTION: this.data.HIS_ITEM_DESCRIPTION,
            HIS_SYFW: this.data.HIS_SYFW,
            HIS_ISGZ_DZ: this.data.HIS_ISGZ_DZ,
            HIS_HC_NUMBER: this.data.HIS_HC_NUMBER,
            HIS_NBM: this.data.HIS_NBM
          };
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        this.$refs.form.clearValidate();
        this.form = { ...this.defaultForm };
      }
    }
  }
};
</script>
