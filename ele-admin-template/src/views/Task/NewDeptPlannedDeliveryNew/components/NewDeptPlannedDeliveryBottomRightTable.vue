<template>
  <div class="bottom-right-panel">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">备货明细操作</div>
      <div class="spd-panel__body">
        <el-form size="mini" :inline="true" class="ele-form-search" @submit.native.prevent>
          <el-form-item class="ele-form-actions" label-width="0">
            <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">备货明细列表</div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          class="data-table"
          size="mini"
          border
          stripe
          :toolbar="false"
          :header-overflow-hidden="false"
          :reserve-selection="true"
          highlight-current-row
          :row-click-checked="true"
          :init-load="false"
          :height="tableHeight"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="NewDeptPlannedDeliveryBottomRightTableCacheKey"
          key="NewDeptPlannedDeliveryBottomRightTableKey"
          @current-change="onCurrentChange"
        />
      </div>
    </div>
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
        tableHeight:
          'calc((100vh - var(--dept-plan-table-offset, 260px)) * var(--dept-plan-bottom-ratio, 0.32))',
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
            minWidth: 140
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
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
            minWidth: 140
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
            minWidth: 65
          },
          {
            prop: 'Stock_Up_Plan_Def_Quantity',
            label: '备货/包',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'Stock_Up_Plan_Goods_Quantity',
            label: '备货/散',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'ReceiptQty',
            label: '实收数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'RemainQty',
            label: '剩余备货',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
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
            minWidth: 120
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
    created() {
      localStorage.setItem(
        'NewDeptPlannedDeliveryBottomRightTableCacheKeyTableSize',
        JSON.stringify('mini')
      );
    },
    methods: {
      handleDelete() {},
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
<style scoped lang="scss">
.bottom-right-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}
</style>
