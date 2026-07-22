<template>
  <main class="ele-body spd-page third-stock-panorama">
    <el-card shadow="never" class="third-stock-panorama__card">
      <!-- <div class="third-stock-panorama__titlebar">
        <h2>三级库库存全景</h2>
      </div> -->

      <PanoramaSearch
        ref="search"
        :query-mode="queryMode"
        :loading="dimensionLoading"
        @search="reloadDimensions"
        @reset="reloadDimensions"
        @mode-change="onModeChange"
      />

      <div class="third-stock-panorama__workspace">
        <DimensionSelector
          :mode="queryMode"
          :loading="dimensionLoading"
          :table-data="dimensionData"
          :total="dimensionTotal"
          :page="dimensionPage"
          :page-size="dimensionPageSize"
          :selected-code="selectedDimension?.CODE || ''"
          @select="selectDimension"
          @page-change="loadDimensions"
        />

        <section class="third-stock-panorama__detail">
          <div v-if="!selectedDimension" class="third-stock-panorama__empty">
            <span>{{ queryMode === 'department' ? '未选择科室' : '未选择品种' }}</span>
          </div>
          <template v-else>
            <div class="third-stock-panorama__selection">
              <div class="third-stock-panorama__selection-content">
                <span class="third-stock-panorama__selection-label">
                  {{ queryMode === 'department' ? '已选科室' : '已选品种' }}
                </span>
                <strong>{{ selectedDimension.NAME || '-' }}</strong>
                <span>{{ selectedDimension.CODE || '-' }}</span>
              </div>
              <el-button
                type="text"
                icon="el-icon-close"
                title="清除当前选择"
                aria-label="清除当前选择"
                @click="clearDimension"
              />
            </div>

            <RelationTable
              :query-mode="queryMode"
              :loading="relationLoading"
              :table-data="relationData"
              :total="relationTotal"
              :page="relationPage"
              :page-size="relationPageSize"
              :page-sizes="relationPageSizes"
              @select="selectRelation"
              @flow="openFlowDrawer"
              @page-change="loadRelations"
              @size-change="onRelationPageSizeChange"
            />
          </template>
        </section>
      </div>
    </el-card>

    <FlowDrawer :visible.sync="flowDrawerVisible" :row="selectedRelation || {}" />
  </main>
</template>

<script>
  import {
    getThirdStockDimensionOptions,
    getThirdStockInfo
  } from '@/api/Inventory/ThreeLevelDbBD';
  import PanoramaSearch from './components/PanoramaSearch.vue';
  import DimensionSelector from './components/DimensionSelector.vue';
  import RelationTable from './components/RelationTable.vue';
  import FlowDrawer from './components/FlowDrawer.vue';
  import { buildRelationWhere, isCurrentRequest } from './utils';

  export default {
    name: 'ThirdStockPanorama',
    components: {
      PanoramaSearch,
      DimensionSelector,
      RelationTable,
      FlowDrawer
    },
    data() {
      return {
        queryMode: 'department',
        dimensionLoading: false,
        dimensionPage: 1,
        dimensionPageSize: 20,
        dimensionTotal: 0,
        dimensionData: [],
        dimensionRequestId: 0,
        selectedDimension: null,
        relationLoading: false,
        relationPage: 1,
        relationPageSize: 20,
        relationPageSizes: [20, 50, 100, 9999999],
        relationTotal: 0,
        relationData: [],
        relationRequestId: 0,
        selectedRelation: null,
        flowDrawerVisible: false
      };
    },
    mounted() {
      this.loadDimensions(1);
    },
    methods: {
      buildRelationWhere,
      isCurrentRequest,
      getWhere() {
        return this.$refs.search?.getWhere() || {};
      },
      async loadDimensions(page = this.dimensionPage) {
        this.dimensionPage = page;
        this.clearDimension();
        this.dimensionLoading = true;
        const requestId = ++this.dimensionRequestId;
        const requestMode = this.queryMode;
        const where = this.getWhere();
        try {
          const res = await getThirdStockDimensionOptions({
            page: this.dimensionPage,
            limit: this.dimensionPageSize,
            dimension: requestMode,
            where
          });
          if (!this.isCurrentRequest({
            requestId,
            currentRequestId: this.dimensionRequestId,
            requestMode,
            currentMode: this.queryMode,
            requestDimensionCode: '',
            currentDimensionCode: ''
          })) return;
          this.dimensionData = res.data || [];
          this.dimensionTotal = res.total || 0;
        } catch (e) {
          if (requestId !== this.dimensionRequestId) return;
          this.dimensionData = [];
          this.dimensionTotal = 0;
          this.$message.error(e || '查询主维度列表失败');
        } finally {
          if (requestId === this.dimensionRequestId) {
            this.dimensionLoading = false;
          }
        }
      },
      reloadDimensions() {
        this.loadDimensions(1);
      },
      onModeChange(value) {
        this.queryMode = value;
        this.reloadDimensions();
      },
      selectDimension(row) {
        this.selectedDimension = row;
        this.selectedRelation = null;
        this.relationData = [];
        this.relationTotal = 0;
        this.loadRelations(1);
      },
      clearDimension() {
        this.relationRequestId += 1;
        this.selectedDimension = null;
        this.selectedRelation = null;
        this.relationData = [];
        this.relationTotal = 0;
        this.relationPage = 1;
      },
      async loadRelations(page = this.relationPage) {
        if (!this.selectedDimension) return;
        this.relationPage = page;
        this.relationLoading = true;
        const requestId = ++this.relationRequestId;
        const requestMode = this.queryMode;
        const requestDimensionCode = this.selectedDimension.CODE || '';
        const where = this.buildRelationWhere(
          requestMode,
          this.selectedDimension,
          this.getWhere()
        );
        try {
          const res = await getThirdStockInfo({
            page: this.relationPage,
            limit: this.relationPageSize,
            queryMode: requestMode,
            where
          });
          if (!this.isCurrentRequest({
            requestId,
            currentRequestId: this.relationRequestId,
            requestMode,
            currentMode: this.queryMode,
            requestDimensionCode,
            currentDimensionCode: this.selectedDimension?.CODE || ''
          })) return;
          this.relationData = res.data || [];
          this.relationTotal = res.total || 0;
          this.selectedRelation = null;
        } catch (e) {
          if (requestId !== this.relationRequestId) return;
          this.relationData = [];
          this.relationTotal = 0;
          this.selectedRelation = null;
          this.$message.error(e || '查询关联库存失败');
        } finally {
          if (requestId === this.relationRequestId) {
            this.relationLoading = false;
          }
        }
      },
      onRelationPageSizeChange(size) {
        this.relationPageSize = size;
        this.loadRelations(1);
      },
      selectRelation(row) {
        this.selectedRelation = row;
      },
      openFlowDrawer(row) {
        this.selectedRelation = row;
        this.flowDrawerVisible = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/common';

  .third-stock-panorama {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .third-stock-panorama__card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      min-height: 0;
      height: 100%;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  .third-stock-panorama__titlebar {
    min-height: 34px;
    display: flex;
    align-items: center;
    padding: 0 2px;
    border-bottom: 1px solid #ebeef5;
  }

  .third-stock-panorama__titlebar h2 {
    margin: 0;
    color: #303133;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  .third-stock-panorama__workspace {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(280px, 25%) minmax(0, 1fr);
    gap: 10px;
  }

  .third-stock-panorama__detail {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .third-stock-panorama__empty {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ebeef5;
    color: #909399;
    font-size: 14px;
  }

  .third-stock-panorama__selection {
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 10px;
    border: 1px solid #d9ecff;
    background: #f0f9ff;
  }

  .third-stock-panorama__selection-content {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #606266;
    font-size: 13px;
  }

  .third-stock-panorama__selection-content strong {
    overflow: hidden;
    color: #303133;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .third-stock-panorama__selection-label {
    color: #409eff;
  }

  @media screen and (max-width: 1000px) {
    .third-stock-panorama__workspace {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(240px, 34%) minmax(0, 1fr);
    }
  }
</style>
