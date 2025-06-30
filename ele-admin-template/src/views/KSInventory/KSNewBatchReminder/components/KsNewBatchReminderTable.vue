<template>
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
      :initLoad="false"
      cache-key="KsNewBatchReminderTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <KsNewBatchReminderTableSearch
          @sure="makeSure"
          @makeRead="makeRead"
          @search="reload"
        />
      </template>

      <template v-slot:operation="{ row }">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-check"
          @click="makeConfirmWithPic(row)"
          >上传定标报告</el-button
        >
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
  import KsNewBatchReminderTableSearch from './KsNewBatchReminderTableSearch';
  import KsNewBatchReminderUpload from './KsNewBatchReminderUpload';
  export default {
    name: 'KsNewBatchReminderTable',
    components: {
      KsNewBatchReminderTableSearch,
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
            minWidth: 70
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
        this.$refs.table.reload({ page: 1, where: where });
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
      }
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    },
    beforeDestroy() {
      this.$bus.$off('handleCommand');
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
