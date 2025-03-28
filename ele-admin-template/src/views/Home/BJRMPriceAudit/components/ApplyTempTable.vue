<template>
  <div class="ele-body">
    <ApplyTempSearch
      @search="reload"
      @exportData="exportData"
      @openEdit="openEdit"
      :rowData="current"
    />
    <!-- 数据表格 -->
    <!-- <ele-pro-table @current-change="onCurrentChange" :reserve-selection="true" highlight-current-row ref="table" height="60vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :needPage="true" :datasource="datasource" :selection.sync="selection" cache-key="BJRMPriceAudit">
     -->
    <ele-pro-table
      @selection-change="onSelectionChange"
      :rowClickCheckedIntelligent="false"
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.PlanNum"
      @current-change="onCurrentChange"
      ref="table"
      height="60vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :needPage="true"
      cache-key="BJRMPriceAuditTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <template v-slot:State="{ row }">
        <el-tag v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag v-if="row.State == 1">已提交</el-tag>
        <el-tag v-if="row.State == 2" type="primary">配送中</el-tag>
        <el-tag v-if="row.State == 5" type="primary" color="#2ee693"
          >已审核</el-tag
        >
        <el-tag
          v-if="row.State == 10"
          type="primary"
          color="#e60000"
          style="color: white"
          >强制结束</el-tag
        >
        <el-tag
          v-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          "
          type="success"
          >已审批</el-tag
        >
        <el-tag
          v-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          "
          type="danger"
          >未收全</el-tag
        >
        <el-tag v-if="row.SUM_Left_Apply_Qty == 0" type="success"
          >已收全</el-tag
        >
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <!-- <el-button type="primary" size="small" @click="search(row)">设置为专属模板</el-button> -->
        <el-popconfirm
          class="ele-action"
          title="确定要删除此用户吗？"
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
    <UserEdit :visible.sync="showEdit" :data="selection" @done="reload" />
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }
</style>

<script>
  import UserEdit from './user-edit2.vue';
  import ApplyTempSearch from './ApplyTempSearch.vue';
  import { GetSpdMainsjHeaderIface } from '@/api/Home/masterBaseData';
  import { exportToExcel } from '@/utils/excel-util';
  export default {
    name: 'c',
    components: {
      ApplyTempSearch,
      UserEdit
    },
    data() {
      return {
        // 表格列配置
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          // {
          //   columnKey: 'index',
          //   type: 'index',
          //   width: 45,
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   fixed: 'left'
          // },
          {
            prop: 'PROCESS_STATUS',
            label: '状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 'N') {
                return '已传入中间表';
              } else if (cellValue == 'S') {
                return '已传入SPD';
              } else if (cellValue == 'Y') {
                return '已接收收费编码';
              } else if (cellValue == 'E') {
                return '传入SPD失败';
              } else {
                return '未知状态';
              }
            },
            show: false
          },
          {
            prop: 'ERROR_MSG',
            label: '错误消息',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            show: false
          },
          {
            prop: 'REQUESTNOTEID',
            label: '申请单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'APPLYDEPT',
            label: '申请部门',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'APPLYDATE',
            label: '申请日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'WJ_SP_STATE',
            label: '是否审批',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '已审批';
              } else {
                return '未审批';
              }
            }
          },
          {
            prop: 'WJ_SP_MARK',
            label: '审批备注',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'WJ_SP_MAN',
            label: '审批人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPLYPEOPLE',
            label: '经办人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPLYCODE',
            label: '经办人工号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPLYPHONE',
            label: '经办人电话',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          }
        ],
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
      datasource({ page, limit, where, order }) {
        // where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        // where.UserId = this.$store.state.user.info.ID;
        let data = GetSpdMainsjHeaderIface({ page, limit, where, order }).then(
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
      exportData(where) {
        const loading = this.$messageLoading('正在导出数据...');
        GetSpdMainsjHeaderIface({
          page: 1,
          limit: this.$refs.table.tableTotal * 2,
          where,
          order: ''
        })
          .then((res) => {
            loading.close();
            exportToExcel(res.result, this.columns, '物价单信息');
            this.$message.success('导出成功');
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message);
          });
      },
      openEdit(row) {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择要审批的数据');
          return;
        }
        this.showEdit = true;
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
        // console.log(current);
        this.$emit('getCurrent', current);
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    mounted() {},
    destroyed() {},
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
