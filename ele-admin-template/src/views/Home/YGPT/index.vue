<template>
  <div class="ele-body spd-page ygpt-page">
    <el-card shadow="never">
      <el-form size="mini" class="filter-form" @submit.native.prevent>
        <el-row :gutter="8" type="flex" style="flex-wrap: wrap; align-items: center">
          <el-col :lg="4" :md="6" :sm="12">
            <el-input
              v-model="where.search"
              clearable
              placeholder="品种编码/名称/规格/供应商"
              @keyup.enter.native="reload"
            />
          </el-col>
          <el-col :lg="2" :md="4" :sm="8">
            <el-select v-model="where.state" placeholder="审批状态" style="width: 100%">
              <el-option label="未审批" value="0" />
              <el-option label="已审批" value="1" />
              <el-option label="全部" value="" />
              <el-option label="审批未通过" value="2" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.is_yg_code" placeholder="平台产品代码" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'yg' + item.value" :label="'产品代码-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.is_yg_spe_code" placeholder="平台规格型号码" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'spe' + item.value" :label="'规格型号码-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.YGPTis_MEDICAL_CODE" placeholder="医保编码" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'med' + item.value" :label="'医保编码-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.YGPTis_MEDICAL_CODE27" placeholder="医保编码27" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'med27' + item.value" :label="'医保27-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.YGPTis_pro" placeholder="省平台编码" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'pro' + item.value" :label="'省平台-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="2" :md="4" :sm="8">
            <el-select v-model="where.YGPTis_UDI" placeholder="UDI" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'udi' + item.value" :label="'UDI-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.YGPTis_IS_CHARGE" placeholder="是否计费" style="width: 100%">
              <el-option v-for="item in fillOptions" :key="'charge' + item.value" :label="'计费-' + item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :lg="2" :md="4" :sm="8">
            <el-select v-model="where.YGPT_ISENABLE" placeholder="启用状态" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="停用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-col>
          <el-col :lg="3" :md="5" :sm="12">
            <el-select v-model="where.YGPT_YLQX" placeholder="是否医疗器械" style="width: 100%">
              <el-option label="全部" value="" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-col>
          <el-col :lg="4" :md="6" :sm="12">
            <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
            <el-button icon="el-icon-download" :loading="exporting" @click="onExport">导出</el-button>
          </el-col>
        </el-row>
      </el-form>

      <div class="tip-text">
        tip：审核操作可以导出数据进行匹配核对，然后整理对应需要更新的信息到基础资料处用更新选定字段方式进行更新
      </div>

      <!-- 审批工具栏（旧页 sp_ygpt / sp_ygptNo，需先勾选列表行） -->
      <div class="toolbar-row">
        <!-- state=5：ApprovalYGPT，仅将供应商填写的 UDI 同步审批通过 -->
        <el-button size="mini" :loading="approving" @click="onApprove(5)">UDI审批</el-button>
        <!-- state=4：ApprovalYGPT，仅将供应商填写的省平台编码同步审批通过 -->
        <el-button size="mini" :loading="approving" @click="onApprove(4)">省平台编码审批</el-button>
        <!-- state=3：ApprovalYGPT，仅将供应商填写的医保编码同步审批通过 -->
        <el-button size="mini" :loading="approving" @click="onApprove(3)">医保编码审批</el-button>
        <!-- state=2：ApprovalYGPT，仅将供应商填写的阳光产品码/规格型号码同步审批通过 -->
        <el-button size="mini" :loading="approving" @click="onApprove(2)">阳光码审批</el-button>
        <!-- state=1：ApprovalYGPT，将全部填写字段一次性同步审批通过 -->
        <el-button size="mini" type="primary" :loading="approving" @click="onApprove(1)">全部审批</el-button>
        <!-- ApprovalYGPTNo：标记选中行为审批未通过 -->
        <el-button size="mini" type="danger" :loading="rejecting" @click="onApproveReject">审批不通过</el-button>
      </div>

      <ele-pro-table
        ref="table"
        highlight-current-row
        height="calc(100vh - 380px)"
        size="mini"
        :stripe="true"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="ygptAuditTable"
      >
        <template v-slot:isCharge="{ row }">
          {{ formatYesNo(row.IS_CHARGE) }}
        </template>
        <template v-slot:supYgCode="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_YG_CODE', 'YG_CODE') }">{{ row.SUP_YG_CODE || '' }}</span>
        </template>
        <template v-slot:supYgSpe="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_YG_SPE_TYPE', 'YG_SPE_TYPE') }">{{ row.SUP_YG_SPE_TYPE || '' }}</span>
        </template>
        <template v-slot:supMedical="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_MEDICAL_CODE', 'MEDICAL_CODE') }">{{ row.SUP_MEDICAL_CODE || '' }}</span>
        </template>
        <template v-slot:supMedical27="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_MEDICAL_CODE27', 'MEDICAL_CODE27') }">{{ row.SUP_MEDICAL_CODE27 || '' }}</span>
        </template>
        <template v-slot:supProvince="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_PROVINCE_PLATFORM_CODE', 'PROVINCE_PLATFORM_CODE') }">{{ row.SUP_PROVINCE_PLATFORM_CODE || '' }}</span>
        </template>
        <template v-slot:supUdi="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_UDI_TOP', 'UDI_TOP') }">{{ row.SUP_UDI_TOP || '' }}</span>
        </template>
        <template v-slot:supCharge="{ row }">
          <span :class="{ 'text-diff': isDiff(row, 'SUP_IS_CHARGE', 'IS_CHARGE') }">{{ row.SUP_IS_CHARGE || '' }}</span>
        </template>
        <template v-slot:approval="{ row }">
          <el-tag
            size="mini"
            :type="row.SUP_YG_STATE === '1' ? 'success' : row.SUP_YG_STATE === '2' ? 'danger' : 'warning'"
          >
            {{ formatApprovalState(row.SUP_YG_STATE) }}
          </el-tag>
        </template>
        <template v-slot:enable="{ row }">
          <el-tag size="mini" :type="row.ENABLE === '1' || row.ENABLE === 1 ? 'success' : 'info'">
            {{ formatEnable(row.ENABLE) }}
          </el-tag>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { approvalYGPT, approvalYGPTNo, getYGPT } from '@/api/Home/YGPT';
import {
  createDefaultWhere,
  exportYgptExcel,
  fillOptions,
  formatApprovalState,
  formatEnable,
  formatYesNo,
  isDiff
} from './utils';

export default {
  name: 'YGPT',
  data() {
    return {
      where: createDefaultWhere(),
      currentWhere: null,
      pageSize: 20,
      pageSizes: [20, 40, 60, 90, 150, 300, 1000],
      selection: [],
      exporting: false,
      approving: false,
      rejecting: false,
      fillOptions,
      columns: [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 110, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 200, showOverflowTooltip: true },
        { prop: 'YG_CODE', label: '产品码', minWidth: 140, showOverflowTooltip: true },
        { prop: 'YG_SPE_TYPE', label: '规格型号码', minWidth: 140, showOverflowTooltip: true },
        { prop: 'MEDICAL_CODE', label: '医保编码', minWidth: 150, showOverflowTooltip: true },
        { prop: 'MEDICAL_CODE27', label: '医保编码27位', minWidth: 150, showOverflowTooltip: true },
        { prop: 'PROVINCE_PLATFORM_CODE', label: '省平台编码', minWidth: 140, showOverflowTooltip: true },
        { prop: 'UDI_TOP', label: 'UDI', minWidth: 140, showOverflowTooltip: true },
        { slot: 'isCharge', prop: 'IS_CHARGE', label: '是否收费', minWidth: 90, align: 'center' },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 160, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 160, showOverflowTooltip: true },
        { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 150, showOverflowTooltip: true },
        { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
        { slot: 'supYgCode', label: '阳光产品码(填写)', minWidth: 150, showOverflowTooltip: true },
        { slot: 'supYgSpe', label: '阳光规格型号码(填写)', minWidth: 160, showOverflowTooltip: true },
        { slot: 'supMedical', label: '医保编码(填写)', minWidth: 150, showOverflowTooltip: true },
        { slot: 'supMedical27', label: '医保编码27位(填写)', minWidth: 160, showOverflowTooltip: true },
        { slot: 'supProvince', label: '省平台编码(填写)', minWidth: 150, showOverflowTooltip: true },
        { slot: 'supUdi', label: 'UDI(填写)', minWidth: 140, showOverflowTooltip: true },
        { slot: 'supCharge', label: '是否收费(填写)', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 160, showOverflowTooltip: true },
        { slot: 'approval', prop: 'SUP_YG_STATE', label: '审批状态', minWidth: 100, align: 'center' },
        { slot: 'enable', prop: 'ENABLE', label: '是否启用', minWidth: 90, align: 'center' },
        { prop: 'CPMC', label: '阳光产品名称', minWidth: 160, showOverflowTooltip: true },
        { prop: 'GG', label: '阳光规格', minWidth: 140, showOverflowTooltip: true },
        { prop: 'XH', label: '阳光型号', minWidth: 140, showOverflowTooltip: true },
        { prop: 'ZCZH', label: '阳光批准文号', minWidth: 150, showOverflowTooltip: true },
        { prop: 'SCCS', label: '阳光生产厂家', minWidth: 160, showOverflowTooltip: true }
      ]
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    formatYesNo,
    formatApprovalState,
    formatEnable,
    isDiff,
    datasource({ page, limit, where }) {
      this.currentWhere = where || this.where;
      return getYGPT({ page, limit, where: this.currentWhere }).then((res) => ({
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
    ensureSelection() {
      if (!this.selection.length) {
        this.$message.warning('请至少选中一行数据');
        return false;
      }
      return true;
    },
    /** state: 1全部 2阳光码 3医保 4省平台 5UDI → POST /ALhyyVar/ApprovalYGPT */
    async onApprove(state) {
      if (!this.ensureSelection()) return;
      this.approving = true;
      try {
        const res = await approvalYGPT(this.selection, state);
        this.$message.success(res.msg || '审批成功');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '审批失败');
      } finally {
        this.approving = false;
      }
    },
    /** POST /ALhyyVar/ApprovalYGPTNo */
    async onApproveReject() {
      if (!this.ensureSelection()) return;
      try {
        await this.$confirm('确认将选中品种标记为审批未通过？', '提示', { type: 'warning' });
        this.rejecting = true;
        const res = await approvalYGPTNo(this.selection);
        this.$message.success(res.msg || '操作成功');
        this.reloadTable();
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || '操作失败');
        }
      } finally {
        this.rejecting = false;
      }
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getYGPT({
          page: 1,
          limit: 999999,
          where: this.currentWhere || this.where
        });
        if (!(res.result || []).length) {
          this.$message.warning('没有可导出的数据');
          return;
        }
        exportYgptExcel(res.result);
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
.ygpt-page ::v-deep .el-card__body {
  padding: 12px;
}
.filter-form ::v-deep .el-form-item {
  margin-bottom: 8px;
}
.tip-text {
  color: #f56c6c;
  font-size: 12px;
  margin: 4px 0 10px;
}
.toolbar-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.text-diff {
  color: #f56c6c;
}
.ygpt-page ::v-deep .ele-pro-table .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
