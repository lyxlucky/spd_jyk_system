<template>
  <ele-modal
    :visible="visible"
    title="监控详情"
    width="95%"
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <table v-if="extendInfo" class="extend-table">
      <thead>
        <tr>
          <th>库房名称</th>
          <th>品种（材料）编码</th>
          <th>品种全称</th>
          <th>批准文号</th>
          <th>发证日期</th>
          <th>有效到期</th>
          <th>供应商名称</th>
          <th>产品类型</th>
          <th>管理类别</th>
          <th>监管类别</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>中心库</td>
          <td>{{ extendInfo.Varietie_Code_New }}</td>
          <td>{{ extendInfo.Varietie_Name }}</td>
          <td>{{ extendInfo.Approval_Number }}</td>
          <td>{{ formatDate(extendInfo.Registration_Issuing_Date) }}</td>
          <td>{{ formatDate(extendInfo.Registration_Valid_Date) }}</td>
          <td>{{ extendInfo.Supplier_Name }}</td>
          <td>{{ extendInfo.Prod_Big_Class_Name }}</td>
          <td>{{ extendInfo.Mgmt_cat_Name }}</td>
          <td>{{ extendInfo.Regulatory_Cat_Name }}</td>
        </tr>
      </tbody>
    </table>

    <ele-pro-table
      ref="table"
      size="mini"
      height="calc(100vh - 320px)"
      :columns="columns"
      :datasource="datasource"
      :page-size="15"
      :page-sizes="[15, 30, 60, 90, 150, 300]"
      :row-style="rowStyle"
      @row-click="handleRowClick"
    />
  </ele-modal>
</template>

<script>
import { searchStockMonitor, getCentralWarehouseExtend } from '@/api/Task/FollowingGoodsPlan';
import { warningRowStyle } from '../utils';
import { HOME_HP } from '@/config/setting';

export default {
  name: 'MonitoringDialog',
  props: {
    visible: Boolean,
    varietieCodes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      extendInfo: null,
      columns: [
        { label: '品种编码', prop: 'Varietie_Code_New', width: 100, align: 'center' },
        { label: '品种全称', prop: 'Varietie_Name', minWidth: 280 },
        { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 100 },
        { label: '单位', prop: 'Unit', width: 60, align: 'center' },
        { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', width: 200 },
        { label: '系数', prop: 'Def_No_Pkg_Coefficient', width: 60, align: 'center' },
        {
          label: '中标',
          prop: 'Is_Bidding',
          width: 60,
          align: 'center',
          formatter: (row) =>
            String(row.Is_Bidding) === '1' ? '是' : String(row.Is_Bidding) === '0' ? '否' : ''
        },
        { label: '库存上限', prop: 'Storehouse_Uppper', width: 90, align: 'center' },
        { label: '库存下限', prop: 'Storehouse_Lower', width: 90, align: 'center' },
        { label: '定数包库存（院内）', prop: 'Defsum', width: 120, align: 'center' },
        { label: '定数包库存（院外）', prop: 'OutdefSum', width: 120, align: 'center' },
        { label: '散货库（院内）', prop: 'Goodssum', width: 120, align: 'center' },
        { label: '散货库（院外）', prop: 'OutGoodsUp', width: 120, align: 'center' },
        { label: '备货数（包）', prop: 'Pkg_plan', width: 90, align: 'center' },
        { label: '备货数（散）', prop: 'Goods_plan', width: 90, align: 'center' },
        { label: '大包装数量', prop: 'BigBoxCount', width: 90, align: 'center', hide: HOME_HP === 'stzl' },
        { label: '包预锁（院内）', prop: 'PackQty', width: 120, align: 'center' },
        { label: '包预锁（院外）', prop: 'OutPackQty', width: 120, align: 'center' },
        { label: '备货在途(散)', prop: 'Onway', width: 90, align: 'center' },
        { label: '计划总量(散)', prop: 'QTY', width: 90, align: 'center' },
        { label: '主控库区', prop: 'Name', width: 90 }
      ].filter((c) => !c.hide)
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.extendInfo = null;
        this.$nextTick(() => this.$refs.table?.reload({ page: 1 }));
      }
    },
    varietieCodes() {
      if (this.visible) {
        this.$refs.table?.reload({ page: 1 });
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    formatDate(val) {
      return val ? String(val).substring(0, 10) : '';
    },
    rowStyle({ row }) {
      return warningRowStyle(row.warning);
    },
    handleRowClick(row) {
      getCentralWarehouseExtend(row.Varietie_Code).then((res) => {
        const data = res.data;
        if (data.result) {
          this.extendInfo = data.result;
        }
      });
    },
    datasource({ page, limit, sort }) {
      return searchStockMonitor({
        page,
        limit,
        field: sort?.field || '',
        order: sort?.order || '',
        VARIETIE_CODE_NEWS: this.varietieCodes,
        EnableState: 1,
        EnableLowUp: 1,
        StorageID: '-1'
      }).then((res) => {
        const data = res.data;
        if (data.code == '200') {
          return { list: data.result, count: data.total };
        }
        return { list: [], count: 0 };
      });
    }
  }
};
</script>

<style scoped>
.extend-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 12px;
}
.extend-table th,
.extend-table td {
  border: 1px solid #ebeef5;
  padding: 6px 8px;
  text-align: center;
}
.extend-table th {
  background: #f5f7fa;
}
</style>
