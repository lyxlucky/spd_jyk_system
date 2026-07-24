<template>
  <div class="ele-body spd-page ks-consume-query-by-dept">
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
          :updating="updating"
          :notebook-exporting="notebookExporting"
          @search="reload"
          @export="onExport"
          @hz="hzVisible = true"
          @ks-hz="ksHzVisible = true"
          @fz-hz="fzHzVisible = true"
          @update-data="onUpdateData"
          @notebook="onNotebook"
        />
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">科室消耗列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            v-if="deptReady"
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :toolkit="['columns', 'fullscreen']"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :columns="columns"
            :datasource="datasource"
            :page-size="20"
            :page-sizes="[20, 50, 100, 150, 300]"
            cache-key="KSConsumeQueryByDeptTable"
          />
        </div>
      </div>
    </el-card>

    <HzDialog
      :visible.sync="hzVisible"
      :where="dialogWhere"
      :dept-two-json="deptTwoJson"
      :sort="lastSort"
    />
    <KsHzDialog
      :visible.sync="ksHzVisible"
      :where="dialogWhere"
      :dept-two-json="deptTwoJson"
      :sort="lastSort"
    />
    <FzHzDialog
      :visible.sync="fzHzVisible"
      :where="dialogWhere"
      :dept-two-json="deptTwoJson"
      :sort="lastSort"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { getUserGroupByName } from '@/api/layout';
import { setPageTab, getRouteTabKey } from '@/utils/page-tab-util';
import ConsumeSearch from './components/ConsumeSearch.vue';
import HzDialog from './components/HzDialog.vue';
import KsHzDialog from './components/KsHzDialog.vue';
import FzHzDialog from './components/FzHzDialog.vue';
import { getConsumeByDeptColumns } from './columns';
import { fmtSummaryCost } from './utils';
import {
  searchDept,
  exportDeptConsumeExcel,
  createTempToDay,
  excelKSConsum
} from '@/api/KSInventory/KSConsumeQueryByDept';

export default {
  name: 'KSConsumeQueryByDept',
  components: { ConsumeSearch, HzDialog, KsHzDialog, FzHzDialog },
  data() {
    return {
      columns: getConsumeByDeptColumns(this.hidePdaCounInfo()),
      tableHeight: 'calc(100vh - 480px)',
      deptTwoJson: '',
      deptReady: false,
      summary: {
        pageCost: '0.00',
        allCost: '0.00',
        pageGoodsQty: 0,
        allGoodsQty: 0
      },
      lastWhere: {},
      lastSort: { field: '', order: '' },
      exporting: false,
      updating: false,
      notebookExporting: false,
      hzVisible: false,
      ksHzVisible: false,
      fzHzVisible: false
    };
  },
  computed: {
    dialogWhere() {
      return this.$refs.search?.getWhere() || this.lastWhere;
    }
  },
  async created() {
    await this.initDeptTwoJson();
  },
  mounted() {
    const name = this.$options.name;
    if (name) {
      setPageTab({ key: getRouteTabKey(), components: [name] });
    }
  },
  methods: {
    hidePdaCounInfo() {
      const list = this.$store.state.user?.info?.permission_group || [];
      return !list.some((p) => p.Permission_Url === '科室结算方式-消耗结算');
    },
    parseSort(order) {
      const field = order?.sort || '';
      const o = order?.order;
      let ord = '';
      if (o === 'asc' || o === 'ascending') ord = 'asc';
      else if (o === 'desc' || o === 'descending') ord = 'desc';
      return { field, order: ord };
    },
    async initDeptTwoJson() {
      let codes = (this.$store.state.user?.info?.userDept || [])
        .map((d) => d.Dept_Two_Code)
        .filter(Boolean);
      if (!codes.length) {
        const username =
          this.$store.state.user?.info?.UserName || this.$store.state.user?.info?.username;
        if (username) {
          try {
            const res = await getUserGroupByName({ username });
            codes = (res?.userDept || []).map((d) => d.Dept_Two_Code).filter(Boolean);
          } catch {
            codes = [];
          }
        }
      }
      this.deptTwoJson = JSON.stringify(codes);
      this.deptReady = true;
    },
    async datasource({ page, limit, where, order }) {
      if (!this.deptTwoJson) {
        return { count: 0, list: [] };
      }
      const w = where || this.lastWhere;
      const sort = this.parseSort(order);
      this.lastWhere = w;
      this.lastSort = sort;
      try {
        const res = await searchDept(w, page, limit, sort, this.deptTwoJson);
        this.summary = {
          pageCost: fmtSummaryCost(res.pageCost),
          allCost: fmtSummaryCost(res.allCost),
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
      this.$refs.table?.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    async onExport() {
      const where = this.$refs.search.getWhere();
      this.exporting = true;
      try {
        await exportDeptConsumeExcel(where, this.lastSort, this.deptTwoJson);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onUpdateData() {
      this.updating = true;
      try {
        const res = await createTempToDay();
        await MessageBox.alert(res.msg || '更新成功', '提示');
        this.reload();
      } catch (e) {
        Message.error(e.message || '更新失败');
      } finally {
        this.updating = false;
      }
    },
    async onNotebook() {
      const where = this.$refs.search.getWhere();
      this.notebookExporting = true;
      try {
        await excelKSConsum(where, this.lastSort, this.deptTwoJson);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.notebookExporting = false;
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

.ks-consume-query-by-dept >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
