<!-- 用户编辑弹窗 -->
<template>
  <ele-modal width="600px" :visible="visible" :append-to-body="true" :close-on-click-modal="true"
    custom-class="ele-dialog-form" title="创建申请单" @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="备注:" prop="REMARK">
            <el-input size="mini" clearable :maxlength="20" v-model="form.REMARK" placeholder="" />
          </el-form-item>
          <el-form-item label="术间:" prop="SURGICAL_ROOM">
            <!-- <el-input size="mini" clearable type="number" :maxlength="100" v-model="form.SURGICAL_ROOM" placeholder="" /> -->
            <el-select size="mini" v-model="form.SURGICAL_ROOM">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
              <el-option label="6" value="6"></el-option>
              <el-option label="7" value="7"></el-option>
              <el-option label="8" value="8"></el-option>
              <el-option label="9" value="9"></el-option>
              <el-option label="10" value="10"></el-option>
              <el-option label="11" value="11"></el-option>
              <el-option label="12" value="12"></el-option>
              <el-option label="13" value="13"></el-option>
              <el-option label="14" value="314"></el-option>
              <el-option label="15" value="15"></el-option>
              <el-option label="16" value="16"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="院区:" prop="SURGICAL_PLACE">
            <el-input size="mini" clearable :maxlength="100" v-model="form.SURGICAL_PLACE" placeholder="" />
          </el-form-item> -->
          <el-form-item label="院区:" prop="SURGICAL_PLACE">
            <el-select v-model="form.SURGICAL_PLACE" placeholder="请选择院区">
              <el-option v-for="(obj) in STORAGEF" :key="obj.ID" :label="obj.NAME" :value="obj.NAME"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型:" prop="YY_TYPE">
            <el-select v-model="form.YY_TYPE" placeholder="请选择类型">
              <el-option label="预约" value="0"></el-option>
              <el-option label="术中" value="1"></el-option>
            </el-select>
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
import { getSTORAGE } from '@/api/Task/NewCentralinventoryPackage/index';
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
      SURGICAL_ROOM: '1',
      SURGICAL_PLACE: '',
      YY_TYPE: '0',
    };
    return {
      // defaultForm,
      // 表单数据
      form: { ...defaultForm },
      list: [],
      CLASS_NUM: [],
      CLASS_NUMVal: '',
      STORAGEF: null,
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
    this.form = {};
    this.defaultForm = {};
    this.$bus.$on(`${this.$route.path}/handleUpdate`, this.handleUpdate);
    this.getSTORAGEFun();
  },
  methods: {
    handleUpdate(data) {
      this.list = data;
    },
    save() {
      const loading = this.$messageLoading('正在保存...');
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        var data = this.form;
        console.log(data);
        data.CREATE_MAN = this.$store.state.user.info.Nickname;
        console.log(this.$store.state);
        // // this.loading = true;
        AddNaxtDayApplyPlanMain(data)
          .then((res) => {
            loading.close();
            this.defaultForm = {};
            this.$emit('done');
            this.$emit('update:visible', false);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    getSTORAGEFun() {
      getSTORAGE().then((res) => {
        this.STORAGEF = res.result;
      });
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
