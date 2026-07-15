<template>
  <div class="material-location-panel">
    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>耗材定位结果</span>
        <span class="selected-text">{{ selectedMaterialText }}</span>
      </div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="summaryTable"
          class="data-table"
          size="mini"
          border
          stripe
          highlight-current-row
          :toolbar="false"
          :header-overflow-hidden="false"
          height="310"
          :columns="summaryColumns"
          :datasource="summaryDatasource"
          :page-size="30"
          :page-sizes="[30, 50, 100, 150, 200, 300]"
          cache-key="WarehouseAreaThreeInventoryMaterialLocationSummary"
          @row-click="selectMaterial"
        >
          <template v-slot:locationSummaryAction="{ row }">
            <el-button type="text" size="mini" @click="selectMaterial(row)">查看分布</el-button>
          </template>
        </ele-pro-table>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>库房/科室分布</span>
        <span class="selected-text">{{ selectedMaterialText }}</span>
      </div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="detailTable"
          class="data-table"
          size="mini"
          border
          stripe
          :toolbar="false"
          :header-overflow-hidden="false"
          height="280"
          :columns="detailColumns"
          :datasource="detailDatasource"
          :page-size="30"
          :page-sizes="[30, 50, 100, 150, 200, 300]"
          cache-key="WarehouseAreaThreeInventoryMaterialLocationDetail"
        >
          <template v-slot:locationDetailAction="{ row }">
            <el-button type="text" size="mini" @click="openWarehouse(row)">库房视图</el-button>
            <!-- <el-divider direction="vertical" /> -->
            <el-button type="text" size="mini" @click="openDetail(row)">明细</el-button>
          </template>
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import {
  getMaterialLocationDetailColumns,
  getMaterialLocationSummaryColumns
} from '../columns';
import {
  getMaterialLocationDetail,
  getMaterialLocationSummary
} from '@/api/Inventory/WarehouseAreaThreeInventory';

export default {
  name: 'MaterialLocationPanel',
  data() {
    return {
      currentWhere: {},
      selectedMaterial: null,
      summaryColumns: getMaterialLocationSummaryColumns(),
      detailColumns: getMaterialLocationDetailColumns()
    };
  },
  computed: {
    selectedMaterialText() {
      if (!this.selectedMaterial?.CHARGE_CODE) return '请先选择上方耗材';
      const name = this.selectedMaterial.VARIETIE_NAME || '';
      return `${this.selectedMaterial.CHARGE_CODE} ${name}`.trim();
    }
  },
  methods: {
    reload(where) {
      this.currentWhere = { ...(where || {}) };
      this.selectedMaterial = null;
      this.$nextTick(() => {
        this.$refs.summaryTable && this.$refs.summaryTable.reload({ page: 1 });
        this.$refs.detailTable && this.$refs.detailTable.reload({ page: 1 });
      });
    },
    async summaryDatasource({ page, limit }) {
      try {
        const res = await getMaterialLocationSummary(this.currentWhere, page || 1, limit || 30);
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询耗材定位结果失败');
        return { count: 0, list: [] };
      }
    },
    async detailDatasource({ page, limit }) {
      if (!this.selectedMaterial?.CHARGE_CODE) return { count: 0, list: [] };
      try {
        const res = await getMaterialLocationDetail(
          { ...this.currentWhere, CHARGE_CODE: this.selectedMaterial.CHARGE_CODE },
          page || 1,
          limit || 30
        );
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询耗材分布失败');
        return { count: 0, list: [] };
      }
    },
    selectMaterial(row) {
      if (!row?.CHARGE_CODE) return;
      this.selectedMaterial = row;
      this.$nextTick(() => this.$refs.detailTable && this.$refs.detailTable.reload({ page: 1 }));
    },
    openWarehouse(row) {
      if (!row?.AREA_CODE) {
        Message.warning('该记录缺少库房/库区编码，无法跳转');
        return;
      }
      this.$emit('locate', row);
    },
    openDetail(row) {
      if (!row?.AREA_CODE) {
        Message.warning('该记录缺少库房/库区编码，无法查看流水');
        return;
      }
      this.$emit('detail', {
        ...this.currentWhere,
        AREA_CODE: row.AREA_CODE,
        DEPT_TWO_CODE: row.DEPT_TWO_CODE || '',
        CHARGE_CODE: this.selectedMaterial?.CHARGE_CODE || row.CHARGE_CODE || ''
      });
    }
  }
};
</script>

<style scoped>
.material-location-panel {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.spd-panel__head--split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.selected-text {
  color: #606266;
  font-size: 12px;
  font-weight: normal;
}

@media (max-width: 900px) {
  .spd-panel__head--split {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
