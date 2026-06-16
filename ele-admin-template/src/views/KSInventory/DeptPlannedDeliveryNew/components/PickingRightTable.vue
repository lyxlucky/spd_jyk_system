<template>
  <div class="picking-right">
    <div class="sub-panel-head spd-sub-panel__head">备货单明细</div>
    <el-form size="mini" inline class="filter-row">
      <el-form-item>
        <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="!selection.length" @click="onDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="240px"
      :init-load="false"
      :toolkit="[]"
      :need-page="false"
      :page-size="9999999"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="deptPlannedDeliveryNewPickingRight"
    />
  </div>
</template>

<script>
import { getPickingInfo, deletePickingDetails } from '@/api/KSInventory/DeptPlannedDeliveryNew';
import { buildPickingDetailColumns } from '../utils';

export default {
  name: 'PickingRightTable',
  data() {
    return {
      planNo: '',
      selection: [],
      columns: buildPickingDetailColumns()
    };
  },
  methods: {
    loadByPlan(planNo) {
      this.planNo = planNo || '';
      this.selection = [];
      this.$refs.table?.reload({ page: 1, where: { Stock_Up_Plan_No: this.planNo } });
    },
    datasource({ where }) {
      if (!where?.Stock_Up_Plan_No && !this.planNo) {
        return Promise.resolve({ count: 0, list: [] });
      }
      const no = where?.Stock_Up_Plan_No || this.planNo;
      return getPickingInfo(no).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    async onDelete() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm('确认删除选中的备货明细吗？', '提示', { type: 'warning' });
        const ids = this.selection.map((r) => r.ID);
        const res = await deletePickingDetails(ids);
        this.$message.success(res.msg || '删除成功');
        this.loadByPlan(this.planNo);
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '删除失败');
        }
      }
    }
  }
};
</script>

<style scoped>
.picking-right {
  height: 100%;
}
.sub-panel-head {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #ebeef5;
}
.filter-row {
  margin-bottom: 8px;
}
</style>
