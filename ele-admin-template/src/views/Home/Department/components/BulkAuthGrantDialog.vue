<template>
  <el-dialog
    custom-class="legacy-layer-dialog"
    :title="'一级科室散货品种授权 — ' + deptOneName"
    :visible.sync="visible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="layoutTables"
    @closed="onClosed"
  >
    <div v-loading="bootLoading" class="bulk-auth-wrap">
      <el-table
        :data="detailRows"
        border
        size="small"
        height="120"
        empty-text="点击下方品种行查看注册/证照信息"
      >
        <el-table-column prop="Varietie_Code" label="品种（材料）编码" width="150" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="Approval_Number" label="批准文号" width="120" show-overflow-tooltip />
        <el-table-column label="发证日期" width="110">
          <template slot-scope="{ row }">{{ fmtShortDate(row.Registration_Issuing_Date) }}</template>
        </el-table-column>
        <el-table-column label="有效到期" width="110">
          <template slot-scope="{ row }">{{ fmtShortDate(row.Registration_Valid_Date) }}</template>
        </el-table-column>
        <el-table-column prop="Prod_Big_Class_Name" label="产品类型" width="100" show-overflow-tooltip />
        <el-table-column prop="Mgmt_Cat_Name" label="管理类别" width="100" show-overflow-tooltip />
        <el-table-column prop="Regulatory_Cat_Name" label="监管类别" width="100" show-overflow-tooltip />
      </el-table>

      <div class="mt8 panel-block">
        <el-form :inline="true" size="small" class="toolbar-inline" @submit.native.prevent>
          <el-form-item label="品种">
            <el-input
              v-model="keyword"
              clearable
              placeholder="编码/名称"
              style="width: 200px"
              @keyup.enter.native="search(1)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="leftTable"
          v-loading="leftLoading"
          :data="leftRows"
          border
          stripe
          height="280"
          highlight-current-row
          :row-class-name="leftRowClass"
          @selection-change="onLeftSelection"
          @row-click="onLeftRowClick"
        >
          <el-table-column type="selection" width="45" :selectable="leftRowSelectable" align="center" />
          <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="140" show-overflow-tooltip />
          <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="Specification_Or_Type" label="型号/规格" width="110" show-overflow-tooltip />
          <el-table-column prop="Unit" label="单位" width="60" />
          <el-table-column prop="Price" label="中标价" width="80" align="right" />
          <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="140" show-overflow-tooltip />
          <el-table-column label="启用状态" width="80">
            <template slot-scope="{ row }">{{ row.Enable == 1 ? '启用' : row.Enable == 0 ? '冻结' : '—' }}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pager"
          small
          background
          layout="total, sizes, prev, pager, next"
          :total="leftTotal"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[15, 20, 30, 50, 100]"
          @size-change="onPageSizeChange"
          @current-change="search"
        />
      </div>

      <div class="arrow-row">
        <el-button type="primary" size="mini" class="arrow-btn" @click="moveIn">移入 ↓</el-button>
        <el-button type="warning" size="mini" plain class="arrow-btn" @click="moveOut">↑ 移出</el-button>
      </div>

      <div class="panel-block">
          <div class="sub-title">待授权（上方勾选后移入；授权数量可不填，确定即可关联）</div>
        <el-table
          ref="rightTable"
          v-loading="rightLoading"
          :data="pendingRows"
          border
          stripe
          height="280"
          highlight-current-row
          @selection-change="(s) => (rightSelected = s)"
          @row-click="onRightRowClick"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="140" show-overflow-tooltip />
          <el-table-column prop="Varietie_Name" label="品种全称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="Specification_Or_Type" label="型号/规格" width="100" show-overflow-tooltip />
          <el-table-column prop="Unit" label="单位" width="60" />
          <el-table-column prop="Price" label="中标价" width="80" align="right" />
          <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="120" show-overflow-tooltip />
          <el-table-column label="授权模式" width="120">
            <template slot-scope="{ row }">
              <el-select v-model="row.authorizationModel" size="mini" disabled style="width: 100%">
                <el-option label="不限制" value="0" />
                <el-option label="不限时限量" value="1" />
                <el-option label="限时限量" value="2" />
                <el-option label="按年限量" value="3" />
                <el-option label="按月限量" value="4" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="授权到期" width="140">
            <template slot-scope="{ row }">
              <el-date-picker
                v-model="row.mandateExpire"
                type="date"
                value-format="yyyy-MM-dd"
                size="mini"
                style="width: 120px"
              />
            </template>
          </el-table-column>
          <el-table-column label="授权散货总数" width="110">
            <template slot-scope="{ row }">
              <el-input-number
                v-model="row.authorizedAmount"
                size="mini"
                :min="0"
                :controls="false"
                style="width: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="PDA自动申领基数" width="120">
            <template slot-scope="{ row }">
              <el-input-number
                v-model="row.autoApplyRadix"
                size="mini"
                :min="0"
                :controls="false"
                style="width: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="saving" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';
import { operatorName } from '../utils';

function mapPendingFromApi(rows) {
  // 对齐老页移入默认：模式不限制、到期 2999-01-01、数量可空、PDA基数 0
  return (rows || []).map((r) => ({
    ...r,
    authorizationModel: '0',
    mandateExpire: '2999-01-01',
    authorizedAmount: undefined,
    autoApplyRadix: 0
  }));
}

export default {
  name: 'BulkAuthGrantDialog',
  data() {
    return {
      visible: false,
      bootLoading: false,
      leftLoading: false,
      rightLoading: false,
      saving: false,
      deptOneCode: '',
      deptOneName: '',
      keyword: '',
      leftRows: [],
      leftTotal: 0,
      page: 1,
      pageSize: 20,
      serverAuthedCodes: new Set(),
      /** 上方列表灰显/禁用：已入库授权 ∪ 已成功「移入」待授权池的品种编码 */
      poolCodes: new Set(),
      leftCheckedCodes: new Set(),
      pendingRows: [],
      rightSelected: [],
      detailRows: []
    };
  },
  methods: {
    layoutTables() {
      this.$nextTick(() => {
        this.$refs.leftTable?.doLayout?.();
        this.$refs.rightTable?.doLayout?.();
      });
    },
    onPageSizeChange(size) {
      this.pageSize = size;
      this.search(1);
    },
    fmtShortDate(v) {
      if (v == null || v === '') return '—';
      const s = String(v);
      return s.length >= 10 ? s.substring(0, 10) : s;
    },
    isLeftBlocked(code) {
      return this.poolCodes.has(String(code));
    },
    leftRowSelectable(row) {
      return !this.isLeftBlocked(row.Varietie_Code);
    },
    leftRowClass({ row }) {
      return this.isLeftBlocked(row.Varietie_Code) ? 'row-server-authed' : '';
    },
    onClosed() {
      this.detailRows = [];
      this.pendingRows = [];
      this.rightSelected = [];
      this.leftCheckedCodes = new Set();
      this.poolCodes = new Set();
    },
    open(deptOneCode, deptOneName) {
      this.deptOneCode = deptOneCode;
      this.deptOneName = deptOneName;
      this.keyword = '';
      this.page = 1;
      this.pendingRows = [];
      this.rightSelected = [];
      this.leftCheckedCodes = new Set();
      this.detailRows = [];
      this.visible = true;
      this.$nextTick(() => {
        if (this.$refs.leftTable) this.$refs.leftTable.clearSelection();
        if (this.$refs.rightTable) this.$refs.rightTable.clearSelection();
      });
      this.bootstrap();
    },
    async bootstrap() {
      this.bootLoading = true;
      try {
        const list = await api.getDeptOneAuthedVarietieCodes(this.deptOneCode);
        const set = new Set();
        list.forEach((item) => {
          const c = item.Varietie_Code ?? item.varietie_Code;
          if (c) set.add(String(c));
        });
        this.serverAuthedCodes = set;
        this.poolCodes = new Set(set);
        await this.search(1);
      } catch (e) {
        Message.error(e.message || '加载已授权品种失败');
      } finally {
        this.bootLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    onLeftSelection(rows) {
      this.leftCheckedCodes = new Set(rows.map((r) => String(r.Varietie_Code)));
    },
    async onLeftRowClick(row) {
      if (!row || !row.Varietie_Code) return;
      try {
        const list = await api.getDeptOneSelectedSingleVarExtra(row.Varietie_Code);
        this.detailRows = list || [];
      } catch (e) {
        Message.error(e.message || '加载品种附加信息失败');
      }
    },
    async onRightRowClick(row) {
      if (!row || !row.Varietie_Code) return;
      await this.onLeftRowClick(row);
    },
    async search(p) {
      this.page = p;
      this.leftLoading = true;
      try {
        const start = (this.page - 1) * this.pageSize + 1;
        const end = this.page * this.pageSize;
        const { rows, total, msg } = await api.searchVarietiePageList(this.keyword || '略', start, end);
        this.leftRows = rows;
        this.leftTotal = total;
        if (total === 0 && (this.keyword || '').trim() !== '' && (this.keyword || '').trim() !== '略' && msg) {
          Message.warning(msg);
        }
        this.$nextTick(() => this.syncLeftSelection());
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.leftLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    syncLeftSelection() {
      const t = this.$refs.leftTable;
      if (!t) return;
      t.clearSelection();
      this.leftRows.forEach((row) => {
        if (this.leftCheckedCodes.has(String(row.Varietie_Code))) {
          t.toggleRowSelection(row, true);
        }
      });
    },
    async moveIn() {
      const codes = [...this.leftCheckedCodes];
      if (!codes.length) {
        Message.warning('请在上方列表勾选要移入的品种');
        return;
      }
      this.rightLoading = true;
      try {
        const { rows, count, msg } = await api.getDeptOneSelectedMutillVarExtra(codes, 1, 99999);
        if (!count && msg) {
          Message.warning(msg);
          this.pendingRows = [];
          return;
        }
        this.pendingRows = mapPendingFromApi(rows);
        this.leftCheckedCodes.forEach((c) => this.poolCodes.add(String(c)));
        this.$nextTick(() => {
          if (this.$refs.rightTable) this.$refs.rightTable.clearSelection();
        });
      } catch (e) {
        Message.error(e.message || '移入失败');
      } finally {
        this.rightLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async moveOut() {
      if (!this.rightSelected.length) {
        Message.warning('请在下方待授权表中勾选要移出的行');
        return;
      }
      const remove = new Set(this.rightSelected.map((r) => String(r.Varietie_Code)));
      remove.forEach((c) => {
        this.leftCheckedCodes.delete(c);
        if (!this.serverAuthedCodes.has(c)) this.poolCodes.delete(c);
      });
      const remain = [...this.leftCheckedCodes];
      this.rightLoading = true;
      try {
        if (!remain.length) {
          this.pendingRows = [];
        } else {
          const { rows, count, msg } = await api.getDeptOneSelectedMutillVarExtra(remain, 1, 999999);
          if (!count && msg) {
            Message.warning(msg);
            this.pendingRows = [];
          } else {
            this.pendingRows = mapPendingFromApi(rows);
          }
        }
        this.$nextTick(() => {
          this.syncLeftSelection();
          if (this.$refs.rightTable) this.$refs.rightTable.clearSelection();
        });
      } catch (e) {
        Message.error(e.message || '移出失败');
      } finally {
        this.rightLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async submit() {
      if (!this.pendingRows.length) {
        Message.warning('没有要授权的品种');
        return;
      }
      // 对齐老页：可不填数量；空数量后端→int.MaxValue，空到期→9999-12-31
      const op = operatorName(this);
      const list = this.pendingRows.map((r) => {
        const amount =
          r.authorizedAmount == null || r.authorizedAmount === '' ? '' : r.authorizedAmount;
        const expire = r.mandateExpire || '2999-01-01';
        const model = r.authorizationModel ?? '0';
        const radix =
          r.autoApplyRadix == null || r.autoApplyRadix === '' ? 0 : r.autoApplyRadix;
        return `{${r.Varietie_Code},${amount},${expire},${op},${this.deptOneCode},${model},${radix}}`;
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
.mt8 {
  margin-top: 8px;
}
.panel-block {
  width: 100%;
}
.arrow-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
}
.arrow-btn {
  min-width: 88px;
}
.pager {
  margin-top: 6px;
  text-align: right;
}
.sub-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}
.toolbar-inline {
  margin-bottom: 4px;
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
.bulk-auth-wrap .row-server-authed td {
  background-color: #f0f0f0 !important;
}
</style>
