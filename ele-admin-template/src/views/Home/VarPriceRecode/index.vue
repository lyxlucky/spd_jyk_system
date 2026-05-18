<template>
  <div class="ele-body">
    <el-card shadow="never">
      <user-search ref="search" @search="reload" @exportData="exportData" @markAsProcessed="markAsProcessed" />
      <ele-pro-table
        ref="table"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="HomeVarPriceRecodeTable"
      />
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { Message } from 'element-ui';
import UserSearch from './components/user-search.vue';
import { getVarPriceRecodeList, varPriceRecodeCommit } from '@/api/Home/VarPriceRecode';
import { EXPORT_HEADERS, rowToExportArray } from './utils';

export default {
  name: 'HomeVarPriceRecode',
  components: { UserSearch },
  data() {
    return {
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'CREATE_TIME',
          label: '记录时间',
          align: 'center',
          width: 150,
          formatter: (row) => (row.CREATE_TIME ? String(row.CREATE_TIME).replace('T', ' ') : '')
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          minWidth: 220,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          minWidth: 220,
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          minWidth: 220,
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          width: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'OLD_PRICE',
          label: '旧价格',
          align: 'right',
          width: 80
        },
        {
          prop: 'NEW_PRICE',
          label: '新价格',
          align: 'right',
          width: 80
        },
        {
          prop: 'UP_PRICE',
          label: '收货价格',
          align: 'right',
          width: 80
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '合同供应商',
          align: 'right',
          width: 80,
          showOverflowTooltip: true
        },
        {
          prop: 'DELIVERY_NOTE_NUMBER',
          label: '收货单号',
          align: 'center',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'DELIVERY_TIME',
          label: '价格变动第一次收货时间',
          align: 'center',
          width: 250,
          formatter: (row) => {
            const v = row.DELIVERY_TIME;
            if (!v || String(v).startsWith('0001-01-01')) return '';
            return String(v).replace('T', ' ');
          }
        }
      ],
      pageSize: 30,
      pageSizes: [30, 50, 100, 150, 200, 300, 99999],
      selection: [],
      lastWhere: null
    };
  },
  methods: {
    async datasource({ page, limit, where }) {
      const w = where || this.lastWhere || this.$refs.search?.getWhere?.() || {};
      this.lastWhere = w;
      try {
        const res = await getVarPriceRecodeList({ page, size: limit, where: w });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    async markAsProcessed() {
      if (!this.selection.length) {
        Message.warning('请选择转单条目');
        return;
      }
      try {
        await this.$confirm('确认标记已处理吗？', '提示', { type: 'warning' });
        const res = await varPriceRecodeCommit(this.selection);
        Message.success(res.msg || '操作成功');
        this.$refs.table.reload({ where: this.lastWhere });
      } catch (e) {
        if (e !== 'cancel' && e?.message) {
          Message.error(e.message);
        }
      }
    },
    async exportData(where) {
      const w = where || this.$refs.search.getWhere();
      const loading = this.$messageLoading('正在导出...');
      try {
        const res = await getVarPriceRecodeList({ page: 1, size: 999999, where: w });
        const rows = (res.result || []).map((r) => rowToExportArray(r));
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet([EXPORT_HEADERS, ...rows]) }
          },
          '价格变动记录.xlsx'
        );
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    }
  }
};
</script>
