<template>
  <el-dialog
    title="合同到期提醒"
    :visible="visible"
    width="80%"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <div class="expired-certificate-content">
      <p class="warning-text">以下品种合同快到期或已到期，请确认是否继续提交：</p>
      <el-table :data="expiredList" border style="width: 100%" max-height="400">
        <el-table-column
          prop="VarName"
          label="品种名称"
          width="330"
        ></el-table-column>
        <el-table-column
          prop="VarID"
          label="品种编码"
          width="150"
        ></el-table-column>
        <el-table-column prop="GG" label="规格" width="120"></el-table-column>
        <el-table-column
          prop="Manufacturing"
          label="生产企业"
          width="200"
        ></el-table-column>
        <el-table-column label="合同明细到期" width="180">
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
      }
    },
    methods: {
      handleConfirm() {
        this.$emit('confirm');
      },
      handleCancel() {
        this.$emit('cancel');
      },
      handleClose() {
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
