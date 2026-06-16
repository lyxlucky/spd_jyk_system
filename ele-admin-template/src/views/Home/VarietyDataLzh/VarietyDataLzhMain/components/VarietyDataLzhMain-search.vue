<template>
  <div class="variety-search">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form size="mini" class="search-form" @submit.native.prevent>
          <el-row :gutter="8" type="flex" style="flex-wrap: wrap">
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item>
                <el-select v-model="where.vdzh_sx" clearable placeholder="全部筛选" style="width: 100%">
                  <el-option label="全部筛选" value="0" />
                  <el-option label="防控物资女" value="1" />
                  <el-option label="阳光采购平台品种" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="3" :md="6" :sm="12">
              <el-form-item label="高低值分类">
                <el-select v-model="where.HIGH_OR_LOW_CLASS" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="-1" />
                  <el-option label="高值" value="1" />
                  <el-option label="低值" value="0" />
                  <el-option label="试剂" value="2" />
                  <el-option label="消毒" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item>
                <el-select v-model="where.HIGH_OR_LOW_CLASS_TWO" clearable placeholder="重点分类" style="width: 100%">
                  <el-option label="重点分类-全部" value="-1" />
                  <el-option label="重点治理" value="1" />
                  <el-option label="非重点治理" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item>
                <el-input v-model="where.HIGH_CLASS_XH" placeholder="高值序号" clearable />
              </el-form-item>
            </el-col>
            <el-col :lg="3" :md="6" :sm="12">
              <el-form-item label="设备科是否修改">
                <el-select v-model="where.IS_EQUIPMENT_CHANGE" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="-1" />
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item>
                <el-select v-model="where.SENDYB_STATE" clearable placeholder="物价状态" style="width: 100%">
                  <el-option label="物价-全部" value="" />
                  <el-option label="物价-已提交" value="1" />
                  <el-option label="物价-未提交" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="启用状态">
                <el-select v-model="where.enable" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="启用" value="1" />
                  <el-option label="停用" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="计费编码">
                <el-select v-model="where.enableChargingCode" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="为空" value="1" />
                  <el-option label="不为空" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="修改时间">
                <el-select v-model="where.updateTime" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="当天" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="8" type="flex" style="flex-wrap: wrap; align-items: center">
            <el-col :lg="5" :md="10" :sm="24">
              <el-form-item label="审批时间">
                <el-date-picker
                  v-model="where.priceChangeTimeStart"
                  type="date"
                  placeholder="开始日期"
                  style="width: 48%"
                />
                <el-date-picker
                  v-model="where.priceChangeTimeEnd"
                  type="date"
                  placeholder="结束日期"
                  style="width: 48%; margin-left: 4%"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="审批状态">
                <el-select v-model="where.APPROVAL_STATE" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="审批通过" value="1" />
                  <el-option label="待审批" value="0" />
                  <el-option label="未通过" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="北大回传">
                <el-select v-model="where.JF_BJ" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="未标记" value="0" />
                  <el-option label="已标记" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="2" :md="4" :sm="8">
              <el-form-item label="临时挂起">
                <el-select v-model="where.IS_HANG_UP" clearable placeholder="请选择" style="width: 100%">
                  <el-option label="全部" value="" />
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="3" :md="6" :sm="12">
              <el-form-item>
                <el-checkbox v-model="checked">是否过滤非库宝品种</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="filter-row">
            <el-input v-model="where.varietieCode" clearable placeholder="编码/名称" style="width: 140px" @keyup.enter.native="reload" />
            <el-input v-model="where.Specification_Or_Type" clearable placeholder="规格型号" style="width: 120px" @keyup.enter.native="reload" />
            <el-input v-model="where.SCQY" clearable placeholder="生产企业" style="width: 120px" @keyup.enter.native="reload" />
            <el-input v-model="where.ZCZ" clearable placeholder="注册证" style="width: 110px" @keyup.enter.native="reload" />
            <el-input v-model="where.SUP" clearable placeholder="供应商" style="width: 110px" @keyup.enter.native="reload" />
            <el-input v-model="where.Y_M_P_CODE" clearable placeholder="阳光/医保/省平台编码" style="width: 160px" @keyup.enter.native="reload" />
            <el-input v-model="where.UDI_TOP" clearable placeholder="UDI编码" style="width: 120px" @keyup.enter.native="reload" />
            <el-input v-model="where.BZ_TI" clearable placeholder="备注" style="width: 100px" @keyup.enter.native="reload" />
            <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VarietyDataLzhMainSearch',
  data() {
    return {
      checked: false,
      where: {
        varietieCode: '',
        varietieName: '',
        field: '',
        order: '',
        state: '',
        IS_CHARGE: '-1',
        IS_BIDDING: '-1',
        SPECIAL_PURCHASE: '-1',
        ONEOFF_STERILIZATION_PACKAGING: '-1',
        STORAGE_TYPE: '-1',
        IS_EMBEDDED: '-1',
        IS_SERIAL_NUMBER: '-1',
        IS_INTERVENED: '-1',
        IS_PROTECT: '-1',
        HIGH_OR_LOW_CLASS: '-1',
        HIGH_OR_LOW_CLASS_TWO: '-1',
        IS_EQUIPMENT_CHANGE: '-1',
        SENDYB_STATE: '',
        HIGH_CLASS_XH: '',
        HIGH_CLASS_XH_SEARCH: '',
        enable: '',
        enableChargingCode: '',
        updateTime: '',
        priceChangeTimeStart: '',
        priceChangeTimeEnd: '',
        APPROVAL_STATE: '',
        vdzh_sx: '0',
        SCQY: '',
        SUP: '',
        Specification_Or_Type: '',
        ZCZ: '',
        VARYB_STATE: '',
        VARSB_STATE: '',
        VARJF_STATE: '',
        VARSPD_STATE: '',
        VARBZ_STATE: '',
        VAROES_STATE: '',
        FSWY_STATE: '',
        Y_M_P_CODE: '',
        UDI_TOP: '',
        BZ_TI: '',
        JF_BJ: '',
        IS_HANG_UP: ''
      }
    };
  },
  methods: {
    reload() {
      this.$emit('search', { ...this.where });
    }
  }
};
</script>

<style scoped>
.variety-search {
  margin-bottom: 8px;
}
.search-form ::v-deep .el-form-item {
  margin-bottom: 8px;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
</style>
