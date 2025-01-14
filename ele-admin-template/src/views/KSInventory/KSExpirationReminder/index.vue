<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <user-search @search="reload" @exportData="exportData" />
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改
          </el-link>
          <!-- <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button> -->
          <!-- <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm> -->
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <!-- 导入弹窗 -->
    <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import { SearchDefRemind } from '@/api/KSInventory/KSExpirationReminder';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserEdit
    // UserImport
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
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 120,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'Source_Name',
          label: '所属科室',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          // sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          // // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格/型号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          // sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'Supplier_Name',
          label: '供应商',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Batch',
          label: '生产批号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (_row, _column, cellValue) => {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'Batch_Validity_Period',
          label: '有效到期',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (_row, _column, cellValue) => {
            return cellValue.substr(0, 10);
          }
        },
        // {
        //   prop: 'Coefficient',
        //   label: '系数',
        //   align: 'center',
        //   // sortable: 'custom',
        //   width: 100,
        //   showOverflowTooltip: true
        // },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
          // formatter: (_row, _column, cellValue) => {
          //   if (cellValue == 0) {
          //     cellValue = '已退货';
          //   } else if (cellValue == 1) {
          //     cellValue = '已上架';
          //   } else if (cellValue == 2) {
          //     cellValue = '已锁定';
          //   } else if (cellValue == 3) {
          //     cellValue = '已出库';
          //   } else {
          //     cellValue = '';
          //   }
          //   return cellValue;
          // }
        }
        // {
        //   prop: 'Storaged_Days',
        //   label: '在库天数',
        //   width: 220,
        //   align: 'center',
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'Remark',
        //   label: '备注',
        //   width: 220,
        //   align: 'center',
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'USE_DEF_NO_PKG_CODE  ',
        //   label: '库存状态',
        //   width: 220,
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   formatter: (_row, _column, cellValue) => {
        //     if (cellValue == _column.Def_No_Pkg_Code) {
        //       cellValue = '已结算';
        //     } else {
        //       cellValue = '未结算';
        //     }
        //     return cellValue;
        //   }
        // }
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
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
      where.sourceFrom = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = SearchDefRemind({ page, limit, where, order }).then((res) => {
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
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.sourceFrom = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        SearchDefRemind({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '所属科室',
                '品种编码',
                '品种名称',
                '品种名称',
                '规格/型号',
                '单位',
                '供应商',
                '生产批号',
                '生产日期',
                '有效到期',
                '定数码',
                '在库天数',
                '备注',
                '库存状态'
              ]
            ];
            res.result.forEach((d) => {
              var USE_DEF_NO_PKG_CODE = '';
              if (d.USE_DEF_NO_PKG_CODE == d.Def_No_Pkg_Code) {
                USE_DEF_NO_PKG_CODE = '已结算';
              } else {
                USE_DEF_NO_PKG_CODE = '未结算';
              }
              array.push([
                d.Source_Name,
                d.Varietie_Code_New,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Unit,
                d.Supplier_Name,
                d.Batch,
                d.Batch_Production_Date,
                d.Batch_Validity_Period,
                d.Def_No_Pkg_Code,
                d.Storaged_Days,
                d.Remark,
                d.Storaged_Days,
                USE_DEF_NO_PKG_CODE
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '库存近效期提醒.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
