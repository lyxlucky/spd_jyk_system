<template>
  <div class="batch-summary">
    <el-form
      class="batch-summary-search"
      size="small"
      @submit.native.prevent="search"
    >
      <el-input
        v-model="keyword"
        aria-label="搜索批号"
        placeholder="输入批号"
        clearable
        @clear="search"
      />
      <el-button type="primary" native-type="submit">搜索</el-button>
    </el-form>

    <p v-if="error" class="batch-summary-error" role="alert">
      {{ error }}
      <el-button type="text" size="small" @click="refresh">重试</el-button>
    </p>
    <p v-else-if="hasUnassignedChange" class="batch-summary-note">
      部分流水缺少批号，相关批号的剩余量待确认。清空搜索可查看未归属的流水。
    </p>

    <div class="batch-summary-table">
      <vxe-table
        ref="table"
        :data="rows"
        :loading="loading"
        :row-config="{ keyField: 'ROW_KEY', isHover: true }"
        :empty-text="error ? '暂时无法显示批号汇总' : '暂无批号汇总'"
        border
        stripe
        size="mini"
        height="100%"
        show-overflow="tooltip"
      >
        <vxe-column field="BATCH_NO" title="批号" min-width="175">
          <template #default="{ row }">
            <strong v-if="row.BATCH_NO">{{ row.BATCH_NO }}</strong>
            <span v-else-if="row.HAS_UNASSIGNED_CHARGE">
              未归属批号计费
            </span>
            <span v-else>无批号流水</span>
          </template>
        </vxe-column>
        <vxe-column field="AREA_NAME" title="库房/库区" min-width="130">
          <template #default="{ row }">
            {{ row.AREA_NAME || row.AREA_CODE }}
          </template>
        </vxe-column>
        <vxe-column field="CHARGE_CODE" title="计费编码" min-width="105">
          <template #default="{ row }">{{ row.CHARGE_CODE || '—' }}</template>
        </vxe-column>
        <vxe-column
          field="INBOUND_QTY"
          title="入库量"
          min-width="95"
          align="right"
          :formatter="formatQuantity"
        />
        <vxe-column
          field="REAL_DEDUCT_QTY"
          title="实际计费量"
          min-width="110"
          align="right"
          :formatter="formatQuantity"
        />
        <vxe-column field="STOCK_QTY" title="剩余量" min-width="95" align="right">
          <template #default="{ row }">
            <span v-if="!row.BATCH_NO">—</span>
            <el-tag
              v-else-if="row.HAS_UNASSIGNED_CHANGE"
              size="mini"
              type="warning"
              >待确认</el-tag
            >
            <strong v-else class="batch-summary-stock">
              {{ fmtQty(row.STOCK_QTY) }}
            </strong>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="96" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              size="mini"
              @click="$emit('view-details', row)"
              >查看流水</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <vxe-pager
      class="batch-summary-pager"
      size="mini"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      :layouts="['PrevPage', 'Number', 'NextPage', 'FullJump', 'Total']"
      @page-change="onPageChange"
    />
  </div>
</template>

<script>
  import { getMaterialBatchSummary } from '@/api/Inventory/WarehouseAreaThreeInventory';
  import { fmtQty } from '../utils';

  export default {
    name: 'MaterialBatchSummary',
    props: {
      scope: { type: Object, required: true }
    },
    data() {
      return {
        keyword: '',
        appliedKeyword: '',
        page: 1,
        pageSize: 20,
        total: 0,
        rows: [],
        loading: false,
        error: '',
        requestId: 0
      };
    },
    computed: {
      hasUnassignedChange() {
        return this.rows.some((row) => row.HAS_UNASSIGNED_CHANGE);
      }
    },
    mounted() {
      this.refresh();
    },
    beforeDestroy() {
      this.requestId += 1;
    },
    methods: {
      fmtQty,
      formatQuantity({ cellValue }) {
        return fmtQty(cellValue);
      },
      search() {
        this.appliedKeyword = this.keyword.trim();
        this.page = 1;
        this.refresh();
      },
      onPageChange({ currentPage }) {
        this.page = currentPage;
        this.refresh();
      },
      async refresh() {
        const requestId = ++this.requestId;
        this.loading = true;
        this.error = '';
        this.rows = [];
        try {
          const result = await getMaterialBatchSummary(
            this.scope,
            this.appliedKeyword,
            this.page,
            this.pageSize
          );
          if (requestId !== this.requestId) return;
          this.total = result.total || 0;
          const lastPage = Math.max(1, Math.ceil(this.total / this.pageSize));
          if (this.page > lastPage) {
            this.page = lastPage;
            return this.refresh();
          }
          this.rows = (result.result || []).map((row) => ({
            ...row,
            ROW_KEY: JSON.stringify([row.AREA_CODE, row.CHARGE_CODE, row.BATCH_NO])
          }));
        } catch (error) {
          if (requestId !== this.requestId) return;
          this.total = 0;
          this.error = error.message || '查询批号汇总失败';
        } finally {
          if (requestId === this.requestId) this.loading = false;
        }
      },
      recalculate() {
        this.$refs.table?.recalculate?.();
      }
    }
  };
</script>

<style scoped>
  .batch-summary {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .batch-summary-search {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .batch-summary-search .el-input {
    width: 260px;
    max-width: 100%;
    min-width: 0;
  }

  .batch-summary-note,
  .batch-summary-error {
    flex: none;
    margin: 0 0 10px;
    padding: 8px 12px;
    font-size: 13px;
    background: #fdf6ec;
    color: #764a12;
    border-radius: 4px;
  }

  .batch-summary-error {
    background: #fef0f0;
    color: #a12c2c;
  }

  .batch-summary-table {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
  }

  .batch-summary-stock {
    color: #185a9d;
  }

  .batch-summary-pager {
    flex: none;
    min-width: 0;
    margin-top: 8px;
    overflow-x: auto;
  }
</style>
