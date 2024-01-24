<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" @getMsgTip="getMsgTip" @exportData="exportData" :selection="selection" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <!-- <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            新建
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch">
            删除
          </el-button>
          <el-button size="small" icon="el-icon-upload2" class="ele-btn-icon" @click="openImport">
            导入
          </el-button>
        </template> -->

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
    <h3 style="color:blue">{{msgTip}}</h3>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import { SerachDef2Consume4PDA } from '@/api/KSInventory/ScanDefHis';
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
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'Dept_Two_Name',
          label: '二级科室名称',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          align: 'center',
          howOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格/型号',
          align: 'center',
          showOverflowTooltip: true,
          width: 200
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'Dept_Two_Code',
          label: '二级科室编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'Batch',
          label: '批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'Last_Update_Time',
          label: '上架时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: '',
          label: '在库天数',
          align: 'center',
          width: 100,
          showOverflowTooltip: true,
          formatter(row, column, cellValue, index) {
            var bvp_date = row.Last_Update_Time.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            return (
              parseInt(
                ((nowDate - this_date) / (60 * 60 * 24 * 1000)).toFixed(0)
              ) + '天'
            );
          }
        },
        {
          prop: 'Stock_State',
          label: '上架状态',
          width: 120,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == 0) {
              cellValue = '已退货';
            } else if (cellValue == 1) {
              cellValue = '已上架';
            } else if (cellValue == 2) {
              cellValue = '已锁定';
            } else if (cellValue == 3) {
              cellValue = '已出库';
            } else {
              cellValue = '未知';
            }
            return cellValue;
          }
        },
        {
          prop: 'Batch_Validity_Period',
          label: '有效期',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Supply_Price',
          label: '结算价',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Contract_Code',
          label: '合同编码',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Serial_Number',
          label: 'sn码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        }
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
      data: [],
      msgTip:""
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.sourceFrom = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = SerachDef2Consume4PDA({ page, limit, where, order }).then(
        (res) => {
          return res.result;
        }
      );
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
    onSelectionChange(selection) {
      this.selection = selection;
    },
    getMsgTip(data) {
      this.msgTip = data;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.sourceFrom = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        SerachDef2Consume4PDA({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '定数码',
                '二级科室名称',
                '品种编码',
                '品种名称',
                '规格/型号',
                '单位',
                '二级科室编码',
                '系数',
                '批号',
                '上架时间',
                '在库天数',
                '上架状态',
                '有效期',
                '生产日期',
                '结算价',
                '合同编码',
                '供应商名称',
                'sn码'
              ]
            ];
            res.result.forEach((d) => {
              // 在库天数
              var bvp_date = d.Last_Update_Time.substr(0, 10);
              var this_date = new Date(bvp_date).getTime();
              var nowDate = new Date().getTime();
              var InDay =
                parseInt(
                  ((nowDate - this_date) / (60 * 60 * 24 * 1000)).toFixed(0)
                ) + '天';

              //上架状态
              var Stock_State = '';
              if (d.Stock_State == 0) {
                Stock_State = '已退货';
              } else if (d.Stock_State == 1) {
                Stock_State = '已上架';
              } else if (d.Stock_State == 2) {
                Stock_State = '已锁定';
              } else if (d.Stock_State == 3) {
                Stock_State = '已出库';
              } else {
                Stock_State = '未知';
              }
              array.push([
                d.Def_No_Pkg_Code,
                d.Dept_Two_Name,
                d.Varietie_Code_New,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Unit,
                d.Dept_Two_Code,
                d.Coefficient,
                d.Batch,
                d.Last_Update_Time,
                InDay,
                Stock_State,
                d.Batch_Validity_Period,
                d.Batch_Production_Date,
                d.Supply_Price,
                d.Contract_Code,
                d.Supplier_Name,
                d.Serial_Number
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
              '科室定数码消耗.xlsx'
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
