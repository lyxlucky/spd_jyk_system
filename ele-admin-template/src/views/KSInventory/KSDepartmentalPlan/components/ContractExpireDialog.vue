<template>
  <el-dialog
    title="合同到期提醒"
    :visible="visible"
    width="90%"
    top="6vh"
    custom-class="contract-expire-dialog"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <div class="expired-certificate-content">
      <p class="warning-text">
        {{
          warnDays > 0
            ? `以下品种合同已过期或将在 ${warnDays} 天内到期，请确认是否继续提交：`
            : '以下品种合同快到期或已到期，请确认是否继续提交：'
        }}
      </p>
      <el-table
        :data="expiredList"
        border
        stripe
        style="width: 100%"
        max-height="520"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="VarName"
          label="品种名称"
          min-width="260"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="VarID"
          label="品种编码"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="GG"
          label="规格"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Manufacturing"
          label="生产企业"
          min-width="220"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="合同明细到期" min-width="200">
          <template slot-scope="scope">
            <span :class="dateClass(scope.row)">
              {{ formatDate(scope.row.DET_CONTRACT_END) }}
              {{ scope.row.remainText }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ContractExpireDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      expiredList: {
        type: Array,
        default: () => []
      },
      warnDays: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        closingByAction: false
      };
    },
    watch: {
      visible(val) {
        if (val) {
          this.closingByAction = false;
        }
      }
    },
    methods: {
      handleConfirm() {
        this.closingByAction = true;
        this.$emit('confirm');
      },
      handleCancel() {
        this.closingByAction = true;
        this.$emit('cancel');
      },
      handleClose() {
        if (this.closingByAction) {
          this.closingByAction = false;
          return;
        }
        this.$emit('cancel');
      },
      dateClass(row) {
        if (row.expired) return 'expired-date';
        return 'soon-date';
      },
      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        return y + '-' + m + '-' + d;
      }
    }
  };
</script>

<style scoped>
  .expired-certificate-content {
    padding: 10px 0;
  }

  .warning-text {
    color: #e6a23c;
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .dialog-footer {
    text-align: right;
  }

  .expired-date {
    color: #f56c6c;
    font-weight: bold;
  }

  .soon-date {
    color: #ff5722;
    font-weight: bold;
  }
</style>
