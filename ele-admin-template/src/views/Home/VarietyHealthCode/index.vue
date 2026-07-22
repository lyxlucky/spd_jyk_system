<template>
  <div class="ele-body spd-page variety-health-code-page">
    <HealthCodeSearch @search="reload" />

    <div class="spd-panel spd-panel--actions">
      <div class="spd-panel__head spd-panel__head--split">
        <span>操作</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="action-bar">
        <el-button
          v-if="showCommitApproval"
          type="primary"
          size="mini"
          plain
          :disabled="!selection.length"
          :loading="commitLoading"
          @click="onSendApproval"
        >
          发送审批
        </el-button>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">散货品种列表</div>
      <div class="spd-panel__body spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          highlight-current-row
          height="calc(100vh - 320px)"
          size="mini"
          :stripe="true"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :columns="tableColumns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="varietyHealthCodeTable"
        >
          <template v-slot:action="{ row }">
            <el-button v-if="showActionEdit" type="text" size="mini" @click="openDetail(row)">
              编辑/详情
            </el-button>
            <el-button type="text" size="mini" @click="openPic(row)">历史图片</el-button>
          </template>
          <template v-slot:enable="{ row }">
            <el-tag size="mini" :type="row.Enable === '0' || row.Enable === 0 ? 'info' : 'success'">
              {{ formatEnable(row.Enable) }}
            </el-tag>
          </template>
          <template v-slot:approval="{ row }">
            <el-tag
              size="mini"
              :type="
                row.APPROVAL_STATE === '1'
                  ? 'success'
                  : row.APPROVAL_STATE === '2'
                  ? 'danger'
                  : 'warning'
              "
            >
              {{ formatApprovalState(row.APPROVAL_STATE) }}
            </el-tag>
          </template>
          <template v-slot:medicalCode="{ row }">
            <span :class="{ 'medical-mismatch': isMedicalCodeMismatch(row) }">
              {{ row.MEDICAL_CODE == null ? '' : row.MEDICAL_CODE }}
            </span>
          </template>
          <template v-slot:remark="{ row }">
            <el-button type="text" size="mini" @click="openRemark(row)">
              {{ row.BZ && row.BZ !== 'null' ? row.BZ : '备注' }}
            </el-button>
          </template>
          <template v-slot:lastPrice="{ row }">
            <el-button type="text" size="mini" @click="openPriceChange(row)">
              {{
                row.LAST_CHANGE_PRICE != null && row.LAST_CHANGE_PRICE !== ''
                  ? row.LAST_CHANGE_PRICE
                  : '-'
              }}
            </el-button>
          </template>
          <template v-slot:stseHisState="{ row }">
            {{ formatStseHisState(row.STSEHIS_STATE) }}
          </template>
        </ele-pro-table>
      </div>
    </div>

    <RemarkDialog :visible.sync="remarkVisible" :row="currentRow" @done="reloadTable" />
    <BdSendCommitDialog :visible.sync="bdSendVisible" :rows="selection" @done="reloadTable" />
    <PriceChangeDialog
      :visible.sync="priceChangeVisible"
      :varietie-code="priceChangeRow?.Varietie_Code"
      :variety-code-new="priceChangeRow?.Varietie_Code_New"
    />
    <VarietyEditDialog
      :visible.sync="editDialogVisible"
      :varietie-code="editRow?.Varietie_Code"
      @done="reloadTable"
    />
    <VarietyPicDialog :visible.sync="picDialogVisible" :row="editRow" />
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import HealthCodeSearch from './components/HealthCodeSearch.vue';
import RemarkDialog from '@/views/Home/VarietyDataLzhAudit/components/RemarkDialog.vue';
import BdSendCommitDialog from '@/views/Home/VarietyDataLzhAudit/components/BdSendCommitDialog.vue';
import PriceChangeDialog from '@/views/Home/VarietyDataLzhAudit/components/PriceChangeDialog.vue';
import VarietyEditDialog from '@/views/Home/VarietyDataLzhAudit/components/VarietyEditDialog.vue';
import VarietyPicDialog from '@/views/Home/VarietyDataLzhAudit/components/VarietyPicDialog.vue';
import { queryByCode } from '@/api/Home/VarietyHealthCode';
import { approvalVarietieCommit } from '@/api/Home/VarietyDataLzhAudit';
import {
  formatApprovalState,
  formatContractType,
  formatDateTime,
  formatDeptState,
  formatEnable,
  formatHighOrLowTwo,
  formatStorageId,
  formatStseHisState,
  formatYesNo,
  isMedicalCodeMismatch,
  isStseLikeHp,
  showHealthCodeActionEdit,
  showVarCommitApproval
} from './utils';

export default {
  name: 'VarietyHealthCode',
  components: {
    HealthCodeSearch,
    RemarkDialog,
    BdSendCommitDialog,
    PriceChangeDialog,
    VarietyEditDialog,
    VarietyPicDialog
  },
  data() {
    return {
      pageSize: 15,
      pageSizes: [15, 30, 50, 100, 200, 999999],
      selection: [],
      currentWhere: null,
      currentRow: null,
      editRow: null,
      priceChangeRow: null,
      remarkVisible: false,
      bdSendVisible: false,
      priceChangeVisible: false,
      editDialogVisible: false,
      picDialogVisible: false,
      commitLoading: false,
      isStse: isStseLikeHp(HOME_HP),
      showActionEdit: showHealthCodeActionEdit(HOME_HP),
      showHerpId: HOME_HP === 'szlh',
      hideSphErp: HOME_HP === 'stzl'
    };
  },
  computed: {
    showCommitApproval() {
      return showVarCommitApproval(this.$store);
    },
    tableColumns() {
      const cols = [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
        { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        {
          label: '操作',
          width: this.showActionEdit ? 150 : 90,
          fixed: 'left',
          slot: 'action',
          align: 'center'
        },
        { slot: 'enable', prop: 'Enable', label: '启用状态', width: 90, align: 'center' },
        { slot: 'remark', label: '备注', minWidth: 100, showOverflowTooltip: true }
      ];

      if (this.isStse) {
        cols.push(
          {
            slot: 'stseHisState',
            prop: 'STSEHIS_STATE',
            label: '同步状态',
            minWidth: 100,
            align: 'center'
          },
          {
            prop: 'VARSPD_STATE',
            label: 'SPD状态',
            minWidth: 100,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARSB_STATE',
            label: '设备科状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARJFB_STATE',
            label: '计费办状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          },
          {
            prop: 'VARYB_STATE',
            label: '医保办状态',
            minWidth: 110,
            align: 'center',
            formatter: (_r, _c, v) => formatDeptState(v)
          }
        );
      }

      cols.push(
        {
          prop: 'Varietie_Code_New',
          label: '品种（材料）编码',
          minWidth: 130,
          sortable: true,
          showOverflowTooltip: true
        },
        {
          slot: 'medicalCode',
          prop: 'MEDICAL_CODE',
          label: '医保编码',
          minWidth: 160,
          sortable: true,
          showOverflowTooltip: true
        },
        {
          prop: 'PROVINCE_PLATFORM_CODE',
          label: '药交ID',
          minWidth: 140,
          showOverflowTooltip: true
        }
      );

      if (this.showHerpId) {
        cols.push({
          prop: 'Herp_ID',
          label: '医商云ID',
          minWidth: 140,
          showOverflowTooltip: true
        });
      }

      cols.push(
        { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'Varietie_Name',
          label: this.isStse ? '品种全称' : '注册证名称',
          minWidth: 200,
          showOverflowTooltip: true
        }
      );

      if (this.isStse || HOME_HP === 'stzx' || HOME_HP === 'csyy') {
        cols.push({
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 180,
          showOverflowTooltip: true
        });
      }

      cols.push(
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'manufacturing_ent_name',
          label: '生产企业名称',
          minWidth: 200,
          showOverflowTooltip: true
        },
        { prop: 'Unit', label: '单位', width: 70, align: 'center' },
        {
          prop: 'Price',
          label: '中标价',
          minWidth: 100,
          align: 'right',
          formatter: (row, _c, v) => {
            if (v == null || v === '') return '';
            const bl = Number(row.price_bl);
            const digits = Number.isFinite(bl) && bl >= 0 ? bl : 2;
            return Number(v).toFixed(digits);
          }
        },
        {
          slot: 'lastPrice',
          prop: 'LAST_CHANGE_PRICE',
          label: '历史中标价格',
          minWidth: 120,
          align: 'right'
        },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 180, showOverflowTooltip: true },
        {
          prop: 'OLD_PROD_REGISTRATION_CODE',
          label: '原注册证',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '启用合同供应商',
          minWidth: 200,
          showOverflowTooltip: true
        },
        { prop: 'CONTRACT_NAME', label: '启用合同', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'CONTRACT_TYPE',
          label: '合同类型',
          minWidth: 90,
          align: 'center',
          formatter: (_r, _c, v) => formatContractType(v)
        },
        {
          prop: 'MIDDLE_PACKAGE_COUNT',
          label: '中包装',
          width: 80,
          align: 'right',
          showOverflowTooltip: true
        },
        {
          prop: 'BIG_BOX_COUNT',
          label: '大包装',
          width: 80,
          align: 'right',
          showOverflowTooltip: true
        },
        {
          prop: 'STOREHOUSE_UPPPER',
          label: '库存上限',
          width: 90,
          align: 'right',
          showOverflowTooltip: true
        },
        {
          prop: 'STOREHOUSE_LOWER',
          label: '库存下限',
          width: 90,
          align: 'right',
          showOverflowTooltip: true
        }
      );

      if (this.showCommitApproval) {
        cols.push({
          slot: 'approval',
          prop: 'APPROVAL_STATE',
          label: '审批状态',
          minWidth: 100,
          align: 'center'
        });
      }

      cols.push(
        {
          prop: 'Province_Platform_Code',
          label: '省平台编码',
          minWidth: 120,
          showOverflowTooltip: true
        },
        { prop: 'YG_CODE', label: '阳光产品码', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SOURCE_FROM', label: '来源', minWidth: 80, showOverflowTooltip: true },
        { prop: 'ONECODE', label: '一级目录', minWidth: 140, showOverflowTooltip: true },
        {
          prop: 'YG_QGLS_PRICE',
          label: '全国历史最低价',
          minWidth: 120,
          align: 'right',
          showOverflowTooltip: true
        }
      );

      if (!this.hideSphErp) {
        cols.push({
          prop: 'Sph_Erp_Varietie_Code',
          label: '上药ERP品种编码',
          minWidth: 140,
          showOverflowTooltip: true
        });
      }

      cols.push(
        {
          prop: 'HIGH_OR_LOW_CLASS_TWO',
          label: '高低值下级属性',
          minWidth: 130,
          align: 'center',
          formatter: (_r, _c, v) => formatHighOrLowTwo(v)
        },
        {
          prop: 'IS_EQUIPMENT_CHANGE',
          label: '设备科是否修改',
          minWidth: 130,
          align: 'center',
          formatter: (_r, _c, v) => formatYesNo(v)
        },
        {
          prop: 'STORAGE_ID',
          label: '主控库区',
          minWidth: 100,
          align: 'center',
          formatter: (_r, _c, v) => formatStorageId(v)
        }
      );

      if (this.isStse) {
        cols.push(
          {
            prop: 'SYZ',
            label: '适应症',
            minWidth: 80,
            align: 'center',
            formatter: (_r, _c, v) => (v === '1' || v === 1 ? '是' : v === '0' || v === 0 ? '否' : '')
          },
          { prop: 'YB_CLASS', label: '医保分类', minWidth: 100, showOverflowTooltip: true }
        );
      }

      cols.push(
        {
          prop: 'IN_TIME',
          label: '最近入库时间',
          minWidth: 155,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => formatDateTime(v)
        },
        {
          prop: 'OUT_TIME',
          label: '最近出库时间',
          minWidth: 155,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => formatDateTime(v)
        }
      );

      return cols;
    }
  },
  methods: {
    formatEnable,
    formatApprovalState,
    formatStseHisState,
    isMedicalCodeMismatch,
    datasource({ page, limit, where, order }) {
      this.currentWhere = where;
      return queryByCode({ page, limit, where, order }).then((res) => ({
        list: res.result || [],
        count: res.total || 0
      }));
    },
    reload(where) {
      this.currentWhere = where;
      this.$refs.table?.reload({ page: 1, where });
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
    openDetail(row) {
      if (!row?.Varietie_Code) {
        this.$message.warning('未选中任何一行');
        return;
      }
      this.editRow = row;
      this.editDialogVisible = true;
    },
    openPic(row) {
      this.editRow = row;
      this.picDialogVisible = true;
    },
    openPriceChange(row) {
      this.priceChangeRow = row;
      this.priceChangeVisible = true;
    },
    openRemark(row) {
      this.currentRow = row;
      this.remarkVisible = true;
    },
    async onSendApproval() {
      if (!this.ensureSelection()) return;
      if (HOME_HP === 'bd') {
        this.bdSendVisible = true;
        return;
      }
      this.commitLoading = true;
      try {
        const res = await approvalVarietieCommit(this.selection);
        this.$alert(res.msg || '操作完成', '提示');
        this.reloadTable();
      } catch (e) {
        this.$message.error(e.message || '发送审批失败');
      } finally {
        this.commitLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.variety-health-code-page {
  padding-bottom: 12px;
}

.spd-panel--actions .spd-panel__head--split {
  gap: 12px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fafbfc;
}

.medical-mismatch {
  color: #f56c6c;
  font-weight: 600;
}
</style>
