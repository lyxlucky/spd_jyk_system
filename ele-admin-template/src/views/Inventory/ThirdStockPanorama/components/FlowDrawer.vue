<template>
  <el-drawer
    :visible.sync="visibleSync"
    :title="drawerTitle"
    size="72%"
    append-to-body
    :wrapper-closable="false"
    @open="onOpen"
  >
    <div class="flow-drawer">
      <div class="flow-drawer__context">
        <span>{{ row.DEPT_TWO_NAME || '-' }}</span>
        <i class="el-icon-right" aria-hidden="true" />
        <span>{{ row.VARIETIE_NAME || '-' }}</span>
        <span class="flow-drawer__context-code">{{ row.CHARGE_CODE || '-' }}</span>
      </div>

      <el-form :inline="true" size="mini" class="flow-drawer__search" @submit.native.prevent>
        <el-form-item label="发生日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onDateRangeChange"
          />
        </el-form-item>
        <el-form-item label="出入库">
          <el-select
            v-model="flowDirection"
            clearable
            placeholder="全部"
            style="width: 100px"
            @change="onFlowDirectionChange"
          >
            <el-option label="入库" value="1" />
            <el-option label="出库" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-arrow-down" @click="advancedVisible = !advancedVisible">
            {{ advancedVisible ? '收起筛选' : '展开筛选' }}
          </el-button>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="reload">
            查询
          </el-button>
          <el-button type="success" icon="el-icon-download" :loading="exporting" @click="exportData">
            导出
          </el-button>
        </el-form-item>
      </el-form>

      <el-form
        v-show="advancedVisible"
        :inline="true"
        size="mini"
        class="flow-drawer__advanced-search"
        @submit.native.prevent
      >
        <el-form-item label="来源单号">
          <el-input v-model="flowForm.origingCode" clearable placeholder="来源单号" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="条码/定数包号">
          <el-input v-model="flowForm.barcodeNumber" clearable placeholder="条码/定数包号" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="flowForm.consumer" clearable placeholder="操作人" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="病患号">
          <el-input v-model="flowForm.patientNumber" clearable placeholder="病患号" @keyup.enter.native="reload" />
        </el-form-item>
        <el-form-item label="住院号">
          <el-input v-model="flowForm.hospitalizationNumber" clearable placeholder="住院号" @keyup.enter.native="reload" />
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        size="mini"
        height="calc(100vh - 300px)"
        class="style-table"
      >
        <el-table-column prop="OPEARTION_CHARGING_TIME" label="发生时间" width="164" align="center" show-overflow-tooltip />
        <el-table-column label="方向" width="76" align="center">
          <template slot-scope="{ row: flowRow }">
            <el-tag size="mini" :type="flowTagType(flowRow)">{{ formatFlowDirection(flowRow) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="104" align="center">
          <template slot-scope="{ row: flowRow }">{{ formatFlowType(flowRow.TYPE) }}</template>
        </el-table-column>
        <el-table-column prop="QTY" label="数量" width="88" align="right" />
        <el-table-column prop="ORIGING_CODE" label="来源单号" min-width="130" align="center" show-overflow-tooltip />
        <el-table-column prop="BARCODE_NUMBER" label="条码/定数包号" min-width="142" align="center" show-overflow-tooltip />
        <el-table-column prop="CONSUMER" label="操作人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="PATIENT_NUMBER" label="病患号" width="110" align="center" show-overflow-tooltip />
        <el-table-column prop="HOSPITALIZATION_NUMBER" label="住院号" width="110" align="center" show-overflow-tooltip />
        <el-table-column label="就诊类型" width="94" align="center">
          <template slot-scope="{ row: flowRow }">{{ formatHospitalType(flowRow.HOSPITAL_TYPE) }}</template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="flow-drawer__pager"
        background
        small
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        :page-sizes="pageSizes"
        @size-change="onPageSizeChange"
        @current-change="loadData"
      />
    </div>
  </el-drawer>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { getThirdStockInfoFlow } from '@/api/Inventory/ThreeLevelDbBD';
  import { DATE_SHORTCUTS } from '@/directives/dateShortcuts';
  import {
    buildFlowWhere,
    createDefaultFlowForm,
    formatFlowDirection,
    formatFlowType
  } from '../utils';

  export default {
    name: 'FlowDrawer',
    props: {
      visible: Boolean,
      row: { type: Object, default: () => ({}) }
    },
    data() {
      return {
        loading: false,
        exporting: false,
        page: 1,
        pageSize: 20,
        pageSizes: [20, 50, 100, 9999999],
        total: 0,
        tableData: [],
        flowForm: createDefaultFlowForm(),
        flowDirection: '',
        advancedVisible: false,
        pickerOptions: {
          shortcuts: DATE_SHORTCUTS
        }
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('update:visible', value);
        }
      },
      dateRange: {
        get() {
          return [this.flowForm.startTime, this.flowForm.endTime];
        },
        set(value) {
          this.flowForm = {
            ...this.flowForm,
            startTime: value?.[0] || '',
            endTime: value?.[1] || ''
          };
        }
      },
      drawerTitle() {
        return `${this.row.DEPT_TWO_NAME || '科室'} · ${this.row.VARIETIE_NAME || '品种'} 出入库记录`;
      }
    },
    methods: {
      buildFlowWhere,
      formatFlowDirection,
      formatFlowType,
      onOpen() {
        this.flowForm = createDefaultFlowForm();
        this.flowDirection = '';
        this.page = 1;
        this.loadData(1);
      },
      onDateRangeChange() {
        this.reload();
      },
      onFlowDirectionChange() {
        this.reload();
      },
      reload() {
        this.loadData(1);
      },
      onPageSizeChange(size) {
        this.pageSize = size;
        this.loadData(1);
      },
      flowTagType(flowRow) {
        const direction = formatFlowDirection(flowRow);
        if (direction === '入库') return 'success';
        if (direction === '出库') return 'warning';
        if (direction === '消退') return 'info';
        return '';
      },
      formatHospitalType(value) {
        if (value === 0 || value === '0') return '门诊';
        if (value === 1 || value === '1') return '住院';
        return value || '-';
      },
      async loadData(page = this.page) {
        this.page = page;
        this.loading = true;
        try {
          const res = await getThirdStockInfoFlow({
            page: this.page,
            limit: this.pageSize,
            where: {
              ...this.buildFlowWhere(this.row, this.flowForm),
              flowDirection: this.flowDirection
            }
          });
          this.tableData = res.data || [];
          this.total = res.total || 0;
        } catch (e) {
          this.tableData = [];
          this.total = 0;
          this.$message.error(e || '查询出入库记录失败');
        } finally {
          this.loading = false;
        }
      },
      async exportData() {
        this.exporting = true;
        const loading = this.$messageLoading('正在导出出入库记录...');
        try {
          const res = await getThirdStockInfoFlow({
            page: 1,
            limit: 999999,
            where: {
              ...this.buildFlowWhere(this.row, this.flowForm),
              flowDirection: this.flowDirection
            }
          });
          const rows = [
            ['发生时间', '方向', '业务类型', '数量', '来源单号', '条码/定数包号', '操作人', '病患号', '住院号', '就诊类型']
          ];
          (res.data || []).forEach((flowRow) => {
            rows.push([
              flowRow.OPEARTION_CHARGING_TIME || '',
              this.formatFlowDirection(flowRow),
              this.formatFlowType(flowRow.TYPE),
              flowRow.QTY || '',
              flowRow.ORIGING_CODE || '',
              flowRow.BARCODE_NUMBER || '',
              flowRow.CONSUMER || '',
              flowRow.PATIENT_NUMBER || '',
              flowRow.HOSPITALIZATION_NUMBER || '',
              this.formatHospitalType(flowRow.HOSPITAL_TYPE)
            ]);
          });
          writeFile(
            {
              SheetNames: ['出入库记录'],
              Sheets: { 出入库记录: utils.aoa_to_sheet(rows) }
            },
            '三级库-出入库记录.xlsx'
          );
          this.$message.success('导出成功');
        } catch (e) {
          this.$message.error('导出出入库记录失败，请稍后重试');
        } finally {
          loading.close();
          this.exporting = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .flow-drawer {
    padding: 0 18px 18px;
  }

  .flow-drawer__context {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
  }

  .flow-drawer__context-code {
    margin-left: 8px;
    color: #909399;
    font-size: 12px;
    font-weight: normal;
  }

  .flow-drawer__search {
    margin-top: 8px;
  }

  .flow-drawer__advanced-search {
    margin-top: -10px;
  }

  .flow-drawer__pager {
    margin-top: 10px;
    text-align: right;
  }
</style>
