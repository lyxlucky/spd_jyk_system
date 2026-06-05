<template>
  <div class="ele-body gy-clml-spd">
    <el-card shadow="never">
      <el-form
        size="small"
        inline
        class="filter-block"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="HIS编码">
          <el-input v-model="filters.Search" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input v-model="filters.MATERIALS_CODE" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="filters.PJ_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input v-model="filters.VARIETIE_NAME" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="filters.SPECIFICATION_OR_TYPE"
            clearable
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="价格是否一致">
          <el-select v-model="filters.GY_CS_IsPrice" clearable style="width: 90px">
            <el-option label="否" value="0" />
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="SPD启用">
          <el-select v-model="filters.IS_ENABLE" clearable style="width: 90px">
            <el-option label="是" value="1" />
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="SPD收费">
          <el-select v-model="filters.IS_CHARGE" clearable style="width: 90px">
            <el-option label="是" value="1" />
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="HIS启用">
          <el-select v-model="filters.HIS_STATE" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="在用" value="在用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button
            v-permission="'export-GY_CLML_SPD-jfdc'"
            type="primary"
            plain
            icon="el-icon-download"
            :loading="exporting"
            @click="exportExcel"
          >
            导出excel
          </el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="filters"
        :page-size="20"
        :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
        cache-key="GyClmlSpd"
      >
        <template v-slot:IS_ENABLE="{ row }">
          {{ formatIsEnable(row.IS_ENABLE) }}
        </template>
        <template v-slot:IS_CHARGE="{ row }">
          {{ formatIsCharge(row.IS_CHARGE) }}
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getGyClmlSpdList } from '@/api/KSInventory/GyClmlSpd';
import {
  defaultFilters,
  buildColumns,
  exportGyClmlSpdExcel,
  formatIsEnable,
  formatIsCharge
} from './utils';

export default {
  name: 'GyClmlSpd',
  data() {
    return {
      filters: defaultFilters(),
      columns: buildColumns(),
      exporting: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 260px)';
    }
  },
  methods: {
    formatIsEnable,
    formatIsCharge,
    datasource({ page, limit, where }) {
      return getGyClmlSpdList(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getGyClmlSpdList(this.filters, 1, 999999);
        exportGyClmlSpdExcel(res.result || []);
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
  margin-bottom: 12px;
}
</style>
