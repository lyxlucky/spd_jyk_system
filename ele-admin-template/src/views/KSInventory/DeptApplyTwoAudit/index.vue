<template>
  <div class="ele-body spd-page dept-apply-two-audit">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="申领单号">
          <el-input v-model="filters.PLAN_NUMBER" clearable style="width: 140px" placeholder="申领单号" />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 140px" placeholder="品种名称" />
        </el-form-item>
        <el-form-item label="科室名称">
          <el-input v-model="filters.DEPT_TWO_NAME" clearable style="width: 140px" placeholder="科室名称" />
        </el-form-item>
        <el-form-item label="下计划日期">
          <el-date-picker
            v-model="filters.StartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="filters.EndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="是否已审批">
          <el-select
            v-model="filters.SENCOND_APP_STATE"
            clearable
            style="width: 100px"
            @change="reload"
          >
            <el-option
              v-for="item in appStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button type="primary" plain @click="onAccept(1)">审核通过</el-button>
          <el-button type="danger" plain @click="onAccept(2)">审核不通过</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="filters"
        :selection.sync="selection"
        :page-size="100"
        :page-sizes="[30, 50, 100, 200, 300, 99999]"
        cache-key="DeptApplyTwoAudit"
      >
        <template v-slot:SENCOND_APP_STATE="{ row }">
          {{ formatSecondAppState(row.SENCOND_APP_STATE) }}
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { getDeptApplyTwoAudit, deptApplyAccept } from '@/api/KSInventory/DeptApplyTwoAudit';
import {
  defaultFilters,
  APP_STATE_OPTIONS,
  buildColumns,
  formatSecondAppState
} from './utils';

export default {
  name: 'DeptApplyTwoAudit',
  data() {
    return {
      filters: defaultFilters(),
      appStateOptions: APP_STATE_OPTIONS,
      columns: buildColumns(),
      selection: [],
      accepting: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 260px)';
    }
  },
  methods: {
    formatSecondAppState,
    datasource({ page, limit, where }) {
      return getDeptApplyTwoAudit(where || this.filters, page, limit).then((res) => ({
        count: res.total,
        list: res.list || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    reloadCurrentPage() {
      this.$refs.table.reload({ where: { ...this.filters } });
    },
    async onAccept(tag) {
      if (!this.selection.length) {
        Message.warning('请选中要审核的数据');
        return;
      }
      if (this.accepting) return;
      try {
        await MessageBox.confirm('确认审核?', '提示', { type: 'warning' });
        this.accepting = true;
        const ids = this.selection.map((row) => row.ID);
        const res = await deptApplyAccept(ids, tag);
        Message.success(res.msg || '操作成功');
        this.reloadCurrentPage();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      } finally {
        this.accepting = false;
      }
    }
  }
};
</script>

<style scoped>
.filter-block {
  margin-bottom: 8px;
}
</style>
