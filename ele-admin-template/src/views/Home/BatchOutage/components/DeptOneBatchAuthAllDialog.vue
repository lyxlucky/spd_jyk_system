<template>
  <el-dialog
    custom-class="legacy-layer-dialog dept-one-auth-all-layer"
    title="品种批量授权"
    :visible.sync="visible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="onDialogOpened"
  >
    <!-- 与旧 Frame/DeptOneAuthVarsAllShow：layui-col-md8 + md4（约 66.7% : 33.3%） -->
    <el-row :gutter="10" class="auth-all-body">
      <el-col :span="16" class="col-pane">
        <div class="pane-head">品种</div>
        <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="varSearch" clearable placeholder="编码/名称" style="width: 200px" @keyup.enter.native="loadVar(1)" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="varGgxh" clearable placeholder="规格型号" style="width: 200px" @keyup.enter.native="loadVar(1)" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="loadVar(1)">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 外层固定高度：避免 .col-pane(flex 列) 把 el-table 默认 flex-shrink 压扁，导致 height="700" 形同虚设 -->
        <div class="auth-all-table-shell">
          <el-table
            ref="varTable"
            v-loading="varLoading"
            :data="varRows"
            :row-key="varRowKey"
            border
            stripe
            height="100%"
            @selection-change="(s) => (varSelected = s)"
          >
          <el-table-column type="selection" width="45" :reserve-selection="true" align="center"/>
          <el-table-column label="品种编码" min-width="120" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.varietie_code_new || row.Varietie_Code_New }}</template>
          </el-table-column>
          <el-table-column label="品种名称" min-width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.varietie_name || row.Varietie_Name }}</template>
          </el-table-column>
          <el-table-column label="规格型号" min-width="120" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ row.specification_or_type || row.Specification_Or_Type }}</template>
          </el-table-column>
          <el-table-column label="单位" width="60" align="center">
            <template slot-scope="{ row }">{{ row.unit || row.Unit }}</template>
          </el-table-column>
          <el-table-column label="价格" width="80" align="center">
            <template slot-scope="{ row }">{{ row.price != null ? row.price : row.Price }}</template>
          </el-table-column>
          <el-table-column label="生产企业名称" min-width="140" show-overflow-tooltip align="center">
            <template slot-scope="{ row }">{{ row.MANUFACTURING_ENT_NAME || row.Manufacturing_Ent_Name }}</template>
          </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="pager"
          small
          background
          layout="total, sizes, prev, pager, next"
          :total="varTotal"
          :page-size="varPageSize"
          :current-page="varPage"
          :page-sizes="[30, 50, 100, 150, 200, 300]"
          @size-change="onVarSizeChange"
          @current-change="loadVar"
        />
      </el-col>
      <el-col :span="8" class="col-pane">
        <div class="pane-head">科室</div>
        <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
          <el-form-item label="名称">
            <el-input v-model="deptNameKw" clearable placeholder="科室名称模糊" style="width: 160px" @keyup.enter.native="loadDept" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="loadDept">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="auth-all-table-shell">
          <el-table
            ref="deptTable"
            v-loading="deptLoading"
            :data="deptPagedRows"
            :row-key="deptRowKey"
            border
            stripe
            height="100%"
            @selection-change="(s) => (deptSelected = s)"
          >
          <el-table-column type="selection" width="45" :reserve-selection="true" align="center"/>
          <el-table-column prop="Dept_One_Name" label="科室名称" min-width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="Herp_Dept_One_Code" label="herp科室编码" min-width="110" align="center" show-overflow-tooltip />
          </el-table>
        </div>
        <el-pagination
          class="pager"
          small
          background
          layout="total, sizes, prev, pager, next"
          :total="deptTotal"
          :page-size="deptPageSize"
          :current-page="deptPage"
          :page-sizes="[99999]"
          @size-change="onDeptSizeChange"
          @current-change="onDeptPageChange"
        />
      </el-col>
    </el-row>
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="commitLoading" @click="commit">确定授权</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import * as api from '@/api/Home/Department';

export default {
  name: 'DeptOneBatchAuthAllDialog',
  data() {
    return {
      visible: false,
      varLoading: false,
      deptLoading: false,
      commitLoading: false,
      varSearch: '',
      varGgxh: '',
      varRows: [],
      varTotal: 0,
      varPage: 1,
      varPageSize: 30,
      varSelected: [],
      deptNameKw: '',
      /** 接口一次返回的一级科室全量（与旧 SearchDeptOne 一致），前端分页展示 */
      deptAllRows: [],
      deptPage: 1,
      /** 与旧 DeptOneAuthVarsAllShowTable2：layui limit 99999 */
      deptPageSize: 99999,
      deptSelected: []
    };
  },
  computed: {
    deptTotal() {
      return this.deptAllRows.length;
    },
    deptPagedRows() {
      const start = (this.deptPage - 1) * this.deptPageSize;
      return this.deptAllRows.slice(start, start + this.deptPageSize);
    }
  },
  methods: {
    varRowKey(row) {
      const c = row.varietie_code ?? row.Varietie_Code;
      if (c != null && c !== '') return `code:${String(c)}`;
      const n = row.varietie_code_new ?? row.Varietie_Code_New;
      if (n != null && n !== '') return `new:${String(n)}`;
      const name = row.varietie_name ?? row.Varietie_Name ?? '';
      const spec = row.specification_or_type ?? row.Specification_Or_Type ?? '';
      return `row:${String(name)}|${String(spec)}`;
    },
    deptRowKey(row) {
      return row.Dept_One_Code != null && row.Dept_One_Code !== '' ? String(row.Dept_One_Code) : String(row.Dept_One_Name || '');
    },
    open() {
      this.visible = true;
    },
    onDialogOpened() {
      this.varSearch = '';
      this.varGgxh = '';
      this.varSelected = [];
      this.deptSelected = [];
      this.deptNameKw = '';
      this.varPage = 1;
      this.deptPage = 1;
      this.$nextTick(() => {
        if (this.$refs.varTable) this.$refs.varTable.clearSelection();
        if (this.$refs.deptTable) this.$refs.deptTable.clearSelection();
      });
      Promise.all([this.loadVar(1), this.loadDept()]).finally(() => {
        this.$nextTick(() => {
          this.layoutTables();
          requestAnimationFrame(() => this.layoutTables());
        });
      });
    },
    /** el-table 在 dialog 开启动画未完成时测量高度会错，需在 opened 与数据就绪后 doLayout */
    layoutTables() {
      this.$refs.varTable?.doLayout?.();
      this.$refs.deptTable?.doLayout?.();
    },
    onVarSizeChange(size) {
      this.varPageSize = size;
      this.loadVar(1);
    },
    onDeptSizeChange(size) {
      this.deptPageSize = size;
      this.deptPage = 1;
    },
    onDeptPageChange(p) {
      this.deptPage = p;
      this.$nextTick(() => this.layoutTables());
    },
    async loadVar(p) {
      this.varPage = p;
      this.varLoading = true;
      try {
        const { rows, total } = await api.getOneAuthVarPage({
          VARIETIE_SEARCH_VALUE: this.varSearch,
          varGgxh: this.varGgxh,
          page: p,
          size: this.varPageSize
        });
        this.varRows = rows;
        this.varTotal = total;
      } catch (e) {
        Message.error(e.message || '加载品种失败');
      } finally {
        this.varLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async loadDept() {
      this.deptLoading = true;
      this.deptPage = 1;
      try {
        const list = await api.searchDeptOne(this.deptNameKw);
        this.deptAllRows = Array.isArray(list) ? list : [];
        this.deptSelected = [];
        this.$nextTick(() => {
          if (this.$refs.deptTable) this.$refs.deptTable.clearSelection();
        });
        const maxPage = Math.max(1, Math.ceil(this.deptTotal / this.deptPageSize) || 1);
        if (this.deptPage > maxPage) this.deptPage = maxPage;
      } catch (e) {
        Message.error(e.message || '加载科室失败');
      } finally {
        this.deptLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async commit() {
      if (!this.varSelected.length) {
        Message.warning('请至少选择一个品种');
        return;
      }
      if (!this.deptSelected.length) {
        Message.warning('请选择科室');
        return;
      }
      try {
        await MessageBox.confirm('确认授权吗？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.commitLoading = true;
      try {
        const d = await api.authVarAllDept(this.varSelected, this.deptSelected);
        if (d && (d.code === 200 || d.code === '200')) {
          Message.success(d.msg || '操作成功');
          this.visible = false;
          this.$emit('done');
        } else {
          Message.error(d?.msg || '授权失败');
        }
      } catch (e) {
        Message.error(e.message || '授权失败');
      } finally {
        this.commitLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-all-body {
  align-items: stretch;
}
.col-pane {
  display: flex;
  flex-direction: column;
}
.pane-head {
  font-weight: 600;
  margin-bottom: 6px;
  padding: 4px 0;
}
.toolbar {
  margin-bottom: 6px;
}
/* flex 子项默认可收缩，会压扁 el-table；固定壳 + 禁止收缩，表体才能稳定出现内部滚动条 */
.auth-all-table-shell {
  height: 700px;
  min-height: 700px;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
.footer-center {
  text-align: center;
}
.footer-center .el-button {
  margin: 0 10px;
}
</style>

<style>
.legacy-layer-dialog .el-dialog__body {
  padding: 12px 16px 8px;
  background: #fafafa;
}
.dept-one-auth-all-layer .col-pane .auth-all-table-shell .el-table {
  background: #fff;
}
</style>
