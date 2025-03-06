<template lang="">
  <div>
    <div>
      <el-form
        class="ele-form-search"
        @keyup.enter.native="search"
        style="padding-bottom: 10px"
        @submit.native.prevent
      >
        <el-row type="flex" :gutter="10">
          <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
            <el-form-item>
              <el-button type='danger' size='mini' icon='el-icon-delete' @click="handleDelete">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="20vh"
      :initLoad="false"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="NewDeptPlannedDeliveryBottomRightTableCacheKey"
      key="NewDeptPlannedDeliveryBottomRightTableKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import { GetPickingInfo } from '@/api/Task/NewDeptPlannedDelivery';
  export default {
    name: 'NewDeptPlannedDeliveryBottomRightTable',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center'
          },
          {
            prop: 'REMARKS',
            label: '备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Varietie_Code_New',
            label: '品种(材料)编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Unit',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'Purchase_Price',
            label: '价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90,
            formatter: (_row, _column, cellValue) => {
              return Number(_row.Purchase_Price).toFixed(4)
                ? Number(_row.Purchase_Price).toFixed(4)
                : '';
            }
          },
          {
            prop: 'Coefficient',
            label: '系数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 55
          },
          {
            prop: 'Stock_Up_Plan_Def_Quantity',
            label: '备货/包',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Stock_Up_Plan_Goods_Quantity',
            label: '备货/散',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'ReceiptQty',
            label: '实收数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'RemainQty',
            label: '剩余备货',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              return (
                Number(_row.Stock_Up_Plan_Goods_Quantity) -
                Number(_row.ReceiptQty)
              );
            }
          },
          {
            prop: 'Plan_Time',
            label: '备货时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ],
        pageSize: 10,
        pageSizes: [10, 20, 40, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = GetPickingInfo({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(row) {
        this.current = row;
      }
    },
    mounted() {
      this.$nextTick(() => {
       this.$bus.$on('NewDeptPlannedDeliveryBottomLeftTableCurrentChange', (row) => {
          this.reload({ Stock_Up_Plan_No: row.Stock_Up_Plan_No });
        });
      });
    },
    beforeDestroy() {
      this.$bus.$off('NewDeptPlannedDeliveryBottomLeftTableCurrentChange');
    }
  };
</script>
<style lang=""></style>
