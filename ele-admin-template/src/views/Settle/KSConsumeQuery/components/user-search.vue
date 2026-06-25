<template>
  <div class="spd-panel__body ks-consume-query-search">
    <el-form
      size="mini"
      label-width="0"
      class="ele-form-search consume-query-form"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <div class="filter-row selects">
        <el-form-item>
          <el-select v-model="where.ksConsumeDetailCreateType" clearable placeholder="跟台-全部" style="width: 140px">
            <el-option label="跟台-全部" value="" />
            <el-option label="跟台-是" value="1" />
            <el-option label="跟台-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeQxfqx" clearable placeholder="器械-全部" style="width: 140px">
            <el-option label="器械-全部" value="" />
            <el-option label="器械-是" value="1" />
            <el-option label="器械-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.sfyj" clearable placeholder="月结-全部" style="width: 140px">
            <el-option label="月结-全部" value="" />
            <el-option label="月结-是" value="1" />
            <el-option label="月结-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeSearch10" clearable placeholder="消耗类型-全部" style="width: 110px">
            <el-option label="消耗类型-全部" value="" />
            <el-option label="PDA扫码消耗" value="0" />
            <el-option label="RFID读码消耗" value="1" />
            <el-option label="HIS计费消耗" value="2" />
            <el-option label="散货申领消耗" value="3" />
            <el-option label="HIS医嘱计费消耗" value="4" />
            <el-option label="超时默认消耗" value="5" />
            <el-option label="读码消耗" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeSearch7" clearable placeholder="高低值-全部" style="width: 110px">
            <el-option label="高低值-全部" value="" />
            <el-option label="高值" value="高值" />
            <el-option label="低值" value="低值" />
            <el-option label="试剂" value="试剂" />
            <el-option label="消毒" value="消毒" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsProtect" clearable placeholder="防控物资-全部" style="width: 100px">
            <el-option label="防控物资-全部" value="" />
            <el-option label="防控物资-是" value="1" />
            <el-option label="防控物资-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.highOrLowClassTwo1" clearable placeholder="重点治理-全部" style="width: 120px">
            <el-option label="重点治理-全部" value="" />
            <el-option label="重点治理" value="1" />
            <el-option label="非重点治理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsSpecialAircraft" clearable placeholder="专机专用-全部" style="width: 100px">
            <el-option label="专机专用-全部" value="" />
            <el-option label="专机专用-是" value="1" />
            <el-option label="专机专用-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeContractType" clearable placeholder="合同-全部" style="width: 100px">
            <el-option label="合同-全部" value="" />
            <el-option label="合同-中标" value="1" />
            <el-option label="合同-临采" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsPdaScan" clearable placeholder="二级库-全部" style="width: 100px">
            <el-option label="二级库-全部" value="" />
            <el-option label="二级库-已出库" value="1" />
            <el-option label="二级库-未出库" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeGoodsQty" clearable placeholder="数量-全部" style="width: 100px">
            <el-option label="数量-全部" value="" />
            <el-option label="数量-大于0" value="1" />
            <el-option label="数量-小于0" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item style="display: none">
          <el-select v-model="where.ksConsumeIsHisPriceDeff" clearable placeholder="his价格-全部" style="width: 100px">
            <el-option label="his价格-全部" value="" />
            <el-option label="his价格-不一致" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsSendYg" clearable placeholder="发送阳光-全部" style="width: 100px">
            <el-option label="发送阳光-全部" value="" />
            <el-option label="已发送全部" value="1" />
            <el-option label="已发送,成功" value="2" />
            <el-option label="已发送,不成功" value="3" />
            <el-option label="未发送" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsJc" clearable placeholder="集采-全部" style="width: 100px">
            <el-option label="集采-全部" value="" />
            <el-option label="集采-是" value="1" />
            <el-option label="集采-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeSearchUdi" clearable placeholder="发送UDI-全部" style="width: 100px">
            <el-option label="发送UDI-全部" value="" />
            <el-option label="发送UDI-否" value="0" />
            <el-option label="发送UDI-是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsJf" clearable placeholder="是否计费-全部" style="width: 100px">
            <el-option label="是否计费-全部" value="" />
            <el-option label="是否计费-是" value="1" />
            <el-option label="是否计费-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeHaveYgcode" clearable placeholder="阳光产品码-全部" style="width: 120px">
            <el-option label="阳光产品码-全部" value="" />
            <el-option label="阳光产品码-有" value="1" />
            <el-option label="阳光产品码-无" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="where.KSConsumeBD_dayClearingDate"
            type="date"
            placeholder="日期时间: yyyy-MM-dd"
            style="width: 200px"
          />
        </el-form-item>
      </div>
      <el-row :gutter="10" class="filter-row">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="中心医院库存" label-width="100px">
            <el-select v-model="where.stzx_state" clearable placeholder="全部" style="width: 140px">
              <el-option label="全部" value="-1" />
              <el-option label="包含" value="1" />
              <el-option label="不包含" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
          <el-form-item label="中心医院高值库存" label-width="120px">
            <el-select v-model="where.stzx_gz_state" clearable placeholder="全部" style="width: 140px">
              <el-option label="全部" value="-1" />
              <el-option label="包含" value="1" />
              <el-option label="不包含" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="骨科集采" label-width="72px">
            <el-select v-model="where.stzx_gkjc_state" clearable placeholder="全部" style="width: 140px">
              <el-option label="全部" value="" />
              <el-option label="包含" value="1" />
              <el-option label="不包含" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="消耗开始日期"
              end-placeholder="消耗结束日期"
              style="width: 240px"
              @change="handleDateRangeChange"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <el-form-item class="month-range-item">
            <el-checkbox v-model="where.KSConsume_cb">是否按月结日期搜索,默认否</el-checkbox>
            <el-date-picker
              v-model="where.KSConsume_monthRange"
              type="monthrange"
              placeholder="请选择月结日期范围"
              :disabled="!where.KSConsume_cb"
              style="width: 140px; margin-left: 8px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search1" placeholder="品种编码/全称/产品码" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_zcz" placeholder="注册证" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search2" placeholder="请输入供应商搜索" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search6" placeholder="请输入生产企业搜索" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search3" placeholder="请输入生产批号搜索" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search4" placeholder="请输入科室名称" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsumeBD_search_j4" placeholder="计费科室名称" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsumeBD_search_cost_dept" placeholder="成本科室名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search5" placeholder="请输入定数码" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search8" placeholder="请输入国产/进口" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search9" placeholder="请输入分类属性" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_search11" placeholder="请输入规格型号" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_YgOrder" placeholder="阳光订单号" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_SOURCE_FROM" placeholder="来源" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_Patient_Number" placeholder="病患号/住院号" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_Supply_Price" placeholder="单价" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_CONFIRM_STAFF" placeholder="消耗人" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input clearable v-model="where.KSConsume_REGULATORY_CAT_NAME" placeholder="监管类别名称" />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <el-form-item class="ele-form-actions">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="15">
        <el-select v-model="where.ksConsumeDetailCreateType" size="mini" placeholder="跟台-全部" ... />
        ...
      </el-row>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">查询</el-button>
        </div>
      </el-col> -->
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
        sfyj: '',
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

<style scoped lang="scss">
.filter-row {
  margin-bottom: 0;
}

.filter-row :deep(.el-col .el-form-item) {
  margin-bottom: 8px;
}

.filter-row :deep(.el-col .el-form-item__content) {
  width: 100%;
  max-width: none !important;
  margin-left: 0 !important;
}

.filter-row :deep(.el-col .el-form-item__label) {
  white-space: nowrap;
}

.filter-row :deep(.el-col .el-input),
.filter-row :deep(.el-col .el-select) {
  width: 100%;
}

.selects {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.selects :deep(.el-form-item) {
  margin: 0;
}

.selects :deep(.el-form-item__content) {
  max-width: none !important;
  margin-left: 0 !important;
}

.month-range-item :deep(.el-form-item__content) {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: none !important;
}

.consume-query-form :deep(.el-form-item__content) {
  max-width: none !important;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-left: 0 !important;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

@media (max-width: 768px) {
  .filter-row :deep(.el-col) {
    margin-bottom: 4px;
  }
}
</style>
