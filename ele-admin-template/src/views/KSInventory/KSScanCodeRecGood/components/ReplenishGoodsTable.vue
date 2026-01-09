<template>
  <div class="">
    <ReplenishGoodsSearch @search="reload" />
    <!-- 数据表格 -->
    <ele-pro-table highlight-current-row @current-change="onCurrentChange" ref="table" height="60vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="ReplenishGoodsTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
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
      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <!-- <el-button type="primary" size="small" @click="search(row)">设置为专属模板</el-button> -->
        <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
import ReplenishGoodsSearch from './ReplenishGoodsSearch.vue';
import { SearchDistributeListJYK } from '@/api/KSInventory/KSScanCodeRecGood';
export default {
  name: 'ReplenishGoodsTable',
  components: {
    ReplenishGoodsSearch
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
        //   width: 120,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'right'
        // },
        {
          prop: 'stock_out_distribute_number',
          label: '收货单号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'replenish_state',
          label: '状态',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter(row, column, cellValue) {
            if (cellValue == 0) {
              return '未收货';
            } else if (cellValue == 1) {
              return '送货中';
            } else if (cellValue == 2) {
              return '已收货';
            } else {
              return '不明状态';
            }
          }
        },
        // {
        //   prop: 'pack_directive_number',
        //   label: '拣配单号',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 150
        // },
        {
          prop: 'replenish_time',
          label: '收货时间',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 170,
          formatter(row, column, cellValue) {
            if (row.replenish_state == 2) {
              return cellValue.replace('T', ' ');
            } else {
              return '';
            }
          }
        },
        {
          prop: 'RK_COUNT',
          label: '入库数量',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'KC_COUNT',
          label: '库存数量',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        // {
        //   prop: 'dept_two_name',
        //   label: '科室名称',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120
        // },
        {
          prop: 'ID',
          label: 'ID',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          show: false
        }
      ],
      toolbar: false,
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code)
      // var Dept_Two_Code = this.$store.state.user.info.userDept;
      // var Dept_Two_Code2 = this.$store.state.user.info.DeptNow;
      // var Dept_Two_Code = [Dept_Two_Code2];
      // var Dept_Two_CodeStr = '';
      // for (let i = 0; i < Dept_Two_Code.length; i++) {
      //   Dept_Two_CodeStr += Dept_Two_Code[i].Dept_Two_Code + ',';
      // }
      // Dept_Two_CodeStr = Dept_Two_CodeStr.substring(
      //   0,
      //   Dept_Two_CodeStr.length - 1
      // );
      // where.Dept_Two_Code = Dept_Two_CodeStr;
      let data = SearchDistributeListJYK({ page, limit, where, order }).then(
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
      // var Dept_Two_Code = this.$store.state.user.info.userDept;

      // var Dept_Two_CodeStr = '';
      // for (let i = 0; i < Dept_Two_Code.length; i++) {
      //   Dept_Two_CodeStr += Dept_Two_Code[i].Dept_Two_Code + ',';
      // }
      // where.Dept_Two_Code = Dept_Two_CodeStr;
      // Dept_Two_CodeStr = Dept_Two_CodeStr.substring(
      //   0,
      //   Dept_Two_CodeStr.length - 1
      // );
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
      current.IsRefDefNoPkgDataTable = false;
      // console.log(current);
      this.$emit('getCurrent', current);
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
  },
  mounted(){
    this.$bus.$on('handleCommand', (data) => {
      this.reload();
    });
  },
  destroyed(){
    this.$bus.$off('handleCommand')
  },
};
</script>
