<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.SearchVarietie" style="width:250px" placeholder="品种编码/品种名称/规格" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Specifications" placeholder="请输入规格型号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Batch" placeholder="请输入生产批号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.OutType" placeholder="请输入入库类型" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.BUSINESS_BILL" placeholder="请输入库单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Production" placeholder="请输入生产企业" />
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:10px">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="入库时间:">
          <el-date-picker v-model="where.StartTime" type="date" style="width:200px" value-format="yyyy-MM-dd" placeholder="入库开始时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }" style="margin-left:10px">
        <el-date-picker v-model="where.EndTime" type="date" style="width:200px" value-format="yyyy-MM-dd" placeholder="入库结束时间">
        </el-date-picker>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
          <!-- <el-button type="primary" class="ele-btn-icon" @click="exportData" v-loading.fullscreen.lock="fullscreenLoading">
            导出
          </el-button> -->
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      SearchVarietie: '',
      Supplier: '',
      Batch: '',
      OutType: '',
      BUSINESS_BILL: '',
      Specifications: '',
      StartTime: null,
      EndTime: null,
      Production: '',
      field: 'RECEIVING_TIME',
      order: 'desc',
      IS_CHARGE: '-1',
      HIGH_OR_LOW_CLASS: '-1',
      IS_BIDDING: '-1',
      SPECIAL_PURCHASE: '-1',
      ONEOFF_STERILIZATION_PACKAGING: '-1',
      STORAGE_TYPE: '-1',
      IS_EMBEDDED: '-1',
      IS_SERIAL_NUMBER: '-1',
      IS_INTERVENED: '-1',
      IS_PROTECT: '-1',
      HIGH_OR_LOW_CLASS_TWO: '',
      IS_EQUIPMENT_CHANGE: '',
      SUPPLIER_NAME: '',
      DeptCode: null
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
    this.where.StartTime = year2 + '-' + month2 + '-' + day2;
  },
  mounted() {
    var Dept_Two_CodeStr = '';
    var userDeptList = this.$store.state.user.info.userDept;
    for (let i = 0; i < userDeptList.length; i++) {
      Dept_Two_CodeStr = Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
    }
    var data = {
      StartTime: this.where.StartTime,
      EndTime: this.where.EndTime,
      DeptCode: Dept_Two_CodeStr
    };
    // this.$emit('search', data);
  }
};
</script>
