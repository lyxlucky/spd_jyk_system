<template>
  <div class="search-container">
    <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="15">
        <el-select v-model="where.ksConsumeDetailCreateType" size="mini" placeholder="跟台-全部" clearable style="width: 140px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="跟台-全部" value=""></el-option>
          <el-option label="跟台-是" value="1"></el-option>
          <el-option label="跟台-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeQxfqx" size="mini" placeholder="器械-全部" clearable style="width: 140px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="器械-全部" value=""></el-option>
          <el-option label="器械-是" value="1"></el-option>
          <el-option label="器械-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeSearch10" size="mini" placeholder="消耗类型-全部" clearable style="width: 110px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="消耗类型-全部" value=""></el-option>
          <el-option label="PDA扫码消耗" value="0"></el-option>
          <el-option label="RFID读码消耗" value="1"></el-option>
          <el-option label="HIS计费消耗" value="2"></el-option>
          <el-option label="散货申领消耗" value="3"></el-option>
          <el-option label="HIS医嘱计费消耗" value="4"></el-option>
          <el-option label="超时默认消耗" value="5"></el-option>
          <el-option label="读码消耗" value="6"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeSearch7" size="mini" placeholder="高低值-全部" clearable style="width: 110px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="高低值-全部" value=""></el-option>
          <el-option label="高值" value="高值"></el-option>
          <el-option label="低值" value="低值"></el-option>
          <el-option label="试剂" value="试剂"></el-option>
          <el-option label="消毒" value="消毒"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsProtect" size="mini" placeholder="防控物资-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="防控物资-全部" value=""></el-option>
          <el-option label="防控物资-是" value="1"></el-option>
          <el-option label="防控物资-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.highOrLowClassTwo1" size="mini" placeholder="重点治理-全部" clearable style="width: 120px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="重点治理-全部" value=""></el-option>
          <el-option label="重点治理" value="1"></el-option>
          <el-option label="非重点治理" value="2"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsSpecialAircraft" size="mini" placeholder="专机专用-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="专机专用-全部" value=""></el-option>
          <el-option label="专机专用-是" value="1"></el-option>
          <el-option label="专机专用-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeContractType" size="mini" placeholder="合同-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="合同-全部" value=""></el-option>
          <el-option label="合同-中标" value="1"></el-option>
          <el-option label="合同-临采" value="2"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsPdaScan" size="mini" placeholder="二级库-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="二级库-全部" value=""></el-option>
          <el-option label="二级库-已出库" value="1"></el-option>
          <el-option label="二级库-未出库" value="2"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeGoodsQty" size="mini" placeholder="数量-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="数量-全部" value=""></el-option>
          <el-option label="数量-大于0" value="1"></el-option>
          <el-option label="数量-小于0" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsHisPriceDeff" size="mini" placeholder="his价格-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top; display: none;">
          <el-option label="his价格-全部" value=""></el-option>
          <el-option label="his价格-不一致" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsSendYg" size="mini" placeholder="发送阳光-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="发送阳光-全部" value=""></el-option>
          <el-option label="已发送全部" value="1"></el-option>
          <el-option label="已发送,成功" value="2"></el-option>
          <el-option label="已发送,不成功" value="3"></el-option>
          <el-option label="未发送" value="0"></el-option>
        </el-select>
      </el-row>
      <el-row :gutter="15">
        <el-select v-model="where.ksConsumeIsJc" size="mini" placeholder="集采-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="集采-全部" value=""></el-option>
          <el-option label="集采-是" value="1"></el-option>
          <el-option label="集采-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeSearchUdi" size="mini" placeholder="发送UDI-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="发送UDI-全部" value=""></el-option>
          <el-option label="发送UDI-否" value="0"></el-option>
          <el-option label="发送UDI-是" value="1"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeIsJf" size="mini" placeholder="是否计费-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="是否计费-全部" value=""></el-option>
          <el-option label="是否计费-是" value="1"></el-option>
          <el-option label="是否计费-否" value="0"></el-option>
        </el-select>
        <el-select v-model="where.ksConsumeHaveYgcode" size="mini" placeholder="阳光产品码-全部" clearable style="width: 100px; margin-left: 10px; margin-right: 10px; vertical-align: top;">
          <el-option label="阳光产品码-全部" value=""></el-option>
          <el-option label="阳光产品码-有" value="1"></el-option>
          <el-option label="阳光产品码-无" value="0"></el-option>
        </el-select>
        <el-date-picker
          v-model="where.KSConsumeBD_dayClearingDate"
          type="date"
          placeholder="日清时间: yyyy-MM-dd"
          style="width: 200px; margin-left: 10px; margin-right: 10px; vertical-align: top;"
        ></el-date-picker>
      </el-row>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否包含中心医院库存:
            <el-select v-model="where.stzx_state" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="包含" value="1"></el-option>
              <el-option label="不包含" value="0"></el-option>
            </el-select>
          </label>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否包含中心医院高值库存:
            <el-select v-model="where.stzx_gz_state" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="包含" value="1"></el-option>
              <el-option label="不包含" value="0"></el-option>
            </el-select>
          </label>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否骨科集采:
            <el-select v-model="where.stzx_gkjc_state" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="包含" value="1"></el-option>
              <el-option label="不包含" value="0"></el-option>
            </el-select>
          </label>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            size="mini"
            range-separator="至"
            start-placeholder="消耗开始日期"
            end-placeholder="消耗结束日期"
            v-model="dateRange"
            @change="handleDateRangeChange"
          ></el-date-picker>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            <el-checkbox v-model="where.KSConsume_cb" size="mini">是否按月结日期搜索,默认否</el-checkbox>
            <el-date-picker
              v-model="where.KSConsume_monthRange"
              type="monthrange"
              placeholder="请选择月结日期范围"
              :disabled="!where.KSConsume_cb"
              style="width: 140px;"
            ></el-date-picker>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search1" placeholder="品种编码/全称/产品码" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_zcz" placeholder="注册证" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search2" placeholder="请输入供应商搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search6" placeholder="请输入生产企业搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search3" placeholder="请输入生产批号搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search4" placeholder="请输入科室名称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsumeBD_search_j4" placeholder="计费科室名称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsumeBD_search_cost_dept" placeholder="成本科室名称" />
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search5" placeholder="请输入定数码" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search8" placeholder="请输入国产/进口" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search9" placeholder="请输入分类属性" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_search11" placeholder="请输入规格型号" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_YgOrder" placeholder="阳光订单号" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_SOURCE_FROM" placeholder="来源" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_Patient_Number" placeholder="病患号/住院号" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_Supply_Price" placeholder="单价" />
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_CONFIRM_STAFF" placeholder="消耗人" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.KSConsume_REGULATORY_CAT_NAME" placeholder="监管类别名称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <div class="ele-form-actions">
            <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
              查询
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 默认表单数据
      defaultWhere: {
        start_time: '',
        end_time: '',
        ksConsumeDetailCreateType: '',
        ksConsumeQxfqx: '',
        ksConsumeSearch10: '',
        ksConsumeSearch7: '',
        ksConsumeIsProtect: '',
        highOrLowClassTwo1: '',
        ksConsumeIsSpecialAircraft: '',
        ksConsumeContractType: '',
        ksConsumeIsPdaScan: '',
        ksConsumeGoodsQty: '',
        ksConsumeIsHisPriceDeff: '',
        ksConsumeIsSendYg: '',
        ksConsumeIsJc: '',
        ksConsumeSearchUdi: '',
        ksConsumeIsJf: '',
        ksConsumeHaveYgcode: '',
        KSConsumeBD_dayClearingDate: '',
        stzx_state: '-1',
        stzx_gz_state: '-1',
        stzx_gkjc_state: '',
        KSConsume_cb: false,
        KSConsume_monthRange: null,
        KSConsume_search1: '',
        KSConsume_zcz: '',
        KSConsume_search2: '',
        KSConsume_search6: '',
        KSConsume_search3: '',
        KSConsume_search4: '',
        KSConsumeBD_search_j4: '',
        KSConsumeBD_search_cost_dept: '',
        KSConsume_search5: '',
        KSConsume_search8: '',
        KSConsume_search9: '',
        KSConsume_search11: '',
        KSConsume_YgOrder: '',
        KSConsume_SOURCE_FROM: '',
        KSConsume_Patient_Number: '',
        KSConsume_Supply_Price: '',
        KSConsume_CONFIRM_STAFF: '',
        KSConsume_REGULATORY_CAT_NAME: ''
      },
      // 表单数据
      where: {},
      // 日期范围
      dateRange: []
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  created() {
    // 初始化 where 对象
    this.where = { ...this.defaultWhere };
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.dateRange = [];
      this.search();
    },
    /* 标记处理 */
    markAsProcessed() {
      this.$emit('markAsProcessed', this.where);
    },
    /* 导出数据 */
    exportData() {
      this.$emit('exportData', this.where);
    },
    // 处理日期范围选择
    handleDateRangeChange(range) {
      if (range && range.length === 2) {
        this.where.start_time = range[0];
        this.where.end_time = range[1];
      } else {
        this.where.start_time = '';
        this.where.end_time = '';
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  margin-bottom: 15px;
}

.el-label--inline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  color: #303133;
}

.el-select--mini.el-select {
  min-width: 140px;
}

.el-row {
  margin-bottom: 10px; /* 设置行高间隔为 10px，可按需调整 */
}

@media (max-width: 768px) {
  .el-col {
    margin-bottom: 8px;
  }
  .el-label--inline {
    gap: 4px;
    font-size: 12px;
  }
}
</style>    