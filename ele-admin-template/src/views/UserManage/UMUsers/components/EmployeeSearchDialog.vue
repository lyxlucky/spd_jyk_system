<template>
  <el-dialog title="查询用户" :visible.sync="dialogVisible" width="800px" top="8vh" append-to-body>
    <el-form :inline="true" size="mini" @submit.native.prevent>
      <el-form-item label="工号">
        <el-input v-model="where.employeeCode" clearable @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="where.employeeName" clearable @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" size="mini" border height="420" v-loading="loading">
      <el-table-column prop="CODE" label="工号" width="120" />
      <el-table-column prop="NAME" label="姓名" width="120" />
      <el-table-column prop="NATIONALIDSUFFIX" label="身份证后六位" width="120" />
      <el-table-column prop="PHONENUMBER" label="手机号" min-width="120" />
    </el-table>
    <el-pagination
      v-if="total > 0"
      class="pager"
      layout="total, sizes, prev, pager, next"
      :current-page.sync="page"
      :page-size.sync="limit"
      :page-sizes="[20, 50, 100, 99999]"
      :total="total"
      @current-change="load"
      @size-change="reload"
    />
  </el-dialog>
</template>

<script>
import { listEmployee } from '@/api/UserManage/UMUsers';

export default {
  name: 'EmployeeSearchDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      where: { employeeCode: '', employeeName: '' },
      list: [],
      page: 1,
      limit: 20,
      total: 0
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) this.reload();
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    reload() {
      this.page = 1;
      this.load();
    },
    async load() {
      this.loading = true;
      try {
        const res = await listEmployee(this.where, this.page, this.limit);
        this.list = res.data || [];
        this.total = res.total || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.pager {
  margin-top: 10px;
  text-align: right;
}
</style>
