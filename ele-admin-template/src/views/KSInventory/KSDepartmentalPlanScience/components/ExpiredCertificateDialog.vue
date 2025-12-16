<template>
  <el-dialog
    title="证件到期提醒"
    :visible="visible"
    width="80%"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <div class="expired-certificate-content">
      <p class="warning-text">以下品种的证件已到期，请确认是否继续提交：</p>
      <el-table :data="expiredList" border style="width: 100%" max-height="400">
        <el-table-column
          prop="VarName"
          label="品种名称"
          width="200"
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
        <el-table-column label="注册证到期时间" width="150">
          <template slot-scope="scope">
            <span
              :class="{
                'expired-date': isExpired(
                  scope.row.RegistrationCertificateExpiry
                )
              }"
            >
              {{ formatDate(scope.row.RegistrationCertificateExpiry) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="生产许可证到期时间" width="150">
          <template slot-scope="scope">
            <span
              :class="{
                'expired-date': isExpired(scope.row.ProductionLicenseExpiry)
              }"
            >
              {{ formatDate(scope.row.ProductionLicenseExpiry) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="品种授权到期时间" width="150">
          <template slot-scope="scope">
            <span
              :class="{
                'expired-date': isExpired(scope.row.VarietyAuthorizationExpiry)
              }"
            >
              {{ formatDate(scope.row.VarietyAuthorizationExpiry) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="供应商经营许可证到期时间" width="180">
          <template slot-scope="scope">
            <span
              :class="{
                'expired-date': isExpired(
                  scope.row.SupplierBusinessLicenseExpiry
                )
              }"
            >
              {{ formatDate(scope.row.SupplierBusinessLicenseExpiry) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="集配商经营许可证到期时间" width="180">
          <template slot-scope="scope">
            <span
              :class="{
                'expired-date': isExpired(
                  scope.row.DistributorBusinessLicenseExpiry
                )
              }"
            >
              {{ formatDate(scope.row.DistributorBusinessLicenseExpiry) }}
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
    name: 'ExpiredCertificateDialog',
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
      // 检查日期是否已过期
      isExpired(dateString) {
        if (!dateString) return false;
        const expiry = new Date(dateString);
        const currentDate = new Date();
        return expiry <= currentDate;
      },
      // 格式化日期显示
      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
</style>
