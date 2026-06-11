<template>
  <div class="third-stock-query-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      size="mini"
      highlight-current-row
      height="calc(100vh - 280px)"
      class="style-table"
    >
      <el-table-column
        prop="DEPT_TWO_NAME"
        label="二级科室名称"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="VARIETIE_CODE_NEW"
        label="品种编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="CHARGE_CODE"
        label="计费编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="VARIETIE_NAME"
        label="品种名称"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="MANUFACTURING_ENT_NAME"
        label="生产企业"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="UNIT"
        label="单位"
        align="center"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="PRICE"
        label="单价"
        align="center"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="APPROVAL_NUMBER"
        label="批准文号"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column label="入库类型" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ formatStorageType(row.STORAGE_TYPE) }}
        </template>
      </el-table-column>
      <el-table-column label="库存数量" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ calcStockQty(row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="$emit('flow-record', row)">
            流向记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="table-pager"
      background
      small
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      :page-sizes="pageSizes"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script>
  export default {
    name: 'ThirdStockQueryTable',
    props: {
      loading: Boolean,
      tableData: { type: Array, default: () => [] },
      total: { type: Number, default: 0 },
      page: { type: Number, default: 1 },
      pageSize: { type: Number, default: 10 },
      pageSizes: { type: Array, default: () => [10, 20, 50, 100, 9999999] }
    },
    methods: {
      calcStockQty(row) {
        if (!row) return 0;
        if (Number(row.KS_QTY) === 0) return row.KS_QTY;
        return (
          Number(row.KS_QTY || 0) +
          Number(row.JF_QTY || 0) +
          Number(row.JF_DEF_QTY || 0)
        );
      },
      formatStorageType(value) {
        if (value == 0) return '普通入库';
        if (value == 1) return '盘盈入库';
        return '未知';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .table-pager {
    margin-top: 12px;
    text-align: right;
  }
</style>
