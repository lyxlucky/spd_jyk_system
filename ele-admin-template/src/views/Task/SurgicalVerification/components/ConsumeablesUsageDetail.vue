<template lang="">
  <div class="ele-box">
    <ele-pro-table
      size="mini"
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
      <!-- 左表头 -->
      <template v-slot:ACTION="{ row }">
        <!-- 搜索表单 -->
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          class="ele-btn-icon"
          @click="handleRemove(row)"
        >
          剔除
        </el-button>
      </template>
    </ele-pro-table>
  </div>
</template>
<style scoped></style>
<script>
  import {
    GetBdszZqsjMainUseDel,
    deleteUsedQty
  } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'ConsumeablesUsageDetail',
    props: ['masterCurrentData'],
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
            width: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            width: 130,
            showOverflowTooltip: true
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
            width: 130,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue, 'YYYY-MM-DD');
            }
          },
          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效日期',
            align: 'center',
            width: 130,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue, 'YYYY-MM-DD');
            }
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            width: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            width: 130,
            showOverflowTooltip: true
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
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
        current: null,
        parentCurrent: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        where.SSBH = this.parentCurrent?.SSBH;
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
        const formatWhere = {
          ...where,
          SSBH: this.parentCurrent?.SSBH
        };
        this.$refs.table.reload({ page: 1, where: formatWhere });
      },
      handleRemove(row) {
        this.$confirm('是否剔除该记录？', '提示', {
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('剔除中...');
            deleteUsedQty({
              ID: row.ID
            })
              .then((res) => {
                this.$message.success(res.msg);
              })
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                loading.close();
                this.reload();
              });
          })
          .catch(() => {});
      }
    },
    created() {
      this.$bus.$on('AdVanceReceiptNumberDelTableCurrentChange', () => {
        this.reload();
      });
      this.$bus.$on('UdiScanDialogClosed', (current) => {
        this.reload();
      });
      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (current) => {
        this.parentCurrent = current;
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('AdVanceReceiptNumberDelTableCurrentChange');
    }
  };
</script>
