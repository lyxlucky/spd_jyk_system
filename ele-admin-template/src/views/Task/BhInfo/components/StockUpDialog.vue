<template>
  <el-dialog
    title="备货信息"
    :visible.sync="dialogVisible"
    width="1350px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-row :gutter="12">
      <el-col :span="6">
        <el-table
          ref="supTable"
          :data="suppliers"
          size="mini"
          border
          height="500"
          highlight-current-row
          @row-click="handleSupClick"
          @selection-change="(rows) => (checkedSuppliers = rows)"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="Supplier_Name" label="供应商名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="Supplier_Code" label="编码" width="60" />
          <el-table-column prop="Name" label="收货院区" width="80" show-overflow-tooltip />
        </el-table>
      </el-col>
      <el-col :span="18">
        <el-table :data="currentVarieties" size="mini" border height="500">
          <el-table-column label="合同到期" width="100">
            <template slot-scope="{ row }">
              <span :class="{ 'text-danger': isContractNearExpiry(row.CONTRACT_END_TIME) }">
                {{ formatDate10(row.CONTRACT_END_TIME) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="合同明细到期" width="100">
            <template slot-scope="{ row }">
              <span :class="{ 'text-danger': isContractNearExpiry(row.DET_CONTRACT_END) }">
                {{ formatDate10(row.DET_CONTRACT_END) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="varietie_Code_New" label="品种编码" width="100" />
          <el-table-column prop="Varietie_Name" label="品种名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="Specification_Or_Type" label="规格/型号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="Unit" label="单位" width="50" align="center" />
          <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" width="120" show-overflow-tooltip />
          <el-table-column prop="Def_No_Pkg_Coefficient" label="系数" width="50" align="center" />
          <el-table-column prop="Arg_Plan" label="备货数（包）" width="90" align="center" />
          <el-table-column prop="Goods_Qty" label="备货数（散）" width="90" align="center" />
          <el-table-column label="价格" width="90" align="right">
            <template slot-scope="{ row }">{{ formatPrice(row) }}</template>
          </el-table-column>
          <el-table-column label="合同类型" width="80" align="center">
            <template slot-scope="{ row }">{{ formatContractType(row.CONTRACT_TYPE) }}</template>
          </el-table-column>
          <el-table-column label="备货单号" width="130" fixed="right">
            <template slot-scope="{ row }">
              <el-select
                v-if="getPlanOptions(row).length"
                v-model="row.Stock_Up_Plan_No"
                size="mini"
                style="width: 100%"
              >
                <el-option
                  v-for="opt in getPlanOptions(row)"
                  :key="opt"
                  :label="opt"
                  :value="opt"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { insertNewInfo } from '@/api/Task/BhInfo';
import {
  bhInfoHpFlags,
  buildInsertNewInfoPayload,
  buildStockUpSuppliers,
  formatContractType,
  formatDate10,
  formatPrice,
  isContractNearExpiry,
  parsePlanNoOptions
} from '../utils';

export default {
  name: 'StockUpDialog',
  props: {
    visible: Boolean,
    monitorRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      suppliers: [],
      checkedSuppliers: [],
      currentSup: null,
      submitting: false
    };
  },
  computed: {
    currentVarieties() {
      return this.currentSup?.listVarietie || [];
    },
    isCg() {
      return bhInfoHpFlags.isCg;
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    formatDate10,
    formatContractType,
    isContractNearExpiry,
    formatPrice(row) {
      return formatPrice(row, this.isCg);
    },
    initData() {
      const creator = this.$store.state.user?.info?.Nickname || '';
      this.suppliers = buildStockUpSuppliers(this.monitorRows, creator);
      this.checkedSuppliers = [];
      this.currentSup = this.suppliers[0] || null;
      this.$nextTick(() => {
        if (this.currentSup) {
          this.$refs.supTable?.setCurrentRow(this.currentSup);
        }
      });
    },
    handleSupClick(row) {
      this.currentSup = row;
    },
    getPlanOptions(row) {
      return parsePlanNoOptions(row);
    },
    handleClosed() {
      this.suppliers = [];
      this.checkedSuppliers = [];
      this.currentSup = null;
    },
    async handleSubmit() {
      if (!this.checkedSuppliers.length) {
        this.$message.warning('请至少勾选一个供应商');
        return;
      }
      this.submitting = true;
      try {
        const payload = buildInsertNewInfoPayload(this.checkedSuppliers, this.suppliers);
        const res = await insertNewInfo(JSON.stringify(payload));
        this.$message.success(res.msg || '操作成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.text-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>
