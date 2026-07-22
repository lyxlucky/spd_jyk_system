<template>
  <div class="ele-body spd-page dept-planned-delivery-new">
    <!-- 外层受限宽 + overflow-x，内层固定最小宽：布局层 overflow-x:hidden 时仍能出现横向滚动条 -->
    <div class="dept-planned-delivery-new__scroll">
      <div class="dept-planned-delivery-new__inner">
        <div class="spd-section page-section-main">
          <PlanTableTab
            :storage-id="storageId"
            :storage-list="storageList"
            @storage-change="onStorageChange"
            @reload-picking="reloadPicking"
            @plan-data-change="onPlanDataChange"
            @plan-row-select="onPlanRowSelect"
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
      // 换库区时清空品种筛选，重新拉全量备货单
      this.reloadPicking('');
      this.$refs.pickingRight?.clear();
    },
    reloadPicking(keyword) {
      this.$refs.pickingLeft?.reloadByKeyword(keyword);
    },
    /** 计划表查询完成：清空旧联动（无数据时尤其要把旧备货单清掉） */
    onPlanDataChange() {
      this.reloadPicking('');
      this.$refs.pickingRight?.clear();
    },
    /** 点击科室计划行 → 按当前行品种编码刷新备货单关键字与列表 */
    onPlanRowSelect(row) {
      const code = row?.Varietie_Code_New || '';
      this.reloadPicking(code);
      this.$refs.pickingRight?.clear();
    },
    onSelectPlan(row) {
      this.$refs.pickingRight?.loadByPlan(row?.Stock_Up_Plan_No);
    }
  }
};
</script>

<style lang="scss" scoped>
.dept-planned-delivery-new {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  /* 占满布局内容区，让横向滚动条贴在可视区域底部，而不是整页最下方 */
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* 覆盖 spd-panel 默认 overflow:hidden，避免裁掉横向滚动 */
  :deep(.spd-panel) {
    overflow: visible;
  }
}

.dept-planned-delivery-new__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.dept-planned-delivery-new__inner {
  min-width: 1280px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-section-main {
  padding: 12px;
  border: none;
  background: transparent;
}
.page-section-picking {
  margin-top: 0;
}
</style>

