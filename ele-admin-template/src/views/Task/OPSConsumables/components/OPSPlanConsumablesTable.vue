<template>
  <div class="ele-box">
    <!-- <el-card> -->
    <!-- <div slot="header">手术计划耗材</div> -->
    <!-- <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input placeholder="编码/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="reload"
            >查询</el-button
          >
        </el-form-item>
      </el-form> -->
    <ele-pro-table
      ref="table"
      size="mini"
      :columns="columns"
      height="180px"
      :initLoad="false"
      @row-click="handleRowClick"
      highlight-current-row
      :datasource="datasource"
      :selection.sync="selection"
      :rowClickCheckedIntelligent="false"
      :rowClickChecked="true"
    >
      <template v-slot:toolbar>
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-input placeholder="编码/名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="reload"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="isEnabld"
              icon="el-icon-circle-check"
              type="primary"
              @click="handleSelectAdd"
              >勾选添加</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="!selection.length"
              @click="handleConfirmAdd"
              >确认添加</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:operate="{ row }">
        <el-button
          size="mini"
          icon="el-icon-shopping-bag-2"
          type="primary"
          @click="handleEdit(row)"
          >散货</el-button
        >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-box"
          @click="handleAddDefNoPkgCode(row)"
          >定数包</el-button
        >
      </template>
    </ele-pro-table>
    <!-- </el-card> -->

    <el-dialog
      title="添加散货"
      @closed="handleOpsConsumablesDialogClosed"
      :visible.sync="isShowDialog"
      width="80%"
    >
      <OPSPlanConsumablesOperateTable
        @OPSPlanConsumablesOperateCloseDialog="handleDialogClose"
        ref="OPSPlanConsumablesOperateTable"
        :currentRow="currentRow"
      ></OPSPlanConsumablesOperateTable>
    </el-dialog>
    <SelectionAddDialog
      :visible.sync="selectionDialogVisible"
    ></SelectionAddDialog>
  </div>
</template>

<script>
  import {
    getBdszgsjMainDel,
    addBdszZqsjMainPsDel
  } from '@/api/Task/OPSConsumables';
  import OPSPlanConsumablesOperateTable from './OPSPlanConsumablesOperateTable.vue';
  import SelectionAddDialog from '@/views/Task/SurgicalVerification/components/SelectionAddDialog.vue';
  export default {
    name: 'OPSPlanConsumablesTable',
    props: {
      MZZY: {
        type: String,
        default: ''
      },
      TableRowData1: {
        type: Object,
        default: null
      }
    },
    components: {
      OPSPlanConsumablesOperateTable,
      SelectionAddDialog
    },
    data() {
      return {
        isShowDialog: false,
        currentRow: {},
        where: {},
        OPSDeliveryConsumablesTableData: [],
        selectionDialogVisible: false,
        selection: [],
        columns: [
          {
            type: 'selection',
            width: 55,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            width: 80
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'FYSL',
            label: '预约数量',
            align: 'center',
            width: 100
          },
          {
            prop: 'SH_QTY',
            label: '散货库存',
            align: 'center',
            width: 90
          },
          {
            prop: 'DEF_QTY',
            label: '定数包库存',
            align: 'center',
            width: 90
          },
          {
            prop: 'PS_COUNT',
            label: '数量',
            align: 'center',
            width: 90
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          }
          // {
          //   slot: 'operate',
          //   label: '操作',
          //   align: 'center',
          //   width: 200
          // }
        ]
      };
    },
    methods: {
      handleSelectAdd() {
        this.selectionDialogVisible = true;
      },
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.MZZY = this.MZZY;
        console.log(this.TableRowData1);
        where.SSBH = this.TableRowData1.SSBH;
        return getBdszgsjMainDel({ where, page, limit })
          .then((data) => {
            console.log(data.data);
            return {
              list: data.data || [],
              count: data.total
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload(data) {
        this.$refs.table.reload({ page: 1, where: data });
      },
      handleEdit(row) {
        this.currentRow = row;
        this.isShowDialog = true;
        this.$nextTick(() => {
          this.$refs.OPSPlanConsumablesOperateTable.reload();
        });
      },
      handleRowClick(row) {
        this.currentRow = row;
        this.$bus.$emit('OPSPlanConsumablesTableRowClick', row);
      },
      handleDialogClose() {
        this.isShowDialog = false;
        this.reload();
      },
      handleOpsConsumablesDialogClosed() {},
      handleAddDefNoPkgCode(data) {
        //二次确认
        this.$prompt('请输入数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: '请输入正确的数量'
        })
          .then(({ value }) => {
            const count = parseInt(value, 10); // 将输入字符串转成数字
            const loading = this.$messageLoading('处理中...');

            this.OPSDeliveryConsumablesTableData.forEach((element) => {
              if (element.VARIETIE_CODE == data.VARIETIE_CODE) {
                if (
                  Number(element.PS_COUNT) > Number(data.FYSL) ||
                  Number(value) > Number(data.FYSL)
                ) {
                  //
                }
              }
            });

            // const jsonData = Array.from({ length: count }, () => ({
            //   Token: sessionStorage.Token,
            //   BDSZ_ZQSJ_PS_ID: data.ID,
            //   TYPE:"1",
            //   PS_COUNT:value
            // }));
            const jsonData = [
              {
                Token: sessionStorage.Token,
                BDSZ_ZQSJ_ID: data.ID,
                TYPE: '1',
                PS_COUNT: value
              }
            ];

            addBdszZqsjMainPsDel(jsonData)
              .then((res) => {
                this.$message.success(res.msg);
              })
              .catch((err) => {
                this.$message.error(err.msg);
              })
              .finally(() => {
                loading.close();
                this.$bus.$emit('OPSPlanConsumablesTableAddDefNoPkgCode', null);
              });
            //this.doSomethingWith(value);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消输入'
            });
          })
          .finally(() => {});
      },
      handleConfirmAdd() {
        if (this.selection.length === 0) {
          this.$message({
            message: '请至少选择一条数据',
            type: 'warning'
          });
          return;
        }

        const loading = this.$messageLoading('处理中...');
        const jsonData = this.selection.map((item) => {
          item.BDSZ_ZQSJ_ID = item.ID;
          return item;
        });

        addBdszZqsjMainPsDel(jsonData)
          .then((res) => {
            this.$message.success(res.msg || '添加成功');
            this.reload(); // 刷新表格数据
          })
          .catch((err) => {
            this.$message.error(err.message || '添加失败');
          })
          .finally(() => {
            loading.close();
            this.selection = []; // 清空选择
          });
      }
    },
    computed: {
      isEnabld() {
        console.log(this.TableRowData1);
        return this?.TableRowData1?.SSBH ? false : true;
      }
    },
    watch: {
      TableRowData1() {
        this.$bus.$emit('AdvanceReceiptNumberTableCurrent', this.TableRowData1);
      }
    },
    mounted() {
      this.$bus.$on('OPSConsumablesTableRowClick', (row) => {
        //this.currentRow = row;
        this.$nextTick(() => {
          this.reload({ SSBH: row.SSBH });
        });
      });
      this.$bus.$on('OPSDeliveryConsumablesTableData', (row) => {
        this.OPSDeliveryConsumablesTableData = row;
      });
    },
    beforeDestroy() {
      this.$bus.$off('OPSConsumablesTableRowClick');
      this.$bus.$off('OPSPlanConsumablesTableAddDefNoPkgCode');
    }
  };
</script>

<style scoped>
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
