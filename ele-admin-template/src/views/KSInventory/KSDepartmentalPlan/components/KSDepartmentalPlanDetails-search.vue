<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="品种筛选">
        <el-select v-model="where.varietyFilter" style="width: 180px" @change="search">
          <el-option label="显示所有申领品种" value="-1" />
          <el-option label="仅显示实际申领为空品种" value="0" />
          <el-option label="仅显示实际申领非空品种" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="平均用量时间段" label-width="120px">
        <el-date-picker
          v-model="where.dateFrom"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker
          v-model="where.dateTo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="品种">
        <el-input
          style="width: 200px"
          v-model="where.SerachName"
          placeholder="品名/编码/型号规格/生产企业搜索"
          clearable
        />
      </el-form-item>
      <el-form-item class="ele-form-actions ks-dept-plan-detail-actions">
        <el-button type="primary" icon="el-icon-search" @click="search" title="按条件查询明细">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset" title="清空筛选条件">重置</el-button>
        <el-tooltip :content="tipEditPlanDetail" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-dropdown :disabled="!canEditPlanDetail">
              <el-button type="primary" icon="el-icon-plus" :disabled="!canEditPlanDetail">
                新增<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="!canEditPlanDetail" :title="tipCustomAdd">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    @click="openIntroduceUserDefinedTemp"
                    :disabled="!canEditPlanDetail"
                  >
                    自定义新增
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item :disabled="!canEditPlanDetail" :title="tipCommonTemp">
                  <el-button
                    type="text"
                    icon="el-icon-document-copy"
                    @click="introduceCommonTemp"
                    :disabled="!canEditPlanDetail"
                  >
                    引用常规模板
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item :disabled="!canEditPlanDetail" :title="tipApplyTemp">
                  <el-button
                    type="text"
                    icon="el-icon-upload"
                    @click="showApplyTemp"
                    :disabled="!canEditPlanDetail"
                  >
                    引入模板
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item :disabled="!canEditPlanDetail" :title="tipHistoryCycle">
                  <el-button
                    type="text"
                    icon="el-icon-time"
                    @click="openHistoryCycleConsume"
                    :disabled="!canEditPlanDetail"
                  >
                    按历史周期申领
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </el-tooltip>
        <el-tooltip :content="tipKeepDraft" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button
              type="primary"
              icon="el-icon-s-check"
              @click="KeeptApplyDate"
              :disabled="!canEditPlanDetail"
            >
              暂存申领单
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip :content="tipSaveAndSubmit" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button
              type="success"
              icon="el-icon-finished"
              @click="addPutInListDeta2"
              :disabled="!canSaveAndSubmit"
            >
              保存并提交
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="$hasPermission('ApplyPlan_审核')"
          :content="tipAudit"
          placement="top"
          :open-delay="300"
        >
          <span class="btn-tip-wrap">
            <el-button
              type="success"
              icon="el-icon-s-order"
              @click="subToExamine"
              :disabled="!IsPutInListDeta"
            >
              审核申领单
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="$hasPermission('ApplyPlan_审核')"
          :content="tipApprove"
          placement="top"
          :open-delay="300"
        >
          <span class="btn-tip-wrap">
            <el-button
              type="primary"
              icon="el-icon-s-cooperation"
              @click="Approval"
              :disabled="!IsToExamine"
            >
              审批申领单
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip :content="tipDeleteDetail" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-popconfirm
              class="ele-action"
              title="确定删除所选明细？"
              @confirm="removeBatch()"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                :disabled="!canEditPlanDetail"
              >
                删除
              </el-button>
            </el-popconfirm>
          </span>
        </el-tooltip>
        <el-tooltip content="查看当前申领单的操作与流转详情" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button type="primary" icon="el-icon-view" @click="ApplyOperateTipShow = true">
              查看订单详情
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip :content="tipMergeOrder" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button
              type="primary"
              icon="el-icon-connection"
              :disabled="!KSDepartmentalPlanDataSearch?.PlanNum"
              @click="mergeOrderVisible = true"
            >
              合并订单
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip content="查看中标/在用/科室目录" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-dropdown>
              <el-button type="primary" icon="el-icon-s-unfold">
                目录<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    type="text"
                    v-permission="'zhongbiaomulu'"
                    @click="BidListShowEdit = true"
                  >
                    中标目录
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    v-permission="'zaiyongmulu'"
                    @click="VarietyDataLzhLookShow = true"
                  >
                    在用目录
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    v-permission="'keshimulu'"
                    @click="DpetOneAuthWithDeptShow = true"
                  >
                    科室目录
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="$hasPermission('shenlinzhiyin')"
          content="下载申领操作指引"
          placement="top"
          :open-delay="300"
        >
          <span class="btn-tip-wrap">
            <el-button type="primary" icon="el-icon-question" @click="DownloadGuide">
              申领指引
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip content="通过 Excel 模板批量导入明细" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button type="primary" icon="el-icon-upload" @click="dialogTableVisible2 = true">
              导入模板
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip v-if="canExportDetail" content="导出当前明细数据" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button type="primary" icon="el-icon-download" @click="exportData">
              导出
            </el-button>
          </span>
        </el-tooltip>
        <el-tooltip :content="tipBindBudget" placement="top" :open-delay="300">
          <span class="btn-tip-wrap">
            <el-button
              type="primary"
              icon="el-icon-s-grid"
              @click="handleBindBudget"
              :disabled="!selection || selection.length === 0"
            >
              绑定费用项
            </el-button>
          </span>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <!-- <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="openIntroduceUserDefinedTemp" :disabled='!IsDisabled'>自定义新增</el-button>
        <el-button type="primary" size="small" @click="showApplyTemp" :disabled='!IsDisabled'>引入其他模板</el-button>
        <el-button type="primary" size="small" @click="KeeptApplyDate" :disabled='!IsDisabled'>暂存申领单</el-button>
        <el-button type="primary" size="small" @click="addPutInListDeta2" :disabled='!IsDisabled'>保存并提交</el-button>
        <el-button type="primary" size="small" @click="subToExamine" :disabled='!IsPutInListDeta'>审核申领单</el-button>
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
          <template v-slot:reference>
            <el-button type="danger" size="small" :underline="false" :disabled='!IsDisabledByDel'>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-row> -->
    <!-- <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="subToExamine" :disabled='!IsPutInListDeta'>审核申领单</el-button>
        <el-button type="primary" size="small" @click="search" :disabled='!IsToExamine'>审批申领单</el-button>
        <el-button type="danger" size="small" @click="removeBatch" :disabled='!IsDisabledByDel'>删除</el-button>
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
          <template v-slot:reference>
            <el-button type="danger" size="small" :underline="false" :disabled='!IsDisabledByDel'>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-row> -->
    <el-dialog
      title="导入模板品种"
      :visible.sync="dialogTableVisible2"
      width="30%"
      @closed="onImportDialogClosed"
    >
      <div style="width: 100%; text-align: center">
        <form ref="importPlanForm" action="" id="DeptPlanImportForm">
          <input
            type="hidden"
            name="PlanNum"
            :value="currentPlanNum"
          />
          <input
            type="hidden"
            name="Token"
            :value="Token"
          />

          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input
              ref="importFileInput"
              size="mini"
              style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              "
              name="FILE"
              type="file"
              accept=".xlsx,.xls"
              required="required"
              autocomplete="off"
            />
          </div>
        </form>
        <el-button type="primary" size="mini" @click="importFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <IntroduceUserDefinedTemp
      :visible.sync="showEdit"
      :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch"
    />
    <IntroduceDefinedTemp :visible.sync="showEdit2" />
    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
    <HistoryCycleConsumeDialog
      :visible.sync="HistoryCycleConsumeShow"
      :plan-data="KSDepartmentalPlanDataSearch"
      @done="historyCycleConsumeDone"
    />
    <el-dialog
      title="授权品种目录"
      :visible.sync="ApplyTempPage"
      width="98%"
      :close-on-click-modal="false"
      append-to-body
      top="1vh"
      class="apply-temp"
    >
      <!-- <AuthVarTable :dialogTableVisible="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" /> -->
      <ApplyTemp
        :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch"
        @ApplyTempPageChange="ApplyTempPageChange"
      />
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>存在申领数量为0的明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="deleteZeroDelAndCommit"
          >剔除并提交</el-button
        >
        <!-- <el-button @click="deleteZeroDelAndCommit2">取 消</el-button> -->
        <el-button size="mini" @click="centerDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 证件到期提醒对话框 -->
    <ExpiredCertificateDialog
      :visible="expiredCertificateDialogVisible"
      :expiredList="expiredCertificateList"
      @confirm="confirmSubmitWithExpiredCertificates"
      @cancel="handleExpiredCertificateCancel"
    />

    <MergeApplyPlanOrderDialog
      :visible.sync="mergeOrderVisible"
      :main-order="KSDepartmentalPlanDataSearch?.PlanNum || ''"
      @done="onMergeDone"
    />

    <!-- 绑定费用项对话框 -->
    <el-dialog
      title="绑定费用项"
      :visible.sync="bindBudgetDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      append-to-body
      top="5vh"
    >
      <ele-pro-table
        ref="budgetTable"
        size="mini"
        border
        stripe
        :toolkit="['columns', 'fullscreen']"
        :header-overflow-hidden="false"
        :columns="budgetColumns"
        :datasource="budgetDatasource"
        :selection.sync="budgetSelection"
        height="400px"
        full-height="calc(100vh - 100px)"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        :highlight-current-row="true"
        cache-key="KSDepartmentalPlanBudgetTable"
        @selection-change="handleBudgetSelectionChange"
      >
      </ele-pro-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="bindBudgetDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmBindBudget">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.apply-temp {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-search.el-form--inline {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

.ele-form-search :deep(.el-form-item) {
  flex-shrink: 0;
}

/* 操作按钮占满可用宽度，超出换多行 */
.ele-form-actions.el-form-item {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-right: 0 !important;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: 100% !important;
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center;
  gap: 6px;
  width: 100% !important;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

/* 包裹禁用按钮，使 el-tooltip 仍可悬停提示 */
.btn-tip-wrap {
  display: inline-flex;
  flex-shrink: 0;
  vertical-align: middle;
}

.btn-tip-wrap :deep(.el-button.is-disabled),
.btn-tip-wrap :deep(.el-dropdown.is-disabled) {
  pointer-events: none;
}
</style>

<script>
  import { HOME_HP } from '@/config/setting';
  import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
  import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
  import {
    DeletePlanDeta,
    PutInListDeta,
    ToExamine,
    KeeptListDeta,
    isHaveZeroDel,
    checkHasPendingOrder,
    deleteZeroDel,
    ImportTempExcel,
    ApplyPlanUpdateRemarks,
    serachCommonDeta
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import { hasExportPermission } from '../utils';
  import { getBudgets, bindBudget } from '@/api/pekingApplication';
  import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';
  import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index.vue';
  import ApplyOperateTip from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/index.vue';
  import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index.vue';
  import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index.vue';
  import ApplyTemp from '@/views/KSInventory/ApplyTemp/index.vue';
  import IntroduceDefinedTemp from './aaaaccc.vue';
  import ExpiredCertificateDialog from './ExpiredCertificateDialog.vue';
  import HistoryCycleConsumeDialog from './HistoryCycleConsumeDialog.vue';
  import MergeApplyPlanOrderDialog from './MergeApplyPlanOrderDialog.vue';
  import { TOKEN_STORE_NAME } from '@/config/setting';

  const defaultWhere = () => ({
    PlanNum: '',
    is_second_app: '',
    SerachName: '',
    dateFrom: '',
    dateTo: '',
    varietyFilter: '-1'
  });

  export default {
    props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
    components: {
      IntroduceUserDefinedTemp,
      IntroduceDefinedTemp,
      ApplyTemp,
      BidVarInfoDept,
      ApplyOperateTip,
      VarietyDataLzhLook,
      DpetOneAuthWithDept,
      ExpiredCertificateDialog,
      HistoryCycleConsumeDialog,
      MergeApplyPlanOrderDialog
    },
    data() {
      return {
        // 表单数据
        where: defaultWhere(),
        showEdit: false,
        showEdit2: false,
        ApplyTempPage: false,
        centerDialogVisible: false,
        BidListShowEdit: false,
        ApplyOperateTipShow: false,
        VarietyDataLzhLookShow: false,
        DpetOneAuthWithDeptShow: false,
        HistoryCycleConsumeShow: false,
        HidesubToExamine: false,
        visibleLine: 'none',
        PlanNum: '',
        dialogTableVisible2: false,
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        expiredCertificateDialogVisible: false,
        expiredCertificateList: [],
        bindBudgetDialogVisible: false,
        mergeOrderVisible: false,
        budgetItemList: [],
        budgetSelection: [],
        budgetColumns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            label: '序号',
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'ITEM_ID',
            label: '费用项编码',
            align: 'center',
            showOverflowTooltip: true,
            width: 180
          },
          {
            prop: 'ITEM_COMMENT',
            label: '费用项名称',
            align: 'center',
            showOverflowTooltip: true
          }
        ]
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },

      /* 当前选中申领单状态（无单号则视为未选中） */
      planState() {
        const row = this.KSDepartmentalPlanDataSearch;
        if (!row || row.PlanNum == null || row.PlanNum === '') {
          return null;
        }
        return String(row.State);
      },
      /**
       * 对齐老系统 ApplyPlan：新增(0)、已提交(1) 时可操作
       * 自定义新增 / 引用常规模板 / 引入模板 / 按历史周期 / 暂存 / 删除
       */
      canEditPlanDetail() {
        return this.planState === '0' || this.planState === '1';
      },
      /** 对齐老系统：保存并提交仅「新增」可点，「已提交」禁用 */
      canSaveAndSubmit() {
        return this.planState === '0';
      },
      /* 兼容旧命名 */
      IsDisabled() {
        return this.canEditPlanDetail;
      },
      IsDisabledIsNot() {
        return false;
      },
      IsDisabledByDel() {
        return this.canEditPlanDetail;
      },
      /** 审核申领单：仅已提交 */
      IsPutInListDeta() {
        return this.planState === '1';
      },
      /** 审批申领单：仅已审核(5)；已审批(6)在老系统属其他状态，按钮禁用 */
      IsToExamine() {
        return this.planState === '5';
      },
      /** 状态中文名，用于禁用提示 */
      planStateLabel() {
        if (this.planState == null) {
          return '未选择申领单';
        }
        const map = {
          '0': '新增',
          '1': '已提交',
          '2': '配送中',
          '4': '已收全',
          '5': '已审核',
          '6': '已审批',
          '10': '强制结束',
          '-6': '未审批'
        };
        return map[this.planState] || `状态 ${this.planState}`;
      },
      tipEditUnavailable() {
        if (this.planState == null) {
          return '请先在上方列表选择一条申领单';
        }
        return `仅「新增」或「已提交」时可操作`;
      },
      tipEditPlanDetail() {
        if (!this.canEditPlanDetail) {
          return this.tipEditUnavailable;
        }
        return '可自定义新增、引用模板或按历史周期添加明细（新增/已提交）';
      },
      tipCustomAdd() {
        return this.canEditPlanDetail
          ? '手动选择品种添加到当前申领单'
          : this.tipEditUnavailable;
      },
      tipCommonTemp() {
        return this.canEditPlanDetail
          ? '按本科室常规模板批量引入明细'
          : this.tipEditUnavailable;
      },
      tipApplyTemp() {
        return this.canEditPlanDetail
          ? '从其他申领模板引入明细'
          : this.tipEditUnavailable;
      },
      tipHistoryCycle() {
        return this.canEditPlanDetail
          ? '按历史消耗周期生成申领明细'
          : this.tipEditUnavailable;
      },
      tipKeepDraft() {
        if (!this.canEditPlanDetail) {
          return this.tipEditUnavailable;
        }
        return '暂存当前明细数量与内容（不提交）';
      },
      tipSaveAndSubmit() {
        if (this.planState == null) {
          return '请先在上方列表选择一条申领单';
        }
        if (this.canSaveAndSubmit) {
          return '保存明细并将申领单提交审核';
        }
        if (this.planState === '1') {
          return '当前已提交，无法再次提交；可暂存修改后等待审核';
        }
        return `仅「新增」时可保存并提交`;
      },
      tipAudit() {
        if (this.planState == null) {
          return '请先在上方列表选择一条申领单';
        }
        if (this.IsPutInListDeta) {
          return '审核已提交的申领单';
        }
        return `仅「已提交」时可审核`;
      },
      tipApprove() {
        if (this.planState == null) {
          return '请先在上方列表选择一条申领单';
        }
        if (this.IsToExamine) {
          return '对已审核的申领单进行审批';
        }
        return `仅「已审核」时可审批`;
      },
      tipDeleteDetail() {
        if (!this.canEditPlanDetail) {
          return this.tipEditUnavailable;
        }
        return '删除勾选的申领明细（新增/已提交）';
      },
      tipMergeOrder() {
        if (!this.KSDepartmentalPlanDataSearch?.PlanNum) {
          return '请先在上方列表选择一条申领单';
        }
        return '将其他已提交订单合并到当前申领单';
      },
      tipBindBudget() {
        if (!this.selection || this.selection.length === 0) {
          return '请先勾选需要绑定费用项的明细行';
        }
        return '为勾选明细绑定预算费用项';
      },
      ENV() {
        return process.env.NODE_ENV;
      },
      HOME_HP() {
        return HOME_HP;
      },
      canExportDetail() {
        return hasExportPermission('export-ApplyPlan-slddc');
      },
      currentPlanNum() {
        return (
          this.PlanNum ||
          this.KSDepartmentalPlanDataSearch?.PlanNum ||
          ''
        ).toString();
      }
    },
    watch: {
      showEdit() {
        if (this.showEdit == false) {
          this.$emit('showEditReoad', false);
        }
      },
      KSDepartmentalPlanDataSearch: {
        immediate: true,
        handler(val) {
          this.PlanNum = val && val.PlanNum ? val.PlanNum : '';
        }
      }
    },
    methods: {
      Approval() {
        this.$emit('Approval', this.where);
      },
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = defaultWhere();
        this.search();
      },
      /* 批量删除 */
      removeBatch() {
        const loading = this.$messageLoading('删除中..');
        var ID = '';
        this.selection.forEach((item) => {
          ID += item.ID + ',';
        });
        ID.substring(0, ID.length - 1);
        var data = {
          ID
        };
        DeletePlanDeta(data)
          .then((res) => {
            loading.close();
            this.search();
            var where = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            this.$emit('search', where);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      /* 打开自定义新增页面 */
      openIntroduceUserDefinedTemp() {
        this.showEdit = true;
      },
      showApplyTemp() {
        // console.log(this.KSDepartmentalPlanDataSearch);
        this.ApplyTempPage = true;
      },
      introduceCommonTemp() {
        if (!this.KSDepartmentalPlanDataSearch?.PlanNum) {
          this.$message.warning('请先选择申领单');
          return;
        }
        const loading = this.$messageLoading('引用中...');
        serachCommonDeta(this.KSDepartmentalPlanDataSearch.PlanNum)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg || '引用成功');
            this.$emit('search', { PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum });
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || '引用失败');
          });
      },
      onMergeDone() {
        this.$emit('ClickReload', true);
        this.$emit('search', { PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum });
      },
      openHistoryCycleConsume() {
        if (
          !this.KSDepartmentalPlanDataSearch ||
          !this.KSDepartmentalPlanDataSearch.PlanNum
        ) {
          this.$message.warning('请先选择申领单');
          return;
        }
        this.HistoryCycleConsumeShow = true;
      },
      historyCycleConsumeDone() {
        var where = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        this.$emit('search', where);
      },
      /* 打开其他模板页面 */
      openIntroduceOtherTemp() {
        this.showEdit2 = true;
      },
      /* 保存并提交  */
      addPutInListDeta() {
        // console.log(this.datasourceList)
        if (
          this.KSDepartmentalPlanDataSearch.PlanNum == null ||
          this.KSDepartmentalPlanDataSearch.PlanNum == undefined ||
          this.KSDepartmentalPlanDataSearch.PlanNum.length == 0
        ) {
          this.$message.warning('请选择需提交的申领单');
          return;
        }
        if (this.datasourceList.length == 0) {
          this.$message.warning('请添加品种');
          return;
        }
        var loading = this.$messageLoading('保存中..');
        var data = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        PutInListDeta(data)
          .then((res) => {
            loading.close();
            this.$message.success('提交成功');
            reloadPageTab();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },

      addPutInListDeta2() {
        // 检查是否为bdrm环境
        if (HOME_HP == 'bdrm') {
          // 检查是否为科研订单，如果是则验证费用项目绑定
          if (this.isResearchOrder()) {
            if (!this.hasBudgetBinding()) {
              this.$message.warning(
                '科研订单必须绑定费用项目才能提交，请先绑定费用项目'
              );
              return;
            }
          }
          // 检查证件到期情况
          console.log(HOME_HP);
          const expiredItems = this.checkExpiredCertificates();
          console.log(expiredItems);
          if (expiredItems.length > 0) {
            this.expiredCertificateList = expiredItems;
            this.expiredCertificateDialogVisible = true;
            return;
          }
        }

        // 执行原有的提交逻辑
        this.executeSubmitLogic();
      },

      // 判断是否为科研订单
      isResearchOrder() {
        // 检查申领单数据中是否有科研项目ID
        return (
          this.KSDepartmentalPlanDataSearch &&
          this.KSDepartmentalPlanDataSearch.SCIENTIFIC_ID
        );
      },

      // 检查是否已绑定费用项目
      hasBudgetBinding() {
        // 检查表格数据源中的所有品种是否都已绑定费用项目
        if (!this.datasourceList || this.datasourceList.length === 0) {
          return false;
        }

        // 检查每个品种是否都有费用项目绑定
        return this.datasourceList.every((item) => {
          // 检查品种是否有费用项目名称字段
          return item.ITEM_NAME && item.ITEM_NAME.trim() !== '';
        });
      },

      // 检查证件到期的方法
      checkExpiredCertificates() {
        const expiredItems = [];
        const currentDate = new Date();

        this.datasourceList.forEach((element) => {
          const expiredTypes = [];

          // 检查注册证到期R
          if (element.REGISTRATION_VALID_DATE) {
            const expiry = new Date(element.REGISTRATION_VALID_DATE);
            console.log(expiry);
            if (expiry <= currentDate) {
              expiredTypes.push('注册证');
            }
          }

          // 检查生产许可证到期
          if (element.MAN_XKZ_END) {
            const expiry = new Date(element.MAN_XKZ_END);
            if (expiry <= currentDate) {
              expiredTypes.push('生产许可证');
            }
          }

          // 检查品种授权到期
          if (element.AUTH_VALID) {
            const expiry = new Date(element.AUTH_VALID);
            if (expiry <= currentDate) {
              expiredTypes.push('品种授权');
            }
          }

          // 检查供应商经营许可证到期
          if (element.BUSINESS_LICENSE_VALID_DATE2) {
            const expiry = new Date(element.BUSINESS_LICENSE_VALID_DATE2);
            if (expiry <= currentDate) {
              expiredTypes.push('供应商经营许可证');
            }
          }

          // 检查集配商经营许可证到期
          if (element.BUSINESS_LICENSE_VALID_DATE) {
            const expiry = new Date(element.BUSINESS_LICENSE_VALID_DATE);
            if (expiry <= currentDate) {
              expiredTypes.push('集配商经营许可证');
            }
          }

          // 如果有到期的证件，添加到列表中
          if (expiredTypes.length > 0) {
            expiredItems.push({
              VarName: element.VarName,
              VarID: element.VarCode,
              GG: element.GG,
              Manufacturing: element.Manufacturing,
              expiredType: expiredTypes.join('、'),
              expiredDate: this.getEarliestExpiredDate(element),
              RegistrationCertificateExpiry: element.REGISTRATION_VALID_DATE,
              ProductionLicenseExpiry: element.MAN_XKZ_END,
              VarietyAuthorizationExpiry: element.AUTH_VALID,
              SupplierBusinessLicenseExpiry:
                element.BUSINESS_LICENSE_VALID_DATE2,
              DistributorBusinessLicenseExpiry:
                element.BUSINESS_LICENSE_VALID_DATE
            });
          }
        });

        return expiredItems;
      },

      // 获取最早的到期日期
      getEarliestExpiredDate(element) {
        const dates = [];
        if (element.REGISTRATION_VALID_DATE)
          dates.push(new Date(element.REGISTRATION_VALID_DATE));
        if (element.MAN_XKZ_END) dates.push(new Date(element.MAN_XKZ_END));
        if (element.AUTH_VALID) dates.push(new Date(element.AUTH_VALID));
        if (element.BUSINESS_LICENSE_VALID_DATE2)
          dates.push(new Date(element.BUSINESS_LICENSE_VALID_DATE2));
        if (element.BUSINESS_LICENSE_VALID_DATE)
          dates.push(new Date(element.BUSINESS_LICENSE_VALID_DATE));

        if (dates.length === 0) return '';

        const earliestDate = new Date(Math.min(...dates));
        return earliestDate.toISOString().split('T')[0];
      },

      // 执行提交逻辑
      executeSubmitLogic() {
        const loading = this.$messageLoading('提交中..');
        var list = [];
        this.datasourceList.forEach((element) => {
          var data = {
            ID: element.ID,
            ENABLE: element.ENABLE,
            PLAN_NUMBER: element.PlanNum,
            VARIETIE_CODE: element.VarID,
            VARIETIE_NAME: element.VarName,
            SPECIFICATION_OR_TYPE: element.GG,
            UNIT: element.Unit,
            MANUFACTURING_ENT_NAME: element.Manufacturing,
            APPLY_QTY: element.PlanQty,
            SELECTED_SKU_ID: element.SELECTED_SKU_ID
          };
          list.push(data);
        });
        KeeptListDeta(list)
          .then((res) => {
            loading.close();
            if (res.code == '200') {
              var data = {
                PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
              };
              const loading = this.$messageLoading('提交中..');
              isHaveZeroDel(data)
                .then((res) => {
                  loading.close();
                  if (res.code == '200') {
                    this.centerDialogVisible = true;
                  } else {
                    // code 400: 无零数量明细，直接进补货单检查
                    this.checkPendingOrderAndSubmit();
                  }
                })
                .finally(() => {
                  loading.close();
                });

              var where = {
                PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
              };
              this.$emit('search', where);
            }
          })
          .catch((err) => {
            loading.close();
            const errMsg = err.message || String(err);
            if (errMsg.includes('低值医材') && errMsg.includes('联系方式')) {
              this.promptForLowValueRemark();
            } else {
              this.$message.error(errMsg);
            }
          });
      },

      // 低值医材提醒填写联系方式
      promptForLowValueRemark() {
        this.$prompt('该申领单明细全部为低值医材，请填写联系方式（电话/手机号）', '提示', {
          confirmButtonText: '保存并继续提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入联系方式',
          inputValidator: (value) => {
            if (!value || !value.trim()) {
              return '联系方式不能为空';
            }
            return true;
          }
        })
          .then(({ value }) => {
            const loading = this.$messageLoading('保存备注中..');
            ApplyPlanUpdateRemarks({
              ApplyPlanNum: this.KSDepartmentalPlanDataSearch.PlanNum,
              Remarks: value.trim()
            })
              .then(() => {
                loading.close();
                this.$emit('ClickReload', true);
                this.executeSubmitLogic();
              })
              .catch((remarkErr) => {
                loading.close();
                this.$message.error(remarkErr.message || '备注保存失败');
              });
          })
          .catch(() => {
            this.$message.info('已取消提交，请在备注中填写联系方式后再提交');
          });
      },

      // 确认提交（有到期证件的情况下）
      confirmSubmitWithExpiredCertificates() {
        this.expiredCertificateDialogVisible = false;
        this.executeSubmitLogic();
      },

      // 取消提交（有到期证件的情况下）
      handleExpiredCertificateCancel() {
        this.expiredCertificateDialogVisible = false;
        this.$message.info('已取消提交');
      },

      checkPendingOrderAndSubmit() {
        var data = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        checkHasPendingOrder(data)
          .then((res) => {
            if (res.code == '202') {
              this.$confirm(res.msg, '提示', {
                confirmButtonText: '仍然提交',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.deleteZeroDelAndCommit2();
                })
                .catch(() => {});
            } else {
              this.deleteZeroDelAndCommit2();
            }
          })
          .catch(() => {
            this.deleteZeroDelAndCommit2();
          });
      },

      deleteZeroDelAndCommit() {
        var data = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        deleteZeroDel(data).then((res) => {
          if (res.code == '200') {
            this.centerDialogVisible = false;
            this.checkPendingOrderAndSubmit();
          }
        });
      },

      deleteZeroDelAndCommit2() {
        var data = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        const loading = this.$messageLoading('提交中..');
        PutInListDeta(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.$emit('ClickReload', true);
            //reloadPageTab();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      /* 审批申领单  */
      subToExamine() {
        // console.log(this.$store.state.user);
        var loading = this.$messageLoading('保存中..');
        var data = {
          Operator: this.$store.state.user.info.Nickname,
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        ToExamine(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.$emit('ClickReload', true);
            // reloadPageTab();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      /* 其他模板弹出框状态 */
      ApplyTempPageChange(data) {
        this.ApplyTempPage = data;
        var where = {
          PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
        };
        this.$emit('search', where);
      },
      /* 暂存申领单 */
      KeeptApplyDate() {
        const loading = this.$messageLoading('暂存中..');
        var list = [];
        this.datasourceList.forEach((element) => {
          var data = {
            ID: element.ID,
            ENABLE: element.ENABLE,
            PLAN_NUMBER: element.PlanNum,
            VARIETIE_CODE: element.VarID,
            VARIETIE_NAME: element.VarName,
            SPECIFICATION_OR_TYPE: element.GG,
            UNIT: element.Unit,
            MANUFACTURING_ENT_NAME: element.Manufacturing,
            APPLY_QTY: element.PlanQty
          };
          list.push(data);
        });
        KeeptListDeta(list)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            var where = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            this.$emit('search', where);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      DownloadGuide() {
        var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作手册.pdf`;
        window.open(url.replace('/undefined', ''));
      },
      IsHide() {
        console.log(this.HidesubToExamine);
        if (this.HidesubToExamine == false) {
          this.visibleLine = 'none';
        } else {
          this.visibleLine = '';
        }
      },
      exportData() {
        this.$emit('exportData', this.where);
      },
      handleBindBudget() {
        // 打开绑定费用项对话框
        this.bindBudgetDialogVisible = true;
        // 加载费用项数据（这里使用模拟数据，实际应该从API获取）
        this.loadBudgetItems();
      },
      confirmBindBudget() {
        // 确定绑定费用项
        if (!this.budgetSelection || this.budgetSelection.length === 0) {
          this.$message.warning('请选择一个费用项');
          return;
        }

        // 限制只能选择一个费用项
        if (this.budgetSelection.length > 1) {
          this.$message.warning('只能选择一个费用项');
          return;
        }

        // 获取选中的费用项ID
        const budgetIds = String(
          this.budgetSelection.map((item) => item.ITEM_ID)
        );

        const budgetName = String(
          this.budgetSelection.map((item) => item.ITEM_COMMENT)
        );

        // 构建请求数据
        const data = {
          planNum: this.KSDepartmentalPlanDataSearch.PlanNum,
          planDetailId: this.selection.map((item) => item.ID).join(','),
          budgetDetailId: budgetIds,
          budgetDetailName: budgetName
        };

        // 调用绑定费用项API
        const loading = this.$messageLoading('绑定中...');
        bindBudget(data)
          .then((res) => {
            loading.close();
            this.bindBudgetDialogVisible = false;
            this.$message.success(res.msg || '绑定费用项成功');

            // 刷新表格数据
            var where = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            this.$emit('search', where);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || '绑定费用项失败');
          });
      },
      loadBudgetItems() {
        // 刷新表格数据
        if (this.$refs.budgetTable) {
          this.$refs.budgetTable.reload();
        }
      },
      budgetDatasource({ page, limit, where, order }) {
        // 调用API获取费用项数据
        return getBudgets({ page, limit, where, order })
          .then((res) => {
            // 处理API返回的数据，确保格式符合ele-pro-table的要求
            if (res.code === 200 && res.data) {
              return {
                count: res.total || res.data.length || 0,
                list: res.data
              };
            } else {
              return {
                count: 0,
                list: []
              };
            }
          })
          .catch((err) => {
            this.$message.error(err.message || '获取费用项数据失败');
            return {
              count: 0,
              list: []
            };
          });
      },
      handleBudgetSelectionChange(selection) {
        // 如果选择了多个，只保留最后一个
        if (selection.length > 1) {
          // 获取当前表格的DOM元素
          const table = this.$refs.budgetTable;
          if (table && table.$refs.table) {
            // 清除所有选择
            table.$refs.table.clearSelection();
            // 选择最后一项
            const lastItem = selection[selection.length - 1];
            table.$refs.table.toggleRowSelection(lastItem, true);
          }
          this.$message.warning('只能选择一个费用项');
        }
      },
      onImportDialogClosed() {
        if (this.$refs.importFileInput) {
          this.$refs.importFileInput.value = '';
        }
      },
      importFile() {
        const planNum = (this.currentPlanNum || '').trim();
        if (!planNum) {
          this.$message.warning('请先选择计划单号');
          return;
        }
        this.PlanNum = planNum;
        const fileInput = this.$refs.importFileInput;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          this.$message.warning('请选择要导入的 Excel 文件');
          return;
        }
        const file = fileInput.files[0];
        const fileName = (file.name || '').toLowerCase();
        if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
          this.$message.warning('文件类型错误，请上传 .xls 或 .xlsx');
          return;
        }
        const loading = this.$messageLoading('导入中...');
        const formData = new FormData();
        formData.append('PlanNum', planNum);
        formData.append(
          'Token',
          sessionStorage.getItem(TOKEN_STORE_NAME) || this.Token || ''
        );
        formData.append('FILE', file);
        ImportTempExcel(formData)
          .then((res) => {
            loading.close();
            this.dialogTableVisible2 = false;
            this.$message.success(res.msg || '导入成功');
            this.$emit('search', {
              ...this.where,
              PlanNum: planNum
            });
          })
          .catch((err) => {
            loading.close();
            this.$message.error(
              (err && err.message) || err || '导入失败'
            );
          });
      }
    },
    created() {
      // reloadPageTab();
      var permission_group = this.$store.state.user.info.permission_group;
      for (let i = 0; i < permission_group.length; i++) {
        if (permission_group[i].component == 'ApplyPlan_审核') {
          this.HidesubToExamine = true;
          break;
        }
      }
      this.IsHide();
    }
  };
</script>

