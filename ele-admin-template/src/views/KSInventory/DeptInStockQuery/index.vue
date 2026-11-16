<template>
  <div class="dept-instock-page">
    <el-card shadow="never" :body-style="{ padding: '12px' }">
      <!-- 页面标题，对齐老系统 DepaStorageQuery.cshtml:45 -->
      <div class="page-title">科室入库列表</div>

      <ele-pro-table
        ref="table"
        height="65vh"
        highlight-current-row
        :toolkit="[]"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="DeptInStockQueryTable"
      >
        <template v-slot:toolbar>
          <SearchForm
            @where-change="onWhereChange"
            @search="reload"
            @export="exportExcel"
            @scan="scanVisible = true"
            @summary="openSummary"
          />
        </template>
      </ele-pro-table>

      <!-- 汇总条：老页面 DepaStorageQuery.cshtml:190-191 -->
      <div class="summary-bar">
        <span>品种当前页散货金额：<b>{{ summary.pagePrice }}</b></span>
        <span>品种总金额：<b>{{ summary.totalPrice }}</b></span>
        <span>品种当前页入库数量：<b>{{ summary.pageQty }}</b></span>
        <span>品种入库总数量：<b>{{ summary.totalQty }}</b></span>
      </div>
    </el-card>

    <SummaryDialog
      :visible.sync="summaryVisible"
      :where="summaryWhere"
      :order="currentOrder"
    />

    <!-- 复用新系统现成的扫单入库组件（接口与老系统一致） -->
    <ScanInbound :visible.sync="scanVisible" />
  </div>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { HOME_HP } from '@/config/setting';
  import { GetDeptInStockDetail } from '@/api/KSInventory/DeptInStockQuery/index';
  import { buildColumns, EXPORT_COLUMNS } from './columns';
  import SearchForm from './components/SearchForm';
  import SummaryDialog from './components/SummaryDialog';
  import ScanInbound from '@/views/KSInventory/NewDepaStorageQuery/components/ScanInbound';

  export default {
    name: 'DeptInStockQuery',
    components: { SearchForm, SummaryDialog, ScanInbound },
    data() {
      return {
        pageSize: 20,
        pageSizes: [10, 20, 30, 50, 100, 9999999],
        selection: [],
        currentWhere: {},
        currentOrder: { sort: 'RECEIVING_TIME', order: 'descending' },
        summary: {
          pagePrice: '0.00',
          totalPrice: '0.00',
          pageQty: '0',
          totalQty: '0'
        },
        scanVisible: false,
        summaryVisible: false,
        summaryWhere: {}
      };
    },
    computed: {
      columns() {
        // 老系统 hide:!isFszxy 的三列只在该院区显示
        return buildColumns({ showFszxy: HOME_HP === 'fszxy' });
      }
    },
    methods: {
      /** 表格数据源，ele-pro-table 要求返回 { count, list } */
      datasource({ page, limit, where, order }) {
        this.currentOrder = order || this.currentOrder;
        this.currentWhere = where && Object.keys(where).length
          ? { ...where }
          : this.currentWhere;
        return GetDeptInStockDetail({ page, limit, where, order }).then(
          (res) => {
            const list = res.result || [];
            this.calcSummary(list);
            return { count: Number(res.total) || 0, list };
          }
        );
      },
      /**
       * 每次请求先清零再累加 —— 现有页面用 += 且不清零，
       * 翻页 / 反复查询后金额会不断叠加。
       */
      calcSummary(list) {
        let pagePrice = 0;
        let pageQty = 0;
        list.forEach((row) => {
          pagePrice +=
            Number(row.GOODS_QTY || 0) * Number(row.SUPPLY_PRICE || 0);
          pageQty += Number(row.RECEIVING_QUANTITY || 0);
        });
        // ALL_PRICE / ALL_QTY 由后端 SQLCount 写入每一行，是全量汇总
        const first = list[0] || {};
        this.summary = {
          pagePrice: pagePrice.toFixed(2),
          totalPrice: Number(first.ALL_PRICE || 0).toFixed(2),
          pageQty: String(pageQty),
          totalQty: String(first.ALL_QTY || 0)
        };
      },
      onWhereChange(where) {
        this.currentWhere = { ...where };
      },
      reload(where) {
        this.currentWhere = { ...where };
        this.$refs.table.reload({ page: 1, where: this.currentWhere });
      },
      openSummary(where) {
        this.currentWhere = { ...where };
        this.summaryWhere = { ...where };
        this.summaryVisible = true;
      },
      /**
       * 两套导出列对应老页面 Excel_StorageSingle / Excel_StorageSingleNew。
       * size=999999 会触发后端「科室流向导出按钮」权限校验，无权限时
       * 后端返回 code 400，错误由 API 层抛出并提示。
       */
      exportExcel(mode) {
        const cols = EXPORT_COLUMNS[mode] || EXPORT_COLUMNS.legacy;
        const fileName =
          mode === 'current' ? '数据导出.xlsx' : '科室入库查询.xlsx';
        const loading = this.$loading({ lock: true, text: '正在导出数据...' });
        GetDeptInStockDetail({
          page: 1,
          limit: 999999,
          where: this.currentWhere,
          order: this.currentOrder
        })
          .then((res) => {
            const array = [cols.map((col) => col.label)];
            (res.result || []).forEach((row) => {
              array.push(
                cols.map((col) => {
                  const value = col.get(row);
                  return value == null ? '' : value;
                })
              );
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: { Sheet1: utils.aoa_to_sheet(array) }
              },
              fileName
            );
            this.$message.success('导出成功');
          })
          .catch((error) => {
            this.$message.error(error.message || '导出失败');
          })
          .finally(() => {
            loading.close();
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dept-instock-page {
    .page-title {
      display: inline-block;
      padding: 0 12px 8px 2px;
      margin-bottom: 8px;
      border-bottom: 3px solid #3e9ef7;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
    .summary-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 16px;
      padding: 8px 12px 0;
      font-size: 13px;
      color: #606266;
      b {
        color: #303133;
      }
    }
  }
</style>
