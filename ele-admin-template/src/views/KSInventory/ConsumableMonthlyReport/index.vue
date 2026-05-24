<template>
  <div class="monthly-report-page">
    <el-card shadow="never" class="report-card">
      <div class="report-header">
        <div>
          <div class="report-title">耗材管理月报</div>
        </div>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-search" :loading="previewLoading" @click="loadPreview">
            查询
          </el-button>
          <el-button type="success" icon="el-icon-download" :loading="loading" @click="exportReport">
            导出 Word
          </el-button>
        </div>
      </div>

      <el-form ref="form" :model="form" :rules="rules" label-width="78px" class="report-form">
        <div class="filter-grid">
          <el-form-item label="统计月份" prop="monthValue">
            <el-date-picker
              v-model="form.monthValue"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月份"
              :clearable="false"
              class="month-picker"
            />
          </el-form-item>

          <el-form-item label="科室名称">
            <el-input
              v-model="form.deptNames"
              clearable
              placeholder="可不填，支持模糊匹配"
            />
          </el-form-item>

          <el-form-item label="科室维度" prop="deptDimension" class="dimension-item">
            <el-radio-group v-model="form.deptDimension">
              <el-radio-button label="DEPT_ONE">一级科室</el-radio-button>
              <el-radio-button label="DEPT_TWO">二级科室</el-radio-button>
              <el-radio-button label="SPD_COST">成本科室</el-radio-button>
              <el-radio-button label="FINANCE">财务科室</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="科室编码" class="codes-item">
            <el-input
              v-model="form.deptCodes"
              type="textarea"
              :rows="2"
              placeholder="可不填。多个编码用逗号、空格或换行分隔"
            />
          </el-form-item>
        </div>
      </el-form>

      <div v-if="report" class="preview-area">
        <div class="section-header">
          <span>核心数据概览</span>
          <small>{{ report.Year }}年{{ report.Month }}月 · {{ report.DeptDimensionName }}</small>
        </div>
        <el-row :gutter="16" class="summary-row">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">总消耗金额</div>
              <div class="summary-value">{{ formatWan(report.Summary.TotalAmount) }} 万元</div>
              <div class="summary-sub">环比 {{ formatPercent(report.Summary.TotalMomPercent) }} / 同比 {{ formatPercent(report.Summary.TotalYoyPercent) }}</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">高值耗材金额</div>
              <div class="summary-value">{{ formatWan(report.Summary.HighValueAmount) }} 万元</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">检验试剂金额</div>
              <div class="summary-value">{{ formatWan(report.Summary.ReagentAmount) }} 万元</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card shadow="never" class="summary-card">
              <div class="summary-label">覆盖范围</div>
              <div class="summary-value">{{ report.Summary.DeptCount }} 科组 / {{ report.Summary.VarietyCount }} 品规</div>
              <div class="summary-sub">入库 {{ report.Summary.InboundBillCount }} 单 / 出库 {{ report.Summary.OutboundBillCount }} 单</div>
            </el-card>
          </el-col>
        </el-row>

        <div class="section-header">
          <span>按科室统计</span>
        </div>
        <el-row :gutter="16" class="table-row">
          <el-col :xs="24" :lg="12">
            <div class="table-panel">
              <div class="table-title">消耗金额排名前五</div>
              <el-table :data="report.DeptAmountTop" border size="mini" stripe>
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column prop="DeptName" label="科室名称" min-width="150" />
              <el-table-column label="消耗金额/万元" width="120">
                <template slot-scope="{ row }">{{ formatWan(row.Amount) }}</template>
              </el-table-column>
              <el-table-column label="占比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.Percent) }}</template>
              </el-table-column>
              <el-table-column label="环比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.MomPercent) }}</template>
              </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :xs="24" :lg="12">
            <div class="table-panel">
              <div class="table-title">增幅排名前五（≥10万）</div>
              <el-table :data="report.DeptGrowthTop" border size="mini" stripe>
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column prop="DeptName" label="科室名称" min-width="150" />
              <el-table-column label="消耗金额/万元" width="120">
                <template slot-scope="{ row }">{{ formatWan(row.Amount) }}</template>
              </el-table-column>
              <el-table-column label="环比" width="100">
                <template slot-scope="{ row }">{{ formatPercent(row.MomPercent) }}</template>
              </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>

        <div class="section-header">
          <span>按品种统计</span>
        </div>
        <el-row :gutter="16" class="table-row">
          <el-col :xs="24" :lg="12">
            <div class="table-panel">
              <div class="table-title">消耗金额排名前十</div>
              <el-table :data="report.VarietyAmountTop" border size="mini" height="360" stripe>
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column prop="VarietyName" label="品种名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="ManufacturingEntName" label="生产企业" min-width="150" show-overflow-tooltip />
              <el-table-column label="金额/万元" width="100">
                <template slot-scope="{ row }">{{ formatWan(row.Amount) }}</template>
              </el-table-column>
              <el-table-column label="环比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.MomPercent) }}</template>
              </el-table-column>
              <el-table-column label="同比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.YoyPercent) }}</template>
              </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :xs="24" :lg="12">
            <div class="table-panel">
              <div class="table-title">增幅排名前十（≥5万）</div>
              <el-table :data="report.VarietyGrowthTop" border size="mini" height="360" stripe>
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column prop="VarietyName" label="品种名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="ManufacturingEntName" label="生产企业" min-width="150" show-overflow-tooltip />
              <el-table-column label="金额/万元" width="100">
                <template slot-scope="{ row }">{{ formatWan(row.Amount) }}</template>
              </el-table-column>
              <el-table-column label="环比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.MomPercent) }}</template>
              </el-table-column>
              <el-table-column label="同比" width="90">
                <template slot-scope="{ row }">{{ formatPercent(row.YoyPercent) }}</template>
              </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>

        <div class="section-header">
          <span>按供应商统计</span>
        </div>
        <div class="table-panel">
          <el-table :data="report.SupplierTop" border size="mini" height="460" stripe>
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="SupplierName" label="供应商名称" min-width="220" show-overflow-tooltip />
            <el-table-column label="配送金额/万元" width="140">
              <template slot-scope="{ row }">{{ formatWan(row.Amount) }}</template>
            </el-table-column>
            <el-table-column prop="MainDeptNames" label="主要供应科室（前三）" min-width="260" show-overflow-tooltip />
          </el-table>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
  import {
    exportConsumableMonthlyReport,
    previewConsumableMonthlyReport
  } from '@/api/KSInventory/ConsumableMonthlyReport';

  export default {
    name: 'ConsumableMonthlyReport',
    data() {
      return {
        loading: false,
        previewLoading: false,
        report: null,
        form: {
          monthValue: this.$moment().subtract(1, 'month').format('YYYY-MM'),
          deptDimension: 'DEPT_TWO',
          deptCodes: '',
          deptNames: ''
        },
        rules: {
          monthValue: [{ required: true, message: '请选择统计月份', trigger: 'change' }],
          deptDimension: [{ required: true, message: '请选择科室维度', trigger: 'change' }]
        }
      };
    },
    mounted() {
      this.loadPreview();
    },
    methods: {
      getParams() {
        const [year, month] = this.form.monthValue.split('-');
        return {
          year,
          month,
          deptDimension: this.form.deptDimension,
          deptCodes: this.form.deptCodes,
          deptNames: this.form.deptNames
        };
      },
      loadPreview() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return;
          this.previewLoading = true;
          try {
            const res = await previewConsumableMonthlyReport(this.getParams());
            this.report = res.result;
          } catch (e) {
            this.$message.error(e.message || '查询失败');
          } finally {
            this.previewLoading = false;
          }
        });
      },
      exportReport() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return;
          this.loading = true;
          const loading = this.$loading({
            lock: true,
            text: '正在生成月报...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.65)'
          });
          try {
            const params = this.getParams();
            const res = await exportConsumableMonthlyReport(params);
            const blob = res.data;
            if (blob.type && blob.type.indexOf('application/json') !== -1) {
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const json = JSON.parse(reader.result);
                  this.$message.error(json.msg || json.message || '导出失败');
                } catch (e) {
                  this.$message.error('导出失败');
                }
              };
              reader.readAsText(blob);
              return;
            }
            this.downloadBlob(blob, `耗材管理月报_${params.year}${params.month}.docx`);
            this.$message.success('导出成功');
          } catch (e) {
            this.$message.error(e.message || '导出失败');
          } finally {
            loading.close();
            this.loading = false;
          }
        });
      },
      downloadBlob(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      formatWan(value) {
        return (Number(value || 0) / 10000).toFixed(2);
      },
      formatPercent(value) {
        if (value === null || value === undefined || value === '') return '';
        return Number(value).toFixed(2) + '%';
      }
    }
  };
</script>

<style scoped>
  .monthly-report-page {
    min-height: calc(100vh - 84px);
    padding: 16px;
    background: #f3f6fa;
  }

  .report-card {
    width: 100%;
    border: 0;
    border-radius: 8px;
  }

  .report-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf0f5;
  }

  .report-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .header-actions {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
  }

  .report-form {
    margin-top: 16px;
    padding: 16px 16px 0;
    border: 1px solid #edf0f5;
    border-radius: 8px;
    background: #fbfcfe;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: 280px minmax(260px, 1fr);
    column-gap: 24px;
    row-gap: 0;
  }

  .dimension-item,
  .codes-item {
    grid-column: 1 / -1;
  }

  .month-picker {
    width: 100%;
  }

  .preview-area {
    margin-top: 18px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 22px 0 12px;
    padding-left: 10px;
    border-left: 4px solid #1688ff;
    color: #1f2d3d;
    font-size: 16px;
    font-weight: 600;
  }

  .section-header small {
    color: #909399;
    font-size: 12px;
    font-weight: 400;
  }

  .summary-row {
    margin-bottom: 6px;
  }

  .summary-card {
    min-height: 108px;
    border-radius: 8px;
    border-color: #edf0f5;
  }

  .summary-label {
    color: #606266;
    font-size: 13px;
    margin-bottom: 10px;
  }

  .summary-value {
    color: #1f2d3d;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
  }

  .summary-sub {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
  }

  .table-row {
    margin-bottom: 4px;
  }

  .table-panel {
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid #edf0f5;
    border-radius: 8px;
    background: #fff;
  }

  .table-title {
    font-weight: 600;
    margin-bottom: 10px;
    color: #303133;
  }

  ::v-deep .el-card__body {
    padding: 18px;
  }

  ::v-deep .el-table th {
    background: #f7f9fc;
    color: #303133;
  }

  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }

  @media (max-width: 900px) {
    .report-header {
      display: block;
    }

    .header-actions {
      margin-top: 12px;
    }

    .filter-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
