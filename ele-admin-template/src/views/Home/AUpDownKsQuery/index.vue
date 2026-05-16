<template>
  <div class="a-up-down-ks-query ele-body-small">
    <el-card shadow="never" class="block-card">
      <div slot="header" class="card-head">上下限审批</div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="关键字">
          <el-input
            v-model="query.search"
            clearable
            placeholder="关键字搜索"
            style="width: 200px"
            @keyup.enter.native="load(1)"
          />
        </el-form-item>
        <el-form-item label="科室名称">
          <el-input
            v-model="query.deptName"
            clearable
            placeholder="科室名称"
            style="width: 200px"
            @keyup.enter.native="load(1)"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="query.starttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="width: 140px"
            clearable
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="query.endtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            style="width: 140px"
            clearable
          />
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="query.approvalState" style="width: 110px" @change="load(1)">
            <el-option label="未审批" value="0" />
            <el-option label="已审批" value="1" />
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
          <el-button type="primary" plain @click="onApproval">审批</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        border
        stripe
        height="calc(100vh - 280px)"
        @selection-change="(s) => (selected = s)"
      >
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="DEPT_TWO_NAME" label="二级科室名称" width="150" show-overflow-tooltip />
        <el-table-column prop="VARIETIE_NAME" label="品种名称" width="150" show-overflow-tooltip />
        <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="150" show-overflow-tooltip />
        <el-table-column prop="COEFFICIENT" label="系数" width="100" align="center" />
        <el-table-column prop="UP" label="申请上限值" width="110" align="center" />
        <el-table-column prop="DOWN" label="申请下限值" width="110" align="center" />
        <el-table-column label="申请时间" width="160">
          <template slot-scope="{ row }">{{ fmtDateTime(row.CREATE_TIME) }}</template>
        </el-table-column>
        <el-table-column label="审批时间" width="160">
          <template slot-scope="{ row }">{{ fmtDateTime(row.APPROVAL_TIME) }}</template>
        </el-table-column>
        <el-table-column prop="NICKNAME" label="操作人" width="100" show-overflow-tooltip />
        <el-table-column label="审批状态" width="100" align="center">
          <template slot-scope="{ row }">{{ fmtApprovalState(row.APPROVAL_STATE) }}</template>
        </el-table-column>
        <el-table-column prop="IS_DELETE" label="是否存在" width="100" align="center" />
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-size="page.size"
        :current-page="page.page"
        :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
        @size-change="onSize"
        @current-change="load"
      />
    </el-card>
  </div>
</template>


<script>
import { searchUpDownKsQuery, approvalUpDown } from '@/api/Home/AUpDownKsQuery';

export default {
  name: 'AUpDownKsQuery',
  data() {
    return {
      loading: false,
      approving: false,
      rows: [],
      selected: [],
      total: 0,
      page: { page: 1, size: 20 },
      query: {
        search: '',
        deptName: '',
        starttime: '',
        endtime: '',
        approvalState: '0'
      }
    };
  },
  created() {
    this.load(1);
  },
  methods: {
    fmtDateTime(v) {
      if (v == null || v === '') return '';
      return String(v).replace('T', ' ').slice(0, 19);
    },
    fmtApprovalState(v) {
      if (v == null || v === '') return v ?? '';
      const s = String(v);
      if (s === '1') return '已审批';
      if (s === '0') return '未审批';
      return s;
    },
    async load(page) {
      if (page) this.page.page = page;
      this.loading = true;
      try {
        const data = await searchUpDownKsQuery({
          SEARCH: this.query.search,
          DEPT_TWO_NAME: this.query.deptName,
          APPROVAL_STATE: this.query.approvalState,
          starttime: this.query.starttime || '',
          endtime: this.query.endtime || '',
          page: this.page.page,
          size: this.page.size
        });
        this.rows = data.result || [];
        this.total = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    onSize(size) {
      this.page.size = size;
      this.load(1);
    },
    async onApproval() {
      if (!this.selected.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm('确认审批选中的上下限申请？', '提示', { type: 'warning' });
      } catch {
        return;
      }
      const payload = this.selected.map((row) => ({
        DEPT_TWO_CODE: row.DEPT_TWO_CODE,
        DEPT_TWO_NAME: row.DEPT_TWO_NAME,
        VARIETIE_CODE: row.VARIETIE_CODE,
        COEFFICIENT: row.COEFFICIENT,
        up: row.UP,
        down: row.DOWN,
        ID: String(row.ID)
      }));
      this.approving = true;
      try {
        await approvalUpDown(payload);
        this.$message.success('审批成功，上下限已修改');
        this.load(this.page.page);
      } catch (e) {
        this.$message.error(e.message || '审批失败');
      } finally {
        this.approving = false;
      }
    }
  }
};
</script>

<style scoped>
.a-up-down-ks-query {
  padding: 12px;
}
.block-card {
  width: 100%;
}
.card-head {
  font-weight: 600;
}
.toolbar {
  margin-bottom: 8px;
}
.pager {
  margin-top: 12px;
  text-align: right;
}
</style>
