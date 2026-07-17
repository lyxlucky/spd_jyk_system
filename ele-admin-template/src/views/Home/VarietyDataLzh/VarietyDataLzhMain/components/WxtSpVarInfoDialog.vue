<template>
  <el-dialog
    title="微讯通品种审核"
    :visible="visible"
    width="94%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="search"
  >
    <div class="toolbar">
      <el-input
        v-model="wpmc"
        size="mini"
        clearable
        placeholder="编码/名称/规格型号"
        style="width: 200px"
        @keyup.enter.native="onSearch"
      />
      <span class="label">微讯通状态</span>
      <el-select v-model="sycStatus" size="mini" clearable style="width: 120px" @change="onSearch">
        <el-option label="全部" value="" />
        <el-option label="已同步" value="1" />
        <el-option label="新增" value="0" />
        <el-option label="更改" value="2" />
      </el-select>
      <span class="label">SPD系统状态</span>
      <el-select v-model="spdState" size="mini" clearable style="width: 120px" @change="onSearch">
        <el-option label="全部" value="" />
        <el-option label="未处理" value="0" />
        <el-option label="已处理" value="1" />
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button size="mini" type="success" plain :loading="syncing" @click="onSync">
        同步处理
      </el-button>
      <el-button size="mini" icon="el-icon-download" :loading="exporting" @click="onExport">
        导出
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" size="mini" border height="560">
      <el-table-column prop="id" label="唯一标识" min-width="90" show-overflow-tooltip />
      <el-table-column prop="wpbm" label="品种编码" min-width="110" show-overflow-tooltip />
      <el-table-column prop="wpmc" label="品种名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="gexh" label="规格型号" min-width="120" show-overflow-tooltip />
      <el-table-column prop="dw" label="单位" width="60" align="center" />
      <el-table-column prop="zbj" label="中标价" width="80" align="right">
        <template v-slot="{ row }">
          {{ formatPrice(row.zbj) }}
        </template>
      </el-table-column>
      <el-table-column prop="scsmc" label="生产商名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="pp" label="品牌" min-width="90" show-overflow-tooltip />
      <el-table-column prop="isSfWp" label="是否收费" width="80" align="center" />
      <el-table-column prop="cpzch" label="注册证号" min-width="130" show-overflow-tooltip />
      <el-table-column prop="zczYxq" label="注册证有效期" min-width="110" show-overflow-tooltip />
      <el-table-column prop="zcName" label="注册证名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="gysmc" label="供应商名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="sycDate" label="审批时间" min-width="140" show-overflow-tooltip />
      <el-table-column prop="sycStatus" label="微讯通状态" width="90" align="center">
        <template v-slot="{ row }">
          {{ formatSycStatus(row.sycStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="SPD_STATE" label="SPD状态" width="80" align="center">
        <template v-slot="{ row }">
          {{ formatSpdState(row.SPD_STATE) }}
        </template>
      </el-table-column>
      <el-table-column prop="ybCode" label="医保编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="ygptdm" label="阳光产品码" min-width="110" show-overflow-tooltip />
      <el-table-column prop="ygptggbm" label="阳光规格型号码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="ygptjg" label="阳光价格" width="90" align="right" />
      <el-table-column prop="bz" label="备注" min-width="120" show-overflow-tooltip />
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
import { getWxtSpVarInfo, updateNewVarCode } from '@/api/Home/VarietyDataLzhMain';
import { utils, writeFile } from 'xlsx';

export default {
  name: 'WxtSpVarInfoDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      syncing: false,
      exporting: false,
      wpmc: '',
      sycStatus: '',
      spdState: '',
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
    formatPrice(v) {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(2) : v ?? '';
    },
    formatSycStatus(v) {
      if (v == '0' || v === 0) return '新增';
      if (v == '1' || v === 1) return '已同步';
      if (v == '2' || v === 2) return '更改';
      return v ?? '';
    },
    formatSpdState(v) {
      if (v == '0' || v === 0) return '未处理';
      if (v == '1' || v === 1) return '已处理';
      return v ?? '';
    },
    onSearch() {
      this.page = 1;
      this.search();
    },
    async search() {
      this.loading = true;
      try {
        const res = await getWxtSpVarInfo({
          page: this.page,
          size: this.size,
          wpmc: this.wpmc,
          sycStatus: this.sycStatus,
          SPDstate: this.spdState
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
    async onSync() {
      try {
        await this.$confirm('确定执行同步处理？', '提示', { type: 'warning' });
      } catch (e) {
        return;
      }
      this.syncing = true;
      try {
        const res = await updateNewVarCode();
        this.$alert(String(res.msg || '同步完成'), '同步处理', { type: 'success' });
        this.search();
      } catch (e) {
        this.$message.error(e.message || '同步失败');
      } finally {
        this.syncing = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getWxtSpVarInfo({
          page: 1,
          size: 999999,
          wpmc: this.wpmc,
          sycStatus: this.sycStatus,
          SPDstate: this.spdState
        });
        const rows = res.result || [];
        const data = rows.map((r) => ({
          唯一标识: r.id,
          品种编码: r.wpbm,
          品种名称: r.wpmc,
          规格型号: r.gexh,
          单位: r.dw,
          中标价: this.formatPrice(r.zbj),
          生产商名称: r.scsmc,
          品牌: r.pp,
          是否收费: r.isSfWp,
          注册证号: r.cpzch,
          注册证有效期: r.zczYxq,
          注册证名称: r.zcName,
          供应商名称: r.gysmc,
          审批时间: r.sycDate,
          微讯通状态: this.formatSycStatus(r.sycStatus),
          SPD状态: this.formatSpdState(r.SPD_STATE),
          医保编码: r.ybCode,
          阳光产品码: r.ygptdm,
          阳光规格型号码: r.ygptggbm,
          阳光价格: r.ygptjg,
          备注: r.bz
        }));
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, '微讯通品种审核');
        writeFile(wb, '微讯通品种审核.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.label {
  font-size: 12px;
  color: #606266;
}
.pager {
  margin-top: 10px;
  text-align: right;
}
</style>
