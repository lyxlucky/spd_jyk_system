<template>
  <div>
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-aside width="500px" style="margin: 00px 0px 0px 0px;">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>预收货单号列表</span>
          </div>
          <AdvanceReceiptNumberTable @getCurrent="getCurrent"></AdvanceReceiptNumberTable>
        </el-card>
      </el-aside>
      <el-container>
        <el-main width="1000px" style="margin: 00px 0px 0px 0px; padding: 1px;">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>预送货品种明细</span>
            </div>
            <AdvanceReceiptNumberDelTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData">
            </AdvanceReceiptNumberDelTable>
          </el-card>

          <el-card shadow="always" style="margin: 00px 0px 0px 0px;padding: 1px;">
            <div slot="header" class="clearfix">
              <span>品种消耗确认表</span>
            </div>
            <VarietyConsumptionTable @getVarietyCurrent="getVarietyCurrent" :ApplyTempTableData="ApplyTempTableData" />
          </el-card>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
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
  },
  data() {
    return {
      // 主表数据
      ApplyTempTableData: {},
      // 详情表选择数据
      ApplyTempDataSelData: [],
      // 品种消耗确认表 
      VarietyTableData: [],
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
