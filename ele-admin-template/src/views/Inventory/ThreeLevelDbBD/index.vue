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
          <el-form-item prop="stockZero" label="库存数量">
            <el-select
              v-model="form.stockZero"
              placeholder="库存数量筛选"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="库存数量为零" value="1"></el-option>
              <el-option label="库存数量不为零" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="ele-form-actions">
            <el-button type="primary" @click="reload()">查询</el-button>
            <el-button type="success" @click="exportData()">导出</el-button>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="upload"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :data="uploadData"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              accept=".xlsx,.xls,.csv"
            >
              <el-button type="warning" size="mini">上传初始化库存</el-button>
            </el-upload>
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
            <el-form :inline="true" size="mini">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="flowForm.startTime"
                  type="date"
                  placeholder="选择开始时间"
                  value-format="yyyy-MM-dd"
                  style="width: 180px"
                />
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="flowForm.endTime"
                  type="date"
                  placeholder="选择结束时间"
                  value-format="yyyy-MM-dd"
                  style="width: 180px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="reloadFlowData">查询</el-button>
                <el-button type="success" size="mini" @click="exportFlowData()">导出Excel</el-button>
              </el-form-item>
            </el-form>
          </template>
        </ele-pro-table>
        <div style="text-align: right; margin-top: 10px; font-size: 24px">
          总入库数量：{{ Number(flowRow.KS_QTY) }} |
          总计费数量：{{ Number(flowRow.JF_QTY) + Number(flowRow.JF_DEF_QTY) }} |
          库存数：{{ Number(flowRow.KS_QTY) + Number(flowRow.JF_QTY) + Number(flowRow.JF_DEF_QTY) }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getThirdStockInfo,
    getThirdStockInfoFlow
  } from '@/api/Inventory/ThreeLevelDbBD';
  import { TOKEN_STORE_NAME } from '@/config/setting';
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
          prodRegistrationCode: '', // 批准文号
          stockZero: '' // 库存筛选：1-库存为0，2-库存不为0
        },
        flowPageSize: 10,
        flowPageSizes: [10, 20, 50, 100, 9999999],
        flowForm: {
          startTime: '',
          endTime: ''
        },
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
            prop: 'PRICE',
            label: '单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
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
          // {
          //   prop: 'XH_QTY',
          //   label: '消耗数量',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 100
          // },
          // {
          //   prop: 'JS_QTY',
          //   label: '结算数量',
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   minWidth: 100
          // },
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
        uploadUrl: '/api/lhfy/uploadThirdInventory', // 上传接口地址，请根据实际情况修改
        uploadHeaders: {
          // 上传请求头，请根据实际情况修改
          Authorization: 'Bearer ' + localStorage.getItem('token') || ''
        },
        uploadData: {
          // 上传时附带的额外参数
          Token: sessionStorage.getItem(TOKEN_STORE_NAME)
        },
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
              if (row.TYPE && row.TYPE == '2') {
                return '散货';
              }
              if (row.TYPE && row.TYPE == '3') {
                return '定数包';
              }
              if (row.BARCODE_NUMBER && row.BARCODE_NUMBER == '-') {
                return '散货';
              } else {
                return '定数包';
              }
            }
          },
          {
            prop: 'BARCODE_NUMBER',
            label: '定数包号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter: (row, column, cellValue) => {
              if (row.TYPE && row.TYPE == '3') {
                return row.ORIGING_CODE;
              }
              if (row.BARCODE_NUMBER && row.BARCODE_NUMBER != '-') {
                return row.BARCODE_NUMBER;
              }
            }
          },
          {
            prop: 'TYPE',
            label: '出入库类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140,
            formatter: (row, column, cellValue) => {
              if (Number(row.QTY) > 0 && row.HOSPITALIZATION_NUMBER)
                return '消退';
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
      beforeUpload(file) {
        const isExcel =
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
          this.$message.error('只能上传Excel文件!');
          return false;
        }
        this.$message.info(`开始上传文件: ${file.name}`);
        return true;
      },
      handleUploadSuccess(response, file, fileList) {
        if (response.code === 200) {
          this.$message.success('文件上传成功!');
          this.reload();
        } else {
          this.$message.error(`文件上传失败: ${response.msg}`);
        }
      },
      handleUploadError(err, file, fileList) {
        this.$message.error(`文件上传失败: ${err.msg}`);
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
                '品种编码',
                '计费编码',
                '品种名称',
                '规格型号',
                '生产企业',
                '单位',
                '单价',
                '转换比',
                '批准文号',
                '散货计费数量',
                '定数包计费数量',
                '入库数量',
                '库存数量'
              ];
              const dataArray = [headers];
              response.data.forEach((d) => {
                // 计算库存数量，与表格中的formatter逻辑一致
                const ksQtyTotal = Number(d.KS_QTY) + Number(d.JF_QTY) + Number(d.JF_DEF_QTY);
                dataArray.push([
                  d.DEPT_TWO_NAME || '',
                  d.VARIETIE_CODE_NEW || '',
                  d.CHARGE_CODE || '',
                  d.VARIETIE_NAME || '',
                  d.SPECIFICATION_OR_TYPE || '',
                  d.MANUFACTURING_ENT_NAME || '',
                  d.UNIT || '',
                  d.PRICE || '',
                  d.HIS_ZHB || '',
                  d.APPROVAL_NUMBER || '',
                  d.JF_QTY || '',
                  d.JF_DEF_QTY || '',
                  d.KS_QTY || '',
                  ksQtyTotal || ''
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
        this.flowForm.startTime = '';
        this.flowForm.endTime = '';
        this.flowDatasource({ page: 1, limit: this.flowPageSize })
          .then((res) => {
            this.$refs.flowTable.reload({ list: res.list, count: res.count });
          })
          .catch(() => {
            this.$refs.flowTable.reload({ list: [], count: 0 });
          });
      },
      reloadFlowData() {
        this.$refs.flowTable.reload({ page: 1 });
      },
      flowDatasource({ page, limit }) {
        const where = {
          varCode: this.flowRow.VARIETIE_CODE_NEW,
          chargingCode: this.flowRow.CHARGE_CODE,
          DeptCode: this.flowRow.DEPT_TWO_CODE,
          startTime: this.flowForm.startTime,
          endTime: this.flowForm.endTime
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
      },
      exportFlowData() {
        const loading = this.$messageLoading('正在导出数据...');
        try {
          getThirdStockInfoFlow({
            page: 1,
            limit: 999999,
            where: {
              varCode: this.flowRow.VARIETIE_CODE_NEW,
              chargingCode: this.flowRow.CHARGE_CODE,
              DeptCode: this.flowRow.DEPT_TWO_CODE,
              startTime: this.flowForm.startTime,
              endTime: this.flowForm.endTime
            }
          })
            .then((response) => {
              loading.close();
              const headers = [
                '品种编码',
                '计费编码',
                '品种名称',
                '规格型号',
                '单位',
                '转换比',
                '批准文号',
                '生产企业',
                '病患号',
                '住院号',
                '计费时间',
                '类型',
                '定数包号',
                '出入库类型',
                '数量'
              ];
              const dataArray = [headers];
              response.data.forEach((d) => {
                // 根据formatter逻辑处理数据
                let packType = '';
                if (d.TYPE && d.TYPE == '2') {
                  packType = '散货';
                } else if (d.TYPE && d.TYPE == '3') {
                  packType = '定数包';
                } else if (d.BARCODE_NUMBER && d.BARCODE_NUMBER == '-') {
                  packType = '散货';
                } else {
                  packType = '定数包';
                }

                let barcodeNumber = '';
                if (d.TYPE && d.TYPE == '3') {
                  barcodeNumber = d.ORIGING_CODE || '';
                } else if (d.BARCODE_NUMBER && d.BARCODE_NUMBER != '-') {
                  barcodeNumber = d.BARCODE_NUMBER;
                }

                let type = '';
                if (Number(d.QTY) > 0 && d.HOSPITALIZATION_NUMBER) {
                  type = '消退';
                } else if (Number(d.QTY) > 0) {
                  type = '入库';
                } else if (Number(d.QTY) < 0) {
                  type = '出库';
                }

                dataArray.push([
                  d.VARIETIE_CODE_NEW || '',
                  d.CHARGING_CODE || '',
                  d.VARIETIE_NAME || '',
                  d.SPECIFICATION_OR_TYPE || '',
                  d.UNIT || '',
                  d.HIS_ZHB || '',
                  d.APPROVAL_NUMBER || '',
                  d.MANUFACTURING_ENT_NAME || '',
                  d.PATIENT_NUMBER || '',
                  d.HOSPITALIZATION_NUMBER || '',
                  d.OPEARTION_CHARGING_TIME || '',
                  packType,
                  barcodeNumber,
                  type,
                  d.QTY || ''
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(dataArray)
                  }
                },
                '三级库-流向记录.xlsx'
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
