<template>
  <div class="revise-management ele-body-small">
    <el-tabs v-model="activeTab" type="card" class="revise-tabs">
      <el-tab-pane label="盘点库存比对" name="compare">
        <div class="compare-layout">
          <el-card shadow="never" class="panel-card time-panel">
            <div slot="header" class="panel-title">时间列表</div>
            <el-table
              v-loading="timeLoading"
              :data="timeRows"
              border
              stripe
              size="small"
              highlight-current-row
              height="calc(100vh - 220px)"
              @current-change="onTimeSelect"
            >
              <el-table-column
                prop="CREATE_TIME"
                label="创建时间"
                min-width="160"
                sortable
                :sort-method="(a, b) => sortDate(a, b, 'CREATE_TIME')"
              >
                <template slot-scope="{ row }">{{ fmtDate(row.CREATE_TIME) }}</template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card shadow="never" class="panel-card dept-panel">
            <div slot="header" class="panel-title">科室列表</div>
            <el-table
              v-loading="deptLoading"
              :data="deptRows"
              border
              stripe
              size="small"
              highlight-current-row
              height="calc(100vh - 220px)"
              @current-change="onDeptSelect"
            >
              <el-table-column
                prop="DEPT_TWO_NAME"
                label="科室名称"
                min-width="80"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'DEPT_TWO_NAME')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="CYCOUNT"
                label="差异数"
                min-width="80"
                align="center"
                sortable
                :sort-method="(a, b) => sortNum(a, b, 'CYCOUNT')"
              />
              <el-table-column
                prop="QSCOUNT"
                label="缺少数"
                min-width="80"
                align="center"
                sortable
                :sort-method="(a, b) => sortNum(a, b, 'QSCOUNT')"
              />
              <el-table-column
                prop="YCCOUNT"
                label="溢出数"
                min-width="80"
                align="center"
                sortable
                :sort-method="(a, b) => sortNum(a, b, 'YCCOUNT')"
              />
              <el-table-column
                prop="DEPT_SP_STATE"
                label="审批状态"
                min-width="80"
                align="center"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'DEPT_SP_STATE')"
              >
                <template slot-scope="{ row }">{{ fmtDeptSpState(row.DEPT_SP_STATE) }}</template>
              </el-table-column>
              <el-table-column
                prop="DEPT_SP_MAN"
                label="审批人"
                min-width="80"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'DEPT_SP_MAN')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="DEPT_SP_TIME"
                label="审批时间"
                min-width="80"
                sortable
                :sort-method="(a, b) => sortDate(a, b, 'DEPT_SP_TIME')"
              >
                <template slot-scope="{ row }">{{ fmtDateTime(row.DEPT_SP_TIME) }}</template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card shadow="never" class="panel-card main-panel">
            <div slot="header" class="panel-head">
              <span class="panel-title">库存稽查列表(盘点库存与系统库存的核对结果)</span>
            </div>
            <div class="audit-toolbar">
              <span class="toolbar-item">
                <a class="btn-link" @click.prevent="exportAuditExcel">导出excel</a>
              </span>
              <span class="toolbar-item">
                <a class="btn-link" @click.prevent="onSupplementZj">补暂借</a>
              </span>
              <span class="toolbar-item">
                <a class="btn-link" @click.prevent="onPrintConsume">补消耗打印</a>
              </span>
              <span class="toolbar-item filter-item">
                <label class="filter-label">盘点方式选择：</label>
                <el-select v-model="audit.pdWay" size="mini" style="width: 100px" @change="loadAudit(1)">
                  <el-option label="全部" value="" />
                  <el-option label="一致" value="1" />
                  <el-option label="缺少" value="0" />
                  <el-option label="溢出" value="2" />
                </el-select>
              </span>
              <span class="toolbar-item filter-item">
                <label class="filter-label">状态：</label>
                <el-select v-model="audit.stockState" size="mini" style="width: 100px" @change="loadAudit(1)">
                  <el-option label="全部" value="" />
                  <el-option label="上架" value="1" />
                  <el-option label="暂借" value="2" />
                  <el-option label="已出库" value="3" />
                  <el-option label="已退货" value="0" />
                </el-select>
              </span>
              <span class="toolbar-item toolbar-right">
                <a class="btn-link" @click.prevent="exportDeptServer">科室导出</a>
              </span>
              <span class="toolbar-item toolbar-right">
                <a class="btn-link" @click.prevent="exportAllServer">导出全部</a>
              </span>
            </div>
            <el-table
              ref="auditTable"
              v-loading="audit.loading"
              :data="audit.rows"
              border
              stripe
              size="small"
              height="calc(100vh - 310px)"
              @selection-change="(s) => (audit.selected = s)"
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column
                prop="VARIETIE_CODE_NEW"
                label="品种(材料)编码"
                min-width="110"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'VARIETIE_CODE_NEW')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="VARIETIE_NAME"
                label="品种全称"
                min-width="220"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'VARIETIE_NAME')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="SPECIFICATION_OR_TYPE"
                label="型号/规格"
                min-width="100"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'SPECIFICATION_OR_TYPE')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="MANUFACTURING_ENT_NAME"
                label="生产企业名称"
                min-width="140"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'MANUFACTURING_ENT_NAME')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="BATCH"
                label="生产批号"
                min-width="80"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'BATCH')"
              />
              <el-table-column prop="COEFFICIENT" label="系数" min-width="60" align="center" />
              <el-table-column
                prop="DEF_NO_PKG_CODE"
                label="定数码"
                min-width="120"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'DEF_NO_PKG_CODE')"
                show-overflow-tooltip
              />
              <el-table-column
                label="是否可补暂借"
                min-width="100"
                align="center"
                sortable
                :sort-method="sortCanZj"
              >
                <template slot-scope="{ row }">{{ fmtCanZj(row.STOCK_STATE) }}</template>
              </el-table-column>
              <el-table-column
                prop="CONSUMPTION_TYPE"
                label="消耗类型"
                min-width="120"
                sortable
                :sort-method="(a, b) => sortNum(a, b, 'CONSUMPTION_TYPE')"
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">{{ fmtConsumptionType(row.CONSUMPTION_TYPE) }}</template>
              </el-table-column>
              <el-table-column
                prop="RFID_CODE"
                label="RFID码"
                min-width="60"
                sortable
                :sort-method="(a, b) => sortStr(a, b, 'RFID_CODE')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="PDSTATE"
                label="是否一致"
                min-width="90"
                align="center"
                sortable
                :sort-method="(a, b) => sortNum(a, b, 'PDSTATE')"
              >
                <template slot-scope="{ row }">{{ fmtPdState(row.PDSTATE) }}</template>
              </el-table-column>
              <el-table-column
                label="当前库存状态"
                min-width="100"
                align="center"
                sortable
                :sort-method="sortStockState"
              >
                <template slot-scope="{ row }">{{ fmtStockState(row.STOCK_STATE) }}</template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pager"
              background
              small
              layout="total, sizes, prev, pager, next"
              :total="audit.total"
              :page-size="audit.size"
              :current-page="audit.page"
              :page-sizes="[20, 30, 60, 90, 150, 300]"
              @size-change="onAuditSize"
              @current-change="loadAudit"
            />
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="暂借/消耗修正" name="manual">
        <div class="inventory-area-top-table">
          <table class="detail-row-table">
            <thead>
              <tr>
                <th>品种（材料）编码</th>
                <th>品种全称</th>
                <th>批准文号</th>
                <th>有效到期</th>
                <th>供应商名称</th>
                <th>型号/规格</th>
                <th>单位</th>
                <th>生产企业名称</th>
                <th>生产批号</th>
                <th>系数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ detail.VARIETIE_CODE }}</td>
                <td>{{ detail.VARIETIE_NAME }}</td>
                <td>{{ detail.APPROVAL_NUMBER }}</td>
                <td>{{ detail.REGISTRATION_VALID_DATE }}</td>
                <td>{{ detail.SUPPLIER_NAME }}</td>
                <td>{{ detail.SPECIFICATION_OR_TYPE }}</td>
                <td>{{ detail.UNIT }}</td>
                <td>{{ detail.MANUFACTURING_ENT_NAME }}</td>
                <td>{{ detail.BATCH }}</td>
                <td>{{ detail.COEFFICIENT }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="manual-toolbar">
          <div class="manual-search">
            <el-input
              v-model="manual.search"
              clearable
              size="small"
              placeholder="供应商/定数码/品种编码查询"
              style="width: 385px"
              @keyup.enter.native="loadManual(1)"
            >
              <el-button slot="append" icon="el-icon-search" @click="loadManual(1)" />
            </el-input>
          </div>
          <label class="manual-type-label">请选择查询的操作类型：</label>
          <el-select v-model="manual.selectType" size="small" style="width: 120px" @change="loadManual(1)">
            <el-option label="允许补暂借" value="1" />
            <el-option label="允许补归还" value="2" />
          </el-select>
          <div class="manual-btns">
            <el-button size="small" @click="onManualBorrow">手动补暂借</el-button>
            <el-button size="small" @click="onManualRevert">手动补归还</el-button>
          </div>
        </div>
        <el-table
          v-loading="manual.loading"
          :data="manual.rows"
          border
          stripe
          size="small"
          highlight-current-row
          height="calc(100vh - 320px)"
          @selection-change="(s) => (manual.selected = s)"
          @current-change="onManualRowSelect"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column
            prop="DEPT_TWO_NAME"
            label="二级科室名称"
            width="110"
            sortable
            :sort-method="(a, b) => sortStr(a, b, 'DEPT_TWO_NAME')"
            show-overflow-tooltip
          />
          <el-table-column prop="VARIETIE_CODE_NEW" label="品种(材料)编码" width="110" show-overflow-tooltip />
          <el-table-column prop="VARIETIE_NAME" label="品种全称" min-width="320" show-overflow-tooltip />
          <el-table-column prop="SPECIFICATION_OR_TYPE" label="型号/规格" min-width="210" show-overflow-tooltip />
          <el-table-column prop="UNIT" label="单位" width="60" align="center" />
          <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="SUPPLIER_NAME" label="供应商" min-width="160" show-overflow-tooltip />
          <el-table-column prop="BATCH" label="生产批号" width="100" />
          <el-table-column prop="COEFFICIENT" label="系数" width="60" align="center" />
          <el-table-column prop="DEF_NO_PKG_CODE" label="定数码" width="140" show-overflow-tooltip />
          <el-table-column prop="SERIAL_NUMBER" label="UDI码" width="140" show-overflow-tooltip />
          <el-table-column prop="RFID_CODE" label="RFID码" width="140" show-overflow-tooltip />
        </el-table>
        <el-pagination
          class="pager"
          background
          small
          layout="total, sizes, prev, pager, next"
          :total="manual.total"
          :page-size="manual.size"
          :current-page="manual.page"
          :page-sizes="[21, 30, 60, 90, 150, 300]"
          @size-change="onManualSize"
          @current-change="loadManual"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import {
  getIsTimePd,
  getIsDeptPd,
  getInfoPd,
  exportAllInfoExcel,
  shanTouDeptPrintPdExcel,
  clickZj,
  searchDsb,
  revertDefToDept
} from '@/api/Inventory/ReviseManagement';
import {
  openExportResult,
  openConsumePrintPdf,
  fmtDate,
  fmtDateTime,
  fmtPdState,
  fmtCanZj,
  fmtStockState,
  fmtConsumptionType,
  fmtDeptSpState,
  sortStr,
  sortNum,
  sortDate
} from './utils';

const emptyDetail = () => ({
  VARIETIE_CODE: '',
  VARIETIE_NAME: '',
  APPROVAL_NUMBER: '',
  REGISTRATION_VALID_DATE: '',
  SUPPLIER_NAME: '',
  SPECIFICATION_OR_TYPE: '',
  UNIT: '',
  MANUFACTURING_ENT_NAME: '',
  BATCH: '',
  COEFFICIENT: ''
});

export default {
  name: 'ReviseManagement',
  data() {
    return {
      activeTab: 'compare',
      timeLoading: false,
      timeRows: [],
      selectedTime: '',
      deptLoading: false,
      deptRows: [],
      selectedDept: { code: '', name: '' },
      audit: {
        loading: false,
        rows: [],
        selected: [],
        total: 0,
        page: 1,
        size: 20,
        pdWay: '',
        stockState: ''
      },
      manual: {
        loading: false,
        rows: [],
        selected: [],
        total: 0,
        page: 1,
        size: 21,
        search: '',
        selectType: '1'
      },
      detail: emptyDetail()
    };
  },
  computed: {
    staffName() {
      const info = this.$store.state.user?.info;
      return info?.Nickname || info?.NickName || info?.nickname || '';
    }
  },
  created() {
    this.loadTimes();
    this.loadManual(1);
  },
  methods: {
    fmtDate,
    fmtDateTime,
    fmtPdState,
    fmtCanZj,
    fmtStockState,
    fmtConsumptionType,
    fmtDeptSpState,
    sortStr,
    sortNum,
    sortDate,
    sortCanZj(a, b) {
      return sortStr(a, b, 'STOCK_STATE');
    },
    sortStockState(a, b) {
      return sortStr(a, b, 'STOCK_STATE');
    },
    async loadTimes() {
      this.timeLoading = true;
      try {
        const data = await getIsTimePd();
        this.timeRows = data.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载时间列表失败');
      } finally {
        this.timeLoading = false;
      }
    },
    onTimeSelect(row) {
      if (!row) return;
      this.selectedTime = fmtDateTime(row.CREATE_TIME);
      this.selectedDept = { code: '', name: '' };
      this.audit.rows = [];
      this.audit.total = 0;
      this.loadDepts();
    },
    async loadDepts() {
      if (!this.selectedTime) {
        this.deptRows = [];
        return;
      }
      this.deptLoading = true;
      try {
        const data = await getIsDeptPd(this.selectedTime);
        this.deptRows = data.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载科室列表失败');
      } finally {
        this.deptLoading = false;
      }
    },
    onDeptSelect(row) {
      if (!row) return;
      this.selectedDept = { code: row.DEPT, name: row.DEPT_TWO_NAME };
      this.loadAudit(1);
    },
    async loadAudit(page) {
      if (page) this.audit.page = page;
      if (!this.selectedTime || !this.selectedDept.code) {
        this.audit.rows = [];
        this.audit.total = 0;
        return;
      }
      this.audit.loading = true;
      try {
        const data = await getInfoPd({
          DEPT: this.selectedDept.code,
          TIME: this.selectedTime,
          PD_WAY: this.audit.pdWay,
          STOCK_STATE: this.audit.stockState,
          page: this.audit.page,
          size: this.audit.size
        });
        this.audit.rows = data.result || [];
        this.audit.total = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载稽查列表失败');
      } finally {
        this.audit.loading = false;
      }
    },
    onAuditSize(size) {
      this.audit.size = size;
      this.loadAudit(1);
    },
    async onSupplementZj() {
      if (!this.audit.selected.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const ids = this.audit.selected.map((r) => r.IDOS).filter(Boolean).join(',');
      if (!ids) {
        this.$message.warning('选中行缺少 ID');
        return;
      }
      try {
        await clickZj(ids, this.staffName);
        this.$message.success('补暂借成功');
        this.loadAudit(this.audit.page);
      } catch (e) {
        this.$message.error(e.message || '补暂借失败');
      }
    },
    onPrintConsume() {
      if (!this.audit.selected.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const json = this.audit.selected.map((r) => r.DEF_NO_PKG_CODE).filter(Boolean).join(',');
      if (!json) {
        this.$message.warning('选中行缺少定数码');
        return;
      }
      openConsumePrintPdf(json);
    },
    async exportAllServer() {
      if (!this.selectedTime) {
        this.$message.warning('请先选中创建时间');
        return;
      }
      const loading = this.$loading({ lock: true, text: '导出中…' });
      try {
        const data = await exportAllInfoExcel(this.selectedTime, this.audit.stockState);
        openExportResult(data.result);
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    },
    async exportDeptServer() {
      if (!this.selectedDept.code) {
        this.$message.warning('请先选中科室');
        return;
      }
      const loading = this.$loading({ lock: true, text: '导出中…' });
      try {
        const data = await shanTouDeptPrintPdExcel({
          DEPT: this.selectedDept.code,
          TIME: this.selectedTime,
          deptName: this.selectedDept.name,
          PD_WAY: this.audit.pdWay,
          STOCK_STATE: this.audit.stockState
        });
        openExportResult(data.result);
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    },
    async exportAuditExcel() {
      if (!this.selectedDept.code) {
        this.$message.warning('请先选中科室');
        return;
      }
      const loading = this.$loading({ lock: true, text: '导出中…' });
      try {
        const data = await getInfoPd({
          DEPT: this.selectedDept.code,
          TIME: this.selectedTime,
          PD_WAY: this.audit.pdWay,
          STOCK_STATE: this.audit.stockState,
          page: 1,
          size: 999999
        });
        const header = [
          '品种(材料)编码',
          '品种全称',
          '型号/规格',
          '生产企业名称',
          '收费编码',
          '生产批号',
          '系数',
          '定数码',
          '是否可补暂借',
          'RFID码',
          '是否一致',
          '当前状态',
          '消耗类型'
        ];
        const sheetData = [header];
        (data.result || []).forEach((r) => {
          sheetData.push([
            r.VARIETIE_CODE_NEW,
            r.VARIETIE_NAME,
            r.SPECIFICATION_OR_TYPE,
            r.MANUFACTURING_ENT_NAME,
            r.CHARGING_CODE,
            r.BATCH,
            r.COEFFICIENT,
            r.DEF_NO_PKG_CODE,
            fmtCanZj(r.STOCK_STATE),
            r.RFID_CODE,
            fmtPdState(r.PDSTATE),
            fmtStockState(r.STOCK_STATE),
            fmtConsumptionType(r.CONSUMPTION_TYPE)
          ]);
        });
        const sheet = utils.aoa_to_sheet(sheetData);
        writeFile({ SheetNames: ['库存稽查'], Sheets: { 库存稽查: sheet } }, '库存稽查.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    },
    async loadManual(page) {
      if (page) this.manual.page = page;
      this.manual.loading = true;
      try {
        const data = await searchDsb({
          strDEF_NO_PKG_CODE: this.manual.search,
          SELECT_TYPE: this.manual.selectType,
          page: this.manual.page,
          size: this.manual.size
        });
        this.manual.rows = data.result || [];
        this.manual.total = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      } finally {
        this.manual.loading = false;
      }
    },
    onManualSize(size) {
      this.manual.size = size;
      this.loadManual(1);
    },
    onManualRowSelect(row) {
      if (!row) {
        this.detail = emptyDetail();
        return;
      }
      this.detail = {
        VARIETIE_CODE: row.VARIETIE_CODE_NEW || row.VARIETIE_CODE || '',
        VARIETIE_NAME: row.VARIETIE_NAME || '',
        APPROVAL_NUMBER: row.APPROVAL_NUMBER || '',
        REGISTRATION_VALID_DATE: fmtDate(row.REGISTRATION_VALID_DATE),
        SUPPLIER_NAME: row.SUPPLIER_NAME || '',
        SPECIFICATION_OR_TYPE: row.SPECIFICATION_OR_TYPE || '',
        UNIT: row.UNIT || '',
        MANUFACTURING_ENT_NAME: row.MANUFACTURING_ENT_NAME || '',
        BATCH: row.BATCH || '',
        COEFFICIENT: row.COEFFICIENT || ''
      };
    },
    async onManualBorrow() {
      if (!this.manual.selected.length) {
        this.$message.warning('请选择记录');
        return;
      }
      const ids = this.manual.selected.map((r) => r.ID).join(',');
      try {
        const data = await clickZj(ids, this.staffName);
        this.$message.success(data.msg || '操作成功');
        this.loadManual(this.manual.page);
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    async onManualRevert() {
      if (!this.manual.selected.length) {
        this.$message.warning('请选择记录');
        return;
      }
      const defs = this.manual.selected.map((r) => r.DEF_NO_PKG_CODE).join(',');
      try {
        const data = await revertDefToDept(defs, this.staffName);
        this.$message.success(data.msg || '操作成功');
        this.loadManual(this.manual.page);
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    }
  }
};
</script>

<style scoped>
.revise-management {
  padding: 12px;
}
.compare-layout {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.time-panel {
  flex: 0 0 12%;
  min-width: 140px;
}
.dept-panel {
  flex: 0 0 20%;
  min-width: 200px;
}
.main-panel {
  flex: 1;
  min-width: 0;
}
.panel-card {
  width: 100%;
}
.panel-card >>> .el-card__body {
  padding: 8px;
}
.panel-title {
  font-weight: 600;
  font-size: 13px;
}
.panel-head {
  display: flex;
  align-items: center;
}
.audit-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
  min-height: 32px;
}
.toolbar-item {
  margin-right: 12px;
  margin-bottom: 4px;
}
.toolbar-right {
  margin-left: auto;
  margin-right: 0;
}
.filter-item {
  display: inline-flex;
  align-items: center;
}
.filter-label {
  font-size: 12px;
  color: #606266;
  margin-right: 4px;
  white-space: nowrap;
}
.btn-link {
  display: inline-block;
  min-width: 80px;
  padding: 5px 12px;
  font-size: 12px;
  text-align: center;
  color: #333;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  cursor: pointer;
  text-decoration: none;
}
.btn-link:hover {
  color: #009688;
  border-color: #009688;
}
/* 与旧系统 inventory_area_top_table 一致：表头一行 + 数据一行 */
.inventory-area-top-table {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 15px;
}
.detail-row-table {
  width: 100%;
  table-layout: fixed;
  background-color: #fff;
  border: 2px solid #009688;
  border-collapse: collapse;
}
.detail-row-table thead {
  border-bottom: 2px solid #009688;
}
.detail-row-table th,
.detail-row-table td {
  padding: 10px 6px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  word-break: break-all;
  border-right: 1px solid #e8e8e8;
}
.detail-row-table th:last-child,
.detail-row-table td:last-child {
  border-right: none;
}
.detail-row-table tbody td {
  font-weight: normal;
  color: #303133;
}
.manual-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}
.manual-search {
  margin-right: 20px;
}
.manual-type-label {
  font-size: 13px;
  margin-right: 10px;
  line-height: 32px;
  white-space: nowrap;
}
.manual-btns {
  margin-left: auto;
}
.manual-btns .el-button {
  min-width: 160px;
  margin-left: 8px;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
</style>
