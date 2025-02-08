<template>
  <ele-modal :destroy-on-close="true" width="90%" height="60%" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="引用模板品种" @update:visible="updateVisible">
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-aside width="400px" style="margin: 20px 0px 0px 20px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申请模板列表</span>
          </div>
          <ApplyTempTable @getCurrent="getCurrent"></ApplyTempTable>
        </el-card>
      </el-aside>
      <el-container>
        <el-main width="1000px">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>申请模板列表品种</span>
            </div>
            <el-button type="primary" size="mini" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确认申请</el-button>
            <ApplyTempDataTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData"></ApplyTempDataTable>
          </el-card>
        </el-main>
        <!-- <el-footer>
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer> -->
      </el-container>
    </el-container>
    <!-- </el-card> -->
  </ele-modal>
</template>

<script>
import ApplyTempTable from './components/ApplyTempTable.vue';
import ApplyTempDataTable from './components/ApplyTempDataTable';
import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTemp',
  props: {
    IntroduceUserDefinedTempSearch:Object,
    visible: Boolean,
  },
  components: {
    ApplyTempTable,
    ApplyTempDataTable
  },
  data() {
    return {
      // 主表数据
      ApplyTempTableData: {},
      // 详情表选择数据
      ApplyTempDataSelData: []
    };
  },
  methods: {
    getCurrent(data) {
      this.ApplyTempTableData = data;
      console.log(data);
    },
    addTempVar() {
      // console.log(this.IntroduceUserDefinedTempSearch);
      // console.log(this.ApplyTempDataSelData)
      // const loading = this.$messageLoading('添加中...');
      console.log(this.ApplyTempTableData)
      
      // KeeptListDeta(json)
      //   .then((res) => {
      //     console.log(res);
      //     this.$message.success('添加成功');
      //     loading.close();
      //     this.$emit('ApplyTempPageChange', false);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     this.$message.error(err);
      //     loading.close();
      //   });
      // console.log(json);
    },
    selectionData(data) {
      this.ApplyTempDataSelData = data;
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
  },

  computed: {
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
    }
  }
};
</script>
