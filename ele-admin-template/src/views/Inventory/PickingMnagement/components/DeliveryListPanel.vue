<template>
  <el-card shadow="never">
    <div slot="header">定数包出库配送单列表</div>
    <el-form :inline="true" size="mini" class="filter-row">
      <el-form-item label="补货状态">
        <el-select v-model="form.replenish_state" style="width: 110px" @change="handleSearch">
          <el-option label="全部" :value="-1" />
          <el-option label="未补货" :value="0" />
          <el-option label="补货中" :value="1" />
          <el-option label="已收货" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          @change="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.DeptCode"
          placeholder="科室编码/名称/库区"
          clearable
          style="width: 160px"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.StockNumber"
          placeholder="配送单号"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="local-toolbar spd-toolbar">
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button
            type="primary"
            size="mini"
            :disabled="!canSendDeliveryBtn"
            @click="handleSendDelivery"
          >
            发送出库配送单
          </el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!canConfirmReceiptBtn"
            @click="handleConfirmReceipt"
          >
            确认收货
          </el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button size="mini" :disabled="!selectedRow" @click="handlePrintDelivery">
            打印出库配送单
          </el-button>
          <el-button
            v-if="!hp.hidePrintDetail2"
            size="mini"
            :disabled="!selectedRow"
            @click="handlePrintDelivery2"
          >
            打印出库单详情
          </el-button>
          <el-button
            v-if="hp.showConsignmentPrint"
            size="mini"
            :disabled="!selectedRow"
            @click="handlePrintConsignment"
          >
            打印出库寄售单
          </el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button
            v-if="hp.isSe2 && hp.showEpcSend"
            size="mini"
            :disabled="!selectedRow"
            @click="openEpcSend"
          >
            制标发送
          </el-button>
          <el-button
            v-if="hp.isSe2 && hp.showProcessUp"
            size="mini"
            :disabled="!selectedRow"
            @click="openProCkOrder"
          >
            智能库上架
          </el-button>
          <el-button
            v-if="!hp.isSe2"
            size="mini"
            :disabled="!selectedRow"
            @click="handleSendDefHNCK"
          >
            补发送智能柜
          </el-button>
          <el-button
            v-if="hp.isLhLike"
            size="mini"
            :disabled="!selectedRow"
            @click="handleSendYsy"
          >
            补发送至医商云
          </el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button size="mini" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button type="danger" size="mini" :disabled="!selectedRow" @click="handleCloseDistribute">
            取消出库
          </el-button>
        </div>
      </div>
    </div>
    <ele-pro-table
      ref="table"
      size="mini"
      height="320px"
      highlight-current-row
      :columns="columns"
      :datasource="datasource"
      :row-class-name="rowClassName"
      cache-key="pickingMnagementDeliveryList"
      @row-click="handleRowClick"
    />
    <DeptRegionDialog
      :visible.sync="regionDialogVisible"
      :title="regionDialogTitle"
      @confirm="onRegionConfirm"
    />
  </el-card>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import {
  searchDistributeList,
  closeDistribute,
  updateReplenishState,
  sendDefHNCK,
  getLhDistributeList,
  createDeliveryExcel,
  createDeliveryExcel2,
  createDeliveryConsignmentExcel,
  createDeliveryExcelLh,
  insertDeptUpShelf,
  processDefEpcCk,
  processOrder
} from '@/api/Inventory/PickingMnagement';
import {
  formatDateTime,
  formatReplenishState,
  getDefaultMonthRange,
  openExcelFile,
  canSendDelivery,
  canConfirmReceipt,
  unwrapData,
  isOkCode,
  pickingHpFlags,
  needDeptRegionSelect
} from '../utils';
import DeptRegionDialog from './DeptRegionDialog.vue';

export default {
  name: 'DeliveryListPanel',
  components: { DeptRegionDialog },
  props: {
    highlightPackNumber: { type: String, default: '' }
  },
  data() {
    const [start, end] = getDefaultMonthRange();
    return {
      hp: pickingHpFlags,
      selectedRow: null,
      regionDialogVisible: false,
      regionDialogTitle: '选择科室库区',
      pendingAction: '',
      form: {
        replenish_state: -1,
        dateRange: [start, end],
        DeptCode: '',
        StockNumber: '',
        field: '',
        order: ''
      }
    };
  },
  computed: {
    canSendDeliveryBtn() {
      return this.selectedRow && canSendDelivery(this.selectedRow.replenish_state);
    },
    canConfirmReceiptBtn() {
      return this.selectedRow && canConfirmReceipt(this.selectedRow.replenish_state);
    },
    columns() {
      const base = [
        {
          prop: 'stock_out_distribute_number',
          label: '补货单号',
          minWidth: 110,
          sortable: 'custom'
        },
        { prop: 'dept_two_name', label: '配送科室', minWidth: 100, sortable: 'custom' }
      ];
      if (!this.hp.isLhLike) {
        base.push({ prop: 'REGION_NAME', label: '库区', width: 80, sortable: 'custom' });
      }
      base.push(
        {
          prop: 'pack_directive_number',
          label: '拣配单号',
          minWidth: 150,
          sortable: 'custom'
        },
        {
          prop: 'replenish_time',
          label: '补货时间',
          width: 150,
          sortable: 'custom',
          formatter: (row) => formatDateTime(row.replenish_time)
        },
        {
          prop: 'replenish_state',
          label: '补货状态',
          width: 90,
          sortable: 'custom',
          formatter: (row) => formatReplenishState(row.replenish_state)
        }
      );
      if (this.hp.isLhLike) {
        base.push({
          prop: 'Send_Herp_State',
          label: '医商云发送状态',
          width: 110,
          sortable: 'custom',
          formatter: (row) => {
            if (String(row.Send_Herp_State) === '0') return '未发送';
            if (String(row.Send_Herp_State) === '1') return '已发送';
            return '';
          }
        });
      } else {
        base.push({ prop: 'CALL_TIMES', label: '智能柜上架次数', width: 110 });
      }
      base.push({ prop: 'Print_Count', label: '打印次数', width: 80 });
      return base;
    }
  },
  methods: {
    buildWhere() {
      const [start, end] = this.form.dateRange || ['', ''];
      return {
        DeptCode: this.form.DeptCode,
        StockNumber: this.form.StockNumber,
        StateDate: start || '',
        EndDate: end || '',
        replenish_state: this.form.replenish_state,
        field: this.form.field,
        order: this.form.order
      };
    },
    datasource({ page, limit, order }) {
      if (order?.sort) {
        this.form.field = order.sort;
        this.form.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return searchDistributeList({
        page,
        limit,
        where: this.buildWhere()
      }).then((res) => {
        const data = unwrapData(res);
        return {
          count: data.total || 0,
          list: data.result || []
        };
      });
    },
    handleSearch() {
      this.$refs.table?.reload({ page: 1 });
    },
    rowClassName({ row }) {
      if (
        this.highlightPackNumber &&
        row.pack_directive_number === this.highlightPackNumber
      ) {
        return 'highlight-pack-row';
      }
      return '';
    },
    handleRowClick(row) {
      this.selectedRow = row;
      this.$emit('delivery-selected', row);
    },
    getStockOutNumber() {
      return this.selectedRow?.stock_out_distribute_number || '';
    },
    getDeptName() {
      return this.selectedRow?.dept_two_name || '';
    },
    getDeptCode() {
      return this.selectedRow?.dept_two_code || '';
    },
    handleCloseDistribute() {
      const num = this.getStockOutNumber();
      if (!num) return;
      this.$confirm(`确定要取消${num}出库吗?`, '提示', { type: 'warning' }).then(() => {
        closeDistribute(num).then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '操作成功');
            this.handleSearch();
            this.$parent.$refs.pickList?.handleSearch();
          } else {
            this.$message.error(data?.msg || '操作失败');
          }
        });
      });
    },
    handleSendDelivery() {
      const num = this.getStockOutNumber();
      if (!num) return;
      this.$confirm('确定要发送出库配送单吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({ lock: true, text: '发送中...' });
        updateReplenishState(num)
          .then((res) => {
            const data = unwrapData(res);
            if (data === 200 || data === '200') {
              this.$message.success('发送成功');
              this.handleSearch();
              if (this.hp.isLhLike) {
                getLhDistributeList(num).then((r) => {
                  const ysy = unwrapData(r);
                  if (!isOkCode(ysy?.code)) {
                    this.$message.warning(ysy?.msg || '医商云发送失败');
                  }
                });
              }
              sendDefHNCK(num);
            } else if (data === 301 || data === '301') {
              this.$message.error('登录失效，请重新登录');
            }
          })
          .finally(() => loading.close());
      });
    },
    handleConfirmReceipt() {
      const num = this.getStockOutNumber();
      if (!num) {
        this.$message.warning('请先选中要进行收货操作的数据');
        return;
      }
      if (!canConfirmReceipt(this.selectedRow?.replenish_state)) {
        this.$message.warning('只能对补货在途的数据进行收货操作');
        return;
      }
      this.$confirm('确定要进行收货操作吗?', '提示', { type: 'warning' }).then(() => {
        insertDeptUpShelf(num).then((res) => {
          const data = unwrapData(res);
          if (data === 200 || data === '200') {
            this.$message.success('收货成功');
            this.handleSearch();
          } else if (data === 301 || data === '301') {
            this.$message.error('登录失效，请重新登录');
          }
        });
      });
    },
    handleSendDefHNCK() {
      const num = this.getStockOutNumber();
      if (!num) {
        this.$message.warning('请先选择出库配送单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '发送中...' });
      sendDefHNCK(num)
        .then((res) => {
          const data = unwrapData(res);
          if (data === 200 || data === '200') {
            this.$message.success(typeof data === 'object' ? data.msg || '发送成功' : '发送成功');
          } else if (data === 301 || data === '301') {
            this.$message.error('登录失效，请重新登录');
          } else {
            this.$message.error(typeof data === 'object' ? data?.msg : String(data) || '发送失败');
          }
        })
        .finally(() => loading.close());
    },
    handleSendYsy() {
      const num = this.getStockOutNumber();
      if (!num) return;
      getLhDistributeList(num).then((res) => {
        const data = unwrapData(res);
        if (isOkCode(data?.code)) {
          this.$message.success(data.msg || '发送成功');
          this.handleSearch();
        } else {
          this.$message.error(data?.msg || '发送医商云失败');
        }
      });
    },
    openEpcSend() {
      if (!this.getStockOutNumber()) return;
      if (needDeptRegionSelect(this.getDeptCode())) {
        this.pendingAction = 'epc';
        this.regionDialogTitle = '选择科室库区';
        this.regionDialogVisible = true;
      } else {
        this.runEpcSend('');
      }
    },
    openProCkOrder() {
      if (!this.getStockOutNumber()) return;
      if (needDeptRegionSelect(this.getDeptCode())) {
        this.pendingAction = 'process';
        this.regionDialogTitle = '选择科室库区';
        this.regionDialogVisible = true;
      } else {
        this.runProCkOrder('');
      }
    },
    onRegionConfirm(regionCode) {
      if (this.pendingAction === 'epc') {
        this.runEpcSend(regionCode);
      } else if (this.pendingAction === 'process') {
        this.runProCkOrder(regionCode);
      }
      this.pendingAction = '';
    },
    runEpcSend(regionCode) {
      const num = this.getStockOutNumber();
      this.$confirm(`${num} 确定要进行EPC制标发送吗？`, '操作确认', { type: 'warning' }).then(
        () => {
          const loading = this.$loading({ lock: true, text: '发送中...' });
          processDefEpcCk(num, regionCode)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '发送成功');
              } else {
                this.$message.error(data?.msg || '发送失败');
              }
            })
            .catch((err) => {
              const msg = unwrapData(err?.response)?.msg || err?.message || '发送失败';
              this.$message.error(msg);
            })
            .finally(() => loading.close());
        }
      );
    },
    runProCkOrder(regionCode) {
      const num = this.getStockOutNumber();
      this.$confirm(`${num} 确定要进行智能库上架吗？`, '操作确认', { type: 'warning' }).then(
        () => {
          const loading = this.$loading({ lock: true, text: '处理中...' });
          processOrder(num, regionCode)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '操作成功');
              } else {
                this.$message.error(data?.msg || '操作失败');
              }
            })
            .catch((err) => {
              const msg = unwrapData(err?.response)?.msg || err?.message || '操作失败';
              this.$message.error(msg);
            })
            .finally(() => loading.close());
        }
      );
    },
    printExcel(apiFn, options = {}) {
      const num = this.getStockOutNumber();
      const dept = this.getDeptName();
      if (!num) {
        this.$message.warning('请选择要打印的出库配送单');
        return;
      }
      if (options.ysyWarn && String(this.selectedRow?.Send_Herp_State) === '0') {
        this.$alert(
          '提醒：请先发送配送单给医商云，否则纸质单据无法显示出医商云的送货单号'
        );
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      apiFn(num, dept)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            openExcelFile(data.msg);
          } else {
            this.$message.error(data?.msg || '生成失败');
          }
        })
        .finally(() => loading.close());
    },
    handlePrintDelivery() {
      const num = this.getStockOutNumber();
      if (!num) {
        this.$message.warning('请选择要打印的出库配送单');
        return;
      }
      if (this.hp.isLhLike && String(this.selectedRow?.Send_Herp_State) === '0') {
        this.$alert(
          '提醒：请先发送配送单给医商云，否则纸质单据无法显示出医商云的送货单号'
        );
      }
      if (!this.hp.isSe2) {
        sendDefHNCK(num);
      }
      const apiFn = this.hp.isLhLike ? createDeliveryExcelLh : createDeliveryExcel;
      this.printExcel(apiFn);
    },
    handlePrintDelivery2() {
      this.printExcel(createDeliveryExcel2);
    },
    handlePrintConsignment() {
      const apiFn = this.hp.isLhLike
        ? createDeliveryExcelLh
        : createDeliveryConsignmentExcel;
      this.printExcel(apiFn, { ysyWarn: this.hp.isLhLike });
    },
    async handleExport() {
      const loading = this.$loading({ lock: true, text: '导出中...' });
      try {
        const res = await searchDistributeList({
          page: 1,
          limit: 999999,
          where: this.buildWhere()
        });
        const data = unwrapData(res);
        const rows = (data.result || []).map((item) => [
          item.stock_out_distribute_number,
          item.dept_two_name,
          item.pack_directive_number,
          formatDateTime(item.replenish_time),
          formatReplenishState(item.replenish_state),
          item.Print_Count
        ]);
        const sheet = utils.aoa_to_sheet([
          ['补货单号', '配送科室', '拣配单号', '补货时间', '补货状态', '打印次数'],
          ...rows
        ]);
        writeFile({ SheetNames: ['配送单'], Sheets: { 配送单: sheet } }, '出库配送单信息.xlsx');
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}
.local-toolbar {
  margin-bottom: 8px;
}
.local-toolbar.spd-toolbar {
  padding: 0;
}
.local-toolbar .spd-toolbar__divider {
  min-height: 24px;
  margin: 0 8px;
}
:deep(.highlight-pack-row) {
  background-color: #f9d5d5 !important;
}
</style>
