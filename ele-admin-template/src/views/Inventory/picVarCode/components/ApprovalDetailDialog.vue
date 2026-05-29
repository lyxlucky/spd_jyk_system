<template>
  <ele-modal
    width="85%"
    :title="'注册证详情 - ' + (approvalNumber || '')"
    :visible="visible"
    position="center"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-table
      v-loading="loading"
      :data="rows"
      border
      stripe
      size="small"
      max-height="calc(80vh - 120px)"
    >
      <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="130" show-overflow-tooltip />
      <el-table-column prop="UNIT" label="单位" width="72" />
      <el-table-column prop="PRICE" label="价格" width="90" />
      <el-table-column prop="MEDICAL_CODE" label="医保编码" min-width="150" show-overflow-tooltip />
      <el-table-column prop="MEDICAL_CODE27" label="医保编码27" width="130" show-overflow-tooltip />
      <el-table-column prop="SPECIFICATION_OR_TYPE2" label="规格" width="120" show-overflow-tooltip />
      <el-table-column prop="SPECIFICATION_OR_TYPE3" label="型号" width="120" show-overflow-tooltip />
    </el-table>
    <p v-if="!loading && rows.length === 0" class="empty-tip">暂无关联品种数据</p>
  </ele-modal>
</template>

<script>
  import { getApprovalDetail } from '@/api/Inventory/picVarCode/index';

  export default {
    name: 'ApprovalDetailDialog',
    props: {
      visible: Boolean,
      approvalNumber: String
    },
    data() {
      return {
        loading: false,
        rows: []
      };
    },
    watch: {
      visible(val) {
        if (val && this.approvalNumber) {
          this.load();
        }
        if (!val) {
          this.rows = [];
        }
      }
    },
    methods: {
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      load() {
        this.loading = true;
        getApprovalDetail(this.approvalNumber)
          .then((res) => {
            this.rows = Array.isArray(res.data) ? res.data : [];
          })
          .catch((err) => {
            this.$message.error(err.message || err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

<style scoped>
  .empty-tip {
    text-align: center;
    color: #909399;
    padding: 16px;
  }
</style>
