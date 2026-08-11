<template>
  <div class="ele-body spd-page dept-planned-delivery-new">
    <!-- 外层受限宽 + overflow-x，内层固定最小宽：布局层 overflow-x:hidden 时仍能出现横向滚动条 -->
    <div ref="pageScroll" class="dept-planned-delivery-new__scroll">
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
import { setPageTab, getRouteTabKey } from '@/utils/page-tab-util';
import PlanTableTab from './components/PlanTableTab.vue';
import PickingLeftTable from './components/PickingLeftTable.vue';
import PickingRightTable from './components/PickingRightTable.vue';

export default {
  // keep-alive 按组件 name 缓存；缺 name / 未写入页签 components 时切换菜单会销毁重建
  name: 'DeptPlannedDeliveryNew',
  components: {
    PlanTableTab,
    PickingLeftTable,
    PickingRightTable
  },
  data() {
    return {
      storageList: [],
      storageId: '',
      pageScrollTop: 0,
      pageScrollLeft: 0
    };
  },
  mounted() {
    const name = this.$options.name;
    if (name) {
      setPageTab({ key: getRouteTabKey(), components: [name] });
    }
    this.loadStorage();
  },
  activated() {
    this.$nextTick(() => {
      const el = this.$refs.pageScroll;
      if (!el) return;
      el.scrollTop = this.pageScrollTop || 0;
      el.scrollLeft = this.pageScrollLeft || 0;
    });
  },
  deactivated() {
    const el = this.$refs.pageScroll;
    if (!el) return;
    this.pageScrollTop = el.scrollTop || 0;
    this.pageScrollLeft = el.scrollLeft || 0;
  },
  methods: {
    async loadStorage() {
      // 已加载过则不重复请求（keep-alive 切回时 mounted 不会再跑；防御性保留）
      if (this.storageList.length && this.storageId) return;
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
  /* 覆盖全局 .spd-page min-width，避免宽表把整页撑出右侧大空白 */
  min-width: 0 !important;
  height: 100%;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.spd-panel) {
    overflow: visible;
  }

  :deep(.el-col) {
    min-width: 0;
  }

  :deep(.spd-sub-panel) {
    max-width: 100%;
    min-width: 0;
  }

  /* 备货单筛选/按钮按面板宽换行，不跟宽表一起横向拉长 */
  :deep(.filter-row.el-form--inline) {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  :deep(.filter-row .el-form-item) {
    flex-shrink: 0;
    margin-bottom: 6px;
  }

  :deep(.spd-toolbar),
  :deep(.spd-filter-bar) {
    width: 100%;
    max-width: 100%;
  }

  /* 表格在各自容器内横滚 */
  :deep(.ele-pro-table),
  :deep(.picking-table-wrap),
  :deep(.spd-table-panel__wrap) {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  :deep(.ele-pro-table .el-table) {
    width: max-content;
    min-width: 100%;
  }
}

.dept-planned-delivery-new__scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.dept-planned-delivery-new__inner {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-section-main {
  padding: 12px;
  border: none;
  background: transparent;
  max-width: 100%;
  min-width: 0;
}
.page-section-picking {
  margin-top: 0;
  max-width: 100%;
  min-width: 0;
}
</style>

