<template>
  <el-dialog title="合同列表" :visible.sync="dialogVisible" width="96%" top="3vh" append-to-body @open="onOpen">
    <el-row :gutter="12" class="stat-row">
      <el-col v-for="item in statCards" :key="item.key" :span="6">
        <div class="stat-card" @click="applyStatFilter(item.key)">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </div>
      </el-col>
    </el-row>

    <el-form size="mini" inline class="filter-row" @submit.native.prevent>
      <el-form-item label="供应商状态">
        <el-select v-model="where.ENABLE" style="width: 90px" @change="reload">
          <el-option label="启用" value="1" />
          <el-option label="全部" value="" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同状态">
        <el-select v-model="where.CONTRACT_STATE" style="width: 90px" @change="reload">
          <el-option label="启用" value="1" />
          <el-option label="全部" value="" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否过期">
        <el-select v-model="where.IsOverTime" style="width: 110px" @change="reload">
          <el-option label="全部" value="" />
          <el-option label="过期" value="0" />
          <el-option label="未过期" value="1" />
          <el-option label="近一个月" value="2" />
          <el-option label="近二个月" value="3" />
          <el-option label="近三个月" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否有合同金额">
        <el-select v-model="where.IsHasAmount" style="width: 90px" @change="reload">
          <el-option label="全部" value="" />
          <el-option label="没有" value="0" />
          <el-option label="有" value="1" />
        </el-select>
      </el-form-item>
      <el-input v-model="where.CONTRACT_NAME" clearable placeholder="合同名称/编码" style="width: 180px" />
      <el-form-item label="启用时间">
        <el-input v-model="where.CONTRACT_START_TIMETimeStart" placeholder="yyyy" style="width: 80px" />
      </el-form-item>
      <el-form-item label="到期时间">
        <el-input v-model="where.CONTRACT_END_TIMETimeStart" placeholder="yyyy" style="width: 80px" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      <el-button v-permission="'export-GetContactAllDc'" :loading="exportingAll" @click="onExportAll">导出excel</el-button>
    </el-form>

    <ele-pro-table
      ref="table"
      size="mini"
      height="480px"
      :stripe="true"
      :page-size="30"
      :page-sizes="[30, 50, 100, 200, 99999]"
      :columns="columns"
      :datasource="datasource"
      cache-key="contactAllTable"
    >
      <template v-slot:limitPrice="{ row }">
        <el-button type="text" size="mini" @click="openLimitPrice(row)">{{ row.LIMIT_SUM_PRICE }}</el-button>
      </template>
      <template v-slot:actions="{ row }">
        <el-button type="text" size="mini" @click="onExportVar(row)">导出品种</el-button>
      </template>
    </ele-pro-table>
  </el-dialog>
</template>

<script>
import { exportContactAllVar, getContactAllList, updateContactLimitPrice } from '@/api/Home/Contract';
import { buildContactAllColumns, exportContactAllVarExcel } from '../utils';

export default {
  name: 'AllContractsDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      columns: buildContactAllColumns(),
      where: {
        ENABLE: '1',
        CONTRACT_STATE: '1',
        IsOverTime: '',
        IsHasAmount: '',
        CONTRACT_NAME: '',
        CONTRACT_START_TIMETimeStart: '',
        CONTRACT_END_TIMETimeStart: '',
        CONTRACT_END_TIME: '',
        SENDOES_STATE: ''
      },
      statCards: [
        { key: 1, label: '启用合同数/品规数', value: '—' },
        { key: 2, label: '启用合同过期数/品规数', value: '—' },
        { key: 3, label: '启用合同未过期数/品规数', value: '—' },
        { key: 4, label: '过期合同占比/品规占比', value: '—' }
      ],
      exportingAll: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    onOpen() {
      this.reload();
      this.loadStats();
    },
    reload() {
      this.$refs.table?.reload({ page: 1, where: this.where });
    },
    datasource({ page, limit }) {
      return getContactAllList({ page, limit, where: this.where })
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async loadStats() {
      try {
        const res = await getContactAllList({
          page: 1,
          limit: 999999,
          where: { ...this.where, CONTRACT_NAME: '' }
        });
        const data = res.result || [];
        let enContarCount = 0;
        let varCount1 = 0;
        let enContarCountIsOver = 0;
        let varCount2 = 0;
        let enContarCountIsNotOver = 0;
        let varCount3 = 0;
        const now = Date.now();
        data.forEach((row) => {
          if (row.ENABLE == 1) {
            enContarCount++;
            varCount1 += parseInt(row.VAR_QTY || 0, 10);
          }
          const end = row.CONTRACT_END_TIME ? Date.parse(row.CONTRACT_END_TIME) : 0;
          if (!row.CONTRACT_END_TIME || end < now) {
            enContarCountIsOver++;
            varCount2 += parseInt(row.VAR_QTY || 0, 10);
          }
          if (row.CONTRACT_END_TIME && end > now) {
            enContarCountIsNotOver++;
            varCount3 += parseInt(row.VAR_QTY || 0, 10);
          }
        });
        const htZb = enContarCount ? ((enContarCountIsOver / enContarCount) * 100).toFixed(2) : '0.00';
        const pgZb = varCount1 ? ((varCount2 / varCount1) * 100).toFixed(2) : '0.00';
        this.statCards = [
          { key: 1, label: '启用合同数/品规数', value: `${enContarCount} / ${varCount1}` },
          { key: 2, label: '启用合同过期数/品规数', value: `${enContarCountIsOver} / ${varCount2}` },
          { key: 3, label: '启用合同未过期数/品规数', value: `${enContarCountIsNotOver} / ${varCount3}` },
          { key: 4, label: '过期合同占比/品规占比', value: `${htZb}% / ${pgZb}%` }
        ];
      } catch {
        /* ignore stats error */
      }
    },
    applyStatFilter(tag) {
      if (tag === 1) {
        this.where.ENABLE = '1';
        this.where.CONTRACT_STATE = '1';
        this.where.IsOverTime = '';
      } else if (tag === 2) {
        this.where.ENABLE = '1';
        this.where.CONTRACT_STATE = '1';
        this.where.IsOverTime = '0';
      } else if (tag === 3) {
        this.where.ENABLE = '1';
        this.where.CONTRACT_STATE = '1';
        this.where.IsOverTime = '1';
      }
      this.reload();
    },
    async onExportVar(row) {
      try {
        const res = await exportContactAllVar(row.CONTRACT_CODE);
        exportContactAllVarExcel(res.result || []);
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      }
    },
    async onExportAll() {
      this.exportingAll = true;
      try {
        const res = await getContactAllList({ page: 1, limit: 999999, where: this.where });
        const rows = res.result || [];
        const headers = [
          '供应商名称',
          '供应商状态',
          '合同状态',
          '合同名称',
          '合同编码',
          '合同启用时间',
          '合同终止时间',
          '品规数',
          '合同金额',
          '消耗金额',
          '消耗金额占比',
          '入库金额',
          '入库金额占比'
        ];
        const { utils, writeFile } = await import('xlsx');
        const data = [headers];
        rows.forEach((r) => {
          data.push([
            r.SUPPLIER_NAME,
            r.ENABLE == 1 ? '启用' : '停用',
            r.CONTRACT_STATE == 1 ? '启用' : '停用',
            r.CONTRACT_NAME,
            r.CONTRACT_CODE,
            r.CONTRACT_START_TIME,
            r.CONTRACT_END_TIME,
            r.VAR_QTY,
            r.LIMIT_SUM_PRICE,
            r.usePrice != null ? Number(r.usePrice).toFixed(2) : '',
            r.ProportionAmount != null ? `${Number(r.ProportionAmount).toFixed(2)}%` : '',
            r.shPrice != null ? Number(r.shPrice).toFixed(2) : '',
            r.shAmount != null ? `${Number(r.shAmount).toFixed(2)}%` : ''
          ]);
        });
        const sheet = utils.aoa_to_sheet(data);
        writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, '合同列表.xlsx');
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exportingAll = false;
      }
    },
    openLimitPrice(row) {
      this.$prompt('合同金额', '修改合同金额', {
        inputValue: row.LIMIT_SUM_PRICE,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async ({ value }) => {
          await updateContactLimitPrice(row.CONTRACT_CODE, value);
          this.$message.success('修改成功');
          this.reload();
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.stat-row {
  margin-bottom: 12px;
}
.stat-card {
  background: #f0f7ff;
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
}
.stat-label {
  font-size: 13px;
  color: #606266;
}
.stat-value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
}
.filter-row {
  margin-bottom: 10px;
}
</style>
