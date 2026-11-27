<template>
  <div class="apply-temp-data-table">
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">品种查询</div>
      <ApplyTempDataSearch
        ref="Apply"
        @search="reload"
        @addTempVar="$emit('addTempVar')"
        @saveApplyNum="saveApplyNum"
        @removeBatch="removeBatch"
        :IntroduceUserDefinedTempSearch="IntroduceUserDefinedTempSearch"
        @exportData="exportData"
        :ApplyTempTableDataSearch="ApplyTempTableDataSearch"
        :selection="selection"
        @showEditReoad="showEditReoad"
      />
    </div>

    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>模板品种列表</span>
        <span class="spd-panel__head-meta">
          已勾选:
          <el-tag size="mini" effect="plain">{{ selection?.length || 0 }}</el-tag>
        </span>
      </div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          class="data-table"
          size="mini"
          border
          stripe
          highlight-current-row
          :toolkit="['columns', 'fullscreen']"
          :header-overflow-hidden="false"
          :height="tableHeight"
          full-height="calc(100vh - 100px)"
          style="background: #fff"
          :rowClickCheckedIntelligent="false"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="YZApplyTempCoefDetailTable"
          @selection-change="onSelectionChange"
        >
          <!-- 系数下拉 -->
          <template v-slot:COEFFICIENT="{ row }">
            <el-select
              v-model="row.COEFFICIENT"
              size="mini"
              style="width: 70px"
              @change="onRowCoefOrPackChange(row)"
            >
              <el-option
                v-for="coef in row.COEFFICIENT_OPTIONS"
                :key="coef"
                :label="String(coef)"
                :value="coef"
              />
            </el-select>
          </template>

          <!-- 模板申领包数 -->
          <template v-slot:PACK_QTY="{ row }">
            <el-input-number
              v-model="row.PACK_QTY"
              :min="0"
              :max="999999999"
              :step="1"
              :precision="0"
              controls-position="right"
              size="mini"
              style="width: 100px"
              @change="onRowCoefOrPackChange(row)"
            />
          </template>

          <!-- 散货数量（自动计算） -->
          <template v-slot:TempletQty="{ row }">
            <span><b>{{ row.TempletQty }}</b></span>
          </template>

          <template v-slot:AUTH="{ row }">
            <el-input
              style="width: 120px"
              v-model="row.AUTH"
              :min="0"
              :max="999999999"
              :step="1"
              size="mini"
            />
          </template>

          <template v-slot:DEPT_ZDY_VARIETIE_CODE="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="openZdyCodeEdit(row)"
            >
              {{
                row.DEPT_ZDY_VARIETIE_CODE == null
                  ? '未定义'
                  : row.DEPT_ZDY_VARIETIE_CODE
              }}
            </el-link>
          </template>

          <template v-slot:action="{ row }">
            <el-popconfirm
              class="ele-action"
              title="确定要删除此品种？"
              @confirm="remove(row)"
            >
              <template v-slot:reference>
                <el-link type="danger" :underline="false" icon="el-icon-delete">
                  删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </ele-pro-table>
      </div>
    </div>

    <el-dialog
      :title="(zdyEditRow?.VarName || '') + ' 自定义编码'"
      :visible.sync="zdyEditVisible"
      width="520px"
      append-to-body
      @closed="onZdyEditClosed"
    >
      <el-input
        v-model="zdyEditValue"
        type="textarea"
        :rows="6"
        placeholder="请输入自定义编码"
      />
      <span slot="footer">
        <el-button size="mini" @click="zdyEditVisible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="zdyEditSaving"
          @click="saveZdyCode"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ApplyTempDataSearch from '@/views/KSInventory/ApplyTemp/components/ApplyTempDataSearch.vue';
import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';
import {
  SerachTempletDeta,
  DeleteTempletDeta,
  KeepTempletDeta,
  addDPET_ZDY_INFO
} from '@/api/KSInventory/ApplyTemp';

export default {
  name: 'ApplyTempCoefDataTable',
  props: ['ApplyTempTableData', 'IntroduceUserDefinedTempSearch'],
  components: {
    ApplyTempDataSearch
  },
  data() {
    return {
      zdyEditVisible: false,
      zdyEditSaving: false,
      zdyEditRow: null,
      zdyEditValue: '',
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          columnKey: 'index',
          type: 'index',
          label: '序',
          width: 45,
          align: 'center',
          fixed: 'left',
          showOverflowTooltip: true
        },
        {
          columnKey: 'COEFFICIENT',
          slot: 'COEFFICIENT',
          label: '系数',
          align: 'center',
          fixed: 'left',
          width: 92
        },
        {
          columnKey: 'PACK_QTY',
          slot: 'PACK_QTY',
          label: '实际申领包数',
          align: 'center',
          fixed: 'left',
          width: 122
        },
        {
          columnKey: 'TempletQty',
          slot: 'TempletQty',
          label: '散货数量',
          align: 'center',
          fixed: 'left',
          width: 92
        },
        {
          prop: 'GG',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'Price',
          label: '中标价',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            return Number(cellValue).toFixed(2);
          }
        },
        {
          prop: 'Manufacturing',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          show: true
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'DEPT_ZDY_VARIETIE_CODE',
          label: '自定义编码',
          slot: 'DEPT_ZDY_VARIETIE_CODE',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'VarName',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Used_Name',
          label: '常用名',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'BigBoxCount',
          label: '大包装数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: true
        },
        {
          prop: 'MinBoxCount',
          label: '中包装数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: true
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'DeptQty',
          label: '科室库存',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'StockQty',
          label: '中心库库存',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Day_Consume_Qty',
          label: '平均使用数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Day_Consume_Qty2',
          label: '上月使用数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'ZB',
          label: '是否中标',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '否';
            } else if (cellValue == 1) {
              return '是';
            } else {
              return '未知';
            }
          }
        },
        {
          prop: 'PAG_TYPE',
          label: '包装规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          columnKey: 'AUTH',
          prop: 'AUTH',
          slot: 'AUTH',
          label: '排序',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 75
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 80,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          className: 'action-col'
        }
      ],
      pageSize: 9999999,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      current: null,
      showEdit: false,
      showImport: false,
      data: [],
      isHideDeptSup: true,
      tableHeight: '70vh'
    };
  },
  methods: {
    onRowCoefOrPackChange(row) {
      const coef = Number(row.COEFFICIENT) > 0 ? Number(row.COEFFICIENT) : 1;
      const packQty = Math.max(0, Math.floor(Number(row.PACK_QTY) || 0));
      this.$set(row, 'COEFFICIENT', coef);
      this.$set(row, 'PACK_QTY', packQty);
      this.$set(row, 'TempletQty', String(packQty * coef));
    },
    saveApplyNum() {
      if (!this.selection || this.selection.length === 0) {
        this.$message.warning('请先勾选需要保存的模板品种');
        return;
      }
      const loading = this.$messageLoading('保存中...');
      const payload = this.selection.map((item) => {
        const coef =
          Number(item.COEFFICIENT) > 0 ? Number(item.COEFFICIENT) : 1;
        const packQty = Math.max(0, Math.floor(Number(item.PACK_QTY) || 0));
        return {
          ID: item.ID,
          TempletQty: String(packQty * coef),
          AUTH: item.AUTH != null ? String(item.AUTH) : '0',
          COEFFICIENT: coef,
          PACK_QTY: packQty
        };
      });
      KeepTempletDeta(payload)
        .then((res) => {
          loading.close();
          this.reload();
          this.$message.success(res.msg || '保存成功');
        })
        .catch((err) => {
          loading.close();
          this.$message.error((err && err.message) || err || '保存失败');
        });
    },
    removeBatch() {
      if (!this.selection || this.selection.length === 0) {
        this.$message.warning('请先勾选需要删除的品种');
        return;
      }
      const ids = this.selection.map((item) => item.ID).join(',');
      const loading = this.$messageLoading('删除中...');
      DeleteTempletDeta({ ID: ids })
        .then((res) => {
          loading.close();
          this.$message.success(res.msg || '删除成功');
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message.error((err && err.message) || err || '删除失败');
        });
    },
    checkHideManufacturingColumn() {
      const homehp = HOME_HP;
      let isHideDeptSup = true;
      if (
        homehp == 'csyy' ||
        homehp == 'stzx' ||
        homehp == 'stse' ||
        homehp == 'stzl' ||
        homehp == 'stzyyy' ||
        homehp == 'fsdwrmyy'
      ) {
        isHideDeptSup = false;
      }
      this.isHideDeptSup = isHideDeptSup;
      const manufacturingColumn = this.columns.find(
        (col) => col.prop === 'Manufacturing'
      );
      if (manufacturingColumn) {
        manufacturingColumn.show = isHideDeptSup;
      }
    },
    datasource({ page, limit, where, order }) {
      where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      where.UserId = this.$store.state.user.info.ID;
      where.TempletMasteID = this.ApplyTempTableData.ID;
      where.PlanNum = this.IntroduceUserDefinedTempSearch?.PlanNum;
      return SerachTempletDeta({ page, limit, where, order }).then((res) => {
        let list = (res.result || []).map((item) => {
          const coef =
            Number(item.COEFFICIENT) > 0 ? Number(item.COEFFICIENT) : 1;
          const bulkQty = Number(item.TempletQty) || 0;
          const packQty =
            item.PACK_QTY != null && item.PACK_QTY !== ''
              ? Number(item.PACK_QTY)
              : Math.floor(bulkQty / coef);
          const coefSet = new Set([coef]);
          if (Array.isArray(item.COEFFICIENTS)) {
            item.COEFFICIENTS.forEach((c) => {
              const val = Number(c);
              if (Number.isFinite(val) && val > 0) {
                coefSet.add(val);
              }
            });
          }
          const coefOptions = Array.from(coefSet).sort((a, b) => a - b);
          return {
            ...item,
            COEFFICIENT: coef,
            COEFFICIENT_OPTIONS: coefOptions,
            PACK_QTY: packQty,
            TempletQty: String(packQty * coef)
          };
        });

        if (order && order.sort === 'DEPT_ZDY_VARIETIE_CODE' && order.order) {
          const dir =
            order.order === 'desc' || order.order === 'descending' ? -1 : 1;
          list = list.slice().sort((a, b) => {
            const va = a.DEPT_ZDY_VARIETIE_CODE || '';
            const vb = b.DEPT_ZDY_VARIETIE_CODE || '';
            return (
              String(va).localeCompare(String(vb), 'zh', {
                numeric: true,
                sensitivity: 'base'
              }) * dir
            );
          });
        }
        const tData = {
          count: res.total,
          list
        };
        this.$nextTick(() => {
          this.$refs.table.toggleAllSelection();
        });
        return tData;
      });
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where });
    },
    openZdyCodeEdit(row) {
      this.zdyEditRow = row;
      this.zdyEditValue =
        row.DEPT_ZDY_VARIETIE_CODE == null
          ? ''
          : String(row.DEPT_ZDY_VARIETIE_CODE);
      this.zdyEditVisible = true;
    },
    onZdyEditClosed() {
      this.zdyEditRow = null;
      this.zdyEditValue = '';
      this.zdyEditSaving = false;
    },
    saveZdyCode() {
      if (!this.zdyEditRow) return;
      const deptCode =
        this.zdyEditRow.DeptCode ||
        this.$store.state.user.info.DeptNow.Dept_Two_Code;
      const varietieCode =
        this.zdyEditRow.VarID || this.zdyEditRow.VARIETIE_CODE;
      if (!deptCode || !varietieCode) {
        this.$message.error('缺少科室或品种信息，无法保存');
        return;
      }
      this.zdyEditSaving = true;
      addDPET_ZDY_INFO({
        DEPT_TWO_CODE: deptCode,
        VARIETIE_CODE: varietieCode,
        DEPT_ZDY_VARIETIE_CODE: this.zdyEditValue
      })
        .then((res) => {
          this.zdyEditSaving = false;
          this.$message.success(res.msg || '编辑成功');
          this.zdyEditVisible = false;
          this.reload();
        })
        .catch((err) => {
          this.zdyEditSaving = false;
          this.$message.error(err.message || err);
        });
    },
    remove(row) {
      const loading = this.$messageLoading('删除中...');
      DeleteTempletDeta({ ID: row.ID })
        .then((res) => {
          loading.close();
          this.$message(res.msg);
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message(err);
        });
    },
    onSelectionChange(selection) {
      this.selection = selection;
      this.$emit('selectionData', selection);
    },
    showEditReoad(data) {
      if (data == false) {
        const where = {
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          UserId: this.$store.state.user.info.ID,
          TempletMasteID: this.ApplyTempTableData.ID
        };
        this.$refs.table.reload({ page: 1, where });
      }
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.UserId = this.$store.state.user.info.ID;
        where.TempletMasteID = this.ApplyTempTableData.ID;
        SerachTempletDeta({
          page: 1,
          limit: 999999,
          where,
          order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '自定义编码',
                '系数',
                '实际申领包数',
                '散货数量',
                '排序',
                '品种全称',
                '常用名',
                '规格/型号',
                '单位',
                '结算价',
                '生产企业名称',
                '供应商',
                '科室库存',
                '散货库存',
                '平均使用数量',
                '包装规格',
                '是否中标'
              ]
            ];
            (res.result || []).forEach((d) => {
              const coef =
                Number(d.COEFFICIENT) > 0 ? Number(d.COEFFICIENT) : 1;
              const bulkQty = Number(d.TempletQty) || 0;
              const packQty =
                d.PACK_QTY != null && d.PACK_QTY !== ''
                  ? Number(d.PACK_QTY)
                  : Math.floor(bulkQty / coef);
              const zbText = d.ZB == 0 ? '否' : d.ZB == 1 ? '是' : '未知';
              array.push([
                d.VARIETIE_CODE_NEW,
                d.DEPT_ZDY_VARIETIE_CODE == null
                  ? '未定义'
                  : d.DEPT_ZDY_VARIETIE_CODE,
                coef,
                packQty,
                packQty * coef,
                d.AUTH,
                d.VarName,
                d.Used_Name,
                d.GG,
                d.Unit,
                d.Price,
                d.Manufacturing,
                d.SUPPLIER_NAME,
                d.DeptQty,
                d.StockQty,
                d.Day_Consume_Qty,
                d.PAG_TYPE,
                zbText
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室申领模板品种.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ApplyTempTableData;
    }
  },
  watch: {
    ApplyTempTableDataSearch() {
      const where = {
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        UserId: this.$store.state.user.info.ID,
        TempletMasteID: this.ApplyTempTableData.ID
      };
      this.$refs.table.reload({ page: 1, where });
    }
  },
  created() {
    localStorage.setItem(
      'YZApplyTempCoefDetailTableSize',
      JSON.stringify('mini')
    );
    this.checkHideManufacturingColumn();
  }
};
</script>

<style scoped lang="scss">
.apply-temp-data-table >>> .el-table th .cell {
  white-space: nowrap;
}

.apply-temp-data-table >>> .ele-table-tool-default {
  padding: 2px 0 0 4px;
}

.apply-temp-data-table >>> .ele-table-tool .ele-table-tool-title {
  margin: 0;
}

.apply-temp-data-table >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.el-table--mini .el-table__cell) {
  padding: 1px 0px !important;
}

:deep(.el-table th.el-table__cell > .cell) {
  padding-left: 1px !important;
  padding-right: 1px !important;
}

:deep(.el-table__row .el-table__cell) {
  padding: 1px 0px !important;
}
</style>
