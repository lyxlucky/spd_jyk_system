<template>
  <el-dialog
    title="按历史周期申领"
    :visible.sync="innerVisible"
    width="92%"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form class="history-cycle-search" inline size="mini">
      <el-form-item label="品名/编码">
        <el-input
          v-model="where.SerachName"
          clearable
          placeholder="品种名称/编码"
          style="width: 180px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="where.Specification_Or_Type"
          clearable
          placeholder="规格型号"
          style="width: 160px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input
          v-model="where.Manufacturing_Ent_Name"
          clearable
          placeholder="生产企业"
          style="width: 180px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item label="计划单号">
        <el-input
          v-model="where.SearchPlanNum"
          clearable
          placeholder="计划单号"
          style="width: 160px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item label="申领数">
        <el-select
          v-model="where.QtyCalcType"
          placeholder="申领数"
          style="width: 120px"
          @change="reload"
        >
          <el-option label="汇总数" value="1" />
          <el-option label="周平均" value="2" />
          <el-option label="日平均" value="3" />
          <el-option label="月平均" value="4" />
        </el-select>
        <el-tooltip
          effect="dark"
          placement="top"
          :content="historyRuleText(where)"
        >
          <i class="el-icon-question history-rule-tip"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="领用时间">
        <el-date-picker
          v-model="where.dateFrom"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
          style="width: 140px"
        />
        <span class="date-separator">至</span>
        <el-date-picker
          v-model="where.dateTo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <ele-pro-table
      ref="table"
      height="55vh"
      :row-key="(row) => row.VarID"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="20"
      :page-sizes="[20, 50, 100, 200]"
      :tool-style="{ display: 'none' }"
      @selection-change="onSelectionChange"
    >
      <template v-slot:APPLY_QTY="{ row }">
        <el-input-number
          v-model="row.APPLY_QTY"
          size="mini"
          :min="0"
          :step="1"
          :precision="0"
          :controls="false"
          style="width: 100%"
        />
      </template>
      <template v-slot:HistoryQty="{ row }">
        <span>{{ formatNumber(row.HistoryQty) }}</span>
      </template>
      <template v-slot:HistoryAmount="{ row }">
        <span>{{ formatMoney(row.HistoryAmount) }}</span>
      </template>
      <template v-slot:Price="{ row }">
        <span>{{ formatMoney(row.Price) }}</span>
      </template>
    </ele-pro-table>

    <div slot="footer" class="dialog-footer">
      <span class="selected-tip">已选择 {{ selection.length }} 个品种</span>
      <el-button size="mini" @click="innerVisible = false">取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="confirmAdd"
      >
        添加到申领单
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    SearchHistoryCycleConsumedVar,
    KeeptListDeta
  } from '@/api/KSInventory/KSDepartmentalPlan';

  export default {
    name: 'HistoryCycleConsumeDialog',
    props: {
      visible: Boolean,
      planData: Object
    },
    data() {
      return {
        innerVisible: false,
        selection: [],
        defaultWhere: {
          SerachName: '',
          Specification_Or_Type: '',
          Manufacturing_Ent_Name: '',
          SearchPlanNum: '',
          QtyCalcType: '1',
          dateFrom: '',
          dateTo: '',
          deptTwoCode: ''
        },
        where: {
          SerachName: '',
          Specification_Or_Type: '',
          Manufacturing_Ent_Name: '',
          SearchPlanNum: '',
          QtyCalcType: '1',
          dateFrom: '',
          dateTo: '',
          deptTwoCode: ''
        },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left',
            reserveSelection: true
          },
          {
            label: '序',
            columnKey: 'index',
            type: 'index',
            width: 50,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'VarCode',
            label: '品种编码',
            width: 140,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VarName',
            label: '品种名称',
            minWidth: 180,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'GG',
            label: '规格型号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Unit',
            label: '单位',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Manufacturing',
            label: '生产企业',
            minWidth: 180,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'HistoryQty',
            slot: 'HistoryQty',
            label: '历史申请数量',
            width: 120,
            align: 'center'
          },
          {
            prop: 'Price',
            slot: 'Price',
            label: '历史均价',
            width: 100,
            align: 'center'
          },
          {
            prop: 'HistoryAmount',
            slot: 'HistoryAmount',
            label: '历史申请金额',
            width: 120,
            align: 'center'
          },
          {
            prop: 'APPLY_QTY',
            slot: 'APPLY_QTY',
            label: '申领数量',
            width: 120,
            align: 'center',
            fixed: 'right'
          }
        ]
      };
    },
    watch: {
      visible(value) {
        this.innerVisible = value;
        if (value) {
          this.initWhere();
          this.$nextTick(() => this.reload());
        }
      },
      innerVisible(value) {
        this.$emit('update:visible', value);
      }
    },
    methods: {
      initWhere() {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.where = {
          ...this.defaultWhere,
          dateFrom: this.formatDate(start),
          dateTo: this.formatDate(end),
          deptTwoCode: this.getDeptTwoCode()
        };
      },
      getDeptTwoCode() {
        if (this.planData && this.planData.PlanDept) {
          return this.planData.PlanDept;
        }
        const deptNow = this.$store.state.user.info.DeptNow || {};
        return deptNow.Dept_Two_Code || '';
      },
      formatDate(date) {
        const y = date.getFullYear();
        const m = `${date.getMonth() + 1}`.padStart(2, '0');
        const d = `${date.getDate()}`.padStart(2, '0');
        return `${y}-${m}-${d}`;
      },
      datasource({ page, limit }) {
        const where = {
          ...this.where,
          deptTwoCode: this.getDeptTwoCode(),
          PlanNum: this.planData && this.planData.PlanNum ? this.planData.PlanNum : ''
        };
        return SearchHistoryCycleConsumedVar({ page, limit, where }).then(
          (res) => {
            return {
              count: res.total,
              list: (res.result || []).map((item) => ({
                ...item,
                APPLY_QTY: Math.trunc(Number(item.APPLY_QTY || item.HistoryQty || 0))
              }))
            };
          }
        );
      },
      reload() {
        if (!this.$refs.table) return;
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      reset() {
        this.initWhere();
        this.reload();
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      confirmAdd() {
        if (!this.planData || !this.planData.PlanNum) {
          this.$message.warning('请先选择申领单');
          return;
        }
        if (!this.selection || this.selection.length === 0) {
          this.$message.warning('请选择需要添加的耗材');
          return;
        }

        const invalid = this.selection.find(
          (item) => !Number.isInteger(Number(item.APPLY_QTY)) || Number(item.APPLY_QTY) <= 0
        );
        if (invalid) {
          this.$message.warning('申领数量必须是大于0的整数');
          return;
        }

        const list = this.selection.map((item) => ({
          PLAN_NUMBER: this.planData.PlanNum,
          VARIETIE_CODE: item.VarID,
          VARIETIE_CODE_NEW: item.VarCode,
          VARIETIE_NAME: item.VarName,
          SPECIFICATION_OR_TYPE: item.GG,
          UNIT: item.Unit,
          MANUFACTURING_ENT_NAME: item.Manufacturing,
          APPLY_QTY: Math.trunc(Number(item.APPLY_QTY))
        }));

        const loading = this.$messageLoading('添加中..');
        KeeptListDeta(list)
          .then((res) => {
            this.$message.success(res.msg || '添加成功');
            this.innerVisible = false;
            this.$emit('done');
          })
          .catch((err) => {
            this.$message.error(err.message || err);
          })
          .finally(() => {
            loading.close();
          });
      },
      handleClosed() {
        this.selection = [];
      },
      formatNumber(value) {
        const num = Number(value || 0);
        return Number.isInteger(num) ? String(num) : num.toFixed(2);
      },
      qtyCalcText(value) {
        const map = {
          1: '汇总数',
          2: '周平均',
          3: '日平均',
          4: '月平均'
        };
        return map[value] || map[String(value)] || '汇总数';
      },
      parseDateValue(value) {
        if (!value) return null;
        const date = new Date(value.replace(/-/g, '/'));
        return isNaN(date.getTime()) ? null : date;
      },
      historyPeriodCountText(query) {
        const start = this.parseDateValue(query.dateFrom);
        const end = this.parseDateValue(query.dateTo);
        if (!start || !end) return '日期范围未完整设置';
        const dayCount = Math.max(
          1,
          Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
        );
        const weekCount = Math.max(1, Math.ceil(dayCount / 7));
        const monthCount = Math.max(
          1,
          (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth())
        );
        return '天数=' + dayCount + '，周数=' + weekCount + '，月数=' + monthCount;
      },
      historyRuleText(query) {
        const calcType = query.QtyCalcType || '1';
        const dateRange =
          (query.dateFrom || '未设置开始日期') + ' 至 ' + (query.dateTo || '未设置结束日期');
        const planNum = query.SearchPlanNum ? '，计划单号包含：' + query.SearchPlanNum : '';
        const ruleMap = {
          1: '最终申领数=历史申领数量汇总后向上取整',
          2: '最终申领数=历史申领数量汇总/周数后向上取整，周数=ceil(日期天数/7)',
          3: '最终申领数=历史申领数量汇总/日期天数后向上取整',
          4: '最终申领数=历史申领数量汇总/月数后向上取整，月数=结束月份-开始月份，最小1个月'
        };
        return (
          '计算方式：' +
          this.qtyCalcText(calcType) +
          '；' +
          (ruleMap[calcType] || ruleMap[String(calcType)] || ruleMap[1]) +
          '；统计范围：' +
          dateRange +
          '；' +
          this.historyPeriodCountText(query) +
          planNum
        );
      },
      formatMoney(value) {
        return Number(value || 0).toFixed(2);
      }
    }
  };
</script>

<style scoped lang="scss">
  .history-cycle-search {
    margin-bottom: 8px;
  }

  .date-separator {
    display: inline-block;
    margin: 0 6px;
    color: #909399;
  }

  .history-rule-tip {
    margin-left: 6px;
    color: #409eff;
    cursor: help;
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .selected-tip {
    margin-right: auto;
    color: #606266;
    font-size: 12px;
  }
</style>
