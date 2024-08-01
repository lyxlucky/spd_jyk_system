<template lang="">
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table
      :key="key"
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="60vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="KsNewBatchReminderTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <KsNewBatchReminderTableSearch @sure="makeSure" @search="reload"/>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { getTableList,confirmBatch } from '@/api/KSInventory/KSNewBatchReminder/index';
  import KsNewBatchReminderTableSearch from './KsNewBatchReminderTableSearch';
  export default {
    name: 'KsNewBatchReminderTable',
    components: {
      KsNewBatchReminderTableSearch
    },
    data() {
      return {
        // 表格列配置
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'GOODS_QTY',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'PRICE',
            label: '价格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'CREATE_TIME',
            label: '定标时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70,
            formatter: (_row, _column, cellValue) => {
                return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'CREATE_MAN',
            label: '定标人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          }
        ],
        toolbar: false,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        data: [],
        key: 0
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        let data = getTableList({
          page,
          limit,
          where,
          order
        }).then((res) => {
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
      makeSure(){
        const ids = this.selection.map((item) => item.ID).join(',');
        this.$confirm('确定定标吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$messageLoading('正在处理中..');
          confirmBatch({code:ids}).then((res) => {
            this.$message({
              type: 'success',
              message: '定标成功!'
            });
            loading.close();
            this.reload();
          });
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: err
          });
        });
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      }
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    beforeDestroy() {
      this.$bus.$off('handleCommand');
    }
  };
</script>
<style lang=""></style>
