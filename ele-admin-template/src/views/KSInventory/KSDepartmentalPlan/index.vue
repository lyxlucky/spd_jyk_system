<template>
  <div class="ele-body spd-page ks-dept-plan-page">
    <div class="ks-dept-plan-page__scroll">
      <div class="ks-dept-plan-page__inner">
        <el-container class="ks-dept-plan-container">
          <el-header height="auto" class="ks-dept-plan-header">
            <el-card shadow="never" class="ks-dept-plan-card">
              <KSDepartmentalPlantable
                ref="table1"
                :IsReload="IsReloadTag"
                @getCurrent="getCurrent"
              />
            </el-card>
          </el-header>
          <el-main class="ks-dept-plan-main-wrap">
            <el-card shadow="never" class="ks-dept-plan-card">
              <KSDepartmentalPlanDetailstable2
                v-if="isActive"
                :KSDepartmentalPlanData="KSDepartmentalPlanData"
                @clickReload="clickReload"
                @clickReload2="clickReload2"
              />
            </el-card>
          </el-main>
        </el-container>
      </div>
    </div>
    <el-dialog
      title="科室目录合同到期提醒"
      :visible.sync="contractExpiryVisible"
      width="90%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-alert
        :title="`当前科室目录有 ${contractExpiryTotal} 条品种合同已过期（红底）或将在未来两个月内到期（黄底），请及时处理。`"
        type="warning"
        show-icon
        :closable="false"
      />
      <el-table
        v-loading="contractExpiryLoading"
        :data="contractExpiryRows"
        :cell-style="contractExpiryCellStyle"
        border
        max-height="420"
      >
        <el-table-column type="index" :index="contractExpiryIndex" label="序号" width="60" />
        <el-table-column label="到期状态" width="100">
          <template slot-scope="{ row }">
            {{ row.Expiry_Status === 'expired' ? '已过期' : '即将到期' }}
          </template>
        </el-table-column>
        <el-table-column prop="Varietie_Code_New" label="品种编码" min-width="120" />
        <el-table-column prop="Varietie_Name" label="品种名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="规格型号" min-width="160" show-overflow-tooltip />
        <el-table-column label="合同编号" min-width="140" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ row.Hosp_Contract_Code || row.Contract_Code }}
          </template>
        </el-table-column>
        <el-table-column prop="Contract_Name" label="合同名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="Supplier_Name" label="供应商" min-width="180" show-overflow-tooltip />
        <el-table-column prop="Contract_End_Time" label="主合同到期日期" width="140" />
      </el-table>
      <el-pagination
        class="ele-pagination-circle"
        :current-page="contractExpiryPage"
        :page-size="contractExpiryPageSize"
        :page-sizes="[50, 100, 200]"
        :total="contractExpiryTotal"
        :disabled="contractExpiryLoading"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleContractExpirySizeChange"
        @current-change="handleContractExpiryPageChange"
      />
      <span slot="footer">
        <el-button type="primary" @click="contractExpiryVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KSDepartmentalPlantable from './components/KSDepartmentalPlan-table1.vue';
import KSDepartmentalPlanDetailstable2 from './components/KSDepartmentalPlanDetails-table2';
import { getDeptContractExpiryReminders } from '@/api/KSInventory/KSDepartmentalPlan';

export default {
  name: 'KSDepartmentalPlan',
  components: {
    KSDepartmentalPlantable,
    KSDepartmentalPlanDetailstable2
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      KSDepartmentalPlanData: {},
      isActive: true,
      IsReloadTag: false,
      contractExpiryVisible: false,
      contractExpiryRows: [],
      contractExpiryTotal: 0,
      contractExpiryLoading: false,
      contractExpiryPage: 1,
      contractExpiryPageSize: 50,
      contractExpiryPageActive: false,
      contractExpiryRequestId: 0
    };
  },
  computed: {
    currentDeptTwoCode() {
      const info = this.$store.state.user.info;
      return (info && info.DeptNow && info.DeptNow.Dept_Two_Code) || '';
    }
  },
  mounted() {
    this.contractExpiryPageActive = true;
    this.loadContractExpiryReminders();
  },
  activated() {
    if (!this.contractExpiryPageActive) {
      this.contractExpiryPageActive = true;
      this.loadContractExpiryReminders();
    }
  },
  deactivated() {
    this.contractExpiryPageActive = false;
    this.contractExpiryRequestId++;
    this.contractExpiryVisible = false;
    this.contractExpiryLoading = false;
  },
  beforeDestroy() {
    this.contractExpiryPageActive = false;
    this.contractExpiryRequestId++;
    this.contractExpiryVisible = false;
    this.contractExpiryLoading = false;
  },
  methods: {
    contractExpiryIndex(index) {
      return (this.contractExpiryPage - 1) * this.contractExpiryPageSize + index + 1;
    },
    handleContractExpirySizeChange(size) {
      if (size === this.contractExpiryPageSize) {
        return;
      }
      this.contractExpiryPageSize = size;
      this.contractExpiryPage = 1;
      return this.loadContractExpiryReminders(false);
    },
    handleContractExpiryPageChange(page) {
      if (page === this.contractExpiryPage) {
        return;
      }
      this.contractExpiryPage = page;
      return this.loadContractExpiryReminders(false);
    },
    contractExpiryCellStyle({ row }) {
      if (row.Expiry_Status === 'expired') {
        return { backgroundColor: '#fde2e2' };
      }
      if (row.Expiry_Status === 'expiring') {
        return { backgroundColor: '#fff3cd' };
      }
      return {};
    },
    async loadContractExpiryReminders(resetPage = true) {
      const requestId = ++this.contractExpiryRequestId;
      const deptTwoCode = this.currentDeptTwoCode;
      this.contractExpiryRows = [];
      if (resetPage) {
        this.contractExpiryVisible = false;
        this.contractExpiryTotal = 0;
        this.contractExpiryPage = 1;
      }
      if (!this.contractExpiryPageActive || !deptTwoCode) {
        this.contractExpiryLoading = false;
        return;
      }
      this.contractExpiryLoading = true;
      try {
        const data = await getDeptContractExpiryReminders(
          deptTwoCode,
          this.contractExpiryPage,
          this.contractExpiryPageSize
        );
        if (
          requestId !== this.contractExpiryRequestId ||
          !this.contractExpiryPageActive ||
          deptTwoCode !== this.currentDeptTwoCode
        ) {
          return;
        }
        this.contractExpiryRows = data.result || [];
        this.contractExpiryTotal = Number(data.total) || 0;
        const lastPage = Math.max(1, Math.ceil(this.contractExpiryTotal / this.contractExpiryPageSize));
        if (this.contractExpiryTotal > 0 && this.contractExpiryPage > lastPage) {
          this.contractExpiryPage = lastPage;
          return this.loadContractExpiryReminders(false);
        }
        if (resetPage || this.contractExpiryTotal === 0) {
          this.contractExpiryVisible = this.contractExpiryTotal > 0;
        }
      } catch (error) {
        if (
          requestId === this.contractExpiryRequestId &&
          this.contractExpiryPageActive &&
          deptTwoCode === this.currentDeptTwoCode
        ) {
          this.$message.warning('获取科室目录合同到期提醒失败，请稍后重新进入页面重试');
        }
      } finally {
        if (requestId === this.contractExpiryRequestId) {
          this.contractExpiryLoading = false;
        }
      }
    },
    getCurrent(data) {
      this.KSDepartmentalPlanData = data;
    },
    reload() {
      this.isActive = false;
      this.$nextTick(() => {
        this.isActive = true;
      });
    },
    clickReload(data) {
      this.IsReloadTag = data;
    },
    clickReload2() {
      this.$refs.table1.reload2();
    }
  },
  watch: {
    currentDeptTwoCode() {
      if (this.contractExpiryPageActive) {
        this.loadContractExpiryReminders();
      }
    },
    IsReload() {}
  }
};
</script>

<style lang="scss" scoped>
.ks-dept-plan-page {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 覆盖全局 .spd-page min-width，避免整页被撑出横向大空白 */
  min-width: 0 !important;

  :deep(.el-table th .cell) {
    white-space: nowrap;
  }

  /* 查询区占满视口宽；按钮区 100% 宽后才会触发换行 */
  :deep(.ele-form-search.el-form--inline) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  :deep(.ele-form-search .el-form-item) {
    flex-shrink: 0;
    margin-right: 10px;
    margin-bottom: 6px;
  }

  /* 操作按钮单独占满一行宽度，超出换行，不再跟着宽表横向拉长 */
  :deep(.ele-form-actions.el-form-item) {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin-right: 0 !important;
  }

  :deep(.ele-form-actions .el-form-item__content) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    gap: 6px;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 只有表格区域横向滚动，查询/按钮区保持视口宽度 */
  :deep(.spd-table-panel__wrap) {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  :deep(.spd-table-panel__wrap .el-table) {
    width: max-content;
    min-width: 100%;
  }
}

.ks-dept-plan-page__scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.ks-dept-plan-page__inner {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ks-dept-plan-container {
  width: 100%;
  min-width: 0;
}

.ks-dept-plan-card {
  width: 100%;
  max-width: 100%;
}

.ks-dept-plan-card :deep(.el-card__body) {
  padding: 10px;
  overflow: visible;
}

.ks-dept-plan-header {
  padding: 0;
  overflow: visible !important;
}

.ks-dept-plan-main-wrap {
  padding: 0 0 10px;
  overflow: visible !important;
}
</style>
