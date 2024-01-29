<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table highlight-current-row @current-change="onCurrentChange" ref="table" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <KSDepartmentalPlan-search @search="reload" />
      </template>

      <template v-slot:State="{ row }">
        <el-tag v-if="row.State==0" type="success">新增</el-tag>
        <el-tag v-if="row.State==1">已提交</el-tag>
        <el-tag v-if="row.State==2" type="primary">配送中</el-tag>
        <el-tag v-if="row.State==5" type="primary" color="#2ee693">已审核</el-tag>
        <el-tag v-if="row.State==10" type="primary" color="#e60000" style="color:white">强制结束</el-tag>
        <el-tag v-if="(row.State==6 || row.State==4) && row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty" type="success">已审批</el-tag>
        <el-tag v-if="(row.SUM_Left_Apply_Qty > 0 && row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty)" type="danger">未收全</el-tag>
        <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag>
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>

      <template v-slot:BATCH_VALIDITY_PERIOD="{ row }">
        <!-- {{dateNow}} -->
        <!-- {{dateNow1 = row.BATCH_VALIDITY_PERIOD?'':row.BATCH_VALIDITY_PERIOD.substring(0,10)}} -->
        <!-- <el-tag v-if="row.COUNT >=1 && row.BATCH_VALIDITY_PERIOD<=dateNow1" type="info">{{(new Date(row.BATCH_VALIDITY_PERIOD)).toLocaleDateString()}}</el-tag> -->
        <el-tag v-if="row.COUNT >=1 && dateNow1<=row.BATCH_VALIDITY_PERIOD<dateNow2" type="danger">{{(new Date(row.BATCH_VALIDITY_PERIOD)).toLocaleDateString()}}</el-tag>
        <el-tag v-if="row.COUNT >=1 && dateNow2<=row.BATCH_VALIDITY_PERIOD<dateNow3" type="warning">{{(new Date(row.BATCH_VALIDITY_PERIOD)).toLocaleDateString()}}</el-tag>
        <el-tag v-if="row.COUNT >=1 && dateNow4<=row.BATCH_VALIDITY_PERIOD" type="success">{{(new Date(row.BATCH_VALIDITY_PERIOD)).toLocaleDateString()}}</el-tag>
        <el-tag v-else type="info">{{(new Date(row.BATCH_VALIDITY_PERIOD)).toLocaleDateString()}}</el-tag>
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-button v-if="row.COUNT >=1 && row.DEF_NO_PKG_CODE == null && TYPE != ''" size="small" type="primary" icon="" class="ele-btn-icon" @click="openEdit(row)">
          散货出库
        </el-button>
        <!-- <el-button v-else disabled>
        </el-button> -->
        <!-- <el-button type="primary" size="small" @click="dialogTableVisible = true">散货出库</el-button> -->
      </template>

      <template v-slot:DEF_NO_PKG_CODE="{ row }">
        <el-tag v-if="row.COUNT>=1 && row.DEF_NO_PKG_CODE != null" type="success">{{row.DEF_NO_PKG_CODE}}</el-tag>
        <el-tag v-if="row.COUNT<1 && row.DEF_NO_PKG_CODE != null" type="info">{{row.DEF_NO_PKG_CODE}}</el-tag>
      </template>

    </ele-pro-table>

    <user-edit :visible.sync="showEdit" :data="rowData" @done="reload" />
  </div>
</template>

<script>
import KSDepartmentalPlanSearch from './KSDepartmentalPlan-search.vue';
import UserEdit from './user-edit.vue';
import dayjs from 'dayjs';
// import { formatDate } from '@/utils/formdataify';
import {
  SerachPlanList,
  DeletePlanList
} from '@/api/KSInventory/KSDepartmentalPlan';
import { GetJykMainShelf } from '@/api/KSInventory/KSInventoryQuery';
export default {
  name: 'KSDepartmentalPlanTable',
  components: {
    KSDepartmentalPlanSearch,
    UserEdit
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
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'ID',
          label: 'ID',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 150,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          // prop: 'DEF_NO_PKG_CODE',
          slot: 'DEF_NO_PKG_CODE',
          label: '定数码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_CODE',
          label: '品种ID',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'COUNT',
          label: '库存数量',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'UNIT',
          label: '单位',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PRICE',
          label: '价格',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BATCH_ID',
          label: '批号ID',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (_row, _column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        {
          // prop: 'BATCH_VALIDITY_PERIOD',
          slot: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          // // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        // {
        //   prop: 'OPERATOR',
        //   label: '操作人',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        // },
        // {
        //   prop: 'DELIVERY_NUMBER',
        //   label: '入库单号',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120,
        //   show: false
        // },
        // {
        //   prop: 'RECORD_TYPE',
        //   label: '入库类型',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        //   show: false
        // },
        // {
        //   prop: 'SUPPLIER_CODE',
        //   label: '供应商编码',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        //   show: false
        // },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
        // {
        //   prop: 'DEPT_TWO_CODE',
        //   label: '二级科室编码',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        //   show: false
        // },
        // {
        //   prop: 'RECORD_TIME',
        //   label: '入库时间',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 150,
        //   show: false
        // }
      ],
      toolbar: false,
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 30, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      TYPE: null,
      rowData: null,
      dateNow1: dayjs().format('YYYY-MM-DD'),
      dateNow2: dayjs().format('YYYY-MM-DD'),
      dateNow3: dayjs().format('YYYY-MM-DD'),
      dateNow4: dayjs().format('YYYY-MM-DD')
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }
      where.DeptCode = Dept_Two_CodeStr;
      where.TYPE = where.TYPE == undefined ? '1' : where.TYPE;
      where.COUNT = where.COUNT == undefined ? '1' : where.COUNT;

      this.TYPE = where.TYPE;
      let data = GetJykMainShelf({ page, limit, where, order }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    onDone(res) {
      // console.log('res:', res);
      // 例如选中第一条数据
      if (res.data?.length) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    onSelectionChange(selection) {
      this.selection = selection;
      console.log(selection);
    },
    onCurrentChange(current) {
      this.current = current;
      // console.log(current);
      this.$emit('getCurrent', current);
    },
    openEdit(row) {
      // console.log(row)
      this.rowData = row;
      this.showEdit = true;
    },
    /* 删除数据 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      DeletePlanList(row)
        .then((res) => {
          this.$message.success(res.msg);
          loading.close();
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day}`;
    }
  },
  created() {
    // this.getdatasource();
    dayjs(this.dateNow2).add(30, 'day');
    dayjs(this.dateNow3).add(60, 'day');
    dayjs(this.dateNow4).add(90, 'day');
  }
};
</script>
