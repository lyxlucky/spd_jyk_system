<template>
  <el-dialog :title="'一级科室散货品种授权 — ' + deptOneName" :visible.sync="visible" width="90%" top="4vh" append-to-body>
    <el-form :inline="true" size="small" @submit.native.prevent>
      <el-form-item label="品种">
        <el-input v-model="keyword" clearable placeholder="编码/名称" style="width: 200px" @keyup.enter.native="search(1)" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      v-loading="loading"
      :data="rows"
      border
      stripe
      height="360"
      @selection-change="(s) => (selected = s)"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="120" show-overflow-tooltip />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格" width="100" show-overflow-tooltip />
      <el-table-column prop="Unit" label="单位" width="60" />
    </el-table>
    <el-pagination
      class="pager"
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="search"
    />
    <el-divider content-position="left">批量授权参数（应用于勾选品种）</el-divider>
    <el-form :inline="true" size="small">
      <el-form-item label="授权到期">
        <el-date-picker v-model="defaults.expire" type="date" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="授权总量">
        <el-input-number v-model="defaults.limit" :min="0" :controls="false" />
      </el-form-item>
      <el-form-item label="申领基数">
        <el-input-number v-model="defaults.radix" :min="0" :controls="false" />
      </el-form-item>
      <el-form-item label="授权模式">
        <el-select v-model="defaults.authModel" style="width: 100px">
          <el-option label="模式0" value="0" />
          <el-option label="模式1" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="saving" @click="submit">确认授权</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';
import { operatorName } from '../utils';

export default {
  name: 'BulkAuthGrantDialog',
  data() {
    return {
      visible: false,
      loading: false,
      saving: false,
      deptOneCode: '',
      deptOneName: '',
      keyword: '',
      rows: [],
      selected: [],
      total: 0,
      page: 1,
      pageSize: 20,
      defaults: { expire: '2099-01-01', limit: 99999, radix: 0, authModel: '0' }
    };
  },
  methods: {
    open(deptOneCode, deptOneName) {
      this.deptOneCode = deptOneCode;
      this.deptOneName = deptOneName;
      this.keyword = '';
      this.selected = [];
      this.visible = true;
      this.search(1);
    },
    async search(p) {
      this.page = p;
      this.loading = true;
      try {
        const start = (this.page - 1) * this.pageSize + 1;
        const end = this.page * this.pageSize;
        const { rows, total } = await api.searchVarietiePageList(this.keyword || '略', start, end);
        this.rows = rows;
        this.total = total;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      if (!this.selected.length) {
        Message.warning('请勾选要授权的品种');
        return;
      }
      const op = operatorName(this);
      const list = this.selected.map((r) => {
        const code = r.Varietie_Code;
        return `{${code},${this.defaults.limit},${this.defaults.expire},${op},${this.deptOneCode},${this.defaults.authModel},${this.defaults.radix}}`;
      });
      this.saving = true;
      try {
        const ok = await api.insertDeptOneBulkAuth(list);
        if (ok) {
          Message.success('授权成功');
          this.visible = false;
          this.$emit('saved');
        } else {
          Message.error('授权失败');
        }
      } catch (e) {
        Message.error(e.message || '授权失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.pager {
  margin-top: 8px;
  text-align: right;
}
</style>
