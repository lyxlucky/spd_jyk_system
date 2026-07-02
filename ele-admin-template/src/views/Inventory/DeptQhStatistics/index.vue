<template>
  <div class="ele-body spd-page dept-qh-statistics-page">
    <el-card shadow="never" class="page-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <el-form size="mini" inline @submit.native.prevent>
            <el-form-item label="品种编码">
              <el-input v-model="query.varietieCode" clearable style="width: 110px" @keyup.enter.native="reloadOos" />
            </el-form-item>
            <el-form-item label="品种名称">
              <el-input v-model="query.varietieName" clearable style="width: 180px" @keyup.enter.native="reloadOos" />
            </el-form-item>
            <el-form-item label="规格/型号">
              <el-input v-model="query.specType" clearable style="width: 110px" @keyup.enter.native="reloadOos" />
            </el-form-item>
            <el-form-item label="生产企业名称">
              <el-input v-model="query.manuEntName" clearable style="width: 120px" @keyup.enter.native="reloadOos" />
            </el-form-item>
            <el-form-item label="供应商名称">
              <el-input v-model="query.supplierName" clearable style="width: 110px" @keyup.enter.native="reloadOos" />
            </el-form-item>
            <el-form-item label="主控库区">
              <el-select v-model="query.storageId" clearable style="width: 100px" @change="reloadOos">
                <el-option label="全部" value="" />
                <el-option label="院内库区" value="1" />
                <el-option label="院外库区" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否忽略备货在途数量">
              <el-select v-model="query.isContainGoodsOnWay" style="width: 70px" @change="reloadOos">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reloadOos">查询</el-button>
              <el-button type="primary" :disabled="!oosSelection.length" @click="onStockUp">备货</el-button>
              <el-button type="primary" :disabled="!oosSelection.length" :loading="autoLockLoading" @click="onAutoLock">
                自动生成配送单
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div v-if="extendPreview" class="extend-preview">
        <el-table :data="[extendPreview]" size="mini" border>
          <el-table-column
            v-for="col in extendPreviewColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.minWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              {{
                col.prop === 'Registration_Issuing_Date' || col.prop === 'Registration_Valid_Date'
                  ? formatDate10(row[col.prop])
                  : row[col.prop]
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head spd-panel__head--split">
          <span>科室缺货列表</span>
          <span v-if="oosSelection.length" class="spd-panel__head-meta">已选 {{ oosSelection.length }} 条</span>
        </div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="oosTable"
            class="data-table"
            size="mini"
            :height="oosTableHeight"
            :columns="oosColumns"
            :datasource="oosDatasource"
            :selection.sync="oosSelection"
            :page-size="50"
            :page-sizes="[10, 50, 100, 150, 200, 300]"
            cache-key="deptQhOosTable"
            @row-click="onOosRowClick"
            @selection-change="onOosSelectionChange"
          >
            <template v-slot:toexamineTime="{ row }">{{ formatDateTime(row.Toexamine_Time) }}</template>
            <template v-slot:goodsPlan="{ row }">
              <el-input-number
                v-model="row._goodsPlan"
                size="mini"
                :min="0"
                :controls="false"
                style="width: 72px"
                :disabled="!isOosRowSelected(row)"
                @change="(val) => onGoodsPlanChange(row, val)"
              />
            </template>
            <template v-slot:storageSelect="{ row }">
              <el-select
                v-model="row._storageId"
                size="mini"
                style="width: 96px"
                :disabled="!isOosRowSelected(row)"
                @change="(val) => onStorageChange(row, val)"
              >
                <el-option
                  v-for="opt in storageOptions(row.Storage_Id)"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </template>
          </ele-pro-table>
        </div>
      </div>

      <el-row :gutter="12" class="bottom-row">
        <el-col :span="12">
          <div class="spd-sub-panel">
            <div class="spd-sub-panel__head">备货单明细</div>
            <el-form size="mini" inline class="bottom-filter" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="pickingWhere.BHDate" placeholder="YYYY-MM" clearable style="width: 100px" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="pickingWhere.SenState" style="width: 130px">
                  <el-option label="全部" value="-1" />
                  <el-option label="未发送（SPD）" value="0" />
                  <el-option label="已发送（SPD）" value="1" />
                  <el-option label="已查看（B2B）" value="2" />
                  <el-option label="处理中（B2B）" value="3" />
                  <el-option label="部分送货（B2B）" value="4" />
                  <el-option label="全部送货（B2B）" value="5" />
                  <el-option label="部分收货（SPD）" value="6" />
                  <el-option label="全部收货（SPD）" value="7" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="pickingWhere.PlanNum" placeholder="备货单号" clearable style="width: 110px" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="pickingWhere.VarietieCode"
                  placeholder="请输入关键字搜索"
                  clearable
                  style="width: 150px"
                  @keyup.enter.native="reloadPicking"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="reloadPicking">查询</el-button>
              </el-form-item>
            </el-form>
            <ele-pro-table
              ref="pickingTable"
              size="mini"
              :height="bottomTableHeight"
              highlight-current-row
              :init-load="true"
              :toolkit="[]"
              :columns="pickingColumns"
              :datasource="pickingDatasource"
              cache-key="deptQhPickingTable"
              @current-change="onPickingRowChange"
            >
              <template v-slot:storageId="{ row }">{{ formatStorageName(row.Storage_ID) }}</template>
              <template v-slot:createTime="{ row }">{{ formatDateTime(row.Create_Time) }}</template>
              <template v-slot:approveState="{ row }">{{ formatApproveState(row.Approve_State) }}</template>
              <template v-slot:sendState="{ row }">{{ formatSendState(row.Send_State) }}</template>
              <template v-slot:planRemark="{ row }">
                <el-button type="primary" size="mini" plain @click.stop="openPlanRemark(row)">备注</el-button>
              </template>
            </ele-pro-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="spd-sub-panel">
            <div class="spd-sub-panel__head row-title">
              <span>备货单明细</span>
              <el-button type="danger" size="mini" plain :disabled="!detailSelection.length" @click="onDeleteDetails">
                删除
              </el-button>
            </div>
            <ele-pro-table
              ref="detailTable"
              size="mini"
              :height="bottomTableHeight"
              :init-load="false"
              :toolkit="[]"
              :need-page="false"
              :columns="detailColumns"
              :datasource="detailDatasource"
              :selection.sync="detailSelection"
              cache-key="deptQhDetailTable"
            >
              <template v-slot:purchasePrice="{ row }">{{ formatPurchasePrice(row.Purchase_Price) }}</template>
            </ele-pro-table>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog title="备货单备注" :visible.sync="planRemarkVisible" width="600px" append-to-body>
      <el-input v-model="planRemarkText" type="textarea" :rows="8" />
      <div slot="footer">
        <el-button @click="planRemarkVisible = false">取消</el-button>
        <el-button type="primary" :loading="planRemarkSaving" @click="savePlanRemark">确定</el-button>
      </div>
    </el-dialog>

    <StockUpDialog :visible.sync="stockUpVisible" :monitor-rows="stockUpRows" @success="onStockUpSuccess" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import StockUpDialog from '@/views/Task/BhInfo/components/StockUpDialog.vue';
import {
  searchDeptOos,
  searchDeptOosExtend,
  autoLockAvailableGoods,
  getPickingList,
  getPickingInfo,
  deletePickingDetails,
  getMonitorPopup,
  showPlanRemarks,
  updatePlanRemarks
} from '@/api/Inventory/DeptQhStatistics';
import {
  buildOosColumns,
  buildPickingColumns,
  buildPickingDetailColumns,
  buildDeptQhPopupItems,
  extendPreviewColumns,
  initOosRow,
  storageOptions,
  formatDate10,
  formatDateTime,
  formatSendState,
  formatApproveState,
  formatStorageName
} from './utils';

export default {
  name: 'DeptQhStatistics',
  components: { StockUpDialog },
  data() {
    return {
      query: {
        varietieCode: '',
        varietieName: '',
        specType: '',
        manuEntName: '',
        supplierName: '',
        storageId: '',
        isContainGoodsOnWay: '1'
      },
      oosColumns: buildOosColumns(),
      oosSelection: [],
      extendPreview: null,
      extendPreviewColumns,
      pickingColumns: buildPickingColumns(),
      detailColumns: buildPickingDetailColumns(),
      pickingWhere: {
        VarietieCode: '',
        BHDate: '',
        SenState: '-1',
        PlanNum: ''
      },
      selectedPlanNo: '',
      detailSelection: [],
      stockUpVisible: false,
      stockUpRows: [],
      autoLockLoading: false,
      planRemarkVisible: false,
      planRemarkText: '',
      planRemarkPlanNo: '',
      planRemarkSaving: false,
      oosTableHeight: 'calc((100vh - 420px) / 2)',
      bottomTableHeight: 'calc((100vh - 420px) / 2 - 56px)'
    };
  },
  created() {
    this.reloadPicking();
  },
  methods: {
    formatDate10,
    formatDateTime,
    formatSendState,
    formatApproveState,
    formatStorageName,
    storageOptions,
    formatPurchasePrice(val) {
      const n = Number(val);
      return Number.isFinite(n) ? n.toFixed(4) : val;
    },
    reloadOos() {
      this.$refs.oosTable?.reload({ page: 1 });
    },
    reloadPicking() {
      this.$refs.pickingTable?.reload({ page: 1 });
    },
    oosDatasource({ page, limit }) {
      return searchDeptOos(this.query, page, limit)
        .then((res) => ({
          count: res.total,
          list: (res.result || []).map((row) => initOosRow(row))
        }))
        .catch((e) => {
          Message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    pickingDatasource({ page, limit }) {
      return getPickingList(this.pickingWhere, page, limit)
        .then((res) => ({
          count: res.total ?? 0,
          list: res.result || []
        }))
        .catch((e) => {
          Message.error(e.message || '查询备货单失败');
          return { count: 0, list: [] };
        });
    },
    detailDatasource() {
      if (!this.selectedPlanNo) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getPickingInfo(this.selectedPlanNo)
        .then((res) => ({
          count: (res.result || []).length,
          list: res.result || []
        }))
        .catch((e) => {
          Message.error(e.message || '查询明细失败');
          return { count: 0, list: [] };
        });
    },
    isOosRowSelected(row) {
      return this.oosSelection.some(
        (r) => r.Varietie_Code === row.Varietie_Code && r.Plan_Number === row.Plan_Number
      );
    },
    onOosSelectionChange() {
      this.oosSelection.forEach((row) => {
        if (row._goodsPlan == null || row._goodsPlan === '') {
          row._goodsPlan = row.In_Absence_Qty;
          row.Plan_Qty = row.In_Absence_Qty;
        }
        if (!row._storageId) {
          row._storageId = String(row.Storage_Id ?? '1');
        }
      });
    },
    onGoodsPlanChange(row, val) {
      row.Plan_Qty = val;
    },
    onStorageChange(row, val) {
      row.Storage_Id = val;
    },
    async onOosRowClick(row) {
      if (!row?.Varietie_Code) {
        this.extendPreview = null;
        return;
      }
      try {
        const info = await searchDeptOosExtend(row.Varietie_Code, row.Supplier_Code);
        this.extendPreview = info;
      } catch (e) {
        this.extendPreview = null;
        Message.error(e.message || '加载扩展信息失败');
      }
    },
    async onStockUp() {
      if (!this.oosSelection.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      try {
        const items = buildDeptQhPopupItems(this.oosSelection);
        const data = await getMonitorPopup(items);
        if (data.code == 400) {
          Message.error(data.msg || '无法生成备货单');
          return;
        }
        if (data.code != 200) {
          Message.error(data.msg || '操作失败');
          return;
        }
        const msgs = [];
        (data.result || []).forEach((item) => {
          if (item.EnableVarietie == 0) {
            msgs.push(`品种编码为 ${item.varietie_Code_New} 的品种已停用，不可生成备货单`);
          }
          if (item.EnableContract == 0) {
            msgs.push(`品种编码为 ${item.varietie_Code_New} 的合同已停用，不可生成备货单`);
          }
        });
        if (!(data.result || []).length) {
          Message.error('品种无合同，请关联合同后添加');
          return;
        }
        if (msgs.length) {
          await MessageBox.alert(msgs.join('<br>'), '提示', { dangerouslyUseHTMLString: true });
          return;
        }
        this.stockUpRows = data.result || [];
        this.stockUpVisible = true;
      } catch (e) {
        Message.error(e.message || '备货失败');
      }
    },
    onStockUpSuccess() {
      this.reloadPicking();
      this.reloadOos();
    },
    async onAutoLock() {
      if (!this.oosSelection.length) {
        Message.warning('请勾选计划单号');
        return;
      }
      const planNumbers = [...new Set(this.oosSelection.map((r) => r.Plan_Number).filter(Boolean))];
      this.autoLockLoading = true;
      try {
        const res = await autoLockAvailableGoods(planNumbers);
        Message.success(res.msg || '生成成功');
        this.reloadOos();
      } catch (e) {
        Message.error(e.message || '生成配送单失败');
      } finally {
        this.autoLockLoading = false;
      }
    },
    onPickingRowChange(row) {
      this.selectedPlanNo = row?.Stock_Up_Plan_No || '';
      this.detailSelection = [];
      this.$refs.detailTable?.reload({ page: 1 });
    },
    async onDeleteDetails() {
      if (!this.detailSelection.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      try {
        await MessageBox.confirm('确定要删除选中的数据吗?', '提示', { type: 'warning' });
        const ids = this.detailSelection.map((r) => r.ID).filter(Boolean);
        await deletePickingDetails(ids);
        Message.success('删除成功');
        this.$refs.detailTable?.reload({ page: 1 });
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '删除失败');
      }
    },
    async openPlanRemark(row) {
      const planNo = row?.Stock_Up_Plan_No;
      if (!planNo) return;
      this.planRemarkPlanNo = planNo;
      try {
        const data = await showPlanRemarks(planNo);
        this.planRemarkText = data?.result?.[0]?.Remarks || '';
        this.planRemarkVisible = true;
      } catch (e) {
        Message.error(e.message || '加载备注失败');
      }
    },
    async savePlanRemark() {
      this.planRemarkSaving = true;
      try {
        const data = await updatePlanRemarks(this.planRemarkPlanNo, this.planRemarkText);
        if (data.code == 200 || data.code === '200') {
          Message.success('保存成功');
          this.planRemarkVisible = false;
          this.reloadPicking();
        } else if (data.code == 301 || data.code === '301') {
          Message.error('登录超时，请重新登录');
        } else {
          Message.error(data.msg || '保存失败');
        }
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.planRemarkSaving = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dept-qh-statistics-page {
  padding: 8px;
}

.page-card {
  border: none;
  box-shadow: none !important;

  :deep(.el-card__body) {
    padding: 12px;
  }
}

.extend-preview {
  margin-bottom: 10px;
}

.bottom-row {
  margin-top: 10px;
}

.bottom-filter {
  margin-bottom: 8px;
}

.row-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
