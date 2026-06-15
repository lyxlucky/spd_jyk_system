<template>
  <el-card shadow="never" class="search-card">
    <el-form size="mini" class="ele-form-search" @submit.native.prevent>
      <el-row :gutter="8" type="flex" style="flex-wrap: wrap">
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item>
            <el-select v-model="where.vdzh_sx" placeholder="全部筛选" style="width: 100%">
              <el-option label="全部筛选" value="0" />
              <el-option label="防控物资" value="1" />
              <el-option label="阳光采购平台品种" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="3" :md="6" :sm="12">
          <el-form-item label="高低值分类">
            <el-select v-model="where.HIGH_OR_LOW_CLASS" style="width: 100%">
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
            <el-select v-model="where.HIGH_OR_LOW_CLASS_TWO" style="width: 100%">
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
        <el-col v-if="!isStse" :lg="3" :md="6" :sm="12">
          <el-form-item label="设备科是否修改">
            <el-select v-model="where.IS_EQUIPMENT_CHANGE" style="width: 100%">
              <el-option label="全部" value="-1" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="启用状态">
            <el-select v-model="where.enable" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="停用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12">
          <el-form-item label="审批时间">
            <el-date-picker
              v-model="where.priceChangeTimeStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始"
              style="width: 48%"
            />
            <el-date-picker
              v-model="where.priceChangeTimeEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束"
              style="width: 48%; margin-left: 4%"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="审批状态">
            <el-select v-model="where.APPROVAL_STATE" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="审批通过" value="1" />
              <el-option label="待审批" value="0" />
              <el-option label="未通过" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="showKubaoFilter" :lg="3" :md="6" :sm="12">
          <el-form-item>
            <el-checkbox v-model="where.filterKubao">是否过滤非库宝品种</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isStse" :gutter="8" type="flex" style="flex-wrap: wrap">
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="SPD审批">
            <el-select v-model="where.VARSPD_STATE" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="设备科">
            <el-select v-model="where.VARSB_STATE" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="计费办">
            <el-select v-model="where.VARJF_STATE" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-form-item label="医保办">
            <el-select v-model="where.VARYB_STATE" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="维护" value="0" />
              <el-option label="修改" value="1" />
              <el-option label="提交" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="8" type="flex" style="flex-wrap: wrap; align-items: center">
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.varietieCode" placeholder="编码/名称" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.Specification_Or_Type" placeholder="规格型号" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.SCQY" placeholder="生产企业" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.ZCZ" placeholder="注册证" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.SUP" placeholder="供应商" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="3" :md="6" :sm="12">
          <el-input v-model="where.Y_M_P_CODE" placeholder="阳光/医保/省平台编码" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-input v-model="where.UDI_TOP" placeholder="UDI编码" clearable @keyup.enter.native="handleSearch" />
        </el-col>
        <el-col :lg="2" :md="4" :sm="8">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
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
.search-card {
  margin-bottom: 0;
}
.search-card ::v-deep .el-card__body {
  padding: 12px 12px 4px;
}
.ele-form-search ::v-deep .el-form-item {
  margin-bottom: 8px;
}
</style>
