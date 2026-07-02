<template>
  <el-dialog :title="dialogTitle" :visible.sync="innerVisible" width="1000px" append-to-body @open="reload">
    <ele-pro-table
      ref="table"
      size="mini"
      :height="480"
      :toolbar="false"
      :columns="columns"
      :datasource="datasource"
      :page-size="20"
      :page-sizes="[20, 50, 100]"
    />
  </el-dialog>
</template>

<script>
import { fmtDate10 } from '../utils';
import {
  loadLockingGoodsDtl,
  loadLockingDefCodes,
  loadPreLockingDefCodes
} from '@/api/Inventory/InventoryQueryNew';

const TYPE_META = {
  goods: {
    title: '散货锁定',
    columns: [
      { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 90 },
      { prop: 'Varietie_Name', label: '品种全称', minWidth: 200 },
      {
        prop: 'Lock_Type',
        label: '锁定类型',
        width: 90,
        formatter: (r) => {
          const m = { 0: '制包', 1: '退购', 2: '申领', 3: '散货调拨' };
          return m[r.Lock_Type] ?? r.Lock_Type;
        }
      },
      { prop: 'Lock_Qty', label: '锁定数量', width: 80, align: 'center' },
      { prop: 'Curr_Number', label: '对应单号', minWidth: 100 }
    ],
    loader: loadLockingGoodsDtl
  },
  def: {
    title: '定数包锁定',
    columns: [
      { prop: 'Varietie_Code_New', label: '品种编码', width: 90 },
      { prop: 'Varietie_Name', label: '品种全称', minWidth: 160 },
      {
        prop: 'Curr_Pos',
        label: '锁定状态',
        width: 90,
        formatter: (r) => {
          const m = { 0: '拣配锁定', 1: '出库锁定', 2: '配送锁定', 3: '科室暂借', 4: '调拨锁定' };
          return m[r.Curr_Pos] ?? '未知';
        }
      },
      { prop: 'Coefficient', label: '系数', width: 55, align: 'center' },
      { prop: 'Def_No_Pkg_Code', label: '定数码', minWidth: 110 },
      { prop: 'Serial_Number', label: 'UDI码', minWidth: 100 },
      { prop: 'Rfid_Code', label: 'RFID码', minWidth: 100 },
      { prop: 'Curr_Number', label: '对应单号', minWidth: 90 },
      { prop: 'Batch', label: '批次', width: 80 },
      {
        prop: 'Batch_Production_Date',
        label: '生产日期',
        width: 100,
        formatter: (r) => fmtDate10(r.Batch_Production_Date)
      },
      {
        prop: 'Batch_Validity_Period',
        label: '有效到期',
        width: 100,
        formatter: (r) => fmtDate10(r.Batch_Validity_Period)
      }
    ],
    loader: loadLockingDefCodes
  },
  prelock: {
    title: '定数包预锁',
    columns: [
      { prop: 'Varietie_Code_New', label: '品种编码', width: 90 },
      { prop: 'Varietie_Name', label: '品种全称', minWidth: 200 },
      {
        prop: 'Pre_Lock_Type',
        label: '预锁类型',
        width: 90,
        formatter: (r) => {
          const m = { 0: '拣配锁定', 1: '调拨锁定' };
          return m[r.Pre_Lock_Type] ?? '未知';
        }
      },
      { prop: 'Coefficient', label: '系数', width: 55, align: 'center' },
      { prop: 'Pre_Lock', label: '预锁数量', width: 80, align: 'center' }
    ],
    loader: loadPreLockingDefCodes
  }
};

export default {
  name: 'InvQueryLockViewDialog',
  props: {
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'goods' },
    ctx: { type: Object, default: () => ({}) }
  },
  data() {
    return { innerVisible: false };
  },
  computed: {
    meta() {
      return TYPE_META[this.type] || TYPE_META.goods;
    },
    dialogTitle() {
      const name = this.ctx.varietieName || '';
      const batch = this.ctx.batch || '';
      return `${this.meta.title} - 品种[${name}]，批次：${batch}`;
    },
    columns() {
      return this.meta.columns;
    }
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
    reload() {
      this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
    },
    datasource({ page, limit }) {
      const loader = this.meta.loader;
      return loader(this.ctx, page, limit)
        .then((res) => ({ count: res.total ?? 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    }
  }
};
</script>
