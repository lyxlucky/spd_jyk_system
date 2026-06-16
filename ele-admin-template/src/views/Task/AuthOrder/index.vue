<template>
  <div class="ele-body spd-page auth-order-page">
    <el-row :gutter="12">
      <!-- 订单主单 -->
      <el-col :span="5">
        <el-card shadow="never" class="panel-card">
          <div class="section-title row-title">
            <span>订单号</span>
            <!-- <span class="count-tip">共 {{ mainTotal }} 条</span> -->
          </div>
          <div class="filter-row">
            <el-input
              v-model="mainQuery.deliveryNoteNumber"
              size="mini"
              clearable
              placeholder="订单号"
              @keyup.enter.native="loadMain(true)"
            />
            <el-select v-model="mainQuery.orderState" size="mini" style="width: 96px" @change="loadMain(true)">
              <el-option label="未收货" value="0" />
              <el-option label="已收货" value="1" />
              <el-option label="全部" value="" />
            </el-select>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadMain(true)">查询</el-button>
          </div>
          <el-table
            v-loading="mainLoading"
            :data="mainRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 200px)"
            highlight-current-row
            @current-change="onMainSelect"
          >
            <el-table-column prop="DELIVERY_NOTE_NUMBER" label="单号" min-width="100" show-overflow-tooltip />
            <el-table-column prop="PREPARE_GOODS_PLAN_NUMBER" label="备货单号" min-width="90" show-overflow-tooltip />
            <el-table-column prop="REMARKS" label="备货备注" min-width="80" show-overflow-tooltip />
            <el-table-column prop="REMARK_DEPT_TWO_NAME" label="备注科室" min-width="80" show-overflow-tooltip />
          </el-table>
          <el-pagination
            v-if="mainTotal > mainPageSize"
            class="pager"
            small
            layout="prev, pager, next"
            :total="mainTotal"
            :page-size="mainPageSize"
            :current-page.sync="mainPage"
            @current-change="loadMain"
          />
        </el-card>
      </el-col>

      <!-- 订单明细 -->
      <el-col :span="14">
        <el-card shadow="never" class="panel-card">
          <div class="section-title row-title">
            <span>订单明细</span>
          </div>
          <div class="local-toolbar spd-toolbar">
            <div class="spd-toolbar__group">
              <div class="spd-toolbar__btns">
                <el-button v-if="showConfirmReceipt" size="mini" type="primary" :disabled="!selectedMain" @click="onConfirmReceipt">
                  确认收货
                </el-button>
                <el-button v-if="showReceiptToUse" size="mini" type="primary" :disabled="!selectedMain" @click="openReceiptDialog('use')">
                  收货结算
                </el-button>
                <el-button v-if="showReceiptToSend" size="mini" type="primary" :disabled="!selectedMain" @click="openReceiptDialog('send')">
                  收货至出库
                </el-button>
              </div>
            </div>
            <div class="spd-toolbar__divider" />
            <div class="spd-toolbar__group">
              <div class="spd-toolbar__btns">
                <el-button size="mini" :disabled="!selectedMain" @click="onPrint">打印收货单</el-button>
                <el-button size="mini" :disabled="!selectedMain" @click="exportDetail">导出</el-button>
              </div>
            </div>
            <div class="spd-toolbar__divider" />
            <div class="spd-toolbar__group">
              <div class="spd-toolbar__btns">
                <el-button size="mini" :disabled="!selectedMain" @click="onReplace">转为普通收货</el-button>
              </div>
            </div>
          </div>
          <el-table
            v-loading="delLoading"
            :data="delRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 240px)"
            highlight-current-row
            @current-change="onDelSelect"
          >
            <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="100" show-overflow-tooltip />
            <el-table-column prop="VARIETIE_NAME" label="品种名称" width="100" show-overflow-tooltip />
            <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" width="140" show-overflow-tooltip />
            <el-table-column prop="SUPPLY_PRICE" label="收货价" width="68" />
            <el-table-column prop="PURCHASE_PRICE" label="采购价" width="68" />
            <el-table-column prop="UNIT" label="单位" width="52" />
            <el-table-column prop="APPROVAL_NUMBER" label="注册证" width="100" show-overflow-tooltip />
            <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业" width="120" show-overflow-tooltip />
            <el-table-column prop="COEFFICIENT" label="系数" width="52" />
            <el-table-column label="收货包数/散" width="88">
              <template slot-scope="{ row }">{{ fmtDefPkg(row) }}</template>
            </el-table-column>
            <el-table-column label="拒收包数/散" width="88">
              <template slot-scope="{ row }">{{ fmtJsDefPkg(row) }}</template>
            </el-table-column>
            <el-table-column prop="BATCH" label="批号" width="90" show-overflow-tooltip />
            <el-table-column label="生产日期" width="96">
              <template slot-scope="{ row }">{{ fmtDate10(row.BATCH_PRODUCTION_DATE) }}</template>
            </el-table-column>
            <el-table-column label="有效期" width="96">
              <template slot-scope="{ row }">{{ fmtDate10(row.BATCH_VALIDITY_PERIOD) }}</template>
            </el-table-column>
            <el-table-column prop="DISINFECTION_BATCH" label="灭菌批号" width="90" show-overflow-tooltip />
            <el-table-column prop="SUPPLIER_NAME" label="供应商" width="100" show-overflow-tooltip />
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click.stop="openEdit(row)">编辑</el-button>
                <el-button type="text" size="mini" @click.stop="openUdi(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span class="count-tip">共 {{ delTotal }} 条</span>
        </el-card>
      </el-col>

      <!-- 定数码 -->
      <el-col :span="5">
        <el-card shadow="never" class="panel-card">
          <div class="section-title row-title">
            <span>定数码</span>
            <!-- <span class="count-tip">共 {{ defTotal }} 条</span> -->
          </div>
          <div class="local-toolbar spd-toolbar">
            <div class="spd-toolbar__group">
              <div class="spd-toolbar__btns">
                <el-button size="mini" type="warning" :disabled="!defSelection.length" @click="onRejectDef">拒收定数码</el-button>
              </div>
            </div>
            <div class="spd-toolbar__divider" />
            <div class="spd-toolbar__group">
              <div class="spd-toolbar__btns">
                <el-button size="mini" :disabled="!selectedMain" @click="exportDef">导出</el-button>
              </div>
            </div>
          </div>
          <el-table
            ref="defTable"
            v-loading="defLoading"
            :data="defRows"
            border
            stripe
            size="mini"
            height="calc(100vh - 240px)"
            @selection-change="defSelection = $event"
          >
            <el-table-column type="selection" width="42" align="center" />
            <el-table-column prop="DEF_NO_PKG_CODE" label="定数码" min-width="120" show-overflow-tooltip />
            <el-table-column label="状态" width="72">
              <template slot-scope="{ row }">{{ fmtDefState(row.STATE) }}</template>
            </el-table-column>
          </el-table>
          <span class="count-tip">共 {{ defTotal }} 条</span>
        </el-card>
      </el-col>
    </el-row>

    <EditBatchDialog :visible.sync="editVisible" :row="editRow" @saved="loadDel" />
    <DeptTwoPickerDialog :visible.sync="deptPickerVisible" @pick="onDeptPicked" />
    <ReceiptDeptDialog
      :visible.sync="receiptDept.visible"
      :title="receiptDept.title"
      :dept-name="receiptDept.deptName"
      :loading="receiptDept.loading"
      @pick-dept="deptPickerVisible = true"
      @confirm="onReceiptDeptConfirm"
      @reset="resetReceiptDept"
    />
    <CentreBankWatchUdiDialog
      :visible.sync="udiVisible"
      :batch-id="udiBatchId"
      :title="udiTitle"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';
import * as api from '@/api/Task/AuthOrder';
import { openExcelFile } from '@/views/Inventory/CentreBankTakeGoods/utils';
import CentreBankWatchUdiDialog from '@/views/Inventory/CentreBankWatchUdi/CentreBankWatchUdiDialog.vue';
import EditBatchDialog from './components/EditBatchDialog.vue';
import DeptTwoPickerDialog from './components/DeptTwoPickerDialog.vue';
import ReceiptDeptDialog from './components/ReceiptDeptDialog.vue';
import { fmtDate10, fmtDefPkg, fmtJsDefPkg, fmtDefState } from './utils';

export default {
  name: 'AuthOrder',
  components: {
    EditBatchDialog,
    DeptTwoPickerDialog,
    ReceiptDeptDialog,
    CentreBankWatchUdiDialog
  },
  data() {
    return {
      mainQuery: { deliveryNoteNumber: '', orderState: '0' },
      mainLoading: false,
      mainRows: [],
      mainPage: 1,
      mainPageSize: 30,
      mainTotal: 0,
      selectedMain: null,

      delLoading: false,
      delRows: [],
      delTotal: 0,
      selectedDel: null,

      defLoading: false,
      defRows: [],
      defTotal: 0,
      defSelection: [],
      selectedB2bDelId: '',

      editVisible: false,
      editRow: null,

      deptPickerVisible: false,
      receiptDept: {
        visible: false,
        mode: '',
        title: '',
        deptName: '',
        deptCode: '',
        loading: false
      },

      udiVisible: false,
      udiBatchId: '',
      udiTitle: ''
    };
  },
  computed: {
    showConfirmReceipt() {
      return true;
    },
    showReceiptToUse() {
      return HOME_HP === 'bd';
    },
    showReceiptToSend() {
      return true;
    }
  },
  created() {
    this.loadMain(true);
  },
  methods: {
    fmtDate10,
    fmtDefPkg,
    fmtJsDefPkg,
    fmtDefState,

    parseTotal(res, fallback = 0) {
      const t = res?.total ?? res?.Total;
      if (t != null && t !== '') return Number(t) || 0;
      return fallback;
    },

    async loadMain(resetPage) {
      if (resetPage) this.mainPage = 1;
      this.mainLoading = true;
      try {
        const res = await api.getAuthOrderMain({
          deliveryNoteNumber: this.mainQuery.deliveryNoteNumber,
          orderState: this.mainQuery.orderState,
          page: this.mainPage,
          size: this.mainPageSize
        });
        this.mainRows = res.result || [];
        this.mainTotal = this.parseTotal(res, this.mainRows.length);
      } catch (e) {
        Message.error(e.message || '加载订单失败');
      } finally {
        this.mainLoading = false;
      }
    },

    onMainSelect(row) {
      this.selectedMain = row || null;
      this.selectedDel = null;
      this.selectedB2bDelId = '';
      this.defSelection = [];
      this.delRows = [];
      this.delTotal = 0;
      this.defRows = [];
      this.defTotal = 0;
      if (row) {
        this.loadDel();
        this.loadDef();
      }
    },

    async loadDel() {
      if (!this.selectedMain?.DELIVERY_NOTE_NUMBER) return;
      this.delLoading = true;
      try {
        const res = await api.getAuthOrderDel(this.selectedMain.DELIVERY_NOTE_NUMBER);
        this.delRows = res.result || [];
        this.delTotal = this.parseTotal(res, this.delRows.length);
      } catch (e) {
        Message.error(e.message || '加载明细失败');
      } finally {
        this.delLoading = false;
      }
    },

    onDelSelect(row) {
      this.selectedDel = row || null;
      this.selectedB2bDelId = row?.B2B_DEL_ID || '';
      this.defSelection = [];
      this.loadDef();
    },

    async loadDef() {
      if (!this.selectedMain?.DELIVERY_NOTE_NUMBER) return;
      this.defLoading = true;
      try {
        const res = await api.getAuthOrderDef(
          this.selectedMain.DELIVERY_NOTE_NUMBER,
          this.selectedB2bDelId
        );
        this.defRows = res.result || [];
        this.defTotal = this.parseTotal(res, this.defRows.length);
      } catch (e) {
        Message.error(e.message || '加载定数码失败');
      } finally {
        this.defLoading = false;
      }
    },

    openEdit(row) {
      this.editRow = row;
      this.editVisible = true;
    },

    openUdi(row) {
      if (!row?.BATCH_ID) {
        Message.warning('缺少批号标识');
        return;
      }
      this.udiBatchId = row.BATCH_ID;
      this.udiTitle = `${row.BATCH_ID} 查看UDI`;
      this.udiVisible = true;
    },

    async onRejectDef() {
      if (!this.defSelection.length) {
        Message.warning('请选择拒收定数码');
        return;
      }
      try {
        await MessageBox.confirm('确认拒收吗？', '提示', { type: 'warning' });
        await api.jsOrderDef(this.defSelection);
        Message.success('处理成功');
        await this.loadDef();
        await this.loadDel();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '拒收失败');
      }
    },

    async onConfirmReceipt() {
      if (!this.selectedMain) {
        Message.warning('请选择收货单号');
        return;
      }
      try {
        await MessageBox.confirm('确认收货吗？', '提示', { type: 'warning' });
        await api.authOrderReceipt(
          this.selectedMain.DELIVERY_NOTE_NUMBER,
          this.selectedMain.ID
        );
        api.syncB2bOrderReceive(this.selectedMain.DELIVERY_NOTE_NUMBER).catch(() => {});
        Message.success('收货成功');
        await this.loadDef();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '收货失败');
      }
    },

    openReceiptDialog(mode) {
      if (!this.selectedMain) {
        Message.warning('请选择收货单号');
        return;
      }
      const note = this.selectedMain.DELIVERY_NOTE_NUMBER;
      this.receiptDept = {
        visible: true,
        mode,
        title: (mode === 'use' ? '收货结算' : '收货至出库') + note,
        deptName: '',
        deptCode: '',
        loading: false
      };
    },

    onDeptPicked({ code, name }) {
      this.receiptDept.deptName = name;
      this.receiptDept.deptCode = code;
    },

    resetReceiptDept() {
      this.receiptDept.deptName = '';
      this.receiptDept.deptCode = '';
    },

    async onReceiptDeptConfirm() {
      const { mode, deptCode } = this.receiptDept;
      if (!deptCode) {
        Message.warning('请选择结算科室');
        return;
      }
      if (!this.selectedMain) return;
      const note = this.selectedMain.DELIVERY_NOTE_NUMBER;
      const receiptId = this.selectedMain.ID;
      this.receiptDept.loading = true;
      try {
        if (mode === 'use') {
          const res = await api.authOrderReceiptToUse(note, receiptId, deptCode);
          try {
            await api.authOrderReceiptToDept(note, receiptId, deptCode);
          } catch (deptErr) {
            Message.error(`收货：${res.msg || '成功'} 补单：${deptErr.message || '失败'}`);
            return;
          }
          api.syncB2bOrderReceive(note).catch(() => {});
          Message.success(res.msg || '操作成功');
        } else {
          let shMsg = '';
          try {
            const res = await api.authOrderReceiptToSend(note, receiptId, deptCode);
            shMsg = res.msg || '';
          } catch (e) {
            shMsg = e.message || '';
          }
          try {
            await api.b2bAuthOrderReceiptToSend(note, receiptId, deptCode);
            api.syncB2bOrderReceive(note).catch(() => {});
            Message.success(shMsg || '操作成功');
          } catch (b2bErr) {
            Message.error(`收货：${shMsg || '—'} 补单：${b2bErr.message || '失败'}`);
            return;
          }
        }
        this.receiptDept.visible = false;
        await this.loadDef();
        await this.loadMain();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.receiptDept.loading = false;
      }
    },

    async onPrint() {
      if (!this.selectedMain) {
        Message.warning('请选择收货单号');
        return;
      }
      try {
        const deliveryTime = fmtDate10(this.selectedMain.DELIVERY_TIME);
        const res = await api.printAuthOrderReceipt({
          deliveryNoteNumber: this.selectedMain.DELIVERY_NOTE_NUMBER,
          deliveryTime,
          receiptId: this.selectedMain.ID,
          size: 4
        });
        openExcelFile(res.msg);
      } catch (e) {
        Message.error(e.message || '打印失败');
      }
    },

    async onReplace() {
      if (!this.selectedMain) return;
      try {
        const res = await api.authOrderReplace(
          this.selectedMain.DELIVERY_NOTE_NUMBER,
          this.selectedMain.ID
        );
        Message.success(res.msg || '操作成功');
        await this.loadMain();
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },

    async exportDetail() {
      if (!this.selectedMain) return;
      try {
        const res = await api.getAuthOrderDel(this.selectedMain.DELIVERY_NOTE_NUMBER);
        const rows = res.result || [];
        const aoa = [
          [
            '品种编码',
            '品种全称',
            '型号规格',
            '收货价',
            '采购价',
            '单位',
            '注册证',
            '生产企业',
            '系数',
            '收货包数/散',
            '拒收包数/散',
            '批号',
            '生产日期',
            '有效期',
            '灭菌批号',
            '供应商'
          ]
        ];
        rows.forEach((r) => {
          aoa.push([
            r.VARIETIE_CODE_NEW,
            r.VARIETIE_NAME,
            r.SPECIFICATION_OR_TYPE,
            r.SUPPLY_PRICE,
            r.PURCHASE_PRICE,
            r.UNIT,
            r.APPROVAL_NUMBER,
            r.MANUFACTURING_ENT_NAME,
            r.COEFFICIENT,
            fmtDefPkg(r),
            fmtJsDefPkg(r),
            r.BATCH,
            fmtDate10(r.BATCH_PRODUCTION_DATE),
            fmtDate10(r.BATCH_VALIDITY_PERIOD),
            r.DISINFECTION_BATCH,
            r.SUPPLIER_NAME
          ]);
        });
        const sheet = utils.aoa_to_sheet(aoa);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '订单明细');
        writeFile(book, '订单明细.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      }
    },

    async exportDef() {
      if (!this.selectedMain) return;
      try {
        const res = await api.getAuthOrderDef(
          this.selectedMain.DELIVERY_NOTE_NUMBER,
          this.selectedB2bDelId
        );
        const rows = res.result || [];
        const aoa = [['定数码', '状态']];
        rows.forEach((r) => {
          aoa.push([r.DEF_NO_PKG_CODE, fmtDefState(r.STATE)]);
        });
        const sheet = utils.aoa_to_sheet(aoa);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '定数码');
        writeFile(book, '订单定数码.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-order-page {
  .panel-card {
    :deep(.el-card__body) {
      padding: 12px;
    }
  }
  .section-title {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
  }
  .row-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .count-tip {
    font-weight: normal;
    font-size: 12px;
    color: #909399;
  }
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
    align-items: center;
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
  .pager {
    margin-top: 8px;
    text-align: right;
  }
}
</style>
