<template>
  <div class="ele-body spd-page apply-temp-page">
    <el-card shadow="never" class="apply-temp-card">
      <div class="apply-temp-layout">
        <div class="apply-temp-aside">
          <div class="spd-panel__head">申领模板列表</div>
          <ApplyTempTable @getCurrent="getCurrent" />
        </div>
        <div class="apply-temp-main">
          <div class="spd-panel__head">申领模板列表品种</div>
          <ApplyTempCoefDataTable
            ref="Apply"
            @addTempVar="addTempVar"
            :IntroduceUserDefinedTempSearch="IntroduceUserDefinedTempSearch"
            :ApplyTempTableData="ApplyTempTableData"
            @selectionData="selectionData"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ApplyTempTable from '@/views/KSInventory/ApplyTemp/components/ApplyTempTable.vue';
import ApplyTempCoefDataTable from './ApplyTempCoefDataTable.vue';
import { KeeptListDeta, KeepTempletDeta } from '@/api/KSInventory/ApplyTemp';

export default {
  name: 'ApplyTempCoef',
  props: ['IntroduceUserDefinedTempSearch'],
  components: {
    ApplyTempTable,
    ApplyTempCoefDataTable
  },
  data() {
    return {
      ApplyTempTableData: {},
      ApplyTempDataSelData: []
    };
  },
  methods: {
    getCurrent(data) {
      this.ApplyTempTableData = data;
    },
    async addTempVar() {
      if (!this.ApplyTempDataSelData || this.ApplyTempDataSelData.length === 0) {
        this.$message.warning('请先勾选需要引入的模板品种');
        return;
      }
      const loading = this.$messageLoading('添加中...');
      const planList = [];
      const tempSaveList = [];
      this.ApplyTempDataSelData.forEach((element) => {
        const coef =
          Number(element.COEFFICIENT) > 0 ? Number(element.COEFFICIENT) : 1;
        const packQty = Math.max(0, Math.floor(Number(element.PACK_QTY) || 0));
        const bulkQty = packQty * coef;

        planList.push({
          PLAN_NUMBER: this.IntroduceUserDefinedTempSearch.PlanNum,
          ENABLE: element.VAR_ENABLE,
          VARIETIE_CODE: element.VarID,
          VARIETIE_NAME: element.VarName,
          SPECIFICATION_OR_TYPE: element.GG,
          UNIT: element.Unit,
          MANUFACTURING_ENT_NAME: element.Manufacturing,
          AUTH: element.AUTH,
          COEFFICIENT: coef,
          PACK_QTY: packQty,
          APPLY_QTY: String(bulkQty)
        });

        if (element.ID) {
          tempSaveList.push({
            ID: element.ID,
            TempletQty: String(bulkQty),
            AUTH: element.AUTH != null ? String(element.AUTH) : '0',
            COEFFICIENT: coef,
            PACK_QTY: packQty
          });
        }
      });

      try {
        // 1. 同步把模板里修改过的系数/包数/散货数量写回模板明细表
        if (tempSaveList.length > 0) {
          await KeepTempletDeta(tempSaveList);
        }
        // 2. 写入计划明细表（同计划单同品种唯一，已存在则同步更新系数/包数/散货数量）
        await KeeptListDeta(planList, '1');
        loading.close();
        this.$message.success('添加成功');
        this.$emit('ApplyTempPageChange', false);
      } catch (err) {
        loading.close();
        this.$message.error((err && err.message) || err || '添加失败');
      }
    },
    selectionData(data) {
      this.ApplyTempDataSelData = data;
    }
  },
  computed: {
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined;
    }
  }
};
</script>

<style scoped>
.apply-temp-card :deep(.el-card__body) {
  padding: 10px;
}

.apply-temp-layout {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.apply-temp-aside {
  flex: 0 0 35%;
  max-width: 500px;
  min-width: 0;
  overflow: hidden;
}

.apply-temp-main {
  flex: 1;
  min-width: 0;
}

.apply-temp-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
