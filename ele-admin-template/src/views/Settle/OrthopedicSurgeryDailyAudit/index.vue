<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="searchForm"
        :inline="true"
        class="ele-form-search"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-form-item label="申请科室">
          <el-select
            v-model="searchForm.APPLY_DEPT"
            placeholder="请选择申请科室"
            clearable
            filterable
            style="width: 200px"
          >
            <!-- TODO: 从API获取科室列表 -->
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手术单状态">
          <el-select
            v-model="searchForm.SURGERY_STATUS"
            placeholder="请选择手术单状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="(label, value) in surgeryStatusDict"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗状态">
          <el-select
            v-model="searchForm.CONSUME_STATUS"
            placeholder="请选择消耗状态"
            clearable
            style="width: 150px"
          >
            <el-option label="未消耗" value="0" />
            <el-option label="已消耗" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="与HIS收费是否一致" v-if="false">
          <el-select
            v-model="searchForm.IS_HIS_CHARGE_CONSISTENT"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行科室" v-if="false">
          <el-select
            v-model="searchForm.ZX_DEPT"
            placeholder="请选择执行科室"
            clearable
            filterable
            style="width: 200px"
          >
            <!-- TODO: 从API获取科室列表 -->
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="病人姓名">
          <el-input
            v-model="searchForm.PATIENT_NAME"
            placeholder="请输入病人姓名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="手术单号">
          <el-input
            v-model="searchForm.SURGERY_NO"
            placeholder="请输入手术单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="住院号">
          <el-input
            v-model="searchForm.IN_HOSP_NO"
            placeholder="请输入住院号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="提交HIS状态" v-if="false">
          <el-select
            v-model="searchForm.SUBMIT_HIS_STATUS"
            placeholder="请选择提交HIS状态"
            clearable
            style="width: 150px"
          >
            <el-option label="未提交" value="0" />
            <el-option label="已提交" value="1" />
            <el-option label="提交失败" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否骨科手术" v-if="false">
          <el-select
            v-model="searchForm.IS_ORTHOPEDIC_SURGERY"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否消耗" v-if="false">
          <el-select
            v-model="searchForm.IS_CONSUME"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划手术日期">
          <el-date-picker
            v-model="surgeryDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            v-model="searchForm.AUDIT_STATE"
            placeholder="请选择审核状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待审核" value="0" />
            <el-option label="已审核" value="1" />
            <el-option label="已驳回" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="批号效期是否审核">
          <el-select
            v-model="searchForm.IS_AUDIT_BATCH_VALIDITY"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否跟台" v-if="false">
          <el-select
            v-model="searchForm.IS_FOLLOW_STAGE"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种收费日期">
          <el-date-picker
            v-model="varietieChargeDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="科室审批日期">
          <el-date-picker
            v-model="deptApprovalDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="ele-btn-icon" icon="el-icon-search" @click="search">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" class="ele-btn-icon" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="ele-btn-icon"
            :disabled="selectedMainRows.length === 0"
            @click="handleApproveConsume"
          >
            手术消耗审批{{ selectedMainRows.length > 0 ? `(${selectedMainRows.length})` : '' }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="info"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handlePrintConsumeOrder"
          >
            打印消耗单
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            class="ele-btn-icon"
            :disabled="selectedMainRows.length === 0"
            @click="handleAuditBatchValidity"
          >
            批号效期审核{{ selectedMainRows.length > 0 ? `(${selectedMainRows.length})` : '' }}
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="success"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleConfirmUse"
          >
            确认使用
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="danger"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleCancelSurgeryApproval"
          >
            取消手术审批
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 主表 -->
      <div>
        <vxe-table
          ref="mainTable"
          :data="mainTableData"
          :loading="mainTableLoading"
          border
          stripe
          size="mini"
          height="400"
          highlight-current-row
          resizable
          @current-change="onMainTableCurrentChange"
          @row-click="onMainTableRowClick"
          @checkbox-change="onMainTableCheckboxChange"
          @checkbox-all="onMainTableCheckboxAll"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SURGERY_NO"
            title="手术单号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="IN_HOSP_NO"
            title="住院号"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="PATIENT_NAME"
            title="病人姓名"
            width="120"
            align="center"
          />
          <vxe-column
            field="AGE_STR"
            title="年龄"
            width="80"
            align="center"
          />
          <vxe-column
            field="DIAGNOSIS"
            title="诊断结果"
            min-width="200"
            show-overflow
          />
          <vxe-column
            field="IS_AUDIT_BATCH_VALIDITY"
            title="是否审核批号效期"
            width="150"
            align="center"
            :formatter="formatIsAudit"
          />
          <vxe-column
            field="BATCH_VALIDITY_AUDITOR"
            title="批号效期审核人"
            width="150"
            align="center"
          />
          <vxe-column
            field="SURGERY_LOCATION"
            title="手术地点"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="PLAN_SURGERY_DATE"
            title="计划手术日期"
            width="155"
            align="center"
            :formatter="formatDate"
          />
          <vxe-column
            field="CHARGE_AMOUNT"
            title="收费金额"
            width="100"
            align="center"
          />
          <vxe-column
            field="FOLLOW_CHARGE_AMOUNT"
            title="跟台收费金额"
            width="100"
            align="center"
          />
          <vxe-column
            field="SURGERY_STATUS"
            title="手术单状态"
            width="120"
            align="center"
            :formatter="formatSurgeryStatus"
          />
          <vxe-column
            field="APPLY_DEPT"
            title="申请科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="CONSUME_STATUS"
            title="消耗状态"
            width="120"
            align="center"
            :formatter="formatConsumeStatus"
          />
          <vxe-column
            v-if="false"
            field="IS_HIS_CHARGE_CONSISTENT"
            title="与HIS收费是否一致"
            width="150"
            align="center"
            :formatter="formatIsConsistent"
          />
          <vxe-column
            v-if="false"
            field="SUBMIT_HIS_STATUS"
            title="提交HIS状态"
            width="120"
            align="center"
            :formatter="formatSubmitHisStatus"
          />
          <vxe-column
            v-if="false"
            field="IS_ORTHOPEDIC_SURGERY"
            title="是否骨科手术"
            width="120"
            align="center"
            :formatter="formatIsOrthopedic"
          />
          <vxe-column
            v-if="false"
            field="IS_CONSUME"
            title="是否消耗"
            width="120"
            align="center"
            :formatter="formatIsConsume"
          />
          <vxe-column
            field="AUDIT_STATE"
            title="审核状态"
            width="120"
            align="center"
            :formatter="formatAuditState"
          />
          <vxe-column
            v-if="false"
            field="IS_FOLLOW_STAGE"
            title="是否跟台"
            width="120"
            align="center"
            :formatter="formatIsFollowStage"
          />
        </vxe-table>
        <!-- 主表分页 -->
        <vxe-pager
          :current-page="mainTablePage.page"
          :page-size="mainTablePage.size"
          :total="mainTablePage.total"
          :page-sizes="[20, 50, 100, 200]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onMainTablePageChange"
        />
      </div>

      <!-- 明细表 -->
      <div>
        <div style="display: flex; align-items: center; margin-bottom: 8px; font-weight: bold; font-size: 14px">
          <div style="margin-right: 10px; font-weight: bold; font-size: 14px">
            >>手术消耗品种
          </div>
          <el-button
            type="warning"
            class="ele-btn-icon"
            size="mini"
            :disabled="!currentDetailRow"
            @click="handleEditBatchValidity"
          >
            修改批号效期
          </el-button>
        </div>
        <vxe-table
          ref="detailTable"
          :data="detailTableData"
          :loading="detailTableLoading"
          border
          stripe
          size="mini"
          height="400"
          highlight-current-row
          resizable
          @current-change="onDetailTableCurrentChange"
          @row-click="onDetailTableRowClick"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="ZX_DEPT"
            title="执行科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="MEDICAL_INSURANCE_PRICE_CODE"
            title="医保编码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="DEPT_CONFIRM"
            title="科室确认状态"
            width="120"
            align="center"
            :formatter="formatDeptConfirm"
          />
          <vxe-column
            field="VARIETIE_CODE_NEW"
            title="品种编码"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="HOSPITAL_VARIETIE_NAME"
            title="医院品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="APPROVAL_NUMBER"
            title="注册证号"
            min-width="180"
            show-overflow
          />
          <vxe-column
            field="BATCH_NO"
            title="批号"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="VALIDITY_DATE"
            title="效期"
            width="120"
            align="center"
            :formatter="formatValidityDate"
          />
          <vxe-column
            field="SUPPLY_PRICE"
            title="收费金额"
            width="120"
            align="center"
          />
          <vxe-column
            field="BARCODE"
            title="标签条码"
            min-width="180"
            show-overflow
          />
          <vxe-column
            field="NUM"
            title="数量"
            width="80"
            align="center"
          />
          <vxe-column
            field="MANUFACTURER"
            title="生产厂家"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="CREATE_TIME"
            title="登记时间"
            width="160"
            align="center"
            :formatter="formatDate"
          />
        </vxe-table>
        <!-- 明细表分页 -->
        <vxe-pager
          :current-page="detailTablePage.page"
          :page-size="detailTablePage.size"
          :total="detailTablePage.total"
          :page-sizes="[20, 50, 100, 200]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onDetailTablePageChange"
        />
      </div>
    </el-card>

    <!-- 模拟审批弹窗 -->
    <el-dialog
      :title="actionDialogTitle"
      :visible.sync="actionDialogVisible"
      width="520px"
      destroy-on-close
    >
      <el-form :model="actionDialogForm" label-width="96px" size="mini" style="margin-top: 12px">
        <template v-if="actionDialogType === 'approveConsume' || actionDialogType === 'auditBatchValidity'">
          <el-form-item label="处理结果">
            <el-radio-group v-model="actionDialogForm.decision">
              <el-radio label="pass">通过</el-radio>
              <el-radio label="reject">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="actionDialogForm.reason"
              type="textarea"
              :rows="3"
              placeholder="备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </template>

        <template v-else-if="actionDialogType === 'cancelSurgeryApproval'">
          <el-form-item label="取消原因">
            <el-input
              v-model="actionDialogForm.reason"
              type="textarea"
              :rows="3"
              placeholder="填写取消原因（模拟弹窗，不会提交）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </template>

        <template v-else-if="actionDialogType === 'editBatchValidity'">
          <el-form-item label="品种编码">
            <el-input :value="currentDetailRow && currentDetailRow.VARIETIE_CODE_NEW" disabled />
          </el-form-item>
          <el-form-item label="品种名称">
            <el-input :value="currentDetailRow && currentDetailRow.VARIETIE_NAME" disabled />
          </el-form-item>
          <el-form-item label="标签条码">
            <el-input :value="currentDetailRow && currentDetailRow.BARCODE" disabled />
          </el-form-item>
          <el-form-item label="批号">
            <el-input
              v-model="actionDialogForm.batchNo"
              placeholder="请输入批号"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="效期">
            <el-date-picker
              v-model="actionDialogForm.validity"
              type="date"
              placeholder="选择效期日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </template>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="actionDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmActionDialog">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSurgeryList,
  getOrthopedicSurgeryDelInfo,
  getAllApplyDepartments,
  updateBatchValidity,
  auditBatchValidity,
  approveConsume
} from '@/api/Settle/OrthopedicSurgeryDailyAudit';

export default {
  name: 'OrthopedicSurgeryDailyAudit',
  data() {
    return {
      // 手术状态字典
      surgeryStatusDict: {
        // '1': '未开始',
        '2': '进行中',
        '3': '已完成',
        // '4': '已暂停',
        '5': '已作废'
      },
      // 搜索表单
      searchForm: {
        APPLY_DEPT: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        IS_HIS_CHARGE_CONSISTENT: '',
        ZX_DEPT: '',
        PATIENT_NAME: '',
        SURGERY_NO: '',
        IN_HOSP_NO: '',
        SUBMIT_HIS_STATUS: '',
        IS_ORTHOPEDIC_SURGERY: '',
        IS_CONSUME: '',
        SURGERY_DATE_START: '',
        SURGERY_DATE_END: '',
        AUDIT_STATE: '',
        IS_AUDIT_BATCH_VALIDITY: '',
        IS_FOLLOW_STAGE: '1',
        VARIETIE_CHARGE_START: '',
        VARIETIE_CHARGE_END: '',
        DEPT_APPROVAL_START: '',
        DEPT_APPROVAL_END: '',
        ID: ''
      },
      // 日期范围
      surgeryDateRange: [],
      varietieChargeDateRange: [],
      deptApprovalDateRange: [],
      // 科室选项
      deptOptions: [],
      // 主表数据
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      currentMainRow: null, // 当前选中的主表行
      selectedMainRows: [], // 选中的主表行（多选）
      // 明细表数据
      detailTableData: [],
      detailTableLoading: false,
      detailTablePage: {
        page: 1,
        size: 100,
        total: 0
      },
      currentDetailRow: null, // 当前选中的明细行
      tempSurgeryNos: [], // 临时保存要审批的手术单号列表
      actionDialogVisible: false,
      actionDialogTitle: '',
      actionDialogType: '',
      actionDialogForm: {
        decision: 'pass',
        reason: '',
        batchNo: '',
        validity: '',
        remark: ''
      }
    };
  },
  methods: {
    // 搜索
    search() {
      // 处理手术日期范围
      if (this.surgeryDateRange && this.surgeryDateRange.length === 2) {
        this.searchForm.SURGERY_DATE_START = this.surgeryDateRange[0];
        this.searchForm.SURGERY_DATE_END = this.surgeryDateRange[1];
      } else {
        this.searchForm.SURGERY_DATE_START = '';
        this.searchForm.SURGERY_DATE_END = '';
      }
      // 处理品种收费日期范围
      if (
        this.varietieChargeDateRange &&
        this.varietieChargeDateRange.length === 2
      ) {
        this.searchForm.VARIETIE_CHARGE_START = this.varietieChargeDateRange[0];
        this.searchForm.VARIETIE_CHARGE_END = this.varietieChargeDateRange[1];
      } else {
        this.searchForm.VARIETIE_CHARGE_START = '';
        this.searchForm.VARIETIE_CHARGE_END = '';
      }
      // 处理科室审批日期范围
      if (
        this.deptApprovalDateRange &&
        this.deptApprovalDateRange.length === 2
      ) {
        this.searchForm.DEPT_APPROVAL_START = this.deptApprovalDateRange[0];
        this.searchForm.DEPT_APPROVAL_END = this.deptApprovalDateRange[1];
      } else {
        this.searchForm.DEPT_APPROVAL_START = '';
        this.searchForm.DEPT_APPROVAL_END = '';
      }
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 重置
    reset() {
      this.searchForm = {
        APPLY_DEPT: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        IS_HIS_CHARGE_CONSISTENT: '',
        ZX_DEPT: '',
        PATIENT_NAME: '',
        SURGERY_NO: '',
        IN_HOSP_NO: '',
        SUBMIT_HIS_STATUS: '',
        IS_ORTHOPEDIC_SURGERY: '',
        IS_CONSUME: '',
        SURGERY_DATE_START: '',
        SURGERY_DATE_END: '',
        AUDIT_STATE: '',
        IS_AUDIT_BATCH_VALIDITY: '',
        IS_FOLLOW_STAGE: '1',
        VARIETIE_CHARGE_START: '',
        VARIETIE_CHARGE_END: '',
        DEPT_APPROVAL_START: '',
        DEPT_APPROVAL_END: '',
        ID: ''
      };
      this.surgeryDateRange = [];
      this.varietieChargeDateRange = [];
      this.deptApprovalDateRange = [];
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 主表分页变化
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    // 明细表分页变化
    onDetailTablePageChange({ currentPage, pageSize }) {
      this.detailTablePage.page = currentPage;
      this.detailTablePage.size = pageSize;
      this.loadDetailTableData();
    },
    // 主表当前行变化
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.currentDetailRow = null;
      this.loadDetailTableData();
    },
    // 主表行点击
    onMainTableRowClick({ row }) {
      if (!row) return;
      // 设置当前行
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.currentDetailRow = null;
      // 设置当前行为选中状态（触发高亮）
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      // 加载明细表数据
      this.loadDetailTableData();
    },
    // 加载主表数据
    async loadMainTableData() {
      this.mainTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          page: this.mainTablePage.page,
          size: this.mainTablePage.size
        };
        const res = await getSurgeryList(params);
        if (res.code === 200) {
          this.mainTableData = res.result || [];
          this.mainTablePage.total = res.total || 0;
          // 清空选中状态
          this.selectedMainRows = [];
          this.$nextTick(() => {
            if (this.$refs.mainTable) {
              this.$refs.mainTable.clearCheckboxRow();
            }
          });
        } else {
          this.$message.error(res.msg || '加载数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
      }
    },
    // 加载明细表数据
    async loadDetailTableData() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.detailTableData = [];
        this.detailTablePage.total = 0;
        this.currentDetailRow = null;
        return;
      }
      this.detailTableLoading = true;
      try {
        const params = {
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          page: this.detailTablePage.page,
          size: this.detailTablePage.size
        };
        const res = await getOrthopedicSurgeryDelInfo(params);
        if (res.code === 200) {
          this.detailTableData = res.result || [];
          this.detailTablePage.total = res.total || 0;
          this.currentDetailRow = null;
        } else {
          this.$message.error(res.msg || '加载明细数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载明细数据失败');
      } finally {
        this.detailTableLoading = false;
      }
    },
    // 格式化日期
    formatDate({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
    // 格式化是否审核批号效期
    formatIsAudit({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化科室确认状态（0未确认使用 1确认使用 2使用异常）
    formatDeptConfirm({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '确认使用';
      } else if (cellValue === '0' || cellValue === 0) {
        return '未确认';
      } else if (cellValue === '2' || cellValue === 2) {
        return '使用异常';
      }
      return cellValue || '';
    },
    // 格式化手术单状态
    formatSurgeryStatus({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      return this.surgeryStatusDict[String(cellValue)] || cellValue;
    },
    // 格式化消耗状态
    formatConsumeStatus({ cellValue }) {
      if (cellValue === '0' || cellValue === 0) {
        return '未消耗';
      } else if (cellValue === '1' || cellValue === 1) {
        return '已消耗';
      }
      return cellValue || '';
    },
    // 格式化与HIS收费是否一致
    formatIsConsistent({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化提交HIS状态
    formatSubmitHisStatus({ cellValue }) {
      if (cellValue === '0' || cellValue === 0) {
        return '未提交';
      } else if (cellValue === '1' || cellValue === 1) {
        return '已提交';
      } else if (cellValue === '2' || cellValue === 2) {
        return '提交失败';
      }
      return cellValue || '';
    },
    // 格式化是否骨科手术
    formatIsOrthopedic({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化是否消耗
    formatIsConsume({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化审核状态
    formatAuditState({ cellValue }) {
      if (cellValue === '0' || cellValue === 0) {
        return '待审核';
      } else if (cellValue === '1' || cellValue === 1) {
        return '已审核';
      } else if (cellValue === '2' || cellValue === 2) {
        return '已驳回';
      }
      return cellValue || '';
    },
    // 格式化是否跟台
    formatIsFollowStage({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化植入类耗材
    formatIsImplant({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '是';
      } else if (cellValue === '0' || cellValue === 0) {
        return '否';
      }
      return cellValue || '';
    },
    // 格式化效期
    formatValidityDate({ cellValue, row }) {
      // 优先使用 VALIDITY_DATE，如果没有值则使用 BATCH_VALIDITY_PERIOD
      const validityDate = row.VALIDITY_DATE || row.BATCH_VALIDITY_PERIOD;
      if (!validityDate) {
        return '';
      }
      return this.$moment(validityDate).format('YYYY-MM-DD');
    },
    // 明细表当前行变化
    onDetailTableCurrentChange({ row }) {
      this.currentDetailRow = row;
    },
    // 明细表行点击
    onDetailTableRowClick({ row }) {
      if (!row) return;
      this.currentDetailRow = row;
      this.$nextTick(() => {
        if (this.$refs.detailTable) {
          this.$refs.detailTable.setCurrentRow(row);
        }
      });
    },
    // 主表 checkbox 变化
    onMainTableCheckboxChange({ row, checked }) {
      if (checked) {
        if (!this.selectedMainRows.find(item => item.ID === row.ID)) {
          this.selectedMainRows.push(row);
        }
      } else {
        const index = this.selectedMainRows.findIndex(item => item.ID === row.ID);
        if (index > -1) {
          this.selectedMainRows.splice(index, 1);
        }
      }
    },
    // 主表全选/取消全选
    onMainTableCheckboxAll({ checked, records }) {
      if (checked) {
        records.forEach(row => {
          if (!this.selectedMainRows.find(item => item.ID === row.ID)) {
            this.selectedMainRows.push(row);
          }
        });
      } else {
        const selectedIds = records.map(row => row.ID);
        this.selectedMainRows = this.selectedMainRows.filter(row => !selectedIds.includes(row.ID));
      }
    },
    // 预留：确认使用
    handleConfirmUse() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$message.info('TODO：确认使用功能待实现');
    },
    // 手术消耗审批（支持批量）
    handleApproveConsume() {
      // 获取要审批的手术单号列表
      let surgeryNos = [];
      if (this.selectedMainRows.length > 0) {
        surgeryNos = this.selectedMainRows.map(row => row.SURGERY_NO).filter(no => no);
      } else if (this.currentMainRow && this.currentMainRow.SURGERY_NO) {
        surgeryNos = [this.currentMainRow.SURGERY_NO];
      }

      if (surgeryNos.length === 0) {
        this.$message.warning('请先选择手术单');
        return;
      }

      // 保存到临时变量，供弹窗使用
      this.tempSurgeryNos = surgeryNos;
      this.openActionDialog('approveConsume');
    },
    // 预留：打印消耗单
    handlePrintConsumeOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$message.info('TODO：打印消耗单功能待实现');
    },
    // 审核批号效期（支持批量，直接审核，不需要弹窗）
    async handleAuditBatchValidity() {
      // 获取要审核的手术单号列表
      let surgeryNos = [];
      if (this.selectedMainRows.length > 0) {
        surgeryNos = this.selectedMainRows.map(row => row.SURGERY_NO).filter(no => no);
      } else if (this.currentMainRow && this.currentMainRow.SURGERY_NO) {
        surgeryNos = [this.currentMainRow.SURGERY_NO];
      }

      if (surgeryNos.length === 0) {
        this.$message.warning('请先选择手术单');
        return;
      }

      try {
        const params = {
          SURGERY_NOS: surgeryNos
        };
        const res = await auditBatchValidity(params);
        this.$message.success(res.msg || `批号效期审核成功（${surgeryNos.length}条）`);
        // 清空选中
        this.selectedMainRows = [];
        if (this.$refs.mainTable) {
          this.$refs.mainTable.clearCheckboxRow();
        }
        // 刷新主表数据
        this.loadMainTableData();
      } catch (error) {
        this.$message.error(error.message || '批号效期审核失败');
      }
    },
    // 预留：修改批号效期（选中）
    handleEditBatchValidity() {
      if (!this.currentDetailRow) {
        this.$message.warning('请先选择明细记录');
        return;
      }
      this.openActionDialog('editBatchValidity');
    },
    // 预留：取消手术审批
    handleCancelSurgeryApproval() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.openActionDialog('cancelSurgeryApproval');
    },
    // 打开弹窗
    openActionDialog(type) {
      this.actionDialogType = type;
      this.actionDialogVisible = true;
      // 效期优先使用 VALIDITY_DATE，如果没有值则使用 BATCH_VALIDITY_PERIOD
      const validityDate = (this.currentDetailRow && (this.currentDetailRow.VALIDITY_DATE || this.currentDetailRow.BATCH_VALIDITY_PERIOD)) || '';
      this.actionDialogForm = {
        decision: 'pass',
        reason: '',
        batchNo: (this.currentDetailRow && this.currentDetailRow.BATCH_NO) || '',
        validity: validityDate ? this.$moment(validityDate).format('YYYY-MM-DD') : '',
        remark: ''
      };

      const titles = {
        approveConsume: this.tempSurgeryNos.length > 1 ? `手术消耗审批（批量 ${this.tempSurgeryNos.length}条）` : '手术消耗审批',
        auditBatchValidity: '批号效期审核',
        cancelSurgeryApproval: '取消手术审批',
        editBatchValidity: '修改批号效期'
      };
      this.actionDialogTitle = titles[type] || '操作预览';
    },
    // 提交操作
    async confirmActionDialog() {
      if (this.actionDialogType === 'editBatchValidity') {
        // 修改批号效期
        if (!this.currentDetailRow || !this.currentDetailRow.ID) {
          this.$message.warning('请先选择要修改的记录');
          return;
        }
        try {
          const params = {
            ID: this.currentDetailRow.ID,
            BATCH_NO: this.actionDialogForm.batchNo,
            VALIDITY_DATE: this.actionDialogForm.validity
          };
          await updateBatchValidity(params);
          this.$message.success('修改批号效期成功');
          this.actionDialogVisible = false;
          // 刷新明细表数据
          this.loadDetailTableData();
        } catch (error) {
          this.$message.error(error.message || '修改批号效期失败');
        }
      } else if (this.actionDialogType === 'approveConsume') {
        // 手术消耗审批
        if (this.tempSurgeryNos.length === 0) {
          this.$message.warning('请先选择手术单');
          return;
        }
        try {
          const params = {
            SURGERY_NOS: this.tempSurgeryNos,
            DECISION: this.actionDialogForm.decision
          };
          const res = await approveConsume(params);
          this.$message.success(res.msg || `手术消耗审批成功（${this.tempSurgeryNos.length}条）`);
          this.actionDialogVisible = false;
          // 清空选中
          this.selectedMainRows = [];
          this.tempSurgeryNos = [];
          if (this.$refs.mainTable) {
            this.$refs.mainTable.clearCheckboxRow();
          }
          // 刷新主表和明细表数据
          this.loadMainTableData();
          this.loadDetailTableData();
        } catch (error) {
          this.$message.error(error.message || '手术消耗审批失败');
        }
      } else {
        // 其他操作暂时模拟
        this.$message.success('已模拟提交，未调用后台接口');
        this.actionDialogVisible = false;
      }
    },
    // 加载科室列表
    async loadDeptOptions() {
      try {
        const res = await getAllApplyDepartments();
        if (res.code === 200 && res.result) {
          this.deptOptions = res.result.map(item => ({
            value: item.APPLY_DEPT_NAME,
            label: item.APPLY_DEPT_NAME
          }));
        }
      } catch (error) {
        console.error('加载科室列表失败', error);
      }
    }
  },
  created() {
    this.loadDeptOptions();
    // this.loadMainTableData();
  }
};
</script>

<style scoped>
</style>
