<template>
  <el-dialog
    title="品种效期资料"
    :visible="visible"
    width="92%"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="search"
  >
    <div class="toolbar">
      <el-input
        v-model="keyword"
        size="mini"
        clearable
        placeholder="品种编码/品种名称"
        style="width: 220px"
        @keyup.enter.native="onSearch"
      />
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button size="mini" icon="el-icon-download" :loading="exporting" @click="onExport">
        导出
      </el-button>
      <el-button size="mini" type="warning" plain :loading="stopping" @click="onStop">
        停用合同过期品种
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" size="mini" border height="520">
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column prop="VARIETIE_CODE_NEW" label="品种(材料)编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="VARIETIE_NAME" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="SPECIFICATION_OR_TYPE" label="型号/规格" min-width="120" show-overflow-tooltip />
      <el-table-column prop="UNIT" label="单位" width="60" align="center" />
      <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="PRICE" label="中标价" width="80" align="right" />
      <el-table-column prop="SUPPLY_PRICE" label="结算价" width="80" align="right" />
      <el-table-column prop="APPROVAL_NUMBER" label="批准文号" min-width="140" show-overflow-tooltip />
      <el-table-column label="启用供应商/合同" min-width="160" show-overflow-tooltip>
        <template v-slot="{ row }">
          {{ formatSupplierContract(row) }}
        </template>
      </el-table-column>
      <el-table-column label="合同起始日期" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.CONTRACT_START_TIME) }}</template>
      </el-table-column>
      <el-table-column label="合同终止日期" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.CONTRACT_END_TIME) }}</template>
      </el-table-column>
      <el-table-column label="授权终止日期" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.AUTH_VALID) }}</template>
      </el-table-column>
      <el-table-column label="合同明细起始" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.DET_CONTRACT_START) }}</template>
      </el-table-column>
      <el-table-column label="合同明细结束" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.DET_CONTRACT_END) }}</template>
      </el-table-column>
      <el-table-column label="注册证起始日期" min-width="120" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.REGISTRATION_ISSUING_DATE) }}</template>
      </el-table-column>
      <el-table-column label="注册证有效到期" min-width="120" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.REGISTRATION_VALID_DATE) }}</template>
      </el-table-column>
      <el-table-column label="营业执照有效期" min-width="120" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.BUSINESS_LICENSE_VALID_DATE) }}</template>
      </el-table-column>
      <el-table-column label="一类许可证有效期" min-width="130" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.RODUCTION_CLASS_1_VALID_DATE) }}</template>
      </el-table-column>
      <el-table-column label="二类许可证有效期" min-width="130" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.RODUCTION_CLASS_2_VALID_DATE) }}</template>
      </el-table-column>
      <el-table-column label="三类许可证有效期" min-width="130" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.RODUCTION_CLASS_3_VALID_DATE) }}</template>
      </el-table-column>
      <el-table-column label="业务员委托书有效期" min-width="140" show-overflow-tooltip>
        <template v-slot="{ row }">{{ formatDate(row.WTS_VALID_DATE) }}</template>
      </el-table-column>
    </el-table>
    <div class="pager">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        :current-page.sync="page"
        :page-size.sync="size"
        :page-sizes="[15, 30, 50, 100]"
        @size-change="search"
        @current-change="search"
      />
    </div>
  </el-dialog>
</template>

<script>
import { GetVarExpirationData, StopVarExpirationData } from '@/api/Home/VarietyDataLzhMain';
import { utils, writeFile } from 'xlsx';

export default {
  name: 'VarExpirationDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      exporting: false,
      stopping: false,
      keyword: '',
      list: [],
      total: 0,
      page: 1,
      size: 30
    };
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    formatDate(v) {
      if (!v) return '';
      const s = String(v);
      if (s.startsWith('0001-01-01')) return '';
      return s.includes('T') ? s.substring(0, 10) : s.substring(0, 10);
    },
    formatSupplierContract(row) {
      const name = row.SUPPLIER_NAME || '';
      const code = row.CONTRACT_CODE || '';
      if (name && code) return `${name}/${code}`;
      return name || code || '';
    },
    onSearch() {
      this.page = 1;
      this.search();
    },
    async search() {
      this.loading = true;
      try {
        const res = await GetVarExpirationData({
          VARIETIE_CODE_NEW: this.keyword,
          page: this.page,
          size: this.size
        });
        this.list = res.result || [];
        this.total = Number(res.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        this.list = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await GetVarExpirationData({
          VARIETIE_CODE_NEW: this.keyword,
          page: 1,
          size: 99999
        });
        const rows = res.result || [];
        const data = rows.map((r, idx) => ({
          序号: idx + 1,
          '品种(材料)编码': r.VARIETIE_CODE_NEW,
          品种全称: r.VARIETIE_NAME,
          '型号/规格': r.SPECIFICATION_OR_TYPE,
          单位: r.UNIT,
          生产企业名称: r.MANUFACTURING_ENT_NAME,
          中标价: r.PRICE,
          结算价: r.SUPPLY_PRICE,
          批准文号: r.APPROVAL_NUMBER,
          '启用供应商/合同': this.formatSupplierContract(r),
          合同起始日期: this.formatDate(r.CONTRACT_START_TIME),
          合同终止日期: this.formatDate(r.CONTRACT_END_TIME),
          授权终止日期: this.formatDate(r.AUTH_VALID),
          合同明细起始: this.formatDate(r.DET_CONTRACT_START),
          合同明细结束: this.formatDate(r.DET_CONTRACT_END),
          注册证起始日期: this.formatDate(r.REGISTRATION_ISSUING_DATE),
          注册证有效到期: this.formatDate(r.REGISTRATION_VALID_DATE),
          营业执照有效期: this.formatDate(r.BUSINESS_LICENSE_VALID_DATE),
          一类许可证有效期: this.formatDate(r.RODUCTION_CLASS_1_VALID_DATE),
          二类许可证有效期: this.formatDate(r.RODUCTION_CLASS_2_VALID_DATE),
          三类许可证有效期: this.formatDate(r.RODUCTION_CLASS_3_VALID_DATE),
          业务员委托书有效期: this.formatDate(r.WTS_VALID_DATE)
        }));
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '品种效期资料');
        writeFile(wb, '品种效期资料.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onStop() {
      try {
        await this.$confirm('确定停用合同过期品种？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.stopping = true;
      try {
        const res = await StopVarExpirationData();
        this.$message.success(res.msg || '操作完成');
        this.search();
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.stopping = false;
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
.pager {
  margin-top: 10px;
  text-align: right;
}
</style>
