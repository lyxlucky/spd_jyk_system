<template>
  <div class="ele-body spd-page dept-plan-declaration-page">
    <el-container class="dept-plan-declaration-container">
      <el-header height="auto" class="dept-plan-declaration-header">
        <el-card shadow="never" class="dept-plan-declaration-card">
          <DeptPlanDeclarationTopTable
            @getCurrent="getCurrent"
            @TopTableSelection="TopTableSelection"
            :IsReload="IsReloadTag"
          />
        </el-card>
      </el-header>
      <el-main class="dept-plan-declaration-main">
        <el-card shadow="never" class="dept-plan-declaration-card">
          <DeptPlanDeclarationBottomTable
            :TopTableSelection="TopTableSelections"
            :DeptPlanDeclarationTopTableCurrent="DeptPlanDeclarationTopTableCurrent"
            @clickReload="clickReload"
            v-if="isActive"
          />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DeptPlanDeclarationTopTable from './components/DeptPlanDeclarationTopTable';
import DeptPlanDeclarationBottomTable from './components/DeptPlanDeclarationBottomTable';

export default {
  name: 'DeptPlanDeclarationTable',
  components: {
    DeptPlanDeclarationTopTable,
    DeptPlanDeclarationBottomTable
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      DeptPlanDeclarationTopTableCurrent: {},
      isActive: true,
      IsReloadTag: false,
      TopTableSelections: []
    };
  },
  methods: {
    getCurrent(data) {
      this.DeptPlanDeclarationTopTableCurrent = data;
    },
    TopTableSelection(data) {
      this.TopTableSelections = data;
    },
    reload() {
      this.isActive = false;
      this.$nextTick(() => {
        this.isActive = true;
      });
    },
    clickReload(data) {
      this.IsReloadTag = data;
    }
  },
  watch: {
    IsReload() {}
  }
};
</script>

<style scoped lang="scss">
.dept-plan-declaration-card :deep(.el-card__body) {
  padding: 10px;
}

.dept-plan-declaration-header {
  padding: 0;
}

.dept-plan-declaration-main {
  padding: 4px 0 10px;
  overflow: visible;
}

.dept-plan-declaration-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
