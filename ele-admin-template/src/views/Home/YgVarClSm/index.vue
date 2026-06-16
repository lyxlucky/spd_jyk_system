<template>
  <div class="ele-body spd-page yg-var-cl-sm">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="品种/医保编码">
          <el-input v-model="filters.VARIETIE_CODE_NEW" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.APPROVAL_NUMBER" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="注册证名称">
          <el-input v-model="filters.APPROVAL_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="型号规格">
          <el-input v-model="filters.GGXH" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="filters.SOURCE_FROM" clearable style="width: 120px" />
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
          <el-select v-model="filters.YBBIAOJI" clearable style="width: 90px">
            <el-option label="否" value="0" />
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.TYPE" clearable style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="新增" value="0" />
            <el-option label="调价" value="2" />
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
          <el-select v-model="filters.SENDYB_STATE" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="未初筛" value="1" />
            <el-option label="已初筛" value="2" />
            <el-option label="初筛已确认" value="3" />
            <el-option label="耗材组采购已审核" value="4" />
            <el-option label="耗材组库管已审核" value="5" />
            <el-option label="物价已准入" value="6" />
            <el-option label="已推送至HIS" value="11" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="action-bar">
        <el-button size="small" @click="onApprove(-1)">忽略</el-button>
        <el-button v-if="wjButtons.reverse" size="small" type="danger" plain @click="onApprove(1)">
          反提交
        </el-button>
        <el-button v-if="wjButtons.screen" size="small" @click="onApprove(2)">初筛</el-button>
        <el-button v-if="wjButtons.confirm" size="small" @click="onApprove(3)">初筛确认</el-button>
        <el-button v-if="wjButtons.purchase" size="small" @click="onApprove(4)">耗材组采购审核</el-button>
        <el-button v-if="wjButtons.warehouse" size="small" @click="onApprove(5)">耗材组库管审核</el-button>
        <el-button v-if="wjButtons.access" size="small" @click="onApprove(6)">物价准入审核</el-button>
        <el-checkbox v-model="oneKeyMode" class="one-key-mode">一键审批模式</el-checkbox>
        <el-button size="small" :loading="syncingHisCode" @click="onSyncHisCode">同步计费编码</el-button>
        <el-button size="small" :loading="sendingHis" @click="onSendHis">准入推送至his</el-button>
        <el-button size="small" type="danger" plain @click="openReject">不通过</el-button>
        <el-button size="small" @click="openRemark">备注</el-button>
        <el-button size="small" @click="onBiaoji(1)">标记暂挂</el-button>
        <el-button size="small" type="danger" plain @click="onBiaoji(0)">取消暂挂</el-button>
        <el-button
          v-permission="'export-YGVARCL_SM-shmldc'"
          size="small"
          type="primary"
          plain
          :loading="exporting"
          @click="exportExcel"
        >
          导出
        </el-button>
        <el-button size="small" @click="openUpdateType">修改提交类型</el-button>
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
        cache-key="YgVarClSm"
      >
        <template v-slot:SENDYB_STATE="{ row }">
          {{ formatSendYbState(row.SENDYB_STATE) }}
        </template>
        <template v-slot:LOG_TIME="{ row }">
          {{ formatLogTime(row.LOG_TIME) }}
        </template>
        <template v-slot:SENDYB_TYPE="{ row }">
          {{ formatSendYbType(row.SENDYB_TYPE) }}
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

    <RejectRemarkDialog
      :visible.sync="rejectVisible"
      :loading="rejectSaving"
      @confirm="onRejectConfirm"
    />
    <UpdateSubmitTypeDialog
      :visible.sync="updateTypeVisible"
      :loading="updateTypeSaving"
      @confirm="onUpdateSubmitType"
    />
    <el-dialog
      title="备注"
      :visible.sync="remarkVisible"
      width="520px"
      append-to-body
    >
      <el-input v-model="remarkText" type="textarea" :rows="8" />
      <template v-slot:footer>
        <el-button @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" :loading="remarkSaving" @click="saveRemark">确定</el-button>
      </template>
    </el-dialog>
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
  smHandleRemark,
  smUpdateSubmitType,
  smSyncHis,
  smSendHis
} from '@/api/Home/YgVarClSm';
import { buildSmWjAuth } from './wjAuth';
import {
  defaultFilters,
  buildColumns,
  buildCommitRow,
  buildSimpleCommitRow,
  exportYgVarClSmExcel,
  formatSendYbState,
  formatSendYbType,
  formatIsCharge,
  formatYbbiaoji,
  formatLogTime,
  formatDateOnly,
  isMedicalCodeMismatch,
  isTerminationExpired
} from './utils';
import RejectRemarkDialog from './components/RejectRemarkDialog.vue';
import UpdateSubmitTypeDialog from './components/UpdateSubmitTypeDialog.vue';

export default {
  name: 'YgVarClSm',
  components: { RejectRemarkDialog, UpdateSubmitTypeDialog },
  data() {
    return {
      filters: defaultFilters(),
      columns: buildColumns(),
      selection: [],
      oneKeyMode: false,
      exporting: false,
      syncingHisCode: false,
      sendingHis: false,
      rejectVisible: false,
      rejectSaving: false,
      updateTypeVisible: false,
      updateTypeSaving: false,
      remarkVisible: false,
      remarkSaving: false,
      remarkText: ''
    };
  },
  computed: {
    ...mapState('user', ['authorities']),
    wjAuthPack() {
      return buildSmWjAuth(this.authorities || []);
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
      return 'calc(100vh - 380px)';
    }
  },
  methods: {
    formatSendYbState,
    formatSendYbType,
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
    async onApprove(type) {
      if (this.oneKeyMode) {
        await this.onOneKeyApprove(type);
        return;
      }
      if (type === -2) {
        this.openReject();
        return;
      }
      if (!this.requireSelection()) return;
      try {
        await MessageBox.confirm('确定提交吗？', '提示', { type: 'warning' });
        const rows = this.selection.map(buildCommitRow);
        const res = await tjybspCommit(rows, type);
        if (String(type) === '6') {
          try {
            await smSendHis();
          } catch (e) {
            Message.warning(e.message || '准入推送失败');
          }
        }
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reloadCurrentPage();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onOneKeyApprove(type) {
      try {
        await MessageBox.confirm('确定一键提交当前数据吗？', '提示', { type: 'warning' });
        const res = await appYbClInfoOneKey(this.filters, type, this.wjAuthJson);
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    openReject() {
      if (!this.requireSelection()) return;
      this.rejectVisible = true;
    },
    async onRejectConfirm(remark) {
      this.rejectSaving = true;
      try {
        const rows = this.selection.map(buildSimpleCommitRow);
        const res = await tjybspCommit(rows, -2, remark);
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
    openRemark() {
      if (!this.requireSelection()) return;
      this.remarkText = '';
      this.remarkVisible = true;
    },
    openUpdateType() {
      if (!this.requireSelection()) return;
      this.updateTypeVisible = true;
    },
    async saveRemark() {
      const ids = this.selection.map((row) => row.ID).join(',');
      this.remarkSaving = true;
      try {
        const res = await smHandleRemark(ids, this.remarkText);
        Message.success(res.msg || '保存成功');
        this.remarkVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.remarkSaving = false;
      }
    },
    async onUpdateSubmitType(type) {
      if (!this.requireSelection()) return;
      const ids = this.selection.map((row) => row.ID).join(',');
      this.updateTypeSaving = true;
      try {
        const res = await smUpdateSubmitType(ids, type);
        Message.success(res.msg || '处理成功');
        this.updateTypeVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '处理失败');
      } finally {
        this.updateTypeSaving = false;
      }
    },
    async onSyncHisCode() {
      try {
        await MessageBox.confirm('确定同步计费编码吗？', '提示', { type: 'warning' });
        this.syncingHisCode = true;
        const res = await smSyncHis();
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.syncingHisCode = false;
      }
    },
    async onSendHis() {
      try {
        await MessageBox.confirm('确定将已准入的推送至his吗？', '提示', { type: 'warning' });
        this.sendingHis = true;
        const res = await smSendHis();
        await MessageBox.alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.sendingHis = false;
      }
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getYbClInfo(this.filters, 1, 999999, this.wjAuthJson);
        exportYgVarClSmExcel(res.result || []);
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
