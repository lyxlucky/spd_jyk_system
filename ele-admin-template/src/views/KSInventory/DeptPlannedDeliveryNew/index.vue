<template>
  <div class="ele-body spd-page dept-planned-delivery-new">
    <div class="spd-section page-section-main">
      <PlanTableTab
        :storage-id="storageId"
        :storage-list="storageList"
        @storage-change="onStorageChange"
        @reload-picking="reloadPicking"
      />
    </div>

    <div class="spd-section page-section-picking">
      <div class="spd-section__head">备货单</div>
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="spd-sub-panel">
            <PickingLeftTable
              ref="pickingLeft"
              :storage-id="storageId"
              @select-plan="onSelectPlan"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="spd-sub-panel">
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
.page-section-main {
  padding: 12px;
  border: none;
  background: transparent;
}
.page-section-picking {
  margin-top: 0;
}
</style>

