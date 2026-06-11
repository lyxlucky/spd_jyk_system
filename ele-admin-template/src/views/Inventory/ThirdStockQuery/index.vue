<template>
  <div class="ele-container third-stock-query">
    <el-card shadow="never" class="main-card">
      <ThirdStockQuerySearch
        ref="search"
        :loading="loading"
        :exporting="exporting"
        @search="reload"
        @export="exportData"
        @kc-summary="kcDialogVisible = true"
        @upload-success="reload"
      />
      <ThirdStockQueryTable
        :loading="loading"
        :table-data="tableData"
        :total="total"
        :page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @page-change="loadData"
        @size-change="onPageSizeChange"
        @flow-record="openFlowDialog"
      />
    </el-card>

    <FlowRecordDialog :visible.sync="flowDialogVisible" :row="flowRow" />
    <KcSummaryDialog :visible.sync="kcDialogVisible" />
  </div>
</template>

<script>
  import { getThirdStockInfo } from '@/api/Inventory/ThreeLevelDbBD';
  import { utils, writeFile } from 'xlsx';
  import ThirdStockQuerySearch from './components/ThirdStockQuerySearch.vue';
  import ThirdStockQueryTable from './components/ThirdStockQueryTable.vue';
  import FlowRecordDialog from './components/FlowRecordDialog.vue';
  import KcSummaryDialog from './components/KcSummaryDialog.vue';

  export default {
    name: 'ThirdStockQuery',
    components: {
      ThirdStockQuerySearch,
      ThirdStockQueryTable,
      FlowRecordDialog,
      KcSummaryDialog
    },
    data() {
      return {
        loading: false,
        exporting: false,
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        total: 0,
        tableData: [],
        flowDialogVisible: false,
        flowRow: {},
        kcDialogVisible: false
      };
    },
    mounted() {
      this.loadData(1);
    },
    methods: {
      calcStockQty(row) {
        if (!row) return 0;
        if (Number(row.KS_QTY) === 0) return row.KS_QTY;
        return (
          Number(row.KS_QTY || 0) +
          Number(row.JF_QTY || 0) +
          Number(row.JF_DEF_QTY || 0)
        );
      },
      formatStorageType(value) {
        if (value == 0) return '普通入库';
        if (value == 1) return '盘盈入库';
        return '未知';
      },
      async loadData(page = this.page) {
        this.page = page;
        this.loading = true;
        try {
          const res = await getThirdStockInfo({
            page: this.page,
            limit: this.pageSize,
            where: this.$refs.search.getWhere()
          });
          this.tableData = res.data || [];
          this.total = res.total || 0;
        } catch (e) {
          this.tableData = [];
          this.total = 0;
          this.$message.error(e || '查询失败');
        } finally {
          this.loading = false;
        }
      },
      reload() {
        this.loadData(1);
      },
      onPageSizeChange(size) {
        this.pageSize = size;
        this.loadData(1);
      },
      openFlowDialog(row) {
        this.flowRow = row;
        this.flowDialogVisible = true;
      },
      async exportData() {
        this.exporting = true;
        const loading = this.$messageLoading('正在导出数据...');
        try {
          const response = await getThirdStockInfo({
            page: 1,
            limit: 999999,
            where: this.$refs.search.getWhere()
          });
          const headers = [
            '二级科室名称',
            '品种编码',
            '计费编码',
            '品种名称',
            '规格型号',
            '生产企业',
            '单位',
            '单价',
            '批准文号',
            '入库类型',
            '库存数量'
          ];
          const dataArray = [headers];
          (response.data || []).forEach((d) => {
            dataArray.push([
              d.DEPT_TWO_NAME || '',
              d.VARIETIE_CODE_NEW || '',
              d.CHARGE_CODE || '',
              d.VARIETIE_NAME || '',
              d.SPECIFICATION_OR_TYPE || '',
              d.MANUFACTURING_ENT_NAME || '',
              d.UNIT || '',
              d.PRICE || '',
              d.APPROVAL_NUMBER || '',
              this.formatStorageType(d.STORAGE_TYPE),
              this.calcStockQty(d)
            ]);
          });
          writeFile(
            {
              SheetNames: ['Sheet1'],
              Sheets: { Sheet1: utils.aoa_to_sheet(dataArray) }
            },
            '三级库-库存查询.xlsx'
          );
          this.$message.success('导出成功');
        } catch (e) {
          this.$message.error('导出数据失败，请稍后重试');
        } finally {
          loading.close();
          this.exporting = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/common';

  .third-stock-query {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .main-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 8px;
    }
  }
</style>
