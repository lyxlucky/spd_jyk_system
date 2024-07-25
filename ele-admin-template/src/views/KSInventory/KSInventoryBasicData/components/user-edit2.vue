<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="修改上下限" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="上限:" prop="CONVERSION_RATIO">
            <el-input type="number" clearable :maxlength="20" v-model="form.up" placeholder="" />
          </el-form-item>
          <el-form-item label="下限:" prop="DEVICE_REMARK">
            <el-input type="number" clearable :maxlength="100" v-model="form.down" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script>
import {
  GetClassificProp_Jy,
  UpdateVarietieBasicJyk,
  UpDownKsQuery,
  UpDownKsQueryNew
} from '@/api/KSInventory/KSInventoryBasicData';

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
      up: null,
      down: null
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      list:[],
      CLASS_NUM: [],
      CLASS_NUMVal: '',
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
  mounted(){
  },
  created() {
    this.$bus.$on(`${this.$route.path}/handleUpdate`,this.handleUpdate)
    // console.log(this.data);
    // this.defaultForm.CONVERSION_RATIO = this.data.CONVERSION_RATIO;
    // this.defaultForm.CLASS_NUM = this.data.CLASS_NUM == null ? "0": this.data.CLASS_NUM;
    // this.defaultForm.DEVICE_REMARK = this.data.DEVICE_REMARK;
  },
  methods: {
    handleUpdate(data){
      this.list = data
    },
    /* 保存编辑 */
    // save() {
    //   const loading = this.$messageLoading('正在保存...');
    //   this.$refs.form.validate((valid) => {
    //     if (!valid) {
    //       return false;
    //     }
    //     var data = [{
    //       dept_two_code: this.data.DEPT_TWO_CODE,
    //       dept_two_name: this.data.DEPT_TWO_NAME,
    //       VarietieCode: this.data.Varietie_Code,
    //       Varietie_Name: this.data.Varietie_Name,
    //       Varietie_Code_New: this.data.Varietie_Code_New,
    //       Coefficient: this.data.Coefficient,
    //       nickname: this.$store.state.user.info.UserName,
    //       up: this.form.up,
    //       down: this.form.down
    //     }];
    //     // this.loading = true;
    //     UpDownKsQuery(data).then((res) => {
    //       loading.close()
    //       this.$emit('done');
    //        this.$emit('update:visible', false);
    //       this.$message.success(res.msg);
    //     }).catch(err=>{
    //       loading.close()
    //       this.$message.error(err);
    //     })
    //   });
    // },

    save() {
      const loading = this.$messageLoading('正在保存...');
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        // var data = [{
        //   dept_two_code: this.list.DEPT_TWO_CODE,
        //   dept_two_name: this.list.DEPT_TWO_NAME,
        //   VarietieCode: this.data.Varietie_Code,
        //   Varietie_Name: this.data.Varietie_Name,
        //   Varietie_Code_New: this.data.Varietie_Code_New,
        //   Coefficient: this.data.Coefficient,
        //   nickname: this.$store.state.user.info.UserName,
        //   up: this.form.up,
        //   down: this.form.down
        // }];

        const props = this.list.map((item) => {
            return {
            dept_two_code: item.DEPT_TWO_CODE,
            dept_two_name: item.DEPT_TWO_NAME,
            VarietieCode: item.Varietie_Code,
            Varietie_Name: item.Varietie_Name,
            Varietie_Code_New: item.Varietie_Code_New,
            Coefficient: item.Coefficient,
            nickname: this.$store.state.user.info.UserName,
            up: item.up,
            down: item.down
          }
        })
        // this.loading = true;
        UpDownKsQueryNew(props).then((res) => {
          loading.close()
          this.$emit('done');
           this.$emit('update:visible', false);
          this.$message.success(res.msg);
        }).catch(err=>{
          loading.close()
          this.$message.error(err);
        })
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
        GetClassificProp_Jy().then((res) => {
          // this.form.CLASS_NUM = res.result;
          this.CLASS_NUM = res.result;
        });
        if (this.data) {
          this.$util.assignObject(this.form, {
            ...this.data
          });
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        this.$refs.form.clearValidate();
        this.form = { ...this.defaultForm };
      }
    },
    data() {
      this.up = this.data.up;
      this.down = this.data.down;
    }
  }
};
</script>
