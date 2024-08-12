<template lang="">
  <div class="">
    <ele-modal
      width="1000px"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="定数包列表"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        height="60vh"
        highlight-current-row
        @current-change="onCurrentChange"
        ref="table"
        :initLoad="false"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="WarehouseTransferDefPkgTable"
      >
        <template v-slot:toolbar>
          <div>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-check"
              @click="batchCreateDefPkgCode()"
              >提交</el-button
            >
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import {
    itemDefPkgTableList,
    createDEPT_TK_DEF
  } from '@/api/KSInventory/WarehouseTransfer/index';
import { load } from '@amap/amap-jsapi-loader';
  export default {
    name: 'WarehouseTransferDefPkgTable',
    props: ['visible'],
    components: {},
    data() {
      const defaultWhere = {
        code: null,
        middleTableCurrent: null
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            checked: true,
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'COEFFICIENT',
            label: '系数',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            minWidth: 100,
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
            label: '规格',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      //数据源
      datasource({ page, limit, where, order }) {
        let data = itemDefPkgTableList({
          page,
          limit,
          where,
          order
        })
          .then((res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          })
          .finally(() => {
            this.$refs.table.toggleAllSelection();
          });
        return data;
      },
      batchCreateDefPkgCode() {
        const id = this.where.middleTableCurrent.ID;
        const currentDeptTwoCode =
          this.$store.state.user.info.DeptNow.Dept_Two_Code;
        const json = this.selection.map((item) => {
          return {
            DEF_NO_PKG_CODE: item.DEF_NO_PKG_CODE,
            TK_DEL_ID: id,
            SOURCE_DEPT_TWO_CODE: currentDeptTwoCode
          };
        });
        const loading = this.$messageLoading('正在处理...');
        createDEPT_TK_DEF({ json: json, id: id })
          .then((res) => {
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            loading.close();
            this.updateVisible(false)
          });
      },
      // 表格选中数据
      onCurrentChange(current) {
        this.current = current;
      },
      // 更新弹窗状态
      updateVisible(visible) {
        this.$emit('update:visible', visible);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    mounted() {
      this.$bus.$on(`${this.$route.path}/MiddleTableChange`, ({ row }) => {
        this.where.middleTableCurrent = row;
        this.where.code = row.VARIETIE_CODE;
        this.reload(this.where);
      });
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/MiddleTableChange`);
    },
    created() {}
  };
</script>
<style lang=""></style>
