<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="450px" :visible="visible" :append-to-body="true" :close-on-click-modal="true" custom-class="ele-dialog-form" :title="'散货出库'" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { sm: 24 } : { span: 24 }">
          <el-form-item label="" prop="" style="display:none">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.VARIETIE_CODE" placeholder="" />
          </el-form-item>
          <el-form-item label="品种名称:" prop="">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.VARIETIE_NAME" placeholder="" />
          </el-form-item>
          <el-form-item label="品种编码:" prop="">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.VARIETIE_CODE_NEW" placeholder="" />
          </el-form-item>
          <el-form-item label="批号:" prop="">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.BATCH" placeholder="" />
          </el-form-item>
          <el-form-item label="有效期:" prop="">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.BATCH_VALIDITY_PERIOD" placeholder="" />
          </el-form-item>
          <el-form-item label="库存数量:" prop="">
            <el-input clearable :maxlength="20" :disabled="true" v-model="form.COUNT" placeholder="库存数量" />
          </el-form-item>
          <el-form-item label="出库数量:" prop="qty">
            <el-input clearable :maxlength="20" v-model="form.qty" placeholder="出库数量" />
          </el-form-item>
          <el-form-item label="备注:" prop="">
            <el-input clearable :maxlength="20" v-model="form.mark" placeholder="备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        确定
      </el-button>
    </template>
  </ele-modal>
</template>

<script>
import { saveJykOutInfo } from '@/api/KSInventory/KSInventoryQuery';

export default {
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    bindMachine: Object
  },
  data() {
    const defaultForm = {
      VARIETIE_NAME: '',
      VARIETIE_CODE_NEW: '',
      VARIETIE_CODE: '',
      BATCH: '',
      DEPT_TWO_CODE: '',
      BATCH_VALIDITY_PERIOD: null,
      COUNT: '',
      qty: '',
      mark: ''
    };
    return {
      defaultForm,
      // 表单数据
      form: { ...defaultForm },
      // 表单验证规则
      rules: {
        qty: [
          {
            required: true,
            message: '请输入出库数量',
            trigger: 'blur'
          },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
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
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        const data = {
          ...this.form,
          bindMachine: this.bindMachine
        };
        saveJykOutInfo(data)
          .then((msg) => {
            this.loading = false;
            this.$message.success(msg.msg);
            this.updateVisible(false);
            this.$emit('done');
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
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
    }
  },
  created() {}
};
</script>
