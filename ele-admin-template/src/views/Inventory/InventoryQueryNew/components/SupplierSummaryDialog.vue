<template>
  <el-dialog title="供应商汇总" :visible.sync="innerVisible" width="1100px" append-to-body @open="onOpen">
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="品种">
        <el-input v-model="form.supplierSummaryVarietie" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="form.supplierSummarySpecType" clearable style="width: 100px" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="form.supplierSummarySupplier" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input v-model="form.supplierSummaryManuEntName" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        <el-button :loading="exporting" @click="onExport">导出</el-button>
      </el-form-item>
      <el-form-item label="合计数量">
        <span class="total-qty">{{ totalQty }}</span>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      :height="480"
      :toolbar="false"
      :columns="columns"
      :datasource="datasource"
      :page-size="30"
      :page-sizes="[30, 60, 100]"
    />
  </el-dialog>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { supplierSummaryColumns } from '../columns';
import { searchCenterGoodsSupplierSummary } from '@/api/Inventory/InventoryQueryNew';

export default {
  name: 'InvQuerySupplierSummaryDialog',
  props: {
    visible: { type: Boolean, default: false },
    mainWhere: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      innerVisible: false,
      form: {
        supplierSummaryVarietie: '',
        supplierSummarySpecType: '',
        supplierSummarySupplier: '',
        supplierSummaryManuEntName: ''
      },
      totalQty: 0,
      exporting: false,
      columns: supplierSummaryColumns
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.form.supplierSummaryVarietie = this.mainWhere.varietie || '';
      this.form.supplierSummarySupplier = this.mainWhere.supplier || '';
      this.form.supplierSummaryManuEntName = this.mainWhere.manuEntName || '';
      this.form.supplierSummarySpecType = '';
      this.totalQty = 0;
      this.$nextTick(() => this.reload());
      this.loadTotal();
    },
    buildWhere() {
      return { ...this.mainWhere, ...this.form };
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
      this.loadTotal();
    },
    loadTotal() {
      searchCenterGoodsSupplierSummary(this.buildWhere(), 1, 999999)
        .then((res) => {
          const list = res.result || [];
          this.totalQty = list.reduce((s, r) => s + (Number(r.QTY) || 0), 0);
        })
        .catch(() => {
          this.totalQty = 0;
        });
    },
    datasource({ page, limit }) {
      return searchCenterGoodsSupplierSummary(this.buildWhere(), page, limit)
        .then((res) => ({ count: res.total ?? 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await searchCenterGoodsSupplierSummary(this.buildWhere(), 1, 999999);
        const headers = ['品种编码', '品种名称', '规格型号', '数量', '单位', '生产企业', '供应商名称'];
        const rows = [headers];
        (res.result || []).forEach((d) => {
          rows.push([
            d.VARIETIE_CODE_NEW,
            d.VARIETIE_NAME,
            d.SPECIFICATION_OR_TYPE,
            d.QTY,
            d.UNIT,
            d.MANUFACTURING_ENT_NAME,
            d.SUPPLIER_NAME
          ]);
        });
        writeFile(
          { SheetNames: ['Sheet1'], Sheets: { Sheet1: utils.aoa_to_sheet(rows) } },
          '供应商库存汇总.xlsx'
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.total-qty {
  font-weight: 600;
  color: #009688;
}
</style>
