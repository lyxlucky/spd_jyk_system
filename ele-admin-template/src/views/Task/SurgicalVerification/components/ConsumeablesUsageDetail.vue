<template lang="">
  <div>
    <ele-pro-table
      ref="table"
      :rowClickCheckedIntelligent="false"
      height="50%"
      highlight-current-row
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      cache-key="ConsumeablesUsageDetailCacheKey"
    >
    </ele-pro-table>
  </div>
</template>
<script>
  import { GetBdszZqsjMainUseDel } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'ConsumeablesUsageDetail',
    props:['masterCurrentData'],
    data() {
      return {
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
            align: 'center',
            width: 130
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 130
          },

          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            width: 130
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            width: 130
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            width: 80
          },
          {
            prop: 'PRICE',
            label: '单价',
            align: 'center',
            width: 80
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            width: 130
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            width: 130
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效日期',
            align: 'center',
            width: 130
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            width: 130
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            width: 130
          }
        ],
        toolbar: false,
        pageSize: 50,
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
        where.SSBH = this.masterCurrentData.SSBH;
        let data = GetBdszZqsjMainUseDel({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.data
          };
          return tData;
        });
        return data;
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    created() {
      this.$bus.$on('AdVanceReceiptNumberDelTableReload', () => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('AdVanceReceiptNumberDelTableReload');
    }
  };
</script>
<style lang=""></style>
