<template>
  <div>
    <!-- <el-card shadow="always"> -->
      <el-container>
        <el-aside width="600px"  style="margin: 20px 0px 0px 20px;">
          <el-card shadow="always" >
            <div slot="header" class="clearfix">
              <span>申领模板列表</span>
            </div>
            <ApplyTempTable @getCurrent="getCurrent"></ApplyTempTable>
          </el-card>
        </el-aside>
        <el-main>
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>申领模板列表品种</span>
            </div>
            <ApplyTempDataTable :ApplyTempTableData="ApplyTempTableData"></ApplyTempDataTable>
          </el-card>
        </el-main>
      </el-container>
    <!-- </el-card> -->
  </div>
</template>

<script>
import ApplyTempTable from './components/ApplyTempTable.vue';
import ApplyTempDataTable from './components/ApplyTempDataTable';

export default {
  name: 'ApplyTemp',
  components: {
    ApplyTempTable,
    ApplyTempDataTable
  },
  data() {
    return {
      ApplyTempTableData: {}
    };
  },
  methods: {
    getCurrent(data){
      this.ApplyTempTableData = data;
    }
  }
};
</script>
