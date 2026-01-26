<!-- 搜索表单 -->
<template>
  <el-form
    inline
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        size="mini"
        clearable
        style="width: 200px"
        v-model="BZ"
        placeholder="请输入申领单备注信息"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-check"
        class="ele-btn-icon"
        @click="CreatApplicationForm()"
      >
        创建
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        style="width: 160px"
        v-model="where.PlanNum"
        placeholder="申领单"
      />
    </el-form-item>
    <el-form-item>
      <el-date-picker
        size="mini"
        v-model="dateRange"
        type="daterange"
        style="width: 200px"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="申领开始"
        end-placeholder="申领结束"
        @change="onDateRangeChange"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-select size="mini" style="width: 140px" v-model="where.State" @change="search()">
        <el-option label="状态" value="-1">全部</el-option>
        <el-option label="新增" value="0"></el-option>
        <el-option label="已提交" value="1"></el-option>
        <el-option label="已审核" value="5"></el-option>
        <el-option label="已审批" value="6"></el-option>
        <el-option label="未审批" value="-6"></el-option>
        <el-option label="未收全" value="3"></el-option>
        <el-option label="已收全" value="4"></el-option>
        <el-option label="强制结束" value="10"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="isBDRM">
      <el-select size="mini" style="width: 120px" v-model="where.props" @change="search()">
        <el-option label="高低值" value="">全部</el-option>
        <el-option label="低值" value="0"></el-option>
        <el-option label="高值" value="1"></el-option>
        <el-option label="试剂" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        style="width: 200px"
        v-model="where.SerachName"
        placeholder="请输入品名/型号规格/生产企业"
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
    </el-form-item>
    <el-form-item>
      <el-button size="mini" icon="el-icon-refresh" class="ele-btn-icon" @click="reset">
        重置
      </el-button>
    </el-form-item>

    <!-- 项目类型选择对话框 -->
    <ProjectTypeDialog
      :visible="showProjectTypeDialog"
      :bz="BZ"
      @update:visible="showProjectTypeDialog = $event"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </el-form>
</template>

<script>
  import { HOME_HP } from '@/config/setting';
  import {
    CreatList,
    ReturnInitState,
    getResearchProjects
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import ProjectTypeDialog from './ProjectTypeDialog.vue';
  export default {
    components: {
      ProjectTypeDialog
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        SerachName: '',
        PlanNum: '',
        Start: '',
        End: '',
        State: '-1',
        props: '',
        isTwoApp: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        BZ: '',
        showProjectTypeDialog: false,
        dateRange: []
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isBDRM() {
        return this.$HOME_HP == 'bdrm';
      },
      isSzse() {
        console.log(this.$HOME_HP);
        return this.$HOME_HP?.startsWith('se2');
      }
    },
    methods: {
      /* 日期范围变化处理 */
      onDateRangeChange() {
        if (this.dateRange && this.dateRange.length === 2) {
          this.where.Start = this.dateRange[0];
          this.where.End = this.dateRange[1];
        }
      },
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      /* 创建申领单 */
      CreatApplicationForm() {
        if (this.isBDRM || this.isSzse) {
          // 如果是bdrm环境，显示项目类型选择对话框
          this.showProjectTypeDialog = true;
        } else {
          // 非bdrm环境，直接创建
          this.createApplicationDirectly();
        }
      },

      /* 直接创建申领单（非bdrm环境） */
      createApplicationDirectly() {
        const loading = this.$loading({ lock: true });
        var data = {
          BZ: this.BZ,
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          State: '2',
          Operater: this.$store.state.user.info.UserName
        };
        CreatList(data).then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        }).catch((error) => {
          loading.close();
          this.$message.error(error.message || '创建失败');
        });
      },

      /* 处理对话框确认 */
      handleDialogConfirm(createData) {
        const loading = this.$loading({ lock: true });
        CreatList(createData).then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.showProjectTypeDialog = false;
          this.$emit('search', this.where);
        }).catch((error) => {
          loading.close();
          this.$message.error(error.message || '创建失败');
        });
      },

      /* 处理对话框取消 */
      handleDialogCancel() {
        this.showProjectTypeDialog = false;
      }
    },

    created() {},
    mounted() {
      // 页面加载时，计算近三个月的日期范围
      //请使用moment.js处理日期 update by liao
      // zou 结束时间多加一天
      const currentDate = this.$moment().add(1, 'days').format('YYYY-MM-DD');
      const threeMonthsAgo = this.$moment()
        .subtract(3, 'months')
        .format('YYYY-MM-DD');
      this.dateRange = [threeMonthsAgo, currentDate]; // 绑定日期范围
      this.where.Start = threeMonthsAgo; // 绑定开始日期
      this.where.End = currentDate; // 绑定结束日期
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep .el-form-item {
    margin-bottom: 4px;
  }
</style>
