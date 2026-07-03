<template>
  <el-dialog
    title="明细"
    :visible.sync="innerVisible"
    width="900px"
    append-to-body
    @open="onOpen"
  >
    <ele-pro-table
      ref="table"
      size="mini"
      :height="520"
      :toolbar="false"
      :columns="columns"
      :datasource="datasource"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 300, 1000]"
    />
  </el-dialog>
</template>

<script>
import { getRegistrationWarnDetail } from '@/api/Statistics/RegistrationWarn';

const columns = [
  { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 140, showOverflowTooltip: true },
  { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 140, showOverflowTooltip: true },
  { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140, showOverflowTooltip: true },
  { prop: 'GOODS_QTY', label: '数量', width: 90, align: 'center' },
  { prop: 'AA_AVG_GOODS_QTY', label: '所选周期月平均用量', minWidth: 140, align: 'center' },
  { prop: 'SPD_COST_DEPT_NAME', label: '成本科室', minWidth: 120, showOverflowTooltip: true }
];

export default {
  name: 'RegistrationWarnDetailDialog',
  props: {
    visible: { type: Boolean, default: false },
    row: { type: Object, default: null },
    queryWhere: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      innerVisible: false,
      columns
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
    },
    datasource({ page, limit }) {
      if (!this.row) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getRegistrationWarnDetail(this.row, this.queryWhere, page, limit)
        .then((res) => ({ count: res.total, list: res.list }))
        .catch((e) => {
          this.$message.error(e.message || '查询明细失败');
          return { count: 0, list: [] };
        });
    }
  }
};
</script>
