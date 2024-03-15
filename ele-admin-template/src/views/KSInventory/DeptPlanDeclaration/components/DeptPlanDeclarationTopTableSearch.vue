<!-- 搜索表单 -->

<template>
  <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <el-form-item label="">
          <el-date-picker v-model="where.topTableSearchTime" value-format="yyyy-MM-dd" type="daterange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>

      <!-- 请勿删除此行代码 -->
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }" style="padding-left: 150px;">
        <div class="ele-form-actions">
        </div>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 4 }" style="padding-left: 40px;">
        <div class="ele-form-actions">
          <el-button size="medium " type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="medium " type="primary" class="ele-btn-icon" @click="createItem">
            创建
          </el-button>

          <el-button size="medium " type="danger" icon="el-icon-delete" @click="deleteItem" :disabled="isDisable"
            class="ele-btn-icon">
            剔除
          </el-button>

          <el-button size="medium " type="primary" @click="submitItem" :disabled="isDisable" class="ele-btn-icon">
            提交
          </el-button>
        </div>
      </el-col>

      <el-col style="" v-bind="styleResponsive ? { lg: 8, md: 4 } : { span: 4 }">
        <el-form-item label="状态：">
          <el-select v-model="where.status" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="新增" value="0"></el-option>
            <el-option label="已提交" value="1"></el-option>
            <el-option label="已审核" value="2"></el-option>
            <el-option label="已审批" value="3"></el-option>
            <el-option label="审核不通过" value="4"></el-option>
            <el-option label="审批不通过" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 创建科室计划申报对话框 -->
    <el-dialog title="科室申报"  center :visible.sync="where.createDeptPlandialogVisible" width="20%"
      :before-close="where.createDeptPlanHandleClose">
      <div>
        <el-form :model="where.createDeptPlanForm" :rules="where.createDeptRules" ref="createDeptRuleRef"
          label-width="100px" class="createDeptPlanRuleForm">
          <el-form-item label="申报类型" prop="TYPE">
            <el-select v-model="where.createDeptPlanForm.TYPE">
              <el-option label="正常申报" value="1"></el-option>
              <el-option label="补充申报" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 317px;" label="申报月份：" prop="PLAN_MONTH_TIME">
            <el-input v-model="where.createDeptPlanForm.PLAN_MONTH_TIME" placeholder="yyyy-MM"></el-input>
          </el-form-item>

          <el-form-item style="width: 317px;" label="备注：" prop="REMARK">
            <el-input v-model="where.createDeptPlanForm.REMARK" placeholder="请输入备注"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitDeptPlanForm()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
export default {
  props: ["selection"],
  data() {
    // 默认表单数据
    const defaultWhere = {
      //查询时间
      topTableSearchTime: [],
      //查询状态
      status: '',
      //新增科室申报对话框
      createDeptPlandialogVisible: false,
      //新增科室申报对话框表单数据
      createDeptPlanForm: {
        TYPE: '1',
        PLAN_MONTH_TIME: '',
        REMARK: '',
      },
      //新增科室申报对话框表单验证规则
      createDeptRules: {
        TYPE: [{ required: true, message: '请选择申报类型', trigger: 'change' }],
        PLAN_MONTH_TIME: [
          { required: true, message: '请输入申报月份', trigger: 'blur' },
          { pattern: /^[0-9]{4}-[0-9]{2}$/, message: '请输入正确的申报月份', trigger: 'blur' },
        ],
        REMARK: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    isDisable() {
      return this.selection.length === 0;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    submitDeptPlanForm() {
      this.$emit('submitDeptPlanForm', this.where);
    },
    createDeptPlanHandleClose() {
      this.where.createDeptPlandialogVisible = false;
    },
    deleteItem() {
      this.$emit('deleteItem', this.selection);
    },
    submitItem() {
      this.$emit('submitItem', this.selection);
    },
    createItem() {
      this.where.createDeptPlanForm = {
        TYPE: '1',
        PLAN_MONTH_TIME: '',
        REMARK: '',
      };
      this.$nextTick(() => {
        this.$refs.createDeptRuleRef.clearValidate();
      });
      this.where.createDeptPlandialogVisible = true;
    }
  },
  created() {
  }
};
</script>
