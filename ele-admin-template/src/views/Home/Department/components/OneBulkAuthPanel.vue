<template>
  <div v-if="deptOneCode" class="auth-panel">
    <div v-if="oneDetail" class="detail-strip">
      <ul class="detail-strip-list">
        <li><span class="detail-label">一级科室编码:</span><span class="detail-value">{{ oneDetail.Dept_One_Code }}</span></li>
        <li><span class="detail-label">一级科室名称:</span><span class="detail-value">{{ oneDetail.Dept_One_Name }}</span></li>
        <li><span class="detail-label">启用状态：</span><span class="detail-value">{{ enableDetailYesNo(oneDetail.Enable) }}</span></li>
        <li><span class="detail-label">最近更新时间：</span><span class="detail-value">{{ fmtDate(oneDetail.Last_Update_Time) }}</span></li>
      </ul>
    </div>
    <div class="section-title">
      <h5>一级科室散货品种授权</h5>
    </div>
    <el-form :inline="true" size="small" class="toolbar toolbar-row1" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="keyword" clearable placeholder="请输入品种编码或名称搜索" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="enableFilter" style="width: 100px">
          <el-option label="全部" value="" />
          <el-option label="停用" value="0" />
          <el-option label="启用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
        <el-button type="primary" plain icon="el-icon-auz" @click="$refs.grantDlg.open(deptOneCode, deptOneName)">散货品种授权</el-button>
        <el-button type="primary" plain icon="el-icon-edit" :disabled="!current" @click="editRow">编辑</el-button>
        <el-button type="danger" plain :disabled="!current" @click="toggleEnable">{{ enableBtnText }}</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="batchDisable">批量停用</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="small" class="toolbar toolbar-row2" @submit.native.prevent>
      <el-form-item>
        <el-button v-if="showQrOne" plain @click="exportQr">导出二维码</el-button>
        <el-button plain @click="authAll">一键授权所有品种</el-button>
        <el-button plain @click="exportCurr">导出当前科室授权品种</el-button>
        <el-button plain @click="exportAll">导出全部科室授权品种</el-button>
        <el-button plain :disabled="!selected.length" @click="setShare(1)">设为共有库存</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="setShare(0)">取消共有库存</el-button>
        <el-button plain :disabled="!selected.length" @click="setAudit(1)">设置二级审批</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="setAudit(0)">取消二级审批</el-button>
      </el-form-item>
    </el-form>
    <div class="table-scroll">
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        :fit="false"
        border
        stripe
        height="420"
        highlight-current-row
        @current-change="(r) => (current = r)"
        @selection-change="(s) => (selected = s)"
        @sort-change="onSort"
      >
        <el-table-column type="selection" width="55" fixed />
        <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="200" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Auto_Apply_Radix" label="PDA自动申领基数" width="120" sortable="custom" />
        <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="130" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="170" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="APPROVAL_NUMBER" label="注册证号" min-width="170" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Unit" label="单位" width="80" sortable="custom" />
        <el-table-column label="中标价" width="80" sortable="custom" align="right" prop="Price">
          <template slot-scope="{ row }">{{ fmtPrice(row.Price) }}</template>
        </el-table-column>
        <el-table-column label="授权日期" width="100" sortable="custom" prop="Auth_Time">
          <template slot-scope="{ row }">{{ fmtDate(row.Auth_Time) }}</template>
        </el-table-column>
        <el-table-column label="授权到期" width="100" sortable="custom" prop="Auth_Valid_Date">
          <template slot-scope="{ row }">{{ fmtDate(row.Auth_Valid_Date) }}</template>
        </el-table-column>
        <el-table-column label="启用状态" width="80" sortable="custom" prop="Enable">
          <template slot-scope="{ row }">{{ row.Enable == 0 || row.Enable === '0' ? '停用' : row.Enable == 1 || row.Enable === '1' ? '启用' : '—' }}</template>
        </el-table-column>
        <el-table-column label="共有库存" width="80" sortable="custom" prop="IS_SHARE">
          <template slot-scope="{ row }">{{ row.IS_SHARE == 1 || row.IS_SHARE === '1' ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="Auth_Bulk_Cargo_Upper_Limit" label="授权总量" width="100" align="center" sortable="custom" />
        <el-table-column label="二级审批" width="100" align="center" prop="IS_NEED_TWO_APP">
          <template slot-scope="{ row }">{{ row.IS_NEED_TWO_APP == 1 || row.IS_NEED_TWO_APP === '1' ? '是' : '否' }}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pager"
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-size="page.size"
      :current-page="page.page"
      :page-sizes="[15, 30, 60, 90]"
      @size-change="onSize"
      @current-change="load"
    />
    <bulk-auth-grant-dialog ref="grantDlg" @saved="load(page.page)" />
    <edit-bulk-auth-dialog ref="editDlg" @saved="load(page.page)" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { HOME_HP } from '@/config/setting';
import * as api from '@/api/Home/Department';
import { fmtDate, fmtPrice, openExcelFile, openApiPdf } from '../utils';
import BulkAuthGrantDialog from './BulkAuthGrantDialog.vue';
import EditBulkAuthDialog from './EditBulkAuthDialog.vue';

export default {
  name: 'OneBulkAuthPanel',
  components: { BulkAuthGrantDialog, EditBulkAuthDialog },
  props: {
    deptOneCode: { type: String, default: '' },
    deptOneName: { type: String, default: '' },
    oneDetail: { type: Object, default: null }
  },
  data() {
    return {
      keyword: '',
      enableFilter: '',
      rows: [],
      total: 0,
      loading: false,
      current: null,
      selected: [],
      page: { page: 1, size: 15 },
      sort: { field: '', order: '' },
      showQrOne: ['nyd', 'lg'].includes(HOME_HP)
    };
  },
  computed: {
    enableBtnText() {
      if (!this.current) return '停用';
      return this.current.Enable == 1 || this.current.Enable === '1' ? '停用' : '启用';
    }
  },
  watch: {
    deptOneCode(v) {
      if (v) this.load(1);
      else {
        this.rows = [];
        this.current = null;
      }
    }
  },
  methods: {
    fmtDate,
    fmtPrice,
    enableDetailYesNo(en) {
      if (en === '1' || en === 1) return '是';
      if (en === '0' || en === 0) return '否';
      return en == null || en === '' ? '—' : String(en);
    },
    onSize(s) {
      this.page.size = s;
      this.load(1);
    },
    onSort({ prop, order }) {
      this.sort.field = prop || '';
      this.sort.order = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      this.load(this.page.page);
    },
    async load(p) {
      if (!this.deptOneCode) return;
      this.page.page = p;
      this.loading = true;
      try {
        const { rows, total } = await api.searchDeptOneAuthedVar({
          deptOneCode: this.deptOneCode,
          varietieCondition: this.keyword,
          enbale: this.enableFilter,
          page: this.page.page,
          size: this.page.size,
          field: this.sort.field,
          order: this.sort.order
        });
        this.rows = rows;
        this.total = total;
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.loading = false;
      }
    },
    editRow() {
      if (!this.current) return;
      this.$refs.editDlg.open(this.current, this.deptOneCode);
    },
    async toggleEnable() {
      if (!this.current) return;
      const isOn = this.current.Enable == 1 || this.current.Enable === '1';
      const fn = isOn ? api.disableDeptOneAuthVar : api.enableDeptOneAuthVar;
      try {
        const d = await fn(this.deptOneCode, this.current.Varietie_Code);
        if (d?.code === 200 || d?.code === '200') {
          Message.success(d.msg || '操作成功');
          this.load(this.page.page);
        } else {
          Message.error(d?.msg || '操作失败');
        }
      } catch (e) {
        Message.error(e.message);
      }
    },
    async batchDisable() {
      try {
        await MessageBox.confirm('确定批量停用勾选品种？', '提示', { type: 'warning' });
        const codes = this.selected.map((r) => r.Varietie_Code);
        const d = await api.disableDeptOneAuthVars(this.deptOneCode, codes);
        if (d?.code === 200 || d?.code === '200') {
          Message.success('已批量停用');
          this.load(this.page.page);
        } else {
          Message.error(d?.msg || '失败');
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    exportQr() {
      openApiPdf(
        `/api/DeptOneBulkCargoAuthVar/ExportQRCode?id=7&format=pdf&inline=true&deptOneCode=${this.deptOneCode}&varietieCondition=${encodeURIComponent(this.keyword)}&field=${this.sort.field}&order=${this.sort.order}&enbale=${this.enableFilter}`
      );
    },
    async authAll() {
      try {
        await MessageBox.confirm('确定一键授权所有品种？', '提示', { type: 'warning' });
        const d = await api.deptOneAuthAll(this.deptOneCode);
        Message.success(d.msg || '操作成功');
        this.load(1);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    async exportCurr() {
      try {
        const f = await api.exportDeptOneAuthedVars({
          deptOneCode: this.deptOneCode,
          varietieCondition: this.keyword,
          enbale: this.enableFilter
        });
        openExcelFile(f);
      } catch (e) {
        Message.error(e.message);
      }
    },
    async exportAll() {
      try {
        const f = await api.exportDeptOneAuthedVars({ deptOneCode: '', varietieCondition: '', enbale: '' });
        openExcelFile(f);
      } catch (e) {
        Message.error(e.message);
      }
    },
    async setShare(type) {
      const codes = this.selected.map((r) => r.Varietie_Code);
      try {
        const d = await api.upDeptOneAuthVars(this.deptOneCode, codes, type);
        Message.success(d.msg || '操作成功');
        this.load(this.page.page);
      } catch (e) {
        Message.error(e.message);
      }
    },
    async setAudit(tag) {
      const codes = this.selected.map((r) => r.Varietie_Code);
      try {
        await MessageBox.confirm('确认修改二级审批状态？', '提示');
        const d = await api.upTwoAudit(this.deptOneCode, codes, tag);
        Message.success(d.msg || '操作成功');
        this.load(this.page.page);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    getAuthCount() {
      return this.total;
    }
  }
};
</script>

<style scoped>
/* 与旧系统 Department_right_middle_jbzl 一致：横向排列；背景与下方 layui/表格白底区分 */
.detail-strip {
  background: linear-gradient(180deg, #eef2f7 0%, #e4e9f0 100%);
  border: 1px solid #c5cdd8;
  border-radius: 4px;
  padding: 10px 16px;
  margin-bottom: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}
.detail-strip-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 40px;
  row-gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.detail-strip-list li {
  float: none;
  font-size: 12px;
  line-height: 22px;
  white-space: nowrap;
}
.detail-label {
  color: #606266;
}
.detail-value {
  color: #303133;
  font-weight: 500;
  margin-left: 2px;
}
.section-title h5 {
  margin: 12px 0 8px;
  font-size: 14px;
  font-weight: 600;
}
.toolbar {
  margin-bottom: 8px;
}
.table-scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
</style>
