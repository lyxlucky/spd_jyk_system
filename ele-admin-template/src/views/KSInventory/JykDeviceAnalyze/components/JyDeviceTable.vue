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
      cache-key="JyDeviceTableCacheKey"
      key="JyDeviceTableKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar> 
        <JyDeviceTableSearch  @search="reload"/>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
import JyDeviceTableSearch from './JyDeviceTableSearch';
import { getJyDeviceTableList } from '@/api/KSInventory/JykDeviceAnalyze';
  export default {
    name: 'JyDeviceTable',
    components: {
      JyDeviceTableSearch
    },
    data() {
      const defaultWhere = {
        code:"",
      };
      return {
        where: { ...defaultWhere },
        // 表格列配置
        columns: [
          {
            prop: 'JYK_YQM',
            label: '项目名',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 160
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 380
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60
          },
          {
            prop: 'JYK_ZHB',
            label: '理论人次',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'PROJECT_NAME',
            label: '项目名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'GOODS_QTY',
            label: '耗材数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'XM_COUNT',
            label: '项目数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          // asda
          {
            label: '耗材使用人次数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              return Number(row.GOODS_QTY) * Number(row.JYK_ZHB);
            }
          },
          {
            label: '利用率',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              const xmCount = Number(row.XM_COUNT) || 0;
              const goodsQty = Number(row.GOODS_QTY) || 0;
              const jykZhb = Number(row.JYK_ZHB) || 0;

              // 避免除零错误
              if (goodsQty === 0 || jykZhb === 0) {
                return "0%";
              }
              // 计算百分比
              const percentage = (xmCount / (goodsQty * jykZhb)) * 100;
              // 保留两位小数
              return percentage.toFixed(2) + "%";
            }
          }
        ],
        toolbar: false,
        pageSize: 10,
        pageSizes: [2, 10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getJyDeviceTableList({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      // 表格行点击事件
      onCurrentChange(row) {
        this.current = row;
      }
    }
  };
</script>
<style lang=""></style>
