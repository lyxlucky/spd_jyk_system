<template>
  <ele-modal
    width="1100px"
    top="5vh"
    title="修改日志"
    :visible="visible"
    :resizable="true"
    :maxable="true"
    @update:visible="updateVisible"
  >
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="searchName"
          clearable
          placeholder="品种名称"
          style="width: 180px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="560px"
      :toolkit="[]"
      :columns="columns"
      :datasource="datasource"
      :page-size="100"
      :page-sizes="[30, 50, 100, 200, 99999]"
      cache-key="productUpLogDialogTable"
    />
  </ele-modal>
</template>

<script>
import { GetProductUpLog } from '@/api/Home/registration/index';

export default {
  name: 'ProductUpLogDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      searchName: '',
      columns: [
        { type: 'index', label: '序号', width: 55, align: 'center', columnKey: 'index' },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证产品名称',
          minWidth: 180,
          showOverflowTooltip: true
        },
        { prop: 'SOURCEDESCRIBE', label: '修改字段名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SOURCEFILEDNAME', label: '修改字段', minWidth: 120, showOverflowTooltip: true },
        { prop: 'SOURCEVALUE', label: '修改前', minWidth: 140, showOverflowTooltip: true },
        { prop: 'TARGETVALUE', label: '修改后', minWidth: 140, showOverflowTooltip: true },
        { prop: 'LOG_USER', label: '操作人', minWidth: 100, align: 'center' },
        { prop: 'UPTIME', label: '最后更新时间', minWidth: 160 }
      ]
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => this.reload());
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit }) {
      return GetProductUpLog({
        page,
        size: limit,
        PROD_REGISTRATION_NAME: this.searchName
      })
        .then((res) => {
          if (res.code == 200 || res.code === '200') {
            return { count: res.total || 0, list: res.result || [] };
          }
          this.$message.error(res.msg || '查询失败');
          return { count: 0, list: [] };
        })
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    }
  }
};
</script>
