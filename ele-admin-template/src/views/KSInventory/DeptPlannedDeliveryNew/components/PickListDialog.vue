<template>
  <el-dialog
    title="转拣配单"
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
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="100" />
      <el-table-column prop="Varietie_Name" label="品种名称" width="120" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" width="110" show-overflow-tooltip />
      <el-table-column prop="Unit" label="单位" width="55" align="center" />
      <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" width="120" show-overflow-tooltip />
      <el-table-column prop="APPROVAL_NUMBER" label="注册证号" width="100" show-overflow-tooltip />
      <el-table-column prop="Left_Apply_Qty" label="剩余可转数量" width="100" align="center" />
      <el-table-column prop="Coefficient" label="系数" width="70" align="center" />
      <el-table-column label="申请数量" width="100" align="center">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row._pickQty"
            size="mini"
            :min="0"
            controls-position="right"
            style="width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="isInside"
        prop="Center_Inside_Def_Qty"
        :label="storageLabel + '定数包'"
        width="100"
        align="center"
      />
      <el-table-column
        v-else
        prop="Center_Outside_Def_Qty"
        :label="storageLabel + '定数包'"
        width="100"
        align="center"
      />
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
import { transferDefPick } from '@/api/KSInventory/DeptPlannedDeliveryNew';
import { formatPriority } from '../utils';

export default {
  name: 'PickListDialog',
  props: {
    visible: Boolean,
    rows: { type: Array, default: () => [] },
    storageId: String,
    storageLabel: String
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      checked: []
    };
  },
  computed: {
    isInside() {
      return String(this.storageId) === '1';
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.$nextTick(() => {
          this.rows.forEach((row) => {
            if (row._pickQty == null) this.$set(row, '_pickQty', 0);
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
      for (const row of this.checked) {
        if (Number(row.Coefficient) === 0) {
          this.$message.warning(`品种编码[${row.Varietie_Code_New}]系数为0`);
          return;
        }
        const qty = Number(row._pickQty);
        const coeff = Number(row.Coefficient);
        if (qty === 0 || qty * coeff > Number(row.Left_Apply_Qty)) {
          this.$message.warning(
            `品种编码[${row.Varietie_Code_New}]填写的(申请数量 * 系数)不能超过剩余可转数量且不能为0`
          );
          return;
        }
      }
      this.submitting = true;
      try {
        const defJson = JSON.stringify(
          this.checked.map((row) => ({
            Plan_Number: row.Plan_Number,
            Main_Id: row.Main_Id,
            Dept_Two_Code: row.Receive_Dept_Code,
            Dtl_Id: row.Dtl_Id,
            Varietie_Code: row.Varietie_Code,
            Coefficient: row.Coefficient,
            To_Pick_Def_Qty: row._pickQty,
            STORAGE_ID: this.storageId
          }))
        );
        const res = await transferDefPick(defJson);
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
