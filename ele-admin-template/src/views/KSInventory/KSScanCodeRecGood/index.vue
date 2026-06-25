<template>
  <div class="ele-body spd-page ks-scan-code-rec-good-page">
    <!-- <el-aside width="400px" style="margin: 20px 0px 0px 20px;">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <span>补货信息</span>
        </div>
        <ReplenishGoodsTable @getCurrent="getCurrent"></ReplenishGoodsTable>
      </el-card>
    </el-aside> -->
    <el-container class="ks-scan-code-rec-good-container">
      <el-main class="ks-scan-code-rec-good-main">
        <el-row :gutter="8" class="ks-scan-code-rec-good-row">
          <el-col :span="6">
            <el-card shadow="never" class="ks-scan-code-rec-good-card">
              <div slot="header" class="clearfix">
                <span>补货信息</span>
              </div>
              <ReplenishGoodsTable @getCurrent="getCurrent" />
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card shadow="never" class="ks-scan-code-rec-good-card">
              <div slot="header" class="clearfix">
                <span>品种明细列表</span>
              </div>
              <DistributeDetailTable
                :ReplenishGoodData="ReplenishGoodData"
                @getVarCurrent="getVarCurrent"
              />
            </el-card>
          </el-col>
          <el-col :span="7">
            <el-card shadow="never" class="ks-scan-code-rec-good-card">
              <div slot="header" class="clearfix">
                <span>定数包明细列表</span>
              </div>
              <DefNoPkgDataTable
                :ReplenishGoodData="ReplenishGoodData"
                :DefNoPkgDataData="DefNoPkgDataData"
                @selectionData="selectionData"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="ks-scan-code-rec-good-footer">
        <el-button
          type="primary"
          size="mini"
          :style="{ display: IsDisabled ? 'none' : '' }"
          @click="addTempVar"
        >
          确定
        </el-button>
      </el-footer>
    </el-container>
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
    computed: {
      IsDisabled() {
        return this.IntroduceUserDefinedTempSearch == undefined;
      }
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
    }
  };
</script>

<style scoped lang="scss">
.ks-scan-code-rec-good-card :deep(.el-card__body) {
  padding: 8px;
}

.ks-scan-code-rec-good-card :deep(.el-card__header) {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
}

.ks-scan-code-rec-good-main {
  padding: 10px 10px 0;
  overflow: visible;
}

.ks-scan-code-rec-good-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: auto !important;
  padding: 8px 12px 10px;
}

.ks-scan-code-rec-good-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
