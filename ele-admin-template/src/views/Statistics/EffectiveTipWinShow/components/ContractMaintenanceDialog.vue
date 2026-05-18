<template>
  <el-dialog
    :visible.sync="visible"
    title="品种--合同 维护关系"
    width="90%"
    top="5vh"
    append-to-body
    @closed="onClosed"
  >
    <el-input
      v-model="contractSearch"
      size="small"
      placeholder="请输入合同名称搜索"
      style="width: 240px; margin-bottom: 8px"
      @keyup.enter.native="load"
    />
    <el-button size="small" type="primary" icon="el-icon-search" @click="load">查询</el-button>
    <el-table v-loading="loading" :data="rows" border stripe height="480" size="small">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="Supplier_Name" label="供应商名称" min-width="100" />
      <el-table-column prop="Contract_Code" label="合同编码" min-width="100" />
      <el-table-column prop="Contract_Name" label="合同名称" min-width="100" />
      <el-table-column prop="Varietie_Code_New" label="品种(材料)编码" min-width="110" />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="100" />
      <el-table-column prop="Specification_Or_Type" label="型号/规格" min-width="100" />
      <el-table-column prop="Unit" label="单位" width="60" />
      <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" min-width="120" />
      <el-table-column prop="Supply_Price" label="结算价" width="80" />
      <el-table-column prop="Approval_Number" label="批准文号" min-width="100" />
      <el-table-column label="发证日期" min-width="100">
        <template slot-scope="{ row }">{{ fmt(row.Contract_Start_Time) }}</template>
      </el-table-column>
      <el-table-column label="有效到期" min-width="100">
        <template slot-scope="{ row }">{{ fmt(row.Contract_End_Time) }}</template>
      </el-table-column>
      <el-table-column prop="Var_Enable" label="目录库启用状态" width="110" />
      <el-table-column prop="Var_Is_Del" label="目录库删除状态" width="110" />
      <el-table-column prop="Con_Dtl_Enable" label="合同启用状态" width="110" />
      <el-table-column prop="Con_Dtl_Is_Del" label="合同删除状态" width="110" />
    </el-table>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { searchVarietieContract } from '@/api/Statistics/EffectiveTipWinShow';
import { formatDate10 } from '../utils/format';

export default {
  name: 'ContractMaintenanceDialog',
  data() {
    return {
      visible: false,
      loading: false,
      varietieCode: '',
      contractSearch: '',
      rows: []
    };
  },
  methods: {
    fmt: formatDate10,
    open(varietieCode) {
      this.varietieCode = varietieCode || '';
      this.contractSearch = '';
      this.visible = true;
      this.load();
    },
    async load() {
      if (!this.varietieCode) return;
      this.loading = true;
      try {
        const res = await searchVarietieContract(this.varietieCode, this.contractSearch);
        this.rows = res.result || [];
      } catch (e) {
        Message.error(e.message || '加载失败');
        this.rows = [];
      } finally {
        this.loading = false;
      }
    },
    onClosed() {
      this.rows = [];
    }
  }
};
</script>
