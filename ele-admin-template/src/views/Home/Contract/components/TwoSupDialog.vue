<template>
  <el-dialog title="选择二级供应商授权" :visible.sync="dialogVisible" width="720px" append-to-body :close-on-click-modal="false">
    <el-form size="mini" inline @submit.native.prevent>
      <el-input v-model="searchCode" clearable placeholder="供应商编码" style="width: 160px" @keyup.enter.native="reload" />
      <el-input v-model="searchName" clearable placeholder="供应商名称" style="width: 160px; margin-left: 8px" @keyup.enter.native="reload" />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 8px" @click="reload">查询</el-button>
    </el-form>
    <el-table
      v-loading="loading"
      :data="list"
      size="mini"
      stripe
      highlight-current-row
      height="420"
      style="margin-top: 10px"
      @current-change="(row) => (current = row)"
    >
      <el-table-column prop="Supplier_Code" label="供应商编码" width="110" />
      <el-table-column prop="Supplier_Name" label="供应商名称" min-width="180" show-overflow-tooltip />
      <el-table-column label="状态" width="70" align="center">
        <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : '冻结' }}</template>
      </el-table-column>
      <el-table-column prop="Roduction_License_Valid_Date" label="生产许可证有效期" min-width="150" show-overflow-tooltip />
    </el-table>
    <el-pagination
      small
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="page"
      style="margin-top: 8px; text-align: right"
      @current-change="loadList"
    />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTwoSupList, inTwoSup } from '@/api/Home/Contract';

export default {
  name: 'TwoSupDialog',
  props: {
    visible: Boolean,
    authRows: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      searchCode: '',
      searchName: '',
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      current: null
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.page = 1;
        this.loadList();
      }
    }
  },
  methods: {
    reload() {
      this.page = 1;
      this.loadList();
    },
    async loadList() {
      this.loading = true;
      try {
        const res = await getTwoSupList({
          page: this.page,
          limit: this.pageSize,
          supplier_code: this.searchCode,
          supplier_name: this.searchName
        });
        this.list = res.result || [];
        this.total = res.total || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    async onSubmit() {
      if (!this.current) {
        this.$message.warning('请选中一行供应商');
        return;
      }
      if (!this.authRows.length) {
        this.$message.warning('请勾选合同品种明细');
        return;
      }
      const json = JSON.stringify(
        this.authRows.map((r) => ({
          Supplier_Code: this.current.Supplier_Code,
          Supplier_Name: this.current.Supplier_Name,
          contract_detail_guid: r.contract_detail_guid
        }))
      );
      this.submitting = true;
      try {
        const res = await inTwoSup(json);
        this.$message.success(res.msg || '操作成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
