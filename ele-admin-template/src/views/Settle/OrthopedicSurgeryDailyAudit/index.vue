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
            <el-option label="待审核" value="0" />
            <el-option label="已审核" value="1" />
            <el-option label="已驳回" value="2" />
            <!-- TODO: 根据实际业务添加更多状态 -->
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
        <el-form-item label="与HIS收费是否一致" >
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
        <el-form-item label="执行科室">
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
        <el-form-item label="住院号">
          <el-input
            v-model="searchForm.HOSPITALIZATION_NUMBER"
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
        <el-form-item label="是否骨科手术">
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
        <el-form-item label="是否消耗">
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
        <el-form-item label="手术日期">
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
        <el-form-item label="是否跟台">
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
            :disabled="!currentMainRow"
            @click="handleApproveConsume"
          >
            手术消耗审批
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
            :disabled="!currentMainRow"
            @click="handleAuditBatchValidity"
          >
            批号效期审核
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
        <el-form-item>
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
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SURGERY_NO"
            title="手术单号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="HOSPITALIZATION_NUMBER"
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
            field="AGE"
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
            field="SURGERY_DATE"
            title="手术日期"
            width="155"
            align="center"
            :formatter="formatDate"
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
            field="IS_HIS_CHARGE_CONSISTENT"
            title="与HIS收费是否一致"
            width="150"
            align="center"
            :formatter="formatIsConsistent"
          />
          <vxe-column
            field="SUBMIT_HIS_STATUS"
            title="提交HIS状态"
            width="120"
            align="center"
            :formatter="formatSubmitHisStatus"
          />
          <vxe-column
            field="IS_ORTHOPEDIC_SURGERY"
            title="是否骨科手术"
            width="120"
            align="center"
            :formatter="formatIsOrthopedic"
          />
          <vxe-column
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
          :page-sizes="[10, 20, 50, 100]"
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
            title="医保物价码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="DEPT_CONFIRM"
            title="科室确认"
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
            field="APPROVAL_NUMBER"
            title="注册证号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="MODIFY_BEFORE_NOTE"
            title="修改前注"
            min-width="150"
            show-overflow
          />
        </vxe-table>
        <!-- 明细表分页 -->
        <vxe-pager
          :current-page="detailTablePage.page"
          :page-size="detailTablePage.size"
          :total="detailTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
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
          <el-form-item label="批号">
            <el-input
              v-model="actionDialogForm.batchNo"
              placeholder="示例：从明细行带出批号"
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
          <el-form-item label="备注">
            <el-input
              v-model="actionDialogForm.remark"
              type="textarea"
              :rows="2"
              placeholder="此弹窗仅用于交互演示"
              maxlength="200"
              show-word-limit
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
  getOrthopedicSurgeryHzInfo,
  getOrthopedicSurgeryDelInfo
} from '@/api/Settle/OrthopedicSurgeryDailyAudit';

export default {
  name: 'OrthopedicSurgeryDailyAudit',
  data() {
    return {
      // 搜索表单
      searchForm: {
        APPLY_DEPT: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        IS_HIS_CHARGE_CONSISTENT: '',
        ZX_DEPT: '',
        PATIENT_NAME: '',
        HOSPITALIZATION_NUMBER: '',
        SUBMIT_HIS_STATUS: '',
        IS_ORTHOPEDIC_SURGERY: '',
        IS_CONSUME: '',
        SURGERY_DATE_START: '',
        SURGERY_DATE_END: '',
        AUDIT_STATE: '',
        IS_AUDIT_BATCH_VALIDITY: '',
        IS_FOLLOW_STAGE: '',
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
      // 明细表数据
      detailTableData: [],
      detailTableLoading: false,
      detailTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      currentDetailRow: null, // 当前选中的明细行
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
        HOSPITALIZATION_NUMBER: '',
        SUBMIT_HIS_STATUS: '',
        IS_ORTHOPEDIC_SURGERY: '',
        IS_CONSUME: '',
        SURGERY_DATE_START: '',
        SURGERY_DATE_END: '',
        AUDIT_STATE: '',
        IS_AUDIT_BATCH_VALIDITY: '',
        IS_FOLLOW_STAGE: '',
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
        const res = await getOrthopedicSurgeryHzInfo(params);
        if (res.code === 200) {
          this.mainTableData = res.result || [];
          this.mainTablePage.total = res.total || 0;
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
      if (!this.currentMainRow || !this.currentMainRow.ID) {
        this.detailTableData = [];
        this.detailTablePage.total = 0;
        this.currentDetailRow = null;
        return;
      }
      this.detailTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          ID: this.currentMainRow.ID,
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
    // 格式化科室确认
    formatDeptConfirm({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) {
        return '已确认';
      } else if (cellValue === '0' || cellValue === 0) {
        return '未确认';
      }
      return cellValue || '';
    },
    // 格式化手术单状态
    formatSurgeryStatus({ cellValue }) {
      // TODO: 根据实际业务逻辑格式化状态
      return cellValue || '';
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
    // 预留：确认使用
    handleConfirmUse() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$message.info('TODO：确认使用功能待实现');
    },
    // 预留：手术消耗审批
    handleApproveConsume() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
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
    // 预留：审核批号效期
    handleAuditBatchValidity() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.openActionDialog('auditBatchValidity');
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
    // 打开模拟弹窗
    openActionDialog(type) {
      this.actionDialogType = type;
      this.actionDialogVisible = true;
      this.actionDialogForm = {
        decision: 'pass',
        reason: '',
        batchNo: (this.currentDetailRow && this.currentDetailRow.BATCH_NO) || '',
        validity: '',
        remark: ''
      };

      const titles = {
        approveConsume: '手术消耗审批',
        auditBatchValidity: '批号效期审核',
        cancelSurgeryApproval: '取消手术审批',
        editBatchValidity: '修改批号效期'
      };
      this.actionDialogTitle = titles[type] || '操作预览';
    },
    // 模拟提交
    confirmActionDialog() {
      this.$message.success('已模拟提交，未调用后台接口');
      this.actionDialogVisible = false;
    }
  },
  created() {
    this.loadMainTableData();
  }
};
</script>

<style scoped>
</style>
