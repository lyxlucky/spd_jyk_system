<template>
  <el-dialog
    custom-class="legacy-layer-dialog"
    title="带量查询"
    :visible.sync="dialogVisible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="onOpened"
  >
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      height="calc(70vh - 60px)"
      size="small"
      :page-size="20"
      :page-sizes="[20, 50, 100, 150, 300]"
    >
      <template v-slot:DL_BL_FZ="{ row }">
        <el-input
          v-model="row.DL_BL_FZ"
          size="mini"
          @blur="onFractionBlur(row, 'DL_BL_FZ')"
        />
      </template>
      <template v-slot:DL_BL_FM="{ row }">
        <el-input
          v-model="row.DL_BL_FM"
          size="mini"
          @blur="onFractionBlur(row, 'DL_BL_FM')"
        />
      </template>
      <template v-slot:IS_DL_TJ="{ row }">
        <el-switch
          v-if="row.IS_DL_TJ === 0 || row.IS_DL_TJ === 1 || row.IS_DL_TJ === '0' || row.IS_DL_TJ === '1'"
          :value="Number(row.IS_DL_TJ) === 1"
          active-text="是"
          inactive-text="否"
          @change="(v) => onDlTjChange(row, v)"
        />
        <span v-else>未知</span>
      </template>
    </ele-pro-table>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getLimitDelVar, updateFraction, upVarIsDlTj } from '@/api/Home/PrchaseDataV2';

export default {
  name: 'VarietyTableDialog',
  props: {
    visible: { type: Boolean, default: false },
    buyId: { type: [String, Number], default: '' }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    columns() {
      return [
        { prop: 'VARIETIE_CODE', label: '品种id', width: 90 },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 140, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 200, sortable: true, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '型号规格', minWidth: 180, showOverflowTooltip: true },
        { prop: 'PRICE', label: '单价', width: 80, sortable: true },
        { prop: 'UNIT', label: '单位', width: 70, sortable: true },
        { prop: 'SOURCE_FROM', label: '来源', width: 160, showOverflowTooltip: true },
        { columnKey: 'DL_BL_FZ', label: '转换比分子', width: 100, slot: 'DL_BL_FZ' },
        { columnKey: 'DL_BL_FM', label: '转换比分母', width: 100, slot: 'DL_BL_FM' },
        { columnKey: 'IS_DL_TJ', label: '是否带量', width: 120, slot: 'IS_DL_TJ' }
      ];
    }
  },
  methods: {
    onOpened() {
      if (this.buyId) {
        this.$refs.table?.reload({ page: 1 });
      }
    },
    datasource({ page, limit }) {
      if (!this.buyId) {
        return Promise.resolve({ count: 0, list: [] });
      }
      return getLimitDelVar(this.buyId, page, limit)
        .then((res) => ({
          count: res.total || 0,
          list: res.result || []
        }))
        .catch((e) => {
          Message.error(e.message || '加载失败');
          return { count: 0, list: [] };
        });
    },
    async onFractionBlur(row, field) {
      try {
        const res = await updateFraction(row.ID, row[field], field);
        Message.success(res.msg || '修改成功');
      } catch (e) {
        Message.error(e.message || '修改失败');
        this.$refs.table?.reload();
      }
    },
    async onDlTjChange(row, checked) {
      const type = checked ? '1' : '0';
      try {
        const res = await upVarIsDlTj(row.ID, type);
        row.IS_DL_TJ = type;
        Message.success(res.msg || '修改成功');
      } catch (e) {
        Message.error(e.message || '修改失败');
        this.$refs.table?.reload();
      }
    }
  }
};
</script>
