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
import {
  GetPDAList,
} from '@/api/Inventory/DeptDefHis';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
   
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
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        
  { prop: 'Dept_Two_Name', label: '二级科室名称',  align: 'center', minWidth: 170 },
  { prop: 'Varietie_Code_New', label: '品种编码',  align: 'center', minWidth: 120 },
  { prop: 'Varietie_Name', label: '品种名称', align: 'center',minWidth: 150 },
  { prop: 'Specification_Or_Type', label: '规格型号',  align: 'center',  minWidth: 150 },
  { prop: 'Unit', label: '单位',  align: 'center',  minWidth: 80 },
  { prop: 'Dept_Two_Code', label: '二级科室编码',  align: 'center', minWidth: 120 },
  { prop: 'Coefficient', label: '系数',  align: 'center', minWidth: 60 },
  { prop: 'Batch', label: '批号', align: 'center',  minWidth: 80 },
  { prop: 'Last_Update_Time', label: '上架时间',  align: 'center',  minWidth: 120 },
  { 
    prop: 'Last_Update_Time', 
    label: '在库天数', 
    align: 'center', 
    minWidth: 80,
    formatter: function (row, column) {
      var bvp_date = row.Last_Update_Time.substr(0, 10);
      var this_date = new Date(bvp_date).getTime();
      var nowDate = new Date().getTime();                       
      return parseInt(((nowDate - this_date) / (60 * 60 * 24 * 1000)).toFixed(0)) + "天";
    }
  },
  { 
    prop: 'Stock_State', 
    label: '上架状态', 
    align: 'center', 
    minWidth: 80,
    formatter: function (row, column) {
      if (row.Stock_State == "0")
        return "已退货";
      else if (row.Stock_State == "1")
        return "已上架";
      else if (row.Stock_State == "2")
        return "暂借";
      else if (row.Stock_State == "3")
        return "已出库";
      else
        return "未知";
    }
  },
  { prop: 'Def_No_Pkg_Code', label: '定数码',  align: 'center',  minWidth: 120 },
  { prop: 'Batch_Validity_Period', label: '有效期',  align: 'center',  minWidth: 120 },
  { prop: 'Batch_Production_Date', label: '生产日期',  align: 'center',  minWidth: 120 },
  { prop: 'Supply_Price', label: '结算价',  align: 'center',  minWidth: 80 },
  { prop: 'Contract_Code', label: '合同编码',  align: 'center',  minWidth: 80 },
  { prop: 'Supplier_Name', label: '供应商名称',  align: 'center',  minWidth: 120 },
  { prop: 'Serial_Number', label: 'sn码',  align: 'center',  minWidth: 80 },
  { prop: 'Rfid_Code', label: 'rfid码',  align: 'center',  minWidth: 80 },
  { prop: 'Dept_Two_Up_Shelf_Id', label: '二级定数码上架id', align: 'center',  hidden:true},
  { prop: 'Varietie_Code', label: '品种编码id',  align: 'center', hidden:true},
  { prop: 'Supplier_Code', label: '供应商编码',  align: 'center', hidden:true}

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
      let data = GetPDAList({ page, limit, where, order }).then(
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
    // datasource({ page, limit, where, order }) {
    //     let data = getFinacialTableData({ page, limit, where, order }).then(
    //       (res) => {
    //         var tData = {
    //           count: res.total,
    //           list: res.result
    //         };
    //         return tData;
    //       }
    //     );
    //     return data;
    //   },
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
                '仪器备注',
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
                d.Price ,
                d.CLASS_NUM,
                d.CONVERSION_RATIO,
                d.DEVICE_REMARK,
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
              '科室入库品种.xlsx'
            );
            this.$message.success("导出成功");
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
