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
      :row-class-name="getRowClassName"
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
            审批
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
            打包收费
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-circle-plus"
            class="ele-btn-icon"
            @click="setCharge"
          >
            取消打包收费
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-scan"
            class="ele-btn-icon"
            @click="showScanDialog"
          >
            扫码添加录入
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

      <!-- 审核状态插槽 -->
      <template v-slot:DEPT_TWO_QTY="{ row }">
        <el-tag v-if="row.DEPT_TWO_QTY > 0" type="success" size="mini">
          已审核
        </el-tag>
        <el-tag
          v-else-if="row.DEPT_TWO_QTY == 0 || row.DEPT_TWO_QTY == '0'"
          type="warning"
          size="mini"
        >
          未审核
        </el-tag>
        <span v-else>{{ row.DEPT_TWO_QTY }}</span>
        /
        <span>{{ row.IS_XM == 1 ? '是' : '否' }}</span>
      </template>
    </ele-pro-table>

    <!-- 扫码添加录入弹框 -->
    <el-dialog
      title="扫码添加录入"
      :visible.sync="scanDialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="scanForm" label-width="80px">
        <el-form-item label="定数码">
          <el-input
            ref="defNoPkgCodeInput"
            v-model="scanForm.defNoPkgCode"
            placeholder="请输入定数码"
            clearable
            @keyup.enter.native="handleScanAdd"
            @input="handleScanInput"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="scanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleScanAdd" :loading="scanLoading">
          确定
        </el-button>
      </div>
    </el-dialog>
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

  /* 扫码录入行的绿色背景样式 */
  ::v-deep .el-table .scan-input-row {
    background-color: #e8f5e8 !important;
  }

  ::v-deep .el-table .scan-input-row:hover {
    background-color: #d4edda !important;
  }

  ::v-deep .el-table .scan-input-row td {
    background-color: #e8f5e8 !important;
  }

  ::v-deep .el-table .scan-input-row:hover td {
    background-color: #d4edda !important;
  }
</style>
<script>
  import {
    GetBdszZqsjMainUseDel,
    deleteUsedQty,
    upIS_XM,
    bdszyyLsAddDef
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
            // prop: 'DEPT_TWO_QTY',
            label: '审核状态/是否打包',
            align: 'center',
            width: 130,
            slot: 'DEPT_TWO_QTY'
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
          // {
          //   prop: 'IS_XM',
          //   label: '是否收费',
          //   align: 'center',
          //   width: 100,
          //   formatter: (row) => {
          //     if (row.IS_XM === 0 || row.IS_XM === '0') return '否';
          //     if (row.IS_XM === 1 || row.IS_XM === '1') return '是';
          //     return row.IS_XM;
          //   }
          // },
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
        parentCurrent: null,
        // 保存上次的请求参数
        lastRequestParams: null,
        // 扫码添加录入弹框
        scanDialogVisible: false,
        scanLoading: false,
        scanForm: {
          defNoPkgCode: ''
        },
        // 扫码自动提交相关
        scanInputTimer: null,
        lastInputTime: 0
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

        // 保存当前请求参数
        this.lastRequestParams = {
          page,
          limit,
          where: { ...where },
          order
        };

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
        this.totalCount = data?.list.length;
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
      getRowClassName({ row, rowIndex }) {
        if (row.REMARK == '扫码录入') {
          return 'scan-input-row';
        }
        return '';
      },
      cancel() {
        this.$bus.$emit('ConsumeableUsageDetailCancel', this.current);
      },
      approve() {
        // console.log(this.parentCurrent.DEPT_TWO_QTY);
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
                this.$message.error(err.msg);
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
        const ids = this.selection.map((row) => ({ ID: row.ID }));
        const loading = this.$messageLoading('设置中...');
        upIS_XM({ data: ids, state: '1' })
          .then((res) => {
            this.$message.success(res.msg || '设置成功');
            this.reload();
          })
          .catch((err) => {
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
        const ids = this.selection.map((row) => ({ ID: row.ID }));
        const loading = this.$messageLoading('设置中...');
        upIS_XM({ data: ids, state: '0' })
          .then((res) => {
            this.$message.success(res.msg || '设置成功');
            this.reload();
          })
          .catch((err) => {
            this.$message.error(err.msg || err || '设置失败');
          })
          .finally(() => {
            loading.close();
          });
      },
      // 显示扫码添加录入弹框
      showScanDialog() {
        if (
          this.parentCurrent == null ||
          Object.keys(this.parentCurrent).length == 0
        ) {
          return this.$message.warning('请先选择一条数据');
        }
        this.scanDialogVisible = true;
        this.scanForm.defNoPkgCode = '';
        // 等待DOM更新后聚焦输入框
        this.$nextTick(() => {
          this.$refs.defNoPkgCodeInput.focus();
        });
      },
      // 处理扫码添加录入
      async handleScanAdd() {
        // 防抖：如果正在处理中，直接返回
        if (this.scanLoading) {
          return;
        }

        if (!this.scanForm.defNoPkgCode.trim()) {
          this.$message.warning('请输入定数码');
          return;
        }

        this.scanLoading = true;
        const loading = this.$messageLoading('正在添加中...');
        try {
          const res = await bdszyyLsAddDef({
            SSBH: this.parentCurrent.SSBH,
            DEF_NO_PKG_CODE: this.scanForm.defNoPkgCode.trim()
          });
          this.$message.success(res.msg || '添加成功');
          // 清空输入框并重新聚焦
          this.scanForm.defNoPkgCode = '';
          this.reload(this.lastRequestParams?.where);
        } catch (err) {
          this.$message.error(err.msg || '添加失败');
        } finally {
          loading.close();
          this.scanLoading = false;
          // this.reload(this.lastRequestParams?.where);
          this.$nextTick(() => {
            this.$refs.defNoPkgCodeInput.focus();
          });
        }
      },
      // 处理扫码输入，自动检测扫码完成
      handleScanInput(value) {
        const currentTime = Date.now();
        this.lastInputTime = currentTime;

        // 清除之前的定时器
        if (this.scanInputTimer) {
          clearTimeout(this.scanInputTimer);
        }

        // 设置固定延迟时间
        const delay = 500;

        // 设置新的定时器，在指定延迟后自动提交
        this.scanInputTimer = setTimeout(() => {
          // 检查是否在延迟期间有新的输入
          if (Date.now() - this.lastInputTime >= delay - 50) {
            // 如果输入内容不为空，自动提交
            if (value && value.trim()) {
              this.handleScanAdd();
            }
          }
        }, delay);
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
      this.$bus.$on('SelectionAddDialogRefresh', () => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('AdVanceReceiptNumberDelTableCurrentChange');
      this.$bus.$off('ConsumeableUsageDetailApprove');
      this.$bus.$off('ConsumeableUsageDetailCancel');
      // 清理扫码定时器
      if (this.scanInputTimer) {
        clearTimeout(this.scanInputTimer);
      }
    }
  };
</script>
