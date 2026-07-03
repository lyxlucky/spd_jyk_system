<template>
  <el-dialog
    title="计划收货明细"
    :visible.sync="innerVisible"
    width="92%"
    top="4vh"
    append-to-body
    @open="onOpen"
  >
    <el-form size="mini" :inline="true" @submit.native.prevent>
      <el-form-item label="收货单号">
        <el-input v-model="where.orderNum" clearable style="width: 160px" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input v-model="where.varietieSearch" clearable style="width: 160px" />
      </el-form-item>
      <el-form-item label="收货状态">
        <el-select v-model="where.state" style="width: 110px">
          <el-option label="未收货" value="0" />
          <el-option label="全部" value="" />
          <el-option label="已收货" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        <el-button type="success" :loading="committing" @click="commitReceive">确认收货</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      border
      stripe
      :toolbar="false"
      height="62vh"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 300]"
      cache-key="applyPlanReceiveTable"
    />
  </el-dialog>
</template>

<script>
import {
  commitDeptTwoGoodsOperateDtl,
  getDeptTwoGoodsOperateDtl
} from '@/api/KSInventory/KSDepartmentalPlan';

export default {
  name: 'ApplyPlanReceiveDialog',
  props: { visible: Boolean },
  data() {
    return {
      innerVisible: false,
      committing: false,
      selection: [],
      where: {
        orderNum: '',
        varietieSearch: '',
        state: '0'
      },
      columns: [
        { columnKey: 'selection', type: 'selection', width: 45, align: 'center' },
        { prop: 'ID', label: '序号', width: 70 },
        {
          prop: 'IS_DEPT_GET',
          label: '是否收货',
          width: 90,
          formatter: (row) => (row.IS_DEPT_GET == 1 || row.IS_DEPT_GET === '1' ? '已收' : '未收')
        },
        { prop: 'OPERATE_NUMBER', label: '收货单号', minWidth: 120 },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 120 },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 140, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140, showOverflowTooltip: true },
        { prop: 'QUANITY', label: '数量', width: 70 },
        { prop: 'UNIT', label: '单位', width: 70 },
        { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 120 },
        { prop: 'BATCH', label: '批号', width: 100 },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效期',
          width: 100,
          formatter: (row) => String(row.BATCH_VALIDITY_PERIOD || '').substr(0, 10)
        },
        { prop: 'DPET_GET_MAN', label: '收货人', width: 100 },
        {
          prop: 'DEPT_GET_TIME',
          label: '收货确认时间',
          width: 140,
          formatter: (row) => {
            const v = String(row.DEPT_GET_TIME || '');
            return v.substr(0, 10) === '0001-01-01' ? '' : v.replace('T', ' ').substr(0, 19);
          }
        }
      ]
    };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.$nextTick(() => this.reload());
    },
    datasource({ page, limit }) {
      return getDeptTwoGoodsOperateDtl({ page, limit, where: this.where })
        .then((res) => ({ count: res.total, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    async commitReceive() {
      if (!this.selection.length) {
        this.$message.warning('请选择数据');
        return;
      }
      try {
        await this.$confirm('确认收货所选明细？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.committing = true;
      try {
        const res = await commitDeptTwoGoodsOperateDtl(this.selection);
        this.$message.success(res.msg || '收货成功');
        this.reload();
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '收货失败');
      } finally {
        this.committing = false;
      }
    }
  }
};
</script>
