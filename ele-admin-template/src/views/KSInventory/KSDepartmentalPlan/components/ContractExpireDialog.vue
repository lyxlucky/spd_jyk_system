<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="90%"
    top="6vh"
    custom-class="contract-expire-dialog"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <div class="expired-certificate-content">
      <p :class="['warning-text', { 'warning-text--danger': hasExpired }]">
        {{ warningText }}
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
        <el-table-column label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.expired ? 'danger' : 'warning'"
            >
              {{ scope.row.expired ? '已过期' : '快到期' }}
            </el-tag>
          </template>
        </el-table-column>
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
      <template v-if="hasExpired">
        <el-button type="primary" @click="handleCancel">我知道了</el-button>
      </template>
      <template v-else>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认提交</el-button>
      </template>
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
    computed: {
      expiredItems() {
        return (this.expiredList || []).filter((item) => item && item.expired);
      },
      expiringItems() {
        return (this.expiredList || []).filter((item) => item && !item.expired);
      },
      hasExpired() {
        return this.expiredItems.length > 0;
      },
      dialogTitle() {
        return this.hasExpired ? '合同已过期提醒' : '合同近效期提醒';
      },
      warningText() {
        if (this.hasExpired && this.expiringItems.length > 0) {
          const daysText =
            this.warnDays > 0 ? `将在 ${this.warnDays} 天内到期` : '快到期';
          return `以下品种包含 ${this.expiredItems.length} 条合同已过期、${this.expiringItems.length} 条${daysText}；合同已过期品种不能提交，请先处理已过期品种后再提交：`;
        }
        if (this.hasExpired) {
          return `以下 ${this.expiredItems.length} 条品种合同已过期，不能提交，请先删除已过期品种或更新合同后再提交：`;
        }
        if (this.warnDays > 0) {
          return `以下 ${this.expiringItems.length} 条品种合同将在 ${this.warnDays} 天内到期，请确认是否继续提交：`;
        }
        return '以下品种合同快到期，请确认是否继续提交：';
      }
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
        if (this.hasExpired) return;
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

  .warning-text--danger {
    color: #f56c6c;
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
