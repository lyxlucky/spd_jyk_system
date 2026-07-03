<template>
  <div class="ele-body spd-page registration-warn-page">
    <el-card shadow="never" class="page-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">注册证统计预警</div>
        <div class="spd-panel__body">
          <el-form size="mini" inline @submit.native.prevent>
            <el-form-item label="注册证号">
              <el-input
                v-model="query.approvalNumber"
                clearable
                placeholder="注册证号"
                style="width: 180px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item label="注册证名称">
              <el-input
                v-model="query.prodRegistrationName"
                clearable
                placeholder="注册证名称"
                style="width: 180px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item label="生产企业">
              <el-input
                v-model="query.manufacturingEntName"
                clearable
                placeholder="生产企业"
                style="width: 180px"
                @keyup.enter.native="reload"
              />
            </el-form-item>
            <el-form-item label="消耗时间">
              <el-date-picker
                v-model="query.consumeTime"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="yyyy-MM"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至">
              <el-date-picker
                v-model="query.consumeTime2"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="yyyy-MM"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="增幅比例大于">
              <el-input-number
                v-model="query.bl"
                :min="0"
                :controls="false"
                style="width: 80px"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
              <el-button :loading="exporting" @click="onExport">导出Excel</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :height="tableHeight"
            :columns="columns"
            :datasource="datasource"
            :page-size="30"
            :page-sizes="[10, 30, 60, 90, 150, 300]"
            cache-key="RegistrationWarnTable"
          >
            <template v-slot:goodsQty="{ row }">
              <el-link type="primary" :underline="false" @click="openDetail(row)">
                {{ row.GOODS_QTY }}
              </el-link>
            </template>
            <template v-slot:bl="{ row }">
              {{ formatBl(row.BL) }}
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <DetailDialog :visible.sync="detailVisible" :row="detailRow" :query-where="query" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import DetailDialog from './components/DetailDialog.vue';
import { getRegistrationWarn, getRegistrationWarnAll, currentMonth } from '@/api/Statistics/RegistrationWarn';

function currentMonthValue() {
  return currentMonth();
}

const EXPORT_HEADERS = [
  '注册证号',
  '注册证名称',
  '生产企业',
  '筛选周期用量',
  '筛选周期月平均用量',
  '近一年用量',
  '近一年月平均用量',
  '筛选周期平均用量增幅比例%'
];

export default {
  name: 'RegistrationWarn',
  components: { DetailDialog },
  data() {
    const month = currentMonthValue();
    return {
      tableHeight: 'calc(100vh - 220px)',
      query: {
        approvalNumber: '',
        prodRegistrationName: '',
        manufacturingEntName: '',
        consumeTime: month,
        consumeTime2: month,
        bl: 20
      },
      exporting: false,
      detailVisible: false,
      detailRow: null,
      columns: [
        { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 160, showOverflowTooltip: true },
        { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 180, showOverflowTooltip: true },
        { prop: 'GOODS_QTY', label: '筛选周期用量', minWidth: 120, align: 'center', slot: 'goodsQty' },
        { prop: 'AA_AVG_GOODS_QTY', label: '筛选周期月平均用量', minWidth: 150, align: 'center' },
        { prop: 'SUM_GOODS_QTY', label: '近一年用量', minWidth: 120, align: 'center' },
        { prop: 'AVG_GOODS_QTY', label: '近一年月平均用量', minWidth: 140, align: 'center' },
        { prop: 'BL', label: '筛选周期平均用量增幅比例%', minWidth: 180, align: 'center', slot: 'bl' }
      ]
    };
  },
  methods: {
    formatBl(val) {
      if (val == null || val === '') return '';
      return `${val}%`;
    },
    reload() {
      this.$refs.table?.reload({ page: 1, where: { ...this.query } });
    },
    buildQuery(where) {
      return { ...this.query, ...(where || {}) };
    },
    datasource({ page, limit, where }) {
      const w = this.buildQuery(where);
      return getRegistrationWarn(w, page, limit)
        .then((res) => ({ count: res.total, list: res.list }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    openDetail(row) {
      this.detailRow = row;
      this.detailVisible = true;
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getRegistrationWarnAll(this.query);
        if (!res.list?.length) {
          this.$message.warning('没有数据可以导出');
          return;
        }
        const rows = [EXPORT_HEADERS];
        res.list.forEach((d) => {
          rows.push([
            d.APPROVAL_NUMBER,
            d.PROD_REGISTRATION_NAME,
            d.MANUFACTURING_ENT_NAME,
            d.GOODS_QTY,
            d.AA_AVG_GOODS_QTY,
            d.SUM_GOODS_QTY,
            d.AVG_GOODS_QTY,
            d.BL
          ]);
        });
        writeFile(
          { SheetNames: ['Sheet1'], Sheets: { Sheet1: utils.aoa_to_sheet(rows) } },
          '注册证统计预警.xlsx'
        );
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
.registration-warn-page .page-card :deep(.el-card__body) {
  padding: 12px;
}
.unit-suffix {
  margin-left: 4px;
  color: #666;
}
</style>
