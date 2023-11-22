<template>
  <div class="ele-body" style="height:75vh">
    <!-- 数据表格 -->
    <ele-pro-table ref="table" height="50vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="ApplyTempDataTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <el-form class="ele-form-search">
          <el-row :gutter="10">
            <el-col :lg="10" :md="12">
              <el-form-item label="">
                <el-input v-model="SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
              </el-form-item>
            </el-col>
            <el-col :lg="14" :md="12">
              <div class="ele-form-actions">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" size="small" @click="dialogTableVisible = true">添加至选定模板</el-button>
                <el-button type="primary" size="small" @click="search">导出目录</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- 搜索表单 -->
        <!-- <ApplyTempDataSearch @search="reload" :ApplyTempTableDataSearch='ApplyTempTableDataSearch' :selection="selection" /> -->

        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
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
// import ApplyTempDataSearch from './ApplyTempDataSearch.vue';
import {
  SerachTempletDeta,
  DeleteTempletDeta,
  SerachAuthVar
} from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'AuthVarTable',
  props: [],
  components: {
    // ApplyTempDataSearch: ApplyTempDataSearch
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
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'DEPT_ZDY_VARIETIE_CODE',
          label: '自定义编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            if (cellValue == null) {
              return '未定义';
            }
            return cellValue;
          }
        },
        {
          prop: 'VarName',
          label: '品种全称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'GG',
          label: '型号/规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Unit',
          label: '单位',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Price',
          label: '结算价',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Manufacturing',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'StockQty',
          label: '散货库存',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TempletQty',
          label: '模板申领数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Day_Consume_Qty',
          label: '平均使用数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BigBoxCount',
          label: '大包装数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'MinBoxCount',
          label: '中包装数量',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PAG_TYPE',
          label: '包装规格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'ZB',
          label: '是否中标',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '否';
            } else if (cellValue == 1) {
              return '是';
            } else {
              return '未知';
            }
          }
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
      data: [],
      SerachName: ''
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      where.SerachName = this.SerachName;
      let data = SerachAuthVar({ page, limit, where, order }).then((res) => {
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
      // console.log(this.ApplyTempTableData);
      // console.log(this.$store.state.user.info);
      this.$refs.table.reload({ page: 1, where: where });
    },
    remove(row) {
      var data = {
        ID: row.ID
      };

      const loading = this.$messageLoading('删除中...');
      DeleteTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message(res.msg);
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message(err);
        });
    },
    onSelectionChange(selection) {
      this.selection = selection;
      // console.log(this.selection);
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ApplyTempTableData;
    }
  },
  watch: {
    ApplyTempTableDataSearch() {
      var where = {
        PlanNum: this.ApplyTempTableData.PlanNum
      };
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
