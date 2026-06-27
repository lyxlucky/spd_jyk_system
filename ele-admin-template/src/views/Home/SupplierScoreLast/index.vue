<template>
  <div class="ele-body spd-page supplier-score-last-page">
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form size="mini" class="search-form" inline @submit.native.prevent>
        <el-form-item label="供应商名称">
          <el-input
            v-model="where.supplierName"
            clearable
            placeholder="请输入供应商名称"
            class="kw kw--lg"
            @keyup.enter.native="reloadMain"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" class="search-btn" @click="reloadMain">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <div class="spd-panel spd-panel--actions">
    <div class="spd-panel__head spd-panel__head--split">
      <span>操作</span>
      <span v-if="selectedSupplier" class="spd-panel__head-meta">
        当前：{{ selectedSupplier.SUPPLIER_NAME }}
      </span>
    </div>
    <div class="action-bar">
      <div class="action-group">
        <el-button
          type="warning"
          size="mini"
          plain
          icon="el-icon-star-on"
          :disabled="!selectedSupplier"
          @click="openScoreDialog"
        >
          评分
        </el-button>
      </div>
      <div class="action-group">
        <el-button size="mini" plain icon="el-icon-download" :loading="exporting" @click="onExport">
          导出Excel
        </el-button>
      </div>
    </div>
  </div>

  <div class="spd-panel spd-table-panel">
    <div class="spd-panel__head">供应商评价列表</div>
    <div class="spd-panel__body spd-table-panel__wrap">
      <ele-pro-table
        ref="mainTable"
        size="mini"
        :stripe="true"
        highlight-current-row
        height="calc(50vh - 120px)"
        :page-size="10"
        :page-sizes="[10, 20, 50, 90, 150, 300]"
        :columns="mainColumns"
        :datasource="mainDatasource"
        cache-key="supplierScoreLastMainTable"
        @current-change="onMainRowChange"
      />
    </div>
  </div>

  <div class="spd-panel spd-table-panel">
    <div class="spd-panel__head spd-panel__head--split">
      <span>分值记录</span>
      <span v-if="selectedSupplier" class="spd-panel__head-meta">{{ selectedSupplier.SUPPLIER_NAME }}</span>
    </div>
    <div class="spd-panel__body spd-table-panel__wrap">
      <ele-pro-table
        ref="recordTable"
        size="mini"
        :stripe="true"
        height="calc(50vh - 120px)"
        :page-size="50"
        :page-sizes="[10, 50, 100, 150, 200, 300]"
        :columns="recordColumns"
        :datasource="recordDatasource"
        :empty-text="selectedSupplier ? '暂无分值记录' : '请先选择上方供应商'"
        cache-key="supplierScoreLastRecordTable"
      >
        <template v-slot:scoreType="{ row }">
          {{ formatScoreType(row.SCORE_TYPE) }}
        </template>
        <template v-slot:recordAction="{ row }">
          <el-popconfirm title="确定删除该分值记录？" @confirm="onDeleteRecord(row)">
            <template v-slot:reference>
              <el-button type="danger" size="mini" plain @click.stop>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </div>
  </div>

  <AddScoreDialog ref="addScoreDialog" @success="onScoreSuccess" />
  </div>
</template>

<script>
import {
  getSupplierScoreLastList,
  searchSupplierScore,
  delSupplierScore,
  generationEval
} from '@/api/Home/SupplierScoreLast';
import AddScoreDialog from './components/AddScoreDialog.vue';
import { displayScore, calcTotalScore, formatScoreType } from './utils';

export default {
  name: 'SupplierScoreLast',
  components: { AddScoreDialog },
  data() {
    return {
      where: {
        supplierName: '',
        year: '0'
      },
      selectedSupplier: null,
      exporting: false,
      mainColumns: [
        { type: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          minWidth: 200,
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          label: '总分',
          width: 80,
          align: 'center',
          formatter: (row) => calcTotalScore(row)
        },
        {
          prop: 'SCORE_A',
          label: '送货及时性和准确性',
          minWidth: 130,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_B',
          label: '供应产品质量稳定性',
          minWidth: 130,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_C',
          label: '资料登记完整性',
          minWidth: 110,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_D',
          label: '院内协商配合度',
          minWidth: 110,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_E',
          label: '风险问题处理能力',
          minWidth: 120,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_F',
          label: '不良事件响应与处理',
          minWidth: 150,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        },
        {
          prop: 'SCORE_G',
          label: '技术支持能力',
          minWidth: 110,
          align: 'center',
          formatter: (_row, _col, val) => displayScore(val)
        }
      ],
      recordColumns: [
        { type: 'index', label: '序号', width: 55, align: 'center' },
        { slot: 'scoreType', label: '分值类型', minWidth: 180, showOverflowTooltip: true },
        { prop: 'SCORE', label: '分数', width: 80, align: 'center' },
        { prop: 'REMARK', label: '说明', minWidth: 160, showOverflowTooltip: true },
        { prop: 'OPERATOR', label: '操作人', width: 100, showOverflowTooltip: true },
        { prop: 'CREATE_TIME', label: '创建时间', width: 160, showOverflowTooltip: true },
        { slot: 'recordAction', label: '操作', width: 90, align: 'center', fixed: 'right' }
      ]
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    formatScoreType,
    async initPage() {
      try {
        await generationEval();
      } catch (e) {
        /* 旧页静默处理，不阻断列表 */
      }
      this.reloadMain();
    },
    reloadMain() {
      this.selectedSupplier = null;
      this.$refs.mainTable?.reload?.({ page: 1 });
      this.$refs.recordTable?.reload?.({ page: 1 });
    },
    async mainDatasource({ page, limit }) {
      const res = await getSupplierScoreLastList({
        page,
        size: limit,
        SUPPLIER_NAME: this.where.supplierName,
        YEAR: this.where.year
      });
      return { count: res.total, list: res.result };
    },
    async recordDatasource({ page, limit }) {
      if (!this.selectedSupplier?.SUPPLIER_CODE) {
        return { count: 0, list: [] };
      }
      const res = await searchSupplierScore({
        page,
        size: limit,
        Supplier_Code: this.selectedSupplier.SUPPLIER_CODE,
        YEAR: this.selectedSupplier.YEAR ?? this.where.year
      });
      return { count: res.total, list: res.result };
    },
    onMainRowChange(row) {
      this.selectedSupplier = row || null;
      this.$refs.recordTable?.reload?.({ page: 1 });
    },
    openScoreDialog() {
      if (!this.selectedSupplier) {
        this.$message.warning('请选择供应商');
        return;
      }
      this.$refs.addScoreDialog.open(this.selectedSupplier);
    },
    onScoreSuccess() {
      this.$refs.mainTable?.reload?.();
      this.$refs.recordTable?.reload?.();
    },
    async onDeleteRecord(row) {
      try {
        const res = await delSupplierScore({
          ID: row.ID,
          SCORE_TYPE: row.SCORE_TYPE,
          SCORE: row.SCORE,
          SUPPLIER_CODE: row.SUPPLIER_CODE
        });
        this.$message.success(res.msg || '删除成功');
        this.$refs.mainTable?.reload?.();
        this.$refs.recordTable?.reload?.();
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getSupplierScoreLastList({
          page: 1,
          size: 999999,
          SUPPLIER_NAME: this.where.supplierName,
          YEAR: this.where.year
        });
        const headers = [
          '供应商名称',
          '总分',
          '送货及时性和准确性',
          '供应产品质量稳定性',
          '资料登记完整性',
          '院内协商配合度',
          '风险问题处理能力',
          '不良事件的响应速度及处理能力',
          '技术支持能力'
        ];
        const rows = (res.result || []).map((item) => [
          item.SUPPLIER_NAME,
          calcTotalScore(item),
          item.SCORE_A,
          item.SCORE_B,
          item.SCORE_C,
          item.SCORE_D,
          item.SCORE_E,
          item.SCORE_F,
          item.SCORE_G
        ]);
        const { utils, writeFile } = await import('xlsx');
        const ws = utils.aoa_to_sheet([headers, ...rows]);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '供应商评价');
        writeFile(wb, '供应商评价.xlsx');
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
.supplier-score-last-page {
  padding-bottom: 12px;
}

.search-form ::v-deep .el-form-item {
  margin-bottom: 0;
}

.kw--lg {
  width: 200px;
}

.search-btn {
  height: 28px;
  padding: 0 14px;
}

.spd-panel--actions .spd-panel__head--split {
  gap: 12px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 0;
  padding: 10px 12px;
  background: #fafbfc;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  margin-right: 12px;
  border-right: 1px solid #dcdfe6;
}

.action-group:last-child {
  padding-right: 0;
  margin-right: 0;
  border-right: none;
}

.action-bar ::v-deep .el-button + .el-button {
  margin-left: 0;
}
</style>
