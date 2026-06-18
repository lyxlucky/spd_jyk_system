<template>
  <div class="ele-body spd-page master-base-data-page">
    <div class="master-base-data-layout">
      <el-card shadow="always" class="master-card master-card-left">
        <div slot="header" class="clearfix">
          <span>医保审核单</span>
        </div>
        <ApplyTempTable @getCurrent="getCurrent" />
      </el-card>

      <el-card shadow="always" class="master-card master-card-right">
        <div slot="header" class="clearfix">
          <span>医保审核详情</span>
        </div>
        <ApplyTempDataTable
          ref="Apply"
          @addTempVar="addTempVar"
          :IntroduceUserDefinedTempSearch="IntroduceUserDefinedTempSearch"
          :ApplyTempTableData="ApplyTempTableData"
          @selectionData="selectionData"
        />
      </el-card>
    </div>
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
      //调用孙组件事件
      showDialogTableVisible() {
        this.$refs.Apply.showDialogTableVisible();
      },
      //保存
      saveApplyNum() {
        this.$refs.Apply.saveApplyNum();
      },
      showDialogTableVisible2() {
        this.$refs.Apply.showDialogTableVisible2();
      },
      exportData() {
        this.$refs.Apply.exportChildData();
      },
      removeBatch() {
        this.$refs.Apply.removeBatch();
      },

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

<style lang="scss" scoped>
.master-base-data-page {
  padding: 8px;
}

.master-base-data-layout {
  height: calc(100vh - 112px);
  display: flex;
  gap: 10px;
  min-height: 0;
}

.master-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.master-card-left {
  flex: 0 0 calc(33.3333% - 5px);
}

.master-card-right {
  flex: 1;
}

.master-card :deep(.el-card__header) {
  flex: none;
  padding: 10px 12px;
}

.master-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  padding: 12px;
  box-sizing: border-box;
}

.master-card :deep(.ele-body) {
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
