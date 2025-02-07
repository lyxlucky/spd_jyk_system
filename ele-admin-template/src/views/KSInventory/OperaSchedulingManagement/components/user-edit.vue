<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="创建申请单" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="备注:" prop="REMARK">
            <el-input size="mini" clearable :maxlength="20" v-model="form.REMARK" placeholder="" />
          </el-form-item>
          <el-form-item label="术间:" prop="SURGICAL_ROOM">
            <el-input size="mini" clearable :maxlength="100" v-model="form.SURGICAL_ROOM" placeholder="" />
          </el-form-item>
          <el-form-item label="院区:" prop="SURGICAL_PLACE">
            <el-input size="mini" clearable :maxlength="100" v-model="form.SURGICAL_PLACE" placeholder="" />
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
import { AddNaxtDayApplyPlanMain } from '@/api/KSInventory/OperaSchedulingManagement';

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
      REMARK: '',
      SURGICAL_ROOM: '',
      SURGICAL_PLACE: ''
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      list: [],
      CLASS_NUM: [],
      CLASS_NUMVal: '',
      // 表单验证规则
      rules: {
        CONVERSION_RATIO: []
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
  created() {
    this.$bus.$on(`${this.$route.path}/handleUpdate`, this.handleUpdate);
  },
  methods: {
    handleUpdate(data) {
      this.list = data;
    },
    save() {
      // const loading = this.$messageLoading('正在保存...');
      // this.$refs.form.validate((valid) => {
      //   if (!valid) {
      //     return false;
      //   }
      var data = this.form;
      data.CREATE_MAN = this.$store.state.user.info.Nickname;
      console.log(data);

     
      // // this.loading = true;
      AddNaxtDayApplyPlanMain(data).then((res) => {
        // loading.close()
        this.$emit('done');
        this.$emit('update:visible', false);
        this.$message.success(res.msg);
      }).catch(err=>{
        // loading.close()
        this.$message.error(err);
      })
      // });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
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
