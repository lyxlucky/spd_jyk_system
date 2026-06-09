<template>
  <ele-modal
    :visible="visible"
    title="未到货品种"
    width="95%"
    :close-on-click-modal="false"
    custom-class="not-to-dept-dialog"
    @update:visible="updateVisible"
  >
    <el-form :inline="true" size="mini" class="filter-form">
      <el-form-item>
        <el-input v-model="form.varietie_code" placeholder="品种编码/名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.stock_up_plan_no" placeholder="备货计划单号" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.supplier_name" placeholder="供应商名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.Manufacturing_Ent_Name" placeholder="生产企业" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.Specification_Or_Type" placeholder="规格型号" clearable />
      </el-form-item>
      <el-form-item label="院区">
        <el-select v-model="form.storage" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in storageList"
            :key="item.ID"
            :label="item.NAME"
            :value="String(item.ID)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.start_time"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.end_time"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reload">查询</el-button>
        <el-button type="primary" plain :loading="exporting" @click="exportExcel">导出excel</el-button>
        <el-button type="warning" @click="handleUpStockDelSame">更新备货数为收货数</el-button>
      </el-form-item>
    </el-form>

    <ele-pro-table
      ref="table"
      size="mini"
      height="calc(100vh - 280px)"
      :columns="columns"
      :datasource="datasource"
      :page-size="30"
      :page-sizes="[9, 30, 60, 90, 150, 300]"
      @selection-change="(rows) => (selection = rows)"
    />
  </ele-modal>
</template>

<script>
import {
  getStockUpNotVarInfo,
  getStorageList,
  upStockDelSame
} from '@/api/Task/FollowingGoodsPlan';
import { utils, writeFile } from 'xlsx';

export default {
  name: 'NotToDeptDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      form: {
        varietie_code: '',
        stock_up_plan_no: '',
        supplier_name: '',
        Manufacturing_Ent_Name: '',
        Specification_Or_Type: '',
        storage: '',
        start_time: '',
        end_time: ''
      },
      storageList: [],
      selection: [],
      exporting: false,
      columns: [
        { type: 'selection', width: 45, fixed: 'left' },
        { label: '备货人', prop: 'CREATOR', width: 80, align: 'center' },
        {
          label: '备货日期',
          prop: 'PLAN_TIME',
          width: 90,
          align: 'center',
          formatter: (row) =>
            row.PLAN_TIME ? String(row.PLAN_TIME).substr(0, 10) : ''
        },
        {
          label: '备注',
          prop: 'REMARKS',
          width: 100,
          align: 'center',
          formatter: (row) =>
            row.REMARKS == null || row.REMARKS === 'null' ? '' : row.REMARKS
        },
        { label: '备货计划单号', prop: 'Stock_Up_Plan_No', width: 110, align: 'center' },
        { label: '品种编码', prop: 'Varietie_Code_New', width: 100, align: 'center' },
        { label: '品种名称', prop: 'Varietie_Name', minWidth: 140 },
        { label: '型号/规格', prop: 'Specification_Or_Type', width: 140 },
        { label: '单位', prop: 'Unit', width: 50, align: 'center' },
        { label: '注册证号', prop: 'Approval_Number', width: 90, align: 'center' },
        {
          label: '价格',
          width: 90,
          align: 'center',
          formatter: (row) => row.supply_price?.toFixed(row.price_bl)
        },
        { label: '供应商名称', prop: 'supplier_name', minWidth: 120 },
        { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120 },
        { label: '系数', prop: 'Coefficient', width: 50, align: 'center' },
        { label: '备货计划(包)', prop: 'Stock_Up_Plan_Def_Quantity', width: 90, align: 'center' },
        { label: '折算散货', prop: 'Stock_Up_Plan_Goods_Quantity', width: 80, align: 'center' },
        { label: '收货数量', prop: 'ReceiptQty', width: 80, align: 'center' },
        { label: '上月用量', prop: 'USED_QTY', width: 80, align: 'center' },
        { label: '三月平均量', prop: 'AVG_USED_QTY', width: 80, align: 'center' },
        { label: '库存总量', prop: 'sumCount', width: 80, align: 'center' },
        {
          label: '中心库库存',
          width: 80,
          align: 'center',
          formatter: (row) => (row.sumCount || 0) - (row.DEPT_NUM || 0)
        },
        { label: '科室库存', prop: 'DEPT_NUM', width: 80, align: 'center' },
        {
          label: '通知科室',
          prop: 'STATE',
          width: 80,
          align: 'center',
          formatter: (row) => (String(row.STATE) === '0' ? '否' : '是')
        }
      ]
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadStorage();
        this.$nextTick(() => this.reload());
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    loadStorage() {
      getStorageList().then((res) => {
        const data = res.data;
        if (data.code === '200' || data.code === 200) {
          this.storageList = data.result || [];
        }
      });
    },
    reload() {
      this.$refs.table?.reload({ page: 1 });
    },
    buildWhere() {
      return { ...this.form, order_pc: 'desc' };
    },
    datasource({ page, limit }) {
      return getStockUpNotVarInfo({
        page,
        limit,
        where: this.buildWhere()
      }).then((res) => {
        const data = res.data;
        if (data.code == '200') {
          return { list: data.result, count: data.total };
        }
        return { list: [], count: 0 };
      });
    },
    handleUpStockDelSame() {
      if (this.selection.length === 0) {
        this.$message.warning('请选择条目');
        return;
      }
      this.$confirm('确认修改备货数量为收货数量吗？', '提示', { type: 'warning' })
        .then(() => {
          const loading = this.$messageLoading('处理中...');
          upStockDelSame(JSON.stringify(this.selection))
            .then((res) => {
              const data = res.data;
              if (data.code == 200) {
                this.$message.success(data.msg || '操作成功');
                this.reload();
              } else {
                this.$message.warning(data.msg);
              }
            })
            .catch(() => this.$message.error('操作失败'))
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    exportExcel() {
      this.exporting = true;
      getStockUpNotVarInfo({ page: 1, limit: 9999999, where: this.buildWhere() })
        .then((res) => {
          const data = res.data;
          if (data.code != '200' || !data.result?.length) {
            this.$message.warning('没有数据可导出');
            return;
          }
          const headers = this.columns
            .filter((c) => c.label)
            .map((c) => c.label);
          const rows = data.result.map((row) =>
            this.columns
              .filter((c) => c.label)
              .map((c) => (c.formatter ? c.formatter(row) : row[c.prop]))
          );
          writeFile(
            {
              SheetNames: ['Sheet1'],
              Sheets: { Sheet1: utils.aoa_to_sheet([headers, ...rows]) }
            },
            '未到货品种.xlsx'
          );
          this.$message.success('导出成功');
        })
        .finally(() => {
          this.exporting = false;
        });
    }
  }
};
</script>

<style scoped>
.filter-form {
  margin-bottom: 8px;
}
</style>
