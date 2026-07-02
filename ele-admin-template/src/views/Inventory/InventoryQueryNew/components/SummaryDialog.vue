<template>
  <el-dialog title="汇总（所有品种汇总）" :visible.sync="innerVisible" width="720px" append-to-body @open="onOpen">
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="品种名称">
        <el-input v-model="keyword" clearable style="width: 200px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      :height="400"
      :toolbar="false"
      :columns="columns"
      :datasource="datasource"
      :page-size="30"
      :page-sizes="[30, 60, 100]"
    />
  </el-dialog>
</template>

<script>
import { summaryColumns } from '../columns';
import { searchCenterGoodsMsg } from '@/api/Inventory/InventoryQueryNew';

export default {
  name: 'InvQuerySummaryDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      innerVisible: false,
      keyword: '',
      columns: summaryColumns
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    onOpen() {
      this.keyword = '';
      this.$nextTick(() => this.reload());
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      return searchCenterGoodsMsg(this.keyword, page, limit)
        .then((res) => ({ count: res.total ?? 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    }
  }
};
</script>
