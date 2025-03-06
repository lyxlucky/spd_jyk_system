<template lang="">
  <div class="">
    <ele-modal
      width="80%"
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="新批号提醒"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        height="50vh"
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
        cache-key="NewBatchReminderTableCacheKey"
      >
        <template v-slot:DB_FILE="{ row }">
          <div
            v-if="row.DB_FILE != null || row.DB_FILE != undefined"
            class="image-container"
            v-viewer
          >
            <img class="image" :src="BACK_BASE_URL + row.DB_FILE" />
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import { BACK_BASE_URL } from '@/config/setting';
  import { getTableList } from '@/api/KSInventory/KSNewBatchReminder/index';
  export default {
    name: 'NewBatchReminder',
    props: ['visible'],
    data() {
      const defaultWhere = {
        search: '',
        date: ''
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
            minWidth: 40
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
            }
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
            }
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 500
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '包装规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 200
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
            minWidth: 70,
            formatter: (row, column, cellValue) => {
              return Number(cellValue).toFixed(2);
            }
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 200
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 200
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
          },
          {
            slot: 'DB_FILE',
            label: '定标报告',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          }
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
      updateVisible(visible) {
        this.$emit('update:visible', visible);
      }
    },
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    }
  };
</script>
<style scoped>
  .image {
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px; /* 图片之间的间距 */
    max-width: 100%; /* 可根据需要设置最大宽度 */
  }
  .image-container {
    display: flex; /* 使用 Flexbox 布局 */
    flex-wrap: wrap; /* 允许图片换行 */
  }
</style>
