<template>
  <el-card shadow="never">
    <div slot="header">拣配品种明细</div>
    <ele-pro-table
      ref="table"
      size="mini"
      height="360px"
      highlight-current-row
      :columns="columns"
      :datasource="datasource"
      cache-key="pickingMnagementPickDetail"
      @row-click="handleRowClick"
    >
      <template v-slot:planAction="{ row }">
        <el-button type="primary" size="mini" @click.stop="openLinkPlan(row)">关联计划</el-button>
      </template>
    </ele-pro-table>
    <LinkPlanDialog
      :visible.sync="linkPlanVisible"
      :detail-id="linkDetailId"
      @success="handleSearch"
    />
  </el-card>
</template>

<script>
import { getPickDetail } from '@/api/Inventory/PickingMnagement';
import { unwrapData } from '../utils';
import LinkPlanDialog from './LinkPlanDialog.vue';

export default {
  name: 'PickDetailPanel',
  components: { LinkPlanDialog },
  props: {
    packNumber: { type: String, default: '' }
  },
  data() {
    return {
      linkPlanVisible: false,
      linkDetailId: '',
      columns: [
        { prop: 'Varietie_Code', label: '品种材料编码', width: 160 },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 200,align: 'center' },
        { prop: 'Specification_Or_Type', label: '型号/规格', width: 120,align: 'center' },
        { prop: 'Unit', label: '单位', width: 80, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', width: 140 ,align: 'center'},
        { prop: 'Coefficient', label: '系数', width: 80, align: 'center' },
        { prop: 'Actual_Pack_Quantity', label: '拣配包数', width: 120, align: 'center' },
        { prop: 'PLAN_NUMBER', label: '计划单号', width: 120, align: 'center' },
        {
          columnKey: 'planAction',
          label: '关联计划',
          width: 120,
          align: 'center',
          slot: 'planAction'
        }
      ]
    };
  },
  watch: {
    packNumber(val) {
      if (val) this.handleSearch();
    }
  },
  methods: {
    datasource({ page, limit }) {
      if (!this.packNumber) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getPickDetail({ page, limit, packDirectiveNumber: this.packNumber }).then(
        (res) => {
          const data = unwrapData(res);
          return {
            count: data.total || 0,
            list: data.result || []
          };
        }
      );
    },
    handleSearch() {
      this.$refs.table?.reload({ page: 1 });
    },
    handleRowClick(row) {
      this.$emit('variety-selected', row);
    },
    openLinkPlan(row) {
      this.linkDetailId = row.ID || row.id || '';
      this.linkPlanVisible = true;
    }
  }
};
</script>
