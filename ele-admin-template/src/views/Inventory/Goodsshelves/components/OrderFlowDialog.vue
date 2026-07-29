<template>
  <el-dialog
    title="订单流水查询"
    :visible.sync="innerVisible"
    width="900px"
    append-to-body
    @opened="reload"
  >
    <el-form size="mini" :inline="true" @submit.native.prevent>
      <el-form-item label="出库单号">
        <el-input v-model="where.ORDER_NUM" clearable style="width: 160px" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="where.ORDER_TIME_START"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="where.ORDER_TIME_END"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      border
      stripe
      :toolbar="false"
      height="420px"
      :pageSize="50"
      :pageSizes="[20, 50, 100, 200]"
      :columns="columns"
      :datasource="datasource"
      cache-key="goodsshelvesOrderFlow"
    />
  </el-dialog>
</template>

<script>
import { orderFlowingSearch } from '@/api/Inventory/Goodsshelves';

function todayStr() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export default {
  name: 'OrderFlowDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    const today = todayStr();
    return {
      innerVisible: false,
      where: {
        ORDER_NUM: '',
        ORDER_TIME_START: today,
        ORDER_TIME_END: today
      },
      columns: [
        {
          prop: 'ORDER_NUM',
          label: '出库单号',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'ORDER_FLOWING_NUM',
          label: '流水号',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'ORDER_TIME',
          label: '时间',
          minWidth: 160,
          showOverflowTooltip: true
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
    reload() {
      this.$refs.table?.reload?.({ page: 1, where: { ...this.where } });
    },
    datasource({ page, limit, where }) {
      return orderFlowingSearch({ page, limit, where }).then((res) => ({
        count: res.total,
        list: res.result || []
      }));
    }
  }
};
</script>
