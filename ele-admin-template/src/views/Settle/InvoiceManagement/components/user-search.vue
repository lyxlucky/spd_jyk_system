<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body invoice-management-search">
    <el-form
      size="mini"
      :inline="true"
      label-width="88px"
      class="ele-form-search invoice-search-form"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <div class="filter-row">
        <el-form-item label="是否集采">
          <el-select
            v-model="where.LS_IS_JC"
            clearable
            placeholder="全部"
            style="width: 100px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" class="date-range-item">
          <el-date-picker
            v-model="where.EXAMINE_TIME"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="where.VARIETIE_CODE_NEW"
            clearable
            placeholder="编码/全称"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="发票号">
          <el-input
            v-model="where.MONTHBILLNUM"
            clearable
            placeholder="发票号"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="图片状态">
          <el-select
            v-model="where.PIC_STATE"
            clearable
            placeholder="全部"
            style="width: 100px"
          >
            <el-option label="全部" value="" />
            <el-option label="有图" value="1" />
            <el-option label="无图" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.SUPPLIER_NAME"
            clearable
            placeholder="供应商"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="月结日期" class="date-range-item">
          <el-date-picker
            v-model="where.MONTHLY_TIME"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 220px"
          />
        </el-form-item>
      </div>
      <div class="filter-row filter-row--actions">
        <el-form-item label="允许开票">
          <el-select
            v-model="where.EBS_CAN_SEND_INVOICE"
            clearable
            placeholder="全部"
            style="width: 110px"
            @change="search"
          >
            <el-option label="全部" value="" />
            <el-option label="不允许" value="0" />
            <el-option label="允许" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="一键审批">
          <el-switch v-model="IS_EXAMINE" />
        </el-form-item>
        <el-form-item class="ele-form-actions" label-width="0">
          <el-button type="primary" icon="el-icon-search" @click="search">
            查询
          </el-button>
          <el-popconfirm title="确定取消审批？" @confirm="CancelExamineBtn">
            <template v-slot:reference>
              <el-button type="danger" icon="el-icon-delete">取消审批</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定审批？" @confirm="ExamineBtn">
            <template v-slot:reference>
              <el-button type="primary" icon="el-icon-plus">确定审批</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" icon="el-icon-phone" @click="BillingDdviceBtn(1)">
            通知供应商开票
          </el-button>
          <el-button type="danger" icon="el-icon-delete" @click="BillingDdviceBtn(0)">
            取消开票通知
          </el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportData">
            导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const defaultWhere = {
      LS_IS_JC: '',
      EXAMINE_TIME: [],
      EXAMINE_STATE: '',
      MONTHBILLNUM: '',
      SUPPLIER_NAME: '',
      MONTHLY_TIME: [],
      EBS_CAN_SEND_INVOICE: '',
      QSSTATE: '',
      PIC_STATE: ''
    };
    return {
      defaultWhere,
      where: { ...defaultWhere },
      IS_EXAMINE: false
    };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    CancelExamineBtn() {
      this.$emit('CancelExamineBtn', this.IS_EXAMINE);
    },
    ExamineBtn() {
      this.$emit('ExamineBtn', this.IS_EXAMINE);
    },
    ReceiptInvoiceBtn() {
      this.$emit('ReceiptInvoiceBtn');
    },
    CancelReceiptInvoiceBtn() {
      this.$emit('CancelReceiptInvoiceBtn');
    },
    BillingDdviceBtn(state) {
      this.$emit('BillingDdviceBtn', {
        state,
        IS_EXAMINE: this.IS_EXAMINE
      });
    },
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>

<style scoped lang="scss">
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-row--actions {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.invoice-search-form :deep(.el-form-item:not(.ele-form-actions) .el-form-item__content) {
  max-width: none;
}

.invoice-search-form :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 8px;
}

.invoice-search-form :deep(.el-form-item.ele-form-actions) {
  margin-right: 0;
  flex: 1;
  min-width: 320px;
}

.invoice-search-form :deep(.el-form-item__label) {
  padding-right: 8px;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

.date-range-item :deep(.el-date-editor) {
  width: 220px;
}
</style>
