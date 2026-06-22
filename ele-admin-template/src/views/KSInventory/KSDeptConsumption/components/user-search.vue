<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="品种">
          <el-input
            v-model="where.varietie"
            clearable
            placeholder="编码/全称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.supplier"
            clearable
            placeholder="供应商"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="where.manuEntName"
            clearable
            placeholder="生产企业"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="批号">
          <el-input
            v-model="where.batch"
            clearable
            placeholder="生产批号"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="科室">
          <el-input
            v-model="where.deptTwoName"
            clearable
            placeholder="科室名称"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="计费科室">
          <el-input
            v-model="where.DEPT_NAME"
            clearable
            placeholder="计费科室"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="成本科室">
          <el-input
            v-model="where.SPDDEPTNAME"
            clearable
            placeholder="成本科室"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="高低值">
          <el-select
            v-model="where.highOrLow"
            clearable
            placeholder="高低值"
            style="width: 90px"
          >
            <el-option label="高值" value="高值" />
            <el-option label="低值" value="低值" />
            <el-option label="试剂" value="试剂" />
          </el-select>
        </el-form-item>
        <el-form-item label="国产/进口">
          <el-input
            v-model="where.trade"
            clearable
            placeholder="国产/进口"
            style="width: 90px"
          />
        </el-form-item>
        <el-form-item label="分类属性">
          <el-input
            v-model="where.classificName"
            clearable
            placeholder="分类属性"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.specType"
            clearable
            placeholder="规格型号"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="病患号">
          <el-input
            v-model="where.Patient_Number"
            clearable
            placeholder="病患号/住院号"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="定数码">
          <el-input
            v-model="where.def"
            clearable
            placeholder="定数码"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="消耗人">
          <el-input
            v-model="where.Operate_Person"
            clearable
            placeholder="消耗人"
            style="width: 90px"
          />
        </el-form-item>
        <br />
        <el-form-item label="消耗时间">
          <el-date-picker
            v-model="validDateRange"
            type="daterange"
            style="width: 220px"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
          />
        </el-form-item>
        <el-form-item label="日清时间:" style="display: none">
          <el-date-picker
            v-model="where.dayClearingDate"
            type="date"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            placeholder="日清开始时间"
          />
        </el-form-item>
        <el-form-item label="按月结">
          <el-switch v-model="where.useMonth" />
        </el-form-item>
        <el-form-item label="月结月份">
          <el-date-picker
            v-model="monthRange"
            type="monthrange"
            style="width: 200px"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            :disabled="!where.useMonth"
          />
        </el-form-item>
        <el-form-item label="消耗类型">
          <el-select v-model="where.consumeType" style="width: 130px">
            <el-option label="全部" value="" />
            <el-option label="条码扫码消耗" value="0" />
            <el-option label="RFID读码消耗" value="1" />
            <el-option label="HIS计费消耗" value="2" />
            <el-option label="散货申领消耗" value="3" />
            <el-option label="HIS医嘱计费消耗" value="4" />
            <el-option label="超时默认消耗" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="防控物资">
          <el-select v-model="where.isProtect" style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="高低值下级">
          <el-select v-model="where.highOrLowClassTwo" style="width: 110px">
            <el-option label="全部" value="" />
            <el-option label="重点治理" value="1" />
            <el-option label="非重点治理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-view" @click="KSDeptConsumpHZTipShow = true">查看汇总</el-button>
          <el-button type="primary" icon="el-icon-view" @click="KSDeptConsumpKSHZTipShow = true">科室汇总</el-button>
        </el-form-item>
      </el-form>
    </div>

    <KSDeptConsumpHZTip :visible.sync="KSDeptConsumpHZTipShow" :data="where" />
    <KSDeptConsumpKSHZTip :visible.sync="KSDeptConsumpKSHZTipShow" :data="where" />
  </div>
</template>

<script>
import KSDeptConsumpHZTip from '@/views/KSInventory/KSDeptConsumption/components/KSDeptConsumpHZTip/index.vue';
import KSDeptConsumpKSHZTip from '@/views/KSInventory/KSDeptConsumption/components/KSDeptConsumpKSHZTip/index.vue';

const defaultWhere = () => ({
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
});

export default {
  components: {
    KSDeptConsumpHZTip,
    KSDeptConsumpKSHZTip
  },
  data() {
    return {
      where: defaultWhere(),
      KSDeptConsumpHZTipShow: false,
      KSDeptConsumpKSHZTipShow: false,
      validDateRange: [],
      monthRange: []
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  watch: {
    validDateRange(val) {
      if (val && val.length === 2) {
        this.where.validDateFrom = val[0];
        this.where.validDateTo = val[1];
      } else {
        this.where.validDateFrom = '';
        this.where.validDateTo = '';
      }
    },
    monthRange(val) {
      if (val && val.length === 2) {
        this.where.monthFmt = val[0];
        this.where.monthFmt2 = val[1];
      } else {
        this.where.monthFmt = '';
        this.where.monthFmt2 = '';
      }
    }
  },
  methods: {
    search() {
      this.$emit('search', { ...this.where });
    },
    reset() {
      this.where = defaultWhere();
      this.validDateRange = [];
      this.monthRange = [];
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

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 2px;
}
</style>
