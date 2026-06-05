<template>
  <div class="ele-body yg-var-cl-look-sm">
    <el-card shadow="never">
      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="品种/医保编码">
          <el-input v-model="filters.VARIETIE_CODE_NEW" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="filters.APPROVAL_NUMBER" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="型号规格">
          <el-input v-model="filters.GGXH" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="对码是否一致">
          <el-select v-model="filters.ISDM" clearable style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否收费">
          <el-select v-model="filters.IS_CHARGE" clearable style="width: 90px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="暂挂">
          <el-select v-model="filters.YBBIAOJI" clearable style="width: 90px">
            <el-option label="否" value="0" />
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form size="small" inline class="filter-block" @submit.native.prevent>
        <el-form-item label="供应商">
          <el-input v-model="filters.SUPPLIER_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="基本医保终止日期">
          <el-date-picker
            v-model="filters.YGVARCL_END_START"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="filters.YGVARCL_END_END"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="filters.SENDYB_STATE" clearable style="width: 150px">
            <el-option
              v-for="item in sendYbStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button
            v-permission="'export-YGVARCLLOOK_SM-shmldc'"
            type="primary"
            plain
            icon="el-icon-download"
            :loading="exporting"
            @click="exportExcel"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="listWhere"
        :page-size="20"
        :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
        cache-key="YgVarClLookSm"
      >
        <template v-slot:SENDYB_STATE="{ row }">
          {{ formatLookSendYbState(row.SENDYB_STATE) }}
        </template>
        <template v-slot:LOG_TIME="{ row }">
          {{ formatLogTime(row.LOG_TIME) }}
        </template>
        <template v-slot:SENDYB_TYPE="{ row }">
          {{ formatSendYbType(row.SENDYB_TYPE) }}
        </template>
        <template v-slot:IS_CHARGE="{ row }">
          {{ formatIsCharge(row.IS_CHARGE) }}
        </template>
        <template v-slot:YBBIAOJI="{ row }">
          {{ formatYbbiaoji(row.YBBIAOJI) }}
        </template>
        <template v-slot:MEDICAL_CODE="{ row }">
          <span :class="{ 'text-danger': isMedicalCodeMismatch(row) }">
            {{ row.MEDICAL_CODE }}
          </span>
        </template>
        <template v-slot:LAUNCH_DATE_OF_BASIC_MEDICAL="{ row }">
          {{ formatDateOnly(row.LAUNCH_DATE_OF_BASIC_MEDICAL) }}
        </template>
        <template v-slot:TERMINATION_DATE_OF_BASIC_HEAL="{ row }">
          <span
            :class="{
              'text-danger': isTerminationExpired(row.TERMINATION_DATE_OF_BASIC_HEAL)
            }"
          >
            {{ formatDateOnly(row.TERMINATION_DATE_OF_BASIC_HEAL) }}
          </span>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getYbClInfo } from '@/api/Home/YgVarClLookSm';
import {
  defaultLookFilters,
  LOOK_WJ_AUTH_JSON,
  LOOK_SENDYB_STATE_OPTIONS,
  formatLookSendYbState
} from './utils';
import {
  buildColumns,
  exportYgVarClSmExcel,
  formatSendYbType,
  formatIsCharge,
  formatYbbiaoji,
  formatLogTime,
  formatDateOnly,
  isMedicalCodeMismatch,
  isTerminationExpired
} from '@/views/Home/YgVarClSm/utils';

export default {
  name: 'YgVarClLookSm',
  data() {
    return {
      filters: defaultLookFilters(),
      sendYbStateOptions: LOOK_SENDYB_STATE_OPTIONS,
      columns: buildColumns().filter((col) => col.type !== 'selection'),
      exporting: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 300px)';
    },
    listWhere() {
      return { ...this.filters, WJ_AUTH: LOOK_WJ_AUTH_JSON };
    }
  },
  methods: {
    formatLookSendYbState,
    formatSendYbType,
    formatIsCharge,
    formatYbbiaoji,
    formatLogTime,
    formatDateOnly,
    isMedicalCodeMismatch,
    isTerminationExpired,
    datasource({ page, limit, where }) {
      const { WJ_AUTH, ...filters } = where || {};
      return getYbClInfo(filters, page, limit, WJ_AUTH || LOOK_WJ_AUTH_JSON).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.listWhere } });
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getYbClInfo(this.filters, 1, 999999, LOOK_WJ_AUTH_JSON);
        exportYgVarClSmExcel(res.result || []);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.filter-block {
  margin-bottom: 4px;
}
.text-danger {
  color: #f56c6c;
}
</style>
