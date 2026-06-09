<template>
  <div class="ele-body bid-var-info">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="品种编码">
          <el-input v-model="filters.VARIETIE_CODE_NEW" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input v-model="filters.PROD_REGISTRATION_NAME" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="filters.GG" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.APPROVAL_NUMBER" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="filters.SUP_NAME" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="使用科室">
          <el-input v-model="filters.USE_DEPT" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="导入时间">
          <el-date-picker
            v-model="filters.CREATE_BATCH"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="filters.CREATE_BATCH2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="生产企业">
          <el-input v-model="filters.MANUFACTURING_ENT_NAME" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="合同编码">
          <el-input v-model="filters.CONTRACT_CODE" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="合同开始">
          <el-date-picker
            v-model="filters.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="合同结束">
          <el-date-picker
            v-model="filters.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="filters.IS_USE" clearable style="width: 90px">
            <el-option label="使用" value="1" />
            <el-option label="全部" value="" />
            <el-option label="弃用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="在用状态">
          <el-select v-model="filters.IS_HAVE" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="已申请" value="2" />
            <el-option label="未使用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否高值">
          <el-select v-model="filters.HIGH_OR_LOW_CLASS" clearable style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="重点治理">
          <el-select v-model="filters.IS_IN_COUNTRY_IMPORT" clearable style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="重点治理序号">
          <el-input v-model="filters.HIGH_CLASS_XH" clearable style="width: 80px" />
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="价格是否一致">
          <el-select v-model="filters.IS_PRICE" clearable style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否含有库存">
          <el-select v-model="filters.KC" clearable style="width: 80px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button type="primary" plain @click="onEnable">启用</el-button>
          <el-button type="danger" plain @click="onDisable">停用</el-button>
          <el-button @click="downloadTemplate">获取导入模板</el-button>
          <el-upload
            class="inline-upload"
            action=""
            :show-file-list="false"
            accept=".xlsx,.xls"
            :http-request="onImport"
          >
            <el-button :loading="importing">导入</el-button>
          </el-upload>
          <el-button
            v-permission="'export-BidVarInfo-mldc'"
            type="primary"
            plain
            :loading="exporting"
            @click="exportExcel"
          >
            导出
          </el-button>
          <el-button @click="openSyncDialog">同步品种</el-button>
          <el-button :loading="syncAdding" @click="onSyncAdd">同步新增品种</el-button>
          <el-button @click="openBatchRemark">批量备注</el-button>
          <el-upload
            class="inline-upload"
            action=""
            :show-file-list="false"
            accept=".xlsx,.xls"
            :http-request="onBatchStopImport"
          >
            <el-button type="danger" plain :loading="batchStopImporting">批量停用</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="filters"
        :selection.sync="selection"
        :page-size="30"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="BidVarInfo"
        @done="onTableDone"
      >
        <template v-slot:DETAIL="{ row }">
          <el-button type="text" size="mini" @click="openEdit(row)">编辑/详情</el-button>
        </template>
        <template v-slot:REMARK="{ row }">
          <el-button type="text" size="mini" @click="openRemark(row)">
            {{ row.REMARK ? row.REMARK : '无' }}
          </el-button>
        </template>
        <template v-slot:IS_NEED_ADD="{ row }">
          {{ formatIsNeedAdd(row) }}
        </template>
        <template v-slot:SPD_PRICE="{ row }">
          <span :class="{ 'text-danger': isPriceMismatch(row.SPD_PRICE, row.PRICE) }">
            {{ row.SPD_PRICE }}
          </span>
        </template>
        <template v-slot:SUPPLY_PRICE="{ row }">
          <span :class="{ 'text-danger': isPriceMismatch(row.SUPPLY_PRICE, row.PRICE) }">
            {{ row.SUPPLY_PRICE }}
          </span>
        </template>
        <template v-slot:SPD_UNIT="{ row }">
          <span
            v-if="row.SPD_UNIT != null"
            :class="{ 'text-danger': isPriceMismatch(row.SPD_UNIT, row.UNIT) }"
          >
            {{ row.SPD_UNIT }}
          </span>
        </template>
        <template v-slot:IS_USE="{ row }">
          {{ formatIsUse(row.IS_USE) }}
        </template>
        <template v-slot:CONTRACT_START="{ row }">
          {{ formatDateOnly(row.CONTRACT_START) }}
        </template>
        <template v-slot:CONTRACT_END="{ row }">
          {{ formatDateOnly(row.CONTRACT_END) }}
        </template>
        <template v-slot:HIGH_OR_LOW_CLASS="{ row }">
          {{ formatYesNo(row.HIGH_OR_LOW_CLASS) }}
        </template>
        <template v-slot:IS_IN_COUNTRY_IMPORT="{ row }">
          {{ formatYesNo(row.IS_IN_COUNTRY_IMPORT) }}
        </template>
      </ele-pro-table>
    </el-card>

    <EditBidVarDialog
      :visible.sync="editVisible"
      :record-id="editId"
      @done="reloadCurrentPage"
    />
    <SyncFieldDialog
      :visible.sync="syncVisible"
      :loading="syncing"
      @confirm="onSyncConfirm"
    />
    <RemarkDialog
      :visible.sync="remarkVisible"
      :initial-value="remarkInitial"
      :loading="remarkSaving"
      @confirm="saveRemark"
    />
    <RemarkDialog
      :visible.sync="batchRemarkVisible"
      title="批量备注"
      :loading="batchRemarkSaving"
      @confirm="saveBatchRemark"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { BACK_BASE_URL } from '@/config/setting';
import {
  searchBidVarInfo,
  bidVarInfoEnableCommit,
  updateBidVarInfoBz,
  bidVarUpLargeBz,
  synchVarByBidVarInfo,
  synchAddVar,
  importBidVar,
  importBidVarBatchStop
} from '@/api/Home/BidVarInfo';
import {
  defaultFilters,
  buildColumns,
  exportBidVarPage,
  formatDateOnly,
  formatIsNeedAdd,
  formatIsUse,
  formatYesNo,
  isPriceMismatch
} from './utils';
import EditBidVarDialog from './components/EditBidVarDialog.vue';
import SyncFieldDialog from './components/SyncFieldDialog.vue';
import RemarkDialog from './components/RemarkDialog.vue';

export default {
  name: 'BidVarInfo',
  components: { EditBidVarDialog, SyncFieldDialog, RemarkDialog },
  data() {
    return {
      filters: defaultFilters(),
      columns: buildColumns(),
      selection: [],
      tableTotal: 0,
      exporting: false,
      importing: false,
      batchStopImporting: false,
      syncing: false,
      syncAdding: false,
      remarkSaving: false,
      batchRemarkSaving: false,
      editVisible: false,
      editId: '',
      syncVisible: false,
      remarkVisible: false,
      remarkInitial: '',
      remarkRowId: '',
      batchRemarkVisible: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 360px)';
    }
  },
  methods: {
    formatDateOnly,
    formatIsNeedAdd,
    formatIsUse,
    formatYesNo,
    isPriceMismatch,
    datasource({ page, limit, where }) {
      return searchBidVarInfo(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    reloadCurrentPage() {
      this.$refs.table.reload({ where: { ...this.filters } });
    },
    onTableDone(res) {
      this.tableTotal = res?.count ?? 0;
    },
    requireSelection() {
      if (!this.selection.length) {
        Message.warning('请先勾选数据');
        return false;
      }
      return true;
    },
    openEdit(row) {
      this.editId = row.ID;
      this.editVisible = true;
    },
    openRemark(row) {
      this.remarkRowId = row.ID;
      this.remarkInitial = row.REMARK || '';
      this.remarkVisible = true;
    },
    async saveRemark(remark) {
      this.remarkSaving = true;
      try {
        const res = await updateBidVarInfoBz(this.remarkRowId, remark);
        Message.success(res.msg || '保存成功');
        this.remarkVisible = false;
        this.reloadCurrentPage();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.remarkSaving = false;
      }
    },
    openBatchRemark() {
      if (!this.requireSelection()) return;
      this.batchRemarkVisible = true;
    },
    async saveBatchRemark(remark) {
      const ids = this.selection.map((row) => row.ID).join(',');
      this.batchRemarkSaving = true;
      try {
        const res = await bidVarUpLargeBz(ids, remark);
        Message.success(res.msg || '保存成功');
        this.batchRemarkVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.batchRemarkSaving = false;
      }
    },
    async onEnable() {
      if (!this.requireSelection()) return;
      try {
        await MessageBox.confirm('是否启用当前品种？', '提示', { type: 'warning' });
        const res = await bidVarInfoEnableCommit(this.selection, 1);
        Message.success(res.msg || '操作成功');
        this.reloadCurrentPage();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onDisable() {
      if (!this.requireSelection()) return;
      try {
        await MessageBox.confirm('是否停用当前品种？', '提示', { type: 'warning' });
        const res = await bidVarInfoEnableCommit(this.selection, 0);
        Message.success(res.msg || '操作成功');
        this.reloadCurrentPage();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    openSyncDialog() {
      if (!this.requireSelection()) return;
      this.syncVisible = true;
    },
    async onSyncConfirm(fields) {
      const ids = this.selection.map((row) => row.ID).join(',');
      this.syncing = true;
      try {
        const res = await synchVarByBidVarInfo(ids, fields);
        Message.success(res.msg || '同步成功');
        this.syncVisible = false;
        this.reloadCurrentPage();
      } catch (e) {
        Message.error(e.message || '同步失败');
      } finally {
        this.syncing = false;
      }
    },
    async onSyncAdd() {
      if (!this.requireSelection()) return;
      this.syncAdding = true;
      try {
        const res = await synchAddVar(this.selection);
        await MessageBox.alert(res.msg || '操作完成', '提示');
        this.reloadCurrentPage();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.syncAdding = false;
      }
    },
    downloadTemplate() {
      window.open(`${BACK_BASE_URL}/Excel/zbml.xlsx`);
    },
    async onImport({ file }) {
      this.importing = true;
      try {
        const res = await importBidVar(file);
        await MessageBox.alert(res.msg || '导入完成', '提示');
        this.reloadCurrentPage();
      } catch (e) {
        Message.error(e.message || '导入失败');
      } finally {
        this.importing = false;
      }
    },
    async onBatchStopImport({ file }) {
      this.batchStopImporting = true;
      try {
        const res = await importBidVarBatchStop(file);
        Message.success(res.msg || '导入完成');
        this.reload();
      } catch (e) {
        Message.error(e.message || '导入失败');
      } finally {
        this.batchStopImporting = false;
      }
    },
    async exportExcel() {
      if (!this.tableTotal) {
        Message.warning('没有可导出的数据');
        return;
      }
      this.exporting = true;
      try {
        const pageSize = 150000;
        const pageCount = Math.ceil(this.tableTotal / pageSize) || 1;
        for (let page = 1; page <= pageCount; page += 1) {
          const res = await searchBidVarInfo(this.filters, page, pageSize);
          const rows = res.result || [];
          if (!rows.length) break;
          exportBidVarPage(rows, page);
        }
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
.inline-upload {
  display: inline-block;
  margin: 0 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
