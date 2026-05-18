<template>
  <el-dialog title="选择二级科室" :visible.sync="innerVisible" width="720px" append-to-body @open="onOpen">
    <div class="toolbar">
      <el-input
        v-model="keyword"
        size="small"
        clearable
        placeholder="二级科室名称"
        style="width: 220px"
        @keyup.enter.native="load"
      />
      <el-button size="small" type="primary" icon="el-icon-search" :loading="loading" @click="load">查询</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="rows"
      border
      stripe
      size="small"
      height="420"
      highlight-current-row
      @current-change="current = $event"
    >
      <el-table-column width="48" align="center">
        <template slot-scope="{ row }">
          <el-radio v-model="pickedCode" :label="row.Dept_Two_Code" @change="current = row">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="Dept_Two_Name" label="二级科室名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="Dept_Two_Code" label="二级科室编码" width="160" show-overflow-tooltip />
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      class="pager"
      small
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="load"
    />
    <div slot="footer">
      <el-button size="small" @click="innerVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Task/AuthOrder';

export default {
  name: 'DeptTwoPickerDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      innerVisible: false,
      loading: false,
      keyword: '',
      rows: [],
      current: null,
      pickedCode: '',
      page: 1,
      pageSize: 20,
      total: 0
    };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.keyword = '';
      this.current = null;
      this.pickedCode = '';
      this.page = 1;
      this.load();
    },
    async load() {
      this.loading = true;
      try {
        const res = await api.searchDeptTwoWithName(this.keyword.trim() || '-1', this.page, this.pageSize);
        this.rows = res.result || [];
        this.total = res.total ?? this.rows.length;
      } catch (e) {
        Message.error(e.message || '加载科室失败');
        this.rows = [];
      } finally {
        this.loading = false;
      }
    },
    onConfirm() {
      const row = this.current || this.rows.find((r) => r.Dept_Two_Code === this.pickedCode);
      if (!row) {
        Message.warning('请选中一行数据');
        return;
      }
      this.$emit('pick', { code: row.Dept_Two_Code, name: row.Dept_Two_Name });
      this.innerVisible = false;
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.pager {
  margin-top: 10px;
  text-align: right;
}
</style>
