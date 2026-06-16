<template>
  <div class="ele-body spd-page ygcg-platform">
    <el-card shadow="never">
      <el-form
        size="small"
        inline
        class="filter-bar"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="阳光产品码">
          <el-input
            v-model="where.code"
            clearable
            placeholder="请输入阳光产品码"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.supplierCode"
            clearable
            placeholder="请输入供应商"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="议价状态">
          <el-select v-model="where.statu" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="未议价" value="未议价" />
            <el-option label="议价成功" value="议价成功" />
            <el-option label="议价失败" value="议价失败" />
            <el-option label="议价撤废" value="议价撤废" />
            <el-option label="议价中" value="议价中" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种状态">
          <el-select v-model="where.varietieStatu" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="停用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="对比平台最低价">
          <el-select v-model="where.minPricePk" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="高于平台最低价" value="0" />
            <el-option label="等于平台最低价" value="2" />
            <el-option label="低于平台最低价" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="对比平台平均价">
          <el-select v-model="where.avgPricePk" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="高于平台平均价" value="0" />
            <el-option label="等于平台平均价" value="2" />
            <el-option label="低于平台平均价" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="对比预警价格">
          <el-select v-model="where.examplePricePk" clearable style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="高于预警价格" value="0" />
            <el-option label="等于预警价格" value="2" />
            <el-option label="低于预警价格" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="where.inventoryStatu" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="无库存" value="0" />
            <el-option label="有库存" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-upload
            class="inline-upload"
            action=""
            :show-file-list="false"
            accept=".xlsx,.xls"
            :http-request="onImport"
          >
            <el-button icon="el-icon-upload2" :loading="importing">导入</el-button>
          </el-upload>
          <el-button
            v-permission="'export-YGCGPlatform-bjdc'"
            type="primary"
            icon="el-icon-download"
            :loading="exporting"
            @click="exportExcel"
          >
            导出
          </el-button>
          <el-button icon="el-icon-setting" @click="configVisible = true">配置</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="where"
        :page-size="20"
        :page-sizes="[20, 50, 100, 150, 300]"
        cache-key="YGCGPlatform"
      >
        <template v-slot:INVENTORY_QTY="{ row }">
          {{ formatInventoryQty(row) }}
        </template>
        <template v-slot:CONTRACT_START_TIME="{ row }">
          {{ formatDateOnly(row.CONTRACT_START_TIME) }}
        </template>
        <template v-slot:CONTRACT_END_TIME="{ row }">
          {{ formatDateOnly(row.CONTRACT_END_TIME) }}
        </template>
        <template v-slot:DET_CONTRACT_START="{ row }">
          {{ formatDateOnly(row.DET_CONTRACT_START) }}
        </template>
        <template v-slot:DET_CONTRACT_END="{ row }">
          {{ formatDateOnly(row.DET_CONTRACT_END) }}
        </template>
        <template v-slot:CREATE_TIME="{ row }">
          {{ formatCreateTime(row.CREATE_TIME) }}
        </template>
      </ele-pro-table>
    </el-card>

    <el-dialog title="配置" :visible.sync="configVisible" width="480px" append-to-body>
      <el-form label-width="160px" size="small" @submit.native.prevent>
        <el-form-item label="配置备货不得高于">
          <el-select v-model="configValue" placeholder="请选择" style="width: 100%">
            <el-option label="请选择" value="" />
            <el-option
              v-for="item in configOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" :loading="configSaving" @click="saveConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getTableList, updateConfig, importExcel } from '@/api/Statistics/YGCGPlatform';
import {
  defaultWhere,
  buildColumns,
  CONFIG_OPTIONS,
  exportYGCGExcel,
  formatDateOnly,
  formatCreateTime,
  formatInventoryQty
} from './utils';

export default {
  name: 'YGCGPlatform',
  data() {
    return {
      where: defaultWhere(),
      columns: buildColumns(),
      configOptions: CONFIG_OPTIONS,
      configVisible: false,
      configValue: '',
      configSaving: false,
      exporting: false,
      importing: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 300px)';
    }
  },
  methods: {
    formatDateOnly,
    formatCreateTime,
    formatInventoryQty,
    datasource({ page, limit, where }) {
      return getTableList(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.where } });
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await getTableList(this.where, 1, 999999);
        exportYGCGExcel(res.result || []);
        Message.success('导出成功');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    async onImport({ file }) {
      this.importing = true;
      try {
        const data = await importExcel(file);
        Message.success(data.msg || '导入成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '导入失败');
      } finally {
        this.importing = false;
      }
    },
    async saveConfig() {
      this.configSaving = true;
      try {
        const data = await updateConfig(this.configValue);
        Message.success(data.msg || '更新成功');
        this.configVisible = false;
      } catch (e) {
        Message.error(e.message || '更新失败');
      } finally {
        this.configSaving = false;
      }
    }
  }
};
</script>

<style scoped>
.filter-bar {
  margin-bottom: 12px;
}
.inline-upload {
  display: inline-block;
  margin: 0 10px;
}
</style>
