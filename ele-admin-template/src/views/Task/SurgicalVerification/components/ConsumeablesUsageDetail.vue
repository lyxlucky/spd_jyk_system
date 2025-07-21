<template lang="">
  <div class="ele-box">
    <ele-pro-table
      class="style-table"
      size="mini"
      ref="table"
      height="12vh"
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
      <template v-slot:toolbar>
        <div>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            class="ele-btn-icon"
            @click="approve"
          >
            护士审批
          </el-button>

          <el-button
            size="mini"
            type="danger"
            class="ele-btn-icon"
            @click="cancel"
          >
            取消审批
          </el-button>

          <el-button
            size="mini"
            type="primary"
            class="ele-btn-icon"
            icon="el-icon-reading"
            @click="catDefNoPkgCode"
          >
            查看定数码标签
          </el-button>
          <el-button
            size="mini"
            type="warning"
            class="ele-btn-icon"
            icon="el-icon-remove"
            @click="setNoCharge"
          >
            设置不收费
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-circle-plus"
            class="ele-btn-icon"
            @click="setCharge"
          >
            设置收费
          </el-button>
        </div>
      </template>

      <template v-slot:toolkit>
        <div>
          <span
            >耗材总数量:<el-tag type="success">{{ totalCount }}</el-tag></span
          >
        </div>
      </template>

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
<style scoped lang="scss">
  @import '@/styles/common.scss';
  /* .ele-box {
    background-color: white;
    height: 100%;
    box-sizing: border-box;
  }
  .ele-box .ele-box {
    padding: 10px;
  }

  .ele-box,
  .ele-box .ele-pro-table {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table .el-table__body-wrapper {
    flex: 1;
    overflow: auto;
    flex-basis: 0;
    max-height: calc(100vh - 200px);
  }
  .ele-box .ele-pro-table .el-pagination {
    margin-top: 7px !important;
    padding: 0px 0;
    box-sizing: border-box;
  } */
</style>
<script>
  import {
    GetBdszZqsjMainUseDel,
    deleteUsedQty,
    upIS_XM
  } from '@/api/Task/SurgicalVerification';
  import { BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'ConsumeablesUsageDetail',
    props: ['masterCurrentData'],
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
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
            label: '数量',
            align: 'center',
            width: 80,
            formatter: (row, column, cellValue) => {
              return 1;
            }
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
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            width: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'IS_XM',
            label: '是否收费',
            align: 'center',
            width: 100,
            formatter: (row) => {
              if (row.IS_XM === 0 || row.IS_XM === '0') return '是';
              if (row.IS_XM === 1 || row.IS_XM === '1') return '否';
              return row.IS_XM;
            },
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
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
            align: 'center',
            width: 130
          }
        ],
        totalCount: 0,
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
    watch: {
      masterCurrentData: {
        handler(newVal) {
          this.parentCurrent = newVal;
          this.reload();
        },
        immediate: true
      }
    },
    methods: {
      async datasource({ page, limit, where, order }) {
        where.SSBH = this.parentCurrent?.SSBH;
        let data = await GetBdszZqsjMainUseDel({
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
        // this.totalCount = data.list.reduce((pre, cur) => {
        //   return pre + cur.TRUE_PS_QTY;
        // }, 0);
        this.totalCount = data?.list.length
        return data;
      },
      catDefNoPkgCode() {
        console.log(this.parentCurrent);
        if (
          this.parentCurrent == null ||
          Object.keys(this.parentCurrent).length == 0
        ) {
          return this.$message.warning('请先选择一条数据');
        }
        window.open(
          `${BACK_BASE_URL}/api/Abdzczh/GetTagQdMx?id=67&format=pdf&inline=true&qdid=${this.parentCurrent.SSBH}&Token=${sessionStorage.Token}`
        );
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      cancel() {
        this.$bus.$emit('ConsumeableUsageDetailCancel', this.current);
      },
      approve() {
        this.$bus.$emit('ConsumeableUsageDetailApprove', this.current);
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
      },
      setNoCharge() {
        if (!this.selection.length) {
          this.$message.warning('请先选择要设置为不收费的记录');
          return;
        }
        // const ids = this.selection.map(row => ({ ID: row.ID }));
        const loading = this.$messageLoading('设置中...');
        upIS_XM({ data: this.selection, state: '1' })
          .then(res => {
            this.$message.success(res.msg || '设置成功');
            this.reload();
          })
          .catch(err => {
            this.$message.error(err.msg || err || '设置失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      setCharge() {
        if (!this.selection.length) {
          this.$message.warning('请先选择要设置为收费的记录');
          return;
        }
        // const ids = this.selection.map(row => ({ ID: row.ID }));
        const loading = this.$messageLoading('设置中...');
        upIS_XM({ data: this.selection, state: '0' })
          .then(res => {
            this.$message.success(res.msg || '设置成功');
            this.reload();
          })
          .catch(err => {
            this.$message.error(err.msg || err || '设置失败');
          })
          .finally(() => {
            loading.close();
          });
      },
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
      this.$bus.$on('SelectionAddDialogRefresh', () => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('AdVanceReceiptNumberDelTableCurrentChange');
      this.$bus.$off('ConsumeableUsageDetailApprove');
      this.$bus.$off('ConsumeableUsageDetailCancel');
    }
  };
</script>
