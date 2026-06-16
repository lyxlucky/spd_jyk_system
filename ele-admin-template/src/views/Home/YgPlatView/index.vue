<template>
  <div class="ele-body spd-page yg-plat-view">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="filters.varietyCodeNew" clearable placeholder="编码" style="width: 130px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.varietyName" clearable placeholder="名称" style="width: 130px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.supplierName" clearable placeholder="供应商" style="width: 130px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.sourceFrom" clearable placeholder="来源" style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.manufacturingEntName"
            clearable
            placeholder="生产企业"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.approvalNumber" clearable placeholder="注册证" style="width: 130px" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.month"
            type="month"
            value-format="yyyy-MM"
            placeholder="月结月份起始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.month2"
            type="month"
            value-format="yyyy-MM"
            placeholder="月结月份结束"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.ygOrderId" clearable placeholder="订单号" style="width: 130px" />
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item>
          <el-date-picker
            v-model="filters.createStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="订单创建时间起始"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.createEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="订单创建时间结束"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="是否发送">
          <el-select v-model="filters.isSend" clearable style="width: 120px">
            <el-option
              v-for="item in isSendOptions"
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
        <el-button size="small" @click="resetYgOrder">重置阳光订单</el-button>
        <el-button size="small" @click="resetErrorOrder">重置异常订单</el-button>
        <el-button size="small" @click="hbDialogVisible = true">回填订单号</el-button>
        <el-button size="small" :loading="resending" @click="resendMonth">补发送</el-button>
        <el-button size="small" :loading="resendingGx" @click="resendSelected">发送勾选品种</el-button>
        <el-button size="small" :loading="b2bLoading" @click="b2bResend">回补B2B订单号</el-button>
        <el-button v-if="isZq" size="small" :loading="zqLoading" @click="fetchZqOrders">
          中七获取回传订单
        </el-button>
        <el-button
          v-permission="'export-YgPlatView-fsdc'"
          size="small"
          :loading="exporting"
          @click="exportData"
        >
          导出
        </el-button>
        <el-button
          v-permission="'export-YgPlatView-htdc'"
          size="small"
          :loading="exportingHb"
          @click="exportBackfillTemplate"
        >
          导出回填订单表
        </el-button>
        <el-button size="small" @click="importDialogVisible = true">导入回填订单表</el-button>
      </div>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="filters"
        :selection.sync="selection"
        :page-size="100"
        :page-sizes="[30, 50, 100, 200, 300, 99999]"
        cache-key="YgPlatView"
      >
        <template v-slot:YG_CODE="{ row }">
          <span :class="{ 'text-danger': isYgCodeMismatch(row) }">{{ row.YG_CODE }}</span>
        </template>
        <template v-slot:YG_SPE_TYPE="{ row }">
          <span :class="{ 'text-danger': isYgSpeTypeMismatch(row) }">{{ row.YG_SPE_TYPE }}</span>
        </template>
        <template v-slot:IS_JC="{ row }">
          <span :class="{ 'text-danger': formatIsJc(row.IS_JC).danger }">
            {{ formatIsJc(row.IS_JC).text }}
          </span>
        </template>
        <template v-slot:YG_IS_CAN_SEND="{ row }">
          <span :class="{ 'text-danger': formatYgCanSend(row.YG_IS_CAN_SEND).danger }">
            {{ formatYgCanSend(row.YG_IS_CAN_SEND).text }}
          </span>
        </template>
        <template v-slot:SUPPLIER_NAME="{ row }">
          <span :class="{ 'text-danger': isSupplierMismatch(row) }">{{ row.SUPPLIER_NAME }}</span>
        </template>
        <template v-slot:SUPPLY_PRICE="{ row }">
          <span :class="{ 'text-danger': isSupplyPriceMismatch(row) }">{{ row.SUPPLY_PRICE }}</span>
        </template>
        <template v-slot:YG_ZH_COUNT="{ row }">
          <span :class="{ 'text-danger': isZhCountMismatch(row) }">{{ row.YG_ZH_COUNT }}</span>
        </template>
        <template v-slot:IS_SEND_YG="{ row }">
          {{ formatIsSendYg(row.IS_SEND_YG) }}
        </template>
        <template v-slot:ORDER_CREATE_TIME="{ row }">
          {{ formatOrderCreateTime(row.ORDER_CREATE_TIME) }}
        </template>
        <template v-slot:CONTRACTSTATUS="{ row }">
          <span :class="{ 'text-danger': isContractInvalid(row.CONTRACTSTATUS) }">
            {{ row.CONTRACTSTATUS }}
          </span>
        </template>
      </ele-pro-table>
    </el-card>

    <HbYgOrderDialog
      :visible.sync="hbDialogVisible"
      :loading="hbLoading"
      @confirm="submitHbOrder"
    />
    <ZqResendDialog
      :visible.sync="zqDialogVisible"
      :loading="resending"
      :month-id="zqMonthId"
      :monthly-label="zqMonthlyLabel"
      @confirm="submitZqResend"
    />
    <ImportHbOrderDialog
      :visible.sync="importDialogVisible"
      :loading="importing"
      @confirm="submitImport"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import {
  getYgptSendView,
  getYgptSendViewAll,
  chongzhiYgSend,
  chongzhiYgSendError,
  createYgOrderMainMonthAllBfs,
  createYgOrderMainMonthAllBfsGx,
  createYgOrderMainMonthAllBfsGxZq,
  zqInsertYgHrpTableMonth,
  b2bResendYgOrder,
  getZqYgHrpTableOrder,
  hbYgOrder,
  importHbYgOrder
} from '@/api/Home/YgPlatView';
import {
  IS_SEND_OPTIONS,
  defaultFilters,
  validateMonthRange,
  resolveMonthMeta,
  getHospitalId,
  isZqHospital,
  formatIsJc,
  formatYgCanSend,
  formatIsSendYg,
  formatOrderCreateTime,
  isYgCodeMismatch,
  isYgSpeTypeMismatch,
  isSupplierMismatch,
  isSupplyPriceMismatch,
  isZhCountMismatch,
  isContractInvalid,
  exportSendViewExcel,
  exportBackfillTemplateExcel
} from './utils';
import HbYgOrderDialog from './components/HbYgOrderDialog.vue';
import ZqResendDialog from './components/ZqResendDialog.vue';
import ImportHbOrderDialog from './components/ImportHbOrderDialog.vue';

export default {
  name: 'YgPlatView',
  components: { HbYgOrderDialog, ZqResendDialog, ImportHbOrderDialog },
  data() {
    return {
      filters: defaultFilters(),
      isSendOptions: IS_SEND_OPTIONS,
      selection: [],
      exporting: false,
      exportingHb: false,
      resending: false,
      resendingGx: false,
      b2bLoading: false,
      zqLoading: false,
      hbLoading: false,
      importing: false,
      hbDialogVisible: false,
      zqDialogVisible: false,
      importDialogVisible: false,
      zqMonthId: '0',
      zqMonthlyLabel: '',
      isZq: isZqHospital(),
      columns: [
        { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { prop: 'VARIETIE_CODE', label: '品种ID', width: 80, showOverflowTooltip: true },
        { prop: 'MONTHLY_TIME', label: '月结月份', width: 90, showOverflowTooltip: true },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 100, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格类型', minWidth: 120, showOverflowTooltip: true },
        { prop: 'UNIT', label: '单位', width: 60, align: 'center' },
        { prop: 'APPROVAL_NUMBER', label: '批准编号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'MEDICAL_CODE27', label: '医保编码27', minWidth: 130, showOverflowTooltip: true },
        { prop: 'YG_CODE', label: '产品码', width: 90, slot: 'YG_CODE', showOverflowTooltip: true },
        { prop: 'YG_SPE_TYPE', label: '规格型号码', width: 110, slot: 'YG_SPE_TYPE', showOverflowTooltip: true },
        { prop: 'IS_JC', label: '是否集采', width: 80, align: 'center', slot: 'IS_JC' },
        { prop: 'SOURCE_FROM', label: '品种来源', width: 100, showOverflowTooltip: true },
        { prop: 'YG_IS_CAN_SEND', label: '是否允许发送', width: 100, align: 'center', slot: 'YG_IS_CAN_SEND' },
        { prop: 'YG_SEND_BEGIN_TIME', label: '发送起始时间', width: 110, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 140, slot: 'SUPPLIER_NAME', showOverflowTooltip: true },
        { prop: 'PRICE', label: 'SPD中标价格', width: 100, align: 'right' },
        { prop: 'SUPPLY_PRICE', label: '消耗价格', width: 90, align: 'right', slot: 'SUPPLY_PRICE' },
        { prop: 'PURCHASEPRICE', label: '阳光平台采购价', width: 110, align: 'right' },
        { prop: 'YG_ZH_COUNT', label: '转换比例', width: 90, align: 'center', slot: 'YG_ZH_COUNT' },
        { prop: 'IS_SEND_YG', label: '是否发送', width: 110, align: 'center', slot: 'IS_SEND_YG' },
        { prop: 'YG_HOSPITAL_ID', label: '本院订单ID', width: 100, showOverflowTooltip: true },
        { prop: 'YG_ORDER_ID', label: '阳光平台订单', width: 110, showOverflowTooltip: true },
        { prop: 'ORDER_CREATE_TIME', label: '订单创建时间', width: 150, slot: 'ORDER_CREATE_TIME' },
        { prop: 'CONTRACTSTATUS', label: '平台合同状态', width: 100, slot: 'CONTRACTSTATUS', showOverflowTooltip: true },
        { prop: 'TJ_YG_ZH_COUNT', label: '推荐转换比', width: 90, align: 'center' },
        { prop: 'PURCHASECOUNT', label: '采购数量', width: 90, align: 'right' },
        { prop: 'MONTH_ID', label: '月结ID', width: 80, showOverflowTooltip: true }
      ]
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 300px)';
    }
  },
  methods: {
    formatIsJc,
    formatYgCanSend,
    formatIsSendYg,
    formatOrderCreateTime,
    isYgCodeMismatch,
    isYgSpeTypeMismatch,
    isSupplierMismatch,
    isSupplyPriceMismatch,
    isZhCountMismatch,
    isContractInvalid,
    datasource({ page, limit, where }) {
      return getYgptSendView(where, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    reload() {
      const err = validateMonthRange(this.filters);
      if (err) {
        Message.warning(err);
        return;
      }
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    requireSelection(message) {
      if (!this.selection.length) {
        Message.warning(message);
        return null;
      }
      return this.selection;
    },
    requireSingleSelection(message) {
      const rows = this.requireSelection(message);
      if (!rows) return null;
      if (rows.length !== 1) {
        Message.warning('只支持单条记录操作');
        return null;
      }
      return rows[0];
    },
    async resetYgOrder() {
      const row = this.requireSingleSelection('请选择要重置的订单');
      if (!row) return;
      try {
        await MessageBox.confirm(`整个订单都将重置,确定重置订单:${row.YG_ORDER_ID}吗？`, '提示', {
          type: 'warning'
        });
        const res = await chongzhiYgSend([row]);
        Message.success(res.msg || '重置成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '重置失败');
      }
    },
    async resetErrorOrder() {
      const row = this.requireSingleSelection('请选择重置月份');
      if (!row) return;
      const { monthId, monthlyLabel } = resolveMonthMeta(row);
      try {
        await MessageBox.confirm(`确定重置:${monthlyLabel}(${monthId})阳光订单吗？`, '提示', {
          type: 'warning'
        });
        const res = await chongzhiYgSendError(monthId);
        Message.success(res.msg || '重置成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '重置失败');
      }
    },
    async resendMonth() {
      const row = this.requireSingleSelection('请选择补发月份');
      if (!row) return;
      const { monthId, monthlyLabel } = resolveMonthMeta(row);
      if (this.isZq) {
        this.zqMonthId = monthId;
        this.zqMonthlyLabel = monthlyLabel;
        this.zqDialogVisible = true;
        return;
      }
      try {
        await MessageBox.confirm(`确定补发:${monthlyLabel}(${monthId})阳光订单吗？`, '提示', {
          type: 'warning'
        });
        this.resending = true;
        const res = await createYgOrderMainMonthAllBfs(monthId);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.resending = false;
      }
    },
    async submitZqResend({ date, monthId }) {
      if (!date) {
        Message.warning('请选择截止日期');
        return;
      }
      this.resending = true;
      try {
        const res = await zqInsertYgHrpTableMonth(date, monthId);
        this.zqDialogVisible = false;
        await MessageBox.alert(`阳光平台${res.msg || '操作完成'}`, '提示');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.resending = false;
      }
    },
    async resendSelected() {
      const rows = this.requireSelection('请选择发送品种');
      if (!rows) return;
      const { monthId, monthlyLabel } = resolveMonthMeta(rows[0]);
      const ids = rows.map((row) => row.VARIETIE_CODE).join(',');
      try {
        await MessageBox.confirm(
          `确定补发勾选品种:${monthlyLabel}(${monthId})阳光订单吗？`,
          '提示',
          { type: 'warning' }
        );
        this.resendingGx = true;
        const api = this.isZq
          ? createYgOrderMainMonthAllBfsGxZq
          : createYgOrderMainMonthAllBfsGx;
        const res = await api(monthId, ids);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.resendingGx = false;
      }
    },
    async b2bResend() {
      const row = this.requireSingleSelection('请选择补发月份');
      if (!row) return;
      const { monthId, monthlyLabel } = resolveMonthMeta(row);
      try {
        await MessageBox.confirm(`确定补发B2B:${monthlyLabel}(${monthId})阳光订单吗？`, '提示', {
          type: 'warning'
        });
        this.b2bLoading = true;
        await b2bResendYgOrder(monthId, getHospitalId());
        Message.success('操作成功');
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.b2bLoading = false;
      }
    },
    async fetchZqOrders() {
      try {
        await MessageBox.confirm('确定回补阳光订单吗？', '提示', { type: 'warning' });
        this.zqLoading = true;
        const res = await getZqYgHrpTableOrder();
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.zqLoading = false;
      }
    },
    async submitHbOrder({ ygOrderId, ygOrderDetailId }) {
      const rows = this.requireSelection('请选择回填数据');
      if (!rows) return;
      if (!ygOrderId) {
        Message.warning('请填写订单号');
        return;
      }
      try {
        await MessageBox.confirm('确定回填勾选品种阳光订单吗？', '提示', { type: 'warning' });
        this.hbLoading = true;
        const res = await hbYgOrder(rows, ygOrderId, ygOrderDetailId);
        Message.success(res.msg || '回填成功');
        this.hbDialogVisible = false;
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '回填失败');
      } finally {
        this.hbLoading = false;
      }
    },
    async exportData() {
      const err = validateMonthRange(this.filters);
      if (err) {
        Message.warning(err);
        return;
      }
      this.exporting = true;
      try {
        const res = await getYgptSendViewAll(this.filters);
        if (!res.list.length) {
          Message.warning('没有可导出的数据');
          return;
        }
        exportSendViewExcel(res.list);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async exportBackfillTemplate() {
      const err = validateMonthRange(this.filters);
      if (err) {
        Message.warning(err);
        return;
      }
      this.exportingHb = true;
      try {
        const res = await getYgptSendViewAll(this.filters);
        if (!res.list.length) {
          Message.warning('没有可导出的数据');
          return;
        }
        exportBackfillTemplateExcel(res.list);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingHb = false;
      }
    },
    async submitImport(file) {
      this.importing = true;
      try {
        const res = await importHbYgOrder(file);
        Message.success(res.msg || '导入成功');
        this.importDialogVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '导入失败');
      } finally {
        this.importing = false;
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
.action-bar .el-button + .el-button {
  margin-left: 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
