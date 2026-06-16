<template>
  <div class="ele-body dept-planned-delivery-new">
    <div class="page-section page-section-main">
      <PlanTableTab
        :storage-id="storageId"
        :storage-list="storageList"
        @storage-change="onStorageChange"
        @reload-picking="reloadPicking"
      />
    </div>

    <div class="page-section page-section-picking">
      <div class="section-head">备货单</div>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="picking-panel">
            <PickingLeftTable
              ref="pickingLeft"
              :storage-id="storageId"
              @select-plan="onSelectPlan"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="picking-panel">
            <PickingRightTable ref="pickingRight" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSTORAGE } from '@/api/login';
import PlanTableTab from './components/PlanTableTab.vue';
import PickingLeftTable from './components/PickingLeftTable.vue';
import PickingRightTable from './components/PickingRightTable.vue';

export default {
  name: 'DeptPlannedDeliveryNew',
  components: {
    PlanTableTab,
    PickingLeftTable,
    PickingRightTable
  },
  data() {
    return {
      storageList: [],
      storageId: ''
    };
  },
  mounted() {
    this.loadStorage();
  },
  methods: {
    async loadStorage() {
      try {
        const res = await getSTORAGE();
        this.storageList = res.result || [];
        if (this.storageList.length && !this.storageId) {
          this.storageId = String(this.storageList[0].ID);
        }
        this.$nextTick(() => this.reloadPicking());
      } catch (e) {
        this.$message.error(e.message || '加载库区失败');
      }
    },
    onStorageChange(id) {
      this.storageId = id;
      this.reloadPicking();
    },
    reloadPicking() {
      this.$refs.pickingLeft?.reload();
    },
    onSelectPlan(row) {
      this.$refs.pickingRight?.loadByPlan(row?.Stock_Up_Plan_No);
    }
  }
};
</script>

<style lang="scss" scoped>
.dept-planned-delivery-new {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 120px);
}

.page-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
}

.page-section-main {
  padding: 12px;
  flex: 1;
}

.page-section-picking {
  padding: 0 12px 12px;
}

.section-head {
  padding: 10px 12px;
  margin: 0 -12px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.picking-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background: #fafbfc;
  min-height: 320px;
}

.dept-planned-delivery-new :deep(.el-table th > .cell) {
  white-space: nowrap;
}
.dept-planned-delivery-new :deep(.ele-pro-table .el-table),
.dept-planned-delivery-new :deep(.data-table .el-table) {
  width: max-content;
  min-width: 100%;
}
.dept-planned-delivery-new :deep(.dpd-checkbox-col .cell),
.dept-planned-delivery-new :deep(.el-table-column--selection .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
.dept-planned-delivery-new :deep(.el-table-column--selection .cell .el-checkbox) {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}
</style>
