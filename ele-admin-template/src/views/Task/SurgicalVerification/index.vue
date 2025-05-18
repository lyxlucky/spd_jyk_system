<template>
  <div class="ele-box">
    <el-row :gutter="0" type="flex" style="height: 100%">
      <el-col :span="8">
        <AdvanceReceiptNumberTable
          @getCurrent="getCurrent"
        ></AdvanceReceiptNumberTable>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="0" style="height: 50%">
          <el-col :span="24" style="height: 100%">
            <AdvanceReceiptNumberDelTable
              :ApplyTempTableData="ApplyTempTableData"
              @selectionData="selectionData"
            >
            </AdvanceReceiptNumberDelTable>
          </el-col>
        </el-row>
        <el-row :gutter="0" style="height: 50%">
          <el-col :span="24" style="height: 100%">
            <ConsumeablesUsageDetail :masterCurrentData="ApplyTempTableData">
            </ConsumeablesUsageDetail>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
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
<style scoped lang="scss">
  // @import '@/styles/common.scss';
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
