<template>
  <div class="ele-box">
    <!-- 数据表格 -->

    <div class="search-toolbar">
      <AdvanceReceiptNumberSearch
        @search="reload"
        @approve="handleApprove"
        @catDefNoPkgCode="handleCatDefNoPkgCode"
        @handleScanQrCode="handleScanQrCode"
        :rowData="current"
        style="padding: 0px"
      />
      <AdvanceReceiptNumberEdit
        @search="reload"
        :visible.sync="showEdit"
        :rowData="current"
      />
    </div>

    <ele-pro-table
      size="mini"
      height="30vh"
      highlight-current-row
      @current-change="onCurrentChange"
      :row-class-name="tableRowClassName"
      ref="table"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="true"
      :datasource="datasource"
      :selection.sync="selection"
      :toolkit="[]"
      cache-key="ApplyTempTable"
    >
      <!-- 表头工具栏 -->
      <!-- <template v-slot:toolbar>
        <div class="search-toolbar">
          <AdvanceReceiptNumberSearch
            @search="reload"
            @approve="handleApprove"
            @catDefNoPkgCode="handleCatDefNoPkgCode"
            @handleScanQrCode="handleScanQrCode"
            :rowData="current"
            style="padding: 0px"
          />
          <AdvanceReceiptNumberEdit
            @search="reload"
            :visible.sync="showEdit"
            :rowData="current"
          />
        </div>
      </template> -->
    </ele-pro-table>
  </div>
</template>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }

  :deep(.el-card__body) {
    padding: 0px;
  }

  .search-toolbar {
    display: flex;
  }

  .ele-box {
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
  }
</style>

<script>
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
  import {
    getBdSzYyHisSs,
    BdSsApprove,
    commitBdszSsyyInfo
  } from '@/api/Task/SurgicalVerification';
  import { HOME_HP, BACK_BASE_URL } from '@/config/setting';
  import { load } from '@amap/amap-jsapi-loader';
  export default {
    name: 'ApplyTempTable',
    components: {
      AdvanceReceiptNumberSearch,
      AdvanceReceiptNumberEdit
    },
    data() {
      return {
        // 表格列配置
        columns: [
          // {
          //   prop: 'MZZY',
          //   label: '类别',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 100,
          //   formatter: (_row, _column, cellValue) => {
          //     if (cellValue == '1') return '门诊';
          //     if (cellValue == '2') return '住院';
          //   }
          // },
          {
            prop: 'SSRQ',
            label: '手术时间',
            align: 'center',
            showOverflowTooltip: true,
            width: 120,
            formatter: (row, column, cellValue, index) => {
              return this.$util.toDateString(cellValue, 'YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            prop: 'STATE',
            label: '状态',
            align: 'center',
            width: 75,
            formatter: (row, column, cellValue) => {
              switch (cellValue) {
                case '1':
                  return '已提交';
                case '2':
                  return '已拣配';
                case '3':
                  return '已交接';
                case '4':
                  return '已完成';
                default:
                  return '未知状态';
              }
            }
          },
          {
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 70
          },
          {
            prop: 'SSFJ',
            label: '术间',
            align: 'center',
            width: 70
          },
          {
            prop: 'SSTH',
            label: '手术台号',
            align: 'center',
            width: 75
          },
          {
            prop: 'ZYHM',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'BRXM',
            label: '姓名',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70,
            formatter: (row, column, cellValue) => {
              if (!cellValue || cellValue.length == 2)
                return cellValue[0] + '*';
              const firstChar = cellValue[0];
              const lastChar = cellValue[cellValue.length - 1];
              const middleStars = '*'.repeat(cellValue.length - 2);
              return firstChar + middleStars + lastChar;
            }
          },

          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          }
          // {
          //   columnKey: 'action',
          //   label: '操作',
          //   width: 150,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true
          //   //fixed: 'right'
          // }
        ],
        paginationStyle: {
          height: '18px',
          padding: '0px 0px 5px 0px',
          'margin-top': '-5px'
        },
        toolbar: false,
        pageSize: 100,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        // datasource: [],
        data: []
      };
    },
    methods: {
      /* 表格数据源 */
      async datasource({ page, limit, where, order }) {
        const res = await getBdSzYyHisSs({
          page,
          limit,
          where,
          order
        });
        return { list: res.data, count: res.total };
      },
      /* 刷新表格 */
      reload(where) {
        console.log({ where: where });
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },
      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      },
      handleApprove() {
        if (this.current == null) {
          return this.$message.warning('请先选择一条数据');
        }
        const loading = this.$messageLoading('审批中...');
        //return
        BdSsApprove({ qdid: this.current.SSBH })
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
      },
      handleCatDefNoPkgCode() {
        if (this.current == null) {
          return this.$message.warning('请先选择一条数据');
        }
        window.open(
          `${BACK_BASE_URL}/api/Abdzczh/GetTagQdMx?id=67&format=pdf&inline=true&qdid=${this.current.SSBH}&Token=${sessionStorage.Token}`
        );
      },
      //不为空
      handleScanQrCode(data) {
        this.$prompt('请输入手术编号', '扫码交接', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入手术编号'
        })
          .then(({ value }) => {
            if (value == undefined)
              return this.$message.error('请输入手术编号');
            commitBdszSsyyInfo({
              spd: 'PDA123#1',
              pdaMan: this.$store.state.user.info.UserName,
              ID: value,
              TJ_STATE: 2
            })
              .then((res) => {
                this.$message.success(res.msg);
              })
              .catch((err) => {
                this.$message.error(err);
              });
          })
          .catch(() => {})
          .finally(() => {
            this.reload();
          });
      }
    },
    mounted() {
      this.$bus.$on(
        'handleSubmitConsumeVarietiesAndRefreshTopTable',
        (data) => {
          this.reload();
        }
      );
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });

      this.$bus.$on('AdVanceReceiptNumberDelTableReload', () => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
      this.$bus.$off('AdVanceReceiptNumberDelTableReload');
      this.$bus.$off('handleSubmitConsumeVarietiesAndRefreshTopTable');
      this.$bus.$off('AdvanceReceiptNumberTableCurrent');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
