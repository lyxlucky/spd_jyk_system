<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="innerVisible"
    width="92%"
    top="4vh"
    append-to-body
    destroy-on-close
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="variety-search-bar">
      <el-input
        v-model="where.varietieCodeNew"
        size="mini"
        clearable
        placeholder="搜索品种编码"
        style="width: 160px"
        @keyup.enter.native="reload"
      />
      <el-input
        v-model="where.varietieName"
        size="mini"
        clearable
        placeholder="搜索品种名称"
        style="width: 160px"
        @keyup.enter.native="reload"
      />
      <el-input
        v-model="where.specificationOrType"
        size="mini"
        clearable
        placeholder="搜索规格型号"
        style="width: 160px"
        @keyup.enter.native="reload"
      />
      <el-input
        v-model="where.manufacturingEntName"
        size="mini"
        clearable
        placeholder="搜索生产企业"
        style="width: 160px"
        @keyup.enter.native="reload"
      />
      <el-input
        v-model="where.approvalNumber"
        size="mini"
        clearable
        placeholder="搜索批准文号"
        style="width: 160px"
        @keyup.enter.native="reload"
      />
      <el-button type="primary" size="mini" plain @click="reload">查询</el-button>
      <el-button type="primary" size="mini" :disabled="!pickedRow" @click="confirmPick">确定</el-button>
    </div>

    <ele-pro-table
      ref="table"
      size="mini"
      :stripe="true"
      height="calc(100vh - 280px)"
      :toolbar="false"
      :columns="columns"
      :datasource="datasource"
      highlight-current-row
      @current-change="onCurrentChange"
      @row-dblclick="onRowDblClick"
    />
  </el-dialog>
</template>

<script>
import { SearchContractVarieties } from '@/api/Settle/ReadjustPrice';
import { formatDate } from '../utils';

export default {
  name: 'SelectVarietyDialog',
  props: {
    visible: { type: Boolean, default: false },
    supplierCode: { type: String, default: '' },
    contractCode: { type: String, default: '' },
    supplierName: { type: String, default: '' },
    contractName: { type: String, default: '' },
    dtlId: { type: String, default: '' }
  },
  data() {
    return {
      where: {
        varietieCodeNew: '',
        varietieName: '',
        specificationOrType: '',
        manufacturingEntName: '',
        approvalNumber: ''
      },
      pickedRow: null,
      columns: [
        { type: 'index', label: '序号', width: 55, align: 'center' },
        { prop: 'Varietie_Code_New', label: '品种编码', width: 90, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 160, showOverflowTooltip: true },
        { prop: 'Unit', label: '单位', width: 60, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 150, showOverflowTooltip: true },
        {
          prop: 'Supply_Price',
          label: '结算价',
          width: 90,
          align: 'right'
        },
        {
          prop: 'Purchase_Price',
          label: '供货价',
          width: 90,
          align: 'right'
        },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 130, showOverflowTooltip: true },
        {
          prop: 'Registration_Issuing_Date',
          label: '发证日期',
          width: 100,
          formatter: (_r, _c, v) => formatDate(v)
        },
        {
          prop: 'Registration_Valid_Date',
          label: '有效到期',
          width: 100,
          formatter: (_r, _c, v) => formatDate(v)
        },
        {
          prop: 'Enable',
          label: '启用状态',
          width: 80,
          align: 'center',
          formatter: (_r, _c, v) => (v == 1 || v === '1' ? '启用' : v == 0 || v === '0' ? '冻结' : '未知')
        },
        { prop: 'Prod_Big_Class_Name', label: '产品类别', width: 90, showOverflowTooltip: true },
        { prop: 'Mgmt_Cat_Name', label: '管理类别', width: 90, showOverflowTooltip: true },
        { prop: 'Regulatory_Cat_Name', label: '监管类别', minWidth: 120, showOverflowTooltip: true }
      ]
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    dialogTitle() {
      const sup = this.supplierName || this.supplierCode || '-';
      const con = this.contractName || this.contractCode || '-';
      return `选择调价品种，供应商：[${sup}]，合同：{${con}}`;
    }
  },
  methods: {
    onOpen() {
      this.pickedRow = null;
      this.where = {
        varietieCodeNew: '',
        varietieName: '',
        specificationOrType: '',
        manufacturingEntName: '',
        approvalNumber: ''
      };
      this.$nextTick(() => this.reload());
    },
    onClosed() {
      this.pickedRow = null;
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      return SearchContractVarieties(
        {
          ...this.where,
          supplierCode: this.supplierCode,
          contractCode: this.contractCode
        },
        page,
        limit
      ).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    onCurrentChange(row) {
      this.pickedRow = row || null;
    },
    onRowDblClick(row) {
      this.pickedRow = row;
      this.confirmPick();
    },
    confirmPick() {
      if (!this.pickedRow) {
        this.$message.warning('请选择一个品种');
        return;
      }
      const row = {
        ...this.pickedRow,
        Dtl_Id: this.dtlId || this.pickedRow.Dtl_Id || ''
      };
      this.$emit('confirm', row);
      this.innerVisible = false;
    }
  }
};
</script>

<style scoped>
.variety-search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
</style>
