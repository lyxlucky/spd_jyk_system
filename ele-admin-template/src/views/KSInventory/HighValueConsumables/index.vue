<template>
  <div class="ele-body high-value-consumables">
    <el-card shadow="never">
      <el-form
        size="small"
        inline
        class="filter-block"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-form-item label="耗材分类代码">
          <el-input
            v-model="filters.CONSUMABLES_CLASS_CODE"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="医保通用名">
          <el-input
            v-model="filters.MEDICARE_GENERIC_NAME"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="耗材类别">
          <el-select
            v-model="filters.CATEGORY_ID"
            clearable
            filterable
            style="width: 280px"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            :loading="syncing"
            @click="onSync"
          >
            同步分类代码
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
        cache-key="HighValueConsumables"
      />
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import {
  getHighValueConsumablesList,
  syncVarConsumableType
} from '@/api/KSInventory/HighValueConsumables';
import { defaultFilters, buildColumns, CATEGORY_OPTIONS } from './utils';

export default {
  name: 'HighValueConsumables',
  data() {
    return {
      filters: defaultFilters(),
      columns: buildColumns(),
      categoryOptions: CATEGORY_OPTIONS,
      syncing: false
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 220px)';
    }
  },
  methods: {
    datasource({ page, limit, where }) {
      return getHighValueConsumablesList(where, page, limit).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    },
    reload() {
      this.$refs.table.reload({ page: 1, where: { ...this.filters } });
    },
    async onSync() {
      this.syncing = true;
      try {
        const data = await syncVarConsumableType();
        Message.success(data.msg || '同步成功');
      } catch (e) {
        Message.error(e.message || '同步失败');
      } finally {
        this.syncing = false;
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
