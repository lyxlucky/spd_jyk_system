<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" @exportData="exportData" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable"  @row-click="handleRowClick">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
      <UserSearch2 @search="reload2" />
      <ele-pro-table ref="table2" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns2" :datasource="datasource2" :selection.sync="selection" cache-key="KSInventoryBasicDataTable2">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserSearch2 from './components/user-search2.vue';
import { GetPDAList,GetPDAList2 } from '@/api/Inventory/InventoryQueryNewJyk';

export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserSearch2
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
          prop: 'Source_Name',
          label: '库房位置',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'STORAGE_TWO_NAME',
          label: '仓库',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },{
        prop: 'Up_Shelf_State',
        label: '所属区域',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (row) {
            var wzlx = "";
            if (row.VAR_TYPE === "1") {
                wzlx = "-防疫物资";
            }
            if (row.Up_Shelf_State === 1) {
                return '合格区' + wzlx;
            } else if (row.Up_Shelf_State === 6) {
                return '普通隔离区' + wzlx;
            } else if (row.Up_Shelf_State === 11) {
                return '防疫物资区' + wzlx;
            } else if (row.Up_Shelf_State === 7) {
                return '不合格区' + wzlx;
            } else if (row.Up_Shelf_State === 0) {
                return row.Source_Name + wzlx;
            } else if (row.Up_Shelf_State === 8) {
                return '盘损隔离区' + wzlx;
            } else if (row.Up_Shelf_State === 9) {
                return '应急库' + wzlx;
            } else if (row.Up_Shelf_State === 2) {
                return '拣配区' + wzlx;
            } else {
                return '锁定区' + wzlx;
            }
        }
    },
    {
        prop: 'Receive_Property',
        label: '收货类型',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (row) {
            if (row.Receive_Property == 0) {
                return "普通收货";
            } else if (row.Receive_Property == 1) {
                return "盘溢收货";
            } else {
                return "无";
            }
        }
    },
    {
        prop: 'Varietie_Code_New',
        label: '品种编码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Varietie_Name',
        label: '品种全称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 220
    },
    {
        prop: 'Specification_Or_Type',
        label: '型号/规格',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Unit',
        label: '单位',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 60
    },
    {
        prop: 'Goods_Qty',
        label: '库存散货',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'APPROVAL_NUMBER',
        label: '注册证号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 200
    },
    {
        prop: 'PROVINCE_PLATFORM_CODE',
        label: '药交ID',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 70,
    },
    {
        prop: 'YG_CODE',
        label: '阳光产品码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Manufacturing_Ent_Name',
        label: '生产企业名称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Supplier_Name',
        label: '供应商',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Batch',
        label: '生产批号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100
    },
    {
        prop: 'Batch_Production_Date',
        label: '生产日期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (row) {
            return row.Batch_Production_Date.substr(0, 10);
        }
    },
    {
        prop: 'Batch_Validity_Period',
        label: '有效到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (row) {
            var bvp_date = row.Batch_Validity_Period.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (row.Source_Name.search("检验科") !== -1) {
                //  小于15天
                if ((this_date - 1296000000) <= nowDate) {
                    return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_Red'></i>";
                }
                //小于30天2592000000
                if ((this_date - 2592000000) <= nowDate) {
                    return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
                }
            }
            if ((this_date - 1296000000) < nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
            } else {
                return row.Batch_Validity_Period.substr(0, 10);
            }
        }
    },
    {
        prop: 'Coefficient',
        label: '系数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 45
    },
    {
        prop: 'Supply_Price',
        label: '结算价',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 80,
        formatter: function (row) {
            return row.Supply_Price.toFixed(row.price_bl);
        }
    },
    {
        prop: 'Def_Qty',
        label: '库存定数包数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'Def_Qty',
        label: '库存定数包数转散',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (row) {
            return row.Def_Qty * row.Coefficient;
        }
    },
    {
        prop: 'Storaged_Days',
        label: '在库天数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Def_Down_Shelf_Qty',
        label: '定数包未上架',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'Goods_Down_Shelf_Qty',
        label: '散货未上架',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Goods_Look_Qty',
        label: '散货锁定',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Def_Locking_Qty',
        label: '定数包锁定',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Pre_Lock_Sum',
        label: '定数包预锁',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'APPROVAL_NUMBER',
        label: '批准文号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100
    },
    {
        prop: 'MEDICAL_CODE',
        label: '医保码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Position',
        label: '货位号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 70
    },
    {
        prop: 'CONTRACT_NAME',
        label: '合同名称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'CONTRACT_END_TIME',
        label: '合同到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140,
        formatter: function (row) {
            var bvp_date = row.CONTRACT_END_TIME.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (this_date <= nowDate) {
                return '<span style="color:red">' + row.CONTRACT_END_TIME.substr(0, 10) + '</span>';
            } else {
                return row.CONTRACT_END_TIME.substr(0, 10) + "|" + parseInt(((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0)) + "天";
            }
        }
    },
    {
        prop: 'DET_CONTRACT_END',
        label: '合同明细到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140,
        formatter: function (row) {
            var bvp_date = row.DET_CONTRACT_END.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (this_date <= nowDate) {
                return '<span style="color:red">' + row.DET_CONTRACT_END.substr(0, 10) + '</span>';
            } else {
                return row.DET_CONTRACT_END.substr(0, 10) + "|" + parseInt(((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0)) + "天";
            }
        }
    },
    {
        prop: 'INVOICES',
        label: '发票',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
    },
    {
        prop: 'TYPE',
        label: '库别',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100,
        formatter: function (row) {
            if (row.TYPE === "1" || row.TYPE === null) {
                return "普通库";
            }
            if (row.TYPE === "2") {
                return "缓存库";
            }
            return "未知";
        }
    },
    {
        prop: 'NOTE_DESCRIPTION',
        label: '备注',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 55
    },
    {
        prop: 'NO_CONSUME_NUM',
        label: '科室未结算',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 85,
        formatter: function (row) {
            if (row.NO_CONSUME_NUM === null) {
                return 0;
            } else {
                return row.NO_CONSUME_NUM;
            }
        }
    },
    {
        prop: 'AVG7',
        label: '周日均用量',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'AVG30',
        label: '月日均用量',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Batch_Id',
        label: '批次号ID',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 60
    },
    {
        prop: 'MGMT_CAT_NAME',
        label: '管理类别',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'DELIVERY_NOTE_NUMBER',
        label: 'SPD入库单号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'DETAIL_CREATE_TYPE',
        label: '是否跟台',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80,
        formatter: function (row) {
            if (row.DETAIL_CREATE_TYPE === 1) {
                return "是";
            } else {
                return "否";
            }
        }
    },
    {
        prop: 'DELIVERY_TIME',
        label: '入库时间',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Varietie_Code',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        hidden: true
    },
    {
        prop: 'Source_From',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        hidden: true
    },
    {
        prop: 'Batch_Id',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        hidden: true
    },
    {
        prop: 'Up_Shelf_State',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        hidden: true
    },
    {
        prop: 'Storage_Id',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        hidden: true
    }
        
      ],
      columns2: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'Source_Name',
          label: '库房位置',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'Up_Shelf_State',
          label: '所属区域',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70,
          formatter: function (row) {
            if (row.Up_Shelf_State === 1) {
              return '合格区';
            } else if (row.Up_Shelf_State === 6) {
              return '隔离区';
            } else if (row.Up_Shelf_State === 7) {
              return '不合格区';
            } else if (row.Up_Shelf_State === 9) {
              return '应急库';
            } else if (row.Up_Shelf_State === 0) {
              return row.Source_Name;
            } else if (row.Up_Shelf_State === 2) {
              return "锁定";
            } else {
              return row.Up_Shelf_State;
            }
          }
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 240
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 45
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Supplier_Name',
          label: '供应商',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: function (row) {
            return row.Batch_Production_Date.substr(0, 10);
          }
        },
        {
          prop: 'Batch_Validity_Period',
          label: '有效到期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: function (row) {
            var bvp_date = row.Batch_Validity_Period.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (row.Source_Name.search("检验科") !== -1) {
              //  小于15天
              if ((this_date - 1296000000) <= nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_Red'></i>";
              }
              //小于30天2592000000
              if ((this_date - 2592000000) <= nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
              }
            }
            if ((this_date - 1296000000) < nowDate) {
              return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
            } else {
              return row.Batch_Validity_Period.substr(0, 10);
            }
          }
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 45
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          sortable: 'custom'
        },
        {
          prop: 'STOCK_OUT_DISTRIBUTE_NUMBER',
          label: '出库单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          sortable: 'custom'
        },
        {
          prop: 'Position',
          label: '货位号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'Storaged_Days',
          label: '在库天数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          sortable: 'custom'
        },
        {
          prop: 'Brand',
          label: '品牌',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 55
        },
        {
          prop: 'USE_DEF_NO_PKG_CODE',
          label: '是否结算',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: function (row) {
            if (row.USE_DEF_NO_PKG_CODE === row.Def_No_Pkg_Code) {
              return "已结算";
            } else {
              return "未结算";
            }
          }
        },
        {
          prop: 'Storage_Id',
          label: '',
          align: 'center',
          showOverflowTooltip: true,
          hidden: true
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
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    async datasource({ page, limit, where, order }) {
      try {
        const res = await GetPDAList({ page, limit, where, order });
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      } catch (error) {
         this.$message.error('获取表格数据源失败，请稍后重试');
        return { count: 0, list: [] };
      }
    },
    async datasource2({ page, limit, where, order }) {
 
      try {
        // if (this.selectedDeptTwoName) {
     
       where = { ...where, sourceFrom: this.sourceFrom, 
        batchId: this.batchId,
        varietieCode: this.varietieCode,
        batch: this.batch,
        coefficient: this.coefficient,
        currUpShelfState: this.currUpShelfState,
        storageId: this.storageId,
       };
        
        const res = await GetPDAList2({ page, limit, where, order });
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      } catch (error) {
        //console.error('获取表格2数据源失败:', error);
        this.$message.error('获取表格2数据源失败，请稍后重试');
        return { count: 0, list: [] };
      }
    },
    handleRowClick(row) {
      this.sourceFrom= row.Source_From;
      this.batchId = row.Batch_Id;
      this.varietieCode = row.Varietie_Code;
      this.batch = row.Batch;
      this.coefficient = row.Coefficient;
      this.currUpShelfState = row.Up_Shelf_State;
      this.storageId = row.Storage_Id;
      this.reload2();
    
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    reload2(where) {
      this.$refs.table2.reload({ page: 1, where: where });
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
      this.$refs.table.doRequest(async ({ where, order }) => {
        where = data;
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        try {
          const response = await GetPDAList({
            page: 1,
            limit: 999999,
            where: where,
            order: order
          });
          loading.close();
          const headers = [
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
            '仪器备注'
          ];
          const dataArray = [headers];
          response.result.forEach((d) => {
            dataArray.push([
              d.Varietie_Code_New,
              d.Varietie_Code,
              d.Varietie_Name,
              d.Specification_Or_Type,
              d.Manufacturing_Ent_Name,
              d.APPROVAL_NUMBER,
              d.UNIT,
              d.Price,
              d.CLASS_NUM,
              d.CONVERSION_RATIO,
              d.DEVICE_REMARK
            ]);
          });
          writeFile(
            {
              SheetNames: ['Sheet1'],
              Sheets: {
                Sheet1: utils.aoa_to_sheet(dataArray)
              }
            },
            '科室入库品种.xlsx'
          );
          this.$message.success("导出成功");
        } catch (error) {
          loading.close();
          console.error('导出数据失败:', error);
          this.$message.error('导出数据失败，请稍后重试');
        }
      });
    }
  },
  created() {
    
  }
};
</script>    