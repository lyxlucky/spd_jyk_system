<template>
  <div class="batch-outage ele-body-small">
    <el-card shadow="never" class="section-card">
      <div slot="header" class="card-title">一级科室授权列表</div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="一级科室名称">
          <el-input v-model="one.deptName" clearable placeholder="名称" style="width: 150px" @keyup.enter.native="loadOne(1)" />
        </el-form-item>
        <el-form-item label="品名/规格/品种编码">
          <el-input v-model="one.varietie" clearable placeholder="关键字" style="width: 250px" @keyup.enter.native="loadOne(1)" />
        </el-form-item>
        <el-form-item label="启用">
          <el-select v-model="one.enble" style="width: 100px" @change="loadOne(1)">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadOne(1)">查询</el-button>
          <el-button type="danger" plain @click="disableOneAll(0)">停用</el-button>
          <el-button type="primary" plain @click="disableOneAll(1)">启用</el-button>
          <el-button type="primary" plain @click="$refs.batchDlg.open()">批量授权</el-button>
          <el-upload
            class="inline-upload"
            :action="importOneUrl"
            name="file"
            :headers="uploadHeaders"
            accept=".xlsx,.xls"
            :show-file-list="false"
            :on-success="onImportOneOk"
            :on-error="onUploadErr"
          >
            <el-button size="small">导入</el-button>
          </el-upload>
          <el-button type="primary" plain @click="exportOne">导出</el-button>
          <el-button type="danger" @click="delOne">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="oneTable"
        v-loading="one.loading"
        :data="one.rows"
        border
        stripe
        height="420"
        @selection-change="(s) => (one.selected = s)"
        @sort-change="onSortOne"
      >
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="Dept_One_Code" label="科室编码" width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Dept_One_Name" label="科室名称" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column label="启用状态" width="100" sortable="custom" prop="Enable" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : row.Enable == 0 ? '停用' : '—' }}</template>
        </el-table-column>
        <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="160" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="240" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="170" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="220" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Unit" label="单位" width="80" sortable="custom" show-overflow-tooltip />
        <el-table-column label="中标价" width="100" align="right" sortable="custom" prop="Price" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ fmtPrice(row.Price) }}</template>
        </el-table-column>
        <el-table-column label="授权日期" width="120" sortable="custom" prop="Auth_Time" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ fmtDate(row.Auth_Time) }}</template>
        </el-table-column>
        <el-table-column label="授权到期" width="120" sortable="custom" prop="Auth_Valid_Date" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ fmtDate(row.Auth_Valid_Date) }}</template>
        </el-table-column>
        <el-table-column prop="Auth_Bulk_Cargo_Upper_Limit" label="授权总量" width="110" align="center" sortable="custom" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="one.total"
        :page-size="one.size"
        :current-page="one.page"
        :page-sizes="[15, 30, 60, 90, 150, 300]"
        @size-change="onOneSize"
        @current-change="loadOne"
      />
    </el-card>

    <el-card shadow="never" class="section-card mt16">
      <div slot="header" class="card-title">二级科室授权列表</div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="二级科室编码/名称">
          <el-input v-model="two.deptTwoCode" clearable placeholder="与旧系统一致：支持编码或名称筛选" style="width: 200px" @keyup.enter.native="loadTwo(1)" />
        </el-form-item>
        <el-form-item label="品名/规格/品种编码">
          <el-input v-model="two.varietie" clearable placeholder="关键字" style="width: 250px" @keyup.enter.native="loadTwo(1)" />
        </el-form-item>
        <el-form-item label="启用">
          <el-select v-model="two.enble" style="width: 100px" @change="loadTwo(1)">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadTwo(1)">查询</el-button>
          <el-button type="danger" plain @click="disableTwoAll(0)">停用</el-button>
          <el-button type="primary" plain @click="disableTwoAll(1)">启用</el-button>
          <el-upload
            class="inline-upload"
            :action="importTwoUrl"
            name="file"
            :headers="uploadHeaders"
            accept=".xlsx,.xls"
            :show-file-list="false"
            :on-success="onImportTwoOk"
            :on-error="onUploadErr"
          >
            <el-button size="small">导入</el-button>
          </el-upload>
          <el-button type="primary" plain @click="exportTwo">导出</el-button>
          <el-button type="danger" @click="delTwo">删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="twoTable"
        v-loading="two.loading"
        :data="two.rows"
        border
        stripe
        height="420"
        @selection-change="(s) => (two.selected = s)"
        @sort-change="onSortTwo"
      >
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="DEPT_TWO_CODE" label="二级科室编码" width="130" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="DEPT_TWO_NAME" label="二级科室名称" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column label="启用状态" width="100" sortable="custom" prop="Enable" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : row.Enable == 0 ? '停用' : '—' }}</template>
        </el-table-column>
        <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="160" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="240" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="170" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Unit" label="单位" width="80" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Def_No_Pkg_Coefficient" label="定数包系数" width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="220" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Middle_Package_Count" label="中包装数量" width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column label="关联RFID" width="110" sortable="custom" prop="Related_Rfid" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ relatedRfidLabel(row.Related_Rfid) }}</template>
        </el-table-column>
        <el-table-column prop="Def_No_Pkg_Upper" label="库存上限" width="110" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Def_No_Pkg_Lower" label="库存下限" width="110" sortable="custom" show-overflow-tooltip />
        <el-table-column label="授权到期" width="120" sortable="custom" prop="Auth_Valid_Date" show-overflow-tooltip>
          <template slot-scope="{ row }">{{ fmtDate(row.Auth_Valid_Date) }}</template>
        </el-table-column>
        <el-table-column prop="GROUP_NAME" label="分组名称" width="120" align="center" sortable="custom" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="two.total"
        :page-size="two.size"
        :current-page="two.page"
        :page-sizes="[15, 30, 60, 90, 150, 300]"
        @size-change="onTwoSize"
        @current-change="loadTwo"
      />
    </el-card>

    <dept-one-batch-auth-all-dialog ref="batchDlg" @done="loadOne(one.page)" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import * as XLSX from 'xlsx';
import * as api from '@/api/Home/Department';
import { API_BASE_URL, TOKEN_HEADER_NAME } from '@/config/setting';
import { getToken } from '@/utils/token-util';
import { fmtDate, fmtPrice } from '../Department/utils';
import DeptOneBatchAuthAllDialog from './components/DeptOneBatchAuthAllDialog.vue';

function ok(d) {
  return d && (d.code === 200 || d.code === '200');
}

export default {
  name: 'BatchOutageIndex',
  components: { DeptOneBatchAuthAllDialog },
  data() {
    return {
      one: {
        deptName: '',
        varietie: '',
        enble: '',
        rows: [],
        total: 0,
        page: 1,
        size: 15,
        loading: false,
        selected: [],
        sortField: '',
        sortOrder: ''
      },
      two: {
        deptTwoCode: '',
        varietie: '',
        enble: '',
        rows: [],
        total: 0,
        page: 1,
        size: 15,
        loading: false,
        selected: [],
        sortField: '',
        sortOrder: ''
      }
    };
  },
  computed: {
    uploadHeaders() {
      const t = getToken();
      return t ? { [TOKEN_HEADER_NAME]: t } : {};
    },
    importOneUrl() {
      const t = encodeURIComponent(getToken() || '');
      const base = (API_BASE_URL || '').replace(/\/$/, '');
      return `${base}/DeptOneBulkCargoAuthVar/ImportDeptOneAuthVars?Token=${t}`;
    },
    importTwoUrl() {
      const t = encodeURIComponent(getToken() || '');
      const base = (API_BASE_URL || '').replace(/\/$/, '');
      return `${base}/DeptTwoDefNoPkgAuthVar/DeptTwoAuthVarsImport?Token=${t}`;
    }
  },
  methods: {
    fmtDate,
    fmtPrice,
    relatedRfidLabel(v) {
      if (v === '1' || v === 1) return '是';
      if (v === '0' || v === 0) return '否';
      return v != null && v !== '' ? String(v) : '—';
    },
    sortParam(order) {
      if (order === 'ascending') return 'asc';
      if (order === 'descending') return 'desc';
      return '';
    },
    onSortOne({ prop, order }) {
      this.one.sortField = prop || '';
      this.one.sortOrder = this.sortParam(order);
      this.loadOne(1);
    },
    onSortTwo({ prop, order }) {
      this.two.sortField = prop || '';
      this.two.sortOrder = this.sortParam(order);
      this.loadTwo(1);
    },
    onOneSize(s) {
      this.one.size = s;
      this.loadOne(1);
    },
    onTwoSize(s) {
      this.two.size = s;
      this.loadTwo(1);
    },
    async loadOne(p) {
      this.one.page = p;
      this.one.loading = true;
      try {
        const { rows, total } = await api.searchDeptOneAuthedVarAll({
          deptOneName: this.one.deptName,
          varietieCondition: this.one.varietie,
          enble: this.one.enble,
          page: p,
          size: this.one.size,
          field: this.one.sortField,
          order: this.one.sortOrder
        });
        this.one.rows = rows;
        this.one.total = total;
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.one.loading = false;
      }
    },
    async loadTwo(p) {
      this.two.page = p;
      this.two.loading = true;
      try {
        const { rows, total } = await api.searchDeptTwoAuthedVarAll({
          deptTwoCode: this.two.deptTwoCode,
          varietieCondition: this.two.varietie,
          enble: this.two.enble,
          page: p,
          size: this.two.size,
          field: this.two.sortField,
          order: this.two.sortOrder
        });
        this.two.rows = rows;
        this.two.total = total;
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.two.loading = false;
      }
    },
    async disableOneAll(state) {
      if (!this.one.selected.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      try {
        const d = await api.disableDeptOneAuthVarsAll(this.one.selected, state);
        if (ok(d)) Message.success(d.msg || '操作成功');
        else Message.error(d?.msg || '操作失败');
        this.loadOne(this.one.page);
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async disableTwoAll(state) {
      if (!this.two.selected.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      try {
        const d = await api.disableDeptTwoAuthVarsAll(this.two.selected, state);
        if (ok(d)) Message.success(d.msg || '操作成功');
        else Message.error(d?.msg || '操作失败');
        this.loadTwo(this.two.page);
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async delOne() {
      if (!this.one.selected.length) {
        Message.warning('请选中要删除的数据');
        return;
      }
      try {
        await MessageBox.confirm('确认要删除此数据吗？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      const deptCsv = this.one.selected.map((r) => r.Dept_One_Code).join(',');
      const varCsv = this.one.selected.map((r) => r.Varietie_Code).join(',');
      try {
        const d = await api.delDeptOneAuthVar(deptCsv, varCsv);
        if (ok(d)) {
          Message.success('删除成功');
          this.loadOne(1);
        } else {
          Message.error(d?.msg || '删除失败');
        }
      } catch (e) {
        Message.error(e.message || '删除失败');
      }
    },
    async delTwo() {
      if (!this.two.selected.length) {
        Message.warning('请选中要删除的数据');
        return;
      }
      try {
        await MessageBox.confirm('确认要删除此数据吗？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      const codes = this.two.selected.map((r) => r.Pkg_Auth_Var_Code).filter(Boolean).join(',');
      if (!codes) {
        Message.error('选中行缺少 Pkg_Auth_Var_Code，无法删除');
        return;
      }
      try {
        const d = await api.delDeptTwoAuthVar(codes);
        if (ok(d)) {
          Message.success('删除成功');
          this.loadTwo(1);
        } else {
          Message.error(d?.msg || '删除失败');
        }
      } catch (e) {
        Message.error(e.message || '删除失败');
      }
    },
    async exportOne() {
      try {
        const { rows } = await api.searchDeptOneAuthedVarAll({
          deptOneName: this.one.deptName,
          varietieCondition: this.one.varietie,
          enble: this.one.enble,
          page: 1,
          size: 999999,
          field: this.one.sortField,
          order: this.one.sortOrder
        });
        const head = [
          '科室编码',
          '科室名称',
          '启用状态',
          '品种（材料）编码',
          '品种全称',
          '型号/规格',
          '生产企业名称',
          '单位',
          '中标价',
          '授权日期',
          '授权到期',
          '授权总量'
        ];
        const aoa = [head];
        rows.forEach((r) => {
          aoa.push([
            r.Dept_One_Code,
            r.Dept_One_Name,
            r.Enable == 1 ? '启用' : '停用',
            r.Varietie_Code_New,
            r.Varietie_Name,
            r.Specification_Or_Type,
            r.Manufacturing_Ent_Name,
            r.Unit,
            fmtPrice(r.Price),
            fmtDate(r.Auth_Time),
            fmtDate(r.Auth_Valid_Date),
            r.Auth_Bulk_Cargo_Upper_Limit
          ]);
        });
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '一级科室授权');
        XLSX.writeFile(wb, `一级科室授权品种导出_${Date.now()}.xlsx`);
      } catch (e) {
        Message.error(e.message || '导出失败');
      }
    },
    async exportTwo() {
      try {
        const { rows } = await api.searchDeptTwoAuthedVarAll({
          deptTwoCode: this.two.deptTwoCode,
          varietieCondition: this.two.varietie,
          enble: this.two.enble,
          page: 1,
          size: 999999,
          field: this.two.sortField,
          order: this.two.sortOrder
        });
        const head = [
          '科室编码',
          '科室名称',
          '启用状态',
          '品种（材料）编码',
          '品种全称',
          '型号/规格',
          '单位',
          '定数包系数',
          '生产企业名称',
          '中包装数量',
          '关联RFID',
          '库存上限',
          '库存下限',
          '授权到期',
          '分组名称'
        ];
        const aoa = [head];
        rows.forEach((r) => {
          aoa.push([
            r.DEPT_TWO_CODE,
            r.DEPT_TWO_NAME,
            r.Enable == 1 ? '启用' : '停用',
            r.Varietie_Code_New,
            r.Varietie_Name,
            r.Specification_Or_Type,
            r.Unit,
            r.Def_No_Pkg_Coefficient,
            r.Manufacturing_Ent_Name,
            r.Middle_Package_Count,
            this.relatedRfidLabel(r.Related_Rfid),
            r.Def_No_Pkg_Upper,
            r.Def_No_Pkg_Lower,
            fmtDate(r.Auth_Valid_Date),
            r.GROUP_NAME
          ]);
        });
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '二级科室授权');
        XLSX.writeFile(wb, `二级科室授权品种导出_${Date.now()}.xlsx`);
      } catch (e) {
        Message.error(e.message || '导出失败');
      }
    },
    onImportOneOk(res) {
      const msg = (res && res.msg) || (typeof res === 'string' ? res : '') || '导入完成';
      Message.success(msg);
      this.loadOne(1);
    },
    onImportTwoOk(res) {
      const msg = (res && res.msg) || '导入完成';
      Message.success(msg);
      this.loadTwo(1);
    },
    onUploadErr() {
      Message.error('上传失败');
    }
  },
  mounted() {
    this.loadOne(1);
    this.loadTwo(1);
  }
};
</script>

<style scoped>
.batch-outage {
  padding: 8px;
}
.section-card {
  margin-bottom: 0;
}
.card-title {
  font-weight: 600;
}
.toolbar {
  margin-bottom: 8px;
}
.pager {
  margin-top: 10px;
  text-align: right;
}
.mt16 {
  margin-top: 16px;
}
.inline-upload {
  display: inline-block;
  margin: 0 8px;
  vertical-align: middle;
}
.batch-outage :deep(.el-table th .cell),
.batch-outage :deep(.el-table td .cell) {
  white-space: nowrap;
}
.batch-outage :deep(.el-table .cell) {
  line-height: 23px;
}
.batch-outage :deep(.el-table__header-wrapper th),
.batch-outage :deep(.el-table__fixed-header-wrapper th) {
  height: 36px;
}
</style>
