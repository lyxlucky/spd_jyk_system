<template lang="">
  <div class="">
    <ele-modal
      width="90%"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="添加调库品种明细"
      @close="onClose"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        height="65vh"
        highlight-current-row
        @current-change="onCurrentChange"
        ref="table"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="WarehouseTransferCreateDetailTable"
      >
        <template v-slot:COUNT="{ row }">
          <el-input-number
            v-model="row.COUNT"
            size="mini"
            :min="0"
            class="ele-fluid"
          />
        </template>

        <template v-slot:toolbar>
          <div>
            <el-input style="width:200px" v-model="where.search" size='mini' placeholder="请输入品种编码"></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="searchItem()"
              >搜索</el-button
            >
            <el-button
              type="success"
              size="mini"
              icon="el-icon-circle-check"
              :disabled="!isCreateEnable"
              @click="createItem()"
              >创建</el-button
            >
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import {
    chooseDefPkgTableList,
    createDEPT_TK_VAR
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferCreateDetail',
    props: ['visible', 'TK_MAIN_ID'],
    components: {},
    data() {
      const defaultWhere = {
        search:"",
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
            slot: 'COUNT',
            label: '数量',
            minWidth: 120,
            align: 'center'
          },
          {
            prop: 'KC_QTY',
            label: '库存数量',
            minWidth: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DEF_QTY',
            label: '定数包数量',
            minWidth: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装规格',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            minWidth: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 120,
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
      datasource({ page, limit, where, order }) {
        let data = chooseDefPkgTableList({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      searchItem(){
        this.reload(this.where);
      },
      createItem() {
        const isAllHaveCount = this.selection.every((item) => item.COUNT > 0);
        if (!isAllHaveCount) return this.$message.error('请填写数量');
        const json = this.selection.map((item) => {
          return {
            VARIETIE_CODE: item.VARIETIE_CODE,
            QTY: item.COUNT
          };
        });
        const loading = this.$messageLoading('正在处理...');
        createDEPT_TK_VAR({ json: json, TK_MAIN_ID: this.TK_MAIN_ID })
          .then((res) => {
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            loading.close();
            this.updateVisible(false);
            this.$emit('reload');
          });
      },
      onClose() {
        this.selection = [];
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
    computed: {
      isCreateEnable() {
        return this.selection.length > 0 && this.selection;
      }
    },
    created() {}
  };
</script>
<style lang=""></style>
