<template>
  <el-dialog
    title="流向记录"
    :visible.sync="visibleSync"
    width="80%"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
  >
    <el-form :inline="true" size="mini" @submit.native.prevent>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="flowForm.startTime"
          type="date"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="flowForm.endTime"
          type="date"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" :loading="loading" @click="reload">
          查询
        </el-button>
        <el-button type="success" size="mini" :loading="exporting" @click="exportData">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      size="mini"
      height="50vh"
      highlight-current-row
    >
      <el-table-column
        prop="VARIETIE_CODE_NEW"
        label="品种编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="CHARGING_CODE"
        label="计费编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="VARIETIE_NAME"
        label="品种名称"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="UNIT"
        label="单位"
        align="center"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="APPROVAL_NUMBER"
        label="批准文号"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="MANUFACTURING_ENT_NAME"
        label="生产企业"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="PATIENT_NUMBER"
        label="病患号"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="HOSPITALIZATION_NUMBER"
        label="住院号"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column label="就诊类型" align="center" min-width="100">
        <template slot-scope="{ row }">
          {{ formatHospitalType(row.HOSPITAL_TYPE) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="OPEARTION_CHARGING_TIME"
        label="时间"
        align="center"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column label="类型" align="center" min-width="140">
        <template slot-scope="{ row }">
          {{ formatPackType(row) }}
        </template>
      </el-table-column>
      <el-table-column label="定数包号" align="center" min-width="180">
        <template slot-scope="{ row }">
          {{ formatBarcodeNumber(row) }}
        </template>
      </el-table-column>
      <el-table-column label="出入库类型" align="center" min-width="140">
        <template slot-scope="{ row }">
          {{ formatFlowType(row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="QTY"
        label="数量"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
    </el-table>

    <el-pagination
      class="table-pager"
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

    <div class="flow-summary">
      总入库数量：{{ Number(row.KS_QTY || 0) }} | 总计费数量：{{
        Number(row.JF_QTY || 0) + Number(row.JF_DEF_QTY || 0)
      }}
      | 库存数：{{ calcStockQty(row) }}
    </div>
  </el-dialog>
</template>

<script>
  import { getThirdStockInfoFlow } from '@/api/Inventory/ThreeLevelDbBD';
  import { utils, writeFile } from 'xlsx';

  export default {
    name: 'FlowRecordDialog',
    props: {
      visible: Boolean,
      row: { type: Object, default: () => ({}) }
    },
    data() {
      return {
        loading: false,
        exporting: false,
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        total: 0,
        tableData: [],
        flowForm: {
          startTime: '',
          endTime: ''
        }
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(v) {
          this.$emit('update:visible', v);
        }
      }
    },
    methods: {
      calcStockQty(row) {
        if (!row) return 0;
        if (Number(row.KS_QTY) === 0) return row.KS_QTY;
        return (
          Number(row.KS_QTY || 0) +
          Number(row.JF_QTY || 0) +
          Number(row.JF_DEF_QTY || 0)
        );
      },
      formatHospitalType(value) {
        if (value === 0 || value === '0') return '门诊';
        if (value === 1 || value === '1') return '住院';
        return value || '未知';
      },
      formatPackType(row) {
        if (row.TYPE && row.TYPE == '2') return '散货';
        if (row.TYPE && row.TYPE == '3') return '定数包';
        if (row.BARCODE_NUMBER && row.BARCODE_NUMBER == '-') return '散货';
        return '定数包';
      },
      formatBarcodeNumber(row) {
        if (row.TYPE && row.TYPE == '3') return row.ORIGING_CODE || '';
        if (row.BARCODE_NUMBER && row.BARCODE_NUMBER != '-') {
          return row.BARCODE_NUMBER;
        }
        return '';
      },
      formatFlowType(row) {
        if (Number(row.QTY) > 0 && row.HOSPITALIZATION_NUMBER) return '消退';
        if (Number(row.QTY) > 0) return '入库';
        if (Number(row.QTY) < 0) return '出库';
        return '';
      },
      onOpen() {
        this.flowForm = { startTime: '', endTime: '' };
        this.page = 1;
        this.loadData(1);
      },
      reload() {
        this.loadData(1);
      },
      onPageSizeChange(size) {
        this.pageSize = size;
        this.loadData(1);
      },
      getWhere() {
        return {
          varCode: this.row.VARIETIE_CODE_NEW,
          chargingCode: this.row.CHARGE_CODE,
          DeptCode: this.row.DEPT_TWO_CODE,
          startTime: this.flowForm.startTime,
          endTime: this.flowForm.endTime
        };
      },
      async loadData(page = this.page) {
        this.page = page;
        this.loading = true;
        try {
          const res = await getThirdStockInfoFlow({
            page: this.page,
            limit: this.pageSize,
            where: this.getWhere()
          });
          this.tableData = res.data || [];
          this.total = res.total || 0;
        } catch (e) {
          this.tableData = [];
          this.total = 0;
          this.$message.error(e || '查询流向记录失败');
        } finally {
          this.loading = false;
        }
      },
      async exportData() {
        this.exporting = true;
        const loading = this.$messageLoading('正在导出数据...');
        try {
          const response = await getThirdStockInfoFlow({
            page: 1,
            limit: 999999,
            where: this.getWhere()
          });
          const headers = [
            '品种编码',
            '计费编码',
            '品种名称',
            '规格型号',
            '单位',
            '批准文号',
            '生产企业',
            '病患号',
            '住院号',
            '计费时间',
            '类型',
            '定数包号',
            '出入库类型',
            '数量'
          ];
          const dataArray = [headers];
          (response.data || []).forEach((d) => {
            dataArray.push([
              d.VARIETIE_CODE_NEW || '',
              d.CHARGING_CODE || '',
              d.VARIETIE_NAME || '',
              d.SPECIFICATION_OR_TYPE || '',
              d.UNIT || '',
              d.APPROVAL_NUMBER || '',
              d.MANUFACTURING_ENT_NAME || '',
              d.PATIENT_NUMBER || '',
              d.HOSPITALIZATION_NUMBER || '',
              d.OPEARTION_CHARGING_TIME || '',
              this.formatPackType(d),
              this.formatBarcodeNumber(d),
              this.formatFlowType(d),
              d.QTY || ''
            ]);
          });
          writeFile(
            {
              SheetNames: ['Sheet1'],
              Sheets: { Sheet1: utils.aoa_to_sheet(dataArray) }
            },
            '三级库-流向记录.xlsx'
          );
          this.$message.success('导出成功');
        } catch (e) {
          this.$message.error('导出数据失败，请稍后重试');
        } finally {
          loading.close();
          this.exporting = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .table-pager {
    margin-top: 12px;
    text-align: right;
  }

  .flow-summary {
    text-align: right;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
</style>
