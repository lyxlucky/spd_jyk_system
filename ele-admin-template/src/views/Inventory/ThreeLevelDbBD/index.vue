<template>
  <div class="ele-body spd-page three-level-db-bd">
    <el-card shadow="never" class="three-level-db-bd-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <el-form
            ref="form"
            :model="form"
            size="mini"
            :inline="true"
            @keyup.enter.native="reload"
            @submit.native.prevent
          >
            <el-form-item label="科室名称" prop="DeptName">
              <el-input
                v-model="form.DeptName"
                placeholder="科室名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种编码" prop="varCode">
              <el-input
                v-model="form.varCode"
                placeholder="品种编码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种名称" prop="varName">
              <el-input
                v-model="form.varName"
                placeholder="品种名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="计费编码" prop="chargingCode">
              <el-input
                v-model="form.chargingCode"
                placeholder="计费编码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="规格型号" prop="spec">
              <el-input
                v-model="form.spec"
                placeholder="规格型号"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="生产企业" prop="manufacter">
              <el-input
                v-model="form.manufacter"
                placeholder="生产企业"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="批准文号" prop="prodRegistrationCode">
              <el-input
                v-model="form.prodRegistrationCode"
                placeholder="批准文号"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="库存数量" prop="stockZero">
              <el-select
                v-model="form.stockZero"
                placeholder="全部"
                clearable
                style="width: 130px"
              >
                <el-option label="全部" value="" />
                <el-option label="库存数量为零" value="1" />
                <el-option label="库存数量不为零" value="2" />
              </el-select>
            </el-form-item>
            <br />
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reload()">查询</el-button>
              <el-button type="success" icon="el-icon-download" @click="exportData()">导出</el-button>
              <el-button type="info" @click="showKcDialog()">库存汇总</el-button>
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
                style="display: inline-block; margin-left: 10px"
              >
                <el-button type="warning">上传初始化库存</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">三级库列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            height="calc(100vh - 300px)"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :columns="columns"
            :datasource="datasource"
            highlight-current-row
            cache-key="ThreeLevelDbBDTable"
          >
            <template v-slot:action="{ row }">
              <el-button type="text" size="mini" @click="showFlowDialog(row)">流向记录</el-button>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>

    <el-dialog
      title="流向记录"
      :visible.sync="flowDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      custom-class="three-level-db-bd-dialog"
    >
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__body">
          <el-form size="mini" :inline="true" @keyup.enter.native="reloadFlowData" @submit.native.prevent>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="flowForm.startTime"
                type="date"
                placeholder="开始时间"
                value-format="yyyy-MM-dd"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="flowForm.endTime"
                type="date"
                placeholder="结束时间"
                value-format="yyyy-MM-dd"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reloadFlowData">查询</el-button>
              <el-button type="success" icon="el-icon-download" @click="exportFlowData()">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="spd-panel spd-table-panel">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="flowTable"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            height="50vh"
            :columns="flowColumns"
            :datasource="flowDatasource"
            :init-load="false"
            :pageSize="flowPageSize"
            :pageSizes="flowPageSizes"
            highlight-current-row
            cache-key="ThreeLevelDbBDFlowTable"
          />
        </div>
      </div>
      <div class="flow-summary">
        总入库数量：{{ Number(flowRow.KS_QTY) }} |
        总计费数量：{{ Number(flowRow.JF_QTY) + Number(flowRow.JF_DEF_QTY) }} |
        库存数：{{ Number(flowRow.KS_QTY) + Number(flowRow.JF_QTY) + Number(flowRow.JF_DEF_QTY) }}
      </div>
    </el-dialog>

    <el-dialog
      title="库存汇总"
      :visible.sync="kcDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      custom-class="three-level-db-bd-dialog"
    >
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__body">
          <el-form size="mini" :inline="true" @keyup.enter.native="reloadKcData" @submit.native.prevent>
            <el-form-item label="品种编码">
              <el-input
                v-model="kcForm.VARIETIE_CODE_NEW"
                placeholder="品种编码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种名称">
              <el-input
                v-model="kcForm.VARIETIE_NAME"
                placeholder="品种名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="规格型号">
              <el-input
                v-model="kcForm.SPECIFICATION_OR_TYPE"
                placeholder="规格型号"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="单位">
              <el-input
                v-model="kcForm.UNIT"
                placeholder="单位"
                clearable
                style="width: 80px"
              />
            </el-form-item>
            <el-form-item label="价格">
              <el-input
                v-model="kcForm.PRICE"
                placeholder="价格"
                clearable
                style="width: 90px"
              />
            </el-form-item>
            <el-form-item label="生产企业">
              <el-input
                v-model="kcForm.MANUFACTURING_ENT_NAME"
                placeholder="生产企业"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="reloadKcData">查询</el-button>
              <el-button type="success" icon="el-icon-download" @click="exportKcData()">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="spd-panel spd-table-panel">
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="kcTable"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            height="50vh"
            :columns="kcColumns"
            :datasource="kcDatasource"
            :init-load="false"
            :pageSize="kcPageSize"
            :pageSizes="kcPageSizes"
            highlight-current-row
            cache-key="ThreeLevelDbBDKcTable"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getThirdStockInfo,
    getThirdStockInfoFlow,
    getThreeKcInfo
  } from '@/api/Inventory/ThreeLevelDbBD';
  import { TOKEN_STORE_NAME, API_BASE_URL } from '@/config/setting';
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
            minWidth: 130
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
            minWidth: 150
          },
          {
            prop: 'KS_QTY',
            label: '入库数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'STORAGE_TYPE',
            label: '入库类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row?.STORAGE_TYPE == 0) {
                return '普通入库';
              }
              if (row?.STORAGE_TYPE == 1) {
                return '盘盈入库';
              }
              return '未知';
            }
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
            width: 90,
            align: 'center',
            resizable: false,
            slot: 'action'
          }
        ],
        flowDialogVisible: false,
        flowRow: {},
        kcDialogVisible: false,
        kcPageSize: 10,
        kcPageSizes: [10, 20, 50, 100, 9999999],
        kcForm: {
          VARIETIE_CODE_NEW: '',
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          UNIT: '',
          PRICE: '',
          MANUFACTURING_ENT_NAME: ''
        },
        uploadUrl: API_BASE_URL + '/lhfy/uploadThirdInventory',
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
            prop: 'HOSPITAL_TYPE',
            label: '就诊类型',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.HOSPITAL_TYPE === 0 || row.HOSPITAL_TYPE === '0') {
                return '门诊';
              }
              if (row.HOSPITAL_TYPE === 1 || row.HOSPITAL_TYPE === '1') {
                return '住院';
              }
              return cellValue || '未知';
            }
          },
          {
            prop: 'OPEARTION_CHARGING_TIME',
            label: '时间',
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
        ],
        kcColumns: [
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
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
            prop: 'PRICE',
            label: '单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'QTY',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'TOTAL_PRICE',
            label: '总价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
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
                const ksQtyTotal =
                  Number(d.KS_QTY) + Number(d.JF_QTY) + Number(d.JF_DEF_QTY);
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
      },
      showKcDialog() {
        this.kcDialogVisible = true;
        this.kcForm = {
          VARIETIE_CODE_NEW: '',
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          UNIT: '',
          PRICE: '',
          MANUFACTURING_ENT_NAME: ''
        };
        this.kcDatasource({ page: 1, limit: this.kcPageSize })
          .then((res) => {
            this.$refs.kcTable.reload({ list: res.list, count: res.count });
          })
          .catch(() => {
            this.$refs.kcTable.reload({ list: [], count: 0 });
          });
      },
      reloadKcData() {
        this.$refs.kcTable.reload({ page: 1, where: this.kcForm });
      },
      kcDatasource({ page, limit, where }) {
        return getThreeKcInfo({
          page: page,
          limit: limit,
          VARIETIE_CODE_NEW: where?.VARIETIE_CODE_NEW || '',
          VARIETIE_NAME: where?.VARIETIE_NAME || '',
          SPECIFICATION_OR_TYPE: where?.SPECIFICATION_OR_TYPE || '',
          UNIT: where?.UNIT || '',
          PRICE: where?.PRICE || '',
          MANUFACTURING_ENT_NAME: where?.MANUFACTURING_ENT_NAME || ''
        })
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
      exportKcData() {
        const loading = this.$messageLoading('正在导出数据...');
        try {
          getThreeKcInfo({
            VARIETIE_CODE_NEW: this.kcForm.VARIETIE_CODE_NEW,
            VARIETIE_NAME: this.kcForm.VARIETIE_NAME,
            SPECIFICATION_OR_TYPE: this.kcForm.SPECIFICATION_OR_TYPE,
            UNIT: this.kcForm.UNIT,
            PRICE: this.kcForm.PRICE,
            MANUFACTURING_ENT_NAME: this.kcForm.MANUFACTURING_ENT_NAME
          })
            .then((response) => {
              loading.close();
              const headers = [
                '品种编码',
                '品种名称',
                '规格型号',
                '单位',
                '单价',
                '生产企业',
                '数量',
                '总价',
                '散货计费数量',
                '定数包计费数量',
                '入库类型'
              ];
              const dataArray = [headers];
              response.data.forEach((d) => {
                dataArray.push([
                  d.VARIETIE_CODE_NEW || '',
                  d.VARIETIE_NAME || '',
                  d.SPECIFICATION_OR_TYPE || '',
                  d.UNIT || '',
                  d.PRICE || '',
                  d.MANUFACTURING_ENT_NAME || '',
                  d.QTY || '',
                  d.TOTAL_PRICE || '',
                  d.JF_QTY || '',
                  d.JF_DEF_QTY || '',
                  d.STORAGE_TYPE == 0 ? '普通入库' : d.STORAGE_TYPE == 2 ? '盘盈入库' : '未知'
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(dataArray)
                  }
                },
                '三级库-新增库存信息.xlsx'
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
.three-level-db-bd-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.three-level-db-bd >>> .el-table th .cell {
  white-space: nowrap;
}

.flow-summary {
  margin-top: 10px;
  text-align: right;
  font-size: 13px;
  color: #606266;
}
</style>
