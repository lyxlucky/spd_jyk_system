<template>
  <div class="ele-container">
    <ele-pro-table
      class="style-table"
      ref="table"
      :columns="columns"
      :datasource="datasource"
      size="mini"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      highlight-current-row
      cache-key="ThreeLevelDbBDTable"
      height="calc(100vh - 220px)"
      max-height="calc(100vh - 220px)"
    >
      <template v-slot:toolbar>
        <el-form
          :model="form"
          ref="form"
          :inline="true"
          class="ele-form-search"
          size="mini"
        >
          <el-form-item prop="DeptName">
            <el-input
              v-model="form.DeptName"
              placeholder="请输入科室名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="varCode">
            <el-input
              v-model="form.varCode"
              placeholder="请输入品种编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="varName">
            <el-input
              v-model="form.varName"
              placeholder="请输入品种名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="chargingCode">
            <el-input
              v-model="form.chargingCode"
              placeholder="请输入计费编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="spec">
            <el-input
              v-model="form.spec"
              placeholder="请输入规格型号"
              clearable
            />
          </el-form-item>
          <el-form-item prop="manufacter">
            <el-input
              v-model="form.manufacter"
              placeholder="请输入生产企业"
              clearable
            />
          </el-form-item>
          <el-form-item prop="prodRegistrationCode">
            <el-input
              v-model="form.prodRegistrationCode"
              placeholder="请输入批准文号"
              clearable
            />
          </el-form-item>
          <el-form-item class="ele-form-actions">
            <el-button type="primary" @click="reload()">查询</el-button>
            <el-button type="success" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="showFlowDialog(row)"
          >流向记录</el-button
        >
      </template>
    </ele-pro-table>

    <el-dialog
      title="流向记录"
      :visible.sync="flowDialogVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div>
        <ele-pro-table
          class="style-table"
          ref="flowTable"
          height="50vh"
          full-height="calc(100vh - 116px)"
          :columns="flowColumns"
          :datasource="flowDatasource"
          :init-load="false"
          size="mini"
          :pageSize="flowPageSize"
          :pageSizes="flowPageSizes"
          highlight-current-row
          cache-key="ThreeLevelDbBDFlowTable"
        >
          <template v-slot:toolbar>
            <h1>
              总计费数量:
              {{
                Number(flowRow.JF_QTY) + Number(flowRow.JF_DEF_QTY)
              }}
              总库存数: {{ flowRow.KS_QTY }}
            </h1>
          </template>
        </ele-pro-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getThirdStockInfo,
    getThirdStockInfoFlow
  } from '@/api/Inventory/ThreeLevelDbBD';
  import { utils, writeFile } from 'xlsx';
  export default {
    name: 'ThreeLevelDbBD',
    components: {},
    props: {},
    data() {
      return {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        form: {
          DeptName: '', // 科室名称
          varCode: '', // 品种编码
          varName: '', // 品种名称
          chargingCode: '', // 计费编码
          spec: '', // 规格型号
          manufacter: '', // 生产企业
          prodRegistrationCode: '' // 批准文号
        },
        flowPageSize: 10,
        flowPageSizes: [10, 20, 50, 100, 9999999],
        columns: [
          {
            prop: 'DEPT_TWO_NAME',
            label: '二级科室名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGE_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_ZHB',
            label: '转换比',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'JF_QTY',
            label: '散货计费数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'JF_DEF_QTY',
            label: '定数包计费数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'KS_QTY',
            label: '入库数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'KS_QTY_TOTAL',
            slot: 'KS_QTY_TOTAL',
            label: '库存数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (Number(row.KS_QTY) == 0) return row.KS_QTY;
              return (
                Number(row.KS_QTY) + Number(row.JF_QTY) + Number(row.JF_DEF_QTY)
              );
            }
          },
          {
            prop: 'XH_QTY',
            label: '消耗数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'JS_QTY',
            label: '结算数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 120,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true
            //fixed: 'right'
          }
        ],
        flowDialogVisible: false,
        flowRow: {},
        flowColumns: [
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_ZHB',
            label: '转换比',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          // {
          //   prop: 'CONSUMER',
          //   label: '消耗人',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 120
          // },
          {
            prop: 'PATIENT_NUMBER',
            label: '病患号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'HOSPITALIZATION_NUMBER',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'OPEARTION_CHARGING_TIME',
            label: '计费时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'PACK_TYPE',
            label: '类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140,
            formatter: (row, column, cellValue) => {
              if (row.BARCODE_NUMBER && row.BARCODE_NUMBER == '-')
                return '散货';
              else {
                return '定数包';
              }
            }
          },
          {
            prop: 'BARCODE_NUMBER',
            label: '定数包',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'TYPE',
            label: '出入库类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140,
            formatter: (row, column, cellValue) => {
              if(Number(row.QTY) > 0 && row.HOSPITALIZATION_NUMBER) return '消退';
              if (Number(row.QTY) > 0) return '入库';
              if (Number(row.QTY) < 0) return '出库';
            }
          },
          {
            prop: 'QTY',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where }) {
        return getThirdStockInfo({ page, limit, where })
          .then((res) => {
            return {
              list: res.data || [],
              count: res.total || 0
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload() {
        this.$refs.table.reload({ page: 1, where: this.form });
      },
      exportData() {
        const loading = this.$messageLoading('正在导出数据...');
        try {
          // 直接使用当前的查询条件进行全量导出
          getThirdStockInfo({
            page: 1,
            limit: 999999,
            where: this.form
          })
            .then((response) => {
              loading.close();
              const headers = [
                '二级科室名称',
                '批准文号',
                '品种编码',
                '计费编码',
                '品种名称',
                '规格型号',
                '生产企业',
                '单位',
                '转换比',
                '计费数量',
                '库存数量',
                '消耗数量',
                '结算数量'
              ];
              const dataArray = [headers];
              response.data.forEach((d) => {
                dataArray.push([
                  d.DEPT_TWO_NAME || '',
                  d.APPROVAL_NUMBER || '',
                  d.VARIETIE_CODE_NEW || '',
                  d.CHARGE_CODE || '',
                  d.VARIETIE_NAME || '',
                  d.SPECIFICATION_OR_TYPE || '',
                  d.MANUFACTURING_ENT_NAME || '',
                  d.UNIT || '',
                  d.HIS_ZHB || '',
                  d.JF_QTY || '',
                  d.KS_QTY || '',
                  d.XH_QTY || '',
                  d.JS_QTY || ''
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(dataArray)
                  }
                },
                '三级库-库存信息.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((error) => {
              loading.close();
              this.$message.error('导出数据失败，请稍后重试');
            });
        } catch (error) {
          loading.close();
          console.error('导出数据失败:', error);
          this.$message.error('导出数据失败，请稍后重试');
        }
      },
      showFlowDialog(row) {
        this.flowDialogVisible = true;
        this.flowRow = row;
        this.flowDatasource({ page: 1, limit: this.flowPageSize })
          .then((res) => {
            this.$refs.flowTable.reload({ list: res.list, count: res.count });
          })
          .catch(() => {
            this.$refs.flowTable.reload({ list: [], count: 0 });
          });
      },
      flowDatasource({ page, limit }) {
        // 这里可以实现流向记录的查询逻辑
        const where = {
          varCode: this.flowRow.VARIETIE_CODE_NEW,
          chargingCode: this.flowRow.CHARGE_CODE,
          DeptCode: this.flowRow.DEPT_TWO_CODE
        };
        return getThirdStockInfoFlow({ page, limit, where })
          .then((res) => {
            return {
              list: res.data || [],
              count: res.total || 0
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/common';

  .ele-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.ele-form-search .el-input--mini .el-input__inner) {
    width: 140px;
  }

  :deep(.ele-pro-table) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.ele-pro-table .el-table) {
    height: 100%;
  }

  :deep(.ele-pro-table .el-table__body-wrapper) {
    overflow-y: auto;
  }
</style>
