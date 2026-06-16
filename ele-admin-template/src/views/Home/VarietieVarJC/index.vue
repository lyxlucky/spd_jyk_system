<template>
  <div class="ele-body spd-page varietie-var-jc-page">
    <el-card shadow="never">
      <el-form size="mini" inline class="filter-row" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="where.VARIETIE_CODE_NEW"
            clearable
            placeholder="品种编码"
            style="width: 220px"
            @keyup.enter.native="reload"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="where.VARIETIE_NAME"
            clearable
            placeholder="品种名称"
            style="width: 220px"
            @keyup.enter.native="reload"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="downloadImportTemplate">导入模板</el-button>
          <el-upload
            class="inline-upload"
            action=""
            accept=".xlsx,.xls"
            :show-file-list="false"
            :http-request="onImport"
          >
            <el-button :loading="importing">导入</el-button>
          </el-upload>
          <el-button type="danger" :disabled="!selection.length" @click="onDelete">剔除</el-button>
          <el-button @click="monthVisible = true">更新月结集采信息</el-button>
          <el-button
            v-permission="'export-VarietieVarJCDc'"
            icon="el-icon-download"
            :loading="exporting"
            @click="onExport"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        highlight-current-row
        height="calc(100vh - 220px)"
        size="mini"
        :stripe="true"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="varietieVarJCTable"
      >
        <template v-slot:action="{ row }">
          <el-button type="text" size="mini" @click="openEdit(row)">编辑</el-button>
        </template>
        <template v-slot:state="{ row }">
          <el-tag size="mini" :type="row.STATE === '1' || row.STATE === 1 ? 'success' : 'info'">
            {{ formatJcState(row.STATE) }}
          </el-tag>
        </template>
      </ele-pro-table>
    </el-card>

    <EditDialog :visible.sync="editVisible" :data="currentRow" @done="reloadTable" />
    <UpdateMonthDialog :visible.sync="monthVisible" />
  </div>
</template>

<script>
import EditDialog from './components/EditDialog.vue';
import UpdateMonthDialog from './components/UpdateMonthDialog.vue';
import {
  delVarietieJCData,
  getVarietieJCData,
  importVarJCExcel
} from '@/api/Home/VarietieVarJC';
import {
  date10,
  downloadImportTemplate,
  exportJcVarietyExcel,
  formatJcState
} from './utils';

export default {
  name: 'VarietieVarJC',
  components: { EditDialog, UpdateMonthDialog },
  data() {
    return {
      where: {
        VARIETIE_CODE_NEW: '',
        VARIETIE_NAME: ''
      },
      currentWhere: {},
      pageSize: 100,
      pageSizes: [30, 50, 100, 200, 300, 99999],
      selection: [],
      editVisible: false,
      monthVisible: false,
      currentRow: null,
      importing: false,
      exporting: false,
      columns: [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 50, align: 'center', fixed: 'left' },
        { label: '操作', width: 80, fixed: 'left', slot: 'action' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 110, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 150, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 160, showOverflowTooltip: true },
        { prop: 'UNIT', label: '单位', width: 70 },
        {
          prop: 'PRICE',
          label: '当前中标价格',
          width: 110,
          formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(2) : '')
        },
        {
          prop: 'JC_PRICE',
          label: '集采价格',
          width: 90,
          formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(2) : '')
        },
        {
          prop: 'JC_START_TIME',
          label: '集采开始时间',
          width: 110,
          formatter: (_r, _c, v) => date10(v)
        },
        {
          prop: 'JC_END_TIME',
          label: '集采结束时间',
          width: 110,
          formatter: (_r, _c, v) => date10(v)
        },
        { prop: 'CREATE_MAN', label: '创建人', width: 80, showOverflowTooltip: true },
        { prop: 'CREATE_TIME', label: '创建时间', width: 140, showOverflowTooltip: true },
        { prop: 'REMARK', label: '备注', minWidth: 100, showOverflowTooltip: true },
        { slot: 'state', prop: 'STATE', label: '状态', width: 80 },
        { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 140, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 160, showOverflowTooltip: true }
      ]
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    formatJcState,
    downloadImportTemplate,
    datasource({ page, limit, where }) {
      this.currentWhere = where || this.where;
      return getVarietieJCData({ page, limit, where: this.currentWhere }).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reload() {
      this.currentWhere = { ...this.where };
      this.$refs.table?.reload({ page: 1, where: this.currentWhere });
    },
    reloadTable() {
      this.$refs.table?.reload({ where: this.currentWhere });
    },
    openEdit(row) {
      this.currentRow = row;
      this.editVisible = true;
    },
    async onDelete() {
      if (!this.selection.length) {
        this.$message.warning('请选中要剔除的数据');
        return;
      }
      try {
        await this.$confirm('确认要剔除选中的集采品种吗？', '提示', { type: 'warning' });
        const ids = this.selection.map((row) => row.ID);
        const res = await delVarietieJCData(ids);
        this.$message.success(res.msg || '剔除成功');
        this.reloadTable();
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '剔除失败');
        }
      }
    },
    async onImport({ file }) {
      this.importing = true;
      try {
        const nickname = this.$store.state.user.info?.Nickname || '';
        const res = await importVarJCExcel(file, nickname);
        this.$message.success(res.msg || '导入成功');
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '导入失败');
      } finally {
        this.importing = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getVarietieJCData({
          page: 1,
          limit: 999999,
          where: this.currentWhere
        });
        if (!(res.result || []).length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        exportJcVarietyExcel(res.result);
        this.$message.success('导出成功');
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
.varietie-var-jc-page ::v-deep .el-card__body {
  padding: 12px;
}
.filter-row {
  margin-bottom: 8px;
}
.inline-upload {
  display: inline-block;
  margin: 0 10px;
}
</style>
