<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <el-container>
      <!-- <el-aside width="400px" style="margin: 20px 0px 0px 20px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>补货信息</span>
          </div>
          <ReplenishGoodsTable @getCurrent="getCurrent"></ReplenishGoodsTable>
        </el-card>
      </el-aside> -->
      <el-container>
        <el-main>
          <el-row :gutter="2">
            <el-col :span="6">
              <el-card shadow="always">
                <div slot="header" class="clearfix">
                  <span>补货信息</span>
                </div>
                <ReplenishGoodsTable @getCurrent="getCurrent"></ReplenishGoodsTable>
              </el-card>
            </el-col>
            <el-col :span="9">
              <el-card shadow="always">
                <div slot="header" class="clearfix">
                  <span>品种明细列表</span>
                </div>
                <DistributeDetailTable :ReplenishGoodData="ReplenishGoodData" @getVarCurrent="getVarCurrent"></DistributeDetailTable>
              </el-card>
            </el-col>
            <el-col :span="9">
              <el-card shadow="always">
                <div slot="header" class="clearfix">
                  <span>定数包明细列表</span>
                </div>
                <DefNoPkgDataTable :ReplenishGoodData="ReplenishGoodData" :DefNoPkgDataData="DefNoPkgDataData" @selectionData="selectionData"></DefNoPkgDataTable>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
        <el-footer>
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer>
      </el-container>
    </el-container>
    <!-- </el-card> -->

  </div>
</template>

<script>
import ReplenishGoodsTable from './components/ReplenishGoodsTable.vue';
import DefNoPkgDataTable from './components/DefNoPkgDataTable';
import DistributeDetailTable from './components/DistributeDetailTable';
import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTemp',
  props: ['IntroduceUserDefinedTempSearch'],
  components: {
    ReplenishGoodsTable,
    DefNoPkgDataTable,
    DistributeDetailTable
  },
  data() {
    return {
      // 主表数据
      ReplenishGoodData: {},
      DefNoPkgDataData: {},
      // 详情表选择数据
      ApplyTempDataSelData: []
    };
  },
  methods: {
    getCurrent(data) {
      this.ReplenishGoodData = data;
    },
    getVarCurrent(data) {
      this.DefNoPkgDataData = data;
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
