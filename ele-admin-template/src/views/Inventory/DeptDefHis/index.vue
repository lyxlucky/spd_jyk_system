<template>
  <div class="ele-body spd-page dept-def-his-page">
    <el-card shadow="never" class="dept-def-his-card">
      <user-search @search="reload" @exportData="exportData" />
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head spd-panel__head--split">
          <span>科室定数包历史列表</span>
          <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
        </div>
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
            :selection.sync="selection"
            cache-key="deptDefHisTable"
          >
            <template v-slot:action="{ row }">
              <el-button type="text" size="mini" @click="openEdit(row)">修改</el-button>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import { GetPDAList } from '@/api/Inventory/DeptDefHis';

function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

export default {
  name: 'SystemUser',
  components: {
    UserSearch
  },
  data() {
    return {
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          label: '序号',
          columnKey: 'index',
          type: 'index',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        { prop: 'Dept_Two_Name', label: '二级科室名称', align: 'center', minWidth: 120, showOverflowTooltip: true },
        { prop: 'Varietie_Code_New', label: '品种编码', align: 'center', minWidth: 110, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种名称', align: 'center', minWidth: 150, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '规格型号', align: 'center', minWidth: 120, showOverflowTooltip: true },
        { prop: 'Unit', label: '单位', align: 'center', minWidth: 60 },
        { prop: 'Dept_Two_Code', label: '二级科室编码', align: 'center', minWidth: 120, showOverflowTooltip: true },
        { prop: 'Coefficient', label: '系数', align: 'center', minWidth: 60 },
        { prop: 'Batch', label: '批号', align: 'center', minWidth: 90, showOverflowTooltip: true },
        {
          prop: 'Last_Update_Time',
          label: '上架时间',
          align: 'center',
          minWidth: 120,
          showOverflowTooltip: true,
          formatter: (row) => fmtDate10(row.Last_Update_Time)
        },
        {
          prop: 'Last_Update_Time',
          label: '在库天数',
          align: 'center',
          minWidth: 90,
          formatter(row) {
            if (!row.Last_Update_Time) return '';
            const bvpDate = fmtDate10(row.Last_Update_Time);
            const thisDate = new Date(bvpDate).getTime();
            if (Number.isNaN(thisDate)) return '';
            const nowDate = Date.now();
            return `${parseInt(((nowDate - thisDate) / (60 * 60 * 24 * 1000)).toFixed(0))}天`;
          }
        },
        {
          prop: 'Stock_State',
          label: '上架状态',
          align: 'center',
          minWidth: 90,
          formatter(row) {
            if (row.Stock_State == '0') return '已退货';
            if (row.Stock_State == '1') return '已上架';
            if (row.Stock_State == '2') return '暂借';
            if (row.Stock_State == '3') return '已出库';
            return '未知';
          }
        },
        { prop: 'Def_No_Pkg_Code', label: '定数码', align: 'center', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'Batch_Validity_Period',
          label: '有效期',
          align: 'center',
          minWidth: 130,
          showOverflowTooltip: true,
          formatter: (row) => fmtDate10(row.Batch_Validity_Period)
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          align: 'center',
          minWidth: 130,
          showOverflowTooltip: true,
          formatter: (row) => fmtDate10(row.Batch_Production_Date)
        },
        { prop: 'Supply_Price', label: '结算价', align: 'center', minWidth: 80 },
        { prop: 'Contract_Code', label: '合同编码', align: 'center', minWidth: 110, showOverflowTooltip: true },
        { prop: 'Supplier_Name', label: '供应商名称', align: 'center', minWidth: 120, showOverflowTooltip: true },
        { prop: 'Serial_Number', label: 'SN码', align: 'center', minWidth: 80, showOverflowTooltip: true },
        { prop: 'Rfid_Code', label: 'RFID码', align: 'center', minWidth: 80, showOverflowTooltip: true },
        { prop: 'Dept_Two_Up_Shelf_Id', label: '二级定数码上架id', align: 'center', minWidth: 200, hidden: true },
        { prop: 'Varietie_Code', label: '品种编码id', align: 'center', minWidth: 120, hidden: true },
        { prop: 'Supplier_Code', label: '供应商编码', align: 'center', minWidth: 120, hidden: true }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      current: null,
      showEdit: false
    };
  },
  methods: {
    datasource({ page, limit, where, order }) {
      return GetPDAList({ page, limit, where, order }).then((res) => ({
        count: res.total,
        list: res.result
      }));
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        GetPDAList({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种id',
                '品种名称',
                '规格/型号',
                '生产企业名称',
                '注册证号',
                '单位',
                '中标价',
                '品种类别',
                '换算比(试剂)',
                '仪器备注'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.Varietie_Code_New,
                d.Varietie_Code,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Manufacturing_Ent_Name,
                d.APPROVAL_NUMBER,
                d.UNIT,
                d.Price,
                d.CLASS_NUM,
                d.CONVERSION_RATIO,
                d.DEVICE_REMARK
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室入库品种.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  }
};
</script>

<style scoped>
.dept-def-his-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dept-def-his-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
