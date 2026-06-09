<template>
  <div>
    <ProjectSearchBar
      v-model="where"
      :xm-name-options="xmNameOptions"
      :xm-num-options="xmNumOptions"
      :xm-type-options="xmTypeOptions"
      @search="reload"
    >
      <template v-slot:actions>
        <el-button
          v-permission="'export-PrchaseDataV2-dlcgdc'"
          size="small"
          icon="el-icon-download"
          :loading="exporting"
          @click="onExportMain"
        >
          导出
        </el-button>
        <el-button
          v-permission="'export-PrchaseDataV2-cgmxdc'"
          size="small"
          icon="el-icon-download"
          :loading="exportingDetail"
          @click="onExportDetail"
        >
          导出明细
        </el-button>
        <el-button size="small" type="primary" plain @click="openAdd">带量采购</el-button>
        <el-button size="small" @click="openImportChoice('purchase')">导入</el-button>
        <el-button size="small" @click="openImportChoice('var')">导入关联品种</el-button>
        <el-button
          v-permission="'export-PrchaseDataV2-ambdc'"
          size="small"
          @click="onExportJc"
        >
          按集采模板导出
        </el-button>
        <el-button size="small" :disabled="!selection.length" @click="onLinkByXmNum">
          按集项目编号关联品种
        </el-button>
      </template>
    </ProjectSearchBar>

    <ele-pro-table
      ref="table"
      :height="tableHeight"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="30"
      :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
      :row-class-name="rowClass"
      cache-key="HomePrchaseDataV2ProjectTable"
      @sort-change="onSortChange"
    >
      <template v-slot:source="{ row }">
        <el-link type="primary" :underline="false" @click="openSource(row)">
          {{ row.PROD_SOURCE_FROM || '编辑' }}
        </el-link>
      </template>
      <template v-slot:endDate="{ row }">
        <span :class="{ 'text-danger': fmtEndDateWithDays(row).danger }">
          {{ fmtEndDateWithDays(row).text }}
        </span>
      </template>
      <template v-slot:leftQty="{ row }">{{ leftQty(row) }}</template>
      <template v-slot:wcl="{ row }">{{ Number(row.WCL || 0).toFixed(2) }}%</template>
      <template v-slot:shProcess="{ row }">{{ fmtTimeProgress(row) }}</template>
      <template v-slot:action="{ row }">
        <el-button type="text" size="mini" @click="openDetail(row)">详情</el-button>
        <el-button type="text" size="mini" @click="openEdit(row)">编辑</el-button>
        <el-button type="text" size="mini" @click="openDeptLimit(row)">科室监测量</el-button>
        <el-button type="text" size="mini" @click="openPickVariety(row)">关联品种</el-button>
        <el-button type="text" size="mini" @click="openVariety(row)">品种</el-button>
        <el-button type="text" size="mini" class="danger-link" @click="onDelete(row)">删除</el-button>
      </template>
    </ele-pro-table>

    <ConsumeDetailDialog :visible.sync="detailVisible" :buy-id="activeBuyId" />
    <VarietyTableDialog :visible.sync="varietyVisible" :buy-id="activeBuyId" />
    <DeptLimitDialog :visible.sync="deptVisible" :row="activeRow" @done="reload" />
    <PickVarietyDialog :visible.sync="pickVisible" :buy-id="activeBuyId" @done="reload" />

    <el-dialog title="添加带量采购" :visible.sync="addVisible" width="640px" append-to-body>
      <el-form ref="addForm" :model="addForm" label-width="120px" size="small">
        <el-form-item label="注册证批准文号"><el-input v-model="addForm.APPROVAL_NUMBER" /></el-form-item>
        <el-form-item label="注册证名称"><el-input v-model="addForm.PROD_REGISTRATION_NAME" /></el-form-item>
        <el-form-item label="生产企业"><el-input v-model="addForm.MANUFACTURING_ENT_NAME" /></el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker v-model="addForm.BUY_TIME" type="date" value-format="yyyy-MM-dd" style="width:100%" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="addForm.BUY_TIME2" type="date" value-format="yyyy-MM-dd" style="width:100%" />
        </el-form-item>
        <el-form-item label="数量"><el-input v-model="addForm.COUNT" type="number" /></el-form-item>
        <el-form-item label="价格"><el-input v-model="addForm.PRICE" type="number" /></el-form-item>
        <el-form-item label="项目编号"><el-input v-model="addForm.XM_NUM" /></el-form-item>
        <el-form-item label="项目名称"><el-input v-model="addForm.XM_NAME" /></el-form-item>
        <el-form-item label="项目类型"><el-input v-model="addForm.XM_TYPE" /></el-form-item>
        <el-form-item label="集采组套项目部件"><el-input v-model="addForm.JC_STACK_XMPJ" /></el-form-item>
        <el-form-item label="金额"><el-input v-model="addForm.PRICE2" /></el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitAdd">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editVisible" width="640px" append-to-body>
      <el-form :model="editForm" label-width="120px" size="small">
        <el-form-item label="价格"><el-input v-model="editForm.PRICE" type="number" /></el-form-item>
        <el-form-item label="项目编号"><el-input v-model="editForm.XM_NUM" /></el-form-item>
        <el-form-item label="项目名称"><el-input v-model="editForm.XM_NAME" /></el-form-item>
        <el-form-item label="项目类型"><el-input v-model="editForm.XM_TYPE" /></el-form-item>
        <el-form-item label="批准文号"><el-input v-model="editForm.APPROVAL_NUMBER" /></el-form-item>
        <el-form-item label="注册证名称"><el-input v-model="editForm.PROD_REGISTRATION_NAME" /></el-form-item>
        <el-form-item label="生产企业"><el-input v-model="editForm.MANUFACTURING_ENT_NAME" /></el-form-item>
        <el-form-item label="起始日期">
          <el-date-picker v-model="editForm.BUY_TIME" type="date" value-format="yyyy-MM-dd" style="width:100%" />
        </el-form-item>
        <el-form-item label="终止日期">
          <el-date-picker v-model="editForm.BUY_TIME2" type="date" value-format="yyyy-MM-dd" style="width:100%" />
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="editForm.BZ" /></el-form-item>
        <el-form-item label="集采组套项目部件"><el-input v-model="editForm.JC_STACK_XMPJ" /></el-form-item>
        <el-form-item label="金额"><el-input v-model="editForm.PRICE2" type="number" /></el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitEdit">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="自定义来源" :visible.sync="sourceVisible" width="420px" append-to-body>
      <el-input v-model="sourceText" placeholder="自定义来源" />
      <span slot="footer">
        <el-button @click="sourceVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitSource">确定</el-button>
      </span>
    </el-dialog>

    <input ref="fileInput" type="file" accept=".xlsx,.xls" style="display:none" @change="onFilePicked" />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import ProjectSearchBar from './ProjectSearchBar.vue';
import ConsumeDetailDialog from './ConsumeDetailDialog.vue';
import VarietyTableDialog from './VarietyTableDialog.vue';
import DeptLimitDialog from './DeptLimitDialog.vue';
import PickVarietyDialog from './PickVarietyDialog.vue';
import {
  getLimitBuyV2List,
  upDlCount,
  upDlPrice,
  editSource,
  addLimitBuy,
  exportLimitBuyV2Detail,
  exportJcInfo,
  addDlVarWithXmbh,
  impPrchaseData,
  impLimitDelVar
} from '@/api/Home/PrchaseDataV2';
import {
  defaultWhere,
  exportAoA,
  fmtDate10,
  fmtDateTime,
  fmtEndDateWithDays,
  fmtTimeProgress,
  leftQty,
  isWarningRow,
  isFoshanColumnMode,
  regName,
  approvalNo,
  mfgName,
  calcTimeProgress
} from '../utils';

export default {
  components: {
    ProjectSearchBar,
    ConsumeDetailDialog,
    VarietyTableDialog,
    DeptLimitDialog,
    PickVarietyDialog
  },
  props: {
    xmNameOptions: { type: Array, default: () => [] },
    xmNumOptions: { type: Array, default: () => [] },
    xmTypeOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      where: defaultWhere(),
      sort: { field: '', order: '' },
      selection: [],
      exporting: false,
      exportingDetail: false,
      saving: false,
      importType: '',
      tableHeight: 'calc(100vh - 380px)',
      detailVisible: false,
      varietyVisible: false,
      deptVisible: false,
      pickVisible: false,
      addVisible: false,
      editVisible: false,
      sourceVisible: false,
      activeBuyId: null,
      activeRow: null,
      sourceText: '',
      sourceId: null,
      addForm: this.emptyAddForm(),
      editForm: {}
    };
  },
  computed: {
    countLabel() {
      return isFoshanColumnMode ? '任务量' : '计划数量';
    },
    columns() {
      return [
        { type: 'selection', width: 45, fixed: 'left' },
        {
          columnKey: 'action',
          label: '操作',
          width: 420,
          align: 'center',
          fixed: 'left',
          slot: 'action'
        },
        { columnKey: 'source', label: '自定义来源', width: 110, slot: 'source' },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 140,
          showOverflowTooltip: true,
          sortable: 'custom',
          formatter: (r) => regName(r)
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '批准文号',
          minWidth: 130,
          showOverflowTooltip: true,
          sortable: 'custom',
          formatter: (r) => approvalNo(r)
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          minWidth: 130,
          showOverflowTooltip: true,
          sortable: 'custom',
          formatter: (r) => mfgName(r)
        },
        {
          prop: 'BUY_TIME',
          label: '起始日期',
          width: 110,
          sortable: 'custom',
          formatter: (_r, _c, v) => fmtDate10(v)
        },
        { columnKey: 'endDate', label: '结束日期', width: 150, slot: 'endDate', sortable: 'custom' },
        { prop: 'PRICE', label: '单价', width: 80, align: 'right', sortable: 'custom' },
        {
          prop: 'COUNT',
          label: this.countLabel,
          width: 90,
          align: 'right',
          sortable: 'custom'
        },
        { prop: 'GOODS_QTY', label: '已消耗数量', width: 100, align: 'right', sortable: 'custom' },
        { columnKey: 'leftQty', label: '余可用数量', width: 100, align: 'right', slot: 'leftQty' },
        { columnKey: 'wcl', label: '完成率%', width: 90, align: 'right', slot: 'wcl', sortable: 'custom' },
        { columnKey: 'shProcess', label: '时序进度%', width: 100, align: 'right', slot: 'shProcess', sortable: 'custom' },
        { prop: 'ADD_MAN', label: '操作人', width: 90 },
        {
          prop: 'LAST_UPDATE_DATE',
          label: '添加时间',
          width: 160,
          formatter: (_r, _c, v) => fmtDateTime(v)
        },
        { prop: 'BH_COUNT', label: '临时备货次数', width: 110 },
        { prop: 'ID', label: 'ID', width: 80 },
        { prop: 'XM_NUM', label: '项目编号', minWidth: 120, sortable: 'custom' },
        { prop: 'XM_NAME', label: '项目名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
        { prop: 'XM_TYPE', label: '项目类型', minWidth: 110, sortable: 'custom' },
        { prop: 'SOURCE_FROM', label: '阳光来源', minWidth: 120, showOverflowTooltip: true },
        { prop: 'JC_STACK_XMPJ', label: '集采组套项目部件', minWidth: 130, showOverflowTooltip: true },
        { prop: 'PRICE2', label: '金额', width: 90, align: 'right' },
        { prop: 'BZ', label: '备注', minWidth: 120, showOverflowTooltip: true }
      ];
    }
  },
  methods: {
    fmtEndDateWithDays,
    fmtTimeProgress,
    leftQty,
    emptyAddForm() {
      return {
        APPROVAL_NUMBER: '',
        PROD_REGISTRATION_NAME: '',
        MANUFACTURING_ENT_NAME: '',
        BUY_TIME: '',
        BUY_TIME2: '',
        COUNT: '',
        PRICE: '',
        XM_NUM: '',
        XM_NAME: '',
        XM_TYPE: '',
        JC_STACK_XMPJ: '',
        PRICE2: '0'
      };
    },
    rowClass({ row }) {
      return isWarningRow(row) ? 'row-warning' : '';
    },
    datasource({ page, limit }) {
      return getLimitBuyV2List(this.where, page, limit, this.sort).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: this.where });
      this.$emit('search');
    },
    onSortChange({ prop, order }) {
      this.sort = {
        field: prop || '',
        order: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      };
      this.reload();
    },
    setActive(row) {
      this.activeBuyId = row.ID;
      this.activeRow = row;
    },
    openDetail(row) {
      this.setActive(row);
      this.detailVisible = true;
    },
    openVariety(row) {
      this.setActive(row);
      this.varietyVisible = true;
    },
    openDeptLimit(row) {
      this.setActive(row);
      this.deptVisible = true;
    },
    openPickVariety(row) {
      this.setActive(row);
      this.pickVisible = true;
    },
    openAdd() {
      this.addForm = this.emptyAddForm();
      this.addVisible = true;
    },
    openEdit(row) {
      this.setActive(row);
      this.editForm = {
        ID: row.ID,
        PRICE: row.PRICE,
        XM_NUM: row.XM_NUM || '',
        XM_NAME: row.XM_NAME || '',
        XM_TYPE: row.XM_TYPE || '',
        APPROVAL_NUMBER: approvalNo(row),
        PROD_REGISTRATION_NAME: regName(row),
        MANUFACTURING_ENT_NAME: mfgName(row),
        BUY_TIME: fmtDate10(row.BUY_TIME),
        BUY_TIME2: fmtDate10(row.BUY_TIME2),
        BZ: row.BZ || '',
        JC_STACK_XMPJ: row.JC_STACK_XMPJ || '',
        PRICE2: row.PRICE2 || ''
      };
      this.editVisible = true;
    },
    openSource(row) {
      this.sourceId = row.ID;
      this.sourceText = row.PROD_SOURCE_FROM || '';
      this.sourceVisible = true;
    },
    async submitAdd() {
      this.saving = true;
      try {
        const res = await addLimitBuy(this.addForm);
        Message.success(res.msg || '添加成功');
        this.addVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '添加失败');
      } finally {
        this.saving = false;
      }
    },
    async submitEdit() {
      this.saving = true;
      try {
        const res = await upDlPrice(this.editForm);
        Message.success(res.msg || '保存成功');
        this.editVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    async submitSource() {
      this.saving = true;
      try {
        const res = await editSource(this.sourceId, this.sourceText);
        Message.success(res.msg || '保存成功');
        this.sourceVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    onDelete(row) {
      MessageBox.confirm('确定删除吗?', '提示', { type: 'warning' })
        .then(async () => {
          await upDlCount(row.ID, 1, 0);
          Message.success('删除成功');
          this.reload();
        })
        .catch(() => {});
    },
    openImportChoice(type) {
      this.importType = type;
      MessageBox.confirm('请选择需要执行的操作', '导入', {
        distinguishCancelAndClose: true,
        confirmButtonText: '下载模板',
        cancelButtonText: '导入'
      })
        .then(() => this.downloadTemplate(type))
        .catch((action) => {
          if (action === 'cancel') {
            this.$refs.fileInput.value = '';
            this.$refs.fileInput.click();
          }
        });
    },
    downloadTemplate(type) {
      if (type === 'purchase') {
        exportAoA('带量采购导入模板.xlsx', [
          ['项目编号', '项目名称', '项目类型', '批准文号', '价格', '最低限量', '起始时间', '结束时间', '自定义来源', '注册证名称', '生产企业', '备注'],
          ['XM001', '带量采购项目示例', '耗材', '国械注准20240000001', '12.34', '100', '2026-01-01', '2026-12-31', '阳光平台', '一次性使用耗材', '测试生产企业', '']
        ]);
      } else {
        exportAoA('带量采购关联品种导入模板.xlsx', [
          ['带量采购ID', '品种编码', '分子', '分母'],
          ['1', 'VAR001', '1', '1']
        ]);
      }
    },
    async onFilePicked(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const fn = this.importType === 'purchase' ? impPrchaseData : impLimitDelVar;
        const res = await fn(file);
        Message.success(res.msg || '导入成功');
        this.reload();
      } catch (err) {
        Message.error(err.message || '导入失败');
      }
    },
    buildExportRow(row) {
      const progress = (() => {
        const p = calcTimeProgress(row);
        return `${p.toFixed(2)}%`;
      })();
      return [
        row.ID,
        row.SOURCE_FROM,
        row.PROD_SOURCE_FROM,
        regName(row),
        approvalNo(row),
        mfgName(row),
        fmtDate10(row.BUY_TIME),
        fmtDate10(row.BUY_TIME2),
        row.PRICE,
        row.COUNT,
        row.GOODS_QTY,
        leftQty(row),
        `${Number(row.WCL || 0).toFixed(2)}%`,
        progress,
        row.ADD_MAN,
        fmtDateTime(row.LAST_UPDATE_DATE),
        row.XM_NUM,
        row.XM_NAME,
        row.XM_TYPE,
        row.BZ
      ];
    },
    async onExportMain() {
      this.exporting = true;
      try {
        const header = [
          'ID', '阳光来源', '自定义来源', '注册证名称', '批准文号', '生产企业', '起始日期', '结束日期',
          '单价', this.countLabel, '已消耗数量', '余可用数量', '完成率', '时序进度', '操作人', '添加时间',
          '项目编号', '项目名称', '项目类型', '备注'
        ];
        let rows = this.selection;
        if (!rows.length) {
          const res = await getLimitBuyV2List(this.where, 1, 900000, this.sort);
          rows = res.result || [];
        }
        exportAoA('带量采购.xlsx', [header, ...rows.map((r) => this.buildExportRow(r))]);
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onExportDetail() {
      if (!this.selection.length) {
        Message.warning('请先勾选要导出的数据');
        return;
      }
      this.exportingDetail = true;
      try {
        const ids = this.selection.map((r) => r.ID).join(',');
        const res = await exportLimitBuyV2Detail(ids);
        const header = [
          'ID', '自定义来源', '批准文号', '注册证名称', '生产企业', '起始日期', '终止日期', '单价',
          '计划数量', '项目名称', '项目编号', '项目类型', '品种编码', '品种名称', '型号规格', '单位', '消耗数量'
        ];
        const data = [header];
        (res.result || []).forEach((item) => {
          data.push([
            item.ID,
            item.PROD_SOURCE_FROM,
            item.ONE_APPROVAL_NUMBER || item.APPROVAL_NUMBER,
            item.ONE_PROD_REGISTRATION_NAME || item.PROD_REGISTRATION_NAME,
            item.ONE_MANUFACTURING_ENT_NAME || item.MANUFACTURING_ENT_NAME,
            item.BUY_TIME,
            item.BUY_TIME2,
            item.PRICE,
            item.COUNT,
            item.XM_NAME,
            item.XM_NUM,
            item.XM_TYPE,
            item.VARIETIE_CODE_NEW,
            item.VARIETIE_NAME,
            item.SPECIFICATION_OR_TYPE,
            item.UNIT,
            item.GOODS_QTY
          ]);
        });
        exportAoA('明细.xlsx', data);
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exportingDetail = false;
      }
    },
    async onExportJc() {
      try {
        const res = await exportJcInfo();
        const data = [
          ['品种编码', '集采价格', '状态（0-冻结/1-启用）', '备注', '集采起始时间', '集采结束时间']
        ];
        (res.result || []).forEach((item) => {
          data.push([
            item.VARIETIE_CODE_NEW,
            item.JC_PRICE,
            '1',
            item.PROD_SOURCE_FROM,
            fmtDate10(item.BUY_TIME),
            fmtDate10(item.BUY_TIME2)
          ]);
        });
        exportAoA('集采导入.xlsx', data);
      } catch (e) {
        Message.error(e.message || '导出失败');
      }
    },
    onLinkByXmNum() {
      MessageBox.confirm('确定按项目编码关联吗？', '提示', { type: 'warning' })
        .then(async () => {
          const res = await addDlVarWithXmbh(this.selection);
          Message.success(res.msg || '操作成功');
          this.reload();
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.danger-link {
  color: #f56c6c;
}
.text-danger {
  color: #f56c6c;
}
::v-deep .row-warning > td {
  background-color: #f9d5d5 !important;
}
</style>
