<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    inline
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.VARIETIE_CODE_NEW"
        placeholder="品种编码"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.PROD_REGISTRATION_NAME"
        placeholder="品种名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.GG"
        placeholder="规格型号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.APPROVAL_NUMBER"
        placeholder="注册证号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.SUP_NAME"
        placeholder="供应商"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.MANUFACTURING_ENT_NAME"
        placeholder="生产企业"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.USE_DEPT"
        placeholder="使用科室"
      />
    </el-form-item>
    <el-form-item style="width: 280px">
      <el-date-picker
        size="mini"
        v-model="where.importTimeRange"
        type="daterange"
        style="width: 280px"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="导入开始日期"
        end-placeholder="导入结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.CONTRACT_CODE"
        placeholder="合同编码"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.CREATE_BATCH"
        placeholder="合同开始"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        style="width: 180px"
        clearable
        v-model="where.CREATE_BATCH2"
        placeholder="合同结束"
      />
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        style="width: 180px"
        v-model="where.IS_HAVE"
        @change="search()"
        placeholder="在用状态"
      >
        <el-option label="在用状态" value="">全部</el-option>
        <el-option label="启用" value="1"></el-option>
        <el-option label="已申请" value="2"></el-option>
        <el-option label="未使用" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-search"
        class="ele-btn-icon"
        @click="search"
      >
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" class="ele-btn-icon" icon="el-icon-refresh" @click="reset">重置</el-button>
    </el-form-item>
    <el-form-item v-permission="'zhongbiao-export'">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-download"
        class="ele-btn-icon"
        @click="exportData"
      >
        导出
      </el-button>
      </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-upload2"
        @click="ApplyToVarietyDataLzhLook()"
      >
        申请至在用目录
      </el-button>
      </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="danger"
        class="ele-btn-icon"
        icon="el-icon-download"
        @click="CalApplyToVarietyDataLzhLook()"
      >
        取消申请至在用目录
      </el-button>
      </el-form-item>
  </el-form>
</template>

<script>
  import { CreateTempletDeta } from '@/api/KSInventory/BidVarInfoDept';
  export default {
    props: ['selection'],
    data() {
      // 默认表单数据
      const defaultWhere = {
        VARIETIE_CODE_NEW: '',
        PROD_REGISTRATION_NAME: '',
        GG: '',
        APPROVAL_NUMBER: '',
        SUP_NAME: '',
        MANUFACTURING_ENT_NAME: '',
        USE_DEPT: '',
        IS_ENABLE: '',
        IS_HAVE: '',
        IS_USE: '',
        IS_IN_COUNTRY_IMPORT: '',
        CONTRACT_CODE: '',
        CREATE_BATCH: '',
        CREATE_BATCH2: '',
        importTimeRange: [],
        HIGH_OR_LOW_CLASS: '',
        HIGH_CLASS_XH: '',
        IS_PRICE: '',
        KC: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere }
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', { ...this.where });
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      exportData() {
        this.$emit('exportData', this.where);
      },
      ApplyToVarietyDataLzhLook() {
        if (this.selection.length == 0) {
          this.$message.warning('请选择数据');
          return;
        }
        const loading = this.$messageLoading('保存中。。。');
        var data = this.selection;
        data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        data.state = 3;
        CreateTempletDeta(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.search();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      CalApplyToVarietyDataLzhLook() {
        if (this.selection.length == 0) {
          this.$message.warning('请选择数据');
          return;
        }
        const loading = this.$messageLoading('保存中。。。');
        var data = this.selection;
        data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        data.state = 0;
        CreateTempletDeta(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.search();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      }
    },
    created() {
      // 获取各种类型当前时间
      var date = new Date(); //获取当前时间国标版
      var year = date.getFullYear(); // 获取年
      var month = date.getMonth() + 1; //获取当前月
      var day = date.getDate(); //日
      var now_time = year + '-' + month + '-' + day;
      this.where.EndTime = now_time;

      //获取7天前的时间
      var now2 = new Date();
      var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
      var year2 = date2.getFullYear();
      var month2 = date2.getMonth() + 1;
      var day2 = date2.getDate();
      var now_time2 = year2 + '-' + month2 + '-' + day2;
      this.where.StartTime = now_time2;
    }
  };
</script>
