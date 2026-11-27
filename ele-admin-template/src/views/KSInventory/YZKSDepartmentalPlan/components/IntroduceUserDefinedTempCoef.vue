<template>
  <ele-modal
    top="10vh"
    :destroy-on-close="true"
    width="92%"
    height="80%"
    :visible="visible"
    :close-on-click-modal="false"
    custom-class="ele-dialog-form"
    title="授权品种目录"
    @update:visible="updateVisible"
  >
    <div class="">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <user-search @addKSKS="addKSKSDepartmentalPlanData" @search="reload" />
        <!-- 数据表格 -->
        <ele-pro-table
          ref="table"
          height="500px"
          :row-key="(row) => row.VarID"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          @selection-change="onSelectionChange"
          cache-key="YZIntroduceUserDefinedTempCoefTable"
        >
          <!-- 系数选择列 -->
          <template v-slot:COEFFICIENT="{ row }">
            <el-select
              v-model="row.COEFFICIENT"
              size="mini"
              style="width: 80px"
              placeholder="选择系数"
              @change="onCoefficientChange(row)"
            >
              <el-option
                v-for="coef in row.COEFFICIENT_OPTIONS"
                :key="coef"
                :label="String(coef)"
                :value="coef"
              />
            </el-select>
          </template>

          <!-- 实际申领包数（用户输入） -->
          <template v-slot:INPUT_QTY="{ row }">
            <el-input-number
              v-model="row.INPUT_QTY"
              :min="0"
              :max="99999999"
              :step="1"
              :precision="0"
              size="mini"
              controls-position="right"
              style="width: 100px"
              @change="onInputQtyChange(row)"
            />
          </template>

          <!-- 散货数量（实际申领包数 × 系数） -->
          <template v-slot:CONVERTED_APPLY_QTY="{ row }">
            <span class="coef-converted-qty">
              <b>{{ getConvertedQty(row) }}</b>
            </span>
          </template>

          <template v-slot:STOCK_QTY="{ row }">
            <el-tag v-if="row.STOCK_QTY == 0" type="danger">{{
              row.STOCK_QTY
            }}</el-tag>
            <el-tag v-else type="success">{{ row.STOCK_QTY }}</el-tag>
          </template>

          <template v-slot:IMAGE_BUTTON="{ row }">
            <el-button type="primary" size="mini" @click="openImageDialog(row)"
              >图片</el-button
            >
          </template>
        </ele-pro-table>
      </el-card>

      <!-- 编辑弹窗 -->
      <user-edit :visible.sync="showEdit" :data="current" @done="reload" />

      <!-- 图片对话框 -->
      <el-dialog
        title="图片查看"
        :visible.sync="imageDialogVisible"
        top="1vh"
        width="90%"
        :append-to-body="true"
        :before-close="closeImageDialog"
      >
        <ImageViewComponent
          v-if="imageDialogVisible"
          :row-data="currentImageRow"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeImageDialog">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </ele-modal>
</template>

<script>
import UserSearch from '@/views/KSInventory/IntroduceUserDefinedTemp/components/user-search.vue';
import UserEdit from '@/views/KSInventory/IntroduceUserDefinedTemp/components/user-edit.vue';
import ImageViewComponent from '@/views/KSInventory/KSDepartmentalPlan/components/ImageViewComponent.vue';
import {
  SerachAuthVarWithCoef,
  KeeptListDeta
} from '@/api/KSInventory/IntroduceUserDefinedTemp';

function parseCoefficientOptions(row) {
  const set = new Set();
  const rawList =
    row.COEFFICIENTS ||
    row.COEFFICIENT_LIST ||
    row.DEF_NO_PKG_COEFFICIENTS;

  if (Array.isArray(rawList) && rawList.length > 0) {
    rawList.forEach((item) => {
      const val =
        item && typeof item === 'object'
          ? Number(item.DEF_NO_PKG_COEFFICIENT || item.COEFFICIENT || item.value)
          : Number(item);
      if (Number.isFinite(val) && val > 0) {
        set.add(val);
      }
    });
  } else if (typeof rawList === 'string' && rawList.trim() !== '') {
    rawList.split(/[,，;；\s]+/).forEach((part) => {
      const val = Number(part);
      if (Number.isFinite(val) && val > 0) {
        set.add(val);
      }
    });
  } else {
    // 兜底：后端未返回 COEFFICIENTS 数组时沿用原有字段
    set.add(1);
    const singleCoef = Number(row.DEF_NO_PKG_COEFFICIENT);
    if (Number.isFinite(singleCoef) && singleCoef > 0) {
      set.add(singleCoef);
    }
  }

  if (set.size === 0) {
    set.add(1);
  }
  return Array.from(set).sort((a, b) => a - b);
}

export default {
  name: 'YZIntroduceUserDefinedTempCoef',
  props: {
    visible: Boolean,
    data: Object,
    IntroduceUserDefinedTempSearch: Object
  },
  components: {
    UserSearch,
    UserEdit,
    ImageViewComponent
  },
  data() {
    return {
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left',
          reserveSelection: true
        },
        {
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'IMAGE_BUTTON',
          slot: 'IMAGE_BUTTON',
          label: '图片',
          align: 'center',
          width: 80
        },
        {
          prop: 'VAR_REMARK',
          label: '品种备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == null) {
              cellValue = '无';
            }
            return cellValue;
          }
        },
        {
          prop: 'STOCK_QTY',
          slot: 'STOCK_QTY',
          align: 'center',
          label: '中心库剩余库存',
          minWidth: 120
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '材料编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'IS_CHARGE',
          label: '是否收费',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == null) {
              return '未定义';
            }
            return cellValue == 1 ? '是' : '否';
          }
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'DEPT_ZDY_VARIETIE_CODE',
          label: '自定义编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == null) {
              return '未定义';
            }
            return cellValue;
          }
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 300
        },
        {
          prop: 'USED_NAME',
          label: '常用名',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 140
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'BIG_BOX_COUNT',
          label: '大包装数量',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MIDDLE_PACKAGE_COUNT',
          label: '中包装数量',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PAG_TYPE',
          label: '包装规格',
          width: 140,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Supply_Price',
          label: '结算价',
          width: 90,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
            return Number(cellValue).toFixed(2);
          }
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业名称',
          width: 200,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '合同供应商',
          width: 200,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'StockQty',
          label: '散货库存',
          width: 90,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'DEPT_TWO_QTY',
          label: '科室库存',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'ZB',
          label: '是否中标',
          width: 90,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
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
          prop: 'CLASSIFIC_NAME',
          label: '物料分类',
          width: 110,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          columnKey: 'COEFFICIENT',
          slot: 'COEFFICIENT',
          label: '系数',
          width: 110,
          align: 'center',
          fixed: 'right'
        },
        {
          columnKey: 'INPUT_QTY',
          slot: 'INPUT_QTY',
          label: '实际申领包数',
          width: 130,
          align: 'center',
          fixed: 'right'
        },
        {
          columnKey: 'CONVERTED_APPLY_QTY',
          slot: 'CONVERTED_APPLY_QTY',
          label: '散货数量',
          width: 100,
          align: 'center',
          fixed: 'right'
        },
        {
          prop: 'VARIETIE_CODE',
          label: 'VARIETIE_CODE',
          align: 'center',
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'APPLY_TEMPLET_MAIN_ID',
          label: 'APPLY_TEMPLET_MAIN_ID',
          align: 'center',
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'Enable',
          label: 'Enable',
          align: 'center',
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'PLAN_NUMBER',
          label: '申领单',
          align: 'center',
          showOverflowTooltip: true,
          show: false
        }
      ],
      toolbar: false,
      pageSize: 15,
      pageSizes: [15, 50, 100, 200, 9999999],
      pagerCount: 5,
      selection: [],
      current: null,
      showEdit: false,
      showImport: false,
      isUpdate: false,
      imageDialogVisible: false,
      currentImageRow: null,
      autoSelectAfterSearch: false,
      accumulatedSelection: {},
      selectedCodeMap: {},
      tableReloading: false
    };
  },
  methods: {
    getPackQty(row) {
      const qty = Number(row.INPUT_QTY);
      return Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0;
    },
    getConvertedQty(row) {
      const coef = Number(row.COEFFICIENT) > 0 ? Number(row.COEFFICIENT) : 1;
      return this.getPackQty(row) * coef;
    },
    syncRowApplyQty(row) {
      const coef = Number(row.COEFFICIENT) > 0 ? Number(row.COEFFICIENT) : 1;
      const packQty = this.getPackQty(row);
      const convertedQty = packQty * coef;
      this.$set(row, 'PACK_QTY', packQty);
      this.$set(row, 'APPLY_QTY', String(convertedQty));
      const key = this.getRowSelectKey(row);
      if (key && this.accumulatedSelection[key]) {
        this.$set(this.accumulatedSelection, key, row);
      }
    },
    onCoefficientChange(row) {
      this.syncRowApplyQty(row);
    },
    onInputQtyChange(row) {
      this.syncRowApplyQty(row);
      if (this.getPackQty(row) > 0) {
        const table = this.getTableInner();
        if (table) {
          this.rememberSelectedRow(row);
          table.toggleRowSelection(row, true);
        }
      }
    },
    getRowSelectKey(row) {
      return row && row.VarID != null ? String(row.VarID) : '';
    },
    getRowVarietyCode(row) {
      if (!row) return '';
      const code =
        row.VARIETIE_CODE_NEW ||
        row.varietie_CODE_NEW ||
        row.VarCode ||
        row.varCode ||
        '';
      return String(code).trim();
    },
    getTableInner() {
      return (
        this.$refs.table &&
        this.$refs.table.$refs &&
        this.$refs.table.$refs.table
      );
    },
    getVisibleRowKeys() {
      const table = this.getTableInner();
      const list = (table && table.data) || [];
      return list.map((row) => this.getRowSelectKey(row)).filter(Boolean);
    },
    rememberSelectedRow(row) {
      const key = this.getRowSelectKey(row);
      if (!key) return;
      this.$set(this.accumulatedSelection, key, row);
      const code = this.getRowVarietyCode(row);
      if (code) {
        this.$set(this.selectedCodeMap, key, code);
      }
    },
    clearAccumulatedSelection() {
      this.accumulatedSelection = {};
      this.selectedCodeMap = {};
      this.selection = [];
      this.autoSelectAfterSearch = false;
      this.tableReloading = false;
      this.$nextTick(() => {
        const table = this.getTableInner();
        if (table && table.clearSelection) {
          table.clearSelection();
        }
      });
    },
    sortSelectionForInsert(rows) {
      const sorted = rows.slice().sort((a, b) => {
        const keyA = this.getRowSelectKey(a);
        const keyB = this.getRowSelectKey(b);
        const codeA = this.selectedCodeMap[keyA] || this.getRowVarietyCode(a);
        const codeB = this.selectedCodeMap[keyB] || this.getRowVarietyCode(b);
        const numA = Number(codeA);
        const numB = Number(codeB);
        if (
          codeA !== '' &&
          codeB !== '' &&
          !Number.isNaN(numA) &&
          !Number.isNaN(numB)
        ) {
          return numA - numB;
        }
        return String(codeA).localeCompare(String(codeB), 'zh', {
          numeric: true,
          sensitivity: 'base'
        });
      });
      return sorted.reverse();
    },
    datasource({ page, limit, where, order }) {
      where.DeptCode = this.IntroduceUserDefinedTempSearch.PlanDept
        ? this.IntroduceUserDefinedTempSearch.PlanDept
        : this.$store.state.user.info.DeptNow.Dept_Two_Code;
      where.PlanNum = this.IntroduceUserDefinedTempSearch.PlanNum;
      const needAutoSelect = this.autoSelectAfterSearch;
      this.autoSelectAfterSearch = false;
      return SerachAuthVarWithCoef({
        page,
        limit,
        where,
        order,
        routePath: this.$route.path
      })
        .then((res) => {
          const list = (res.result || []).map((row) => {
            const key = this.getRowSelectKey(row);
            const cached = key ? this.accumulatedSelection[key] : null;
            const options = parseCoefficientOptions(row);
            const defaultCoef = options.includes(1) ? 1 : (options[0] || 1);
            const selectedCoef =
              cached && Number(cached.COEFFICIENT) > 0
                ? Number(cached.COEFFICIENT)
                : defaultCoef;
            const inputQty =
              cached && Number.isFinite(Number(cached.INPUT_QTY))
                ? Number(cached.INPUT_QTY)
                : Number(row.APPLY_QTY) || 0;
            const convertedQty = inputQty * selectedCoef;
            return {
              ...row,
              COEFFICIENT_OPTIONS: options,
              COEFFICIENT: selectedCoef,
              INPUT_QTY: inputQty,
              PACK_QTY: inputQty,
              APPLY_QTY: String(convertedQty)
            };
          });
          const tData = {
            count: res.total,
            list
          };
          if (needAutoSelect) {
            this.applySingleResultAutoSelect(list, res.total);
          } else if (this.tableReloading) {
            this.tableReloading = false;
          }
          return tData;
        })
        .catch((err) => {
          this.tableReloading = false;
          return Promise.reject(err);
        });
    },
    applySingleResultAutoSelect(list, total) {
      this.$nextTick(() => {
        try {
          const table = this.getTableInner();
          if (!table) return;
          (list || []).forEach((row) => {
            const key = this.getRowSelectKey(row);
            if (key && this.accumulatedSelection[key]) {
              table.toggleRowSelection(row, true);
            }
          });
          if (total === 1 && list && list.length === 1) {
            const row = list[0];
            this.rememberSelectedRow(row);
            table.toggleRowSelection(row, true);
          }
        } finally {
          this.tableReloading = false;
        }
      });
    },
    reload(where) {
      this.autoSelectAfterSearch = true;
      this.tableReloading = true;
      this.$refs.table.reload({
        page: 1,
        where: { ...where, PlanNum: this.IntroduceUserDefinedTempSearch.PlanNum }
      });
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    openImport() {
      this.showImport = true;
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    addKSKSDepartmentalPlanData() {
      const selectedRows = this.sortSelectionForInsert(
        Object.values(this.accumulatedSelection || {})
      );
      if (!selectedRows || selectedRows.length === 0) {
        this.$message.warning('请先选择数据');
        return;
      }
      const payload = selectedRows.map((element) => {
        const coef =
          Number(element.COEFFICIENT) > 0 ? Number(element.COEFFICIENT) : 1;
        const inputQty = this.getPackQty(element);
        const convertedQty = inputQty * coef;
        return {
          ...element,
          PLAN_NUMBER: this.IntroduceUserDefinedTempSearch.PlanNum,
          COEFFICIENT: coef,
          PACK_QTY: inputQty,
          APPLY_QTY: String(convertedQty)
        };
      });
      const loading = this.$messageLoading('添加中..');
      KeeptListDeta(payload)
        .then((res) => {
          this.clearAccumulatedSelection();
          this.updateVisible(false);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          this.$message.error(err);
        })
        .finally(() => {
          loading.close();
        });
    },
    onSelectionChange(selection) {
      const selected = selection || [];
      if (this.tableReloading && selected.length === 0) {
        return;
      }
      this.selection = selected;
      selected.forEach((row) => {
        this.rememberSelectedRow(row);
      });
      if (this.tableReloading) {
        return;
      }
      const selectedKeys = new Set(
        selected.map((row) => this.getRowSelectKey(row)).filter(Boolean)
      );
      this.getVisibleRowKeys().forEach((key) => {
        if (!selectedKeys.has(key)) {
          this.$delete(this.accumulatedSelection, key);
          this.$delete(this.selectedCodeMap, key);
        }
      });
    },
    openImageDialog(row) {
      this.currentImageRow = row;
      this.imageDialogVisible = true;
    },
    closeImageDialog() {
      this.imageDialogVisible = false;
      this.currentImageRow = null;
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        this.clearAccumulatedSelection();
        if (this.data) {
          this.$util.assignObject(this.form, this.data);
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        this.clearAccumulatedSelection();
        this.form = { ...this.defaultForm };
      }
    },
    'IntroduceUserDefinedTempSearch.PlanNum'() {
      this.clearAccumulatedSelection();
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep(.el-card__body) {
  padding: 0;
}

.coef-bulk-text {
  color: #909399;
  font-size: 12px;
}

.coef-converted-qty {
  color: #303133;
}

.coef-unit {
  margin-left: 2px;
  color: #909399;
  font-size: 12px;
}
</style>
