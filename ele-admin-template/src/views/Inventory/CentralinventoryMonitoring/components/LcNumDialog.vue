<template>
  <el-dialog
    title="临采品种详情"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="品种">
        <el-input v-model="filters.VARIETIE_NAME" clearable placeholder="编码/名称/规格型号" style="width: 200px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="filters.SUPPLIER_NAME" clearable style="width: 150px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item label="合同">
        <el-input v-model="filters.CONTRACT_NAME" clearable style="width: 120px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="calc(100vh - 280px)"
      :toolkit="[]"
      :columns="columns"
      :datasource="datasource"
      :page-size="30"
      :page-sizes="[30, 50, 100, 150, 200, 99999]"
      cache-key="cimLcNumTable"
    >
      <template v-slot:remainQty="{ row }">{{ lcRemainQty(row) }}</template>
      <template v-slot:contractType="{ row }">{{ formatContractType(row.CONTRACT_TYPE) }}</template>
      <template v-slot:contractStart="{ row }">{{ formatDate10(row.CONTRACT_START_TIME) }}</template>
      <template v-slot:contractEnd="{ row }">{{ formatDate10(row.CONTRACT_END_TIME) }}</template>
    </ele-pro-table>
  </el-dialog>
</template>

<script>
import { searchLcInfo } from '@/api/Inventory/CentralinventoryMonitoring';
import { buildLcNumColumns, formatContractType, formatDate10, lcRemainQty } from '../utils';

export default {
  name: 'LcNumDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      filters: {
        VARIETIE_NAME: '',
        SUPPLIER_NAME: '',
        CONTRACT_NAME: ''
      },
      columns: buildLcNumColumns()
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.$nextTick(() => this.reload());
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    formatContractType,
    formatDate10,
    lcRemainQty,
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      return searchLcInfo(this.filters, page, limit)
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    handleClosed() {
      this.filters = { VARIETIE_NAME: '', SUPPLIER_NAME: '', CONTRACT_NAME: '' };
    }
  }
};
</script>
