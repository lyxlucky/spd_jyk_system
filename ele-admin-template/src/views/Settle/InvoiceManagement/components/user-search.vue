<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 16 }">
        <label>
          是否集采:
          <el-select style="width: 140px;" v-model="where.LS_IS_JC" size="mini" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 9 }">
        <label>
          审核日期:
          <el-date-picker style="width:220px" v-model="where.EXAMINE_TIME" type="daterange" value-format="yyyy-MM-dd" size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.VARIETIE_CODE_NEW" placeholder="品种(材料)编码、品种全称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 16 }">
        <label>
          中心库发票签收:
          <el-select style="width: 100px;" v-model="where.QSSTATE" size="mini" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.MONTHBILLNUM" placeholder="发票号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.SUPPLIER_NAME" placeholder="供应商" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 9 }">
        <label>
          月结日期:
          <el-date-picker style="width:220px" v-model="where.MONTHLY_TIME" type="daterange" value-format="yyyy-MM-dd" size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </label>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top: 10px;">
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <label>
          供应商是否允许开票：
          <el-select style="width: 140px;" v-model="where.EBS_CAN_SEND_INVOICE" size="mini" placeholder="请选择状态">
            <el-option label="不允许开票" value="0"></el-option>
            <el-option label="允许开票" value="1"></el-option>
          </el-select>
        </label>
        <label>一键审批</label>
        <el-switch v-model="IS_EXAMINE"></el-switch>
      </el-col>
      
      <el-col v-bind="styleResponsive ? { lg: 15, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-popconfirm class="ele-action" title="确定取消审批？" @confirm="CancelExamineBtn()">
            <template v-slot:reference>
              <el-button type="warning" size="mini">取消审批</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm class="ele-action" title="确定审批？" @confirm="ExamineBtn()">
            <template v-slot:reference>
              <el-button type="success" size="mini">确定审批</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm class="ele-action" title="确定发票签收？" @confirm="ReceiptInvoiceBtn()">
            <template v-slot:reference>
              <el-button type="success" size="mini">发票签收</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm class="ele-action" title="确定取消签收？" @confirm="CancelReceiptInvoiceBtn()">
            <template v-slot:reference>
              <el-button type="warning" size="mini">取消签收</el-button>
            </template>
          </el-popconfirm>

          <el-button type="success" size="mini" @click="BillingDdviceBtn(1)">通知供应商开票通知</el-button>
          <el-button type="warning" size="mini" @click="BillingDdviceBtn(0)">取消供应商开票通知</el-button>
          <el-button type="success" size="mini" icon="el-icon-download" @click="exportData()">导出</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      LS_IS_JC: '',
      EXAMINE_TIME: [],
      EXAMINE_STATE: '',
      MONTHBILLNUM: '',
      SUPPLIER_NAME: '',
      MONTHLY_TIME: [],
      EBS_CAN_SEND_INVOICE: '0'
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      IS_EXAMINE: false
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  methods: {
    /* 搜索 */
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
    BillingDdviceBtn(data) {
      this.$emit('BillingDdviceBtn', data);
    },
    /*  重置 */
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
