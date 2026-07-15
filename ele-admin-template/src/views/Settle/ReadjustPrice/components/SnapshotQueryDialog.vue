<template>
  <el-dialog
    title="调价库存快照查询"
    :visible.sync="innerVisible"
    width="94%"
    top="3vh"
    append-to-body
    destroy-on-close
    @open="onOpen"
  >
    <div class="snapshot-toolbar">
      <span class="snapshot-label">品名/型号规格/品种编码</span>
      <el-input
        v-model="where.VARIETIE_SEARCH_VALUE"
        size="mini"
        clearable
        placeholder="请输入品名/型号/编码"
        style="width: 220px"
        @keyup.enter.native="reload"
      />
      <span class="snapshot-label">快照单号</span>
      <el-input
        v-model="where.BATCH_NUM"
        size="mini"
        clearable
        placeholder="请输入快照单号"
        style="width: 170px"
        @keyup.enter.native="reload"
      />
      <span class="snapshot-label">供应商名称</span>
      <el-input
        v-model="where.SUPPLIER_NAME"
        size="mini"
        clearable
        placeholder="请输入供应商名称"
        style="width: 210px"
        @keyup.enter.native="reload"
      />
      <span class="snapshot-label">打印状态</span>
      <el-select
        v-model="where.PRINT_STATE"
        size="mini"
        clearable
        placeholder="全部"
        style="width: 110px"
      >
        <el-option label="全部" value="" />
        <el-option label="未打印" value="0" />
        <el-option label="已打印" value="1" />
      </el-select>
      <span class="snapshot-label">调价日期</span>
      <el-date-picker
        v-model="tjDate"
        type="date"
        size="mini"
        value-format="yyyy-MM-dd"
        placeholder="打印用日期"
        style="width: 145px"
      />
      <div class="snapshot-actions">
        <el-button type="primary" size="mini" plain @click="reload">查询</el-button>
        <el-button type="primary" size="mini" plain :loading="exportLoading" @click="onExport">
          导出
        </el-button>
        <el-button size="mini" plain @click="onPrint">打印</el-button>
        <el-button size="mini" plain @click="onPrintConfirm">打印调价确认函</el-button>
      </div>
    </div>

    <ele-pro-table
      ref="table"
      size="mini"
      :stripe="true"
      height="calc(100vh - 260px)"
      :toolbar="false"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 900]"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
    />
  </el-dialog>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { API_BASE_URL, HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import { getTJ_STOCK_LOG } from '@/api/Settle/ReadjustPrice';
import { readjustPriceIsSpt } from '../utils';
import request from '@/utils/request';

export default {
  name: 'SnapshotQueryDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      where: {
        VARIETIE_SEARCH_VALUE: '',
        BATCH_NUM: '',
        SUPPLIER_NAME: '',
        PRINT_STATE: ''
      },
      tjDate: '',
      selection: [],
      exportLoading: false,
      showSpt: readjustPriceIsSpt()
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
    columns() {
      const cols = [
        { type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { prop: 'BATCH_NUM', label: '快照单号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'CONTRACT_CODE', label: '合同编码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 110, showOverflowTooltip: true }
      ];
      if (this.showSpt) {
        cols.push({
          prop: 'PROVINCE_PLATFORM_CODE',
          label: '省平台编码',
          minWidth: 120,
          showOverflowTooltip: true
        });
      }
      cols.push(
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'CURR_SUPPLY_PRICE', label: '旧价格', width: 90, align: 'right' },
        { prop: 'NEW_SUPPLY_PRICE', label: '新价格', width: 90, align: 'right' },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SUMCOUNT', label: '库存数量', width: 90, align: 'right' },
        { prop: 'SOURCE_NAME', label: '所属区域', minWidth: 100, showOverflowTooltip: true },
        { prop: 'CREATE_TIME', label: '创建时间', minWidth: 140, showOverflowTooltip: true },
        {
          prop: 'PRINT_STATE',
          label: '打印状态',
          width: 90,
          align: 'center',
          formatter: (_r, _c, v) => (v == 1 || v === '1' ? '已打印' : '未打印')
        }
      );
      return cols;
    }
  },
  methods: {
    token() {
      return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
    },
    onOpen() {
      this.selection = [];
      this.$nextTick(() => this.reload());
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      return getTJ_STOCK_LOG(this.where, page, limit).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    buildExportRows(rows) {
      const headers = [
        '快照单号',
        '供应商名称',
        '合同编码',
        '合同名称',
        '品种编码',
        '品种名称',
        '旧价格',
        '新价格',
        '规格型号',
        '单位',
        '生产企业',
        '库存数量',
        '所属区域',
        '创建时间',
        '打印状态'
      ];
      if (this.showSpt) {
        headers.splice(5, 0, '省平台编码');
      }
      const data = [headers];
      (rows || []).forEach((r) => {
        const row = [
          r.BATCH_NUM,
          r.SUPPLIER_NAME,
          r.CONTRACT_CODE,
          r.CONTRACT_NAME,
          r.VARIETIE_CODE_NEW,
          r.VARIETIE_NAME,
          r.CURR_SUPPLY_PRICE,
          r.NEW_SUPPLY_PRICE,
          r.SPECIFICATION_OR_TYPE,
          r.UNIT,
          r.MANUFACTURING_ENT_NAME,
          r.SUMCOUNT,
          r.SOURCE_NAME,
          r.CREATE_TIME,
          r.PRINT_STATE == 1 || r.PRINT_STATE === '1' ? '已打印' : '未打印'
        ];
        if (this.showSpt) {
          row.splice(5, 0, r.PROVINCE_PLATFORM_CODE);
        }
        data.push(row);
      });
      return data;
    },
    async onExport() {
      this.exportLoading = true;
      try {
        const res = await getTJ_STOCK_LOG(this.where, 1, 999999);
        const rows = res.result || [];
        if (!rows.length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        const ws = utils.aoa_to_sheet(this.buildExportRows(rows));
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '调价库存快照');
        writeFile(wb, '调价库存快照.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportLoading = false;
      }
    },
    ensureSelection() {
      if (!this.selection.length) {
        this.$message.warning('请至少选择一行数据');
        return false;
      }
      return true;
    },
    async onPrint() {
      if (!this.ensureSelection()) return;
      const row = this.selection[0];
      let apiName = '';
      if (['stzx', 'stse', 'csyy'].includes(HOME_HP)) {
        apiName = 'GetStzxExcel';
      } else if (HOME_HP === 'stzl') {
        apiName = 'GetStzlExcel';
      }
      if (!apiName) {
        this.$message.warning('当前院区未配置快照打印接口');
        return;
      }
      try {
        const res = await request.get(`/AAZL_EXCEL/${apiName}`, {
          params: {
            BATCH_NUM: row.BATCH_NUM,
            SUPPLIER_CODE: row.SUPPLIER_CODE,
            tjDate: this.tjDate || '',
            Token: this.token()
          }
        });
        const body = res.data;
        if (body?.code == 301) {
          this.$alert(body.msg || '登录失效');
          return;
        }
        if (body?.code == 200 || body?.code === '200') {
          const base = (API_BASE_URL || '').replace(/\/api\/?$/, '');
          window.open(`${base}/Excel/files/${body.msg}`);
        } else {
          this.$message.error(body?.msg || '打印失败');
        }
      } catch (e) {
        this.$message.error(e.message || '打印失败');
      }
    },
    onPrintConfirm() {
      if (!this.ensureSelection()) return;
      const ids = this.selection.map((r) => r.ID).filter(Boolean);
      if (!ids.length) {
        this.$message.warning('选中行缺少 ID，无法打印');
        return;
      }
      const base = (API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/MonthClearing/ST_TJDPrint?id=68&format=pdf&inline=true&IDS=${encodeURIComponent(
        JSON.stringify(ids)
      )}`;
      window.open(url);
    }
  }
};
</script>

<style scoped>
.snapshot-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 10px;
}

.snapshot-label {
  white-space: nowrap;
  font-size: 12px;
  color: #606266;
}

.snapshot-actions {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
