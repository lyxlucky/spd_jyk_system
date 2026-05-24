<template>
  <div class="regular-apply-task">
    <el-card shadow="never" class="task-card">
      <div class="toolbar">
        <el-input
          v-model="where.SEARCH_KEY"
          clearable
          size="small"
          placeholder="任务名称/科室"
          class="toolbar-input"
          @keyup.enter.native="reload"
        />
        <el-select
          v-model="where.DEPT_TWO_CODE"
          clearable
          filterable
          size="small"
          placeholder="科室"
          class="toolbar-select"
        >
          <el-option
            v-for="item in deptOptions"
            :key="item.Dept_Two_Code"
            :label="item.Dept_Two_Name"
            :value="item.Dept_Two_Code"
          />
        </el-select>
        <el-button type="primary" size="small" @click="reload">查询</el-button>
        <el-button type="success" size="small" @click="openEdit()">新增任务</el-button>
        <el-button size="small" @click="scanDue">扫描到期任务</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="rows"
        border
        stripe
        height="calc(100vh - 230px)"
      >
        <el-table-column prop="TASK_NAME" label="任务名称" min-width="150" />
        <el-table-column label="任务类型" width="120">
          <template slot-scope="{ row }">{{ taskTypeText(row.TASK_TYPE) }}</template>
        </el-table-column>
        <el-table-column prop="DEPT_TWO_NAME" label="科室" min-width="150" />
        <el-table-column prop="TEMPLATE_NAME" label="模板/来源" min-width="160">
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.TASK_TYPE === '2'"
              effect="dark"
              placement="top"
              :content="historyRuleText(row)"
            >
              <span class="source-tip">{{ sourceText(row) }}</span>
            </el-tooltip>
            <span v-else>{{ sourceText(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="周期" min-width="150">
          <template slot-scope="{ row }">{{ cycleText(row) }}</template>
        </el-table-column>
        <el-table-column prop="LAST_RUN_TIME" label="上次执行" min-width="150" />
        <el-table-column prop="NEXT_RUN_TIME" label="下次执行" min-width="150" />
        <el-table-column label="最近结果" width="90">
          <template slot-scope="{ row }">
            <el-tag
              v-if="row.LAST_RUN_STATUS"
              :type="row.LAST_RUN_STATUS === '1' ? 'success' : 'danger'"
              size="mini"
            >
              {{ row.LAST_RUN_STATUS === '1' ? '成功' : '失败' }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="LAST_RUN_MSG" label="结果说明" min-width="180" show-overflow-tooltip />
        <el-table-column label="提交/审核" width="100">
          <template slot-scope="{ row }">
            {{ row.AUTO_SUBMIT === '1' ? '提交' : '不提交' }}/{{ row.AUTO_AUDIT === '1' ? '审核' : '不审核' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="{ row }">
            <el-tag :type="row.IS_ENABLE === '1' ? 'success' : 'info'" size="mini">
              {{ row.IS_ENABLE === '1' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="360" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="openEdit(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="preview(row)">耗材</el-button>
            <el-button type="text" size="mini" @click="runOnce(row)">执行一次</el-button>
            <el-button type="text" size="mini" @click="openLogs(row)">日志</el-button>
            <el-button type="text" size="mini" @click="toggleEnable(row)">
              {{ row.IS_ENABLE === '1' ? '停用' : '启用' }}
            </el-button>
            <el-button type="text" size="mini" class="danger-text" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page.sync="page"
        :page-size.sync="limit"
        :page-sizes="[20, 50, 100]"
        class="pager"
        @size-change="reload"
        @current-change="load"
      />
    </el-card>

    <el-dialog
      :title="form.ID ? '编辑定期申领任务' : '新增定期申领任务'"
      :visible.sync="editVisible"
      width="860px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="TASK_NAME">
              <el-input v-model="form.TASK_NAME" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室" prop="DEPT_TWO_CODE">
              <el-select
                v-model="form.DEPT_TWO_CODE"
                filterable
                placeholder="请选择科室"
                class="full-width"
                @change="deptChanged"
              >
                <el-option
                  v-for="item in deptOptions"
                  :key="item.Dept_Two_Code"
                  :label="item.Dept_Two_Name"
                  :value="item.Dept_Two_Code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="TASK_TYPE">
              <el-radio-group v-model="form.TASK_TYPE">
                <el-radio label="1">按申领模板</el-radio>
                <el-radio label="2">按历史周期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库区">
              <el-select v-model="form.REGION_CODE" clearable filterable class="full-width" @change="regionChanged">
                <el-option
                  v-for="item in regionOptions"
                  :key="item.REGION_CODE || item.RegionCode || item.ID"
                  :label="item.REGION_NAME || item.RegionName || item.NAME"
                  :value="item.REGION_CODE || item.RegionCode || item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.TASK_TYPE === '1'" :span="24">
            <el-form-item label="申领模板" prop="TEMPLATE_ID">
              <el-select
                v-model="form.TEMPLATE_ID"
                filterable
                placeholder="请选择模板"
                class="full-width"
                @change="templateChanged"
              >
                <el-option
                  v-for="item in templateOptions"
                  :key="item.ID"
                  :label="item.TempletName"
                  :value="String(item.ID)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="form.TASK_TYPE === '2'" class="history-box">
          <div class="section-title">历史周期查询条件</div>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="品种名称/编码">
                <el-input v-model="historyQuery.SerachName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号">
                <el-input v-model="historyQuery.Specification_Or_Type" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产企业">
                <el-input v-model="historyQuery.Manufacturing_Ent_Name" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划单号">
                <el-input v-model="historyQuery.SearchPlanNum" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申领数计算">
                <el-select v-model="historyQuery.QtyCalcType" class="full-width">
                  <el-option label="汇总数" value="1" />
                  <el-option label="周平均" value="2" />
                  <el-option label="日平均" value="3" />
                  <el-option label="月平均" value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="historyQuery.dateFrom"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期"
                  class="full-width"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="historyQuery.dateTo"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                  class="full-width"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="section-title">执行规则</div>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="执行周期" prop="CYCLE_TYPE">
              <el-select v-model="form.CYCLE_TYPE" class="full-width">
                <el-option label="每N天" value="1" />
                <el-option label="每周" value="2" />
                <el-option label="每月" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.CYCLE_TYPE === '1'" :span="8">
            <el-form-item label="间隔天数" prop="INTERVAL_DAYS">
              <el-input-number v-model="form.INTERVAL_DAYS" :min="1" :max="365" class="full-width" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.CYCLE_TYPE === '2'" :span="8">
            <el-form-item label="周几" prop="WEEK_DAYS">
              <el-select v-model="weekDays" multiple class="full-width">
                <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.CYCLE_TYPE === '3'" :span="8">
            <el-form-item label="每月第几天" prop="MONTH_DAY">
              <el-input-number v-model="form.MONTH_DAY" :min="1" :max="31" class="full-width" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行时间" prop="EXECUTE_TIME">
              <el-time-picker
                v-model="form.EXECUTE_TIME"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
                class="full-width"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="是否启用">
              <el-switch v-model="form.IS_ENABLE" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行后提交">
              <el-switch v-model="form.AUTO_SUBMIT" active-value="1" inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行后审核">
              <el-switch v-model="form.AUTO_AUDIT" active-value="1" inactive-value="0" @change="auditChanged" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.REMARKS" type="textarea" :rows="2" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="editVisible = false">取消</el-button>
        <el-button type="primary" size="small" :loading="saving" @click="save">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="任务耗材预览" :visible.sync="detailVisible" width="900px" append-to-body>
      <el-table :data="detailRows" border stripe height="480">
        <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="130" />
        <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="180" />
        <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="160" />
        <el-table-column prop="UNIT" label="单位" width="70" />
        <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业" min-width="180" />
        <el-table-column prop="APPLY_QTY" label="申领数量" width="100" />
      </el-table>
    </el-dialog>

    <el-dialog :title="logTaskName + ' 执行日志'" :visible.sync="logVisible" width="980px" append-to-body>
      <el-table :data="logRows" border stripe height="360">
        <el-table-column prop="RUN_TIME" label="执行时间" width="150" />
        <el-table-column prop="PLAN_NUMBER" label="申领单号" width="160" />
        <el-table-column label="状态" width="80">
          <template slot-scope="{ row }">
            <el-tag :type="row.RUN_STATUS === '1' ? 'success' : 'danger'" size="mini">
              {{ row.RUN_STATUS === '1' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="DETAIL_COUNT" label="明细数" width="80" />
        <el-table-column prop="RUN_MSG" label="结果说明" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="80">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="openLogDetails(row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        layout="total, prev, pager, next"
        :total="logTotal"
        :current-page.sync="logPage"
        :page-size="logLimit"
        class="pager"
        @current-change="loadLogs"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {
    deleteRegularApplyTask,
    enableRegularApplyTask,
    previewRegularApplyTask,
    runRegularApplyTaskOnce,
    saveRegularApplyTask,
    scanRegularApplyTaskDue,
    searchRegularApplyTask,
    searchRegularApplyTaskLog,
    searchRegularApplyTaskLogDetail
  } from '@/api/KSInventory/RegularApplyTask';
  import { SerachTempletList } from '@/api/KSInventory/ApplyTemp';
  import { getDeptTwoRegion } from '@/api/KSInventory/KSDepartmentalPlan';

  const emptyHistory = {
    SerachName: '',
    Specification_Or_Type: '',
    Manufacturing_Ent_Name: '',
    SearchPlanNum: '',
    QtyCalcType: '1',
    dateFrom: '',
    dateTo: ''
  };

  export default {
    name: 'RegularApplyTask',
    data() {
      return {
        loading: false,
        saving: false,
        rows: [],
        total: 0,
        page: 1,
        limit: 20,
        where: {
          SEARCH_KEY: '',
          DEPT_TWO_CODE: ''
        },
        editVisible: false,
        detailVisible: false,
        logVisible: false,
        form: this.defaultForm(),
        historyQuery: { ...emptyHistory },
        weekDays: [],
        deptOptions: [],
        regionOptions: [],
        templateOptions: [],
        detailRows: [],
        logRows: [],
        logTotal: 0,
        logPage: 1,
        logLimit: 20,
        logTaskId: '',
        logTaskName: '',
        weekOptions: [
          { label: '周一', value: '1' },
          { label: '周二', value: '2' },
          { label: '周三', value: '3' },
          { label: '周四', value: '4' },
          { label: '周五', value: '5' },
          { label: '周六', value: '6' },
          { label: '周日', value: '7' }
        ],
        rules: {
          TASK_NAME: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
          DEPT_TWO_CODE: [{ required: true, message: '请选择科室', trigger: 'change' }],
          TASK_TYPE: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
          TEMPLATE_ID: [{ required: true, message: '请选择申领模板', trigger: 'change' }],
          CYCLE_TYPE: [{ required: true, message: '请选择执行周期', trigger: 'change' }],
          EXECUTE_TIME: [{ required: true, message: '请选择执行时间', trigger: 'change' }]
        }
      };
    },
    created() {
      this.deptOptions = this.$store.state.user.info.userDept || [];
      const deptNow = this.$store.state.user.info.DeptNow || {};
      this.where.DEPT_TWO_CODE = deptNow.Dept_Two_Code || '';
      this.load();
    },
    methods: {
      defaultForm() {
        return {
          ID: 0,
          TASK_NAME: '',
          TASK_TYPE: '1',
          DEPT_TWO_CODE: '',
          DEPT_TWO_NAME: '',
          REGION_CODE: '',
          REGION_NAME: '',
          TEMPLATE_ID: '',
          TEMPLATE_NAME: '',
          HISTORY_QUERY_JSON: '',
          CYCLE_TYPE: '1',
          INTERVAL_DAYS: 1,
          WEEK_DAYS: '',
          MONTH_DAY: 1,
          EXECUTE_TIME: '08:00',
          IS_ENABLE: '1',
          AUTO_SUBMIT: '1',
          AUTO_AUDIT: '0',
          REMARKS: ''
        };
      },
      async load() {
        this.loading = true;
        try {
          const res = await searchRegularApplyTask({
            page: this.page,
            limit: this.limit,
            where: this.where
          });
          this.rows = res.result || [];
          this.total = Number(res.total || 0);
        } catch (e) {
          this.$message.error(e.message || e);
        } finally {
          this.loading = false;
        }
      },
      reload() {
        this.page = 1;
        this.load();
      },
      openEdit(row) {
        this.form = row ? { ...this.defaultForm(), ...row } : this.defaultForm();
        this.weekDays = this.form.WEEK_DAYS ? String(this.form.WEEK_DAYS).split(',') : [];
        this.historyQuery = { ...emptyHistory };
        if (this.form.HISTORY_QUERY_JSON) {
          try {
            this.historyQuery = { ...emptyHistory, ...JSON.parse(this.form.HISTORY_QUERY_JSON) };
          } catch (e) {
            this.historyQuery = { ...emptyHistory };
          }
        }
        if (!this.form.DEPT_TWO_CODE) {
          const deptNow = this.$store.state.user.info.DeptNow || {};
          this.form.DEPT_TWO_CODE = deptNow.Dept_Two_Code || '';
          this.form.DEPT_TWO_NAME = deptNow.Dept_Two_Name || '';
        }
        this.loadRegions();
        this.loadTemplates();
        this.editVisible = true;
      },
      deptChanged(value) {
        const dept = this.deptOptions.find((item) => item.Dept_Two_Code === value);
        this.form.DEPT_TWO_NAME = dept ? dept.Dept_Two_Name : '';
        this.form.TEMPLATE_ID = '';
        this.form.TEMPLATE_NAME = '';
        this.form.REGION_CODE = '';
        this.form.REGION_NAME = '';
        this.loadTemplates();
        this.loadRegions();
      },
      regionChanged(value) {
        const region = this.regionOptions.find((item) => {
          return String(item.REGION_CODE || item.RegionCode || item.ID) === String(value);
        });
        this.form.REGION_CODE = value ? String(parseInt(value, 10) || 0) : '';
        this.form.REGION_NAME = region ? region.REGION_NAME || region.RegionName || region.NAME : '';
      },
      templateChanged(value) {
        const template = this.templateOptions.find((item) => String(item.ID) === String(value));
        this.form.TEMPLATE_NAME = template ? template.TempletName : '';
      },
      async loadTemplates() {
        if (!this.form.DEPT_TWO_CODE) {
          this.templateOptions = [];
          return;
        }
        try {
          const res = await SerachTempletList({
            page: 1,
            limit: 999,
            where: {
              DeptCode: this.form.DEPT_TWO_CODE,
              SerachName: ''
            }
          });
          this.templateOptions = res.result || [];
        } catch (e) {
          this.templateOptions = [];
        }
      },
      async loadRegions() {
        if (!this.form.DEPT_TWO_CODE) {
          this.regionOptions = [];
          return;
        }
        try {
          const res = await getDeptTwoRegion({
            deptTwoCode: this.form.DEPT_TWO_CODE,
            type: 0
          });
          this.regionOptions = res.result || [];
        } catch (e) {
          this.regionOptions = [];
        }
      },
      auditChanged(value) {
        if (value === '1') this.form.AUTO_SUBMIT = '1';
      },
      save() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return;
          if (this.form.TASK_TYPE === '2') {
            if (!this.historyQuery.dateFrom || !this.historyQuery.dateTo) {
              this.$message.warning('历史周期任务必须填写开始日期和结束日期');
              return;
            }
            this.form.HISTORY_QUERY_JSON = JSON.stringify(this.historyQuery);
          }
          if (this.form.CYCLE_TYPE === '2' && this.weekDays.length === 0) {
            this.$message.warning('每周执行必须选择周几');
            return;
          }
          this.form.WEEK_DAYS = this.weekDays.join(',');
          this.saving = true;
          try {
            await saveRegularApplyTask(this.form);
            this.$message.success('保存成功');
            this.editVisible = false;
            this.load();
          } catch (e) {
            this.$message.error(e.message || e);
          } finally {
            this.saving = false;
          }
        });
      },
      async preview(row) {
        try {
          const res = await previewRegularApplyTask(row.ID);
          this.detailRows = res.result || [];
          this.detailVisible = true;
        } catch (e) {
          this.$message.error(e.message || e);
        }
      },
      async withFullLoading(text, callback) {
        const loading = this.$loading({
          lock: true,
          text,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.35)'
        });
        try {
          return await callback();
        } finally {
          loading.close();
        }
      },
      runOnce(row) {
        this.$confirm('确认立即执行该任务？', '提示', { type: 'warning' }).then(async () => {
          try {
            const res = await this.withFullLoading('任务执行中，请稍候...', () =>
              runRegularApplyTaskOnce(row.ID)
            );
            this.$message.success(res.msg || '执行成功');
            this.load();
          } catch (e) {
            this.$message.error(e.message || e);
          }
        });
      },
      async scanDue() {
        try {
          const res = await this.withFullLoading('正在扫描到期任务，请稍候...', () =>
            scanRegularApplyTaskDue()
          );
          this.$message.success('扫描完成，到期任务数：' + (res.total || 0));
          this.load();
        } catch (e) {
          this.$message.error(e.message || e);
        }
      },
      toggleEnable(row) {
        const next = row.IS_ENABLE === '1' ? '0' : '1';
        enableRegularApplyTask(row.ID, next)
          .then(() => {
            this.$message.success(next === '1' ? '启用成功' : '停用成功');
            this.load();
          })
          .catch((e) => this.$message.error(e.message || e));
      },
      remove(row) {
        this.$confirm('确认删除该任务？', '提示', { type: 'warning' }).then(() => {
          deleteRegularApplyTask(row.ID)
            .then(() => {
              this.$message.success('删除成功');
              this.load();
            })
            .catch((e) => this.$message.error(e.message || e));
        });
      },
      openLogs(row) {
        this.logTaskId = row.ID;
        this.logTaskName = row.TASK_NAME;
        this.logPage = 1;
        this.logVisible = true;
        this.loadLogs();
      },
      async loadLogs() {
        try {
          const res = await searchRegularApplyTaskLog({
            TASK_ID: this.logTaskId,
            page: this.logPage,
            limit: this.logLimit
          });
          this.logRows = res.result || [];
          this.logTotal = Number(res.total || 0);
        } catch (e) {
          this.$message.error(e.message || e);
        }
      },
      async openLogDetails(row) {
        try {
          const res = await searchRegularApplyTaskLogDetail(row.ID);
          this.detailRows = res.result || [];
          this.detailVisible = true;
        } catch (e) {
          this.$message.error(e.message || e);
        }
      },
      taskTypeText(value) {
        return value === '1' ? '按申领模板' : '按历史周期';
      },
      sourceText(row) {
        if (row.TASK_TYPE === '1') return row.TEMPLATE_NAME || '';
        return '历史周期查询（' + this.qtyCalcText(this.getHistoryQtyCalcType(row)) + '）';
      },
      getHistoryQuery(row) {
        if (!row || !row.HISTORY_QUERY_JSON) return {};
        try {
          return JSON.parse(row.HISTORY_QUERY_JSON);
        } catch (e) {
          return {};
        }
      },
      getHistoryQtyCalcType(row) {
        const query = this.getHistoryQuery(row);
        return query.QtyCalcType || '1';
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
      historyRuleText(row) {
        const query = this.getHistoryQuery(row);
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
      cycleText(row) {
        if (row.CYCLE_TYPE === '1') return '每' + row.INTERVAL_DAYS + '天 ' + row.EXECUTE_TIME;
        if (row.CYCLE_TYPE === '2') return '每周' + row.WEEK_DAYS + ' ' + row.EXECUTE_TIME;
        if (row.CYCLE_TYPE === '3') return '每月' + row.MONTH_DAY + '号 ' + row.EXECUTE_TIME;
        return '';
      }
    }
  };
</script>

<style scoped>
  .regular-apply-task {
    padding: 12px;
  }
  .task-card {
    min-height: calc(100vh - 90px);
  }
  .toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
  }
  .toolbar-input {
    width: 220px;
  }
  .toolbar-select {
    width: 240px;
  }
  .source-tip {
    cursor: help;
    border-bottom: 1px dashed #909399;
  }
  .full-width {
    width: 100%;
  }
  .section-title {
    margin: 8px 0 12px;
    padding-left: 8px;
    border-left: 3px solid #409eff;
    color: #303133;
    font-weight: 600;
  }
  .history-box {
    margin-bottom: 8px;
    padding: 10px 10px 0;
    background: #f7f9fc;
    border: 1px solid #edf0f5;
    border-radius: 4px;
  }
  .pager {
    margin-top: 12px;
    text-align: right;
  }
  .danger-text {
    color: #f56c6c;
  }
</style>
