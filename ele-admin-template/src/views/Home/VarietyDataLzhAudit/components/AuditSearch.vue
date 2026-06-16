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
              <el-option label="防控物资" value="1" />
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
          <el-form-item v-if="!isStse" label="设备科修改">
            <el-select v-model="where.IS_EQUIPMENT_CHANGE" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="-1" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-select v-model="where.enable" clearable placeholder="请选择" style="width: 90px">
              <el-option label="全部" value="" />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
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
              value-format="yyyy-MM-dd"
              placeholder="开始"
              style="width: 120px"
            />
            <span class="filter-range-sep">至</span>
            <el-date-picker
              v-model="where.priceChangeTimeEnd"
              type="date"
              value-format="yyyy-MM-dd"
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
          <el-form-item v-if="showKubaoFilter" label="库宝过滤">
            <el-checkbox v-model="where.filterKubao">过滤非库宝品种</el-checkbox>
          </el-form-item>
        </el-form>

        <el-form
          v-if="isStse"
          :inline="true"
          size="mini"
          label-width="96px"
          class="filter-row filter-row--labeled"
          @submit.native.prevent
        >
          <el-form-item label="SPD审批">
            <el-select v-model="where.VARSPD_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备科">
            <el-select v-model="where.VARSB_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="计费办">
            <el-select v-model="where.VARJF_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="医保办">
            <el-select v-model="where.VARYB_STATE" clearable placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="where.varietieCode"
              clearable
              placeholder="编码/名称"
              style="width: 140px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.Specification_Or_Type"
              clearable
              placeholder="规格型号"
              style="width: 120px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.SCQY"
              clearable
              placeholder="生产企业"
              style="width: 120px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.ZCZ"
              clearable
              placeholder="注册证"
              style="width: 110px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.SUP"
              clearable
              placeholder="供应商"
              style="width: 110px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.Y_M_P_CODE"
              clearable
              placeholder="阳光/医保/省平台编码"
              style="width: 160px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.UDI_TOP"
              clearable
              placeholder="UDI编码"
              style="width: 120px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { createDefaultWhere } from '../utils';

export default {
  name: 'VarietyDataLzhAuditSearch',
  data() {
    return {
      where: createDefaultWhere(),
      isStse: HOME_HP === 'stse',
      showKubaoFilter: HOME_HP === 'bd'
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleSearch() {
      this.$emit('search', { ...this.where });
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
