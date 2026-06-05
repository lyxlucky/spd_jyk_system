<template>
  <el-dialog
    title="选择注册证"
    :visible="visible"
    width="900px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form size="small" inline @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="keyword"
          clearable
          placeholder="注册证编码 / 注册证号 / 注册证名称"
          style="width: 280px"
          @keyup.enter.native="reload"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      :height="420"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="20"
      :page-sizes="[20, 50, 100]"
      cache-key="RegistrationLimitPlanRegSelect"
    />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getProdRegistrationOptions } from '@/api/Statistics/RegistrationLimitPlan';

export default {
  name: 'RegistrationSelectDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      keyword: '',
      selection: [],
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center'
        },
        {
          prop: 'PROD_REGISTRATION_CODE',
          label: '注册证编码',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 220,
          showOverflowTooltip: true
        }
      ]
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.keyword = '';
        this.selection = [];
        this.$nextTick(() => this.reload());
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    datasource({ page, limit }) {
      return getProdRegistrationOptions(this.keyword, page, limit).then((res) => ({
        count: res.total,
        list: res.list
      }));
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    confirm() {
      if (!this.selection.length) {
        Message.warning('请先勾选注册证');
        return;
      }
      const rows = this.selection.map((row) => ({
        PROD_CODE: row.PROD_REGISTRATION_CODE,
        PROD_APPROVAL_NUMBER: row.APPROVAL_NUMBER,
        PROD_REGISTRATION_NAME: row.PROD_REGISTRATION_NAME
      }));
      this.$emit('confirm', rows);
      this.updateVisible(false);
    }
  }
};
</script>
