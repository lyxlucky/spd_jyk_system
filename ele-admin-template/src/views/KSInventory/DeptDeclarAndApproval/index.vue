<template>
  <div>
    <el-container>
      <el-header height="300">
        <el-card shadow="always">
          <DeptDeclarAndApprovalTopTable @getCurrent="getCurrent" @TopTableSelection="TopTableSelection" :IsReload="IsReloadTag"></DeptDeclarAndApprovalTopTable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
          <DeptDeclarAndApprovalBottomTable :TopTableSelection="TopTableSelections" :DeptDeclarAndApprovalTopTableCurrent="DeptDeclarAndApprovalTopTableCurrent" @clickReload="clickReload" v-if="isActive">
          </DeptDeclarAndApprovalBottomTable>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DeptDeclarAndApprovalTopTable from './components/DeptDeclarAndApprovalTopTable';
import DeptDeclarAndApprovalBottomTable from './components/DeptDeclarAndApprovalBottomTable';

export default {
  name: 'DeptDeclarAndApprovalTable',
  components: {
    DeptDeclarAndApprovalTopTable,
    DeptDeclarAndApprovalBottomTable
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      DeptDeclarAndApprovalTopTableCurrent: {},
      isActive: true,
      IsReloadTag: false,
      TopTableSelections:[]
    };
  },
  methods: {
    getCurrent(data) {
      this.DeptDeclarAndApprovalTopTableCurrent = data;
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
