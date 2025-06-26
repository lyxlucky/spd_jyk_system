<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <!-- <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 8 }">
        <el-input clearable v-model="BZ" placeholder="请输入申领单备注信息" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 8 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-check" class="ele-btn-icon" @click="CreatApplicationForm()">
            确认创建
          </el-button>
        </div>
      </el-col>
    </el-row> -->
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 8 }">
        <el-input
          size="mini"
          clearable
          v-model="BZ"
          placeholder="请输入申领单备注信息"
        />
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 1, md: 12 } : { span: 8 }">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          class="ele-btn-icon"
          @click="CreatApplicationForm()"
        >
          创建
        </el-button>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <el-input
          size="mini"
          clearable
          v-model="where.PlanNum"
          placeholder="申领单"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker
            size="mini"
            v-model="where.Start"
            type="date"
            style="width: 200px"
            value-format="yyyy-MM-dd"
            placeholder="申领开始日期"
          >
          </el-date-picker>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker
            size="mini"
            v-model="where.End"
            type="date"
            style="width: 200px"
            value-format="yyyy-MM-dd"
            placeholder="申领结束日期"
          >
          </el-date-picker>
        </div>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 5 } : { span: 5 }">
        <el-select size="mini" v-model="where.State" @change="search()">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="新增" value="0"></el-option>
          <el-option label="已提交" value="1"></el-option>
          <el-option label="已审核" value="5"></el-option>
          <el-option label="已审批" value="6"></el-option>
          <el-option label="未审批" value="-6"></el-option>
          <el-option label="未收全" value="3"></el-option>
          <el-option label="已收全" value="4"></el-option>
          <el-option label="强制结束" value="10"></el-option>
        </el-select>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
        <el-input
          size="mini"
          clearable
          v-model="where.SerachName"
          placeholder="请输入品种名称/型号规格/生产企业"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 4 } : { span: 4 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker v-model="where.Start" type="date" style="width:247px" value-format="yyyy-MM-dd" placeholder="申领开始日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker v-model="where.End" type="date" style="width:247px" value-format="yyyy-MM-dd" placeholder="申领结束日期">
          </el-date-picker>
        </div>
      </el-col>
    </el-row> -->
    <!-- <el-row :gutter="10" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 8, md: 8 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="新增" value="0"></el-option>
            <el-option label="已提交" value="1"></el-option>
            <el-option label="已审核" value="5"></el-option>
            <el-option label="已审批" value="6"></el-option>
            <el-option label="未收全" value="3"></el-option>
            <el-option label="已收全" value="4"></el-option>
            <el-option label="强制结束" value="10"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 8 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row> -->
  </el-form>
</template>

<script>
  import {
    CreatList,
    ReturnInitState
  } from '@/api/KSInventory/KSDepartmentalPlan';
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        SerachName: '',
        PlanNum: '',
        Start: '',
        End: '',
        State: '-1',
        isTwoApp: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        BZ: ''
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
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      /* 创建申领单 */
      CreatApplicationForm() {
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
        });
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
      this.where.Start = threeMonthsAgo; // 绑定开始日期
      this.where.End = currentDate; // 绑定结束日期
      //this.dateRange = [startDate, endDate]; // 绑定开始日期和结束日期
    }
  };
</script>
