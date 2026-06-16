<template>
  <el-dialog
    :title="mode === 'left' ? '变更剩余申请' : '转散货申领单'"
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
      <el-table-column label="申请数量" width="100" align="center">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row._applyQty"
            size="mini"
            :min="0"
            :max="Math.abs(Number(row.Left_Apply_Qty) || 0)"
            controls-position="right"
            style="width: 90px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="Left_Apply_Qty" label="剩余申请数量" width="100" align="center" />
      <el-table-column
        v-if="isInside"
        prop="Center_Inside_Goods_Qty"
        :label="storageLabel + '散货数量'"
        width="100"
        align="center"
      />
      <el-table-column
        v-else
        prop="Center_Outside_Goods_Qty"
        :label="storageLabel + '散货数量'"
        width="100"
        align="center"
      />
      <el-table-column prop="Note_Description" label="备注" width="90" show-overflow-tooltip />
      <el-table-column prop="REMARK" label="科室备注" width="90" show-overflow-tooltip />
      <el-table-column prop="SPDBZ" label="SPD备注" width="90" show-overflow-tooltip />
    </el-table>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        {{ mode === 'left' ? '确定变更申请数量' : '确定' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { transferGoodsApply, onlyApplyLeftQty, searchHistoryConsumedAndPurchaseCompare } from '@/api/KSInventory/DeptPlannedDeliveryNew';
import { dpdHpFlags, formatPriority } from '../utils';

export default {
  name: 'GoodsApplyDialog',
  props: {
    visible: Boolean,
    mode: { type: String, default: 'apply' },
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
            if (row._applyQty == null) {
              this.$set(row, '_applyQty', Math.abs(Number(row.Left_Apply_Qty) || 0));
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
    formatPriority,
    onSelectionChange(rows) {
      this.checked = rows;
    },
    handleClosed() {
      this.checked = [];
    },
    buildPayload(row) {
      return {
        Plan_Number: row.Plan_Number,
        Main_Id: row.Main_Id,
        Dept_Two_Code: row.Receive_Dept_Code,
        Dtl_Id: row.Dtl_Id,
        Varietie_Code: row.Varietie_Code,
        Hosp_Sign: HOME_HP,
        REMARK: row.Note_Description,
        SPDBZ: row.REMARK,
        ZD_TYPE: row.ZDTYPE,
        LINE_IFACE_ID: row.LINE_IFACE_ID,
        Goods_Qty: row._applyQty,
        Storage_Id: this.storageId
      };
    },
    validateStock(row) {
      const qty = row._applyQty;
      const stock = this.isInside ? row.Center_Inside_Goods_Qty : row.Center_Outside_Goods_Qty;
      if (Number(stock) < Number(qty)) {
        this.$message.warning('申领数量超出库存');
        return false;
      }
      return true;
    },
    async handleSubmit() {
      if (!this.checked.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      for (const row of this.checked) {
        if (!this.validateStock(row)) return;
      }
      this.submitting = true;
      try {
        if (this.mode === 'left') {
          const jsonStr = JSON.stringify(
            this.checked.map((row) => ({
              Plan_Number: row.Plan_Number,
              Dtl_Id: row.Dtl_Id,
              Goods_Qty: row._applyQty
            }))
          );
          const res = await onlyApplyLeftQty(jsonStr);
          this.$message.success(res.msg || '操作成功');
        } else {
          const goodsJson = JSON.stringify(this.checked.map((row) => this.buildPayload(row)));
          if (dpdHpFlags.isLg && this.checked.length) {
            const compareJson = JSON.stringify(
              this.checked.map((row) => ({
                Varietie_Code: row.Varietie_Code,
                Count: row._applyQty
              }))
            );
            searchHistoryConsumedAndPurchaseCompare(this.checked[0].Receive_Dept_Code, compareJson);
          }
          const res = await transferGoodsApply(goodsJson);
          this.$message.success(res.msg || '操作成功');
        }
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
