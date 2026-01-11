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
        clearable
        v-model="where.varietieCode"
        placeholder="品种编码/名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.Specification_Or_Type"
        placeholder="规格型号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.SCQY"
        placeholder="生产企业"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.ZCZ"
        placeholder="注册证"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.SUP"
        placeholder="供应商"
      />
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
      <el-button
        size="mini"
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-download"
        @click="ApplyToBidVarInfoDept()"
      >
        申请至科室目录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { addOneDeptAuthCommit } from '@/api/KSInventory/VarietyDataLzhLook';
  export default {
    props: ['selection'],
    data() {
      // 默认表单数据
      const defaultWhere = {
        varietieCode: '',
        Specification_Or_Type: '',
        SCQY: '',
        ZCZ: '',
        SUP: ''
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
      ApplyToBidVarInfoDept() {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择数据');
          return;
        }
        const loading = this.$messageLoading('正在提交申请，请稍后...');
        var data = this.selection;
        data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        data.type = 1;
        addOneDeptAuthCommit(data)
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
