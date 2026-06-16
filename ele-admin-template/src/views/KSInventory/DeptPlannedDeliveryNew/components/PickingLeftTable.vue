<template>
  <div class="picking-left">
    <div class="sub-panel-head spd-sub-panel__head">备货单列表</div>
    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="where.date" clearable placeholder="YYYY-MM" style="width: 100px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="where.state" style="width: 130px">
          <el-option value="-1" label="全部" />
          <el-option value="0" label="未发送（SPD）" />
          <el-option value="1" label="已发送（SPD）" />
          <el-option value="2" label="已查看（B2B）" />
          <el-option value="3" label="处理中（B2B）" />
          <el-option value="4" label="部分送货（B2B）" />
          <el-option value="5" label="全部送货（B2B）" />
          <el-option value="6" label="部分收货（SPD）" />
          <el-option value="7" label="全部收货（SPD）" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="where.planNo" clearable placeholder="备货单号" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="where.keyword" clearable placeholder="关键字" style="width: 120px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">搜索</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="240px"
      highlight-current-row
      :toolkit="[]"
      :columns="columns"
      :datasource="datasource"
      cache-key="deptPlannedDeliveryNewPickingLeft"
      @current-change="onCurrentChange"
    >
      <template v-slot:createTime="{ row }">
        {{ row.Create_Time ? $moment(row.Create_Time).format('YYYY-MM-DD') : '' }}
      </template>
      <template v-slot:pickingRemark="{ row }">
        <el-button type="text" size="mini" @click.stop="openRemark(row)">备注</el-button>
      </template>
    </ele-pro-table>
    <PickingRemarkDialog
      :visible.sync="remarkVisible"
      :plan-no="remarkPlanNo"
      @success="reload"
    />
  </div>
</template>

<script>
import { getPickingList } from '@/api/KSInventory/DeptPlannedDeliveryNew';
import { buildPickingListColumns } from '../utils';
import PickingRemarkDialog from './PickingRemarkDialog.vue';

export default {
  name: 'PickingLeftTable',
  components: { PickingRemarkDialog },
  props: {
    storageId: String
  },
  data() {
    return {
      where: { date: '', state: '-1', planNo: '', keyword: '' },
      columns: buildPickingListColumns(),
      remarkVisible: false,
      remarkPlanNo: ''
    };
  },
  methods: {
    reload() {
      this.$refs.table?.reload({
        page: 1,
        where: { ...this.where, storageId: this.storageId }
      });
    },
    datasource({ page, limit, where }) {
      return getPickingList(
        { ...where, storageId: this.storageId },
        page,
        limit || 30
      ).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    onCurrentChange(row) {
      this.$emit('select-plan', row);
    },
    openRemark(row) {
      this.remarkPlanNo = row.Stock_Up_Plan_No;
      this.remarkVisible = true;
    }
  }
};
</script>

<style scoped>
.picking-left {
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
