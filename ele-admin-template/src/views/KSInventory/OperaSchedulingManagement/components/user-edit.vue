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
              <el-option label="术间1" value="术间1"></el-option>
              <el-option label="术间2" value="术间2"></el-option>
              <el-option label="术间3" value="术间3"></el-option>
              <el-option label="术间4" value="术间4"></el-option>
              <el-option label="术间5" value="术间5"></el-option>
              <el-option label="术间6" value="术间6"></el-option>
              <el-option label="术间7" value="术间7"></el-option>
              <el-option label="术间8" value="术间8"></el-option>
              <el-option label="术间9" value="术间9"></el-option>
              <el-option label="术间10" value="术间10"></el-option>
              <el-option label="术间11" value="术间11"></el-option>
              <el-option label="术间12" value="术间12"></el-option>
              <el-option label="术间13" value="术间13"></el-option>
              <el-option label="术间14" value="术间14"></el-option>
              <el-option label="术间15" value="术间15"></el-option>
              <el-option label="术间16" value="术间16"></el-option>
              <el-option label="术间17" value="术间17"></el-option>
              <el-option label="术间18" value="术间18"></el-option>
              <el-option label="术间19" value="术间19"></el-option>
              <el-option label="术间20" value="术间20"></el-option>
              <el-option label="术间21" value="术间21"></el-option>
              <el-option label="术间22" value="术间22"></el-option>
              <el-option label="术间23" value="术间23"></el-option>
              <el-option label="术间24" value="术间24"></el-option>
              <el-option label="术间25" value="术间25"></el-option>
              <el-option label="术间26" value="术间26"></el-option>
              <el-option label="术间27" value="术间27"></el-option>
              <el-option label="术间28" value="术间28"></el-option>
              <el-option label="术间29" value="术间29"></el-option>
              <el-option label="术间30" value="术间30"></el-option>
              <el-option label="术间31" value="术间31"></el-option>
              <el-option label="术间32" value="术间32"></el-option>
              <el-option label="术间33" value="术间33"></el-option>
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
