<template>
  <div class="ele-body spd-page stock-transfer-page">
    <div class="spd-section">
      <div class="spd-section__head">目标合同品种</div>
      <el-form size="mini" inline class="filter-row" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="targetWhere.targetSupplierName"
            clearable
            placeholder="请输入供应商名称"
            style="width: 180px"
            @keyup.enter.native="reloadTarget"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="targetWhere.targetContractName"
            clearable
            placeholder="请输入合同名称"
            style="width: 180px"
            @keyup.enter.native="reloadTarget"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="targetWhere.targetVarietie"
            clearable
            placeholder="请输入品种编码/品种名称"
            style="width: 200px"
            @keyup.enter.native="reloadTarget"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="targetWhere.targetSpecType"
            clearable
            placeholder="请输入规格型号"
            style="width: 160px"
            @keyup.enter.native="reloadTarget"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reloadTarget">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" @click="onShowSource">选择源合同</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="targetTable"
        class="data-table"
        size="mini"
        height="360px"
        :stripe="true"
        :page-size="targetPageSize"
        :page-sizes="[10, 20, 30, 50, 100, 150, 300, 999999]"
        :columns="targetColumns"
        :datasource="targetDatasource"
        :selection.sync="targetSelection"
        cache-key="stockTransferTargetTable"
      />
    </div>

    <div class="spd-section">
      <div class="spd-section__head">退转单列表</div>
      <el-form size="mini" inline class="filter-row" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="transferWhere.transferNumber"
            clearable
            placeholder="请输入退转单号"
            style="width: 140px"
            @keyup.enter.native="reloadTransfer"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="transferWhere.sourceSupplierName"
            clearable
            placeholder="源-供应商名称"
            style="width: 140px"
            @keyup.enter.native="reloadTransfer"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="transferWhere.targetSupplierName"
            clearable
            placeholder="目标-供应商名称"
            style="width: 140px"
            @keyup.enter.native="reloadTransfer"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="transferWhere.varietie"
            clearable
            placeholder="品种编码/名称"
            style="width: 160px"
            @keyup.enter.native="reloadTransfer"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="transferWhere.specType"
            clearable
            placeholder="规格型号"
            style="width: 120px"
            @keyup.enter.native="reloadTransfer"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="transferWhere.state" clearable placeholder="状态" style="width: 110px">
            <el-option label="全部" value="" />
            <el-option label="新建" value="0" />
            <el-option label="审批" value="1" />
            <el-option label="退转中" value="2" />
            <el-option label="退转成功" value="3" />
            <el-option label="退转异常" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reloadTransfer">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="approving" @click="onApprove">审批</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain :loading="deleting" @click="onDelete">删除</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="transferTable"
        class="data-table"
        size="mini"
        height="calc(100vh - 620px)"
        :stripe="true"
        :page-size="transferPageSize"
        :page-sizes="[10, 30, 60, 90, 150, 300, 999999]"
        :columns="transferColumns"
        :datasource="transferDatasource"
        :selection.sync="transferSelection"
        cache-key="stockTransferDtlTable"
      >
        <template v-slot:state="{ row }">{{ formatTransferState(row.State) }}</template>
      </ele-pro-table>
    </div>

    <SourceContractDialog
      :visible.sync="sourceVisible"
      :target-meta="sourceTargetMeta"
      :target-where="targetWhere"
      :not-contain-target-json="notContainTargetJson"
      @done="onSourceCreated"
    />
  </div>
</template>

<script>
import SourceContractDialog from './components/SourceContractDialog.vue';
import {
  approveTransferList,
  searchTargetContractVarietie,
  searchTransferVarietieDtl,
  softDeleteTransferDtl
} from '@/api/Home/StockTransfer';
import {
  arrSymmetricDifference,
  buildTargetColumns,
  buildTransferColumns,
  createTargetWhere,
  createTransferWhere,
  formatTransferState
} from './utils';

export default {
  name: 'StockTransfer',
  components: { SourceContractDialog },
  data() {
    return {
      targetWhere: createTargetWhere(),
      transferWhere: createTransferWhere(),
      targetColumns: buildTargetColumns(),
      transferColumns: buildTransferColumns(),
      targetPageSize: 10,
      transferPageSize: 10,
      targetSelection: [],
      transferSelection: [],
      targetPageGuids: [],
      sourceVisible: false,
      sourceTargetMeta: {},
      notContainTargetJson: '[]',
      approving: false,
      deleting: false
    };
  },
  mounted() {
    this.reloadTransfer();
  },
  methods: {
    formatTransferState,
    reloadTarget() {
      this.$refs.targetTable?.reload({ page: 1, where: this.targetWhere });
    },
    reloadTransfer() {
      this.$refs.transferTable?.reload({ page: 1, where: this.transferWhere });
    },
    selectAllTargetRows(list) {
      this.$nextTick(() => {
        const table = this.$refs.targetTable?.$refs?.table;
        if (!table) return;
        table.clearSelection();
        (list || []).forEach((row) => table.toggleRowSelection(row, true));
      });
    },
    targetDatasource({ page, limit }) {
      return searchTargetContractVarietie({ page, limit, where: this.targetWhere })
        .then((res) => {
          const list = res.result || [];
          this.targetPageGuids = list.map((r) => r.Target_Contract_Detail_Guid).filter(Boolean);
          this.selectAllTargetRows(list);
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    transferDatasource({ page, limit }) {
      return searchTransferVarietieDtl({ page, limit, where: this.transferWhere })
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    onShowSource() {
      if (!this.targetSelection.length) {
        this.$message.warning('请勾选一个数据');
        return;
      }
      const first = this.targetSelection[0];
      const checkedGuids = this.targetSelection.map((r) => r.Target_Contract_Detail_Guid);
      this.sourceTargetMeta = {
        targetContractCode: first.Target_Contract_Code,
        targetSupplierCode: first.Target_Supplier_Code
      };
      this.notContainTargetJson = JSON.stringify(
        arrSymmetricDifference(this.targetPageGuids, checkedGuids)
      );
      this.sourceVisible = true;
    },
    onSourceCreated() {
      this.reloadTarget();
      this.reloadTransfer();
    },
    async onApprove() {
      if (!this.transferSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm('确定要审批退转单吗?', '提示', { type: 'warning' });
        const numbers = this.transferSelection.map((r) => r.Transfer_Number);
        this.approving = true;
        await approveTransferList(numbers);
        this.$message.success('审批成功');
        this.reloadTarget();
        this.reloadTransfer();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '审批失败');
      } finally {
        this.approving = false;
      }
    },
    async onDelete() {
      if (!this.transferSelection.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      try {
        await this.$confirm('确定要删除吗?', '提示', { type: 'warning' });
        const ids = this.transferSelection.map((r) => r.Dtl_Id);
        this.deleting = true;
        await softDeleteTransferDtl(ids);
        this.$message.success('删除成功');
        this.reloadTarget();
        this.reloadTransfer();
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
