<template>
  <el-dialog
    title="源-合同+品种查询"
    :visible.sync="dialogVisible"
    width="96%"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
    @closed="reset"
  >
    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-input v-model="sourceWhere.sourceSupplierName" clearable placeholder="供应商名称" style="width: 160px" @keyup.enter.native="reload" />
      <el-input v-model="sourceWhere.sourceContractName" clearable placeholder="合同名称" style="width: 160px; margin-left: 8px" @keyup.enter.native="reload" />
      <el-input v-model="sourceWhere.sourceVarietie" clearable placeholder="品种编码/名称" style="width: 160px; margin-left: 8px" @keyup.enter.native="reload" />
      <el-input v-model="sourceWhere.sourceSpecType" clearable placeholder="规格型号" style="width: 140px; margin-left: 8px" @keyup.enter.native="reload" />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 8px" @click="reload">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" :loading="creating" @click="onCreate">创建</el-button>
    </el-form>

    <ele-pro-table
      ref="sourceTable"
      size="mini"
      height="420px"
      :stripe="true"
      :page-size="10"
      :page-sizes="[10, 30, 60, 90, 150, 300]"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="sourceSelection"
      cache-key="stockTransferSourceTable"
    />
  </el-dialog>
</template>

<script>
import { addTransferContractVarietie, searchSourceContractVarietie } from '@/api/Home/StockTransfer';
import { arrSymmetricDifference, buildSourceColumns } from '../utils';

export default {
  name: 'SourceContractDialog',
  props: {
    visible: Boolean,
    targetMeta: Object,
    targetWhere: Object,
    notContainTargetJson: { type: String, default: '[]' }
  },
  data() {
    return {
      columns: buildSourceColumns(),
      sourceWhere: {
        sourceSupplierName: '',
        sourceContractName: '',
        sourceVarietie: '',
        sourceSpecType: ''
      },
      sourceSelection: [],
      sourcePageGuids: [],
      creating: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    reset() {
      this.sourceWhere = {
        sourceSupplierName: '',
        sourceContractName: '',
        sourceVarietie: '',
        sourceSpecType: ''
      };
      this.sourceSelection = [];
      this.sourcePageGuids = [];
    },
    onOpen() {
      this.reload();
    },
    reload() {
      this.$refs.sourceTable?.reload({ page: 1 });
    },
    selectAllRows(list) {
      this.$nextTick(() => {
        const table = this.$refs.sourceTable?.$refs?.table;
        if (!table) return;
        table.clearSelection();
        (list || []).forEach((row) => table.toggleRowSelection(row, true));
      });
    },
    buildSearchPayload(page, limit) {
      const tw = this.targetWhere || {};
      return {
        page,
        limit,
        sourceSupplierName: this.sourceWhere.sourceSupplierName,
        sourceContractName: this.sourceWhere.sourceContractName,
        sourceVarietie: this.sourceWhere.sourceVarietie,
        sourceSpecType: this.sourceWhere.sourceSpecType,
        notContainContractCode: this.targetMeta?.targetContractCode ?? '',
        targetSupplierCode: this.targetMeta?.targetSupplierCode ?? '',
        targetContractCode: this.targetMeta?.targetContractCode ?? '',
        targetSupplierName: tw.targetSupplierName ?? '',
        targetContractName: tw.targetContractName ?? '',
        targetVarietie: tw.targetVarietie ?? '',
        targetSpecType: tw.targetSpecType ?? '',
        notContainSourceVarietiesJson: this.notContainTargetJson
      };
    },
    datasource({ page, limit }) {
      return searchSourceContractVarietie(this.buildSearchPayload(page, limit))
        .then((res) => {
          const list = res.result || [];
          this.sourcePageGuids = list.map((r) => r.Source_Contract_Detail_Guid).filter(Boolean);
          this.selectAllRows(list);
          return { count: res.total || 0, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async onCreate() {
      if (!this.sourceSelection.length) {
        this.$message.warning('请勾选一个数据');
        return;
      }
      const checkedGuids = this.sourceSelection.map((r) => r.Source_Contract_Detail_Guid);
      const notContainSourceJson = JSON.stringify(
        arrSymmetricDifference(this.sourcePageGuids, checkedGuids)
      );
      const tw = this.targetWhere || {};
      this.creating = true;
      try {
        await addTransferContractVarietie({
          staff: this.$store.state.user?.info?.Nickname || '',
          sourceSupplierName: this.sourceWhere.sourceSupplierName,
          sourceContractName: this.sourceWhere.sourceContractName,
          sourceVarietie: this.sourceWhere.sourceVarietie,
          sourceSpecType: this.sourceWhere.sourceSpecType,
          notContainContractCode: this.targetMeta?.targetContractCode,
          targetSupplierCode: this.targetMeta?.targetSupplierCode,
          targetContractCode: this.targetMeta?.targetContractCode,
          targetSupplierName: tw.targetSupplierName,
          targetContractName: tw.targetContractName,
          targetVarietie: tw.targetVarietie,
          targetSpecType: tw.targetSpecType,
          notContainTargetVarietiesJson: this.notContainTargetJson,
          notContainSourceVarietiesJson: notContainSourceJson
        });
        this.$message.success('创建成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '创建失败');
      } finally {
        this.creating = false;
      }
    }
  }
};
</script>

<style scoped>
.filter-row {
  margin-bottom: 10px;
}
</style>
