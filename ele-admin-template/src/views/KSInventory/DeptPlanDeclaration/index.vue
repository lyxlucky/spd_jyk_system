<template>
  <div>
    <el-container>
      <el-header height="300">
        <el-card shadow="always">
          <DeptPlanDeclarationTopTable @getCurrent="getCurrent" @TopTableSelection="TopTableSelection" :IsReload="IsReloadTag"></DeptPlanDeclarationTopTable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 3px">
        <el-card shadow="always">
          <DeptPlanDeclarationBottomTable :TopTableSelection="TopTableSelections" :DeptPlanDeclarationTopTableCurrent="DeptPlanDeclarationTopTableCurrent" @clickReload="clickReload" v-if="isActive">
          </DeptPlanDeclarationBottomTable>
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
      TopTableSelections:[]
    };
  },
  methods: {
    getCurrent(data) {
      this.DeptPlanDeclarationTopTableCurrent = data;
    },
    TopTableSelection(data){
      this.TopTableSelections = data;
    },
    reload() {
      this.isActive = false;
      this.$nextTick(() => {
        this.isActive = true;
      });
    },
    clickReload(data){
      this.IsReloadTag = data
    }
  },
  watch: {
    IsReload() {}
  }
};
</script>
