<template>
  <div class="ele-body spd-page ks-consume-query-temp">
    <el-card shadow="never">
      <div class="summary-bar">
        <span>当前页总金额: <b>{{ summary.pageCost }}</b></span>
        <span>所有页总金额: <b>{{ summary.allCost }}</b></span>
        <span>当前页散货汇总数量: <b>{{ summary.pageGoodsQty }}</b></span>
        <span>所有页散货汇总数量: <b>{{ summary.allGoodsQty }}</b></span>
        <span>数据更新时间: <b>{{ summary.upTime }}</b></span>
      </div>
      <ConsumeSearch
        ref="search"
        :exporting="exporting"
        :exporting-ep="exportingEp"
        :refreshing="refreshing"
        :can-reverse="canReverse"
        :reverse-ready="!!reverseRow"
        @search="reload"
        @export-front="exportFront"
        @export-ep="exportEp"
        @refresh-data="onRefreshData"
        @reverse="onReverse"
      />
      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="20"
        :page-sizes="[20, 50, 100, 150, 300]"
        cache-key="KSConsumeQueryTempTable"
        @row-click="onRowClick"
      />
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import ConsumeSearch from './components/ConsumeSearch.vue';
import { getConsumeColumns } from './columns';
import {
  searchConsumeTemp,
  exportConsumeEpPlus,
  refreshConsumeTemp,
  reverseConsume
} from '@/api/KSInventory/KSConsumeQueryTemp';
import { EXPORT_HEADERS, openExcelFile, rowToExportArray } from './utils';

export default {
  name: 'KSConsumeQueryTemp',
  components: { ConsumeSearch },
  data() {
    return {
      columns: getConsumeColumns(),
      tableHeight: 'calc(100vh - 380px)',
      selection: [],
      summary: {
        pageCost: '0.00',
        allCost: '0.00',
        pageGoodsQty: 0,
        allGoodsQty: 0,
        upTime: ''
      },
      lastWhere: {},
      lastSort: { field: '', order: '' },
      reverseRow: null,
      exporting: false,
      exportingEp: false,
      refreshing: false,
      canReverse: false
    };
  },
  created() {
    const list = this.$store.state.user?.info?.permission_group || [];
    this.canReverse = list.some((p) => p.Permission_Url === 'KSConsumeQuery_逆向消耗');
  },
  methods: {
    async datasource({ page, limit, where, order }) {
      const w = where || this.lastWhere;
      const sort = {
        field: order?.sort || '',
        order: order?.order === 'ascending' ? 'asc' : order?.order === 'descending' ? 'desc' : ''
      };
      this.lastWhere = w;
      this.lastSort = sort;
      try {
        const res = await searchConsumeTemp(w, page, limit, sort);
        this.summary = {
          pageCost: res.pageCost ?? '0.00',
          allCost: res.allCost ?? '0.00',
          pageGoodsQty: res.pageGoodsQty ?? 0,
          allGoodsQty: res.allGoodsQty ?? 0,
          upTime: res.upTime ?? ''
        };
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.reverseRow = null;
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    onRowClick(row) {
      this.reverseRow = row;
    },
    async exportFront() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const res = await searchConsumeTemp(where, 1, 9999999, this.lastSort);
        const data = [EXPORT_HEADERS];
        (res.result || []).forEach((r) => data.push(rowToExportArray(r)));
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '科室消耗');
        writeFile(book, '科室消耗查询V2.xlsx');
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async exportEp() {
      const where = this.$refs.search.getWhere();
      this.exportingEp = true;
      try {
        const res = await exportConsumeEpPlus(where, this.lastSort);
        openExcelFile(res.msg);
        Message.success(res.totalCount != null ? `导出成功，共 ${res.totalCount} 条` : '导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingEp = false;
      }
    },
    async onRefreshData() {
      try {
        await MessageBox.confirm('确认更新全部消耗临时表数据？耗时可能较长。', '提示', { type: 'warning' });
      } catch {
        return;
      }
      this.refreshing = true;
      try {
        const res = await refreshConsumeTemp();
        Message.success(res.msg || '更新成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '更新失败');
      } finally {
        this.refreshing = false;
      }
    },
    async onReverse() {
      const row = this.reverseRow;
      if (!row?.Def_No_Pkg_Code) {
        Message.warning('请选择有定数码的消耗记录');
        return;
      }
      try {
        await MessageBox.confirm(`确认对定数码 [${row.Def_No_Pkg_Code}] 执行逆向消耗？`, '提示', {
          type: 'warning'
        });
        await reverseConsume(row.Id);
        Message.success(`定数码[${row.Def_No_Pkg_Code}]逆向消耗成功`);
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    }
  }
};
</script>

<style scoped>
.summary-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #303133;
}
.summary-bar b {
  color: #009688;
  font-weight: 600;
}
</style>
