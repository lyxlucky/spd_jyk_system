<template>
  <el-dialog
    title="库存预警提醒"
    :visible.sync="innerVisible"
    width="960px"
    append-to-body
    custom-class="inv-stock-alert-dialog"
    @open="onOpen"
  >
    <div class="tip">
      按当前页面查询条件统计停用或合同到期且仍有库存的品种
      <span v-if="list.length">（共 {{ list.length }} 条）</span>
      <span v-if="fromCache" class="tip-cache">（本地筛选，未重查库）</span>
    </div>
    <el-form size="mini" inline class="filter-bar" @submit.native.prevent>
      <el-form-item label="库存位置">
        <el-autocomplete
          v-model="filter.sourceFrom"
          :fetch-suggestions="querySourceFrom"
          clearable
          placeholder="与页面共用"
          style="width: 140px"
          @select="onFilterChange"
          @clear="onFilterChange"
        />
      </el-form-item>
      <el-form-item label="院区">
        <el-select
          v-model="filter.storageId"
          clearable
          placeholder="全部"
          style="width: 120px"
          @change="onFilterChange"
        >
          <el-option label="全部" value="" />
          <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item label="预警类型">
        <el-select v-model="filter.alertType" style="width: 130px" @change="onFilterChange">
          <el-option label="全部" value="all" />
          <el-option label="停用" value="disabled" />
          <el-option label="合同到期" value="contractExpired" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="loading" @click="reload">查询</el-button>
        <el-button @click="syncFromPage">同步页面筛选</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="pagedList"
      size="mini"
      border
      stripe
      max-height="400"
      :row-class-name="rowClassName"
    >
      <el-table-column type="index" width="50" align="center" :index="indexMethod" />
      <el-table-column label="预警类型" width="110" align="center">
        <template v-slot="{ row }">{{ fmtWarningType(row.WarningType) }}</template>
      </el-table-column>
      <el-table-column prop="Source_Name" label="库存位置" min-width="110" show-overflow-tooltip />
      <el-table-column prop="Varietie_Code_New" label="品种编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Goods_Qty" label="库存数量" width="90" align="center" />
      <el-table-column prop="Unit" label="单位" width="60" align="center" />
      <el-table-column prop="CONTRACT_NAME" label="合同" min-width="120" show-overflow-tooltip />
      <el-table-column label="合同终止日期" width="110" align="center">
        <template v-slot="{ row }">{{ fmtDate(row.DET_CONTRACT_END) }}</template>
      </el-table-column>
      <el-table-column prop="Supplier_Name" label="供应商" min-width="120" show-overflow-tooltip />
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        small
        layout="total, sizes, prev, pager, next"
        :total="list.length"
        :page-size="pageSize"
        :page-sizes="[10, 30, 60, 100]"
        :current-page="page"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
    <div slot="footer">
      <el-button size="mini" type="primary" @click="innerVisible = false">知道了</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { searchStockAlerts } from '@/api/Inventory/InventoryQueryNew';

function norm(v) {
  return v == null ? '' : String(v).trim();
}

/** 服务端拉取范围 key：位置/院区变了才需要重查库 */
function fetchScopeKey(sourceFrom, storageId) {
  return `${norm(sourceFrom)}||${norm(storageId)}`;
}

export default {
  name: 'StockAlertDialog',
  props: {
    visible: Boolean,
    /** 页面当前筛选 */
    pageWhere: {
      type: Object,
      default: () => ({})
    },
    /** 父页已预加载的全量预警（alertType=all），打开时可复用 */
    cachedList: {
      type: Array,
      default: () => []
    },
    storageList: {
      type: Array,
      default: () => []
    },
    sourceFromList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      /** 当前服务端拉取的全量（含停用+合同到期） */
      rawList: [],
      /** 上次服务端拉取时的位置/院区 */
      rawScopeKey: '',
      list: [],
      page: 1,
      pageSize: 10,
      fromCache: false,
      filter: {
        sourceFrom: '',
        storageId: '',
        alertType: 'all'
      }
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    pagedList() {
      const start = (this.page - 1) * this.pageSize;
      return (this.list || []).slice(start, start + this.pageSize);
    }
  },
  methods: {
    fmtWarningType(t) {
      if (t === 'Disabled') return '停用';
      if (t === 'ContractExpired') return '合同到期';
      return t || '-';
    },
    fmtDate(v) {
      if (!v) return '';
      const s = String(v);
      return s.length >= 10 ? s.substring(0, 10) : s;
    },
    rowClassName({ row }) {
      return row.WarningType === 'Disabled' ? 'inv-alert-row-disabled' : 'inv-alert-row-contract';
    },
    indexMethod(index) {
      return (this.page - 1) * this.pageSize + index + 1;
    },
    onPageChange(p) {
      this.page = p;
    },
    onSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
    },
    querySourceFrom(query, cb) {
      const q = (query || '').toLowerCase();
      const options = ['院内中心库', ...(this.sourceFromList || []).map((d) => d.Dept_Two_Name || d)];
      const list = options
        .filter((n) => !q || String(n).toLowerCase().includes(q))
        .map((value) => ({ value }));
      cb(list);
    },
    syncFromPage() {
      this.filter.sourceFrom = this.pageWhere?.sourceFrom ?? '';
      this.filter.storageId = this.pageWhere?.storageId ?? '';
    },
    /** 院区/类型/位置变更即生效（能本地则本地，否则自动重查） */
    onFilterChange() {
      this.reload();
    },
    matchSourceFrom(row, sourceFrom) {
      const q = norm(sourceFrom).toLowerCase();
      if (!q) return true;
      const name = String(row.Source_Name || '').toLowerCase();
      return name.includes(q);
    },
    matchStorageId(row, storageId) {
      const q = norm(storageId);
      if (!q) return true;
      // 预警结果未必带 Storage_Id；无字段时不因院区过滤掉（与仅改位置/类型的本地筛选兼容）
      if (row.Storage_Id == null && row.STORAGE_ID == null) return true;
      return String(row.Storage_Id ?? row.STORAGE_ID) === q;
    },
    matchAlertType(row, alertType) {
      const t = (alertType || 'all').toLowerCase();
      if (t === 'disabled') return row.WarningType === 'Disabled';
      if (t === 'contractexpired') return row.WarningType === 'ContractExpired';
      return true;
    },
    /** 在已拉全量上做本地筛选（预警类型 / 缩小位置） */
    applyLocalFilter() {
      const { sourceFrom, storageId, alertType } = this.filter;
      const [rawSf, rawSid] = (this.rawScopeKey || '').split('||');
      let rows = this.rawList || [];
      // 相对拉取范围又缩小了位置/院区时，再本地滤一层
      if (norm(sourceFrom) && norm(sourceFrom).toLowerCase() !== norm(rawSf).toLowerCase()) {
        rows = rows.filter((r) => this.matchSourceFrom(r, sourceFrom));
      }
      if (norm(storageId) && norm(storageId) !== norm(rawSid)) {
        rows = rows.filter((r) => this.matchStorageId(r, storageId));
      }
      rows = rows.filter((r) => this.matchAlertType(r, alertType));
      this.list = rows;
      this.page = 1;
      this.fromCache = true;
    },
    canUseLocalOnly() {
      if (!this.rawList || !this.rawList.length || !this.rawScopeKey) return false;
      const [rawSf, rawSid] = this.rawScopeKey.split('||');
      const curSf = norm(this.filter.sourceFrom);
      const curSid = norm(this.filter.storageId);
      // 不能比已拉取范围更宽（例如缓存有院区，当前改成全部）
      if (rawSf && !curSf) return false;
      if (rawSid && !curSid) return false;
      // 院区必须一致（或缓存为全部院区）
      if (rawSid && curSid && rawSid !== curSid) return false;
      // 位置：相同，或当前关键字落在缓存关键字内（可本地再滤）
      if (rawSf && curSf) {
        const a = rawSf.toLowerCase();
        const b = curSf.toLowerCase();
        if (a !== b && !b.includes(a) && !a.includes(b)) return false;
      }
      return true;
    },
    /** 打开时优先复用父页缓存，避免再打一遍重查询 */
    async onOpen() {
      this.syncFromPage();
      const pageSf = norm(this.pageWhere?.sourceFrom);
      const pageSid = norm(this.pageWhere?.storageId);
      const scopeKey = fetchScopeKey(pageSf, pageSid);
      if ((this.cachedList || []).length > 0) {
        this.rawList = [...this.cachedList];
        this.rawScopeKey = scopeKey;
        this.applyLocalFilter();
        this.fromCache = true;
        return;
      }
      await this.reload({ forceServer: true });
    },
    async reload(opts = {}) {
      const forceServer = !!opts.forceServer;
      this.page = 1;
      this.$emit('sync-filter', {
        sourceFrom: this.filter.sourceFrom,
        storageId: this.filter.storageId
      });

      // 仅改预警类型 / 在已有更宽结果上缩小位置 → 不打库
      if (!forceServer && this.canUseLocalOnly()) {
        this.applyLocalFilter();
        return;
      }

      this.loading = true;
      this.fromCache = false;
      try {
        // 始终拉 all，类型在前端切，避免同范围反复扫库
        const res = await searchStockAlerts(
          {
            ...this.pageWhere,
            sourceFrom: this.filter.sourceFrom,
            storageId: this.filter.storageId
          },
          'all'
        );
        this.rawList = res.result || [];
        this.rawScopeKey = fetchScopeKey(this.filter.sourceFrom, this.filter.storageId);
        this.applyLocalFilter();
        this.fromCache = false;
        this.$emit('loaded', this.rawList);
      } catch (e) {
        this.rawList = [];
        this.list = [];
        Message.error(e.message || '加载库存预警失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.tip {
  margin-bottom: 10px;
  color: #c45656;
  font-size: 13px;
}
.tip-cache {
  margin-left: 6px;
  color: #909399;
  font-size: 12px;
}
.filter-bar {
  margin-bottom: 8px;
}
.pager-wrap {
  margin-top: 10px;
  text-align: right;
}
</style>

<style>
.inv-stock-alert-dialog .inv-alert-row-disabled > td {
  background-color: #f56c6c !important;
  color: #fff !important;
}
.inv-stock-alert-dialog .inv-alert-row-contract > td {
  background-color: #e6a23c !important;
  color: #fff !important;
}
</style>
