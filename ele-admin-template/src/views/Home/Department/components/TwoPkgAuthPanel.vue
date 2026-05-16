<template>
  <div v-if="deptTwoCode" class="auth-panel">
    <div v-if="twoDetail" class="detail-strip">
      <ul class="detail-strip-list">
        <li><span class="detail-label">二级科室编码:</span><span class="detail-value">{{ twoDetail.Dept_Two_Code }}</span></li>
        <li><span class="detail-label">二级科室名称:</span><span class="detail-value">{{ twoDetail.Dept_Two_Name }}</span></li>
        <li><span class="detail-label">所属一级科室：</span><span class="detail-value">{{ twoDetail.Dept_One_Name }}</span></li>
        <li><span class="detail-label">最近更新时间：</span><span class="detail-value">{{ fmtDate(twoDetail.Last_Update_Time) }}</span></li>
        <li><span class="detail-label">是否接收B2B骨科预送货单：</span><span class="detail-value">{{ b2bPreLabel(twoDetail.Receive_B2b_Pre_Enable) }}</span></li>
        <li><span class="detail-label">PDA定数码收货位置：</span><span class="detail-value">{{ receivePlaceLabel(twoDetail.Receive_Place) }}</span></li>
        <li><span class="detail-label">结算方式：</span><span class="detail-value">{{ balanceTypeLabel(twoDetail.Balance_Type) }}</span></li>
      </ul>
    </div>
    <div class="section-title">
      <h5>二级科室定数包品种授权</h5>
    </div>
    <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="keyword" clearable placeholder="请输入品种编码或名称搜索" style="width: 160px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
        <el-button type="primary" plain icon="el-icon-auz" @click="openGrant">定数包品种授权</el-button>
        <el-button type="primary" plain icon="el-icon-edit" :disabled="!current" @click="editRow">编辑</el-button>
        <el-button type="primary" plain :disabled="!current" @click="toggleEnable">{{ enableBtnText }}</el-button>
        <el-button type="danger" plain icon="el-icon-delete" :disabled="!selected.length" @click="batchDelete">删除</el-button>
        <el-button type="danger" plain :disabled="!selected.length" @click="batchDisable">批量停用</el-button>
        <el-button plain @click="exportAll">导出全部科室授权品种</el-button>
        <el-button plain @click="exportCurr">导出当前科室授权品种</el-button>
        <el-button v-if="showQrTwo" plain @click="exportQr">导出二维码</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="small" class="purchase-row">
      <el-form-item>
        <label class="purchase-label">采购申报的品种范围：</label>
        <el-select v-model="purchaseSource" style="width: 160px">
          <el-option v-for="o in purchaseOptions" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="savePurchaseSource">确定</el-button>
      </el-form-item>
    </el-form>
    <div class="table-scroll">
      <el-table
        v-loading="loading"
        :data="rows"
        :fit="false"
        border
        stripe
        height="400"
        highlight-current-row
        @current-change="(r) => (current = r)"
        @selection-change="(s) => (selected = s)"
        @sort-change="onSort"
      >
        <el-table-column type="selection" width="48" fixed align="center" />
        <el-table-column prop="Varietie_Code_New" label="品种（材料）编码" width="80" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Varietie_Name" label="品种全称" min-width="200" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="100" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Unit" label="单位" width="70" sortable="custom" />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="140" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="APPROVAL_NUMBER" label="注册证号" min-width="140" sortable="custom" show-overflow-tooltip />
        <el-table-column label="临床使用安全级别" min-width="140" sortable="custom" prop="CLINICAL_USE_SAFETY_LEVEL">
          <template slot-scope="{ row }">{{ clinicalLevel(row.CLINICAL_USE_SAFETY_LEVEL) }}</template>
        </el-table-column>
        <el-table-column prop="Def_No_Pkg_Coefficient" label="定数包系数" width="80" align="center" sortable="custom" />
        <el-table-column prop="Middle_Package_Count" label="中包装数量" width="80" align="center" sortable="custom" />
        <el-table-column prop="Big_Box_Count" label="整箱数量" width="80" align="center" sortable="custom" />
        <el-table-column label="消耗类型" width="100" sortable="custom" prop="Consumption_Type">
          <template slot-scope="{ row }">{{ consumptionLabel(row.Consumption_Type) }}</template>
        </el-table-column>
        <el-table-column label="HIS对冲是否需要暂借记录" width="80" sortable="custom" prop="His_Need_Temp_Record">
          <template slot-scope="{ row }">{{ hisNeedLabel(row.His_Need_Temp_Record ?? row.HisNeedTempRecord) }}</template>
        </el-table-column>
        <el-table-column label="启用状态" width="80" sortable="custom" prop="Enable">
          <template slot-scope="{ row }">{{ row.Enable == 0 || row.Enable === '0' ? '停用' : row.Enable == 1 || row.Enable === '1' ? '启用' : '' }}</template>
        </el-table-column>
        <el-table-column label="关联RFID" width="80" sortable="custom" prop="Related_Rfid">
          <template slot-scope="{ row }">{{ relatedRfidLabel(row.Related_Rfid) }}</template>
        </el-table-column>
        <el-table-column label="PDA定数包收货位置" width="150" sortable="custom" prop="Var_Receive_Place">
          <template slot-scope="{ row }">{{ varReceivePlace(row.Var_Receive_Place) }}</template>
        </el-table-column>
        <el-table-column label="是否核算为当前科室" width="150" prop="Cost_Dept_State" align="center">
          <template slot-scope="{ row }">{{ costDeptState(row.Cost_Dept_State ?? row.CostDeptState) }}</template>
        </el-table-column>
        <el-table-column label="是否主动配送" width="80" prop="IS_AUTH_SEND" align="center">
          <template slot-scope="{ row }">{{ yn(row.IS_AUTH_SEND) }}</template>
        </el-table-column>
        <el-table-column prop="Def_No_Pkg_Upper" label="库存上限" width="90" align="center" />
        <el-table-column prop="Def_No_Pkg_Lower" label="库存下限" width="90" align="center" />
        <el-table-column label="空定数码对冲" width="80" prop="IS_HIS_CAN_NULL" align="center">
          <template slot-scope="{ row }">{{ yn(row.IS_HIS_CAN_NULL) }}</template>
        </el-table-column>
        <el-table-column label="空定数码对冲开始时间" width="80" prop="HIS_CAN_NULL_STATR_TIME" align="center">
          <template slot-scope="{ row }">{{ fmtDate(row.HIS_CAN_NULL_STATR_TIME) }}</template>
        </el-table-column>
        <el-table-column prop="REGION_NAME" label="默认库区" width="90" align="center" />
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
    <pkg-auth-grant-dialog ref="grantDlg" @saved="load(page.page)" />
    <edit-pkg-auth-dialog ref="editDlg" @saved="load(page.page)" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { HOME_HP } from '@/config/setting';
import * as api from '@/api/Home/Department';
import { fmtDate, openExcelFile, openApiPdf } from '../utils';
import PkgAuthGrantDialog from './PkgAuthGrantDialog.vue';
import EditPkgAuthDialog from './EditPkgAuthDialog.vue';

export default {
  name: 'TwoPkgAuthPanel',
  components: { PkgAuthGrantDialog, EditPkgAuthDialog },
  props: {
    deptOneCode: { type: String, default: '' },
    deptTwoCode: { type: String, default: '' },
    deptTwoName: { type: String, default: '' },
    twoDetail: { type: Object, default: null }
  },
  data() {
    return {
      keyword: '',
      rows: [],
      total: 0,
      loading: false,
      current: null,
      selected: [],
      page: { page: 1, size: 15 },
      sort: { field: '', order: '' },
      purchaseSource: '1',
      purchaseOptions: [
        { label: '一级科室授权范围', value: '1' },
        { label: '二级科室授权范围', value: '2' }
      ],
      showQrTwo: HOME_HP === 'stzl'
    };
  },
  computed: {
    enableBtnText() {
      if (!this.current) return '停用';
      return this.current.Enable == 1 || this.current.Enable === '1' ? '停用' : '启用';
    }
  },
  watch: {
    deptTwoCode(v) {
      if (v) {
        this.load(1);
        this.loadPurchaseSource();
      } else {
        this.rows = [];
        this.current = null;
      }
    }
  },
  methods: {
    fmtDate,
    b2bPreLabel(v) {
      if (v === '0' || v === 0) return '不接收(默认)';
      if (v === '1' || v === 1) return '接收';
      return '无数据';
    },
    receivePlaceLabel(v) {
      if (v === '0' || v === 0) return 'Spd二级科室库存';
      if (v === '1' || v === 1) return '科室定数包暂借库';
      return '无数据';
    },
    balanceTypeLabel(v) {
      if (v === '0' || v === 0) return '用后结算';
      if (v === '1' || v === 1) return '收货结算';
      return '未设置';
    },
    clinicalLevel(v) {
      if (v === '1' || v === 1) return '一级';
      if (v === '2' || v === 2) return '二级';
      if (v === '3' || v === 3) return '三级';
      return '';
    },
    consumptionLabel(t) {
      const m = { 0: '条码扫码即消耗', 1: 'RFID读码消耗', 2: 'HIS计费消耗', 3: '散货申领消耗', 5: '超时默认消耗' };
      return m[Number(t)] ?? '';
    },
    hisNeedLabel(v) {
      if (v === '1' || v === 1) return '需要';
      if (v === '0' || v === 0) return '不需要';
      return '未设置';
    },
    varReceivePlace(v) {
      if (v === '0' || v === 0) return 'Spd二级科室库存';
      if (v === '1' || v === 1) return '科室定数包暂借库';
      return '';
    },
    relatedRfidLabel(v) {
      if (v === '0' || v === 0) return '否';
      if (v === '1' || v === 1) return '是';
      return '';
    },
    costDeptState(v) {
      if (v === '1' || v === 1) return '核算为当前科室';
      if (v === '0' || v === 0) return '核算到计费科室';
      if (v === '2' || v === 2) return '出库即核销';
      return '未知';
    },
    yn(v) {
      if (v === '1' || v === 1) return '是';
      if (v === '0' || v === 0) return '否';
      return '未知';
    },
    openGrant() {
      this.$refs.grantDlg.open(this.deptOneCode, this.deptTwoCode, this.deptTwoName);
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
      if (!this.deptTwoCode) return;
      this.page.page = p;
      this.loading = true;
      try {
        const { rows, total } = await api.searchDeptTwoAuthedVar({
          deptTwoCode: this.deptTwoCode,
          varietieCondition: this.keyword,
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
    async loadPurchaseSource() {
      try {
        const v = await api.getPurchaseDeptSource(this.deptTwoCode);
        const val = v != null ? String(v) : '';
        if (val === '2') {
          this.purchaseOptions = [
            { label: '二级科室授权范围', value: '2' },
            { label: '一级科室授权范围', value: '1' }
          ];
          this.purchaseSource = '2';
        } else if (val === '1') {
          this.purchaseOptions = [
            { label: '一级科室授权范围', value: '1' },
            { label: '二级科室授权范围', value: '2' }
          ];
          this.purchaseSource = '1';
        } else {
          this.purchaseOptions = [
            { label: '一级科室授权范围', value: '1' },
            { label: '二级科室授权范围', value: '2' }
          ];
          this.purchaseSource = '1';
        }
      } catch {
        /* ignore */
      }
    },
    async savePurchaseSource() {
      try {
        const d = await api.setPurchaseDeptSource(this.deptTwoCode, this.purchaseSource);
        Message.success(d.msg || '保存成功');
      } catch (e) {
        Message.error(e.message);
      }
    },
    editRow() {
      if (!this.current) return;
      this.$refs.editDlg.open(this.current, this.deptTwoCode);
    },
    async toggleEnable() {
      if (!this.current) return;
      const fn = this.current.Enable == 1 || this.current.Enable === '1' ? api.disableAuthedVar : api.enableAuthedVar;
      try {
        const d = await fn(this.current.Pkg_Auth_Var_Code);
        if (d?.code === 200 || d?.code === '200') {
          Message.success(d.msg || '成功');
          this.load(this.page.page);
        } else {
          Message.error(d?.msg || '失败');
        }
      } catch (e) {
        Message.error(e.message);
      }
    },
    async batchDisable() {
      try {
        await MessageBox.confirm('确定批量停用？', '提示', { type: 'warning' });
        const codes = this.selected.map((r) => r.Pkg_Auth_Var_Code);
        const d = await api.disableAuthedVars(codes);
        if (d?.code === 200 || d?.code === '200') {
          Message.success('已批量停用');
          this.load(this.page.page);
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    async batchDelete() {
      try {
        await MessageBox.confirm('确定删除勾选授权？', '提示', { type: 'warning' });
        const codes = this.selected.map((r) => r.Pkg_Auth_Var_Code);
        const d = await api.deleteDeptAuthVar(codes);
        if (d?.code === 200 || d?.code === '200') {
          Message.success(d.msg || '删除成功');
          this.load(this.page.page);
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message);
      }
    },
    exportQr() {
      openApiPdf(
        `/api/DeptTwoDefNoPkgAuthVar/ExportQRCode?id=7&format=pdf&inline=true&deptTwoCode=${this.deptTwoCode}&varietieCondition=${encodeURIComponent(this.keyword)}&field=${this.sort.field}&order=${this.sort.order}`
      );
    },
    async exportCurr() {
      try {
        const f = await api.exportDeptTwoAuthVars(this.deptTwoCode);
        openExcelFile(f);
      } catch (e) {
        Message.error(e.message);
      }
    },
    async exportAll() {
      try {
        const f = await api.exportDeptTwoAuthVars('');
        openExcelFile(f);
      } catch (e) {
        Message.error(e.message);
      }
    },
    getAuthCount() {
      return this.total;
    }
  }
};
</script>

<style scoped>
/* 与旧系统 Department_right_middle_jbzl1 一致：横向排列；背景与下方表格区区分 */
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
  column-gap: 32px;
  row-gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.detail-strip-list li {
  font-size: 12px;
  line-height: 22px;
  flex: 0 1 auto;
  max-width: 420px;
}
.detail-label {
  color: #606266;
}
.detail-value {
  color: #303133;
  font-weight: 500;
  margin-left: 2px;
  word-break: break-all;
}
.section-title h5 {
  margin: 12px 0 8px;
  font-size: 14px;
  font-weight: 600;
}
.toolbar {
  margin-bottom: 8px;
}
.purchase-row {
  margin-bottom: 8px;
}
.purchase-label {
  border: 1px solid green;
  padding: 2px 6px;
  margin-right: 4px;
  font-size: 13px;
  color: #606266;
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
