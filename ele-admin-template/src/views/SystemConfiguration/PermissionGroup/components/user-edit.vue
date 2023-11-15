<!-- 权限组添加弹窗 -->
<template>
  <ele-modal width="450px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="添加权限组" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { sm: 24 } : { span: 24 }">
          <el-form-item label="权限组名称:" prop="Group_Name">
            <el-input clearable :maxlength="20" v-model="form.Group_Name" placeholder="" />
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
export default {
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    const defaultForm = {
      Group_Name: '',
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      // 表单验证规则
      rules: {
        Password: [
          {
            required: true,
            // pattern: /^[\S]{6,18}$/,
            message: '密码必须为6-18位非空白字符',
            trigger: 'blur'
          }
        ],
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
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        const data = { ...this.form };
        console.log(data);
        // const saveOrUpdate = this.isUpdate ? updateUser : addUser;
        // saveOrUpdate(data)
        //   .then((msg) => {
        //     console.log(msg);
        //     this.loading = false;
        //     this.$message.success(msg);
        //     this.updateVisible(false);
        //     this.$emit('done');
        //   })
        //   .catch((e) => {
        //     this.loading = false;
        //     this.$message.error(e.message);
        //   });
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
        if (this.data) {
          console.log(this.data);
          this.$util.assignObject(this.form, {
            ...this.data
          });
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        this.$refs.form.clearValidate();
        // this.form = { ...this.defaultForm };
        this.form.ID = this.defaultForm.ID;
      }
    }
  }
};
</script>
