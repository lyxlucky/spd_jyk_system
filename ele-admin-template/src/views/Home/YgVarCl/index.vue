<template>
  <div class="ele-body spd-page yg-var-cl">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="品种/医保编码">
          <el-input v-model="filters.VARIETIE_CODE_NEW" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.APPROVAL_NUMBER" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="型号规格">
          <el-input v-model="filters.GGXH" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="对码是否一致">
          <el-select v-model="filters.ISDM" clearable style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否收费">
          <el-select v-model="filters.IS_CHARGE" clearable style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="暂挂">
          <el-select v-model="filters.YBBIAOJI" style="width: 90px">
            <el-option label="否" value="0" />
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="供应商">
          <el-input v-model="filters.SUPPLIER_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="基本医保终止日期">
          <el-date-picker
            v-model="filters.YGVARCL_END_START"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="filters.YGVARCL_END_END"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="阳光平台编码">
          <el-input v-model="filters.ygCode" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="filters.REMARK" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            v-model="filters.SENDYB_STATE"
            clearable
            style="width: 150px"
            @change="reload"
          >
            <el-option
              v-for="item in sendYbStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="action-bar">
        <el-button size="small" @click="openApprove(-1)">忽略</el-button>
        <el-button
          v-if="wjButtons.reverse"
          size="small"
          type="danger"
          plain
          @click="openApprove(1)"
        >
          反提交
        </el-button>
        <el-button v-if="wjButtons.screen" size="small" @click="openApprove(2)">初筛</el-button>
        <el-button v-if="wjButtons.confirm" size="small" @click="openApprove(3)">初筛确认</el-button>
        <el-button v-if="wjButtons.purchase" size="small" @click="openApprove(4)">采购审核</el-button>
        <el-button v-if="wjButtons.leader" size="small" @click="openApprove(5)">组长审核</el-button>
        <el-button v-if="wjButtons.director" size="small" @click="openApprove(6)">
          医装部负责人审核
        </el-button>
        <el-button v-if="wjButtons.priceFirst" size="small" @click="openApprove(7)">物价初审</el-button>
        <el-button v-if="wjButtons.priceAccess" size="small" @click="openApprove(10)">
          物价准入审核
        </el-button>
        <el-checkbox v-model="oneKeyMode" class="one-key-mode">一键审批模式</el-checkbox>
        <el-button
          v-if="wjButtons.syncHisCode"
          size="small"
          :loading="syncingHisCode"
          @click="onSyncHisCode"
        >
          同步计费编码
        </el-button>
        <el-button size="small" type="danger" plain @click="onReject">不通过</el-button>
        <el-button size="small" @click="onBiaoji(1)">标记暂挂</el-button>
        <el-button size="small" type="danger" plain @click="onBiaoji(0)">取消暂挂</el-button>
        <el-button
          size="small"
          type="primary"
          plain
          icon="el-icon-download"
          :loading="exporting"
          @click="exportExcel"
        >
          导出
        </el-button>
      </div>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="listWhere"
        :selection.sync="selection"
        :page-size="20"
        :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
        cache-key="YgVarCl"
      >
        <template v-slot:SENDYB_STATE="{ row }">
          {{ formatAuditNode(row.SENDYB_STATE) }}
        </template>
        <template v-slot:YB_SP_MARK="{ row }">
          {{ formatAuditOpinion(row) }}
        </template>
        <template v-slot:LOG_TIME="{ row }">
          {{ formatLogTime(row.LOG_TIME) }}
        </template>
        <template v-slot:IS_CHARGE="{ row }">
          {{ formatIsCharge(row.IS_CHARGE) }}
        </template>
        <template v-slot:YBBIAOJI="{ row }">
          {{ formatYbbiaoji(row.YBBIAOJI) }}
        </template>
        <template v-slot:MEDICAL_CODE="{ row }">
          <span :class="{ 'text-danger': isMedicalCodeMismatch(row) }">
            {{ row.MEDICAL_CODE }}
          </span>
        </template>
        <template v-slot:LAUNCH_DATE_OF_BASIC_MEDICAL="{ row }">
          {{ formatDateOnly(row.LAUNCH_DATE_OF_BASIC_MEDICAL) }}
        </template>
        <template v-slot:TERMINATION_DATE_OF_BASIC_HEAL="{ row }">
          <span
            :class="{
              'text-danger': isTerminationExpired(row.TERMINATION_DATE_OF_BASIC_HEAL)
            }"
          >
            {{ formatDateOnly(row.TERMINATION_DATE_OF_BASIC_HEAL) }}
          </span>
        </template>
      </ele-pro-table>
    </el-card>

    <ApproveRemarkDialog
      :visible.sync="approveVisible"
      :loading="approveSaving"
      :approve-type="pendingApproveType"
      @confirm="onApproveConfirm"
    />
    <RejectRemarkDialog
      :visible.sync="rejectVisible"
      :loading="rejectSaving"
      @confirm="onRejectConfirm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Message, MessageBox } from 'element-ui';
import {
  getYbClInfo,
  tjybspCommit,
  zanGuaCommit,
  appYbClInfoOneKey,
  beiDaHbHisCode
} from '@/api/Home/YgVarCl';
import { buildWjAuth } from './wjAuth';
import {
  defaultFilters,
  SENDYB_STATE_OPTIONS,
  buildColumns,
  buildSimpleCommitRow,
  exportYgVarClExcel,
  formatAuditNode,
  formatAuditOpinion,
  formatIsCharge,
  formatYbbiaoji,
  formatLogTime,
  formatDateOnly,
  isMedicalCodeMismatch,
  isTerminationExpired
} from './utils';
import ApproveRemarkDialog from './components/ApproveRemarkDialog.vue';
import RejectRemarkDialog from './components/RejectRemarkDialog.vue';

export default {
  name: 'YgVarCl',
  components: { ApproveRemarkDialog, RejectRemarkDialog },
  data() {
    return {
      filters: defaultFilters(),
      sendYbStateOptions: SENDYB_STATE_OPTIONS,
      columns: buildColumns(),
      selection: [],
      oneKeyMode: false,
      exporting: false,
      syncingHisCode: false,
      approveVisible: false,
      approveSaving: false,
      pendingApproveType: '',
      rejectVisible: false,
      rejectSaving: false
    };
  },
  computed: {
    ...mapState('user', ['authorities']),
    wjAuthPack() {
      return buildWjAuth(this.authorities || []);
    },
    wjAuthJson() {
      return this.wjAuthPack.wjAuthJson;
    },
    wjButtons() {
      return this.wjAuthPack.buttons;
    },
    listWhere() {
      return { ...this.filters, WJ_AUTH: this.wjAuthJson };
    },
    tableHeight() {
      return 'calc(100vh - 420px)';
    }
  },
  methods: {
    formatAuditNode,
    formatAuditOpinion,
    formatIsCharge,
    formatYbbiaoji,
    formatLogTime,
    formatDateOnly,
    isMedicalCodeMismatch,
    isTerminationExpired,
    datasource({ page, limit, where }) {
      const { WJ_AUTH, ...filters } = where || {};
      return getYbClInfo(filters, page, limit, WJ_AUTH || this.wjAuthJson).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.listWhere } });
    },
    reloadCurrentPage() {
      this.$refs.table.reload({ where: { ...this.listWhere } });
    },
    requireSelection() {
      if (!this.selection.length) {
        Message.warning('请至少选中一行数据');
        return false;
      }
      return true;
    },
    openApprove(type) {
      this.pendingApproveType = type;
      this.approveVisible = true;
    },
    async onApproveConfirm(ybSpMark) {
      const type = this.pendingApproveType;
      if (this.oneKeyMode) {
        this.approveSaving = true;
        try {
          await MessageBox.confirm('确定一键提交当前数据吗？', '提示', { type: 'warning' });
          const res = await appYbClInfoOneKey(this.filters, type, this.wjAuthJson, ybSpMark);
          this.approveVisible = false;
          await MessageBox.alert(res.msg || '操作成功', '提示');
          this.reload();
        } catch (e) {
          if (e !== 'cancel') Message.error(e.message || '操作失败');
        } finally {
          this.approveSaving = false;
        }
        return;
      }
      if (!this.requireSelection()) return;
      this.approveSaving = true;
      try {
        await MessageBox.confirm('确定提交吗？', '提示', { type: 'warning' });
        const rows = this.selection.map(buildSimpleCommitRow);
        const res = await tjybspCommit(rows, type, '', ybSpMark);
        this.approveVisible = false;
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reloadCurrentPage();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.approveSaving = false;
      }
    },
    async onReject() {
      if (this.oneKeyMode) {
        try {
          await MessageBox.confirm('确定一键提交当前数据吗？', '提示', { type: 'warning' });
          const res = await appYbClInfoOneKey(this.filters, -2, this.wjAuthJson, '');
          await MessageBox.alert(res.msg || '操作成功', '提示');
          this.reload();
        } catch (e) {
          if (e !== 'cancel') Message.error(e.message || '操作失败');
        }
        return;
      }
      if (!this.requireSelection()) return;
      this.rejectVisible = true;
    },
    async onRejectConfirm(remark) {
      this.rejectSaving = true;
      try {
        const rows = this.selection.map(buildSimpleCommitRow);
        const res = await tjybspCommit(rows, -2, remark, '');
        this.rejectVisible = false;
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.rejectSaving = false;
      }
    },
    async onBiaoji(type) {
      if (!this.requireSelection()) return;
      try {
        await MessageBox.confirm('确定提交吗？', '提示', { type: 'warning' });
        const rows = this.selection.map(buildSimpleCommitRow);
        const res = await zanGuaCommit(rows, type);
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onSyncHisCode() {
      try {
        await MessageBox.confirm('确定同步计费编码吗？', '提示', { type: 'warning' });
        this.syncingHisCode = true;
        const res = await beiDaHbHisCode();
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.syncingHisCode = false;
      }
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getYbClInfo(this.filters, 1, 999999, this.wjAuthJson);
        exportYgVarClExcel(res.result || []);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.filter-block {
  margin-bottom: 4px;
}
.action-bar {
  margin-bottom: 12px;
}
.action-bar .el-button + .el-button,
.action-bar .el-checkbox {
  margin-left: 8px;
}
.one-key-mode {
  margin-right: 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
