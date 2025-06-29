<template>
  <div class="ele-box">
    <!-- 数据表格 -->

    <!-- 
      @approve="handleApprove"
      @catDefNoPkgCode="handleCatDefNoPkgCode" 
    -->
    <div class="search-toolbar">
      <AdvanceReceiptNumberSearch
        ref="formRef"
        @search="reload"
        @handleScanQrCode="handleScanQrCode"
        @catDefNoPkgCode="handleCatDefNoPkgCode"
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
      class="style-table"
      size="mini"
      height="30vh"
      :initLoad="false"
      highlight-current-row
      @current-change="onCurrentChange"
      :row-class-name="tableRowClassName"
      ref="table"
      :rowClickChecked="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="true"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="ApplyTempTable"
      :toolbar="false"
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

      <template v-slot:ACTION="{ row }">
        <!-- <el-button
          size="mini"
          icon="el-icon-edit"
          @click="handleEditItem(row)"
          type="primary"
          >转单</el-button
        > -->
        <el-button
          size="mini"
          type="primary"
          :disabled="row.STATE == '4'"
          @click="handleIntraoperativeHandover(row)"
          >接班</el-button
        >
      </template>
    </ele-pro-table>

    <UpdateUserInfoDialog
      @reload="reload"
      :visible.sync="updateUserInfoDialogVisible"
    ></UpdateUserInfoDialog>
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/common.scss';
  /* .el-table .warning-row {
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
    max-height: 100%;
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
  :deep(.ele-box .el-table) {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-basis: 0;
  }
  .ele-box .el-table .el-table__body-wrapper {
    display: none !important;
    flex: 1;
    overflow: auto;
    flex-basis: 0;
    flex-shrink: 0;
    max-height: calc(100vh - 200px);
  }
  .ele-box .ele-pro-table .el-pagination {
    margin-top: 7px !important;
    padding: 0px 0;
    box-sizing: border-box;
  } */
</style>

<script>
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
  import UpdateUserInfoDialog from '@/views/Task/OPSConsumables/components/UpdateUserInfoDialog';

  import {
    getBdSzYyHisSs,
    BdSsApprove,
    commitBdszSsyyInfo,
    addBdSzHisInSurgery,
    cancelBdszApprove
  } from '@/api/Task/SurgicalVerification';
  import { HOME_HP, BACK_BASE_URL } from '@/config/setting';

  export default {
    name: 'ApplyTempTable',
    props: {},
    components: {
      AdvanceReceiptNumberSearch,
      AdvanceReceiptNumberEdit,
      UpdateUserInfoDialog
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
            prop: 'SSFJ',
            label: '术间',
            align: 'center',
            width: 85,
            sortable: true
          },
          {
            prop: 'SSTH',
            label: '手术台号',
            align: 'center',
            width: 90
          },
          {
            prop: 'ZYHM',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'BRXM',
            label: '姓名',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
            // formatter: (row, column, cellValue) => {
            //   if (!cellValue) {
            //     return '';
            //   }
            //   if (cellValue.length == 1) {
            //     return cellValue + '*';
            //   }
            //   if (!cellValue || cellValue.length == 2)
            //     return cellValue[0] + '*';

            //   const firstChar = cellValue[0];
            //   const lastChar = cellValue[cellValue.length - 1];
            //   const middleStars = '*'.repeat(cellValue.length - 2);
            //   return firstChar + middleStars + lastChar;
            // }
          },

          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            label: '操作',
            width: 160,
            align: 'center',
            slot: 'ACTION'
          },
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
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 70
          },
          {
            prop: 'KSMC',
            label: '科室',
            align: 'center',
            width: 70
          }
        ],
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
        data: [],
        updateUserInfoDialogVisible: false
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        //获取当前日期
        return getBdSzYyHisSs({
          page,
          limit,
          where,
          order
        }).then((data) => {
          const sortedList = (data.data || []).sort((a, b) => {
            const aHasLS = a.SSBH.includes('LS');
            const bHasLS = b.SSBH.includes('LS');
            // 两个都包含LS或都不包含LS - 保持原顺序
            if (aHasLS == bHasLS) return 0;
            // 仅a包含LS - a排在前面
            if (aHasLS) return -1;
            // 仅b包含LS - b排在前面
            return 1;
          });

          return { list: sortedList, count: data.total };
        });
      },

      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },

      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
        this.$bus.$emit('AdvanceReceiptNumberTableCurrent', current);
      },
      tableRowClassName({ row, rowIndex }) {
        if (row?.SSBH.indexOf('LS') != -1) {
          return 'danger-row';
        } else {
          return '';
        }
      },
      handleEditItem(data) {
        this.$bus.$emit('AdvanceReceiptNumberTableDialogCurrent', data);
        this.updateUserInfoDialogVisible = true;
      },
      handleApprove() {
        return new Promise((resolve, reject) => {
          if (this.current == null) {
            return this.$message.warning('请先选择一条数据');
          }
          const loading = this.$messageLoading('审批中...');
          //return
          BdSsApprove({ qdid: this.current.SSBH })
            .then((res) => {
              this.$message.success(res.msg);
              resolve();
            })
            .catch((err) => {
              this.$message.error(err.msg);
              reject();
            })
            .finally(() => {
              loading.close();
              this.reload();
            });
        });
      },
      handleCatDefNoPkgCode() {
        return new Promise((resolve, reject) => {
          if (this.current == null) {
            return this.$message.warning('请先选择一条数据');
          }
          window.open(
            `${BACK_BASE_URL}/api/Abdzczh/GetTagQdMx?id=67&format=pdf&inline=true&qdid=${this.current.SSBH}&Token=${sessionStorage.Token}`
          );
          resolve();
        });
      },
      //术中交接
      handleIntraoperativeHandover(row) {
        console.log(row);
        if (!row) {
          return this.$message.warning('请先选择一条数据');
        }
        this.$prompt('请输入备注信息', '接班', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入备注信息'
        })
          .then(({ value }) => {
            let loading = this.$messageLoading('正在处理中...');
            addBdSzHisInSurgery({
              SSBH: row.SSBH,
              REMARK: value || ''
            })
              .then((res) => {
                loading.close();
                this.$message.success('术中交接成功');
                this.reload();
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err);
              });
          })
          .catch(() => {});
      },

      handleScanQrCode(data) {
        this.$prompt('请输入手术编号', '扫码交接', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入手术编号'
        })
          .then(({ value }) => {
            if (value == undefined)
              return this.$message.error('请输入手术编号');
            this.$bus.$emit(
              'AdvanceReceiptNumberTableDialogCurrentSSBHChange',
              value
            );
            commitBdszSsyyInfo({
              spd: 'PDA123#1',
              pdaMan: this.$store.state.user.info.UserName,
              ID: value,
              TJ_STATE: 3
            })
              .then((res) => {
                this.$message.success(res.msg);
                this.$refs.formRef.where.MZZY = '3';
                this.reload({ SSBH: value });
              })
              .catch((err) => {
                this.$message.error(err);
              });
          })
          .catch(() => {})
          .finally(() => {});
      },
      handleCancel() {
        if (this.current == null)
          return this.$message.warning('请先选择一条数据');
        this.$confirm('是否确定取消审批？', '提示', {
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('取消中...');
            cancelBdszApprove({
              SSBH: this.current.SSBH
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

      this.$bus.$on('ConsumeableUsageDetailApprove', () => {
        this.handleApprove()
          .then(() => {
            this.handleCatDefNoPkgCode();
          })
          .catch((e) => {
            console.log(e);
          });
      });

      this.$bus.$on('ConsumeableUsageDetailCancel', () => {
        this.handleCancel();
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
      this.$bus.$off('AdvanceReceiptNumberTableDialogCurrent');
      this.$bus.$off('AdvanceReceiptNumberTableDialogCurrentSSBHChange');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
      this.$nextTick(() => {
        this.$refs.formRef.search();
      });
    }
  };
</script>
<style scoped>
  ::v-deep(.warning-row) {
    background-color: #fdf6ec;
  }

  ::v-deep(.success-row) {
    /* background-color: #f0f9eb; */
    background-color: #f0f9eb00;
    color: #67c23a;
  }

  ::v-deep(.info-row) {
    background-color: #f4f4f5;
  }

  ::v-deep(.danger-row) > td,
  ::v-deep(.el-table--striped .danger-row.el-table__row--striped > td),
  ::v-deep(.danger-row.hover-row > td),
  ::v-deep(.danger-row:hover > td) {
    background-color: #fef0f0;
  }
</style>
