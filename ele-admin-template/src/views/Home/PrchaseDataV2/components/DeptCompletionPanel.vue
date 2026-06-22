<template>
  <div>
    <ProjectSearchBar
      v-model="where"
      dept-mode
      :xm-name-options="xmNameOptions"
      :xm-num-options="xmNumOptions"
      :xm-type-options="xmTypeOptions"
      @search="reload"
    >
      <template v-slot:actions>
        <el-button size="small" icon="el-icon-download" :loading="exporting" @click="onExport">
          导出
        </el-button>
      </template>
    </ProjectSearchBar>
    <ele-pro-table
      ref="table"
      :height="tableHeight"
      :columns="columns"
      :datasource="datasource"
      :page-size="30"
      :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
      :row-class-name="rowClass"
      cache-key="HomePrchaseDataV2DeptTable"
      @sort-change="onSortChange"
    >
      <template v-slot:endDate="{ row }">
        <span :class="{ 'text-danger': fmtEndDateWithDays(row).danger }">
          {{ fmtEndDateWithDays(row).text }}
        </span>
      </template>
      <template v-slot:wcl="{ row }">{{ row.WCL || 0 }}%</template>
      <template v-slot:shProcess="{ row }">{{ fmtTimeProgress(row) }}</template>
      <template v-slot:leftQty="{ row }">{{ deptLeftQty(row) }}</template>
    </ele-pro-table>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ProjectSearchBar from './ProjectSearchBar.vue';
import { getLimitDeptAll } from '@/api/Home/PrchaseDataV2';
import {
  defaultWhere,
  exportAoA,
  fmtDate10,
  fmtEndDateWithDays,
  fmtTimeProgress,
  deptLeftQty,
  isWarningRow,
  regName,
  approvalNo,
  mfgName,
  calcTimeProgress
} from '../utils';

export default {
  components: { ProjectSearchBar },
  props: {
    xmNameOptions: { type: Array, default: () => [] },
    xmNumOptions: { type: Array, default: () => [] },
    xmTypeOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      where: defaultWhere(),
      sort: { field: '', order: '' },
      exporting: false,
      tableHeight: 'calc(100vh - 320px)',
      columns: [
        { prop: 'PROD_SOURCE_FROM', label: '自定义来源', minWidth: 120, showOverflowTooltip: true },
        { prop: 'XM_NUM', label: '项目编号', minWidth: 130 },
        { prop: 'XM_NAME', label: '项目名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'XM_TYPE', label: '项目类型', minWidth: 110 },
        { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 140, showOverflowTooltip: true },
        { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 150, showOverflowTooltip: true },
        {
          prop: 'BUY_TIME',
          label: '起始日期',
          width: 110,
          formatter: (_r, _c, v) => fmtDate10(v)
        },
        { columnKey: 'endDate', label: '结束日期', width: 150, slot: 'endDate' },
        { prop: 'PRICE', label: '单价', width: 90, align: 'right' },
        { prop: 'COUNT', label: '任务量', width: 90, align: 'right' },
        { prop: 'SOURCE_FROM', label: '阳光来源', minWidth: 110, showOverflowTooltip: true },
        { prop: 'DEPT_TWO_CODE', label: '二级科室编码', width: 130 },
        { prop: 'DEPT_TWO_NAME', label: '二级科室名称', minWidth: 150, showOverflowTooltip: true },
        { prop: 'DEPT_LIMIT_QTY', label: '科室监测量', width: 110, align: 'right' },
        { prop: 'GOODS_QTY', label: '科室已用量', width: 110, align: 'right' },
        { columnKey: 'leftQty', label: '余可用数量', width: 110, align: 'right', slot: 'leftQty' },
        { columnKey: 'wcl', label: '科室完成率%', width: 110, align: 'right', slot: 'wcl' },
        { columnKey: 'shProcess', label: '时序进度%', width: 100, align: 'right', slot: 'shProcess' }
      ]
    };
  },
  methods: {
    fmtEndDateWithDays,
    fmtTimeProgress,
    deptLeftQty,
    rowClass({ row }) {
      return isWarningRow(row) ? 'row-warning' : '';
    },
    datasource({ page, limit }) {
      return getLimitDeptAll(this.where, page, limit, this.sort).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: this.where });
    },
    onSortChange({ prop, order }) {
      this.sort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.reload();
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getLimitDeptAll(this.where, 1, 99999, this.sort);
        const rows = res.result || [];
        const header = [
          '自定义来源', '项目编号', '项目名称', '项目类型', '注册证号', '注册证名称', '生产企业',
          '起始日期', '结束日期', '单价', '任务量', '阳光来源', '二级科室编码', '二级科室名称',
          '科室监测量', '科室已用量', '余可用数量', '科室完成率%', '时序进度%'
        ];
        const data = [header];
        rows.forEach((row) => {
          let endText = '';
          let shProcess = '0.00%';
          if (row.BUY_TIME2) {
            endText = fmtEndDateWithDays(row).text;
          }
          if (row.BUY_TIME && row.BUY_TIME2) {
            shProcess = fmtTimeProgress(row);
          }
          data.push([
            row.PROD_SOURCE_FROM || '',
            row.XM_NUM || '',
            row.XM_NAME || '',
            row.XM_TYPE || '',
            approvalNo(row),
            regName(row),
            mfgName(row),
            fmtDate10(row.BUY_TIME),
            endText,
            row.PRICE || 0,
            row.COUNT || 0,
            row.SOURCE_FROM || '',
            row.DEPT_TWO_CODE || '',
            row.DEPT_TWO_NAME || '',
            row.DEPT_LIMIT_QTY || 0,
            row.GOODS_QTY || 0,
            deptLeftQty(row),
            `${row.WCL || 0}%`,
            shProcess
          ]);
        });
        exportAoA('科室完成情况.xlsx', data);
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.text-danger {
  color: #f56c6c;
}
::v-deep .row-warning > td {
  background-color: #f9d5d5 !important;
}
</style>
