<template lang="">
    <div class="">
    <ele-modal
      width="60%"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="调库记录"
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
        cache-key="logCatTableCacheKey"
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
            <el-input style="width:200px" v-model="where.search" size='mini' placeholder="请输入调库订单"></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-left:10px"
              icon="el-icon-search"
              @click="searchItem()"
              >搜索</el-button
            >
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
import { getlogInfoTable } from '@/api/KSInventory/WarehouseTransfer/index';
export default {
    name:"LogCat",
    props: ['visible'],
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
            prop: 'TK_ORDER',
            label: '调库订单',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'TK_MAN',
            label: '调库人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TK_TIME',
            label: '调库时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'TJ_MAN',
            label: '提交人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TJ_TIME',
            label: '提交时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 230
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'QTY',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
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
        let data = getlogInfoTable({ page, limit, where, order }).then(
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
}
</script>
<style lang="">
    
</style>