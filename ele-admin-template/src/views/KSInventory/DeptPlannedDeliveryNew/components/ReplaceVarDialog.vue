<template>
  <el-dialog
    title="同编码替换品种"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @open="reload"
  >
    <ele-pro-table
      ref="table"
      size="mini"
      height="calc(100vh - 280px)"
      :toolkit="[]"
      :init-load="false"
      :columns="columns"
      :datasource="datasource"
      :page-size="99999"
      highlight-current-row
      @current-change="onCurrentChange"
    />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  searchReplaceVarDeptPlanMsg,
  commitReplaceVarDeptPlanMsg
} from '@/api/KSInventory/DeptPlannedDeliveryNew';

export default {
  name: 'ReplaceVarDialog',
  props: {
    visible: Boolean,
    dtlId: [String, Number],
    varietieCodeNew: String,
    varietieName: String
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      current: null,
      columns: [
        { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 120 },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 180, showOverflowTooltip: true },
        { prop: 'APPROVAL_NUMBER', label: '注册证', minWidth: 140, showOverflowTooltip: true },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Price', label: '中标价', minWidth: 90, align: 'right' },
        { prop: 'Unit', label: '单位', minWidth: 60 },
        { prop: 'Center_Inside_Goods_Qty', label: '院内散货数量', minWidth: 100, align: 'right' },
        { prop: 'Center_Outside_Goods_Qty', label: '院外散货数量', minWidth: 100, align: 'right' },
        { prop: 'Center_Inside_Def_Qty', label: '院内定数包数量', minWidth: 110, align: 'right' },
        { prop: 'Center_Outside_Def_Qty', label: '院外定数包数量', minWidth: 110, align: 'right' }
      ]
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    reload() {
      this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
    },
    datasource() {
      return searchReplaceVarDeptPlanMsg(this.varietieCodeNew, this.varietieName).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    onCurrentChange(row) {
      this.current = row;
    },
    handleSubmit() {
      if (!this.current) {
        this.$message.warning('请选中一行数据');
        return;
      }
      this.$confirm('确认替换品种吗？', '提示', { type: 'warning' })
        .then(async () => {
          this.submitting = true;
          try {
            const res = await commitReplaceVarDeptPlanMsg(this.dtlId, [this.current]);
            this.$message.success(res.msg || '操作成功');
            this.dialogVisible = false;
            this.$emit('success');
          } catch (e) {
            this.$message.error(e.message || '操作失败');
          } finally {
            this.submitting = false;
          }
        })
        .catch(() => {});
    }
  }
};
</script>
