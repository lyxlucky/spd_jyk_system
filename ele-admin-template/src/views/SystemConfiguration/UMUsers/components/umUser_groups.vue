<!-- 密码编辑弹窗 -->
<template>
  <ele-modal width="400px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" title="分配权限组" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { sm: 24 } : { span: 24 }">
          <el-form-item label="权限组:" prop="Group_Name">
            <el-select v-model="form.Group_Name">
              <el-option v-for="(item) in GroupList" :key="item.ID" :label="item.Group_Name" :value="item.ID"></el-option>
            </el-select>
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
  getGroupsList,
  correlationUser_Groups
} from '@/api/SystemConfiguration/UMUsers';
export default {
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    const defaultForm = {
      Group_Name: null
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      // 表单验证规则
      rules: {
        Group_Name: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      GroupList: null
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
      const loading = this.$messageLoading('提交中...');
      var data = {
        userID: this.data.ID,
        groupID: this.form.Group_Name
      };
      correlationUser_Groups(data)
        .then((res) => {
          loading.close();
          this.$message.success('分配成功');
          this.$emit('reload');
          this.$emit('update:visible', false);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err.message);
        });
      // const data = { ...this.form };
      // this.$refs.form.validate((valid) => {
      //   if (!valid) {
      //     return false;
      //   }
      //   this.loading = true;
      //   const data = { ...this.form };
      //   console.log(data);
      //   // const saveOrUpdate = this.isUpdate ? updateUser : addUser;
      //   // saveOrUpdate(data)
      //   //   .then((msg) => {
      //   //     console.log(msg);
      //   //     this.loading = false;
      //   //     this.$message.success(msg);
      //   //     this.updateVisible(false);
      //   //     this.$emit('done');
      //   //   })
      //   //   .catch((e) => {
      //   //     this.loading = false;
      //   //     this.$message.error(e.message);
      //   //   });
      // });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  },
  watch: {
    data() {
      // console.log(this.data)
      // console.log(this.data.ID)
      this.form.Group_Name = this.data.Group_ID;
      // console.log(this.form.Group_Name);
    },
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
        // this.form = { ...this.defaultForm };
        this.form.ID = this.defaultForm.ID;
        console.log(this.defaultForm);
      }
    }
  },
  created() {
    getGroupsList().then((res) => {
      // console.log(res);
      this.GroupList = res.result;
    });
  }
};
</script>
