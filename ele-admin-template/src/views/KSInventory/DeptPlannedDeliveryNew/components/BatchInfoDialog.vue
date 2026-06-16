<template>
  <el-dialog
    title="获取品种下面所有批次号的信息"
    :visible.sync="dialogVisible"
    width="1200px"
    top="8vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-table ref="table" :data="rows" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column prop="Name" label="库区名称" width="90" />
      <el-table-column prop="Varietie_Name" label="品种名称" width="140" show-overflow-tooltip />
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
      <el-table-column prop="Batch" label="批次" width="90" />
      <el-table-column prop="Supply_Price" label="结算价" width="80" align="center" />
      <el-table-column prop="Contract_Code" label="合同编码" width="100" />
      <el-table-column prop="Supplier_Code" label="供应商编码" width="100" />
      <el-table-column prop="Supplier_Name" label="供应商名称" width="140" show-overflow-tooltip />
      <el-table-column prop="Up_Shelf_Quantity" label="上架数量" width="80" align="center" />
      <el-table-column prop="Batch_Production_Date" label="生产日期" width="100" />
      <el-table-column prop="Batch_Validity_Period" label="有效到期" width="100" />
      <el-table-column label="优先权重" width="100" align="center">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row._priorityWeight"
            size="mini"
            controls-position="right"
            style="width: 80px"
          />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateVarietieBatchIdPriorityWeight } from '@/api/KSInventory/DeptPlannedDeliveryNew';

export default {
  name: 'BatchInfoDialog',
  props: {
    visible: Boolean,
    rows: { type: Array, default: () => [] }
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      checked: []
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.$nextTick(() => {
          this.rows.forEach((row) => {
            if (row._priorityWeight == null) {
              this.$set(row, '_priorityWeight', row.Priority_Weight);
            }
          });
          this.$refs.table?.toggleAllSelection();
        });
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    onSelectionChange(rows) {
      this.checked = rows;
    },
    handleClosed() {
      this.checked = [];
    },
    async handleSubmit() {
      if (!this.checked.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.submitting = true;
      try {
        const json = JSON.stringify(
          this.checked.map((row) => ({
            UpShelfId: row.Id,
            NewPriorityWeight: row._priorityWeight
          }))
        );
        const res = await updateVarietieBatchIdPriorityWeight(json);
        this.$message.success(res.msg || '操作成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
