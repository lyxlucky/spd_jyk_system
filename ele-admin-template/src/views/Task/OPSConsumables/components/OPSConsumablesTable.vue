<template>
  <div class="ele-box">
    <!-- 数据表格 -->
    <ele-pro-table
      size="mini"
      ref="table"
      :initLoad="false"
      @row-click="handleRowClick"
      :columns="columns"
      height="50vh"
      :datasource="datasource"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      highlight-current-row
      :stripe="true"
      :needPage="true"
      :selection.sync="selection"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:ACTION="{ row }">
        <el-button
          size="mini"
          icon="el-icon-edit"
          @click="handleEditItem(row)"
          type="primary"
          >修改</el-button
        >
      </template>

      <template v-slot:toolbar>
        <el-form :inline="true" :model="where" size="mini">
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="where.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 240px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-select
              v-model="where.MZZY"
              placeholder="请选择术间"
              clearable
              style="width: 100px"
              @change="changeMZZY"
            >
              <el-option
                v-for="item in MZZYOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-select
              v-model="where.IS_ADD"
              placeholder="添加状态"
              clearable
              style="width: 100px"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="已添加" value="1"></el-option>
              <el-option label="未添加" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-input
              v-model="where.BRXM_OR_SSMC"
              placeholder="请输入患者姓名或手术名称"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-input
              v-model="where.SSBH"
              placeholder="手术编号"
              clearable
              style="width: 140px"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-input
              v-model="where.SSTH"
              placeholder="手术台号"
              clearable
              style="width: 140px"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 16px; margin-bottom: 8px">
            <el-input
              v-model="where.SSFJ"
              placeholder="手术房间"
              clearable
              style="width: 140px"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 8px">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="reload"
              style="margin-right: 8px"
              >查询</el-button
            >

            <el-button
              type="primary"
              icon="el-icon-download"
              @click="handlePrint"
              style="margin-right: 8px"
              >打印</el-button
            >
            <el-button type="primary" @click="handleExport">导出</el-button>
            <el-button type="primary" @click="handleExportCurrent"
              >打印2</el-button
            >
            <el-button type="primary" @click="handleShowSummary"
              >查看汇总</el-button
            >
          </el-form-item>
        </el-form>
      </template>
    </ele-pro-table>
    <!-- </el-card> -->
    <UpdateUserInfoDialog
      @reload="reload"
      :visible.sync="updateUserInfoDialogVisible"
    ></UpdateUserInfoDialog>
    <SummaryDialog
      :visible.sync="summaryDialogVisible"
      :selectedSSBH="selection.map(item => item.SSBH)"
    ></SummaryDialog>
  </div>
</template>

<script>
  import UpdateUserInfoDialog from './UpdateUserInfoDialog';
  import SummaryDialog from './SummaryDialog';
  import { BACK_BASE_URL } from '@/config/setting';
  import { exportToExcel } from '@/utils/excel-util.js';
  import {
    getBdSzYyHisSs,
    GetBdszZgsjMainPsDelExcel,
    GetBdszZgsjMainPsDelExcelDetail
  } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSConsumablesTable',
    components: {
      UpdateUserInfoDialog,
      SummaryDialog
    },
    data() {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return {
        currentRow: null,
        selection: [], // 选中的行
        summaryDialogVisible: false, // 汇总对话框显示状态
        // 查询参数
        where: {
          dateRange: [
            yesterday.toISOString().split('T')[0],
            tomorrow.toISOString().split('T')[0]
          ],
          MZZY: '',
          IS_ADD: '',
          BRXM_OR_SSMC: '',
          SSBH: '',
          SSTH: '',
          SSFJ: ''
        },
        // 术间选项
        MZZYOptions: [
          { value: '', label: '全部' },
          { value: '1', label: '新增' },
          { value: '2', label: '已拣配' },
          { value: '3', label: '已交接' },
          { value: '4', label: '已完成' },
          { value: '-1', label: '已交接/已完成' }
        ],
        // 表格列配置
        columns: [
          {
            type: 'selection',
            width: 55,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'STATE',
            label: '状态',
            align: 'center',
            width: 75,
            formatter: (row, column, cellValue) => {
              switch (cellValue) {
                case '1':
                  return '新增';
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
            label: '住院号码',
            align: 'center',
            width: 70
          },
          {
            prop: 'BRXM',
            label: '病人姓名',
            align: 'center',
            width: 70,
            formatter: (row, column, cellValue) => {
              return cellValue;
              // if (!cellValue) {
              //   return '';
              // }
              // if (cellValue.length == 1) {
              //   return cellValue + '*';
              // }
              // if (!cellValue || cellValue.length == 2)
              //   return cellValue[0] + '*';
              // const firstChar = cellValue[0];
              // const lastChar = cellValue[cellValue.length - 1];
              // const middleStars = '*'.repeat(cellValue.length - 2);
              // return firstChar + middleStars + lastChar;
            },
            excelConfig: {
              formatter: (cellValue) => {
                return cellValue;
              }
            }
          },
          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true,
            excelConfig: {
              wrapText: true
            }
          },
          {
            prop: 'SSRQ',
            label: '手术日期',
            align: 'center',
            width: 120,
            formatter: (row, column, cellValue, index) => {
              // return this.$util.toDateString(cellValue, 'YYYY-MM-DD HH:mm:ss');
              if (!cellValue) {
                return '';
              }
              return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
            },
            showOverflowTooltip: true
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
          },
          {
            slot: 'ACTION',
            label: '操作',
            align: 'center',
            minWidth: 120,
            excelConfig: {
              hide: true
            }
          }
        ],
        // 分页配置
        pageSize: 100,
        pageSizes: [10, 20,30,40, 50, 100,999999],
        updateUserInfoDialogVisible: false
      };
    },
    methods: {
      handleEditItem(data) {
        this.$bus.$emit('OPSConsumablesTableRowCurrent', data);
        this.updateUserInfoDialogVisible = true;
      },
      handleExportCurrent() {
        if (!this.currentRow || Object.keys(this.currentRow).length === 0) {
          this.$message.error('请先选择一行数据！');
          return;
        }
        let loading = this.$messageLoading('导出中');
        GetBdszZgsjMainPsDelExcelDetail({
          SSBH: this.currentRow?.SSBH,
          FYXH: this.currentRow?.FYXH
        })
          .then((res) => {
            loading.close();
            const url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
            window.open(url.replace('/undefined', ''));
          })
          .catch(() => {
            loading.close();
            this.$message.error('导出失败！');
          });
      },
      handleExport() {
        let loading = this.$messageLoading('导出中');
        getBdSzYyHisSs({ page: 1, limit: 999999, where: this.where })
          .then((data) => {
            loading.close();
            exportToExcel(data.data, this.columns, '手术排期');
          })
          .catch(() => {
            loading.close();
            this.$message.error('导出失败！');
          });
      },
      changeMZZY(val) {
        this.$emit('changeMZZY', val);
      },
      getInitDate() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return [
          yesterday.toISOString().split('T')[0],
          tomorrow.toISOString().split('T')[0]
        ];
      },
      handlePrint() {
        if (this?.currentRow == undefined)
          return this.$message.error('请先选择一行数据！');
        const loading = this.$loading({
          lock: true,
          text: '正在下载...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const params = {
          SSBH: this.currentRow.SSBH,
          SSTH: this.currentRow.SSTH,
          ZYHM: this.currentRow.ZYHM,
          BRXM: this.currentRow.BRXM,
          SSMC: this.currentRow.SSMC,
          SSRQ: this.currentRow.SSRQ
        };
        GetBdszZgsjMainPsDelExcel(params)
          .then((res) => {
            var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
            window.open(url.replace('/undefined', ''));
          })
          .catch((err) => {
            this.$message.error(err.msg || '下载失败，请稍后重试！');
          })
          .finally(() => {
            loading.close();
          });
      },
      handleRowClick(row, column, event) {
        this.currentRow = row;
        this.$bus.$emit('OPSConsumablesTableRowClick', row);
        this.$emit('TableRow1', row);
      },
      // 表格数据源
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.MZZY = this.where.MZZY;
        console.log(where);

        return getBdSzYyHisSs({ page, limit, where })
          .then((data) => {
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
      // 查询按钮点击事件
      reload() {
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      handleSelectionChange(selection) {
        this.selection = selection;
      },
      handleShowSummary() {
        if (this.selection.length === 0) {
          this.$message.warning('请至少选择一条数据');
          return;
        }
        this.summaryDialogVisible = true;
      }
    },
    created() {
      // 初始化时加载数据
      // this.reload();
      this.$nextTick(() => {
        this.reload();
      });
    },
    beforeDestroy() {
      this.$bus.$off('OPSConsumablesTableRowCurrent');
    }
  };
</script>

<style lang="scss" scoped>
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
