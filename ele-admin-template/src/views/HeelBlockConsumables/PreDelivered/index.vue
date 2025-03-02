<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-aside width="600px" style="margin: 20px 0px 0px 20px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>预收货单号列表</span>
          </div>
          <PreDeliveredTable @getCurrent="getCurrent"></PreDeliveredTable>
        </el-card>
      </el-aside>
      <el-container>
        <el-main width="1000px">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>预送货品种明细</span>
            </div>
            <PreDeliveredDelTable :PreDeliveredTableData="PreDeliveredTableData" @selectionData="selectionData"></PreDeliveredDelTable>
          </el-card>
        </el-main>
        <!-- <el-footer>
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer> -->
      </el-container>
    </el-container>
    <!-- </el-card> -->
  </div>
</template>

<script>
import PreDeliveredTable from './components/PreDeliveredTable.vue';
import PreDeliveredDelTable from './components/PreDeliveredDelTable';
import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTemp',
  props: ['IntroduceUserDefinedTempSearch'],
  components: {
    PreDeliveredTable,
    PreDeliveredDelTable
  },
  data() {
    return {
      // 主表数据
      PreDeliveredTableData: {},
      // 详情表选择数据
      ApplyTempDataSelData: []
    };
  },
  methods: {
    getCurrent(data) {
      this.PreDeliveredTableData = data;
    },
    selectionData(data) {
      this.ApplyTempDataSelData = data;
    }
  },

  computed: {
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
    }
  }
};
</script>
