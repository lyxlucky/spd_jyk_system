<template >
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSDeptConsumption">
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
        <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
        </template>

        <!-- 操作列 -->
        <template v-slot:Consumption_Type="{ row }">
          <el-tag :type="['', 'success','danger','warning','info'][row.Consumption_Type]" :disable-transitions="true">
            {{['PDA扫码消耗','His计费消耗','申领消耗','超时默认消耗',''][row.Consumption_Type]}}
          </el-tag>
        </template>

        <template v-slot:Storage_ID="{ row }">
          <el-tag :type="['', 'success'][row.Storage_ID]" :disable-transitions="true">
            {{['院内库区', '院外库区'][row.Storage_ID]}}
          </el-tag>
        </template>

        <template v-slot:HIGH_OR_LOW_CLASS_TWO="{ row }">
          <el-tag :type="['', 'success','info'][row.HIGH_OR_LOW_CLASS_TWO]" :disable-transitions="true">
            {{['重点治理', '非重点治理','未设置'][row.HIGH_OR_LOW_CLASS_TWO]}}
          </el-tag>
          <!-- <el-tag v-if="row.HIGH_OR_LOW_CLASS_TWO==1">重点治理</el-tag>
          <el-tag v-if="row.HIGH_OR_LOW_CLASS_TWO==2" type="info">非重点治理</el-tag>
          <el-tag v-if="row.HIGH_OR_LOW_CLASS_TWO==null" type="warning">未设置</el-tag> -->
        </template>
        <template v-slot:IS_BIDDING="{ row }">
          <el-tag :type="['', 'success'][row.IS_BIDDING]" :disable-transitions="true">
            {{['是', '否'][row.IS_BIDDING]}}
          </el-tag>
          <!-- <el-tag v-if="row.IS_BIDDING==1">是</el-tag>
          <el-tag v-if="row.IS_BIDDING==0" type="info">否</el-tag> -->
        </template>
        <template v-slot:action="{ row }">
          <!-- <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改
          </el-link> -->
          <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button>
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

import {
  pageUsers,
  removeUser,
  removeUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import { SearchDept } from '@/api/KSInventory/KSDeptConsumption';
export default {
  name: 'KSDeptConsumption',
  components: {
    UserSearch,
    UserEdit
    // UserImport
  },
  data() {
    return {
      // 表格列配置
      columns: [
        // {
        //   columnKey: 'selection',
        //   type: 'selection',
        //   width: 45,
        //   align: 'center',
        //   fixed: 'left'
        // },
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
        //   width: 220,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true
        // },
        {
          prop: 'Dept_One_Name',
          label: '一级科室',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        // {
        //   slot: 'Storage_ID',
        //   label: '业务发起库区',
        //   sortable: 'custom',
        //   align: 'center',
        //   howOverflowTooltip: true,
        //   minWidth: 110
        // },
        {
          prop: 'Dept_Two_Name',
          label: '二级科室',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Dept_Name',
          label: '计费科室',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SPD_COST_DEPT_NAME',
          label: '成本科室',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'APPLY_DEPT',
          label: 'His领用科室',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 120
          // formatter: (_row, _column, cellValue) => {
          //   console.log(_row);
          //   console.log(_column);
          //   console.log(cellValue);
          //   return this.$util.toDateString(cellValue);
          // }
        },
        // {
        //   prop: 'SPH_ERP_VARIETIE_CODE',
        //   label: '上药HERP编码',
        //   align: 'center',
        //   sortable: 'custom',
        //   width: 120,
        //   showOverflowTooltip: true
        //   // formatter: (_row, _column, cellValue) => {
        //   //   if (cellValue == 1) {
        //   //     return '已绑定';
        //   //     // return ``
        //   //   } else if (cellValue == 0) {
        //   //     return '未绑定';
        //   //   }
        //   // }
        // },
        {
          prop: 'Consume_Time',
          label: '消耗时间',
          width: 220,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Unit',
          label: '单位',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Supplier_Name',
          label: '供应商',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Batch',
          label: '生产批号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          width: 220,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'Batch_Validity_Period',
          label: '灭菌批号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true,
          formatter: (_row, _column, cellValue) => {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'Goods_Qty',
          label: '消耗数量',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Supply_Price',
          label: '单价',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Cost',
          label: '金额',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Coefficient',
          label: '系数',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'Def_No_Pkg_Code',
          label: '定数码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'Consumption_Type',
          label: '消耗方式',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Operate_Person',
          label: '消耗人',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'High_Or_Low_Class',
          label: '高低值',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'Trade_Type',
          label: '国产/进口',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'PDA_CONSUME_MAN',
          label: 'PDA扫码人(收货结算)',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PDA_CONSUME_TIME',
          label: 'PDA扫码时间(收货结算)',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MEDICAL_CODE',
          label: '医保编码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MONTHLY_TIME',
          label: '月结月份',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        }
      ],
      toolbar: false,
      pageSize: 15,
      pageSizes: [15, 50, 100, 200, 9999999],
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
      var Dept_Two_CodeStr = [];
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr.push(userDeptList[i].Dept_Two_Code);
      }
      where.deptTwoJson = Dept_Two_CodeStr;
      // where.varietie = '';
      // where.supplier = '';
      // where.batch = '';
      // where.deptTwoName = '';
      // where.DEPT_NAME = '';
      // where.manuEntName = '';
      // where.validDateFrom = '';
      // where.validDateTo = '';
      // where.KSConsumePDA_endDate = '';
      // where.KSConsumePDA_startDate = '';
      // where.field = '';
      // where.order = '';
      // where.highOrLow = '';
      // where.trade = '';
      // where.classificName = '';
      // where.consumeType = '';
      // where.specType = '';
      // where.useMonth = false;
      // where.monthFmt = '';
      // where.monthFmt2 = '';
      // where.dayClearingDate = '';
      // where.isPdaScan = '';
      // where.isProtect = '';
      // where.highOrLowClassTwo = '';
      // where.hp = null;
      // where.stzx_state = '1';
      // where.stzx_state_gz = '1';
      // where.def = '';
      // where.Patient_Number = '';
      // where.SPDDEPTNAME = '';
      // where.Operate_Person = '';

      let data = SearchDept({ page, limit, where, order }).then(
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
      // var Dept_Two_CodeStr = [];
      // var userDeptList = this.$store.state.user.info.userDept;
      // for (let i = 0; i < userDeptList.length; i++) {
      //   Dept_Two_CodeStr.push(userDeptList[i].Dept_Two_Code);
      // }
      // where.deptTwoJson = Dept_Two_CodeStr;
      // console.log(where);
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    exportData() {
      const loading = this.$loading({ lock: true });
      this.$refs.table.doRequest(({ where, order }) => {
        var Dept_Two_CodeStr = '';
        var userDeptList = this.$store.state.user.info.userDept;
        for (let i = 0; i < userDeptList.length; i++) {
          Dept_Two_CodeStr =
            Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
        }
        where.DeptCode = Dept_Two_CodeStr;
        SearchDept({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '合同类型',
                '业务发起库区',
                '科室/供应商名称',
                '供应商名称',
                '入库时间',
                '品种(材料)编码',
                '上药HERP编码',
                '品种全称',
                '型号/规格',
                '单位',
                '医保码',
                '品牌',
                '生产批号',
                '生产时间',
                '有效到期',
                '灭菌批号',
                '系数',
                '入库数量',
                '消耗价',
                '采购价',
                '散货数量',
                '入库单号',
                '入库备注',
                '注册证号',
                '高低值分类下级属性',
                '是否中标',
                '操作人'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                ['中标', '临采', '未设置'][d.Contract_Type],
                ['院内库区', '院外库区'][d.Storage_ID],
                d.SUPPLIER_NAME,
                d.From_Supplier_Name,
                d.RECEIVING_TIME,
                d.VARIETIE_CODE_NEW,
                d.SPH_ERP_VARIETIE_CODE,
                d.VARIETIE_NAME,
                d.UNIT,
                d.MANUFACTURING_ENT_NAME,
                d.MEDICAL_CODE,
                d.Brand,
                d.BATCH,
                d.BATCH_PRODUCTION_DATE,
                d.BATCH_VALIDITY_PERIOD,
                d.DISINFECTION_BATCH,
                d.COEFFICIENT,
                d.RECEIVING_QUANTITY,
                d.SUPPLY_PRICE,
                d.PURCHASE_PRICE,
                d.GOODS_QTY,
                d.BUSINESS_BILL,
                d.MARK,
                d.APPROVAL_NUMBER,
                ['重点治理', '非重点治理', '未设置'][d.HIGH_OR_LOW_CLASS_TWO],
                ['是', '否'][d.IS_BIDDING],
                d.Operator
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
          })
          .catch((e) => {
            console.log(1);
            loading.close();
            this.$message.error(e.message);
          });
      });
      // let data = GetDeptInStockDetail({
      //   page: 1,
      //   limit: 999999,
      //   where: where,
      //   order: null
      // }).then((res) => {
      //   this.fullscreenLoading = false;
      //   if (res.code == 200) {
      //     // var tData = {
      //     //   count: res.total,
      //     //   list: res.result
      //     // };
      //     const array = [
      //       [
      //         '合同类型',
      //         '业务发起库区',
      //         '科室/供应商名称',
      //         '供应商名称',
      //         '入库时间',
      //         '品种(材料)编码',
      //         '上药HERP编码',
      //         '品种全称',
      //         '型号/规格',
      //         '单位',
      //         '医保码',
      //         '品牌',
      //         '生产批号',
      //         '生产时间',
      //         '有效到期',
      //         '灭菌批号',
      //         '系数',
      //         '入库数量',
      //         '消耗价',
      //         '采购价',
      //         '散货数量',
      //         '入库单号',
      //         '入库备注',
      //         '注册证号',
      //         '高低值分类下级属性',
      //         '是否中标',
      //         '操作人'
      //       ]
      //     ];
      //     res.result.forEach((d, i) => {
      //       array.push([
      //         d.Contract_Type,
      //         d.Storage_ID,
      //         d.SUPPLIER_NAME,
      //         d.From_Supplier_Name,
      //         d.RECEIVING_TIME,
      //         d.VARIETIE_CODE_NEW,
      //         d.SPH_ERP_VARIETIE_CODE,
      //         d.VARIETIE_NAME,
      //         d.UNIT,
      //         d.MANUFACTURING_ENT_NAME,
      //         d.MEDICAL_CODE,
      //         d.Brand,
      //         d.BATCH,
      //         d.BATCH_PRODUCTION_DATE,
      //         d.BATCH_VALIDITY_PERIOD,
      //         d.DISINFECTION_BATCH,
      //         d.COEFFICIENT,
      //         d.RECEIVING_QUANTITY,
      //         d.SUPPLY_PRICE,
      //         d.PURCHASE_PRICE,
      //         d.GOODS_QTY,
      //         d.BUSINESS_BILL,
      //         d.MARK,
      //         d.APPROVAL_NUMBER,
      //         d.HIGH_OR_LOW_CLASS_TWO,
      //         d.IS_BIDDING,
      //         d.Operator
      //       ]);
      //     });
      //     const sheet = utils.aoa_to_sheet(array);
      //     writeFile(
      //       {
      //         SheetNames: ['Sheet1'],
      //         Sheets: {
      //           Sheet1: sheet
      //         }
      //       },
      //       '科室入库品种.xlsx'
      //     );
      //   }
      // });
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      removeUser(row.userId)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
          this.reload();
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的用户吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          removeUsers(this.selection.map((d) => d.userId))
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
              this.reload();
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 重置用户密码 */
    resetPsw(row) {
      this.$confirm('确定要重置此用户的密码为"123456"吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          updateUserPassword(row.userId)
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({ lock: true });
      updateUserStatus(row.userId, row.status)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
        })
        .catch((e) => {
          loading.close();
          row.status = !row.status ? 1 : 0;
          this.$message.error(e.message);
        });
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
