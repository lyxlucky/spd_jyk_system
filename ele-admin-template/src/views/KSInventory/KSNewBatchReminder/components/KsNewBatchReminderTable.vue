<template>
  <div class="ks-new-batch-reminder-table-wrap">
    <!-- 数据表格 -->
    <ele-pro-table
      :key="key"
      highlight-current-row
      ref="table"
      class="ks-new-batch-reminder-table"
      @current-change="onCurrentChange"
      :height="tableHeight"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :initLoad="false"
      cache-key="KsNewBatchReminderTable"
    >
      <template v-slot:operation="{ row }">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-check"
          @click="makeConfirmWithPic(row)"
        >
          上传定标报告
        </el-button>
      </template>

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
    <KsNewBatchReminderUpload
      @search="reload"
      :visible.sync="uploadIsVisible"
    />
  </div>
</template>

<script>
  import { BACK_BASE_URL } from '@/config/setting';
  import {
    getTableList,
    confirmBatch,
    makeItemRead
  } from '@/api/KSInventory/KSNewBatchReminder/index';
  import KsNewBatchReminderUpload from './KsNewBatchReminderUpload';
  export default {
    name: 'KsNewBatchReminderTable',
    components: {
      KsNewBatchReminderUpload
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
            minWidth: 60
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
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            prop: 'CREATE_MAN',
            label: '定标人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            align: 'center',
            minWidth: 120,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            slot: 'DB_FILE',
            label: '定标报告',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            slot: 'operation',
            label: '操作',
            showOverflowTooltip: true,
            minWidth: 80,
            align: 'center'
          }
        ],
        toolbar: false,
        tableHeight: 'calc(100vh - 320px)',
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        data: [],
        key: 0,
        uploadIsVisible: false
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
        this.$refs.table.reload({ page: 1, where });
      },
      makeConfirmWithPic(row) {
        this.$bus.$emit('makeConfirmWithPic', row);
        this.uploadIsVisible = true;
      },
      makeRead() {
        if (this.selection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
          return;
        }
        const ids = this.selection.map((item) => `${item.ID}`).join(',');
        this.$confirm('确定已读吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('正在处理中..');
            makeItemRead({ code: ids }).then((res) => {
              this.$message({
                type: 'success',
                message: '已读成功!'
              });
              loading.close();
            });
          })
          .catch((err) => {
            this.$message({
              type: 'info',
              message: err
            });
          })
          .finally(() => {
            this.reload();
          });
      },
      makeSure() {
        const ids = this.selection
          .map((item) => `'${item.VARIETIE_CODE_NEW}'`)
          .join(',');
        this.$confirm('确定定标吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('正在处理中..');
            confirmBatch({ code: ids }).then((res) => {
              this.$message({
                type: 'success',
                message: '定标成功!'
              });
              loading.close();
            });
          })
          .catch((err) => {
            this.$message({
              type: 'info',
              message: err
            });
          })
          .finally(() => {
            this.reload();
          });
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },
      updateTableHeight() {
        this.$nextTick(() => {
          const wrap = this.$el;
          const tableVm = this.$refs.table;
          if (!wrap || !tableVm || !tableVm.$el) return;

          const tableRoot = tableVm.$el;
          const elTable = tableRoot.querySelector('.el-table');
          const pagination = tableRoot.querySelector('.el-pagination');
          const paginationHeight = pagination ? pagination.offsetHeight + 8 : 48;

          if (!elTable) {
            const top = tableRoot.getBoundingClientRect().top;
            this.tableHeight = Math.max(window.innerHeight - top - paginationHeight - 12, 300) + 'px';
            return;
          }

          const tableBodyTop = elTable.getBoundingClientRect().top;
          const wrapBottom = wrap.getBoundingClientRect().bottom;
          const height = wrapBottom - tableBodyTop - paginationHeight;
          this.tableHeight = Math.max(height, 300) + 'px';
        });
      }
    },
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    },
    mounted() {
      this.updateTableHeight();
      setTimeout(this.updateTableHeight, 100);
      window.addEventListener('resize', this.updateTableHeight);
      this.$bus.$on('handleCommand', () => {
        this.reload();
      });
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateTableHeight);
      this.$bus.$off('handleCommand');
    }
  };
</script>

<style scoped lang="scss">
.ks-new-batch-reminder-table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ks-new-batch-reminder-table-wrap :deep(.ele-pro-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.image {
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  max-width: 100%;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
