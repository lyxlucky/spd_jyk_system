<template>
  <el-dialog
    title="修改日志"
    :visible.sync="innerVisible"
    width="96%"
    top="4vh"
    append-to-body
    destroy-on-close
    custom-class="var-up-log-dialog"
    @closed="onClosed"
  >
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__body">
        <el-form size="mini" class="search-form" inline @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="where.search"
              clearable
              placeholder="品种名称/编码"
              class="kw kw--md"
              @keyup.enter.native="reload"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.search2"
              clearable
              placeholder="字段名称"
              class="kw kw--md"
              @keyup.enter.native="reload"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.Operator"
              clearable
              placeholder="操作人"
              class="kw kw--sm"
              @keyup.enter.native="reload"
            />
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="where.Varuplog_TimeStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始"
              style="width: 130px"
            />
            <span class="date-sep">~</span>
            <el-date-picker
              v-model="where.Varuplog_TimeEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束"
              style="width: 130px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="search-btn" @click="reload">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="spd-panel spd-panel--actions">
      <div class="action-bar">
        <el-button size="mini" plain icon="el-icon-download" :loading="exporting" @click="onExport">
          导出Excel
        </el-button>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__body spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          size="mini"
          :stripe="true"
          height="calc(75vh - 220px)"
          :page-size="20"
          :page-sizes="[20, 50, 100, 150, 300, 1000, 3000]"
          :columns="columns"
          :datasource="datasource"
          cache-key="varUpLogDialogTable"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getVarUpLogList } from '@/api/Home/VarUpLog';

const EXPORT_HEADERS = [
  '品种ID',
  '品种编码',
  '计费编码',
  '品种名称',
  '规格型号',
  '中标价',
  '单位',
  '批准文号',
  '生产企业',
  '修改字段名称',
  '修改字段',
  '修改前',
  '修改后',
  '操作人',
  '最后更新时间'
];

function formatRow(row) {
  return [
    row.VARIETIE_CODE,
    row.VARIETIE_CODE_NEW,
    row.CHARGING_CODE,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.PRICE,
    row.UNIT,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    row.SOURCEDESCRIBE,
    row.SOURCEFILEDNAME,
    row.TARGETVALUE,
    row.SOURCEVALUE,
    row.LOG_USER,
    row.UPTIME
  ];
}

export default {
  name: 'VarUpLogDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      where: {
        search: '',
        search2: '',
        Operator: '',
        Varuplog_TimeStart: '',
        Varuplog_TimeEnd: ''
      },
      exporting: false,
      columns: [
        { type: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        { prop: 'VARIETIE_CODE', label: '品种ID', width: 120, showOverflowTooltip: true },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 120, showOverflowTooltip: true },
        { prop: 'CHARGING_CODE', label: '计费编码', width: 120, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'PRICE', label: '中标价', width: 90, align: 'right' },
        { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
        { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SOURCEDESCRIBE', label: '修改字段名称', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SOURCEFILEDNAME', label: '修改字段', minWidth: 100, showOverflowTooltip: true },
        { prop: 'TARGETVALUE', label: '修改前', minWidth: 100, showOverflowTooltip: true },
        { prop: 'SOURCEVALUE', label: '修改后', minWidth: 100, showOverflowTooltip: true },
        { prop: 'LOG_USER', label: '操作人', width: 90, showOverflowTooltip: true },
        {
          prop: 'UPTIME',
          label: '最后更新时间',
          width: 150,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        }
      ]
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => this.reload());
      }
    }
  },
  methods: {
    reload() {
      this.$refs.table?.reload?.({ page: 1 });
    },
    buildQueryParams() {
      return { ...this.where };
    },
    async datasource({ page, limit }) {
      const res = await getVarUpLogList({
        ...this.buildQueryParams(),
        page,
        size: limit
      });
      return { count: res.total, list: res.result };
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getVarUpLogList({
          ...this.buildQueryParams(),
          page: 1,
          size: 9999999
        });
        const rows = (res.result || []).map(formatRow);
        const { utils, writeFile } = await import('xlsx');
        const ws = utils.aoa_to_sheet([EXPORT_HEADERS, ...rows]);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '修改日志');
        writeFile(wb, '修改日志.xlsx');
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    onClosed() {
      this.where = {
        search: '',
        search2: '',
        Operator: '',
        Varuplog_TimeStart: '',
        Varuplog_TimeEnd: ''
      };
    }
  }
};
</script>

<style scoped>
.search-form ::v-deep .el-form-item {
  margin-bottom: 0;
}
.kw--sm {
  width: 100px;
}
.kw--md {
  width: 140px;
}
.date-sep {
  margin: 0 6px;
  color: #c0c4cc;
}
.search-btn {
  height: 28px;
  padding: 0 14px;
}
.action-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #fafbfc;
}
.spd-panel--search .spd-panel__body {
  padding: 10px 12px;
}
</style>

<style>
.var-up-log-dialog .el-dialog__body {
  padding: 8px 12px 16px;
  max-height: calc(90vh - 54px);
  overflow: auto;
}
</style>
