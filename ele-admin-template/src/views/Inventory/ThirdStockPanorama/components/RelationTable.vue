<template>
  <section class="relation-table spd-panel spd-table-panel">
    <div class="spd-panel__head relation-table__head">
      <span>{{ title }}</span>
      <span class="relation-table__count">{{ total }} 条科室-品种关系</span>
    </div>
    <div class="spd-table-panel__wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        size="mini"
        highlight-current-row
        height="calc(100vh - 318px)"
        class="style-table"
        @row-click="$emit('select', $event)"
      >
        <el-table-column
          v-if="queryMode === 'department'"
          prop="DEPT_TWO_NAME"
          label="二级科室"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="VARIETIE_NAME"
          label="品种名称"
          min-width="180"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="queryMode === 'material'"
          prop="DEPT_TWO_NAME"
          label="二级科室"
          min-width="150"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="132" align="center" show-overflow-tooltip />
        <el-table-column prop="CHARGE_CODE" label="计费编码" width="132" align="center" show-overflow-tooltip />
        <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="150" align="left" show-overflow-tooltip />
        <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业" min-width="180" align="left" show-overflow-tooltip />
        <el-table-column prop="UNIT" label="单位" width="76" align="center" />
        <el-table-column label="库存状态" width="94" align="center">
          <template slot-scope="{ row }">
            <el-tag size="mini" :type="stockTagType(row)">{{ stockStatusText(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" width="104" align="right">
          <template slot-scope="{ row }">
            <span class="relation-table__qty">{{ calcCurrentStock(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库类型" width="102" align="center">
          <template slot-scope="{ row }">{{ formatStorageType(row.STORAGE_TYPE) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="88" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click.stop="$emit('flow', row)">流水</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="relation-table__pager"
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
  </section>
</template>

<script>
  import {
    calcCurrentStock,
    formatStorageType,
    stockStatusText,
    stockTagType
  } from '../utils';

  export default {
    name: 'RelationTable',
    props: {
      queryMode: { type: String, default: 'department' },
      loading: Boolean,
      tableData: { type: Array, default: () => [] },
      total: { type: Number, default: 0 },
      page: { type: Number, default: 1 },
      pageSize: { type: Number, default: 20 },
      pageSizes: { type: Array, default: () => [20, 50, 100] }
    },
    computed: {
      title() {
        return this.queryMode === 'department' ? '科室库存品种' : '品种分布科室';
      }
    },
    methods: {
      calcCurrentStock,
      formatStorageType,
      stockStatusText,
      stockTagType
    }
  };
</script>

<style lang="scss" scoped>
  .relation-table {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .relation-table__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .relation-table__count {
    color: #909399;
    font-weight: normal;
  }

  .relation-table__qty {
    color: #303133;
    font-weight: 600;
  }

  .relation-table__pager {
    margin: 10px 0 0;
    padding: 0 2px;
    text-align: right;
  }
</style>
