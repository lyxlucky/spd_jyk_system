<template>
  <div class="ele-body spd-page health-insurance-directory">
    <el-card shadow="never">
      <el-form
        size="small"
        inline
        class="filter-bar"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="医保目录编码">
          <el-input
            v-model="filters.MEDICAL_INSURANCE_CODE"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="医保目录名称">
          <el-input
            v-model="filters.NAME_OF_MEDICAL_INSURANCE_CATA"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="医保通用名">
          <el-input
            v-model="filters.GENERIC_NAME_FOR_HEALTH_INSURA"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="filters.TEXTURE" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="耗材企业">
          <el-input
            v-model="filters.CONSUMABLES_ENTERPRISES"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="注册备案号">
          <el-input
            v-model="filters.REGISTRATION_RECORD_NUMBER"
            clearable
            style="width: 150px"
          />
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
          <el-button type="danger" plain :loading="deleting" @click="onDelete">剔除</el-button>
        </el-form-item>
      </el-form>

      <ele-pro-table
        ref="table"
        :height="tableHeight"
        :columns="columns"
        :datasource="datasource"
        :where="searchWhere"
        :selection.sync="selection"
        :page-size="100"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="HealthInsuranceDirectory"
      />
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import {
  getHealthInsuranceDirectory,
  importHealthInsurance,
  deleteHealthDirectory
} from '@/api/Home/HealthInsuranceDirectory';
import { defaultFilters, buildColumns, toSearchWhere } from './utils';

export default {
  name: 'HealthInsuranceDirectory',
  data() {
    return {
      filters: defaultFilters(),
      columns: buildColumns(),
      selection: [],
      importing: false,
      deleting: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 260px)';
    },
    searchWhere() {
      return toSearchWhere(this.filters);
    }
  },
  methods: {
    datasource({ page, limit, where }) {
      return getHealthInsuranceDirectory(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.searchWhere } });
    },
    async onImport({ file }) {
      this.importing = true;
      try {
        const res = await importHealthInsurance(file);
        Message.success(res.msg || '导入成功');
        this.reload();
      } catch (e) {
        Message.error(e.message || '导入失败');
      } finally {
        this.importing = false;
      }
    },
    async onDelete() {
      if (!this.selection.length) {
        Message.warning('请选中要删除的数据');
        return;
      }
      try {
        await MessageBox.confirm('确认要删除此数据吗？', '提示', { type: 'warning' });
        const ids = this.selection.map((row) => row.ID).join(',');
        this.deleting = true;
        await deleteHealthDirectory(ids);
        Message.success('删除成功');
        this.reload();
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '删除失败');
      } finally {
        this.deleting = false;
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
