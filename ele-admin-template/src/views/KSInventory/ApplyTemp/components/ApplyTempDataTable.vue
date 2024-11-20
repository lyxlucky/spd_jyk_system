<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <ele-pro-table ref="table" height="60vh" highlight-current-row :stripe="true" :rowClickChecked="true"
      :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource"
      :selection.sync="selection" @selection-change="onSelectionChange" cache-key="ApplyTempDataTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <ApplyTempDataSearch @search="reload" @exportData="exportData"
          :ApplyTempTableDataSearch='ApplyTempTableDataSearch' :selection="selection" @showEditReoad="showEditReoad" />

        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <!-- 操作列 -->
      <template v-slot:TempletQty="{ row }">
        <el-input-number style="width: 120px" v-model="row.TempletQty" :min="0" :max="999999999" :step="1"
          size="mini" />
      </template>
      <template v-slot:AUTH="{ row }">
        <el-input-number style="width: 120px" v-model="row.AUTH" :min="0" :max="999999999" :step="1" size="mini" />
      </template>
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
import ApplyTempDataSearch from './ApplyTempDataSearch.vue';
import { utils, writeFile } from 'xlsx';
import {
  SerachTempletDeta,
  DeleteTempletDeta
} from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTempDataTable',
  props: ['ApplyTempTableData'],
  components: {
    ApplyTempDataSearch: ApplyTempDataSearch
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
          // prop: 'TempletQty',
          slot: 'TempletQty',
          label: '模板申领数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
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
          fixed: 'left'
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        // {
        //   prop: 'DEPT_ZDY_VARIETIE_CODE',
        //   label: '自定义编码',
        //
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 110,
        //   formatter: (row, column, cellValue) => {
        //     if (cellValue == null) {
        //       return '未定义';
        //     }
        //     return cellValue;
        //   }
        // },
        {
          prop: 'VarName',
          label: '品种全称',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 500
        },
        {
          prop: 'GG',
          label: '型号/规格',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Unit',
          label: '单位',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'Price',
          label: '结算价',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'Manufacturing',
          label: '生产企业名称',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'StockQty',
          label: '散货库存',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },

        {
          prop: '月均用量',
          label: '平均使用数量',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'BigBoxCount',
          label: '大包装数量',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'MinBoxCount',
          label: '中包装数量',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          show: false
        },
        {
          prop: 'PAG_TYPE',
          label: '包装规格',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'ZB',
          label: '是否中标',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '否';
            } else if (cellValue == 1) {
              return '是';
            } else {
              return '未知';
            }
          }
        },
        {
          // prop: 'TempletQty',
          slot: 'AUTH',
          label: '排序',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        }
      ],
      toolbar: false,
      pageSize: 50,
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
      where.TempletMasteID = this.ApplyTempTableData.ID;
      let data = SerachTempletDeta({ page, limit, where, order }).then(
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
      this.$emit('selectionData', selection);
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          UserId: this.$store.state.user.info.ID,
          TempletMasteID: this.ApplyTempTableData.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.UserId = this.$store.state.user.info.ID;
        where.TempletMasteID = this.ApplyTempTableData.ID;
        SerachTempletDeta({
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
                '模板申领数量',
                '排序',
                '品种全称',
                '规格/型号',
                '单位',
                '结算价',
                '生产企业名称',
                '供应商',
                '散货库存',
                '平均使用数量',
                '包装规格',
                '是否中标'
              ]
            ];
            res.result.forEach((d) => {
              if (d.ZB == 0) {
                d.ZB = '否';
              } else if (d.ZB == 1) {
                d.ZB = '是';
              } else {
                d.ZB = '未知';
              }
              array.push([
                d.VARIETIE_CODE_NEW,
                d.TempletQty,
                d.AUTH,
                d.VarName,
                d.GG,
                d.Unit,
                d.Price,
                d.Manufacturing,
                d.SUPPLIER_NAME,
                d.StockQty,
                d.Day_Consume_Qty,
                d.PAG_TYPE,
                d.ZB
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
              '科室申领模板品种.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    },
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ApplyTempTableData;
    },
    // pageSize(){
    //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
    // }
  },
  watch: {
    ApplyTempTableDataSearch() {
      var where = {
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        UserId: this.$store.state.user.info.ID,
        TempletMasteID: this.ApplyTempTableData.ID
      };
      this.$refs.table.reload({ page: 1, where: where });
    },
  },
  created() {
    // this.getdatasource();
  },
  
};
</script>
