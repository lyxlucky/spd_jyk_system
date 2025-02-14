<template lang="">
  <div>
    <ele-pro-table
      :reserve-selection="true"
      highlight-current-row
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
      cache-key="PriceReviewLeftTableCacheKey"
      key="PriceReviewLeftTableKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar> </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { utils, writeFile } from 'xlsx';
  import { getPekingApplication } from '@/api/MedicalInsuranceAudit/PriceReview/index';
  export default {
    name: 'priceReviewLeftTable',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        // 表格列配置
        columns: [
          {
            prop: 'APPLICATION_NUMBER',
            label: '申请单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'APPLICANT_CODE',
            label: '申请人编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'APPLICANT_NAME',
            label: '申请人名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'APPLICANT_DEPARTMENT',
            label: '申请部门',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'APPLICATION_TIME',
            label: '申请时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
            }
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
        let data = getPekingApplication({ page, limit, where, order }).then(
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
    }
  };
</script>
<style lang=""></style>
