<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <!-- <el-col v-bind="styleResponsive ? { lg: 3, md: 5 } : { span: 5 }">
        <el-select size="mini" v-model="where.State" @change="search()">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="新增" value="0"></el-option>
          <el-option label="已提交" value="1"></el-option>
          <el-option label="已审核" value="5"></el-option>
          <el-option label="已审批" value="6"></el-option>
          <el-option label="未收全" value="3"></el-option>
          <el-option label="已收全" value="4"></el-option>
          <el-option label="强制结束" value="10"></el-option>
        </el-select>
      </el-col> -->

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
        <el-input size="mini" clearable v-model="where.NAXT_DAT_PLAN_NUM" placeholder="申请单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 8 }">
        <el-input size="mini" clearable v-model="where.CREATE_MAN" placeholder="申请人" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 4 } : { span: 4 }">
        <el-date-picker v-model="where.date" type="daterange" value-format="yyyy-MM-dd" size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col style="margin-left: 15px;" v-bind="styleResponsive ? { lg: 9, md: 4 } : { span: 4 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openUserEdit()">
            创建申请单
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openSurgicalScheduling()">
            根据手术排期创建
          </el-button>

          <el-popconfirm class="ele-action" title="确定提交申请？" @confirm="upNaxtDayApplyPlanMainByState()">
            <template v-slot:reference>
              <el-button size="mini" type="primary" class="ele-btn-icon" :disabled="IS_disabled">
                提交申请
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="IS_disabled">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-col>

    </el-row>
    <SurgicalScheduling :visible.sync="showEdit" :SurgicalSchedulingSearch="KSDepartmentalPlanDataSearch" @reload="search" />
  </el-form>
</template>

<script>
import SurgicalScheduling from '@/views/KSInventory/OperaSchedulingManagement/components/SurgicalScheduling/index.vue';
export default {
  props: ['KSDepartmentalPlanData'],
  components: {
    SurgicalScheduling
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      NAXT_DAT_PLAN_NUM: '',
      CREATE_MAN: '',
      date: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      IS_disabled: true
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
    openUserEdit() {
      this.$emit('openUserEdit', this.where);
    },
    openSurgicalScheduling() {
      this.showEdit = true;
    },
    upNaxtDayApplyPlanMainByState() {
      this.$emit('upNaxtDayApplyPlanMainByState');
    },
    removeBatch() {
      this.$emit('removeBatch');
    }
  },
  watch: {
    KSDepartmentalPlanData() {
      console.log(this.KSDepartmentalPlanData);
      if (this.KSDepartmentalPlanData.STATE == 0) {
        this.IS_disabled = false;
      } else {
        this.IS_disabled = true;
      }
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
