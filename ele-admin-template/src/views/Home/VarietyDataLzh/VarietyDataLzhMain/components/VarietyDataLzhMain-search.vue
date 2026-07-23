<template>
  <div class="variety-search">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form size="mini" class="search-form" label-position="left" label-width="auto" @submit.native.prevent>
          <div class="search-row">
            <el-form-item v-if="!isBdrm" class="cell cell--xs">
              <el-select v-model="where.vdzh_sx" clearable placeholder="全部筛选">
                <el-option label="全部筛选" value="0" />
                <el-option label="防控物资" value="1" />
                <el-option label="阳光采购平台品种" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="高低值分类" class="cell cell--sm">
              <el-select v-model="where.HIGH_OR_LOW_CLASS" clearable placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="高值" value="1" />
                <el-option label="低值" value="0" />
                <el-option label="试剂" value="2" />
                <el-option label="消毒" value="3" />
                <el-option label="设备耗材" value="4" />
              </el-select>
            </el-form-item>

            <el-form-item class="cell cell--xs">
              <el-select v-model="where.HIGH_OR_LOW_CLASS_TWO" clearable placeholder="重点分类">
                <el-option label="重点分类-全部" value="-1" />
                <el-option label="重点治理" value="1" />
                <el-option label="非重点治理" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item class="cell cell--xs">
              <el-input v-model="where.HIGH_CLASS_XH" placeholder="高值序号" clearable />
            </el-form-item>

            <el-form-item v-if="!isStseLike" label="设备科修改" class="cell cell--sm">
              <el-select v-model="where.IS_EQUIPMENT_CHANGE" clearable placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="!isBdrm" class="cell cell--xs">
              <el-select v-model="where.SENDYB_STATE" clearable placeholder="物价状态">
                <el-option label="物价-全部" value="" />
                <el-option label="物价-已提交" value="1" />
                <el-option label="物价-未提交" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="启用状态" class="cell cell--sm">
              <el-select v-model="where.enable" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="计费编码" class="cell cell--sm">
              <el-select v-model="where.enableChargingCode" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="为空" value="1" />
                <el-option label="不为空" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="修改时间" class="cell cell--sm">
              <el-select v-model="where.updateTime" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="当天" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="!isBdrm" label="审批状态" class="cell cell--sm">
              <el-select v-model="where.APPROVAL_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="审批通过" value="1" />
                <el-option label="待审批" value="0" />
                <el-option label="未通过" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="isSzhn" label="OES推送状态" class="cell cell--sm">
              <el-select v-model="where.VAROES_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未推送" value="0" />
                <el-option label="已推送" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="isBd" label="北大回传" class="cell cell--sm">
              <el-select v-model="where.JF_BJ" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未标记" value="0" />
                <el-option label="已标记" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="临时挂起" class="cell cell--sm">
              <el-select v-model="where.IS_HANG_UP" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="否" value="0" />
                <el-option label="是" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="是否同步" class="cell cell--sm">
              <el-select v-model="where.STSEHIS_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未同步" value="0" />
                <el-option label="已同步" value="1" />
                <el-option label="同步失败" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="isFsSync" label="跨院同步" class="cell cell--sm">
              <el-select v-model="where.HOSPITAL_SYNC" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="初始目录" value="no" />
                <el-option label="多院区启用" value="all" />
                <el-option label="仅南五启用" value="dwrmyy" />
                <el-option label="仅南六启用" value="fsdl" />
                <el-option label="仅南七启用" value="ybyy" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="isFsState" label="品种状态" class="cell cell--sm">
              <el-select v-model="where.FSWY_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未发送" value="0" />
                <el-option label="已发送" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="!isBdrm" label="审批时间" class="cell cell--date">
              <div class="date-range">
                <el-date-picker
                  v-model="where.priceChangeTimeStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期"
                />
                <span class="date-sep">~</span>
                <el-date-picker
                  v-model="where.priceChangeTimeEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                />
              </div>
            </el-form-item>

            <el-form-item label="创建时间" class="cell cell--date">
              <div class="date-range">
                <el-date-picker
                  v-model="where.VAR_CREATETIMESTART"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期"
                />
                <span class="date-sep">~</span>
                <el-date-picker
                  v-model="where.VAR_CREATETIMEEND"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                />
              </div>
            </el-form-item>

            <el-form-item v-if="isBdOnly" class="cell cell--auto">
              <el-checkbox v-model="checked">是否过滤非库宝品种</el-checkbox>
            </el-form-item>
          </div>

          <div v-if="isStseFlow" class="search-row search-row--sub">
            <el-form-item label="SPD审批状态" class="cell cell--md">
              <el-select v-model="where.VARSPD_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="维护" value="0" />
                <el-option label="修改" value="1" />
                <el-option label="提交" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备科状态" class="cell cell--md">
              <el-select v-model="where.VARSB_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="维护" value="0" />
                <el-option label="修改" value="1" />
                <el-option label="提交" value="2" />
                <el-option label="审核" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item :label="jfStateLabel" class="cell cell--md">
              <el-select v-model="where.VARJF_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="维护" value="0" />
                <el-option label="修改" value="1" />
                <el-option label="提交" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="医保办状态" class="cell cell--md">
              <el-select v-model="where.VARYB_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="维护" value="0" />
                <el-option label="修改" value="1" />
                <el-option label="提交" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="isStseBz" label="备注确认状态" class="cell cell--md">
              <el-select v-model="where.VARBZ_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未备注" value="0" />
                <el-option label="待处理" value="1" />
                <el-option label="已处理" value="2" />
              </el-select>
            </el-form-item>
          </div>

          <div class="filter-row">
            <el-input
              v-model="where.varietieCode"
              clearable
              placeholder="编码/名称"
              class="kw kw--md"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.Specification_Or_Type"
              clearable
              placeholder="规格型号"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.SCQY"
              clearable
              placeholder="生产企业"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.ZCZ"
              clearable
              placeholder="注册证"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.SUP"
              clearable
              placeholder="供应商"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.Y_M_P_CODE"
              clearable
              placeholder="阳光/医保/省平台编码"
              class="kw kw--lg"
              @keyup.enter.native="reload"
            />
            <el-input
              v-if="!isStseLike"
              v-model="where.CLASS_ONE"
              clearable
              placeholder="设备科目录"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-if="!isStseLike"
              v-model="where.CLASS_TWO"
              clearable
              placeholder="计费目录"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-if="!isStseLike"
              v-model="where.CLASS_THREE"
              clearable
              placeholder="医保目录"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.UDI_TOP"
              clearable
              placeholder="UDI编码"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
            <el-input
              v-model="where.BZ_TI"
              clearable
              placeholder="备注"
              class="kw kw--xs"
              @keyup.enter.native="reload"
            />
            <el-button type="primary" icon="el-icon-search" class="search-btn" @click="reload">
              查询
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';

const STSE_FLOW = ['stse', 'stzl', 'csyy', 'stzyyy', 'chrmyy'];
const STSE_BZ = ['stse', 'csyy', 'stzyyy', 'chrmyy'];

export default {
  name: 'VarietyDataLzhMainSearch',
  data() {
    return {
      checked: false,
      isSzhn: HOME_HP === 'szhn',
      isBd: HOME_HP === 'bd' || HOME_HP === 'bdrm',
      isBdOnly: HOME_HP === 'bd',
      isBdrm: HOME_HP === 'bdrm',
      isStseLike: HOME_HP === 'stse' || HOME_HP === 'se2',
      isStseFlow: STSE_FLOW.includes(HOME_HP),
      isStseBz: STSE_BZ.includes(HOME_HP),
      isFsSync: HOME_HP === 'fsdwrmyy',
      isFsState: HOME_HP === 'fsdwrmyy' || HOME_HP === 'fszxy',
      isFszxy: HOME_HP === 'fszxy',
      jfStateLabel: HOME_HP === 'chrmyy' ? '运营管理状态' : '计费办状态',
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
        enable: '1',
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
        IS_HANG_UP: '0',
        STSEHIS_STATE: '',
        HOSPITAL_SYNC: '',
        VAR_CREATETIMESTART: '',
        VAR_CREATETIMEEND: '',
        CLASS_ONE: '',
        CLASS_TWO: '',
        CLASS_THREE: '',
        CLASSIFIC_PROPERTIES3: ''
      }
    };
  },
  methods: {
    reload() {
      this.where.varietieName = this.where.varietieCode;
      this.where.state = this.isBdOnly && this.checked ? '1' : '0';
      // 南中：查询固定带 CLASSIFIC_PROPERTIES3=1（对齐老系统）
      this.where.CLASSIFIC_PROPERTIES3 = this.isFszxy ? '1' : '';
      this.$emit('search', { ...this.where });
    }
  }
};
</script>

<style scoped>
.variety-search {
  margin-bottom: 8px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: center;
}
.search-row--sub {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed #ebeef5;
}
.cell {
  margin-bottom: 0 !important;
  flex: none;
}

.cell--xs {
  width: 110px;
}
.cell--xs ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
.cell--sm {
  width: 156px;
}
.cell--md {
  width: 180px;
}
.cell--date {
  width: 260px;
}
.cell--auto {
  width: auto;
}

.search-form ::v-deep .el-form-item__label {
  font-size: 12px;
  color: #606266;
  padding-right: 4px;
  white-space: nowrap;
  line-height: 26px;
}
.search-form ::v-deep .el-form-item__content {
  line-height: 26px;
}

.search-form ::v-deep .el-input__inner {
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  font-size: 12px;
}
.search-form ::v-deep .el-input__icon,
.search-form ::v-deep .el-input__suffix {
  line-height: 26px;
}
.search-form ::v-deep .el-input--prefix .el-input__inner {
  padding-left: 24px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 4px;
}
.date-range ::v-deep .el-date-editor.el-input {
  width: 120px;
}
.date-sep {
  color: #c0c4cc;
  flex: none;
  font-size: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #ebeef5;
}
.kw--xs {
  width: 72px;
}
.kw--sm {
  width: 100px;
}
.kw--md {
  width: 120px;
}
.kw--lg {
  width: 160px;
}

.search-btn {
  height: 26px;
  padding: 0 14px;
  font-size: 12px;
}
</style>
