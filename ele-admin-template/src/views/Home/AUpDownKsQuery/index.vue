<template>
  <div class="a-up-down-ks-query">
    <el-card shadow="hover" class="block-card">
      <div slot="header" class="card-head">
        <span class="card-head__icon el-icon-s-check"></span>
        <span>上下限审批</span>
        <el-tag v-if="total > 0" size="mini" class="card-head__count">{{ total }} 条记录</el-tag>
      </div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <div class="toolbar__row">
          <el-form-item label="关键字">
            <el-input
              v-model="query.search"
              clearable
              placeholder="品种/编码搜索"
              prefix-icon="el-icon-search"
              style="width: 200px"
              @keyup.enter.native="load(1)"
            />
          </el-form-item>
          <el-form-item label="科室名称">
            <el-input
              v-model="query.deptName"
              clearable
              placeholder="输入科室名称"
              prefix-icon="el-icon-office-building"
              style="width: 200px"
              @keyup.enter.native="load(1)"
            />
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="query.starttime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              style="width: 150px"
              clearable
            />
            <span class="toolbar__separator">至</span>
            <el-date-picker
              v-model="query.endtime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              style="width: 150px"
              clearable
            />
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="query.approvalState" style="width: 120px" @change="load(1)">
              <el-option label="未审批" value="0" />
              <el-option label="已审批" value="1" />
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
          <el-form-item class="toolbar__actions">
            <el-button type="primary" icon="el-icon-search" :loading="loading" @click="load(1)">查询</el-button>
            <el-button type="success" icon="el-icon-s-claim" :loading="approving" @click="onApproval">批量审批</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        border
        stripe
        highlight-current-row
        class="data-table"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: '600' }"
        height="calc(100vh - 300px)"
        @selection-change="(s) => (selected = s)"
      >
        <el-table-column type="selection" width="50" align="center" fixed="left" />
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="DEPT_TWO_NAME" label="二级科室" min-width="140" show-overflow-tooltip />
        <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="COEFFICIENT" label="系数" width="90" align="center">
          <template slot-scope="{ row }">
            <span class="cell-number">{{ row.COEFFICIENT }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="UP" label="上限值" width="100" align="center">
          <template slot-scope="{ row }">
            <span class="cell-number cell-up">{{ row.UP }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DOWN" label="下限值" width="100" align="center">
          <template slot-scope="{ row }">
            <span class="cell-number cell-down">{{ row.DOWN }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="160" align="center">
          <template slot-scope="{ row }">
            <span class="cell-time">{{ fmtDateTime(row.CREATE_TIME) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" width="160" align="center">
          <template slot-scope="{ row }">
            <span class="cell-time">{{ fmtDateTime(row.APPROVAL_TIME) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="NICKNAME" label="操作人" width="100" show-overflow-tooltip />
        <el-table-column label="审批状态" width="100" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-tag v-if="String(row.APPROVAL_STATE) === '1'" type="success" size="small" effect="light">已审批</el-tag>
            <el-tag v-else-if="String(row.APPROVAL_STATE) === '0'" type="warning" size="small" effect="light">未审批</el-tag>
            <span v-else>{{ row.APPROVAL_STATE }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否存在" width="100" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-tag v-if="String(row.IS_DELETE) === '1'" type="info" size="small" effect="plain">已删除</el-tag>
            <el-tag v-else type="success" size="small" effect="plain">正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager-wrapper">
        <span v-if="selected.length" class="pager-info">已选中 {{ selected.length }} 条</span>
        <span v-else class="pager-info"></span>
        <el-pagination
          class="pager"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="page.size"
          :current-page="page.page"
          :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
          @size-change="onSize"
          @current-change="load"
        />
      </div>
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
  padding: 16px;
}

/* 卡片 */
.block-card {
  width: 100%;
  border-radius: 8px;
}
.block-card >>> .el-card__header {
  padding: 14px 20px;
  /* background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%); */
  border-bottom: none;
}
.card-head {
  display: flex;
  align-items: center;
  /* color: #fff; */
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}
.card-head__icon {
  margin-right: 8px;
  font-size: 20px;
}
.card-head__count {
  margin-left: 12px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  color: #fff;
}

/* 工具栏 */
.toolbar {
  margin-bottom: 4px;
}
.toolbar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0 8px;
}
.toolbar__row >>> .el-form-item {
  margin-bottom: 12px;
}
.toolbar__row >>> .el-form-item__label {
  font-weight: 500;
  color: #606266;
}
.toolbar__separator {
  display: inline-block;
  margin: 0 6px;
  color: #c0c4cc;
  font-size: 13px;
}
.toolbar__actions {
  margin-left: auto;
}

/* 表格 */
.data-table {
  border-radius: 6px;
  overflow: hidden;
}
.data-table >>> .el-table__header-wrapper th {
  font-size: 13px;
}
.data-table >>> .el-table__body-wrapper {
  font-size: 13px;
}
.data-table >>> .el-table__row {
  transition: background-color 0.15s ease;
}

/* 数值单元格 */
.cell-number {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.cell-up {
  color: #e6a23c;
}
.cell-down {
  color: #409eff;
}

/* 时间单元格 */
.cell-time {
  font-size: 12px;
  color: #909399;
  font-variant-numeric: tabular-nums;
}

/* 分页区域 */
.pager-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
.pager-info {
  font-size: 13px;
  color: #909399;
  min-width: 100px;
}
.pager {
  flex-shrink: 0;
}
</style>
