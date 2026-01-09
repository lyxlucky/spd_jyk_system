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
        v-model="where.varietie"
        placeholder="品种编码、品种全称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.supplier"
        placeholder="请输入供应商搜索"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.manuEntName"
        placeholder="请输入生产企业搜索"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.batch"
        placeholder="请输入生产批号搜索"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.deptTwoName"
        placeholder="请输入科室名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.DEPT_NAME"
        placeholder="计费科室名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.SPDDEPTNAME"
        placeholder="成本科室名称"
      />
    </el-form-item>
    <el-form-item>
      <el-select
        size="mini"
        clearable
        v-model="where.highOrLow"
        placeholder="请选择高低值"
      >
        <el-option label="高值" value="高值"> </el-option>
        <el-option label="低值" value="低值"> </el-option>
        <el-option label="试剂" value="试剂"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.trade"
        placeholder="请输入国产/进口"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.classificName"
        placeholder="请输入分类属性"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.specType"
        placeholder="请输入规格型号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.Patient_Number"
        placeholder="病患号/住院号"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.def"
        placeholder="请输入定数码"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        clearable
        v-model="where.Operate_Person"
        placeholder="消耗人"
      />
    </el-form-item>
    <el-form-item label="消耗时间:">
      <el-date-picker
        size="mini"
        v-model="validDateRange"
        type="daterange"
        style="width: 200px"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="日清时间:" style="display: none">
      <el-date-picker
        v-model="where.dayClearingDate"
        type="date"
        style="width: 150px"
        value-format="yyyy-MM-dd"
        placeholder="日清开始时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="是否按月结日期搜索,默认否">
      <el-switch v-model="where.useMonth"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        size="mini"
        v-model="monthRange"
        type="monthrange"
        style="width: 200px"
        value-format="yyyy-MM"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :disabled="!where.useMonth"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="消耗类型：">
      <el-select size="mini" v-model="where.consumeType">
        <el-option label="全部" value=""></el-option>
        <el-option label="条码扫码消耗" value="0"></el-option>
        <el-option label="RFID读码消耗" value="1"></el-option>
        <el-option label="HIS计费消耗" value="2"></el-option>
        <el-option label="散货申领消耗" value="3"></el-option>
        <el-option label="HIS医嘱计费消耗" value="4"></el-option>
        <el-option label="超时默认消耗" value="5"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否防控物资:">
      <el-select size="mini" v-model="where.isProtect">
        <el-option label="全部" value=""></el-option>
        <el-option label="否" value="0"></el-option>
        <el-option label="是" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="高低值分类下级分类:">
      <el-select size="mini" v-model="where.highOrLowClassTwo">
        <el-option label="全部" value=""></el-option>
        <el-option label="重点治理" value="1"></el-option>
        <el-option label="非重点治理" value="2"></el-option>
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
      <el-button size="mini" icon="el-icon-refresh" class="ele-btn-icon" @click="reset"
        >重置</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-view"
        class="ele-btn-icon"
        size="mini"
        @click="KSDeptConsumpHZTipShow = true"
        >查看汇总</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-view"
        class="ele-btn-icon"
        @click="KSDeptConsumpKSHZTipShow = true"
      >
        科室汇总
      </el-button>
    </el-form-item>
    <KSDeptConsumpHZTip :visible.sync="KSDeptConsumpHZTipShow" :data="where"/>
    <KSDeptConsumpKSHZTip :visible.sync="KSDeptConsumpKSHZTipShow" :data="where"/>
  </el-form>
</template>

<script>
  import KSDeptConsumpHZTip from '@/views/KSInventory/KSDeptConsumption/components/KSDeptConsumpHZTip/index.vue';
  import KSDeptConsumpKSHZTip from '@/views/KSInventory/KSDeptConsumption/components/KSDeptConsumpKSHZTip/index.vue';

  export default {
    components: {
      KSDeptConsumpHZTip,
      KSDeptConsumpKSHZTip,
    },
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
        Operate_Person: '',

    
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
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
      /* 搜索 */
      search() {
        this.$emit('search', { ...this.where });
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
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