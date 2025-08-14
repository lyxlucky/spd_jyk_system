<template>
  <el-dialog
    title="汇总信息"
    :visible="dialogVisible"
    width="80%"
    top="5vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
  >
    <ele-pro-table
      size="mini"
      ref="table"
      :columns="columns"
      height="60vh"
      :datasource="datasource"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      highlight-current-row
      :stripe="true"
      :needPage="true"
    >
      <template v-slot:toolbar>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-download"
          @click="handleExport"
          >导出</el-button
        >
      </template>
    </ele-pro-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { getBdSzYyHisSsHz } from '@/api/Task/OPSConsumables';
  import { exportToExcel } from '@/utils/excel-util.js';

  export default {
    name: 'SummaryDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      selectedSSBH: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        columns: [
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
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
          }
        ],
        pageSize: 999999,
        pageSizes: [10, 20, 50, 100, 999999]
      };
    },
    computed: {
      dialogVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        }
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false;
      },
      handleExport() {
        const loading = this.$messageLoading('导出中...');
        getBdSzYyHisSsHz({
          page: 1,
          limit: 999999,
          where: {
            SSBH: this.selectedSSBH.map((item) => `'${item}'`).join(',')
          }
        })
          .then((res) => {
            if (res?.data.length == 0)
              return this.$message.error('没有数据可导出');
            const array = [
              [
                '品种编码',
                '品种名称',
                '规格型号',
                '预约数量',
                '单位',
                '生产企业',
                '散货库存',
                '定数包库存',
              ]
            ];

            res.data.forEach((item) => {
              array.push([
                item.VARIETIE_CODE_NEW,
                item.VARIETIE_NAME,
                item.SPECIFICATION_OR_TYPE,
                item.FYSL,
                item.UNIT,
                item.MANUFACTURING_ENT_NAME,
                item.SH_QTY,
                item.DEF_QTY
              ]);
            });

            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '查看汇总.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch(() => {
            loading.close();
            this.$message.error('导出失败！');
          })
          .finally(() => {
            loading.close();
          });
      },
      datasource({ page, limit }) {
        return getBdSzYyHisSsHz({
          page,
          limit,
          where: {
            SSBH: this.selectedSSBH.map((item) => `'${item}'`).join(',')
          }
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100vh - 30px);
    max-width: calc(100vw - 30px);
  }
</style>
