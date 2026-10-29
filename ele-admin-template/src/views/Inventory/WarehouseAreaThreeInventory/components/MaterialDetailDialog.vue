<template>
  <div>
    <el-dialog
      :visible.sync="visibleSync"
      :title="title || '耗材使用明细'"
      width="92%"
      top="5vh"
      custom-class="material-detail-dialog"
      append-to-body
      :close-on-click-modal="true"
      @open="onOpen"
      @closed="onClosed"
    >
      <div class="material-detail-content">
        <div class="material-detail-filter-wrap">
          <MaterialDetailFilters
            v-model="localWhere"
            :rows="tableData"
            :loading="tableLoading"
            @search="searchDetails"
            @clear="clearFilters"
          />
        </div>
        <div class="material-detail-toolbar">
          <span class="material-detail-selection"
            >已选 {{ selection.length }} 条</span
          >
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-sort"
            :disabled="
              !selection.length || selection.some((row) => !canTransferRow(row))
            "
            @click="handleTransfer(selection)"
            >批量移库</el-button
          >
          <el-button
            size="mini"
            type="success"
            plain
            icon="el-icon-download"
            :loading="exporting"
            @click="handleExport"
          >
            导出
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            :loading="deleting"
            :disabled="
              !selection.length || selection.some((row) => !canDeleteRow(row))
            "
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>

        <div class="material-detail-table-wrap">
          <vxe-table
            ref="table"
            class="data-table material-detail-table"
            :data="tableData"
            :loading="tableLoading"
            border
            stripe
            size="mini"
            height="100%"
            show-overflow
            empty-text="暂无耗材使用明细"
            :row-config="{ keyField: 'ID', isHover: true }"
            :column-config="{ resizable: true }"
            :checkbox-config="{ highlight: true, trigger: 'row' }"
            @checkbox-change="onCheckboxChange"
            @checkbox-all="onCheckboxAll"
          >
            <vxe-column
              type="checkbox"
              width="46"
              align="center"
              fixed="left"
            />
            <vxe-column
              type="seq"
              title="序号"
              width="60"
              align="center"
              fixed="left"
            />
            <vxe-column field="ID" title="流水ID" width="185" align="center" />
            <vxe-column
              field="BUSINESS_TYPE_NAME"
              title="业务类别"
              width="100"
              align="center"
            />
            <vxe-column
              field="TYPE"
              title="流水类型"
              width="90"
              align="center"
            />
            <vxe-column
              field="AREA_NAME"
              title="库房/库区"
              width="150"
              align="center"
            />
            <vxe-column
              field="DEPT_TWO_CODE"
              title="SPD科室编码"
              width="130"
              align="center"
            />
            <vxe-column
              field="DEPT_TWO_NAME"
              title="SPD科室名称"
              width="160"
              align="center"
            />
            <vxe-column
              field="CHARGE_CODE"
              title="计费编码"
              width="130"
              align="center"
            />
            <vxe-column
              field="BARCODE_NUMBER"
              title="定数码"
              width="130"
              align="center"
            />
            <vxe-column
              field="VARIETIE_NAME"
              title="品种名称"
              min-width="220"
              align="center"
            />
            <vxe-column
              field="SPECIFICATION_OR_TYPE"
              title="规格型号"
              width="180"
              align="center"
            />
            <vxe-column
              field="MANUFACTURING_ENT_NAME"
              title="生产企业"
              min-width="220"
              align="center"
            />
            <vxe-column field="UNIT" title="单位" width="80" align="center" />
            <vxe-column
              field="PRE_DEDUCT_QTY"
              title="预扣数量"
              width="100"
              align="right"
              :formatter="formatQty"
            />
            <vxe-column
              field="STOCK_DEDUCT_TYPE_NAME"
              title="扣费类型"
              width="100"
              align="center"
              :formatter="formatStockDeductType"
            />
            <vxe-column
              field="PATIENT_NUMBER"
              title="病患号"
              width="120"
              align="center"
            />
            <vxe-column
              field="HOSPITALIZATION_NUMBER"
              title="住院号"
              width="120"
              align="center"
            />
            <vxe-column
              field="JF_ID"
              title="计费记录ID"
              width="160"
              align="center"
            />
            <vxe-column
              field="BATCH_NO"
              title="批号"
              width="120"
              align="center"
            />
            <vxe-column
              field="EXPIRY_DATE"
              title="有效期"
              width="120"
              align="center"
            />
            <vxe-column
              field="PRODUCTION_DATE"
              title="生产日期"
              width="120"
              align="center"
            />
            <vxe-column
              field="ORIGING_CODE"
              title="来源单号"
              width="150"
              align="center"
            />
            <vxe-column
              field="TRANSFER_REMARK"
              title="移库备注 / 批次"
              width="200"
              align="center"
            />
            <vxe-column
              field="TRANSFER_BLOCK_REASON"
              title="移库限制说明"
              width="180"
              align="center"
            />
            <vxe-column
              field="CONSUMER"
              title="操作人"
              width="110"
              align="center"
            />
            <vxe-column
              field="CREATE_TIME"
              title="创建时间"
              width="170"
              align="center"
              :formatter="formatDateTime"
            />
            <vxe-column
              field="QTY"
              title="数量"
              width="90"
              align="right"
              fixed="right"
              :formatter="formatQty"
            />
            <vxe-column
              field="MEDICAL_ORDER_ID"
              title="医嘱ID"
              width="150"
              align="center"
              fixed="right"
            />
            <vxe-column
              field="OPEARTION_CHARGING_TIME"
              title="计费时间"
              width="170"
              align="center"
              fixed="right"
              :formatter="formatDateTime"
            />
            <vxe-column
              title="操作"
              width="120"
              align="center"
              fixed="right"
              class-name="action-col"
            >
              <template v-slot="{ row }">
                <el-link
                  type="primary"
                  :underline="false"
                  :disabled="deleting || !canTransferRow(row)"
                  :title="row.TRANSFER_BLOCK_REASON || ''"
                  @click.stop="handleTransfer([row])"
                  >移库</el-link
                >
                <el-divider direction="vertical" />
                <el-link
                  type="danger"
                  :underline="false"
                  :disabled="deleting || !canDeleteRow(row)"
                  @click.stop="handleDelete(row)"
                >
                  删除
                </el-link>
              </template>
            </vxe-column>
          </vxe-table>
        </div>

        <vxe-pager
          class="material-detail-pager"
          size="mini"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 50, 100, 150, 200, 300, 999999]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onPageChange"
        >
        </vxe-pager>
      </div>
    </el-dialog>
    <MaterialTransferDialog
      :visible.sync="transferVisible"
      :filters="localWhere"
      :source-area="transferSourceArea"
      :source-name="transferSourceName"
      :initial-rows="transferInitialRows"
      @success="onTransferSuccess"
    />
  </div>
</template>

<script>
  import { Message } from 'element-ui';
  import { utils, writeFile } from 'xlsx';
  import {
    MATERIAL_DETAIL_EXPORT_HEADERS,
    fmtDateTime,
    fmtQty,
    materialDetailRowToExportArray,
    stockDeductTypeName
  } from '../utils';
  import {
    deleteMaterialDetails,
    getMaterialDetail
  } from '@/api/Inventory/WarehouseAreaThreeInventory';
  import MaterialDetailFilters from './MaterialDetailFilters.vue';
  import MaterialTransferDialog from './MaterialTransferDialog.vue';
  import {
    createDetailWhere,
    canTransferRow,
    canDeleteRow
  } from '../transferSelection';

  export default {
    name: 'MaterialDetailDialog',
    components: { MaterialDetailFilters, MaterialTransferDialog },
    props: {
      visible: Boolean,
      title: { type: String, default: '' },
      filters: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        tableData: [],
        tableLoading: false,
        selection: [],
        deleting: false,
        exporting: false,
        localWhere: {},
        transferVisible: false,
        transferSourceArea: '',
        transferSourceName: '',
        transferInitialRows: [],
        pagination: {
          currentPage: 1,
          pageSize: 50,
          total: 0
        }
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('update:visible', value);
        }
      }
    },
    methods: {
      canTransferRow,
      canDeleteRow,
      searchDetails() {
        this.pagination.currentPage = 1;
        this.clearSelection();
        this.loadTableData();
      },
      clearFilters() {
        this.localWhere = createDetailWhere({
          AREA_CODE: this.filters.AREA_CODE,
          CHARGE_CODE: ''
        });
        this.searchDetails();
      },
      handleTransfer(rows) {
        if (!rows || !rows.length) {
          Message.warning('请先选择需要移库的流水');
          return;
        }
        const sourceArea = String(rows[0].AREA_CODE || '');
        if (
          !sourceArea ||
          rows.some((row) => String(row.AREA_CODE) !== sourceArea)
        ) {
          Message.warning('单次移库请选择同一实际来源库区的流水');
          return;
        }
        if (rows.some((row) => !canTransferRow(row, sourceArea))) {
          Message.warning('所选流水包含不可移库记录');
          return;
        }
        this.transferSourceArea = sourceArea;
        this.transferSourceName = rows[0].AREA_NAME || sourceArea;
        this.transferInitialRows = [...rows];
        this.transferVisible = true;
      },
      async onTransferSuccess(result) {
        this.clearSelection();
        await this.loadTableData();
        this.$emit('changed', { operation: 'transfer', result });
      },
      // 数量、时间和扣费类型统一使用与汇总表一致的显示格式。
      formatQty({ cellValue }) {
        return fmtQty(cellValue);
      },
      formatDateTime({ cellValue }) {
        return fmtDateTime(cellValue);
      },
      formatStockDeductType({ row }) {
        return (
          row.STOCK_DEDUCT_TYPE_NAME ||
          stockDeductTypeName(row.STOCK_DEDUCT_TYPE)
        );
      },
      // 弹窗打开后重置分页并加载明细。
      onOpen() {
        this.localWhere = createDetailWhere({
          AREA_CODE: this.filters.AREA_CODE || '',
          CHARGE_CODE: this.filters.CHARGE_CODE || ''
        });
        this.selection = [];
        this.pagination.currentPage = 1;
        this.$nextTick(() => {
          this.loadTableData();
        });
      },
      onClosed() {
        this.transferVisible = false;
        this.tableData = [];
        this.selection = [];
        this.pagination.total = 0;
        this.pagination.currentPage = 1;
      },
      async loadTableData() {
        if (!this.localWhere?.AREA_CODE) {
          this.tableData = [];
          this.pagination.total = 0;
          return;
        }
        this.tableLoading = true;
        try {
          const res = await getMaterialDetail(
            this.localWhere,
            this.pagination.currentPage,
            this.pagination.pageSize
          );
          this.tableData = res.result || [];
          this.pagination.total = res.total || res.count || 0;
        } catch (e) {
          this.tableData = [];
          this.pagination.total = 0;
          Message.error(e.message || '查询明细失败');
        } finally {
          this.tableLoading = false;
        }
      },
      onPageChange({ currentPage, pageSize }) {
        this.pagination.currentPage = currentPage;
        this.pagination.pageSize = pageSize;
        this.clearSelection();
        this.loadTableData();
      },
      onCheckboxChange({ records }) {
        this.selection = records || [];
      },
      onCheckboxAll({ records }) {
        this.selection = records || [];
      },
      clearSelection() {
        this.selection = [];
        this.$refs.table?.clearCheckboxRow?.();
      },
      // 按当前筛选条件导出全部明细
      async handleExport() {
        if (!this.localWhere?.AREA_CODE) {
          Message.warning('缺少库房/库区条件，无法导出');
          return;
        }
        this.exporting = true;
        try {
          const res = await getMaterialDetail(this.localWhere, 1, 999999);
          const list = res.result || [];
          if (!list.length) {
            Message.warning('暂无明细可导出');
            return;
          }
          const rows = list.map((row, index) =>
            materialDetailRowToExportArray(row, index)
          );
          const sheet = utils.aoa_to_sheet([
            MATERIAL_DETAIL_EXPORT_HEADERS,
            ...rows
          ]);
          const book = utils.book_new();
          utils.book_append_sheet(book, sheet, '耗材使用明细');
          writeFile(book, `耗材使用明细-${this.exportDateStamp()}.xlsx`);
          Message.success('导出成功');
        } catch (e) {
          Message.error(e.message || '导出失败');
        } finally {
          this.exporting = false;
        }
      },
      // 生成导出文件名中的日期后缀 yyyyMMdd
      exportDateStamp() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}${m}${d}`;
      },
      // 删除单条明细。
      async handleDelete(row) {
        await this.removeMaterialDetails([row]);
      },
      // 删除当前勾选的全部明细。
      async handleBatchDelete() {
        await this.removeMaterialDetails(this.selection);
      },
      // 统一执行软删除并在成功后刷新明细表格。
      async removeMaterialDetails(rows) {
        if ((rows || []).some((row) => !canDeleteRow(row))) {
          Message.warning('关联移库的流水不能直接删除');
          return;
        }
        const ids = (rows || [])
          .map((row) => row?.ID)
          .filter((id) => id != null && String(id) !== '0');
        const uniqueIds = Array.from(new Set(ids));
        if (!uniqueIds.length) {
          Message.warning('请选择需要删除的明细');
          return;
        }

        const count = uniqueIds.length;
        const confirmText =
          count > 1
            ? `确定要批量删除选中的 ${count} 条库存明细吗？删除后不再显示。`
            : '确定要删除这条库存明细吗？删除后不再显示。';
        try {
          await this.$confirm(confirmText, '提示', {
            type: 'warning',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
          });
          this.deleting = true;
          const res = await deleteMaterialDetails(uniqueIds, this.localWhere);
          Message.success(res.msg || `已删除 ${count} 条明细`);
          this.clearSelection();
          this.pagination.currentPage = 1;
          await this.loadTableData();
          this.$emit('changed', { operation: 'delete' });
        } catch (e) {
          if (e === 'cancel' || e === 'close') return;
          Message.error(e.message || '删除失败');
        } finally {
          this.deleting = false;
        }
      }
    }
  };
</script>

<style scoped>
  .material-detail-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    min-width: 0;
  }

  .material-detail-toolbar {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 8px;
  }

  .material-detail-filter-wrap {
    flex: none;
    max-height: 38vh;
    overflow: auto;
  }

  .material-detail-selection {
    color: #606266;
    font-size: 12px;
  }

  .material-detail-table-wrap {
    flex: 1;
    width: 100%;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .material-detail-table {
    width: 100%;
    height: 100%;
    max-width: 100%;
  }

  .material-detail-pager {
    display: flex;
    flex: none;
    justify-content: flex-end;
    margin-top: 8px;
  }
</style>

<style>
  .material-detail-dialog {
    display: flex;
    flex-direction: column;
    height: 90%;
    margin-bottom: 0;
    overflow: hidden;
  }

  .material-detail-dialog .el-dialog__header {
    flex: none;
  }

  .material-detail-dialog .el-dialog__body {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    padding: 12px 16px 16px;
    overflow: hidden;
  }
</style>
