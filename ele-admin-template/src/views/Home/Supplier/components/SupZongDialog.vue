<template>
  <el-dialog title="供应商总目录" :visible.sync="dialogVisible" width="92%" top="5vh" append-to-body @open="reload">
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="供应商">
        <el-input v-model="where.supName" clearable style="width: 200px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item label="所属医院">
        <el-input v-model="where.hospitalName" clearable style="width: 200px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        <el-button :loading="downloading" :disabled="!selection.length" @click="onDownload">下载</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      height="520px"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="supplierZongMlTable"
    />
  </el-dialog>
</template>

<script>
import { DownZmlSup, spdGetSupplierInfoForZong } from '@/api/Home/Qualificationcheck';

export default {
  name: 'SupZongDialog',
  props: { visible: Boolean },
  data() {
    return {
      where: { supName: '', hospitalName: '' },
      selection: [],
      downloading: false,
      columns: [
        { type: 'selection', width: 45, align: 'center' },
        { prop: 'HOSPITALNAME', label: '业务医院', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SUPPLIER_CODE_SPD', label: '院内编码', width: 90, showOverflowTooltip: true },
        { prop: 'COMPANY', label: '供应商名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'PEOPLE_ID', label: '社会统一信用代码', minWidth: 160, showOverflowTooltip: true },
        { prop: 'ADDRESS', label: '企业地址', minWidth: 160, showOverflowTooltip: true },
        { prop: 'PHONE', label: '企业电话', width: 110, showOverflowTooltip: true },
        { prop: 'YWY_NAME', label: '业务员姓名', width: 100, showOverflowTooltip: true },
        { prop: 'YWY_PEO_ID', label: '业务员身份证号', width: 130, showOverflowTooltip: true },
        { prop: 'YWY_PHONE', label: '业务员联系电话', width: 120, showOverflowTooltip: true }
      ]
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
    async datasource({ page, limit }) {
      try {
        const res = await spdGetSupplierInfoForZong({
          page,
          limit,
          where: this.where
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload() {
      this.$refs.table?.reload({ page: 1, where: this.where });
    },
    async onDownload() {
      if (!this.selection.length) {
        this.$message.warning('请先勾选供应商');
        return;
      }
      this.downloading = true;
      try {
        const res = await DownZmlSup({ json: JSON.stringify(this.selection) });
        this.$message.success(res.msg || '下载成功');
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '下载失败');
      } finally {
        this.downloading = false;
      }
    }
  }
};
</script>
