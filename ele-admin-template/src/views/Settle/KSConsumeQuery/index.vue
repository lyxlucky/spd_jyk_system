<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" @exportData="exportData" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" height="35vh" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable"  >
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
import { GetPDAList } from '@/api/Settle/KSConsumeQuery';

export default {
  name: 'SystemUser',
  components: {
    UserSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
      {
        prop: 'Dept_One_Name',
        label: '收货一级科室',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Dept_Two_Name',
        label: '收货二级科室',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true
    },
    {
        prop: 'Dept_Name',
        label: '计费科室名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 100
    },
    {
        prop: 'SPD_COST_DEPT_NAME',
        label: 'SPD消耗成本二级科室',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true
    },
    {
        prop: 'DEPT_TWO_NAME_JYK',
        label: '打印科室',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
    },
    {
        prop: 'SPD_COST_DEPT_ONE_NAME',
        label: '微讯通成本科室',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
        formatter: function (d) {
            return d.SPD_COST_DEPT_ONE_NAME + "(" + d.SPD_COST_HERP_DEPT_ONE_CODE + ")";
        }
    },
    {
        prop: 'COST_DEPT_CODE',
        label: '财务成本科室编码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
    },
    {
        prop: 'COST_DEPT_NAME',
        label: '财务成本科室名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
    },
    {
        prop: 'Varietie_Code_New',
        label: '品种编码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'Varietie_Name',
        label: '品种全称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 250
    },
    {
        prop: 'Specification_Or_Type',
        label: '型号/规格',
        align: 'left',
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
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Supplier_Name',
        label: '供应商',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'PROD_REGISTRATION_NAME',
        label: '注册证名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 140
    },
    {
        prop: 'Approval_Number',
        label: '批准文号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 140
    },
    {
        prop: 'Batch',
        label: '生产批号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'Batch_Production_Date',
        label: '生产日期',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true,
        formatter: function (d) {
            return d.Batch_Production_Date.substr(0, 10);
        }
    },
    {
        prop: 'Batch_Validity_Period',
        label: '失效日期',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true,
        formatter: function (d) {
            return d.Batch_Validity_Period.substr(0, 10);
        }
    },
    {
        prop: 'Coefficient',
        label: '系数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 50,
        sortable: true
    },
    {
        prop: 'Def_No_Pkg_Code',
        label: '定数码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
        sortable: true
    },
    {
        prop: 'Supply_Price',
        label: '单价',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
        formatter: function (d) {
            if (d.HIS_CHARGING_PRICE == null) {
                return Number(d.Supply_Price).toFixed(d.price_bl);
            }
            if (Number(d.Supply_Price).toFixed(d.price_bl) != Number(d.HIS_CHARGING_PRICE).toFixed(d.price_bl)) {
                return '<span style="color:red">' + Number(d.Supply_Price).toFixed(d.price_bl) + '</span>';
            } else {
                return Number(d.Supply_Price).toFixed(d.price_bl);
            }
        }
    },
    {
        prop: 'Goods_Qty',
        label: '消耗数量',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 60
    },
    {
        prop: 'Cost',
        label: '金额',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true,
        formatter: function (d) {
            return Number(d.Cost).toFixed(d.price_bl);
        }
    },
    {
        prop: 'PROVINCE_PLATFORM_CODE',
        label: '药交ID',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 60
    },
    {
        prop: 'MEDICAL_CODE',
        label: '医保编码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 180
    },
    {
        prop: 'CLASS_ONE',
        label: '一级目录',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'CLASS_TWO',
        label: '二级目录',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'CLASS_THREE',
        label: '三级目录',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'Consumption_Type',
        label: '消耗方式',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
        formatter: function (d) {
            if (d.Consumption_Type == 0) {
                return 'PDA扫码消耗';
            } else if (d.Consumption_Type == 1) {
                return 'RFID读码消耗';
            } else if (d.Consumption_Type == 2) {
                return 'His计费消耗';
            } else if (d.Consumption_Type == 3) {
                return '散货申领消耗';
            } else if (d.Consumption_Type == 4) {
                return 'HIS医嘱计费消耗';
            } else if (d.Consumption_Type == 5) {
                return '超时默认消耗';
            } else if (d.Consumption_Type == 6) {
                return '读码消耗';
            } else {
                return d.Consumption_Type;
            }
        }
    },
    {
        prop: 'Consume_Time',
        label: '消耗时间',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 140,
        sortable: true
    },
    {
        prop: 'Operate_Person',
        label: '消耗人',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true
    },
    {
        prop: 'Dept_Code',
        label: '计费科室编码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'HIS_CHARGING_PRICE',
        label: 'his计费价格',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (d) {
            if (d.HIS_CHARGING_PRICE == null) {
                return '';
            }
            if (Number(d.Supply_Price).toFixed(d.price_bl) != Number(d.HIS_CHARGING_PRICE).toFixed(d.price_bl)) {
                return '<span style="color:red">' + d.HIS_CHARGING_PRICE + '</span>';
            } else {
                return d.HIS_CHARGING_PRICE;
            }
        }
    },
    {
        prop: 'Hospitalization_Number',
        label: '住院号/病患号/病人姓名',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (d) {
            return d.Hospitalization_Number + "/" + d.Patient_Number + "/" + d.PATIENT_NAME;
        }
    },
    {
        prop: 'Brand',
        label: '品牌',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 55
    },
    {
        prop: 'High_Or_Low_Class',
        label: '高低值',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 60
    },
    {
        prop: 'Trade_Type',
        label: '国产/进口',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70
    },
    {
        prop: 'IS_CHARGE',
        label: '是否计费',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            if (d.IS_CHARGE == 0) {
                return "否";
            } else if (d.IS_CHARGE == 1) {
                return "是";
            }
        }
    },
    {
        prop: 'Day_Clearing_Id',
        label: '是否日清',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            if (d.Day_Clearing_Id == 0) {
                return '未日清';
            } else if (d.Day_Clearing_Id > 0) {
                return '已日清';
            } else {
                return '未知';
            }
        }
    },
    {
        prop: 'Month_Id',
        label: '是否月结',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            if (d.Month_Id == 0) {
                return '未月结';
            } else if (d.Month_Id > 0) {
                return '已月结' + "(" + d.MONTHLY_BALANCE_NUMBER + ")";
            } else {
                return '未知';
            }
        }
    },
    {
        prop: 'MONTHLY_TIME',
        label: '月结月份',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'SEND_WXT_MARK',
        label: '微讯通结算月份',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        sortable: true,
        formatter: function (d) {
            if (d.SEND_WXT_MARK == null || d.SEND_WXT_MARK == undefined) {
                return "";
            }
            return d.SEND_WXT_MARK;
        }
    },
    {
        prop: 'Reverse_State',
        label: '是否允许逆向',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (d) {
            if (d.Reverse_State == 1) {
                return '允许逆向消耗';
            } else {
                return '禁止逆向消耗';
            }
        }
    },
    {
        prop: 'Note_Description',
        label: '收货备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'SUP_BZ',
        label: '供应商备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'CONTRACT_NAME',
        label: '合同名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'Contract_Type',
        label: '合同类型',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 100,
        sortable: true,
        formatter: function (d) {
            if (d.Contract_Type == "1") {
                return "中标";
            } else if (d.Contract_Type == "2") {
                return "临采";
            } else {
                return "未知";
            }
        }
    },
    {
        prop: 'FUNDS_SOURCE',
        label: '资金来源',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 100,
        formatter: function (d) {
            if (d.FUNDS_SOURCE == 1) {
                return "自筹资金";
            } else if (d.FUNDS_SOURCE == 2) {
                return "政府补助";
            } else if (d.FUNDS_SOURCE == 3) {
                return "科教项目";
            } else if (d.FUNDS_SOURCE == 4) {
                return "财政+自筹";
            } else if (d.FUNDS_SOURCE == 5) {
                return "财政转款(发改委)";
            } else if (d.FUNDS_SOURCE == 6) {
                return "财政转款(开办费用)";
            } else {
                return "未设置";
            }
        }
    },
    {
        prop: 'Classific_Name',
        label: '分类属性',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
    },
    {
        prop: 'YB_CLASS',
        label: '医保分类',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 80,
        formatter: function (d) {
            if (d.YB_CLASS == "00") {
                return "甲类";
            } else if (d.YB_CLASS == "01") {
                return "甲类";
            } else if (d.YB_CLASS == "03") {
                return "自费";
            } else {
                return d.YB_CLASS;
            }
        }
    },
    {
        prop: 'PDA_CONSUME_MAN',
        label: '二级库出库人(收货结算)',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
    },
    {
        prop: 'PDA_CONSUME_TIME',
        label: '二级库出库时间(收货结算)',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (d) {
            if (d.PDA_CONSUME_TIME == "0001-01-01T00:00:00") {
                return "";
            } else {
                return d.PDA_CONSUME_TIME;
            }
        }
    },
    {
        prop: 'MONTHBILLNUM',
        label: '发票号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'MEDICAL_CODE',
        label: '医保码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'MEDICAL_CODE27',
        label: '27位医保码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'YG_CODE',
        label: '阳光产品码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'YG_ORDER_ID',
        label: '阳光订单号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'YG_HOSPITAL_ID',
        label: '阳光订单明细',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'CHARGING_CODE',
        label: '计费编码',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'DELIVERY_NOTE_NUMBER',
        label: '入库单号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'STOCK_OUT_DISTRIBUTE_NUMBER',
        label: '出库单号',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (d) {
            if (d.STOCK_OUT_DISTRIBUTE_NUMBER != null) {
                return d.STOCK_OUT_DISTRIBUTE_NUMBER;
            }
            if (d.OPERATE_MAIN_NUMBER != null) {
                return d.OPERATE_MAIN_NUMBER;
            }
            return "";
        }
    },
    {
        prop: 'MARK',
        label: '出库单备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'SOURCE_FROM',
        label: '阳光平台来源',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'IS_JC',
        label: '是否集采',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (d) {
            if (d.IS_JC == "1") {
                return "是";
            } else {
                return "否";
            }
        }
    },
    {
        prop: 'IS_HG',
        label: '是否合格',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'SPQK',
        label: '审批情况',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'CBLG',
        label: '常备/临购',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'JC_TYPE',
        label: '线上线下集采',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        sortable: true
    },
    {
        prop: 'UDI_TOP',
        label: 'UDI',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'Mgmt_Cat_Name',
        label: '管理类别名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'Prod_Big_Class_Name',
        label: '产品大类名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'Regulatory_Cat_Name',
        label: '监管类别名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90
    },
    {
        prop: 'XTLB',
        label: '系统类别',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 250,
    },
    {
        prop: 'XTMC',
        label: '产品系统名称',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 250,
    },
    {
        prop: 'SEND_UDI',
        label: '是否发送UDI',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: function (d) {
            if (d.SEND_UDI == "1") {
                return "是";
            } else {
                return "否";
            }
        }
    },
    {
        prop: 'ORDER_TYPE',
        label: '采购方式',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (d) {
            if (d.ORDER_TYPE == 1) {
                return "线上";
            } else if (d.ORDER_TYPE == 0) {
                return "线下采购";
            } else {
                return "";
            }
        }
    },
    {
        prop: 'BZ',
        label: '备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            return '<button lay-event="table1_KSConsume_bz" style="height:25px;background-color: #009688;color:#fff;padding:0px;border:0px;width:55px;">备注</button>';
        }
    },
    {
        prop: 'BZ_PIC',
        label: '图片',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 90,
      
    },
    {
        prop: 'HISBZ',
        label: '消耗备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            return '<button   lay-event="table_KSConsume_hisbz" style="height:25px;background-color: #009688;color:#fff;padding:0px;border:0px;width:55px;">消耗备注</button>';
        }
    },
    {
        prop: 'HISBZ',
        label: '消耗备注',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 200,
        formatter: function (d) {
            if (d.HISBZ != null) {
                return d.HISBZ;
            } else {
                return "";
            }
        }
    },
    {
        prop: 'Is_Embedded',
        label: '是否植入',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            if (d.Is_Embedded == 0) {
                return "否";
            } else if (d.Is_Embedded == 1) {
                return "是";
            } else {
                return "未维护";
            }
        }
    },
    {
        prop: 'Is_Intervened',
        label: '是否介入',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: function (d) {
            if (d.Is_Intervened == 0) {
                return "否";
            } else if (d.Is_Intervened == 1) {
                return "是";
            } else {
                return "未维护";
            }
        }
    },
    {
        prop: 'Id',
        label: '',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: -2,
        hidden: true
    },
    {
        prop: 'Consumption_Type',
        label: '',
        align: 'left',
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