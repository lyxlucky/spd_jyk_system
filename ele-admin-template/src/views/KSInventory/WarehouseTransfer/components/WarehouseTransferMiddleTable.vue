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
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-position"
            :disabled="!isEnableImport"
            @click="quoteTemplateVisible = true"
            >引用模板</el-button
          >

          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :disabled="!isEnableDelete"
            @click="updateQty"
            >修改数量</el-button
          >

          <!-- maybe can use in later -->
          <!-- <el-button
            type="success"
            size="mini"
            icon="el-icon-download"
            @click="exportAsExcel"
            >导出</el-button
          > -->

          <el-button
            type="info"
            size="mini"
            icon="el-icon-s-management"
            @click="logCatVisible = true"
            >日志</el-button
          >


        </div>
      </template>

      <template v-slot:action="{ row }">
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

    <WarehouseTransferDefPkgTable
      :visible.sync="WarehouseTransferDefPkgTableVisible"
    />
    <QuoteTemplate :ID="this.where.ID" :visible.sync="quoteTemplateVisible" />

    <LogCat :visible.sync="logCatVisible"/>
  </div>
</template>
<script>
  import { utils, writeFile } from 'xlsx';
  import WarehouseTransferCreateDetail from './WarehouseTransferCreateDetail';
  import WarehouseTransferDefPkgTable from './WarehouseTransferDefPkgTable';
  import LogCat from './LogCat';
  import QuoteTemplate from './QuoteTemplate';
  import {
    getDEPT_TK_Del,
    delDEPT_TK_VAR,
    pullDataAsExcel,
    updateDEPT_TK_DelNum
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferMiddleTable',
    components: {
      WarehouseTransferCreateDetail,
      WarehouseTransferDefPkgTable,
      QuoteTemplate,
      LogCat
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
            minWidth: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            minWidth: 500,
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
            minWidth: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 180,
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
        WarehouseTransferDefPkgTableVisible: false,
        quoteTemplateVisible: false,
        logCatVisible: false
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
      showCreateDefPkgModal(row) {
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
      },
      updateQty(){
        this.$prompt('请输入修改数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: '请输入数字'
        }).then(({ value }) => {
          const ids = this.selection.map((item) => {
            return item.ID
          }).join(",");
          updateDEPT_TK_DelNum({ tkIds:ids,num:value })
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
      },
      exportAsExcel() {
        const loading = this.$messageLoading('正在导出数据...');
        pullDataAsExcel()
          .then((res) => {
            loading.close();
            const array = [
              [
                '订单号',
                '调库人',
                '调库时间',
                '调库科室',
                '创建时间',
                '创建人',
                '定数包',
                '来源科室',
                '品种编码',
                '品种名称'
              ]
            ];
            // item
            res.result.forEach((d) => {
              array.push([
                d.TK_ORDER,
                d.TK_MAN,
                d.TK_TIME,
                d.TK_DEPT_TWO_NAME,
                d.CREATE_TIME,
                d.CREATE_MAN,
                d.DEF_NO_PKG_CODE,
                d.SOURCE_DEPT_TWO_NAME,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '调库明细.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: err
            });
          });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isEnableImport() {
        return this.where.ID;
      },
      isEnableCreate() {
        return this.where.ID && this.where.STATE == 1;
      },
      isEnableDelete() {
        return this.selection.length > 0;
      }
    },
    mounted() {
      this.$bus.$on(`${this.$route.path}/LeftTableChange`, (row) => {
        if (row) {
          this.where.ID = row.ID;
          this.where.STATE = row.TK_STAE;
          this.reload(this.where);
        }
      });
      this.$bus.$on('QuoteTemplateAllDone', () => {
        this.reload(this.where);
      });
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/LeftTableChange`);
    }
  };
</script>
<style lang=""></style>
