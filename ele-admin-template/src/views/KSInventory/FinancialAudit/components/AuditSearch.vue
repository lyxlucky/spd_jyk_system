<template>
  <div class="audit-search">
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="品种">
        <el-input v-model="where.VarietieCode" clearable placeholder="编码/名称" style="width: 140px" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="where.Supplier" clearable placeholder="供应商" style="width: 180px" />
      </el-form-item>
      <el-form-item label="发票">
        <el-input v-model="where.Monthbillnum" clearable placeholder="发票号" style="width: 120px" />
      </el-form-item>
      <el-form-item label="月结开始">
        <el-date-picker v-model="where.StartDate" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="月结结束">
        <el-date-picker v-model="where.EndDate" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="where.State" style="width: 100px">
          <el-option label="全部" value="-1" />
          <el-option label="已审批" value="1" />
          <el-option label="未审批" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="flags.isBd" label="微讯通月份">
        <el-input v-model="where.SEND_WXT_MARK" clearable placeholder="yyyyMM" style="width: 100px" />
      </el-form-item>
      <el-form-item v-if="flags.isBd" label="微讯通">
        <el-select v-model="where.isSendWxt" style="width: 120px">
          <el-option label="微讯通-全部" value="-1" />
          <el-option label="微讯通-已发送" value="1" />
          <el-option label="微讯通-未发送" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="flags.isHptx" label="货票同行">
        <el-select v-model="where.isHptx" style="width: 90px">
          <el-option label="全部" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="flags.isHptx" label="发票签收">
        <el-select v-model="where.isFPQS" style="width: 100px">
          <el-option label="全部" value="" />
          <el-option label="已签收" value="1" />
          <el-option label="未签收" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="阳光订单">
        <el-select v-model="where.isYG" style="width: 90px">
          <el-option label="全部" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="带量采购">
        <el-select v-model="where.isDL" style="width: 90px">
          <el-option label="全部" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="高低值">
        <el-select v-model="where.highOrLowClass" style="width: 90px">
          <el-option label="全部" value="-1" />
          <el-option label="高值" value="1" />
          <el-option label="低值" value="0" />
          <el-option label="试剂" value="2" />
          <el-option label="消毒" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="flags.isSzse" label="入库类型">
        <el-select v-model="where.orderJsType" style="width: 200px">
          <el-option label="全部" value="" />
          <el-option label="普通" value="0" />
          <el-option label="临购" value="1" />
          <el-option label="临购初始化（医院货主）" value="2" />
          <el-option label="原HERP库存初始化（医院货主）" value="3" />
          <el-option label="经费入库" value="4" />
          <el-option label="初始化一出已结算" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="审批开始">
        <el-date-picker v-model="where.spStartDate" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="审批结束">
        <el-date-picker v-model="where.spEndDate" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="$emit('search', getWhere())">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="actions">
      <el-button v-if="flags.showQrSp" size="mini" type="primary" plain :loading="loadingAudit" @click="$emit('confirm-audit')">确认审批</el-button>
      <el-button size="mini" type="danger" plain :loading="loadingAuditNo" @click="$emit('cancel-audit')">取消审批</el-button>
      <el-button size="mini" type="primary" :loading="loadingFpqs" @click="$emit('fpqs')">发票签收</el-button>
      <el-button size="mini" type="warning" plain :loading="loadingCancelFpqs" @click="$emit('cancel-fpqs')">取消签收</el-button>
      <el-button size="mini" type="danger" plain @click="$emit('cancel-invoice')">取消发票</el-button>
      <el-button size="mini" type="primary" plain :loading="exporting" @click="$emit('export-data')">导出</el-button>
      <el-button size="mini" type="primary" plain :loading="exportingQs" @click="$emit('export-fpqs')">签收导出</el-button>
      <el-button size="mini" type="primary" plain :loading="exportingMonth" @click="$emit('export-month')">月结汇总导出</el-button>
      <el-button size="mini" @click="$emit('sync-yg')">同步阳光平台订单</el-button>
      <el-button size="mini" @click="$emit('send-hop')">发送HOP</el-button>
    </div>
  </div>
</template>

<script>
import { hpFlags } from '../utils';

function defaultWhere() {
  return {
    VarietieCode: '',
    Supplier: '',
    Monthbillnum: '',
    StartDate: '',
    EndDate: '',
    State: '-1',
    SEND_WXT_MARK: '',
    isSendWxt: '-1',
    isHptx: '',
    isFPQS: '',
    isYG: '',
    isDL: '',
    highOrLowClass: '-1',
    orderJsType: '',
    spStartDate: '',
    spEndDate: '',
    SaleNum: ''
  };
}

export default {
  name: 'AuditSearch',
  props: {
    loadingFpqs: Boolean,
    loadingCancelFpqs: Boolean,
    loadingAudit: Boolean,
    loadingAuditNo: Boolean,
    exporting: Boolean,
    exportingQs: Boolean,
    exportingMonth: Boolean
  },
  data() {
    return {
      where: defaultWhere(),
      flags: hpFlags
    };
  },
  methods: {
    getWhere() {
      return { ...this.where };
    },
    reset() {
      this.where = defaultWhere();
      this.$emit('search', this.getWhere());
    }
  }
};
</script>

<style scoped>
.audit-search {
  margin-bottom: 8px;
}
.actions {
  margin-bottom: 8px;
}
.actions .el-button {
  margin: 0 6px 6px 0;
}
</style>
