<template>
  <section class="dimension-selector spd-panel spd-table-panel">
    <div class="spd-panel__head dimension-selector__head">
      <span>{{ title }}</span>
      <span class="dimension-selector__count">{{ total }} 项</span>
    </div>
    <div class="spd-table-panel__wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        size="mini"
        highlight-current-row
        height="calc(100vh - 332px)"
        class="style-table"
        :row-class-name="rowClassName"
        @row-click="$emit('select', $event)"
      >
        <el-table-column prop="NAME" :label="nameLabel" min-width="130" align="left" show-overflow-tooltip />
        <el-table-column v-if="mode === 'department'" prop="CODE" label="科室编码" width="104" align="center" show-overflow-tooltip />
        <el-table-column v-else prop="VARIETIE_CODE_NEW" label="品种编码" width="104" align="center" show-overflow-tooltip />
        <el-table-column label="关联数" width="70" align="right">
          <template slot-scope="{ row }">{{ row.RELATION_COUNT || 0 }}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="dimension-selector__pager"
      background
      small
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="$emit('page-change', $event)"
    />
  </section>
</template>

<script>
  export default {
    name: 'DimensionSelector',
    props: {
      mode: { type: String, default: 'department' },
      loading: Boolean,
      tableData: { type: Array, default: () => [] },
      total: { type: Number, default: 0 },
      page: { type: Number, default: 1 },
      pageSize: { type: Number, default: 20 },
      selectedCode: { type: String, default: '' }
    },
    computed: {
      title() {
        return this.mode === 'department' ? '科室列表' : '品种列表';
      },
      nameLabel() {
        return this.mode === 'department' ? '科室名称' : '品种名称';
      }
    },
    methods: {
      rowClassName({ row }) {
        return row.CODE === this.selectedCode ? 'dimension-selector__row--selected' : '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dimension-selector {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .dimension-selector__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dimension-selector__count {
    color: #909399;
    font-weight: normal;
  }

  .dimension-selector__pager {
    margin: 10px 0 0;
    text-align: center;
  }

  :deep(.dimension-selector__row--selected td) {
    background: #ecf5ff !important;
  }
</style>
