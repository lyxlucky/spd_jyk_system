<template>
  <ele-modal
    :destroy-on-close="true"
    width="1800px"
    :centered="true"
    :visible="visible"
    :close-on-click-modal="true"
    custom-class="ele-dialog-form"
    title="计划收货情况"
    @update:visible="updateVisible"
  >
    <div class="">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <!-- 数据表格 -->
        
        <ele-pro-table
          ref="table"
          height="600px"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :rowClickChecked="true"
          :rowClickCheckedIntelligent="false"
          :selection.sync="selection"
          @selection-change="onSelectionChange"
          cache-key="ApplyOperateTip"
        >
          <template v-slot:toolbar>
            <user-search @exportData="handleNewExportData" @search="reload" />
          </template>
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <el-form-item label="">
              <el-input size="mini" v-model="row.APPLY_QTY"></el-input>
            </el-form-item>
          </template>
        </ele-pro-table>
      </el-card>
      <!-- <div class="ele-footer" style="display: flex;justify-content: center;">
        <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="addKSKSDepartmentalPlanData()">
          确定添加
        </el-button>
      </div> -->

      <!-- 编辑弹窗 -->
      <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
      <!-- 导入弹窗 -->
      <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
    </div>
  </ele-modal>
</template>

<script>
  import UserSearch from './components/user-search.vue';
  import UserEdit from './components/user-edit.vue';
  import { API_BASE_URL, BACK_BASE_URL, HOME_HP } from '@/config/setting';
  import {
    getFileNameFromResponseHeaders,
    downloadBlob
  } from '@/utils/downloadfile';
  import { searchBID_VAR_INFO } from '@/api/KSInventory/BidVarInfoDept';
  import {
    getApplyOperateTip,
    getApplyOperateTipExcel
  } from '@/api/KSInventory/KSDepartmentalPlan';
  import {
    SerachPlanList,
    KeeptListDeta
  } from '@/api/KSInventory/IntroduceUserDefinedTemp';

  /** Excel 列宽单位下估算文本显示宽度（中文约 2，ASCII 约 1） */
  function excelTextWidth(text) {
    const s = String(text ?? '');
    let w = 0;
    for (let i = 0; i < s.length; i++) {
      w += s.charCodeAt(i) > 255 ? 2 : 1;
    }
    return w;
  }

  /** 按列宽与换行估算行高（磅） */
  function estimateRowHeight(values, colWidths, fontSize = 10) {
    let maxLines = 1;
    values.forEach((val, i) => {
      const colW = Math.max(4, colWidths[i] || 10);
      const lines = Math.max(1, Math.ceil(excelTextWidth(val) / colW));
      if (lines > maxLines) maxLines = lines;
    });
    return Math.min(120, Math.max(18, maxLines * (fontSize + 4) + 6));
  }
  export default {
    name: 'ApplyOperateTip',
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object,
      IntroduceUserDefinedTempSearch: Object
    },
    components: {
      UserSearch,
      UserEdit
      // UserImport
    },
    data() {
      return {
        // 表格列配置
        columns: [
          // {
          //   columnKey: 'selection',
          //   type: 'selection',
          //   width: 45,
          //   align: 'center',
          //   fixed: 'left'
          // },
          {
            label: '序',
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          // {
          //   columnKey: 'action',
          //   label: '操作',
          //   width: 220,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true
          // },
          {
            prop: 'PLAN_NUMBER',
            label: '单号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'PLAN_TIME',
            label: '时间',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
            // formatter: (_row, _column, cellValue) => {
            //   if (cellValue == null) {
            //     cellValue = '未定义';
            //   }
            //   return cellValue;
            // }
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产厂家',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPLY_QTY',
            label: '申请数量',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SEND_QUANITY',
            label: '配送中',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: '',
            label: '未配送',
            width: 80,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return _row.APPLY_QTY - _row.SEND_QUANITY - _row.GET_QUANITY;
            }
          },
          {
            prop: 'GET_QUANITY',
            label: '已收货',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: '',
            label: '未收货',
            width: 80,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return _row.APPLY_QTY - _row.GET_QUANITY;
            }
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            width: 80,
            showOverflowTooltip: true,
            show: false
          },
          {
            prop: 'PRICE',
            label: '单价',
            align: 'center',
            width: 80,
            showOverflowTooltip: true,
            show: HOME_HP == 'bdrm',
            formatter: (_row, _column, cellValue) => {
              return Number(cellValue || 0).toFixed(2);
            }
          },
          {
            prop: 'AMOUNT',
            label: '总金额',
            align: 'center',
            width: 100,
            showOverflowTooltip: true,
            show: HOME_HP == 'bdrm',
            formatter: (row) => {
              return (Number(row.PRICE || 0) * Number(row.APPLY_QTY || 0)).toFixed(2);
            }
          }
        ],
        toolbar: false,
        pageSize: 15,
        pageSizes: [15, 50, 100, 200, 9999999],
        pagerCount: 5,
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        showEdit: false,
        // 是否显示导入弹窗
        showImport: false,
        isUpdate: false,

        // 添加品种数量
        APPLY_QTY: 0
        // datasource: [],
      };
    },
    methods: {
      getDefaultPlanTimeRange() {
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 3600 * 1000);
        const endStr =
          endDate.getFullYear() +
          '-' +
          pad(endDate.getMonth() + 1) +
          '-' +
          pad(endDate.getDate());
        const startStr =
          startDate.getFullYear() +
          '-' +
          pad(startDate.getMonth() + 1) +
          '-' +
          pad(startDate.getDate());
        return {
          PLAN_TIME_START: startStr,
          PLAN_TIME_END: endStr
        };
      },
      buildRequestWhere(where = {}) {
        const nextWhere = { ...where };
        if (!nextWhere.PLAN_TIME_START && !nextWhere.PLAN_TIME_END) {
          Object.assign(nextWhere, this.getDefaultPlanTimeRange());
        }
        return nextWhere;
      },
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;

        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        const requestWhere = this.buildRequestWhere(where);
        requestWhere.DEPT_TWO_CODE = DEPT_TWO_CODEStr;
        let data = getApplyOperateTip({ page, limit, where: requestWhere, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      /* 打开编辑弹窗 */
      openEdit(row) {
        this.current = row;
        this.showEdit = true;
      },
      /* 打开导入弹窗 */
      openImport() {
        this.showImport = true;
      },
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      addKSKSDepartmentalPlanData() {
        const loading = this.$messageLoading('添加中..');
        this.selection.forEach((element) => {
          element.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
        });
        KeeptListDeta(this.selection).then((res) => {
          loading.close();
          this.updateVisible(false);
          this.$message.success(res.msg);
        });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },

      handleNewExportData(data) {
        // 北京人民：前端导出附带单价/金额；其他医院仍走原服务端导出
        if (HOME_HP == 'bdrm') {
          this.handleExportData(data);
          return;
        }
        const loading = this.$messageLoading('正在导出数据...');
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;
        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        const localWhere = {
          ...data,
          DEPT_TWO_CODE: DEPT_TWO_CODEStr
        };
        this.$refs.table.doRequest(({ where, order }) => {
          getApplyOperateTipExcel({
            page: 1,
            limit: 999999,
            where: localWhere,
            order: order
          })
            .then((res) => {
              var url = `${BACK_BASE_URL}/Excel/files/${res.msg}`;
              window.open(url.replace('/undefined', ''));
            })
            .finally(() => {
              loading.close();
            });
        });
      },

      handleExportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        var Dept_Two_CodeArray = this.$store.state.user.info.userDept;
        var DEPT_TWO_CODEStr = '';
        for (let i = 0; i < Dept_Two_CodeArray.length; i++) {
          DEPT_TWO_CODEStr += Dept_Two_CodeArray[i].Dept_Two_Code + ',';
        }
        const localWhere = {
          ...data,
          DEPT_TWO_CODE: DEPT_TWO_CODEStr
        };
        this.$refs.table.doRequest(({ where, order }) => {
          getApplyOperateTip({
            page: 1,
            limit: 999999,
            where: localWhere,
            order: order
          })
            .then(async (res) => {
              if (res?.result.length == 0)
                return this.$message.error('没有数据可导出');

              const headers = [
                '单号',
                '时间',
                '品种编码',
                '品种名称',
                '型号/规格',
                '生产厂家',
                '批准文号',
                '申请数量',
                '配送中',
                '未配送',
                '已收货',
                '未收货',
                '单位',
                '单价',
                '金额'
              ];
              // 固定列宽，长文本靠换行 + 行高自适应完整展示（北京人民样式）
              const colWidths = [14, 18, 12, 22, 18, 20, 18, 10, 10, 10, 10, 10, 8, 10, 12];
              const rows = res.result.map((d) => [
                d.PLAN_NUMBER,
                d.PLAN_TIME,
                d.VARIETIE_CODE_NEW,
                d.VARIETIE_NAME,
                d.SPECIFICATION_OR_TYPE,
                d.MANUFACTURING_ENT_NAME,
                d.APPROVAL_NUMBER,
                d.APPLY_QTY,
                d.SEND_QUANITY,
                d.APPLY_QTY - d.SEND_QUANITY - d.GET_QUANITY,
                d.GET_QUANITY,
                d.APPLY_QTY - d.GET_QUANITY,
                d.UNIT,
                Number(d.PRICE || 0).toFixed(4),
                (Number(d.PRICE || 0) * Number(d.APPLY_QTY || 0)).toFixed(4)
              ]);

              const ExcelJS = (await import('exceljs')).default;
              const workbook = new ExcelJS.Workbook();
              const sheet = workbook.addWorksheet('订单详情');
              sheet.columns = colWidths.map((width) => ({ width }));

              const thinBorder = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              };
              const centerWrap = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
              };

              const headerRow = sheet.addRow(headers);
              headerRow.height = 22;
              headerRow.eachCell((cell) => {
                cell.font = { bold: true, name: '宋体', size: 10 };
                cell.alignment = centerWrap;
                cell.border = thinBorder;
              });

              rows.forEach((rowData) => {
                const dataRow = sheet.addRow(rowData);
                dataRow.height = estimateRowHeight(rowData, colWidths, 10);
                dataRow.eachCell({ includeEmpty: true }, (cell) => {
                  cell.font = { name: '黑体', size: 9 };
                  cell.alignment = centerWrap;
                  cell.border = thinBorder;
                });
              });

              const buffer = await workbook.xlsx.writeBuffer();
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '查看订单详情.xlsx';
              a.click();
              URL.revokeObjectURL(url);
              this.$message.success('导出成功');
            })
            .catch((e) => {
              this.$message.error(e.message);
            })
            .finally(() => {
              loading.close();
            });
        });
      }
    },
    watch: {
      visible(visible) {
        if (visible) {
          if (this.data) {
            this.$util.assignObject(this.form, this.data);
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
          }
        } else {
          // this.$refs.form.clearValidate();
          this.form = { ...this.defaultForm };
        }
      }
    },
    created() {
      // this.getdatasource();
    }
  };
</script>


<style scoped>
  :deep(.el-card__body) {
      padding: 0;
  }
</style>