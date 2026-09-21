<template>
  <div class="ele-body spd-page auth-order-approve-page">
    <el-card shadow="never" class="panel-card">
      <div class="section-title">自助订单审核</div>
      <div class="local-toolbar spd-toolbar">
        <div class="spd-toolbar__group">
          <el-select v-model="query.orderState" size="mini" style="width: 110px" @change="loadMain(true)">
            <el-option label="未收货" value="0" />
            <el-option label="已收货" value="1" />
            <el-option label="收货全部" value="" />
          </el-select>
          <el-select v-model="query.approveState" size="mini" style="width: 120px" @change="loadMain(true)">
            <el-option label="未审批" value="0" />
            <el-option label="已通过" value="1" />
            <el-option label="审核不通过" value="-1" />
            <el-option label="审批全部" value="" />
          </el-select>
          <span class="filter-label">订单时间</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            size="mini"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
            @change="loadMain(true)"
          />
          <el-input
            v-model="query.deliveryNoteNumber"
            size="mini"
            clearable
            placeholder="收货单号"
            style="width: 180px"
            @keyup.enter.native="loadMain(true)"
          />
          <el-button size="mini" type="primary" icon="el-icon-search" @click="loadMain(true)">查询</el-button>
        </div>
        <div class="spd-toolbar__divider" />
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button size="mini" type="warning" :disabled="!selection.length" @click="onApprovePass">
              审批通过
            </el-button>
            <el-button size="mini" type="danger" :disabled="!selection.length" @click="onApproveReject">
              审批不通过
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        v-loading="mainLoading"
        :data="mainRows"
        border
        stripe
        size="mini"
        height="calc((100vh - 280px) / 2)"
        highlight-current-row
        @selection-change="onSelectionChange"
        @current-change="onMainSelect"
      >
        <el-table-column type="selection" width="42" />
        <el-table-column prop="DELIVERY_NOTE_NUMBER" label="收货单号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="PREPARE_GOODS_PLAN_NUMBER" label="备货单号" min-width="110" show-overflow-tooltip />
        <el-table-column prop="SUPPLIER_NAME" label="供应商" min-width="130" show-overflow-tooltip />
        <el-table-column prop="REMARK_DEPT_TWO_NAME" label="备注科室" min-width="100" show-overflow-tooltip />
        <el-table-column label="收货状态" width="90" align="center">
          <template slot-scope="{ row }">{{ receiveStateText(row.RECEIVE_RECEIPT_STATE) }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="{ row }">
            <span :style="row.AUTH_APPROVE_STATE === '-1' ? 'color:#d9001b' : ''">
              {{ approveStateText(row.AUTH_APPROVE_STATE) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="AUTH_APPROVE_MAN" label="审核人" width="90" show-overflow-tooltip />
        <el-table-column label="审核时间" min-width="140">
          <template slot-scope="{ row }">{{ fmtDateTime(row.AUTH_APPROVE_TIME) }}</template>
        </el-table-column>
        <el-table-column prop="AUTH_APPROVE_MARK" label="审核备注" min-width="140" show-overflow-tooltip />
        <el-table-column label="订单时间" min-width="140">
          <template slot-scope="{ row }">{{ fmtDateTime(row.DELIVERY_TIME) }}</template>
        </el-table-column>
        <el-table-column prop="REMARKS" label="备货备注" min-width="120" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pager"
        small
        layout="total, prev, pager, next, sizes"
        :total="mainTotal"
        :page-size.sync="mainPageSize"
        :current-page.sync="mainPage"
        :page-sizes="[20, 50, 100]"
        @current-change="loadMain"
        @size-change="() => loadMain(true)"
      />
    </el-card>

    <el-card shadow="never" class="panel-card" style="margin-top: 12px">
      <div class="section-title">
        订单明细
        <span v-if="selectedMain" class="count-tip">单号：{{ selectedMain.DELIVERY_NOTE_NUMBER }}</span>
      </div>
      <el-table
        v-loading="delLoading"
        :data="delRows"
        border
        stripe
        size="mini"
        height="calc((100vh - 280px) / 2)"
      >
        <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" min-width="110" show-overflow-tooltip />
        <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="UNIT" label="单位" width="60" />
        <el-table-column prop="BATCH" label="批号" min-width="100" show-overflow-tooltip />
        <el-table-column prop="RECEIVABLE" label="数量" width="70" />
        <el-table-column prop="DEF_NUM" label="定数码数" width="80" />
        <el-table-column prop="COEFFICIENT" label="系数" width="60" />
        <el-table-column prop="SUPPLIER_NAME" label="供应商" min-width="120" show-overflow-tooltip />
        <el-table-column prop="SUPPLY_PRICE" label="供应价" width="80" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { Message, MessageBox } from 'element-ui';
  import { HOME_HP } from '@/config/setting';
  import * as api from '@/api/Task/AuthOrder';

  function pad2(n) {
    return n < 10 ? `0${n}` : String(n);
  }

  function fmtYmd(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function defaultDateRange() {
    const to = new Date();
    const from = new Date(to.getTime() - 86400000 * 30);
    to.setTime(to.getTime() + 86400000);
    return [fmtYmd(from), fmtYmd(to)];
  }

  function isSzseHp(hp) {
    const h = String(hp || '');
    return h === 'se2' || h.startsWith('szse');
  }

  export default {
    name: 'AuthOrderApprove',
    data() {
      const range = defaultDateRange();
      return {
        isSzse: isSzseHp(HOME_HP),
        query: {
          deliveryNoteNumber: '',
          orderState: '0',
          approveState: '0'
        },
        dateRange: range,
        mainLoading: false,
        mainRows: [],
        mainTotal: 0,
        mainPage: 1,
        mainPageSize: 20,
        selection: [],
        selectedMain: null,
        delLoading: false,
        delRows: []
      };
    },
    created() {
      if (!this.isSzse) {
        Message.warning('自助订单审核仅市二启用');
      }
      this.loadMain(true);
    },
    methods: {
      fmtDateTime(v) {
        if (!v) return '';
        return String(v).replace('T', ' ').substring(0, 19);
      },
      receiveStateText(v) {
        return v === '1' ? '已收货' : '未收货';
      },
      approveStateText(v) {
        if (v === '1') return '已通过';
        if (v === '-1') return '审核不通过';
        return '未审批';
      },
      parseTotal(res, fallback = 0) {
        const t = res?.total ?? res?.Total;
        if (t != null && t !== '') return Number(t) || 0;
        return fallback;
      },
      onSelectionChange(rows) {
        this.selection = rows || [];
      },
      async loadMain(resetPage) {
        if (resetPage) this.mainPage = 1;
        this.mainLoading = true;
        try {
          const res = await api.getAuthOrderApproveMain({
            deliveryNoteNumber: this.query.deliveryNoteNumber,
            orderState: this.query.orderState,
            approveState: this.query.approveState,
            dateFrom: (this.dateRange && this.dateRange[0]) || '',
            dateTo: (this.dateRange && this.dateRange[1]) || '',
            page: this.mainPage,
            size: this.mainPageSize
          });
          this.mainRows = res.result || [];
          this.mainTotal = this.parseTotal(res, this.mainRows.length);
          this.selection = [];
          this.selectedMain = null;
          this.delRows = [];
        } catch (e) {
          Message.error(e.message || '加载审核列表失败');
        } finally {
          this.mainLoading = false;
        }
      },
      async onMainSelect(row) {
        this.selectedMain = row || null;
        this.delRows = [];
        if (!row?.DELIVERY_NOTE_NUMBER) return;
        this.delLoading = true;
        try {
          const res = await api.getAuthOrderDel(row.DELIVERY_NOTE_NUMBER);
          this.delRows = res.result || [];
        } catch (e) {
          Message.error(e.message || '加载明细失败');
        } finally {
          this.delLoading = false;
        }
      },
      async onApprovePass() {
        const ids = (this.selection || []).map((r) => String(r.ID)).filter(Boolean);
        if (!ids.length) {
          Message.warning('请勾选要审批的单号');
          return;
        }
        try {
          await MessageBox.confirm(
            `确认审批通过选中的 ${ids.length} 单？通过后可在自助订单页收货。`,
            '审批通过',
            { type: 'warning' }
          );
        } catch (e) {
          return;
        }
        try {
          const res = await api.authOrderApprove(ids);
          Message.success(res.msg || '审批成功');
          this.loadMain();
        } catch (e) {
          Message.error(e.message || '审批失败');
        }
      },
      async onApproveReject() {
        const ids = (this.selection || []).map((r) => String(r.ID)).filter(Boolean);
        if (!ids.length) {
          Message.warning('请勾选要审批的单号');
          return;
        }
        let mark = '';
        try {
          const { value } = await MessageBox.prompt('请输入审核备注（必填）', '审批不通过', {
            inputType: 'textarea',
            inputValidator: (v) => !!(v && String(v).trim()) || '请填写审核备注',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          });
          mark = String(value || '').trim();
        } catch (e) {
          return;
        }
        try {
          const res = await api.authOrderNoApprove(ids, mark);
          Message.success(res.msg || '已驳回');
          this.loadMain();
        } catch (e) {
          Message.error(e.message || '驳回失败');
        }
      }
    }
  };
</script>

<style scoped>
  .auth-order-approve-page .panel-card {
    margin-bottom: 0;
  }
  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #2f4050;
    margin-bottom: 10px;
  }
  .count-tip {
    margin-left: 12px;
    font-size: 13px;
    font-weight: 400;
    color: #6b7785;
  }
  .filter-label {
    font-size: 13px;
    color: #4f5b67;
    white-space: nowrap;
  }
  .pager {
    margin-top: 8px;
    text-align: right;
  }
  .local-toolbar {
    margin-bottom: 10px;
  }
</style>
