<template>
  <ele-modal
    width="900px"
    top="5vh"
    title="查看即将过期和已过期注册证"
    :visible="visible"
    :resizable="true"
    :maxable="true"
    @update:visible="updateVisible"
  >
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="近N个月">
        <el-input v-model="month" style="width: 100px" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">搜索</el-button>
        <el-button type="success" icon="el-icon-download" :loading="exporting" @click="onExport">
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="480px"
      :toolkit="[]"
      :columns="columns"
      :datasource="datasource"
      :page-size="50"
      :page-sizes="[30, 50, 100, 200, 99999]"
      cache-key="expireProdDialogTable"
    />
  </ele-modal>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { SearchExpireProdInfo } from '@/api/Home/registration/index';

export default {
  name: 'ExpireProdDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      month: '3',
      exporting: false,
      columns: [
        { prop: 'PROD_REGISTRATION_NAME', label: '注册证名称', minWidth: 220, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 160, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_LICENSE', label: '生产许可证号', minWidth: 160, showOverflowTooltip: true },
        {
          prop: 'REGISTRATION_ISSUING_DATE',
          label: '发证日期',
          minWidth: 120,
          formatter: (_r, _c, v) => (v ? String(v).substr(0, 10) : '')
        },
        {
          prop: 'REGISTRATION_VALID_DATE',
          label: '有效到期',
          minWidth: 120,
          formatter: (_r, _c, v) => (v ? String(v).substr(0, 10) : '')
        }
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
      return SearchExpireProdInfo({
        month: this.month || '3',
        page,
        size: limit
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
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await SearchExpireProdInfo({
          month: this.month || '3',
          page: 1,
          size: 99999
        });
        if (res.code != 200 && res.code !== '200') {
          this.$message.error(res.msg || '导出失败');
          return;
        }
        const rows = [['注册证名称', '生产企业名称', '批准文号', '生产许可证号', '发证日期', '有效到期']];
        (res.result || []).forEach((d) => {
          rows.push([
            d.PROD_REGISTRATION_NAME || '',
            d.MANUFACTURING_ENT_NAME || '',
            d.APPROVAL_NUMBER || '',
            d.MANUFACTURING_LICENSE || '',
            d.REGISTRATION_ISSUING_DATE ? String(d.REGISTRATION_ISSUING_DATE).substr(0, 10) : '',
            d.REGISTRATION_VALID_DATE ? String(d.REGISTRATION_VALID_DATE).substr(0, 10) : ''
          ]);
        });
        const sheet = utils.aoa_to_sheet(rows);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, '过期注册证');
        writeFile(book, '即将过期和已过期注册证.xlsx');
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
