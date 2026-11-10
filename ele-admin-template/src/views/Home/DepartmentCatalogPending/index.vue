<template>
  <div class="ele-body-small">
    <el-card shadow="never">
      <div slot="header">科室目录待维护</div>
      <el-form :inline="true" size="small" @submit.native.prevent="search">
        <el-form-item label="领用科室">
          <el-select v-model="filters.DeptTwoCode" filterable clearable placeholder="全部授权科室">
            <el-option v-for="dept in departments" :key="dept.Dept_Two_Code" :label="dept.Dept_Two_Name" :value="String(dept.Dept_Two_Code)" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料"><el-input v-model="filters.Condition" clearable placeholder="物料编码或名称" maxlength="100" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.Status"><el-option label="待维护" value="0" /><el-option label="已完成" value="1" /><el-option label="全部" value="" /></el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="dates" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item><el-button type="primary" native-type="submit" :loading="loading">查询</el-button><el-button @click="reset">重置</el-button></el-form-item>
      </el-form>
      <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon class="notice" />
      <el-table v-loading="loading" :data="rows" border stripe size="small" empty-text="暂无事项" :max-height="tableHeight">
        <el-table-column prop="Dept_Two_Name" label="领用科室" min-width="130" show-overflow-tooltip />
        <el-table-column prop="Varietie_Code_New" label="物料编码" min-width="130" />
        <el-table-column prop="Varietie_Name" label="物料名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="规格型号" min-width="150" show-overflow-tooltip />
        <el-table-column label="状态" width="90"><template slot-scope="{ row }"><el-tag size="small" :type="row.State === '1' ? 'success' : 'warning'">{{ row.State === '1' ? '已完成' : '待维护' }}</el-tag></template></el-table-column>
        <el-table-column label="首次申请时间" min-width="160"><template slot-scope="{ row }">{{ time(row.First_Apply_Time) }}</template></el-table-column>
        <el-table-column prop="First_Applicant" label="首次申请人" min-width="110" />
        <el-table-column label="最近申请时间" min-width="160"><template slot-scope="{ row }">{{ time(row.Last_Apply_Time) }}</template></el-table-column>
        <el-table-column prop="Last_Applicant" label="最近申请人" min-width="110" />
        <el-table-column prop="Completed_By" label="处理人" min-width="150" show-overflow-tooltip />
        <el-table-column label="完成／核实时间" min-width="160"><template slot-scope="{ row }">{{ time(row.Completed_Time) }}</template></el-table-column>
        <el-table-column prop="Package_Codes" label="授权定数包编码" min-width="140" show-overflow-tooltip />
        <el-table-column label="操作" width="110" fixed="right"><template slot-scope="{ row }"><el-button v-if="row.State === '0'" type="text" :disabled="loading || packageLoading" @click="open(row)">维护属性</el-button><span v-else>已完成</span></template></el-table-column>
      </el-table>
      <el-pagination class="pagination" :current-page.sync="page" :page-size.sync="size" :page-sizes="[15, 30, 50, 100]" :total="total" layout="total, sizes, prev, pager, next" @current-change="load" @size-change="search" />
    </el-card>
    <el-dialog title="选择定数包" :visible.sync="packageVisible" width="850px" append-to-body @closed="openAttributesAfterPackageClosed">
      <p>{{ current?.Dept_Two_Name }} / {{ current?.Varietie_Name }}：请选择要建立或恢复授权的定数包。</p>
      <el-table ref="packages" :data="packages" border size="small" max-height="400" @selection-change="selected = $event">
        <el-table-column type="selection" width="50" :selectable="canSelect" />
        <el-table-column prop="Def_No_Pkg_Code" label="定数包编码" min-width="130" />
        <el-table-column prop="Def_No_Pkg_Coefficient" label="包装系数" min-width="100" />
        <el-table-column label="定数包状态" min-width="130"><template slot-scope="{ row }">{{ row.Is_Delete !== '1' ? '已删除（不可选）' : row.Enable !== '1' ? '已停用（不可选）' : '有效' }}</template></el-table-column>
        <el-table-column label="已有科室授权" min-width="130"><template slot-scope="{ row }">{{ authState(row) }}</template></el-table-column>
      </el-table>
      <p v-if="!packages.length">该物料暂无定数包，请先在定数包品种目录中维护，再刷新。</p>
      <div slot="footer"><el-button @click="packageVisible = false">取消</el-button><el-button type="primary" :disabled="!selected.length" @click="defineAttributes">定义属性</el-button></div>
    </el-dialog>
    <attributes-dialog ref="attributes" @saved="saved" />
  </div>
</template>
<script>
import { searchPending, reconcilePending, getPackages } from '@/api/Home/DepartmentCatalogPending';
import AttributesDialog from './components/AttributesDialog.vue';
export default {
  name: 'DepartmentCatalogPending',
  components: { AttributesDialog },
  data() {
    return { filters: { DeptTwoCode: '', Condition: '', Status: '0' }, dates: [], page: 1, size: 15,
      rows: [], total: 0, loading: false, error: '', current: null, packages: [], selected: [],
      nextAttributeRequest: null, packageVisible: false, packageLoading: false, loadVersion: 0, tableHeight: 'calc(100vh - 300px)' };
  },
  computed: {
    departments() { return this.$store.state.user.info?.userDept || []; }
  },
  created() { this.load(); },
  methods: {
    time(value) { return value ? String(value).replace('T', ' ').substring(0, 19) : '—'; },
    search() { this.page = 1; this.load(); },
    reset() { this.filters = { DeptTwoCode: '', Condition: '', Status: '0' }; this.dates = []; this.search(); },
    async load() {
      const version = ++this.loadVersion;
      this.loading = true;
      this.error = '';
      try {
        await reconcilePending();
        const result = await searchPending({ ...this.filters, StartDate: this.dates?.[0] || '', EndDate: this.dates?.[1] || '', page: this.page, size: this.size });
        if (version !== this.loadVersion) return;
        this.rows = result.result || [];
        this.total = result.total || 0;
      } catch (e) {
        if (version === this.loadVersion) { this.error = e.message || '查询失败'; this.rows = []; this.total = 0; }
      } finally { if (version === this.loadVersion) this.loading = false; }
    },
    canSelect(row) { return row.Enable === '1' && row.Is_Delete === '1'; },
    authState(row) {
      if (!row.Pkg_Auth_Var_Code) return '未授权';
      if (row.Auth_Is_Delete !== '1') return '已删除（选中可恢复）';
      if (row.Auth_Enable !== '1') return '已停用（选中可恢复）';
      return '已授权';
    },
    async open(row) {
      this.packageLoading = true;
      try {
        const result = await getPackages(row.ID);
        this.nextAttributeRequest = null;
        this.current = row;
        this.packages = result.result || [];
        this.selected = [];
        this.packageVisible = true;
        this.$nextTick(() => this.$refs.packages.clearSelection());
      } catch (e) { this.$message.error(e.message || '读取定数包失败'); }
      finally { this.packageLoading = false; }
    },
    defineAttributes() {
      if (!this.selected.length) return;
      this.nextAttributeRequest = { task: { ...this.current }, packages: this.selected.map((p) => p.Def_No_Pkg_Code) };
      this.packageVisible = false;
    },
    openAttributesAfterPackageClosed() {
      const request = this.nextAttributeRequest;
      this.nextAttributeRequest = null;
      if (request) this.$refs.attributes.open(request.task, request.packages);
    },
    saved() { this.load(); }
  }
};
</script>
<style scoped>
.notice { margin-bottom: 12px; }
.pagination { margin-top: 16px; overflow-x: auto; text-align: right; }
</style>
