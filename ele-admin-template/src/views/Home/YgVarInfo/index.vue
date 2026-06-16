<template>
  <div class="ele-body spd-page yg-var-info">
    <el-card shadow="never">
      <div class="page-title">阳光平台本院目录</div>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="品种编码/名称">
          <el-input v-model="filters.varName" clearable style="width: 160px" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="filters.varGgxh" clearable style="width: 140px" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="filters.supplier" clearable style="width: 140px" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.reg" clearable style="width: 140px" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="产地">
          <el-input v-model="filters.mea" clearable style="width: 120px" @keyup.enter.native="reload" />
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="来源">
          <el-select v-model="filters.ly" clearable style="width: 160px">
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否对码">
          <el-select v-model="filters.isDm" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="已对码" value="1" />
            <el-option label="未对码" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否发送">
          <el-select v-model="filters.isSend" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格是否一致">
          <el-select v-model="filters.isPrice" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="filters.isEnbale" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同是否生效">
          <el-select v-model="filters.isHtSx" clearable style="width: 100px">
            <el-option label="是" value="1" />
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否备注">
          <el-select v-model="filters.isMark" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台对码匹配">
          <el-select v-model="filters.isDmYz" clearable style="width: 170px">
            <el-option
              v-for="item in isDmYzOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="action-bar">
        <el-button
          v-permission="'export-YgVarInfo-jsdc'"
          size="small"
          :loading="exporting"
          @click="exportSearch"
        >
          导出检索
        </el-button>
        <el-button
          v-permission="'export-YgVarInfo-jsdc'"
          size="small"
          type="primary"
          plain
          :loading="fastExporting"
          @click="exportFast"
        >
          快速导出检索
        </el-button>
        <el-button size="small" @click="productDialogVisible = true">单独获取产品</el-button>
        <el-button size="small" :loading="fetchingAll" @click="fetchAllProducts">获取全部产品</el-button>
        <el-button size="small" @click="openMarkDialog">修改备注</el-button>
        <el-button size="small" :loading="syncing" @click="syncSource">同步来源及分类</el-button>
      </div>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="filters"
        :selection.sync="selection"
        :page-size="20"
        :page-sizes="[20, 40, 60, 90, 150, 300, 99999]"
        cache-key="YgVarInfo"
        @done="onTableDone"
      >
        <template v-slot:YG_IS_CAN_SEND="{ row }">
          {{ formatYgCanSend(row.YG_IS_CAN_SEND) }}
        </template>
        <template v-slot:SPEC_TYPE="{ row }">
          {{ formatSpecType(row) }}
        </template>
        <template v-slot:MEDICAL_CODE="{ row }">
          <span :class="{ 'text-danger': isMedicalCodeMismatch(row) }">
            {{ row.MEDICAL_CODE }}
          </span>
        </template>
        <template v-slot:MEDICAL_CODE27="{ row }">
          <span :class="{ 'text-danger': isMedicalCode27Mismatch(row) }">
            {{ row.MEDICAL_CODE27 }}
          </span>
        </template>
        <template v-slot:UDI_TOP="{ row }">
          <span v-if="row.UDI_TOP != null" :class="{ 'text-danger': isUdiMismatch(row) }">
            {{ isUdiMismatch(row) ? row.UDICODE : row.UDI_TOP }}
          </span>
        </template>
        <template v-slot:YG_SEND_BEGIN_TIME="{ row }">
          {{ formatYgSendTime(row.YG_SEND_BEGIN_TIME) }}
        </template>
      </ele-pro-table>
    </el-card>

    <ExportAuditDialog
      :visible.sync="auditVisible"
      :audit-info="auditInfo"
      @success="onAuditSubmitted"
    />
    <SimpleInputDialog
      :visible.sync="productDialogVisible"
      title="手动获取阳光产品信息"
      label="产品码"
      placeholder="产品码"
      :loading="fetchingOne"
      @confirm="fetchOneProduct"
    />
    <SimpleInputDialog
      :visible.sync="markDialogVisible"
      title="修改备注"
      label="备注"
      placeholder="备注"
      :loading="markSaving"
      @confirm="saveMark"
    />
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { BACK_BASE_URL } from '@/config/setting';
import {
  getYgBaseInfo,
  exportYgBaseInfoFast,
  getYgBaseInfoExportPage,
  updateYgSubcodeMark,
  tbSourceThree,
  fetchYgProduct,
  fetchAllYgProducts
} from '@/api/Home/YgVarInfo';
import {
  SOURCE_OPTIONS,
  ISDMYZ_OPTIONS,
  defaultFilters,
  formatYgSendTime,
  formatSpecType,
  formatYgCanSend,
  isMedicalCodeMismatch,
  isMedicalCode27Mismatch,
  isUdiMismatch,
  exportYgVarInfoPage
} from './utils';
import ExportAuditDialog from './components/ExportAuditDialog.vue';
import SimpleInputDialog from './components/SimpleInputDialog.vue';

export default {
  name: 'YgVarInfo',
  components: { ExportAuditDialog, SimpleInputDialog },
  data() {
    return {
      filters: defaultFilters(),
      sourceOptions: SOURCE_OPTIONS,
      isDmYzOptions: ISDMYZ_OPTIONS,
      selection: [],
      tableTotal: 0,
      exporting: false,
      fastExporting: false,
      fetchingOne: false,
      fetchingAll: false,
      syncing: false,
      markSaving: false,
      auditVisible: false,
      auditInfo: {},
      productDialogVisible: false,
      markDialogVisible: false,
      columns: [
        { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
        { prop: 'MARK', label: '备注', width: 100, showOverflowTooltip: true },
        { prop: 'YG_IS_CAN_SEND', label: '是否发送', width: 80, align: 'center', slot: 'YG_IS_CAN_SEND' },
        { prop: 'CONTRACTSTATUS', label: '阳光合同', width: 120, showOverflowTooltip: true },
        { prop: 'source', label: '来源', width: 120, showOverflowTooltip: true },
        { prop: 'purchaseType', label: '采购类别', width: 120, showOverflowTooltip: true },
        { prop: 'COMPANYIDPS', label: '配送商编码', width: 100, showOverflowTooltip: true },
        { prop: 'companyNamePs', label: '配送商', width: 180, showOverflowTooltip: true },
        { prop: 'GOODSID', label: '产品码', width: 90, showOverflowTooltip: true },
        { prop: 'SUBCODEID', label: '规格型号码', width: 120, showOverflowTooltip: true },
        { prop: 'PRODUCTCODE', label: '医保编码（平台）', width: 130, showOverflowTooltip: true },
        { prop: 'NUMBERCODE', label: '医保编码后7位（平台）', width: 140, showOverflowTooltip: true },
        { prop: 'UDICODE', label: 'udi（平台）', width: 120, showOverflowTooltip: true },
        { prop: 'goodsName', label: '产品名', width: 180, showOverflowTooltip: true },
        { prop: 'SPEC_TYPE', label: '型号/规格', width: 160, showOverflowTooltip: true, slot: 'SPEC_TYPE' },
        { prop: 'purchasePrice', label: '采购价格', width: 100, align: 'right' },
        { prop: 'MINUNITSALE', label: '单位', width: 60, align: 'center' },
        { prop: 'regcodeName', label: '注册证', width: 160, showOverflowTooltip: true },
        { prop: 'sortName', label: '分类', width: 100, showOverflowTooltip: true },
        { prop: 'productNameFirst', label: '一级目录', width: 110, showOverflowTooltip: true },
        { prop: 'productNameSecond', label: '二级目录', width: 110, showOverflowTooltip: true },
        { prop: 'productNameThree', label: '三级目录', width: 110, showOverflowTooltip: true },
        { prop: 'brand', label: '品牌', width: 100, showOverflowTooltip: true },
        { prop: 'companyNameTb', label: '投标企业', width: 120, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: 'SPD供应商名称', width: 180, showOverflowTooltip: true },
        { prop: 'CON_SUPPLIER_NAME', label: 'SPD启用供应商名称', width: 180, showOverflowTooltip: true },
        { prop: 'YG_SUP_CODE', label: 'SPD供应商阳光平台', width: 160, showOverflowTooltip: true },
        { prop: 'VARIETIE_CODE_NEW', label: 'SPD品种编码', width: 120, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: 'SPD品种名称', width: 180, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: 'SPD规格型号', width: 180, showOverflowTooltip: true },
        { prop: 'PRICE', label: 'SPD中标价格', width: 110, align: 'right' },
        { prop: 'CON_SUPPLY_PRICE', label: 'SPD合同结算价格', width: 120, align: 'right' },
        { prop: 'YG_ZH_COUNT', label: '转换比基础资料', width: 110, align: 'center' },
        { prop: 'TJ_YG_ZH_COUNT', label: '推荐转换比', width: 90, align: 'center' },
        { prop: 'UNIT', label: 'SPD单位', width: 80, align: 'center' },
        { prop: 'APPROVAL_NUMBER', label: 'SPD注册证', width: 160, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: 'SPD生产企业', width: 160, showOverflowTooltip: true },
        { prop: 'CON_CONTRACT_NAME', label: 'SPD合同名称', width: 160, showOverflowTooltip: true },
        { prop: 'addTime', label: '添加时间', width: 120, showOverflowTooltip: true },
        {
          prop: 'MEDICAL_CODE',
          label: '医保编码(SPD)',
          width: 130,
          showOverflowTooltip: true,
          slot: 'MEDICAL_CODE'
        },
        {
          prop: 'MEDICAL_CODE27',
          label: '医保编码27位(SPD)',
          width: 140,
          showOverflowTooltip: true,
          slot: 'MEDICAL_CODE27'
        },
        { prop: 'UDI_TOP', label: 'UDI(SPD)', width: 120, showOverflowTooltip: true, slot: 'UDI_TOP' },
        {
          prop: 'YG_SEND_BEGIN_TIME',
          label: '发送起始时间',
          width: 120,
          align: 'center',
          slot: 'YG_SEND_BEGIN_TIME'
        }
      ]
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 340px)';
    }
  },
  methods: {
    formatYgSendTime,
    formatSpecType,
    formatYgCanSend,
    isMedicalCodeMismatch,
    isMedicalCode27Mismatch,
    isUdiMismatch,
    datasource({ page, limit, where }) {
      return getYgBaseInfo(where, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    onTableDone(res) {
      this.tableTotal = res?.count ?? 0;
    },
    openAudit(info) {
      this.auditInfo = info;
      this.auditVisible = true;
    },
    onAuditSubmitted() {
      Message.info('请等待管理员审核通过后再次点击导出');
    },
    async exportSearch() {
      if (!this.tableTotal) {
        Message.warning('没有可导出的数据');
        return;
      }
      this.exporting = true;
      try {
        const pageCount = Math.ceil(this.tableTotal / 100000) || 1;
        for (let page = 1; page <= pageCount; page += 1) {
          const res = await getYgBaseInfoExportPage(this.filters, page);
          if (res.needAudit) {
            this.openAudit(res);
            return;
          }
          const rows = res.result || [];
          if (!rows.length) break;
          exportYgVarInfoPage(rows, page);
        }
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async exportFast() {
      this.fastExporting = true;
      try {
        const res = await exportYgBaseInfoFast(this.filters);
        if (res.needAudit) {
          this.openAudit(res);
          return;
        }
        const fileName = res.msg;
        if (!fileName) {
          Message.error('导出失败：未返回文件名');
          return;
        }
        window.open(`${BACK_BASE_URL}/Excel/files/${encodeURIComponent(fileName)}`);
        Message.success(`导出成功，共 ${res.totalCount || 0} 条记录`);
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.fastExporting = false;
      }
    },
    async fetchOneProduct(ygCode) {
      this.fetchingOne = true;
      try {
        const res = await fetchYgProduct(ygCode);
        this.productDialogVisible = false;
        await MessageBox.alert(`阳光平台${res.msg || '操作完成'}`, '提示');
        this.reload();
      } catch (e) {
        Message.error(e.message || '获取失败');
      } finally {
        this.fetchingOne = false;
      }
    },
    async fetchAllProducts() {
      this.fetchingAll = true;
      try {
        const res = await fetchAllYgProducts();
        await MessageBox.alert(`阳光平台${res.msg || '操作完成'}`, '提示');
        this.reload();
      } catch (e) {
        Message.error(e.message || '获取失败');
      } finally {
        this.fetchingAll = false;
      }
    },
    openMarkDialog() {
      if (!this.selection.length) {
        Message.warning('请先勾选要修改备注的记录');
        return;
      }
      this.markDialogVisible = true;
    },
    async saveMark(mark) {
      const subcodeIds = this.selection.map((row) => row.SUBCODEID).join(',');
      this.markSaving = true;
      try {
        const res = await updateYgSubcodeMark(subcodeIds, mark);
        Message.success(res.msg || '修改成功');
        this.markDialogVisible = false;
        this.reload();
      } catch (e) {
        Message.error(e.message || '修改失败');
      } finally {
        this.markSaving = false;
      }
    },
    async syncSource() {
      this.syncing = true;
      try {
        const res = await tbSourceThree();
        Message.success(res.msg || '更新完成');
        this.reload();
      } catch (e) {
        Message.error(e.message || '更新失败');
      } finally {
        this.syncing = false;
      }
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
.filter-block {
  margin-bottom: 4px;
}
.action-bar {
  margin-bottom: 12px;
}
.action-bar .el-button + .el-button {
  margin-left: 8px;
}
.text-danger {
  color: #f56c6c;
}
</style>
