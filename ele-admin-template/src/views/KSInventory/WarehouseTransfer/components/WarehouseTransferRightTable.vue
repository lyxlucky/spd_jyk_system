<template>
  <div class="warehouse-transfer-right">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">操作</div>
      <div class="spd-panel__body">
        <el-form size="mini" :inline="true" class="ele-form-search">
          <el-form-item class="ele-form-actions">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="!isDeleteEnable"
              @click="deleteItem()"
            >
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          highlight-current-row
          highlight-selection-row
          ref="table"
          class="data-table"
          size="mini"
          border
          :toolbar="false"
          :header-overflow-hidden="false"
          :height="tableHeight"
          :rowClickChecked="true"
          :initLoad="false"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="WarehouseTransferRightTable"
          @current-change="onCurrentChange"
        >
          <!-- <template v-slot:toolbar>
        <div>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="!isDeleteEnable"
            @click="deleteItem()"
            >删除</el-button
          >
        </div>
      </template> -->

          <template v-slot:TK_STAE="{ row }">
            <el-tag v-if="row.TK_STAE == 0" type="primary" size="mini">新增</el-tag>
            <el-tag v-if="row.TK_STAE == 1" type="success" size="mini">确认</el-tag>
          </template>
        </ele-pro-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getDEPT_TK_DEF,
    delDEPT_TK_DEF
  } from '@/api/KSInventory/WarehouseTransfer/index';
  export default {
    name: 'WarehouseTransferRightTable',
    data() {
      const defaultWhere = {};
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
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH',
            label: '批号',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        tableHeight: 'calc(100vh - 300px)',
        pageSize: 10,
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
        let data = getDEPT_TK_DEF({
          page,
          limit,
          where,
          order
        })
          .then((res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          })
        return data;
      },
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      deleteItem() {
        this.$confirm('是否删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = JSON.stringify(
            this.selection.map((item) => ({
              ID: item.ID
            }))
          );
          delDEPT_TK_DEF({ json: ids })
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.msg
              });
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: err
              });
            })
            .finally(() => {
              this.reload();
            });
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      isDeleteEnable(){
        return this.selection.length > 0;
      }
    },
    created() {
      localStorage.setItem('WarehouseTransferRightTableSize', JSON.stringify('mini'));
    },
    mounted() {
      this.$bus.$on(`${this.$route.path}/TriggerRightTablleReload`,() => {
        this.reload(this.where);
      })
      this.$bus.$on(`${this.$route.path}/MiddleTableChange`, ({ row }) => {
        if (row) {
          this.where = {
            TK_MAIN_ID: row.TK_MAIN_ID,
            TK_DEL_ID: row.ID
          };
          this.reload(this.where);
        }
      });
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/MiddleTableChange`);
      this.$bus.$off(`${this.$route.path}/TriggerRightTablleReload`);
    }
  };
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}
</style>
