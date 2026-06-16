<template>
  <div class="plan-table-tab">
    <!-- 查询条件 -->
    <div class="panel panel-search">
      <div class="panel-head">查询条件</div>
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

    <!-- 操作工具栏 -->
    <div class="panel panel-toolbar">
      <div class="panel-head panel-head-toolbar">
        <span class="panel-title">操作</span>
        <div class="storage-select">
          <span class="storage-label">库区</span>
          <el-select v-model="localStorageId" size="mini" style="width: 130px" @change="onStorageChange">
            <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
          </el-select>
        </div>
      </div>
      <div class="toolbar-groups">
        <div class="toolbar-group">
          <span class="group-label">生成</span>
          <div class="group-btns">
            <el-button size="mini" type="primary" @click="onTransferGoodsApply">散货申领单</el-button>
            <el-button size="mini" type="primary" @click="onPickList">拣配单</el-button>
            <el-button size="mini" type="primary" @click="onBagMaking">定数包</el-button>
            <el-button size="mini" type="primary" @click="onStockUp">备货</el-button>
          </div>
        </div>
        <div class="toolbar-divider" />
        <div class="toolbar-group">
          <span class="group-label">维护</span>
          <div class="group-btns">
            <el-button size="mini" @click="onChangeLeftApply">变更剩余申请</el-button>
            <el-button size="mini" @click="lcVisible = true">临采详情</el-button>
            <el-button size="mini" @click="onReplaceVar">替换品种</el-button>
            <el-button size="mini" @click="onExport">导出</el-button>
            <el-button size="mini" @click="onPending(1)">暂挂</el-button>
            <el-button size="mini" @click="onPending(0)">取消暂挂</el-button>
            <el-button size="mini" @click="onBatchRemark">批量备注</el-button>
          </div>
        </div>
        <div class="toolbar-divider" />
        <div class="toolbar-group">
          <div class="group-btns">
            <el-button size="mini" type="danger" plain @click="onShutdownPlan">强制结束</el-button>
            <el-button size="mini" type="danger" plain @click="onDeleteDetail">删除明细</el-button>
          </div>
        </div>
      </div>
      <div class="filter-bar">
        <span class="filter-bar-label">计划状态</span>
        <el-checkbox-group v-model="where.planState" size="mini" @change="reload">
          <el-checkbox label="6">新增</el-checkbox>
          <el-checkbox label="3">未收全</el-checkbox>
          <el-checkbox label="4">已收全</el-checkbox>
          <el-checkbox label="10">强制结束</el-checkbox>
        </el-checkbox-group>
        <span class="filter-bar-divider" />
        <el-select v-model="where.planIsZxk_sh" size="mini" style="width: 118px" clearable placeholder="散货库存" @change="reload">
          <el-option label="散货-全部" value="" />
          <el-option label="散货-有" value="1" />
          <el-option label="散货-无" value="0" />
        </el-select>
        <el-select v-model="where.planIsZxk_dsb" size="mini" style="width: 118px" clearable placeholder="定数包库存" @change="reload">
          <el-option label="定数包-全部" value="" />
          <el-option label="定数包-有" value="1" />
          <el-option label="定数包-无" value="0" />
        </el-select>
        <el-select v-model="where.isHaveBh" size="mini" style="width: 110px" clearable placeholder="已转备货" @change="reload">
          <el-option label="备货-全部" value="" />
          <el-option label="备货-是" value="1" />
          <el-option label="备货-否" value="0" />
        </el-select>
        <el-select v-model="where.STORAGE_TYPE" size="mini" style="width: 110px" clearable placeholder="存储条件" @change="reload">
          <el-option label="条件-全部" value="" />
          <el-option label="常温" value="0" />
          <el-option label="阴凉" value="1" />
          <el-option label="冷藏" value="2" />
          <el-option label="冷冻" value="3" />
        </el-select>
        <el-select v-model="where.RELATED_RFID" size="mini" style="width: 100px" clearable placeholder="RFID" @change="reload">
          <el-option label="RFID-全部" value="" />
          <el-option label="RFID-否" value="0" />
          <el-option label="RFID-是" value="1" />
        </el-select>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="panel panel-table">
      <div class="panel-head panel-head-table">
        <span class="panel-title">科室计划列表</span>
        <span v-if="selection.length" class="panel-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="table-wrap">
        <ele-pro-table
          ref="table"
          size="mini"
          :height="tableHeight"
          :stripe="true"
          :need-page="false"
          :page-size="9999999"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          highlight-current-row
          cache-key="deptPlannedDeliveryNewPlanTable"
          @current-change="onCurrentChange"
        >
      <template v-slot:deptTwoName="{ row }">
        <span v-if="row.SECOND_APP_DEPT_NAME" style="color: red">
          {{ row.Dept_Two_Name }}/{{ row.SECOND_APP_DEPT_NAME }}
        </span>
        <span v-else>{{ row.Dept_Two_Name }}</span>
      </template>
      <template v-slot:planQty="{ row }">
        <el-input-number
          :value="getPlanQty(row)"
          size="mini"
          :min="0"
          :disabled="!isRowSelected(row)"
          controls-position="right"
          style="width: 80px"
          @change="(val) => setPlanQty(row, val)"
        />
      </template>
      <template v-slot:rowStorage="{ row }">
        <el-select
          :value="getRowStorage(row)"
          size="mini"
          :disabled="!isRowSelected(row)"
          style="width: 100px"
          @change="(val) => setRowStorage(row, val)"
        >
          <el-option label="院内库区" value="1" />
          <el-option label="院外库区" value="2" />
        </el-select>
      </template>
      <template v-slot:batchInfo="{ row }">
        <el-button type="primary" size="mini" @click="openBatchInfo(row)">查看</el-button>
      </template>
      <template v-slot:actions="{ row }">
        <el-button type="primary" size="mini" @click="openSpdRemark(row)">SPD备注</el-button>
        <el-button type="primary" size="mini" plain @click="openChangeQty(row)">变更申请数量</el-button>
      </template>
        </ele-pro-table>
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
      tableHeight: 'calc(100vh - 520px)'
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
        if (val) this.localStorageId = val;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.localStorageId) this.reload();
    });
  },
  methods: {
    onStorageChange(val) {
      this.$emit('storage-change', val);
      this.reload();
      this.$emit('reload-picking');
    },
    reload() {
      this.$refs.table?.reload({ page: 1, where: { ...this.where, STORAGE_ID: this.localStorageId } });
    },
    datasource({ where }) {
      const query = { ...where, STORAGE_ID: this.localStorageId };
      return searchDeptPlanMsg(query).then((res) => {
        const list = (res.result || []).map((row) => {
          const planQty = this.planQtyMap[row.Dtl_Id] ?? row.Plan_Qty ?? 0;
          return { ...row, Plan_Qty: planQty, _planQty: planQty };
        });
        this.tableRows = list;
        return { count: res.total, list };
      });
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
    onCurrentChange(row) {
      this.currentRow = row;
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
      this.$emit('reload-picking');
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
}

.panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
}

.panel-head {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.panel-head-toolbar,
.panel-head-table {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-weight: 600;
}

.panel-meta {
  font-size: 12px;
  font-weight: normal;
  color: #409eff;
}

.panel-search .search-form {
  padding: 10px 12px 2px;
}

.panel-search :deep(.el-form-item) {
  margin-bottom: 8px;
}

.panel-search :deep(.el-form-item__label) {
  font-size: 12px;
  padding-right: 6px;
}

.panel-toolbar {
  padding-bottom: 10px;
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

.toolbar-groups {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0;
  padding: 10px 12px 0;
}

.toolbar-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.group-label {
  flex-shrink: 0;
  width: 32px;
  padding-top: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1;
}

.group-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.toolbar-divider {
  width: 1px;
  min-height: 28px;
  margin: 0 12px;
  background: #dcdfe6;
  align-self: center;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 10px 12px 0;
  padding: 8px 10px;
  background: #fafafa;
  border: 1px dashed #e4e7ed;
  border-radius: 4px;
}

.filter-bar-label {
  font-size: 12px;
  color: #909399;
  margin-right: 4px;
}

.filter-bar-divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: #dcdfe6;
}

.panel-table {
  flex: 1;
  min-height: 360px;
  display: flex;
  flex-direction: column;
}

.table-wrap {
  padding: 0 1px 8px;
}
</style>
