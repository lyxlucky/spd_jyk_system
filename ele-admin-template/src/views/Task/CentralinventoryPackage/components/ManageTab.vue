<template>
  <div class="cip-manage-tab">
    <div class="section-title">请选择制包品种</div>
    <el-form :inline="true" size="mini" class="toolbar">
      <el-form-item>
        <el-input
          v-model="searchFilters.condition"
          placeholder="品种编码、名称、生产企业、规格、供应商"
          clearable
          style="width: 360px"
          @keyup.enter.native="reloadSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchFilters.storageId" placeholder="收货库区" clearable style="width: 120px" @change="reloadSearch">
          <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadSearch">查询</el-button>
        <el-button type="success" :disabled="!searchSelection.length" @click="handleAddLock">添加</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="searchTable"
      size="mini"
      height="340px"
      :columns="searchColumns"
      :datasource="searchDatasource"
      :selection.sync="searchSelection"
      cache-key="cipSearchTable"
    >
      <template v-slot:validDate="{ row }">
        <span :class="{ 'near-expiry': isNearExpiry(row.Batch_Validity_Period) }">
          {{ formatDate10(row.Batch_Validity_Period) }}
        </span>
      </template>
      <template v-slot:coefficient="{ row }">
        <el-select v-model="row._coefficient" size="mini" style="width: 70px" :disabled="!isSearchRowSelected(row)">
          <el-option v-for="item in row.Coefficients || []" :key="item" :label="item" :value="item" />
        </el-select>
      </template>
      <template v-slot:makeQty="{ row }">
        <el-input-number
          v-model="row._makeQty"
          :min="0"
          size="mini"
          controls-position="right"
          style="width: 90px"
          :disabled="!isSearchRowSelected(row)"
        />
      </template>
      <template v-slot:defStock="{ row }">
        <el-button type="text" size="mini" @click="showDefStock(row)">查看</el-button>
      </template>
    </ele-pro-table>

    <el-row :gutter="10" style="margin-top: 12px">
      <el-col :span="20">
        <div class="section-title">已添加的制包品种列表</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-input v-model="lockedFilters.bagMaker" placeholder="制包人/品种编码/名称" clearable style="width: 220px" @keyup.enter.native="reloadLocked" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="reloadLocked">查询</el-button>
            <el-button type="primary" @click="filterMyAccount">本账号制包</el-button>
            <el-button type="warning" :disabled="!lockedSelection.length" @click="handleConvertUdi">转换为UDI制包</el-button>
          </el-form-item>
          <el-form-item class="toolbar-right">
            <el-button type="danger" :disabled="!canDeleteLocked" @click="handleDeleteLocked">删除</el-button>
            <el-button type="success" :disabled="!canGenerateDef" @click="handleGenerateDef">生成定数包标签</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="lockedTable"
          size="mini"
          height="340px"
          highlight-current-row
          :columns="lockedColumns"
          :datasource="lockedDatasource"
          :current.sync="selectedLocked"
          :selection.sync="lockedSelection"
          cache-key="cipLockedTable"
          @current-change="onLockedChange"
          @selection-change="onLockedSelectionChange"
        >
          <template v-slot:bagState="{ row }">{{ formatBagMakingState(row.Bag_Making_State) }}</template>
          <template v-slot:prodDate="{ row }">{{ formatDate10(row.Batch_Production_Date) }}</template>
          <template v-slot:validDateLocked="{ row }">{{ formatDate10(row.Batch_Validity_Period) }}</template>
          <template v-slot:resetAction="{ row }">
            <el-button type="text" size="mini" @click.stop="handleReset(row)">重置</el-button>
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="4">
        <div class="section-title">定数包标签列表</div>
        <el-select v-model="printType" size="mini" style="width: 100%; margin-bottom: 8px">
          <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" size="mini" style="width: 100%; margin-bottom: 8px" :disabled="!canPrintShelf" @click="handlePrintShelf">
          上架打印
        </el-button>
        <ele-pro-table
          ref="defCodeTable"
          size="mini"
          height="300px"
          :init-load="false"
          :toolkit="[]"
          :columns="defCodeColumns"
          :datasource="defCodeDatasource"
          cache-key="cipDefCodeTable"
        />
      </el-col>
    </el-row>

    <el-dialog title="定数包库存" :visible.sync="defStockVisible" width="560px" append-to-body>
      <el-table :data="defStockList" size="mini" border>
        <el-table-column prop="Coefficient" label="系数" width="80" align="center" />
        <el-table-column prop="StockQty" label="库存数量" width="100" align="center" />
        <el-table-column prop="LimitQty" label="上限数量" width="100" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <span :class="Number(row.StockQty) >= Number(row.LimitQty) ? 'stock-warning' : 'stock-normal'">
              {{ Number(row.StockQty) >= Number(row.LimitQty) ? '已达上限' : '正常' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStorageList,
  searchVarietie,
  getDefNoPkgStockLimit,
  lockVarietieQuantityV2,
  loadLockedVarietiesV2,
  unlockVarietieQuantity,
  generateVarietieDefCodes,
  showVarietieDefCodes,
  upShelf,
  resetLadleMaking,
  convertToUdi
} from '@/api/Task/CentralinventoryPackage';
import {
  LABEL_OPTIONS,
  cipHpFlags,
  unwrapData,
  isOkCode,
  formatDate10,
  formatBagMakingState,
  isNearExpiry,
  validateLockItems,
  buildLockItems,
  normalizeSearchRows,
  openManagePrint,
  getExpiryWarning
} from '../utils';

export default {
  name: 'ManageTab',
  data() {
    return {
      storageList: [],
      searchFilters: { condition: '', storageId: '', field: '', order: '' },
      lockedFilters: { bagMaker: '' },
      searchSelection: [],
      lockedSelection: [],
      selectedLocked: null,
      printType: '3',
      labelOptions: LABEL_OPTIONS,
      defStockVisible: false,
      defStockList: [],
      addingLock: false,
      searchColumns: [
        { type: 'selection', width: 45, align: 'center' },
        { prop: 'Name', label: '仓库名称', width: 100 },
        { prop: 'Varietie_Code', label: '品种(材料)编码', width: 160, sortable: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 100 },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120 },
        { prop: 'Unit', label: '单位', width: 60, align: 'center' },
        { prop: 'Supply_Price', label: '价格', width: 70, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 140 },
        { prop: 'Batch', label: '生产批号', width: 120, sortable: true },
        { columnKey: 'validDate', label: '失效日期', width: 100, slot: 'validDate' },
        { prop: 'Supplier_Name', label: '供应商', minWidth: 100 },
        { columnKey: 'coefficient', label: '系数', width: 90, slot: 'coefficient' },
        { prop: 'Up_Quantity', label: '可用散货数量', width: 140, align: 'center' },
        { columnKey: 'defStock', label: '定数包库存', width: 140, slot: 'defStock' },
        { columnKey: 'makeQty', label: '制包数量', width: 100, slot: 'makeQty' },
        { prop: 'KC_DAY', label: '在库天数', width: 100, align: 'center' }
      ],
      lockedColumns: [
        { type: 'selection', width: 45, align: 'center' },
        { prop: 'Name', label: '仓库名称', width: 120 },
        { prop: 'Bag_Maker', label: '制包人', width: 100 },
        { prop: 'Varietie_Code', label: '品种(材料)编码', width: 140 },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 100 },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120 },
        { prop: 'Unit', label: '单位', width: 80, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 140 },
        { prop: 'Batch', label: '生产批号', width: 120 },
        { columnKey: 'prodDate', label: '生产日期', width: 120, slot: 'prodDate' },
        { columnKey: 'validDateLocked', label: '失效日期', width: 100, slot: 'validDateLocked' },
        { prop: 'Supplier_Name', label: '供应商', minWidth: 100 },
        { prop: 'Coefficient', label: '系数', width: 80, align: 'center' },
        { prop: 'Bag_Making_Number', label: '制包单号', width: 120 },
        { prop: 'Pack_Plan_Quantity', label: '制包数量', width: 120, align: 'center' },
        { columnKey: 'bagState', label: '是否制包', width: 100, slot: 'bagState' },
        { columnKey: 'resetAction', label: '操作', width: 70, slot: 'resetAction' }
      ],
      defCodeColumns: [
        { prop: 'DEF_NO_PKG_CODE', label: '定数码', align: 'center' },
        { prop: 'UDI', label: 'UDI', align: 'center', showOverflowTooltip: true }
      ]
    };
  },
  computed: {
    canDeleteLocked() {
      return this.lockedSelection.length > 0 && this.lockedSelection.every((r) => String(r.Bag_Making_State) === '0');
    },
    canGenerateDef() {
      return this.lockedSelection.length > 0 && this.lockedSelection.every((r) => String(r.Bag_Making_State) === '0');
    },
    canPrintShelf() {
      return (
        this.lockedSelection.length > 0 &&
        this.lockedSelection.every((r) => String(r.Bag_Making_State) === '1')
      );
    }
  },
  mounted() {
    this.loadStorage();
    this.reloadLocked();
  },
  methods: {
    formatDate10,
    formatBagMakingState,
    isNearExpiry,
    loadStorage() {
      getStorageList().then((res) => {
        const data = unwrapData(res);
        this.storageList = data?.result || [];
      });
    },
    isSearchRowSelected(row) {
      return this.searchSelection.some((item) => item.Up_Shelf_Id === row.Up_Shelf_Id);
    },
    searchDatasource({ page, limit, order }) {
      if (order?.sort) {
        this.searchFilters.field = order.sort;
        this.searchFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return searchVarietie({
        page,
        limit,
        where: this.searchFilters
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: normalizeSearchRows(data.result || []) };
      });
    },
    lockedDatasource({ page, limit }) {
      return loadLockedVarietiesV2({
        page,
        limit,
        where: { bagMaker: this.lockedFilters.bagMaker, state: '0' }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    defCodeDatasource({ page, limit }) {
      if (!this.selectedLocked?.Bag_Making_Paln_Batch_Id) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return showVarietieDefCodes({
        page,
        limit,
        where: { batchId: this.selectedLocked.Bag_Making_Paln_Batch_Id }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    reloadSearch() {
      this.searchSelection = [];
      this.$refs.searchTable?.reload({ page: 1 });
    },
    reloadLocked() {
      this.selectedLocked = null;
      this.lockedSelection = [];
      this.$refs.lockedTable?.reload({ page: 1 });
      this.reloadDefCodes();
    },
    reloadDefCodes() {
      this.$refs.defCodeTable?.reload({ page: 1 });
    },
    onLockedChange() {
      this.reloadDefCodes();
    },
    onLockedSelectionChange() {
      /* selection state drives button disabled */
    },
    filterMyAccount() {
      this.lockedFilters.bagMaker = this.$store.state.user?.info?.Nickname || '';
      this.reloadLocked();
    },
    handleAddLock() {
      if (this.addingLock) {
        this.$message.warning('网络数据延迟，请重试');
        return;
      }
      const msg = validateLockItems(this.searchSelection);
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      const warn = getExpiryWarning(this.searchSelection);
      if (warn) {
        this.$message.warning(warn);
      }
      this.addingLock = true;
      const loading = this.$loading({ lock: true });
      lockVarietieQuantityV2(JSON.stringify(buildLockItems(this.searchSelection)))
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '已成功保存');
            this.reloadSearch();
            this.reloadLocked();
          } else {
            this.$message.error(data?.msg || '添加失败');
          }
        })
        .finally(() => {
          this.addingLock = false;
          loading.close();
        });
    },
    handleDeleteLocked() {
      this.$confirm('确定要删除选中的数据吗?', '提示', { type: 'warning' })
        .then(() => {
          const json = JSON.stringify(
            this.lockedSelection.map((row) => `{${row.Bag_Making_Paln_Batch_Id}}`)
          );
          const loading = this.$loading({ lock: true });
          return unlockVarietieQuantity(json)
            .then((res) => {
              const ok = unwrapData(res) === true || unwrapData(res) === 'true';
              if (ok) {
                this.$message.success('删除成功');
                this.reloadSearch();
                this.reloadLocked();
              } else {
                this.$message.error('删除失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handleGenerateDef() {
      this.$confirm('确定要生成定数包标签吗?', '提示', { type: 'warning' })
        .then(() => {
          const json = JSON.stringify(
            this.lockedSelection.map((row) => row.Bag_Making_Paln_Batch_Id)
          );
          const loading = this.$loading({ lock: true });
          return generateVarietieDefCodes(json)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '生成成功');
                this.reloadSearch();
                this.reloadLocked();
              } else {
                this.$message.error(data?.msg || '生成失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    handlePrintShelf() {
      const storageId = this.lockedSelection[0]?.Storage_Id;
      if (!this.lockedSelection.every((item) => item.Storage_Id === storageId)) {
        this.$message.warning('不能打印不同仓库的品种');
        return;
      }
      const batchIds = this.lockedSelection.map((item) => item.Bag_Making_Paln_Batch_Id);
      const json = JSON.stringify(batchIds);
      const loading = this.$loading({ lock: true });
      upShelf(json)
        .then((res) => {
          const data = unwrapData(res);
          if (!isOkCode(data?.code)) {
            this.$message.error(data?.msg || '上架失败');
            return;
          }
          if (cipHpFlags.isFszxy) {
            batchIds.forEach((id) => {
              window.open(
                openManagePrint(this.printType, [id])
              );
            });
            return;
          }
          const url = openManagePrint(this.printType, batchIds);
          if (url) window.open(url);
        })
        .finally(() => {
          loading.close();
          this.reloadLocked();
          this.reloadDefCodes();
        });
    },
    handleReset(row) {
      resetLadleMaking(row.Bag_Making_Paln_Batch_Id).then((res) => {
        const data = unwrapData(res);
        if (isOkCode(data?.code)) {
          this.$message.success(data.msg || '重置成功');
          this.reloadLocked();
        } else {
          this.$message.error(data?.msg || '重置失败');
        }
      });
    },
    handleConvertUdi() {
      this.$confirm('确定转换为UDI制包吗?', '提示', { type: 'warning' })
        .then(() => {
          const ids = this.lockedSelection.map((r) => r.Bag_Making_Number).join(',');
          const loading = this.$loading({ lock: true });
          return convertToUdi(ids)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '转换成功');
                this.reloadLocked();
              } else if (data?.code === 301 || data?.code === '301') {
                this.$message.error(data.msg || '登录失效');
              } else {
                this.$message.error(data?.msg || '转换失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    showDefStock(row) {
      getDefNoPkgStockLimit(row.Varietie_Code, row.Storage_Id).then((res) => {
        const data = unwrapData(res);
        if (isOkCode(data?.code)) {
          this.defStockList = data.result || [];
          this.defStockVisible = true;
        } else {
          this.$message.error(data?.msg || '获取库存失败');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.section-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.toolbar {
  margin-bottom: 4px;
}
.toolbar-right {
  float: right;
}
.near-expiry {
  color: #e6a23c;
}
.stock-warning {
  color: #d9534f;
  font-weight: 600;
}
.stock-normal {
  color: #009688;
  font-weight: 600;
}
</style>
