<template lang="">
  <div>
    <ele-modal
      title="耗材清单"
      :destroy-on-close="true"
      @open="handleOpen"
      width="90%"
      top="1vh"
      :visible="visible"
      :close-on-click-modal="true"
      @update:visible="updateVisible(false)"
    >
      <ele-pro-table
        size="mini"
        ref="table"
        highlight-current-row
        height="70vh"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        @select-all="onSelectAll"
        @current-change="onCurrentChange"
        cache-key="SelectionAddDialogTableCacheKey"
        :row-class-name="tableRowClassName"
      >
        <template slot="toolbar">
          <div class="form-box">
            <div>
              <el-button
                size="mini"
                icon="el-icon-close"
                @click="updateVisible(false)"
                >取 消</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-check"
                type="primary"
                @click="submitItem"
                >确认使用</el-button
              >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-scan"
                @click="handleScanCode"
                >扫UDI码</el-button
              >
              <span>已勾选:<el-tag size="mini" effect="plain">{{selection?.length || 0}}</el-tag></span>
            </div>
            <div>
              <el-button size="mini" type="success" @click="showNewUse"
                >转移至新手术单</el-button
              >
            </div>
          </div>
        </template>
      </ele-pro-table>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          icon="el-icon-close"
          @click="updateVisible(false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="submitItem"
          >确 定</el-button
        >
      </span> -->
    </ele-modal>

    <el-dialog
      title="转移至新手术单"
      :visible.sync="isShowNewUse"
      width="80%"
      top="1vh"
      destroy-on-close
    >
      <NewUse
        :selection="selection"
        @close="isShowNewUse = false"
        :ApplyTempTableData="ApplyTempTableData"
      ></NewUse>
    </el-dialog>

    <!-- 扫码反选弹窗 -->
    <el-dialog
      title="扫UDI"
      :visible.sync="scanDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-input
        ref="scanInput"
        v-model="scanCode"
        placeholder="请输入或扫描条码"
        clearable
        @keyup.enter.native="handleScanConfirm"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scanDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleScanConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    GetBdszZqsjMainNoUseDel,
    addBdszZqsjMainPsDelUseV2,
    getBdszScanInfo
  } from '@/api/Task/SurgicalVerification';
  import NewUse from './NewUse.vue';
  export default {
    name: 'selectionAddDialog',
    components: {
      NewUse
    },
    props: ['visible', 'ApplyTempTableData'],
    data() {
      return {
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            minWidth: 45,
            align: 'center',
            fixed: 'left'
          },
          
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
          {
            prop: 'PRICE',
            label: '价格',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },

          {
            prop: 'BATCH_PRODUCTION_DATE',
            label: '生产日期',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true,
            formatter: (row) => {
              return this.$moment(row.BATCH_PRODUCTION_DATE).format('YYYY-MM-DD');
            }
          },

          {
            prop: 'BATCH_VALIDITY_PERIOD',
            label: '有效期',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true,
            formatter: (row) => {
              return this.$moment(row.BATCH_VALIDITY_PERIOD).format('YYYY-MM-DD');
            }
          },

          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            minWidth: 130,
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            minWidth: 130,
            show: false,
            showOverflowTooltip: true
          },
        ],
        pageSize: 50,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        lastSelection: [],
        isSelectAll: false,
        // 当前编辑数据
        current: null,
        AdvanceNumberTableCurrent: null,
        isShowNewUse: false,
        scanDialogVisible: false,
        scanCode: '',
        isMock: false, // 是否使用假数据，开发时可开启,
      };
    },
    methods: {
      onSelectAll(selection) {
        const tableData = this.$refs.table.tableData || [];
        if (selection.length) {
          // 全选
          this.selection = tableData;
        } else {
          // 取消全选
          this.$refs.table.clearSelection();
        }
      },
      async datasource({ page, limit, where, order }) {
        where = {
          ...where,
          SSBH: this.AdvanceNumberTableCurrent?.SSBH
        };
        // 判断是否用假数据
        if (this.isMock) {
          // 生成假数据
          const mockList = [];
          for (let i = 0; i < limit; i++) {
            mockList.push({
              ID: i + 1 + (page - 1) * limit,
              DEF_NO_PKG_CODE: 'PKG' + (1000 + i),
              VARIETIE_CODE_NEW: 'VCN' + (2000 + i),
              VARIETIE_NAME: '品种' + (i + 1),
              SPECIFICATION_OR_TYPE: '型号' + (i + 1),
              UNIT: '个',
              PRICE: (Math.random() * 100).toFixed(2),
              BATCH: 'BATCH' + (i + 1),
              BATCH_PRODUCTION_DATE: new Date().toISOString(),
              BATCH_VALIDITY_PERIOD: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
              APPROVAL_NUMBER: 'APPROVAL' + (i + 1),
              MANUFACTURING_ENT_NAME: '企业' + (i + 1),
              //canSelect: Math.random() > 0.5 // 随机可选/不可选
            });
          }
          return {
            count: 100,
            list: mockList
          };
        }

        const res = await GetBdszZqsjMainNoUseDel({
          page,
          limit,
          where,
          order
        }).then((res) => {
          if (res.code !== 200) {
            return {
              total: 0,
              data: []
            };
          }
          return {
            total: res.total,
            data: res.data
          };
        });
        return {
          count: res.total,
          list: res.data
        };
      },
      onCurrentChange(current) {
        console.log(current)
        this.current = current;
      },

      handleOpen(){
        this.selection = [];
      },

      onSelectionChange(selection) {
        // const tableData = this.$refs.table.tableData || [];
        // // 如果是全选，不做过滤
        // if (selection.length === tableData.length) {
        //   this.selection = selection;
        //   this.lastSelection = selection.slice();
        //   return;
        // }
        // if (selection.length == 0) {
        //   this.selection = [];
        //   this.lastSelection = selection.slice();
        //   return;
        // }
        // const prevSelection = this.lastSelection || [];
        // // 新增的（本次勾选的）
        // const added = selection.filter(row => !prevSelection.some(item => item.ID === row.ID));
        // // 移除的（本次取消勾选的）
        // const removed = prevSelection.filter(row => !selection.some(item => item.ID === row.ID));

        // if (added.length > 0) {
        //   // console.log('勾选了', added[0]);
        //   if (!added[0].canSelect) {
        //     this.$refs.table.toggleRowSelection(added[0], false);
        //     return;
        //   }
        // }
        // if (removed.length > 0) {
        //   // console.log('取消勾选了', removed[0]);
        //   if (!removed[0].canSelect) {
        //     this.$refs.table.toggleRowSelection(removed[0], true);
        //     return;
        //   }
        // }

        this.selection = selection;
        // this.lastSelection = selection.slice();
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      submitItem() {
        if (this.selection.length === 0) {
          this.$message({
            message: '请至少选择一条数据',
            type: 'warning'
          });
          return;
        }
        const loading = this.$messageLoading('处理中...');
        const ids = this.selection.map((item) => {
          return {
            ID: item.ID
          };
        });
        addBdszZqsjMainPsDelUseV2({
          json: ids
        })
          .then((res) => {
            this.$message({
              message: res?.msg,
              type: 'success'
            });
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'error'
            });
          })
          .finally(() => {
            this.updateVisible(false);
            this.$bus.$emit('SelectionAddDialogRefresh');
            loading.close();
          });
      },
      showNewUse() {
        this.isShowNewUse = true;
      },
      handleScanCode() {
        this.scanDialogVisible = true;
        this.scanCode = '';
        this.$nextTick(() => {
          this.$refs.scanInput.focus();
        });
      },
      async handleScanConfirm() {
        if (!this.scanCode) {
          this.$message.warning('请输入条码');
          return;
        }
        try {
          const res = await getBdszScanInfo({
            SSBH: this.AdvanceNumberTableCurrent?.SSBH,
            UDI: this.scanCode
          });
          
          if (res.data) {
            // 在表格数据中查找对应的行
            const index = this.$refs.table.tableData.findIndex(item => item.ID === res.data.ID);
            
            if (index !== -1) {
              // 如果找到对应的行，给该行加上canSelect=true
              this.$refs.table.tableData[index].canSelect = true;
              // 进行反选
              const row = this.$refs.table.tableData[index];
              const selectedIndex = this.selection.findIndex(item => item.ID === res.data.ID);
              if (selectedIndex !== -1) {
                // 如果已选中，则取消选中
                this.$refs.table.toggleRowSelection(row, false);
              } else {
                // 如果未选中，则添加到选中数组
                this.$refs.table.toggleRowSelection(row, true);
              }
              this.$message.success('操作成功');
              this.scanCode = ''; // 清空输入框
              this.$nextTick(() => {
                this.$refs.scanInput.focus(); // 重新聚焦输入框
              });
            } else {
              this.$message.warning('未找到对应的数据');
            }
          } else {
            this.$message.warning('未找到对应的数据');
          }
        } catch (error) {
          this.$message.error('操作失败');
          console.error(error);
        }
      },
      tableRowClassName({ row }) {
        // 只要该行被勾选，返回 selected-row
        return this.selection && this.selection.find(item => item.ID === row.ID) ? 'selected-row' : '';
      }
    },
    mounted() {
      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (data) => {
        this.AdvanceNumberTableCurrent = data;
      });
    },
    beforeDestroy() {
      this.$bus.$off('SelectionAddDialogRefresh');
    }
  };
</script>
<style lang="scss" scoped>
  .form-box {
    display: flex;
    justify-content: space-between;
    padding-right: 5px;
    flex-wrap: wrap;
  }
  // 选中行高亮，使用主题色
  ::v-deep(.el-table .selected-row) {
    background-color: var(--el-color-primary, #409EFF) !important;
    color: #fff;
  }

  ::v-deep(.el-table__row:hover) {
    color: rgb(11, 18, 21) !important;
  }
</style>
