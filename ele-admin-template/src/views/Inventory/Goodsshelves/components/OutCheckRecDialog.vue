<template>
  <el-dialog
    title="出库复核记录"
    :visible.sync="innerVisible"
    width="1200px"
    append-to-body
    @opened="reload"
  >
    <el-form size="mini" :inline="true" @submit.native.prevent>
      <el-form-item label="出库单号">
        <el-input v-model="where.OPERATE_NUMBER" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="where.OPERATER" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="品种编码">
        <el-input v-model="where.VARIETIE_CODE" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item label="院区">
        <el-select v-model="where.STORAGE_ID" clearable placeholder="全部" style="width: 140px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in storageOptions"
            :key="item.id"
            :label="item.name"
            :value="String(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="复核结果">
        <el-select v-model="where.RE_CHECK_RES" clearable style="width: 110px">
          <el-option label="全部" value="" />
          <el-option label="通过" value="1" />
          <el-option label="不通过" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      border
      stripe
      :toolbar="false"
      height="520px"
      :pageSize="50"
      :pageSizes="[20, 50, 100, 200]"
      :columns="columns"
      :datasource="datasource"
      cache-key="goodsshelvesOutCheckRec"
    />
  </el-dialog>
</template>

<script>
import { GetDeptTwoGoodsOperateList } from '@/api/Inventory/Goodsshelves';

export default {
  name: 'OutCheckRecDialog',
  props: {
    visible: { type: Boolean, default: false },
    storageOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      innerVisible: false,
      where: {
        OPERATE_NUMBER: '',
        OPERATER: '',
        VARIETIE_CODE: '',
        STORAGE_ID: '',
        RE_CHECK_RES: ''
      },
      columns: [
        {
          prop: 'OPERATE_NUMBER',
          label: '出库单号',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'OPERATER',
          label: '操作人',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'STORAGE_NAME',
          label: '院区',
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'RE_CHECK_RES',
          label: '复核结果',
          width: 100,
          formatter: (row) => {
            if (row.RE_CHECK_RES === 1 || row.RE_CHECK_RES === '1') return '通过';
            if (row.RE_CHECK_RES === 0 || row.RE_CHECK_RES === '0') return '不通过';
            return row.RE_CHECK_RES;
          }
        }
      ]
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
    reset() {
      this.where = {
        OPERATE_NUMBER: '',
        OPERATER: '',
        VARIETIE_CODE: '',
        STORAGE_ID: '',
        RE_CHECK_RES: ''
      };
      this.reload();
    },
    reload() {
      this.$refs.table?.reload?.({ page: 1, where: { ...this.where } });
    },
    datasource({ page, limit, where }) {
      return GetDeptTwoGoodsOperateList({
        page,
        size: limit,
        ...where
      }).then((res) => ({
        count: res.total,
        list: res.data || res.result || []
      }));
    }
  }
};
</script>
