<template>
  <div class="snapshot-supplier">
    <el-row :gutter="12">
      <el-col :span="8">
        <div class="panel-head">快照批次</div>
        <el-form size="small" inline class="batch-toolbar" @submit.native.prevent>
          <el-select v-model="batchQuery.approveState" style="width: 100px" @change="reloadBatch">
            <el-option label="全部" value="" />
            <el-option label="已审批" value="1" />
            <el-option label="未审批" value="0" />
          </el-select>
          <el-date-picker
            v-model="batchQuery.dateFrom"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="起始时间"
            style="width: 130px"
          />
          <el-date-picker
            v-model="batchQuery.dateTo"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            style="width: 130px"
          />
          <el-button type="primary" icon="el-icon-search" @click="reloadBatch">查询</el-button>
          <el-button type="primary" plain @click="openCreate">创建</el-button>
        </el-form>
        <el-table
          ref="batchTable"
          v-loading="batchLoading"
          :data="batchRows"
          border
          stripe
          highlight-current-row
          height="400"
          size="small"
          @current-change="onBatchSelect"
        >
          <el-table-column prop="Snapshot_Batch" label="快照批次" min-width="120" show-overflow-tooltip />
          <el-table-column prop="Mark" label="备注" width="80" show-overflow-tooltip />
          <el-table-column label="状态" width="80">
            <template slot-scope="{ row }">
              {{ row.Approve_State == 1 || row.Approve_State === '1' ? '已审批' : '未审批' }}
            </template>
          </el-table-column>
          <el-table-column prop="Create_Time" label="创建时间" width="110" />
          <el-table-column label="审批" width="70" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click.stop="onApproveBatch(row)">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pager"
          small
          background
          layout="total, prev, pager, next"
          :total="batchTotal"
          :page-size="batchPage.size"
          :current-page="batchPage.page"
          @current-change="loadBatch"
        />
      </el-col>

      <el-col :span="16">
        <div class="panel-head">快照明细</div>
        <el-form size="small" inline class="detail-toolbar" @submit.native.prevent>
          <span class="lbl">对账含:</span>
          <el-select v-model="detailQuery.isGet" style="width: 90px" @change="reloadDetail">
            <el-option label="所有" value="" />
            <el-option label="未收" value="0" />
            <el-option label="已收" value="1" />
          </el-select>
          <span class="lbl">状态:</span>
          <el-select v-model="detailQuery.approveState" style="width: 100px" @change="reloadDetail">
            <el-option label="所有" value="" />
            <el-option label="未核对" value="0" />
            <el-option label="核对一致" value="1" />
            <el-option label="核对有异" value="2" />
          </el-select>
          <span class="lbl">库存数量:</span>
          <el-select v-model="detailQuery.containAllZero" style="width: 110px" @change="reloadDetail">
            <el-option label="含有非0" value="1" />
            <el-option label="仅库存非0" value="2" />
            <el-option label="全部" value="" />
          </el-select>
          <el-input
            v-model="detailQuery.supplierName"
            clearable
            placeholder="供应商搜索"
            style="width: 160px"
            @keyup.enter.native="reloadDetail"
          />
          <el-input
            v-model="detailQuery.varietie"
            clearable
            placeholder="品种搜索"
            style="width: 160px"
            @keyup.enter.native="reloadDetail"
          />
          <el-button type="primary" @click="reloadDetail">查询</el-button>
          <el-button type="primary" plain @click="onConfirmGet">确认收取</el-button>
          <el-button
            v-permission="'export-SnapshotDcKc'"
            type="primary"
            plain
            :loading="exporting"
            @click="onExport"
          >
            导出
          </el-button>
        </el-form>
        <div class="detail-summary">
          <span>合计: <b>{{ detailSummary.total2 }}</b></span>
          <span>合计金额: <b>{{ detailSummary.amounSum }}</b></span>
        </div>
        <el-table
          ref="detailTable"
          v-loading="detailLoading"
          :data="detailRows"
          border
          stripe
          height="360"
          size="small"
          @selection-change="(s) => (detailSelection = s)"
        >
          <el-table-column type="selection" width="42" />
          <el-table-column prop="Supplier_Name" label="供应商名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
          <el-table-column prop="Varietie_Name" label="品种名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="Specification_Or_Type" label="规格型号" width="120" show-overflow-tooltip />
          <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业" width="120" show-overflow-tooltip />
          <el-table-column prop="UNIT" label="单位" width="50" align="center" />
          <el-table-column label="合计库存" width="80" align="center">
            <template slot-scope="{ row }">{{ calcAllGoodsQty(row) }}</template>
          </el-table-column>
          <el-table-column prop="Center_Goods_Qty" label="中心库散货" width="90" align="center" />
          <el-table-column prop="Center_Def_Qty" label="中心库定数包" width="95" align="center" />
          <el-table-column prop="Receive_His_Qty" label="收货结算" width="80" align="center" />
          <el-table-column prop="Consumed_Dept_Qty" label="用后结算-科室库存" width="120" align="center" />
          <el-table-column prop="Consumed_His_Qty" label="用后结算数量" width="100" align="center" />
          <el-table-column label="供应商核对" width="90">
            <template slot-scope="{ row }">{{ fmtApproveStateDtl(row.Approve_State) }}</template>
          </el-table-column>
          <el-table-column label="对账函" width="70">
            <template slot-scope="{ row }">{{ fmtIsGet(row.IS_GET) }}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pager"
          small
          background
          layout="total, sizes, prev, pager, next"
          :total="detailTotal"
          :page-size="detailPage.size"
          :current-page="detailPage.page"
          :page-sizes="[10, 50, 100, 150, 200, 300]"
          @size-change="onDetailSize"
          @current-change="loadDetail"
        />
      </el-col>
    </el-row>

    <el-dialog title="创建快照" :visible.sync="createVisible" width="450px" append-to-body>
      <el-form label-width="80px">
        <el-form-item label="备注">
          <el-input v-model="createMark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="submitCreate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import {
  searchSnapshotBatch,
  searchSnapshotBatchVarietie,
  createSnapshot,
  approveSnapshot,
  approveSnapshotDlt
} from '@/api/Inventory/Snapshot';
import {
  calcAllGoodsQty,
  fmtApproveStateDtl,
  fmtIsGet,
  exportAoa,
  SUPPLIER_EXPORT_HEADERS,
  supplierRowToExport
} from '../utils';

export default {
  data() {
    return {
      batchQuery: { approveState: '', dateFrom: '', dateTo: '' },
      batchPage: { page: 1, size: 50 },
      batchRows: [],
      batchTotal: 0,
      batchLoading: false,
      selectedBatch: '',
      detailQuery: {
        isGet: '',
        approveState: '',
        containAllZero: '1',
        supplierName: '',
        varietie: ''
      },
      detailPage: { page: 1, size: 50 },
      detailRows: [],
      detailTotal: 0,
      detailLoading: false,
      detailSelection: [],
      detailSummary: { total2: '', amounSum: '' },
      exporting: false,
      createVisible: false,
      createMark: '',
      creating: false
    };
  },
  created() {
    this.loadBatch(1);
  },
  methods: {
    calcAllGoodsQty,
    fmtApproveStateDtl,
    fmtIsGet,
    reloadBatch() {
      this.loadBatch(1);
    },
    async loadBatch(page) {
      this.batchPage.page = page;
      this.batchLoading = true;
      try {
        const res = await searchSnapshotBatch({
          ...this.batchQuery,
          page: this.batchPage.page,
          size: this.batchPage.size
        });
        this.batchRows = res.result || [];
        this.batchTotal = res.total || 0;
      } catch (e) {
        Message.error(e.message || '加载批次失败');
        this.batchRows = [];
        this.batchTotal = 0;
      } finally {
        this.batchLoading = false;
      }
    },
    onBatchSelect(row) {
      this.selectedBatch = row?.Snapshot_Batch || '';
      this.reloadDetail();
    },
    reloadDetail() {
      if (!this.selectedBatch) {
        this.detailRows = [];
        this.detailTotal = 0;
        this.detailSummary = { total2: '', amounSum: '' };
        return;
      }
      this.loadDetail(1);
    },
    onDetailSize(size) {
      this.detailPage.size = size;
      this.loadDetail(1);
    },
    async loadDetail(page) {
      if (!this.selectedBatch) return;
      this.detailPage.page = page;
      this.detailLoading = true;
      try {
        const res = await searchSnapshotBatchVarietie({
          snapshotBatch: this.selectedBatch,
          ...this.detailQuery,
          page: this.detailPage.page,
          size: this.detailPage.size
        });
        this.detailRows = res.result || [];
        this.detailTotal = res.total || 0;
        this.detailSummary = {
          total2: res.total2 ?? '',
          amounSum: res.amounSum ?? ''
        };
      } catch (e) {
        Message.error(e.message || '加载明细失败');
      } finally {
        this.detailLoading = false;
      }
    },
    openCreate() {
      this.createMark = '';
      this.createVisible = true;
    },
    async submitCreate() {
      this.creating = true;
      try {
        await createSnapshot(this.createMark);
        Message.success('创建成功');
        this.createVisible = false;
        this.loadBatch(1);
      } catch (e) {
        Message.error(e.message || '创建失败');
      } finally {
        this.creating = false;
      }
    },
    async onApproveBatch(row) {
      try {
        await MessageBox.confirm(`确定审批发送 ${row.Snapshot_Batch} 吗?`, '提示', { type: 'warning' });
        const res = await approveSnapshot(row.Snapshot_Batch);
        Message.success(res.msg || '审批成功');
        this.loadBatch(this.batchPage.page);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '审批失败');
      }
    },
    async onConfirmGet() {
      if (!this.detailSelection.length) {
        Message.warning('请选择品种');
        return;
      }
      const ids = this.detailSelection.map((r) => `'${r.ID}'`).join(',');
      try {
        await MessageBox.confirm('确定收取吗?', '提示', { type: 'warning' });
        const res = await approveSnapshotDlt(ids);
        Message.success(res.msg || '操作成功');
        this.loadDetail(this.detailPage.page);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onExport() {
      if (!this.selectedBatch) {
        Message.warning('请先选择快照批次');
        return;
      }
      this.exporting = true;
      try {
        const res = await searchSnapshotBatchVarietie({
          snapshotBatch: this.selectedBatch,
          ...this.detailQuery,
          page: 1,
          size: 999999
        });
        const rows = (res.result || []).map(supplierRowToExport);
        exportAoa('库存快照.xlsx', SUPPLIER_EXPORT_HEADERS, rows);
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
.panel-head {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.batch-toolbar,
.detail-toolbar {
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.lbl {
  margin: 0 4px 0 8px;
  font-size: 13px;
  color: #606266;
}
.detail-summary {
  margin-bottom: 6px;
  font-size: 13px;
  text-align: right;
}
.detail-summary b {
  color: #009688;
}
.detail-summary span + span {
  margin-left: 16px;
}
.pager {
  margin-top: 8px;
}
</style>
