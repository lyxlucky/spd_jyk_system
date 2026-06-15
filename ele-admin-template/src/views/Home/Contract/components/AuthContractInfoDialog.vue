<template>
  <el-dialog title="授权合同信息" :visible.sync="dialogVisible" width="96%" top="3vh" append-to-body @open="reload">
    <el-form size="mini" inline @submit.native.prevent>
      <el-input v-model="where.Contract_Name" clearable placeholder="合同名称" style="width: 160px" />
      <el-input v-model="where.Supplier_Name" clearable placeholder="供应商名称" style="width: 160px; margin-left: 8px" />
      <el-form-item label="明细状态" style="margin-left: 8px">
        <el-select v-model="where.HT_DEL_STATE" style="width: 90px">
          <el-option label="启用" value="1" />
          <el-option label="全部" value="" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同状态">
        <el-select v-model="where.HT_STATE" style="width: 90px">
          <el-option label="启用" value="1" />
          <el-option label="全部" value="" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="明细效期">
        <el-select v-model="where.HT_DEL_DATE_STATE" style="width: 100px">
          <el-option label="范围内" value="1" />
          <el-option label="全部" value="" />
          <el-option label="非范围内" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同效期">
        <el-select v-model="where.HT_DATE_STATE" style="width: 100px">
          <el-option label="范围内" value="1" />
          <el-option label="全部" value="" />
          <el-option label="非范围内" value="0" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      <el-button :loading="exporting" @click="onExport">导出</el-button>
    </el-form>

    <ele-pro-table
      ref="table"
      size="mini"
      height="520px"
      :stripe="true"
      :page-size="20"
      :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
      :columns="columns"
      :datasource="datasource"
      cache-key="authContractInfoTable"
    />
  </el-dialog>
</template>

<script>
import { getAllAuthContractInfo, getAuthContractInfo } from '@/api/Home/Contract';
import { buildAuthContractColumns, exportAuthContractInfoExcel } from '../utils';

export default {
  name: 'AuthContractInfoDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      columns: buildAuthContractColumns(),
      where: {
        Contract_Name: '',
        Supplier_Name: '',
        HT_DEL_STATE: '1',
        HT_STATE: '1',
        HT_DEL_DATE_STATE: '1',
        HT_DATE_STATE: '1'
      },
      exporting: false
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
    reload() {
      this.$refs.table?.reload({ page: 1, where: this.where });
    },
    datasource({ page, limit }) {
      return getAuthContractInfo({ page, limit, where: this.where })
        .then((res) => ({ count: res.total || 0, list: res.result || [] }))
        .catch((e) => {
          this.$message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async onExport() {
      this.exporting = true;
      try {
        const res = await getAllAuthContractInfo(this.where);
        exportAuthContractInfoExcel(res.result || []);
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
