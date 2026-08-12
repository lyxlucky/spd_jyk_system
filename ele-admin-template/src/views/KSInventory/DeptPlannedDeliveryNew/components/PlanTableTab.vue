<template>
  <div class="plan-table-tab">
    <!-- 查询条件 -->
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body">
      <el-form size="mini" class="search-form" @submit.native.prevent @keyup.enter.native="reload">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="计划单号" label-width="72px">
              <el-input v-model="where.planNumber" clearable placeholder="科室计划单号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="品种" label-width="72px">
              <el-input v-model="where.varietieCodeNew" clearable placeholder="编码/名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商" label-width="72px">
              <el-input v-model="where.dp_new_sup" clearable placeholder="供应商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="规格型号" label-width="72px">
              <el-input v-model="where.specType" clearable placeholder="型号/规格" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="生产企业" label-width="72px">
              <el-input v-model="where.manEntName" clearable placeholder="生产企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="申领人" label-width="72px">
              <el-input v-model="where.deptPlanMan" clearable placeholder="申领人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="二级科室" label-width="72px">
              <el-input v-model="where.deptTwoName" clearable placeholder="SPD二级科室" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="起始时间" label-width="72px">
              <el-date-picker
                v-model="where.dateFrom"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="计划起始"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="终止时间" label-width="72px">
              <el-date-picker
                v-model="where.dateTo"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="计划终止"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="剩余为0" label-width="72px">
              <el-select v-model="where.containLeftZero" style="width: 100%">
                <el-option label="不包含" value="0" />
                <el-option label="包含" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="剔除" label-width="72px">
              <el-select v-model="where.isDelete" style="width: 100%">
                <el-option label="未剔除" value="1" />
                <el-option label="全部" value="" />
                <el-option label="已剔除" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="中标" label-width="72px">
              <el-select v-model="where.planIsZb" clearable placeholder="全部" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="中标" value="1" />
                <el-option label="未中标" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :span="4">
            <el-form-item label="暂挂" label-width="72px">
              <el-select v-model="where.planIsZg" clearable placeholder="全部" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="暂挂" value="1" />
                <el-option label="未暂挂" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="检验科" label-width="72px">
              <el-select v-model="where.planIsJYK" clearable placeholder="全部" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="不含检验科" value="0" />
                <el-option label="检验科" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="耗材" label-width="72px">
              <el-select v-model="where.planIsHcfl" clearable placeholder="全部" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="低值" value="0" />
                <el-option label="高值" value="1" />
                <el-option label="试剂" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类型" label-width="72px">
              <el-select v-model="where.OPERATE_TYPE" clearable placeholder="全部" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="科研" value="1" />
                <el-option label="普通" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="72px">
              <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="spd-panel">
      <div class="spd-panel__head spd-panel__head--split spd-panel__head-toolbar">
        <span class="spd-panel__title">操作</span>
        <div class="storage-select">
          <span class="storage-label">库区</span>
          <el-select v-model="localStorageId" size="mini" style="width: 130px" @change="onStorageChange">
            <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
          </el-select>
        </div>
      </div>
      <div class="spd-toolbar">
        <div class="spd-toolbar__group">
          <span class="spd-toolbar__label">生成</span>
          <div class="spd-toolbar__btns">
            <el-button size="mini" type="primary" @click="onTransferGoodsApply">散货申领单</el-button>
            <el-button size="mini" type="primary" @click="onPickList">拣配单</el-button>
            <el-button size="mini" type="primary" @click="onBagMaking">定数包</el-button>
            <el-button size="mini" type="primary" @click="onStockUp">备货</el-button>
          </div>
        </div>
        <div class="spd-toolbar__divider" />
        <div class="spd-toolbar__group">
          <span class="spd-toolbar__label">维护</span>
          <div class="spd-toolbar__btns">
            <el-button size="mini" @click="onChangeLeftApply">变更剩余申请</el-button>
            <el-button size="mini" @click="lcVisible = true">临采详情</el-button>
            <el-button size="mini" @click="onReplaceVar">替换品种</el-button>
            <el-button size="mini" @click="onExport">导出</el-button>
            <el-button size="mini" @click="onPending(1)">暂挂</el-button>
            <el-button size="mini" @click="onPending(0)">取消暂挂</el-button>
            <el-button size="mini" @click="onBatchRemark">批量备注</el-button>
          </div>
        </div>
        <div class="spd-toolbar__divider" />
        <div class="spd-toolbar__group">
          <div class="spd-toolbar__btns">
            <el-button size="mini" type="danger" plain @click="onShutdownPlan">强制结束</el-button>
            <el-button size="mini" type="danger" plain @click="onDeleteDetail">删除明细</el-button>
          </div>
        </div>
      </div>
      <div class="spd-filter-bar">
        <span class="spd-filter-bar__label">计划状态</span>
        <el-checkbox-group v-model="where.planState" size="mini" @change="reload">
          <el-checkbox label="6">新增</el-checkbox>
          <el-checkbox label="3">未收全</el-checkbox>
          <el-checkbox label="4">已收全</el-checkbox>
          <el-checkbox label="10">强制结束</el-checkbox>
        </el-checkbox-group>
        <span class="spd-filter-bar__divider" />
        <el-select v-model="where.planIsZxk_sh" size="mini" class="plan-filter-select" clearable placeholder="散货库存" @change="reload">
          <el-option label="散货-全部" value="" />
          <el-option label="散货-有" value="1" />
          <el-option label="散货-无" value="0" />
        </el-select>
        <el-select v-model="where.planIsZxk_dsb" size="mini" class="plan-filter-select" clearable placeholder="定数包库存" @change="reload">
          <el-option label="定数包-全部" value="" />
          <el-option label="定数包-有" value="1" />
          <el-option label="定数包-无" value="0" />
        </el-select>
        <el-select v-model="where.isHaveBh" size="mini" class="plan-filter-select" clearable placeholder="已转备货" @change="reload">
          <el-option label="备货-全部" value="" />
          <el-option label="备货-是" value="1" />
          <el-option label="备货-否" value="0" />
        </el-select>
        <el-select v-model="where.STORAGE_TYPE" size="mini" class="plan-filter-select" clearable placeholder="存储条件" @change="reload">
          <el-option label="条件-全部" value="" />
          <el-option label="常温" value="0" />
          <el-option label="阴凉" value="1" />
          <el-option label="冷藏" value="2" />
          <el-option label="冷冻" value="3" />
        </el-select>
        <el-select v-model="where.RELATED_RFID" size="mini" class="plan-filter-select" clearable placeholder="RFID" @change="reload">
          <el-option label="RFID-全部" value="" />
          <el-option label="RFID-否" value="0" />
          <el-option label="RFID-是" value="1" />
        </el-select>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span class="spd-panel__title">科室计划列表</span>
        <span class="spd-panel__head-meta">
          共 {{ planTotal }} 条
          <template v-if="selection.length">，已选 {{ selection.length }} 条</template>
        </span>
      </div>
      <div class="spd-table-panel__wrap">
        <vxe-grid
          ref="table"
          class="plan-compact-table"
          size="mini"
          border
          stripe
          show-overflow
          :height="tableHeight"
          :loading="tableLoading"
          :columns="columns"
          :data="tableRows"
          :row-config="{ keyField: 'Dtl_Id', isCurrent: true, isHover: true }"
          :checkbox-config="{ highlight: true, reserve: true }"
          :virtual-y-config="{ enabled: true, gt: 80 }"
          @checkbox-change="onCheckboxChange"
          @checkbox-all="onCheckboxChange"
          @current-change="onCurrentChange"
          @cell-click="onPlanCellClick"
        >
          <template #deptTwoName="{ row }">
            <span v-if="row.SECOND_APP_DEPT_NAME" style="color: red">
              {{ row.Dept_Two_Name }}/{{ row.SECOND_APP_DEPT_NAME }}
            </span>
            <span v-else>{{ row.Dept_Two_Name }}</span>
          </template>
          <template #planQty="{ row }">
            <el-input-number
              :value="getPlanQty(row)"
              size="mini"
              :min="0"
              :disabled="!isRowSelected(row)"
              :controls="false"
              style="width: 50px"
              @change="(val) => setPlanQty(row, val)"
            />
          </template>
          <template #rowStorage="{ row }">
            <el-select
              :value="getRowStorage(row)"
              size="mini"
              :disabled="!isRowSelected(row)"
              style="width: 80px"
              @change="(val) => setRowStorage(row, val)"
            >
              <el-option label="院内库区" value="1" />
              <el-option label="院外库区" value="2" />
            </el-select>
          </template>
          <template #batchInfo="{ row }">
            <el-button type="primary" size="mini" class="plan-cell-btn" @click.stop="openBatchInfo(row)">查看</el-button>
          </template>
          <template #actions="{ row }">
            <el-button type="primary" size="mini" class="plan-cell-btn" @click.stop="openSpdRemark(row)">SPD备注</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              class="plan-cell-btn plan-cell-btn--wide"
              @click.stop="openChangeQty(row)"
            >
              变更申请数量
            </el-button>
          </template>
        </vxe-grid>
        <div class="plan-table-pager">
          <el-pagination
            background
            small
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="page"
            :page-size="limit"
            :page-sizes="pageSizes"
            :total="planTotal"
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
          />
        </div>
      </div>
    </div>

    <GoodsApplyDialog
      :visible.sync="goodsApplyVisible"
      :mode="goodsApplyMode"
      :rows="goodsApplyRows"
      :storage-id="localStorageId"
      :storage-label="storageLabel"
      @success="reload"
    />
    <PickListDialog
      :visible.sync="pickListVisible"
      :rows="pickListRows"
      :storage-id="localStorageId"
      :storage-label="storageLabel"
      @success="reload"
    />
    <BagMakingDialog
      :visible.sync="bagMakingVisible"
      :rows="bagMakingRows"
      :storage-label="storageLabel"
      @success="reload"
    />
    <BatchInfoDialog :visible.sync="batchInfoVisible" :rows="batchInfoRows" @success="reload" />
    <SpdRemarkDialog :visible.sync="spdRemarkVisible" :dtl-id="activeDtlId" @success="reload" />
    <ChangeApplyQtyDialog :visible.sync="changeQtyVisible" :row="activeRow" @success="reload" />
    <BatchRemarkDialog
      :visible.sync="batchRemarkVisible"
      :dtl-ids="selection.map((r) => r.Dtl_Id)"
      @success="reload"
    />
    <ReplaceVarDialog
      :visible.sync="replaceVarVisible"
      :dtl-id="currentRow?.Dtl_Id"
      :varietie-code-new="currentRow?.Varietie_Code_New"
      :varietie-name="currentRow?.Varietie_Name"
      @success="reload"
    />
    <StockUpDialog :visible.sync="stockUpVisible" :monitor-rows="stockUpRows" @success="onStockUpSuccess" />
    <LcNumDialog :visible.sync="lcVisible" />
  </div>
</template>

<script>
import {
  searchDeptPlanMsg,
  searchDeptPlanCoefficientMsg,
  prepareBagMaking,
  searchVarietieBatchIds,
  getMonitorPopup,
  upDeptPlanZG,
  shutdownPlanNumber,
  delDetid
} from '@/api/KSInventory/DeptPlannedDeliveryNew';
import StockUpDialog from '@/views/Task/BhInfo/components/StockUpDialog.vue';
import LcNumDialog from '@/views/Inventory/CentralinventoryMonitoring/components/LcNumDialog.vue';
import GoodsApplyDialog from './GoodsApplyDialog.vue';
import PickListDialog from './PickListDialog.vue';
import BagMakingDialog from './BagMakingDialog.vue';
import BatchInfoDialog from './BatchInfoDialog.vue';
import SpdRemarkDialog from './SpdRemarkDialog.vue';
import ChangeApplyQtyDialog from './ChangeApplyQtyDialog.vue';
import BatchRemarkDialog from './BatchRemarkDialog.vue';
import ReplaceVarDialog from './ReplaceVarDialog.vue';
import {
  buildPlanColumns,
  buildStockUpItems,
  defaultPlanWhere,
  exportPlanTable,
  validateGoodsApplySelection,
  validatePickListSelection
} from '../utils';

export default {
  name: 'PlanTableTab',
  components: {
    GoodsApplyDialog,
    PickListDialog,
    BagMakingDialog,
    BatchInfoDialog,
    SpdRemarkDialog,
    ChangeApplyQtyDialog,
    BatchRemarkDialog,
    ReplaceVarDialog,
    StockUpDialog,
    LcNumDialog
  },
  props: {
    storageId: String,
    storageList: { type: Array, default: () => [] }
  },
  data() {
    return {
      where: defaultPlanWhere(),
      columns: buildPlanColumns(),
      selection: [],
      tableRows: [],
      tableLoading: false,
      currentRow: null,
      localStorageId: '',
      planQtyMap: {},
      rowStorageMap: {},
      goodsApplyVisible: false,
      goodsApplyMode: 'apply',
      goodsApplyRows: [],
      pickListVisible: false,
      pickListRows: [],
      bagMakingVisible: false,
      bagMakingRows: [],
      batchInfoVisible: false,
      batchInfoRows: [],
      spdRemarkVisible: false,
      changeQtyVisible: false,
      batchRemarkVisible: false,
      replaceVarVisible: false,
      stockUpVisible: false,
      stockUpRows: [],
      lcVisible: false,
      activeDtlId: '',
      activeRow: {},
      exporting: false,
      // 对齐老系统 layui table height: 450；略减以留给底部分页条
      tableHeight: 420,
      planLoaded: false,
      planTotal: 0,
      page: 1,
      limit: 99999,
      pageSizes: [20, 50, 100, 300, 99999],
      // 切换菜单 keep-alive 时还原表格滚动位置
      savedScroll: { top: 0, left: 0 }
    };
  },
  computed: {
    storageLabel() {
      const item = this.storageList.find((s) => String(s.ID) === String(this.localStorageId));
      return item?.NAME || '';
    }
  },
  watch: {
    storageId: {
      immediate: true,
      handler(val) {
        if (!val) return;
        const changed = String(this.localStorageId) !== String(val);
        this.localStorageId = val;
        // 库区异步到位后再查；避免进页时 STORAGE_ID 为空导致无数据
        // keep-alive 再次激活时不重查（planLoaded 已为 true 且库区未变）
        if (changed || !this.planLoaded) {
          this.$nextTick(() => this.reload());
        }
      }
    }
  },
  activated() {
    this.$nextTick(() => this.restoreTableScroll());
  },
  deactivated() {
    this.captureTableScroll();
  },
  methods: {
    onStorageChange(val) {
      this.$emit('storage-change', val);
      this.reload();
      // 备货单清空由父级 onStorageChange / plan-data-change 统一处理
    },
    captureTableScroll() {
      const $grid = this.$refs.table;
      if (!$grid || typeof $grid.getScroll !== 'function') return;
      const scroll = $grid.getScroll() || {};
      this.savedScroll = {
        top: scroll.scrollTop || 0,
        left: scroll.scrollLeft || 0
      };
    },
    restoreTableScroll() {
      const $grid = this.$refs.table;
      if (!$grid || typeof $grid.scrollTo !== 'function') return;
      const { top, left } = this.savedScroll || {};
      if (!top && !left) return;
      $grid.scrollTo(left || 0, top || 0);
    },
    reload() {
      if (!this.localStorageId) return;
      this.planLoaded = true;
      this.page = 1;
      this.loadData();
    },
    onPageSizeChange(size) {
      this.limit = size;
      this.page = 1;
      this.loadData();
    },
    onPageChange(page) {
      // size-change 时分页组件可能再抛一次同页 current-change，避免重复请求
      if (page === this.page) return;
      this.page = page;
      this.loadData();
    },
    async loadData() {
      if (!this.localStorageId) return;
      this.tableLoading = true;
      try {
        const res = await searchDeptPlanMsg({
          ...this.where,
          STORAGE_ID: this.localStorageId,
          page: this.page || 1,
          // 对齐老系统 limits/limit：默认尽量一页拉全，也可切 20/50/100/300
          size: this.limit || 99999
        });
        const list = (res.result || []).map((row) => {
          const planQty = this.planQtyMap[row.Dtl_Id] ?? row.Plan_Qty ?? 0;
          return { ...row, Plan_Qty: planQty, _planQty: planQty };
        });
        this.tableRows = list;
        this.planTotal = Number(res.total) || list.length || 0;
        // 计划表重查后原选中行失效，避免备货单仍按旧品种联动
        this.currentRow = null;
        this.selection = [];
        this.$nextTick(() => {
          this.$refs.table?.clearCheckboxRow?.();
          this.$refs.table?.clearCurrentRow?.();
        });
        this.$emit('plan-data-change', { list });
      } catch (e) {
        this.tableRows = [];
        this.planTotal = 0;
        this.selection = [];
        this.$message.error(e.message || '查询失败');
      } finally {
        this.tableLoading = false;
      }
    },
    onCheckboxChange({ records }) {
      this.selection = records || [];
    },
    isRowSelected(row) {
      return this.selection.some((r) => r.Dtl_Id === row.Dtl_Id);
    },
    getPlanQty(row) {
      return this.planQtyMap[row.Dtl_Id] ?? row.Plan_Qty ?? 0;
    },
    setPlanQty(row, val) {
      this.$set(this.planQtyMap, row.Dtl_Id, val);
      row.Plan_Qty = val;
      row._planQty = val;
    },
    getRowStorage(row) {
      return this.rowStorageMap[row.Dtl_Id] ?? String(row.Storage_Id || this.localStorageId);
    },
    setRowStorage(row, val) {
      this.$set(this.rowStorageMap, row.Dtl_Id, val);
      row.Storage_Id = val;
    },
    onCurrentChange({ row }) {
      this.currentRow = row;
    },
    // 对齐老系统 row 事件：点计划行按品种编码刷新下方备货单列表（点复选框列不联动）
    onPlanCellClick({ row, column }) {
      if (!row || column?.type === 'checkbox') return;
      this.currentRow = row;
      this.$refs.table?.setCurrentRow?.(row);
      this.$emit('plan-row-select', row);
    },
    openSpdRemark(row) {
      this.activeDtlId = row.Dtl_Id;
      this.spdRemarkVisible = true;
    },
    openChangeQty(row) {
      this.activeRow = row;
      this.changeQtyVisible = true;
    },
    async openBatchInfo(row) {
      try {
        const res = await searchVarietieBatchIds(row.Varietie_Code, this.localStorageId);
        this.batchInfoRows = res.result || [];
        this.batchInfoVisible = true;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      }
    },
    onTransferGoodsApply() {
      const msg = validateGoodsApplySelection(
        this.selection,
        this.localStorageId,
        this.storageLabel,
        this.tableRows
      );
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      this.goodsApplyMode = 'apply';
      this.goodsApplyRows = this.selection.map((r) => ({ ...r }));
      this.goodsApplyVisible = true;
    },
    onChangeLeftApply() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.goodsApplyMode = 'left';
      this.goodsApplyRows = this.selection.map((r) => ({ ...r }));
      this.goodsApplyVisible = true;
    },
    async onPickList() {
      const msg = validatePickListSelection(this.selection, this.localStorageId, this.storageLabel);
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      const json = JSON.stringify(
        this.selection.map((row) => ({
          MainId: row.Main_Id,
          DeptTwoCode: row.Receive_Dept_Code,
          DtlId: row.Dtl_Id,
          REGION_CODE: row.REGION_CODE
        }))
      );
      try {
        const res = await searchDeptPlanCoefficientMsg(json);
        this.pickListRows = (res.result || []).map((r) => ({ ...r }));
        this.pickListVisible = true;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      }
    },
    async onBagMaking() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const dtlIdJson = JSON.stringify(
        this.selection.map((row) => ({
          DtlId: row.Dtl_Id,
          DeptTwoCode: row.Receive_Dept_Code
        }))
      );
      try {
        const res = await prepareBagMaking(dtlIdJson, this.where, this.localStorageId);
        this.bagMakingRows = (res.result || []).map((r) => ({ ...r }));
        this.bagMakingVisible = true;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      }
    },
    async onStockUp() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const items = buildStockUpItems(this.selection, this.localStorageId);
      try {
        const data = await getMonitorPopup(items);
        const invalid = [];
        (data.result || []).forEach((item) => {
          if (item.EnableVarietie == 0) {
            invalid.push(`品种编码为:${item.varietie_Code_New}的品种已停用，不可生成备货单`);
          }
          if (item.EnableContract == 0) {
            invalid.push(`品种编码为:${item.varietie_Code_New}的合同已停用，不可生成备货单`);
          }
        });
        if (!(data.result || []).length) {
          this.$alert('品种无合同，请关联合同后添加', '提示');
          return;
        }
        if (invalid.length) {
          this.$alert(invalid.join('\n'), '提示');
          return;
        }
        this.stockUpRows = data.result || [];
        this.stockUpVisible = true;
      } catch (e) {
        this.$message.error(e.message || '生成备货失败');
      }
    },
    onStockUpSuccess() {
      this.reload();
      // 计划重查会触发 plan-data-change，父级会清空并刷新备货单
    },
    onBatchRemark() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.batchRemarkVisible = true;
    },
    onReplaceVar() {
      if (!this.currentRow?.Dtl_Id) {
        this.$message.warning('请选择需替换的条目');
        return;
      }
      this.replaceVarVisible = true;
    },
    async onExport() {
      if (this.exporting) return;
      this.exporting = true;
      try {
        const res = await searchDeptPlanMsg({
          ...this.where,
          STORAGE_ID: this.localStorageId,
          size: 999999
        });
        exportPlanTable(res.result || []);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onPending(state) {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const planNumbers = [...new Set(this.selection.map((r) => r.Plan_Number))];
      try {
        const res = await upDeptPlanZG(planNumbers, state);
        this.$alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    async onShutdownPlan() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      const planNumbers = [...new Set(this.selection.map((r) => r.Plan_Number))];
      try {
        const res = await shutdownPlanNumber(planNumbers);
        this.$alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    },
    async onDeleteDetail() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        const res = await delDetid(this.selection.map((r) => r.Dtl_Id));
        this.$alert(res.msg || '操作成功', '提示');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      }
    }
  }
};
</script>

<style scoped>
.plan-table-tab {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.storage-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.storage-label {
  font-size: 12px;
  font-weight: normal;
  color: #606266;
}

/* 操作按钮行与筛选行同宽、左边距对齐 */
.plan-table-tab >>> .spd-toolbar {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 0;
}

.plan-table-tab >>> .spd-filter-bar {
  width: auto;
  max-width: 100%;
  box-sizing: border-box;
  margin: 10px 12px 12px;
  padding: 8px 12px;
}

.plan-table-tab >>> .plan-filter-select {
  width: 120px;
}

.spd-table-panel__wrap {
  width: 100%;
  overflow-x: auto;
}

.plan-table-pager {
  display: flex;
  justify-content: flex-end;
  padding: 8px 4px 0;
}

.plan-cell-btn {
  padding: 3px 6px;
  height: 22px;
  line-height: 1;
  font-size: 12px;
}

.plan-cell-btn--wide {
  padding: 3px 8px;
}
</style>

<style lang="scss">
/* 紧凑行高，贴近老系统 size:sm */
.plan-table-tab .plan-compact-table {
  .vxe-body--column,
  .vxe-header--column {
    padding: 2px 0 !important;
  }
  .vxe-cell {
    padding-left: 4px !important;
    padding-right: 4px !important;
    line-height: 20px;
    font-size: 12px;
  }
  .el-input-number--mini {
    line-height: 22px;
  }
  .el-input-number--mini .el-input__inner {
    height: 22px;
    line-height: 22px;
    padding: 0 4px;
  }
  .el-select--mini .el-input__inner {
    height: 22px;
    line-height: 22px;
  }
}
</style>
