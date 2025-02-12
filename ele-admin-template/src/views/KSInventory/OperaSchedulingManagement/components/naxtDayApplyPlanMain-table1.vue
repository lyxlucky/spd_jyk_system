<template>
  <div class="ele-body" v-if="RenderTabel">
    <!-- 数据表格 -->
    <ele-pro-table
      :key="key"
      :reserve-selection="true"
      highlight-current-row
      :row-key="(row) => row.PlanNum"
      @current-change="onCurrentChange"
      ref="table"
      height="18vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :needPage="true"
      cache-key="naxtDayApplyPlanMainTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <naxtDayApplyPlanMainSearch @search="reload" @openUserEdit="openUserEdit"/>
      </template>

      <template v-slot:State="{ row }">
        <el-tag size="mini" v-if="row.State == 0" type="primary">新增</el-tag>
        <el-tag size="mini" v-else-if="row.State == 1" type="warning">已提交</el-tag>
        <el-tag size="mini" v-else-if="row.State == 2" type="primary">配送中</el-tag>
        <el-tag size="mini" v-else-if="row.State == 5" type="primary" color="#2ee693"
          >已审核</el-tag
        >
        <el-tag size="mini"
          v-else-if="row.State == 10"
          type="primary"
          color="#e60000"
          style="color: white"
          >强制结束</el-tag
        >
        <el-tag size="mini"
          v-else-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          "
          type="success"
          >已审批</el-tag
        >
        <el-tag size="mini"
          v-else-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          "
          type="danger"
          >未收全</el-tag
        >
        <el-tag size="mini" v-else-if="row.SUM_Left_Apply_Qty == 0" type="success"
          >已收全</el-tag
        >
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
      </template>
      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm
          class="ele-action"
          title="确定删除？"
          @confirm="remove(row)"
        >
          <template v-slot:reference>
            <el-link
              type="danger"
              size="mini"
              :underline="false"
              v-if="row.State == 0"
              icon="el-icon-delete"
            >
              删除
            </el-link>
          </template>
        </el-popconfirm>
        <el-button
          v-if="row.State == 1"
          size="mini"
          type="primary"
          icon="el-icon-edit"
          class="ele-btn-icon"
          @click="ReturnStateBtn(row)"
        >
          取消提交</el-button
        >
        <!-- <el-button v-else size="small" type="primary" class="ele-btn-icon" @click="ReturnStateBtn(row)" disabled> 取消提交</el-button> -->
      </template>
    </ele-pro-table>

    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
  import naxtDayApplyPlanMainSearch from './naxtDayApplyPlanMain-search.vue';
  import userEdit from './user-edit.vue';
  import {
    GetNaxtDayApplyPlanMain
  } from '@/api/KSInventory/OperaSchedulingManagement';

  export default {
    name: 'naxtDayApplyPlanMainTable',
    props: ['IsReload'],
    components: {
      naxtDayApplyPlanMainSearch,
      userEdit
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
            columnKey: 'action',
            label: '操作',
            width: 120,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true,
            fixed: 'right'
          },
          {
            prop: 'NAXT_DAT_PLAN_NUM',
            label: '申请单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'CREATE_MAN',
            label: '申请人',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60
          },
          {
            prop: 'CREATE_TIME',
            label: '申请时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            // prop: 'State',
            label: '状态',
            slot: 'STATE',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70,
            formatter: (row, column, cellValue) => {
              if (cellValue == 0) {
                return '0';
              } else if (cellValue == 1) {
                return '1';
              } else {
                return '';
              }
            }
          },
          {
            prop: 'REMARK',
            label: '备注',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'SURGICAL_ROOM',
            label: '术间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'SURGICAL_PLACE',
            label: '院区',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
          },
          {
            prop: 'SURGICAL_SCHEDULING_ID',
            label: '手术排期ID',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ],
        toolbar: false,
        pageSize: 5,
        pagerCount: 2,
        pageSizes: [5, 10, 20, 50, 100, 9999999],
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
        applyPlanSbz: 0,
        applyPlanXhz: 0,
        applyPlanBl: '0%',
        key: 0,
        RenderTabel: true
      };
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        // this.RenderTabel = !this.RenderTabel;

        this.reload();
        this.RenderTabel = false;
        // 建议加上 nextTick 微任务
        // 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
        this.$nextTick(function () {
          // 加载
          this.RenderTabel = true;
        });
      });
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        let data = GetNaxtDayApplyPlanMain({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      openUserEdit(){
        this.showEdit = true;
        // this.$bus.$emit(`${this.$route.path}/handleUpdate`, this.selection);
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
      },
      onCurrentChange(current) {
        this.current = current;
        // console.log(current);
        this.$emit('getCurrent', current);
      },
    },
    watch: {
      IsReload() {
        if (this.IsReload == true) {
          this.reload(); // 调用刷新表格的方法
        }
      }
    },
    created() {
      // this.getdatasource();
      this.GetConsume();
    },
    // 取消监听bus事件
    destroyed() {
      // 取消对handleCommand事件的监听
      this.$bus.$off('handleCommand');
    }
  };
</script>

<style scoped>
  .ele-body {
    padding: 0px;
  }
</style>
