<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-aside width="400px" style="margin: 20px 0px 0px 20px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申领模板列表</span>
          </div>
          <ApplyTempTable @getCurrent="getCurrent"></ApplyTempTable>
        </el-card>
      </el-aside>
      <el-container>
        <el-main width="1000px">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>申领模板列表品种</span>
            </div>
            <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确认申领</el-button>
            <ApplyTempDataTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData"></ApplyTempDataTable>
          </el-card>
        </el-main>
        <!-- <el-footer>
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer> -->
      </el-container>
    </el-container>
    <!-- </el-card> -->

    <!-- <el-container>
      <el-header height="300" >
         <el-card shadow="always" >
          <div slot="header" class="clearfix">
            <span>申领模板列表</span>
          </div>
          <ApplyTempTable @getCurrent="getCurrent"></ApplyTempTable>
        </el-card>
      </el-header>
      <el-main>
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申领模板列表品种</span>
          </div>
           <ApplyTempDataTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData"></ApplyTempDataTable>
        </el-card>
      </el-main>
      <el-footer style="display: flex;justify-content: center;height:''">
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer>
    </el-container> -->
  </div>
</template>

<script>
import ApplyTempTable from './components/ApplyTempTable.vue';
import ApplyTempDataTable from './components/ApplyTempDataTable';
import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTemp',
  props: ['IntroduceUserDefinedTempSearch'],
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
    },
    addTempVar() {
      // console.log(this.IntroduceUserDefinedTempSearch);
      // console.log(this.ApplyTempDataSelData)
      const loading = this.$messageLoading('添加中...');
      var json = [];
      this.ApplyTempDataSelData.forEach((element) => {
        var data = {};
        data.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
        data.ENABLE = element.VAR_ENABLE;
        data.VARIETIE_CODE = element.VarID;
        data.VARIETIE_NAME = element.VarName;
        data.SPECIFICATION_OR_TYPE = element.GG;
        data.UNIT = element.Unit;
        data.MANUFACTURING_ENT_NAME = element.Manufacturing;
        data.AUTH = element.AUTH;
        data.APPLY_QTY = element.TempletQty;
        json.push(data);
      });
      KeeptListDeta(json)
        .then((res) => {
          console.log(res);
          this.$message.success('添加成功');
          loading.close();
          this.$emit('ApplyTempPageChange', false);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err);
          loading.close();
        });
      console.log(json);
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
