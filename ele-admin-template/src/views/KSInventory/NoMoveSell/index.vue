<template>
  <div class="ele-body spd-page no-move-sell">
    <el-card shadow="never" class="no-move-sell-card">
      <NoMoveSellSearch
        ref="search"
        :exporting="exporting"
        :notifying="notifying"
        @search="reload"
        @export="onExport"
        @notify="onNotify"
      />
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head spd-panel__head--split">
          <span>滞销库存列表</span>
          <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
        </div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            :toolbar="false"
            :toolkit="['columns', 'fullscreen']"
            :height="tableHeight"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            :page-size="10"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            :row-class-name="tableRowClass"
            cache-key="noMoveSellTable"
            @sort-change="onSortChange"
          >
            <template v-slot:remarks="{ row }">
              <el-button type="text" size="mini" @click="openRemark(row)">
                {{ row.Remarks == null || row.Remarks === '' ? '无' : row.Remarks }}
              </el-button>
            </template>
            <template v-slot:storageId="{ row }">
              {{ fmtStorageId(row.STORAGE_ID) }}
            </template>
            <template v-slot:upShelfState="{ row }">
              {{ fmtUpShelfState(row) }}
            </template>
            <template v-slot:batchProdDate="{ row }">
              {{ fmtDate10(row.BATCH_PRODUCTION_DATE) }}
            </template>
            <template v-slot:batchValidity="{ row }">
              <span :class="{ 'batch-expired': isBatchExpired(row.BATCH_VALIDITY_PERIOD) }">
                {{ fmtDate10(row.BATCH_VALIDITY_PERIOD) }}
              </span>
            </template>
            <template v-slot:supplyPrice="{ row }">
              {{ fmtPrice(row.SUPPLY_PRICE) }}
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <el-dialog
      :title="remarkRow ? `${remarkRow.VARIETIE_NAME || ''}备注:` : '备注'"
      :visible.sync="remarkVisible"
      width="600px"
      append-to-body
      @closed="remarkText = ''"
    >
      <el-input v-model="remarkText" type="textarea" :rows="12" size="mini" />
      <span slot="footer">
        <el-button size="mini" @click="remarkVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="remarkSaving" @click="saveRemark">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import NoMoveSellSearch from './components/NoMoveSellSearch.vue';
import {
  queryStationaryPin,
  exportStationaryPinExcel,
  updateRemarks,
  updateSendSupplierState
} from '@/api/KSInventory/NoMoveSell';
import {
  openExcelFile,
  fmtDate10,
  fmtPrice,
  fmtStorageId,
  fmtUpShelfState,
  isBatchExpired,
  normalizeRowForPost
} from './utils';

export default {
  name: 'KSInventoryNoMoveSell',
  components: { NoMoveSellSearch },
  data() {
    return {
      tableHeight: 'calc(100vh - 300px)',
      selection: [],
      lastWhere: {},
      lastSort: { field: '', order: '' },
      exporting: false,
      notifying: false,
      remarkVisible: false,
      remarkRow: null,
      remarkText: '',
      remarkSaving: false,
      columns: [
        { type: 'selection', width: 45, align: 'center', fixed: 'left' },
        {
          columnKey: 'remarks',
          prop: 'Remarks',
          label: '备注',
          width: 100,
          align: 'center',
          slot: 'remarks'
        },
        {
          prop: 'StockPosition',
          label: '库存位置',
          width: 200,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          columnKey: 'storageId',
          prop: 'STORAGE_ID',
          label: '院区库房',
          width: 120,
          sortable: 'custom',
          slot: 'storageId'
        },
        {
          columnKey: 'upShelfState',
          prop: 'UP_SHELF_STATE',
          label: '所属区域',
          width: 120,
          sortable: 'custom',
          slot: 'upShelfState'
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          width: 120,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          minWidth: 150,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          minWidth: 150,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业名称',
          minWidth: 160,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          minWidth: 150,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          width: 150,
          sortable: 'custom',
          showOverflowTooltip: true
        },
        {
          columnKey: 'batchProdDate',
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          width: 150,
          sortable: 'custom',
          slot: 'batchProdDate'
        },
        {
          columnKey: 'batchValidity',
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '失效日期',
          width: 150,
          sortable: 'custom',
          slot: 'batchValidity'
        },
        {
          columnKey: 'supplyPrice',
          prop: 'SUPPLY_PRICE',
          label: '结算价',
          width: 100,
          align: 'right',
          sortable: 'custom',
          slot: 'supplyPrice'
        },
        {
          prop: 'COEFFICIENT',
          label: '系数',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          prop: 'DefQUANTITY',
          label: '库存定数包',
          width: 140,
          align: 'center',
          sortable: 'custom'
        },
        {
          prop: 'GOODSQUANTITY',
          label: '库存散货',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          prop: 'UpStockDay',
          label: '在库天数',
          width: 120,
          align: 'center',
          sortable: 'custom'
        }
      ]
    };
  },
  methods: {
    fmtDate10,
    fmtPrice,
    fmtStorageId,
    fmtUpShelfState,
    isBatchExpired,
    tableRowClass({ row }) {
      return isBatchExpired(row.BATCH_VALIDITY_PERIOD) ? 'no-move-sell-row-expired' : '';
    },
    onSortChange({ prop, order }) {
      this.lastSort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.reload(this.lastWhere);
    },
    async datasource({ page, limit, where, order }) {
      const w = where || this.lastWhere || this.$refs.search?.getWhere?.() || {};
      const sort = {
        field: order?.sort || this.lastSort.field || '',
        order:
          order?.order === 'ascending'
            ? 'asc'
            : order?.order === 'descending'
              ? 'desc'
              : this.lastSort.order || ''
      };
      this.lastWhere = w;
      this.lastSort = sort;
      try {
        const res = await queryStationaryPin(w, page, limit, sort);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({
        page: 1,
        where: where || this.$refs.search.getWhere()
      });
    },
    openRemark(row) {
      this.remarkRow = row;
      this.remarkText = row.Remarks == null ? '' : String(row.Remarks);
      this.remarkVisible = true;
    },
    async saveRemark() {
      if (!this.remarkRow) return;
      this.remarkSaving = true;
      try {
        const payload = normalizeRowForPost({ ...this.remarkRow, Remarks: this.remarkText });
        const res = await updateRemarks([payload]);
        Message.success(res.msg || '保存成功');
        this.remarkVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.remarkSaving = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const where = this.$refs.search.getWhere();
        const res = await exportStationaryPinExcel(where, this.lastSort);
        openExcelFile(res.msg);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onNotify() {
      if (!this.selection.length) {
        Message.warning('请先勾选要通知的记录');
        return;
      }
      this.notifying = true;
      try {
        const rows = this.selection.map(normalizeRowForPost);
        const res = await updateSendSupplierState(rows);
        Message.success(res.msg || '操作成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.notifying = false;
      }
    }
  }
};
</script>

<style scoped>
.no-move-sell-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.batch-expired {
  color: #f56c6c;
}

::v-deep .no-move-sell-row-expired > td {
  background-color: #fde2e2 !important;
}
</style>
