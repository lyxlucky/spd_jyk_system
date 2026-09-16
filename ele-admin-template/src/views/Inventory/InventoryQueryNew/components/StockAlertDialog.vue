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
    </div>
    <el-form size="mini" inline class="filter-bar" @submit.native.prevent>
      <el-form-item label="库存位置">
        <el-autocomplete
          v-model="filter.sourceFrom"
          :fetch-suggestions="querySourceFrom"
          clearable
          placeholder="与页面共用"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="院区">
        <el-select v-model="filter.storageId" clearable placeholder="全部" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option v-for="s in storageList" :key="s.ID" :label="s.NAME" :value="String(s.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item label="预警类型">
        <el-select v-model="filter.alertType" style="width: 130px">
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

export default {
  name: 'StockAlertDialog',
  props: {
    visible: Boolean,
    /** 页面当前筛选：sourceFrom / storageId */
    pageWhere: {
      type: Object,
      default: () => ({})
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
      list: [],
      page: 1,
      pageSize: 10,
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
    /** 打开时同步页面筛选并加载；也可供父组件静默预加载 */
    async onOpen() {
      this.syncFromPage();
      await this.reload();
    },
    async reload() {
      this.loading = true;
      this.page = 1;
      try {
        // 同步回页面筛选，避免重复输入
        this.$emit('sync-filter', {
          sourceFrom: this.filter.sourceFrom,
          storageId: this.filter.storageId
        });
        const res = await searchStockAlerts(
          {
            ...this.pageWhere,
            sourceFrom: this.filter.sourceFrom,
            storageId: this.filter.storageId
          },
          this.filter.alertType
        );
        this.list = res.result || [];
        this.$emit('loaded', this.list);
      } catch (e) {
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
