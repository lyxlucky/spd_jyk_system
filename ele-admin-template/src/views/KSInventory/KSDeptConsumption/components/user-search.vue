<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.varietie" placeholder="品种编码、品种全称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.supplier" placeholder="请输入供应商搜索" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.manuEntName" placeholder="请输入生产企业搜索" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.batch" placeholder="请输入生产批号搜索" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.deptTwoName" placeholder="请输入科室名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.DEPT_NAME" placeholder="计费科室名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.SPDDEPTNAME" placeholder="成本科室名称" />
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:10px">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.highOrLow" placeholder="请输入高低值" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.trade" placeholder="请输入国产/进口" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.classificName" placeholder="请输入分类属性" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.specType" placeholder="请输入规格型号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Patient_Number" placeholder="病患号/住院号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.def" placeholder="请输入定数码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.Operate_Person" placeholder="消耗人" />
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top:10px">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="消耗时间:">
          <el-date-picker v-model="where.validDateFrom" type="date" style="width:150px" value-format="yyyy-MM-dd" placeholder="消耗开始时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }" style="margin-left:40px">
        <el-date-picker v-model="where.validDateTo" type="date" style="width:150px" value-format="yyyy-MM-dd" placeholder="消耗结束时间">
        </el-date-picker>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }" style="margin-left:25px;display:none">
        <el-form-item label="日清时间:">
          <el-date-picker v-model="where.dayClearingDate" type="date" style="width:150px" value-format="yyyy-MM-dd" placeholder="日清开始时间">
          </el-date-picker>
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="是否按月结日期搜索,默认否" label-width='200px'>
          <el-switch v-model="where.useMonth"></el-switch>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.monthFmt" type="month" style="width:150px" value-format="yyyy-MM" placeholder="开始时间" :disabled="!where.useMonth">
        </el-date-picker>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }" style="margin-left:25px">
        <el-date-picker v-model="where.monthFmt2" type="month" style="width:150px" value-format="yyyy-MM" placeholder="结束时间" :disabled="!where.useMonth">
        </el-date-picker>
      </el-col>
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }" style="margin-left:25px">
        <el-form-item label="PDA扫码时间:" label-width='120px'>
          <el-date-picker v-model="where.KSConsumePDA_startDate" type="date" style="width:150px" value-format="yyyy-MM-dd" placeholder="入库开始时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }" style="margin-left:5px">
        <el-date-picker v-model="where.KSConsumePDA_endDate" type="date" style="width:150px" value-format="yyyy-MM-dd" placeholder="入库结束时间">
        </el-date-picker>
      </el-col> -->

    </el-row>
    <el-row :gutter="10" style="margin-top:10px">

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }" style="margin-left:25px">
        <el-form-item label="消耗类型：" label-width='85px'>
          <el-select v-model="where.consumeType">
            <el-option label="全部" value=""></el-option>
            <el-option label="条码扫码消耗" value="0"></el-option>
            <el-option label="RFID读码消耗" value="1"></el-option>
            <el-option label="HIS计费消耗" value="2"></el-option>
            <el-option label="散货申领消耗" value="3"></el-option>
            <el-option label="HIS医嘱计费消耗" value="4"></el-option>
            <el-option label="超时默认消耗" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="是否防控物资:" label-width='100px'>
          <el-select v-model="where.isProtect">
            <el-option label="全部" value=""></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="高低值分类下级分类:" label-width='150px'>
          <el-select v-model="where.highOrLowClassTwo">
            <el-option label="全部" value=""></el-option>
            <el-option label="重点治理" value="1"></el-option>
            <el-option label="非重点治理" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }" style="margin-left:25px">
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
      Token: '',
      deptTwoJson: [],
      varietie: '',
      supplier: '',
      batch: '',
      deptTwoName: '',
      DEPT_NAME: '',

      manuEntName: '',
      validDateFrom: '',
      validDateTo: '',
      KSConsumePDA_endDate: '',
      KSConsumePDA_startDate: '',

      field: '',
      order: '',
      highOrLow: '',
      trade: '',
      classificName: '',
      consumeType: '',
      specType: '',

      useMonth: false,
      monthFmt: '',
      monthFmt2: '',
      dayClearingDate: '',
      isPdaScan: '',
      isProtect: '',
      highOrLowClassTwo: '',
      hp: '',

      stzx_state: '1',
      stzx_state_gz: '1',
      def: '',
      Patient_Number: '',
      SPDDEPTNAME: '',
      Operate_Person: ''
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
    // var date = new Date(); //获取当前时间国标版
    // var year = date.getFullYear(); // 获取年
    // var month = date.getMonth() + 1; //获取当前月
    // var day = date.getDate(); //日
    // var now_time = year + '-' + month + '-' + day;
    // this.where.EndTime = now_time;
    // //获取7天前的时间
    // var now2 = new Date();
    // var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
    // var year2 = date2.getFullYear();
    // var month2 = date2.getMonth() + 1;
    // var day2 = date2.getDate();
    // var now_time2 = year2 + '-' + month2 + '-' + day2;
    // this.where.StartTime = now_time2;
  }
};
</script>
