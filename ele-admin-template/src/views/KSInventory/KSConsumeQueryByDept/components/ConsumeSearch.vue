<template>
  <div class="consume-search spd-panel__body">
    <el-form
      size="mini"
      label-width="0"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.varietie" clearable placeholder="品种编码、品种全称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.ygCode" clearable placeholder="阳光产品码" />
          </el-form-item>
        </el-col>
        <el-col v-if="showSupplier" :span="4">
          <el-form-item>
            <el-input v-model="where.supplier" clearable placeholder="请输入供应商搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.manuEntName" clearable placeholder="请输入生产企业搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.batch" clearable placeholder="请输入生产批号搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.deptTwoName" clearable placeholder="请输入科室名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.DEPT_NAME" clearable placeholder="计费科室名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.SPDDEPTNAME" clearable placeholder="成本科室名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.highOrLow" clearable placeholder="请输入高低值" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.trade" clearable placeholder="请输入国产/进口" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.classificName" clearable placeholder="请输入分类属性" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.specType" clearable placeholder="请输入规格型号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="filter-row">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.Patient_Number" clearable placeholder="病患号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.Hospitalization_Number" clearable placeholder="住院号" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.def" clearable placeholder="请输入定数码" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="where.Operate_Person" clearable placeholder="消耗人" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="filter-row selects">
        <el-form-item>
          <el-select v-model="where.consumeType" clearable placeholder="消耗类型" style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="条码扫码消耗" value="0" />
            <el-option label="RFID读码消耗" value="1" />
            <el-option label="HIS计费消耗" value="2" />
            <el-option label="散货申领消耗" value="3" />
            <el-option label="HIS医嘱计费消耗" value="4" />
            <el-option label="超时默认消耗" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.isProtect" clearable placeholder="是否防控物资" style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="where.highOrLowClassTwo" clearable placeholder="高低值分类下级分类" style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="重点治理" value="1" />
            <el-option label="非重点治理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="where.THE_FIRST_BATCH_OF_KEY_CONSUMA"
            clearable
            placeholder="第一批重点治理"
            style="width:140px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStzx">
          <el-select v-model="where.stzx_state" placeholder="是否包含中心医院库存" style="width:140px">
            <el-option label="包含" value="1" />
            <el-option label="不包含" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStzx">
          <el-select v-model="where.stzx_state_gz" placeholder="是否包含中心医院高值库存" style="width:160px">
            <el-option label="包含" value="1" />
            <el-option label="不包含" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showPdaScan">
          <el-select v-model="where.isPdaScan" clearable placeholder="二级库" style="width:120px">
            <el-option label="全部" value="" />
            <el-option label="已出库" value="1" />
            <el-option label="未出库" value="2" />
          </el-select>
        </el-form-item>
      </div>
      <div class="filter-row time-row">
        <span class="time-label">消耗时间</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.validDateFrom"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width:140px"
          />
        </el-form-item>
        <span class="time-label">至</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.validDateTo"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width:140px"
          />
        </el-form-item>
        <el-form-item class="time-item">
          <el-checkbox v-model="where.useMonth">是否按月结日期搜索,默认否</el-checkbox>
        </el-form-item>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.monthFmt"
            type="month"
            value-format="yyyy-MM"
            placeholder="yyyy-MM开始"
            :disabled="!where.useMonth"
            style="width:130px"
          />
        </el-form-item>
        <span class="time-label">至</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.monthFmt2"
            type="month"
            value-format="yyyy-MM"
            placeholder="yyyy-MM截止"
            :disabled="!where.useMonth"
            style="width:130px"
          />
        </el-form-item>
        <span class="time-label">日清时间</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.dayClearingDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
            style="width:140px"
          />
        </el-form-item>
        <span class="time-label">二级库出库时间</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.KSConsumePDA_startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width:140px"
          />
        </el-form-item>
        <span class="time-label">至</span>
        <el-form-item class="time-item">
          <el-date-picker
            v-model="where.KSConsumePDA_endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width:140px"
          />
        </el-form-item>
      </div>
      <el-row class="actions-row">
        <el-form-item class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            v-permission="'export-KSConsumeQueryByDept-ksxhdc'"
            type="primary"
            plain
            :loading="exporting"
            @click.prevent="$emit('export')"
          >
            导出Excel
          </el-button>
          <el-button plain @click.prevent="$emit('hz')">查看汇总</el-button>
          <el-button plain @click.prevent="$emit('ks-hz')">科室汇总</el-button>
          <el-button plain @click.prevent="$emit('fz-hz')">分组汇总</el-button>
          <el-button plain :loading="updating" @click.prevent="$emit('update-data')">更新数据</el-button>
          <el-button v-if="showFszxy" plain :loading="notebookExporting" @click.prevent="$emit('notebook')">
            检查笔记本
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { isHideDeptSup } from '../utils';

function defaultWhere() {
  return {
    varietie: '',
    ygCode: '',
    supplier: '',
    batch: '',
    deptTwoName: '',
    DEPT_NAME: '',
    SPDDEPTNAME: '',
    manuEntName: '',
    validDateFrom: '',
    validDateTo: '',
    KSConsumePDA_startDate: '',
    KSConsumePDA_endDate: '',
    highOrLow: '',
    trade: '',
    classificName: '',
    consumeType: '',
    specType: '',
    Patient_Number: '',
    Hospitalization_Number: '',
    def: '',
    Operate_Person: '',
    useMonth: false,
    monthFmt: '',
    monthFmt2: '',
    dayClearingDate: '',
    isProtect: '',
    isPdaScan: '',
    highOrLowClassTwo: '',
    THE_FIRST_BATCH_OF_KEY_CONSUMA: '',
    stzx_state: '1',
    stzx_state_gz: '1'
  };
}

export default {
  name: 'KSConsumeQueryByDeptSearch',
  props: {
    exporting: Boolean,
    updating: Boolean,
    notebookExporting: Boolean
  },
  data() {
    return {
      where: defaultWhere()
    };
  },
  computed: {
    showStzx() {
      return HOME_HP === 'stzx';
    },
    showFszxy() {
      return HOME_HP === 'fszxy';
    },
    showSupplier() {
      return isHideDeptSup();
    },
    showPdaScan() {
      const list = this.$store.state.user?.info?.permission_group || [];
      return list.some((p) => p.Permission_Url === '科室结算方式-消耗结算');
    }
  },
  methods: {
    search() {
      this.$emit('search', { ...this.where });
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
