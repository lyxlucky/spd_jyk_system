<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      highlight-selection-row
      ref="table"
      @current-change="onCurrentChange"
      height="65vh"
      :rowClickChecked="true"
      :initLoad="false"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="WarehouseTransferRightTable"
    >
      <template v-slot:toolbar>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="createItem()"
            >创建</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteItem()"
            >删除</el-button
          >
        </div>
      </template>

      <template v-slot:TK_STAE="{ row }">
        <el-tag v-if="row.TK_STAE == 0" type="primary" size="small"
          >新增</el-tag
        >
        <el-tag v-if="row.TK_STAE == 1" type="success" size="small"
          >确认</el-tag
        >
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { getDEPT_TK_DEF,delDEPT_TK_DEF } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferRightTable',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH',
            label: '批号',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '效期开始时间',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '效期结束时间',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'CREATE_MAN',
            label: '创建人',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getDEPT_TK_DEF({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      createItem() {},
      deleteItem() {
        this.$confirm('是否删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = JSON.stringify(
            this.selection.map((item) => ({
              ID: item.ID,
            }))
          );
          delDEPT_TK_DEF({json : ids}).then((res) => {
            this.$message({
              type: 'success',
              message: res.msg
            });
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err
            });
          }).finally(() => {
            this.reload()
          });
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
    },
    mounted() {},
    beforeDestroy() {}
  };
</script>
<style lang=""></style>
