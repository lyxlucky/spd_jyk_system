<template>
  <div class="picking-left picking-compact-table">
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
      :init-load="false"
      :toolkit="[]"
      :columns="columns"
      :datasource="datasource"
      cache-key="deptPlannedDeliveryNewPickingLeft"
      @current-change="onCurrentChange"
      @row-click="onRowClick"
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
      current: null,
      remarkVisible: false,
      remarkPlanNo: ''
    };
  },
  watch: {
    storageId: {
      immediate: true,
      handler(val) {
        if (!val) return;
        this.$nextTick(() => this.reload());
      }
    }
  },
  methods: {
    reload() {
      if (!this.storageId) return;
      this.$refs.table?.reload({
        page: 1,
        where: { ...this.where, storageId: this.storageId }
      });
    },
    /** 按关键字/品种编码刷新；传 '' 清空；不传则保留当前关键字仅重查 */
    reloadByKeyword(keyword) {
      if (keyword !== undefined) {
        this.where.keyword = keyword == null ? '' : String(keyword);
      }
      this.current = null;
      this.reload();
    },
    datasource({ page, limit, where }) {
      return getPickingList(
        { ...where, storageId: this.storageId },
        page,
        limit || 30
      ).then((res) => ({
        count: Number(res.total) || 0,
        list: res.result || []
      }));
    },
    onCurrentChange(row) {
      // 仅同步高亮；明细加载走 row-click，避免重复请求
      this.current = row;
    },
    onRowClick(row) {
      if (row) this.$emit('select-plan', row);
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

<style lang="scss">
/* 与备货明细、计划表一致的紧凑行高 */
.picking-compact-table {
  .el-table--mini td,
  .el-table--mini th,
  .el-table .el-table__cell {
    padding: 2px 0;
  }
  .el-table .el-table__row {
    height: auto !important;
  }
  .el-table .cell {
    padding-left: 4px;
    padding-right: 4px;
    line-height: 20px;
    font-size: 12px;
  }
}
</style>
