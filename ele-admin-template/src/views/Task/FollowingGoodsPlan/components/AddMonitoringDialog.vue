<template>
  <ele-modal
    :visible="visible"
    :title="dialogTitle"
    width="98%"
    top="2vh"
    :close-on-click-modal="false"
    custom-class="add-monitoring-dialog"
    @update:visible="updateVisible"
  >
    <el-form :inline="true" size="mini" class="filter-form">
      <el-form-item label="使用级别">
        <el-select v-model="filters.UseLevel" style="width: 100px" @change="reloadTop">
          <el-option label="全部" :value="-1" />
          <el-option label="普通" :value="0" />
          <el-option label="常用" :value="1" />
          <el-option label="非常用" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="filters.enableState" @change="reloadTop">过滤已停用品种</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="filters.enableLowUp" @change="reloadTop">过滤上下线为0的品种</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.VARIETIE_CODE_NEW" placeholder="品种编码或名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.SPECIFICATION_OR_TYPE" placeholder="完整型号/规格" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.MANUFACTURING_ENT_NAME" placeholder="完整生产企业" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadTop">查询</el-button>
        <el-button type="success" @click="handleAdd">追加备货</el-button>
      </el-form-item>
    </el-form>

    <div class="section-title">可选品种</div>
    <ele-pro-table
      ref="topTable"
      size="mini"
      height="320px"
      :columns="topColumns"
      :datasource="topDatasource"
      :page-size="10"
      :row-style="rowStyle"
      @selection-change="(rows) => (topSelection = rows)"
    >
      <template v-slot:pkgPlan="{ row }">
        <el-input-number
          :value="getPkgPlan(row)"
          :min="0"
          :controls="false"
          size="mini"
          style="width: 70px"
          :disabled="!isRowSelected(row)"
          @change="(val) => setPkgPlan(row, val)"
        />
      </template>
    </ele-pro-table>

    <div class="section-title">当前订单明细</div>
    <ele-pro-table
      ref="bottomTable"
      size="mini"
      height="240px"
      :columns="bottomColumns"
      :datasource="bottomDatasource"
      :page-size="9"
    />
  </ele-modal>
</template>

<script>
import { supplierSearch, addStockData, getStockUpVarInfo } from '@/api/Task/FollowingGoodsPlan';
import { getStorageName, warningRowStyle } from '../utils';

export default {
  name: 'AddMonitoringDialog',
  props: {
    visible: Boolean,
    orderRow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filters: {
        UseLevel: -1,
        enableState: true,
        enableLowUp: false,
        VARIETIE_CODE_NEW: '',
        SPECIFICATION_OR_TYPE: '',
        MANUFACTURING_ENT_NAME: ''
      },
      topSelection: [],
      pkgPlanMap: {},
      topColumns: [
        { type: 'selection', width: 45, fixed: 'left' },
        { label: '品种编码', prop: 'Varietie_Code_New', width: 100, align: 'center' },
        { label: '品种全称', prop: 'Varietie_Name', minWidth: 240 },
        { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 180 },
        { label: '单位', prop: 'Unit', width: 60, align: 'center' },
        { label: '生产企业', prop: 'Manufacturing_Ent_Name', width: 180 },
        { label: '系数', prop: 'Def_No_Pkg_Coefficient', width: 60, align: 'center' },
        {
          label: '中标',
          width: 60,
          align: 'center',
          formatter: (row) => (String(row.Is_Bidding) === '1' ? '是' : '否')
        },
        { label: '库存上限', prop: 'Storehouse_Uppper', width: 90, align: 'center' },
        { label: '库存下限', prop: 'Storehouse_Lower', width: 90, align: 'center' },
        { label: '备货数（包）', width: 100, align: 'center', slot: 'pkgPlan' },
        { label: '备货数（散）', prop: 'Goods_plan', width: 90, align: 'center' },
        { label: '定数包库存（院内）', prop: 'Defsum', width: 120, align: 'center' },
        { label: '散货库（院内）', prop: 'Goodssum', width: 120, align: 'center' },
        { label: '主控库区', prop: 'Name', width: 90 }
      ],
      bottomColumns: [
        { label: '备货人', prop: 'CREATOR', width: 80, align: 'center' },
        {
          label: '备货日期',
          prop: 'PLAN_TIME',
          width: 90,
          formatter: (row) =>
            row.PLAN_TIME ? String(row.PLAN_TIME).substr(0, 10) : ''
        },
        { label: '品种编码', prop: 'Varietie_Code_New', width: 90, align: 'center' },
        { label: '品种名称', prop: 'Varietie_Name', minWidth: 140 },
        { label: '备货计划单号', prop: 'Stock_Up_Plan_No', width: 110, align: 'center' },
        { label: '供应商', prop: 'supplier_name', minWidth: 120 },
        { label: '型号/规格', prop: 'Specification_Or_Type', width: 140 },
        { label: '单位', prop: 'Unit', width: 50, align: 'center' },
        { label: '生产企业', prop: 'Manufacturing_Ent_Name', minWidth: 120 },
        { label: '系数', prop: 'Coefficient', width: 50, align: 'center' },
        { label: '备货计划(包)', prop: 'Stock_Up_Plan_Def_Quantity', width: 90, align: 'center' },
        { label: '折算散货', prop: 'Stock_Up_Plan_Goods_Quantity', width: 80, align: 'center' },
        { label: '收货数量', prop: 'ReceiptQty', width: 80, align: 'center' }
      ]
    };
  },
  computed: {
    dialogTitle() {
      const no = this.orderRow?.STOCK_UP_PLAN_NO || '';
      const supplier = this.orderRow?.SUPPLIER_NAME || '';
      const storage = getStorageName(this.orderRow?.STORAGE_ID);
      return `【${no}】${supplier} {${storage}}`;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.pkgPlanMap = {};
        this.topSelection = [];
        this.$nextTick(() => {
          this.reloadTop();
          this.reloadBottom();
        });
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    rowStyle({ row }) {
      return warningRowStyle(row.warning);
    },
    isRowSelected(row) {
      return this.topSelection.some((r) => r.Varietie_Code === row.Varietie_Code);
    },
    getPkgPlan(row) {
      const key = row.Varietie_Code;
      if (this.pkgPlanMap[key] !== undefined) return this.pkgPlanMap[key];
      return row.Pkg_plan;
    },
    setPkgPlan(row, val) {
      this.$set(this.pkgPlanMap, row.Varietie_Code, Number(val));
    },
    reloadTop() {
      this.$refs.topTable?.reload({ page: 1 });
    },
    reloadBottom() {
      this.$refs.bottomTable?.reload({ page: 1 });
    },
    buildTopParams(extra = {}) {
      return {
        UseLevel: this.filters.UseLevel,
        EnableState: this.filters.enableState ? 0 : 1,
        EnableLowUp: this.filters.enableLowUp ? 0 : 1,
        StorageID: this.orderRow?.STORAGE_ID || '',
        Supplier: this.orderRow?.SUPPLIER_CODE || '',
        VARIETIE_CODE_NEW: this.filters.VARIETIE_CODE_NEW,
        SPECIFICATION_OR_TYPE: this.filters.SPECIFICATION_OR_TYPE,
        MANUFACTURING_ENT_NAME: this.filters.MANUFACTURING_ENT_NAME,
        ...extra
      };
    },
    topDatasource({ page, limit, sort }) {
      return supplierSearch({
        page,
        limit,
        field: sort?.field || '',
        order: sort?.order || '',
        ...this.buildTopParams()
      }).then((res) => {
        const data = res.data;
        if (data.code == '200') {
          return { list: data.result, count: data.total };
        }
        return { list: [], count: 0 };
      });
    },
    bottomDatasource({ page, limit }) {
      if (!this.orderRow?.ID) {
        return Promise.resolve({ list: [], count: 0 });
      }
      return getStockUpVarInfo({
        page,
        limit,
        where: {
          id: this.orderRow.ID,
          order_state: '',
          order_pc: 'desc'
        }
      }).then((res) => {
        const data = res.data;
        if (data.code == '200') {
          return { list: data.result, count: data.total };
        }
        return { list: [], count: 0 };
      });
    },
    handleAdd() {
      if (this.topSelection.length === 0) {
        this.$message.warning('请至少勾选一行数据');
        return;
      }
      const arrList = [];
      for (const row of this.topSelection) {
        const pkg = this.getPkgPlan(row);
        if (pkg <= 0) {
          this.$message.warning(`${row.Varietie_Name} 的备货计划(包)不能小于或等于0`);
          return;
        }
        if (String(row.Enable) === '0') {
          this.$message.warning(`${row.Varietie_Name} 品种已停用，不可添加`);
          return;
        }
        arrList.push({
          Varietie_Code: row.Varietie_Code,
          Def_No_Pkg_Coefficient: row.Def_No_Pkg_Coefficient,
          Pkg_plan: pkg,
          supplier_code: row.supplier_code,
          supply_price: row.supply_price,
          contract_code: row.contract_code,
          PURCHASE_PRICE: row.PURCHASE_PRICE,
          Varietie_Code_New: row.Varietie_Code_New
        });
      }
      const loading = this.$messageLoading('追加中...');
      addStockData(JSON.stringify(arrList), this.orderRow.STOCK_UP_PLAN_NO)
        .then((res) => {
          const data = res.data;
          if (data.code == 200) {
            this.$message.success('已成功追加');
            this.reloadBottom();
            this.$emit('success');
          } else {
            this.$message.warning(data.msg);
          }
        })
        .catch(() => this.$message.error('追加失败'))
        .finally(() => loading.close());
    }
  }
};
</script>

<style scoped>
.filter-form {
  margin-bottom: 8px;
}
.section-title {
  font-weight: 600;
  margin: 10px 0 6px;
  font-size: 13px;
}
</style>
