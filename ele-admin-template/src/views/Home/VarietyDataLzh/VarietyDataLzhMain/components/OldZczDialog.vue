<template>
  <el-dialog
    title="存在新旧注册证的品种"
    :visible="visible"
    width="90%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="search"
  >
    <div class="toolbar">
      <el-input
        v-model="varietieCodeNew"
        size="mini"
        clearable
        placeholder="请输入品种编码"
        style="width: 180px"
        @keyup.enter.native="search"
      />
      <el-input
        v-model="approvalNumber"
        size="mini"
        clearable
        placeholder="请输入注册证号"
        style="width: 180px"
        @keyup.enter.native="search"
      />
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="list" size="mini" border height="480">
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="UNIT" label="单位" width="70" align="center" />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column prop="PRICE" label="价格" width="90" align="right" />
      <el-table-column
        prop="APPROVAL_NUMBER"
        label="注册证号"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="MANUFACTURING_ENT_NAME"
        label="生产企业"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column prop="ENABLE" label="状态" width="80" align="center">
        <template v-slot="{ row }">
          {{ row.ENABLE == '1' || row.ENABLE === 1 ? '启用' : '冻结' }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { GetStzxVarApp } from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'OldZczDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      list: [],
      varietieCodeNew: '',
      approvalNumber: ''
    };
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async search() {
      this.loading = true;
      try {
        const res = await GetStzxVarApp({
          VARIETIE_CODE_NEW: this.varietieCodeNew,
          APPROVAL_NUMBER: this.approvalNumber
        });
        this.list = res.data || res.result || [];
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        this.list = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
</style>
