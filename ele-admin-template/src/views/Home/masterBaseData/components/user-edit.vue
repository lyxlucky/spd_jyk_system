<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="修改品种" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="备注:" prop="WJ_SP_MARK">
            <el-input size="mini" clearable v-model="form.YB_SP_MARK" placeholder="备注" />
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
import { ApproveYBSpdMainsjLinesIface } from '@/api/Home/masterBaseData';
export default {
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Array
  },
  data() {
    const defaultForm = {
      YB_SP_MARK: ''
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
  created() {},
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        // this.loading = true;
        // console.log(this.data);
        console.log(this.form);
        this.form.YB_SP_MAN = this.$store.state.user.info.Nickname;
        const loading = this.$messageLoading('请求中..');
        ApproveYBSpdMainsjLinesIface(this.form)
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
          var HEADER_IFACE_IDStr = '';
          for (let i = 0; i < this.data.length; i++) {
            HEADER_IFACE_IDStr += this.data[i].HEADER_IFACE_ID + ',';
          }
          HEADER_IFACE_IDStr = HEADER_IFACE_IDStr.substring(
            0,
            HEADER_IFACE_IDStr.length - 1
          );
          this.form = {
            ...this.defaultForm,
            HEADER_IFACE_ID: HEADER_IFACE_IDStr
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
