<template>
  <div class="ele-body">
    <AdvanceReceiptNumberSearch @search="reload" :rowData="current" style="padding: 0px;" />

    <AdvanceReceiptNumberEdit @search="reload" :visible.sync="showEdit" :rowData="current" />
    <!-- 数据表格 -->
    <ele-pro-table height="60vh" :paginationStyle="paginationStyle" highlight-current-row @current-change="onCurrentChange" :row-class-name="tableRowClassName" ref="table" :rowClickChecked="true" :stripe="false" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :needPage="true" :datasource="datasource" :selection.sync="selection" cache-key="ApplyTempTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <template v-slot:State="{ row }">
        <el-tag v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag v-if="row.State == 1">已提交</el-tag>
        <el-tag v-if="row.State == 2" type="primary">配送中</el-tag>
        <el-tag v-if="row.State == 5" type="primary" color="#2ee693">已审核</el-tag>
        <el-tag v-if="row.State == 10" type="primary" color="#e60000" style="color: white">强制结束</el-tag>
        <el-tag v-if="
          (row.State == 6 || row.State == 4) &&
          row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
        " type="success">已审批</el-tag>
        <el-tag v-if="
          row.SUM_Left_Apply_Qty > 0 &&
          row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
        " type="danger">未收全</el-tag>
        <el-tag v-if="row.SUM_Left_Apply_Qty == 0" type="success">已收全</el-tag>
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
      </template>

      <template v-slot:TempletName="{ row }">
        <span style="color: #409eff" type="primary" @dblclick="editTempletName(row.TempletCode)" v-if="row.TempletName" :underline="false">{{ row.TempletName }}</span>
        <span style="color: #409eff" type="primary" @dblclick="editTempletName(row.TempletCode)" v-else :underline="false">无</span>
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-link type="danger" @click="handleDelete(row)" :underline="false" icon="el-icon-delete">
          剔除
        </el-link>
      </template>
    </ele-pro-table>
  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #65bb37;
}

.el-card__body {
  padding: 0px;
}
</style>

<script>
import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
import { getBdSzYyHisSs } from '@/api/Task/SurgicalVerification';
import { HOME_HP } from '@/config/setting';
export default {
  name: 'ApplyTempTable',
  components: {
    AdvanceReceiptNumberSearch,
    AdvanceReceiptNumberEdit
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
        // {
        //   label: '序',
        //   columnKey: 'index',
        //   type: 'index',
        //   width: 45,
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'MZZY',
          label: '门诊',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'ZYHM',
          label: '住院号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'BRXM',
          label: '姓名',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'SSRQ',
          label: '手术时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SSMC',
          label: '手术名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        }
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 150,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true
        //   //fixed: 'right'
        // }
      ],
      paginationStyle: {
        height: '18px',
        padding: '0px 0px 5px 0px',
        'margin-top': '-5px'
      },
      toolbar: false,
      pageSize: 100,
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
    async datasource({ page, limit, where, order }) {
      const res = await getBdSzYyHisSs({
        page,
        limit,
        where,
        order
      });
      return { list: res.data, count: res.total };
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    onCurrentChange(current) {
      this.current = current;
      this.$emit('getCurrent', current);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.CommonState == 1) {
        return 'success-row';
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.$bus.$on('handleSubmitConsumeVarietiesAndRefreshTopTable', (data) => {
      this.reload();
    });
    this.$bus.$on('handleCommand', (data) => {
      this.reload();
    });
  },
  destroyed() {
    this.$bus.$off('handleCommand');
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
  }
};
</script>
