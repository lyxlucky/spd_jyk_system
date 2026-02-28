<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="searchForm"
        :inline="true"
        class="ele-form-search"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-form-item label="期数">
          <el-input
            v-model="searchForm.PERIOD_YM"
            placeholder="如：202502"
            clearable
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.STATUS"
            placeholder="全部"
            clearable
            style="width: 130px"
          >
            <el-option label="草稿" :value="0" />
            <el-option label="已提交" :value="1" />
            <el-option label="已审核" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="盘点时间" v-if="false">
          <el-date-picker
            v-model="checkStartRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button
            icon="el-icon-refresh"
            class="ele-btn-icon"
            @click="reset"
          >重置</el-button>
        </el-form-item>
        <el-form-item>
           <el-button
            type="success"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="openCreateDialog"
          >新建盘点单</el-button>
        </el-form-item>
      </el-form>

      <!-- 主表：盘点单列表 -->
      <vxe-table
        ref="mainTable"
        :data="mainTableData"
        :loading="mainTableLoading"
        highlight-current-row
        border
        size="mini"
        height="240"
        :row-config="{ isHover: true, isCurrent: true }"
        @current-change="onMainTableCurrentChange"
        @cell-click="onMainTableRowClick"
        style="margin-bottom: 8px"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" />
        <vxe-column field="PERIOD_YM" title="期数" width="90" align="center" />
        <vxe-column field="DEPT_TWO_NAME" title="盘点科室" min-width="140" />
        <vxe-column field="CHECK_START_TIME" title="盘点开始时间" width="155" align="center" :formatter="formatterDate" />
        <vxe-column field="CHECK_END_TIME" title="盘点结束时间" width="155" align="center" :formatter="formatterDate" />
        <vxe-column field="STATUS" title="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.STATUS === 0" size="mini" type="info">草稿</el-tag>
            <el-tag v-else-if="row.STATUS === 1" size="mini" type="warning">已提交</el-tag>
            <el-tag v-else-if="row.STATUS === 2" size="mini" type="success">已审核</el-tag>
            <span v-else>{{ row.STATUS }}</span>
          </template>
        </vxe-column>
        <vxe-column field="REMARK" title="备注" min-width="120" show-overflow />
        <vxe-column field="CREATE_MAN" title="创建人" width="90" align="center" />
        <vxe-column field="CREATE_TIME" title="创建时间" width="155" align="center" :formatter="formatterDateTime" />
        <vxe-column title="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.STATUS === 0"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="openEditDialog(row)"
            >修改</el-button>
            <el-button
              v-if="row.STATUS === 0"
              size="mini"
              type="text"
              icon="el-icon-upload2"
              @click.stop="handleSubmit(row)"
            >提交</el-button>
            <el-button
              v-if="row.STATUS === 1"
              size="mini"
              type="text"
              icon="el-icon-refresh-left"
              @click.stop="handleWithdraw(row)"
            >撤回</el-button>
            <!-- <el-button
              v-if="row.STATUS === 1"
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              style="color: #67c23a"
              @click.stop="handleApprove(row)"
            >审核</el-button> -->
            <el-button
              v-if="row.STATUS === 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="color: #f56c6c"
              @click.stop="handleDelete(row)"
            >删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>

      <!-- 主表分页 -->
      <vxe-pager
        :current-page="mainTablePage.page"
        :page-size="mainTablePage.size"
        :total="mainTablePage.total"
        :page-sizes="[10, 20, 50, 100]"
        size="mini"
        @page-change="onMainTablePageChange"
        style="margin-bottom: 8px"
      />

      <!-- 明细表：盘点品种列表 -->
      <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-weight: bold; font-size: 14px; color: #333; height: 28px;">
          <i class="el-icon-document" style="margin-right: 4px" />
          盘点明细
          <span v-if="currentMainRow" style="font-weight: normal; color: #666; font-size: 13px; margin-left: 8px">
            — {{ currentMainRow.DEPT_TWO_NAME }} / {{ currentMainRow.PERIOD_YM }}
          </span>
          <span v-else style="font-weight: normal; color: #aaa; font-size: 12px; margin-left: 8px">（请在上方选择一条盘点单）</span>
        </div>
        <!-- 明细搜索 -->
        <el-form :inline="true" size="mini" v-if="currentMainRow" style="margin: 0" @keyup.enter.native="searchDetail">
          <el-form-item label="品种名称" style="margin-bottom: 0">
            <el-input
              v-model="detailFilter.VARIETIE_NAME"
              placeholder="品种名称"
              clearable
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="品种编码" style="margin-bottom: 0">
            <el-input
              v-model="detailFilter.VARIETIE_CODE_NEW"
              placeholder="品种编码"
              clearable
              style="width: 130px"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDetail">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDetail">重置</el-button>
            <el-button type="success" icon="el-icon-download" size="mini" :loading="exportLoading" @click="exportDetail">导出</el-button>
            <el-button
              v-if="currentMainRow && currentMainRow.STATUS === 0"
              type="warning"
              icon="el-icon-upload2"
              size="mini"
              :loading="importLoading"
              @click="triggerImport"
            >导入</el-button>
            <input ref="importInput" type="file" accept=".xlsx" style="display:none" @change="handleImportFile" />
          </el-form-item>
        </el-form>
      </div>

      <div style="height: calc(100vh - 580px);">
      <vxe-table
        ref="detailTable"
        :data="detailTableData"
        :loading="detailTableLoading"
        border
        size="mini"
        height="100%"
        :row-config="{ isHover: true }"
      >
        <vxe-column type="seq" title="序号" width="55" align="center" />
        <vxe-column field="VARIETIE_CODE_NEW" title="品种编码" width="120" />
        <vxe-column field="VARIETIE_NAME" title="品种名称" min-width="150" show-overflow />
        <vxe-column field="SPECIFICATION_OR_TYPE" title="规格型号" width="130" show-overflow />
        <vxe-column field="UNIT" title="单位" width="60" align="center" />
        <vxe-column field="MANUFACTURING_ENT_NAME" title="厂家" width="160" show-overflow />
        <vxe-column field="PRICE" title="单价" width="80" align="right" :formatter="formatterPrice" />
        <vxe-column field="LAST_STOCK_QTY" title="上期库存" width="90" align="right" footer-align="right" />
        <vxe-column field="IN_QTY" title="入库数" width="80" align="right" footer-align="right" />
        <vxe-column field="ISSUE_QTY" title="领用数" width="80" align="right" footer-align="right" />
        <vxe-column field="RETURN_QTY" title="退还数" width="80" align="right" footer-align="right" />
        <vxe-column field="CURRENT_STOCK_QTY" title="本期库存" width="90" align="right" footer-align="right" />
        <vxe-column field="ACTUAL_STOCK_QTY" title="实存数" width="90" align="right" footer-align="right">
          <template #default="{ row }">
            <span :class="{ 'profit-loss-warn': isProfitLossAbnormal(row) }">
              {{ row.ACTUAL_STOCK_QTY !== null && row.ACTUAL_STOCK_QTY !== undefined ? row.ACTUAL_STOCK_QTY : '—' }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="CONSUME_QTY" title="消耗数" width="80" align="right" footer-align="right">
          <template #default="{ row }">
            <span>{{ row.CONSUME_QTY !== null && row.CONSUME_QTY !== undefined ? row.CONSUME_QTY : '—' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="CHARGING_QTY" title="计费数量" width="90" align="right" footer-align="right">
          <template #default="{ row }">
            <span>{{ row.CHARGING_QTY !== null && row.CHARGING_QTY !== undefined ? row.CHARGING_QTY : '—' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="PROFIT_LOSS_NUMBER" title="盈亏数" width="80" align="right" footer-align="right">
          <template #default="{ row }">
            <span
              v-if="row.PROFIT_LOSS_NUMBER !== null && row.PROFIT_LOSS_NUMBER !== undefined"
              :style="{ color: row.PROFIT_LOSS_NUMBER > 0 ? '#67c23a' : row.PROFIT_LOSS_NUMBER < 0 ? '#f56c6c' : '' }"
            >{{ row.PROFIT_LOSS_NUMBER }}</span>
            <span v-else>—</span>
          </template>
        </vxe-column>
        <vxe-column field="IS_IN_CABINET" title="是否入柜" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.IS_IN_CABINET === 1" size="mini" type="success">是</el-tag>
            <el-tag v-else-if="row.IS_IN_CABINET === 0" size="mini" type="info">否</el-tag>
            <span v-else>—</span>
          </template>
        </vxe-column>
        <vxe-column field="PROFIT_LOSS_REMARK" title="盈亏备注" min-width="120" show-overflow />
        <vxe-column title="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="currentMainRow && currentMainRow.STATUS === 0"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="openDetailEditDialog(row)"
            >填写</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      </div>

      <!-- 明细表分页 -->
      <vxe-pager
        :current-page="detailTablePage.page"
        :page-size="detailTablePage.size"
        :total="detailTablePage.total"
        :page-sizes="[50, 100, 200]"
        size="mini"
        @page-change="onDetailTablePageChange"
        style="margin-top: 8px"
      />
    </el-card>

    <!-- 新建/修改盘点单对话框 -->
    <el-dialog
      :title="isEditMode ? '修改盘点单' : '新建盘点单'"
      :visible.sync="checkDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closeCheckDialog"
    >
      <el-form
        ref="checkForm"
        :model="checkFormData"
        :rules="checkFormRules"
        label-width="110px"
        size="small"
      >
        <el-form-item label="期数" prop="PERIOD_YM">
          <el-input
            v-model="checkFormData.PERIOD_YM"
            placeholder="如：202502"
            clearable
            :disabled="isEditMode"
          />
        </el-form-item>
        <el-form-item label="盘点科室">
          <el-input :value="isEditMode ? checkFormData.DEPT_TWO_NAME : deptName" disabled />
        </el-form-item>
        <el-form-item label="盘点开始时间" prop="CHECK_START_TIME">
          <el-date-picker
            v-model="checkFormData.CHECK_START_TIME"
            type="date"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :disabled="isEditMode"
          />
        </el-form-item>
        <el-form-item label="盘点结束时间" prop="CHECK_END_TIME">
          <el-date-picker
            v-model="checkFormData.CHECK_END_TIME"
            type="date"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :disabled="isEditMode"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="checkFormData.REMARK"
            type="textarea"
            :rows="2"
            placeholder="备注（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCheckDialog">取 消</el-button>
        <el-button
          type="primary"
          :loading="checkDialogLoading"
          @click="saveCheck"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 明细填写对话框 -->
    <el-dialog
      title="填写盘点数据"
      :visible.sync="detailDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <el-form
        ref="detailForm"
        :model="detailFormData"
        label-width="100px"
        size="small"
      >
        <el-form-item label="品种名称">
          <el-input :value="detailFormData.VARIETIE_NAME" disabled />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input :value="detailFormData.SPECIFICATION_OR_TYPE" disabled />
        </el-form-item>
        <el-form-item label="本期库存">
          <el-input :value="detailFormData.CURRENT_STOCK_QTY" disabled />
        </el-form-item>
        <el-form-item label="实存数" prop="ACTUAL_STOCK_QTY">
          <el-input-number
            v-model="detailFormData.ACTUAL_STOCK_QTY"
            :precision="2"
            :step="1"
            :min="0"
            style="width: 100%"
            placeholder="请输入实际库存数量"
            @change="calcProfitLoss"
          />
        </el-form-item>
        <el-form-item label="盈亏数">
          <el-input
            :value="detailFormData.PROFIT_LOSS_NUMBER !== undefined && detailFormData.PROFIT_LOSS_NUMBER !== null ? detailFormData.PROFIT_LOSS_NUMBER : '—'"
            disabled
            :style="{ color: detailFormData.PROFIT_LOSS_NUMBER > 0 ? '#67c23a' : detailFormData.PROFIT_LOSS_NUMBER < 0 ? '#f56c6c' : '' }"
          />
        </el-form-item>
        <el-form-item label="是否入柜">
          <el-radio-group v-model="detailFormData.IS_IN_CABINET">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="盈亏备注">
          <el-input
            v-model="detailFormData.PROFIT_LOSS_REMARK"
            type="textarea"
            :rows="2"
            placeholder="盈亏原因说明（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetailDialog">取 消</el-button>
        <el-button
          type="primary"
          :loading="detailDialogLoading"
          @click="saveDetail"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeptInventoryCheckList,
  addDeptInventoryCheck,
  updateDeptInventoryCheck,
  updateDeptInventoryCheckStatus,
  deleteDeptInventoryCheck,
  getDeptInventoryCheckDetailList,
  updateDeptInventoryCheckDetail,
  batchUpdateDeptInventoryCheckDetail
} from '@/api/KSInventory/DeptInventoryCheck';
import store from '@/store';

export default {
  name: 'DeptInventoryCheck',
  data() {
    return {
      // 搜索表单
      searchForm: {
        PERIOD_YM: '',
        DEPT_TWO_NAME: '',
        STATUS: '',
        CHECK_START_TIME_BEGIN: '',
        CHECK_START_TIME_END: ''
      },
      checkStartRange: [],
      // 主表
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: { page: 1, size: 20, total: 0 },
      currentMainRow: null,
      // 明细表
      detailTableData: [],
      detailTableLoading: false,
      detailTablePage: { page: 1, size: 100, total: 0 },
      detailFilter: {
        VARIETIE_NAME: '',
        VARIETIE_CODE_NEW: ''
      },
      // 盘点单对话框
      checkDialogVisible: false,
      checkDialogLoading: false,
      isEditMode: false,
      checkFormData: {
        ID: null,
        PERIOD_YM: '',
        CHECK_START_TIME: '',
        CHECK_END_TIME: '',
        REMARK: ''
      },
      checkFormRules: {
        PERIOD_YM: [{ required: true, message: '请输入期数', trigger: 'blur' }],
        CHECK_START_TIME: [{ required: true, message: '请选择盘点开始时间', trigger: 'change' }],
        CHECK_END_TIME: [{ required: true, message: '请选择盘点结束时间', trigger: 'change' }]
      },
      // 明细填写对话框
      detailDialogVisible: false,
      detailDialogLoading: false,
      exportLoading: false,
      importLoading: false,
      detailFormData: {
        ID: null,
        VARIETIE_NAME: '',
        SPECIFICATION_OR_TYPE: '',
        CURRENT_STOCK_QTY: null,
        ACTUAL_STOCK_QTY: null,
        PROFIT_LOSS_NUMBER: null,
        IS_IN_CABINET: null,
        PROFIT_LOSS_REMARK: ''
      }
    };
  },
  computed: {
    deptName() {
      return this.$store.state.user.info?.DeptNow?.Dept_Two_Name || '';
    },
    deptCode() {
      return this.$store.state.user.info?.DeptNow?.Dept_Two_Code || '';
    },
  },
  methods: {
    // ——————————————————— 搜索 ———————————————————
    search() {
      if (this.checkStartRange && this.checkStartRange.length === 2) {
        this.searchForm.CHECK_START_TIME_BEGIN = this.checkStartRange[0];
        this.searchForm.CHECK_START_TIME_END = this.checkStartRange[1];
      } else {
        this.searchForm.CHECK_START_TIME_BEGIN = '';
        this.searchForm.CHECK_START_TIME_END = '';
      }
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    reset() {
      this.searchForm = {
        PERIOD_YM: '',
        DEPT_TWO_NAME: '',
        STATUS: '',
        CHECK_START_TIME_BEGIN: '',
        CHECK_START_TIME_END: ''
      };
      this.checkStartRange = [];
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },

    // ——————————————————— 主表 ———————————————————
    async loadMainTableData() {
      this.mainTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          DEPT_TWO_CODE: this.deptCode,
          page: this.mainTablePage.page,
          size: this.mainTablePage.size
        };
        const res = await getDeptInventoryCheckList(params);
        this.mainTableData = res.result || [];
        this.mainTablePage.total = res.total || 0;
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
      }
    },
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.detailFilter = { VARIETIE_NAME: '', VARIETIE_CODE_NEW: '' };
      this.loadDetailTableData();
    },
    onMainTableRowClick({ row }) {
      if (!row) return;
      this.currentMainRow = row;
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      this.detailTablePage.page = 1;
      this.detailFilter = { VARIETIE_NAME: '', VARIETIE_CODE_NEW: '' };
      this.loadDetailTableData();
    },

    // ——————————————————— 明细表 ———————————————————
    searchDetail() {
      this.detailTablePage.page = 1;
      this.loadDetailTableData();
    },
    resetDetail() {
      this.detailFilter = { VARIETIE_NAME: '', VARIETIE_CODE_NEW: '' };
      this.detailTablePage.page = 1;
      this.loadDetailTableData();
    },
    async loadDetailTableData() {
      if (!this.currentMainRow) {
        this.detailTableData = [];
        this.detailTablePage.total = 0;
        return;
      }
      this.detailTableLoading = true;
      try {
        const params = {
          CHECK_ID: this.currentMainRow.ID,
          ...this.detailFilter,
          page: this.detailTablePage.page,
          size: this.detailTablePage.size
        };
        const res = await getDeptInventoryCheckDetailList(params);
        this.detailTableData = res.result || [];
        this.detailTablePage.total = res.total || 0;
      } catch (error) {
        this.$message.error(error.message || '加载明细数据失败');
      } finally {
        this.detailTableLoading = false;
      }
    },
    onDetailTablePageChange({ currentPage, pageSize }) {
      this.detailTablePage.page = currentPage;
      this.detailTablePage.size = pageSize;
      this.loadDetailTableData();
    },

    // —————————————————————— 导出明细 ——————————————————————
    async exportDetail() {
      if (!this.currentMainRow) return;
      this.exportLoading = true;
      try {
        const params = { CHECK_ID: this.currentMainRow.ID, ...this.detailFilter, page: 1, size: 99999 };
        const res = await getDeptInventoryCheckDetailList(params);
        const allData = res.result || [];
        const r = this.currentMainRow;

        const ExcelJS = (await import('exceljs')).default;
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('盘点明细');

        const headers = ['盘点单明细ID', '上期库存', '入库数', '领用数', '退还数', '本期库存', '实存数', '消耗数', '计费数量', '盈亏値', '物资编码', '品种名称', '规格型号', '收费编码', '单位', '厂家', '单价', '是否入柜', '盈亏备注'];
        const colCount = headers.length;
        const colWidths = [14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 16, 30, 20, 14, 8, 30, 10, 10, 20];
        sheet.columns = colWidths.map(w => ({ width: w }));

        const thinBorder = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

        // 第1行：标题
        const titleRow = sheet.addRow([`${r.DEPT_TWO_NAME}盘点单 - ${r.PERIOD_YM}期`]);
        sheet.mergeCells(1, 1, 1, colCount);
        titleRow.height = 30;
        const titleCell = titleRow.getCell(1);
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        // 第2行：盘点时间 + 盘点人
        const timeStr = `盘点时间：${r.CREATE_TIME ? this.$moment(r.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss') : ''}`;
        const personStr = `盘点人：${r.CREATE_MAN || ''}`;
        const infoData = [timeStr, ...Array(colCount - 2).fill(null), personStr];
        const infoRow = sheet.addRow(infoData);
        infoRow.height = 20;
        infoRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        infoRow.getCell(colCount).alignment = { horizontal: 'left', vertical: 'middle' };

        // 第3行：列头
        const headerRow = sheet.addRow(headers);
        headerRow.height = 22;
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
          cell.border = thinBorder;
        });

        // 数据行
        allData.forEach(d => {
          const rowData = [
            d.ID, d.LAST_STOCK_QTY, d.IN_QTY, d.ISSUE_QTY, d.RETURN_QTY,
            d.CURRENT_STOCK_QTY, d.ACTUAL_STOCK_QTY,
            d.CONSUME_QTY != null ? d.CONSUME_QTY : '',
            d.CHARGING_QTY != null ? d.CHARGING_QTY : '',
            d.PROFIT_LOSS_NUMBER, d.VARIETIE_CODE_NEW, d.VARIETIE_NAME,
            d.SPECIFICATION_OR_TYPE, d.CHARGING_CODE != null ? d.CHARGING_CODE : '',
            d.UNIT, d.MANUFACTURING_ENT_NAME, d.PRICE,
            d.IS_IN_CABINET === 1 ? '是' : d.IS_IN_CABINET === 0 ? '否' : '',
            d.PROFIT_LOSS_REMARK
          ];
          const dataRow = sheet.addRow(rowData);
          dataRow.height = 18;
          dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = thinBorder;
            cell.alignment = { vertical: 'middle', horizontal: colNumber >= 2 && colNumber <= 10 ? 'right' : 'left' };
          });
          // 盈亏値赋色
          const plCell = dataRow.getCell(10);
          const plVal = d.PROFIT_LOSS_NUMBER;
          if (plVal != null) {
            plCell.font = { color: { argb: plVal > 0 ? 'FF67C23A' : plVal < 0 ? 'FFF56C6C' : 'FF000000' } };
          }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `盘点明细_${r.DEPT_TWO_NAME}_${r.PERIOD_YM}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        this.$message.error(error.message || '导出失败');
      } finally {
        this.exportLoading = false;
      }
    },

    // —————————————————————— 导入回填 ——————————————————————
    triggerImport() {
      this.$refs.importInput.value = '';
      this.$refs.importInput.click();
    },
    async handleImportFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.importLoading = true;
      try {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // header:1 返回二维数组；前3行是标题/信息/列头行
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
        const items = [];
        for (let i = 3; i < aoa.length; i++) {
          const row = aoa[i];
          if (!row || row[0] == null) continue;
          const id = parseInt(row[0]);
          if (isNaN(id) || id <= 0) continue;
          const toNum = (v) => (v !== null && v !== '' && !isNaN(parseFloat(v)) ? parseFloat(v) : null);
          const toInCabinet = (v) => { if (v === '是' || v === 1) return 1; if (v === '否' || v === 0) return 0; return null; };
          items.push({
            ID: id,
            ACTUAL_STOCK_QTY: toNum(row[6]),              // 实存数
            CONSUME_QTY: toNum(row[7]),                    // 消耗数
            CHARGING_QTY: toNum(row[8]),                   // 计费数量
            PROFIT_LOSS_NUMBER: toNum(row[9]),             // 盈亏値
            IS_IN_CABINET: toInCabinet(row[17]),           // 是否入柜
            PROFIT_LOSS_REMARK: (row[18] != null && row[18] !== '') ? String(row[18]) : null  // 盈亏备注
          });
        }
        if (items.length === 0) {
          this.$message.warning('未读取到有效数据，请确认文件格式正确');
          return;
        }
        await this.$confirm(`将更新 ${items.length} 条明细的实存数/消耗数/计费数量/盈亏値，确认导入？`, '导入确认', {
          confirmButtonText: '确认导入',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await batchUpdateDeptInventoryCheckDetail(items);
        this.$message.success(res.msg || '导入成功');
        this.loadDetailTableData();
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '导入失败');
        }
      } finally {
        this.importLoading = false;
      }
    },

    // ——————————————————— 盘亏异常着色 ———————————————————
    isProfitLossAbnormal(row) {
      if (row.ACTUAL_STOCK_QTY === null || row.ACTUAL_STOCK_QTY === undefined) return false;
      if (row.CURRENT_STOCK_QTY === null || row.CURRENT_STOCK_QTY === undefined) return false;
      return Number(row.ACTUAL_STOCK_QTY) !== Number(row.CURRENT_STOCK_QTY);
    },

    // ——————————————————— 新建/修改盘点单 ———————————————————
    openCreateDialog() {
      this.isEditMode = false;
      this.checkFormData = { ID: null, PERIOD_YM: '', DEPT_TWO_CODE: this.deptCode, DEPT_TWO_NAME: this.deptName, CHECK_START_TIME: '', CHECK_END_TIME: '', REMARK: '' };
      this.$nextTick(() => { this.$refs.checkForm && this.$refs.checkForm.clearValidate(); });
      this.checkDialogVisible = true;
    },
    openEditDialog(row) {
      this.isEditMode = true;
      this.checkFormData = {
        ID: row.ID,
        DEPT_TWO_CODE: row.DEPT_TWO_CODE || '',
        DEPT_TWO_NAME: row.DEPT_TWO_NAME || '',
        PERIOD_YM: row.PERIOD_YM || '',
        CHECK_START_TIME: row.CHECK_START_TIME || '',
        CHECK_END_TIME: row.CHECK_END_TIME || '',
        REMARK: row.REMARK || ''
      };
      this.$nextTick(() => { this.$refs.checkForm && this.$refs.checkForm.clearValidate(); });
      this.checkDialogVisible = true;
    },
    closeCheckDialog() {
      this.checkDialogVisible = false;
      this.$refs.checkForm && this.$refs.checkForm.resetFields();
    },
    saveCheck() {
      this.$refs.checkForm.validate(async (valid) => {
        if (!valid) return;
        // 结束时间不能早于开始时间
        if (this.checkFormData.CHECK_END_TIME && this.checkFormData.CHECK_START_TIME
          && this.checkFormData.CHECK_END_TIME < this.checkFormData.CHECK_START_TIME) {
          this.$message.warning('盘点结束时间不能早于开始时间');
          return;
        }
        this.checkDialogLoading = true;
        try {
          if (this.isEditMode) {
            await updateDeptInventoryCheck(this.checkFormData);
            this.$message.success('修改成功');
          } else {
            await addDeptInventoryCheck(this.checkFormData);
            this.$message.success('新建成功，子表数据已自动生成');
          }
          this.checkDialogVisible = false;
          this.loadMainTableData();
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        } finally {
          this.checkDialogLoading = false;
        }
      });
    },

    // ——————————————————— 状态变更 ———————————————————
    handleSubmit(row) {
      this.$confirm('确认提交该盘点单？提交后不可修改明细内容。', '提示', {
        confirmButtonText: '确认提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await updateDeptInventoryCheckStatus(row.ID, 1);
          this.$message.success('提交成功');
          this.loadMainTableData();
          if (this.currentMainRow && this.currentMainRow.ID === row.ID) {
            this.currentMainRow = { ...this.currentMainRow, STATUS: 1 };
          }
        } catch (error) {
          this.$message.error(error.message || '提交失败');
        }
      }).catch(() => {});
    },
    handleWithdraw(row) {
      this.$confirm('确认撤回该盘点单？撤回后可继续修改。', '提示', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await updateDeptInventoryCheckStatus(row.ID, 0);
          this.$message.success('撤回成功');
          this.loadMainTableData();
          if (this.currentMainRow && this.currentMainRow.ID === row.ID) {
            this.currentMainRow = { ...this.currentMainRow, STATUS: 0 };
          }
        } catch (error) {
          this.$message.error(error.message || '撤回失败');
        }
      }).catch(() => {});
    },
    handleApprove(row) {
      this.$confirm('确认审核通过该盘点单？', '提示', {
        confirmButtonText: '确认审核',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await updateDeptInventoryCheckStatus(row.ID, 2);
          this.$message.success('审核成功');
          this.loadMainTableData();
          if (this.currentMainRow && this.currentMainRow.ID === row.ID) {
            this.currentMainRow = { ...this.currentMainRow, STATUS: 2 };
          }
        } catch (error) {
          this.$message.error(error.message || '审核失败');
        }
      }).catch(() => {});
    },
    handleDelete(row) {
      this.$confirm('确认删除该盘点单？此操作不可恢复。', '危险警告', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        try {
          await deleteDeptInventoryCheck(row.ID);
          this.$message.success('删除成功');
          if (this.currentMainRow && this.currentMainRow.ID === row.ID) {
            this.currentMainRow = null;
            this.detailTableData = [];
            this.detailTablePage.total = 0;
          }
          this.loadMainTableData();
        } catch (error) {
          this.$message.error(error.message || '删除失败');
        }
      }).catch(() => {});
    },

    // ——————————————————— 明细填写 ———————————————————
    openDetailEditDialog(row) {
      this.detailFormData = {
        ID: row.ID,
        VARIETIE_NAME: row.VARIETIE_NAME || '',
        SPECIFICATION_OR_TYPE: row.SPECIFICATION_OR_TYPE || '',
        CURRENT_STOCK_QTY: row.CURRENT_STOCK_QTY,
        ACTUAL_STOCK_QTY: row.ACTUAL_STOCK_QTY !== undefined && row.ACTUAL_STOCK_QTY !== null ? row.ACTUAL_STOCK_QTY : null,
        PROFIT_LOSS_NUMBER: row.PROFIT_LOSS_NUMBER !== undefined ? row.PROFIT_LOSS_NUMBER : null,
        IS_IN_CABINET: row.IS_IN_CABINET !== undefined ? row.IS_IN_CABINET : null,
        PROFIT_LOSS_REMARK: row.PROFIT_LOSS_REMARK || ''
      };
      this.detailDialogVisible = true;
    },
    closeDetailDialog() {
      this.detailDialogVisible = false;
    },
    calcProfitLoss(val) {
      if (val !== null && val !== undefined && this.detailFormData.CURRENT_STOCK_QTY !== null && this.detailFormData.CURRENT_STOCK_QTY !== undefined) {
        this.detailFormData.PROFIT_LOSS_NUMBER = Number((val - this.detailFormData.CURRENT_STOCK_QTY).toFixed(4));
      } else {
        this.detailFormData.PROFIT_LOSS_NUMBER = null;
      }
    },
    async saveDetail() {
      if (this.detailFormData.ACTUAL_STOCK_QTY === null || this.detailFormData.ACTUAL_STOCK_QTY === undefined) {
        this.$message.warning('请输入实存数');
        return;
      }
      this.detailDialogLoading = true;
      try {
        await updateDeptInventoryCheckDetail({
          ID: this.detailFormData.ID,
          ACTUAL_STOCK_QTY: this.detailFormData.ACTUAL_STOCK_QTY,
          PROFIT_LOSS_REMARK: this.detailFormData.PROFIT_LOSS_REMARK,
          IS_IN_CABINET: this.detailFormData.IS_IN_CABINET
        });
        this.$message.success('保存成功');
        this.detailDialogVisible = false;
        this.loadDetailTableData();
      } catch (error) {
        this.$message.error(error.message || '保存失败');
      } finally {
        this.detailDialogLoading = false;
      }
    },

    // ——————————————————— 格式化 ———————————————————
    formatterDate({ cellValue }) {
      if (!cellValue) return '';
      try { return this.$moment(cellValue).format('YYYY-MM-DD HH:mm'); } catch { return cellValue; }
    },
    formatterDateTime({ cellValue }) {
      if (!cellValue) return '';
      try { return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss'); } catch { return cellValue; }
    },
    formatterPrice({ cellValue }) {
      if (cellValue == null || cellValue === '') return '';
      return Number(cellValue).toFixed(2);
    }
  },
  created() {
    this.loadMainTableData();
  }
};
</script>

<style scoped>
.profit-loss-warn {
  color: #e6a23c;
  font-weight: bold;
}
</style>
