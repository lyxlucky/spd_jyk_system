<template>
  <div class="variety-search">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
        <el-form size="mini" class="search-form" label-position="left" label-width="auto" @submit.native.prevent>
          <div class="search-row">
            <el-form-item class="cell cell--xs">
              <el-select v-model="where.vdzh_sx" clearable placeholder="品种筛选">
                <el-option label="全部筛选" value="0" />
                <el-option label="防控物资" value="1" />
                <el-option label="阳光采购平台品种" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="高低值" class="cell cell--sm">
              <el-select v-model="where.HIGH_OR_LOW_CLASS" clearable placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="高值" value="1" />
                <el-option label="低值" value="0" />
                <el-option label="试剂" value="2" />
                <el-option label="消毒" value="3" />
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

            <el-form-item v-if="!isStse" label="设备科修改" class="cell cell--sm">
              <el-select v-model="where.IS_EQUIPMENT_CHANGE" clearable placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="启用状态" class="cell cell--sm">
              <el-select v-model="where.enable" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="对码是否一致" class="cell cell--sm">
              <el-select v-model="where.IS_YBDM" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="一致" value="1" />
                <el-option label="不一致" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="showApprovalFilter" label="审批状态" class="cell cell--sm">
              <el-select v-model="where.APPROVAL_STATE" clearable placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="审批通过" value="1" />
                <el-option label="待审批" value="0" />
                <el-option label="未通过" value="2" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="showKubaoFilter" class="cell cell--auto">
              <el-checkbox v-model="where.filterKubao">过滤非库宝品种</el-checkbox>
            </el-form-item>

            <template v-if="isStse">
              <el-form-item label="SPD审批" class="cell cell--sm">
                <el-select v-model="where.VARSPD_STATE" clearable placeholder="请选择">
                  <el-option label="全部" value="" />
                  <el-option label="维护" value="0" />
                  <el-option label="修改" value="1" />
                  <el-option label="提交" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="设备科" class="cell cell--sm">
                <el-select v-model="where.VARSB_STATE" clearable placeholder="请选择">
                  <el-option label="全部" value="" />
                  <el-option label="维护" value="0" />
                  <el-option label="修改" value="1" />
                  <el-option label="提交" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="计费办" class="cell cell--sm">
                <el-select v-model="where.VARJF_STATE" clearable placeholder="请选择">
                  <el-option label="全部" value="" />
                  <el-option label="维护" value="0" />
                  <el-option label="修改" value="1" />
                  <el-option label="提交" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="医保办" class="cell cell--sm">
                <el-select v-model="where.VARYB_STATE" clearable placeholder="请选择">
                  <el-option label="全部" value="" />
                  <el-option label="维护" value="0" />
                  <el-option label="修改" value="1" />
                  <el-option label="提交" value="2" />
                </el-select>
              </el-form-item>
            </template>
          </div>

          <div class="filter-row">
            <el-input
              v-model="where.varietieCode"
              clearable
              placeholder="品种/医保/阳光编码或名称"
              class="kw kw--lg"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.Specification_Or_Type"
              clearable
              placeholder="规格型号"
              class="kw kw--sm"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.SCQY"
              clearable
              placeholder="生产企业"
              class="kw kw--sm"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.ZCZ"
              clearable
              placeholder="注册证"
              class="kw kw--sm"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.SUP"
              clearable
              placeholder="供应商"
              class="kw kw--sm"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.Y_M_P_CODE"
              clearable
              placeholder="阳光/医保/省平台编码"
              class="kw kw--lg"
              @keyup.enter.native="handleSearch"
            />
            <el-input
              v-model="where.UDI_TOP"
              clearable
              placeholder="UDI编码"
              class="kw kw--sm"
              @keyup.enter.native="handleSearch"
            />
            <el-button type="primary" icon="el-icon-search" class="search-btn" @click="handleSearch">
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
import { createDefaultWhere, isStseLikeHp, showVarCommitApproval } from '../utils';

export default {
  name: 'VarietyHealthCodeSearch',
  data() {
    return {
      where: createDefaultWhere(),
      isStse: isStseLikeHp(HOME_HP),
      showKubaoFilter: HOME_HP === 'bd'
    };
  },
  computed: {
    showApprovalFilter() {
      return showVarCommitApproval(this.$store);
    }
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
  margin-bottom: 0;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: center;
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
  width: 168px;
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

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.kw--sm {
  width: 100px;
}
.kw--lg {
  width: 180px;
}

.search-btn {
  height: 26px;
  padding: 0 14px;
  font-size: 12px;
}
</style>
