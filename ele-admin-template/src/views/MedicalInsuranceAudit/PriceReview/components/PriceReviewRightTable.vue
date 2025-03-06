<template lang="">
  <div>
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
      :initLoad="false"
      @current-change="onCurrentChange"
      ref="table"
      height="70vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="PriceReviewRightTableCacheKey"
      key="PriceReviewRightTableKey"
    >
    
      <!-- 表头工具栏 -->
      <template v-slot:toolbar> </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { getPekingApplicationDTL } from '@/api/MedicalInsuranceAudit/PriceReview/index.js';
  export default {
    name: 'PriceReviewRightTable',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        // 表格列配置
        columns: [
          {
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'MATERIAL_CODE',
            label: '物资编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MATERIAL_NAME',
            label: '物资名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SPECIFICATION',
            label: '规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MODEL',
            label: '型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MEDICAL_MATERIAL_CODE',
            label: '医保耗材编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'PURCHASE_PRICE',
            label: '采购价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'APPLY_DEPARTMENT',
            label: '申请科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'CHARGE_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'CATEGORY',
            label: '类别',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'IS_FORCE_SCAN_CHARGE',
            label: '是否强制扫码收费',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'VJ1_LICENSE_NUMBER',
            label: 'VJ1总代经营许可证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VJ1_LICENSE_VALID_DATE',
            label: '证件有效期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'VJ_SUP_LICENSE_NUMBER',
            label: 'VJ供应商经营许可证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
        ],
        toolbar: false,
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
        let data = getPekingApplicationDTL({ page, limit, where, order }).then(
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
      onCurrentChange(row) {}
    },
    created() {}
  };
</script>
<style lang=""></style>
