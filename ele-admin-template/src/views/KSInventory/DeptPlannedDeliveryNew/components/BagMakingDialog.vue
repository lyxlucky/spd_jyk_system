<template>
  <el-dialog
    title="生成定数包"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-table ref="table" :data="rows" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column prop="Plan_Number" label="计划单号" width="100" />
      <el-table-column label="订单优先级" width="90">
        <template slot-scope="{ row }">{{ formatPriority(row.Priority) }}</template>
      </el-table-column>
      <el-table-column prop="Plan_Time" label="计划时间" width="100" />
      <el-table-column prop="Dept_Two_Name" label="二级科室名称" width="110" show-overflow-tooltip />
      <el-table-column :label="storageLabel" width="90">
        <template>{{ storageLabel }}</template>
      </el-table-column>
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
      <el-table-column prop="Varietie_Name" label="品种名称" width="120" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" width="110" show-overflow-tooltip />
      <el-table-column prop="Unit" label="单位" width="55" align="center" />
      <el-table-column prop="Coefficient" label="系数" width="70" align="center" />
      <el-table-column prop="Left_Apply_Qty" label="剩余申领数量" width="100" align="center" />
      <el-table-column label="制包数量" width="100" align="center">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row._bagQty"
            size="mini"
            :min="0"
            controls-position="right"
            style="width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="Batch_Production_Date" label="生产日期" width="100" />
      <el-table-column prop="Batch_Validity_Period" label="生产有效期" width="100" />
      <el-table-column prop="Up_Shelf_Quantity" label="散货上架数量" width="100" align="center" />
      <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" width="120" show-overflow-tooltip />
      <el-table-column prop="Supply_Price" label="结算价" width="80" align="center" />
      <el-table-column prop="Note_Description" label="备注" width="90" show-overflow-tooltip />
      <el-table-column prop="REMARK" label="科室备注" width="90" show-overflow-tooltip />
    </el-table>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { lockVarietieQuantity } from '@/api/KSInventory/DeptPlannedDeliveryNew';
import { formatPriority } from '../utils';

export default {
  name: 'BagMakingDialog',
  props: {
    visible: Boolean,
    rows: { type: Array, default: () => [] },
    storageLabel: String
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
            if (row._bagQty == null) this.$set(row, '_bagQty', 0);
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
    formatPriority,
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
      const storageNow = this.checked[0].Storage_Id;
      for (const row of this.checked) {
        if (storageNow != row.Storage_Id) {
          this.$message.warning('添加失败，不能添加不同仓库的品种');
          return;
        }
        if (Number(row._bagQty) <= 0) {
          this.$message.warning(`制包失败，品种${row.Varietie_Code}${row.Varietie_Name}的制包数量不能为0`);
          return;
        }
        if (String(row.Coefficient) === '0') {
          this.$message.warning('添加失败，不能添加系数为0的品种');
          return;
        }
      }
      const jsonStr = JSON.stringify(
        this.checked.map(
          (row) => `{${row.Up_Shelf_Id},${row.Coefficient},${row._bagQty}}`
        )
      );
      this.submitting = true;
      try {
        const res = await lockVarietieQuantity(jsonStr);
        this.$message.success(res.msg || '已成功保存');
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
