<template>
  <el-dialog
    :title="`${mainOrder || ''} 选择合并申领计划单号`"
    :visible.sync="innerVisible"
    width="80%"
    top="6vh"
    append-to-body
    @open="onOpen"
  >
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
      :page-size="18"
      :page-sizes="[10, 18, 30, 60, 90, 150, 300]"
      cache-key="mergeApplyPlanOrderTable"
    >
      <template v-slot:planState="{ row }">
        <el-tag v-if="row.State == 0" size="mini" type="primary">新增</el-tag>
        <el-tag v-else-if="row.State == 1" size="mini" type="warning">已提交</el-tag>
        <el-tag v-else-if="row.State == 2" size="mini">配送中</el-tag>
        <el-tag v-else-if="row.State == 5" size="mini" type="success">已审核</el-tag>
        <el-tag v-else-if="row.State == 10" size="mini" type="danger">强制结束</el-tag>
        <el-tag
          v-else-if="(row.State == 6 || row.State == 4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty"
          size="mini"
          type="success"
        >
          已审批
        </el-tag>
        <el-tag v-else size="mini">{{ row.State }}</el-tag>
      </template>
    </ele-pro-table>
    <template v-slot:footer>
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">确定合并</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { hbApplyPlanOrder, SerachPlanList } from '@/api/KSInventory/KSDepartmentalPlan';
import { buildUserDeptCodes } from '../utils';

export default {
  name: 'MergeApplyPlanOrderDialog',
  props: {
    visible: Boolean,
    mainOrder: { type: String, default: '' }
  },
  data() {
    return {
      innerVisible: false,
      submitting: false,
      selection: [],
      columns: [
        { columnKey: 'selection', type: 'selection', width: 45, align: 'center' },
        { prop: 'PlanNum', label: '申领单号', minWidth: 120 },
        { prop: 'DEPT_TWO_NAME', label: '科室名称', minWidth: 120 },
        {
          prop: 'PlanTime',
          label: '申领时间',
          minWidth: 150,
          formatter: (row) => String(row.PlanTime || '').replace('T', ' ')
        },
        { prop: 'Operater', label: '申领人', width: 90 },
        {
          prop: 'State',
          label: '状态',
          width: 90,
          slot: 'planState'
        },
        { prop: 'BZ', label: '备注', minWidth: 200, showOverflowTooltip: true }
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
      this.selection = [];
      this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
    },
    datasource({ page, limit }) {
      return SerachPlanList({
        page,
        limit,
        where: {
          State: '1',
          SerachName: '',
          PlanNum: '',
          Start: '',
          End: '',
          isTwoApp: '',
          DeptCode: buildUserDeptCodes()
        }
      })
        .then((res) => {
          const list = (res.result || []).filter((row) => row.PlanNum !== this.mainOrder);
          return { count: list.length, list };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async submit() {
      if (!this.mainOrder) {
        this.$message.warning('请先选择主申领单');
        return;
      }
      if (!this.selection.length) {
        this.$message.warning('请选择合并订单');
        return;
      }
      try {
        await this.$confirm('确认合并所选申领单？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.submitting = true;
      try {
        const res = await hbApplyPlanOrder(this.mainOrder, this.selection);
        this.$message.success(res.msg || '合并成功');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '合并失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
