<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <user-search @search="reload" @exportData="exportData" @returnData="returnData"/>
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
import UserSearch from './leftpage-search.vue';
import {
  GetPDAList,Temporary_supplyRevert
} from '@/api/Inventory/Goodsshelves';
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
    prop: 'UP_SHELF_TYPE',
    label: '入库类型',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'Contract_Type',
    label: '合同类型',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      if (row.Contract_Type === "1") {
        return "中标";
      }
      if (row.Contract_Type === "2") {
        return "临采";
      }
      return "";
    }
  },
  {
    prop: 'FUNDS_SOURCE',
    label: '资金来源',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    formatter: function (row) {
      if (row.FUNDS_SOURCE === 1) {
        return "自筹资金";
      } else if (row.FUNDS_SOURCE === 2) {
        return "政府补助";
      } else if (row.FUNDS_SOURCE === 3) {
        return "科教项目";
      } else if (row.FUNDS_SOURCE === 4) {
        return "财政+自筹";
      } else if (row.FUNDS_SOURCE === 5) {
        return "财政转款(发改委)";
      } else if (row.FUNDS_SOURCE === 6) {
        return "财政转款(开办费用)";
      } else {
        return "未设置";
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
      if (row.Receive_Property === 0) {
        return "普通收货";
      } else if (row.Receive_Property === 1) {
        return "盘溢收货";
      } else {
        return "未知类型";
      }
    }
  },
  {
    prop: 'Storage_ID',
    label: '业务发起库区',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    formatter: function (row) {
      if (row.Storage_ID === 1 || row.Storage_ID === "1") {
        return "院内库区";
      } else if (row.Storage_ID === 2 || row.Storage_ID === "2") {
        return "院外库区";
      } else {
        return "-";
      }
    }
  },
  {
    prop: 'SUPPLIER_NAME',
    label: '科室/供应商名称',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100
  },
  {
    prop: 'UP_SHELF_TIME',
    label: '入库时间',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100
  },
  {
    prop: 'VARIETIE_CODE_NEW',
    label: '品种(材料)编码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100
  },
  {
    prop: 'YG_CODE',
    label: '阳光编码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100
  },
  {
    prop: 'SPH_ERP_VARIETIE_CODE',
    label: '上药HERP编码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100
  },
  {
    prop: 'VARIETIE_NAME',
    label: '品种全称',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 200
  },
  {
    prop: 'SPECIFICATION_OR_TYPE',
    label: '型号/规格',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 200
  },
  {
    prop: 'UNIT',
    label: '单位',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'MANUFACTURING_ENT_NAME',
    label: '生产企业名称',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 150
  },
  {
    prop: 'MEDICAL_CODE',
    label: '医保码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'Brand',
    label: '品牌',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 55
  },
  {
    prop: 'BATCH',
    label: '生产批号',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'BATCH_PRODUCTION_DATE',
    label: '生产时间',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'BATCH_VALIDITY_PERIOD',
    label: '有效到期',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'DISINFECTION_BATCH',
    label: '灭菌批号',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'COEFFICIENT',
    label: '系数',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'GOODS_QTY',
    label: '散货数量',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'DEF_NO_PKG_CODE',
    label: '定数码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'UP_SHELF_QUANTITY',
    label: '入库数量',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      if (row.UP_SHELF_TYPE === "退购出库") {
        return row.UP_SHELF_QUANTITY * -1;
      } else {
        return row.UP_SHELF_QUANTITY * 1;
      }
    }
  },
  {
    prop: 'SUPPLY_PRICE',
    label: '入库价格',
    align: 'right',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      return row.SUPPLY_PRICE.toFixed(row.price_bl);
    }
  },
  {
    prop: 'PURCHASE_PRICE',
    label: '采购价',
    align: 'right',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      return parseFloat(row.PURCHASE_PRICE).toFixed(4);
    }
  },
  {
    prop: 'BUSINESS_BILL',
    label: '入库单号',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'HIGH_OR_LOW_CLASS_TWO',
    label: '高低值分类下级属性',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 120,
    formatter: function (row) {
      if (row.HIGH_OR_LOW_CLASS_TWO === "1") {
        return "重点治理";
      }
      if (row.HIGH_OR_LOW_CLASS_TWO === "2") {
        return "非重点治理";
      }
      if (row.HIGH_OR_LOW_CLASS_TWO === null) {
        return "未设置";
      }
      return "";
    }
  },
  {
    prop: 'IS_BIDDING',
    label: '是否中标',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    formatter: function (row) {
      if (row.IS_BIDDING === "1") {
        return "是";
      }
      if (row.IS_BIDDING === "0") {
        return "否";
      }
      return "";
    }
  },
  {
    prop: 'CONTRACT_NAME',
    label: '合同名称',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'CONTRACT_CODE',
    label: '合同编码',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'APPROVAL_NUMBER',
    label: '注册证号',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'Operator',
    label: '操作人',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'BZ',
    label: '备注',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 180,
    formatter: function (row) {
      if (row.BZ === null) {
        return '<div style="text-align:left"><a style="text-align:left" lay-event="GSOURCE_EDIT_lxBZ">编辑</a></div>';
      }
      return '<div style="text-align:left"><a style="text-align:left" lay-event="GSOURCE_EDIT_lxBZ">' + row.BZ + '</a></div>';
    }
  },
  {
    label: '检验报告图片',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    slot: 'Cont_barGoogs'
  },
  {
    label: '查看UDI',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    slot: 'centre_UDI2'
  },
  {
    label: '上传图片',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 200,
    slot: 'Cont_uploadOrderPic'
  },
  {
    prop: 'ORDER_NUM',
    label: '上传状态',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 100,
    formatter: function (row) {
      if ((row.ORDER_NUM === "" || row.ORDER_NUM === null) && (row.Batch_Pic_Full_Name === "" || row.Batch_Pic_Full_Name === null)) {
        return "未上传";
      } else {
        return "已上传";
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
    prop: 'PREPARE_GOODS_PLAN_NUMBER',
    label: '计划单号',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'STOCK_UP_PLAN_GOODS_QUANTITY',
    label: '计划数量',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'APPROVE_TIME',
    label: '计划审批时间',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      if (row.APPROVE_TIME === "0001-01-01T00:00:00" || row.APPROVE_TIME === null) {
        return "";
      } else {
        return row.APPROVE_TIME;
      }
    }
  },
  {
    prop: 'SOURCE_FROM',
    label: '来源',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90
  },
  {
    prop: 'IS_JC',
    label: '是否集采',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: 90,
    formatter: function (row) {
      if (row.IS_JC === "1") {
        return "是";
      }
      return "否";
    }
  },
  {
    prop: 'ID',
    label: '',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: -2,
    hidden: true
  },
  {
    prop: 'BATCH_ID',
    label: '',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: -2,
    hidden: true
  },
  {
    prop: 'VARIETIE_CODE',
    label: '',
    align: 'center',
    showOverflowTooltip: true,
    minWidth: -2,
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
    async returnData(where) {
      // 获取选中行的数据
      const selectedData = this.selection;
      // 判断是否有选中的数据
      if (selectedData.length === 0) {
        this.$message.warning('请选择需要归还的行');
        return;
      }
      try {
        // 显示确认框
        const confirmResult = await this.$confirm(
          '确认要归还吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        
        if (confirmResult) {
          // 显示加载提示
          // const loadingInstance = this.$message.loading({
          //   message: '处理中...',
          //   duration: 0
          // });
          // 调用封装的标记处理方法
          const responseData = await Temporary_supplyRevert(selectedData);

          this.$message.success(responseData);
          // 关闭加载提示
          //loadingInstance.close();
          // 根据响应结果处理
          if (responseData.code == 200) {
            this.$message.success(responseData.msg);
            // 刷新表格
            this.reload(where);
          } else {
            this.$message.error(responseData.msg);
          }
        }
      } catch (error) {
        if (error.message.includes('timeout')) {
         // this.$message.error('请求超时，请检查网络');
        } else {
          //this.$message.error('请求出错，请检查网络');
        }
      }
    
    
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
            // 提取 columns 中的 label 作为表头
            const headers = this.columns
              .filter(column => column.prop)
              .map(column => column.label);
            const array = [headers];
            res.result.forEach((d) => {
              const row = this.columns
                .filter(column => column.prop)
                .map(column => {
                  if (column.formatter) {
                    return column.formatter(d);
                  }
                  return d[column.prop];
                });
              array.push(row);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '暂借记录.xlsx'
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
