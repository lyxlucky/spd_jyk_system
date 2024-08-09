<template lang="">
  <div class="">
    <ele-modal
      width="1000px"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="添加调库品种明细"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        height="60vh"
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
            <el-button
              type="primary"
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
  import { chooseDefPkgTableList } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferCreateDetail',
    props: ['visible'],
    components: {},
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
            slot: 'COUNT',
            label: '数量',
            minWidth: 100,
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
      createItem(){
        const isAllHaveCount = this.selection.every(item => item.COUNT > 0);
        if(!isAllHaveCount) return this.$message.error('请填写数量');
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
          return this.selection.length > 0;
        }
    },
  };
</script>
<style lang=""></style>
