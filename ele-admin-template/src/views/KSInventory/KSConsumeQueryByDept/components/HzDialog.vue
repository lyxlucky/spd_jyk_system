<template>
  <el-dialog title="消耗查看汇总" :visible.sync="innerVisible" width="90%" top="5vh" append-to-body @open="onOpen">
    <div class="hz-dialog-toolbar">
      <el-button size="mini" type="primary" :loading="exporting" @click="exportExcel">导出Excel</el-button>
    </div>
    <ele-pro-table
      v-if="innerVisible"
      ref="table"
      size="mini"
      border
      stripe
      :toolbar="false"
      height="calc(85vh - 120px)"
      :columns="columns"
      :datasource="datasource"
      :page-size="20"
      :page-sizes="[20, 50, 100, 150, 300]"
      cache-key="KSConsumeQueryByDeptHz_v1"
    />
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import { searchDeptHz } from '@/api/KSInventory/KSConsumeQueryByDept';
import { getHzColumns } from '../columns';
import { isHideDeptSup } from '../utils';

export default {
  name: 'KSConsumeQueryByDeptHzDialog',
  props: {
    visible: Boolean,
    where: { type: Object, default: () => ({}) },
    deptTwoJson: { type: String, default: '' },
    sort: { type: Object, default: () => ({ field: '', order: '' }) }
  },
  data() {
    return {
      columns: getHzColumns(isHideDeptSup()),
      exporting: false
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
  methods: {
    onOpen() {
      this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
    },
    async datasource({ page, limit }) {
      if (!this.deptTwoJson) return { count: 0, list: [] };
      try {
        const res = await searchDeptHz(this.where, page, limit, this.sort, this.deptTwoJson);
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await searchDeptHz(this.where, 1, 9999999, this.sort, this.deptTwoJson);
        const showSup = isHideDeptSup();
        const headers = [
          '品种编码',
          '计费编码',
          '品种全称',
          '型号/规格',
          '单位',
          '生产企业名称',
          '批准文号',
          '药交ID',
          '消耗数量'
        ];
        if (showSup) headers.splice(6, 0, '供应商');
        const rows = [headers];
        (res.result || []).forEach((r) => {
          const row = [
            r.Varietie_Code_New,
            r.CHARGING_CODE,
            r.Varietie_Name,
            r.Specification_Or_Type,
            r.Unit,
            r.Manufacturing_Ent_Name,
            r.Approval_Number,
            r.PROVINCE_PLATFORM_CODE,
            r.Goods_Qty
          ];
          if (showSup) row.splice(6, 0, r.Supplier_Name);
          rows.push(row);
        });
        const sheet = utils.aoa_to_sheet(rows);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '消耗汇总');
        writeFile(book, '消耗汇总数据.xlsx');
        Message.success('导出成功');
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
.hz-dialog-toolbar {
  margin-bottom: 8px;
}
</style>
