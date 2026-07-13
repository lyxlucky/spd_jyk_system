<template>
  <div class="ele-body spd-page ks-consume-query">
    <el-card shadow="never" class="ks-consume-query-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head spd-panel__head--split">
          <span>科室消耗查询</span>
          <span class="spd-panel__head-meta summary-bar">
            <span>当前页总金额: <b>{{ summary.pageCost }}</b></span>
            <span>所有页总金额: <b>{{ summary.allCost }}</b></span>
            <span>当前页散货汇总数量: <b>{{ summary.pageGoodsQty }}</b></span>
            <span>所有页散货汇总数量: <b>{{ summary.allGoodsQty }}</b></span>
          </span>
        </div>
        <ConsumeSearch
          ref="search"
          :exporting="exporting"
          :exporting-fast="exportingFast"
          :can-reverse="canReverse"
          :reverse-ready="canReverseRow"
          @search="reload"
          @export-front="exportFront"
          @export-fast="exportFast"
          @reverse="onReverse"
          @hb-cost-dept="openHbCostDept"
          @def-stat="openDefStat"
        />
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">科室消耗列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            :page-size="20"
            :page-sizes="[20, 50, 100, 150, 300, 99999]"
            cache-key="KSConsumeQueryTable_v2"
            @row-click="onRowClick"
            @selection-change="onSelectionChange"
          />
        </div>
      </div>
    </el-card>

    <el-dialog title="回补成本科室" :visible.sync="hbVisible" width="400px" append-to-body>
      <el-form label-width="100px" size="small">
        <el-form-item label="科室编码">
          <el-input v-model="hbDeptCode" placeholder="请输入二级科室编码" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="hbVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="hbSubmitting" @click="submitHbCostDept">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="定数包计退费统计" :visible.sync="defStatVisible" width="900px" append-to-body>
      <ele-pro-table
        v-if="defStatVisible"
        ref="defStatTable"
        size="mini"
        border
        :toolbar="false"
        height="480px"
        :columns="defStatColumns"
        :datasource="defStatDatasource"
        :page-size="20"
      />
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import ConsumeSearch from './components/ConsumeSearch.vue';
import { getConsumeColumns } from './columns';
import {
  searchConsume,
  exportKSConsumeQueryFast,
  reverseConsume,
  hbCostDept
} from '@/api/KSInventory/KSConsumeQuery';
import { EXPORT_HEADERS, openExcelFile, rowToExportArray } from './utils';

export default {
  name: 'KSConsumeQuery',
  components: { ConsumeSearch },
  data() {
    return {
      columns: getConsumeColumns(),
      tableHeight: 'calc(100vh - 480px)',
      selection: [],
      reverseRow: null,
      summary: {
        pageCost: '0.00',
        allCost: '0.00',
        pageGoodsQty: 0,
        allGoodsQty: 0
      },
      lastWhere: {},
      lastSort: { field: '', order: '' },
      exporting: false,
      exportingFast: false,
      canReverse: false,
      hbVisible: false,
      hbDeptCode: '',
      hbSubmitting: false,
      defStatVisible: false,
      defStatColumns: [
        { prop: 'DEF_NO_PKG_CODE', label: '定数包编码', minWidth: 150 },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'CONSUME_COUNT', label: '消耗数量', width: 100, align: 'right' },
        { prop: 'REFUND_COUNT', label: '退费数量', width: 100, align: 'right' }
      ]
    };
  },
  computed: {
    canReverseRow() {
      return this.reverseRow?.Reverse_State == 1 && !!this.reverseRow?.Def_No_Pkg_Code;
    }
  },
  created() {
    localStorage.setItem('KSConsumeQueryTableSize', JSON.stringify('mini'));
    const list = this.$store.state.user?.info?.permission_group || [];
    this.canReverse = list.some((p) => p.Permission_Url === 'KSConsumeQuery_逆向消耗');
  },
  methods: {
    parseSort(order) {
      const field = order?.sort || '';
      const o = order?.order;
      let ord = '';
      if (o === 'asc' || o === 'ascending') ord = 'asc';
      else if (o === 'desc' || o === 'descending') ord = 'desc';
      return { field, order: ord };
    },
    async datasource({ page, limit, where, order }) {
      const w = where || this.lastWhere;
      const sort = this.parseSort(order);
      this.lastWhere = w;
      this.lastSort = sort;
      try {
        const res = await searchConsume(w, page, limit, sort);
        this.summary = {
          pageCost: res.pageCost ?? '0.00',
          allCost: res.allCost ?? '0.00',
          pageGoodsQty: res.pageGoodsQty ?? 0,
          allGoodsQty: res.allGoodsQty ?? 0
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
    onSelectionChange(rows) {
      this.selection = rows;
    },
    async exportFront() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        const res = await searchConsume(where, 1, 9999999, this.lastSort);
        const data = [EXPORT_HEADERS];
        (res.result || []).forEach((r) => data.push(rowToExportArray(r)));
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '科室消耗');
        writeFile(book, '科室消耗查询.xlsx');
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async exportFast() {
      const where = this.$refs.search.getWhere();
      this.exportingFast = true;
      try {
        const res = await exportKSConsumeQueryFast(where, this.lastSort);
        openExcelFile(res.msg);
        Message.success(
          res.totalCount != null ? `导出成功，共 ${res.totalCount} 条` : '导出成功'
        );
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingFast = false;
      }
    },
    async onReverse() {
      const row = this.reverseRow;
      if (!row?.Def_No_Pkg_Code) {
        Message.warning('请选择有定数码的消耗记录');
        return;
      }
      if (row.Reverse_State != 1) {
        Message.warning('该记录禁止逆向消耗');
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
    },
    openHbCostDept() {
      if (!this.selection.length) {
        Message.warning('请至少勾选一行数据');
        return;
      }
      this.hbDeptCode = '';
      this.hbVisible = true;
    },
    async submitHbCostDept() {
      if (!this.hbDeptCode) {
        Message.warning('请输入科室编码');
        return;
      }
      this.hbSubmitting = true;
      try {
        const ids = this.selection.map((r) => r.Id);
        const res = await hbCostDept(ids, this.hbDeptCode);
        Message.success(res.msg || '操作成功');
        this.hbVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.hbSubmitting = false;
      }
    },
    openDefStat() {
      this.defStatVisible = true;
    },
    async defStatDatasource({ page, limit }) {
      try {
        const res = await request.post(
          '/PekingApplication/GetDefNoPkgConsumeStat',
          formdataify({ Token: sessionStorage.getItem(TOKEN_STORE_NAME) })
        );
        const data = res.data;
        if (data?.code == 200) {
          const list = data.data || [];
          const start = (page - 1) * limit;
          return { count: data.total || list.length, list: list.slice(start, start + limit) };
        }
        throw new Error(data?.msg || '查询失败');
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.ks-consume-query-card :deep(.el-card__body) {
  padding: 10px;
}

.summary-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  font-weight: normal;
}

.summary-bar b {
  color: #409eff;
  font-weight: 600;
}

.ks-consume-query >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
