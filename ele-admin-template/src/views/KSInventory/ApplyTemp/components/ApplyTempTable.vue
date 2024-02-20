<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table highlight-current-row @current-change="onCurrentChange" ref="table" height="55vh" :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="ApplyTempTable">
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <ApplyTempSearch @search="reload" />
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
import ApplyTempSearch from './ApplyTempSearch.vue';
import { SerachTempletList, DeleteTemplet } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTempTable',
  components: {
    ApplyTempSearch
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
          width: 80,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'right'
        },
        {
          prop: 'TempletName',
          label: '模板名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          formatter(row, column, cellValue) {
            if (cellValue == null) {
              return '无';
            } else {
              return cellValue;
            }
          }
        },
        {
          prop: 'TempletCode',
          label: '模板编号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'CommonState',
          label: '常规',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter(row, column, cellValue) {
            if (cellValue == 1) {
              return '√';
            } else {
              return '';
            }
          }
        },
        {
          prop: 'Operater',
          label: '创建人',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'CreateTime',
          label: '模板创建时间',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter(row, column, cellValue) {
            return cellValue.replace('T', ' ');
          }
        },
        {
          prop: 'LastUpDateTime',
          label: '最近更新时间',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
            return cellValue.replace('T', ' ');
          }
        },
        {
          prop: 'USER_ID',
          label: '是否专属',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter(row, column, cellValue) {
            if (cellValue != null && cellValue.length > 0) {
              return '是';
            } else {
              return '否';
            }
          }
        },
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
      pageSize: 10,
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
      where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      where.UserId = this.$store.state.user.info.ID;
      let data = SerachTempletList({ page, limit, where, order }).then(
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

    /* 删除数据 */
    remove(row) {
      // const loading = this.$loading({ lock: true });
      const loading = this.$messageLoading('删除中...');
      DeleteTemplet(row)
        .then((res) => {
          this.$message.success(res.msg);
          loading.close();
          this.reload();
        })
        .catch((err) => {
          loading.close();
           this.$message.error(err);
        });
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
  }
};
</script>
