<template>
  <div class="invoice-panel">
    <div class="panel-grid">
      <div class="col-bill">
        <div class="spd-section invoice-section">
          <div class="spd-section__head">月结单号</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">筛选</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search year-row-form" @submit.native.prevent="handleBillSearch">
                <el-form-item label="月结年份">
                  <el-select v-model="year" style="width: 100px" @change="handleBillSearch">
                    <el-option v-for="y in yearOptions" :key="y" :label="String(y)" :value="String(y)" />
                  </el-select>
                </el-form-item>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="handleBillSearch" />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div class="year-row">
            <span>月结年份:</span>
            <el-select v-model="year" size="mini" style="width: 100px" @change="loadBillList(1)">
              ...
            </el-select>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="loadBillList(1)" />
          </div> -->
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">月结单列表</div>
            <div class="spd-table-panel__wrap">
              <el-table v-loading="billLoading" :data="billRows" border stripe size="mini" height="calc(100vh - 100px)" highlight-current-row @current-change="onBillSelect">
                <el-table-column prop="MonthNumber" label="月结单号" min-width="100" show-overflow-tooltip />
                <el-table-column prop="sDate" label="月结月份" width="90" />
                <el-table-column prop="StartDate" label="月结首日" width="95">
                  <template slot-scope="{ row }">
                    <el-input v-if="editingId === row.ID" v-model="editBuf.StartDate" size="mini" @blur="saveEdit(row, 'STARTDATE')" />
                    <span v-else @dblclick="startEdit(row)">{{ row.StartDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="EndDate" label="月结末日" width="95">
                  <template slot-scope="{ row }">
                    <el-input v-if="editingId === row.ID" v-model="editBuf.EndDate" size="mini" @blur="saveEdit(row, 'ENDDATE')" />
                    <span v-else @dblclick="startEdit(row)">{{ row.EndDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="月结总额" width="120" align="right">
                  <template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template>
                </el-table-column>
                <el-table-column prop="Remarks" label="备注" min-width="120" show-overflow-tooltip />
                <el-table-column prop="sDate" label="日期" width="120" />
              </el-table>
              <el-pagination small layout="total, prev, pager, next" :total="billTotal" :page-size="billPage.size" :current-page.sync="billPage.page" class="section-pager" @current-change="loadBillList" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-supplier">
        <div class="spd-section invoice-section invoice-section--stretch">
          <div class="spd-section__head">供应商</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">查询与打印</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search tool-row-form" @submit.native.prevent="handleSupplierSearch">
                <el-form-item label="查询">
                  <el-input v-model="supplierSearch" clearable placeholder="请输入查询" style="width: 160px" @keyup.enter.native="handleSupplierSearch" />
                </el-form-item>
                <el-form-item v-if="showJcSelect" label="集采">
                  <el-select v-model="isJc" placeholder="集采" style="width: 120px">
                    <el-option label="集采-全部" value="" />
                    <el-option label="集采-是" value="1" />
                    <el-option label="集采-否" value="0" />
                    <el-option label="征兵办" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" icon="el-icon-search" @click="handleSupplierSearch" />
                  <span class="tip">注意:勾选过的号码才会发送HRP</span>
                  <el-button type="primary" :disabled="!selectedBill" @click="invPrintOutbound">打印供应商销售出库单</el-button>
                  <el-button type="primary" :disabled="!selectedBill" @click="invPrintOutboundSummary">打印供应商销售出库单(汇总)</el-button>
                  <el-button v-if="hp === 'lg' || hp === 'nyd'" @click="invPrintGysSummary">打印供应商汇总统计表</el-button>
                  <el-button v-if="hp === 'lg' || hp === 'nyd'" @click="invPrintGysDetail">打印供应商供货明细表</el-button>
                  <el-button v-if="hp === 'szlhfy'" @click="invExcelGZSupOutbound">妇幼出库单(供应商送货章)</el-button>
                  <el-button v-if="hp === 'szlhfy'" @click="invExcelStorageMonth">妇幼出库单（供应商）</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div class="tool-row">
            <el-input v-model="supplierSearch" size="mini" clearable placeholder="请输入查询" style="width: 160px" @keyup.enter.native="loadSupplierList(1)" />
            ...
          </div>
          <div class="tool-row">...</div>
          <div v-if="showJcSelect" class="tool-row">...</div>
          <div v-if="hp === 'szlhfy'" class="tool-row">...</div> -->
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">供应商列表</div>
            <div class="spd-table-panel__wrap">
              <el-table v-loading="supplierLoading" :data="supplierRows" border stripe size="mini" height="calc(100vh - 100px)" @selection-change="onSupplierCheck" @row-click="onSupplierRowClick">
                <el-table-column type="selection" width="40" align="center"/>
                <template v-if="hp === 'stzl'">
                  <el-table-column prop="Supplier_Code" label="供应商编码" width="90" show-overflow-tooltip />
                  <el-table-column prop="Supplier_Name" label="供应商名称" min-width="110" show-overflow-tooltip />
                  <el-table-column label="化验材料" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.HY_Material) }}</template></el-table-column>
                  <el-table-column label="维修材料" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.WX_Material) }}</template></el-table-column>
                  <el-table-column label="医疗设备" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YL_Material) }}</template></el-table-column>
                  <el-table-column label="医疗用品" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YL_Use) }}</template></el-table-column>
                  <el-table-column label="低值500元以上" width="100" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.LowPrice) }}</template></el-table-column>
                  <el-table-column label="固定专业设备" width="95" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.GD_Equipment) }}</template></el-table-column>
                  <el-table-column label="放射材料" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.FS_Material) }}</template></el-table-column>
                  <el-table-column label="其他材料" width="80" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.QT_Material) }}</template></el-table-column>
                </template>
                <template v-else>
                  <el-table-column prop="Supplier_Code_Charging" label="医院系统编码" width="100" show-overflow-tooltip />
                  <el-table-column prop="PRINT_COUNT" label="打印次数" width="70" />
                  <el-table-column prop="Supplier_Code" label="供应商编码" width="90" show-overflow-tooltip />
                  <el-table-column prop="Supplier_Name" label="供应商名称" min-width="110" show-overflow-tooltip />
                  <el-table-column label="化验材料" width="78" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.HY_Material) }}</template></el-table-column>
                  <el-table-column label="X光照材料" width="85" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.X_Material) }}</template></el-table-column>
                  <el-table-column label="医疗材料" width="78" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YL_Material) }}</template></el-table-column>
                  <el-table-column label="医疗用品" width="78" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YL_Use) }}</template></el-table-column>
                  <el-table-column label="一次性耗材" width="90" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YCX_Material) }}</template></el-table-column>
                  <el-table-column label="应急物质" width="78" align="right"><template slot-scope="{ row }">{{ fmtMoney(row.YJWZ_Material) }}</template></el-table-column>
                  <el-table-column label="其他" width="68" align="center"><template slot-scope="{ row }">{{ fmtMoney(row.QTWZ_Material) }}</template></el-table-column>
                </template>
                <el-table-column label="合计" width="120" align="center" fixed="right"><template slot-scope="{ row }">{{ fmtMoney(row.Money) }}</template></el-table-column>
              </el-table>
              <el-pagination small layout="total, prev, pager, next" :total="supplierTotal" :page-size="supplierPage.size" :current-page.sync="supplierPage.page" class="section-pager" @current-change="loadSupplierList" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-invoice">
        <div class="spd-section invoice-section invoice-section--stretch">
          <div class="spd-section__head">发票号码</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__head">审批与更新</div>
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search inv-header-form" @submit.native.prevent>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" :disabled="!canBillApprove" @click="invBillApprove">月结审批</el-button>
                </el-form-item>
                <el-form-item label="月份">
                  <el-date-picker v-model="fpMonth" type="month" value-format="yyyy-MM" placeholder="选择月结月份更新发票" style="width: 180px" />
                </el-form-item>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button @click="onUpWxtFph">更新发票(微讯通)</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="spd-panel spd-table-panel">
            <div class="spd-panel__head">发票列表</div>
            <div class="spd-table-panel__wrap">
              <el-table v-loading="invoiceLoading" :data="invoiceRows" border stripe size="mini" height="calc(100vh - 100px)">
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column prop="BillNum" label="发票号码" min-width="120" align="center" show-overflow-tooltip />
                <el-table-column label="发票金额" width="100" align="center"><template slot-scope="{ row }">{{ fmtMoney(row.Price) }}</template></el-table-column>
                <el-table-column label="状态" width="80"><template slot-scope="{ row }">{{ row.State == 0 ? '未审批' : '已审批' }}</template></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/Settle/MensualBills';
import invoiceActionsMixin from '../invoiceActionsMixin';
import { HOME_HP, fmtMoney } from '../utils';

export default {
  name: 'InvoiceNumberPanel',
  mixins: [invoiceActionsMixin],
  data() {
    const y = new Date().getFullYear();
    return {
      hp: HOME_HP,
      year: String(y),
      yearOptions: [y + 1, y, y - 1, y - 2, y - 3, y - 4, y - 5, y - 6],
      billLoading: false,
      supplierLoading: false,
      invoiceLoading: false,
      billRows: [],
      supplierRows: [],
      invoiceRows: [],
      billTotal: 0,
      billPage: { page: 1, size: 10 },
      supplierTotal: 0,
      supplierPage: { page: 1, size: 20 },
      supplierSearch: '',
      selectedBill: null,
      selectedSupplier: null,
      supplierCheckRows: [],
      checkedSupplierCodes: '',
      fpMonth: '',
      isJc: '',
      editingId: null,
      editBuf: { StartDate: '', EndDate: '' }
    };
  },
  computed: {
    showJcSelect() {
      return ['fszxy', 'fsdwrmyy', 'fsdl'].includes(this.hp);
    },
    canBillApprove() {
      return !!this.checkedSupplierCodes && !!this.selectedBill;
    }
  },
  mounted() {
    this.loadBillList(1);
  },
  methods: {
    fmtMoney,
    async handleBillSearch() {
      await this.loadBillList(1);
      if (!this.billRows.length) {
        this.$message.info(`${this.year}年未查询到月结单`);
      }
    },
    async loadBillList(page) {
      this.billPage.page = page || 1;
      this.billLoading = true;
      try {
        const res = await api.getMonthNumber({ page: this.billPage.page, size: this.billPage.size, year: this.year });
        this.billRows = res.result || [];
        this.billTotal = res.total || 0;
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.billLoading = false;
      }
    },
    onBillSelect(row) {
      this.selectedBill = row;
      this.checkedSupplierCodes = '';
      this.supplierCheckRows = [];
      this.loadSupplierList(1);
      this.loadInvoiceList();
    },
    startEdit(row) {
      this.editingId = row.ID;
      this.editBuf = { StartDate: row.StartDate, EndDate: row.EndDate };
    },
    async saveEdit(row, target) {
      const field = target === 'STARTDATE' ? 'StartDate' : 'EndDate';
      const val = this.editBuf[field];
      if (val === row[field]) { this.editingId = null; return; }
      try {
        await api.updateMonthNumber({ target, content: val, MONTHLY_BALANCE_NUMBER: row.MonthNumber });
        this.loadBillList(this.billPage.page);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.editingId = null;
      }
    },
    async handleSupplierSearch() {
      if (!this.selectedBill) {
        this.$message.warning('请先在「月结单列表」中选择一条月结单');
        return;
      }
      await this.loadSupplierList(1);
      if (!this.supplierRows.length) {
        this.$message.info('未查询到符合条件的供应商');
      }
    },
    async loadSupplierList(page) {
      if (!this.selectedBill) { this.supplierRows = []; return; }
      this.supplierPage.page = page || 1;
      this.supplierLoading = true;
      try {
        const fn = this.hp === 'stzl' ? api.getSupplierZL : api.getSupplier;
        const res = await fn({ page: this.supplierPage.page, size: this.hp === 'stzl' ? 20 : 99999, SerachName: this.supplierSearch, ID: this.selectedBill.ID });
        this.supplierRows = res.result || [];
        this.supplierTotal = res.total || 0;
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.supplierLoading = false;
      }
    },
    onSupplierCheck(rows) {
      this.supplierCheckRows = rows;
      this.checkedSupplierCodes = rows.map((r) => r.Supplier_Code).join(',') + (rows.length ? ',' : '');
      if (rows.length) { this.selectedSupplier = rows[rows.length - 1]; this.loadInvoiceList(); }
    },
    onSupplierRowClick(row) { this.selectedSupplier = row; },
    async loadInvoiceList() {
      if (!this.selectedBill) { this.invoiceRows = []; return; }
      this.invoiceLoading = true;
      try {
        const res = await api.showBill({ MonthID: this.selectedBill.ID, SupplyCode: this.checkedSupplierCodes || (this.selectedSupplier?.Supplier_Code || '') });
        this.invoiceRows = res.result || [];
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.invoiceLoading = false;
      }
    },
    onUpWxtFph() { this.invUpWxtFph(this.fpMonth); }
  }
};
</script>

<style scoped lang="scss">
.invoice-panel {
  min-height: calc(100vh - 180px);
}

.panel-grid {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.col-bill {
  width: 22%;
  min-width: 248px;
  flex-shrink: 0;
}

.col-supplier {
  flex: 1;
  min-width: 0;
}

.col-invoice {
  width: 22%;
  min-width: 248px;
  flex-shrink: 0;
}

.invoice-section {
  background: #fff;
}

.invoice-section--stretch {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .spd-table-panel {
    flex: 1;
    min-height: 0;
  }
}

.section-pager {
  margin-top: 8px;
  padding: 0 8px 4px;
  text-align: right;
}

.tip {
  font-size: 12px;
  color: #909399;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

.year-row-form,
.tool-row-form,
.inv-header-form {
  :deep(.el-form-item:not(.ele-form-actions) .el-form-item__content) {
    max-width: none;
  }
}

/* .year-row, .tool-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; }
.sub-title { font-weight: 600; font-size: 13px; }
.inv-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; } */
</style>
