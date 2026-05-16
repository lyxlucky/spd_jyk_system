<template>
  <el-dialog
    custom-class="legacy-layer-dialog"
    :title="'二级科室定数包品种授权 — ' + deptTwoName"
    :visible.sync="visible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="layoutTables"
    @closed="onClosed"
  >
    <div v-loading="bootLoading" class="pkg-auth-wrap">
      <el-table :data="detailRows" border size="small" height="120" empty-text="点击品种行查看中标价与注册信息">
        <el-table-column prop="Varietie_Code" label="品种（材料）编码" width="120" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="Price" label="中标价" width="80" align="right" />
        <el-table-column prop="Approval_Number" label="批准文号" width="110" show-overflow-tooltip />
        <el-table-column label="发证日期" width="100">
          <template slot-scope="{ row }">{{ fmtShortDate(row.Registration_Issuing_Date) }}</template>
        </el-table-column>
        <el-table-column label="有效到期" width="100">
          <template slot-scope="{ row }">{{ fmtShortDate(row.Registration_Valid_Date) }}</template>
        </el-table-column>
        <el-table-column prop="Prod_Big_Class_Name" label="产品类型" width="90" show-overflow-tooltip />
        <el-table-column prop="Mgmt_Cat_Name" label="管理类别" width="90" show-overflow-tooltip />
        <el-table-column prop="Regulatory_Cat_Name" label="监管类别" width="90" show-overflow-tooltip />
      </el-table>

      <el-row :gutter="8" class="mt8 main-split">
        <el-col :span="11">
          <el-form :inline="true" size="small" class="toolbar-inline" @submit.native.prevent>
            <el-form-item label="品种">
              <el-input v-model="keyword" clearable placeholder="关键字" style="width: 160px" @keyup.enter.native="search(1)" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search(1)">查询一级散货授权</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="srcTable"
            v-loading="loading"
            :data="sourceRows"
            border
            stripe
            height="700"
            highlight-current-row
            :row-class-name="srcRowClass"
            @selection-change="onSrcSelection"
            @row-click="onSrcRowClick"
          >
            <el-table-column type="selection" width="42" :selectable="srcRowSelectable" align="center" />
            <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" show-overflow-tooltip />
            <el-table-column prop="Varietie_Name" label="品种全称" min-width="110" show-overflow-tooltip />
            <el-table-column prop="Specification_Or_Type" label="规格" width="80" show-overflow-tooltip />
            <el-table-column prop="Unit" label="单位" width="50" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Def_No_Pkg_Coefficient" label="系数" width="60" />
            <el-table-column prop="Middle_Package_Count" label="中包装数量" width="90" />
            <el-table-column prop="Big_Box_Count" label="整箱数量" width="80" />
          </el-table>
          <el-pagination
            class="pager"
            small
            background
            layout="total, sizes, prev, pager, next"
            :total="sourceTotal"
            :page-size="sourcePageSize"
            :current-page="sourcePage"
            :page-sizes="[15, 20, 30, 50]"
            @size-change="onSourcePageSizeChange"
            @current-change="search"
          />
        </el-col>
        <el-col :span="2" class="arrow-col">
          <el-button type="primary" size="mini" class="arrow-btn" @click="moveIn">移入 »</el-button>
          <el-button type="warning" size="mini" plain class="arrow-btn" @click="moveOut">« 移出</el-button>
        </el-col>
        <el-col :span="11">
          <div class="sub-title">待授权（填写参数后提交）</div>
          <el-table
            ref="grantTable"
            v-loading="grantLoading"
            :data="grantRows"
            border
            stripe
            height="700"
            highlight-current-row
            @selection-change="(s) => (grantPicked = s)"
            @row-click="onGrantRowClick"
          >
            <el-table-column type="selection" width="42" align="center" />
            <el-table-column prop="Varietie_Code_New" label="编码" width="90" show-overflow-tooltip />
            <el-table-column prop="Varietie_Name" label="名称" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Specification_Or_Type" label="规格" width="70" show-overflow-tooltip />
            <el-table-column prop="Unit" label="单位" width="45" />
            <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="90" show-overflow-tooltip />
            <el-table-column prop="Def_No_Pkg_Coefficient" label="系数" width="55" />
            <el-table-column prop="Middle_Package_Count" label="中包装" width="70" />
            <el-table-column prop="Big_Box_Count" label="整箱" width="60" />
            <el-table-column label="授权到期" width="138">
              <template slot-scope="{ row }">
                <el-date-picker v-model="row.expire" type="date" value-format="yyyy-MM-dd" size="mini" style="width: 120px" />
              </template>
            </el-table-column>
            <el-table-column label="库存上限" width="100">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.upper" size="mini" :min="0" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column label="库存下限" width="100">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.lower" size="mini" :min="0" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column label="消耗类型" width="130">
              <template slot-scope="{ row }">
                <el-select v-model="row.consumptionType" size="mini" style="width: 120px">
                  <el-option label="条码扫码即消耗" value="0" />
                  <el-option label="RFID读码消耗" value="1" />
                  <el-option label="HIS计费消耗" value="2" />
                  <el-option label="超时默认消耗" value="5" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="关联RFID" width="85">
              <template slot-scope="{ row }">
                <el-select v-model="row.rfid" size="mini" style="width: 72px">
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="PDA收货位置" width="130">
              <template slot-scope="{ row }">
                <el-select v-model="row.receivePlace" size="mini" style="width: 120px">
                  <el-option label="Spd二级科室库存" value="0" />
                  <el-option label="科室定数包暂借库" value="1" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="核算成本科室" width="130">
              <template slot-scope="{ row }">
                <el-select v-model="row.costDeptState" size="mini" style="width: 120px">
                  <el-option label="不核算为当前科室" value="0" />
                  <el-option label="核算为当前科室" value="1" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="HIS暂借记录" width="100">
              <template slot-scope="{ row }">
                <el-select v-model="row.hisNeedTempRecord" size="mini" style="width: 88px">
                  <el-option label="需要" value="1" />
                  <el-option label="不需要" value="0" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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

function rowKey(r) {
  return `${r.Varietie_Code}-${r.Def_No_Pkg_Coefficient}`;
}

function inConditionsFromKeys(keys) {
  const arr = [...keys];
  if (!arr.length) return '';
  return `${arr.join(',')},`;
}

export default {
  name: 'PkgAuthGrantDialog',
  data() {
    return {
      visible: false,
      bootLoading: false,
      loading: false,
      grantLoading: false,
      saving: false,
      deptOneCode: '',
      deptTwoCode: '',
      deptTwoName: '',
      keyword: '',
      sourceRows: [],
      sourceTotal: 0,
      sourcePage: 1,
      sourcePageSize: 20,
      serverAuthedKeys: new Set(),
      /** 左侧灰显/禁用：已入库 ∪ 已成功移入待授权池的 code-coef */
      poolKeys: new Set(),
      leftCheckedKeys: new Set(),
      grantRows: [],
      grantPicked: [],
      detailRows: []
    };
  },
  methods: {
    layoutTables() {
      this.$nextTick(() => {
        this.$refs.srcTable?.doLayout?.();
        this.$refs.grantTable?.doLayout?.();
      });
    },
    onSourcePageSizeChange(size) {
      this.sourcePageSize = size;
      this.search(1);
    },
    fmtShortDate(v) {
      if (v == null || v === '') return '—';
      const s = String(v);
      return s.length >= 10 ? s.substring(0, 10) : s;
    },
    onClosed() {
      this.grantRows = [];
      this.grantPicked = [];
      this.leftCheckedKeys = new Set();
      this.poolKeys = new Set();
      this.detailRows = [];
    },
    isSrcBlocked(row) {
      return this.poolKeys.has(rowKey(row));
    },
    srcRowSelectable(row) {
      return !this.isSrcBlocked(row);
    },
    srcRowClass({ row }) {
      return this.isSrcBlocked(row) ? 'row-server-authed' : '';
    },
    open(deptOneCode, deptTwoCode, deptTwoName) {
      this.deptOneCode = deptOneCode;
      this.deptTwoCode = deptTwoCode;
      this.deptTwoName = deptTwoName;
      this.keyword = '';
      this.grantRows = [];
      this.grantPicked = [];
      this.leftCheckedKeys = new Set();
      this.detailRows = [];
      this.sourcePage = 1;
      this.visible = true;
      this.$nextTick(() => {
        if (this.$refs.srcTable) this.$refs.srcTable.clearSelection();
        if (this.$refs.grantTable) this.$refs.grantTable.clearSelection();
      });
      this.bootstrap();
    },
    async bootstrap() {
      this.bootLoading = true;
      try {
        const list = await api.getDeptTwoAuthedVarietieCodes(this.deptTwoCode);
        const set = new Set();
        list.forEach((item) => {
          const k = `${item.Varietie_Code}-${item.Def_No_Pkg_Coefficient}`;
          set.add(k);
        });
        this.serverAuthedKeys = set;
        this.poolKeys = new Set(set);
        await this.search(1);
      } catch (e) {
        Message.error(e.message || '加载已定数包授权失败');
      } finally {
        this.bootLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    onSrcSelection(rows) {
      this.leftCheckedKeys = new Set(rows.map(rowKey));
    },
    async onSrcRowClick(row) {
      if (!row || !row.Varietie_Code) return;
      try {
        const list = await api.getDeptTwoDefNoPkgAuthVarExtraList(row.Varietie_Code);
        this.detailRows = list || [];
      } catch (e) {
        Message.error(e.message || '加载品种附加信息失败');
      }
    },
    async onGrantRowClick(row) {
      if (!row || !row.Varietie_Code) return;
      await this.onSrcRowClick(row);
    },
    async search(p) {
      this.sourcePage = p;
      this.loading = true;
      try {
        const start = (p - 1) * this.sourcePageSize + 1;
        const end = p * this.sourcePageSize;
        const { rows, total } = await api.searchDeptOneBulkForPkg(this.deptOneCode, this.keyword || '略', start, end);
        this.sourceRows = rows;
        this.sourceTotal = total;
        this.$nextTick(() => this.syncSrcSelection());
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    syncSrcSelection() {
      const t = this.$refs.srcTable;
      if (!t) return;
      t.clearSelection();
      this.sourceRows.forEach((row) => {
        if (this.leftCheckedKeys.has(rowKey(row))) {
          t.toggleRowSelection(row, true);
        }
      });
    },
    async moveIn() {
      const cond = inConditionsFromKeys(this.leftCheckedKeys).trim();
      if (!cond) {
        Message.warning('请在左侧勾选要移入的品种（定数包编码-系数）');
        return;
      }
      this.grantLoading = true;
      try {
        const { rows } = await api.getDeptTwoSelectedAuthVarExtra(cond, 1, 9999);
        this.grantRows = (rows || []).map((r) => ({
          ...r,
          expire: '2099-01-01',
          upper: 0,
          lower: 0,
          consumptionType: '0',
          rfid: '0',
          receivePlace: '0',
          costDeptState: '1',
          hisNeedTempRecord: '1'
        }));
        this.leftCheckedKeys.forEach((k) => this.poolKeys.add(k));
        this.$nextTick(() => {
          if (this.$refs.grantTable) this.$refs.grantTable.clearSelection();
        });
      } catch (e) {
        Message.error(e.message || '移入失败');
      } finally {
        this.grantLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async moveOut() {
      if (!this.grantPicked.length) {
        Message.warning('请在右侧待授权表中勾选要移出的行');
        return;
      }
      this.grantPicked.forEach((r) => {
        const k = rowKey(r);
        this.leftCheckedKeys.delete(k);
        if (!this.serverAuthedKeys.has(k)) this.poolKeys.delete(k);
      });
      const cond = inConditionsFromKeys(this.leftCheckedKeys).trim();
      this.grantLoading = true;
      try {
        if (!cond) {
          this.grantRows = [];
        } else {
          const { rows } = await api.getDeptTwoSelectedAuthVarExtra(cond, 1, 9999);
          this.grantRows = (rows || []).map((r) => ({
            ...r,
            expire: '2099-01-01',
            upper: 0,
            lower: 0,
            consumptionType: '0',
            rfid: '0',
            receivePlace: '0',
            costDeptState: '1',
            hisNeedTempRecord: '1'
          }));
        }
        this.$nextTick(() => {
          this.syncSrcSelection();
          if (this.$refs.grantTable) this.$refs.grantTable.clearSelection();
        });
      } catch (e) {
        Message.error(e.message || '移出失败');
      } finally {
        this.grantLoading = false;
        this.$nextTick(() => this.layoutTables());
      }
    },
    async submit() {
      if (!this.grantRows.length) {
        Message.warning('没有要授权的品种');
        return;
      }
      const list = this.grantRows.map((r) => {
        return `{${this.deptTwoCode},${r.Def_No_Pkg_Code},${r.upper},${r.lower},${r.consumptionType},${r.expire},${r.rfid},${r.receivePlace},${r.costDeptState},${r.hisNeedTempRecord}}`;
      });
      this.saving = true;
      try {
        const ok = await api.insertDeptTwoPkgAuth(list);
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
.main-split {
  align-items: stretch;
}
.arrow-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding-top: 48px;
}
.arrow-btn {
  width: 88px;
}
.pager {
  margin: 6px 0;
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
.pkg-auth-wrap .row-server-authed td {
  background-color: #f0f0f0 !important;
}
</style>
