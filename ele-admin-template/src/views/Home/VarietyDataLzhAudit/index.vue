<template>
  <div class="ele-body spd-page variety-audit-page">
    <el-card shadow="never" class="main-card">
      <div class="section-title">散货品种列表</div>

      <AuditSearch @search="reload" />

      <div class="toolbar-row">
        <el-button v-if="showKubaoBtn" size="mini" :loading="kuboLoading" @click="onKubaoCreate">
          库宝创建品种
        </el-button>
        <el-button size="mini" :loading="commitLoading" @click="onSendApproval">发送审批</el-button>
        <el-button type="primary" size="mini" :loading="approveLoading" @click="onApprovePass">
          审批通过
        </el-button>
        <el-button type="danger" size="mini" @click="onApproveReject">审批未通过</el-button>
        <el-button
          v-if="showSyncBtn"
          size="mini"
          :loading="syncLoading"
          @click="onPullSync"
        >
          南五同步
        </el-button>
        <el-button
          v-permission="'export-VarietyDataLzhDc'"
          size="mini"
          icon="el-icon-download"
          :loading="exporting"
          @click="onExport"
        >
          导出Excel
        </el-button>
      </div>

      <ele-pro-table
        ref="table"
        highlight-current-row
        height="calc(100vh - 360px)"
        size="mini"
        :stripe="true"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="tableColumns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="varietyDataLzhAuditTable"
      >
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openDetail(row)">编辑/详情</el-button>
        </template>
        <template v-slot:enable="{ row }">
          <el-tag size="mini" :type="row.Enable === '0' || row.Enable === 0 ? 'info' : 'success'">
            {{ formatEnable(row.Enable) }}
          </el-tag>
        </template>
        <template v-slot:approval="{ row }">
          <el-tag
            size="mini"
            :type="row.APPROVAL_STATE === '1' ? 'success' : row.APPROVAL_STATE === '2' ? 'danger' : 'warning'"
          >
            {{ formatApprovalState(row.APPROVAL_STATE) }}
          </el-tag>
        </template>
        <template v-slot:remark="{ row }">
          <el-button type="text" size="mini" @click="openRemark(row)">
            {{ row.BZ || '备注' }}
          </el-button>
        </template>
      </ele-pro-table>
    </el-card>

    <RemarkDialog :visible.sync="remarkVisible" :row="currentRow" @done="reloadTable" />
    <RejectRemarkDialog
      :visible.sync="rejectVisible"
      :rows="selection"
      @done="reloadTable"
    />
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import AuditSearch from './components/AuditSearch.vue';
import RemarkDialog from './components/RemarkDialog.vue';
import RejectRemarkDialog from './components/RejectRemarkDialog.vue';
import {
  approvalVarietieCommit,
  approvalVarietieOk,
  createStorageExcelCwjEpPlus,
  pullVarietieBasicInfoSync,
  queryAuditPageLayUI,
  sendVarToKuBo
} from '@/api/Home/VarietyDataLzhAudit';
import {
  formatApprovalState,
  formatContractType,
  formatDeptState,
  formatEnable,
  formatHighOrLowTwo,
  formatYesNo,
  openExcelFile
} from './utils';

export default {
  name: 'VarietyDataLzhAudit',
  components: { AuditSearch, RemarkDialog, RejectRemarkDialog },
  data() {
    return {
      pageSize: 15,
      pageSizes: [15, 30, 50, 100, 200, 999999],
      selection: [],
      currentWhere: null,
      currentRow: null,
      remarkVisible: false,
      rejectVisible: false,
      commitLoading: false,
      approveLoading: false,
      kuboLoading: false,
      syncLoading: false,
      exporting: false,
      showKubaoBtn: HOME_HP === 'bd',
      showSyncBtn: HOME_HP === 'fsdl' || HOME_HP === 'ybyy',
      isStse: HOME_HP === 'stse'
    };
  },
  computed: {
    tableColumns() {
      const cols = [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        { label: '操作', width: 110, fixed: 'left', slot: 'action', align: 'center' },
        { slot: 'enable', prop: 'Enable', label: '启用状态', width: 90, align: 'center' },
        { slot: 'remark', label: '备注', minWidth: 100, showOverflowTooltip: true },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          minWidth: 130,
          sortable: true,
          showOverflowTooltip: true
        },
        { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 200, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 180, showOverflowTooltip: true },
        { prop: 'manufacturing_ent_name', label: '生产企业名称', minWidth: 200, showOverflowTooltip: true },
        { prop: 'Unit', label: '单位', width: 70, align: 'center' },
        {
          prop: 'Price',
          label: '中标价',
          minWidth: 100,
          align: 'right',
          formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(2) : '')
        },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 180, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '启用合同供应商', minWidth: 200, showOverflowTooltip: true },
        {
          prop: 'CONTRACT_TYPE',
          label: '合同类型',
          minWidth: 90,
          align: 'center',
          formatter: (_r, _c, v) => formatContractType(v)
        },
        { slot: 'approval', prop: 'APPROVAL_STATE', label: '审批状态', minWidth: 100, align: 'center' },
        { prop: 'APPROVAL_TIME', label: '审批时间', minWidth: 155, showOverflowTooltip: true,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '') },
        { prop: 'APPROVAL_MAN', label: '审批人', minWidth: 100, showOverflowTooltip: true },
        { prop: 'Province_Platform_Code', label: '省平台编码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'YG_CODE', label: '阳光产品码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'MEDICAL_CODE', label: '医保编码', minWidth: 160, showOverflowTooltip: true },
        {
          prop: 'HIGH_OR_LOW_CLASS_TWO',
          label: '高低值下级属性',
          minWidth: 180,
          align: 'center',
          formatter: (_r, _c, v) => formatHighOrLowTwo(v)
        },
        {
          prop: 'IS_EQUIPMENT_CHANGE',
          label: '设备科是否修改',
          minWidth: 180,
          align: 'center',
          formatter: (_r, _c, v) => formatYesNo(v)
        }
      ];
      if (this.isStse) {
        cols.splice(4, 0,
          {
            prop: 'VARSPD_STATE',
            label: 'SPD状态',
            minWidth: 100,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARSB_STATE',
            label: '设备科状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARJFB_STATE',
            label: '计费办状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARYB_STATE',
            label: '医保办状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          }
        );
      }
      return cols;
    }
  },
  methods: {
    formatEnable,
    formatApprovalState,
    formatDeptState,
    datasource({ page, limit, where, order }) {
      this.currentWhere = where;
      return queryAuditPageLayUI({ page, limit, where, order }).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reload(where) {
      this.currentWhere = where;
      this.$refs.table?.reload({ page: 1, where });
    },
    reloadTable() {
      this.$refs.table?.reload({ where: this.currentWhere });
    },
    ensureSelection() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return false;
      }
      return true;
    },
    openDetail() {
      this.$message.info('编辑/详情弹窗待对接旧版 Frame 页面能力');
    },
    openRemark(row) {
      this.currentRow = row;
      this.remarkVisible = true;
    },
    async onSendApproval() {
      if (!this.ensureSelection()) return;
      this.commitLoading = true;
      try {
        const res = await approvalVarietieCommit(this.selection);
        this.$alert(res.msg || '操作完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '发送审批失败');
      } finally {
        this.commitLoading = false;
      }
    },
    async onApprovePass() {
      if (!this.ensureSelection()) return;
      this.approveLoading = true;
      try {
        const res = await approvalVarietieOk(this.selection, 1);
        this.$alert(res.msg || '操作完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '审批失败');
      } finally {
        this.approveLoading = false;
      }
    },
    onApproveReject() {
      if (!this.ensureSelection()) return;
      this.rejectVisible = true;
    },
    async onKubaoCreate() {
      if (!this.ensureSelection()) return;
      this.kuboLoading = true;
      try {
        const res = await sendVarToKuBo(this.selection);
        this.$message.success(res.msg || '操作成功');
      } catch (e) {
        this.$message.error(e.message || '库宝创建失败');
      } finally {
        this.kuboLoading = false;
      }
    },
    async onPullSync() {
      this.syncLoading = true;
      try {
        const res = await pullVarietieBasicInfoSync();
        this.$alert(res.msg || '同步完成', '提示');
      } catch (e) {
        this.$message.error(e.message || '同步失败');
      } finally {
        this.syncLoading = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await createStorageExcelCwjEpPlus(this.currentWhere || {});
        if (res.msg) {
          openExcelFile(res.msg);
          this.$message.success(
            res.totalCount ? `导出成功，共 ${res.totalCount} 条` : '导出成功'
          );
        }
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.variety-audit-page {
  padding-bottom: 12px;
}
.main-card ::v-deep .el-card__body {
  padding: 12px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}
.toolbar-row {
  margin: 8px 0 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.variety-audit-page ::v-deep .ele-pro-table .el-table {
  width: 100%;
}
.variety-audit-page ::v-deep .ele-pro-table .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
