<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      highlight-selection-row
      ref="table"
      @current-change="onCurrentChange"
      height="65vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :initLoad="false"
      :selection.sync="selection"
      cache-key="WarehouseTransferMiddleTable"
    >
      <template v-slot:toolbar>
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            :disabled="isEnableCreate"
            @click="WarehouseTransferCreateDetailVisible = true"
            >创建</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="!isEnableDelete"
            @click="deleteItem()"
            >删除</el-button
          >
        </div>
      </template>

      <template v-slot:action = "{ row }">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          :disabled="isEnableCreate"
          @click="showCreateDefPkgModal(row)"
          >创建定数包</el-button
        >
      </template>
    </ele-pro-table>

    <WarehouseTransferCreateDetail
      :TK_MAIN_ID="where.ID"
      @reload="reload"
      :visible.sync="WarehouseTransferCreateDetailVisible"
    />

    <WarehouseTransferDefPkgTable  :visible.sync='WarehouseTransferDefPkgTableVisible' />

  </div>
</template>
<script>
  import WarehouseTransferCreateDetail from './WarehouseTransferCreateDetail';
  import WarehouseTransferDefPkgTable from './WarehouseTransferDefPkgTable';
  import {
    getDEPT_TK_Del,
    delDEPT_TK_VAR
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferMiddleTable',
    components: {
      WarehouseTransferCreateDetail,
      WarehouseTransferDefPkgTable
    },
    data() {
      const defaultWhere = {
        ID: null,
        STATE: null
      };
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
            label: '序号',
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'action',
            label: '操作',
            minWidth: 140,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装型号',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            minWidth: 50,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'QTY',
            label: '数量',
            minWidth: 50,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 80,
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
        current: null,
        WarehouseTransferCreateDetailVisible: false,
        WarehouseTransferDefPkgTableVisible: false
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getDEPT_TK_Del({
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
      showCreateDefPkgModal(row){
        this.$bus.$emit(`${this.$route.path}/MiddleTableSlotRow`, row);
        this.WarehouseTransferDefPkgTableVisible = true;
      },
      onCurrentChange(row) {
        this.$bus.$emit(`${this.$route.path}/MiddleTableChange`, { row: row });
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      deleteItem() {
        this.$confirm('是否删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = JSON.stringify(
            this.selection.map((item) => ({
              ID: item.ID,
              TK_MAIN_ID: item.TK_MAIN_ID
            }))
          );
          delDEPT_TK_VAR({ json: ids })
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.msg
              });
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: err
              });
            })
            .finally(() => {
              this.reload();
            });
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isEnableCreate() {
        return (this.where.ID && this.where.STATE == 1);
      },
      isEnableDelete() {
        return this.selection.length > 0;
      }
    },
    mounted() {
      this.$bus.$on(`${this.$route.path}/LeftTableChange`, (row) => {
        if (row) {
          this.where.ID = row.ID;
          this.where.STATE = row.TK_STAE
          this.reload(this.where);
        }
      });
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/LeftTableChange`);
    }
  };
</script>
<style lang=""></style>
