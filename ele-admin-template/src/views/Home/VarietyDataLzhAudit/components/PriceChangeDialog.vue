<template>
  <el-dialog
    title="价格变动记录"
    :visible.sync="innerVisible"
    width="560px"
    append-to-body
    @open="loadData"
  >
    <div v-loading="loading" class="price-change-wrap">
      <div v-if="varietyCode" class="sub-title">品种：{{ varietyCode }}</div>
      <el-table :data="rows" border stripe size="mini" max-height="420">
        <el-table-column prop="NEW_PRICE" label="价格" min-width="120" align="right" />
        <el-table-column prop="UPDATE_TIME" label="时间" min-width="160" show-overflow-tooltip />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getPriceChangeRecord } from '@/api/Home/VarietyDataLzhAudit';

export default {
  name: 'VarietyAuditPriceChangeDialog',
  props: {
    visible: { type: Boolean, default: false },
    varietieCode: { type: String, default: '' },
    varietyCodeNew: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      rows: []
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
    },
    varietyCode() {
      return this.varietyCodeNew || this.varietieCode || '';
    }
  },
  methods: {
    async loadData() {
      if (!this.varietieCode) return;
      this.loading = true;
      try {
        const res = await getPriceChangeRecord(this.varietieCode);
        this.rows = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.rows = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.sub-title {
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
}
</style>
