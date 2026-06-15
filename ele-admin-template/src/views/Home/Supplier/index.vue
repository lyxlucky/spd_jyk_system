<template>
  <div class="ele-body supplier-page">
    <el-card shadow="never">
      <el-form size="mini" class="filter-form" @submit.native.prevent>
        <el-row :gutter="8" type="flex" style="flex-wrap: wrap; align-items: center">
          <el-col :lg="4" :md="6" :sm="12">
            <el-input
              v-model="where.keyword"
              clearable
              placeholder="搜索"
              @keyup.enter.native="reload"
            />
          </el-col>
          <el-col :lg="2" :md="4" :sm="8">
            <el-select v-model="where.enable" placeholder="启用状态" style="width: 100%">
              <el-option label="启用" value="1" />
              <el-option label="全部" value="" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-col>
          <el-col v-if="hpFlags.isSzhn" :lg="2" :md="4" :sm="8">
            <el-select v-model="where.state" placeholder="OES推送" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="已推送" value="1" />
              <el-option label="未推送" value="0" />
            </el-select>
          </el-col>
          <el-col :lg="12" :md="14" :sm="24">
            <el-button type="primary" icon="el-icon-search" @click="reload">搜索</el-button>
            <!-- 旧页 add_supplier → Frame/AddSupplier，待迁移 -->
            <el-button v-if="!hpFlags.disableEdit" icon="el-icon-plus" @click="onAdd">添加</el-button>
            <el-button icon="el-icon-download" :loading="exporting" @click="onExport">导出供应商信息</el-button>
            <!-- 旧页 SendSzhnSupHis，仅华南 szhn -->
            <el-button
              v-if="hpFlags.isSzhn"
              :loading="sendingOes"
              :disabled="!currentRow"
              @click="onSendOes"
            >
              推送供应商(OES)
            </el-button>
            <!-- 旧页 showSupZong，需「总目录」权限 -->
            <el-button v-if="hpFlags.showZongMl" @click="zongVisible = true">总目录</el-button>
            <!-- 旧页 STOP_SEND(1)，需先选中行 -->
            <el-button :disabled="!currentRow" @click="onStopSend(1)">禁止配送</el-button>
            <el-button :disabled="!currentRow" @click="onStopSend(0)">取消禁止</el-button>
          </el-col>
        </el-row>
      </el-form>

      <ele-pro-table
        ref="table"
        highlight-current-row
        height="calc(100vh - 220px)"
        size="mini"
        :stripe="true"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        cache-key="supplierMaintainTable"
        @current-change="onCurrentChange"
      >
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openSeal(row)">上传送货章</el-button>
          <el-button v-if="hpFlags.hasScope" type="text" size="mini" @click="onScope(row)">经营范围</el-button>
          <el-button type="text" size="mini" @click="openGx(row)">上传购销合同</el-button>
          <!-- 旧页 edit_supplier → Frame/EditSupplier，待迁移 -->
          <el-button type="text" size="mini" @click="onEdit(row)">编辑</el-button>
        </template>
        <template v-slot:cw="{ row }">
          <el-button type="text" size="mini" @click="openCw(row)">财务属性</el-button>
        </template>
        <template v-slot:enable="{ row }">
          <el-tag size="mini" :type="row.Enable === 1 || row.Enable === '1' ? 'success' : 'info'">
            {{ formatEnable(row.Enable) }}
          </el-tag>
        </template>
        <template v-slot:stopSend="{ row }">
          {{ formatStopSend(row.STOP_SEND) }}
        </template>
        <template v-slot:sealPic="{ row }">
          <template v-if="row.OFFICIAL_SEAL_PICTURE">
            <el-button
              v-if="isPdf(row.OFFICIAL_SEAL_PICTURE)"
              type="text"
              size="mini"
              @click="openPdf(row.OFFICIAL_SEAL_PICTURE)"
            >
              pdf文件
            </el-button>
            <img
              v-else
              v-viewer
              class="seal-thumb"
              :src="proPicUrl(row.OFFICIAL_SEAL_PICTURE)"
              alt="送货章"
            />
          </template>
        </template>
        <template v-slot:busLic="{ row }">
          <date-link :row="row" field="Business_License_Valid_Date" pic-field="BUSINESS_LICENSE_PIC" @preview="previewPic" />
        </template>
        <template v-slot:class1="{ row }">
          <date-link :row="row" field="RODUCTION_CLASS_1_VALID_DATE" pic-field="RODUCTION_CLASS_1_PIC" @preview="previewPic" />
        </template>
        <template v-slot:class2="{ row }">
          <date-link :row="row" field="Roduction_class_2_Valid_Date" pic-field="RODUCTION_CLASS_2_PIC" @preview="previewPic" />
        </template>
        <template v-slot:class3="{ row }">
          <date-link :row="row" field="Roduction_class_3_Valid_Date" pic-field="RODUCTION_CLASS_3_PIC" @preview="previewPic" />
        </template>
        <template v-slot:drDate="{ row }">
          <date-link :row="row" field="DR_VALID_DATE" pic-field="DR_PIC" @preview="previewPic" />
        </template>
        <template v-slot:wtsDate="{ row }">
          <date-link :row="row" field="WTS_VALID_DATE" pic-field="WTS_PIC" @preview="previewPic" />
        </template>
        <template v-slot:gxDate="{ row }">
          <date-link :row="row" field="GX_VALIDITY_PERIOD" pic-field="GX_VALIDITY_PERIOD_PIC" @preview="previewPic" />
        </template>
        <template v-slot:nature="{ row }">
          {{ formatSupplierNature(row.Supplier_Nature) }}
        </template>
        <template v-slot:coldChain="{ row }">
          {{ formatColdChain(row.Cold_Chain_Apparatus_Supply) }}
        </template>
        <template v-slot:history="{ row }">
          <el-button type="text" size="mini" @click="openHistory(row)">历史图片</el-button>
        </template>
      </ele-pro-table>
    </el-card>

    <CwDialog :visible.sync="cwVisible" :data="actionRow" @done="reloadTable" />
    <UploadSealDialog
      :visible.sync="sealVisible"
      :supplier-code="actionRow?.Supplier_Code"
      @done="reloadTable"
    />
    <UploadGxDialog
      :visible.sync="gxVisible"
      :supplier-code="actionRow?.Supplier_Code"
      @done="reloadTable"
    />
    <HistoryPicDialog
      :visible.sync="historyVisible"
      :supplier-code="actionRow?.Supplier_Code"
      :supplier-name="actionRow?.Supplier_Name"
    />
    <SupZongDialog :visible.sync="zongVisible" @done="reloadTable" />
  </div>
</template>

<script>
import CwDialog from './components/CwDialog.vue';
import UploadSealDialog from './components/UploadSealDialog.vue';
import UploadGxDialog from './components/UploadGxDialog.vue';
import HistoryPicDialog from './components/HistoryPicDialog.vue';
import SupZongDialog from './components/SupZongDialog.vue';
import DateLink from './components/DateLink.vue';
import { exportAllSuppliers, getSupplierList, sendSupToOes, upStopSend } from '@/api/Home/Supplier';
import {
  buildColumns,
  buildSupplierHpFlags,
  createDefaultWhere,
  formatColdChain,
  formatEnable,
  formatStopSend,
  formatSupplierNature,
  formatValidDate,
  openExcelFile,
  proPicUrl
} from './utils';

export default {
  name: 'SupplierMaintain',
  components: {
    CwDialog,
    UploadSealDialog,
    UploadGxDialog,
    HistoryPicDialog,
    SupZongDialog,
    DateLink
  },
  data() {
    const permissionGroup = this.$store.state.user?.info?.permission_group || [];
    const hpFlags = buildSupplierHpFlags(permissionGroup);
    return {
      hpFlags,
      where: createDefaultWhere(),
      currentWhere: null,
      currentRow: null,
      actionRow: null,
      pageSize: 30,
      pageSizes: [10, 30, 60, 90, 150, 300, 1000],
      columns: buildColumns(hpFlags),
      exporting: false,
      sendingOes: false,
      cwVisible: false,
      sealVisible: false,
      gxVisible: false,
      historyVisible: false,
      zongVisible: false
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    formatEnable,
    formatStopSend,
    formatSupplierNature,
    formatColdChain,
    formatValidDate,
    proPicUrl,
    isPdf(name) {
      return String(name || '').toLowerCase().indexOf('pdf') !== -1;
    },
    openPdf(name) {
      window.open(proPicUrl(name));
    },
    previewPic(picName) {
      const url = proPicUrl(picName);
      if (!url) return;
      if (this.isPdf(picName)) {
        window.open(url);
        return;
      }
      this.$viewerApi({ images: [url] });
    },
    onCurrentChange(row) {
      this.currentRow = row || null;
    },
    async datasource({ page, limit, where, order }) {
      const w = where || this.where;
      this.currentWhere = { ...w };
      try {
        const res = await getSupplierList({ page, limit, where: w, order });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: this.where });
    },
    reloadTable() {
      this.$refs.table.reload({ where: this.currentWhere || this.where });
    },
    onAdd() {
      this.$message.info('添加供应商功能待迁移（旧页 Frame/AddSupplier）');
    },
    onEdit(row) {
      this.$message.info(`编辑「${row.Supplier_Name}」待迁移（旧页 Frame/EditSupplier）`);
    },
    onScope(row) {
      this.$message.info(`「${row.Supplier_Name}」经营范围待迁移（旧页 /Home/ScopeOfBusiness）`);
    },
    openCw(row) {
      this.actionRow = row;
      this.cwVisible = true;
    },
    openSeal(row) {
      this.actionRow = row;
      this.sealVisible = true;
    },
    openGx(row) {
      this.actionRow = row;
      this.gxVisible = true;
    },
    openHistory(row) {
      this.actionRow = row;
      this.historyVisible = true;
    },
    requireCurrentRow(message = '请先选择一条供应商记录') {
      if (!this.currentRow) {
        this.$message.warning(message);
        return false;
      }
      return true;
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await exportAllSuppliers();
        openExcelFile(res.msg);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onSendOes() {
      if (!this.requireCurrentRow()) return;
      this.sendingOes = true;
      try {
        const nickname = this.$store.state.user?.info?.Nickname || '';
        const res = await sendSupToOes(this.currentRow.Supplier_Code, nickname);
        this.$alert(res.msg || '操作完成', '提示');
      } catch (e) {
        this.$message.error(e.message || '推送失败');
      } finally {
        this.sendingOes = false;
      }
    },
    async onStopSend(state) {
      if (!this.requireCurrentRow()) return;
      const tip = state === 1 ? '确认禁止该供应商配送？' : '确认取消禁止配送？';
      try {
        await this.$confirm(tip, '提示', { type: 'warning' });
        const res = await upStopSend(this.currentRow.Supplier_Code, state);
        this.$message.success(res.msg || '操作成功');
        this.reloadTable();
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '操作失败');
        }
      }
    }
  }
};
</script>

<style scoped>
.filter-form {
  margin-bottom: 10px;
}
.seal-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  cursor: pointer;
  vertical-align: middle;
}
</style>
