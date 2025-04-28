<template>
  <div class="ele-box">
    <el-row :gutter="0" type="flex" style="height: 100%">
      <el-col :span="8">
        <AdvanceReceiptNumberTable
          @getCurrent="getCurrent"
        ></AdvanceReceiptNumberTable>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="0">
          <el-col :span="24">
            <AdvanceReceiptNumberDelTable
              :ApplyTempTableData="ApplyTempTableData"
              @selectionData="selectionData"
            >
            </AdvanceReceiptNumberDelTable>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <ConsumeablesUsageDetail :masterCurrentData="ApplyTempTableData">
            </ConsumeablesUsageDetail>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>

  <!-- <el-container style="margin: 20px; gap: 20px">
      <el-aside width="500px">
        <el-card shadow="always" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>手术排期</span>
          </div>
          <AdvanceReceiptNumberTable
            @getCurrent="getCurrent"
          ></AdvanceReceiptNumberTable>
        </el-card>
      </el-aside>

      <el-main style="padding: 0; width: calc(100% - 500px - 20px)">
        <el-container direction="vertical" style="height: 100%; gap: 20px">
          <el-card shadow="always" style="margin-bottom: 0">
            <div slot="header" class="clearfix">
              <span>耗材确认明细</span>
            </div>
            <AdvanceReceiptNumberDelTable
              :ApplyTempTableData="ApplyTempTableData"
              @selectionData="selectionData"
            >
            </AdvanceReceiptNumberDelTable>
          </el-card>

          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>耗材消耗确认</span>
            </div>
            <ConsumeablesUsageDetail :masterCurrentData="ApplyTempTableData">
            </ConsumeablesUsageDetail>
          </el-card>
        </el-container>
      </el-main>
    </el-container> -->
</template>

<script>
  import ConsumeablesUsageDetail from './components/ConsumeablesUsageDetail.vue';
  import AdvanceReceiptNumberTable from './components/AdvanceReceiptNumberTable.vue';
  import AdvanceReceiptNumberDelTable from './components/AdvanceReceiptNumberDelTable';
  import VarietyConsumptionTable from './components/VarietyConsumptionTable';
  import UDIListTable from './components/UDIListTable';
  import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
  export default {
    name: 'ApplyTemp',
    props: ['IntroduceUserDefinedTempSearch'],
    components: {
      AdvanceReceiptNumberTable,
      AdvanceReceiptNumberDelTable,
      VarietyConsumptionTable,
      UDIListTable,
      ConsumeablesUsageDetail
    },
    data() {
      return {
        // 主表数据
        ApplyTempTableData: {},
        // 详情表选择数据
        ApplyTempDataSelData: [],
        // 品种消耗确认表
        VarietyTableData: []
      };
    },
    methods: {
      getCurrent(data) {
        this.ApplyTempTableData = data;
      },
      getVarietyCurrent(data) {
        this.VarietyTableData = data;
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
            this.$message.success('添加成功');
            loading.close();
            this.$emit('ApplyTempPageChange', false);
          })
          .catch((err) => {
            this.$message.error(err);
            loading.close();
          });
      },
      selectionData(data) {
        this.ApplyTempDataSelData = data;
      }
    },

    computed: {
      IsDisabled() {
        return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
      }
    },
    beforeDestroy() {
      this.$bus.$off('UdiScanDialogClosed');
    }
  };
</script>
<style scoped>
  .ele-box {
    height: 100%;
    overflow: hidden;
  }

  .el-row {
    margin: 0 !important;
  }

  .el-col {
    padding: 0 !important;
  }
</style>
