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
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格/型号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
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
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'INVENTORY_NUM',
          label: '在库天数',
          // // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (row, _column, cellValue) => {
            const createTime = this.$moment(row.CREATE_TIME, "YYYY/MM/DD HH:mm:ss"); // 指定日期格式
            const today = this.$moment(); // 获取当前时间
            return today.diff(createTime, 'days');
          }
        },
        {
          prop:"Remaining_Days",
          label: '剩余天数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (row, _column, cellValue) => {
            const batchValidDate = this.$moment(row.Batch_Validity_Period); // 指定日期格式
            const today = this.$moment(); // 获取当前时间
            return batchValidDate.diff(today, 'days');
          }
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
          prop: 'Unit',
          label: '单位',
          align: 'center',
          // sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
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
    where = data || where;
    where.sourceFrom = this.$store.state.user.info.DeptNow.Dept_Two_Code;
    
    SearchDefRemind({
      page: 1,
      limit: 9999999,
      where: where,
      order: order
    })
      .then((res) => {
        loading.close();
        
        // 获取当前时间用于计算
        const today = this.$moment();
        
        // 表头与表格列对应
        const array = [
          [
            '所属科室',
            '品种编码',
            '品种名称',
            '规格/型号',
            '供应商',
            '生产企业',
            '在库天数',
            '剩余天数',
            '计费编码',
            '单位',
            '生产批号',
            '生产日期',
            '有效到期',
            '定数码'
          ]
        ];
        
        res.result.forEach((d) => {
          // 计算在库天数
          const createTime = this.$moment(d.CREATE_TIME, "YYYY/MM/DD HH:mm:ss");
          const inventoryDays = today.diff(createTime, 'days');
          
          // 计算剩余天数
          const batchValidDate = this.$moment(d.Batch_Validity_Period);
          const remainingDays = batchValidDate.diff(today, 'days');
          
          array.push([
            d.Source_Name || '',
            d.Varietie_Code_New || '',
            d.Varietie_Name || '',
            d.Specification_Or_Type || '',
            d.Supplier_Name || '',
            d.Manufacturing_Ent_Name || '',
            inventoryDays,  // 在库天数（计算值）
            remainingDays,  // 剩余天数（计算值）
            d.CHARGING_CODE || '',
            d.Unit || '',
            d.Batch || '',
            d.Batch_Production_Date ? d.Batch_Production_Date.substr(0, 10) : '', // 格式化日期
            d.Batch_Validity_Period ? d.Batch_Validity_Period.substr(0, 10) : '', // 格式化日期
            d.Def_No_Pkg_Code || ''
          ]);
        });
        
        // 创建工作簿和工作表
        const worksheet = utils.aoa_to_sheet(array);
        
        // 设置列宽
        const colWidths = [
          { wch: 12 }, // 所属科室
          { wch: 15 }, // 品种编码
          { wch: 20 }, // 品种名称
          { wch: 20 }, // 规格/型号
          { wch: 20 }, // 供应商
          { wch: 20 }, // 生产企业
          { wch: 10 }, // 在库天数
          { wch: 10 }, // 剩余天数
          { wch: 15 }, // 计费编码
          { wch: 8 },  // 单位
          { wch: 20 }, // 生产批号
          { wch: 12 }, // 生产日期
          { wch: 12 }, // 有效到期
          { wch: 25 }  // 定数码
        ];
        worksheet['!cols'] = colWidths;
        
        // 设置表头样式
        const range = utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = utils.encode_cell({ r: 0, c: C });
          if (!worksheet[address]) continue;
          worksheet[address].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }
        
        // 创建并导出文件
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "库存近效期提醒");
        
        // 生成文件名（包含当前日期）
        const fileName = `库存近效期提醒_${today.format('YYYYMMDD_HHmmss')}.xlsx`;
        writeFile(workbook, fileName);
        
        this.$message.success(`导出成功，共 ${res.result.length} 条数据`);
      })
      .catch((e) => {
        loading.close();
        this.$message.error(e.message || '导出失败');
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
