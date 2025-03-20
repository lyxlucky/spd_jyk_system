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
import UserSearch from './rightpage-search.vue';
import {
  GetPDAList2,Temporary_supplyRevert
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
        label: '出库类型',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'Contract_Type',
        label: '合同类型',
        align: 'center',
        showOverflowTooltip: true,
        width: 90,
        formatter: function (d) {
            if (d.Contract_Type === "1") {
                return "中标";
            }
            if (d.Contract_Type === "2") {
                return "临采";
            }
            return d.Contract_Type;
        }
    },
    {
        prop: 'Storage_ID',
        label: '业务发起库区',
        align: 'center',
        showOverflowTooltip: true,
        width: 100,
        formatter: function (obj) {
            if (obj.Storage_ID === 1 || obj.Storage_ID === "1") {
                return "院内库区";
            } else if (obj.Storage_ID === 2 || obj.Storage_ID === "2") {
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
        prop: 'From_Supplier_Name',
        label: '供应商名称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'RECEIVING_TIME',
        label: '出库时间',
        align: 'center',
        showOverflowTooltip: true,
        width: 100
    },
    {
        prop: 'VARIETIE_CODE_NEW',
        label: '品种(材料)编码',
        align: 'center',
        showOverflowTooltip: true,
        width: 100
    },
    {
        prop: 'YG_CODE',
        label: '阳光编码',
        align: 'center',
        showOverflowTooltip: true,
        width: 100
    },
    {
        prop: 'SPH_ERP_VARIETIE_CODE',
        label: '上药HERP编码',
        align: 'center',
        showOverflowTooltip: true,
        width: 100
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
        width: 90
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
        width: 90
    },
    {
        prop: 'Brand',
        label: '品牌',
        align: 'center',
        showOverflowTooltip: true,
        width: 55
    },
    {
        prop: 'BATCH',
        label: '生产批号',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'BATCH_PRODUCTION_DATE',
        label: '生产时间',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'BATCH_VALIDITY_PERIOD',
        label: '有效到期',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'DISINFECTION_BATCH',
        label: '灭菌批号',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'COEFFICIENT',
        label: '系数',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'RECEIVING_QUANTITY',
        label: '出库数量',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'SUPPLY_PRICE',
        label: '消耗价',
        align: 'right',
        showOverflowTooltip: true,
        width: 90,
        formatter: function (d) {
            return d.SUPPLY_PRICE.toFixed(d.price_bl);
        }
    },
    {
        prop: 'PURCHASE_PRICE',
        label: '采购价',
        align: 'right',
        showOverflowTooltip: true,
        width: 90,
        formatter: function (d) {
            return parseFloat(d.PURCHASE_PRICE).toFixed(4);
        }
    },
    {
        prop: 'GOODS_QTY',
        label: '散货数量',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'BUSINESS_BILL',
        label: '出库单号',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'MARK',
        label: '出库备注',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'APPROVAL_NUMBER',
        label: '注册证号',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'CHECK_STATE',
        label: 'PDA出库确认',
        align: 'center',
        showOverflowTooltip: true,
        width: 100,
        formatter: function (d) {
            if (d.CHECK_STATE === "1") {
                return "已出单";
            }
            if (d.CHECK_STATE === "2") {
                return "已回单";
            }
            if (d.HIGH_OR_LOW_CLASS_TWO === null) {
                return "未登记";
            }
            return d.CHECK_STATE;
        }
    },
    {
        prop: 'HIGH_OR_LOW_CLASS_TWO',
        label: '高低值分类下级属性',
        align: 'center',
        showOverflowTooltip: true,
        width: 120,
        formatter: function (d) {
            if (d.HIGH_OR_LOW_CLASS_TWO === "1") {
                return "重点治理";
            }
            if (d.HIGH_OR_LOW_CLASS_TWO === "2") {
                return "非重点治理";
            }
            if (d.HIGH_OR_LOW_CLASS_TWO === null) {
                return "未设置";
            }
            return d.HIGH_OR_LOW_CLASS_TWO;
        }
    },
    {
        prop: 'IS_BIDDING',
        label: '是否中标',
        align: 'center',
        showOverflowTooltip: true,
        width: 100,
        formatter: function (d) {
            if (d.IS_BIDDING === "1") {
                return "是";
            }
            if (d.IS_BIDDING === "0") {
                return "否";
            }
            return d.IS_BIDDING;
        }
    },
    {
        prop: 'SOURCE_FROM',
        label: '来源',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: 'IS_JC',
        label: '是否集采',
        align: 'center',
        showOverflowTooltip: true,
        width: 90,
        formatter: function (d) {
            if (d.IS_JC === "1") {
                return "是";
            }
            return "否";
        }
    },
    {
        prop: 'Operator',
        label: '操作人',
        align: 'center',
        showOverflowTooltip: true,
        width: 90
    },
    {
        prop: '检验报告图片',
        label: '检验报告图片',
        align: 'center',
        showOverflowTooltip: true,
        width: 100
    },
    {
        prop: '上传图片',
        label: '上传图片',
        align: 'center',
        showOverflowTooltip: true,
        width: 150
    },
    {
        prop: 'ORDER_NUM',
        label: '上传状态',
        align: 'center',
        showOverflowTooltip: true,
        width: 100,
        formatter: function (d) {
            if (d.ORDER_NUM === "" || d.ORDER_NUM === null) {
                return "未上传";
            } else {
                return "已上传";
            }
        }
    },
    {
        prop: 'ID',
        label: 'ID',
        align: 'center',
        showOverflowTooltip: true,
        width: -2,
        minWidth: -2,
        type: 'space',
        style: 'display: none'
    },
    {
        prop: 'BATCH_ID',
        label: 'BATCH_ID',
        align: 'center',
        showOverflowTooltip: true,
        width: -2,
        minWidth: -2,
        type: 'space',
        style: 'display: none'
    },
    {
        prop: 'VARIETIE_CODE',
        label: 'VARIETIE_CODE',
        align: 'center',
        showOverflowTooltip: true,
        width: -2,
        minWidth: -2,
        type: 'space',
        style: 'display: none'
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
      let data = GetPDAList2({ page, limit, where, order }).then(
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
        GetPDAList2({
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
   
   
  }
};
</script>
