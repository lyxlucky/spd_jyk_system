<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" :title="Title" @update:visible="updateVisible">
    <el-form ref="form" :model="form" label-width="130px">
      <el-row :gutter="18">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="扫码绑定定数包：" prop="bindDef">
            <el-input ref="input" v-model="form.bindDef" @change="BindInstrument()"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="1">强制绑定</el-radio>
              <el-radio label="0">普通绑定</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <!-- <el-button type="primary" @click="BindInstrument()">
        保存
      </el-button> -->
    </template>
  </ele-modal>
</template>

<script>
import { bindUseMachin } from '@/api/KSInventory/LrJykInstrument';

export default {
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: {
        bindDef: null,
        type: '0'
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
  created() {
    console.log(this.form);
    // this.defaultForm.CONVERSION_RATIO = this.data.CONVERSION_RATIO;
    // this.defaultForm.CLASS_NUM = this.data.CLASS_NUM == null ? "0": this.data.CLASS_NUM;
    // this.defaultForm.DEVICE_REMARK = this.data.DEVICE_REMARK;
  },
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

    BindInstrument() {
      let loading = this.$messageLoading('绑定中...');
      let data = {
        BIND_MACHINE: this.data.INSTRUMENT_CODE,
        bindDef: this.form.bindDef,
        type: this.form.type
      };
      bindUseMachin(data)
        .then((res) => {
          loading.close();
          this.form = {
            bindDef: '',
            type: '0'
          };
          if (res.code == 200) {
            // this.$message.success('绑定成功');
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
            this.$emit('search');
          }
        })
        .catch((err) => {
          loading.close();
          this.form = {
            bindDef: '',
            type: '0'
          };
          this.$message.error(err);
        })
        .finally((res) => {
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
        bindDef: '',
        type: '0'
      };
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  }
};
</script>
