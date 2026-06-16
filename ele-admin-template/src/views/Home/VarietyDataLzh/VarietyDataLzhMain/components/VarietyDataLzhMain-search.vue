<template>
  <div class="variety-search">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form
          :inline="true"
          size="mini"
          label-width="96px"
          class="filter-row filter-row--labeled"
          @submit.native.prevent
        >
          <el-form-item label="品种筛选">
            <el-select v-model="where.vdzh_sx" clearable placeholder="请选择" style="width: 110px">
              <el-option label="全部筛选" value="0" />
              <el-option label="防控物资女" value="1" />
              <el-option label="阳光采购平台品种" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="高低值">
            <el-select v-model="where.HIGH_OR_LOW_CLASS" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="-1" />
              <el-option label="高值" value="1" />
              <el-option label="低值" value="0" />
              <el-option label="试剂" value="2" />
              <el-option label="消毒" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="重点分类">
            <el-select v-model="where.HIGH_OR_LOW_CLASS_TWO" clearable placeholder="请选择" style="width: 110px">
              <el-option label="全部" value="-1" />
              <el-option label="重点治理" value="1" />
              <el-option label="非重点治理" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="高值序号">
            <el-input v-model="where.HIGH_CLASS_XH" placeholder="请输入" clearable style="width: 90px" />
          </el-form-item>
          <el-form-item label="设备科修改">
            <el-select v-model="where.IS_EQUIPMENT_CHANGE" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="物价状态">
            <el-select v-model="where.SENDYB_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="已提交" value="1" />
              <el-option label="未提交" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-select v-model="where.enable" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="" />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="计费编码">
            <el-select v-model="where.enableChargingCode" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="" />
              <el-option label="为空" value="1" />
              <el-option label="不为空" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-select v-model="where.updateTime" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="" />
              <el-option label="当天" value="1" />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form
          :inline="true"
          size="mini"
          label-width="96px"
          class="filter-row filter-row--labeled"
          @submit.native.prevent
        >
          <el-form-item label="审批时间">
            <el-date-picker
              v-model="where.priceChangeTimeStart"
              type="date"
              placeholder="开始"
              style="width: 120px"
            />
            <span class="filter-range-sep">至</span>
            <el-date-picker
              v-model="where.priceChangeTimeEnd"
              type="date"
              placeholder="结束"
              style="width: 120px"
            />
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="where.APPROVAL_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="审批通过" value="1" />
              <el-option label="待审批" value="0" />
              <el-option label="未通过" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="北大回传">
            <el-select v-model="where.JF_BJ" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="未标记" value="0" />
              <el-option label="已标记" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="临时挂起">
            <el-select v-model="where.IS_HANG_UP" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="库宝过滤">
            <el-checkbox v-model="checked">过滤非库宝品种</el-checkbox>
          </el-form-item>
        </el-form>

        <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
            <el-form-item>
              <el-input
                v-model="where.varietieCode"
                clearable
                placeholder="编码/名称"
                style="width: 140px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.Specification_Or_Type"
                clearable
                placeholder="规格型号"
                style="width: 120px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.SCQY"
                clearable
                placeholder="生产企业"
                style="width: 120px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.ZCZ"
                clearable
                placeholder="注册证"
                style="width: 110px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.SUP"
                clearable
                placeholder="供应商"
                style="width: 110px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.Y_M_P_CODE"
                clearable
                placeholder="阳光/医保/省平台编码"
                style="width: 160px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.UDI_TOP"
                clearable
                placeholder="UDI编码"
                style="width: 120px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="where.BZ_TI"
                clearable
                placeholder="备注"
                style="width: 100px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
            </el-form-item>
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
      this.$emit('search', { ...this.where, filterKubao: this.checked });
    }
  }
};
</script>

<style scoped>
.variety-search {
  margin-bottom: 8px;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}
.filter-row:last-child {
  margin-bottom: 0;
}
.filter-row ::v-deep .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
}
.filter-row--labeled ::v-deep .el-form-item__label {
  font-size: 12px;
  color: #606266;
  padding-right: 6px;
}
.filter-range-sep {
  margin: 0 4px;
  font-size: 12px;
  color: #909399;
}
</style>
