<template>
  <div class="consume-search spd-panel__body">
    <el-form size="mini" label-width="0" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search1" clearable placeholder="品种编码/全称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_ygcode" clearable placeholder="产品码" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_zcz" clearable placeholder="注册证" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search2" clearable placeholder="供应商" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search6" clearable placeholder="生产企业" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search3" clearable placeholder="生产批号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search4" clearable placeholder="科室名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsumeBD_search_j4" clearable placeholder="计费科室名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsumeBD_search_cost_dept" clearable placeholder="成本科室名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search5" clearable placeholder="定数码" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search8" clearable placeholder="国产/进口" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search9" clearable placeholder="分类属性" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_search11" clearable placeholder="规格型号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_YgOrder" clearable placeholder="阳光订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_SOURCE_FROM" clearable placeholder="来源" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_Patient_Number" clearable placeholder="病患号/住院号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_Supply_Price" clearable placeholder="单价" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_CONFIRM_STAFF" clearable placeholder="消耗人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_MONTHBILLNUM" clearable placeholder="发票号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_REGULATORY_CAT_NAME" clearable placeholder="监管类别名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.KSConsume_MEDICAL_NAME" clearable placeholder="医保通用名" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="where.KSConsume_IS_SEND_WXT" clearable placeholder="微讯通" style="width:100%">
              <el-option label="微讯通-全部" value="" />
              <el-option label="微讯通-是" value="1" />
              <el-option label="微讯通-否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="where.checkInStorageTemp" clearable placeholder="院区" style="width:100%">
              <el-option label="全部" value="" />
              <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="filter-row selects">
        <el-form-item>
          <el-select v-model="where.ksConsumeSearch10" clearable placeholder="消耗类型" style="width:120px">
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
          <el-select v-model="where.ksConsumeSearch7" clearable placeholder="高低值" style="width:100px">
            <el-option label="高低值-全部" value="" />
            <el-option label="高值" value="高值" />
            <el-option label="低值" value="低值" />
            <el-option label="试剂" value="试剂" />
            <el-option label="消毒" value="消毒" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeFLsearch" clearable placeholder="分类属性" style="width:140px">
            <el-option label="分类属性-全部" value="" />
            <el-option v-for="o in classific2Options" :key="o.v" :label="o.l" :value="o.v" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsProtect" clearable placeholder="防控物资" style="width:110px">
            <el-option label="防控物资-全部" value="" />
            <el-option label="防控物资-是" value="1" />
            <el-option label="防控物资-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.highOrLowClassTwo1" clearable placeholder="重点治理" style="width:120px">
            <el-option label="重点治理-全部" value="" />
            <el-option label="重点治理" value="1" />
            <el-option label="非重点治理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsSpecialAircraft" clearable placeholder="专机专用" style="width:110px">
            <el-option label="专机专用-全部" value="" />
            <el-option label="专机专用-是" value="1" />
            <el-option label="专机专用-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeContractType" clearable placeholder="合同" style="width:110px">
            <el-option label="合同-全部" value="" />
            <el-option label="合同-中标" value="1" />
            <el-option label="合同-临采" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsPdaScan" clearable placeholder="PDA扫码" style="width:120px">
            <el-option label="PDA扫码-全部" value="" />
            <el-option label="PDA扫码-已扫码" value="1" />
            <el-option label="PDA扫码-未扫码" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeGoodsQty" clearable placeholder="数量" style="width:100px">
            <el-option label="数量-全部" value="" />
            <el-option label="数量-大于0" value="1" />
            <el-option label="数量-小于0" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsSendYg" clearable placeholder="发送阳光" style="width:120px">
            <el-option label="发送阳光-全部" value="" />
            <el-option label="已发送全部" value="1" />
            <el-option label="已发送,成功" value="2" />
            <el-option label="已发送,不成功" value="3" />
            <el-option label="未发送" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsJc" clearable placeholder="集采" style="width:100px">
            <el-option label="集采-全部" value="" />
            <el-option label="集采-是" value="1" />
            <el-option label="集采-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeSearchUdi" clearable placeholder="发送UDI" style="width:110px">
            <el-option label="发送UDI-全部" value="" />
            <el-option label="发送UDI-否" value="0" />
            <el-option label="发送UDI-是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.ksConsumeIsJf" clearable placeholder="是否计费" style="width:110px">
            <el-option label="是否计费-全部" value="" />
            <el-option label="是否计费-是" value="1" />
            <el-option label="是否计费-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.KSConsume_KEY_MONITOR_CHARGE" clearable placeholder="重点收费监控" style="width:130px">
            <el-option label="重点收费监控-全部" value="" />
            <el-option label="重点收费监控-是" value="1" />
            <el-option label="重点收费监控-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.KSConsume_KEY_MONITOR_USE" clearable placeholder="重点使用监控" style="width:130px">
            <el-option label="重点使用监控-全部" value="" />
            <el-option label="重点使用监控-是" value="1" />
            <el-option label="重点使用监控-否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStzx">
          <el-select v-model="where.stzx_state" clearable placeholder="中心医院库存" style="width:120px">
            <el-option label="包含" value="1" />
            <el-option label="不包含" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStzx">
          <el-select v-model="where.stzx_gz_state" clearable placeholder="中心医院高值库存" style="width:140px">
            <el-option label="包含" value="1" />
            <el-option label="不包含" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStzx">
          <el-select v-model="where.stzx_gkjc_state" clearable placeholder="骨科集采" style="width:100px">
            <el-option label="全部" value="" />
            <el-option label="包含" value="1" />
            <el-option label="不包含" value="0" />
          </el-select>
        </el-form-item>
      </div>
      <div class="filter-row time-row">
        <span class="time-label">消耗时间</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width:240px"
            @change="onDateRange"
          />
        </el-form-item>
        <el-form-item class="time-item">
          <el-checkbox v-model="where.KSConsume_cb">按月结日期搜索</el-checkbox>
        </el-form-item>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.KSConsume_monthRange"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="月结起"
            end-placeholder="月结止"
            :disabled="!where.KSConsume_cb"
            style="width:220px"
          />
        </el-form-item>
        <span class="time-label ml12">日清时间</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.KSConsumeBD_dayClearingDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
            style="width:140px"
          />
        </el-form-item>
        <span class="time-label ml12">微讯通结算月份</span>
        <el-form-item class="time-item">
          <el-input v-model="where.KSConsumeBD_SEND_WXT_MARK" clearable placeholder="yyyyMM" style="width:100px" />
        </el-form-item>
      </div>
      <el-row class="actions-row">
        <el-form-item class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" plain :loading="exporting" @click="$emit('export-front')">导出检索</el-button>
          <el-button type="primary" plain :loading="exportingEp" @click="$emit('export-ep')">后端导出(快速)</el-button>
          <el-button type="warning" plain :loading="refreshing" @click="$emit('refresh-data')">更新全部数据</el-button>
          <el-button v-if="canReverse" type="danger" plain :disabled="!reverseReady" @click="$emit('reverse')">
            逆向消耗
          </el-button>
        </el-form-item>
      </el-row>
      <!-- <el-row class="actions-row">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
        ...
      </el-row> -->
    </el-form>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { getStorageList } from '@/api/KSInventory/KSConsumeQueryTemp';

const CLASSIFIC2 = [
  { l: '低值物资.医材', v: '1' },
  { l: '低值物资.医疗器械', v: '2' },
  { l: '高值耗材.非骨科类', v: '3' },
  { l: '高值耗材.骨科类', v: '4' },
  { l: '高值耗材.骨科专购包', v: '5' },
  { l: '试剂.治疗', v: '6' },
  { l: '试剂.病理', v: '7' },
  { l: '试剂.缺省', v: '8' },
  { l: '试剂.耗材', v: '9' },
  { l: '试剂.诊断', v: '10' },
  { l: '试剂.辅助', v: '11' },
  { l: '试剂.质控', v: '12' },
  { l: '试剂.校准（定标）', v: '13' },
  { l: '试剂.主试剂', v: '14' }
];

function defaultWhere() {
  return {
    start_time: '',
    end_time: '',
    KSConsume_search1: '',
    KSConsume_ygcode: '',
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
    KSConsume_MONTHBILLNUM: '',
    KSConsume_REGULATORY_CAT_NAME: '',
    KSConsume_MEDICAL_NAME: '',
    KSConsume_IS_SEND_WXT: '',
    KSConsume_KEY_MONITOR_CHARGE: '',
    KSConsume_KEY_MONITOR_USE: '',
    checkInStorageTemp: '',
    ksConsumeSearch10: '',
    ksConsumeSearch7: '',
    ksConsumeFLsearch: '',
    ksConsumeIsProtect: '',
    highOrLowClassTwo1: '',
    ksConsumeIsSpecialAircraft: '',
    ksConsumeContractType: '',
    ksConsumeIsPdaScan: '',
    ksConsumeGoodsQty: '',
    ksConsumeIsSendYg: '',
    ksConsumeIsJc: '',
    ksConsumeSearchUdi: '',
    ksConsumeIsJf: '',
    ksConsumeIsHisPriceDeff: '',
    KSConsume_cb: false,
    KSConsume_monthRange: null,
    KSConsumeBD_dayClearingDate: '',
    KSConsumeBD_SEND_WXT_MARK: '',
    stzx_state: '1',
    stzx_gz_state: '1',
    stzx_gkjc_state: ''
  };
}

export default {
  name: 'ConsumeSearch',
  props: {
    exporting: Boolean,
    exportingEp: Boolean,
    refreshing: Boolean,
    canReverse: Boolean,
    reverseReady: Boolean
  },
  data() {
    return {
      where: defaultWhere(),
      dateRange: [],
      storageList: [],
      classific2Options: CLASSIFIC2
    };
  },
  computed: {
    showStzx() {
      return HOME_HP === 'stzx';
    }
  },
  created() {
    this.loadStorage();
  },
  methods: {
    async loadStorage() {
      try {
        this.storageList = await getStorageList();
      } catch {
        this.storageList = [];
      }
    },
    onDateRange(range) {
      if (range && range.length === 2) {
        this.where.start_time = range[0];
        this.where.end_time = range[1];
      } else {
        this.where.start_time = '';
        this.where.end_time = '';
      }
    },
    search() {
      this.$emit('search', { ...this.where });
    },
    reset() {
      this.where = defaultWhere();
      this.dateRange = [];
      this.search();
    },
    getWhere() {
      return { ...this.where };
    }
  }
};
</script>

<style scoped lang="scss">
.consume-search {
  padding: 0;
}

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

.filter-row :deep(.el-col .el-input),
.filter-row :deep(.el-col .el-select) {
  width: 100%;
}

.selects {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.selects :deep(.el-form-item) {
  margin: 0;
}

.selects :deep(.el-form-item__content) {
  max-width: none !important;
  margin-left: 0 !important;
}

.time-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 8px;
}

.time-label {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  flex-shrink: 0;
}

.ml12 {
  margin-left: 0;
}

.time-row :deep(.time-item) {
  margin: 0;
}

.time-row :deep(.time-item .el-form-item__content) {
  max-width: none !important;
  margin-left: 0 !important;
}

.ele-form-search :deep(.el-form-item__content) {
  max-width: none !important;
}

.actions-row {
  margin-top: 4px;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-left: 0 !important;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}
</style>
