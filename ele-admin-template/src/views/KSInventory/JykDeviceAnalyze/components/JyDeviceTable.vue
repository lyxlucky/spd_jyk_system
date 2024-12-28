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
        <JyDeviceTableSearch @exportData="exportData"  @search="reload"/>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
import JyDeviceTableSearch from './JyDeviceTableSearch';
import { utils, writeFile } from 'xlsx';
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
            prop:"HC_SYRS",
            label: '耗材使用人次数',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (row, column, cellValue) => {
              return Number(row.GOODS_QTY) * Number(row.JYK_ZHB);
            }
          },
          {
            prop:"LY_PERCENTAGE",
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
      },
      calculatePercentage (xmCount, goodsQty, jykZhb) {
        const count = Number(xmCount) || 0;
        const qty = Number(goodsQty) || 0;
        const zhb = Number(jykZhb) || 0;
        
        // 避免除以零或非数值导致的 NaN 或 Infinity
        if (qty <= 0 || zhb <= 0 || !Number.isFinite(count) || !Number.isFinite(qty) || !Number.isFinite(zhb)) {
          return "0%";
        }

        const percentage = (count / (qty * zhb)) * 100;
        return isFinite(percentage) ? percentage.toFixed(2) + "%" : "0%";
      },
      exportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(() => {
        getJyDeviceTableList({
          page: 1,
          limit: 999999,
          where: data,
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '项目名',
                '品种编码',
                '品种名称',
                '包装规格',
                '单位',
                '理论人次',
                '耗材数量',
                '项目数量',
                '耗材使用人次数',
                '利用率'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.JYK_YQM,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME,
                d.SPECIFICATION_OR_TYPE,
                d.UNIT,
                d.JYK_ZHB,
                d.GOODS_QTY,
                d.XM_COUNT,
                Number(d.GOODS_QTY) * Number(d.JYK_ZHB),
                this.calculatePercentage(d.XM_COUNT, d.GOODS_QTY, d.JYK_ZHB)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '检验仪器分析.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
      }
    }
  };
</script>
<style lang=""></style>
